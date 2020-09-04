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

        data.append('partyId', action.inward.partyName);
        data.append('coilNumber', action.inward.coilNumber);
        data.append('inwardDate',  moment(action.inward.inwardDate).format('YYYY-MM-DD HH:mm:ss'));
        data.append('vehicleNumber', action.inward.vehicleNumber);

        data.append('invoiceDate', moment(action.inward.invoiceDate).format('YYYY-MM-DD HH:mm:ss'));
        data.append('invoiceNumber', action.inward.invoiceNumber);
        data.append('purposeType', action.inward.purposeType);
        data.append('materialId', '1' );
        data.append('width', action.inward.width);
        data.append('thickness',  action.inward.thickness);
        data.append('length',  action.inward.length);
        data.append('status',  1);
        data.append('fQuantity',  action.inward.weight);
        data.append('heatnumber',  '123');
        data.append('plantname',  'test plant name');
        data.append('presentWeight',  action.inward.weight);
        data.append('materialGradeId',  action.inward.grade);
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
