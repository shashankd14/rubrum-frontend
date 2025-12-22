import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken } from './common';
import { FETCH_PURCHASE_INVOICES_LIST } from "../../constants/ActionTypes";
import {
  fetchPurchaseInvoicesError,
  fetchPurchaseInvoicesSuccess,
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchPurchaseInvoices({ page = 1,
  pageSize = 15,
  searchValue = "",
  partyId = "",
}) {
  const body = {
    pageNo: page,
    pageSize: pageSize,
    searchText: searchValue,
    partyId: partyId,
  };

  try {
    const fetchPurchaseInvoicesList = yield fetch(`${baseUrl}api/xternal/allpoinvlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getHeaders() },
      body: JSON.stringify(body),
    });
    if (fetchPurchaseInvoicesList.status === 200) {
      const fetchPurchaseInvoicesListResponse = yield fetchPurchaseInvoicesList.json();
      yield put(fetchPurchaseInvoicesSuccess(fetchPurchaseInvoicesListResponse));
    } else if (fetchPurchaseInvoicesList.status === 401) {
      yield put(userSignOutSuccess());
    } else yield put(fetchPurchaseInvoicesError("error"));
  } catch (error) {
    yield put(fetchPurchaseInvoicesError(error));
  }
}

export function* watchFetchRequests() {
    yield takeLatest(FETCH_PURCHASE_INVOICES_LIST, fetchPurchaseInvoices);
}

export default function* PurchaseInvoicesSagas() {
  yield all([fork(watchFetchRequests)]);
}
