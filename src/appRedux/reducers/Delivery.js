import {
    FETCH_DELIVERY_LIST_REQUEST,
    FETCH_DELIVERY_LIST_SUCCESS,
    FETCH_DELIVERY_LIST_ERROR,
    FETCH_DELIVERY_LIST_REQUEST_BY_ID,
    FETCH_DELIVERY_LIST_SUCCESS_BY_ID,
    FETCH_DELIVERY_LIST_ERROR_BY_ID,
} from "../../constants/ActionTypes";

const INIT_STATE = {
    deliveryList: [],
    loading: false,
    error: false,
    success:false,
    deliveryById:[]
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
                deliveryList: action.deliveryList,
                success:true
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
        default:
            return state;
    }
}
