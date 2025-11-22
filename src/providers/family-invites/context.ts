import { createContext } from 'react';
import type { IFamilyInvitesContext } from './types';
import initialState from './state';

/**
 * Family invites context with default values
 * Exported for useFamilyInvites hook
 */
export const FamilyInvitesContext = createContext<IFamilyInvitesContext>({
  state: initialState(),
  setLoading: () => {},
  setInvites: () => {},
  setError: () => {},
  clearError: () => {},
  sendInvite: async () => {
    throw new Error('FamilyInvitesProvider not initialized');
  },
  getInvites: async () => {
    throw new Error('FamilyInvitesProvider not initialized');
  },
  respondToInvite: async () => {
    throw new Error('FamilyInvitesProvider not initialized');
  },
});

