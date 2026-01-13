import * as actionTypes from '../../constants/ActionTypes';
const INIT_STATE = {
  labelPrintSuccess: false,
  labelPrintLoading: false,
  labelPrintError: false,
  wipLabelPdf: {},
  fgLabelPdf: {},
  editFinishLabelPrint: {},
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case actionTypes.GENERATE_INWARD_LABEL_PRINT_PDF_REQUEST: {
      return {
        ...state,
        labelPrintLoading: true,
      };
    }
    case actionTypes.GENERATE_INWARD_LABEL_PRINT_PDF_SUCCESS: {
      return {
        ...state,
        labelPrintLoading: false,
        labelPrintSuccess: true,
      };
    }
    case actionTypes.GENERATE_INWARD_LABEL_PRINT_PDF_ERROR: {
      return {
        ...state,
        labelPrintLoading: false,
        labelPrintSuccess: false,
        labelPrintError: true,
      };
    }
    case actionTypes.GENERATE_WIP_LABEL_PRINT_PDF_REQUEST: {
      return {
        ...state,
        labelPrintLoading: true,
      };
    }
    case actionTypes.GENERATE_WIP_LABEL_PRINT_PDF_SUCCESS: {
      return {
        ...state,
        labelPrintLoading: false,
        labelPrintSuccess: true,
        wipLabelPdf: action.payload,
      };
    }
    case actionTypes.GENERATE_WIP_LABEL_PRINT_PDF_ERROR: {
      return {
        ...state,
        labelPrintLoading: false,
        labelPrintSuccess: false,
        labelPrintError: true,
        wipLabelPdf: {},
      };
    }
    case actionTypes.GENERATE_FG_LABEL_PRINT_PDF_REQUEST: {
      return {
        ...state,
        labelPrintLoading: true,
      };
    }
    case actionTypes.GENERATE_FG_LABEL_PRINT_PDF_SUCCESS: {
      return {
        ...state,
        labelPrintLoading: false,
        labelPrintSuccess: true,
        fgLabelPdf: action.payload,
      };
    }
    case actionTypes.GENERATE_FG_LABEL_PRINT_PDF_ERROR: {
      return {
        ...state,
        labelPrintLoading: false,
        labelPrintSuccess: false,
        labelPrintError: true,
        fgLabelPdf: {},
      };
    }

    case actionTypes.GENERATE_EDIT_FINISH_LABEL_PRINT_PDF_REQUEST: {
      return {
        ...state,
        labelPrintLoading: true,
      };
    }
    case actionTypes.GENERATE_EDIT_FINISH_LABEL_PRINT_PDF_SUCCESS: {
      return {
        ...state,
        labelPrintLoading: false,
        labelPrintSuccess: true,
        editFinishLabelPrint: action.payload,
      };
    }
    case actionTypes.GENERATE_EDIT_FINISH_LABEL_PRINT_PDF_ERROR: {
      return {
        ...state,
        labelPrintLoading: false,
        labelPrintSuccess: false,
        labelPrintError: true,
        editFinishLabelPrint: {},
      };
    }

    default:
      return state;
  }
};
