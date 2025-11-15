import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/utils/storage';
import { User } from '@/types';
import styles from './Userboard.module.scss';

const Userboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const currentUser = storage.getCurrentUser();

  useEffect(() => {
    // Initialize fake users if they don't exist
    const existingUsers = storage.getUsers();
    
    if (existingUsers.length <= 1) {
      // Create fake users
      const fakeUsers: User[] = [
        {
          id: 'fake-1',
          name: 'Alice Johnson',
          sex: 'woman',
          balance: 15,
        },
        {
          id: 'fake-2',
          name: 'Bob Smith',
          sex: 'man',
          balance: 8,
        },
        {
          id: 'fake-3',
          name: 'Emma Davis',
          sex: 'woman',
          balance: 22,
        },
        {
          id: 'fake-4',
          name: 'Charlie Brown',
          sex: 'man',
          balance: 5,
        },
        {
          id: 'fake-5',
          name: 'Sophia Wilson',
          sex: 'woman',
          balance: 30,
        },
      ];

      // Add fake users if they don't exist
      fakeUsers.forEach(fakeUser => {
        if (!existingUsers.find(u => u.id === fakeUser.id)) {
          existingUsers.push(fakeUser);
        }
      });

      storage.saveUsers(existingUsers);
    }

    // Get all users except current user
    const allUsers = storage.getUsers().filter(u => u.id !== currentUser?.id);
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
          <p>No users found</p>
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
                <span className={styles.emoji}>{user.sex === 'man' ? '👨' : '👩'}</span>
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

