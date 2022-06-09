import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken } from './common';
import {FETCH_PROCESS_LIST_REQUEST} from "../../constants/ActionTypes";
import {fetchProcessListSuccess, fetchProcessListError} from "../actions";

const baseUrl = process.env.REACT_APP_BASE_URL;
const headers = {
    access_token: getUserToken()
};

function* fetchProcessList() {
    try {
        const fetchProcessList =  yield fetch(`${baseUrl}api/process/list`, {
            method: 'GET',
            headers
        });
        if(fetchProcessList.status === 200) {
            const fetchProcessListResponse = yield fetchProcessList.json();
            yield put(fetchProcessListSuccess(fetchProcessListResponse));
        } else
            yield put(fetchProcessListError('error'));
    } catch (error) {
        yield put(fetchProcessListError(error));
    }
}


export function* watchFetchRequests() {
    yield takeLatest(FETCH_PROCESS_LIST_REQUEST, fetchProcessList);
}

export default function* ratesSagas() {
    yield all([fork(watchFetchRequests)]);
}

