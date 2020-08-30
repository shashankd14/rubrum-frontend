import {
    FETCH_INWARD_LIST_REQUEST,
    FETCH_INWARD_LIST_SUCCESS,
    FETCH_INWARD_LIST_ERROR,

    SET_INWARD_DETAILS,
    SUBMIT_INWARD_ENTRY,
    SUBMIT_INWARD_SUCCESS,
    SUBMIT_INWARD_ERROR, CHECK_COIL_EXISTS, CHECK_COIL_EXISTS_SUCCESS, CHECK_COIL_EXISTS_ERROR,
} from "../../constants/ActionTypes";

const INIT_STATE = {
    inwardList: [],
    loading: false,
    success: false,
    error: false,
    inward: {}
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_INWARD_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_INWARD_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                inwardList: action.inwardList
            }
        }
        case CHECK_COIL_EXISTS: {
            return {
                ...state,
                loading: true,
            }
        }
        case CHECK_COIL_EXISTS_SUCCESS: {
            return {
                ...state,
                loading: false,
                success: true,
                duplicateCoil: action.status
            }
        }
        case CHECK_COIL_EXISTS_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }
        case FETCH_INWARD_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                inwardList: [],
                error: true
            }
        }
        case SET_INWARD_DETAILS: {
            return {
                ...state,
                inward: action.inward
            }
        }
        case SUBMIT_INWARD_ENTRY: {
            return {
                ...state,
                loading: true,
            }
        }
        case SUBMIT_INWARD_SUCCESS: {
            return {
                ...state,
                loading: false,
            }
        }
        case SUBMIT_INWARD_ERROR: {
            return {
                ...state,
                loading: false,
                error: true
            }
        }
        default:
            return state;
    }
}
