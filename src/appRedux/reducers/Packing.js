import {
    FETCH_PACKING_LIST_REQUEST,
    FETCH_PACKING_LIST_SUCCESS,
    FETCH_PACKING_LIST_ERROR,
    ADD_PACKING_REQUEST,
    ADD_PACKING_SUCCESS,
    ADD_PACKING_ERROR,
    FETCH_PACKING_LIST_ID_REQUEST,
    FETCH_PACKING_LIST_ID_SUCCESS,
    FETCH_PACKING_LIST_ID_ERROR,
    UPDATE_PACKING_REQUEST,
    UPDATE_PACKING_SUCCESS,
    UPDATE_PACKING_ERROR,
    RESET_PACKING_REQUEST
} from "../../constants/ActionTypes";

const INIT_STATE = {
    packingList: [],
    packing: {},
    loading: false,
    error: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_PACKING_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_PACKING_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                packingList: action.packingList
            }
        }
        case FETCH_PACKING_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                packingList: [],
                error: true
            }
        }

        case ADD_PACKING_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case ADD_PACKING_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case ADD_PACKING_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_PACKING_LIST_ID_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_PACKING_LIST_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                packing: action.packing
            }
        }
        case FETCH_PACKING_LIST_ID_ERROR: {
            return {
                ...state,
                loading: false,
                packing: {},
                error: true
            }
        }

        case RESET_PACKING_REQUEST: {
            return {
                ...state,
                packing: {}
            }
        }

        case UPDATE_PACKING_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case UPDATE_PACKING_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case UPDATE_PACKING_ERROR: {
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
