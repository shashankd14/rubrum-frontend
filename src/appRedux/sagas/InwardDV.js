import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken, getUserId } from './common';
import { FETCH_INWARD_DV_LIST_REQUEST, ADD_INWARD_DV_REQUEST, UPDATE_INWARD_DV_REQUEST, FETCH_INWARD_DV_LIST_ID_REQUEST, DELETE_INWARD_DV_REQUEST, GENERATE_INWARD_ID_REQUEST, GENERATE_CONSIGNMENT_ID_REQUEST } from "../../constants/ActionTypes";
import {
    fetchInwardDVListSuccess,
    fetchInwardDVListError,
    fetchInwardDVListIdSuccess,
    fetchInwardListError,
    deleteInwardDVSuccess,
    deleteInwardDVError,
    generateInwardIdSuccess,
    generateInwardIdError,
    generateConsignmentIdSuccess,
    generateConsignmentIdError,
    addInwardDVSuccess,
    addInwardDVError,
    updateInwardDVSuccess,
    updateInwardDVError,
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchInwardList(action) {
    let body = action.payload;
    const reqBody = {
        searchText: body.searchText,
        pageNo: body.pageNo,
        pageSize: body.pageSize,
        ipAddress: "1.1.1.1",
        requestId: "GET_INWARD_LIST",
        userId: getUserId()
    }
    try {
        const fetchInwardList =  yield fetch(`${baseUrl}api/trading/inward/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchInwardList.status === 200) {
            const fetchInwardListResponse = yield fetchInwardList.json();
            yield put(fetchInwardDVListSuccess(fetchInwardListResponse));
        } else if (fetchInwardList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchInwardDVListError('error'));
    } catch (error) {
        yield put(fetchInwardDVListError(error));
    }
}

function* fetchInwardListById(action) {
    debugger
    let body = action.payload;
    const reqBody = {
        inwardId: body.id,
        pageNo: body.pageNo,
        pageSize: body.pageSize,
        requestId: "GET_BY_ID",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const fetchInwardId =  yield fetch(`${baseUrl}api/trading/inward/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchInwardId.status === 200) {
            const fetchInwardResponse = yield fetchInwardId.json();
            yield put(fetchInwardDVListIdSuccess(fetchInwardResponse));
        } else if (fetchInwardId.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchInwardListError('error'));
    } catch (error) {
        yield put(fetchInwardListError(error));
    }
}

function* addInwardDVSaga(action) {
    let body = action.payload;
    const reqBody = {
        purposeType: body.purposeType,
        vendorId: body.vendorId,
        transporterName: body.transporterName,
        transporterPhoneNo: body.transporterPhoneNo,
        vendorBatchNo: body.vendorBatchNo,
        consignmentId: body.consignmentId,
        locationId: body.locationId,
        vehicleNo: body.vehicleNo,
        documentNo: body.documentNo,
        documentType: body.documentType,
        documentDate: body.documentDate,
        ewayBillNo: body.ewayBillNo,
        ewayBillDate: body.ewayBillDate,
        valueOfGoods: body.valueOfGoods,
        extraChargesOption: body.options,
        freightCharges: body.frieghtCharges,
        insuranceAmount: body.addInsurance,
        loadingCharges: body.loadingAndUnloading,
        weightmenCharges: body.weightmenCharges,
        cgst: body.addCGST,
        sgst: body.addSGST,
        igst: body.addIGST,
        totalInwardVolume: body.totalInwardVolume,
        totalWeight: body.totalWeight,
        totalVolume: body.totalVolume,
        itemsList: body.itemsList,
        requestId: "INWARD_TRADING_INSERT",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const addInward = yield fetch(`${baseUrl}api/trading/inward/save`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if (addInward.status == 200) {
            yield put(addInwardDVSuccess());
        } else if (addInward.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addInwardDVError('error'));
    } catch (error) {
        yield put(addInwardDVError(error));
    }
}

function* updateInwardDVSaga(action) {
    debugger
    let body = action.payload;
    const reqBody = {
        inwardId: body.inwardId,
        purposeType: body.inwardDV.purposeType,
        vendorId: body.inwardDV.vendorId,
        transporterName: body.inwardDV.transporterName,
        transporterPhoneNo: body.inwardDV.transporterPhoneNo,
        vendorBatchNo: body.inwardDV.vendorBatchNo,
        consignmentId: body.inwardDV.consignmentId,
        locationId: body.inwardDV.locationId,
        vehicleNo: body.inwardDV.vehicleNo,
        documentNo: body.inwardDV.documentNo,
        documentType: body.inwardDV.documentType,
        documentDate: body.inwardDV.documentDate || "",
        ewayBillNo: body.inwardDV.ewayBillNo,
        ewayBillDate: body.inwardDV.ewayBillDate || "",
        valueOfGoods: body.inwardDV.valueOfGoods,
        extraChargesOption: body.inwardDV.extraChargesOption,
        freightCharges: body.inwardDV.freightCharges,
        insuranceAmount: body.inwardDV.insuranceAmount,
        loadingCharges: body.inwardDV.loadingCharges,
        weightmenCharges: body.inwardDV.weightmenCharges,
        cgst: body.inwardDV.cgst,
        sgst: body.inwardDV.sgst,
        igst: body.inwardDV.igst,
        totalInwardVolume: body.inwardDV.totalInwardVolume || "",
        totalWeight: body.inwardDV.totalWeight,
        totalVolume: body.inwardDV.totalVolume,
        itemsList: body.inwardDV.itemsList,
        requestId: "INWARD_TRADING_UPDATE",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const updateInward = yield fetch(`${baseUrl}api/trading/inward/update`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (updateInward.status == 200) {
            yield put(updateInwardDVSuccess());
        } else if (updateInward.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateInwardDVError('error'));
    } catch (error) {
        console.log(error);
        yield put(updateInwardDVError(error));
    }
}

function* deleteInwardSaga(action) {
    let body = action.payload;
    const reqBody = {
        ids: [body.ids],
        requestId: "INWARD_DELETE",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const deleteInward = yield fetch(`${baseUrl}api/trading/inward/delete`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        window.location.reload();
        if (deleteInward.status == 200) {
            yield put(deleteInwardDVSuccess());
        } else if (deleteInward.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteInwardDVError('error'));
    } catch (error) {
        console.log(error);
        yield put(deleteInwardDVError(error));
    }
}

function* generateInwardIdSaga(action) {
    let body = action.payload;
    const reqBody = {
        fieldName: body.fieldName,
        ipAddress: "1.1.1.1",
        requestId: body.requestId,
        userId: getUserId()
    }
    try {
        const generateInwardId =  yield fetch(`${baseUrl}api/trading/inward/generateSeq`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(generateInwardId.status === 200) {
            const generateInwardIDResponse = yield generateInwardId.json();
            yield put(generateInwardIdSuccess(generateInwardIDResponse));
        } else if (generateInwardId.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(generateInwardIdError('error'));
    } catch (error) {
        yield put(generateInwardIdError(error));
    }
}

function* generateConsignmentIdSaga(action) {
    let body = action.payload;
    const reqBody = {
        fieldName: body.fieldName,
        ipAddress: "1.1.1.1",
        requestId: body.requestId,
        userId: getUserId()
    }
    try {
        const generateConsignmentId =  yield fetch(`${baseUrl}api/trading/inward/generateSeq`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(generateConsignmentId.status === 200) {
            const generateConsignmentIDResponse = yield generateConsignmentId.json();
            yield put(generateConsignmentIdSuccess(generateConsignmentIDResponse));
        } else if (generateConsignmentId.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(generateConsignmentIdError('error'));
    } catch (error) {
        yield put(generateConsignmentIdError(error));
    }
}

export function* watchFetchRequests() {
    yield takeLatest(FETCH_INWARD_DV_LIST_REQUEST, fetchInwardList);
    yield takeLatest(ADD_INWARD_DV_REQUEST, addInwardDVSaga);
    yield takeLatest(UPDATE_INWARD_DV_REQUEST, updateInwardDVSaga);
    yield takeLatest(FETCH_INWARD_DV_LIST_ID_REQUEST, fetchInwardListById);
    yield takeLatest(DELETE_INWARD_DV_REQUEST, deleteInwardSaga);
    yield takeLatest(GENERATE_INWARD_ID_REQUEST, generateInwardIdSaga);
    yield takeLatest(GENERATE_CONSIGNMENT_ID_REQUEST, generateConsignmentIdSaga);
}

export default function* inwardDVSagas() {
    yield all([fork(watchFetchRequests)]);
}

