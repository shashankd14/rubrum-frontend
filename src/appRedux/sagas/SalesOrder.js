import {all, put, fork, takeLatest} from "redux-saga/effects";
import {
  REQUEST_SALES_ORDER_LIST,
  REQUEST_ALL_PACKETS_LIST, REQUEST_SAVE_SO_FOR_PACKET,
} from '../../constants/ActionTypes';
import { getUserToken } from './common';
import {
  userSignOutSuccess,
  fetchSalesOrderError,
  fetchSalesOrderSuccess,
  fetchPacketListSuccess,
  fetchPacketListError, saveSalesOrderForPacketSuccess, saveSalesOrderForPacketError,
} from '../actions';

const baseUrl = process.env.REACT_APP_BASE_URL;

const getHeaders = () => ({
  Authorization: getUserToken()
});

function* fetchAllPackets({ page = 1, pageSize = 15, searchValue = '' }) {
  const body = {
    "pageNo": page,
    "pageSize": pageSize,
    "searchText": searchValue,
    "partyId": '',
  }

   try {
    const fetchSOList =  yield fetch(`${baseUrl}api/so/allpackets`, {
      method: 'POST',
      headers: { "Content-Type": "application/json", ...getHeaders() },
      body: JSON.stringify(body)
    });
    if(fetchSOList.status === 200) {
      const fetchSOListResponse = yield fetchSOList.json();
      yield put(fetchPacketListSuccess(fetchSOListResponse?.content));
    } else if (fetchSOList.status === 401) {
      yield put(userSignOutSuccess());
    } else
      yield put(fetchPacketListError('error'));
  } catch (error) {
    yield put(fetchPacketListError(error));
  }
}

function* fetchSalesOrders({ page = 1, pageSize = 15, searchValue = '' }) {
  const body = {
    "pageNo": page,
    "pageSize": pageSize,
    "searchText": searchValue,
    "partyId": '',
  }

   try {
    const fetchSOList =  yield fetch(`${baseUrl}api/so/list`, {
      method: 'POST',
      headers: { "Content-Type": "application/json", ...getHeaders() },
      body: JSON.stringify(body)
    });
    if(fetchSOList.status === 200) {
      const fetchSOListResponse = yield fetchSOList.json();
      yield put(fetchSalesOrderSuccess(fetchSOListResponse?.content));
    } else if (fetchSOList.status === 401) {
      yield put(userSignOutSuccess());
    } else
      yield put(fetchSalesOrderError('error'));
  } catch (error) {
    yield put(fetchSalesOrderError(error));
  }
}
function* saveSoForPacket(action) {
   try {
    const createSoRequest =  yield fetch(`${baseUrl}api/so/create`, {
      method: 'POST',
      headers: { "Content-Type": "application/json", ...getHeaders() },
      body: JSON.stringify([action.postData])
    });
    if(createSoRequest.status === 200) {
      // const fetchSOListResponse = yield fetchSOList.json();
      yield put(saveSalesOrderForPacketSuccess());
    } else if (createSoRequest.status === 401) {
      yield put(userSignOutSuccess());
    } else
      yield put(saveSalesOrderForPacketError('error'));
  } catch (error) {
    yield put(saveSalesOrderForPacketError(error));
  }
}

export function* watchAllFetchRequests() {
  yield takeLatest(REQUEST_ALL_PACKETS_LIST, fetchAllPackets);
  yield takeLatest(REQUEST_SALES_ORDER_LIST, fetchSalesOrders);
  yield takeLatest(REQUEST_SAVE_SO_FOR_PACKET, saveSoForPacket);
}

export default function* SalesOrderSagas() {
  yield all([fork(watchAllFetchRequests)]);
}
