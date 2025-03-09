import { all, put, fork, takeLatest } from "redux-saga/effects";
import { getUserToken } from "./common";
import {
  FETCH_PRODUCT_BRANDS,
  FETCH_PRODUCTS,
  FETCH_PRODUCT_FORMS,
  FETCH_PRODUCT_UOM,
  FETCH_PRODUCT_GRADES,
  FETCH_PRODUCT_SUB_GRADES,
  FETCH_PRODUCT_SURFACE_LIST,
  FETCH_PRODUCT_COATING_LIST,
  FETCH_PRODUCTS_REFINED
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
  getProductGradesSuccess,
  getProductGradesError,
  getProductSubGradesError,
  getProductSubGradesSuccess,
  getProductSurfaceListSuccess,
  getProductSurfaceListError,
  getProductCoatingListSuccess,
  getProductCoatingListError,
  getRefinedProductsSuccess,
  getRefinedProductsError
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

function* fetchProductGrades(action) {
  const body = {
    pageNo: 1,
    pageSize: 15,
    productId: action.productId,
  };
  try {
    const fetchPartyList = yield fetch(`${baseUrl}api/material/grade/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getHeaders() },
      body: JSON.stringify(body),
    });
    if (fetchPartyList.status === 200) {
      const fetchPartyListResponse = yield fetchPartyList.json();
      yield put(getProductGradesSuccess(fetchPartyListResponse));
    } else if (fetchPartyList.status === 401) {
      yield put(userSignOutSuccess());
    } else yield put(getProductGradesError("error"));
  } catch (error) {
    yield put(getProductGradesError(error));
  }
}

function* fetchProductSubGrades(action) {
  const body = {
    pageNo: 1,
    pageSize: 15,
    gradeId: action.gradeId,
  };
  try {
    const fetchPartyList = yield fetch(`${baseUrl}api/material/subgrade/list/gradeId`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getHeaders() },
      body: JSON.stringify(body),
    });
    if (fetchPartyList.status === 200) {
      const fetchPartyListResponse = yield fetchPartyList.json();
      yield put(getProductSubGradesSuccess(fetchPartyListResponse));
    } else if (fetchPartyList.status === 401) {
      yield put(userSignOutSuccess());
    } else yield put(getProductSubGradesError("error"));
  } catch (error) {
    yield put(getProductSubGradesError(error));
  }
}

function* fetchProductSurfaceList(action) {
  const body = {
    pageNo: 1,
    pageSize: 15,
    productId: action.productId,
  };
  try {
    const fetchPartyList = yield fetch(`${baseUrl}api/material/surface/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getHeaders() },
      body: JSON.stringify(body),
    });
    if (fetchPartyList.status === 200) {
      const fetchPartyListResponse = yield fetchPartyList.json();
      yield put(getProductSurfaceListSuccess(fetchPartyListResponse));
    } else if (fetchPartyList.status === 401) {
      yield put(userSignOutSuccess());
    } else yield put(getProductSurfaceListError("error"));
  } catch (error) {
    yield put(getProductSurfaceListError(error));
  }
}

function* fetchProductCoatingList(action) {
  const body = {
    pageNo: 1,
    pageSize: 15,
    productId: action.productId,
  };
  try {
    const fetchPartyList = yield fetch(`${baseUrl}api/material/coating/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getHeaders() },
      body: JSON.stringify(body),
    });
    if (fetchPartyList.status === 200) {
      const fetchPartyListResponse = yield fetchPartyList.json();
      yield put(getProductCoatingListSuccess(fetchPartyListResponse));
    } else if (fetchPartyList.status === 401) {
      yield put(userSignOutSuccess());
    } else yield put(getProductCoatingListError("error"));
  } catch (error) {
    yield put(getProductCoatingListError(error));
  }
}

function* getRefinedProducts(action) {
  console.log(action);
  const body = {
    pageNo: 1,
    pageSize: 15,
    "categoryId": action.allDetails.categoryId,
    "subcategoryId": action.allDetails.subcategoryId,
    "leafcategoryId": action.allDetails.leafcategoryId,
    "brandId": action.allDetails.brandId,
    "producttypeId": action.allDetails.productTypeId,
    "gradeId": action.allDetails.gradeId,
    "subgradeId": action.allDetails.subgradeId,
    "formId": action.allDetails.productForm,
    "uomId": action.allDetails.productUom,
    "surfacetypeId": action.allDetails.surfaceType,
    "coatingtypeId": action.allDetails.coatingTypeId,
    "length": action.allDetails.length,
    "width": action.allDetails.width,
    "thickness": action.allDetails.thickness,
    "nb": action.allDetails.nb,
    "oDiameter": action.allDetails.od,
    "iDiameter": action.allDetails.id,
  };
  try {
    const fetchPartyList = yield fetch(`${baseUrl}api/material/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getHeaders() },
      body: JSON.stringify(body),
    });
    if (fetchPartyList.status === 200) {
      const fetchPartyListResponse = yield fetchPartyList.json();
      yield put(getRefinedProductsSuccess(fetchPartyListResponse));
    } else if (fetchPartyList.status === 401) {
      yield put(userSignOutSuccess());
    } else yield put(getRefinedProductsError("error"));
  } catch (error) {
    yield put(getRefinedProductsError(error));
  }
}


export function* watchFetchRequests() {
  yield takeLatest(FETCH_PRODUCT_BRANDS, fetchProductBrands);
  yield takeLatest(FETCH_PRODUCTS, fetchProducts);
  yield takeLatest(FETCH_PRODUCT_FORMS, fetchProductForms);
  yield takeLatest(FETCH_PRODUCT_UOM, fetchProductUOM);
  yield takeLatest(FETCH_PRODUCT_GRADES, fetchProductGrades);
  yield takeLatest(FETCH_PRODUCT_SUB_GRADES, fetchProductSubGrades);
  yield takeLatest(FETCH_PRODUCT_SURFACE_LIST, fetchProductSurfaceList);
  yield takeLatest(FETCH_PRODUCT_COATING_LIST, fetchProductCoatingList);
  yield takeLatest(FETCH_PRODUCTS_REFINED, getRefinedProducts);
}

export default function* productInfoSagas() {
  yield all([fork(watchFetchRequests)]);
}
