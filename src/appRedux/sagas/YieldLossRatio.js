import {all, put, fork, takeLatest} from "redux-saga/effects";
import {  getIPAddress, getUserId, getUserToken } from './common';
import {FETCH_YLR_LIST_REQUEST, ADD_YLR_REQUEST, FETCH_YLR_BY_ID_REQUEST, UPDATE_YLR_REQUEST } from "../../constants/ActionTypes";
import {
    fetchYLRbyIdSuccess,
    fetchYLRbyIdError,
    fetchYLRListSuccess,
    fetchYLRListError,
    updateYLRSuccess,
    updateYLRError,
    addYLRSuccess,
    addYLRError
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchYLRList(action) {
    const request = action.payload;
    const reqBody = {
        ipAddress: "1.1.1.1",
        pageNo: request.pageNo,
        pageSize: request.pageSize,
        partyId: request.partyId,
        requestId: "YLR_MASTER_GET",
        userId: getUserId()
    }
    try {
        const fetchYLRList =  yield fetch(`${baseUrl}api/yieldlossratio/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchYLRList.status === 200) {
            const fetchYLRListResponse = yield fetchYLRList.json();
            yield put(fetchYLRListSuccess(fetchYLRListResponse));
        } else if (fetchYLRList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchYLRListError('error'));
    } catch (error) {
        yield put(fetchYLRListError(error));
    }
}

function* fetchYLRById(action) {
    debugger
    const request = action.payload;
    const reqBody = {
        ipAddress: '1.1.1.1',
        pageNo: request.pageNo,
        pageSize: request.pageSize,
        ylrId: request.ylrId,
        requestId: "YLR_MASTER_GET",
        userId: getUserId()
    }
    try {
        const fetchYlrId =  yield fetch(`${baseUrl}api/yieldlossratio/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        if(fetchYlrId.status === 200) {
            const fetchYLRidResponse = yield fetchYlrId.json();
            yield put(fetchYLRbyIdSuccess(fetchYLRidResponse));
        } else if (fetchYlrId.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchYLRbyIdError('error'));
    } catch (error) {
        yield put(fetchYLRbyIdError(error));
    }
}

function* addYLRsaga(action) {
    debugger
    try {
        const { comment,
            keys,
            partyId,
            rangeFrom,
            rangeTo,
            tags
        } = action.YLR;

        const getEmail = (mail) => {
            const mailObj = {};
            mail.forEach((key, idx) => {
                mailObj[`email${idx+1}`] = key
            });
            return mailObj;
        }

        const getPhone = (phone) => {
            const phoneObj = {};
            phone.forEach((key, idx) => {
                phoneObj[`phone${idx+1}`] = key
            });
            return phoneObj;
        }

        // const getAddress = (addressKeys) => {
        //     const addressObj = {};
        //     addressKeys.forEach((key, idx) => {
        //         addressObj[`address${idx+1}`] = {
        //             details: address[idx],
        //             city: city[idx],
        //             state: state[idx],
        //             pincode: pincode[idx]
        //         }
        //     });
        //     return addressObj;
        // }
        const getTags=()=>{
            return tags.map(tagId => ({tagId}))
        }
        
        const reqBody = {
            comment,
            partyId,
            rangeFrom,
            rangeTo,
            // processIdList:getTags(),
            processIdList:tags,
            // ...getEmail(email),
            // ...getAddress(addressKeys),
            // ...getPhone(phone),
            // endUserTags: getEndUserTags(),
            ipAddress: '1.1.1.1',
            requestId: "YLR_MASTER_ADD",
            userId: getUserId()
        }
        const addParty = yield fetch(`${baseUrl}api/yieldlossratio/save`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify([reqBody])

        });
        if (addParty.status == 200) {
            yield put(addYLRSuccess());
        } else if (addParty.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addYLRError('error'));
    } catch (error) {
        yield put(addYLRError(error));
    }
}

function* updateYLRsaga(action) {
    debugger
    try {
        const {
            values: {
                comment,
                keys,
                partyId,
                rangeFrom,
                rangeTo,
                tags
            },
            ylrId
        } = action.payload;

        const getEmail = (mail) => {
            const mailObj = {};
            mail.forEach((key, idx) => {
                mailObj[`email${idx+1}`] = key
            });
            return mailObj;
        }

        const getPhone = (phone) => {
            const phoneObj = {};
            phone.forEach((key, idx) => {
                phoneObj[`phone${idx+1}`] = key
            });
            return phoneObj;
        }

        // const getAddress = (addressKeys) => {
        //     const addressObj = {};
        //     addressKeys.forEach((key, idx) => {
        //         addressObj[`address${idx+1}`] = {
        //             details: address[idx],
        //             city: city[idx],
        //             state: state[idx],
        //             pincode: pincode[idx]
        //         }
        //     });
        //     return addressObj;
        // }
        const getTags=()=>{
            return tags.map(tagId => ({tagId}))
        }
        
        

        const reqBody = {
            ylrId: ylrId,
            comment,
            partyId,
            rangeFrom,
            rangeTo,
            tags
            // ...getEmail(email),
            // ...getAddress(addressKeys),
            // ...getPhone(phone),
        }
        const updateYLR = yield fetch(`${baseUrl}api/yieldlossratio/update`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (updateYLR.status == 200) {
            yield put(updateYLRSuccess());
        } else if (updateYLR.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateYLRError('error'));
    } catch (error) {
        console.log(error);
        yield put(updateYLRError(error));
    }
}


export function* watchFetchRequests() {
    yield takeLatest(FETCH_YLR_LIST_REQUEST, fetchYLRList);
    yield takeLatest(ADD_YLR_REQUEST, addYLRsaga);
    yield takeLatest(UPDATE_YLR_REQUEST, updateYLRsaga);
    yield takeLatest(FETCH_YLR_BY_ID_REQUEST, fetchYLRById);
}

export default function* YLRSagas() {
    yield all([fork(watchFetchRequests)]);
}
