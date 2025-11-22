import { useContext } from 'react';
import { FamilyInvitesContext } from './context';
import type { IFamilyInvitesContext } from './types';

/**
 * Hook to use family invites context
 */
export const useFamilyInvites = (): IFamilyInvitesContext => {
  const context = useContext(FamilyInvitesContext);
  if (!context) {
    throw new Error('useFamilyInvites must be used within FamilyInvitesProvider');
  }
  return context;
};

