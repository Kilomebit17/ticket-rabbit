import { Task, User, TaskStatus } from '@/types';
import { formatDate } from '@/utils/helpers';
import {
  TASK_CARD_TEXT,
  TASK_STATUS,
} from '@/constants';
import { TicketIcon, CheckIcon } from '@/components/Icons';
import { useTasks } from '@/providers/tasks';
import { useToast } from '@/providers/toast/hooks';
import styles from './TaskCard.module.scss';

interface TaskCardProps {
  task: Task;
  currentUser: User;
  onSolve?: (taskId: string) => void;
  onApprove?: (taskId: string) => void;
}

const TaskCard = ({ task, currentUser, onSolve, onApprove }: TaskCardProps) => {
  const { solveTask, approveTask } = useTasks();
  const { toastError } = useToast();
  const isCreator = task.creatorId.id === currentUser.id;
  const canSolve = !isCreator && !task.solverId && task.status === TASK_STATUS.CREATED;
  const canApprove = isCreator && task.status === TASK_STATUS.PENDING;

  const handleSolve = async (): Promise<void> => {
    try {
      await solveTask(task.id);
      if (onSolve) {
        onSolve(task.id);
      }
    } catch (error) {
      console.error('Failed to solve task:', error);
      toastError('Failed to solve task. Please try again.');
    }
  };

  const handleApprove = async (): Promise<void> => {
    try {
      await approveTask(task.id);
      if (onApprove) {
        onApprove(task.id);
      }
    } catch (error) {
      console.error('Failed to approve task:', error);
      toastError('Failed to approve task. Please try again.');
    }
  };

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

  const getCreatorName = (): string => {
    if (task.creatorId.id === currentUser.id) return TASK_CARD_TEXT.CREATOR_YOU;
    return task.creatorId.name || TASK_CARD_TEXT.UNKNOWN;
  };

  const getSolverName = (): string | null => {
    if (!task.solverId) return null;
    if (task.solverId.id === currentUser.id) return TASK_CARD_TEXT.SOLVER_YOU;
    return task.solverId.name || TASK_CARD_TEXT.UNKNOWN;
  };

  return (
    <div className={styles.taskCard}>
      <div className={styles.header}>
        <h4 className={styles.taskName}>{task.name}</h4>
        <div className={styles.price}>
          <span className={styles.ticketIcon}><TicketIcon /></span>
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
          <button onClick={handleSolve} className={styles.solveButton}>
            {TASK_CARD_TEXT.BUTTON_SOLVE}
          </button>
        )}
        {canApprove && (
          <button onClick={handleApprove} className={styles.approveButton}>
            {TASK_CARD_TEXT.BUTTON_APPROVE}
          </button>
        )}
        {task.status === TASK_STATUS.APPROVED && (
          <div className={styles.approvedBadge}>
            <CheckIcon className={styles.checkIcon} />
            <span>Approved</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

