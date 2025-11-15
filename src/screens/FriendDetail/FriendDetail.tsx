import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storage } from '@/utils/storage';
import { User, Family } from '@/types';
import { formatDate } from '@/utils/helpers';
import styles from './FriendDetail.module.scss';

const FriendDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [familyMember, setFamilyMember] = useState<User | null>(null);

  useEffect(() => {
    if (id) {
      const foundUser = storage.getUserById(id);
      setUser(foundUser);

      if (foundUser) {
        const userFamily = storage.getFamilyByUserId(foundUser.id);
        setFamily(userFamily || null);

        if (userFamily) {
          const otherMemberId = userFamily.members.find(memberId => memberId !== foundUser.id);
          if (otherMemberId) {
            const member = storage.getUserById(otherMemberId);
            setFamilyMember(member);
          }
        }
      }
    }
  }, [id]);

  if (!user) {
    return (
      <div className={styles.notFound}>
        <p>User not found</p>
        <button onClick={() => navigate('/userboard')} className={styles.backButton}>
          Back to Userboard
        </button>
      </div>
    );
  }

  return (
    <div className={styles.friendDetail}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ← Back
        </button>
      </div>

      <div className={styles.profileSection}>
        <div className={styles.avatar}>
          <span className={styles.emoji}>{user.sex === 'man' ? '👨' : '👩'}</span>
        </div>
        <h2 className={styles.name}>{user.name}</h2>
        <div className={styles.balance}>
          <span className={styles.ticketIcon}>🎫</span>
          <span className={styles.balanceAmount}>{user.balance}</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Personal Information</h3>
        <div className={styles.infoCard}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Name:</span>
            <span className={styles.value}>{user.name}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Sex:</span>
            <span className={styles.value}>{user.sex}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Balance:</span>
            <span className={styles.balanceValue}>
              <span className={styles.ticketIcon}>🎫</span>
              {user.balance}
            </span>
          </div>
        </div>
      </div>

      {family ? (
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
      ) : (
        <div className={styles.section}>
          <div className={styles.noFamily}>
            <p>This user doesn't have a family yet.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendDetail;

