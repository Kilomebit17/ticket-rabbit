import type { User, Task } from '@/types';
import { DASHBOARD_TEXT, TASK_STATUS, SEX_VALUES, SEX_EMOJIS } from '@/constants';
import styles from './FamilyCard.module.scss';

interface FamilyCardProps {
  currentUser: User;
  familyMember: User;
  tasks: Task[];
}

const FamilyCard = ({
  currentUser,
  familyMember,
  tasks,
}: FamilyCardProps): JSX.Element => {
  const completedTasks = tasks.filter((t) => t.status === TASK_STATUS.APPROVED).length;
  const pendingTasks = tasks.filter((t) => t.status === TASK_STATUS.PENDING).length;

  return (
    <div className={styles.familyCard}>
      <div className={styles.familyCardHeader}>
        <div className={styles.familyIcon}>👨‍👩‍👧‍👦</div>
        <div className={styles.familyTitle}>
          <h3 className={styles.familyName}>{DASHBOARD_TEXT.FAMILY_TITLE}</h3>
          <p className={styles.familySubtitle}>{DASHBOARD_TEXT.FAMILY_SUBTITLE}</p>
        </div>
      </div>
      <div className={styles.familyMembers}>
        <div className={styles.member}>
          <div className={styles.memberAvatar}>
            <span>
              {currentUser.sex === SEX_VALUES.MAN ? SEX_EMOJIS.MAN : SEX_EMOJIS.WOMAN}
            </span>
          </div>
          <div className={styles.memberInfo}>
            <span className={styles.memberName}>{currentUser.name}</span>
            <span className={styles.memberRole}>{DASHBOARD_TEXT.MEMBER_ROLE_YOU}</span>
          </div>
          <div className={styles.memberBalance}>
            <span className={styles.ticketIcon}>🎫</span>
            <span>{currentUser.balance}</span>
          </div>
        </div>
        <div className={styles.member}>
          <div className={styles.memberAvatar}>
            <span>
              {familyMember.sex === SEX_VALUES.MAN ? SEX_EMOJIS.MAN : SEX_EMOJIS.WOMAN}
            </span>
          </div>
          <div className={styles.memberInfo}>
            <span className={styles.memberName}>{familyMember.name}</span>
            <span className={styles.memberRole}>{DASHBOARD_TEXT.MEMBER_ROLE_PARTNER}</span>
          </div>
          <div className={styles.memberBalance}>
            <span className={styles.ticketIcon}>🎫</span>
            <span>{familyMember.balance}</span>
          </div>
        </div>
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

