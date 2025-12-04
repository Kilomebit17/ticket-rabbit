// Project
export const PROJECT_NAME = 'Intimulator' as const;

// API/HTTP Configuration
export const HTTP_CONFIG = {
  TIMEOUT: 10000,
  CONTENT_TYPE: 'application/json',
  TELEGRAM_INIT_DATA_HEADER: 'x-telegram-init-data',
  TELEGRAM_INIT_DATA_HEADER_ALT: 'X-Telegram-Init-Data',
} as const;

// Temporary initData for development mode
export const TEMP_INIT_DATA =
  'user=%7B%22id%22%3A580416423%2C%22first_name%22%3A%22Oleg.ST%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Kilomebit%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2Fj62YEldy1g8JqhAhjvN9LYzsWNqbUOrk_6jftbSEXTM.svg%22%7D&chat_instance=-821855361356478172&chat_type=private&auth_date=1763819281&signature=sClQnJ8mVyjsDgA6Om07aD-pOis-S2VjRzAsxwSimz-hW78XZ5Atq2fma9IaS_y4f6fAQnKooRtv6Tgrns0kCQ&hash=f075718e4a300d426b38afc5b24d881cc9c0dea9c18a462380d6df12ca64c7d8';

export const API_URLS = {
  DEFAULT_LOCAL: 'http://localhost:3000/api',
  DEFAULT_PRODUCTION: 'https://ticket-backend-production-8744.up.railway.app/api',
} as const;

// External URLs
export const EXTERNAL_URLS = {
  TELEGRAM_BOT: 'https://t.me/ticket_rabbit_bot',
} as const;

// Sex Values
export const SEX_VALUES = {
  MAN: 'man',
  WOMAN: 'woman',
} as const;

// Sex Labels
export const SEX_LABELS = {
  MAN: 'Man',
  WOMAN: 'Woman',
} as const;

// Task Status Values
export const TASK_STATUS = {
  CREATED: 'Created',
  PENDING: 'Pending',
  APPROVED: 'Approved',
} as const;

// Family Request Status Values
export const FAMILY_REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
} as const;

// Default Values
export const DEFAULTS = {
  TASK_PRICE: 1,
  MIN_TASK_PRICE: 1,
} as const;

// UI Text - SexSelection Screen
export const SEX_SELECTION_TEXT = {
  TITLE: `Welcome to ${PROJECT_NAME}`,
  SUBTITLE: 'Please select your sex and enter your name',
  NAME_PLACEHOLDER: 'Enter your name',
  VALIDATION_SELECT_SEX: 'Please select your sex',
  VALIDATION_ENTER_NAME: 'Please enter your name',
  BUTTON_CREATING: 'Creating...',
  BUTTON_CONTINUE: 'Continue',
} as const;

// UI Text - TryAgain Screen
export const TRY_AGAIN_TEXT = {
  TITLE: 'Please Open in Telegram',
  MESSAGE: 'This app is designed to work within Telegram. Please open it from a Telegram bot or link.',
  BUTTON_OPEN: 'Open in Telegram',
} as const;

// UI Text - CreateTaskModal
export const CREATE_TASK_TEXT = {
  TITLE: 'Create Task',
  LABEL_TASK_NAME: 'Task Name',
  LABEL_PRICE: 'Price (Tickets)',
  PLACEHOLDER_TASK_NAME: 'Enter task name',
  VALIDATION_TASK_NAME: 'Please enter task name',
  VALIDATION_PRICE_MIN: 'Price must be at least 1 ticket',
  BUTTON_CANCEL: 'Cancel',
  BUTTON_CREATE: 'Create Task',
} as const;

// UI Text - CreateFamilyModal
export const CREATE_FAMILY_TEXT = {
  TITLE: 'Create Family',
  PLACEHOLDER_SEARCH: 'Write username like @kilomebit',
  NO_USERS: 'No users found',
  BUTTON_SEND_REQUEST: 'Send Invite',
  BUTTON_ACCEPT_REQUEST: 'Accept Request',
  REQUEST_SENT: 'Request Sent',
  ALERT_REQUEST_EXISTS: 'Request already sent',
  ALERT_USER_HAS_FAMILY: 'This user already has a family',
  ALERT_REQUEST_SENT: 'Family request sent!',
} as const;

// UI Text - Dashboard
export const DASHBOARD_TEXT = {
  TITLE: 'Dashboard',
  WELCOME_TITLE: (name: string) => `Welcome, ${name}!`,
  SUBTITLE_NO_FAMILY: 'Create a family to start managing tasks together',
  BUTTON_CREATE_FAMILY: 'Create Family',
  BUTTON_CREATE_TASK: 'Create New Task',
  FAMILY_TITLE: 'Your Family',
  FAMILY_SUBTITLE: 'Active partnership',
  MEMBER_ROLE_YOU: 'You',
  MEMBER_ROLE_PARTNER: 'Partner',
  SECTION_TASKS: 'Tasks',
  NO_TASKS: 'No tasks yet. Create your first task!',
  STAT_TOTAL_TASKS: 'Total Tasks',
  STAT_COMPLETED: 'Completed',
  STAT_PENDING: 'Pending',
  LOADING: 'Loading...',
  INVITES_TITLE: 'Family Invites',
  INVITES_SUBTITLE: 'You have pending family invitations',
  NO_INVITES: 'No pending invites',
  INVITE_FROM: 'Invite from',
  SENT_INVITES_TITLE: 'Sent Invites',
  SENT_INVITES_SUBTITLE: 'Invites you have sent',
  NO_SENT_INVITES: 'No sent invites',
  INVITE_TO: 'Invite to',
  INVITE_STATUS_PENDING: 'Pending',
  INVITE_STATUS_ACCEPTED: 'Accepted',
  INVITE_STATUS_REJECTED: 'Rejected',
  BUTTON_ACCEPT: 'Accept',
  BUTTON_REJECT: 'Reject',
} as const;

// UI Text - TaskCard
export const TASK_CARD_TEXT = {
  LABEL_STATUS: 'Status:',
  LABEL_CREATED_BY: 'Created by:',
  LABEL_SOLVED_BY: 'Solved by:',
  LABEL_CREATED: 'Created:',
  CREATOR_YOU: 'You',
  SOLVER_YOU: 'You',
  UNKNOWN: 'Unknown',
  BUTTON_SOLVE: 'Solve Task',
  BUTTON_APPROVE: 'Approve Task',
  BADGE_APPROVED: 'Approved',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  FAILED_TO_CHECK_USER: 'Failed to check user',
  FAILED_TO_CREATE_USER: 'Failed to create user',
  FAILED_TO_SEARCH_USERS: 'Failed to search users',
  FAILED_TO_SEND_INVITE: 'Failed to send invite',
  FAILED_TO_GET_INVITES: 'Failed to get invites',
  FAILED_TO_RESPOND_INVITE: 'Failed to respond to invite',
  FAILED_TO_CREATE_TASK: 'Failed to create task',
  FAILED_TO_GET_TASKS: 'Failed to get tasks',
  FAILED_TO_SOLVE_TASK: 'Failed to solve task',
  FAILED_TO_APPROVE_TASK: 'Failed to approve task',
} as const;

// Console Log Messages
export const LOG_MESSAGES = {
  API_ERROR: 'API Error:',
  NETWORK_ERROR: 'Network Error:',
  ERROR: 'Error:',
  FAILED_TO_CREATE_USER: 'Failed to create user:',
} as const;

