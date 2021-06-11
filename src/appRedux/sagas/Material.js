import {all, put, fork, takeLatest} from "redux-saga/effects";
import {FETCH_MATERIAL_LIST_REQUEST, ADD_MATERIAL_REQUEST} from "../../constants/ActionTypes";
import {fetchMaterialListError, fetchMaterialListSuccess, addMaterialSuccess, addMaterialError} from "../actions";

function* fetchMaterialList() {
    try {
        const fetchMaterialList =  yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/material/list', {
            method: 'GET',
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
        const { description, grade } = action.material;
        const materialObj = {
            material: description,
            grade
        }
        const addMaterial = yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/material/save', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
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

export function* watchFetchRequests() {
    yield takeLatest(FETCH_MATERIAL_LIST_REQUEST, fetchMaterialList);
    yield takeLatest(ADD_MATERIAL_REQUEST, addMaterial);
}

export default function* materialSagas() {
    yield all([fork(watchFetchRequests)]);
}
