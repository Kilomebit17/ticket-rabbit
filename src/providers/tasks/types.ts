import type { Task } from "@/types";

/**
 * Base reducer action interface
 */
export interface IReducerAction<T = string> {
  type: T;
}

/**
 * Tasks state interface
 */
export interface ITasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Tasks action types enum
 */
export enum ETasksActionType {
  SET_LOADING = "SET_LOADING",
  SET_TASKS = "SET_TASKS",
  ADD_TASK = "ADD_TASK",
  UPDATE_TASK = "UPDATE_TASK",
  REMOVE_TASK = "REMOVE_TASK",
  SET_ERROR = "SET_ERROR",
  CLEAR_ERROR = "CLEAR_ERROR",
}

/**
 * Tasks action interfaces
 */
export interface IActionSetLoading
  extends IReducerAction<ETasksActionType.SET_LOADING> {
  loading: boolean;
}

export interface IActionSetTasks
  extends IReducerAction<ETasksActionType.SET_TASKS> {
  tasks: Task[];
}

export interface IActionAddTask
  extends IReducerAction<ETasksActionType.ADD_TASK> {
  task: Task;
}

export interface IActionUpdateTask
  extends IReducerAction<ETasksActionType.UPDATE_TASK> {
  task: Task;
}

export interface IActionRemoveTask
  extends IReducerAction<ETasksActionType.REMOVE_TASK> {
  taskId: string;
}

export interface IActionSetError
  extends IReducerAction<ETasksActionType.SET_ERROR> {
  error: string;
}

export interface IActionClearError
  extends IReducerAction<ETasksActionType.CLEAR_ERROR> {}

/**
 * Union type for all tasks actions
 */
export type TasksActions =
  | IActionSetLoading
  | IActionSetTasks
  | IActionAddTask
  | IActionUpdateTask
  | IActionRemoveTask
  | IActionSetError
  | IActionClearError;

/**
 * Task request DTO
 */
export interface ITaskDto {
  familyId: string;
  name: string;
  description?: string;
  price: number;
}

/**
 * Create task response
 */
export interface ICreateTaskResponse {
  task: Task;
}

/**
 * Get family tasks response
 */
export interface IGetFamilyTasksResponse {
  tasks: Task[];
}

/**
 * Solve task request body
 */
export interface ISolveTaskRequest {
  taskId: string;
}

/**
 * Solve task response
 */
export interface ISolveTaskResponse {
  task: Task;
}

/**
 * Approve task request body
 */
export interface IApproveTaskRequest {
  taskId: string;
}

/**
 * Approve task response
 */
export interface IApproveTaskResponse {
  task: Task;
}

/**
 * Tasks context interface
 */
export interface ITasksContext {
  state: ITasksState;
  setLoading: (loading: boolean) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
  setError: (error: string) => void;
  clearError: () => void;
  createTask: (dto: ITaskDto) => Promise<Task>;
  getFamilyTasks: (familyId: string) => Promise<Task[]>;
  solveTask: (taskId: string) => Promise<Task>;
  approveTask: (taskId: string) => Promise<Task>;
}
