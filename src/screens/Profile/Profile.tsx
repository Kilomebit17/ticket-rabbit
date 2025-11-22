import { useState, useEffect } from 'react';
import { Family } from '@/types';
import { formatDate } from '@/utils/helpers';
import { useCurrentUser, useAuthLoading } from '@/providers/auth';
import { SEX_VALUES, SEX_EMOJIS, DASHBOARD_TEXT } from '@/constants';
import styles from './Profile.module.scss';

const Profile = (): JSX.Element => {
  const currentUser = useCurrentUser();
  const isLoading = useAuthLoading();
  const [family, setFamily] = useState<Family | null>(null);
  const [familyMember, setFamilyMember] = useState<{ name: string; sex: string } | null>(null);

  useEffect(() => {
    if (currentUser) {
      // TEMP: Replace with API call
      const userFamily: Family | null = null; // storage.getFamilyByUserId(currentUser.id);
      setFamily(userFamily || null);

      if (userFamily) {
        const otherMemberId = (userFamily as Family).members.find((id: string) => id !== currentUser.id);
        if (otherMemberId) {
          // TEMP: Replace with API call
          const member: { name: string; sex: string } | null = null; // storage.getUserById(otherMemberId);
          if (member) {
            setFamilyMember({ name: (member as { name: string; sex: string }).name, sex: (member as { name: string; sex: string }).sex });
          }
        }
      }
    }
  }, [currentUser]);

  if (isLoading) {
    return <div>{DASHBOARD_TEXT.LOADING}</div>;
  }

  if (!currentUser) {
    return <div>{DASHBOARD_TEXT.LOADING}</div>;
  }

  return (
    <div className={styles.profile}>
      <h2 className={styles.title}>Profile</h2>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Personal Information</h3>
        <div className={styles.infoCard}>
          <div className={styles.avatar}>
            <span className={styles.emoji}>{currentUser.sex === SEX_VALUES.MAN ? SEX_EMOJIS.MAN : SEX_EMOJIS.WOMAN}</span>
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
                    {familyMember.name} ({familyMember.sex === SEX_VALUES.MAN ? SEX_EMOJIS.MAN : SEX_EMOJIS.WOMAN})
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
    </div>
  );
};

export default Profile;

