import {FETCH_DELIVERY_LIST_ERROR, FETCH_DELIVERY_LIST_REQUEST, FETCH_DELIVERY_LIST_SUCCESS,
    FETCH_DELIVERY_LIST_ERROR_BY_ID, FETCH_DELIVERY_LIST_REQUEST_BY_ID, FETCH_DELIVERY_LIST_SUCCESS_BY_ID} from "../../constants/ActionTypes";

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

export const fetchDeliveryListById = (deliveryId) => ({
    type: FETCH_DELIVERY_LIST_REQUEST_BY_ID,
    deliveryId
});

export const fetchDeliveryListByIdSuccess = (deliveryList) => ({
    type: FETCH_DELIVERY_LIST_SUCCESS_BY_ID,
    deliveryList
});

export const fetchDeliveryListByIdError = (error) => ({
    type: FETCH_DELIVERY_LIST_ERROR_BY_ID,
    error
});