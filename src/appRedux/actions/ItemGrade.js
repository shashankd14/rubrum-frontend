import {FETCH_ITEMGRADE_LIST_ERROR, FETCH_ITEMGRADE_LIST_REQUEST, FETCH_ITEMGRADE_LIST_SUCCESS,
    FETCH_ITEMGRADE_LIST_ID_ERROR, FETCH_ITEMGRADE_LIST_ID_REQUEST, FETCH_ITEMGRADE_LIST_ID_SUCCESS,
    ADD_ITEMGRADE_REQUEST,
    ADD_ITEMGRADE_SUCCESS,
    ADD_ITEMGRADE_ERROR,
    UPDATE_ITEMGRADE_REQUEST,
    UPDATE_ITEMGRADE_SUCCESS,
    UPDATE_ITEMGRADE_ERROR,
    RESET_ITEMGRADE_REQUEST,
} from "../../constants/ActionTypes";
import * as actionTypes from "../../constants/ActionTypes";

export const fetchItemGradeList = (payload) => ({
    type: actionTypes.FETCH_ITEMGRADE_LIST_REQUEST,
    payload
});

export const fetchItemGradeListSuccess = (ItemGradeList) => ({
    type: actionTypes.FETCH_ITEMGRADE_LIST_SUCCESS,
    ItemGradeList
});

export const fetchItemGradeListError = (error) => ({
    type: FETCH_ITEMGRADE_LIST_ERROR,
    error
});

export const addItemGrade = (payload) => ({
    type: ADD_ITEMGRADE_REQUEST,
    payload
});

export const addItemGradeSuccess = () => ({
    type: ADD_ITEMGRADE_SUCCESS
});

export const addItemGradeError = (error) => ({
    type: ADD_ITEMGRADE_ERROR,
    error
});

export const fetchItemGradeListId = (payload) => ({
    type: FETCH_ITEMGRADE_LIST_ID_REQUEST,
    payload
});

export const fetchItemGradeListIdSuccess = (ItemGrade) => ({
    type: FETCH_ITEMGRADE_LIST_ID_SUCCESS,
    ItemGrade
});

export const fetchItemGradeListIdError = (error) => ({
    type: FETCH_ITEMGRADE_LIST_ID_ERROR,
    error
});

export const resetItemGrade = () => ({
    type: RESET_ITEMGRADE_REQUEST
});
export const updateItemGrade = (payload) => ({
    type: UPDATE_ITEMGRADE_REQUEST,
    payload
});

export const updateItemGradeSuccess = () => ({
    type: UPDATE_ITEMGRADE_SUCCESS
});

export const updateItemGradeError = (error) => ({
    type: UPDATE_ITEMGRADE_ERROR,
    error
});

export const deleteItemGrade = (payload) => ({
    type: actionTypes.DELETE_ITEMGRADE_REQUEST,
    payload
});

export const deleteItemGradeSuccess = () => ({
    type: actionTypes.DELETE_ITEMGRADE_SUCCESS
});

export const deleteItemGradeError = (error) => ({
    type: actionTypes.DELETE_ITEMGRADE_ERROR,
    error
});
