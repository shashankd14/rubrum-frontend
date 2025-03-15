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
  getRefinedProductsError,
  getMaterialSubCategoriesSuccess,
  getLeafCategorySuccess,
  getProductThicknessSuccess,
  getProductWidthSuccess,
  getProductOdSuccess,
  getProductIdSuccess,
  getProductNbSuccess,
  getProductLengthSuccess
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
      if(action.fieldType === 'subCategory') {
        const subCategoryList = [];
        const subCategoryIds = [];
        fetchPartyListResponse.content.map((item) => {
          if(subCategoryIds.indexOf(item.subcategoryId) === -1) {
            subCategoryIds.push(item.subcategoryId);
            subCategoryList.push({
              subcategoryId: item.subcategoryId,
              subcategoryIdName: item.subcategory
            });
          }
        });
        yield put(getMaterialSubCategoriesSuccess(subCategoryList));
      }

      if(action.fieldType === 'leafCategory') {
        const subCategoryList = [];
        const subCategoryIds = [];
        fetchPartyListResponse.content.map((item) => {
          if(subCategoryIds.indexOf(item.leafcategoryId) === -1) {
            subCategoryIds.push(item.leafcategoryId);
            subCategoryList.push({
              leafcategoryId: item.leafcategoryId,
              leafcategoryName: item.leafcategory
            });
          }
        });
        yield put(getLeafCategorySuccess(subCategoryList));
      }

      if(action.fieldType === 'brand') {
        const subCategoryList = [];
        const subCategoryIds = [];
        fetchPartyListResponse.content.map((item) => {
          if(subCategoryIds.indexOf(item.brandId) === -1) {
            subCategoryIds.push(item.brandId);
            subCategoryList.push({
              brandId: item.brandId,
              brandName: item.brand
            });
          }
        });
        yield put(getProductBrandsSuccess(subCategoryList));
      }

      if(action.fieldType === 'productType') {
        const subCategoryList = [];
        const subCategoryIds = [];
        fetchPartyListResponse.content.map((item) => {
          if(subCategoryIds.indexOf(item.producttypeId) === -1) {
            subCategoryIds.push(item.producttypeId);
            subCategoryList.push({
              productId: item.producttypeId,
              productName: item.producttype
            });
          }
        });
        yield put(getProductsListSuccess(subCategoryList));
      }

      if(action.fieldType === 'uom') {
        const subCategoryList = [];
        const subCategoryIds = [];

        const formList = [];
        const formIds = [];

        fetchPartyListResponse.content.map((item) => {
          if(subCategoryIds.indexOf(item.uomId) === -1) {
            subCategoryIds.push(item.uomId);
            subCategoryList.push({
              uomId: item.uomId,
              uomName: item.uom
            });
          }

          if(formIds.indexOf(item.formId) === -1) {
            formIds.push(item.formId);
            formList.push({
              formId: item.formId,
              formName: item.form
            });
          }
          
        });
        yield put(getProductUOMSuccess(subCategoryList));
        yield put(getProductFormSuccess(formList));
      }

      if(action.fieldType === 'grade') {
        const subCategoryList = [];
        const subCategoryIds = [];
        fetchPartyListResponse.content.map((item) => {
          if(subCategoryIds.indexOf(item.gradeId) === -1) {
            subCategoryIds.push(item.gradeId);
            subCategoryList.push({
              gradeId: item.gradeId,
              gradeName: item.grade
            });
          }
        });
        yield put(getProductGradesSuccess(subCategoryList));
      }

      if(action.fieldType === 'subgrade') {
        const subCategoryList = [];
        const subCategoryIds = [];
        fetchPartyListResponse.content.map((item) => {
          if(subCategoryIds.indexOf(item.subgradeId) === -1) {
            subCategoryIds.push(item.subgradeId);
            subCategoryList.push({
              subgradeId: item.subgradeId,
              subgradeName: item.subgrade
            });
          }
        });
        yield put(getProductSubGradesSuccess(subCategoryList));
      }

      if(action.fieldType === 'surface') {
        const subCategoryList = [];
        const subCategoryIds = [];
        fetchPartyListResponse.content.map((item) => {
          if(subCategoryIds.indexOf(item.surfacetypeId) === -1) {
            subCategoryIds.push(item.surfacetypeId);
            subCategoryList.push({
              surfacetypeId: item.surfacetypeId,
              surfacetype: item.surfacetype
            });
          }
        });
        yield put(getProductSurfaceListSuccess(subCategoryList));
      }

      if(action.fieldType === 'coating') {
        const subCategoryList = [];
        const subCategoryIds = [];
        fetchPartyListResponse.content.map((item) => {
          if(subCategoryIds.indexOf(item.coatingtypeId) === -1) {
            subCategoryIds.push(item.coatingtypeId);
            subCategoryList.push({
              coatingtypeId: item.coatingtypeId,
              coatingtype: item.coatingtype
            });
          }
        });
        yield put(getProductCoatingListSuccess(subCategoryList));
      }

      if(action.fieldType === 'thickness') {
        const subCategoryIds = [];
        fetchPartyListResponse.content.map((item) => {
          if(subCategoryIds.indexOf(item.thickness) === -1) {
            subCategoryIds.push(item.thickness);
          }
        });
        yield put(getProductThicknessSuccess(subCategoryIds));
      }

      if(action.fieldType === 'width') {
        const subCategoryIds = [];
        fetchPartyListResponse.content.map((item) => {
          if(subCategoryIds.indexOf(item.width) === -1) {
            subCategoryIds.push(item.width);
          }
        });
        yield put(getProductWidthSuccess(subCategoryIds));
      }

      if(action.fieldType === 'od') {
        const subCategoryIds = [];
        fetchPartyListResponse.content.map((item) => {
          if(subCategoryIds.indexOf(item.odiameter) === -1) {
            subCategoryIds.push(item.odiameter);
          }
        });
        yield put(getProductOdSuccess(subCategoryIds));
      }

      if(action.fieldType === 'id') {
        const subCategoryIds = [];
        fetchPartyListResponse.content.map((item) => {
          if(subCategoryIds.indexOf(item.idiameter) === -1) {
            subCategoryIds.push(item.idiameter);
          }
        });
        yield put(getProductIdSuccess(subCategoryIds));
      }
      
      if(action.fieldType === 'width') {
        const subCategoryIds = [];
        fetchPartyListResponse.content.map((item) => {
          if(subCategoryIds.indexOf(item.width) === -1) {
            subCategoryIds.push(item.width);
          }
        });
        yield put(getProductWidthSuccess(subCategoryIds));
      }

      if(action.fieldType === 'length') {
        const subCategoryIds = [];
        fetchPartyListResponse.content.map((item) => {
          if(subCategoryIds.indexOf(item.length) === -1) {
            subCategoryIds.push(item.length);
          }
        });
        yield put(getProductLengthSuccess(subCategoryIds));
      }

      if(action.fieldType === 'nb') {
        const subCategoryIds = [];
        fetchPartyListResponse.content.map((item) => {
          if(subCategoryIds.indexOf(item.nb) === -1) {
            subCategoryIds.push(item.nb);
          }
        });
        yield put(getProductNbSuccess(subCategoryIds));
      }

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
