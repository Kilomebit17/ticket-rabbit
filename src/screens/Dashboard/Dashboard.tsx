import { useState, useEffect } from 'react';
import { storage } from '@/utils/storage';
import { generateId } from '@/utils/helpers';
import { Family, Task, User } from '@/types';
import CreateFamilyModal from '@/components/CreateFamilyModal';
import CreateTaskModal from '@/components/CreateTaskModal';
import TaskCard from '@/components/TaskCard';
import styles from './Dashboard.module.scss';

const Dashboard = () => {
  const [currentUser] = useState<User | null>(storage.getCurrentUser());
  const [family, setFamily] = useState<Family | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [familyMember, setFamilyMember] = useState<User | null>(null);

  useEffect(() => {
    if (currentUser) {
      const userFamily = storage.getFamilyByUserId(currentUser.id);
      setFamily(userFamily || null);

      if (userFamily) {
        const familyTasks = storage.getTasksByFamilyId(userFamily.id);
        setTasks(familyTasks);

        // Get the other family member
        const otherMemberId = userFamily.members.find(id => id !== currentUser.id);
        if (otherMemberId) {
          const member = storage.getUserById(otherMemberId);
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
      const member = storage.getUserById(otherMemberId);
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
      status: 'Created',
      createdAt: Date.now(),
    };

    storage.createTask(newTask);
    setTasks([...tasks, newTask]);
    setShowCreateTask(false);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    storage.updateTask(updatedTask);
    setTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));
    
    // If task was approved, update user balance
    if (updatedTask.status === 'Approved' && updatedTask.solverId) {
      const solver = storage.getUserById(updatedTask.solverId);
      if (solver) {
        solver.balance += updatedTask.price;
        storage.updateUser(solver);
        
        // Update current user if it's the solver
        if (solver.id === currentUser?.id) {
          const updatedCurrentUser = { ...currentUser, balance: solver.balance };
          storage.setCurrentUser(updatedCurrentUser);
        }
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
      status: 'Pending',
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
      status: 'Approved',
      approvedAt: Date.now(),
    };

    handleTaskUpdate(updatedTask);
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.dashboard}>
      {!family ? (
        <div className={styles.noFamily}>
          <h2 className={styles.title}>Welcome, {currentUser.name}!</h2>
          <p className={styles.subtitle}>Create a family to start managing tasks together</p>
          <button onClick={handleCreateFamily} className={styles.createFamilyButton}>
            Create Family
          </button>
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <h2 className={styles.title}>Dashboard</h2>
          </div>

          {familyMember && (
            <div className={styles.familyCard}>
              <div className={styles.familyCardHeader}>
                <div className={styles.familyIcon}>👨‍👩‍👧‍👦</div>
                <div className={styles.familyTitle}>
                  <h3 className={styles.familyName}>Your Family</h3>
                  <p className={styles.familySubtitle}>Active partnership</p>
                </div>
              </div>
              <div className={styles.familyMembers}>
                <div className={styles.member}>
                  <div className={styles.memberAvatar}>
                    <span>{currentUser.sex === 'man' ? '👨' : '👩'}</span>
                  </div>
                  <div className={styles.memberInfo}>
                    <span className={styles.memberName}>{currentUser.name}</span>
                    <span className={styles.memberRole}>You</span>
                  </div>
                  <div className={styles.memberBalance}>
                    <span className={styles.ticketIcon}>🎫</span>
                    <span>{currentUser.balance}</span>
                  </div>
                </div>
                <div className={styles.member}>
                  <div className={styles.memberAvatar}>
                    <span>{familyMember.sex === 'man' ? '👨' : '👩'}</span>
                  </div>
                  <div className={styles.memberInfo}>
                    <span className={styles.memberName}>{familyMember.name}</span>
                    <span className={styles.memberRole}>Partner</span>
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
                  <span className={styles.statLabel}>Total Tasks</span>
                </div>
                <div className={styles.statDivider}></div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>
                    {tasks.filter(t => t.status === 'Approved').length}
                  </span>
                  <span className={styles.statLabel}>Completed</span>
                </div>
                <div className={styles.statDivider}></div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>
                    {tasks.filter(t => t.status === 'Pending').length}
                  </span>
                  <span className={styles.statLabel}>Pending</span>
                </div>
              </div>
            </div>
          )}

          <button onClick={() => setShowCreateTask(true)} className={styles.createTaskButton}>
            <span className={styles.buttonIcon}>+</span>
            <span>Create New Task</span>
          </button>

          <div className={styles.tasksSection}>
            <h3 className={styles.sectionTitle}>Tasks</h3>
            {tasks.length === 0 ? (
              <div className={styles.noTasks}>
                <p>No tasks yet. Create your first task!</p>
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

