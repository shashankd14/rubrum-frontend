import {all, fork, put, takeLatest} from "redux-saga/effects";

import {fetchDeliveryListError, fetchDeliveryListSuccess,fetchDeliveryListByIdSuccess, fetchDeliveryListByIdError} from "../actions/Delivery";
import {FETCH_DELIVERY_LIST_REQUEST, FETCH_DELIVERY_LIST_REQUEST_BY_ID } from "../../constants/ActionTypes";

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

function* fetchDeliveryListById(action) {
    try {
        const fetchDeliveryList =  yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/delivery/getById/${action.deliveryId}`, {
            method: 'GET',
        });
        if(fetchDeliveryList.status === 200) {
            const fetchDeliveryListResponse = yield fetchDeliveryList.json();
            yield put(fetchDeliveryListByIdSuccess(fetchDeliveryListResponse));
        } else
            yield put(fetchDeliveryListByIdError('error'));
    } catch (error) {
        yield put(fetchDeliveryListByIdError(error));
    }
}


export function* watchFetchRequests() {
    yield takeLatest(FETCH_DELIVERY_LIST_REQUEST, fetchDeliveryList);
    yield takeLatest(FETCH_DELIVERY_LIST_REQUEST_BY_ID, fetchDeliveryListById);
}

export default function* deliverySagas() {
    yield all([fork(watchFetchRequests)]);
}