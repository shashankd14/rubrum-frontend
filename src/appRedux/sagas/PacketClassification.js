import {all, put, fork, takeLatest} from "redux-saga/effects";
import {FETCH_CLASSIFICATION_LIST_REQUEST} from "../../constants/ActionTypes";
import {fetchClassificationListSuccess, fetchClassificationListError} from "../actions";

function* fetchClassificationList() {
    try {
        const fetchClassificationList =  yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/packetClassification/list', {
            method: 'GET',
        });
        if(fetchClassificationList.status === 200) {
            const fetchClassificationListResponse = yield fetchClassificationList.json();
            yield put(fetchClassificationListSuccess(fetchClassificationListResponse));
        } else
            yield put(fetchClassificationListError('error'));
    } catch (error) {
        yield put(fetchClassificationListError(error));
    }
}


export function* watchFetchRequests() {
    yield takeLatest(FETCH_CLASSIFICATION_LIST_REQUEST, fetchClassificationList);
}

export default function* partySagas() {
    yield all([fork(watchFetchRequests)]);
}

