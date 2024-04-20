import {
    FETCH_DV_MATERIAL_LIST_REQUEST,
    FETCH_DV_MATERIAL_LIST_SUCCESS,
    FETCH_DV_MATERIAL_LIST_ERROR,
    ADD_DV_MATERIAL_REQUEST,
    ADD_DV_MATERIAL_SUCCESS,
    ADD_DV_MATERIAL_ERROR,
    FETCH_DV_MATERIAL_LIST_ID_REQUEST,
    FETCH_DV_MATERIAL_LIST_ID_SUCCESS,
    FETCH_DV_MATERIAL_LIST_ID_ERROR,
    UPDATE_DV_MATERIAL_REQUEST,
    UPDATE_DV_MATERIAL_SUCCESS,
    UPDATE_DV_MATERIAL_ERROR,
    RESET_DV_MATERIAL_REQUEST,
    FETCH_DV_MATERIAL_GRADES,
    FETCH_DV_MATERIAL_GRADES_SUCCESS,
    FETCH_DV_MATERIAL_GRADES_ERROR,
    FETCH_DV_MATERIAL_BY_ID_REQUSET,
    FETCH_DV_MATERIAL_BY_ID_SUCCESS,
    FETCH_DV_MATERIAL_BY_ID_ERROR,
    DELETE_DV_MATERIAL_REQUEST,
    DELETE_DV_MATERIAL_SUCCESS,
    DELETE_DV_MATERIAL_ERROR,
} from "../../constants/ActionTypes";

export const fetchDVMaterialList = (action) => ({
    type: FETCH_DV_MATERIAL_LIST_REQUEST,
    action
});

export const fetchDVMaterialListSuccess = (DVMaterialList) => ({
    type: FETCH_DV_MATERIAL_LIST_SUCCESS,
    DVMaterialList
});

export const fetchDVMaterialListError = (error) => ({
    type: FETCH_DV_MATERIAL_LIST_ERROR,
    error
});

export const addDVMaterial = (DVMaterial) => ({
    type: ADD_DV_MATERIAL_REQUEST,
    DVMaterial
});

export const addDVMaterialSuccess = () => ({
    type: ADD_DV_MATERIAL_SUCCESS
});

export const addDVMaterialError = (error) => ({
    type: ADD_DV_MATERIAL_ERROR,
    error
});

export const resetDVMaterial = () => ({
    type: RESET_DV_MATERIAL_REQUEST
});

export const updateDVMaterial = (DVMaterial) => ({
    type: UPDATE_DV_MATERIAL_REQUEST,
    DVMaterial
});

export const updateDVMaterialSuccess = () => ({
    type: UPDATE_DV_MATERIAL_SUCCESS
});

export const updateDVMaterialError = (error) => ({
    type: UPDATE_DV_MATERIAL_ERROR,
    error
});


export const fetchDVMaterialListById = (action) => ({
    type: FETCH_DV_MATERIAL_LIST_ID_REQUEST,
    action
});

export const fetchDVMaterialListByIdSuccess = (DVmaterial) => ({
    type: FETCH_DV_MATERIAL_LIST_ID_SUCCESS,
    DVmaterial
});

export const fetchDVMaterialListByIdError = (error) => ({
    type: FETCH_DV_MATERIAL_LIST_ID_ERROR,
    error
});
export const deleteDVMaterial = (action) => ({
    type: DELETE_DV_MATERIAL_REQUEST,
    action
});

export const deleteDVMaterialSuccess = () => ({
    type: DELETE_DV_MATERIAL_SUCCESS
});

export const deleteDVMaterialError = (error) => ({
    type: DELETE_DV_MATERIAL_ERROR,
    error
});

// export const fetchDVMaterialGrades = () => ({
//     type: FETCH_DV_MATERIAL_GRADES,
// });

// export const fetchDVMaterialGradesSuccess = () => ({
//     type: FETCH_DV_MATERIAL_GRADES_SUCCESS,
// });

// export const fetchDVMaterialGradesError = (error) => ({
//     type: FETCH_DV_MATERIAL_GRADES_ERROR,
//     error
// });



