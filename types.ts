// Shared types across the application layers

// --- Domain Entities ---

export enum UserRole {
  RIDER = 'RIDER',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export enum GroupJoinPolicy {
  OPEN = 'OPEN',
  INVITE_ONLY = 'INVITE_ONLY'
}

export interface Group {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  policy: GroupJoinPolicy;
  imageUrl: string;
}

export enum MembershipStatus {
  NONE = 'NONE', // Virtual state for non-members
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED'
}

export interface Membership {
  id: string;
  userId: string;
  groupId: string;
  status: MembershipStatus;
  joinedAt?: string;
}

// --- Decision Model ---

export interface Decision {
  allowed: boolean;
  reason?: string;
}

// --- System Logs for Demo ---

export interface SystemLogEntry {
  id: string;
  timestamp: number;
  layer: 'CLIENT' | 'API' | 'DOMAIN' | 'DATA';
  action: string;
  details: any;
  status?: 'success' | 'error' | 'info';
}
