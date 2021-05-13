import {FETCH_CLASSIFICATION_LIST_ERROR, FETCH_CLASSIFICATION_LIST_REQUEST, FETCH_CLASSIFICATION_LIST_SUCCESS} from "../../constants/ActionTypes";

export const fetchClassificationList = () => ({
    type: FETCH_CLASSIFICATION_LIST_REQUEST,
});

export const fetchClassificationListSuccess = (classificationList) => ({
    type: FETCH_CLASSIFICATION_LIST_SUCCESS,
    classificationList
});

export const fetchClassificationListError = (error) => ({
    type: FETCH_CLASSIFICATION_LIST_ERROR,
    error
});