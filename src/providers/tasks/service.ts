import { useReducer, useCallback } from "react";
import type { Task } from "@/types";
import type {
  ITasksContext,
  ITaskDto,
  ICreateTaskResponse,
  IGetFamilyTasksResponse,
  ISolveTaskResponse,
  IApproveTaskResponse,
} from "./types";
import { ETasksActionType } from "./types";
import initialState from "./state";
import { reducer } from "./reducer";
import { useHttpClient } from "@/providers/http-client";
import { ERROR_MESSAGES, LOG_MESSAGES } from "@/constants";

/**
 * Transform backend task to local Task format
 * Backend returns dates as ISO strings, we convert to timestamps
 * Backend returns familyId and creatorId as objects, not strings
 */
const transformBackendTask = (backendTask: any): Task => {
  // Transform familyId from object to Family format
  const familyId = typeof backendTask.familyId === 'object' 
    ? {
        id: backendTask.familyId.id,
        name: backendTask.familyId.name,
        creatorId: typeof backendTask.familyId.creatorId === 'object' 
          ? backendTask.familyId.creatorId.id 
          : backendTask.familyId.creatorId,
        members: Array.isArray(backendTask.familyId.members) && backendTask.familyId.members.length > 0 && typeof backendTask.familyId.members[0] === 'object'
          ? backendTask.familyId.members
          : [], // If members are IDs, we'll need to fetch them separately
        tasks: backendTask.familyId.tasks || [],
        createdAt: new Date(backendTask.familyId.createdAt).getTime(),
        updatedAt: backendTask.familyId.updatedAt
          ? new Date(backendTask.familyId.updatedAt).getTime()
          : undefined,
      }
    : { id: backendTask.familyId } as any; // Fallback for string IDs

  // Transform creatorId from object to User format
  const creatorId = typeof backendTask.creatorId === 'object'
    ? {
        id: backendTask.creatorId.id,
        name: backendTask.creatorId.name,
        sex: backendTask.creatorId.sex,
        balance: backendTask.creatorId.balance || 0,
        familyId: Array.isArray(backendTask.creatorId.families) && backendTask.creatorId.families.length > 0
          ? backendTask.creatorId.families[0]
          : '',
        photoUrl: backendTask.creatorId.photoUrl,
      }
    : { id: backendTask.creatorId } as any; // Fallback for string IDs

  // Transform solverId from object to User format (if present)
  const solverId = backendTask.solverId
    ? (typeof backendTask.solverId === 'object'
        ? {
            id: backendTask.solverId.id,
            name: backendTask.solverId.name,
            sex: backendTask.solverId.sex,
            balance: backendTask.solverId.balance || 0,
            familyId: Array.isArray(backendTask.solverId.families) && backendTask.solverId.families.length > 0
              ? backendTask.solverId.families[0]
              : '',
            photoUrl: backendTask.solverId.photoUrl,
          }
        : { id: backendTask.solverId } as any)
    : undefined;

  return {
    id: backendTask.id,
    familyId,
    creatorId,
    solverId,
    name: backendTask.name,
    price: backendTask.price,
    status: backendTask.status,
    createdAt: new Date(backendTask.createdAt).getTime(),
    solvedAt: backendTask.solvedAt
      ? new Date(backendTask.solvedAt).getTime()
      : undefined,
    approvedAt: backendTask.approvedAt
      ? new Date(backendTask.approvedAt).getTime()
      : undefined,
  };
};

/**
 * Transform array of backend tasks to local Task format
 */
const transformBackendTasks = (backendTasks: any[]): Task[] => {
  return backendTasks.map(transformBackendTask);
};

/**
 * Tasks service hook
 * Combines state management with API calls
 */
export const useTasksService = (): ITasksContext => {
  const httpClient = useHttpClient();
  const [state, dispatch] = useReducer(reducer, initialState());

  const setLoading = useCallback((loading: boolean): void => {
    dispatch({ type: ETasksActionType.SET_LOADING, loading });
  }, []);

  const setTasks = useCallback((tasks: Task[]): void => {
    dispatch({ type: ETasksActionType.SET_TASKS, tasks });
  }, []);

  const addTask = useCallback((task: Task): void => {
    dispatch({ type: ETasksActionType.ADD_TASK, task });
  }, []);

  const updateTask = useCallback((task: Task): void => {
    dispatch({ type: ETasksActionType.UPDATE_TASK, task });
  }, []);

  const removeTask = useCallback((taskId: string): void => {
    dispatch({ type: ETasksActionType.REMOVE_TASK, taskId });
  }, []);

  const setError = useCallback((error: string): void => {
    dispatch({ type: ETasksActionType.SET_ERROR, error });
  }, []);

  const clearError = useCallback((): void => {
    dispatch({ type: ETasksActionType.CLEAR_ERROR });
  }, []);

  /**
   * Create a new task
   */
  const createTask = useCallback(
    async (taskDto: ITaskDto): Promise<Task> => {
      setLoading(true);
      try {
        const response = await httpClient.post<ICreateTaskResponse>(
          "/task",
          taskDto
        );
        const task = transformBackendTask(response.data.task);
        addTask(task);
        return task;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.FAILED_TO_CREATE_TASK;
        setError(errorMessage);
        console.error(LOG_MESSAGES.ERROR, error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [httpClient, setLoading, addTask, setError]
  );

  /**
   * Get family tasks by family ID
   */
  const getFamilyTasks = useCallback(
    async (familyId: string): Promise<Task[]> => {
      setLoading(true);
      try {
        const response = await httpClient.get<IGetFamilyTasksResponse>(
          `/task/family/${familyId}`
        );
        const tasks = transformBackendTasks(response.data.tasks || []);
        setTasks(tasks);
        return tasks;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.FAILED_TO_GET_TASKS;
        setError(errorMessage);
        console.error(LOG_MESSAGES.ERROR, error);
        setTasks([]);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [httpClient, setLoading, setTasks, setError]
  );

  /**
   * Solve a task
   */
  const solveTask = useCallback(
    async (taskId: string): Promise<Task> => {
      setLoading(true);
      try {
        const response = await httpClient.post<ISolveTaskResponse>(
          "/task/solve",
          { taskId }
        );
        const task = transformBackendTask(response.data.task);
        updateTask(task);
        return task;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.FAILED_TO_SOLVE_TASK;
        setError(errorMessage);
        console.error(LOG_MESSAGES.ERROR, error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [httpClient, setLoading, updateTask, setError]
  );

  /**
   * Approve a task
   */
  const approveTask = useCallback(
    async (taskId: string): Promise<Task> => {
      setLoading(true);
      try {
        const response = await httpClient.post<IApproveTaskResponse>(
          "/task/approve",
          { taskId }
        );
        const task = transformBackendTask(response.data.task);
        updateTask(task);
        return task;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.FAILED_TO_APPROVE_TASK;
        setError(errorMessage);
        console.error(LOG_MESSAGES.ERROR, error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [httpClient, setLoading, updateTask, setError]
  );

  return {
    state,
    setLoading,
    setTasks,
    addTask,
    updateTask,
    removeTask,
    setError,
    clearError,
    createTask,
    getFamilyTasks,
    solveTask,
    approveTask,
  };
};
