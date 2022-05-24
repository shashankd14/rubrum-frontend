import {all, put, fork, takeLatest} from "redux-saga/effects";
import { 
    SEND_REPORT_REQUEST
} from "../../constants/ActionTypes";

import {
    sendReportSuccess,
    sendReportError
} from "../actions";

const baseUrl = process.env.REACT_APP_BASE_URL;

function* sendReport(action) {
    try {
        const sendReport = yield fetch(`${baseUrl}api/reports`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(action.data) 
        });
        if (sendReport.status == 200) {
            yield put(sendReportSuccess());
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
