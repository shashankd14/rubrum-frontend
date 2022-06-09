import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken } from './common';
import {FETCH_MATERIAL_LIST_REQUEST, 
    ADD_MATERIAL_REQUEST,
    FETCH_MATERIAL_LIST_ID_REQUEST,
    UPDATE_MATERIAL_REQUEST
} from "../../constants/ActionTypes";
import {fetchMaterialListError, 
    fetchMaterialListSuccess, 
    addMaterialSuccess, 
    addMaterialError,
    fetchMaterialListByIdSuccess,
    fetchMaterialListByIdError,
    updateMaterialSuccess,
    updateMaterialError
} from "../actions";

const baseUrl = process.env.REACT_APP_BASE_URL;
const headers = {
    'Authorization': getUserToken()
};

function* fetchMaterialList() {
    try {
        const fetchMaterialList =  yield fetch(`${baseUrl}api/material/list`, {
            method: 'GET',
            headers
        });
        if(fetchMaterialList.status === 200) {
            const fetchMaterialListResponse = yield fetchMaterialList.json();
            yield put(fetchMaterialListSuccess(fetchMaterialListResponse));
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
                headers: { "Content-Type": "application/json", ...headers },
                body:JSON.stringify(materialObj)
            
        });
        if (addMaterial.status == 200) {
            yield put(addMaterialSuccess());
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
            materialId: id,
            material: description,
            grade,
            materialCode,
            hsnCode
        }
        const updateMaterial = yield fetch(`${baseUrl}api/material/update`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json", ...headers },
                body:JSON.stringify(materialObj)
            
        });
        if (updateMaterial.status == 200) {
            yield put(updateMaterialSuccess());
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
            headers
        });
        if(fetchMaterialById.status === 200) {
            const fetchMaterialByIdResponse = yield fetchMaterialById.json();
            yield put(fetchMaterialListByIdSuccess(fetchMaterialByIdResponse));
        } else
            yield put(fetchMaterialListByIdError('error'));
    } catch (error) {
        yield put(fetchMaterialListByIdError(error));
    }
}

export function* watchFetchRequests() {
    yield takeLatest(FETCH_MATERIAL_LIST_REQUEST, fetchMaterialList);
    yield takeLatest(ADD_MATERIAL_REQUEST, addMaterial);
    yield takeLatest(FETCH_MATERIAL_LIST_ID_REQUEST, fetchMaterialListById);
    yield takeLatest(UPDATE_MATERIAL_REQUEST, updateMaterial);


}

export default function* materialSagas() {
    yield all([fork(watchFetchRequests)]);
}
