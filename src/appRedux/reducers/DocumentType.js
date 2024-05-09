import {
    FETCH_DOCUMENT_TYPE_LIST_REQUEST,
    FETCH_DOCUMENT_TYPE_LIST_SUCCESS,
    FETCH_DOCUMENT_TYPE_LIST_ERROR,
    ADD_DOCUMENT_TYPE_REQUEST,
    ADD_DOCUMENT_TYPE_SUCCESS,
    ADD_DOCUMENT_TYPE_ERROR,
    FETCH_DOCUMENT_TYPE_LIST_ID_ERROR, 
    FETCH_DOCUMENT_TYPE_LIST_ID_REQUEST, 
    FETCH_DOCUMENT_TYPE_LIST_ID_SUCCESS,
    UPDATE_DOCUMENT_TYPE_REQUEST,
    UPDATE_DOCUMENT_TYPE_SUCCESS,
    UPDATE_DOCUMENT_TYPE_ERROR,
    RESET_DOCUMENT_TYPE_REQUEST,
} from "../../constants/ActionTypes";

const INIT_STATE = {
    documentTypeList: [],
    documentTypeId: {},
    loading: false,
    error: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_DOCUMENT_TYPE_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_DOCUMENT_TYPE_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                documentTypeList: action.DocumentTypeList
            }
        }
        case FETCH_DOCUMENT_TYPE_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                documentTypeList: [],
                error: true
            }
        }

        case ADD_DOCUMENT_TYPE_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case ADD_DOCUMENT_TYPE_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case ADD_DOCUMENT_TYPE_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_DOCUMENT_TYPE_LIST_ID_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_DOCUMENT_TYPE_LIST_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                documentTypeId: action.DocumentType
            }
        }
        case FETCH_DOCUMENT_TYPE_LIST_ID_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case RESET_DOCUMENT_TYPE_REQUEST: {
            return {
                ...state,
                documentType: {}
            }
        }

        case UPDATE_DOCUMENT_TYPE_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case UPDATE_DOCUMENT_TYPE_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case UPDATE_DOCUMENT_TYPE_ERROR: {
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
