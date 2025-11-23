import { useContext } from 'react';
import { FamilyContext } from './context';
import type { IFamilyContext } from './types';

/**
 * Hook to use family context
 */
export const useFamily = (): IFamilyContext => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within FamilyProvider');
  }
  return context;
};

