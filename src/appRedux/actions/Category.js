
import * as actionTypes from "../../constants/ActionTypes";

export const fetchMainCategoryList = (payload) => ({
    type: actionTypes.FETCH_MAIN_CATEGORY_LIST_REQUEST,
    payload
});

export const fetchMainCategoryListSuccess = (MainCategoryList) => ({
    type: actionTypes.FETCH_MAIN_CATEGORY_LIST_SUCCESS,
    MainCategoryList
});

export const fetchMainCategoryListError = (error) => ({
    type: actionTypes.FETCH_MAIN_CATEGORY_LIST_ERROR,
    error
});

export const addMainCategory = (payload) => ({
    type: actionTypes.ADD_MAIN_CATEGORY_REQUEST,
    payload
});

export const addMainCategorySuccess = () => ({
    type: actionTypes.ADD_MAIN_CATEGORY_SUCCESS
});

export const addMainCategoryError = (error) => ({
    type: actionTypes.ADD_MAIN_CATEGORY_ERROR,
    error
});

export const fetchMainCategoryId = (payload) => ({
    type: actionTypes.FETCH_MAIN_CATEGORY_LIST_ID_REQUEST,
    payload
});

export const fetchMainCategoryIdSuccess = (mainCategory) => ({
    type: actionTypes.FETCH_MAIN_CATEGORY_LIST_ID_SUCCESS,
    mainCategory
});

export const fetchMainCategoryIdError = (error) => ({
    type: actionTypes.FETCH_MAIN_CATEGORY_LIST_ID_ERROR,
    error
});

export const resetMainCategory = () => ({
    type: actionTypes.RESET_MAIN_CATEGORY_REQUEST
});

export const updateMainCategory = (payload) => ({
    type: actionTypes.UPDATE_MAIN_CATEGORY_REQUEST,
    payload
});

export const updateMainCategorySuccess = () => ({
    type: actionTypes.UPDATE_MAIN_CATEGORY_SUCCESS
});

export const updateMainCategoryError = (error) => ({
    type: actionTypes.UPDATE_MAIN_CATEGORY_ERROR,
    error
});

export const deleteMainCategory = (payload) => ({
    type: actionTypes.DELETE_MAIN_CATEGORY_REQUEST,
    payload
});

export const deleteMainCategorySuccess = () => ({
    type: actionTypes.DELETE_MAIN_CATEGORY_SUCCESS
});

export const deleteMainCategoryError = (error) => ({
    type: actionTypes.DELETE_MAIN_CATEGORY_ERROR,
    error
});

//Sub Category
export const fetchSubCategoryList = (payload) => ({
    type: actionTypes.FETCH_SUB_CATEGORY_LIST_REQUEST,
    payload
});

export const fetchSubCategoryListSuccess = (SubCategoryList) => ({
    type: actionTypes.FETCH_SUB_CATEGORY_LIST_SUCCESS,
    SubCategoryList
});

export const fetchSubCategoryListError = (error) => ({
    type: actionTypes.FETCH_SUB_CATEGORY_LIST_ERROR,
    error
});

export const addSubCategory = (payload) => ({
    type: actionTypes.ADD_SUB_CATEGORY_REQUEST,
    payload
});

export const addSubCategorySuccess = () => ({
    type: actionTypes.ADD_SUB_CATEGORY_SUCCESS
});

export const addSubCategoryError = (error) => ({
    type: actionTypes.ADD_SUB_CATEGORY_ERROR,
    error
});

export const fetchSubCategoryId = (payload) => ({
    type: actionTypes.FETCH_SUB_CATEGORY_LIST_ID_REQUEST,
    payload
});

export const fetchSubCategoryIdSuccess = (SubCategory) => ({
    type: actionTypes.FETCH_SUB_CATEGORY_LIST_ID_SUCCESS,
    SubCategory
});

export const fetchSubCategoryIdError = (error) => ({
    type: actionTypes.FETCH_SUB_CATEGORY_LIST_ID_ERROR,
    error
});

export const resetSubCategory = () => ({
    type: actionTypes.RESET_SUB_CATEGORY_REQUEST
});

export const updateSubCategory = (payload) => ({
    type: actionTypes.UPDATE_SUB_CATEGORY_REQUEST,
    payload
});

export const updateSubCategorySuccess = () => ({
    type: actionTypes.UPDATE_SUB_CATEGORY_SUCCESS
});

export const updateSubCategoryError = (error) => ({
    type: actionTypes.UPDATE_SUB_CATEGORY_ERROR,
    error
});

export const deleteSubCategory = (payload) => ({
    type: actionTypes.DELETE_SUB_CATEGORY_REQUEST,
    payload
});

export const deleteSubCategorySuccess = () => ({
    type: actionTypes.DELETE_SUB_CATEGORY_SUCCESS
});

export const deleteSubCategoryError = (error) => ({
    type: actionTypes.DELETE_SUB_CATEGORY_ERROR,
    error
});