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

const INIT_STATE = {
    materialList: [],
    material: {},
    loading: false,
    error: false
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

        default:
            return state;
    }
}
