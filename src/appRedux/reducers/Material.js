import {
    FETCH_MATERIAL_LIST_REQUEST,
    FETCH_MATERIAL_LIST_SUCCESS,
    FETCH_MATERIAL_LIST_ERROR,
    ADD_MATERIAL_REQUEST,
    ADD_MATERIAL_SUCCESS,
    ADD_MATERIAL_ERROR,
} from "../../constants/ActionTypes";

const INIT_STATE = {
    materialList: [],
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

        default:
            return state;
    }
}
