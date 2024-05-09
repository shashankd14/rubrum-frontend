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
    UPDATE_YLR_ERROR,
    DELETE_YLR_REQUEST,
    DELETE_YLR_SUCCESS,
    DELETE_YLR_ERROR
} from "../../constants/ActionTypes";

export const fetchYLRList = (payload) => ({
    type: FETCH_YLR_LIST_REQUEST,
    payload
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

export const fetchYLRbyId = (payload) => ({
    type: FETCH_YLR_BY_ID_REQUEST,
    payload
});

export const fetchYLRbyIdSuccess = (YLR) => ({
    type: FETCH_YLR_BY_ID_SUCCESS,
    YLR
});

export const fetchYLRbyIdError = (error) => ({
    type: FETCH_YLR_BY_ID_ERROR,
    error
});

export const resetYLR = () => ({
    type: RESET_YLR_REQUEST
});

export const updateYLR = (payload) => ({
    type: UPDATE_YLR_REQUEST,
    payload
});

export const updateYLRSuccess = () => ({
    type: UPDATE_YLR_SUCCESS
});

export const updateYLRError = (error) => ({
    type: UPDATE_YLR_ERROR,
    error
});

export const deleteYLR = (payload) => ({
    type: DELETE_YLR_REQUEST,
    payload
});

export const deleteYLRSuccess = (YLR) => ({
    type: DELETE_YLR_SUCCESS,
    YLR
});

export const deleteYLRError = (error) => ({
    type: DELETE_YLR_ERROR,
    error
});