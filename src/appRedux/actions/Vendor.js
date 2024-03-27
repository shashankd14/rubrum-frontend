import {FETCH_VENDOR_LIST_ERROR, FETCH_VENDOR_LIST_REQUEST, FETCH_VENDOR_LIST_SUCCESS,
    FETCH_VENDOR_LIST_ID_ERROR, FETCH_VENDOR_LIST_ID_REQUEST, FETCH_VENDOR_LIST_ID_SUCCESS,
    ADD_VENDOR_REQUEST,
    ADD_VENDOR_SUCCESS,
    ADD_VENDOR_ERROR,
    UPDATE_VENDOR_REQUEST,
    UPDATE_VENDOR_SUCCESS,
    UPDATE_VENDOR_ERROR,
    RESET_VENDOR_REQUEST
} from "../../constants/ActionTypes";

export const fetchVendorList = () => ({
    type: FETCH_VENDOR_LIST_REQUEST,
});

export const fetchVendorListSuccess = (VendorList) => ({
    type: FETCH_VENDOR_LIST_SUCCESS,
    VendorList
});

export const fetchVendorListError = (error) => ({
    type: FETCH_VENDOR_LIST_ERROR,
    error
});

export const addVendor = (Vendor) => ({
    type: ADD_VENDOR_REQUEST,
    Vendor
});

export const addVendorSuccess = () => ({
    type: ADD_VENDOR_SUCCESS
});

export const addVendorError = (error) => ({
    type: ADD_VENDOR_ERROR,
    error
});

export const fetchVendorListId = (VendorId) => ({
    type: FETCH_VENDOR_LIST_ID_REQUEST,
    VendorId
});

export const fetchVendorListIdSuccess = (Vendor) => ({
    type: FETCH_VENDOR_LIST_ID_SUCCESS,
    Vendor
});

export const fetchVendorListIdError = (error) => ({
    type: FETCH_VENDOR_LIST_ID_ERROR,
    error
});

export const resetVendor = () => ({
    type: RESET_VENDOR_REQUEST
});

export const updateVendor = (Vendor) => ({
    type: UPDATE_VENDOR_REQUEST,
    Vendor
});

export const updateVendorSuccess = () => ({
    type: UPDATE_VENDOR_SUCCESS
});

export const updateVendorError = (error) => ({
    type: UPDATE_VENDOR_ERROR,
    error
});