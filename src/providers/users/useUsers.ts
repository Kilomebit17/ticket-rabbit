import { useContext } from 'react';
import type { IUsersContext } from './types';
import { UsersContext } from './context';

/**
 * Hook to use users context
 * @throws Error if used outside UsersProvider
 */
export const useUsers = (): IUsersContext => {
  return useContext(UsersContext);
};

