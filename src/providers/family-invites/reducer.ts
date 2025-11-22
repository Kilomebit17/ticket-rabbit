import type {
  IFamilyInvitesState,
  FamilyInvitesActions,
} from './types';
import { EFamilyInvitesActionType } from './types';
import initialState from './state';

/**
 * Family invites reducer
 */
export const reducer = (
  state: IFamilyInvitesState = initialState(),
  action: FamilyInvitesActions
): IFamilyInvitesState => {
  switch (action.type) {
    case EFamilyInvitesActionType.SET_LOADING:
      return {
        ...state,
        isLoading: action.loading,
      };

    case EFamilyInvitesActionType.SET_INVITES:
      return {
        ...state,
        invites: action.invites,
      };

    case EFamilyInvitesActionType.SET_ERROR:
      return {
        ...state,
        error: action.error,
      };

    case EFamilyInvitesActionType.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case EFamilyInvitesActionType.ADD_INVITE:
      return {
        ...state,
        invites: [...state.invites, action.invite],
      };

    case EFamilyInvitesActionType.REMOVE_INVITE:
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

