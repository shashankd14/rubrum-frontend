import {all, put, fork, takeLatest} from "redux-saga/effects";
import moment from "moment";
import {CHECK_COIL_EXISTS, FETCH_INWARD_LIST_REQUEST, SUBMIT_INWARD_ENTRY} from "../../constants/ActionTypes";
import {fetchInwardListError,
    fetchInwardListSuccess,
    submitInwardSuccess,
    submitInwardError,
    checkDuplicateCoilSuccess,
    checkDuplicateCoilError
} from "../actions";

function* fetchInwardList() {
    try {
        const fetchInwardList =  yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/inwardEntry/list', {
            method: 'GET',
        });
        if(fetchInwardList.status === 200) {
            const fetchInwardListResponse = yield fetchInwardList.json();
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
        console.log(error)
        yield put(checkDuplicateCoilError(error));
    }
}

function* submitInward(action) {
    try {
        console.log(action);
        let data = new FormData();

        data.append('partyId', action.inward.partyName);
        data.append('coilNumber', action.inward.coilNumber);
        data.append('dReceivedDate',  moment(action.inward.inwardDate).format('YYYY-MM-DD HH:mm:ss'));
        data.append('materialId', '1' );
        data.append('vLorryNo', action.inward.vehicleNumber);

        data.append('dInvoiceDate', moment(action.inward.invoiceDate).format('YYYY-MM-DD HH:mm:ss'));
        data.append('vInvoiceNo', action.inward.invoiceNumber);
        data.append('fWidth', action.inward.width);
        data.append('fThickness',  action.inward.thickness);
        data.append('fLength',  action.inward.length);
        data.append('fQuantity',  action.inward.weight);
        data.append('status',  1);
        data.append('vHeatnumber',  '123');
        data.append('vPlantname',  'test plant name');
        data.append('vProcess',  '');
        data.append('fpresent',  action.inward.weight);
        data.append('vCast',  'casr');
        data.append('vGrade',  'grace');
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

export function* watchFetchRequests() {
    yield takeLatest(FETCH_INWARD_LIST_REQUEST, fetchInwardList);
    yield takeLatest(SUBMIT_INWARD_ENTRY, submitInward);
    yield takeLatest(CHECK_COIL_EXISTS, checkCoilDuplicate);
}

export default function* inwardSagas() {
    yield all([fork(watchFetchRequests)]);
}
