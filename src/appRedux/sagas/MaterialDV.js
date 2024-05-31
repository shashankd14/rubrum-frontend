import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken, getUserId } from './common';
import {FETCH_DV_MATERIAL_LIST_REQUEST,
    ADD_DV_MATERIAL_REQUEST,
    FETCH_DV_MATERIAL_LIST_ID_REQUEST,
    UPDATE_DV_MATERIAL_REQUEST,
    DELETE_DV_MATERIAL_REQUEST
} from "../../constants/ActionTypes";
import {fetchDVMaterialListError, 
    fetchDVMaterialListSuccess, 
    addDVMaterialSuccess, 
    addDVMaterialError,
    fetchDVMaterialListByIdSuccess,
    fetchDVMaterialListByIdError,
    updateDVMaterialSuccess,
    updateDVMaterialError,
    deleteDVMaterialSuccess,
    deleteDVMaterialError,
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchDVMaterialList({action}) {
    const reqBody = {
        pageNo: action.pageNo,
        pageSize: action.pageSize,
        ipAddress: action.ipAddress,
        requestId: action.requestId,
        searchText: action.searchText,
        userId: getUserId()
    }
    try {
        const fetchMaterialList =  yield fetch(`${baseUrl}api/trading/material/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body: JSON.stringify(reqBody)
        });
        if(fetchMaterialList.status === 200) {
            const fetchMaterialListResponse = yield fetchMaterialList.json();
            yield put(fetchDVMaterialListSuccess(fetchMaterialListResponse));
        } else if (fetchMaterialList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchDVMaterialListError('error'));
    } catch (error) {
        yield put(fetchDVMaterialListError(error));
    }
}

function* addDVMaterial(action) {
    let payload = action.DVMaterial
    const materialMasterRequest = {
        itemHsnCode: payload.itemHsnCode,
        itemName: payload.itemName,
        itemCode: payload.itemCode,
        itemGradeId: payload.itemGradeId,
        subCategoryId: payload.subCategoryId,
        categoryId: payload.categoryId,
        displayName: payload.displayName,
        brandId: payload.brandName,
        manufacturerId: payload.manufacturerName,
        perMeter: payload.perMeter,
        perFeet: payload.perFeet,
        perPC: payload.perPC,
        ipAddress: "11111",
        requestId: "MATERIAL_ADD",
        userId: getUserId()
    }
    
    const formData = new FormData();
    formData.append("materialMasterRequest", JSON.stringify(materialMasterRequest));
    formData.append("additionalParams", JSON.stringify(payload.additionalParams));
    formData.append("itemImage", (payload.itemImage || ''));
    formData.append("crossSectionalImage", (payload.crossSectionalImage || ''));
    
    try {
        const addMaterial = yield fetch(`${baseUrl}api/trading/material/save`, {
                method: 'POST',
                headers: {...getHeaders() },
                body:formData
            
        });
        if (addMaterial.status == 200) {
            yield put(addDVMaterialSuccess());
        } else if (addMaterial.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addDVMaterialError('error'));
    } catch (error) {
        yield put(addDVMaterialError(error));
    }
}

function* updateDVMaterial(action) {
    let payload = action.DVMaterial
    const materialMasterRequest = {
        itemId:payload.id,
        itemHsnCode: payload.itemHsnCode,
        itemName: payload.itemName,
        itemCode: payload.itemCode,
        itemGradeId: payload.itemGradeId,
        subCategoryId: payload.subCategoryId,
        categoryId: payload.categoryId,
        displayName: payload.displayName,
        brandId: payload.brandName,
        manufacturerId: payload.manufacturerName,
        perMeter: payload.perMeter,
        perFeet: payload.perFeet,
        perPC: payload.perPC,
        ipAddress: "11111",
        requestId: "MATERIAL_ADD",
        userId: getUserId()
    }
    
    const formData = new FormData();
    formData.append("materialMasterRequest", JSON.stringify(materialMasterRequest));
    formData.append("additionalParams", JSON.stringify(payload.additionalParams));
    formData.append("itemImage", (payload.itemImage || ''));
    formData.append("crossSectionalImage", (payload.crossSectionalImage || ''));
    try {
        const updateMaterial = yield fetch(`${baseUrl}api/trading/material/update`, {
                method: 'PUT',
                headers: { ...getHeaders() },
                body: formData
            
        });
        if (updateMaterial.status == 200) {
            yield put(updateDVMaterialSuccess());
        } else if (updateMaterial.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateDVMaterialError('error'));
    } catch (error) {
        yield put(updateDVMaterialError(error));
    }
}

function* fetchDVMaterialListById(action) {
    const reqBody = {
        id: action.action.id,
        pageNo: action.action.pageNo,
        pageSize: action.action.pageSize,
        ipAddress: action.action.ipAddress,
        requestId: action.action.requestId,
        userId: getUserId()
    }
    try {
        const fetchMaterialById =  yield fetch(`${baseUrl}api/trading/material/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body: JSON.stringify(reqBody)
        });
        if(fetchMaterialById.status === 200) {
            const fetchMaterialByIdResponse = yield fetchMaterialById.json();
            yield put(fetchDVMaterialListByIdSuccess(fetchMaterialByIdResponse));
        }  else if (fetchMaterialById.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchDVMaterialListByIdError('error'));
    } catch (error) {
        yield put(fetchDVMaterialListByIdError(error));
    }
}
function* DeleteDVMaterialSaga({action}) {
    const reqBody = {
        ids: [action.id],
        ipAddress: action.ipAddress,
        requestId: action.requestId,
        userId: getUserId()
    }
    try {
        const deleteMaterial =  yield fetch(`${baseUrl}api/trading/material/delete`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body: JSON.stringify(reqBody)
        });
        window.location.reload();
        if(deleteMaterial.status === 200) {
            const deleteMaterialResponse = yield deleteMaterial.json();
            yield put(deleteDVMaterialSuccess(deleteMaterialResponse));
        } else if (deleteMaterial.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteDVMaterialError('error'));
    } catch (error) {
        yield put(deleteDVMaterialError(error));
    }
}

export function* watchFetchRequests() {
    yield takeLatest(FETCH_DV_MATERIAL_LIST_REQUEST, fetchDVMaterialList);
    yield takeLatest(ADD_DV_MATERIAL_REQUEST, addDVMaterial);
    yield takeLatest(FETCH_DV_MATERIAL_LIST_ID_REQUEST, fetchDVMaterialListById);
    yield takeLatest(UPDATE_DV_MATERIAL_REQUEST, updateDVMaterial);
    yield takeLatest(DELETE_DV_MATERIAL_REQUEST, DeleteDVMaterialSaga);
}

export default function* DVmaterialSagas() {
    yield all([fork(watchFetchRequests)]);
}
