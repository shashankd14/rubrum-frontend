import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken, getUserId } from './common';
import { FETCH_VENDOR_LIST_REQUEST, ADD_VENDOR_REQUEST, UPDATE_VENDOR_REQUEST, FETCH_VENDOR_LIST_ID_REQUEST, DELETE_VENDOR_REQUEST } from "../../constants/ActionTypes";
import {fetchVendorListSuccess,
    fetchVendorListError,
    addVendorSuccess,
    addVendorError,
    fetchVendorListIdSuccess,
    fetchVendorListIdError,
    updateVendorSuccess,
    updateVendorError,
    deleteVendorSuccess,
    deleteVendorError
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchVendorList({action}) {
    const reqBody = {
        pageNo: action.pageNo,
        pageSize: action.pageSize,
        ipAddress: action.ipAddress,
        requestId: action.requestId,
        searchText: action.searchText,
        userId: getUserId
    }
    try {
        const fetchVendorList =  yield fetch(`${baseUrl}api/trading/vendor/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body: JSON.stringify(reqBody)
        });
        if(fetchVendorList.status === 200) {
            const fetchVendorListResponse = yield fetchVendorList.json();
            yield put(fetchVendorListSuccess(fetchVendorListResponse));
        } else if (fetchVendorList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchVendorListError('error'));
    } catch (error) {
        yield put(fetchVendorListError(error));
    }
}

function* fetchVendorListById(action) {
    const reqBody = {
        id: action.id,
        pageNo: action.pageNo,
        pageSize: action.pageSize,
        ipAddress: action.ipAddress,
        requestId: action.requestId,
        userId: getUserId
    }
    try {
        const fetchVendorListId =  yield fetch(`${baseUrl}api/trading/vendor/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body: JSON.stringify(reqBody)
        });
        if(fetchVendorListId.status === 200) {
            const fetchVendorListResponse = yield fetchVendorListId.json();
            yield put(fetchVendorListIdSuccess(fetchVendorListResponse));
        } else if (fetchVendorListId.status === 401) {
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
function* deleteVendorSaga(action) {
    let body = action.payload;
    const reqBody = {
        ids: [body.id],
        requestId: "VENDOR_DELETE",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const deleteVendor = yield fetch(`${baseUrl}api/trading/vendor/delete`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (deleteVendor.status == 200) {
            yield put(deleteVendorSuccess());
        } else if (deleteVendor.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteVendorError('error'));
    } catch (error) {
        console.log(error);
        yield put(deleteVendorError(error));
    }
}


export function* watchFetchRequests() {
    yield takeLatest(FETCH_VENDOR_LIST_REQUEST, fetchVendorList);
    yield takeLatest(ADD_VENDOR_REQUEST, addVendor);
    yield takeLatest(UPDATE_VENDOR_REQUEST, updateVendor);
    yield takeLatest(FETCH_VENDOR_LIST_ID_REQUEST, fetchVendorListById);
    yield takeLatest(DELETE_VENDOR_REQUEST, deleteVendorSaga);
}

export default function* vendorSagas() {
    yield all([fork(watchFetchRequests)]);
}

