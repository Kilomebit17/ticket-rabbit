import { useState, useEffect } from "react";
import { Family } from "@/types";
import { useCurrentUser, useAuth } from "@/providers/auth";
import { useFamily } from "@/providers/family";
import { useTasks } from "@/providers/tasks";
import { useToast } from "@/providers/toast/hooks";
import CreateFamilyModal from "@/components/CreateFamilyModal";
import PendingInvites from "@/components/PendingInvites";
import FamilyCard from "@/components/FamilyCard";
import { DASHBOARD_TEXT } from "@/constants";
import { AvatarIcon } from "@/components/Icons/AvatarIcon";
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
  const {
    state: tasksState,
    getFamilyTasks,
  } = useTasks();
  const { toastError } = useToast();
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  
  const family = familyState.family;
  const tasks = tasksState.tasks;

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

  const loadFamilyTasks = async (familyId: string): Promise<void> => {
    try {
      await getFamilyTasks(familyId);
    } catch (error) {
      console.error("Failed to load tasks:", error);
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
      await getFamilyData(familyId);
    }
  };

  useEffect(() => {
    init();
  }, [currentUser?.familyId]);

  // Load tasks when family is loaded
  useEffect(() => {
    if (family?.id) {
      loadFamilyTasks(family.id);
    }
  }, [family?.id]);

  const handleCreateFamily = (): void => {
    setShowCreateFamily(true);
  };

  const handleFamilyCreated = (newFamily: Family): void => {
    setFamily(newFamily);
    setShowCreateFamily(false);
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
                              {invite.toUser?.sex && (
                                <AvatarIcon sex={invite.toUser.sex} />
                              )}
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

      {family && currentUser && (
        <>
          <div className={styles.header}>
            <h2 className={styles.title}>{DASHBOARD_TEXT.TITLE}</h2>
          </div>

          <FamilyCard
            family={family}
            currentUser={currentUser}
            tasks={tasks}
          />
        </>
      )}

      {showCreateFamily && (
        <CreateFamilyModal
          currentUser={currentUser}
          onClose={() => setShowCreateFamily(false)}
          onFamilyCreated={handleFamilyCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;
