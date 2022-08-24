import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken } from './common';
import {FETCH_PACKING_LIST_REQUEST, 
    ADD_PACKING_REQUEST,
    FETCH_PACKING_LIST_ID_REQUEST,
    UPDATE_PACKING_REQUEST
} from "../../constants/ActionTypes";
import {fetchPackingListError, 
    fetchPackingListSuccess, 
    addPackingSuccess, 
    addPackingError,
    fetchPackingListByIdSuccess,
    fetchPackingListByIdError,
    updatePackingSuccess,
    updatePackingError
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchPackingList() {
    try {
        const fetchPackingList =  yield fetch(`${baseUrl}api/packing/item`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchPackingList.status === 200) {
            const fetchPackingListResponse = yield fetchPackingList.json();
            yield put(fetchPackingListSuccess(fetchPackingListResponse));
        } else if (fetchPackingList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchPackingListError('error'));
    } catch (error) {
        yield put(fetchPackingListError(error));
    }
}

function* addPacking(action) {
    try {
        const { packingId: packingItemId, description, unit } = action.packing;
        const packingObj = {
            packingItemId,
            description,
            unit
        }
        const addPacking = yield fetch(`${baseUrl}api/packing/item/save`, {
                method: 'POST',
                headers: { "Content-Type": "application/json", ...getHeaders() },
                body:JSON.stringify(packingObj)
            
        });
        if (addPacking.status == 200) {
            yield put(addPackingSuccess());
        } else if (addPacking.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addPackingError('error'));
    } catch (error) {
        yield put(addPackingError(error));
    }
}

function* updatePacking(action) {
    try {
        const { values: { packingId: packingItemId, description, unit }, id } = action.packing;
        const packingObj = {
            id,
            packingItemId,
            description,
            unit
        }
        const updatePacking = yield fetch(`${baseUrl}api/packing/item/update`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json", ...getHeaders() },
                body:JSON.stringify(packingObj)
            
        });
        if (updatePacking.status == 200) {
            yield put(updatePackingSuccess());
        } else if (updatePacking.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updatePackingError('error'));
    } catch (error) {
        yield put(updatePackingError(error));
    }
}

function* fetchPackingListById(action) {
    try {
        const fetchPackingById =  yield fetch(`${baseUrl}api/packing/item/${action.packingId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchPackingById.status === 200) {
            const fetchPackingByIdResponse = yield fetchPackingById.json();
            yield put(fetchPackingListByIdSuccess(fetchPackingByIdResponse));
        }  else if (fetchPackingById.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchPackingListByIdError('error'));
    } catch (error) {
        yield put(fetchPackingListByIdError(error));
    }
}

export function* watchFetchRequests() {
    yield takeLatest(FETCH_PACKING_LIST_REQUEST, fetchPackingList);
    yield takeLatest(ADD_PACKING_REQUEST, addPacking);
    yield takeLatest(FETCH_PACKING_LIST_ID_REQUEST, fetchPackingListById);
    yield takeLatest(UPDATE_PACKING_REQUEST, updatePacking);


}

export default function* packingSagas() {
    yield all([fork(watchFetchRequests)]);
}
