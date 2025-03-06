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
} from "../../constants/ActionTypes";

const INIT_STATE = {
    materialList: [],
    material: {},
    loading: false,
    error: false,
    categoriesList: [],
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_MATERIAL_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_MATERIAL_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                materialList: action.materialList
            }
        }
        case FETCH_MATERIAL_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                materialList: [],
                error: true
            }
        }

        case ADD_MATERIAL_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case ADD_MATERIAL_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case ADD_MATERIAL_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_MATERIAL_LIST_ID_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_MATERIAL_LIST_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                material: action.material
            }
        }
        case FETCH_MATERIAL_LIST_ID_ERROR: {
            return {
                ...state,
                loading: false,
                material: {},
                error: true
            }
        }

        case RESET_MATERIAL_REQUEST: {
            return {
                ...state,
                material: {}
            }
        }

        case UPDATE_MATERIAL_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case UPDATE_MATERIAL_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case UPDATE_MATERIAL_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_MATERIAL_GRADES: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_MATERIAL_GRADES_SUCCESS: {
            return {
                ...state,
                loading: false,
                operation: "fetchMaterialGrades"
            }
        }
        case FETCH_MATERIAL_GRADES_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_WIDTHS: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_WIDTHS_SUCCESS: {
            return {
                ...state,
                loading: false,
                operation: "fetchWidths"
            }
        }
        case FETCH_WIDTHS_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_LENGTHS: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_LENGTHS_SUCCESS: {
            return {
                ...state,
                loading: false,
                operation: "fetchLengths"
            }
        }
        case FETCH_LENGTHS_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_THICKNESS: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_THICKNESS_SUCCESS: {
            return {
                ...state,
                loading: false,
                operation: "fetchThikness"
            }
        }
        case FETCH_THICKNESS_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_MATERIAL_CATEGORIES: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_MATERIAL_CATEGORIES_SUCCESS: {
            return {
                ...state,
                loading: false,
                categoriesList: action.categories
            }
        }
        case FETCH_MATERIAL_CATEGORIES_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }
        case FETCH_MATERIAL_SUB_CATEGORIES: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_MATERIAL_SUB_CATEGORIES_SUCCESS: {
            return {
                ...state,
                loading: false,
                subCategoriesList: action.subCategories
            }
        }
        case FETCH_MATERIAL_SUB_CATEGORIES_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }
        case FETCH_MATERIAL_LEAF_CATEGORY: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_MATERIAL_LEAF_CATEGORY_SUCCESS: {
            return {
                ...state,
                loading: false,
                leafCategoriesList: action.leafCategories
            }
        }
        case FETCH_MATERIAL_LEAF_CATEGORY_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        default:
            return state;
    }
}
