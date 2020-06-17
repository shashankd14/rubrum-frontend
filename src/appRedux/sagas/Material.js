import {all, put, fork, takeLatest} from "redux-saga/effects";
import {FETCH_MATERIAL_LIST_REQUEST} from "../../constants/ActionTypes";
import {fetchMaterialListError, fetchMaterialListSuccess} from "../actions";

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

export function* watchFetchRequests() {
    yield takeLatest(FETCH_MATERIAL_LIST_REQUEST, fetchMaterialList);
}

export default function* materialSagas() {
    yield all([fork(watchFetchRequests)]);
}
