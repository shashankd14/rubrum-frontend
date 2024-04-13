import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken, getUserId } from './common';
import { FETCH_LOCATION_LIST_REQUEST, ADD_LOCATION_REQUEST, UPDATE_LOCATION_REQUEST, FETCH_LOCATION_LIST_ID_REQUEST, DELETE_LOCATION_REQUEST, FETCH_STATE_LIST_REQUEST } from "../../constants/ActionTypes";
import {fetchLocationListSuccess,
    fetchLocationListError,
    addLocationSuccess,
    addLocationError,
    fetchLocationListIdSuccess,
    fetchLocationListIdError,
    updateLocationSuccess,
    updateLocationError,
    deleteLocationSuccess,
    deleteLocationError,
    fetchStateListSuccess,
    fetchStateListError
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchLocationList(action) {
    let body = action.payload;
    const reqBody = {
        searchText: body.searchText,
        pageNo: body.pageNo,
        pageSize: body.pageSize,
        ipAddress: "1.1.1.1",
        requestId: "GET_LOCATION_LIST",
        userId: getUserId()
    }
    try {
        const fetchLocationList =  yield fetch(`${baseUrl}api/trading/location/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchLocationList.status === 200) {
            const fetchLocationListResponse = yield fetchLocationList.json();
            yield put(fetchLocationListSuccess(fetchLocationListResponse));
        } else if (fetchLocationList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchLocationListError('error'));
    } catch (error) {
        yield put(fetchLocationListError(error));
    }
}

function* fetchLocationListById(action) {
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
        const fetchLocationId =  yield fetch(`${baseUrl}api/trading/location/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchLocationId.status === 200) {
            const fetchLocationResponse = yield fetchLocationId.json();
            yield put(fetchLocationListIdSuccess(fetchLocationResponse));
        } else if (fetchLocationId.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchLocationListIdError('error'));
    } catch (error) {
        yield put(fetchLocationListIdError(error));
    }
}

function* addLocation(action) {
    let body = action.payload;
    const reqBody = {
        locationName: body.locationName,
        address1: body.locationAddress,
        address2: body.locationAddress2,
        city: body.city,
        state: body.state,
        pincode: body.pincode,
        requestId: body.requestId,
        gstNo: body.gstNo,
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const addLocation = yield fetch(`${baseUrl}api/trading/location/save`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if (addLocation.status == 200) {
            yield put(addLocationSuccess());
        } else if (addLocation.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addLocationError('error'));
    } catch (error) {
        yield put(addLocationError(error));
    }
}

function* updateLocation(action) {
    let body = action.payload;
    const reqBody = {
        locationId: body.locationId,
        locationName: body.values.locationName,
        address1: body.values.locationAddress,
        address2: body.values.locationAddress2,
        city: body.values.city,
        state: body.values.state,
        pincode: body.values.pincode,
        requestId: "LOCATION_UPDATE",
        // gstNo: body.gstNo,
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const updateLocation = yield fetch(`${baseUrl}api/trading/location/update`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (updateLocation.status == 200) {
            yield put(updateLocationSuccess());
        } else if (updateLocation.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateLocationError('error'));
    } catch (error) {
        console.log(error);
        yield put(updateLocationError(error));
    }
}

function* deleteLocationSaga(action) {
    let body = action.payload;
    const reqBody = {
        ids: [body.ids],
        requestId: "LOCATION_DELETE",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const deleteLocation = yield fetch(`${baseUrl}api/trading/location/delete`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (deleteLocation.status == 200) {
            yield put(deleteLocationSuccess());
        } else if (deleteLocation.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteLocationError('error'));
    } catch (error) {
        console.log(error);
        yield put(deleteLocationError(error));
    }
}

function* fetchStateListSaga(action) {
    let body = action.payload;
    const reqBody = {
        ipAddress: "1.1.1.1",
        requestId: "STATE_LIST",
        userId: getUserId()
    }
    try {
        const fetchStateList =  yield fetch(`${baseUrl}api/trading/stateslist`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchStateList.status === 200) {
            const fetchStateListResponse = yield fetchStateList.json();
            yield put(fetchStateListSuccess(fetchStateListResponse));
        } else if (fetchStateList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchStateListError('error'));
    } catch (error) {
        yield put(fetchStateListError(error));
    }
}

export function* watchFetchRequests() {
    yield takeLatest(FETCH_LOCATION_LIST_REQUEST, fetchLocationList);
    yield takeLatest(ADD_LOCATION_REQUEST, addLocation);
    yield takeLatest(UPDATE_LOCATION_REQUEST, updateLocation);
    yield takeLatest(FETCH_LOCATION_LIST_ID_REQUEST, fetchLocationListById);
    yield takeLatest(DELETE_LOCATION_REQUEST, deleteLocationSaga);
    yield takeLatest(FETCH_STATE_LIST_REQUEST, fetchStateListSaga);
}

export default function* locationSagas() {
    yield all([fork(watchFetchRequests)]);
}

