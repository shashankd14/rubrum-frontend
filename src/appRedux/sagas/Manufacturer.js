import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken, getUserId } from './common';
import {FETCH_MANUFACTURER_LIST_REQUEST, ADD_MANUFACTURER_REQUEST, UPDATE_MANUFACTURER_REQUEST, FETCH_MANUFACTURER_LIST_ID_REQUEST, DELETE_MANUFACTURER_REQUEST } from "../../constants/ActionTypes";
import {
    fetchManufacturerListSuccess,
    fetchManufacturerListError,
    fetchManufacturerListIdSuccess,
    fetchManufacturerListIdError,
    addManufacturerSuccess,
    addManufacturerError,
    updateManufacturerSuccess,
    updateManufacturerError,
    deleteManufacturerSuccess,
    deleteManufacturerError,
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchManufacturerList(action) {
    let body = action.payload;
    const reqBody = {
        searchText: body.searchText,
        pageNo: body.pageNo,
        pageSize: body.pageSize,
        ipAddress: "1.1.1.1",
        requestId: "GET_MANUFACTURER_LIST",
        userId: getUserId()
    }
    try {
        const fetchManufacturerList =  yield fetch(`${baseUrl}api/trading/manufacturer/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchManufacturerList.status === 200) {
            const fetchManufacturerListResponse = yield fetchManufacturerList.json();
            yield put(fetchManufacturerListSuccess(fetchManufacturerListResponse));
        } else if (fetchManufacturerList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchManufacturerListError('error'));
    } catch (error) {
        yield put(fetchManufacturerListError(error));
    }
}

function* fetchManufacturerListById(action) {
    let body = action.payload;
    const reqBody = {
        id: body.id,
        searchText: body.searchText,
        pageNo: body.pageNo,
        pageSize: body.pageSize,
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const fetchManufacturerId =  yield fetch(`${baseUrl}api/trading/manufacturer/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchManufacturerId.status === 200) {
            const fetchManufacturerResponse = yield fetchManufacturerId.json();
            yield put(fetchManufacturerListIdSuccess(fetchManufacturerResponse));
        } else if (fetchManufacturerId.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchManufacturerListIdError('error'));
    } catch (error) {
        yield put(fetchManufacturerListIdError(error));
    }
}

function* addManufacturer(action) {
    let body = action.payload;
    const reqBody = {
        manufacturerName: body.manufacturerName,
        manufacturerDesc: body.manufacturerDesc,
        requestId: "ADD MANUFACTURER",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const addManufacturer = yield fetch(`${baseUrl}api/trading/manufacturer/save`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if (addManufacturer.status == 200) {
            yield put(addManufacturerSuccess());
        } else if (addManufacturer.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addManufacturerError('error'));
    } catch (error) {
        yield put(addManufacturerError(error));
    }
}

function* updateManufacturer(action) {
    let body = action.payload;
    const reqBody = {
        manufacturerId: body.manufacturerId,
        manufacturerName: body.values.manufacturerName,
        manufacturerDesc: body.values.manufacturerDesc,
        requestId: "MANUFACTURER_UPDATE",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const updateManufacturer = yield fetch(`${baseUrl}api/trading/manufacturer/update`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (updateManufacturer.status == 200) {
            yield put(updateManufacturerSuccess());
        } else if (updateManufacturer.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateManufacturerError('error'));
    } catch (error) {
        console.log(error);
        yield put(updateManufacturerError(error));
    }
}

function* deleteManufacturerSaga(action) {
    let body = action.payload;
    const reqBody = {
        ids: [body.ids],
        requestId: "MANUFACTURER_DELETE",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const deleteManufacturer = yield fetch(`${baseUrl}api/trading/manufacturer/delete`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (deleteManufacturer.status == 200) {
            yield put(deleteManufacturerSuccess());
        } else if (deleteManufacturer.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteManufacturerError('error'));
    } catch (error) {
        console.log(error);
        yield put(deleteManufacturerError(error));
    }
}

export function* watchFetchRequests() {
    yield takeLatest(FETCH_MANUFACTURER_LIST_REQUEST, fetchManufacturerList);
    yield takeLatest(ADD_MANUFACTURER_REQUEST, addManufacturer);
    yield takeLatest(UPDATE_MANUFACTURER_REQUEST, updateManufacturer);
    yield takeLatest(FETCH_MANUFACTURER_LIST_ID_REQUEST, fetchManufacturerListById);
    yield takeLatest(DELETE_MANUFACTURER_REQUEST, deleteManufacturerSaga);
}

export default function* manufacturerSagas() {
    yield all([fork(watchFetchRequests)]);
}

