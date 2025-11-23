import { useReducer, useCallback } from "react";
import type { Task } from "@/types";
import type {
  ITasksContext,
  ITaskDto,
  ICreateTaskResponse,
  IGetTasksResponse,
} from "./types";
import { ETasksActionType } from "./types";
import initialState from "./state";
import { reducer } from "./reducer";
import { useHttpClient } from "@/providers/http-client";
import { ERROR_MESSAGES, LOG_MESSAGES } from "@/constants";

/**
 * Transform backend task to local Task format
 * Backend returns dates as ISO strings, we convert to timestamps
 */
const transformBackendTask = (backendTask: any): Task => {
  return {
    id: backendTask.id,
    familyId: backendTask.familyId,
    creatorId: backendTask.creatorId,
    solverId: backendTask.solverId || undefined,
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
   * Get current user's tasks
   */
  const getMyTasks = useCallback(async (): Promise<Task[]> => {
    setLoading(true);
    try {
      const response = await httpClient.get<IGetTasksResponse>("/task/my");
      const tasks = transformBackendTasks(response.data.tasks.created || []);
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
  }, [httpClient, setLoading, setTasks, setError]);

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
    getMyTasks,
  };
};
