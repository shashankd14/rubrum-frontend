import {
    FETCH_PACKING_LIST_REQUEST,
    FETCH_PACKING_LIST_SUCCESS,
    FETCH_PACKING_LIST_ERROR,
    FETCH_PACKING_BUCKET_LIST_REQUEST,
    FETCH_PACKING_BUCKET_LIST_SUCCESS,
    FETCH_PACKING_BUCKET_LIST_ERROR,
    ADD_PACKING_REQUEST,
    ADD_PACKING_SUCCESS,
    ADD_PACKING_ERROR,
    ADD_PACKING_BUCKET_REQUEST,
    ADD_PACKING_BUCKET_SUCCESS,
    ADD_PACKING_BUCKET_ERROR,
    FETCH_PACKING_LIST_ID_REQUEST,
    FETCH_PACKING_LIST_ID_SUCCESS,
    FETCH_PACKING_LIST_ID_ERROR,
    FETCH_PACKING_BUCKET_LIST_ID_REQUEST,
    FETCH_PACKING_BUCKET_LIST_ID_SUCCESS,
    FETCH_PACKING_BUCKET_LIST_ID_ERROR,
    UPDATE_PACKING_REQUEST,
    UPDATE_PACKING_SUCCESS,
    UPDATE_PACKING_ERROR,
    UPDATE_PACKING_BUCKET_REQUEST,
    UPDATE_PACKING_BUCKET_SUCCESS,
    UPDATE_PACKING_BUCKET_ERROR,
    RESET_PACKING_REQUEST,
    RESET_PACKING_BUCKET_REQUEST
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

export const fetchPackingBucketList = () => ({
    type: FETCH_PACKING_BUCKET_LIST_REQUEST,
});

export const fetchPackingBucketListSuccess = (bucketList) => ({
    type: FETCH_PACKING_BUCKET_LIST_SUCCESS,
    bucketList
});

export const fetchPackingBucketListError = (error) => ({
    type: FETCH_PACKING_BUCKET_LIST_ERROR,
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

export const addPackingBucket = (bucket) => ({
    type: ADD_PACKING_BUCKET_REQUEST,
    bucket
});

export const addPackingBucketSuccess = () => ({
    type: ADD_PACKING_BUCKET_SUCCESS
});

export const addPackingBucketError = (error) => ({
    type: ADD_PACKING_BUCKET_ERROR,
    error
});

export const resetPacking = () => ({
    type: RESET_PACKING_REQUEST
});

export const resetPackingBucket = () => ({
    type: RESET_PACKING_BUCKET_REQUEST
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

export const updatePackingBucket = (bucket) => ({
    type: UPDATE_PACKING_BUCKET_REQUEST,
    bucket
});

export const updatePackingBucketSuccess = () => ({
    type: UPDATE_PACKING_BUCKET_SUCCESS
});

export const updatePackingBucketError = (error) => ({
    type: UPDATE_PACKING_BUCKET_ERROR,
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

export const fetchPackingBucketListById = (bucketId) => ({
    type: FETCH_PACKING_BUCKET_LIST_ID_REQUEST,
    bucketId
});

export const fetchPackingBucketListByIdSuccess = (bucket) => ({
    type: FETCH_PACKING_BUCKET_LIST_ID_SUCCESS,
    bucket
});

export const fetchPackingBucketListByIdError = (error) => ({
    type: FETCH_PACKING_BUCKET_LIST_ID_ERROR,
    error
});
