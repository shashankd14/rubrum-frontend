import {
    FETCH_PARTY_LIST_REQUEST,
    FETCH_PARTY_LIST_SUCCESS,
    FETCH_PARTY_LIST_ERROR,
} from "../../constants/ActionTypes";

const INIT_STATE = {
    partyList: [],
    loading: false,
    error: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_PARTY_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_PARTY_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                partyList: action.partyList
            }
        }
        case FETCH_PARTY_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                partyList: [],
                error: true
            }
        }
        default:
            return state;
    }
}
