import {all, put, fork, takeLatest} from "redux-saga/effects";
import {FETCH_PARTY_LIST_REQUEST} from "../../constants/ActionTypes";
import {fetchPartyListSuccess, fetchPartyListError} from "../actions";

function* fetchPartyList() {
    try {
        const fetchPartyList =  yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/party/list', {
            method: 'GET',
        });
        if(fetchPartyList.status === 200) {
            const fetchPartyListResponse = yield fetchPartyList.json();
            yield put(fetchPartyListSuccess(fetchPartyListResponse));
        } else
            yield put(fetchPartyListError('error'));
    } catch (error) {
        yield put(fetchPartyListError(error));
    }
}


export function* watchFetchRequests() {
    yield takeLatest(FETCH_PARTY_LIST_REQUEST, fetchPartyList);
}

export default function* partySagas() {
    yield all([fork(watchFetchRequests)]);
}

