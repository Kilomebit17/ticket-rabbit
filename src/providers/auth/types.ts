import type { User, Sex } from '@/types';

/**
 * Base reducer action interface
 */
export interface IReducerAction<T = string> {
  type: T;
}

/**
 * Auth state interface
 */
export interface IAuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Auth action types enum
 */
export enum EAuthActionType {
  SET_LOADING = 'SET_LOADING',
  SET_USER = 'SET_USER',
  SET_ERROR = 'SET_ERROR',
  CLEAR_ERROR = 'CLEAR_ERROR',
  LOGOUT = 'LOGOUT',
}

/**
 * Auth action interfaces
 */
export interface IActionSetLoading
  extends IReducerAction<EAuthActionType.SET_LOADING> {
  loading: boolean;
}

export interface IActionSetUser
  extends IReducerAction<EAuthActionType.SET_USER> {
  user: User | null;
}

export interface IActionSetError
  extends IReducerAction<EAuthActionType.SET_ERROR> {
  error: string;
}

export interface IActionClearError
  extends IReducerAction<EAuthActionType.CLEAR_ERROR> {}

export interface IActionLogout
  extends IReducerAction<EAuthActionType.LOGOUT> {}

/**
 * Union type for all auth actions
 */
export type AuthActions =
  | IActionSetLoading
  | IActionSetUser
  | IActionSetError
  | IActionClearError
  | IActionLogout;

/**
 * Create user request payload
 */
export interface ICreateUserRequest {
  name: string;
  sex: Sex;
}

/**
 * Create user response
 */
export interface ICreateUserResponse {
  user: User;
}

/**
 * Get user response
 */
export interface IGetUserResponse {
  user: User;
}

/**
 * Auth context interface
 */
export interface IAuthContext {
  state: IAuthState;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  setError: (error: string) => void;
  clearError: () => void;
  logout: () => void;
  getUserInfo: () => Promise<void>;
  createUser: (data: ICreateUserRequest) => Promise<User>;
}

