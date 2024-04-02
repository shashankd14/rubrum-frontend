import {
    FETCH_YLR_LIST_REQUEST,
    FETCH_YLR_LIST_SUCCESS,
    FETCH_YLR_LIST_ERROR,
    ADD_YLR_REQUEST,
    ADD_YLR_SUCCESS,
    ADD_YLR_ERROR,
    FETCH_YLR_BY_ID_REQUEST,
    FETCH_YLR_BY_ID_SUCCESS,
    FETCH_YLR_BY_ID_ERROR,
    RESET_YLR_REQUEST,
    UPDATE_YLR_REQUEST,
    UPDATE_YLR_SUCCESS,
    UPDATE_YLR_ERROR,
    DELETE_YLR_REQUEST,
    DELETE_YLR_SUCCESS,
    DELETE_YLR_ERROR
} from "../../constants/ActionTypes";

const INIT_STATE = {
    YLRList: [],
    YLR: {},
    loading: false,
    error: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_YLR_LIST_REQUEST: {
            debugger
    console.log("reducerrrrrrr", action);
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_YLR_LIST_SUCCESS: {
            debugger
            
    console.log("reducer Successsssssssssssss", action.YLRList);
            return {
                ...state,
                loading: false,
                YLRList: action.YLRList
            }
        }
        case FETCH_YLR_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                YLRList: [],
                error: true
            }
        }

        case ADD_YLR_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case ADD_YLR_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case ADD_YLR_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_YLR_BY_ID_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_YLR_BY_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                YLR: action.YLR
            }
        }
        case FETCH_YLR_BY_ID_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case RESET_YLR_REQUEST: {
            return {
                ...state,
                YLR: {}
            }
        }

        case UPDATE_YLR_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case UPDATE_YLR_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case UPDATE_YLR_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }
        case DELETE_YLR_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case DELETE_YLR_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case DELETE_YLR_ERROR: {
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
