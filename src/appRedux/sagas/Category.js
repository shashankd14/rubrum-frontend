import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken, getUserId } from './common';
import { FETCH_MAIN_CATEGORY_LIST_REQUEST, ADD_MAIN_CATEGORY_REQUEST, UPDATE_MAIN_CATEGORY_REQUEST, FETCH_MAIN_CATEGORY_LIST_ID_REQUEST, DELETE_MAIN_CATEGORY_REQUEST, FETCH_SUB_CATEGORY_LIST_REQUEST, DELETE_SUB_CATEGORY_REQUEST, FETCH_SUB_CATEGORY_LIST_ID_REQUEST, UPDATE_SUB_CATEGORY_REQUEST, ADD_SUB_CATEGORY_REQUEST } from "../../constants/ActionTypes";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";
import { addMainCategoryError, addMainCategorySuccess, addSubCategoryError, addSubCategorySuccess, deleteMainCategoryError, deleteMainCategorySuccess, deleteSubCategoryError, deleteSubCategorySuccess, fetchMainCategoryIdError, fetchMainCategoryIdSuccess, fetchMainCategoryListError, fetchMainCategoryListSuccess, fetchSubCategoryIdError, fetchSubCategoryIdSuccess, fetchSubCategoryListError, fetchSubCategoryListSuccess, updateMainCategoryError, updateMainCategorySuccess, updateSubCategoryError, updateSubCategorySuccess } from '../actions/Category';

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchMainCategoryListSaga(action) {
    let body = action.payload;
    const reqBody = {
        searchText: body.searchText,
        pageNo: body.pageNo,
        pageSize: body.pageSize,
        ipAddress: "1.1.1.1",
        requestId: "GET_CATEGORY_LIST",
        userId: getUserId()
    }
    try {
        const fetchMainCategoryList =  yield fetch(`${baseUrl}api/trading/category/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchMainCategoryList.status === 200) {
            const fetchMainCategoryListResponse = yield fetchMainCategoryList.json();
            yield put(fetchMainCategoryListSuccess(fetchMainCategoryListResponse));
        } else if (fetchMainCategoryList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchMainCategoryListError('error'));
    } catch (error) {
        yield put(fetchMainCategoryListError(error));
    }
}

function* fetchMainCategoryListById(action) {
    let body = action.payload;
    const reqBody = {
        id: body.id,
        pageNo: body.pageNo,
        pageSize: body.pageSize,
        requestId: "MAIN_CATEGORY_BY_ID",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const fetchMainCategoryId =  yield fetch(`${baseUrl}api/trading/category/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchMainCategoryId.status === 200) {
            const fetchMainByIdResponse = yield fetchMainCategoryId.json();
            yield put(fetchMainCategoryIdSuccess(fetchMainByIdResponse));
        } else if (fetchMainCategoryId.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchMainCategoryIdError('error'));
    } catch (error) {
        yield put(fetchMainCategoryIdError(error));
    }
}

function* addMainCategorySaga(action) {
    let body = action.payload;
    const reqBody = {
        categoryName: body.categoryName,
        categoryHsnCode: body.categoryHsnCode,
        requestId: "ADD_MAIN_CATEGORY",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const addMainCategory = yield fetch(`${baseUrl}api/trading/category/save`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if (addMainCategory.status == 200) {
            yield put(addMainCategorySuccess());
        } else if (addMainCategory.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addMainCategoryError('error'));
    } catch (error) {
        yield put(addMainCategoryError(error));
    }
}

function* updateMainCategorySaga(action) {
    let body = action.payload;
    const reqBody = {
        categoryId:body.id,
        categoryName: body.values.categoryName,
        categoryHsnCode: body.values.categoryHsnCode,
        requestId: "UPDATE_MAIN_CATEGORY",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const updateMainCategory = yield fetch(`${baseUrl}api/trading/category/update`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (updateMainCategory.status == 200) {
            yield put(updateMainCategorySuccess());
        } else if (updateMainCategory.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateMainCategoryError('error'));
    } catch (error) {
        console.log(error);
        yield put(updateMainCategoryError(error));
    }
}

function* deleteMainCategorySaga(action) {
    let body = action.payload;
    const reqBody = {
        ids: [body.ids],
        requestId: "MAIN_CATEGORY_DELETE",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const deleteMainCategory = yield fetch(`${baseUrl}api/trading/category/delete`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (deleteMainCategory.status == 200) {
            yield put(deleteMainCategorySuccess());
        } else if (deleteMainCategory.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteMainCategoryError('error'));
    } catch (error) {
        console.log(error);
        yield put(deleteMainCategoryError(error));
    }
}

//Sub category
function* fetchSubCategoryListSaga(action) {
    let body = action.payload;
    const reqBody = {
        searchText: body.searchText,
        pageNo: body.pageNo,
        pageSize: body.pageSize,
        ipAddress: "1.1.1.1",
        requestId: "GET_CATEGORY_LIST",
        userId: getUserId()
    }
    try {
        const fetchSubCategoryList =  yield fetch(`${baseUrl}api/trading/subcategory/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchSubCategoryList.status === 200) {
            const fetchSubCategoryListResponse = yield fetchSubCategoryList.json();
            yield put(fetchSubCategoryListSuccess(fetchSubCategoryListResponse));
        } else if (fetchSubCategoryList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchSubCategoryListError('error'));
    } catch (error) {
        yield put(fetchSubCategoryListError(error));
    }
}

function* fetchSubCategoryListById(action) {
    let body = action.payload;
    const reqBody = {
        id: body.id,
        pageNo: body.pageNo,
        pageSize: body.pageSize,
        requestId: "MAIN_CATEGORY_BY_ID",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const fetchSubCategoryId =  yield fetch(`${baseUrl}api/trading/subcategory/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchSubCategoryId.status === 200) {
            const fetchSubByIdResponse = yield fetchSubCategoryId.json();
            yield put(fetchSubCategoryIdSuccess(fetchSubByIdResponse));
        } else if (fetchSubCategoryId.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchSubCategoryIdError('error'));
    } catch (error) {
        yield put(fetchSubCategoryIdError(error));
    }
}

function* addSubCategorySaga(action) {
    let body = action.payload;
    const reqBody = {
        subcategoryName:body.itemName,
        categoryId: body.subcategoryId,
        subcategoryHsnCode: body.itemCode,
        requestId: "ADD_SUB_CATEGORY",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const addSubCategory = yield fetch(`${baseUrl}api/trading/subcategory/save`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if (addSubCategory.status == 200) {
            yield put(addSubCategorySuccess());
        } else if (addSubCategory.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addSubCategoryError('error'));
    } catch (error) {
        yield put(addSubCategoryError(error));
    }
}

function* updateSubCategorySaga(action) {
    debugger
    let body = action.payload;
    const reqBody = {
        subcategoryName:body.values.itemName,
        id:body.values.subcategoryId,
        subcategoryId: body.id,
        subcategoryHsnCode: body.values.itemCode,
        requestId: "UPDATE_SUB_CATEGORY",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const updateSubCategory = yield fetch(`${baseUrl}api/trading/subcategory/update`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (updateSubCategory.status == 200) {
            yield put(updateSubCategorySuccess());
        } else if (updateSubCategory.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateSubCategoryError('error'));
    } catch (error) {
        console.log(error);
        yield put(updateSubCategoryError(error));
    }
}

function* deleteSubCategorySaga(action) {
    let body = action.payload;
    const reqBody = {
        ids: [body.ids],
        requestId: "SUB_CATEGORY_DELETE",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const deleteSubCategory = yield fetch(`${baseUrl}api/trading/subcategory/delete`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (deleteSubCategory.status == 200) {
            yield put(deleteSubCategorySuccess());
        } else if (deleteSubCategory.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteSubCategoryError('error'));
    } catch (error) {
        console.log(error);
        yield put(deleteSubCategoryError(error));
    }
}


export function* watchFetchRequests() {
    yield takeLatest(FETCH_MAIN_CATEGORY_LIST_REQUEST, fetchMainCategoryListSaga);
    yield takeLatest(ADD_MAIN_CATEGORY_REQUEST, addMainCategorySaga);
    yield takeLatest(UPDATE_MAIN_CATEGORY_REQUEST, updateMainCategorySaga);
    yield takeLatest(FETCH_MAIN_CATEGORY_LIST_ID_REQUEST, fetchMainCategoryListById);
    yield takeLatest(DELETE_MAIN_CATEGORY_REQUEST, deleteMainCategorySaga);
    yield takeLatest(FETCH_SUB_CATEGORY_LIST_REQUEST, fetchSubCategoryListSaga);
    yield takeLatest(ADD_SUB_CATEGORY_REQUEST, addSubCategorySaga);
    yield takeLatest(UPDATE_SUB_CATEGORY_REQUEST, updateSubCategorySaga);
    yield takeLatest(FETCH_SUB_CATEGORY_LIST_ID_REQUEST, fetchSubCategoryListById);
    yield takeLatest(DELETE_SUB_CATEGORY_REQUEST, deleteSubCategorySaga);
}

export default function* categorySagas() {
    yield all([fork(watchFetchRequests)]);
}

