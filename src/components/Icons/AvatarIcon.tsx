import type { Sex } from '@/types';
import { SEX_VALUES } from '@/constants';
import { UserIcon, UserCircleIcon } from './index';

interface AvatarIconProps {
  sex: Sex;
  className?: string;
}

/**
 * Icon component that displays user avatar based on sex
 */
export const AvatarIcon = ({ sex, className }: AvatarIconProps): JSX.Element => {
  if (sex === SEX_VALUES.MAN) {
    return <UserIcon className={className} />;
  }
  return <UserCircleIcon className={className} />;
};

