import { User, Family, Task, FamilyRequest } from '@/types';

const STORAGE_KEYS = {
  CURRENT_USER: 'current_user',
  USERS: 'users',
  FAMILIES: 'families',
  TASKS: 'tasks',
  FAMILY_REQUESTS: 'family_requests',
} as const;

export const storage = {
  // Current User
  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // Users
  getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getUserById(id: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  },

  updateUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      this.saveUsers(users);
      // Update current user if it's the same user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === user.id) {
        this.setCurrentUser(user);
      }
    }
  },

  // Families
  getFamilies(): Family[] {
    const data = localStorage.getItem(STORAGE_KEYS.FAMILIES);
    return data ? JSON.parse(data) : [];
  },

  saveFamilies(families: Family[]): void {
    localStorage.setItem(STORAGE_KEYS.FAMILIES, JSON.stringify(families));
  },

  getFamilyByUserId(userId: string): Family | null {
    const families = this.getFamilies();
    return families.find(f => f.members.includes(userId)) || null;
  },

  createFamily(family: Family): void {
    const families = this.getFamilies();
    families.push(family);
    this.saveFamilies(families);
  },

  // Tasks
  getTasks(): Task[] {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  },

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  getTasksByFamilyId(familyId: string): Task[] {
    const tasks = this.getTasks();
    return tasks.filter(t => t.familyId === familyId);
  },

  createTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  },

  updateTask(task: Task): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks[index] = task;
      this.saveTasks(tasks);
    }
  },

  // Family Requests
  getFamilyRequests(): FamilyRequest[] {
    const data = localStorage.getItem(STORAGE_KEYS.FAMILY_REQUESTS);
    return data ? JSON.parse(data) : [];
  },

  saveFamilyRequests(requests: FamilyRequest[]): void {
    localStorage.setItem(STORAGE_KEYS.FAMILY_REQUESTS, JSON.stringify(requests));
  },

  createFamilyRequest(request: FamilyRequest): void {
    const requests = this.getFamilyRequests();
    requests.push(request);
    this.saveFamilyRequests(requests);
  },

  updateFamilyRequest(request: FamilyRequest): void {
    const requests = this.getFamilyRequests();
    const index = requests.findIndex(r => r.id === request.id);
    if (index !== -1) {
      requests[index] = request;
      this.saveFamilyRequests(requests);
    }
  },
};

