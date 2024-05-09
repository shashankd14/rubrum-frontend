import {FETCH_DOCUMENT_TYPE_LIST_ERROR, FETCH_DOCUMENT_TYPE_LIST_REQUEST, FETCH_DOCUMENT_TYPE_LIST_SUCCESS,
    FETCH_DOCUMENT_TYPE_LIST_ID_ERROR, FETCH_DOCUMENT_TYPE_LIST_ID_REQUEST, FETCH_DOCUMENT_TYPE_LIST_ID_SUCCESS,
    ADD_DOCUMENT_TYPE_REQUEST,
    ADD_DOCUMENT_TYPE_SUCCESS,
    ADD_DOCUMENT_TYPE_ERROR,
    UPDATE_DOCUMENT_TYPE_REQUEST,
    UPDATE_DOCUMENT_TYPE_SUCCESS,
    UPDATE_DOCUMENT_TYPE_ERROR,
    RESET_DOCUMENT_TYPE_REQUEST,
} from "../../constants/ActionTypes";
import * as actionTypes from "../../constants/ActionTypes";

export const fetchDocumentTypeList = (payload) => ({
    type: actionTypes.FETCH_DOCUMENT_TYPE_LIST_REQUEST,
    payload
});

export const fetchDocumentTypeListSuccess = (DocumentTypeList) => ({
    type: actionTypes.FETCH_DOCUMENT_TYPE_LIST_SUCCESS,
    DocumentTypeList
});

export const fetchDocumentTypeListError = (error) => ({
    type: FETCH_DOCUMENT_TYPE_LIST_ERROR,
    error
});

export const addDocumentType = (payload) => ({
    type: ADD_DOCUMENT_TYPE_REQUEST,
    payload
});

export const addDocumentTypeSuccess = () => ({
    type: ADD_DOCUMENT_TYPE_SUCCESS
});

export const addDocumentTypeError = (error) => ({
    type: ADD_DOCUMENT_TYPE_ERROR,
    error
});

export const fetchDocumentTypeListId = (payload) => ({
    type: FETCH_DOCUMENT_TYPE_LIST_ID_REQUEST,
    payload
});

export const fetchDocumentTypeListIdSuccess = (DocumentType) => ({
    type: FETCH_DOCUMENT_TYPE_LIST_ID_SUCCESS,
    DocumentType
});

export const fetchDocumentTypeListIdError = (error) => ({
    type: FETCH_DOCUMENT_TYPE_LIST_ID_ERROR,
    error
});

export const resetDocumentType = () => ({
    type: RESET_DOCUMENT_TYPE_REQUEST
});

export const updateDocumentType = (payload) => ({
    type: UPDATE_DOCUMENT_TYPE_REQUEST,
    payload
});

export const updateDocumentTypeSuccess = () => ({
    type: UPDATE_DOCUMENT_TYPE_SUCCESS
});

export const updateDocumentTypeError = (error) => ({
    type: UPDATE_DOCUMENT_TYPE_ERROR,
    error
});

export const deleteDocumentType = (payload) => ({
    type: actionTypes.DELETE_DOCUMENT_TYPE_REQUEST,
    payload
});

export const deleteDocumentTypeSuccess = () => ({
    type: actionTypes.DELETE_DOCUMENT_TYPE_SUCCESS
});

export const deleteDocumentTypeError = (error) => ({
    type: actionTypes.DELETE_DOCUMENT_TYPE_ERROR,
    error
});
