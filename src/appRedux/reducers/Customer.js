import {
    FETCH_CUSTOMER_LIST_REQUEST,
    FETCH_CUSTOMER_LIST_SUCCESS,
    FETCH_CUSTOMER_LIST_ERROR,
    ADD_CUSTOMER_REQUEST,
    ADD_CUSTOMER_SUCCESS,
    ADD_CUSTOMER_ERROR,
    FETCH_CUSTOMER_LIST_ID_ERROR, 
    FETCH_CUSTOMER_LIST_ID_REQUEST, 
    FETCH_CUSTOMER_LIST_ID_SUCCESS,
    UPDATE_CUSTOMER_REQUEST,
    UPDATE_CUSTOMER_SUCCESS,
    UPDATE_CUSTOMER_ERROR,
    RESET_CUSTOMER_REQUEST
} from "../../constants/ActionTypes";

const INIT_STATE = {
    customerList: [],
    customer: {},
    loading: false,
    error: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_CUSTOMER_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_CUSTOMER_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                customerList: action.customerList
            }
        }
        case FETCH_CUSTOMER_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                customerList: [],
                error: true
            }
        }

        case ADD_CUSTOMER_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case ADD_CUSTOMER_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case ADD_CUSTOMER_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_CUSTOMER_LIST_ID_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_CUSTOMER_LIST_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                customer: action.customer
            }
        }
        case FETCH_CUSTOMER_LIST_ID_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case RESET_CUSTOMER_REQUEST: {
            return {
                ...state,
                customer: {}
            }
        }

        case UPDATE_CUSTOMER_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case UPDATE_CUSTOMER_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case UPDATE_CUSTOMER_ERROR: {
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
