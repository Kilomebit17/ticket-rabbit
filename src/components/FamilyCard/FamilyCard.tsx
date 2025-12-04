import type { Family, User, Task } from '@/types';
import { DASHBOARD_TEXT, TASK_STATUS } from '@/constants';
import { FamilyIcon, TicketIcon } from '@/components/Icons';
import { AvatarIcon } from '@/components/Icons/AvatarIcon';
import { calculateDaysTogether } from '@/utils/helpers';
import styles from './FamilyCard.module.scss';

interface FamilyCardProps {
  family: Family;
  currentUser: User;
  tasks: Task[];
}

const FamilyCard = ({
  family,
  currentUser,
  tasks,
}: FamilyCardProps): JSX.Element => {
  const completedTasks = tasks.filter((t) => t.status === TASK_STATUS.APPROVED).length;
  const pendingTasks = tasks.filter((t) => t.status === TASK_STATUS.PENDING).length;
  const daysTogether = calculateDaysTogether(family.createdAt);
  
  // Find the partner (the other member who is not the current user)
  const partner = family.members.find((member) => member.id !== currentUser.id);

  return (
    <div className={styles.familyCard}>
      <div className={styles.familyCardHeader}>
        <div className={styles.familyIcon}><FamilyIcon /></div>
        <div className={styles.familyTitle}>
          <h3 className={styles.familyName}>{family.name}</h3>
          <p className={styles.familySubtitle}>{DASHBOARD_TEXT.FAMILY_SUBTITLE}</p>
        </div>
        <div className={styles.togetherTime}>
          <span className={styles.togetherTimeNumber}>{daysTogether}</span>
        </div>
      </div>
      <div className={styles.familyMembers}>
        <div className={styles.member}>
          <div className={styles.memberAvatar}>
            {currentUser.photoUrl ? (
              <img
                src={currentUser.photoUrl}
                alt={currentUser.name}
                className={styles.avatarImage}
              />
            ) : (
              <span className={styles.avatarIcon}>
                <AvatarIcon sex={currentUser.sex} />
              </span>
            )}
          </div>
          <div className={styles.memberInfo}>
            <span className={styles.memberName}>{currentUser.name}</span>
            <span className={styles.memberRole}>{DASHBOARD_TEXT.MEMBER_ROLE_YOU}</span>
          </div>
          <div className={styles.memberBalance}>
            <span className={styles.ticketIcon}><TicketIcon /></span>
            <span>{currentUser.balance}</span>
          </div>
        </div>
        {partner && (
          <div className={styles.member}>
            <div className={styles.memberAvatar}>
              {partner.photoUrl ? (
                <img
                  src={partner.photoUrl}
                  alt={partner.name}
                  className={styles.avatarImage}
                />
              ) : (
                <span className={styles.avatarIcon}>
                  <AvatarIcon sex={partner.sex} />
                </span>
              )}
            </div>
            <div className={styles.memberInfo}>
              <span className={styles.memberName}>{partner.name}</span>
              <span className={styles.memberRole}>{DASHBOARD_TEXT.MEMBER_ROLE_PARTNER}</span>
            </div>
            <div className={styles.memberBalance}>
              <span className={styles.ticketIcon}><TicketIcon /></span>
              <span>{partner.balance}</span>
            </div>
          </div>
        )}
      </div>
      <div className={styles.familyStats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{tasks.length}</span>
          <span className={styles.statLabel}>{DASHBOARD_TEXT.STAT_TOTAL_TASKS}</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{completedTasks}</span>
          <span className={styles.statLabel}>{DASHBOARD_TEXT.STAT_COMPLETED}</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{pendingTasks}</span>
          <span className={styles.statLabel}>{DASHBOARD_TEXT.STAT_PENDING}</span>
        </div>
      </div>
    </div>
  );
};

export default FamilyCard;

