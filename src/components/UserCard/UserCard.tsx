import type { User } from '@/types';
import { AvatarIcon } from '@/components/Icons/AvatarIcon';
import styles from './UserCard.module.scss';

interface UserCardProps {
  user: User;
  label?: string;
  actions?: React.ReactNode;
  className?: string;
}

const UserCard = ({ user, label, actions, className }: UserCardProps): JSX.Element => {
  return (
    <div className={`${styles.userCard} ${className || ''}`}>
      <div className={styles.userInfo}>
        <div className={styles.userAvatar}>
          {user.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user.name || 'User'}
              className={styles.avatarImage}
            />
          ) : (
            <span className={styles.avatarIcon}>
              <AvatarIcon sex={user.sex} />
            </span>
          )}
        </div>
        <div className={styles.userDetails}>
          {label && (
            <span className={styles.userLabel}>{label}</span>
          )}
          <span className={styles.userName}>{user.name || 'Unknown User'}</span>
        </div>
      </div>
      {actions && (
        <div className={styles.userActions}>
          {actions}
        </div>
      )}
    </div>
  );
};

export default UserCard;

