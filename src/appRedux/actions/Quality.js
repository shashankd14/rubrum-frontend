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


export const fetchTemplatesList = () => ({
  type: FETCH_TEMPLATE_LIST,
});

export const fetchTemplatesListSuccess = (templateList) => ({
  type: FETCH_TEMPLATE_LIST_SUCCESS,
  templateList
});

export const fetchTemplatesListError = (error) => ({
  type: FETCH_TEMPLATE_LIST_ERROR,
  error
});

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

export const saveQualityTemplate = payload => {
  return {
    type: SAVE_QUALITY_TEMPLATE_REQUEST,
    payload
  }
};

export const saveQualityTemplateSuccess = () => {
  return {
    type: SAVE_QUALITY_TEMPLATE_SUCCESS
  }
};

export const saveQualityTemplateError = error => {
  return {
    type: SAVE_QUALITY_TEMPLATE_ERROR,
    error
  }
};

export const getQualityTemplateById = payload => {
  return {
    type: GET_QUALITY_TEMPLATE_BY_ID_REQUEST,
    payload
  }
};

export const getQualityTemplateByIdSuccess = (templateDetails) => {
  return {
    type: GET_QUALITY_TEMPLATE_BY_ID_SUCCESS,
    templateDetails
  }
};

export const getQualityTemplateByIdError = error => {
  return {
    type: GET_QUALITY_TEMPLATE_BY_ID_ERROR,
    error
  }
};

export const updateQualityTemplate = payload => {
  return {
    type: UPDATE_QUALITY_TEMPLATE_REQUEST,
    payload
  }
};

export const updateQualityTemplateSuccess = () => {
  return {
    type: UPDATE_QUALITY_TEMPLATE_SUCCESS
  }
};

export const updateQualityTemplateError = error => {
  return {
    type: UPDATE_QUALITY_TEMPLATE_ERROR,
    error
  }
};

export const deleteQualityTemplate = payload => {
  return {
    type: DELETE_QUALITY_TEMPLATE_REQUEST,
    payload
  }
};

export const deleteQualityTemplateSuccess = () => {
  return {
    type: DELETE_QUALITY_TEMPLATE_SUCCESS
  }
};

export const deleteQualityTemplateError = error => {
  return {
    type: DELETE_QUALITY_TEMPLATE_ERROR,
    error
  }
};

export const fetchTemplatesLinkList = () => ({
  type: FETCH_TEMPLATE_LINK_LIST,
});

export const fetchTemplatesLinkListSuccess = (templateList) => ({
  type: FETCH_TEMPLATE_LINK_LIST_SUCCESS,
  templateList
});

export const fetchTemplatesLinkListError = (error) => ({
  type: FETCH_TEMPLATE_LINK_LIST_ERROR,
  error
});

export const saveQualityTemplateLink = payload => {
  return {
    type: SAVE_QUALITY_TEMPLATE_LINK_REQUEST,
    payload
  }
};

export const saveQualityTemplateLinkSuccess = () => {
  return {
    type: SAVE_QUALITY_TEMPLATE_LINK_SUCCESS
  }
};

export const saveQualityTemplateLinkError = error => {
  return {
    type: SAVE_QUALITY_TEMPLATE_LINK_ERROR,
    error
  }
};

export const getQualityTemplateLinkById = payload => {
  return {
    type: GET_QUALITY_TEMPLATE_LINK_BY_ID_REQUEST,
    payload
  }
};

export const getQualityTemplateLinkByIdSuccess = (templateDetails) => {
  return {
    type: GET_QUALITY_TEMPLATE_LINK_BY_ID_SUCCESS,
    templateDetails
  }
};

export const getQualityTemplateLinkByIdError = error => {
  return {
    type: GET_QUALITY_TEMPLATE_LINK_BY_ID_ERROR,
    error
  }
};

export const updateQualityTemplateLink = payload => {
  return {
    type: UPDATE_QUALITY_TEMPLATE_LINK_REQUEST,
    payload
  }
};

export const updateQualityTemplateLinkSuccess = () => {
  return {
    type: UPDATE_QUALITY_TEMPLATE_LINK_SUCCESS
  }
};

export const updateQualityTemplateLinkError = error => {
  return {
    type: UPDATE_QUALITY_TEMPLATE_LINK_ERROR,
    error
  }
};

export const deleteQualityTemplateLink = payload => {
  return {
    type: DELETE_QUALITY_TEMPLATE_LINK_REQUEST,
    payload
  }
};

export const deleteQualityTemplateLinkSuccess = () => {
  return {
    type: DELETE_QUALITY_TEMPLATE_LINK_SUCCESS
  }
};

export const deleteQualityTemplateLinkError = error => {
  return {
    type: DELETE_QUALITY_TEMPLATE_LINK_ERROR,
    error
  }
};
