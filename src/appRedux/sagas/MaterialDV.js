import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken } from './common';
import {FETCH_DV_MATERIAL_LIST_REQUEST,
    ADD_DV_MATERIAL_REQUEST,
    FETCH_DV_MATERIAL_LIST_ID_REQUEST,
    UPDATE_DV_MATERIAL_REQUEST
} from "../../constants/ActionTypes";
import {fetchDVMaterialListError, 
    fetchDVMaterialListSuccess, 
    addDVMaterialSuccess, 
    addDVMaterialError,
    fetchDVMaterialListByIdSuccess,
    fetchDVMaterialListByIdError,
    updateDVMaterialSuccess,
    updateDVMaterialError
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchDVMaterialList() {
    try {
        const fetchMaterialList =  yield fetch(`${baseUrl}api/material/list`, {
            method: 'GET',
            headers: getHeaders()
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
    try {
        const fetchMaterialById =  yield fetch(`${baseUrl}api/material/getById/${action.materialId}`, {
            method: 'GET',
            headers: getHeaders()
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

// function* fetchMaterialGrades() {
//     try {
//         const fetchMaterialList =  yield fetch(`${baseUrl}api/material/list`, {
//             method: 'GET',
//             headers: getHeaders()
//         });
//         if(fetchMaterialList.status === 200) {
//             const fetchMaterialListResponse = yield fetchMaterialList.json();
//             yield put(fetchDVMaterialListSuccess(fetchMaterialListResponse));
//         } else if (fetchMaterialList.status === 401) {
//             yield put(userSignOutSuccess());
//         } else
//             yield put(fetchDVMaterialListError('error'));
//     } catch (error) {
//         yield put(fetchDVMaterialListError(error));
//     }
// }

// function* fetchLengths() {
//     try {
//         const fetchMaterialList =  yield fetch(`${baseUrl}api/material/list`, {
//             method: 'GET',
//             headers: getHeaders()
//         });
//         if(fetchMaterialList.status === 200) {
//             const fetchMaterialListResponse = yield fetchMaterialList.json();
//             yield put(fetchDVMaterialListSuccess(fetchMaterialListResponse));
//         } else if (fetchMaterialList.status === 401) {
//             yield put(userSignOutSuccess());
//         } else
//             yield put(fetchDVMaterialListError('error'));
//     } catch (error) {
//         yield put(fetchDVMaterialListError(error));
//     }
// }

// function* fetchWidths() {
//     try {
//         const fetchMaterialList =  yield fetch(`${baseUrl}api/material/list`, {
//             method: 'GET',
//             headers: getHeaders()
//         });
//         if(fetchMaterialList.status === 200) {
//             const fetchMaterialListResponse = yield fetchMaterialList.json();
//             yield put(fetchDVMaterialListSuccess(fetchMaterialListResponse));
//         } else if (fetchMaterialList.status === 401) {
//             yield put(userSignOutSuccess());
//         } else
//             yield put(fetchDVMaterialListError('error'));
//     } catch (error) {
//         yield put(fetchDVMaterialListError(error));
//     }
// }

// function* fetchThickness() {
//     try {
//         const fetchMaterialList =  yield fetch(`${baseUrl}api/material/list`, {
//             method: 'GET',
//             headers: getHeaders()
//         });
//         if(fetchMaterialList.status === 200) {
//             const fetchMaterialListResponse = yield fetchMaterialList.json();
//             yield put(fetchDVMaterialListSuccess(fetchMaterialListResponse));
//         } else if (fetchMaterialList.status === 401) {
//             yield put(userSignOutSuccess());
//         } else
//             yield put(fetchDVMaterialListError('error'));
//     } catch (error) {
//         yield put(fetchDVMaterialListError(error));
//     }
// }

export function* watchFetchRequests() {
    yield takeLatest(FETCH_DV_MATERIAL_LIST_REQUEST, fetchDVMaterialList);
    yield takeLatest(ADD_DV_MATERIAL_REQUEST, addDVMaterial);
    yield takeLatest(FETCH_DV_MATERIAL_LIST_ID_REQUEST, fetchDVMaterialListById);
    yield takeLatest(UPDATE_DV_MATERIAL_REQUEST, updateDVMaterial);
    // yield takeLatest(FETCH_MATERIAL_GRADES, fetchMaterialGrades);
    // yield takeLatest(FETCH_WIDTHS, fetchWidths);
    // yield takeLatest(FETCH_LENGTHS, fetchLengths);
    // yield takeLatest(FETCH_THICKNESS, fetchThickness);

}

export default function* DVmaterialSagas() {
    yield all([fork(watchFetchRequests)]);
}
