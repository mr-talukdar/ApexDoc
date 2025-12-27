import { Group, GroupJoinPolicy, Membership, MembershipStatus, User, UserRole, UserStatus } from '../types';

/**
 * 🗄️ Data Layer (Facts Only)
 * 
 * Responsibilities:
 * - Store entities
 * - Retrieve facts
 * - Persist decisions
 */

// --- Mock Database State ---

const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Alice Rider', email: 'alice@apex.com', role: UserRole.RIDER, status: UserStatus.ACTIVE },
  { id: 'u2', name: 'Bob Crusher', email: 'bob@apex.com', role: UserRole.RIDER, status: UserStatus.SUSPENDED }, // Suspended user demo
  { id: 'u3', name: 'Admin Sarah', email: 'sarah@apex.com', role: UserRole.ADMIN, status: UserStatus.ACTIVE },
];

const INITIAL_GROUPS: Group[] = [
  { 
    id: 'g1', 
    name: 'Morning Climbers', 
    description: 'Early birds catching the elevation. 5am starts.', 
    isActive: true, 
    policy: GroupJoinPolicy.OPEN,
    imageUrl: 'https://picsum.photos/400/200?random=1'
  },
  { 
    id: 'g2', 
    name: 'Pro Peleton', 
    description: 'High pace training group. Drop policy active.', 
    isActive: true, 
    policy: GroupJoinPolicy.INVITE_ONLY,
    imageUrl: 'https://picsum.photos/400/200?random=2'
  },
  { 
    id: 'g3', 
    name: 'Sunday Cruisers', 
    description: 'Coffee stops mandatory. No drops.', 
    isActive: false, // Inactive group demo
    policy: GroupJoinPolicy.OPEN,
    imageUrl: 'https://picsum.photos/400/200?random=3'
  },
];

const INITIAL_MEMBERSHIPS: Membership[] = [
  { id: 'm1', userId: 'u1', groupId: 'g1', status: MembershipStatus.ACTIVE, joinedAt: new Date().toISOString() }
];

// --- In-Memory Store ---
let users = [...INITIAL_USERS];
let groups = [...INITIAL_GROUPS];
let memberships = [...INITIAL_MEMBERSHIPS];

// --- DB Helpers ---

export const UserRepository = {
  getById: async (id: string): Promise<User | undefined> => {
    // Simulate DB latency
    await new Promise(r => setTimeout(r, 200));
    return users.find(u => u.id === id);
  },
  getAll: async (): Promise<User[]> => {
    return users;
  }
};

export const GroupRepository = {
  getById: async (id: string): Promise<Group | undefined> => {
    await new Promise(r => setTimeout(r, 200));
    return groups.find(g => g.id === id);
  },
  getAll: async (): Promise<Group[]> => {
    return groups;
  }
};

export const MembershipRepository = {
  getByUserAndGroup: async (userId: string, groupId: string): Promise<Membership | undefined> => {
    await new Promise(r => setTimeout(r, 200));
    return memberships.find(m => m.userId === userId && m.groupId === groupId);
  },
  
  getPending: async (): Promise<Membership[]> => {
    await new Promise(r => setTimeout(r, 200));
    return memberships.filter(m => m.status === MembershipStatus.PENDING);
  },

  create: async (userId: string, groupId: string): Promise<Membership> => {
    await new Promise(r => setTimeout(r, 300));
    const newMembership: Membership = {
      id: `m-${Date.now()}`,
      userId,
      groupId,
      status: MembershipStatus.PENDING,
      joinedAt: new Date().toISOString()
    };
    memberships = [...memberships, newMembership];
    return newMembership;
  },

  updateStatus: async (membershipId: string, status: MembershipStatus): Promise<Membership> => {
    await new Promise(r => setTimeout(r, 300));
    const idx = memberships.findIndex(m => m.id === membershipId);
    if (idx === -1) throw new Error("Membership not found");
    
    memberships[idx] = { ...memberships[idx], status };
    memberships = [...memberships]; // Trigger reactivity if this were real React state, but here just local var
    return memberships[idx];
  }
};
