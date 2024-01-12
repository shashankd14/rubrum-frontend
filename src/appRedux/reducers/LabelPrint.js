import * as actionTypes from "../../constants/ActionTypes";
const INIT_STATE = {
    labelPrintSuccess:false,
    labelPrintLoading: false,
    labelPrintError: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case actionTypes.GENERATE_INWARD_LABEL_PRINT_PDF_REQUEST: {
            return {
                ...state,
                labelPrintLoading: true,
            }
        }
        case actionTypes.GENERATE_INWARD_LABEL_PRINT_PDF_SUCCESS: {
            return {
                ...state,
                labelPrintLoading: false,
                labelPrintSuccess: true,
            }
        }
        case actionTypes.GENERATE_INWARD_LABEL_PRINT_PDF_ERROR: {
            return {
                ...state,
                labelPrintLoading: false,
                labelPrintSuccess: false,
                labelPrintError: true
            }
        }
        
        default:
            return state;
    }
}
