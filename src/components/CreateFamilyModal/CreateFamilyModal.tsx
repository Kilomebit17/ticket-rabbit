import { useState, useEffect } from 'react';
import { generateId } from '@/utils/helpers';
import { User, Family, FamilyRequest } from '@/types';
import {
  CREATE_FAMILY_TEXT,
  FAMILY_REQUEST_STATUS,
  SEX_VALUES,
  SEX_EMOJIS,
} from '@/constants';
import styles from './CreateFamilyModal.module.scss';

interface CreateFamilyModalProps {
  currentUser: User;
  onClose: () => void;
  onFamilyCreated: (family: Family) => void;
}

const CreateFamilyModal = ({ currentUser, onClose, onFamilyCreated }: CreateFamilyModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FamilyRequest[]>([]);

  useEffect(() => {
    // TEMP: Replace with API call
    const allUsers: User[] = []; // storage.getUsers().filter(u => u.id !== currentUser.id);
    setUsers(allUsers);
    setFilteredUsers(allUsers);

    // TEMP: Replace with API call
    const requests: FamilyRequest[] = []; // storage.getFamilyRequests();
    setPendingRequests(requests);
  }, [currentUser]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const handleSendRequest = (toUser: User) => {
    // Check if request already exists
    const existingRequest = pendingRequests.find(
      r => r.fromUserId === currentUser.id && r.toUserId === toUser.id && r.status === FAMILY_REQUEST_STATUS.PENDING
    );

    if (existingRequest) {
      alert(CREATE_FAMILY_TEXT.ALERT_REQUEST_EXISTS);
      return;
    }

    // TEMP: Replace with API call
    const existingFamily = null; // storage.getFamilyByUserId(toUser.id);
    if (existingFamily) {
      alert(CREATE_FAMILY_TEXT.ALERT_USER_HAS_FAMILY);
      return;
    }

    const request: FamilyRequest = {
      id: generateId(),
      fromUserId: currentUser.id,
      toUserId: toUser.id,
      status: FAMILY_REQUEST_STATUS.PENDING,
      createdAt: Date.now(),
    };

    // TEMP: Replace with API call
    // storage.createFamilyRequest(request);
    setPendingRequests([...pendingRequests, request]);
    alert(CREATE_FAMILY_TEXT.ALERT_REQUEST_SENT);
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
      r => r.fromUserId === currentUser.id && r.toUserId === userId && r.status === FAMILY_REQUEST_STATUS.PENDING
    );
  };

  const hasIncomingRequest = (userId: string) => {
    return pendingRequests.some(
      r => r.fromUserId === userId && r.toUserId === currentUser.id && r.status === FAMILY_REQUEST_STATUS.PENDING
    );
  };

  const getIncomingRequest = (userId: string) => {
    return pendingRequests.find(
      r => r.fromUserId === userId && r.toUserId === currentUser.id && r.status === FAMILY_REQUEST_STATUS.PENDING
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{CREATE_FAMILY_TEXT.TITLE}</h3>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder={CREATE_FAMILY_TEXT.PLACEHOLDER_SEARCH}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.usersList}>
          {filteredUsers.length === 0 ? (
            <div className={styles.noUsers}>{CREATE_FAMILY_TEXT.NO_USERS}</div>
          ) : (
            filteredUsers.map(user => {
              const hasRequest = hasPendingRequest(user.id);
              const hasIncoming = hasIncomingRequest(user.id);
              const incomingRequest = hasIncoming ? getIncomingRequest(user.id) : null;

              return (
                <div key={user.id} className={styles.userItem}>
                  <div className={styles.userInfo}>
                    <span className={styles.userEmoji}>{user.sex === SEX_VALUES.MAN ? SEX_EMOJIS.MAN : SEX_EMOJIS.WOMAN}</span>
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
                      >
                        {CREATE_FAMILY_TEXT.BUTTON_ACCEPT_REQUEST}
                      </button>
                    ) : hasRequest ? (
                      <span className={styles.requestSent}>{CREATE_FAMILY_TEXT.REQUEST_SENT}</span>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(user)}
                        className={styles.sendButton}
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

