import {FETCH_CLASSIFICATION_LIST_ERROR, FETCH_CLASSIFICATION_LIST_REQUEST, FETCH_CLASSIFICATION_LIST_SUCCESS,ADD_CLASSIFICATIONLIST_REQUEST,
    ADD_CLASSIFICATIONLIST_SUCCESS,
    ADD_CLASSIFICATIONLIST_ERROR,} from "../../constants/ActionTypes";

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

export const addPacketClassification = (classificationName) => ({
    type: ADD_CLASSIFICATIONLIST_REQUEST,
    classificationName
});

export const addClassificationSuccess = () => ({
    type: ADD_CLASSIFICATIONLIST_SUCCESS
});

export const addClassificationError = (error) => ({
    type: ADD_CLASSIFICATIONLIST_ERROR,
    error
});