import * as actionTypes from '../../constants/ActionTypes';

export const labelPrintInward = payloadpdf => ({
  type: actionTypes.GENERATE_INWARD_LABEL_PRINT_PDF_REQUEST,
  payloadpdf,
});

export const labelPrintInwardSuccess = payload => ({
  type: actionTypes.GENERATE_INWARD_LABEL_PRINT_PDF_SUCCESS,
  payload,
});

export const labelPrintInwardError = error => ({
  type: actionTypes.GENERATE_INWARD_LABEL_PRINT_PDF_ERROR,
  error,
});

export const labelPrintWIP = payloadpdf => ({
  type: actionTypes.GENERATE_WIP_LABEL_PRINT_PDF_REQUEST,
  payloadpdf,
});

export const labelPrintWIPSuccess = payload => ({
  type: actionTypes.GENERATE_WIP_LABEL_PRINT_PDF_SUCCESS,
  payload,
});

export const labelPrintWIPError = error => ({
  type: actionTypes.GENERATE_WIP_LABEL_PRINT_PDF_ERROR,
  error,
});

export const labelPrintFG = payloadpdf => ({
  type: actionTypes.GENERATE_FG_LABEL_PRINT_PDF_REQUEST,
  payloadpdf,
});

export const labelPrintFGSuccess = payload => ({
  type: actionTypes.GENERATE_FG_LABEL_PRINT_PDF_SUCCESS,
  payload,
});

export const labelPrintFGError = error => ({
  type: actionTypes.GENERATE_FG_LABEL_PRINT_PDF_ERROR,
  error,
});

export const labelPrintEditFinish = payloadpdf => ({
  type: actionTypes.GENERATE_EDIT_FINISH_LABEL_PRINT_PDF_REQUEST,
  payloadpdf,
});

export const labelPrintEditFinishSuccess = payload => ({
  type: actionTypes.GENERATE_EDIT_FINISH_LABEL_PRINT_PDF_SUCCESS,
  payload,
});

export const labelPrintEditFinishError = error => ({
  type: actionTypes.GENERATE_EDIT_FINISH_LABEL_PRINT_PDF_ERROR,
  error,
});
