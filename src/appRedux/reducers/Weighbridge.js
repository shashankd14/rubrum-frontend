import {
    FETCH_WEIGHBRIDGE_LIST_REQUEST,
    FETCH_WEIGHBRIDGE_LIST_SUCCESS,
    FETCH_WEIGHBRIDGE_LIST_ERROR,
    ADD_WEIGHBRIDGE_REQUEST,
    ADD_WEIGHBRIDGE_SUCCESS,
    ADD_WEIGHBRIDGE_ERROR,
    FETCH_WEIGHBRIDGE_LIST_ID_ERROR, 
    FETCH_WEIGHBRIDGE_LIST_ID_REQUEST, 
    FETCH_WEIGHBRIDGE_LIST_ID_SUCCESS,
    UPDATE_WEIGHBRIDGE_REQUEST,
    UPDATE_WEIGHBRIDGE_SUCCESS,
    UPDATE_WEIGHBRIDGE_ERROR,
    RESET_WEIGHBRIDGE_REQUEST,
} from "../../constants/ActionTypes";

const INIT_STATE = {
    weighbridgeList: [],
    weighbridgeId: {},
    loading: false,
    error: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_WEIGHBRIDGE_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_WEIGHBRIDGE_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                weighbridgeList: action.WeighbridgeList
            }
        }
        case FETCH_WEIGHBRIDGE_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                weighbridgeList: [],
                error: true
            }
        }

        case ADD_WEIGHBRIDGE_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case ADD_WEIGHBRIDGE_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case ADD_WEIGHBRIDGE_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_WEIGHBRIDGE_LIST_ID_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_WEIGHBRIDGE_LIST_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                weighbridgeId: action.Weighbridge
            }
        }
        case FETCH_WEIGHBRIDGE_LIST_ID_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case RESET_WEIGHBRIDGE_REQUEST: {
            return {
                ...state,
                Weighbridge: {}
            }
        }

        case UPDATE_WEIGHBRIDGE_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case UPDATE_WEIGHBRIDGE_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case UPDATE_WEIGHBRIDGE_ERROR: {
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
