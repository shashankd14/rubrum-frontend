import {all, fork, put, takeLatest} from "redux-saga/effects";
import { getUserToken } from './common';
import {fetchDeliveryListError, fetchDeliveryListSuccess,fetchDeliveryListByIdSuccess, fetchDeliveryListByIdError, deleteDeliveryByIdError,deleteDeliveryByIdSuccess} from "../actions/Delivery";
import {FETCH_DELIVERY_LIST_REQUEST, FETCH_DELIVERY_LIST_REQUEST_BY_ID, DELETE_DELIVERY_BY_ID } from "../../constants/ActionTypes";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchDeliveryList({ page = 1, pageSize = 15, searchValue = '', partyId = '' }) {
    try {
        const fetchDeliveryList =  yield fetch(`${baseUrl}api/delivery/list/${page}/${pageSize}?searchText=${searchValue}&partyId=${partyId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchDeliveryList.status === 200) {
            const fetchDeliveryListResponse = yield fetchDeliveryList.json();
            console.log(fetchDeliveryListResponse);
            yield put(fetchDeliveryListSuccess(fetchDeliveryListResponse));
        } else
            yield put(fetchDeliveryListError('error'));
    } catch (error) {
        yield put(fetchDeliveryListError(error));
    }
}

function* fetchDeliveryListById(action) {
    try {
        const fetchDeliveryList =  yield fetch(`${baseUrl}api/delivery/getById/${action.deliveryId}`, {
            method: 'GET',
            headers: getHeaders()
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
function* deleteByDeliveryId(action) {
    try {
        
        const deleteDelivery = yield fetch(`${baseUrl}api/delivery/deleteById/${action.id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (deleteDelivery.status === 200) {
            yield put(deleteDeliveryByIdSuccess(deleteDelivery));
        } else
            yield put(deleteDeliveryByIdError('error'));
    } catch (error) {
        yield put(deleteDeliveryByIdError(error));
    }
}


export function* watchFetchRequests() {
    yield takeLatest(FETCH_DELIVERY_LIST_REQUEST, fetchDeliveryList);
    yield takeLatest(FETCH_DELIVERY_LIST_REQUEST_BY_ID, fetchDeliveryListById);
    yield takeLatest(DELETE_DELIVERY_BY_ID, deleteByDeliveryId);
}

export default function* deliverySagas() {
    yield all([fork(watchFetchRequests)]);
}