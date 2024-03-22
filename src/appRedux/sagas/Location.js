import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken } from './common';
import { FETCH_LOCATION_LIST_REQUEST, ADD_LOCATION_REQUEST, UPDATE_LOCATION_REQUEST, FETCH_LOCATION_LIST_ID_REQUEST } from "../../constants/ActionTypes";
import {fetchLocationListSuccess,
    fetchLocationListError,
    addLocationSuccess,
    addLocationError,
    fetchLocationListIdSuccess,
    fetchLocationListIdError,
    updateLocationSuccess,
    updateLocationError
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchLocationList() {
    try {
        const fetchPartyList =  yield fetch(`${baseUrl}api/party/list`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchPartyList.status === 200) {
            const fetchPartyListResponse = yield fetchPartyList.json();
            yield put(fetchLocationListSuccess(fetchPartyListResponse));
        } else if (fetchPartyList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchLocationListError('error'));
    } catch (error) {
        yield put(fetchLocationListError(error));
    }
}

function* fetchLocationListById(action) {
    try {
        const fetchPartyListId =  yield fetch(`${baseUrl}api/party/getById/${action.partyId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchPartyListId.status === 200) {
            const fetchPartyListResponse = yield fetchPartyListId.json();
            yield put(fetchLocationListIdSuccess(fetchPartyListResponse));
        } else if (fetchPartyListId.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchLocationListIdError('error'));
    } catch (error) {
        yield put(fetchLocationListIdError(error));
    }
}

function* addLocation(action) {
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
            yield put(addLocationSuccess());
        } else if (addParty.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addLocationError('error'));
    } catch (error) {
        yield put(addLocationError(error));
    }
}

function* updateLocation(action) {
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
            yield put(updateLocationSuccess());
        } else if (updateParty.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateLocationError('error'));
    } catch (error) {
        console.log(error);
        yield put(updateLocationError(error));
    }
}


export function* watchFetchRequests() {
    yield takeLatest(FETCH_LOCATION_LIST_REQUEST, fetchLocationList);
    yield takeLatest(ADD_LOCATION_REQUEST, addLocation);
    yield takeLatest(UPDATE_LOCATION_REQUEST, updateLocation);
    yield takeLatest(FETCH_LOCATION_LIST_ID_REQUEST, fetchLocationListById);
}

export default function* locationSagas() {
    yield all([fork(watchFetchRequests)]);
}

