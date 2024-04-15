import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken, getUserId } from './common';
import { FETCH_CUSTOMER_LIST_REQUEST, ADD_CUSTOMER_REQUEST, UPDATE_CUSTOMER_REQUEST, FETCH_CUSTOMER_LIST_ID_REQUEST, DELETE_CUSTOMER_REQUEST } from "../../constants/ActionTypes";
import {fetchCustomerListSuccess,
    fetchCustomerListError,
    addCustomerSuccess,
    addCustomerError,
    fetchCustomerListIdSuccess,
    fetchCustomerListIdError,
    updateCustomerSuccess,
    updateCustomerError,
    deleteCustomerSuccess,
    deleteCustomerError
} from "../actions";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

function* fetchCustomerList({action}) {
    debugger
    const reqBody = {
        pageNo: action.pageNo,
        pageSize: action.pageSize,
        ipAddress: action.ipAddress,
        requestId: action.requestId,
        userId: localStorage.getItem('userId')
    }
    try {
        const fetchCustomerList =  yield fetch(`${baseUrl}api/trading/customer/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body: JSON.stringify(reqBody)
        });
        if(fetchCustomerList.status === 200) {
            const fetchCustomerListResponse = yield fetchCustomerList.json();
            yield put(fetchCustomerListSuccess(fetchCustomerListResponse));
        } else if (fetchCustomerList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchCustomerListError('error'));
    } catch (error) {
        yield put(fetchCustomerListError(error));
    }
}

function* fetchCustomerListById(action) {
    try {
        const fetchPartyListId =  yield fetch(`${baseUrl}api/party/getById/${action.partyId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchPartyListId.status === 200) {
            const fetchPartyListResponse = yield fetchPartyListId.json();
            yield put(fetchCustomerListIdSuccess(fetchPartyListResponse));
        } else if (fetchPartyListId.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchCustomerListIdError('error'));
    } catch (error) {
        yield put(fetchCustomerListIdError(error));
    }
}

function* addCustomer(action) {
    debugger
    try {
        const { customerName,
            customerNickname,
            contactName,
            contactNo,
            gstNumber,
            panNumber,
            tanNumber,
            email,
            addressKeys,
            address,
            city,
            state,
            pincode,
            phoneNo,
            showAmtDcPdfFlg,
            purchaseReportsList
        } = action.Customer;

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
        // const getTags=()=>{
        //     return tags.map(tagId => ({tagId}))
        // }
        // const getEndUserTags=()=>{
        //     return endUsertags.map(tagId => ({tagId}))
        // }
        // const qualityTemplateIds =()=>{
        //     return qualityTemplates.map(templateId => ({templateId
        //     }))
        // }
        const reqBody = {
            customerName,
            customerNickname,
            contactName,
            contactNo,
            gstNumber,
            panNumber,
            tanNumber,
            ...getEmail(email),
            ...getAddress(addressKeys),
            ...getPhone(phoneNo),
            showAmtDcPdfFlg,
            purchaseReportsList,
            ipAddress: "1.1.1.1",
            requestId: "CUSTOMER_INSERT",
            userId: getUserId()
        }
        const addParty = yield fetch(`${baseUrl}api/trading/customer/save`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (addParty.status == 200) {
            yield put(addCustomerSuccess());
        } else if (addParty.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(addCustomerError('error'));
    } catch (error) {
        yield put(addCustomerError(error));
    }
}

function* updateCustomer(action) {
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
        const updateParty = yield fetch(`${baseUrl}api/trading/customer/update`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (updateParty.status == 200) {
            yield put(updateCustomerSuccess());
        } else if (updateParty.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateCustomerError('error'));
    } catch (error) {
        console.log(error);
        yield put(updateCustomerError(error));
    }
}

function* deleteCustomerSaga(action) {
    let body = action.payload;
    const reqBody = {
        ids: [body.id],
        requestId: "CUSTOMER_DELETE",
        ipAddress: "1.1.1.1",
        userId: getUserId()
    }
    try {
        const deleteCustomer = yield fetch(`${baseUrl}api/trading/customer/delete`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (deleteCustomer.status == 200) {
            yield put(deleteCustomerSuccess());
        } else if (deleteCustomer.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteCustomerError('error'));
    } catch (error) {
        console.log(error);
        yield put(deleteCustomerError(error));
    }
}

export function* watchFetchRequests() {
    yield takeLatest(FETCH_CUSTOMER_LIST_REQUEST, fetchCustomerList);
    yield takeLatest(ADD_CUSTOMER_REQUEST, addCustomer);
    yield takeLatest(UPDATE_CUSTOMER_REQUEST, updateCustomer);
    yield takeLatest(FETCH_CUSTOMER_LIST_ID_REQUEST, fetchCustomerListById);
    yield takeLatest(DELETE_CUSTOMER_REQUEST, deleteCustomerSaga);
}

export default function* customerSagas() {
    yield all([fork(watchFetchRequests)]);
}

