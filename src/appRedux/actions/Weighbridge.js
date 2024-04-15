import {FETCH_WEIGHBRIDGE_LIST_ERROR, FETCH_WEIGHBRIDGE_LIST_REQUEST, FETCH_WEIGHBRIDGE_LIST_SUCCESS,
    FETCH_WEIGHBRIDGE_LIST_ID_ERROR, FETCH_WEIGHBRIDGE_LIST_ID_REQUEST, FETCH_WEIGHBRIDGE_LIST_ID_SUCCESS,
    ADD_WEIGHBRIDGE_REQUEST,
    ADD_WEIGHBRIDGE_SUCCESS,
    ADD_WEIGHBRIDGE_ERROR,
    UPDATE_WEIGHBRIDGE_REQUEST,
    UPDATE_WEIGHBRIDGE_SUCCESS,
    UPDATE_WEIGHBRIDGE_ERROR,
    RESET_WEIGHBRIDGE_REQUEST,
} from "../../constants/ActionTypes";
import * as actionTypes from "../../constants/ActionTypes";

export const fetchWeighbridgeList = (payload) => ({
    type: actionTypes.FETCH_WEIGHBRIDGE_LIST_REQUEST,
    payload
});

export const fetchWeighbridgeListSuccess = (WeighbridgeList) => ({
    type: actionTypes.FETCH_WEIGHBRIDGE_LIST_SUCCESS,
    WeighbridgeList
});

export const fetchWeighbridgeListError = (error) => ({
    type: FETCH_WEIGHBRIDGE_LIST_ERROR,
    error
});

export const addWeighbridge = (payload) => ({
    type: ADD_WEIGHBRIDGE_REQUEST,
    payload
});

export const addWeighbridgeSuccess = () => ({
    type: ADD_WEIGHBRIDGE_SUCCESS
});

export const addWeighbridgeError = (error) => ({
    type: ADD_WEIGHBRIDGE_ERROR,
    error
});

export const fetchWeighbridgeListId = (payload) => ({
    type: FETCH_WEIGHBRIDGE_LIST_ID_REQUEST,
    payload
});

export const fetchWeighbridgeListIdSuccess = (Weighbridge) => ({
    type: FETCH_WEIGHBRIDGE_LIST_ID_SUCCESS,
    Weighbridge
});

export const fetchWeighbridgeListIdError = (error) => ({
    type: FETCH_WEIGHBRIDGE_LIST_ID_ERROR,
    error
});

export const resetWeighbridge = () => ({
    type: RESET_WEIGHBRIDGE_REQUEST
});

export const updateWeighbridge = (payload) => ({
    type: UPDATE_WEIGHBRIDGE_REQUEST,
    payload
});

export const updateWeighbridgeSuccess = () => ({
    type: UPDATE_WEIGHBRIDGE_SUCCESS
});

export const updateWeighbridgeError = (error) => ({
    type: UPDATE_WEIGHBRIDGE_ERROR,
    error
});

export const deleteWeighbridge = (payload) => ({
    type: actionTypes.DELETE_WEIGHBRIDGE_REQUEST,
    payload
});

export const deleteWeighbridgeSuccess = () => ({
    type: actionTypes.DELETE_WEIGHBRIDGE_SUCCESS
});

export const deleteWeighbridgeError = (error) => ({
    type: actionTypes.DELETE_WEIGHBRIDGE_ERROR,
    error
});
