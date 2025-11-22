import { ComponentType, PropsWithChildren } from 'react';
import { useAuthService } from './service';
import { AuthContext } from './context';

/**
 * AuthProvider component
 * Provides authentication context to the application
 */
export const AuthProvider: ComponentType<PropsWithChildren> = ({
  children,
}) => {
  const service = useAuthService();
  return (
    <AuthContext.Provider value={service}>{children}</AuthContext.Provider>
  );
};

// Re-export useAuth hook for convenience
export { useAuth } from './useAuth';

// Re-export state access hooks
export {
  useCurrentUser,
  useAuthLoading,
  useAuthError,
  useAuthBalance,
  useIsAuthenticated,
} from './hooks';

