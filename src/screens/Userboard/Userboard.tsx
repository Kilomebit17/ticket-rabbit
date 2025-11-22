import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types';
import { useCurrentUser } from '@/providers/auth';
import { SEX_VALUES, SEX_EMOJIS } from '@/constants';
import styles from './Userboard.module.scss';

const Userboard = (): JSX.Element => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // TEMP: Replace with API call to fetch users from backend
    const allUsers: User[] = []; // storage.getUsers().filter(u => u.id !== currentUser?.id);
    setUsers(allUsers);
  }, [currentUser]);

  const handleUserClick = (userId: string) => {
    navigate(`/friend/${userId}`);
  };

  return (
    <div className={styles.userboard}>
      <h2 className={styles.title}>Userboard</h2>
      <p className={styles.subtitle}>Browse users and view their profiles</p>

      {users.length === 0 ? (
        <div className={styles.noUsers}>
          <p className={styles.noUsersText}>No users found</p>
        </div>
      ) : (
        <div className={styles.usersList}>
          {users.map(user => (
            <div
              key={user.id}
              className={styles.userCard}
              onClick={() => handleUserClick(user.id)}
            >
              <div className={styles.userAvatar}>
                <span className={styles.emoji}>{user.sex === SEX_VALUES.MAN ? SEX_EMOJIS.MAN : SEX_EMOJIS.WOMAN}</span>
              </div>
              <div className={styles.userInfo}>
                <h3 className={styles.userName}>{user.name}</h3>
                <div className={styles.userDetails}>
                  <span className={styles.sex}>{user.sex}</span>
                  <span className={styles.balance}>
                    <span className={styles.ticketIcon}>🎫</span>
                    {user.balance}
                  </span>
                </div>
              </div>
              <div className={styles.arrow}>→</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Userboard;

