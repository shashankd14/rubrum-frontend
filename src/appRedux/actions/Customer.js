import {FETCH_CUSTOMER_LIST_ERROR, FETCH_CUSTOMER_LIST_REQUEST, FETCH_CUSTOMER_LIST_SUCCESS,
    FETCH_CUSTOMER_LIST_ID_ERROR, FETCH_CUSTOMER_LIST_ID_REQUEST, FETCH_CUSTOMER_LIST_ID_SUCCESS,
    ADD_CUSTOMER_REQUEST,
    ADD_CUSTOMER_SUCCESS,
    ADD_CUSTOMER_ERROR,
    UPDATE_CUSTOMER_REQUEST,
    UPDATE_CUSTOMER_SUCCESS,
    UPDATE_CUSTOMER_ERROR,
    RESET_CUSTOMER_REQUEST,
} from "../../constants/ActionTypes";
import * as actionTypes from "../../constants/ActionTypes";

export const fetchCustomerList = (action) => ({
    type: actionTypes.FETCH_CUSTOMER_LIST_REQUEST,
   action
});

export const fetchCustomerListSuccess = (customerList) => ({
    type: actionTypes.FETCH_CUSTOMER_LIST_SUCCESS,
    customerList
});

export const fetchCustomerListError = (error) => ({
    type: FETCH_CUSTOMER_LIST_ERROR,
    error
});

export const addCustomer = (Customer) => ({
    type: ADD_CUSTOMER_REQUEST,
    Customer
});

export const addCustomerSuccess = () => ({
    type: ADD_CUSTOMER_SUCCESS
});

export const addCustomerError = (error) => ({
    type: ADD_CUSTOMER_ERROR,
    error
});

export const fetchCustomerListId = (CustomerId) => ({
    type: FETCH_CUSTOMER_LIST_ID_REQUEST,
    CustomerId
});

export const fetchCustomerListIdSuccess = (Customer) => ({
    type: FETCH_CUSTOMER_LIST_ID_SUCCESS,
    Customer
});

export const fetchCustomerListIdError = (error) => ({
    type: FETCH_CUSTOMER_LIST_ID_ERROR,
    error
});

export const resetCustomer = () => ({
    type: RESET_CUSTOMER_REQUEST
});

export const updateCustomer = (Customer) => ({
    type: UPDATE_CUSTOMER_REQUEST,
    Customer
});

export const updateCustomerSuccess = () => ({
    type: UPDATE_CUSTOMER_SUCCESS
});

export const updateCustomerError = (error) => ({
    type: UPDATE_CUSTOMER_ERROR,
    error
});

export const deleteCustomer = (payload) => ({
    type: actionTypes.DELETE_CUSTOMER_REQUEST,
    payload
});

export const deleteCustomerSuccess = () => ({
    type: actionTypes.DELETE_CUSTOMER_SUCCESS
});

export const deleteCustomerError = (error) => ({
    type: actionTypes.DELETE_CUSTOMER_ERROR,
    error
});