import {
    FETCH_MAIN_CATEGORY_LIST_REQUEST,
    FETCH_MAIN_CATEGORY_LIST_SUCCESS,
    FETCH_MAIN_CATEGORY_LIST_ERROR,
    ADD_MAIN_CATEGORY_REQUEST,
    ADD_MAIN_CATEGORY_SUCCESS,
    ADD_MAIN_CATEGORY_ERROR,
    FETCH_MAIN_CATEGORY_LIST_ID_REQUEST,
    FETCH_MAIN_CATEGORY_LIST_ID_SUCCESS,
    FETCH_MAIN_CATEGORY_LIST_ID_ERROR,
    RESET_MAIN_CATEGORY_REQUEST,
    UPDATE_MAIN_CATEGORY_REQUEST,
    UPDATE_MAIN_CATEGORY_SUCCESS,
    UPDATE_MAIN_CATEGORY_ERROR,
    FETCH_SUB_CATEGORY_LIST_REQUEST,
    FETCH_SUB_CATEGORY_LIST_SUCCESS,
    FETCH_SUB_CATEGORY_LIST_ERROR,
    ADD_SUB_CATEGORY_REQUEST,
    ADD_SUB_CATEGORY_SUCCESS,
    ADD_SUB_CATEGORY_ERROR,
    FETCH_SUB_CATEGORY_LIST_ID_REQUEST,
    FETCH_SUB_CATEGORY_LIST_ID_SUCCESS,
    FETCH_SUB_CATEGORY_LIST_ID_ERROR,
    RESET_SUB_CATEGORY_REQUEST,
    UPDATE_SUB_CATEGORY_REQUEST,
    UPDATE_SUB_CATEGORY_SUCCESS,
    UPDATE_SUB_CATEGORY_ERROR
} from "../../constants/ActionTypes";

const INIT_STATE = {
    mainCategoryList: [],
    mainCategoryId: {},
    subCategoryList: [],
    subCategoryId: {},
    loading: false,
    error: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_MAIN_CATEGORY_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_MAIN_CATEGORY_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                mainCategoryList: action.MainCategoryList
            }
        }
        case FETCH_MAIN_CATEGORY_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                mainCategoryList: [],
                error: true
            }
        }

        case ADD_MAIN_CATEGORY_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case ADD_MAIN_CATEGORY_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case ADD_MAIN_CATEGORY_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_MAIN_CATEGORY_LIST_ID_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_MAIN_CATEGORY_LIST_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                mainCategoryId: action.mainCategory
            }
        }
        case FETCH_MAIN_CATEGORY_LIST_ID_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case RESET_MAIN_CATEGORY_REQUEST: {
            return {
                ...state,
                category: {}
            }
        }

        case UPDATE_MAIN_CATEGORY_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case UPDATE_MAIN_CATEGORY_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case UPDATE_MAIN_CATEGORY_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        //SUB CATEGORY
        case FETCH_SUB_CATEGORY_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_SUB_CATEGORY_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                subCategoryList: action.SubCategoryList
            }
        }
        case FETCH_SUB_CATEGORY_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                subCategoryList: [],
                error: true
            }
        }

        case ADD_SUB_CATEGORY_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case ADD_SUB_CATEGORY_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case ADD_SUB_CATEGORY_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_SUB_CATEGORY_LIST_ID_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_SUB_CATEGORY_LIST_ID_SUCCESS: {
            debugger
            return {
                ...state,
                loading: false,
                subCategoryId: action.SubCategory
            }
        }
        case FETCH_SUB_CATEGORY_LIST_ID_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case RESET_SUB_CATEGORY_REQUEST: {
            return {
                ...state,
                category: {}
            }
        }

        case UPDATE_SUB_CATEGORY_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case UPDATE_SUB_CATEGORY_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case UPDATE_SUB_CATEGORY_ERROR: {
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
