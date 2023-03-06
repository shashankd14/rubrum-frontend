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

} from "constants/ActionTypes";

const INIT_STATE = {
  templateName: '',
  operation: "",
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
  error: false
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
        loading: true
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
    case SAVE_QUALITY_TEMPLATE_LINK_REQUEST:
      return {
        ...state,
        loading: true
      }
    case SAVE_QUALITY_TEMPLATE_LINK_SUCCESS:
      return {
        ...state,
        loading: false
      }
    case SAVE_QUALITY_TEMPLATE_LINK_ERROR:
      return {
        ...state,
        error: true,
        loading: false
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

    default:
      return state;
  }
}
