import {
    FETCH_PROCESS_LIST_ERROR, 
    FETCH_PROCESS_LIST_REQUEST, 
    FETCH_PROCESS_LIST_SUCCESS
} from "../../constants/ActionTypes";

const INIT_STATE = {
    processList: [],
    loading: false,
    error: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_PROCESS_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_PROCESS_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                processList: action.processList
            }
        }
        case FETCH_PROCESS_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                processList: [],
                error: true
            }
        }
        default:
            return state;
    }
}
