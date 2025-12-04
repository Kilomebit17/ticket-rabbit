import { useReducer, useCallback } from 'react';
import type { FamilyInvite, Family } from '@/types';
import type {
  IFamilyContext,
  ISendInviteRequest,
  ISendInviteResponse,
  IGetInvitesResponse,
  IRespondInviteRequest,
  IRespondInviteResponse,
  IBackendFamilyInvite,
  IGetFamilyResponse,
  IBackendFamily,
} from './types';
import { EFamilyActionType } from './types';
import initialState from './state';
import { reducer } from './reducer';
import { useHttpClient } from '@/providers/http-client';
import { ERROR_MESSAGES, LOG_MESSAGES } from '@/constants';

/**
 * Transform backend family to local Family format
 * Backend returns dates as ISO strings, we convert to timestamps
 */
const transformBackendFamily = (backendFamily: IBackendFamily): Family => {
  return {
    id: backendFamily.id,
    name: backendFamily.name,
    creatorId: backendFamily.creatorId,
    members: backendFamily.members,
    tasks: backendFamily.tasks,
    createdAt: new Date(backendFamily.createdAt).getTime(),
    updatedAt: backendFamily.updatedAt
      ? new Date(backendFamily.updatedAt).getTime()
      : undefined,
  };
};

/**
 * Transform backend invite to local FamilyInvite format
 * Backend returns fromUserId and toUserId as User objects, not strings
 */
const transformBackendInvite = (backendInvite: IBackendFamilyInvite): FamilyInvite => {
  // Backend always returns User objects, but we keep type check for safety
  const fromUser = typeof backendInvite.fromUserId === 'object' 
    ? backendInvite.fromUserId 
    : null;
  const toUser = typeof backendInvite.toUserId === 'object'
    ? backendInvite.toUserId
    : null;

  return {
    id: backendInvite.id,
    fromUserId: fromUser?.id || (typeof backendInvite.fromUserId === 'string' 
      ? backendInvite.fromUserId 
      : ''),
    toUserId: toUser?.id || (typeof backendInvite.toUserId === 'string'
      ? backendInvite.toUserId
      : ''),
    fromUser: fromUser || undefined,
    toUser: toUser || undefined,
    status: backendInvite.status,
    createdAt: new Date(backendInvite.createdAt).getTime(),
  };
};

/**
 * Family service hook
 * Combines state management with API calls
 */
export const useFamilyService = (): IFamilyContext => {
  const httpClient = useHttpClient();
  const [state, dispatch] = useReducer(reducer, initialState());

  const setLoading = useCallback((loading: boolean): void => {
    dispatch({ type: EFamilyActionType.SET_LOADING, loading });
  }, []);

  const setInvites = useCallback((invites: FamilyInvite[]): void => {
    dispatch({ type: EFamilyActionType.SET_INVITES, invites });
  }, []);

  const setSentInvites = useCallback((sentInvites: FamilyInvite[]): void => {
    dispatch({ type: EFamilyActionType.SET_SENT_INVITES, sentInvites });
  }, []);

  const setFamily = useCallback((family: Family | null): void => {
    dispatch({ type: EFamilyActionType.SET_FAMILY, family });
  }, []);

  const setError = useCallback((error: string): void => {
    dispatch({ type: EFamilyActionType.SET_ERROR, error });
  }, []);

  const clearError = useCallback((): void => {
    dispatch({ type: EFamilyActionType.CLEAR_ERROR });
  }, []);

  /**
   * Send family invite
   * Note: Sent invites are not added to the state, only received invites are displayed
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
        // Don't add sent invite to state - only received invites are shown
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
   * Get family invites (both received and sent)
   * Stores received invites and sent invites separately
   */
  const getInvites = useCallback(async (): Promise<FamilyInvite[]> => {
    setLoading(true);
    try {
      const response = await httpClient.get<IGetInvitesResponse>(
        '/family/invites'
      );
      
      // Transform received invites (where user is the recipient)
      const receivedInvites = (response.data.received || []).map(transformBackendInvite);
      
      // Transform sent invites (where user is the sender)
      const sentInvites = (response.data.sent || []).map(transformBackendInvite);
      
      setInvites(receivedInvites);
      setSentInvites(sentInvites);
      return receivedInvites;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.FAILED_TO_GET_INVITES;
      setError(errorMessage);
      console.error(LOG_MESSAGES.ERROR, error);
      setInvites([]);
      setSentInvites([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [httpClient, setLoading, setInvites, setSentInvites, setError]);

  /**
   * Get family by ID
   */
  const getFamily = useCallback(
    async (familyId: string): Promise<Family> => {
      setLoading(true);
      try {
        const response = await httpClient.get<IGetFamilyResponse>(
          `/family/${familyId}`
        );
        const fetchedFamily = transformBackendFamily(response.data.family);
        setFamily(fetchedFamily);
        return fetchedFamily;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.FAILED_TO_GET_INVITES; // TODO: Add specific error message
        setError(errorMessage);
        console.error(LOG_MESSAGES.ERROR, error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [httpClient, setLoading, setFamily, setError]
  );

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
          type: EFamilyActionType.REMOVE_INVITE,
          inviteId,
        });
        // If family was created, update state
        if (result.family) {
          const transformedFamily = transformBackendFamily(result.family);
          setFamily(transformedFamily);
          // Return original backend format in response
          return result;
        }
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
    [httpClient, setLoading, setFamily, setError]
  );

  /**
   * Clear family from state
   * Used when user no longer has a familyId
   */
  const clearFamily = useCallback((): void => {
    setFamily(null);
  }, [setFamily]);

  return {
    state,
    setLoading,
    setInvites,
    setSentInvites,
    setFamily,
    setError,
    clearError,
    sendInvite,
    getInvites,
    getFamily,
    respondToInvite,
    clearFamily,
  };
};

