import { useState, useEffect } from 'react';
import { generateId } from '@/utils/helpers';
import { Family, Task, User } from '@/types';
import { useCurrentUser } from '@/providers/auth';
import { useFamilyInvites } from '@/providers/family-invites';
import { useToast } from '@/providers/toast/hooks';
import CreateFamilyModal from '@/components/CreateFamilyModal';
import CreateTaskModal from '@/components/CreateTaskModal';
import TaskCard from '@/components/TaskCard';
import PendingInvites from '@/components/PendingInvites';
import FamilyCard from '@/components/FamilyCard';
import {
  DASHBOARD_TEXT,
  TASK_STATUS,
} from '@/constants';
import styles from './Dashboard.module.scss';

const Dashboard = (): JSX.Element => {
  const currentUser = useCurrentUser();
  const { state: invitesState, getInvites, respondToInvite } = useFamilyInvites();
  const { toastError } = useToast();
  const [family, setFamily] = useState<Family | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [familyMember, setFamilyMember] = useState<User | null>(null);

  useEffect(() => {
    if (currentUser) {
      // Load family invites
      if (!family) {
        getInvites().catch((error) => {
          console.error('Failed to load invites:', error);
        });
      }

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
  }, [currentUser, family, getInvites]);

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

  const handleAcceptInvite = async (inviteId: string): Promise<void> => {
    if (!currentUser) return;

    try {
      const response = await respondToInvite(inviteId, true);
      if (response.family) {
        setFamily(response.family);
        // Refresh invites after accepting
        await getInvites();
      }
    } catch (error) {
      console.error('Failed to accept invite:', error);
      toastError('Failed to accept invite. Please try again.');
    }
  };

  const handleRejectInvite = async (inviteId: string): Promise<void> => {
    try {
      await respondToInvite(inviteId, false);
      // Invites list will be updated automatically by the reducer
    } catch (error) {
      console.error('Failed to reject invite:', error);
      toastError('Failed to reject invite. Please try again.');
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

  const pendingInvites = invitesState.invites.filter(
    (invite) => invite.status === 'pending' && invite.toUserId === currentUser?.id
  );

  return (
    <div className={styles.dashboard}>
      {!family ? (
        <>
          <PendingInvites
            invites={pendingInvites}
            isLoading={invitesState.isLoading}
            onAccept={handleAcceptInvite}
            onReject={handleRejectInvite}
          />

          <div className={styles.noFamily}>
            <h2 className={styles.title}>{DASHBOARD_TEXT.WELCOME_TITLE(currentUser.name)}</h2>
            <p className={styles.subtitle}>{DASHBOARD_TEXT.SUBTITLE_NO_FAMILY}</p>
            <button onClick={handleCreateFamily} className={styles.createFamilyButton}>
              {DASHBOARD_TEXT.BUTTON_CREATE_FAMILY}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={styles.header}>
            <h2 className={styles.title}>{DASHBOARD_TEXT.TITLE}</h2>
          </div>

          {familyMember && (
            <FamilyCard
              currentUser={currentUser}
              familyMember={familyMember}
              tasks={tasks}
            />
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

