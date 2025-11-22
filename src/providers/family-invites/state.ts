import type { IFamilyInvitesState } from './types';

/**
 * Initial state for family invites
 */
const initialState = (): IFamilyInvitesState => ({
  invites: [],
  isLoading: false,
  error: null,
});

export default initialState;

