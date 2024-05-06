import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken, getUserId } from './common';
import {FETCH_WEIGHBRIDGE_LIST_REQUEST, ADD_WEIGHBRIDGE_REQUEST, UPDATE_WEIGHBRIDGE_REQUEST, FETCH_WEIGHBRIDGE_LIST_ID_REQUEST, DELETE_WEIGHBRIDGE_REQUEST } from "../../constants/ActionTypes";
import {
    fetchWeighbridgeListSuccess,
    fetchWeighbridgeListError,
    fetchWeighbridgeListIdSuccess,
    fetchWeighbridgeListIdError,
    addWeighbridgeSuccess,
    addWeighbridgeError,
    updateWeighbridgeSuccess,
    updateWeighbridgeError,
    deleteWeighbridgeSuccess,
    deleteWeighbridgeError,
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchWeighbridgeList(action) {
    let body = action.payload;
    const reqBody = {
        searchText: body.searchText,
        pageNo: body.pageNo,
        pageSize: body.pageSize,
        ipAddress: "1.1.1.1",
        requestId: "GET_WEIGHBRIDGE_LIST",
        userId: getUserId()
    }
    try {
        const fetchWeighbridgeList =  yield fetch(`${baseUrl}api/trading/weighbridge/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchWeighbridgeList.status === 200) {
            const fetchWeighbridgeListResponse = yield fetchWeighbridgeList.json();
            yield put(fetchWeighbridgeListSuccess(fetchWeighbridgeListResponse));
        } else if (fetchWeighbridgeList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchWeighbridgeListError('error'));
    } catch (error) {
        yield put(fetchWeighbridgeListError(error));
    }
}

function* fetchWeighbridgeListById(action) {
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
        const fetchWeighbridgeId =  yield fetch(`${baseUrl}api/trading/weighbridge/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchWeighbridgeId.status === 200) {
            const fetchWeighbridgeResponse = yield fetchWeighbridgeId.json();
            yield put(fetchWeighbridgeListIdSuccess(fetchWeighbridgeResponse));
        } else if (fetchWeighbridgeId.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchWeighbridgeListIdError('error'));
    } catch (error) {
        yield put(fetchWeighbridgeListIdError(error));
    }
}

function* addWeighbridge(action) {
    let body = action.payload;
    const reqBody = {
        weighbridgeName: body.weighbridgeName,
        address1: body.weighbridgeAddress,
        address2: body.weighbridgeAddress2,
        city: body.city,
        state: body.state,
        pincode: body.pincode,
        contactNo: body.contactNo,
        requestId: body.requestId,
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const addWeighbridge = yield fetch(`${baseUrl}api/trading/weighbridge/save`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if (addWeighbridge.status == 200) {
            yield put(addWeighbridgeSuccess());
        } else if (addWeighbridge.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addWeighbridgeError('error'));
    } catch (error) {
        yield put(addWeighbridgeError(error));
    }
}

function* updateWeighbridge(action) {
    let body = action.payload;
    const reqBody = {
        weighbridgeId: body.weighbridgeId,
        weighbridgeName: body.values.weighbridgeName,
        address1: body.values.weighbridgeAddress,
        address2: body.values.weighbridgeAddress2,
        city: body.values.city,
        state: body.values.state,
        pincode: body.values.pincode,
        contactNo: body.values.contactNo,
        requestId: "WEIGHBRIDGE_UPDATE",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const updateWeighbridge = yield fetch(`${baseUrl}api/trading/weighbridge/update`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (updateWeighbridge.status == 200) {
            yield put(updateWeighbridgeSuccess());
        } else if (updateWeighbridge.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateWeighbridgeError('error'));
    } catch (error) {
        console.log(error);
        yield put(updateWeighbridgeError(error));
    }
}

function* deleteWeighbridgeSaga(action) {
    let body = action.payload;
    const reqBody = {
        ids: [body.ids],
        requestId: "WEIGHBRIDGE_DELETE",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const deleteWeighbridge = yield fetch(`${baseUrl}api/trading/weighbridge/delete`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (deleteWeighbridge.status == 200) {
            yield put(deleteWeighbridgeSuccess());
        } else if (deleteWeighbridge.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteWeighbridgeError('error'));
    } catch (error) {
        console.log(error);
        yield put(deleteWeighbridgeError(error));
    }
}

export function* watchFetchRequests() {
    yield takeLatest(FETCH_WEIGHBRIDGE_LIST_REQUEST, fetchWeighbridgeList);
    yield takeLatest(ADD_WEIGHBRIDGE_REQUEST, addWeighbridge);
    yield takeLatest(UPDATE_WEIGHBRIDGE_REQUEST, updateWeighbridge);
    yield takeLatest(FETCH_WEIGHBRIDGE_LIST_ID_REQUEST, fetchWeighbridgeListById);
    yield takeLatest(DELETE_WEIGHBRIDGE_REQUEST, deleteWeighbridgeSaga);
}

export default function* weighbridgeSagas() {
    yield all([fork(watchFetchRequests)]);
}

