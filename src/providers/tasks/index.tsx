import { ComponentType, PropsWithChildren } from 'react';
import { TasksContext } from './context';
import { useTasksService } from './service';

/**
 * TasksProvider component
 * Provides tasks context to the application
 */
export const TasksProvider: ComponentType<PropsWithChildren> = ({
  children,
}) => {
  const service = useTasksService();

  return (
    <TasksContext.Provider value={service}>
      {children}
    </TasksContext.Provider>
  );
};

export { useTasks } from './hooks';

