import { ComponentType, PropsWithChildren } from 'react';
import { useUsersService } from './service';
import { UsersContext } from './context';

/**
 * UsersProvider component
 * Provides users context to the application
 */
export const UsersProvider: ComponentType<PropsWithChildren> = ({
  children,
}) => {
  const service = useUsersService();
  return (
    <UsersContext.Provider value={service}>{children}</UsersContext.Provider>
  );
};

// Re-export useUsers hook for convenience
export { useUsers } from './useUsers';

// Re-export state access hooks
export {
  useSearchResults,
  useUsersLoading,
  useUsersError,
} from './hooks';

