import { all, put, fork, takeLatest } from "redux-saga/effects";
import { getUserToken } from "./common";
import {
  FETCH_PRODUCT_BRANDS,
  FETCH_PRODUCTS,
  FETCH_PRODUCT_FORMS,
  FETCH_PRODUCT_UOM,
} from "../../constants/ActionTypes";
import {
  getProductBrandsSuccess,
  getProductBrandsError,
  getProductsListSuccess,
  getProductsListError,
  getProductFormSuccess,
  getProductFormError,
  getProductUOMSuccess,
  getProductUOMError,
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
  Authorization: getUserToken(),
});

function* fetchProductBrands(action) {
  const body = {
    leafcategoryId: action.leafcategoryId,
  };

  try {
    const fetchPartyList = yield fetch(
      `${baseUrl}api/material/brand/list/leafcategoryId`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getHeaders() },
        body: JSON.stringify(body),
      }
    );
    if (fetchPartyList.status === 200) {
      const fetchPartyListResponse = yield fetchPartyList.json();
      yield put(getProductBrandsSuccess(fetchPartyListResponse));
    } else if (fetchPartyList.status === 401) {
      yield put(userSignOutSuccess());
    } else yield put(getProductBrandsError("error"));
  } catch (error) {
    yield put(getProductBrandsError(error));
  }
}

function* fetchProducts(action) {
  const body = {
    pageNo: 1,
    pageSize: 15,
    brandId: action.brandId,
  };
  try {
    const fetchPartyList = yield fetch(`${baseUrl}api/material/product/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getHeaders() },
      body: JSON.stringify(body),
    });
    if (fetchPartyList.status === 200) {
      const fetchPartyListResponse = yield fetchPartyList.json();
      yield put(getProductsListSuccess(fetchPartyListResponse));
    } else if (fetchPartyList.status === 401) {
      yield put(userSignOutSuccess());
    } else yield put(getProductsListError("error"));
  } catch (error) {
    yield put(getProductsListError(error));
  }
}
function* fetchProductForms(action) {
  const body = {
    pageNo: 1,
    pageSize: 15,
    productId: action.productId,
  };
  try {
    const fetchPartyList = yield fetch(`${baseUrl}api/material/form/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getHeaders() },
      body: JSON.stringify(body),
    });
    if (fetchPartyList.status === 200) {
      const fetchPartyListResponse = yield fetchPartyList.json();
      yield put(getProductFormSuccess(fetchPartyListResponse));
    } else if (fetchPartyList.status === 401) {
      yield put(userSignOutSuccess());
    } else yield put(getProductFormError("error"));
  } catch (error) {
    yield put(getProductFormError(error));
  }
}
function* fetchProductUOM(action) {
  const body = {
    pageNo: 1,
    pageSize: 15,
    productId: action.productId,
  };
  try {
    const fetchPartyList = yield fetch(`${baseUrl}api/material/uom/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getHeaders() },
      body: JSON.stringify(body),
    });
    if (fetchPartyList.status === 200) {
      const fetchPartyListResponse = yield fetchPartyList.json();
      yield put(getProductUOMSuccess(fetchPartyListResponse));
    } else if (fetchPartyList.status === 401) {
      yield put(userSignOutSuccess());
    } else yield put(getProductUOMError("error"));
  } catch (error) {
    yield put(getProductUOMError(error));
  }
}

export function* watchFetchRequests() {
  yield takeLatest(FETCH_PRODUCT_BRANDS, fetchProductBrands);
  yield takeLatest(FETCH_PRODUCTS, fetchProducts);
  yield takeLatest(FETCH_PRODUCT_FORMS, fetchProductForms);
  yield takeLatest(FETCH_PRODUCT_UOM, fetchProductUOM);
}

export default function* productInfoSagas() {
  yield all([fork(watchFetchRequests)]);
}
