import * as Domain from '../domain/rules';
import { UserRepository, GroupRepository, MembershipRepository } from '../data/repository';
import { Decision, MembershipStatus, SystemLogEntry } from '../types';

/**
 * 🔌 API Layer (Orchestrator)
 * 
 * Responsibilities:
 * - Authenticate the request (simulated via userId arg)
 * - Fetch required facts from DB
 * - Map DB -> Domain types
 * - Ask the domain for a decision
 * - Execute the result
 * - Return outcome
 */

type LogCallback = (entry: Omit<SystemLogEntry, 'id' | 'timestamp'>) => void;

export class ApexApiService {
  private log: LogCallback;

  constructor(logCallback: LogCallback) {
    this.log = logCallback;
  }

  // --- Example Flow: Join Group ---
  async joinGroup(userId: string, groupId: string): Promise<Decision> {
    this.log({ layer: 'API', action: 'Join Group Request', details: { userId, groupId }, status: 'info' });

    // 1. Fetch required facts (Data Layer)
    this.log({ layer: 'DATA', action: 'Fetch User & Group', details: 'Fetching entities...', status: 'info' });
    const user = await UserRepository.getById(userId);
    const group = await GroupRepository.getById(groupId);
    const existingMembership = await MembershipRepository.getByUserAndGroup(userId, groupId);

    if (!user || !group) {
      this.log({ layer: 'API', action: 'Entity Not Found', details: 'User or Group missing', status: 'error' });
      return { allowed: false, reason: 'Entity not found' };
    }

    // 2. Map to Domain objects (Simple here as types align, but conceptually distinct)
    const currentStatus = existingMembership ? existingMembership.status : MembershipStatus.NONE;

    // 3. Ask the domain for a decision
    this.log({ 
      layer: 'DOMAIN', 
      action: 'Evaluate Rule: canJoinGroup', 
      details: { userStatus: user.status, groupActive: group.isActive, currentMembership: currentStatus },
      status: 'info' 
    });
    
    const decision = Domain.canJoinGroup(user, group, currentStatus);

    if (!decision.allowed) {
      this.log({ layer: 'DOMAIN', action: 'Decision: DENIED', details: decision.reason, status: 'error' });
      return decision;
    }

    this.log({ layer: 'DOMAIN', action: 'Decision: ALLOWED', details: 'Proceeding to write...', status: 'success' });

    // 4. Execute the result (Data Layer)
    this.log({ layer: 'DATA', action: 'Create Membership', details: { status: 'PENDING' }, status: 'info' });
    await MembershipRepository.create(userId, groupId);

    this.log({ layer: 'API', action: 'Request Complete', details: 'Success', status: 'success' });
    return decision;
  }

  // --- Example Flow: Resolve Membership ---
  async resolveMembership(adminId: string, membershipId: string, action: 'APPROVE' | 'REJECT'): Promise<Decision> {
    this.log({ layer: 'API', action: 'Resolve Membership', details: { adminId, membershipId, action }, status: 'info' });

    // 1. Fetch facts
    this.log({ layer: 'DATA', action: 'Fetch Data', details: 'Fetching Admin & Membership...', status: 'info' });
    const admin = await UserRepository.getById(adminId);
    const membership = (await MembershipRepository.getPending()).find(m => m.id === membershipId); // Inefficient real-world query, but okay for mock

    if (!admin || !membership) {
       this.log({ layer: 'API', action: 'Error', details: 'Admin or Membership not found', status: 'error' });
       return { allowed: false, reason: 'Data not found' };
    }

    // 2. Domain Decision
    this.log({ layer: 'DOMAIN', action: 'Evaluate Rule: canResolveMembership', details: { adminRole: admin.role, membershipStatus: membership.status }, status: 'info' });
    const decision = Domain.canResolveMembership(admin, membership);

    if (!decision.allowed) {
      this.log({ layer: 'DOMAIN', action: 'Decision: DENIED', details: decision.reason, status: 'error' });
      return decision;
    }

    this.log({ layer: 'DOMAIN', action: 'Decision: ALLOWED', details: 'Proceeding with state transition', status: 'success' });

    // 3. Calculate New State (Domain)
    const newState = Domain.determineNewMembershipState(action);
    this.log({ layer: 'DOMAIN', action: 'State Transition', details: `New State: ${newState}`, status: 'info' });

    // 4. Update DB
    this.log({ layer: 'DATA', action: 'Update Membership', details: { id: membershipId, newState }, status: 'info' });
    await MembershipRepository.updateStatus(membershipId, newState);

    this.log({ layer: 'API', action: 'Resolution Complete', details: 'Success', status: 'success' });
    return { allowed: true };
  }
}
