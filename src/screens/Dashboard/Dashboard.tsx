import { useState, useEffect } from "react";
import { Family, Task, User } from "@/types";
import { useCurrentUser, useAuth } from "@/providers/auth";
import { useFamily } from "@/providers/family";
import { useTasks } from "@/providers/tasks";
import { useToast } from "@/providers/toast/hooks";
import CreateFamilyModal from "@/components/CreateFamilyModal";
import CreateTaskModal from "@/components/CreateTaskModal";
import TaskCard from "@/components/TaskCard";
import PendingInvites from "@/components/PendingInvites";
import FamilyCard from "@/components/FamilyCard";
import { DASHBOARD_TEXT, TASK_STATUS, SEX_VALUES, SEX_EMOJIS } from "@/constants";
import styles from "./Dashboard.module.scss";

const Dashboard = (): JSX.Element => {
  const currentUser = useCurrentUser();
  const { getUserInfo } = useAuth();
  const {
    state: familyState,
    getInvites,
    respondToInvite,
    getFamily,
    clearFamily,
    setFamily,
  } = useFamily();
  const { toastError } = useToast();
  const {
    state: tasksState,
    createTask: createTaskApi,
    getMyTasks,
    setTasks,
  } = useTasks();
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [familyMember, setFamilyMember] = useState<User | null>(null);
  
  const tasks = tasksState.tasks;

  const family = familyState.family;

  const getFamilyInvites = async (): Promise<void> => {
    try {
      await getInvites();
    } catch (error) {
      console.error("Failed to load invites:", error);
    }
  };
  const getFamilyData = async (familyId: string): Promise<void> => {
    try {
      await getFamily(familyId);
    } catch (error) {
      console.error("Failed to load family:", error);
    }
  };
  const init = async (): Promise<void> => {
    if (!currentUser) return;
    const familyId = currentUser.familyId;

    if (!familyId) {
      clearFamily();

      getFamilyInvites();
    }

    if (familyId) {
      getFamilyData(familyId);
    }
  };

  useEffect(() => {
    init();
  }, [currentUser?.familyId]);

  // Handle family data when it's loaded
  useEffect(() => {
    if (family && currentUser) {
      // Fetch tasks for the current user
      const fetchTasks = async (): Promise<void> => {
        try {
          await getMyTasks();
        } catch (error) {
          console.error("Failed to load tasks:", error);
        }
      };
      fetchTasks();

      // Get the other family member
      const otherMemberId = family.members.find(
        (id: string) => id !== currentUser.id
      );
      if (otherMemberId) {
        // TEMP: Replace with API call
        const member: User | null = null; // storage.getUserById(otherMemberId);
        setFamilyMember(member);
      }
    } else {
      // Clear tasks when there's no family
      setTasks([]);
    }
  }, [family, currentUser, getMyTasks, setTasks]);

  const handleCreateFamily = () => {
    setShowCreateFamily(true);
  };

  const handleFamilyCreated = (newFamily: Family) => {
    setFamily(newFamily);
    setShowCreateFamily(false);
    // Refresh family member
    const otherMemberId = newFamily.members.find(
      (id) => id !== currentUser!.id
    );
    if (otherMemberId) {
      // TEMP: Replace with API call
      const member = null; // storage.getUserById(otherMemberId);
      setFamilyMember(member);
    }
  };

  const handleAcceptInvite = async (inviteId: string): Promise<void> => {
    if (!currentUser) return;

    try {
      await respondToInvite(inviteId, true);
      await getUserInfo();
      await getInvites();
    } catch (error) {
      console.error("Failed to accept invite:", error);
      toastError("Failed to accept invite. Please try again.");
    }
  };

  const handleRejectInvite = async (inviteId: string): Promise<void> => {
    try {
      await respondToInvite(inviteId, false);
      await getInvites();
    } catch (error) {
      console.error("Failed to reject invite:", error);
      toastError("Failed to reject invite. Please try again.");
    }
  };

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

  const handleTaskUpdate = (updatedTask: Task) => {
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

  const handleSolveTask = (taskId: string) => {
    if (!currentUser || !family) return;

    const task = tasks.find((t) => t.id === taskId);
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

    const task = tasks.find((t) => t.id === taskId);
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

  const pendingInvites = familyState.invites.filter(
    (invite) =>
      invite.status === "pending" && invite.toUserId === currentUser?.id
  );

  const sentInvites = familyState.sentInvites.filter(
    (invite) => invite.status === "pending"
  );

  return (
    <div className={styles.dashboard}>
      {!family && !familyState.isLoading && (
        <>
          <PendingInvites
            invites={pendingInvites}
            isLoading={familyState.isLoading}
            onAccept={handleAcceptInvite}
            onReject={handleRejectInvite}
          />

          <div className={styles.noFamily}>
            <h2 className={styles.title}>
              {DASHBOARD_TEXT.WELCOME_TITLE(currentUser.name)}
            </h2>
            <p className={styles.subtitle}>
              {DASHBOARD_TEXT.SUBTITLE_NO_FAMILY}
            </p>
            <button
              onClick={handleCreateFamily}
              className={styles.createFamilyButton}
            >
              {DASHBOARD_TEXT.BUTTON_CREATE_FAMILY}
            </button>

            {sentInvites.length > 0 && (
              <div className={styles.sentInvitesSection}>
                <h3 className={styles.sentInvitesTitle}>
                  {DASHBOARD_TEXT.SENT_INVITES_TITLE}
                </h3>
                <p className={styles.sentInvitesSubtitle}>
                  {DASHBOARD_TEXT.SENT_INVITES_SUBTITLE}
                </p>
                <div className={styles.sentInvitesList}>
                  {sentInvites.map((invite) => (
                    <div key={invite.id} className={styles.sentInviteItem}>
                      <div className={styles.sentInviteInfo}>
                        <div className={styles.sentInviteAvatar}>
                          {invite.toUser?.photoUrl ? (
                            <img
                              src={invite.toUser.photoUrl}
                              alt={invite.toUser.name || 'User'}
                              className={styles.avatarImage}
                            />
                          ) : (
                            <span>
                              {invite.toUser?.sex === SEX_VALUES.MAN
                                ? SEX_EMOJIS.MAN
                                : SEX_EMOJIS.WOMAN}
                            </span>
                          )}
                        </div>
                        <div className={styles.sentInviteDetails}>
                          <span className={styles.sentInviteTo}>
                            {DASHBOARD_TEXT.INVITE_TO}
                          </span>
                          <span className={styles.sentInviteName}>
                            {invite.toUser?.name || 'Unknown User'}
                          </span>
                        </div>
                      </div>
                      <div className={styles.sentInviteStatus}>
                        <span
                          className={`${styles.statusBadge} ${
                            invite.status === 'pending'
                              ? styles.statusBadgePending
                              : invite.status === 'accepted'
                              ? styles.statusBadgeAccepted
                              : styles.statusBadgeRejected
                          }`}
                        >
                          {invite.status === 'pending' && DASHBOARD_TEXT.INVITE_STATUS_PENDING}
                          {invite.status === 'accepted' && DASHBOARD_TEXT.INVITE_STATUS_ACCEPTED}
                          {invite.status === 'rejected' && DASHBOARD_TEXT.INVITE_STATUS_REJECTED}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {family && (
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

          <button
            onClick={() => setShowCreateTask(true)}
            className={styles.createTaskButton}
          >
            <span className={styles.buttonIcon}>+</span>
            <span>{DASHBOARD_TEXT.BUTTON_CREATE_TASK}</span>
          </button>

          <div className={styles.tasksSection}>
            <h3 className={styles.sectionTitle}>
              {DASHBOARD_TEXT.SECTION_TASKS}
            </h3>
            {tasks.length === 0 && (
              <div className={styles.noTasks}>
                <p>{DASHBOARD_TEXT.NO_TASKS}</p>
              </div>
            )}
            {tasks.length > 0 && (
              <div className={styles.tasksList}>
                {tasks.map((task) => (
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
