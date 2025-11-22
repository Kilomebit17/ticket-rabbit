import { useState, useEffect } from 'react';
import { generateId } from '@/utils/helpers';
import { Family, Task, User } from '@/types';
import { useCurrentUser } from '@/providers/auth';
import CreateFamilyModal from '@/components/CreateFamilyModal';
import CreateTaskModal from '@/components/CreateTaskModal';
import TaskCard from '@/components/TaskCard';
import {
  DASHBOARD_TEXT,
  TASK_STATUS,
  SEX_VALUES,
  SEX_EMOJIS,
} from '@/constants';
import styles from './Dashboard.module.scss';

const Dashboard = (): JSX.Element => {
  const currentUser = useCurrentUser();
  const [family, setFamily] = useState<Family | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [familyMember, setFamilyMember] = useState<User | null>(null);

  useEffect(() => {
    if (currentUser) {
      // TEMP: Replace with API call
      const userFamily: Family | null = null; // storage.getFamilyByUserId(currentUser.id);
      setFamily(userFamily || null);

      if (userFamily) {
        // TEMP: Replace with API call
        const familyTasks: Task[] = []; // storage.getTasksByFamilyId(userFamily.id);
        setTasks(familyTasks);

        // Get the other family member
        const otherMemberId = (userFamily as Family).members.find((id: string) => id !== currentUser.id);
        if (otherMemberId) {
          // TEMP: Replace with API call
          const member: User | null = null; // storage.getUserById(otherMemberId);
          setFamilyMember(member);
        }
      }
    }
  }, [currentUser]);

  const handleCreateFamily = () => {
    setShowCreateFamily(true);
  };

  const handleFamilyCreated = (newFamily: Family) => {
    setFamily(newFamily);
    setShowCreateFamily(false);
    // Refresh family member
    const otherMemberId = newFamily.members.find(id => id !== currentUser!.id);
    if (otherMemberId) {
      // TEMP: Replace with API call
      const member = null; // storage.getUserById(otherMemberId);
      setFamilyMember(member);
    }
  };

  const handleCreateTask = (taskName: string, price: number) => {
    if (!family || !currentUser) return;

    const newTask: Task = {
      id: generateId(),
      familyId: family.id,
      creatorId: currentUser.id,
      name: taskName,
      price,
      status: TASK_STATUS.CREATED,
      createdAt: Date.now(),
    };

    // TEMP: Replace with API call
    // storage.createTask(newTask);
    setTasks([...tasks, newTask]);
    setShowCreateTask(false);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    // TEMP: Replace with API call
    // storage.updateTask(updatedTask);
    setTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));
    
    // If task was approved, update user balance
    if (updatedTask.status === TASK_STATUS.APPROVED && updatedTask.solverId) {
      // TEMP: Replace with API call
      const solver: User | null = null; // storage.getUserById(updatedTask.solverId);
      if (solver) {
        (solver as User).balance += updatedTask.price;
        // TEMP: Replace with API call
        // storage.updateUser(solver);
        
        // Note: User balance is managed by the backend API
        // The auth state will be updated when the user data is refreshed
      }
    }
  };

  const handleSolveTask = (taskId: string) => {
    if (!currentUser || !family) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task || task.solverId) return;

    const updatedTask: Task = {
      ...task,
      solverId: currentUser.id,
      status: TASK_STATUS.PENDING,
      solvedAt: Date.now(),
    };

    handleTaskUpdate(updatedTask);
  };

  const handleApproveTask = (taskId: string) => {
    if (!currentUser) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task || task.creatorId !== currentUser.id) return;

    const updatedTask: Task = {
      ...task,
      status: TASK_STATUS.APPROVED,
      approvedAt: Date.now(),
    };

    handleTaskUpdate(updatedTask);
  };

  if (!currentUser) {
    return <div>{DASHBOARD_TEXT.LOADING}</div>;
  }

  return (
    <div className={styles.dashboard}>
      {!family ? (
        <div className={styles.noFamily}>
          <h2 className={styles.title}>{DASHBOARD_TEXT.WELCOME_TITLE(currentUser.name)}</h2>
          <p className={styles.subtitle}>{DASHBOARD_TEXT.SUBTITLE_NO_FAMILY}</p>
          <button onClick={handleCreateFamily} className={styles.createFamilyButton}>
            {DASHBOARD_TEXT.BUTTON_CREATE_FAMILY}
          </button>
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <h2 className={styles.title}>{DASHBOARD_TEXT.TITLE}</h2>
          </div>

          {familyMember && (
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
                    <span>{currentUser.sex === SEX_VALUES.MAN ? SEX_EMOJIS.MAN : SEX_EMOJIS.WOMAN}</span>
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
                    <span>{familyMember.sex === SEX_VALUES.MAN ? SEX_EMOJIS.MAN : SEX_EMOJIS.WOMAN}</span>
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
                  <span className={styles.statValue}>
                    {tasks.filter(t => t.status === TASK_STATUS.APPROVED).length}
                  </span>
                  <span className={styles.statLabel}>{DASHBOARD_TEXT.STAT_COMPLETED}</span>
                </div>
                <div className={styles.statDivider}></div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>
                    {tasks.filter(t => t.status === TASK_STATUS.PENDING).length}
                  </span>
                  <span className={styles.statLabel}>{DASHBOARD_TEXT.STAT_PENDING}</span>
                </div>
              </div>
            </div>
          )}

          <button onClick={() => setShowCreateTask(true)} className={styles.createTaskButton}>
            <span className={styles.buttonIcon}>+</span>
            <span>{DASHBOARD_TEXT.BUTTON_CREATE_TASK}</span>
          </button>

          <div className={styles.tasksSection}>
            <h3 className={styles.sectionTitle}>{DASHBOARD_TEXT.SECTION_TASKS}</h3>
            {tasks.length === 0 ? (
              <div className={styles.noTasks}>
                <p>{DASHBOARD_TEXT.NO_TASKS}</p>
              </div>
            ) : (
              <div className={styles.tasksList}>
                {tasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    currentUser={currentUser}
                    familyMember={familyMember}
                    onSolve={handleSolveTask}
                    onApprove={handleApproveTask}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {showCreateFamily && (
        <CreateFamilyModal
          currentUser={currentUser}
          onClose={() => setShowCreateFamily(false)}
          onFamilyCreated={handleFamilyCreated}
        />
      )}

      {showCreateTask && (
        <CreateTaskModal
          onClose={() => setShowCreateTask(false)}
          onCreate={handleCreateTask}
        />
      )}
    </div>
  );
};

export default Dashboard;

