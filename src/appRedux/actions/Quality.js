import {
    CREATE_FORM_FIELDS,
    SAVE_TEMPLATE_REQUEST,
    SAVE_TEMPLATE_SUCCESS,
    SAVE_TEMPLATE_ERROR,
    TEMPLATE_NAME
  } from "constants/ActionTypes";
  
  export const createFormFields = (fieldsObj, formName) => {
    return {
      type: CREATE_FORM_FIELDS,
      payload: fieldsObj,
      formName
    };
  };

  export const setTemplateName = name => {
    return {
      type: TEMPLATE_NAME,
      name
    }
  }

  export const saveTemplate = payload => {
    return {
      type: SAVE_TEMPLATE_REQUEST,
      payload
    }
  };

  export const saveTemplateSuccess = () => {
    return {
      type: SAVE_TEMPLATE_SUCCESS
    }
  };

  export const saveTemplateError = error => {
    return {
      type: SAVE_TEMPLATE_ERROR,
      error
    }
  };
