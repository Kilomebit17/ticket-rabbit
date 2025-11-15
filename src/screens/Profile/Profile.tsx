import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/utils/storage';
import { User, Family } from '@/types';
import { formatDate } from '@/utils/helpers';
import styles from './Profile.module.scss';

const Profile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [familyMember, setFamilyMember] = useState<User | null>(null);

  useEffect(() => {
    const user = storage.getCurrentUser();
    setCurrentUser(user);

    if (user) {
      const userFamily = storage.getFamilyByUserId(user.id);
      setFamily(userFamily || null);

      if (userFamily) {
        const otherMemberId = userFamily.members.find(id => id !== user.id);
        if (otherMemberId) {
          const member = storage.getUserById(otherMemberId);
          setFamilyMember(member);
        }
      }
    }
  }, []);

  const handleSwitchToFakeUser = (userId: string) => {
    const fakeUser = storage.getUserById(userId);
    if (fakeUser) {
      storage.setCurrentUser(fakeUser);
      setCurrentUser(fakeUser);
      navigate('/');
      window.location.reload(); // Reload to refresh all components
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.profile}>
      <h2 className={styles.title}>Profile</h2>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Personal Information</h3>
        <div className={styles.infoCard}>
          <div className={styles.avatar}>
            <span className={styles.emoji}>{currentUser.sex === 'man' ? '👨' : '👩'}</span>
          </div>
          <div className={styles.info}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Name:</span>
              <span className={styles.value}>{currentUser.name}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Sex:</span>
              <span className={styles.value}>{currentUser.sex}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Balance:</span>
              <span className={styles.balance}>
                <span className={styles.ticketIcon}>🎫</span>
                {currentUser.balance}
              </span>
            </div>
          </div>
        </div>
      </div>

      {family && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Family Details</h3>
          <div className={styles.familyCard}>
            <div className={styles.familyInfo}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Family ID:</span>
                <span className={styles.value}>{family.id}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Created:</span>
                <span className={styles.value}>{formatDate(family.createdAt)}</span>
              </div>
              {familyMember && (
                <div className={styles.infoRow}>
                  <span className={styles.label}>Family Member:</span>
                  <span className={styles.value}>
                    {familyMember.name} ({familyMember.sex === 'man' ? '👨' : '👩'})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!family && (
        <div className={styles.noFamily}>
          <p>You don't have a family yet. Create one from the Dashboard!</p>
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Testing</h3>
        <div className={styles.testingCard}>
          <p className={styles.testingDescription}>
            Switch to fake users to test the family and task features:
          </p>
          <div className={styles.fakeUsers}>
            <button
              onClick={() => handleSwitchToFakeUser('fake-user-1')}
              className={styles.fakeUserButton}
            >
              Switch to John Doe (👨)
            </button>
            <button
              onClick={() => handleSwitchToFakeUser('fake-user-2')}
              className={styles.fakeUserButton}
            >
              Switch to Jane Doe (👩)
            </button>
          </div>
          <p className={styles.testingNote}>
            These fake users are already in a family together with sample tasks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

