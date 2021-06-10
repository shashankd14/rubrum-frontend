import {FETCH_RATES_LIST_ERROR, FETCH_RATES_LIST_REQUEST, FETCH_RATES_LIST_SUCCESS} from "../../constants/ActionTypes";

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