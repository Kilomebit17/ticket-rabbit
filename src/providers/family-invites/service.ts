import { useReducer, useCallback } from 'react';
import type { FamilyInvite } from '@/types';
import type {
  IFamilyInvitesContext,
  ISendInviteRequest,
  ISendInviteResponse,
  IGetInvitesResponse,
  IRespondInviteRequest,
  IRespondInviteResponse,
} from './types';
import { EFamilyInvitesActionType } from './types';
import initialState from './state';
import { reducer } from './reducer';
import { useHttpClient } from '@/providers/http-client';
import { ERROR_MESSAGES, LOG_MESSAGES } from '@/constants';

/**
 * Family invites service hook
 * Combines state management with API calls
 */
export const useFamilyInvitesService = (): IFamilyInvitesContext => {
  const httpClient = useHttpClient();
  const [state, dispatch] = useReducer(reducer, initialState());

  const setLoading = useCallback((loading: boolean): void => {
    dispatch({ type: EFamilyInvitesActionType.SET_LOADING, loading });
  }, []);

  const setInvites = useCallback((invites: FamilyInvite[]): void => {
    dispatch({ type: EFamilyInvitesActionType.SET_INVITES, invites });
  }, []);

  const setError = useCallback((error: string): void => {
    dispatch({ type: EFamilyInvitesActionType.SET_ERROR, error });
  }, []);

  const clearError = useCallback((): void => {
    dispatch({ type: EFamilyInvitesActionType.CLEAR_ERROR });
  }, []);

  /**
   * Send family invite
   */
  const sendInvite = useCallback(
    async (toUserId: string): Promise<FamilyInvite> => {
      setLoading(true);
      try {
        const response = await httpClient.post<ISendInviteResponse>(
          '/family/invite',
          { toUserId } as ISendInviteRequest
        );
        const invite = response.data.invite;
        dispatch({
          type: EFamilyInvitesActionType.ADD_INVITE,
          invite,
        });
        return invite;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.FAILED_TO_SEND_INVITE;
        setError(errorMessage);
        console.error(LOG_MESSAGES.ERROR, error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [httpClient, setLoading, setError]
  );

  /**
   * Get all family invites
   */
  const getInvites = useCallback(async (): Promise<FamilyInvite[]> => {
    setLoading(true);
    try {
      const response = await httpClient.get<IGetInvitesResponse>(
        '/family/invites'
      );
      const invites = response.data.invites || [];
      setInvites(invites);
      return invites;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.FAILED_TO_GET_INVITES;
      setError(errorMessage);
      console.error(LOG_MESSAGES.ERROR, error);
      setInvites([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [httpClient, setLoading, setInvites, setError]);

  /**
   * Respond to family invite (accept or reject)
   */
  const respondToInvite = useCallback(
    async (
      inviteId: string,
      accept: boolean
    ): Promise<IRespondInviteResponse> => {
      setLoading(true);
      try {
        const response = await httpClient.put<IRespondInviteResponse>(
          '/family/invites/respond',
          { inviteId, accept } as IRespondInviteRequest
        );
        const result = response.data;
        // Remove invite from list after response
        dispatch({
          type: EFamilyInvitesActionType.REMOVE_INVITE,
          inviteId,
        });
        return result;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.FAILED_TO_RESPOND_INVITE;
        setError(errorMessage);
        console.error(LOG_MESSAGES.ERROR, error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [httpClient, setLoading, setError]
  );

  return {
    state,
    setLoading,
    setInvites,
    setError,
    clearError,
    sendInvite,
    getInvites,
    respondToInvite,
  };
};

