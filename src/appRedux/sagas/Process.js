import {all, put, fork, takeLatest} from "redux-saga/effects";
import {FETCH_PROCESS_LIST_REQUEST} from "../../constants/ActionTypes";
import {fetchProcessListSuccess, fetchProcessListError} from "../actions";

function* fetchProcessList() {
    try {
        const fetchProcessList =  yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/process/list', {
            method: 'GET',
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

