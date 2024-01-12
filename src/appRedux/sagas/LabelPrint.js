import { all, put, fork, takeLatest, take, call } from "redux-saga/effects";
import { getUserToken } from './common';
import toNumber from 'lodash';
import moment from "moment";
import {
    GENERATE_INWARD_LABEL_PRINT_PDF_REQUEST
} from "../../constants/ActionTypes";

import {
    labelPrintInwardSuccess
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";
import * as actions from "../actions";

const baseUrl = process.env.REACT_APP_BASE_URL;

const getHeaders = () => ({
    Authorization: getUserToken()
});

function* GenerateInwardLabelPrint(action) {
    debugger
    try {
        const generateLabelPdf = yield fetch(`${baseUrl}api/pdf/label/print`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders()},
            body: JSON.stringify(action.payloadpdf)
        });
        if (generateLabelPdf.status === 200) {
            const generateLabelPdfResponse = yield generateLabelPdf.json();
            let pdfWindow = window.open("")
               pdfWindow.document.write(
                  "<iframe width='100%' height='600%' src='data:application/pdf;base64, " +
                    encodeURI(generateLabelPdfResponse.encodedBase64String) + "'></iframe>"
               )                 
            yield put(labelPrintInwardSuccess(generateLabelPdfResponse));
        } else if (generateLabelPdf.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(actions.labelPrintInwardError('error'));
    } catch (error) {
        yield put(actions.labelPrintInwardError(error));
    }
}

export function* watchFetchRequests() {
    yield takeLatest(GENERATE_INWARD_LABEL_PRINT_PDF_REQUEST, GenerateInwardLabelPrint);
}

export default function* labelPrintSaga() {
    yield all([fork(watchFetchRequests)]);
}
