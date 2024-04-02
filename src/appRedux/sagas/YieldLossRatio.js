import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken } from './common';
import { FETCH_PARTY_LIST_REQUEST, ADD_PARTY_REQUEST, FETCH_PARTY_LIST_ID_REQUEST, UPDATE_PARTY_REQUEST, FETCH_YLR_LIST_REQUEST } from "../../constants/ActionTypes";
import {fetchPartyListSuccess,
    fetchPartyListError,
    addPartySuccess,
    addPartyError,
    fetchPartyListIdSuccess,
    fetchPartyListIdError,
    updatePartySuccess,
    updatePartyError,
    fetchYLRListSuccess,
    fetchYLRListError
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchYLRList(request) {
    debugger
    console.log("saga", request);
    console.log("saga.pageno", request.pageNo);
    const reqBody = {
        ipAddress: request.ipAddress,
        pageNo: request.pageNo,
        pageSize: request.pageSize,
        partyId: request.partyId,
        requestId: request.requestId,
        userId: localStorage.getItem('userId')
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

function* fetchPartyListById(action) {
    try {
        const fetchPartyListId =  yield fetch(`${baseUrl}api/party/getById/${action.partyId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchPartyListId.status === 200) {
            const fetchPartyListResponse = yield fetchPartyListId.json();
            yield put(fetchPartyListIdSuccess(fetchPartyListResponse));
        } else if (fetchPartyListId.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchPartyListIdError('error'));
    } catch (error) {
        yield put(fetchPartyListIdError(error));
    }
}

function* addParty(action) {
    try {
        const { partyName,
            partyNickname,
            contactName,
            contactNumber,
            gstNumber,
            panNumber,
            tanNumber,
            email,
            addressKeys,
            address,
            city,
            state,
            pincode,
            phone,tags,endUsertags,
            qualityTemplates,
            showAmtDcPdfFlg,
            dailyReportsList,
            monthlyReportsList
        } = action.party;

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

        const getAddress = (addressKeys) => {
            const addressObj = {};
            addressKeys.forEach((key, idx) => {
                addressObj[`address${idx+1}`] = {
                    details: address[idx],
                    city: city[idx],
                    state: state[idx],
                    pincode: pincode[idx]
                }
            });
            return addressObj;
        }
        const getTags=()=>{
            return tags.map(tagId => ({tagId}))
        }
        const getEndUserTags=()=>{
            return endUsertags.map(tagId => ({tagId}))
        }
        const qualityTemplateIds =()=>{
            return qualityTemplates.map(templateId => ({templateId
            }))
        }
        const reqBody = {
            partyName,
            partyNickname,
            contactName,
            contactNumber,
            gstNumber,
            panNumber,
            tanNumber,
            tags:getTags(),
            ...getEmail(email),
            ...getAddress(addressKeys),
            ...getPhone(phone),
            endUserTags: getEndUserTags(),
            templateIdList: qualityTemplateIds(),
            showAmtDcPdfFlg,
            dailyReportsList,
            monthlyReportsList
        }
        const addParty = yield fetch(`${baseUrl}api/party/save`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (addParty.status == 200) {
            yield put(addPartySuccess());
        } else if (addParty.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addPartyError('error'));
    } catch (error) {
        yield put(addPartyError(error));
    }
}

function* updateParty(action) {
    try {
        const {
            values: {
                partyName,
                partyNickname,
                contactName,
                contactNumber,
                gstNumber,
                panNumber,
                tanNumber,
                email,
                addressKeys,
                address,
                city,
                state,
                pincode,
                phone,
                tags,
                endUsertags,
                qualityTemplates,
                showAmtDcPdfFlg,
                dailyReportsList,
                monthlyReportsList
            },
            id
        } = action.party;

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

        const getAddress = (addressKeys) => {
            const addressObj = {};
            addressKeys.forEach((key, idx) => {
                addressObj[`address${idx+1}`] = {
                    details: address[idx],
                    city: city[idx],
                    state: state[idx],
                    pincode: pincode[idx]
                }
            });
            return addressObj;
        }
        const getTags=()=>{
            return tags.map(tagId => ({tagId}))
        }
        const getEndUserTags=()=>{
            return endUsertags.map(tagId => ({tagId}))
        }
        const qualityTemplateIds =()=>{
            return qualityTemplates.map(templateId => ({templateId
            }))
        }

        const reqBody = {
            nPartyId: id,
            partyName,
            partyNickname,
            contactName,
            contactNumber,
            gstNumber,
            panNumber,
            tanNumber,
            tags:getTags(),
            endUserTags:getEndUserTags(),
            ...getEmail(email),
            ...getAddress(addressKeys),
            ...getPhone(phone),
            templateIdList: qualityTemplateIds(),
            showAmtDcPdfFlg,
            dailyReportsList,
            monthlyReportsList
        }
        const updateParty = yield fetch(`${baseUrl}api/party/update`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (updateParty.status == 200) {
            yield put(updatePartySuccess());
        } else if (updateParty.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updatePartyError('error'));
    } catch (error) {
        console.log(error);
        yield put(updatePartyError(error));
    }
}


export function* watchFetchRequests() {
    yield takeLatest(FETCH_YLR_LIST_REQUEST, fetchYLRList);
    yield takeLatest(ADD_PARTY_REQUEST, addParty);
    yield takeLatest(UPDATE_PARTY_REQUEST, updateParty);
    yield takeLatest(FETCH_PARTY_LIST_ID_REQUEST, fetchPartyListById);
}

export default function* YLRSagas() {
    yield all([fork(watchFetchRequests)]);
}
