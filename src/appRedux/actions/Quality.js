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
  UPDATE_TEMPLATE_PROCESSING_FORM_DATA,
  UPDATE_QR_PROCESSING_FORM_DATA,
} from 'constants/ActionTypes';
import * as actionTypes from '../../constants/ActionTypes';

export const fetchTemplatesList = () => ({
  type: FETCH_TEMPLATE_LIST,
});

export const fetchTemplatesListSuccess = templateList => ({
  type: FETCH_TEMPLATE_LIST_SUCCESS,
  templateList,
});

export const fetchTemplatesListError = error => ({
  type: FETCH_TEMPLATE_LIST_ERROR,
  error,
});

export const createFormFields = (fieldsObj, formName) => {
  return {
    type: CREATE_FORM_FIELDS,
    payload: fieldsObj,
    formName,
  };
};

export const setTemplateName = name => {
  return {
    type: TEMPLATE_NAME,
    name,
  };
};

export const saveTemplate = payload => {
  return {
    type: SAVE_TEMPLATE_REQUEST,
    payload,
  };
};

export const saveTemplateSuccess = () => {
  return {
    type: SAVE_TEMPLATE_SUCCESS,
  };
};

export const saveTemplateError = error => {
  return {
    type: SAVE_TEMPLATE_ERROR,
    error,
  };
};

export const saveQualityTemplate = payload => {
  return {
    type: SAVE_QUALITY_TEMPLATE_REQUEST,
    payload,
  };
};

export const saveQualityTemplateSuccess = () => {
  return {
    type: SAVE_QUALITY_TEMPLATE_SUCCESS,
  };
};

export const saveQualityTemplateError = error => {
  return {
    type: SAVE_QUALITY_TEMPLATE_ERROR,
    error,
  };
};

export const getQualityTemplateById = payload => {
  return {
    type: GET_QUALITY_TEMPLATE_BY_ID_REQUEST,
    payload,
  };
};

export const getQualityTemplateByIdSuccess = templateDetails => {
  return {
    type: GET_QUALITY_TEMPLATE_BY_ID_SUCCESS,
    templateDetails,
  };
};

export const getQualityTemplateByIdError = error => {
  return {
    type: GET_QUALITY_TEMPLATE_BY_ID_ERROR,
    error,
  };
};

export const updateQualityTemplate = payload => {
  return {
    type: UPDATE_QUALITY_TEMPLATE_REQUEST,
    payload,
  };
};

export const updateQualityTemplateSuccess = () => {
  return {
    type: UPDATE_QUALITY_TEMPLATE_SUCCESS,
  };
};

export const updateQualityTemplateError = error => {
  return {
    type: UPDATE_QUALITY_TEMPLATE_ERROR,
    error,
  };
};

export const deleteQualityTemplate = payload => {
  return {
    type: DELETE_QUALITY_TEMPLATE_REQUEST,
    payload,
  };
};

export const deleteQualityTemplateSuccess = () => {
  return {
    type: DELETE_QUALITY_TEMPLATE_SUCCESS,
  };
};

export const deleteQualityTemplateError = error => {
  return {
    type: DELETE_QUALITY_TEMPLATE_ERROR,
    error,
  };
};

export const fetchTemplatesLinkList = params => ({
  type: FETCH_TEMPLATE_LINK_LIST,
  params,
});

export const fetchTemplatesLinkListSuccess = templateList => ({
  type: FETCH_TEMPLATE_LINK_LIST_SUCCESS,
  templateList,
});

export const fetchTemplatesLinkListError = error => ({
  type: FETCH_TEMPLATE_LINK_LIST_ERROR,
  error,
});
//it is used to show templateName in QR view
export const storeLinkListData = linkListData => ({
  type: actionTypes.STORE_LINK_LIST_DATA,
  payload: linkListData,
});
export const saveQualityTemplateLink = payload => {
  return {
    type: SAVE_QUALITY_TEMPLATE_LINK_REQUEST,
    payload,
  };
};

export const saveQualityTemplateLinkSuccess = () => {
  return {
    type: SAVE_QUALITY_TEMPLATE_LINK_SUCCESS,
  };
};

export const saveQualityTemplateLinkError = error => {
  return {
    type: SAVE_QUALITY_TEMPLATE_LINK_ERROR,
    error,
  };
};

export const getQualityTemplateLinkById = payload => {
  return {
    type: GET_QUALITY_TEMPLATE_LINK_BY_ID_REQUEST,
    payload,
  };
};

export const getQualityTemplateLinkByIdSuccess = templateDetails => {
  return {
    type: GET_QUALITY_TEMPLATE_LINK_BY_ID_SUCCESS,
    templateDetails,
  };
};

export const getQualityTemplateLinkByIdError = error => {
  return {
    type: GET_QUALITY_TEMPLATE_LINK_BY_ID_ERROR,
    error,
  };
};

export const updateQualityTemplateLink = payload => {
  return {
    type: UPDATE_QUALITY_TEMPLATE_LINK_REQUEST,
    payload,
  };
};

export const updateQualityTemplateLinkSuccess = () => {
  return {
    type: UPDATE_QUALITY_TEMPLATE_LINK_SUCCESS,
  };
};

export const updateQualityTemplateLinkError = error => {
  return {
    type: UPDATE_QUALITY_TEMPLATE_LINK_ERROR,
    error,
  };
};

export const deleteQualityTemplateLink = payload => {
  return {
    type: DELETE_QUALITY_TEMPLATE_LINK_REQUEST,
    payload,
  };
};

export const deleteQualityTemplateLinkSuccess = () => {
  return {
    type: DELETE_QUALITY_TEMPLATE_LINK_SUCCESS,
  };
};

export const deleteQualityTemplateLinkError = error => {
  return {
    type: DELETE_QUALITY_TEMPLATE_LINK_ERROR,
    error,
  };
};

/////////

export const fetchKqpLinkList = () => ({
  type: FETCH_KQP_LINK_LIST,
});

export const fetchKqpLinkListSuccess = templateList => ({
  type: FETCH_KQP_LINK_LIST_SUCCESS,
  templateList,
});

export const fetchKqpLinkListError = error => ({
  type: FETCH_KQP_LINK_LIST_ERROR,
  error,
});

export const saveKqpLink = payload => {
  return {
    type: SAVE_KQP_LINK_REQUEST,
    payload,
  };
};

export const saveKqpLinkSuccess = () => {
  return {
    type: SAVE_KQP_LINK_SUCCESS,
  };
};

export const saveKqpLinkError = error => {
  return {
    type: SAVE_KQP_LINK_ERROR,
    error,
  };
};

export const getKqpLinkById = payload => {
  return {
    type: GET_KQP_LINK_BY_ID_REQUEST,
    payload,
  };
};

export const getKqpLinkByIdSuccess = templateDetails => {
  return {
    type: GET_KQP_LINK_BY_ID_SUCCESS,
    templateDetails,
  };
};

export const getKqpLinkByIdError = error => {
  return {
    type: GET_KQP_LINK_BY_ID_ERROR,
    error,
  };
};

export const updateKqpLink = payload => {
  return {
    type: UPDATE_KQP_LINK_REQUEST,
    payload,
  };
};

export const updateKqpLinkSuccess = () => {
  return {
    type: UPDATE_KQP_LINK_SUCCESS,
  };
};

export const updateKqpLinkError = error => {
  return {
    type: UPDATE_KQP_LINK_ERROR,
    error,
  };
};

export const deleteKqpLink = payload => {
  return {
    type: DELETE_KQP_LINK_REQUEST,
    payload,
  };
};

export const deleteKqpLinkSuccess = () => {
  return {
    type: DELETE_KQP_LINK_SUCCESS,
  };
};

export const deleteKqpLinkError = error => {
  return {
    type: DELETE_KQP_LINK_ERROR,
    error,
  };
};

//######################

export const fetchKqpList = () => ({
  type: FETCH_KQP_LIST,
});

export const fetchKqpListSuccess = templateList => ({
  type: FETCH_KQP_LIST_SUCCESS,
  templateList,
});

export const fetchKqpListError = error => ({
  type: FETCH_KQP_LIST_ERROR,
  error,
});

export const saveKqp = payload => {
  return {
    type: SAVE_KQP_REQUEST,
    payload,
  };
};

export const saveKqpSuccess = () => {
  return {
    type: SAVE_KQP_SUCCESS,
  };
};

export const saveKqpError = error => {
  return {
    type: SAVE_KQP_ERROR,
    error,
  };
};

export const getKqpById = payload => {
  return {
    type: GET_KQP_BY_ID_REQUEST,
    payload,
  };
};

export const getKqpByIdSuccess = templateDetails => {
  return {
    type: GET_KQP_BY_ID_SUCCESS,
    templateDetails,
  };
};

export const getKqpByIdError = error => {
  return {
    type: GET_KQP_BY_ID_ERROR,
    error,
  };
};

export const updateKqp = payload => {
  return {
    type: UPDATE_KQP_REQUEST,
    payload,
  };
};

export const updateKqpSuccess = () => {
  return {
    type: UPDATE_KQP_SUCCESS,
  };
};

export const updateKqpError = error => {
  return {
    type: UPDATE_KQP_ERROR,
    error,
  };
};

export const deleteKqp = payload => {
  return {
    type: DELETE_KQP_REQUEST,
    payload,
  };
};

export const deleteKqpSuccess = () => {
  return {
    type: DELETE_KQP_SUCCESS,
  };
};

export const deleteKqpError = error => {
  return {
    type: DELETE_KQP_ERROR,
    error,
  };
};

// quality report

export const fetchQualityReportStageList = payload => {
  return {
    type: FETCH_QUALITY_REPORT_STAGE_REQUEST,
    payload,
  };
};

export const fetchQualityReportStageListSuccess = templateList => ({
  type: FETCH_QUALITY_REPORT_STAGE_SUCCESS,
  templateList,
});

export const fetchQualityReportStageListError = error => ({
  type: FETCH_QUALITY_REPORT_STAGE_ERROR,
  error,
});

export const fetchQualityReportList = () => ({
  type: FETCH_QUALITY_REPORT_REQUEST,
});

export const fetchQualityReportListSuccess = templateList => ({
  type: FETCH_QUALITY_REPORT_SUCCESS,
  templateList,
});

export const fetchQualityReportListError = error => ({
  type: FETCH_QUALITY_REPORT_ERROR,
  error,
});

export const saveQualityReport = payload => {
  return {
    type: SAVE_QUALITY_REPORT_REQUEST,
    payload,
  };
};

export const saveQualityReportSuccess = () => {
  return {
    type: SAVE_QUALITY_REPORT_SUCCESS,
  };
};

export const saveQualityReportError = error => {
  return {
    type: SAVE_QUALITY_REPORT_ERROR,
    error,
  };
};

export const getQualityReportById = payload => {
  return {
    type: GET_QUALITY_REPORT_BY_ID_REQUEST,
    payload,
  };
};

export const getQualityReportByIdSuccess = reportById => {
  return {
    type: GET_QUALITY_REPORT_BY_ID_SUCCESS,
    reportById,
  };
};

export const getQualityReportByIdError = error => {
  return {
    type: GET_QUALITY_REPORT_BY_ID_ERROR,
    error,
  };
};

export const updateQualityReport = payload => {
  return {
    type: UPDATE_QUALITY_REPORT_REQUEST,
    payload,
  };
};

export const updateQualityReportSuccess = () => {
  return {
    type: UPDATE_QUALITY_REPORT_SUCCESS,
  };
};

export const updateQualityReportError = error => {
  return {
    type: UPDATE_QUALITY_REPORT_ERROR,
    error,
  };
};

export const deleteQualityReport = payload => {
  return {
    type: DELETE_QUALITY_REPORT_REQUEST,
    payload,
  };
};

export const deleteQualityReportSuccess = () => {
  return {
    type: DELETE_QUALITY_REPORT_SUCCESS,
  };
};

export const deleteQualityReportError = error => {
  return {
    type: DELETE_QUALITY_REPORT_ERROR,
    error,
  };
};

export const updateTemplateFormData = payload => {
  return {
    type: UPDATE_TEMPLATE_PROCESSING_FORM_DATA,
    formData: payload.formData,
    action: payload.action,
  };
};

export const updateQRFormData = payload => {
  return {
    type: UPDATE_QR_PROCESSING_FORM_DATA,
    formData: payload.formData,
    action: payload.action,
  };
};
//get List of thickness QM dropdown
export const getThicknessListQM = () => ({
  type: actionTypes.GET_THICKNESS_LIST_QM_REQUEST,
});

export const getThicknessListQMSuccess = thicknessList => ({
  type: actionTypes.GET_THICKNESS_LIST_QM_SUCCESS,
  thicknessList,
});

export const getThicknessListQMError = error => ({
  type: actionTypes.GET_THICKNESS_LIST_QM_ERROR,
  error,
});

//get List of width QM dropdown
export const getWidthListQM = () => ({
  type: actionTypes.GET_WIDTH_LIST_QM_REQUEST,
});

export const getWidthListQMSuccess = widthList => ({
  type: actionTypes.GET_WIDTH_LIST_QM_SUCCESS,
  widthList,
});

export const getWidthListQMError = error => ({
  type: actionTypes.GET_WIDTH_LIST_QM_ERROR,
  error,
});

//get List of length QM dropdown
export const getLengthListQM = () => ({
  type: actionTypes.GET_LENGTH_LIST_QM_REQUEST,
});

export const getLengthListQMSuccess = lengthList => ({
  type: actionTypes.GET_LENGTH_LIST_QM_SUCCESS,
  lengthList,
});

export const getLengthListQMError = error => ({
  type: actionTypes.GET_LENGTH_LIST_QM_ERROR,
  error,
});

//Get packetDetails in quality processStage
export const getQualityPacketDetails = payload => ({
  type: actionTypes.GET_PACKET_DETAILS_QUALITY_PROCESS_REQUEST,
  payload,
});

export const getQualityPacketDetailsSuccess = packetDetails => ({
  type: actionTypes.GET_PACKET_DETAILS_QUALITY_PROCESS_SUCCESS,
  packetDetails,
});

export const getQualityPacketDetailsError = error => ({
  type: actionTypes.GET_PACKET_DETAILS_QUALITY_PROCESS_ERROR,
  error,
});

//Generate QM Report Inward pdf
export const pdfGenerateQMreportInward = payload => ({
  type: actionTypes.GENERATE_INWARD_PDF_QUALITY_MODULE_REPORT_REQUEST,
  payload,
});

export const pdfGenerateQMreportInwardSuccess = payload => ({
  type: actionTypes.GENERATE_INWARD_PDF_QUALITY_MODULE_REPORT_SUCCESS,
  payload,
});

export const pdfGenerateQMreportInwardError = error => ({
  type: actionTypes.GENERATE_INWARD_PDF_QUALITY_MODULE_REPORT_ERROR,
  error,
});
