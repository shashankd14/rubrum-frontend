import {FETCH_RATES_LIST_ERROR, 
    FETCH_RATES_LIST_REQUEST, 
    FETCH_RATES_LIST_SUCCESS,
    ADD_RATES_REQUEST,
    ADD_RATES_SUCCESS,
    ADD_RATES_ERROR,
    FETCH_RATES_LIST_ID_REQUEST,
    FETCH_RATES_LIST_ID_SUCCESS,
    FETCH_RATES_LIST_ID_ERROR,
    UPDATE_RATES_REQUEST,
    UPDATE_RATES_SUCCESS,
    UPDATE_RATES_ERROR,
    RESET_RATES_REQUEST
} from "../../constants/ActionTypes";

export const fetchRatesList = () => ({
    type: FETCH_RATES_LIST_REQUEST,
});

export const fetchRatesListSuccess = (ratesList) => ({
    type: FETCH_RATES_LIST_SUCCESS,
    ratesList
});

export const fetchRatesListError = (error) => ({
    type: FETCH_RATES_LIST_ERROR,
    error
});

export const addRates = (rates) => ({
    type: ADD_RATES_REQUEST,
    rates
});

export const addRatesSuccess = () => ({
    type: ADD_RATES_SUCCESS
});

export const addRatesError = (error) => ({
    type: ADD_RATES_ERROR,
    error
});

export const fetchRatesListById = (rateId) => ({
    type: FETCH_RATES_LIST_ID_REQUEST,
    rateId
});

export const fetchRatesListByIdSuccess = (rates) => ({
    type: FETCH_RATES_LIST_ID_SUCCESS,
    rates
});

export const fetchRatesListByIdError = (error) => ({
    type: FETCH_RATES_LIST_ID_ERROR,
    error
});

export const resetRates = () => ({
    type: RESET_RATES_REQUEST
});

export const updateRates = (rates) => ({
    type: UPDATE_RATES_REQUEST,
    rates
});

export const updateRatesSuccess = () => ({
    type: UPDATE_RATES_SUCCESS
});

export const updateRatesError = (error) => ({
    type: UPDATE_RATES_ERROR,
    error
});