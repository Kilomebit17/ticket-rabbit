import { ComponentType, PropsWithChildren } from 'react';
import { FamilyContext } from './context';
import { useFamilyService } from './service';

/**
 * FamilyProvider component
 * Provides family context to the application
 */
export const FamilyProvider: ComponentType<PropsWithChildren> = ({
  children,
}) => {
  const service = useFamilyService();

  return (
    <FamilyContext.Provider value={service}>
      {children}
    </FamilyContext.Provider>
  );
};

export { useFamily } from './hooks';

