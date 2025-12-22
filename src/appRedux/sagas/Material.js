import {all, put, fork, takeLatest, select, call} from "redux-saga/effects";
import { getUserToken } from './common';
import {
    FETCH_MATERIAL_LIST_REQUEST,
    ADD_MATERIAL_REQUEST,
    FETCH_MATERIAL_LIST_ID_REQUEST,
    UPDATE_MATERIAL_REQUEST,
    FETCH_MATERIAL_GRADES,
    FETCH_WIDTHS,
    FETCH_LENGTHS,
    FETCH_THICKNESS,
    FETCH_MATERIAL_CATEGORIES,
    FETCH_MATERIAL_SUB_CATEGORIES,
    FETCH_MATERIAL_LEAF_CATEGORY,
    SEARCH_MATERIAL_BY_ID
} from "../../constants/ActionTypes";
import {
  fetchMaterialListError,
  fetchMaterialListSuccess,
  addMaterialSuccess,
  addMaterialError,
  fetchMaterialListByIdSuccess,
  fetchMaterialListByIdError,
  updateMaterialSuccess,
  updateMaterialError,
  getMaterialCategoriesSuccess,
  getMaterialCategoriesError,
  getMaterialSubCategoriesSuccess,
  getMaterialSubCategoriesError,
  searchByMaterialIdSuccess,
  searchByMaterialIdError,
  setMaterialData,
  saveMaterialDisplayInfo,
  setInwardDetails,
  getRefinedProducts,
  saveMaterialInfo,
  setIsManual,
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";
import { getInwardEntryFields } from "../selectors";

const baseUrl = process.env.REACT_APP_BASE_URL;

const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchMaterialList() {
    const body = {
      pageNo: 1,
      pageSize: 15,
    };
    try {
        const fetchMaterialList =  yield fetch(`${baseUrl}api/material/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders()},
            body: JSON.stringify(body)
        });
        if(fetchMaterialList.status === 200) {
            const fetchMaterialListResponse = yield fetchMaterialList.json();
            yield put(fetchMaterialListSuccess(fetchMaterialListResponse));
        } else if (fetchMaterialList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchMaterialListError('error'));
    } catch (error) {
        yield put(fetchMaterialListError(error));
    }
}

function* addMaterial(action) {
    try {
        const { description, grade, hsnCode, materialCode } = action.material;
        const materialObj = {
            material: description,
            grade,
            hsnCode,
            materialCode
        }
        const addMaterial = yield fetch(`${baseUrl}api/material/save`, {
                method: 'POST',
                headers: { "Content-Type": "application/json", ...getHeaders() },
                body:JSON.stringify(materialObj)
            
        });
        if (addMaterial.status == 200) {
            yield put(addMaterialSuccess());
        } else if (addMaterial.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addMaterialError('error'));
    } catch (error) {
        yield put(addMaterialError(error));
    }
}

function* updateMaterial(action) {
    try {
        const { values: { description, grade, hsnCode, materialCode }, id } = action.material;
        const materialObj = {
            matId: id,
            material: description,
            grade,
            materialCode,
            hsnCode
        }
        const updateMaterial = yield fetch(`${baseUrl}api/material/update`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json", ...getHeaders() },
                body:JSON.stringify(materialObj)
            
        });
        if (updateMaterial.status == 200) {
            yield put(updateMaterialSuccess());
        } else if (updateMaterial.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateMaterialError('error'));
    } catch (error) {
        yield put(updateMaterialError(error));
    }
}

function* fetchMaterialListById(action) {
    try {
        const fetchMaterialById =  yield fetch(`${baseUrl}api/material/getById/${action.materialId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchMaterialById.status === 200) {
            const fetchMaterialByIdResponse = yield fetchMaterialById.json();
            yield put(fetchMaterialListByIdSuccess(fetchMaterialByIdResponse));
        }  else if (fetchMaterialById.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchMaterialListByIdError('error'));
    } catch (error) {
        yield put(fetchMaterialListByIdError(error));
    }
}

function* fetchMaterialGrades() {
    try {
        const fetchMaterialList =  yield fetch(`${baseUrl}api/material/list`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchMaterialList.status === 200) {
            const fetchMaterialListResponse = yield fetchMaterialList.json();
            yield put(fetchMaterialListSuccess(fetchMaterialListResponse));
        } else if (fetchMaterialList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchMaterialListError('error'));
    } catch (error) {
        yield put(fetchMaterialListError(error));
    }
}

function* fetchLengths() {
    try {
        const fetchMaterialList =  yield fetch(`${baseUrl}api/material/list`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchMaterialList.status === 200) {
            const fetchMaterialListResponse = yield fetchMaterialList.json();
            yield put(fetchMaterialListSuccess(fetchMaterialListResponse));
        } else if (fetchMaterialList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchMaterialListError('error'));
    } catch (error) {
        yield put(fetchMaterialListError(error));
    }
}

function* fetchWidths() {
    try {
        const fetchMaterialList =  yield fetch(`${baseUrl}api/material/list`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchMaterialList.status === 200) {
            const fetchMaterialListResponse = yield fetchMaterialList.json();
            yield put(fetchMaterialListSuccess(fetchMaterialListResponse));
        } else if (fetchMaterialList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchMaterialListError('error'));
    } catch (error) {
        yield put(fetchMaterialListError(error));
    }
}

function* fetchThickness() {
    try {
        const fetchMaterialList =  yield fetch(`${baseUrl}api/material/list`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchMaterialList.status === 200) {
            const fetchMaterialListResponse = yield fetchMaterialList.json();
            yield put(fetchMaterialListSuccess(fetchMaterialListResponse));
        } else if (fetchMaterialList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchMaterialListError('error'));
    } catch (error) {
        yield put(fetchMaterialListError(error));
    }
}

function* fetchMaterialCategories() {
    const body = {
        "pageNo": 1,
        "pageSize": 15
    };

    try {
        const fetchPartyList =  yield fetch(`${baseUrl}api/material/category/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders()},
            body: JSON.stringify(body)
        });
        if(fetchPartyList.status === 200) {
            const fetchPartyListResponse = yield fetchPartyList.json();
            yield put(getMaterialCategoriesSuccess(fetchPartyListResponse));

            let inwardFormDetails = yield select(getInwardEntryFields);
            yield put(setInwardDetails({...inwardFormDetails, categoryId: "12"}));
            yield put(saveMaterialInfo("categoryName", "Metals and Alloys"));
            
            inwardFormDetails = yield select(getInwardEntryFields);
            yield put(getRefinedProducts(inwardFormDetails, 'subCategory'));
            yield put(setInwardDetails({...inwardFormDetails, subcategoryId: "34"}));
            yield put(saveMaterialInfo("subCategoryName", "Mild Steel"));

            inwardFormDetails = yield select(getInwardEntryFields);
            yield put(getRefinedProducts(inwardFormDetails, 'leafCategory'));
            yield put(setInwardDetails({...inwardFormDetails, leafcategoryId: "150"}));
            yield put(saveMaterialInfo("leafCategoryName", "Hot Rolled"));

            yield put(getRefinedProducts(inwardFormDetails, 'brand'));
        } else if (fetchPartyList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(getMaterialCategoriesError('error'));
    } catch (error) {
        yield put(getMaterialCategoriesError(error));
    }
}

function* fetchMaterialSubCategories(action) {
    const body = {
        "categoryId": action.categoryId,
    };

    try {
        const fetchPartyList =  yield fetch(`${baseUrl}api/material/subcategory/list/categoryId`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders()},
            body: JSON.stringify(body)
        });
        if(fetchPartyList.status === 200) {
            const fetchPartyListResponse = yield fetchPartyList.json();
            yield put(getMaterialSubCategoriesSuccess(fetchPartyListResponse));
            const inwardFormDetails = yield select(getInwardEntryFields);
            yield call(getRefinedProducts(inwardFormDetails, 'subCategory'));
        } else if (fetchPartyList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(getMaterialSubCategoriesError('error'));
    } catch (error) {
        yield put(getMaterialCategoriesError(error));
    }
}

function* searchByMaterialId(action) {
    const body = {
        "pageNo": 1,
        "pageSize": 15,
        "mmid": action.materialId 
    }

    try {
        const fetchPartyList =  yield fetch(`${baseUrl}api/material/mmid`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders()},
            body: JSON.stringify(body)
        });
        if(fetchPartyList.status === 200) {
            const fetchPartyListResponse = yield fetchPartyList.json();
            if(fetchPartyListResponse?.totalItems > 0) {
                yield put(setMaterialData(fetchPartyListResponse.content[0]));
                yield put(saveMaterialDisplayInfo({
                    categoryName: fetchPartyListResponse.content[0].category, 
                    subCategoryName: fetchPartyListResponse.content[0].subcategory,
                    leafCategoryName: fetchPartyListResponse.content[0].leafcategory,
                    brandName: fetchPartyListResponse.content[0].brand,
                    width: fetchPartyListResponse.content[0].width,
                    thickness: fetchPartyListResponse.content[0].thickness,
                    productType: fetchPartyListResponse.content[0].producttype,
                    uom: fetchPartyListResponse.content[0].uom,
                    form: fetchPartyListResponse.content[0].form,
                    grade: fetchPartyListResponse.content[0].grade,
                    surfaceType: fetchPartyListResponse.content[0].surfacetype,
                    subGradeName: fetchPartyListResponse.content[0].subgrade,
                    coatingType: fetchPartyListResponse.content[0].coatingtype,
                    mmId: fetchPartyListResponse.content[0].mmId,
                    od: fetchPartyListResponse.content[0].odiameter,
                    id: fetchPartyListResponse.content[0].idiameter,
                    nb: fetchPartyListResponse.content[0].nb,
                    hsn: fetchPartyListResponse.content[0].hsn,
                    mmDescription: fetchPartyListResponse.content[0].mmDescription,
                }));
            }
            yield put(setIsManual(false));
            yield put(searchByMaterialIdSuccess(fetchPartyListResponse));
        } else if (fetchPartyList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(searchByMaterialIdError('error'));
    } catch (error) {
        yield put(searchByMaterialIdError(error));
    }
}

export function* watchFetchRequests() {
    yield takeLatest(FETCH_MATERIAL_LIST_REQUEST, fetchMaterialList);
    yield takeLatest(ADD_MATERIAL_REQUEST, addMaterial);
    yield takeLatest(FETCH_MATERIAL_LIST_ID_REQUEST, fetchMaterialListById);
    yield takeLatest(UPDATE_MATERIAL_REQUEST, updateMaterial);
    yield takeLatest(FETCH_MATERIAL_GRADES, fetchMaterialGrades);
    yield takeLatest(FETCH_WIDTHS, fetchWidths);
    yield takeLatest(FETCH_LENGTHS, fetchLengths);
    yield takeLatest(FETCH_THICKNESS, fetchThickness);
    yield takeLatest(FETCH_MATERIAL_CATEGORIES, fetchMaterialCategories);
    yield takeLatest(FETCH_MATERIAL_SUB_CATEGORIES, fetchMaterialSubCategories);
    yield takeLatest(SEARCH_MATERIAL_BY_ID, searchByMaterialId);
}

export default function* materialSagas() {
    yield all([fork(watchFetchRequests)]);
}
