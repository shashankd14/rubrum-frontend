import {FETCH_MANUFACTURER_LIST_ERROR, FETCH_MANUFACTURER_LIST_REQUEST, FETCH_MANUFACTURER_LIST_SUCCESS,
    FETCH_MANUFACTURER_LIST_ID_ERROR, FETCH_MANUFACTURER_LIST_ID_REQUEST, FETCH_MANUFACTURER_LIST_ID_SUCCESS,
    ADD_MANUFACTURER_REQUEST,
    ADD_MANUFACTURER_SUCCESS,
    ADD_MANUFACTURER_ERROR,
    UPDATE_MANUFACTURER_REQUEST,
    UPDATE_MANUFACTURER_SUCCESS,
    UPDATE_MANUFACTURER_ERROR,
    RESET_MANUFACTURER_REQUEST,
} from "../../constants/ActionTypes";
import * as actionTypes from "../../constants/ActionTypes";

export const fetchManufacturerList = (payload) => ({
    type: actionTypes.FETCH_MANUFACTURER_LIST_REQUEST,
    payload
});

export const fetchManufacturerListSuccess = (ManufacturerList) => ({
    type: actionTypes.FETCH_MANUFACTURER_LIST_SUCCESS,
    ManufacturerList
});

export const fetchManufacturerListError = (error) => ({
    type: FETCH_MANUFACTURER_LIST_ERROR,
    error
});

export const addManufacturer = (payload) => ({
    type: ADD_MANUFACTURER_REQUEST,
    payload
});

export const addManufacturerSuccess = () => ({
    type: ADD_MANUFACTURER_SUCCESS
});

export const addManufacturerError = (error) => ({
    type: ADD_MANUFACTURER_ERROR,
    error
});

export const fetchManufacturerListId = (payload) => ({
    type: FETCH_MANUFACTURER_LIST_ID_REQUEST,
    payload
});

export const fetchManufacturerListIdSuccess = (Manufacturer) => ({
    type: FETCH_MANUFACTURER_LIST_ID_SUCCESS,
    Manufacturer
});

export const fetchManufacturerListIdError = (error) => ({
    type: FETCH_MANUFACTURER_LIST_ID_ERROR,
    error
});

export const resetManufacturer = () => ({
    type: RESET_MANUFACTURER_REQUEST
});

export const updateManufacturer = (payload) => ({
    type: UPDATE_MANUFACTURER_REQUEST,
    payload
});

export const updateManufacturerSuccess = () => ({
    type: UPDATE_MANUFACTURER_SUCCESS
});

export const updateManufacturerError = (error) => ({
    type: UPDATE_MANUFACTURER_ERROR,
    error
});

export const deleteManufacturer = (payload) => ({
    type: actionTypes.DELETE_MANUFACTURER_REQUEST,
    payload
});

export const deleteManufacturerSuccess = () => ({
    type: actionTypes.DELETE_MANUFACTURER_SUCCESS
});

export const deleteManufacturerError = (error) => ({
    type: actionTypes.DELETE_MANUFACTURER_ERROR,
    error
});
