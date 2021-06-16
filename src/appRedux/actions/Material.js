import {
    FETCH_MATERIAL_LIST_REQUEST,
    FETCH_MATERIAL_LIST_SUCCESS,
    FETCH_MATERIAL_LIST_ERROR,
    ADD_MATERIAL_REQUEST,
    ADD_MATERIAL_SUCCESS,
    ADD_MATERIAL_ERROR,
    FETCH_MATERIAL_LIST_ID_REQUEST,
    FETCH_MATERIAL_LIST_ID_SUCCESS,
    FETCH_MATERIAL_LIST_ID_ERROR,
    UPDATE_MATERIAL_REQUEST,
    UPDATE_MATERIAL_SUCCESS,
    UPDATE_MATERIAL_ERROR,
    RESET_MATERIAL_REQUEST
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

export const resetMaterial = () => ({
    type: RESET_MATERIAL_REQUEST
});

export const updateMaterial = (material) => ({
    type: UPDATE_MATERIAL_REQUEST,
    material
});

export const updateMaterialSuccess = () => ({
    type: UPDATE_MATERIAL_SUCCESS
});

export const updateMaterialError = (error) => ({
    type: UPDATE_MATERIAL_ERROR,
    error
});


export const fetchMaterialListById = (materialId) => ({
    type: FETCH_MATERIAL_LIST_ID_REQUEST,
    materialId
});

export const fetchMaterialListByIdSuccess = (material) => ({
    type: FETCH_MATERIAL_LIST_ID_SUCCESS,
    material
});

export const fetchMaterialListByIdError = (error) => ({
    type: FETCH_MATERIAL_LIST_ID_ERROR,
    error
});
