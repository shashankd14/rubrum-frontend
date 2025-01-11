import {
    SEND_REPORT_REQUEST,
    SEND_REPORT_SUCCESS,
    SEND_REPORT_ERROR,
    RESET_REPORT_SUCCESS
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
                loading: true,
                success: false
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

        case RESET_REPORT_SUCCESS: {
            return {
                ...state,
                success: false
            }
        }

        default:
            return state;
    }
}
