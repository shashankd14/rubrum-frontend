import {all, put, fork, takeLatest} from "redux-saga/effects";
import moment from "moment";
import {
    CHECK_COIL_EXISTS,
    FETCH_INWARD_LIST_REQUEST,
    SUBMIT_INWARD_ENTRY,
    FETCH_INWARD_LIST_BY_PARTY_REQUEST,
    FETCH_INWARD_PLAN_DETAILS_REQUESTED
} from "../../constants/ActionTypes";
import {fetchInwardListError,
    fetchInwardListSuccess,
    submitInwardSuccess,
    submitInwardError,
    checkDuplicateCoilSuccess,
    checkDuplicateCoilError,
    getCoilsByPartyIdSuccess,
    getCoilsByPartyIdError,
    getCoilPlanDetailsSuccess,
    getCoilPlanDetailsError
} from "../actions";

function* fetchInwardList() {
    try {
        const fetchInwardList =  yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/inwardEntry/list', {
            method: 'GET',
        });
        if(fetchInwardList.status === 200) {
            const fetchInwardListResponse = yield fetchInwardList.json();
            console.log(fetchInwardListResponse);
            yield put(fetchInwardListSuccess(fetchInwardListResponse));
        } else
            yield put(fetchInwardListError('error'));
    } catch (error) {
        yield put(fetchInwardListError(error));
    }
}

function* checkCoilDuplicate(action) {
    try {
        const checkCoilDuplicate =  yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/inwardEntry/isCoilPresent?coilNumber=${action.coilNumber}`, {
            method: 'GET',
        });
        if(checkCoilDuplicate.status === 200) {
            const checkCoilDuplicateResponse = yield checkCoilDuplicate.json();
            yield put(checkDuplicateCoilSuccess(checkCoilDuplicateResponse));
        } else
            yield put(checkDuplicateCoilError('error'));
    } catch (error) {
        yield put(checkDuplicateCoilError(error));
    }
}

function* submitInward(action) {
    try {
        console.log(action);
        let data = new FormData();
        //customer details
        data.append('partyId', action.inward.partyName);
        data.append('customerCoilId',  action.inward.customerId);
        data.append('customerBatchId',  action.inward.customerBatchNo);
        data.append('customerInvoiceNo',  action.inward.customerInvoiceNo);
        data.append('purposeType', action.inward.purposeType);

        //coil details
        data.append('coilNumber', action.inward.coilNumber);
        data.append('materialId',  action.inward.material);
        data.append('width', action.inward.width);
        data.append('thickness',  action.inward.thickness);
        action.inward.length && data.append('length',  action.inward.length);
        data.append('presentWeight',  action.inward.netWeight);
        data.append('grossWeight',  action.inward.grossWeight);

        // invoice details
        data.append('inwardDate',  moment(action.inward.receivedDate).format('YYYY-MM-DD HH:mm:ss'));
        data.append('bathchNumber',  action.inward.batchNo);
        data.append('vehicleNumber', action.inward.vehicleNumber);
        data.append('invoiceDate', moment(action.inward.invoiceDate).format('YYYY-MM-DD HH:mm:ss'));
        data.append('invoiceNumber', action.inward.invoiceNumber);

        //quality details
        data.append('materialGradeId',  action.inward.grade);
        data.append('testCertificateNumber',  action.inward.testCertificateNo);
        data.append('remarks',  action.inward.remarks);

        if(action.inward.testFile) {
            data.append('testCertificateFile', action.inward.testFile.fileList[0].originFileObj, action.inward.testFile.fileList[0].name);
        }

        data.append('statusId',  1);
        data.append('heatnumber',  '123');
        data.append('plantname',  'test plant name');
        // data.append('customerInvoiceDajte',  action.inward.grade);
        data.append('createdBy',  1);
        data.append('updatedBy',  1);

        const newInwardEntry =  yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/inwardEntry/addNew', {
            method: 'POST',
            body: data
        });
        if(newInwardEntry.status === 200) {
            const newInwardEntryResponse = yield newInwardEntry.json();
            yield put(submitInwardSuccess());
        } else
            yield put(submitInwardError('error'));
    } catch (error) {
        yield put(submitInwardError(error));
    }
}

function* fetchInwardListByParty(action) {
    try {
        const fetchPartyInwardList =  yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/inwardEntry/getByPartyId/${action.partyId}`, {
            method: 'GET',
        });
        if(fetchPartyInwardList.status === 200) {
            const fetchPartyInwardListResponse = yield fetchPartyInwardList.json();
            yield put(getCoilsByPartyIdSuccess(fetchPartyInwardListResponse.body));
        } else
            yield put(getCoilsByPartyIdError('error'));
    } catch (error) {
        yield put(getCoilsByPartyIdError(error));
    }
}

function* fetchInwardPlanDetails(action) {
    try {
        const fetchInwardPlan =  yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/inwardEntry/getByCoilId/${action.coilNumber}`, {
            method: 'GET',
        });
        if(fetchInwardPlan.status === 200) {
            const fetchInwardPlanResponse = yield fetchInwardPlan.json();
            yield put(getCoilPlanDetailsSuccess(fetchInwardPlanResponse));
        } else
            yield put(getCoilPlanDetailsError('error'));
    } catch (error) {
        yield put(getCoilPlanDetailsError(error));
    }
}

export function* watchFetchRequests() {
    yield takeLatest(FETCH_INWARD_LIST_REQUEST, fetchInwardList);
    yield takeLatest(SUBMIT_INWARD_ENTRY, submitInward);
    yield takeLatest(CHECK_COIL_EXISTS, checkCoilDuplicate);
    yield takeLatest(FETCH_INWARD_LIST_BY_PARTY_REQUEST, fetchInwardListByParty);
    yield takeLatest(FETCH_INWARD_PLAN_DETAILS_REQUESTED, fetchInwardPlanDetails);
}

export default function* inwardSagas() {
    yield all([fork(watchFetchRequests)]);
}
