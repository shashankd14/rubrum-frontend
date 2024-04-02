import {
    FETCH_YLR_LIST_REQUEST,
    FETCH_YLR_LIST_SUCCESS,
    FETCH_YLR_LIST_ERROR,
    ADD_YLR_REQUEST,
    ADD_YLR_SUCCESS,
    ADD_YLR_ERROR,
    FETCH_YLR_BY_ID_REQUEST,
    FETCH_YLR_BY_ID_SUCCESS,
    FETCH_YLR_BY_ID_ERROR,
    RESET_YLR_REQUEST,
    UPDATE_YLR_REQUEST,
    UPDATE_YLR_SUCCESS,
    UPDATE_YLR_ERROR
} from "../../constants/ActionTypes";

export const fetchYLRList = (request) => ({
    type: FETCH_YLR_LIST_REQUEST,
    request: request
});

export const fetchYLRListSuccess = (YLRList) => ({
    type: FETCH_YLR_LIST_SUCCESS,
    YLRList
});

export const fetchYLRListError = (error) => ({
    type: FETCH_YLR_LIST_ERROR,
    error
});

export const addYLR = (YLR) => ({
    type: ADD_YLR_REQUEST,
    YLR
});

export const addYLRSuccess = () => ({
    type: ADD_YLR_SUCCESS
});

export const addYLRError = (error) => ({
    type: ADD_YLR_ERROR,
    error
});

export const fetchYLRbyId = (YLRId) => ({
    type: FETCH_YLR_BY_ID_REQUEST,
    YLRId
});

export const fetchPartyListIdSuccess = (YLR) => ({
    type: FETCH_YLR_BY_ID_SUCCESS,
    YLR
});

export const fetchPartyListIdError = (error) => ({
    type: FETCH_YLR_BY_ID_ERROR,
    error
});

export const resetYLR = () => ({
    type: RESET_YLR_REQUEST
});

export const updateParty = (YLR) => ({
    type: UPDATE_YLR_REQUEST,
    YLR
});

export const updateYLRSuccess = () => ({
    type: UPDATE_YLR_SUCCESS
});

export const updatePartyError = (error) => ({
    type: UPDATE_YLR_ERROR,
    error
});