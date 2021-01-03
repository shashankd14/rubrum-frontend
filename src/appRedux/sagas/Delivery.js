import {all, fork, put, takeLatest} from "redux-saga/effects";

import {fetchDeliveryListError, fetchDeliveryListSuccess} from "../actions/Delivery";
import {FETCH_DELIVERY_LIST_REQUEST} from "../../constants/ActionTypes";

function* fetchDeliveryList() {
    try {
        const fetchDeliveryList =  yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/delivery/list', {
            method: 'GET',
        });
        if(fetchDeliveryList.status === 200) {
            const fetchDeliveryListResponse = yield fetchDeliveryList.json();
            yield put(fetchDeliveryListSuccess(fetchDeliveryListResponse));
        } else
            yield put(fetchDeliveryListError('error'));
    } catch (error) {
        yield put(fetchDeliveryListError(error));
    }
}



export function* watchFetchRequests() {
    yield takeLatest(FETCH_DELIVERY_LIST_REQUEST, fetchDeliveryList);
}

export default function* deliverySagas() {
    yield all([fork(watchFetchRequests)]);
}