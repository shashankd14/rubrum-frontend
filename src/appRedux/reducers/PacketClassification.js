import {
    FETCH_CLASSIFICATION_LIST_REQUEST,
    FETCH_CLASSIFICATION_LIST_SUCCESS,
    FETCH_CLASSIFICATION_LIST_ERROR,
    ADD_CLASSIFICATIONLIST_REQUEST,
    ADD_CLASSIFICATIONLIST_SUCCESS,
    ADD_CLASSIFICATIONLIST_ERROR,
} from "../../constants/ActionTypes";

const INIT_STATE = {
    classificationList: [],
    loading: false,
    error: false,
};

export default (state = INIT_STATE, { type, classificationList}) => {
    switch (type) {
        case FETCH_CLASSIFICATION_LIST_REQUEST: {
            return {
                ...state,
            }
        }
        case FETCH_CLASSIFICATION_LIST_SUCCESS: {
            return {
                ...state,
                error: false,
                classificationList
            }
        }
        case FETCH_CLASSIFICATION_LIST_ERROR: {
            return {
                ...state,
                classificationList: [],
                error: true
            }
        }
        case ADD_CLASSIFICATIONLIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case ADD_CLASSIFICATIONLIST_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case ADD_CLASSIFICATIONLIST_ERROR: {
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
