import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken } from './common';
import {FETCH_MATERIAL_LIST_REQUEST, 
    ADD_MATERIAL_REQUEST,
    FETCH_MATERIAL_LIST_ID_REQUEST,
    UPDATE_MATERIAL_REQUEST,
    FETCH_MATERIAL_GRADES,
    FETCH_WIDTHS,
    FETCH_LENGTHS,
    FETCH_THICKNESS
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
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchMaterialList() {
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

export function* watchFetchRequests() {
    yield takeLatest(FETCH_MATERIAL_LIST_REQUEST, fetchMaterialList);
    yield takeLatest(ADD_MATERIAL_REQUEST, addMaterial);
    yield takeLatest(FETCH_MATERIAL_LIST_ID_REQUEST, fetchMaterialListById);
    yield takeLatest(UPDATE_MATERIAL_REQUEST, updateMaterial);
    yield takeLatest(FETCH_MATERIAL_GRADES, fetchMaterialGrades);
    yield takeLatest(FETCH_WIDTHS, fetchWidths);
    yield takeLatest(FETCH_LENGTHS, fetchLengths);
    yield takeLatest(FETCH_THICKNESS, fetchThickness);


}

export default function* materialSagas() {
    yield all([fork(watchFetchRequests)]);
}
