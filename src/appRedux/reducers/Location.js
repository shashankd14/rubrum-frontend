import {
    FETCH_LOCATION_LIST_REQUEST,
    FETCH_LOCATION_LIST_SUCCESS,
    FETCH_LOCATION_LIST_ERROR,
    ADD_LOCATION_REQUEST,
    ADD_LOCATION_SUCCESS,
    ADD_LOCATION_ERROR,
    FETCH_LOCATION_LIST_ID_ERROR, 
    FETCH_LOCATION_LIST_ID_REQUEST, 
    FETCH_LOCATION_LIST_ID_SUCCESS,
    UPDATE_LOCATION_REQUEST,
    UPDATE_LOCATION_SUCCESS,
    UPDATE_LOCATION_ERROR,
    RESET_LOCATION_REQUEST,
    FETCH_STATE_LIST_REQUEST,
    FETCH_STATE_LIST_SUCCESS,
    FETCH_STATE_LIST_ERROR
} from "../../constants/ActionTypes";

const INIT_STATE = {
    locationList: [],
    locationId: {},
    StateList: [],
    loading: false,
    error: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_LOCATION_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_LOCATION_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                locationList: action.LocationList
            }
        }
        case FETCH_LOCATION_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                locationList: [],
                error: true
            }
        }

        case ADD_LOCATION_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case ADD_LOCATION_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case ADD_LOCATION_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_LOCATION_LIST_ID_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_LOCATION_LIST_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                locationId: action.Location
            }
        }
        case FETCH_LOCATION_LIST_ID_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case RESET_LOCATION_REQUEST: {
            return {
                ...state,
                location: {}
            }
        }

        case UPDATE_LOCATION_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case UPDATE_LOCATION_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case UPDATE_LOCATION_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }
        case FETCH_STATE_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_STATE_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                stateList: action.StateList
            }
        }
        case FETCH_STATE_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                stateList: [],
                error: true
            }
        }
        
        default:
            return state;
    }
}
