import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken } from './common';
import {FETCH_PACKING_LIST_REQUEST,
    FETCH_PACKING_LIST_BY_PARTY_REQUEST,
    FETCH_PACKING_BUCKET_LIST_REQUEST,
    ADD_PACKING_REQUEST,
    ADD_PACKING_BUCKET_REQUEST,
    FETCH_PACKING_LIST_ID_REQUEST,
    FETCH_PACKING_BUCKET_LIST_ID_REQUEST,
    UPDATE_PACKING_REQUEST,
    UPDATE_PACKING_BUCKET_REQUEST
} from "../../constants/ActionTypes";
import {fetchPackingListError, 
    fetchPackingListSuccess,
    fetchPackingListByPartySuccess,
    fetchPackingListByPartyError,
    fetchPackingBucketListError,
    fetchPackingBucketListSuccess,
    addPackingSuccess, 
    addPackingError,
    addPackingBucketSuccess, 
    addPackingBucketError,
    fetchPackingListByIdSuccess,
    fetchPackingListByIdError,
    fetchPackingBucketListByIdSuccess,
    fetchPackingBucketListByIdError,
    updatePackingSuccess,
    updatePackingError,
    updatePackingBucketSuccess,
    updatePackingBucketError
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

function* fetchPackingListByParty(action) {
    try {
        const fetchPackingListByParty =  yield fetch(`${baseUrl}api/packing/rate/party/${action.partyId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchPackingListByParty.status === 200) {
            const fetchPackingListByPartyResponse = yield fetchPackingListByParty.json();
            yield put(fetchPackingListByPartySuccess(fetchPackingListByPartyResponse));
        } else if (fetchPackingListByParty.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchPackingListByPartyError('error'));
    } catch (error) {
        yield put(fetchPackingListByPartyError(error));
    }
}

function* fetchPackingBucketList() {
    try {
        const fetchPackingBucketList =  yield fetch(`${baseUrl}api/packing/bucket`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchPackingBucketList.status === 200) {
            const fetchPackingBucketListResponse = yield fetchPackingBucketList.json();
            yield put(fetchPackingBucketListSuccess(fetchPackingBucketListResponse));
        } else if (fetchPackingBucketList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchPackingBucketListError('error'));
    } catch (error) {
        yield put(fetchPackingBucketListError(error));
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

function* addPackingBucket(action) {
    try {
        const { bucketDesc, bucketId, packingItem, qty } = action.bucket;
        const packingObj = {
            packingBucketId: bucketId,
            packingBucketDesc: bucketDesc,
            packingItemIdList: packingItem,
            qty
        }
        const addPackingBucket = yield fetch(`${baseUrl}api/packing/bucket/save`, {
                method: 'POST',
                headers: { "Content-Type": "application/json", ...getHeaders() },
                body:JSON.stringify(packingObj)
            
        });
        if (addPackingBucket.status == 200) {
            yield put(addPackingBucketSuccess());
        } else if (addPackingBucket.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addPackingBucketError('error'));
    } catch (error) {
        yield put(addPackingBucketError(error));
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

function* updatePackingBucket(action) {
    try {
        const { values: { bucketDesc, bucketId, packingItem, qty }, id } = action.bucket;
        const packingObj = {
            bucketId: id,
            packingBucketId: bucketId,
            packingBucketDesc: bucketDesc,
            packingItemIdList: packingItem,
            qty
        }
        const updatePackingBucket = yield fetch(`${baseUrl}api/packing/bucket/update`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json", ...getHeaders() },
                body:JSON.stringify(packingObj)
            
        });
        if (updatePackingBucket.status == 200) {
            yield put(updatePackingBucketSuccess());
        } else if (updatePackingBucket.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updatePackingBucketError('error'));
    } catch (error) {
        yield put(updatePackingBucketError(error));
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

function* fetchPackingBucketListById(action) {
    try {
        const fetchPackingBucketListById =  yield fetch(`${baseUrl}api/packing/bucket/${action.bucketId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchPackingBucketListById.status === 200) {
            const fetchPackingByIdResponse = yield fetchPackingBucketListById.json();
            yield put(fetchPackingBucketListByIdSuccess(fetchPackingByIdResponse));
        }  else if (fetchPackingBucketListById.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchPackingBucketListByIdError('error'));
    } catch (error) {
        yield put(fetchPackingBucketListByIdError(error));
    }
}

export function* watchFetchRequests() {
    yield takeLatest(FETCH_PACKING_LIST_REQUEST, fetchPackingList);
    yield takeLatest(FETCH_PACKING_LIST_BY_PARTY_REQUEST, fetchPackingListByParty);
    yield takeLatest(FETCH_PACKING_BUCKET_LIST_REQUEST, fetchPackingBucketList);
    yield takeLatest(ADD_PACKING_REQUEST, addPacking);
    yield takeLatest(ADD_PACKING_BUCKET_REQUEST, addPackingBucket);
    yield takeLatest(FETCH_PACKING_LIST_ID_REQUEST, fetchPackingListById);
    yield takeLatest(FETCH_PACKING_BUCKET_LIST_ID_REQUEST, fetchPackingBucketListById);
    yield takeLatest(UPDATE_PACKING_REQUEST, updatePacking);
    yield takeLatest(UPDATE_PACKING_BUCKET_REQUEST, updatePackingBucket);


}

export default function* packingSagas() {
    yield all([fork(watchFetchRequests)]);
}
