import {
    FETCH_BRAND_LIST_REQUEST,
    FETCH_BRAND_LIST_SUCCESS,
    FETCH_BRAND_LIST_ERROR,
    ADD_BRAND_REQUEST,
    ADD_BRAND_SUCCESS,
    ADD_BRAND_ERROR,
    FETCH_BRAND_LIST_ID_ERROR, 
    FETCH_BRAND_LIST_ID_REQUEST, 
    FETCH_BRAND_LIST_ID_SUCCESS,
    UPDATE_BRAND_REQUEST,
    UPDATE_BRAND_SUCCESS,
    UPDATE_BRAND_ERROR,
    RESET_BRAND_REQUEST,
} from "../../constants/ActionTypes";

const INIT_STATE = {
    brandList: [],
    brandId: {},
    loading: false,
    error: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_BRAND_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_BRAND_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                brandList: action.BrandList
            }
        }
        case FETCH_BRAND_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                brandList: [],
                error: true
            }
        }

        case ADD_BRAND_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case ADD_BRAND_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case ADD_BRAND_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_BRAND_LIST_ID_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_BRAND_LIST_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                brandId: action.Brand
            }
        }
        case FETCH_BRAND_LIST_ID_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case RESET_BRAND_REQUEST: {
            return {
                ...state,
                Brand: {}
            }
        }

        case UPDATE_BRAND_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case UPDATE_BRAND_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case UPDATE_BRAND_ERROR: {
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
