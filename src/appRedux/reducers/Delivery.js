import {
    FETCH_DELIVERY_LIST_REQUEST,
    FETCH_DELIVERY_LIST_SUCCESS,
    FETCH_DELIVERY_LIST_ERROR,
} from "../../constants/ActionTypes";

const INIT_STATE = {
    deliveryList: [],
    loading: false,
    error: false,
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
                deliveryList: action.deliveryList
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
        default:
            return state;
    }
}
