import { useState, useEffect } from 'react';
import { storage } from '@/utils/storage';
import { generateId } from '@/utils/helpers';
import { User, Family, FamilyRequest } from '@/types';
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
    // Get all users except current user
    const allUsers = storage.getUsers().filter(u => u.id !== currentUser.id);
    setUsers(allUsers);
    setFilteredUsers(allUsers);

    // Get pending requests
    const requests = storage.getFamilyRequests();
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
      r => r.fromUserId === currentUser.id && r.toUserId === toUser.id && r.status === 'pending'
    );

    if (existingRequest) {
      alert('Request already sent');
      return;
    }

    // Check if user already has a family
    const existingFamily = storage.getFamilyByUserId(toUser.id);
    if (existingFamily) {
      alert('This user already has a family');
      return;
    }

    const request: FamilyRequest = {
      id: generateId(),
      fromUserId: currentUser.id,
      toUserId: toUser.id,
      status: 'pending',
      createdAt: Date.now(),
    };

    storage.createFamilyRequest(request);
    setPendingRequests([...pendingRequests, request]);
    alert('Family request sent!');
  };

  const handleAcceptRequest = (request: FamilyRequest) => {
    // Create family
    const family: Family = {
      id: generateId(),
      members: [currentUser.id, request.fromUserId],
      createdAt: Date.now(),
    };

    storage.createFamily(family);

    // Update request status
    const updatedRequest: FamilyRequest = {
      ...request,
      status: 'accepted',
    };
    storage.updateFamilyRequest(updatedRequest);

    onFamilyCreated(family);
  };

  const hasPendingRequest = (userId: string) => {
    return pendingRequests.some(
      r => r.fromUserId === currentUser.id && r.toUserId === userId && r.status === 'pending'
    );
  };

  const hasIncomingRequest = (userId: string) => {
    return pendingRequests.some(
      r => r.fromUserId === userId && r.toUserId === currentUser.id && r.status === 'pending'
    );
  };

  const getIncomingRequest = (userId: string) => {
    return pendingRequests.find(
      r => r.fromUserId === userId && r.toUserId === currentUser.id && r.status === 'pending'
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Create Family</h3>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.usersList}>
          {filteredUsers.length === 0 ? (
            <div className={styles.noUsers}>No users found</div>
          ) : (
            filteredUsers.map(user => {
              const hasRequest = hasPendingRequest(user.id);
              const hasIncoming = hasIncomingRequest(user.id);
              const incomingRequest = hasIncoming ? getIncomingRequest(user.id) : null;

              return (
                <div key={user.id} className={styles.userItem}>
                  <div className={styles.userInfo}>
                    <span className={styles.userEmoji}>{user.sex === 'man' ? '👨' : '👩'}</span>
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
                        Accept Request
                      </button>
                    ) : hasRequest ? (
                      <span className={styles.requestSent}>Request Sent</span>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(user)}
                        className={styles.sendButton}
                      >
                        Send Request
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

