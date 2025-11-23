import { createContext } from 'react';
import type { IFamilyContext } from './types';
import initialState from './state';

/**
 * Family context with default values
 * Exported for useFamily hook
 */
export const FamilyContext = createContext<IFamilyContext>({
  state: initialState(),
  setLoading: () => {},
  setInvites: () => {},
  setFamily: () => {},
  setError: () => {},
  clearError: () => {},
  sendInvite: async () => {
    throw new Error('FamilyProvider not initialized');
  },
  getInvites: async () => {
    throw new Error('FamilyProvider not initialized');
  },
  getFamily: async () => {
    throw new Error('FamilyProvider not initialized');
  },
  respondToInvite: async () => {
    throw new Error('FamilyProvider not initialized');
  },
  clearFamily: () => {},
});

