import { useState, useEffect } from "react";
import { Task, User } from "@/types";
import { useCurrentUser } from "@/providers/auth";
import { useFamily } from "@/providers/family";
import { useTasks } from "@/providers/tasks";
import { useToast } from "@/providers/toast/hooks";
import CreateTaskModal from "@/components/CreateTaskModal";
import TaskCard from "@/components/TaskCard";
import { DASHBOARD_TEXT, TASK_STATUS } from "@/constants";
import styles from "./Tasks.module.scss";

const Tasks = (): JSX.Element => {
  const currentUser = useCurrentUser();
  const {
    state: familyState,
    getFamily,
  } = useFamily();
  const { toastError } = useToast();
  const {
    state: tasksState,
    createTask: createTaskApi,
    getFamilyTasks,
    setTasks,
  } = useTasks();
  const [showCreateTask, setShowCreateTask] = useState(false);
  
  const tasks = tasksState.tasks;
  const family = familyState.family;

  const getFamilyData = async (familyId: string): Promise<void> => {
    try {
      await getFamily(familyId);
    } catch (error) {
      console.error("Failed to load family:", error);
    }
  };

  useEffect(() => {
    if (!currentUser?.familyId) {
      setTasks([]);
      return;
    }

    getFamilyData(currentUser.familyId);
  }, [currentUser?.familyId]);

  // Handle family data when it's loaded
  useEffect(() => {
    if (family && currentUser) {
      // Fetch tasks for the family
      const fetchTasks = async (): Promise<void> => {
        try {
          await getFamilyTasks(family.id);
        } catch (error) {
          console.error("Failed to load tasks:", error);
        }
      };
      fetchTasks();
    } else {
      // Clear tasks when there's no family
      setTasks([]);
    }
  }, [family, currentUser, getFamilyTasks, setTasks]);

  const handleCreateTask = async (taskName: string, price: number): Promise<void> => {
    if (!family || !currentUser) return;

    try {
      await createTaskApi({
        familyId: family.id,
        name: taskName,
        price,
      });
      setShowCreateTask(false);
    } catch (error) {
      console.error("Failed to create task:", error);
      toastError("Failed to create task. Please try again.");
    }
  };

  const handleTaskUpdate = (updatedTask: Task): void => {
    // TODO: Replace with API call when update endpoint is available
    // For now, update local state through provider
    // Note: This will be replaced when update task API is implemented
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));

    // If task was approved, update user balance
    if (updatedTask.status === TASK_STATUS.APPROVED && updatedTask.solverId) {
      // Note: User balance is managed by the backend API
      // The auth state will be updated when the user data is refreshed
    }
  };

  const handleSolveTask = (taskId: string): void => {
    if (!currentUser || !family) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.solverId) return;

    const updatedTask: Task = {
      ...task,
      solverId: currentUser,
      status: TASK_STATUS.PENDING,
      solvedAt: Date.now(),
    };

    handleTaskUpdate(updatedTask);
  };

  const handleApproveTask = (taskId: string): void => {
    if (!currentUser) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.creatorId.id !== currentUser.id) return;

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

  if (!family) {
    return (
      <div className={styles.noFamily}>
        <p className={styles.noFamilyText}>
          You need to be part of a family to view tasks.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tasks}>
      <div className={styles.header}>
        <h2 className={styles.title}>{DASHBOARD_TEXT.SECTION_TASKS}</h2>
      </div>

      <button
        onClick={() => setShowCreateTask(true)}
        className={styles.createTaskButton}
      >
        <span className={styles.buttonIcon}>+</span>
        <span>{DASHBOARD_TEXT.BUTTON_CREATE_TASK}</span>
      </button>

      <div className={styles.tasksSection}>
        {tasks.length === 0 && (
          <div className={styles.noTasks}>
            <p>{DASHBOARD_TEXT.NO_TASKS}</p>
          </div>
        )}
        {tasks.length > 0 && (
          <div className={styles.tasksList}>
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id || `task-${index}-${task.createdAt}`}
                task={task}
                currentUser={currentUser}
                onSolve={handleSolveTask}
                onApprove={handleApproveTask}
              />
            ))}
          </div>
        )}
      </div>

      {showCreateTask && (
        <CreateTaskModal
          onClose={() => setShowCreateTask(false)}
          onCreate={handleCreateTask}
        />
      )}
    </div>
  );
};

export default Tasks;

