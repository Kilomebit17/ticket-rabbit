import { useContext } from 'react';
import { TasksContext } from './context';
import type { ITasksContext } from './types';

/**
 * Hook to use tasks context
 */
export const useTasks = (): ITasksContext => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within TasksProvider');
  }
  return context;
};

