import {all, put, fork, takeLatest} from "redux-saga/effects";
import {FETCH_RATES_LIST_REQUEST} from "../../constants/ActionTypes";
import {fetchRatesListSuccess, fetchRatesListError} from "../actions";

function* fetchRatesList() {
    try {
        const fetchRatesList =  yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/rates/list', {
            method: 'GET',
        });
        if(fetchRatesList.status === 200) {
            const fetchRatesListResponse = yield fetchRatesList.json();
            yield put(fetchRatesListSuccess(fetchRatesListResponse));
        } else
            yield put(fetchRatesListError('error'));
    } catch (error) {
        yield put(fetchRatesListError(error));
    }
}


export function* watchFetchRequests() {
    yield takeLatest(FETCH_RATES_LIST_REQUEST, fetchRatesList);
}

export default function* ratesSagas() {
    yield all([fork(watchFetchRequests)]);
}

