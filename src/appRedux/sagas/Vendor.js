import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken } from './common';
import { FETCH_VENDOR_LIST_REQUEST, ADD_VENDOR_REQUEST, UPDATE_VENDOR_REQUEST, FETCH_VENDOR_LIST_ID_REQUEST } from "../../constants/ActionTypes";
import {fetchVendorListSuccess,
    fetchVendorListError,
    addVendorSuccess,
    addVendorError,
    fetchVendorListIdSuccess,
    fetchVendorListIdError,
    updateVendorSuccess,
    updateVendorError
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchVendorList() {
    try {
        const fetchPartyList =  yield fetch(`${baseUrl}api/party/list`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchPartyList.status === 200) {
            const fetchPartyListResponse = yield fetchPartyList.json();
            yield put(fetchVendorListSuccess(fetchPartyListResponse));
        } else if (fetchPartyList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchVendorListError('error'));
    } catch (error) {
        yield put(fetchVendorListError(error));
    }
}

function* fetchVendorListById(action) {
    try {
        const fetchPartyListId =  yield fetch(`${baseUrl}api/party/getById/${action.partyId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchPartyListId.status === 200) {
            const fetchPartyListResponse = yield fetchPartyListId.json();
            yield put(fetchVendorListIdSuccess(fetchPartyListResponse));
        } else if (fetchPartyListId.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchVendorListIdError('error'));
    } catch (error) {
        yield put(fetchVendorListIdError(error));
    }
}

function* addVendor(action) {
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
            yield put(addVendorSuccess());
        } else if (addParty.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addVendorError('error'));
    } catch (error) {
        yield put(addVendorError(error));
    }
}

function* updateVendor(action) {
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
            yield put(updateVendorSuccess());
        } else if (updateParty.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateVendorError('error'));
    } catch (error) {
        console.log(error);
        yield put(updateVendorError(error));
    }
}


export function* watchFetchRequests() {
    yield takeLatest(FETCH_VENDOR_LIST_REQUEST, fetchVendorList);
    yield takeLatest(ADD_VENDOR_REQUEST, addVendor);
    yield takeLatest(UPDATE_VENDOR_REQUEST, updateVendor);
    yield takeLatest(FETCH_VENDOR_LIST_ID_REQUEST, fetchVendorListById);
}

export default function* vendorSagas() {
    yield all([fork(watchFetchRequests)]);
}

