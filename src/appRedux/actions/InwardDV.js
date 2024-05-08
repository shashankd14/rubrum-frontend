import {FETCH_INWARD_DV_LIST_ERROR, FETCH_INWARD_DV_LIST_REQUEST, FETCH_INWARD_DV_LIST_SUCCESS,
    FETCH_INWARD_DV_LIST_ID_ERROR, FETCH_INWARD_DV_LIST_ID_REQUEST, FETCH_INWARD_DV_LIST_ID_SUCCESS,
    ADD_INWARD_DV_REQUEST,
    ADD_INWARD_DV_SUCCESS,
    ADD_INWARD_DV_ERROR,
    UPDATE_INWARD_DV_REQUEST,
    UPDATE_INWARD_DV_SUCCESS,
    UPDATE_INWARD_DV_ERROR,
    RESET_INWARD_DV_REQUEST,
} from "../../constants/ActionTypes";
import * as actionTypes from "../../constants/ActionTypes";

export const fetchInwardDVList = (payload) => ({
    type: actionTypes.FETCH_INWARD_DV_LIST_REQUEST,
    payload
});

export const fetchInwardDVListSuccess = (InwardDVList) => ({
    type: actionTypes.FETCH_INWARD_DV_LIST_SUCCESS,
    InwardDVList
});

export const fetchInwardDVListError = (error) => ({
    type: FETCH_INWARD_DV_LIST_ERROR,
    error
});

export const addInwardDV = (payload) => ({
    type: ADD_INWARD_DV_REQUEST,
    payload
});

export const addInwardDVSuccess = () => ({
    type: ADD_INWARD_DV_SUCCESS
});

export const addInwardDVError = (error) => ({
    type: ADD_INWARD_DV_ERROR,
    error
});

export const fetchInwardDVListId = (payload) => ({
    type: FETCH_INWARD_DV_LIST_ID_REQUEST,
    payload
});

export const fetchInwardDVListIdSuccess = (InwardDV) => ({
    type: FETCH_INWARD_DV_LIST_ID_SUCCESS,
    InwardDV
});

export const fetchInwardDVListIdError = (error) => ({
    type: FETCH_INWARD_DV_LIST_ID_ERROR,
    error
});

export const resetInwardDV = () => ({
    type: RESET_INWARD_DV_REQUEST
});
export const updateInwardDV = (payload) => ({
    type: UPDATE_INWARD_DV_REQUEST,
    payload
});

export const updateInwardDVSuccess = () => ({
    type: UPDATE_INWARD_DV_SUCCESS
});

export const updateInwardDVError = (error) => ({
    type: UPDATE_INWARD_DV_ERROR,
    error
});

export const deleteInwardDV = (payload) => ({
    type: actionTypes.DELETE_INWARD_DV_REQUEST,
    payload
});

export const deleteInwardDVSuccess = () => ({
    type: actionTypes.DELETE_INWARD_DV_SUCCESS
});

export const deleteInwardDVError = (error) => ({
    type: actionTypes.DELETE_INWARD_DV_ERROR,
    error
});
//Generate Inward Id
export const generateInwardId = (payload) => ({
    type: actionTypes.GENERATE_INWARD_ID_REQUEST,
    payload
});

export const generateInwardIdSuccess = (InwardId) => ({
    type: actionTypes.GENERATE_INWARD_ID_SUCCESS,
    InwardId
});

export const generateInwardIdError = (error) => ({
    type: actionTypes.GENERATE_INWARD_ID_ERROR,
    error
});

export const setInwardDVDetails = (inward) => ({
    type: actionTypes.SET_INWARD_DV_DETAILS,
    inward
});

//Generate consignment Id
export const generateConsignmentId = (payload) => ({
    type: actionTypes.GENERATE_CONSIGNMENT_ID_REQUEST,
    payload
});

export const generateConsignmentIdSuccess = (ConsignmentId) => ({
    type: actionTypes.GENERATE_CONSIGNMENT_ID_SUCCESS,
    ConsignmentId
});

export const generateConsignmentIdError = (error) => ({
    type: actionTypes.GENERATE_CONSIGNMENT_ID_ERROR,
    error
});