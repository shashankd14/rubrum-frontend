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
    const reqBody = {
        pageNo: action.pageNo,
        pageSize: action.pageSize,
        ipAddress: action.ipAddress,
        requestId: action.requestId,
        searchText: action.searchText,
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
    const reqBody = {
        id: action.CustomerId?.id,
        pageNo: action.CustomerId?.pageNo,
        pageSize: action.CustomerId?.pageSize,
        ipAddress: action.CustomerId?.ipAddress,
        requestId: action.CustomerId?.requestId,
        userId: localStorage.getItem('userId')
    }
    try {
        const fetchCustomerListId =  yield fetch(`${baseUrl}api/trading/customer/list`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body: JSON.stringify(reqBody)
        });
        if(fetchCustomerListId.status === 200) {
            const fetchPartyListResponse = yield fetchCustomerListId.json();
            yield put(fetchCustomerListIdSuccess(fetchPartyListResponse));
        } else if (fetchCustomerListId.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchCustomerListIdError('error'));
    } catch (error) {
        yield put(fetchCustomerListIdError(error));
    }
}

function* addCustomer(action) {
    try {
        const { customerName,
            customerNickName,
            contactName,
            contactNo,
            gstNumber,
            panNumber,
            tanNumber,
            emailId,
            address,
            city,
            state,
            pincode,
            phoneNo,
            purchaseReport
        } = action.Customer;

        const reqBody = {
            customerName,
            customerNickName,
            contactName,
            contactNo,
            gstNumber,
            panNumber,
            tanNumber,
            phoneNo,
            emailId,
            address1:address[0],
            city: city[0],
            state: state[0],
            pincode: pincode[0],
            alternateAddress1:address[1],
            alternateCity: city[1],
            alternateState: state[1],
            alternatePincode: pincode[1],
            includeRatesinDc: '',
            purchaseReport,
            ipAddress: "1.1.1.1",
            requestId: "CUSTOMER_INSERT",
            userId: getUserId()
        }
        const addCustomer = yield fetch(`${baseUrl}api/trading/customer/save`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (addCustomer.status == 200) {
            yield put(addCustomerSuccess());
        } else if (addCustomer.status === 401) {
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
                customerName,
            customerNickName,
            contactName,
            contactNo,
            gstNumber,
            panNumber,
            tanNumber,
            emailId,
            address,
            city,
            state,
            pincode,
            phoneNo,
            purchaseReport
            },
            id
        } = action.Customer;

        const reqBody = {
            customerId: id,
            customerName,
            customerNickName,
            contactName,
            contactNo,
            gstNumber,
            panNumber,
            tanNumber,
            phoneNo,
            emailId,
            address1:address[0],
            city: city[0],
            state: state[0],
            pincode: pincode[0],
            alternateAddress1:address[1],
            alternateCity: city[1],
            alternateState: state[1],
            alternatePincode: pincode[1],
            includeRatesinDc: '',
            purchaseReport,
            ipAddress: "1.1.1.1",
            requestId: "CUSTOMER_INSERT",
            userId: getUserId()
        }
        const updateCustomer = yield fetch(`${baseUrl}api/trading/customer/update`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)

        });
        if (updateCustomer.status == 200) {
            yield put(updateCustomerSuccess());
        } else if (updateCustomer.status === 401) {
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

