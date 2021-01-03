import {FETCH_DELIVERY_LIST_ERROR, FETCH_DELIVERY_LIST_REQUEST, FETCH_DELIVERY_LIST_SUCCESS} from "../../constants/ActionTypes";

export const fetchDeliveryList = () => ({
    type: FETCH_DELIVERY_LIST_REQUEST,
});

export const fetchDeliveryListSuccess = (deliveryList) => ({
    type: FETCH_DELIVERY_LIST_SUCCESS,
    deliveryList
});

export const fetchDeliveryListError = (error) => ({
    type: FETCH_DELIVERY_LIST_ERROR,
    error
});