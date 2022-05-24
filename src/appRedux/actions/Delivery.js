import {FETCH_DELIVERY_LIST_ERROR, 
    FETCH_DELIVERY_LIST_REQUEST, 
    FETCH_DELIVERY_LIST_SUCCESS,
    FETCH_DELIVERY_LIST_ERROR_BY_ID, 
    FETCH_DELIVERY_LIST_REQUEST_BY_ID, 
    FETCH_DELIVERY_LIST_SUCCESS_BY_ID,
    DELETE_DELIVERY_BY_ID,
    DELETE_DELIVERY_BY_ID_SUCCESS,
    DELETE_DELIVERY_BY_ID_ERROR} from "../../constants/ActionTypes";

export const fetchDeliveryList = (page, pageSize, searchValue, partyId) => ({
    type: FETCH_DELIVERY_LIST_REQUEST,
    page,
    pageSize,
    searchValue,
    partyId
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

export const deleteByDeliveryId = (id) => ({
    type: DELETE_DELIVERY_BY_ID,
    id
});

export const deleteDeliveryByIdSuccess = (payload) => ({
    type: DELETE_DELIVERY_BY_ID_SUCCESS,
    payload
});

export const deleteDeliveryByIdError = (error) => ({
    type: DELETE_DELIVERY_BY_ID_ERROR,
    error
});