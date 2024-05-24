import {FETCH_BRAND_LIST_ERROR, FETCH_BRAND_LIST_REQUEST, FETCH_BRAND_LIST_SUCCESS,
    FETCH_BRAND_LIST_ID_ERROR, FETCH_BRAND_LIST_ID_REQUEST, FETCH_BRAND_LIST_ID_SUCCESS,
    ADD_BRAND_REQUEST,
    ADD_BRAND_SUCCESS,
    ADD_BRAND_ERROR,
    UPDATE_BRAND_REQUEST,
    UPDATE_BRAND_SUCCESS,
    UPDATE_BRAND_ERROR,
    RESET_BRAND_REQUEST,
} from "../../constants/ActionTypes";
import * as actionTypes from "../../constants/ActionTypes";

export const fetchBrandList = (payload) => ({
    type: actionTypes.FETCH_BRAND_LIST_REQUEST,
    payload
});

export const fetchBrandListSuccess = (BrandList) => ({
    type: actionTypes.FETCH_BRAND_LIST_SUCCESS,
    BrandList
});

export const fetchBrandListError = (error) => ({
    type: FETCH_BRAND_LIST_ERROR,
    error
});

export const addBrand = (payload) => ({
    type: ADD_BRAND_REQUEST,
    payload
});

export const addBrandSuccess = () => ({
    type: ADD_BRAND_SUCCESS
});

export const addBrandError = (error) => ({
    type: ADD_BRAND_ERROR,
    error
});

export const fetchBrandListId = (payload) => ({
    type: FETCH_BRAND_LIST_ID_REQUEST,
    payload
});

export const fetchBrandListIdSuccess = (Brand) => ({
    type: FETCH_BRAND_LIST_ID_SUCCESS,
    Brand
});

export const fetchBrandListIdError = (error) => ({
    type: FETCH_BRAND_LIST_ID_ERROR,
    error
});

export const resetBrand = () => ({
    type: RESET_BRAND_REQUEST
});

export const updateBrand = (payload) => ({
    type: UPDATE_BRAND_REQUEST,
    payload
});

export const updateBrandSuccess = () => ({
    type: UPDATE_BRAND_SUCCESS
});

export const updateBrandError = (error) => ({
    type: UPDATE_BRAND_ERROR,
    error
});

export const deleteBrand = (payload) => ({
    type: actionTypes.DELETE_BRAND_REQUEST,
    payload
});

export const deleteBrandSuccess = () => ({
    type: actionTypes.DELETE_BRAND_SUCCESS
});

export const deleteBrandError = (error) => ({
    type: actionTypes.DELETE_BRAND_ERROR,
    error
});
