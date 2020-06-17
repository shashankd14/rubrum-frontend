import {
    FETCH_MATERIAL_LIST_REQUEST,
    FETCH_MATERIAL_LIST_SUCCESS,
    FETCH_MATERIAL_LIST_ERROR,
} from "../../constants/ActionTypes";

export const fetchMaterialList = () => ({
    type: FETCH_MATERIAL_LIST_REQUEST,
});

export const fetchMaterialListSuccess = (materialList) => ({
    type: FETCH_MATERIAL_LIST_SUCCESS,
    materialList
});

export const fetchMaterialListError = (error) => ({
    type: FETCH_MATERIAL_LIST_ERROR,
    error
});
