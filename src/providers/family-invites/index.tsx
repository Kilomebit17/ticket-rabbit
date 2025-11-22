import { ComponentType, PropsWithChildren } from 'react';
import { FamilyInvitesContext } from './context';
import { useFamilyInvitesService } from './service';

/**
 * FamilyInvitesProvider component
 * Provides family invites context to the application
 */
export const FamilyInvitesProvider: ComponentType<PropsWithChildren> = ({
  children,
}) => {
  const service = useFamilyInvitesService();

  return (
    <FamilyInvitesContext.Provider value={service}>
      {children}
    </FamilyInvitesContext.Provider>
  );
};

export { useFamilyInvites } from './hooks';

