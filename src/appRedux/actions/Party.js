import {FETCH_PARTY_LIST_ERROR, FETCH_PARTY_LIST_REQUEST, FETCH_PARTY_LIST_SUCCESS} from "../../constants/ActionTypes";

export const fetchPartyList = () => ({
    type: FETCH_PARTY_LIST_REQUEST,
});

export const fetchPartyListSuccess = (partyList) => ({
    type: FETCH_PARTY_LIST_SUCCESS,
    partyList
});

export const fetchPartyListError = (error) => ({
    type: FETCH_PARTY_LIST_ERROR,
    error
});