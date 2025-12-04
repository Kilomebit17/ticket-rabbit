import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Family } from '@/types';
import { formatDate } from '@/utils/helpers';
import { SEX_VALUES } from '@/constants';
import { TicketIcon } from '@/components/Icons';
import { AvatarIcon } from '@/components/Icons/AvatarIcon';
import styles from './FriendDetail.module.scss';

const FriendDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [familyMember, setFamilyMember] = useState<User | null>(null);

  useEffect(() => {
    if (id) {
      // TEMP: Replace with API call
      const foundUser = null; // storage.getUserById(id);
      setUser(foundUser);

      if (foundUser) {
        // TEMP: Replace with API call
        const userFamily: Family | null = null; // storage.getFamilyByUserId(foundUser.id);
        setFamily(userFamily);

        if (userFamily) {
          // Type assertions needed because TypeScript's control flow analysis
          // knows these variables are always null in this placeholder code
          const otherMemberId = (userFamily as Family).members.find((memberId: string) => memberId !== (foundUser as User).id);
          if (otherMemberId) {
            // TEMP: Replace with API call
            const member: User | null = null; // storage.getUserById(otherMemberId);
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
        <button onClick={() => navigate('/')} className={styles.backButton}>
          Back to Dashboard
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
          {user.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user.name}
              className={styles.avatarImage}
            />
          ) : (
            <span className={styles.emoji}>
              <AvatarIcon sex={user.sex} />
            </span>
          )}
        </div>
        <h2 className={styles.name}>{user.name}</h2>
        <div className={styles.balance}>
          <span className={styles.ticketIcon}><TicketIcon /></span>
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
              <span className={styles.ticketIcon}><TicketIcon /></span>
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
                <span className={styles.label}>Created:</span>
                <span className={styles.value}>{formatDate(family.createdAt)}</span>
              </div>
              {familyMember && (
                <div className={styles.infoRow}>
                  <span className={styles.label}>Family Member:</span>
                  <div className={styles.familyMemberValue}>
                    <div className={styles.familyMemberAvatar}>
                      {familyMember.photoUrl ? (
                        <img
                          src={familyMember.photoUrl}
                          alt={familyMember.name}
                          className={styles.familyMemberAvatarImage}
                        />
                      ) : (
                        <span className={styles.familyMemberAvatarIcon}>
                          <AvatarIcon sex={familyMember.sex} />
                        </span>
                      )}
                    </div>
                    <span className={styles.value}>{familyMember.name}</span>
                  </div>
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

