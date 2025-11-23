export type Sex = 'man' | 'woman';

export type TaskStatus = 'Created' | 'Pending' | 'Approved';

export interface User {
  id: string;
  name: string;
  sex: Sex;
  balance: number;
  familyId: string;
  photoUrl?: string;
}

export interface Family {
  id: string;
  members: string[]; // user IDs
  createdAt: number;
}

export interface Task {
  id: string;
  familyId: string;
  creatorId: string;
  solverId?: string;
  name: string;
  price: number; // in tickets
  status: TaskStatus;
  createdAt: number;
  solvedAt?: number;
  approvedAt?: number;
}

export interface FamilyRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: number;
}

export interface FamilyInvite {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser?: User;
  toUser?: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: number;
}

