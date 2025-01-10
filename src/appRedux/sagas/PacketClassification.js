import { all, put, fork, takeLatest } from 'redux-saga/effects';
import { getUserToken } from './common';
import {
  FETCH_CLASSIFICATION_LIST_REQUEST,
  ADD_PROCESSTAGS_REQUEST,
  ADD_ENDUSERTAGS_REQUEST,
  FETCH_TAGS_LIST_BY_ID_REQUEST,
  FETCH_ENDUSERTAGS_LIST_REQUEST,
  DELETE_TAGS_BY_ID_REQUEST,
  UPDATE_TAGS_REQUEST,
} from '../../constants/ActionTypes';
import {
  fetchClassificationListSuccess,
  fetchClassificationListError,
  addEndUserTagsError,
  addEndUserTagsSuccess,
  addProccessTagsError,
  addProccessTagsSuccess,
  fetchTagsListIdError,
  fetchTagsListIdSuccess,
  fetchEndUserTagsSuccess,
  fetchEndUserTagsError,
  deleteTagsListIdError,
  deleteTagsListIdSuccess,
  updateTagsSuccess,
  updateTagsError,
} from '../actions';
import { userSignOutSuccess } from '../../appRedux/actions/Auth';

const baseUrl = process.env.REACT_APP_BASE_URL;

const getHeaders = () => ({
  Authorization: getUserToken(),
});

function* fetchClassificationList() {
  try {
    const fetchClassificationList = yield fetch(
      `${baseUrl}api/packetClassification/list`,
      {
        method: 'GET',
        headers: getHeaders(),
      },
    );
    if (fetchClassificationList.status === 200) {
      const fetchClassificationListResponse =
        yield fetchClassificationList.json();
      yield put(
        fetchClassificationListSuccess(fetchClassificationListResponse),
      );
    } else if (fetchClassificationList.status === 401) {
      yield put(userSignOutSuccess());
    } else yield put(fetchClassificationListError('error'));
  } catch (error) {
    yield put(fetchClassificationListError(error));
  }
}

function* addProccessTags(action) {
  try {
    const addProccessTags = yield fetch(
      `${baseUrl}api/packetClassification/save`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getHeaders() },
        body: JSON.stringify(action.classificationName),
      },
    );
    if (addProccessTags.status == 200) {
      yield put(addProccessTagsSuccess());
    } else if (addProccessTags.status === 401) {
      yield put(userSignOutSuccess());
    } else yield put(addProccessTagsError('error'));
  } catch (error) {
    yield put(addProccessTagsError(error));
  }
}
function* addEndUserTags(action) {
  try {
    const addEndUserTags = yield fetch(`${baseUrl}api/endusertags/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getHeaders() },
      body: JSON.stringify(action.classificationName),
    });
    if (addEndUserTags.status == 200) {
      yield put(addEndUserTagsSuccess());
    } else if (addEndUserTags.status === 401) {
      yield put(userSignOutSuccess());
    } else yield put(addEndUserTagsError('error'));
  } catch (error) {
    yield put(addEndUserTagsError(error));
  }
}
function* fetchTagsListById(action) {
  try {
    const fetchTagsListId = yield fetch(
      `${baseUrl}api/${action?.payload?.type}/getById/${action?.payload?.tagId}`,
      {
        method: 'GET',
        headers: getHeaders(),
      },
    );
    if (fetchTagsListId.status === 200) {
      const fetchTagsListResponse = yield fetchTagsListId.json();
      yield put(fetchTagsListIdSuccess(fetchTagsListResponse));
    } else if (fetchTagsListId.status === 401) {
      yield put(userSignOutSuccess());
    } else yield put(fetchTagsListIdError('error'));
  } catch (error) {
    yield put(fetchTagsListIdError(error));
  }
}
function* fetchEndUserTagsList() {
  try {
    const fetchEndUserTags = yield fetch(`${baseUrl}api/endusertags/list`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (fetchEndUserTags.status === 200) {
      const fetchEndUserTagsResponse = yield fetchEndUserTags.json();
      yield put(fetchEndUserTagsSuccess(fetchEndUserTagsResponse));
    } else if (fetchEndUserTags.status === 401) {
      yield put(userSignOutSuccess());
    } else yield put(fetchEndUserTagsError('error'));
  } catch (error) {
    yield put(fetchEndUserTagsError(error));
  }
}
function* deleteTagById(action) {
  try {
    const deletedTag = yield fetch(
      `${baseUrl}api/${action?.payload?.type}/delete/${action?.payload?.tagId}`,
      {
        method: 'DELETE',
        headers: getHeaders(),
      },
    );
    if (deletedTag.status === 200) {
      // const deleteTagsListResponse = yield deletedTag.json();
      yield put(deleteTagsListIdSuccess(deletedTag));
    } else if (deletedTag.status === 401) {
      yield put(userSignOutSuccess());
    } else yield put(deleteTagsListIdError('error'));
  } catch (error) {
    yield put(deleteTagsListIdError(error));
  }
}
function* updateTags(action) {
  try {
    const updateTags = yield fetch(
      `${baseUrl}api/${action?.payload?.type}/update`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getHeaders() },
        body: JSON.stringify(action.payload?.tagsBody),
      },
    );
    if (updateTags.status == 200) {
      yield put(updateTagsSuccess());
    } else if (updateTags.status === 401) {
      yield put(userSignOutSuccess());
    } else yield put(updateTagsError('error'));
  } catch (error) {
    yield put(updateTagsError(error));
  }
}
export function* watchFetchRequests() {
  yield takeLatest(FETCH_CLASSIFICATION_LIST_REQUEST, fetchClassificationList);
  yield takeLatest(ADD_PROCESSTAGS_REQUEST, addProccessTags);
  yield takeLatest(ADD_ENDUSERTAGS_REQUEST, addEndUserTags);
  yield takeLatest(FETCH_TAGS_LIST_BY_ID_REQUEST, fetchTagsListById);
  yield takeLatest(FETCH_ENDUSERTAGS_LIST_REQUEST, fetchEndUserTagsList);
  yield takeLatest(DELETE_TAGS_BY_ID_REQUEST, deleteTagById);
  yield takeLatest(UPDATE_TAGS_REQUEST, updateTags);
}

export default function* packetClassification() {
  yield all([fork(watchFetchRequests)]);
}
