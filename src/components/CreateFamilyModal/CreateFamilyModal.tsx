import { useState, useEffect, useRef } from "react";
import { generateId } from "@/utils/helpers";
import { User, Family, FamilyRequest } from "@/types";
import {
  CREATE_FAMILY_TEXT,
  FAMILY_REQUEST_STATUS,
  SEX_VALUES,
  SEX_EMOJIS,
} from "@/constants";
import styles from "./CreateFamilyModal.module.scss";

import { useUsers } from "@/providers/users";
import { useFamilyInvites } from "@/providers/family-invites";
import { useDebounce } from "@/hooks";

interface CreateFamilyModalProps {
  currentUser: User;
  onClose: () => void;
  onFamilyCreated: (family: Family) => void;
}

const CreateFamilyModal = ({
  currentUser,
  onClose,
  onFamilyCreated,
}: CreateFamilyModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FamilyRequest[]>([]);
  const { searchByUsername } = useUsers();
  const { sendInvite } = useFamilyInvites();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const performSearch = async (): Promise<void> => {
    if (debouncedSearchQuery.trim()) {
      try {
        const users = await searchByUsername(debouncedSearchQuery);
        console.log('users', users);
        setFilteredUsers(users);
      } catch (error) {
        // Error handling is done in the service
        setFilteredUsers([]);
      }
    } else {
      setFilteredUsers([]);
    }
  };

  useEffect(() => {
    performSearch();
  }, [debouncedSearchQuery]);

  useEffect(() => {
    // Focus search input on mount
    searchInputRef.current?.focus();
  }, []);

  const handleSendRequest = async (toUser: User): Promise<void> => {
    // Check if request already exists
    const existingRequest = pendingRequests.find(
      (r) =>
        r.fromUserId === currentUser.id &&
        r.toUserId === toUser.id &&
        r.status === FAMILY_REQUEST_STATUS.PENDING
    );

    if (existingRequest) {
      alert(CREATE_FAMILY_TEXT.ALERT_REQUEST_EXISTS);
      return;
    }

    try {
      await sendInvite(toUser.id);
      
      const request: FamilyRequest = {
        id: generateId(),
        fromUserId: currentUser.id,
        toUserId: toUser.id,
        status: FAMILY_REQUEST_STATUS.PENDING,
        createdAt: Date.now(),
      };
      
      setPendingRequests([...pendingRequests, request]);
      alert(CREATE_FAMILY_TEXT.ALERT_REQUEST_SENT);
    } catch (error) {
      console.error('Failed to send invite:', error);
      alert('Failed to send invite. Please try again.');
    }
  };

  const handleAcceptRequest = (request: FamilyRequest) => {
    // Create family
    const family: Family = {
      id: generateId(),
      members: [currentUser.id, request.fromUserId],
      createdAt: Date.now(),
    };

    // TEMP: Replace with API call
    // storage.createFamily(family);

    // Update request status

    // TEMP: Replace with API call
    // storage.updateFamilyRequest(updatedRequest);

    onFamilyCreated(family);
  };

  const hasPendingRequest = (userId: string) => {
    return pendingRequests.some(
      (r) =>
        r.fromUserId === currentUser.id &&
        r.toUserId === userId &&
        r.status === FAMILY_REQUEST_STATUS.PENDING
    );
  };

  const hasIncomingRequest = (userId: string) => {
    return pendingRequests.some(
      (r) =>
        r.fromUserId === userId &&
        r.toUserId === currentUser.id &&
        r.status === FAMILY_REQUEST_STATUS.PENDING
    );
  };

  const getIncomingRequest = (userId: string) => {
    return pendingRequests.find(
      (r) =>
        r.fromUserId === userId &&
        r.toUserId === currentUser.id &&
        r.status === FAMILY_REQUEST_STATUS.PENDING
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={modalRef}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3>{CREATE_FAMILY_TEXT.TITLE}</h3>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close modal"
            type="button"
          >
            ×
          </button>
        </div>

        <div className={styles.searchSection}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder={CREATE_FAMILY_TEXT.PLACEHOLDER_SEARCH}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            aria-label="Search users by username"
          />
        </div>

        <div className={styles.usersList}>
          {filteredUsers.length === 0 ? (
            <div className={styles.noUsers}>{CREATE_FAMILY_TEXT.NO_USERS}</div>
          ) : (
            filteredUsers.map((user) => {
              const hasRequest = hasPendingRequest(user.id);
              const hasIncoming = hasIncomingRequest(user.id);
              const incomingRequest = hasIncoming
                ? getIncomingRequest(user.id)
                : null;

              return (
                <div key={user.id} className={styles.userItem}>
                  <div className={styles.userInfo}>
                    <span className={styles.userEmoji}>
                      {user.sex === SEX_VALUES.MAN
                        ? SEX_EMOJIS.MAN
                        : SEX_EMOJIS.WOMAN}
                    </span>
                    <div>
                      <div className={styles.userName}>{user.name}</div>
                      <div className={styles.userSex}>{user.sex}</div>
                    </div>
                  </div>
                  <div className={styles.userActions}>
                    {hasIncoming && incomingRequest ? (
                      <button
                        onClick={() => handleAcceptRequest(incomingRequest)}
                        className={styles.acceptButton}
                        type="button"
                      >
                        {CREATE_FAMILY_TEXT.BUTTON_ACCEPT_REQUEST}
                      </button>
                    ) : hasRequest ? (
                      <span className={styles.requestSent}>
                        {CREATE_FAMILY_TEXT.REQUEST_SENT}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(user)}
                        className={styles.sendButton}
                        type="button"
                      >
                        {CREATE_FAMILY_TEXT.BUTTON_SEND_REQUEST}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateFamilyModal;
