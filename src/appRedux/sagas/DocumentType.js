import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken, getUserId } from './common';
import {FETCH_MANUFACTURER_LIST_REQUEST, ADD_MANUFACTURER_REQUEST, UPDATE_MANUFACTURER_REQUEST, FETCH_MANUFACTURER_LIST_ID_REQUEST, DELETE_MANUFACTURER_REQUEST, FETCH_DOCUMENT_TYPE_LIST_REQUEST, ADD_DOCUMENT_TYPE_REQUEST, UPDATE_DOCUMENT_TYPE_REQUEST, FETCH_DOCUMENT_TYPE_LIST_ID_REQUEST, DELETE_DOCUMENT_TYPE_REQUEST } from "../../constants/ActionTypes";
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
    fetchDocumentTypeListSuccess,
    fetchDocumentTypeListError,
    fetchDocumentTypeListIdSuccess,
    fetchDocumentTypeListIdError,
    addDocumentTypeSuccess,
    addDocumentTypeError,
    updateDocumentTypeSuccess,
    updateDocumentTypeError,
    deleteDocumentTypeSuccess,
    deleteDocumentTypeError,
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchDocumentTypeList(action) {
    let body = action.payload;
    const reqBody = {
        ipAddress: "1.1.1.1",
        requestId: "GET_DOCUMENT_TYPE_LIST",
        userId: getUserId()
    }
    try {
        const fetchDocumentTypeList =  yield fetch(`${baseUrl}api/trading/document/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchDocumentTypeList.status === 200) {
            const fetchDocumentTypeListResponse = yield fetchDocumentTypeList.json();
            yield put(fetchDocumentTypeListSuccess(fetchDocumentTypeListResponse));
        } else if (fetchDocumentTypeList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchDocumentTypeListError('error'));
    } catch (error) {
        yield put(fetchDocumentTypeListError(error));
    }
}

function* fetchDocumentTypeListById(action) {
    let body = action.payload;
    const reqBody = {
        id: body.id,
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const fetchDocumentTypeId =  yield fetch(`${baseUrl}api/trading/document/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchDocumentTypeId.status === 200) {
            const fetchDocumentTypeResponse = yield fetchDocumentTypeId.json();
            yield put(fetchDocumentTypeListIdSuccess(fetchDocumentTypeResponse));
        } else if (fetchDocumentTypeId.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchDocumentTypeListIdError('error'));
    } catch (error) {
        yield put(fetchDocumentTypeListIdError(error));
    }
}

function* addDocumentType(action) {
    debugger
    let body = action.payload;
    const reqBody = {
        docName: body.values.docName,
        requestId: "ADD DOCUMENT",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const addDocumentType = yield fetch(`${baseUrl}api/trading/document/save`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if (addDocumentType.status == 200) {
            yield put(addDocumentTypeSuccess());
        } else if (addDocumentType.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addDocumentTypeError('error'));
    } catch (error) {
        yield put(addDocumentTypeError(error));
    }
}

function* updateDocumentType(action) {
    let body = action.payload;
    const reqBody = {
        docId: body.docId,
        docName: body.values.docName,
        requestId: "DOCUMENT_UPDATE",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const updateDocumentType = yield fetch(`${baseUrl}api/trading/document/update`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (updateDocumentType.status == 200) {
            yield put(updateDocumentTypeSuccess());
        } else if (updateDocumentType.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateDocumentTypeError('error'));
    } catch (error) {
        console.log(error);
        yield put(updateDocumentTypeError(error));
    }
}

function* deleteDocumentTypeSaga(action) {
    let body = action.payload;
    const reqBody = {
        ids: [body.ids],
        requestId: "DOCUMENT_DELETE",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const deleteDocumentType = yield fetch(`${baseUrl}api/trading/document/delete`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (deleteDocumentType.status == 200) {
            yield put(deleteDocumentTypeSuccess());
        } else if (deleteDocumentType.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteDocumentTypeError('error'));
    } catch (error) {
        console.log(error);
        yield put(deleteDocumentTypeError(error));
    }
}

export function* watchFetchRequests() {
    yield takeLatest(FETCH_DOCUMENT_TYPE_LIST_REQUEST, fetchDocumentTypeList);
    yield takeLatest(ADD_DOCUMENT_TYPE_REQUEST, addDocumentType);
    yield takeLatest(UPDATE_DOCUMENT_TYPE_REQUEST, updateDocumentType);
    yield takeLatest(FETCH_DOCUMENT_TYPE_LIST_ID_REQUEST, fetchDocumentTypeListById);
    yield takeLatest(DELETE_DOCUMENT_TYPE_REQUEST, deleteDocumentTypeSaga);
}

export default function* documentTypeSagas() {
    yield all([fork(watchFetchRequests)]);
}

