import { Task, User, TaskStatus } from '@/types';
import { formatDate } from '@/utils/helpers';
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
  const canSolve = !isCreator && !task.solverId && task.status === 'Created';
  const canApprove = isCreator && task.status === 'Pending';

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Created':
        return styles.statusCreated;
      case 'Pending':
        return styles.statusPending;
      case 'Approved':
        return styles.statusApproved;
      default:
        return '';
    }
  };

  const getCreatorName = () => {
    if (task.creatorId === currentUser.id) return 'You';
    return familyMember?.name || 'Unknown';
  };

  const getSolverName = () => {
    if (!task.solverId) return null;
    if (task.solverId === currentUser.id) return 'You';
    return familyMember?.name || 'Unknown';
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
          <span className={styles.label}>Status:</span>
          <span className={`${styles.status} ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>Created by:</span>
          <span>{getCreatorName()}</span>
        </div>
        {task.solverId && (
          <div className={styles.detailRow}>
            <span className={styles.label}>Solved by:</span>
            <span>{getSolverName()}</span>
          </div>
        )}
        <div className={styles.detailRow}>
          <span className={styles.label}>Created:</span>
          <span>{formatDate(task.createdAt)}</span>
        </div>
      </div>

      <div className={styles.actions}>
        {canSolve && (
          <button onClick={() => onSolve(task.id)} className={styles.solveButton}>
            Solve Task
          </button>
        )}
        {canApprove && (
          <button onClick={() => onApprove(task.id)} className={styles.approveButton}>
            Approve Task
          </button>
        )}
        {task.status === 'Approved' && (
          <div className={styles.approvedBadge}>✓ Approved</div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

