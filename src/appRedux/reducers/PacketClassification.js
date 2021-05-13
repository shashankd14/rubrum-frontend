import {
    FETCH_CLASSIFICATION_LIST_REQUEST,
    FETCH_CLASSIFICATION_LIST_SUCCESS,
    FETCH_CLASSIFICATION_LIST_ERROR,
} from "../../constants/ActionTypes";

const INIT_STATE = {
    classificationList: [],
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
        default:
            return state;
    }
}
