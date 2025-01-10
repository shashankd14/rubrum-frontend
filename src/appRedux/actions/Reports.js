import {
  SEND_REPORT_REQUEST,
  SEND_REPORT_SUCCESS,
  SEND_REPORT_ERROR,
  RESET_REPORT_SUCCESS,
} from '../../constants/ActionTypes';

export const sendReportRequest = data => ({
  type: SEND_REPORT_REQUEST,
  data,
});

export const sendReportSuccess = () => ({
  type: SEND_REPORT_SUCCESS,
});

export const sendReportError = error => ({
  type: SEND_REPORT_ERROR,
  error,
});

export const resetSendReportSuccess = () => ({
  type: RESET_REPORT_SUCCESS,
});
