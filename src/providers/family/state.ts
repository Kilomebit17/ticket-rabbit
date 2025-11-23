import type { IFamilyState } from './types';

/**
 * Initial state for family
 */
const initialState = (): IFamilyState => ({
  invites: [],
  family: null,
  isLoading: true,
  error: null,
});

export default initialState;

