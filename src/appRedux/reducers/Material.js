import {
    FETCH_MATERIAL_LIST_REQUEST,
    FETCH_MATERIAL_LIST_SUCCESS,
    FETCH_MATERIAL_LIST_ERROR,
} from "../../constants/ActionTypes";

const INIT_STATE = {
    materialList: [],
    loading: false,
    error: false,
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
        default:
            return state;
    }
}
