import {
  CREATE_FORM_FIELDS,
  SAVE_TEMPLATE_REQUEST,
  SAVE_TEMPLATE_SUCCESS,
  SAVE_TEMPLATE_ERROR,
  SAVE_QUALITY_TEMPLATE_REQUEST,
  SAVE_QUALITY_TEMPLATE_SUCCESS,
  SAVE_QUALITY_TEMPLATE_ERROR,
  GET_QUALITY_TEMPLATE_BY_ID_REQUEST,
  GET_QUALITY_TEMPLATE_BY_ID_SUCCESS,
  GET_QUALITY_TEMPLATE_BY_ID_ERROR,
  UPDATE_QUALITY_TEMPLATE_REQUEST,
  UPDATE_QUALITY_TEMPLATE_SUCCESS,
  UPDATE_QUALITY_TEMPLATE_ERROR,
  DELETE_QUALITY_TEMPLATE_REQUEST,
  DELETE_QUALITY_TEMPLATE_SUCCESS,
  DELETE_QUALITY_TEMPLATE_ERROR,
  TEMPLATE_NAME,
  FETCH_TEMPLATE_LIST,
  FETCH_TEMPLATE_LIST_SUCCESS,
  FETCH_TEMPLATE_LIST_ERROR,
  FETCH_TEMPLATE_LINK_LIST,
  FETCH_TEMPLATE_LINK_LIST_SUCCESS,
  FETCH_TEMPLATE_LINK_LIST_ERROR,
  SAVE_QUALITY_TEMPLATE_LINK_REQUEST,
  SAVE_QUALITY_TEMPLATE_LINK_SUCCESS,
  SAVE_QUALITY_TEMPLATE_LINK_ERROR,
  GET_QUALITY_TEMPLATE_LINK_BY_ID_REQUEST,
  GET_QUALITY_TEMPLATE_LINK_BY_ID_SUCCESS,
  GET_QUALITY_TEMPLATE_LINK_BY_ID_ERROR,
  UPDATE_QUALITY_TEMPLATE_LINK_REQUEST,
  UPDATE_QUALITY_TEMPLATE_LINK_SUCCESS,
  UPDATE_QUALITY_TEMPLATE_LINK_ERROR,
  DELETE_QUALITY_TEMPLATE_LINK_REQUEST,
  DELETE_QUALITY_TEMPLATE_LINK_SUCCESS,
  DELETE_QUALITY_TEMPLATE_LINK_ERROR,
  FETCH_QUALITY_REPORT_STAGE_REQUEST,
  FETCH_QUALITY_REPORT_STAGE_SUCCESS,
  FETCH_QUALITY_REPORT_STAGE_ERROR,
  FETCH_QUALITY_REPORT_REQUEST,
  FETCH_QUALITY_REPORT_SUCCESS,
  FETCH_QUALITY_REPORT_ERROR,
  SAVE_QUALITY_REPORT_REQUEST,
  SAVE_QUALITY_REPORT_SUCCESS,
  SAVE_QUALITY_REPORT_ERROR,
  GET_QUALITY_REPORT_BY_ID_REQUEST,
  GET_QUALITY_REPORT_BY_ID_SUCCESS,
  GET_QUALITY_REPORT_BY_ID_ERROR,
  UPDATE_QUALITY_REPORT_REQUEST,
  UPDATE_QUALITY_REPORT_SUCCESS,
  UPDATE_QUALITY_REPORT_ERROR,
  DELETE_QUALITY_REPORT_REQUEST,
  DELETE_QUALITY_REPORT_SUCCESS,
  DELETE_QUALITY_REPORT_ERROR,
  FETCH_KQP_LIST,
  FETCH_KQP_LIST_SUCCESS,
  FETCH_KQP_LIST_ERROR,
  SAVE_KQP_REQUEST,
  SAVE_KQP_SUCCESS,
  SAVE_KQP_ERROR,
  GET_KQP_BY_ID_REQUEST,
  GET_KQP_BY_ID_SUCCESS,
  GET_KQP_BY_ID_ERROR,
  UPDATE_KQP_REQUEST,
  UPDATE_KQP_SUCCESS,
  UPDATE_KQP_ERROR,
  DELETE_KQP_REQUEST,
  DELETE_KQP_SUCCESS,
  DELETE_KQP_ERROR,
  FETCH_KQP_LINK_LIST,
  FETCH_KQP_LINK_LIST_SUCCESS,
  FETCH_KQP_LINK_LIST_ERROR,
  SAVE_KQP_LINK_REQUEST,
  SAVE_KQP_LINK_SUCCESS,
  SAVE_KQP_LINK_ERROR,
  GET_KQP_LINK_BY_ID_REQUEST,
  GET_KQP_LINK_BY_ID_SUCCESS,
  GET_KQP_LINK_BY_ID_ERROR,
  UPDATE_KQP_LINK_REQUEST,
  UPDATE_KQP_LINK_SUCCESS,
  UPDATE_KQP_LINK_ERROR,
  DELETE_KQP_LINK_REQUEST,
  DELETE_KQP_LINK_SUCCESS,
  DELETE_KQP_LINK_ERROR,
  UPDATE_TEMPLATE_PROCESSING_FORM_DATA,
  UPDATE_QR_PROCESSING_FORM_DATA,
} from "constants/ActionTypes";
import * as actionTypes from "../../constants/ActionTypes";

const INIT_STATE = {
  templateName: '',
  operation: "",
  thicknessList:[],
  widthList:[],
  lengthList:[],
  packetDetails:[],
  formFields: {
    inward: [],
    preProcessing: [],
    processing: {
      slitFields: [],
      cutFields: []
    },
    preDispatch: [],
    postDispatch: []
  },
  loading: false,
  data: [],
  totalItems: 0,
  linkListData: [],
  error: false,
  pdfLoadingInward: false,
  pdfSuccessInward: false,
  pdfErrorInward: false
};


export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case TEMPLATE_NAME: {
      return {
        ...state,
        templateName: action.name
      }
    }
    case CREATE_FORM_FIELDS: {
      return {
        ...state,
        formFields: {
          ...state.formFields,
          [action.formName]: action.formName === 'processing' ? { ...action.payload } : [
            ...action.payload
          ]
        }
      }
    }
    case SAVE_TEMPLATE_REQUEST:
      return {
        ...state,
        loading: true
      }
    case SAVE_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false
      }
    case SAVE_TEMPLATE_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      }
    case SAVE_QUALITY_TEMPLATE_REQUEST:
      return {
        ...state,
        loading: true
      }
    case SAVE_QUALITY_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false
      }
    case SAVE_QUALITY_TEMPLATE_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      }
    case GET_QUALITY_TEMPLATE_BY_ID_REQUEST:
      return {
        ...state,
        loading: true
      }
    case GET_QUALITY_TEMPLATE_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.templateDetails,
        operation: "templateById"
      }
    case GET_QUALITY_TEMPLATE_BY_ID_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      }
    case UPDATE_QUALITY_TEMPLATE_REQUEST:
      return {
        ...state,
        loading: true
      }
    case UPDATE_QUALITY_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.templateDetails,
        operation: "templateById"
      }
    case UPDATE_QUALITY_TEMPLATE_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      }
    case DELETE_QUALITY_TEMPLATE_REQUEST:
      return {
        ...state,
        loading: true
      }
    case DELETE_QUALITY_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.templateDetails,
        operation: "templateById"
      }
    case DELETE_QUALITY_TEMPLATE_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      }
    case FETCH_TEMPLATE_LIST:
      return {
        ...state,
        error: false,
        loading: true
      }
    case FETCH_TEMPLATE_LIST_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
        data: action.templateList,
        operation: "templateList"
      }
    case FETCH_TEMPLATE_LIST_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      }
    case FETCH_TEMPLATE_LINK_LIST:
      return {
        ...state,
        error: false,
        loading: true,
        templateLinkList: null
      }
    case FETCH_TEMPLATE_LINK_LIST_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
        data: action.templateList,
        operation: "templateLinkList"
      }
    case FETCH_TEMPLATE_LINK_LIST_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      }
      case actionTypes.STORE_LINK_LIST_DATA:
        return {
          ...state,
          linkListData: action.payload,
        };
    case SAVE_QUALITY_TEMPLATE_LINK_REQUEST:
      return {
        ...state,
        loading: true
      }
    case SAVE_QUALITY_TEMPLATE_LINK_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
        operation: "templateLinkSave"
      }
    case SAVE_QUALITY_TEMPLATE_LINK_ERROR:
      return {
        ...state,
        error: true,
        loading: false,
      }
    case GET_QUALITY_TEMPLATE_LINK_BY_ID_REQUEST:
      return {
        ...state,
        loading: true
      }
    case GET_QUALITY_TEMPLATE_LINK_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.templateDetails,
        operation: "templateLinkById"
      }
    case GET_QUALITY_TEMPLATE_LINK_BY_ID_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      }
    case UPDATE_QUALITY_TEMPLATE_LINK_REQUEST:
      return {
        ...state,
        loading: true
      }
    case UPDATE_QUALITY_TEMPLATE_LINK_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.templateDetails,
        operation: "templateLinkById"
      }
    case UPDATE_QUALITY_TEMPLATE_LINK_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      }
    case DELETE_QUALITY_TEMPLATE_LINK_REQUEST:
      return {
        ...state,
        loading: true
      }
    case DELETE_QUALITY_TEMPLATE_LINK_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.templateDetails,
        operation: "templateLinkById"
      }
    case DELETE_QUALITY_TEMPLATE_LINK_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      }
    case FETCH_QUALITY_REPORT_STAGE_REQUEST:
      return {
        ...state,
        error: false,
        loading: true
      }
    case FETCH_QUALITY_REPORT_STAGE_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
        data: action.templateList.content,
        totalItems: action.templateList.totalItems,
        operation: "fetchQualityReportStage"
      }
    case FETCH_QUALITY_REPORT_STAGE_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      }
    case FETCH_QUALITY_REPORT_REQUEST:
      return {
        ...state,
        error: false,
        loading: true
      }
    case FETCH_QUALITY_REPORT_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
        data: action.templateList,
        operation: "fetchQualityReport"
      }
    case FETCH_QUALITY_REPORT_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      }
    case SAVE_QUALITY_REPORT_REQUEST:
      return {
        ...state,
        loading: true
      }
    case SAVE_QUALITY_REPORT_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
        operation: "qualityReportSave"
      }
    case SAVE_QUALITY_REPORT_ERROR:
      return {
        ...state,
        error: true,
        loading: false,
      }
    case GET_QUALITY_REPORT_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        operation: "qualityReportById"
      }
    case GET_QUALITY_REPORT_BY_ID_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
        data: action.reportById,
        operation: "qualityReportById"
      }
    case GET_QUALITY_REPORT_BY_ID_ERROR:
      return {
        ...state,
        error: true,
        loading: false,
      }

    case FETCH_KQP_LIST:
      return {
        ...state,
        error: false,
        loading: true
      }
    case FETCH_KQP_LIST_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
        data: action.templateList,
        operation: "kqpList"
      }
    case FETCH_KQP_LIST_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      }
    case SAVE_KQP_REQUEST:
      return {
        ...state,
        loading: true
      }
    case SAVE_KQP_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
        operation: "kqpSave"
      }
    case SAVE_KQP_ERROR:
      return {
        ...state,
        error: true,
        loading: false,
      }
    case GET_KQP_BY_ID_REQUEST:
      return {
        ...state,
        loading: true
      }
    case GET_KQP_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.templateDetails,
        operation: "kqpById"
      }
    case GET_KQP_BY_ID_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      }
    case UPDATE_KQP_REQUEST:
      return {
        ...state,
        loading: true
      }
    case UPDATE_KQP_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.templateDetails,
        operation: "kqpUpdateById"
      }
    case UPDATE_KQP_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      }
    case DELETE_KQP_REQUEST:
      return {
        ...state,
        loading: true
      }
    case DELETE_KQP_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.templateDetails,
        operation: "kqpDeleteById"
      }
    case DELETE_KQP_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      }

    case FETCH_KQP_LINK_LIST:
      return {
        ...state,
        error: false,
        loading: true
      }
    case FETCH_KQP_LINK_LIST_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
        data: action.templateList,
        operation: "kqpLinkList"
      }
    case FETCH_KQP_LINK_LIST_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      }
    case SAVE_KQP_LINK_REQUEST:
      return {
        ...state,
        loading: true
      }
    case SAVE_KQP_LINK_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
        operation: "kqpLinkSave"
      }
    case SAVE_KQP_LINK_ERROR:
      return {
        ...state,
        error: true,
        loading: false,
      }
    case GET_KQP_LINK_BY_ID_REQUEST:
      return {
        ...state,
        loading: true
      }
    case GET_KQP_LINK_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.templateDetails,
        operation: "kqpLinkById"
      }
    case GET_KQP_LINK_BY_ID_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      }
    case UPDATE_KQP_LINK_REQUEST:
      return {
        ...state,
        loading: true
      }
    case UPDATE_KQP_LINK_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.templateDetails,
        operation: "kqpUpdateLinkById"
      }
    case UPDATE_KQP_LINK_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      }
    case DELETE_KQP_LINK_REQUEST:
      return {
        ...state,
        loading: true
      }
    case DELETE_KQP_LINK_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.templateDetails,
        operation: "kqpDeleteLinkById"
      }
    case DELETE_KQP_LINK_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      }
    case UPDATE_TEMPLATE_PROCESSING_FORM_DATA:
      return {
        ...state,
      }
    case UPDATE_QR_PROCESSING_FORM_DATA:
      return {
        ...state,
      }
      case DELETE_QUALITY_REPORT_REQUEST:
      return {
        ...state,
        loading: true
      }
    case DELETE_QUALITY_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.templateDetails,
        //operation: "templateById"
      }
    case DELETE_QUALITY_REPORT_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      }
      //get List of thickness QM dropdown
      case actionTypes.GET_THICKNESS_LIST_QM_REQUEST:
        return {
          ...state,
          error: false,
          loading: true
        }
      case actionTypes.GET_THICKNESS_LIST_QM_SUCCESS:
        return {
          ...state,
          error: false,
          loading: false,
          thicknessList: action.thicknessList,
        }
      case actionTypes.GET_THICKNESS_LIST_QM_ERROR:
        return {
          ...state,
          error: true,
          loading: false
        }
      //get List of width QM dropdown
      case actionTypes.GET_WIDTH_LIST_QM_REQUEST:
        return {
          ...state,
          error: false,
          loading: true
        }
      case actionTypes.GET_WIDTH_LIST_QM_SUCCESS:
        return {
          ...state,
          error: false,
          loading: false,
          widthList: action.widthList,
        }
      case actionTypes.GET_WIDTH_LIST_QM_ERROR:
        return {
          ...state,
          error: true,
          loading: false
        }
      //get List of length QM dropdown
      case actionTypes.GET_LENGTH_LIST_QM_REQUEST:
        return {
          ...state,
          error: false,
          loading: true
        }
      case actionTypes.GET_LENGTH_LIST_QM_SUCCESS:
        return {
          ...state,
          error: false,
          loading: false,
          lengthList: action.lengthList,
        }
      case actionTypes.GET_LENGTH_LIST_QM_ERROR:
        return {
          ...state,
          error: true,
          loading: false
        }
      //Get packetDetails in quality processStage
      case actionTypes.GET_PACKET_DETAILS_QUALITY_PROCESS_REQUEST:
        return {
          ...state,
          error: false,
          loading: true
        }
      case actionTypes.GET_PACKET_DETAILS_QUALITY_PROCESS_SUCCESS:
        return {
          ...state,
          error: false,
          loading: false,
          packetDetails: action.packetDetails,
        }
      case actionTypes.GET_PACKET_DETAILS_QUALITY_PROCESS_ERROR:
        return {
          ...state,
          error: true,
          loading: false
        }
         //inward QM report pdf
      case actionTypes.GENERATE_INWARD_PDF_QUALITY_MODULE_REPORT_REQUEST:
        return{
          ...state,
          pdfLoadingInward: true
        }
      case actionTypes.GENERATE_INWARD_PDF_QUALITY_MODULE_REPORT_SUCCESS:
        return{
          ...state,
          pdfLoadingInward: false,
          pdfSuccessInward: true
        }
      case actionTypes.GENERATE_INWARD_PDF_QUALITY_MODULE_REPORT_ERROR:
        return{
          ...state,
          pdfLoadingInward: false,
          pdfSuccessInward: false,
          pdfErrorInward: true
        }
    default:
      return state;
  }
}
