import type {
  IFamilyState,
  FamilyActions,
} from './types';
import { EFamilyActionType } from './types';
import initialState from './state';

/**
 * Family reducer
 */
export const reducer = (
  state: IFamilyState = initialState(),
  action: FamilyActions
): IFamilyState => {
  switch (action.type) {
    case EFamilyActionType.SET_LOADING:
      return {
        ...state,
        isLoading: action.loading,
      };

    case EFamilyActionType.SET_INVITES:
      return {
        ...state,
        invites: action.invites,
      };

    case EFamilyActionType.SET_FAMILY:
      return {
        ...state,
        family: action.family,
      };

    case EFamilyActionType.SET_ERROR:
      return {
        ...state,
        error: action.error,
      };

    case EFamilyActionType.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case EFamilyActionType.ADD_INVITE:
      return {
        ...state,
        invites: [...state.invites, action.invite],
      };

    case EFamilyActionType.REMOVE_INVITE:
      return {
        ...state,
        invites: state.invites.filter(
          (invite) => invite.id !== action.inviteId
        ),
      };

    default:
      return state;
  }
};

