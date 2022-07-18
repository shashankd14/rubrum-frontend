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
    RESET_RATES_REQUEST,
    DELETE_RATES_BY_ID,
    DELETE_RATES_BY_ID_SUCCESS,
    DELETE_RATES_BY_ID_ERROR,
    ADD_ADDITIONAL_RATES_REQUEST,
    ADD_ADDITIONAL_RATES_SUCCESS,
    ADD_ADDITIONAL_RATES_ERROR,
    FETCH_STATIC_LIST_BY_PROCESSS,
    FETCH_STATIC_LIST_BY_PROCESSS_ERROR,
    FETCH_STATIC_LIST_BY_PROCESSS_SUCCESS,
    FETCH_ADDITIONAL_RATES_LIST_REQUEST,
    FETCH_ADDITIONAL_RATES_LIST_REQUEST_ERROR,
    FETCH_ADDITIONAL_RATES_LIST_REQUEST_SUCCESS,
    FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST,
    FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST_SUCCESS,
    FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST_ERROR
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
export const deleteRates = (payload) => ({
    type: DELETE_RATES_BY_ID,
    payload
});

export const deleteRatesSuccess = (rates) => ({
    type: DELETE_RATES_BY_ID_SUCCESS,
    rates
});

export const deleteRatesError = (error) => ({
    type: DELETE_RATES_BY_ID_ERROR,
    error
});
export const addAdditionalRates = (payload) => ({
    type: ADD_ADDITIONAL_RATES_REQUEST,
    payload
});

export const addAdditionalRatesSuccess = () => ({
    type: ADD_ADDITIONAL_RATES_SUCCESS
});

export const addAdditionalRatesError = (error) => ({
    type: ADD_ADDITIONAL_RATES_ERROR,
    error
});
export const getStaticList = (processId) => ({
    type: FETCH_STATIC_LIST_BY_PROCESSS,
    processId
});

export const getStaticListSuccess = (rates) => ({
    type: FETCH_STATIC_LIST_BY_PROCESSS_SUCCESS,
    rates
});

export const getStaticListError = (error) => ({
    type: FETCH_STATIC_LIST_BY_PROCESSS_ERROR,
    error
});
export const fetchAdditionalPriceList = () => ({
    type: FETCH_ADDITIONAL_RATES_LIST_REQUEST,
});

export const fetchAdditionalRatesListSuccess = (ratesList) => ({
    type: FETCH_ADDITIONAL_RATES_LIST_REQUEST_SUCCESS,
    ratesList
});

export const fetchAdditionalRatesListError = (error) => ({
    type: FETCH_ADDITIONAL_RATES_LIST_REQUEST_ERROR,
    error
});
export const fetchAdditionalPriceListById = (rateId) => ({
    type: FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST,
    rateId
});

export const fetchAdditionalPriceListByIdSuccess = (rates) => ({
    type: FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST_SUCCESS,
    rates
});

export const fetchAdditionalPriceListByIdError = (error) => ({
    type: FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST_ERROR,
    error
});