import {
    CREATE_FORM_FIELDS
  } from "constants/ActionTypes";
  
  const INIT_STATE = {
    formFields: {}
  };
  
  
  export default (state = INIT_STATE, action) => {
    switch (action.type) {
      case CREATE_FORM_FIELDS: {
        return {
          ...state,
          formFields: { ...action.payload }
        }
      }
      default:
        return state;
    }
  }
  