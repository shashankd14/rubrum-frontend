import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken } from './common';
import { 
    SEND_REPORT_REQUEST
} from "../../constants/ActionTypes";

import {
    sendReportSuccess,
    sendReportError
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

const getFileName = (response, data) => {
    const disposition = response.headers.get('Content-Disposition') || '';
    const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
    if (match) return decodeURIComponent(match[1]);
    return `${data.reportType || 'report'}_${new Date().toISOString().slice(0, 10)}.xlsx`;
};

const downloadFile = (blob, fileName) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

function* sendReport(action) {
    try {
        const sendReport = yield fetch(`${baseUrl}api/reports/download`, {
                method: 'POST',
                headers: { "Content-Type": "application/json", ...getHeaders() },
                body: JSON.stringify(action.data) 
        });
        if (sendReport.status === 200) {
            const blob = yield sendReport.blob();
            downloadFile(blob, getFileName(sendReport, action.data));
            yield put(sendReportSuccess());
        } else if (sendReport.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(sendReportError());
    } catch (error) {
        yield put(sendReportError());
    }
}

export function* watchFetchRequests() {
    yield takeLatest(SEND_REPORT_REQUEST, sendReport);
}

export default function* reportSagas() {
    yield all([fork(watchFetchRequests)]);
}
