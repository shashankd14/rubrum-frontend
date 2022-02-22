import {
    CREATE_FORM_FIELDS
  } from "constants/ActionTypes";
  
  export const createFormFields = fieldsObj => {
    return {
      type: CREATE_FORM_FIELDS,
      payload: fieldsObj
    };
  };
