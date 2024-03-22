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

export const fetchLocationList = () => ({
    type: actionTypes.FETCH_LOCATION_LIST_REQUEST,
});

export const fetchLocationListSuccess = (LocationList) => ({
    type: actionTypes.FETCH_LOCATION_LIST_SUCCESS,
    LocationList
});

export const fetchLocationListError = (error) => ({
    type: FETCH_LOCATION_LIST_ERROR,
    error
});

export const addLocation = (Location) => ({
    type: ADD_LOCATION_REQUEST,
    Location
});

export const addLocationSuccess = () => ({
    type: ADD_LOCATION_SUCCESS
});

export const addLocationError = (error) => ({
    type: ADD_LOCATION_ERROR,
    error
});

export const fetchLocationListId = (LocationId) => ({
    type: FETCH_LOCATION_LIST_ID_REQUEST,
    LocationId
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

export const updateLocation = (Location) => ({
    type: UPDATE_LOCATION_REQUEST,
    Location
});

export const updateLocationSuccess = () => ({
    type: UPDATE_LOCATION_SUCCESS
});

export const updateLocationError = (error) => ({
    type: UPDATE_LOCATION_ERROR,
    error
});