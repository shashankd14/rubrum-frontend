import {
    FETCH_INWARD_DV_LIST_REQUEST,
    FETCH_INWARD_DV_LIST_SUCCESS,
    FETCH_INWARD_DV_LIST_ERROR,
    ADD_INWARD_DV_REQUEST,
    ADD_INWARD_DV_SUCCESS,
    ADD_INWARD_DV_ERROR,
    FETCH_INWARD_DV_LIST_ID_ERROR, 
    FETCH_INWARD_DV_LIST_ID_REQUEST, 
    FETCH_INWARD_DV_LIST_ID_SUCCESS,
    UPDATE_INWARD_DV_REQUEST,
    UPDATE_INWARD_DV_SUCCESS,
    UPDATE_INWARD_DV_ERROR,
    RESET_INWARD_DV_REQUEST,
    GENERATE_INWARD_ID_REQUEST,
    GENERATE_INWARD_ID_SUCCESS,
    GENERATE_INWARD_ID_ERROR,
    GENERATE_CONSIGNMENT_ID_REQUEST,
    GENERATE_CONSIGNMENT_ID_SUCCESS,
    GENERATE_CONSIGNMENT_ID_ERROR,
    SET_INWARD_DV_DETAILS,
} from "../../constants/ActionTypes";

const INIT_STATE = {
    inwardDVList: [],
    inwardDVId: {},
    loading: false,
    error: false,
    inwardId: {},
    consignmentId: {},
    inward: {},
    inwardEntry: {},
    inwardSubmitLoading: false,
    inwardSubmitSuccess: false,
    inwardSubmitError: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_INWARD_DV_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_INWARD_DV_LIST_SUCCESS: {
            debugger
            return {
                ...state,
                loading: false,
                inwardDVList: action.InwardDVList
            }
        }
        case FETCH_INWARD_DV_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                inwardDVList: [],
                error: true
            }
        }

        case ADD_INWARD_DV_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case ADD_INWARD_DV_SUCCESS: {
            return {
                ...state,
                inwardSubmitLoading: false,
                inwardSubmitSuccess: true
            }
        }
        case ADD_INWARD_DV_ERROR: {
            return {
                ...state,
                inwardSubmitLoading: false,
                inwardSubmitError: true,
                inwardSubmitSuccess: false
            }
        }

        case FETCH_INWARD_DV_LIST_ID_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_INWARD_DV_LIST_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                inwardDVId: action.InwardDV
            }
        }
        case FETCH_INWARD_DV_LIST_ID_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case RESET_INWARD_DV_REQUEST: {
            return {
                ...state,
                inwardDVId: {},
                inwardSubmitLoading: false,
                inwardSubmitSuccess: false,
                inwardSubmitError: false,
            }
        }

        case UPDATE_INWARD_DV_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case UPDATE_INWARD_DV_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case UPDATE_INWARD_DV_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }
        case GENERATE_INWARD_ID_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case GENERATE_INWARD_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                inwardId: action.InwardId
            }
        }
        case GENERATE_INWARD_ID_ERROR: {
            return {
                ...state,
                loading: false,
                inwardId: {},
                error: true
            }
        }
        case GENERATE_CONSIGNMENT_ID_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case GENERATE_CONSIGNMENT_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                consignmentId: action.ConsignmentId
            }
        }
        case GENERATE_CONSIGNMENT_ID_ERROR: {
            return {
                ...state,
                loading: false,
                consignmentId: {},
                error: true
            }
        }
        case SET_INWARD_DV_DETAILS: {
            return {
                ...state,
                inward: action.inward,
                inwardEntry: action.inward
            }
        }
        
        default:
            return state;
    }
}
