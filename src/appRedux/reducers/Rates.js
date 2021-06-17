import {
    FETCH_RATES_LIST_REQUEST,
    FETCH_RATES_LIST_SUCCESS,
    FETCH_RATES_LIST_ERROR,
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

const INIT_STATE = {
    ratesList: [],
    rates: {},
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
        case ADD_RATES_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case ADD_RATES_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case ADD_RATES_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_RATES_LIST_ID_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_RATES_LIST_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                rates: action.rates
            }
        }
        case FETCH_RATES_LIST_ID_ERROR: {
            return {
                ...state,
                loading: false,
                rates: {},
                error: true
            }
        }

        case RESET_RATES_REQUEST: {
            return {
                ...state,
                rates: {}
            }
        }

        case UPDATE_RATES_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case UPDATE_RATES_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case UPDATE_RATES_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        default:
            return state;
    }
}
