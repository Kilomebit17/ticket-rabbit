import type { IUsersState } from './types';

/**
 * Initial users state factory function
 */
const initialState = (): IUsersState => ({
  searchResults: [],
  isLoading: false,
  error: null,
});

export default initialState;

