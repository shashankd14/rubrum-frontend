import {
    CREATE_FORM_FIELDS,
    SAVE_TEMPLATE_REQUEST,
    SAVE_TEMPLATE_SUCCESS,
    SAVE_TEMPLATE_ERROR,
    TEMPLATE_NAME,
    FETCH_TEMPLATE_LIST,
    FETCH_TEMPLATE_LIST_SUCCESS,
    FETCH_TEMPLATE_LIST_ERROR
  } from "constants/ActionTypes";
  
  const INIT_STATE = {
    templateName: '',
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
            data: action.templateList
          }
      case FETCH_TEMPLATE_LIST_ERROR: 
          return {
            ...state,
            error: true,
            loading: false
          }
          
      default:
        return state;
    }
  }
  