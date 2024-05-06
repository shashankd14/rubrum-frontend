import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken, getUserId } from './common';
import { FETCH_ITEMGRADE_LIST_REQUEST, ADD_ITEMGRADE_REQUEST, UPDATE_ITEMGRADE_REQUEST, FETCH_ITEMGRADE_LIST_ID_REQUEST, DELETE_ITEMGRADE_REQUEST } from "../../constants/ActionTypes";
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
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchItemGradeList(action) {
    let body = action.payload;
    const reqBody = {
        searchText: body.searchText,
        pageNo: body.pageNo,
        pageSize: body.pageSize,
        ipAddress: "1.1.1.1",
        requestId: "GET_ITEMGRADE_LIST",
        userId: getUserId()
    }
    try {
        const fetchItemGradeList =  yield fetch(`${baseUrl}api/trading/itemgrade/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchItemGradeList.status === 200) {
            const fetchItemGradeListResponse = yield fetchItemGradeList.json();
            yield put(fetchItemGradeListSuccess(fetchItemGradeListResponse));
        } else if (fetchItemGradeList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchItemGradeListError('error'));
    } catch (error) {
        yield put(fetchItemGradeListError(error));
    }
}

function* fetchItemGradeListById(action) {
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
        const fetchItemGradeId =  yield fetch(`${baseUrl}api/trading/itemgrade/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchItemGradeId.status === 200) {
            const fetchItemGradeResponse = yield fetchItemGradeId.json();
            yield put(fetchItemGradeListIdSuccess(fetchItemGradeResponse));
        } else if (fetchItemGradeId.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchItemGradeListIdError('error'));
    } catch (error) {
        yield put(fetchItemGradeListIdError(error));
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

function* deleteItemGradeSaga(action) {
    let body = action.payload;
    const reqBody = {
        ids: [body.ids],
        requestId: "ITEMGRADE_DELETE",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const deleteItemGrade = yield fetch(`${baseUrl}api/trading/itemgrade/delete`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (deleteItemGrade.status == 200) {
            yield put(deleteItemGradeSuccess());
        } else if (deleteItemGrade.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteItemGradeError('error'));
    } catch (error) {
        console.log(error);
        yield put(deleteItemGradeError(error));
    }
}

export function* watchFetchRequests() {
    yield takeLatest(FETCH_ITEMGRADE_LIST_REQUEST, fetchItemGradeList);
    yield takeLatest(ADD_ITEMGRADE_REQUEST, addItemGrade);
    yield takeLatest(UPDATE_ITEMGRADE_REQUEST, updateItemGrade);
    yield takeLatest(FETCH_ITEMGRADE_LIST_ID_REQUEST, fetchItemGradeListById);
    yield takeLatest(DELETE_ITEMGRADE_REQUEST, deleteItemGradeSaga);
}

export default function* itemGradeSagas() {
    yield all([fork(watchFetchRequests)]);
}

