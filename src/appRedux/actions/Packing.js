import {
    FETCH_PACKING_LIST_REQUEST,
    FETCH_PACKING_LIST_SUCCESS,
    FETCH_PACKING_LIST_ERROR,
    ADD_PACKING_REQUEST,
    ADD_PACKING_SUCCESS,
    ADD_PACKING_ERROR,
    FETCH_PACKING_LIST_ID_REQUEST,
    FETCH_PACKING_LIST_ID_SUCCESS,
    FETCH_PACKING_LIST_ID_ERROR,
    UPDATE_PACKING_REQUEST,
    UPDATE_PACKING_SUCCESS,
    UPDATE_PACKING_ERROR,
    RESET_PACKING_REQUEST
} from "../../constants/ActionTypes";

export const fetchPackingList = () => ({
    type: FETCH_PACKING_LIST_REQUEST,
});

export const fetchPackingListSuccess = (packingList) => ({
    type: FETCH_PACKING_LIST_SUCCESS,
    packingList
});

export const fetchPackingListError = (error) => ({
    type: FETCH_PACKING_LIST_ERROR,
    error
});

export const addPacking = (packing) => ({
    type: ADD_PACKING_REQUEST,
    packing
});

export const addPackingSuccess = () => ({
    type: ADD_PACKING_SUCCESS
});

export const addPackingError = (error) => ({
    type: ADD_PACKING_ERROR,
    error
});

export const resetPacking = () => ({
    type: RESET_PACKING_REQUEST
});

export const updatePacking = (packing) => ({
    type: UPDATE_PACKING_REQUEST,
    packing
});

export const updatePackingSuccess = () => ({
    type: UPDATE_PACKING_SUCCESS
});

export const updatePackingError = (error) => ({
    type: UPDATE_PACKING_ERROR,
    error
});


export const fetchPackingListById = (packingId) => ({
    type: FETCH_PACKING_LIST_ID_REQUEST,
    packingId
});

export const fetchPackingListByIdSuccess = (packing) => ({
    type: FETCH_PACKING_LIST_ID_SUCCESS,
    packing
});

export const fetchPackingListByIdError = (error) => ({
    type: FETCH_PACKING_LIST_ID_ERROR,
    error
});
