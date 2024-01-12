import * as actionTypes from "../../constants/ActionTypes";

export const labelPrintInward = (payloadpdf) => ({
    type: actionTypes.GENERATE_INWARD_LABEL_PRINT_PDF_REQUEST,
    payloadpdf
});

export const labelPrintInwardSuccess = (payload) => ({
    type: actionTypes.GENERATE_INWARD_LABEL_PRINT_PDF_SUCCESS,
    payload
});

export const labelPrintInwardError = (error) => ({
    type: actionTypes.GENERATE_INWARD_LABEL_PRINT_PDF_ERROR,
    error
});