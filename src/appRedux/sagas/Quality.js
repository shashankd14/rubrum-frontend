import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken } from './common';
import {SAVE_TEMPLATE_REQUEST, FETCH_TEMPLATE_LIST} from "../../constants/ActionTypes";
import {saveTemplateError, saveTemplateSuccess, fetchTemplatesListSuccess, fetchTemplatesListError} from "../actions/Quality";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";
import { forEach } from "lodash";

const baseUrl = process.env.REACT_APP_BASE_URL;
const getHeaders = () => ({
    Authorization: getUserToken()
});

const getStageDetails = formFields => {
    const result = [];
    forEach(formFields, (value, key) => {
        const stage = {
            stageName: key,
            remarks: '',
            fieldDetails: value
        }
        result.push(stage);
    });
    return result;
}

function* saveTemplate(action) {
    try {
        const { formFields, templateId } = action.payload;
        const body = {
            templateName: templateId,
            stageDetails: getStageDetails(formFields)
        };
        const addPacking = yield fetch(`${baseUrl}api/quality/template/save`, {
                method: 'POST',
                headers: { "Content-Type": "application/json", ...getHeaders() },
                body: JSON.stringify(body)

        });
        if (addPacking.status == 200) {
            yield put(saveTemplateSuccess());
        } else if (addPacking.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(saveTemplateError('error'));
    } catch (error) {
        yield put(saveTemplateError(error));
    }
}

function* fetchTemplateList(action) {
    try {
        const fetchTemplateList =  yield fetch(`${baseUrl}api/quality/template`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchTemplateList.status === 200) {
            const fetchTemplateListResponse = yield fetchTemplateList.json();
            yield put(fetchTemplatesListSuccess(fetchTemplateListResponse));
        } else if (fetchTemplateList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchTemplatesListError('error'));
    } catch (error) {
        yield put(fetchTemplatesListError(error));
    }
}

export function* watchFetchRequests() {
    yield takeLatest(SAVE_TEMPLATE_REQUEST, saveTemplate);
    yield takeLatest(FETCH_TEMPLATE_LIST, fetchTemplateList);
}

export default function* qualitySagas() {
    yield all([fork(watchFetchRequests)]);
}
