import {
    FETCH_MANUFACTURER_LIST_REQUEST,
    FETCH_MANUFACTURER_LIST_SUCCESS,
    FETCH_MANUFACTURER_LIST_ERROR,
    ADD_MANUFACTURER_REQUEST,
    ADD_MANUFACTURER_SUCCESS,
    ADD_MANUFACTURER_ERROR,
    FETCH_MANUFACTURER_LIST_ID_ERROR, 
    FETCH_MANUFACTURER_LIST_ID_REQUEST, 
    FETCH_MANUFACTURER_LIST_ID_SUCCESS,
    UPDATE_MANUFACTURER_REQUEST,
    UPDATE_MANUFACTURER_SUCCESS,
    UPDATE_MANUFACTURER_ERROR,
    RESET_MANUFACTURER_REQUEST,
} from "../../constants/ActionTypes";

const INIT_STATE = {
    manufacturerList: [],
    manufacturerId: {},
    loading: false,
    error: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_MANUFACTURER_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_MANUFACTURER_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                manufacturerList: action.ManufacturerList
            }
        }
        case FETCH_MANUFACTURER_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                manufacturerList: [],
                error: true
            }
        }

        case ADD_MANUFACTURER_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case ADD_MANUFACTURER_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case ADD_MANUFACTURER_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_MANUFACTURER_LIST_ID_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_MANUFACTURER_LIST_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                manufacturerId: action.Manufacturer
            }
        }
        case FETCH_MANUFACTURER_LIST_ID_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case RESET_MANUFACTURER_REQUEST: {
            return {
                ...state,
                manufacturer: {}
            }
        }

        case UPDATE_MANUFACTURER_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case UPDATE_MANUFACTURER_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case UPDATE_MANUFACTURER_ERROR: {
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
