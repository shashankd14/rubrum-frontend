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
    UPDATE_ADDITIONAL_RATES_REQUEST,
    GET_LAMINATION_CHARGES_LIST_REQUEST,
    GET_BY_ID_LAMINATION_CHARGES_REQUEST,
    SAVE_LAMINATION_CHARGES_REQUEST,
    UPDATE_LAMINATION_CHARGES_REQUEST,
    DELETE_LAMINATION_CHARGES_REQUEST,
    GET_BY_PARTY_ID_LAMINATION_CHARGES_REQUEST,
    GET_LAMINATION_CHARGES_DROPDOWN_REQUEST
} from "../../constants/ActionTypes";
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
    updateAdditionalRatesSuccess,
    getLaminationChargesListSuccess,
    getLaminationChargesListError,
    getLaminationChargesByIdSuccess,
    getLaminationChargesByIdError,
    addLminationChargesSuccess,
    addLminationChargesError,
    updateLminationChargesSuccess,
    updateLminationChargesError,
    deleteLminationChargesSuccess,
    deleteLminationChargesError,
    getLaminationChargesByPartyIdSuccess,
    getLaminationChargesByPartyIdError,
    getLaminationChargesDropDownSuccess,
    getLaminationChargesDropDownError,
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
        locationId:action.rates.locationId,
        processId:action?.rates?.processId,
        productId:action?.rates?.productId.flat(),
        gradeId:action?.rates?.gradeId.flat(),
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
//Lamination Charges
function* fetchLaminationChargesList() {
    try {
        const fetchLaminationChargesList =  yield fetch(`${baseUrl}api/lamination`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchLaminationChargesList.status === 200) {
            const fetchLaminationChargesListResponse = yield fetchLaminationChargesList.json();
            yield put(getLaminationChargesListSuccess(fetchLaminationChargesListResponse));
        } else if (fetchLaminationChargesList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(getLaminationChargesListError('error'));
    } catch (error) {
        yield put(getLaminationChargesListError(error));
    }
}

function* fetchLaminationChargesById(action) {
    try {
        const fetchLaminationChargesById =  yield fetch(`${baseUrl}api/lamination/${action.laminationId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchLaminationChargesById.status === 200) {
            const fetchLaminationChargesByIdResponse = yield fetchLaminationChargesById.json();
            yield put(getLaminationChargesByIdSuccess(fetchLaminationChargesByIdResponse));
        } else if (fetchLaminationChargesById.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(getLaminationChargesByIdError('error'));
    } catch (error) {
        yield put(getLaminationChargesByIdError(error));
    }
}

function* addLaminationCharges(action) {
    try {
        const { lPartyId: partyId, laminationDetailsId, charges } = action.payload;

        const data = {
            partyId,
            laminationDetailsId,
            charges,
        }

        const addLaminationCharges = yield fetch(`${baseUrl}api/lamination/save`, {
            method: 'POST',
            body: JSON.stringify([data]),
            headers: { "Content-Type": "application/json", ...getHeaders() },
        });
        if (addLaminationCharges.status == 200) {
            yield put(addLminationChargesSuccess());
        } else if (addLaminationCharges.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addLminationChargesError('error'));
    } catch (error) {
        yield put(addLminationChargesError(error));
    }
}

function* updateLaminationCharges(action) {
    try {
        const {  laminationId, lPartyId:partyId, laminationDetailsId, charges } = action.payload;

        const data = {
            laminationId,
            partyId,
            laminationDetailsId,
            charges
        }
        const updateLaminationCharges = yield fetch(`${baseUrl}api/lamination/update`, {
            method: 'PUT',
            body: JSON.stringify([data]),
            headers: { "Content-Type": "application/json", ...getHeaders() },
        });
        if (updateLaminationCharges.status == 200) {
            yield put(updateLminationChargesSuccess());
        } else if (updateLaminationCharges.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateLminationChargesError('error'));
    } catch (error) {
        yield put(updateLminationChargesError(error));
    }
}

function* deleteLaminationCharges(action) {
    try {
        const deletedLaminationCharges =  yield fetch(`${baseUrl}api/lamination/${action?.payload}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        window.location.reload();
        if(deletedLaminationCharges.status === 200) {
            yield put(deleteLminationChargesSuccess(deletedLaminationCharges));
        } else if (deletedLaminationCharges.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteLminationChargesError('error'));
    } catch (error) {
        yield put(deleteLminationChargesError(error));
    }
}

function* fetchLaminationChargesByPartyId(action) {
    try {
        const fetchLaminationChargesById =  yield fetch(`${baseUrl}api/lamination/party/${action.partyId[0]}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchLaminationChargesById.status === 200) {
            const fetchLaminationChargesByIdResponse = yield fetchLaminationChargesById.json();
            yield put(getLaminationChargesByPartyIdSuccess(fetchLaminationChargesByIdResponse));
        } else if (fetchLaminationChargesById.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(getLaminationChargesByPartyIdError('error'));
    } catch (error) {
        yield put(getLaminationChargesByPartyIdError(error));
    }
}

function* fetchLaminationChargesDropDownList() {
    try {
        const fetchLaminationChargesList =  yield fetch(`${baseUrl}api/lamination/getLaminationChargesList`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchLaminationChargesList.status === 200) {
            const fetchLaminationChargesListResponse = yield fetchLaminationChargesList.json();
            yield put(getLaminationChargesDropDownSuccess(fetchLaminationChargesListResponse));
        } else if (fetchLaminationChargesList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(getLaminationChargesDropDownError('error'));
    } catch (error) {
        yield put(getLaminationChargesDropDownError(error));
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
    yield takeLatest(GET_LAMINATION_CHARGES_LIST_REQUEST, fetchLaminationChargesList);
    yield takeLatest(GET_BY_ID_LAMINATION_CHARGES_REQUEST, fetchLaminationChargesById);
    yield takeLatest(SAVE_LAMINATION_CHARGES_REQUEST, addLaminationCharges);
    yield takeLatest(UPDATE_LAMINATION_CHARGES_REQUEST, updateLaminationCharges);
    yield takeLatest(DELETE_LAMINATION_CHARGES_REQUEST, deleteLaminationCharges);
    yield takeLatest(GET_BY_PARTY_ID_LAMINATION_CHARGES_REQUEST, fetchLaminationChargesByPartyId);
    yield takeLatest(GET_LAMINATION_CHARGES_DROPDOWN_REQUEST, fetchLaminationChargesDropDownList);
}

export default function* ratesSagas() {
    yield all([fork(watchFetchRequests)]);
}

