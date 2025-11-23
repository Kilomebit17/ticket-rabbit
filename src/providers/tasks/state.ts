import type { ITasksState } from './types';

/**
 * Initial state for tasks
 */
const initialState = (): ITasksState => ({
  tasks: [],
  isLoading: false,
  error: null,
});

export default initialState;

