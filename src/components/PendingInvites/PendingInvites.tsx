import type { FamilyInvite } from '@/types';
import { DASHBOARD_TEXT, SEX_VALUES, SEX_EMOJIS } from '@/constants';
import styles from './PendingInvites.module.scss';

interface PendingInvitesProps {
  invites: FamilyInvite[];
  isLoading: boolean;
  onAccept: (inviteId: string) => Promise<void>;
  onReject: (inviteId: string) => Promise<void>;
}

const PendingInvites = ({
  invites,
  isLoading,
  onAccept,
  onReject,
}: PendingInvitesProps): JSX.Element | null => {
  if (invites.length === 0) {
    return null;
  }

  return (
    <div className={styles.invitesCard}>
      <div className={styles.invitesHeader}>
        <div className={styles.invitesIcon}>📬</div>
        <div className={styles.invitesTitle}>
          <h3 className={styles.invitesTitleText}>{DASHBOARD_TEXT.INVITES_TITLE}</h3>
          <p className={styles.invitesSubtitle}>{DASHBOARD_TEXT.INVITES_SUBTITLE}</p>
        </div>
      </div>
      <div className={styles.invitesList}>
        {invites.map((invite) => (
          <div key={invite.id} className={styles.inviteItem}>
            <div className={styles.inviteInfo}>
              <div className={styles.inviteAvatar}>
                {invite.fromUser?.photoUrl ? (
                  <img
                    src={invite.fromUser.photoUrl}
                    alt={invite.fromUser.name || 'User'}
                    className={styles.avatarImage}
                  />
                ) : (
                  <span>
                    {invite.fromUser?.sex === SEX_VALUES.MAN
                      ? SEX_EMOJIS.MAN
                      : SEX_EMOJIS.WOMAN}
                  </span>
                )}
              </div>
              <div className={styles.inviteDetails}>
                <span className={styles.inviteFrom}>
                  {DASHBOARD_TEXT.INVITE_FROM}
                </span>
                <span className={styles.inviteName}>
                  {invite.fromUser?.name || 'Unknown User'}
                </span>
              </div>
            </div>
            <div className={styles.inviteActions}>
              <button
                onClick={() => onAccept(invite.id)}
                className={styles.acceptButton}
                type="button"
                disabled={isLoading}
                aria-label={`Accept invite from ${invite.fromUser?.name || 'user'}`}
              >
                {DASHBOARD_TEXT.BUTTON_ACCEPT}
              </button>
              <button
                onClick={() => onReject(invite.id)}
                className={styles.rejectButton}
                type="button"
                disabled={isLoading}
                aria-label={`Reject invite from ${invite.fromUser?.name || 'user'}`}
              >
                {DASHBOARD_TEXT.BUTTON_REJECT}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingInvites;

