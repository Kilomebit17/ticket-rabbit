import type { FamilyInvite, Family } from '@/types';

/**
 * Base reducer action interface
 */
export interface IReducerAction<T = string> {
  type: T;
}

/**
 * Family invites state interface
 */
export interface IFamilyInvitesState {
  invites: FamilyInvite[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Family invites action types enum
 */
export enum EFamilyInvitesActionType {
  SET_LOADING = 'SET_LOADING',
  SET_INVITES = 'SET_INVITES',
  SET_ERROR = 'SET_ERROR',
  CLEAR_ERROR = 'CLEAR_ERROR',
  ADD_INVITE = 'ADD_INVITE',
  REMOVE_INVITE = 'REMOVE_INVITE',
}

/**
 * Family invites action interfaces
 */
export interface IActionSetLoading
  extends IReducerAction<EFamilyInvitesActionType.SET_LOADING> {
  loading: boolean;
}

export interface IActionSetInvites
  extends IReducerAction<EFamilyInvitesActionType.SET_INVITES> {
  invites: FamilyInvite[];
}

export interface IActionSetError
  extends IReducerAction<EFamilyInvitesActionType.SET_ERROR> {
  error: string;
}

export interface IActionClearError
  extends IReducerAction<EFamilyInvitesActionType.CLEAR_ERROR> {}

export interface IActionAddInvite
  extends IReducerAction<EFamilyInvitesActionType.ADD_INVITE> {
  invite: FamilyInvite;
}

export interface IActionRemoveInvite
  extends IReducerAction<EFamilyInvitesActionType.REMOVE_INVITE> {
  inviteId: string;
}

/**
 * Union type for all family invites actions
 */
export type FamilyInvitesActions =
  | IActionSetLoading
  | IActionSetInvites
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
 * Get invites response
 */
export interface IGetInvitesResponse {
  invites: FamilyInvite[];
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
 * Family invites context interface
 */
export interface IFamilyInvitesContext {
  state: IFamilyInvitesState;
  setLoading: (loading: boolean) => void;
  setInvites: (invites: FamilyInvite[]) => void;
  setError: (error: string) => void;
  clearError: () => void;
  sendInvite: (toUserId: string) => Promise<FamilyInvite>;
  getInvites: () => Promise<FamilyInvite[]>;
  respondToInvite: (
    inviteId: string,
    accept: boolean
  ) => Promise<IRespondInviteResponse>;
}

