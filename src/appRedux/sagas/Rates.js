import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken } from './common';
import {FETCH_RATES_LIST_REQUEST, ADD_RATES_REQUEST, FETCH_RATES_LIST_ID_REQUEST, UPDATE_RATES_REQUEST} from "../../constants/ActionTypes";
import {
    fetchRatesListSuccess, 
    fetchRatesListError,
    addRatesError,
    addRatesSuccess,
    fetchRatesListByIdSuccess,
    fetchRatesListByIdError,
    updateRatesSuccess,
    updateRatesError
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


export function* watchFetchRequests() {
    yield takeLatest(FETCH_RATES_LIST_REQUEST, fetchRatesList);
    yield takeLatest(ADD_RATES_REQUEST, savePriceMaster);
    yield takeLatest(UPDATE_RATES_REQUEST, updateRates);
    yield takeLatest(FETCH_RATES_LIST_ID_REQUEST, fetchRatesListById);


}

export default function* ratesSagas() {
    yield all([fork(watchFetchRequests)]);
}

