import {all, put, fork, takeLatest} from "redux-saga/effects";
import { 
    SEND_REPORT_REQUEST
} from "../../constants/ActionTypes";

import {
    sendReportSuccess,
    sendReportError
} from "../actions";

function* sendReport(action) {
    try {
        const sendReportApi = yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/reports', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(action.data) 
        });
        if (sendReportApi.status == 200) {
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
