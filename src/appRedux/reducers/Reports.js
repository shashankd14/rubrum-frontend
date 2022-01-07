import {
    SEND_REPORT_REQUEST,
    SEND_REPORT_SUCCESS,
    SEND_REPORT_ERROR
} from "../../constants/ActionTypes";

const INIT_STATE = {
    loading: false,
    success: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case SEND_REPORT_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case SEND_REPORT_SUCCESS: {
            return {
                ...state,
                loading: false,
                success: true
            }
        }
        case SEND_REPORT_ERROR: {
            return {
                ...state,
                loading: false,
                success: false
            }
        }

        default:
            return state;
    }
}
