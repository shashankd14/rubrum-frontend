import {all, put, fork, takeLatest} from "redux-saga/effects";
import { FETCH_PARTY_LIST_REQUEST, ADD_PARTY_REQUEST, FETCH_PARTY_LIST_ID_REQUEST, UPDATE_PARTY_REQUEST } from "../../constants/ActionTypes";
import {fetchPartyListSuccess, 
    fetchPartyListError, 
    addPartySuccess, 
    addPartyError, 
    fetchPartyListIdSuccess, 
    fetchPartyListIdError,
    updatePartySuccess,
    updatePartyError
} from "../actions";

const baseUrl = process.env.REACT_APP_BASE_URL;

function* fetchPartyList() {
    try {
        const fetchPartyList =  yield fetch(`${baseUrl}api/party/list`, {
            method: 'GET',
        });
        if(fetchPartyList.status === 200) {
            const fetchPartyListResponse = yield fetchPartyList.json();
            yield put(fetchPartyListSuccess(fetchPartyListResponse));
        } else
            yield put(fetchPartyListError('error'));
    } catch (error) {
        yield put(fetchPartyListError(error));
    }
}

function* fetchPartyListById(action) {
    try {
        const fetchPartyListId =  yield fetch(`${baseUrl}api/party/getById/${action.partyId}`, {
            method: 'GET',
        });
        if(fetchPartyListId.status === 200) {
            const fetchPartyListResponse = yield fetchPartyListId.json();
            yield put(fetchPartyListIdSuccess(fetchPartyListResponse));
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
            phone
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

        const reqBody = {
            partyName,
            partyNickname,
            contactName,
            contactNumber,
            gstNumber,
            panNumber,
            tanNumber,
            ...getEmail(email),
            ...getAddress(addressKeys),
            ...getPhone(phone)
        }
        const addParty = yield fetch(`${baseUrl}api/party/save`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(reqBody)
            
        });
        if (addParty.status == 200) {
            yield put(addPartySuccess());
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
                phone
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

        const reqBody = {
            partyId: id,
            partyName,
            partyNickname,
            contactName,
            contactNumber,
            gstNumber,
            panNumber,
            tanNumber,
            ...getEmail(email),
            ...getAddress(addressKeys),
            ...getPhone(phone)
        }
        const updateParty = yield fetch(`${baseUrl}api/party/update`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(reqBody)
            
        });
        if (updateParty.status == 200) {
            yield put(updatePartySuccess());
        } else
            yield put(updatePartyError('error'));
    } catch (error) {
        yield put(updatePartyError(error));
    }
}


export function* watchFetchRequests() {
    yield takeLatest(FETCH_PARTY_LIST_REQUEST, fetchPartyList);
    yield takeLatest(ADD_PARTY_REQUEST, addParty);
    yield takeLatest(UPDATE_PARTY_REQUEST, updateParty);
    yield takeLatest(FETCH_PARTY_LIST_ID_REQUEST, fetchPartyListById);
}

export default function* partySagas() {
    yield all([fork(watchFetchRequests)]);
}

