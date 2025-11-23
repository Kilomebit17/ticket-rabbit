import type { IAuthState } from './types';

/**
 * Initial auth state factory function
 */
const initialState = (): IAuthState => ({
  user: null,
  isLoading: true,
  error: null,
});

export default initialState;

