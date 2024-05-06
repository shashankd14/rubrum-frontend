import {
    FETCH_ITEMGRADE_LIST_REQUEST,
    FETCH_ITEMGRADE_LIST_SUCCESS,
    FETCH_ITEMGRADE_LIST_ERROR,
    ADD_ITEMGRADE_REQUEST,
    ADD_ITEMGRADE_SUCCESS,
    ADD_ITEMGRADE_ERROR,
    FETCH_ITEMGRADE_LIST_ID_ERROR, 
    FETCH_ITEMGRADE_LIST_ID_REQUEST, 
    FETCH_ITEMGRADE_LIST_ID_SUCCESS,
    UPDATE_ITEMGRADE_REQUEST,
    UPDATE_ITEMGRADE_SUCCESS,
    UPDATE_ITEMGRADE_ERROR,
    RESET_ITEMGRADE_REQUEST,
} from "../../constants/ActionTypes";

const INIT_STATE = {
    itemGradeList: [],
    itemGradeId: {},
    loading: false,
    error: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_ITEMGRADE_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_ITEMGRADE_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                itemGradeList: action.ItemGradeList
            }
        }
        case FETCH_ITEMGRADE_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                itemGradeList: [],
                error: true
            }
        }

        case ADD_ITEMGRADE_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case ADD_ITEMGRADE_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case ADD_ITEMGRADE_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_ITEMGRADE_LIST_ID_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_ITEMGRADE_LIST_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                itemGradeId: action.ItemGrade
            }
        }
        case FETCH_ITEMGRADE_LIST_ID_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case RESET_ITEMGRADE_REQUEST: {
            return {
                ...state,
                ItemGrade: {}
            }
        }

        case UPDATE_ITEMGRADE_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case UPDATE_ITEMGRADE_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case UPDATE_ITEMGRADE_ERROR: {
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
