import { Task, User, TaskStatus } from '@/types';
import { formatDate } from '@/utils/helpers';
import {
  TASK_CARD_TEXT,
  TASK_STATUS,
} from '@/constants';
import styles from './TaskCard.module.scss';

interface TaskCardProps {
  task: Task;
  currentUser: User;
  familyMember: User | null;
  onSolve: (taskId: string) => void;
  onApprove: (taskId: string) => void;
}

const TaskCard = ({ task, currentUser, familyMember, onSolve, onApprove }: TaskCardProps) => {
  const isCreator = task.creatorId === currentUser.id;
  const canSolve = !isCreator && !task.solverId && task.status === TASK_STATUS.CREATED;
  const canApprove = isCreator && task.status === TASK_STATUS.PENDING;

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TASK_STATUS.CREATED:
        return styles.statusCreated;
      case TASK_STATUS.PENDING:
        return styles.statusPending;
      case TASK_STATUS.APPROVED:
        return styles.statusApproved;
      default:
        return '';
    }
  };

  const getCreatorName = () => {
    if (task.creatorId === currentUser.id) return TASK_CARD_TEXT.CREATOR_YOU;
    return familyMember?.name || TASK_CARD_TEXT.UNKNOWN;
  };

  const getSolverName = () => {
    if (!task.solverId) return null;
    if (task.solverId === currentUser.id) return TASK_CARD_TEXT.SOLVER_YOU;
    return familyMember?.name || TASK_CARD_TEXT.UNKNOWN;
  };

  return (
    <div className={styles.taskCard}>
      <div className={styles.header}>
        <h4 className={styles.taskName}>{task.name}</h4>
        <div className={styles.price}>
          <span className={styles.ticketIcon}>🎫</span>
          <span>{task.price}</span>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.detailRow}>
          <span className={styles.label}>{TASK_CARD_TEXT.LABEL_STATUS}</span>
          <span className={`${styles.status} ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>{TASK_CARD_TEXT.LABEL_CREATED_BY}</span>
          <span>{getCreatorName()}</span>
        </div>
        {task.solverId && (
          <div className={styles.detailRow}>
            <span className={styles.label}>{TASK_CARD_TEXT.LABEL_SOLVED_BY}</span>
            <span>{getSolverName()}</span>
          </div>
        )}
        <div className={styles.detailRow}>
          <span className={styles.label}>{TASK_CARD_TEXT.LABEL_CREATED}</span>
          <span>{formatDate(task.createdAt)}</span>
        </div>
      </div>

      <div className={styles.actions}>
        {canSolve && (
          <button onClick={() => onSolve(task.id)} className={styles.solveButton}>
            {TASK_CARD_TEXT.BUTTON_SOLVE}
          </button>
        )}
        {canApprove && (
          <button onClick={() => onApprove(task.id)} className={styles.approveButton}>
            {TASK_CARD_TEXT.BUTTON_APPROVE}
          </button>
        )}
        {task.status === TASK_STATUS.APPROVED && (
          <div className={styles.approvedBadge}>{TASK_CARD_TEXT.BADGE_APPROVED}</div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

