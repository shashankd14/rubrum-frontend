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
const headers = {
    access_token: getUserToken()
};

function* fetchRatesList() {
    try {
        const fetchRatesList =  yield fetch(`${baseUrl}api/rates/list`, {
            method: 'GET',
            headers
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

function* addRates(action) {

    const { 
        partyRates,
        process,
        materialType,
        minThickness, 
        maxThickness, 
        thicknessRate, 
        packagingCharges, 
        laminationCharges
    } = action.rates;

    try {
        let data = new FormData();
        data.append('partyRates', partyRates);
        data.append('process', process);
        data.append('materialType', materialType);
        data.append('minThickness', parseFloat(minThickness));
        data.append('maxThickness', parseFloat(maxThickness));
        data.append('thicknessRate', parseFloat(thicknessRate));
        data.append('packagingCharges', parseFloat(packagingCharges));
        data.append('laminationCharges', parseFloat(laminationCharges));

        const addRates = yield fetch(`${baseUrl}api/rates/save`, {
            method: 'POST',
            body: data,
            headers
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

    const { 
        values: {
            partyRates,
            process,
            materialType,
            minThickness, 
            maxThickness, 
            thicknessRate, 
            packagingCharges, 
            laminationCharges
        },
        id
    } = action.rates;

    try {
        let data = new FormData();
        data.append('rateId', id);
        data.append('partyRates', partyRates);
        data.append('process', process);
        data.append('materialType', materialType);
        data.append('minThickness', parseFloat(minThickness));
        data.append('maxThickness', parseFloat(maxThickness));
        data.append('thicknessRate', parseFloat(thicknessRate));
        data.append('packagingCharges', parseFloat(packagingCharges));
        data.append('laminationCharges', parseFloat(laminationCharges));

        const updateRates = yield fetch(`${baseUrl}api/rates/update`, {
            method: 'PUT',
            body: data,
            headers
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
        const fetchRatesById =  yield fetch(`${baseUrl}api/rates/getById/${action.rateId}`, {
            method: 'GET',
            headers
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
    yield takeLatest(ADD_RATES_REQUEST, addRates);
    yield takeLatest(UPDATE_RATES_REQUEST, updateRates);
    yield takeLatest(FETCH_RATES_LIST_ID_REQUEST, fetchRatesListById);


}

export default function* ratesSagas() {
    yield all([fork(watchFetchRequests)]);
}

