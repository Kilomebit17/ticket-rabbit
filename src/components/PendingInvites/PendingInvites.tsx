import type { FamilyInvite } from '@/types';
import { DASHBOARD_TEXT } from '@/constants';
import { EnvelopeIcon } from '@/components/Icons';
import UserCard from '@/components/UserCard';
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
        <div className={styles.invitesIcon}><EnvelopeIcon /></div>
        <div className={styles.invitesTitle}>
          <h3 className={styles.invitesTitleText}>{DASHBOARD_TEXT.INVITES_TITLE}</h3>
          <p className={styles.invitesSubtitle}>{DASHBOARD_TEXT.INVITES_SUBTITLE}</p>
        </div>
      </div>
      <div className={styles.invitesList}>
        {invites.map((invite) => {
          if (!invite.fromUser) return null;
          
          return (
            <UserCard
              key={invite.id}
              user={invite.fromUser}
              label={DASHBOARD_TEXT.INVITE_FROM}
              className={styles.inviteItem}
              actions={
                <>
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
                </>
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default PendingInvites;

