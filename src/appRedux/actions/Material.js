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
    RESET_MATERIAL_REQUEST,
    FETCH_MATERIAL_GRADES,
    FETCH_MATERIAL_GRADES_SUCCESS,
    FETCH_MATERIAL_GRADES_ERROR,
    FETCH_WIDTHS,
    FETCH_WIDTHS_SUCCESS,
    FETCH_WIDTHS_ERROR,
    FETCH_LENGTHS,
    FETCH_LENGTHS_SUCCESS,
    FETCH_LENGTHS_ERROR,
    FETCH_THICKNESS,
    FETCH_THICKNESS_SUCCESS,
    FETCH_THICKNESS_ERROR,
    FETCH_MATERIAL_CATEGORIES,
    FETCH_MATERIAL_CATEGORIES_SUCCESS,
    FETCH_MATERIAL_CATEGORIES_ERROR,
    FETCH_MATERIAL_SUB_CATEGORIES,
    FETCH_MATERIAL_SUB_CATEGORIES_SUCCESS,
    FETCH_MATERIAL_SUB_CATEGORIES_ERROR,
    FETCH_MATERIAL_LEAF_CATEGORY,
    FETCH_MATERIAL_LEAF_CATEGORY_SUCCESS,
    FETCH_MATERIAL_LEAF_CATEGORY_ERROR,
    SAVE_MATERIAL_DISPLAY_INFO,
    SEARCH_MATERIAL_BY_ID,
    SEARCH_MATERIAL_BY_ID_SUCCESS,
    SEARCH_MATERIAL_BY_ID_ERROR,
    SAVE_MATERIAL_DISPLAY_INFO_OBJ
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

export const fetchMaterialGrades = () => ({
    type: FETCH_MATERIAL_GRADES,
});

export const fetchMaterialGradesSuccess = () => ({
    type: FETCH_MATERIAL_GRADES_SUCCESS,
});

export const fetchMaterialGradesError = (error) => ({
    type: FETCH_MATERIAL_GRADES_ERROR,
    error
});

export const fetchWidths = () => ({
    type: FETCH_WIDTHS,
});

export const fetchWidthsSuccess = () => ({
    type: FETCH_WIDTHS_SUCCESS,
});

export const fetchWidthsError = (error) => ({
    type: FETCH_WIDTHS_ERROR,
    error
});

export const fetchLengths = () => ({
    type: FETCH_LENGTHS,
});

export const fetchLengthsSuccess = () => ({
    type: FETCH_LENGTHS_SUCCESS,
});

export const fetchLengthsError = (error) => ({
    type: FETCH_LENGTHS_ERROR,
    error
});

export const fetchThickness = () => ({
    type: FETCH_THICKNESS,
});

export const fetchThicknessSuccess = () => ({
    type: FETCH_THICKNESS_SUCCESS,
});

export const fetchThicknessError = (error) => ({
    type: FETCH_THICKNESS_ERROR,
    error
});


export const getMaterialCategories = () => ({
    type: FETCH_MATERIAL_CATEGORIES,
});

export const getMaterialCategoriesSuccess = (categories) => ({
    type: FETCH_MATERIAL_CATEGORIES_SUCCESS,
    categories
});

export const getMaterialCategoriesError = (error) => ({
    type: FETCH_MATERIAL_CATEGORIES_ERROR,
    error
});

export const getMaterialSubCategories = (categoryId) => ({
    type: FETCH_MATERIAL_SUB_CATEGORIES,
    categoryId
});

export const getMaterialSubCategoriesSuccess = (subCategories) => ({
    type: FETCH_MATERIAL_SUB_CATEGORIES_SUCCESS,
    subCategories
});

export const getMaterialSubCategoriesError = (error) => ({
    type: FETCH_MATERIAL_SUB_CATEGORIES_ERROR,
    error
});

export const getLeafCategory = (subCategoryId) => ({
    type: FETCH_MATERIAL_LEAF_CATEGORY,
    subCategoryId
});

export const getLeafCategorySuccess = (leafCategories) => ({
    type: FETCH_MATERIAL_LEAF_CATEGORY_SUCCESS,
    leafCategories
});

export const getLeafCategoryError = (error) => ({
    type: FETCH_MATERIAL_LEAF_CATEGORY_ERROR,
    error
});

export const searchByMaterialId = (materialId) => ({
    type: SEARCH_MATERIAL_BY_ID,
    materialId
});

export const searchByMaterialIdSuccess = (materailData) => ({
    type: SEARCH_MATERIAL_BY_ID_SUCCESS,
    materailData
});

export const searchByMaterialIdError = (error) => ({
    type: SEARCH_MATERIAL_BY_ID_ERROR,
    error
});

export const saveMaterialInfo = (displayKey,displayValue) => ({
    type: SAVE_MATERIAL_DISPLAY_INFO,
    displayKey,
    displayValue
});

export const saveMaterialDisplayInfo = (displayInfo) => ({
    type: SAVE_MATERIAL_DISPLAY_INFO_OBJ,
    displayInfo
});