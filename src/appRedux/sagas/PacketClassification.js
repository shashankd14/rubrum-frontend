import {all, put, fork, takeLatest} from "redux-saga/effects";
import {FETCH_CLASSIFICATION_LIST_REQUEST, ADD_CLASSIFICATIONLIST_REQUEST} from "../../constants/ActionTypes";
import {fetchClassificationListSuccess, fetchClassificationListError, addClassificationSuccess, addClassificationError} from "../actions";

function* fetchClassificationList() {
    try {
        const fetchClassificationList =  yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/packetClassification/list', {
            method: 'GET',
        });
        if(fetchClassificationList.status === 200) {
            const fetchClassificationListResponse = yield fetchClassificationList.json();
            yield put(fetchClassificationListSuccess(fetchClassificationListResponse));
        } else
            yield put(fetchClassificationListError('error'));
    } catch (error) {
        yield put(fetchClassificationListError(error));
    }
}

function* addPacketClassification(action) {
    try {
        const addParty = yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/packetClassification/save', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(action.classificationName)
            
        });
        if (addParty.status == 200) {
            yield put(addClassificationSuccess());
        } else
            yield put(addClassificationError('error'));
    } catch (error) {
        yield put(addClassificationError(error));
    }
}
export function* watchFetchRequests() {
    yield takeLatest(FETCH_CLASSIFICATION_LIST_REQUEST, fetchClassificationList);
    yield takeLatest(ADD_CLASSIFICATIONLIST_REQUEST, addPacketClassification);
}

export default function* packetClassification() {
    yield all([fork(watchFetchRequests)]);
}

