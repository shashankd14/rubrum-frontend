import {
    FETCH_RATES_LIST_REQUEST,
    FETCH_RATES_LIST_SUCCESS,
    FETCH_RATES_LIST_ERROR,
} from "../../constants/ActionTypes";

const INIT_STATE = {
    ratesList: [],
    loading: false,
    error: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_RATES_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_RATES_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                ratesList: action.ratesList
            }
        }
        case FETCH_RATES_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                ratesList: [],
                error: true
            }
        }
        default:
            return state;
    }
}
