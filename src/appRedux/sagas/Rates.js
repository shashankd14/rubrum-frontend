import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken } from './common';
import {FETCH_RATES_LIST_REQUEST, ADD_RATES_REQUEST, FETCH_ADDITIONAL_RATES_LIST_REQUEST,FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST,FETCH_RATES_LIST_ID_REQUEST, FETCH_STATIC_LIST_BY_PROCESSS,UPDATE_RATES_REQUEST,DELETE_RATES_BY_ID,ADD_ADDITIONAL_RATES_REQUEST} from "../../constants/ActionTypes";
import {
    fetchRatesListSuccess, 
    fetchRatesListError,
    addRatesError,
    addRatesSuccess,
    fetchRatesListByIdSuccess,
    fetchRatesListByIdError,
    updateRatesSuccess,
    updateRatesError,
    deleteRatesError,
    deleteRatesSuccess,
    addAdditionalRatesError,
    addAdditionalRatesSuccess,
    getStaticListSuccess,
    getStaticListError,
    fetchAdditionalRatesListError,
    fetchAdditionalRatesListSuccess,
    fetchAdditionalPriceListByIdError,
    fetchAdditionalPriceListByIdSuccess
} from "../actions";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchRatesList() {
    try {
        const fetchRatesList =  yield fetch(`${baseUrl}api/pricemaster`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchRatesList.status === 200) {
            const fetchRatesListResponse = yield fetchRatesList.json();
            yield put(fetchRatesListSuccess(fetchRatesListResponse));
        } else
            yield put(fetchRatesListError('error'));
    } catch (error) {
        yield put(fetchRatesListError(error));
    }
}


function* savePriceMaster(action) {
   
    const data= [{ 
        partyId:action.rates.partyId,
        processId:action?.rates?.processId,
        matGradeId:action?.rates?.matGradeId,
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
        } else
            yield put(addRatesError('error'));
    } catch (error) {
        yield put(addRatesError(error));
    }
}

function* updateRates(action) {
    const data= [{ 
        id:action?.rates?.id,
        partyId:action.rates.values.partyId,
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
        } else
            yield put(updateRatesError('error'));
    } catch (error) {
        yield put(updateRatesError(error));
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
        } else
            yield put(fetchRatesListByIdError('error'));
    } catch (error) {
        yield put(fetchRatesListByIdError(error));
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
        } else
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
        } else
            yield put(fetchAdditionalPriceListByIdError('error'));
    } catch (error) {
        yield put(fetchAdditionalPriceListByIdError(error));
    }
}
export function* watchFetchRequests() {
    yield takeLatest(FETCH_RATES_LIST_REQUEST, fetchRatesList);
    yield takeLatest(ADD_RATES_REQUEST, savePriceMaster);
    yield takeLatest(UPDATE_RATES_REQUEST, updateRates);
    yield takeLatest(FETCH_RATES_LIST_ID_REQUEST, fetchRatesListById);
    yield takeLatest(DELETE_RATES_BY_ID, deleteRatesById);
    yield takeLatest(ADD_ADDITIONAL_RATES_REQUEST, saveAdditionalPriceMaster);
    yield takeLatest(FETCH_STATIC_LIST_BY_PROCESSS, getStaticAdditionalRatesByProcess);
    yield takeLatest(FETCH_ADDITIONAL_RATES_LIST_REQUEST, fetchAdditionalPriceList);
    yield takeLatest(FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST, fetchAdditionalPriceListById);
}

export default function* ratesSagas() {
    yield all([fork(watchFetchRequests)]);
}

