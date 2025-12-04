import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { formatDate, copyToClipboard } from '@/utils/helpers';
import { useCurrentUser, useAuthLoading } from '@/providers/auth';
import { useFamily } from '@/providers/family';
import { SEX_VALUES, DASHBOARD_TEXT, EXTERNAL_URLS } from '@/constants';
import { TicketIcon } from '@/components/Icons';
import { AvatarIcon } from '@/components/Icons/AvatarIcon';
import { useToast } from '@/providers/toast/hooks';
import styles from './Profile.module.scss';

const Profile = (): JSX.Element => {
  const currentUser = useCurrentUser();
  const isLoading = useAuthLoading();
  const {
    state: familyState,
    getInvites,
    getFamily,
    clearFamily,
  } = useFamily();
  const { toastSuccess, toastError } = useToast();
  const [familyMember, setFamilyMember] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);

  const family = familyState.family;

  useEffect(() => {
    if (!currentUser) return;

    const loadData = async (): Promise<void> => {
      // Load family invites
      if (!family) {
        try {
          await getInvites();
        } catch (error) {
          console.error('Failed to load invites:', error);
        }
      }

      // Get family ID from user's families array
      const familyId = currentUser.familyId;
      if (familyId && !family) {
        try {
          await getFamily(familyId);
        } catch (error) {
          console.error('Failed to load family:', error);
          toastError('Failed to load family. Please try again.');
        }
      } else if (!familyId) {
        clearFamily();
      }
    };

    loadData();
  }, [
    currentUser,
    family,
    getInvites,
    getFamily,
    clearFamily,
    toastError,
  ]);

  // Handle family data when it's loaded
  useEffect(() => {
    if (family && currentUser) {
      // Get the other family member
      const otherMember = family.members.find(
        (member: User) => member.id !== currentUser.id
      );
      if (otherMember) {
        setFamilyMember(otherMember);
      }
    } else if (!family) {
      setFamilyMember(null);
    }
  }, [family, currentUser]);

  const handleCopyInviteLink = useCallback(async () => {
    const inviteLink = EXTERNAL_URLS.TELEGRAM_BOT;
    const success = await copyToClipboard(inviteLink);
    
    if (success) {
      setCopied(true);
      toastSuccess('Invite link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toastError('Failed to copy invite link. Please try again.');
    }
  }, [toastSuccess, toastError]);

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
            {currentUser.photoUrl ? (
              <img
                src={currentUser.photoUrl}
                alt={currentUser.name}
                className={styles.avatarImage}
              />
            ) : (
              <span className={styles.emoji}>
                <AvatarIcon sex={currentUser.sex} />
              </span>
            )}
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
                <span className={styles.ticketIcon}><TicketIcon /></span>
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
      )}

      {!family && (
        <div className={styles.noFamily}>
          <p>You don't have a family yet. Create one from the Dashboard!</p>
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Invite Friends</h3>
        <div className={styles.inviteSection}>
          <p className={styles.inviteText}>Invite friends to join the app</p>
          <div className={styles.inviteLinkContainer}>
            <a
              href={EXTERNAL_URLS.TELEGRAM_BOT}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.inviteLink}
            >
              {EXTERNAL_URLS.TELEGRAM_BOT}
            </a>
            <button
              type="button"
              onClick={handleCopyInviteLink}
              className={styles.copyButton}
              aria-label="Copy invite link"
            >
              {copied ? (
                <svg
                  className={`${styles.copyIcon} ${styles.checkIcon}`}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M16.6667 5L7.50004 14.1667L3.33337 10"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  className={styles.copyIcon}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M13.3333 6.66667H14.1667C15.0871 6.66667 15.8333 7.41286 15.8333 8.33333V14.1667C15.8333 15.0871 15.0871 15.8333 14.1667 15.8333H8.33333C7.41286 15.8333 6.66667 15.0871 6.66667 14.1667V13.3333"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.6667 4.16667H5.83333C4.91286 4.16667 4.16667 4.91286 4.16667 5.83333V11.6667C4.16667 12.5871 4.91286 13.3333 5.83333 13.3333H11.6667C12.5871 13.3333 13.3333 12.5871 13.3333 11.6667V5.83333C13.3333 4.91286 12.5871 4.16667 11.6667 4.16667Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

