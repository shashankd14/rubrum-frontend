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
} from '../../constants/ActionTypes';

export const fetchMaterialList = () => ({
  type: FETCH_MATERIAL_LIST_REQUEST,
});

export const fetchMaterialListSuccess = materialList => ({
  type: FETCH_MATERIAL_LIST_SUCCESS,
  materialList,
});

export const fetchMaterialListError = error => ({
  type: FETCH_MATERIAL_LIST_ERROR,
  error,
});

export const addMaterial = material => ({
  type: ADD_MATERIAL_REQUEST,
  material,
});

export const addMaterialSuccess = () => ({
  type: ADD_MATERIAL_SUCCESS,
});

export const addMaterialError = error => ({
  type: ADD_MATERIAL_ERROR,
  error,
});

export const resetMaterial = () => ({
  type: RESET_MATERIAL_REQUEST,
});

export const updateMaterial = material => ({
  type: UPDATE_MATERIAL_REQUEST,
  material,
});

export const updateMaterialSuccess = () => ({
  type: UPDATE_MATERIAL_SUCCESS,
});

export const updateMaterialError = error => ({
  type: UPDATE_MATERIAL_ERROR,
  error,
});

export const fetchMaterialListById = materialId => ({
  type: FETCH_MATERIAL_LIST_ID_REQUEST,
  materialId,
});

export const fetchMaterialListByIdSuccess = material => ({
  type: FETCH_MATERIAL_LIST_ID_SUCCESS,
  material,
});

export const fetchMaterialListByIdError = error => ({
  type: FETCH_MATERIAL_LIST_ID_ERROR,
  error,
});

export const fetchMaterialGrades = () => ({
  type: FETCH_MATERIAL_GRADES,
});

export const fetchMaterialGradesSuccess = () => ({
  type: FETCH_MATERIAL_GRADES_SUCCESS,
});

export const fetchMaterialGradesError = error => ({
  type: FETCH_MATERIAL_GRADES_ERROR,
  error,
});

export const fetchWidths = () => ({
  type: FETCH_WIDTHS,
});

export const fetchWidthsSuccess = () => ({
  type: FETCH_WIDTHS_SUCCESS,
});

export const fetchWidthsError = error => ({
  type: FETCH_WIDTHS_ERROR,
  error,
});

export const fetchLengths = () => ({
  type: FETCH_LENGTHS,
});

export const fetchLengthsSuccess = () => ({
  type: FETCH_LENGTHS_SUCCESS,
});

export const fetchLengthsError = error => ({
  type: FETCH_LENGTHS_ERROR,
  error,
});

export const fetchThickness = () => ({
  type: FETCH_THICKNESS,
});

export const fetchThicknessSuccess = () => ({
  type: FETCH_THICKNESS_SUCCESS,
});

export const fetchThicknessError = error => ({
  type: FETCH_THICKNESS_ERROR,
  error,
});
