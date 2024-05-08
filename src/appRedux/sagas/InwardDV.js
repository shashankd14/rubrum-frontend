import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken, getUserId } from './common';
import { FETCH_ITEMGRADE_LIST_REQUEST, ADD_ITEMGRADE_REQUEST, UPDATE_ITEMGRADE_REQUEST, FETCH_ITEMGRADE_LIST_ID_REQUEST, DELETE_ITEMGRADE_REQUEST, FETCH_INWARD_DV_LIST_REQUEST, ADD_INWARD_DV_REQUEST, UPDATE_INWARD_DV_REQUEST, FETCH_INWARD_DV_LIST_ID_REQUEST, DELETE_INWARD_DV_REQUEST, GENERATE_INWARD_ID_REQUEST, GENERATE_CONSIGNMENT_ID_REQUEST } from "../../constants/ActionTypes";
import {
    fetchItemGradeListSuccess,
    fetchItemGradeListError,
    fetchItemGradeListIdError,
    fetchItemGradeListIdSuccess,
    addItemGradeSuccess,
    addItemGradeError,
    updateItemGradeSuccess,
    updateItemGradeError,
    deleteItemGradeSuccess,
    deleteItemGradeError,
    fetchInwardDVListSuccess,
    fetchInwardDVListError,
    fetchInwardDVListIdSuccess,
    fetchInwardListError,
    deleteInwardDVSuccess,
    deleteInwardDVError,
    generateInwardIdSuccess,
    generateInwardIdError,
    generateConsignmentIdSuccess,
    generateConsignmentIdError,
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchInwardList(action) {
    let body = action.payload;
    const reqBody = {
        searchText: body.searchText,
        pageNo: body.pageNo,
        pageSize: body.pageSize,
        ipAddress: "1.1.1.1",
        requestId: "GET_INWARD_LIST",
        userId: getUserId()
    }
    try {
        const fetchInwardList =  yield fetch(`${baseUrl}api/trading/inward/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchInwardList.status === 200) {
            const fetchInwardListResponse = yield fetchInwardList.json();
            yield put(fetchInwardDVListSuccess(fetchInwardListResponse));
        } else if (fetchInwardList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchInwardDVListError('error'));
    } catch (error) {
        yield put(fetchInwardDVListError(error));
    }
}

function* fetchInwardListById(action) {
    let body = action.payload;
    const reqBody = {
        id: body.id,
        searchText: body.searchText,
        pageNo: body.pageNo,
        pageSize: body.pageSize,
        requestId: "GET_BY_ID",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const fetchInwardId =  yield fetch(`${baseUrl}api/trading/inward/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchInwardId.status === 200) {
            const fetchInwardResponse = yield fetchInwardId.json();
            yield put(fetchInwardDVListIdSuccess(fetchInwardResponse));
        } else if (fetchInwardId.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchInwardListError('error'));
    } catch (error) {
        yield put(fetchInwardListError(error));
    }
}

function* addItemGrade(action) {
    let body = action.payload;
    const reqBody = {
        itemgradeName: body.itemgradeName,
        itemgradeDesc: body.itemgradeDesc,
        requestId: "itemGrade add",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const addItemGrade = yield fetch(`${baseUrl}api/trading/itemgrade/save`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if (addItemGrade.status == 200) {
            yield put(addItemGradeSuccess());
        } else if (addItemGrade.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addItemGradeError('error'));
    } catch (error) {
        yield put(addItemGradeError(error));
    }
}

function* updateItemGrade(action) {
    let body = action.payload;
    const reqBody = {
        itemgradeId: body.itemgradeId,
        itemgradeName: body.values.itemgradeName,
        itemgradeDesc: body.values.itemgradeDesc,
        requestId: "ITEMGRADE_UPDATE",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const updateItemGrade = yield fetch(`${baseUrl}api/trading/itemgrade/update`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (updateItemGrade.status == 200) {
            yield put(updateItemGradeSuccess());
        } else if (updateItemGrade.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateItemGradeError('error'));
    } catch (error) {
        console.log(error);
        yield put(updateItemGradeError(error));
    }
}

function* deleteInwardSaga(action) {
    let body = action.payload;
    const reqBody = {
        ids: [body.ids],
        requestId: "INWARD_DELETE",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const deleteInward = yield fetch(`${baseUrl}api/trading/inward/delete`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (deleteInward.status == 200) {
            yield put(deleteInwardDVSuccess());
        } else if (deleteInward.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteInwardDVError('error'));
    } catch (error) {
        console.log(error);
        yield put(deleteInwardDVError(error));
    }
}

function* generateInwardIdSaga(action) {
    debugger
    let body = action.payload;
    const reqBody = {
        fieldName: body.fieldName,
        ipAddress: "1.1.1.1",
        requestId: body.requestId,
        userId: getUserId()
    }
    try {
        const generateInwardId =  yield fetch(`${baseUrl}api/trading/inward/generateSeq`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(generateInwardId.status === 200) {
            const generateInwardIDResponse = yield generateInwardId.json();
            yield put(generateInwardIdSuccess(generateInwardIDResponse));
        } else if (generateInwardId.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(generateInwardIdError('error'));
    } catch (error) {
        yield put(generateInwardIdError(error));
    }
}

function* generateConsignmentIdSaga(action) {
    let body = action.payload;
    const reqBody = {
        fieldName: body.fieldName,
        ipAddress: "1.1.1.1",
        requestId: body.requestId,
        userId: getUserId()
    }
    try {
        const generateConsignmentId =  yield fetch(`${baseUrl}api/trading/inward/generateSeq`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(generateConsignmentId.status === 200) {
            const generateConsignmentIDResponse = yield generateConsignmentId.json();
            yield put(generateConsignmentIdSuccess(generateConsignmentIDResponse));
        } else if (generateConsignmentId.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(generateConsignmentIdError('error'));
    } catch (error) {
        yield put(generateConsignmentIdError(error));
    }
}

export function* watchFetchRequests() {
    yield takeLatest(FETCH_INWARD_DV_LIST_REQUEST, fetchInwardList);
    yield takeLatest(ADD_INWARD_DV_REQUEST, addItemGrade);
    yield takeLatest(UPDATE_INWARD_DV_REQUEST, updateItemGrade);
    yield takeLatest(FETCH_INWARD_DV_LIST_ID_REQUEST, fetchInwardListById);
    yield takeLatest(DELETE_INWARD_DV_REQUEST, deleteInwardSaga);
    yield takeLatest(GENERATE_INWARD_ID_REQUEST, generateInwardIdSaga);
    yield takeLatest(GENERATE_CONSIGNMENT_ID_REQUEST, generateConsignmentIdSaga);
}

export default function* inwardDVSagas() {
    yield all([fork(watchFetchRequests)]);
}

