import {
    FETCH_MATERIAL_LIST_REQUEST,
    FETCH_MATERIAL_LIST_SUCCESS,
    FETCH_MATERIAL_LIST_ERROR,
    ADD_MATERIAL_REQUEST,
    ADD_MATERIAL_SUCCESS,
    ADD_MATERIAL_ERROR,
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

export const addMaterial = (material) => ({
    type: ADD_MATERIAL_REQUEST,
    material
});

export const addMaterialSuccess = () => ({
    type: ADD_MATERIAL_SUCCESS
});

export const addMaterialError = (error) => ({
    type: ADD_MATERIAL_ERROR,
    error
});
