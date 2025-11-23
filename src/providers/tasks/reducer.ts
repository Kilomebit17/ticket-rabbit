import type { ITasksState, TasksActions } from './types';
import { ETasksActionType } from './types';
import initialState from './state';

/**
 * Tasks reducer
 */
export const reducer = (
  state: ITasksState = initialState(),
  action: TasksActions
): ITasksState => {
  switch (action.type) {
    case ETasksActionType.SET_LOADING:
      return {
        ...state,
        isLoading: action.loading,
      };

    case ETasksActionType.SET_TASKS:
      return {
        ...state,
        tasks: action.tasks,
      };

    case ETasksActionType.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.task],
      };

    case ETasksActionType.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.task.id ? action.task : task
        ),
      };

    case ETasksActionType.REMOVE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.taskId),
      };

    case ETasksActionType.SET_ERROR:
      return {
        ...state,
        error: action.error,
      };

    case ETasksActionType.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

