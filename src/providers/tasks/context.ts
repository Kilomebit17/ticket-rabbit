import { createContext } from 'react';
import type { ITasksContext } from './types';
import initialState from './state';

/**
 * Tasks context with default values
 * Exported for useTasks hook
 */
export const TasksContext = createContext<ITasksContext>({
  state: initialState(),
  setLoading: () => {},
  setTasks: () => {},
  addTask: () => {},
  updateTask: () => {},
  removeTask: () => {},
  setError: () => {},
  clearError: () => {},
  createTask: async () => {
    throw new Error('TasksProvider not initialized');
  },
  getMyTasks: async () => {
    throw new Error('TasksProvider not initialized');
  },
});

