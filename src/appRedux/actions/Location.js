import {FETCH_LOCATION_LIST_ERROR, FETCH_LOCATION_LIST_REQUEST, FETCH_LOCATION_LIST_SUCCESS,
    FETCH_LOCATION_LIST_ID_ERROR, FETCH_LOCATION_LIST_ID_REQUEST, FETCH_LOCATION_LIST_ID_SUCCESS,
    ADD_LOCATION_REQUEST,
    ADD_LOCATION_SUCCESS,
    ADD_LOCATION_ERROR,
    UPDATE_LOCATION_REQUEST,
    UPDATE_LOCATION_SUCCESS,
    UPDATE_LOCATION_ERROR,
    RESET_LOCATION_REQUEST,
} from "../../constants/ActionTypes";
import * as actionTypes from "../../constants/ActionTypes";

export const fetchLocationList = (payload) => ({
    type: actionTypes.FETCH_LOCATION_LIST_REQUEST,
    payload
});

export const fetchLocationListSuccess = (LocationList) => ({
    type: actionTypes.FETCH_LOCATION_LIST_SUCCESS,
    LocationList
});

export const fetchLocationListError = (error) => ({
    type: FETCH_LOCATION_LIST_ERROR,
    error
});

export const addLocation = (payload) => ({
    type: ADD_LOCATION_REQUEST,
    payload
});

export const addLocationSuccess = () => ({
    type: ADD_LOCATION_SUCCESS
});

export const addLocationError = (error) => ({
    type: ADD_LOCATION_ERROR,
    error
});

export const fetchLocationListId = (payload) => ({
    type: FETCH_LOCATION_LIST_ID_REQUEST,
    payload
});

export const fetchLocationListIdSuccess = (Location) => ({
    type: FETCH_LOCATION_LIST_ID_SUCCESS,
    Location
});

export const fetchLocationListIdError = (error) => ({
    type: FETCH_LOCATION_LIST_ID_ERROR,
    error
});

export const resetLocation = () => ({
    type: RESET_LOCATION_REQUEST
});

export const updateLocation = (payload) => ({
    type: UPDATE_LOCATION_REQUEST,
    payload
});

export const updateLocationSuccess = () => ({
    type: UPDATE_LOCATION_SUCCESS
});

export const updateLocationError = (error) => ({
    type: UPDATE_LOCATION_ERROR,
    error
});

export const deleteLocation = (payload) => ({
    type: actionTypes.DELETE_LOCATION_REQUEST,
    payload
});

export const deleteLocationSuccess = () => ({
    type: actionTypes.DELETE_LOCATION_SUCCESS
});

export const deleteLocationError = (error) => ({
    type: actionTypes.DELETE_LOCATION_ERROR,
    error
});

export const fetchStateList = (payload) => ({
    type: actionTypes.FETCH_STATE_LIST_REQUEST,
    payload
});

export const fetchStateListSuccess = (StateList) => ({
    type: actionTypes.FETCH_STATE_LIST_SUCCESS,
    StateList
});

export const fetchStateListError = (error) => ({
    type: actionTypes.FETCH_STATE_LIST_ERROR,
    error
});