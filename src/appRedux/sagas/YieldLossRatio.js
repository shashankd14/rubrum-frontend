import {all, put, fork, takeLatest} from "redux-saga/effects";
import {  getIPAddress, getUserId, getUserToken } from './common';
import {FETCH_YLR_LIST_REQUEST, ADD_YLR_REQUEST, FETCH_YLR_BY_ID_REQUEST, UPDATE_YLR_REQUEST, DELETE_YLR_REQUEST } from "../../constants/ActionTypes";
import {
    fetchYLRbyIdSuccess,
    fetchYLRbyIdError,
    fetchYLRListSuccess,
    fetchYLRListError,
    updateYLRSuccess,
    updateYLRError,
    addYLRSuccess,
    addYLRError,
    deleteYLRSuccess,
    deleteYLRError
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
    try {
        const { comments,
            keys,
            partyIdList,
            lossRatioPercentageFrom,
            lossRatioPercentageTo,
            tags
        } = action.YLR;

        const getratioList = (
          comments,
          lossRatioPercentageFrom,
          lossRatioPercentageTo
        ) => {
          const ratioList = [];

          // Loop through the comments array (assuming all arrays are of the same length)
          for (let i = 0; i < comments.length; i++) {
            // Create a ratioList object with corresponding values from each array
            const ratioItem = {
              lossRatioPercentageFrom: lossRatioPercentageFrom[i],
              lossRatioPercentageTo: lossRatioPercentageTo[i],
              comments: comments[i],
            };

            // Push the ratioList object to the ratioList array
            ratioList.push(ratioItem);
          }

          // Convert the ratioList array to JSON string and return
          return  ratioList ;
        };
        const reqBody = {
            partyIdList,
            ratioList:getratioList(comments,lossRatioPercentageFrom,lossRatioPercentageTo),
            processIdList:[tags],
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
    try {
        const {
            values: {
                partyIdList,
                lossRatioPercentageFrom,
                lossRatioPercentageTo,
                comments,
                tags
                },
                ylrId
            } = action.payload;

            const getratioList = (
                comments,
                lossRatioPercentageFrom,
                lossRatioPercentageTo
              ) => {
                const ratioList = [];
      
                // Loop through the comments array (assuming all arrays are of the same length)
                for (let i = 0; i < comments.length; i++) {
                  // Create a ratioList object with corresponding values from each array
                  const ratioItem = {
                    lossRatioPercentageFrom: lossRatioPercentageFrom[i],
                    lossRatioPercentageTo: lossRatioPercentageTo[i],
                    comments: comments[i],
                  };
      
                  // Push the ratioList object to the ratioList array
                  ratioList.push(ratioItem);
                }
      
                // Convert the ratioList array to JSON string and return
                return  ratioList ;
              };
              
        const reqBody = {
            ylrId: ylrId,
            partyIdList: [partyIdList],
            ratioList:getratioList(comments,lossRatioPercentageFrom,lossRatioPercentageTo),
            processIdList:[tags],
            ipAddress: '1.1.1.1',
            requestId: "YLR_MASTER_UPDATE",
            userId: getUserId()
        }
        const updateYLR = yield fetch(`${baseUrl}api/yieldlossratio/update`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify([reqBody])

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

function* deleteYLRById(action) {
    const request = action.payload;
    const reqBody ={
        ids: [request.ids],
        ipAddress: '1.1.1.1',
        requestId: "YLR_MASTER_DELETE",
        userId: getUserId()
    }
    try {
        const deletedYLR =  yield fetch(`${baseUrl}api/yieldlossratio/delete`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders() },
            body:JSON.stringify(reqBody)
        });
        window.location.reload();
        if(deletedYLR.status === 200) {
            yield put(deleteYLRSuccess(deletedYLR));
        } else if (deletedYLR.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteYLRError('error'));
    } catch (error) {
        yield put(deleteYLRError(error));
    }
}


export function* watchFetchRequests() {
    yield takeLatest(FETCH_YLR_LIST_REQUEST, fetchYLRList);
    yield takeLatest(ADD_YLR_REQUEST, addYLRsaga);
    yield takeLatest(UPDATE_YLR_REQUEST, updateYLRsaga);
    yield takeLatest(FETCH_YLR_BY_ID_REQUEST, fetchYLRById);
    yield takeLatest(DELETE_YLR_REQUEST, deleteYLRById);
}

export default function* YLRSagas() {
    yield all([fork(watchFetchRequests)]);
}
