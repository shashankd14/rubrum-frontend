import {
    FETCH_VENDOR_LIST_REQUEST,
    FETCH_VENDOR_LIST_SUCCESS,
    FETCH_VENDOR_LIST_ERROR,
    ADD_VENDOR_REQUEST,
    ADD_VENDOR_SUCCESS,
    ADD_VENDOR_ERROR,
    FETCH_VENDOR_LIST_ID_ERROR, 
    FETCH_VENDOR_LIST_ID_REQUEST, 
    FETCH_VENDOR_LIST_ID_SUCCESS,
    UPDATE_VENDOR_REQUEST,
    UPDATE_VENDOR_SUCCESS,
    UPDATE_VENDOR_ERROR,
    RESET_VENDOR_REQUEST
} from "../../constants/ActionTypes";

const INIT_STATE = {
    vendorList: [],
    vendor: {},
    loading: false,
    error: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_VENDOR_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_VENDOR_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                vendorList: action.VendorList
            }
        }
        case FETCH_VENDOR_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                vendorList: [],
                error: true
            }
        }

        case ADD_VENDOR_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case ADD_VENDOR_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case ADD_VENDOR_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_VENDOR_LIST_ID_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_VENDOR_LIST_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                vendor: action.Vendor
            }
        }
        case FETCH_VENDOR_LIST_ID_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case RESET_VENDOR_REQUEST: {
            return {
                ...state,
                vendor: {}
            }
        }

        case UPDATE_VENDOR_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case UPDATE_VENDOR_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case UPDATE_VENDOR_ERROR: {
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
