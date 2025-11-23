import type { FamilyInvite, Family, User } from '@/types';

/**
 * Base reducer action interface
 */
export interface IReducerAction<T = string> {
  type: T;
}

/**
 * Family state interface
 */
export interface IFamilyState {
  invites: FamilyInvite[];
  family: Family | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Family action types enum
 */
export enum EFamilyActionType {
  SET_LOADING = 'SET_LOADING',
  SET_INVITES = 'SET_INVITES',
  SET_FAMILY = 'SET_FAMILY',
  SET_ERROR = 'SET_ERROR',
  CLEAR_ERROR = 'CLEAR_ERROR',
  ADD_INVITE = 'ADD_INVITE',
  REMOVE_INVITE = 'REMOVE_INVITE',
}

/**
 * Family action interfaces
 */
export interface IActionSetLoading
  extends IReducerAction<EFamilyActionType.SET_LOADING> {
  loading: boolean;
}

export interface IActionSetInvites
  extends IReducerAction<EFamilyActionType.SET_INVITES> {
  invites: FamilyInvite[];
}

export interface IActionSetFamily
  extends IReducerAction<EFamilyActionType.SET_FAMILY> {
  family: Family | null;
}

export interface IActionSetError
  extends IReducerAction<EFamilyActionType.SET_ERROR> {
  error: string;
}

export interface IActionClearError
  extends IReducerAction<EFamilyActionType.CLEAR_ERROR> {}

export interface IActionAddInvite
  extends IReducerAction<EFamilyActionType.ADD_INVITE> {
  invite: FamilyInvite;
}

export interface IActionRemoveInvite
  extends IReducerAction<EFamilyActionType.REMOVE_INVITE> {
  inviteId: string;
}

/**
 * Union type for all family actions
 */
export type FamilyActions =
  | IActionSetLoading
  | IActionSetInvites
  | IActionSetFamily
  | IActionSetError
  | IActionClearError
  | IActionAddInvite
  | IActionRemoveInvite;

/**
 * Send invite request
 */
export interface ISendInviteRequest {
  toUserId: string;
}

/**
 * Send invite response
 */
export interface ISendInviteResponse {
  invite: FamilyInvite;
}

/**
 * Backend invite structure (raw from API)
 */
export interface IBackendFamilyInvite {
  id: string;
  fromUserId: User;
  toUserId: User;
  familyId: Family | null;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Get invites response (matches backend structure)
 */
export interface IGetInvitesResponse {
  sent: IBackendFamilyInvite[];
  received: IBackendFamilyInvite[];
}

/**
 * Respond to invite request
 */
export interface IRespondInviteRequest {
  inviteId: string;
  accept: boolean;
}

/**
 * Respond to invite response
 */
export interface IRespondInviteResponse {
  invite: FamilyInvite;
  family?: Family;
}

/**
 * Get family response
 */
export interface IGetFamilyResponse {
  family: Family;
}

/**
 * Family context interface
 */
export interface IFamilyContext {
  state: IFamilyState;
  setLoading: (loading: boolean) => void;
  setInvites: (invites: FamilyInvite[]) => void;
  setFamily: (family: Family | null) => void;
  setError: (error: string) => void;
  clearError: () => void;
  sendInvite: (toUserId: string) => Promise<FamilyInvite>;
  getInvites: () => Promise<FamilyInvite[]>;
  getFamily: (familyId: string) => Promise<Family>;
  respondToInvite: (
    inviteId: string,
    accept: boolean
  ) => Promise<IRespondInviteResponse>;
  clearFamily: () => void;
}

