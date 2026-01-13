import {
    FETCH_DELIVERY_LIST_REQUEST,
    FETCH_DELIVERY_LIST_SUCCESS,
    FETCH_DELIVERY_LIST_ERROR,
    FETCH_DELIVERY_LIST_REQUEST_BY_ID,
    FETCH_DELIVERY_LIST_SUCCESS_BY_ID,
    FETCH_DELIVERY_LIST_ERROR_BY_ID,
    DELETE_DELIVERY_BY_ID,
    DELETE_DELIVERY_BY_ID_SUCCESS,
    DELETE_DELIVERY_BY_ID_ERROR,
    RESET_DELETE_DELIVERY
} from "../../constants/ActionTypes";

const INIT_STATE = {
    deliveryList: [],
    loading: false,
    error: false,
    success:false,
    deliveryById:[],
    deleteSuccess:false,
    deleteError:false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_DELIVERY_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_DELIVERY_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                deliveryList: action.deliveryList.content,
                totalItems: action.deliveryList.totalItems,
                success: true
            }
        }
        case FETCH_DELIVERY_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                deliveryList: [],
                error: true
            }
        }
        case FETCH_DELIVERY_LIST_REQUEST_BY_ID: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_DELIVERY_LIST_SUCCESS_BY_ID: {
            return {
                ...state,
                loading: false,
                deliveryById: action.deliveryList,
                success:true
            }
        }
        case FETCH_DELIVERY_LIST_ERROR_BY_ID: {
            return {
                ...state,
                loading: false,
                deliveryById: [],
                error: true
            }
        }
        case DELETE_DELIVERY_BY_ID: {
            return {
                ...state,
                loading: true,
                deleteSuccess:false,
                deleteError: false
            }
        }
        case DELETE_DELIVERY_BY_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                deleteSuccess:true,
                deleteError: false
            }
        }
        case DELETE_DELIVERY_BY_ID_ERROR: {
            return {
                ...state,
                loading: false,
                deleteSuccess:false,
                deleteError: true
            }
        }
        case RESET_DELETE_DELIVERY: {
            return {
                ...state,
                deleteSuccess:false,
                deleteError: false
            }
        }
        default:
            return state;
    }
}
