import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken, getUserId } from './common';
import {FETCH_BRAND_LIST_REQUEST, ADD_BRAND_REQUEST, UPDATE_BRAND_REQUEST, FETCH_BRAND_LIST_ID_REQUEST, DELETE_BRAND_REQUEST } from "../../constants/ActionTypes";
import {
    fetchBrandListSuccess,
    fetchBrandListError,
    fetchBrandListIdSuccess,
    fetchBrandListIdError,
    addBrandSuccess,
    addBrandError,
    updateBrandSuccess,
    updateBrandError,
    deleteBrandSuccess,
    deleteBrandError,
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchBrandList(action) {
    let body = action.payload;
    const reqBody = {
        searchText: body.searchText,
        pageNo: body.pageNo,
        pageSize: body.pageSize,
        ipAddress: "1.1.1.1",
        requestId: "GET_Brand_LIST",
        userId: getUserId()
    }
    try {
        const fetchBrandList =  yield fetch(`${baseUrl}api/trading/brand/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchBrandList.status === 200) {
            const fetchBrandResponse = yield fetchBrandList.json();
            yield put(fetchBrandListSuccess(fetchBrandResponse));
        } else if (fetchBrandList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchBrandListError('error'));
    } catch (error) {
        yield put(fetchBrandListError(error));
    }
}

function* fetchBrandListById(action) {
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
        const fetchBrandId =  yield fetch(`${baseUrl}api/trading/brand/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchBrandId.status === 200) {
            const fetchBrandResponse = yield fetchBrandId.json();
            yield put(fetchBrandListIdSuccess(fetchBrandResponse));
        } else if (fetchBrandId.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchBrandListIdError('error'));
    } catch (error) {
        yield put(fetchBrandListIdError(error));
    }
}

function* addBrand(action) {
    let body = action.payload;
    const reqBody = {
        brandName: body.brandName,
        brandDesc: body.brandDesc,
        requestId: "ADD_BRAND",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const addBrand = yield fetch(`${baseUrl}api/trading/brand/save`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if (addBrand.status == 200) {
            yield put(addBrandSuccess());
        } else if (addBrand.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addBrandError('error'));
    } catch (error) {
        yield put(addBrandError(error));
    }
}

function* updateBrand(action) {
    let body = action.payload;
    const reqBody = {
        brandId: body.brandId,
        brandName: body.values.brandName,
        brandDesc: body.values.brandDesc,
        requestId: "BRAND_UPDATE",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const updateBrand = yield fetch(`${baseUrl}api/trading/brand/update`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (updateBrand.status == 200) {
            yield put(updateBrandSuccess());
        } else if (updateBrand.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateBrandError('error'));
    } catch (error) {
        console.log(error);
        yield put(updateBrandError(error));
    }
}

function* deleteBrandSaga(action) {
    let body = action.payload;
    const reqBody = {
        ids: [body.ids],
        requestId: "Brand_DELETE",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const deleteBrand = yield fetch(`${baseUrl}api/trading/brand/delete`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (deleteBrand.status == 200) {
            yield put(deleteBrandSuccess());
        } else if (deleteBrand.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteBrandError('error'));
    } catch (error) {
        console.log(error);
        yield put(deleteBrandError(error));
    }
}

export function* watchFetchRequests() {
    yield takeLatest(FETCH_BRAND_LIST_REQUEST, fetchBrandList);
    yield takeLatest(ADD_BRAND_REQUEST, addBrand);
    yield takeLatest(UPDATE_BRAND_REQUEST, updateBrand);
    yield takeLatest(FETCH_BRAND_LIST_ID_REQUEST, fetchBrandListById);
    yield takeLatest(DELETE_BRAND_REQUEST, deleteBrandSaga);
}

export default function* brandSagas() {
    yield all([fork(watchFetchRequests)]);
}

