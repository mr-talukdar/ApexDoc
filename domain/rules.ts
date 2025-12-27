import { Decision, Group, Membership, MembershipStatus, User, UserRole, UserStatus } from '../types';

/**
 * 🧠 Domain Layer (The Brain)
 * 
 * Responsibilities:
 * - Defines what is allowed
 * - Encodes business rules
 * - Enforces state transitions
 * - Has zero knowledge of DB or UI
 */

// Core Rule: isValidApexUser
export const isValidApexUser = (user: User): Decision => {
  if (user.status !== UserStatus.ACTIVE) {
    return { allowed: false, reason: `User ${user.name} is suspended and cannot perform actions.` };
  }
  return { allowed: true };
};

// Core Rule: canJoinGroup
export const canJoinGroup = (user: User, group: Group, currentMembership: MembershipStatus): Decision => {
  // 1. User must be valid
  const userCheck = isValidApexUser(user);
  if (!userCheck.allowed) return userCheck;

  // 2. Group must be active
  if (!group.isActive) {
    return { allowed: false, reason: "This group is currently inactive." };
  }

  // 3. Check existing membership state
  if (currentMembership === MembershipStatus.ACTIVE) {
    return { allowed: false, reason: "You are already a member of this group." };
  }
  if (currentMembership === MembershipStatus.PENDING) {
    return { allowed: false, reason: "You already have a pending request." };
  }
  if (currentMembership === MembershipStatus.REJECTED) {
    return { allowed: false, reason: "Your previous request was rejected. Contact support." };
  }

  // 4. Check Policy (Example extension)
  if (group.policy === 'INVITE_ONLY') {
    // In a real app, we might check for an invite code here.
    // For this demo, we'll allow requesting access even for invite only, 
    // but the domain rule could restrict it.
  }

  return { allowed: true };
};

// Core Rule: canResolveMembership
export const canResolveMembership = (actor: User, targetMembership: Membership): Decision => {
  // 1. Actor must be valid
  const actorCheck = isValidApexUser(actor);
  if (!actorCheck.allowed) return actorCheck;

  // 2. Actor must be an Admin (Simple governance rule for this demo)
  if (actor.role !== UserRole.ADMIN) {
    return { allowed: false, reason: "Only administrators can resolve memberships." };
  }

  // 3. Membership must be PENDING
  if (targetMembership.status !== MembershipStatus.PENDING) {
    return { allowed: false, reason: `Cannot resolve membership that is ${targetMembership.status}.` };
  }

  return { allowed: true };
};

// Core Rule: resolveMembership (State Transition)
export const determineNewMembershipState = (action: 'APPROVE' | 'REJECT'): MembershipStatus => {
  return action === 'APPROVE' ? MembershipStatus.ACTIVE : MembershipStatus.REJECTED;
};
