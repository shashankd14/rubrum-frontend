import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken } from './common';
import {FETCH_RATES_LIST_REQUEST,
    FETCH_PACKING_RATES_LIST_REQUEST,
    ADD_RATES_REQUEST, 
    ADD_PACKING_RATES_REQUEST,
    FETCH_ADDITIONAL_RATES_LIST_REQUEST,
    DELETE_ADDITIONAL_RATES_BY_ID,
     FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST,
     FETCH_RATES_LIST_ID_REQUEST,
     FETCH_PACKING_RATES_LIST_ID_REQUEST,
     FETCH_STATIC_LIST_BY_PROCESSS,
     UPDATE_RATES_REQUEST,
     UPDATE_PACKING_RATES_REQUEST,
     DELETE_RATES_BY_ID,
     ADD_ADDITIONAL_RATES_REQUEST,
    UPDATE_ADDITIONAL_RATES_REQUEST} from "../../constants/ActionTypes";
import {
    fetchRatesListSuccess, 
    fetchRatesListError,
    fetchPackingRatesListSuccess, 
    fetchPackingRatesListError,
    addRatesError,
    addRatesSuccess,
    addPackingRatesError,
    addPackingRatesSuccess,
    fetchRatesListByIdSuccess,
    fetchRatesListByIdError,
    fetchPackingRatesByIdSuccess,
    fetchPackingRatesByIdError,
    updateRatesSuccess,
    updateRatesError,
    updatePackingRatesSuccess,
    updatePackingRatesError,
    deleteRatesError,
    deleteRatesSuccess,
    addAdditionalRatesError,
    addAdditionalRatesSuccess,
    getStaticListSuccess,
    getStaticListError,
    fetchAdditionalRatesListError,
    fetchAdditionalRatesListSuccess,
    fetchAdditionalPriceListByIdError,
    fetchAdditionalPriceListByIdSuccess,
    deleteAdditionalRatesError,
    deleteAdditionalRatesSuccess,
    updateAdditionalRatesError,
    updateAdditionalRatesSuccess
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

 function* fetchRatesList(action) {
    try {
        const { pageNo, pageSize, searchText, thicknessRange } = action.pagination;

        const data = {
            pageNo,
            pageSize,
            searchText,
            thicknessRange
        }
        const fetchRatesList =  yield fetch(`${baseUrl}api/pricemaster/list`,{
            method: 'POST',
            body: JSON.stringify(data),
           headers: { "Content-Type": "application/json", ...getHeaders() },
        });
        if(fetchRatesList.status === 200) {
            const fetchRatesListResponse = yield fetchRatesList.json();
            yield put(fetchRatesListSuccess(fetchRatesListResponse));
        } else if (fetchRatesList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchRatesListError('error'));
    } catch (error) {
        yield put(fetchRatesListError(error));
    }
}

function* fetchPackingRatesList() {
    try {
        const fetchPackingRatesList =  yield fetch(`${baseUrl}api/packing/rate`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchPackingRatesList.status === 200) {
            const fetchPackingRatesListResponse = yield fetchPackingRatesList.json();
            yield put(fetchPackingRatesListSuccess(fetchPackingRatesListResponse));
        } else if (fetchPackingRatesList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchPackingRatesListError('error'));
    } catch (error) {
        yield put(fetchPackingRatesListError(error));
    }
}

function* savePriceMaster(action) {
   
    const data= [{ 
        partyId:action.rates.partyId,
        processId:action?.rates?.processId,
        matGradeId:action?.rates?.matGradeId.flat(),
        thicknessFrom:action?.rates?.thicknessFrom,
        thicknessTo:action?.rates?.thicknessTo,
        price:action?.rates?.price
    }]
     try {
        const addRates = yield fetch(`${baseUrl}api/pricemaster/save`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json", ...getHeaders() },
        });
        if (addRates.status == 200) {
            yield put(addRatesSuccess());
        } else if (addRates.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addRatesError('error'));
    } catch (error) {
        yield put(addRatesError(error));
    }
}

function* addPackingRates(action) {
    try {
        const { packingBucketId, rPartyId: partyId, packingRate, packingRateDesc } = action.packingRate;

        const data = {
            packingBucketId,
            partyId,
            packingRate,
            packingRateDesc
        }

        const addPackingRates = yield fetch(`${baseUrl}api/packing/rate/save`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json", ...getHeaders() },
        });
        if (addPackingRates.status == 200) {
            yield put(addPackingRatesSuccess());
        } else if (addPackingRates.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addPackingRatesError('error'));
    } catch (error) {
        yield put(addPackingRatesError(error));
    }
}

function* updateRates(action) {
    const data= [{ 
        id:action?.rates?.id,
        partyId:action?.rates?.values.partyId,
        processId:action?.rates?.values.processId,
        matGradeId:action?.rates?.values.matGradeId,
        thicknessFrom:action?.rates?.values.thicknessFrom,
        thicknessTo:action?.rates?.values.thicknessTo,
        price:action?.rates?.values.price
    }]
     try {
        const updateRates = yield fetch(`${baseUrl}api/pricemaster/update`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json", ...getHeaders() },
        });
        if (updateRates.status == 200) {
            yield put(updateRatesSuccess());
        } else if (updateRates.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateRatesError('error'));
    } catch (error) {
        yield put(updateRatesError(error));
    }
}

function* updatePackingRates(action) {
    try {
        const { packingBucketId, rPartyId: partyId, packingRate, packingRateDesc, packingRateId } = action.packingRates;

        const data = {
            packingRateId,
            packingBucketId,
            partyId,
            packingRate,
            packingRateDesc
        };
        const updatePackingRates = yield fetch(`${baseUrl}api/packing/rate/update`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json", ...getHeaders() },
        });
        if (updatePackingRates.status == 200) {
            yield put(updatePackingRatesSuccess());
        } else if (updatePackingRates.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updatePackingRatesError('error'));
    } catch (error) {
        yield put(updatePackingRatesError(error));
    }
}

function* fetchRatesListById(action) {
    try {
        const fetchRatesById =  yield fetch(`${baseUrl}api/pricemaster/${action.rateId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchRatesById.status === 200) {
            const fetchRatesByIdResponse = yield fetchRatesById.json();
            yield put(fetchRatesListByIdSuccess(fetchRatesByIdResponse));
        } else if (fetchRatesById.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchRatesListByIdError('error'));
    } catch (error) {
        yield put(fetchRatesListByIdError(error));
    }
}

function* fetchPackingRatesById(action) {
    try {
        const fetchPackingRatesById =  yield fetch(`${baseUrl}api/packing/rate/${action.packingRatesId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchPackingRatesById.status === 200) {
            const fetchPackingRatesByIdResponse = yield fetchPackingRatesById.json();
            yield put(fetchPackingRatesByIdSuccess(fetchPackingRatesByIdResponse));
        } else if (fetchPackingRatesById.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchPackingRatesByIdError('error'));
    } catch (error) {
        yield put(fetchPackingRatesByIdError(error));
    }
}

function* deleteRatesById(action) {
    try {
        const deletedRates =  yield fetch(`${baseUrl}api/pricemaster/${action?.payload}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if(deletedRates.status === 200) {
            yield put(deleteRatesSuccess(deletedRates));
        } else if (deletedRates.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteRatesError('error'));
    } catch (error) {
        yield put(deleteRatesError(error));
    }
}
function* saveAdditionalPriceMaster(action) {
   
    try {
        const addAdditionalRates = yield fetch(`${baseUrl}api/additionalprice/save`, {
            method: 'POST',
            body: JSON.stringify(action.payload),
            headers: { "Content-Type": "application/json", ...getHeaders() },
        });
        if (addAdditionalRates.status == 200) {
            yield put(addAdditionalRatesSuccess());
        } else if (addAdditionalRates.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addAdditionalRatesError('error'));
    } catch (error) {
        yield put(addAdditionalRatesError(error));
    }
}
function* getStaticAdditionalRatesByProcess(action) {
    try {
        const getStaticList =  yield fetch(`${baseUrl}api/additionalprice/pocess/${action.processId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(getStaticList.status === 200) {
            const getStaticListResponse = yield getStaticList.json();
            yield put(getStaticListSuccess(getStaticListResponse));
        } else if (getStaticList.status === 401) {
            yield put(userSignOutSuccess());
        }  else
            yield put(getStaticListError('error'));
    } catch (error) {
        yield put(getStaticListError(error));
    }
}
function* fetchAdditionalPriceList() {
    try {
        const fetchRatesList =  yield fetch(`${baseUrl}api/additionalprice`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchRatesList.status === 200) {
            const fetchRatesListResponse = yield fetchRatesList.json();
            yield put(fetchAdditionalRatesListSuccess(fetchRatesListResponse));
        } else if (fetchRatesList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchAdditionalRatesListError('error'));
    } catch (error) {
        yield put(fetchAdditionalRatesListError(error));
    }
}
function* fetchAdditionalPriceListById(action) {
    try {
        const fetchRatesById =  yield fetch(`${baseUrl}api/additionalprice/${action.rateId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchRatesById.status === 200) {
            const fetchRatesByIdResponse = yield fetchRatesById.json();
            yield put(fetchAdditionalPriceListByIdSuccess(fetchRatesByIdResponse));
        } else if (fetchRatesById.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchAdditionalPriceListByIdError('error'));
    } catch (error) {
        yield put(fetchAdditionalPriceListByIdError(error));
    }
}
function* deleteAdditionalRatesById(action) {
    try {
        const deletedRates =  yield fetch(`${baseUrl}api/additionalprice/${action?.payload}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if(deletedRates.status === 200) {
            yield put(deleteAdditionalRatesSuccess(deletedRates));
        } else if (deletedRates.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteAdditionalRatesError('error'));
    } catch (error) {
        yield put(deleteAdditionalRatesError(error));
    }
}
function* updateAdditionalRates(action) {
    
    try {
        const updateRates = yield fetch(`${baseUrl}api/additionalprice/update`, {
            method: 'PUT',
            body: JSON.stringify(action.rates),
            headers: { "Content-Type": "application/json", ...getHeaders() },
        });
        if (updateRates.status == 200) {
            yield put(updateAdditionalRatesSuccess());
        }else if (updateRates.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateAdditionalRatesError('error'));
    } catch (error) {
        yield put(updateAdditionalRatesError(error));
    }
}
export function* watchFetchRequests() {
    yield takeLatest(FETCH_RATES_LIST_REQUEST, fetchRatesList);
    yield takeLatest(FETCH_PACKING_RATES_LIST_REQUEST, fetchPackingRatesList);
    yield takeLatest(ADD_RATES_REQUEST, savePriceMaster);
    yield takeLatest(ADD_PACKING_RATES_REQUEST, addPackingRates);
    yield takeLatest(UPDATE_RATES_REQUEST, updateRates);
    yield takeLatest(UPDATE_PACKING_RATES_REQUEST, updatePackingRates);
    yield takeLatest(FETCH_RATES_LIST_ID_REQUEST, fetchRatesListById);
    yield takeLatest(FETCH_PACKING_RATES_LIST_ID_REQUEST, fetchPackingRatesById);
    yield takeLatest(DELETE_RATES_BY_ID, deleteRatesById);
    yield takeLatest(ADD_ADDITIONAL_RATES_REQUEST, saveAdditionalPriceMaster);
    yield takeLatest(FETCH_STATIC_LIST_BY_PROCESSS, getStaticAdditionalRatesByProcess);
    yield takeLatest(FETCH_ADDITIONAL_RATES_LIST_REQUEST, fetchAdditionalPriceList);
    yield takeLatest(FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST, fetchAdditionalPriceListById);
    yield takeLatest(DELETE_ADDITIONAL_RATES_BY_ID, deleteAdditionalRatesById);
    yield takeLatest(UPDATE_ADDITIONAL_RATES_REQUEST, updateAdditionalRates);
}

export default function* ratesSagas() {
    yield all([fork(watchFetchRequests)]);
}

