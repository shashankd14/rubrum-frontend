import {
  FETCH_PARTY_LIST_ERROR,
  FETCH_PARTY_LIST_REQUEST,
  FETCH_PARTY_LIST_SUCCESS,
  FETCH_PARTY_LIST_ID_ERROR,
  FETCH_PARTY_LIST_ID_REQUEST,
  FETCH_PARTY_LIST_ID_SUCCESS,
  ADD_PARTY_REQUEST,
  ADD_PARTY_SUCCESS,
  ADD_PARTY_ERROR,
  UPDATE_PARTY_REQUEST,
  UPDATE_PARTY_SUCCESS,
  UPDATE_PARTY_ERROR,
  RESET_PARTY_REQUEST,
} from '../../constants/ActionTypes';

export const fetchPartyList = () => ({
  type: FETCH_PARTY_LIST_REQUEST,
});

export const fetchPartyListSuccess = partyList => ({
  type: FETCH_PARTY_LIST_SUCCESS,
  partyList,
});

export const fetchPartyListError = error => ({
  type: FETCH_PARTY_LIST_ERROR,
  error,
});

export const addParty = party => ({
  type: ADD_PARTY_REQUEST,
  party,
});

export const addPartySuccess = () => ({
  type: ADD_PARTY_SUCCESS,
});

export const addPartyError = error => ({
  type: ADD_PARTY_ERROR,
  error,
});

export const fetchPartyListId = partyId => ({
  type: FETCH_PARTY_LIST_ID_REQUEST,
  partyId,
});

export const fetchPartyListIdSuccess = party => ({
  type: FETCH_PARTY_LIST_ID_SUCCESS,
  party,
});

export const fetchPartyListIdError = error => ({
  type: FETCH_PARTY_LIST_ID_ERROR,
  error,
});

export const resetParty = () => ({
  type: RESET_PARTY_REQUEST,
});

export const updateParty = party => ({
  type: UPDATE_PARTY_REQUEST,
  party,
});

export const updatePartySuccess = () => ({
  type: UPDATE_PARTY_SUCCESS,
});

export const updatePartyError = error => ({
  type: UPDATE_PARTY_ERROR,
  error,
});
