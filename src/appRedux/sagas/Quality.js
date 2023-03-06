import {all, put, fork, takeLatest} from "redux-saga/effects";
import { getUserToken } from './common';
import {
    SAVE_TEMPLATE_REQUEST, 
    FETCH_TEMPLATE_LIST, 
    SAVE_QUALITY_TEMPLATE_REQUEST, 
    GET_QUALITY_TEMPLATE_BY_ID_REQUEST, 
    UPDATE_QUALITY_TEMPLATE_REQUEST, 
    DELETE_QUALITY_TEMPLATE_REQUEST,
    FETCH_TEMPLATE_LINK_LIST,
    SAVE_QUALITY_TEMPLATE_LINK_REQUEST,
    GET_QUALITY_TEMPLATE_LINK_BY_ID_REQUEST,
    UPDATE_QUALITY_TEMPLATE_LINK_REQUEST
} from "../../constants/ActionTypes";
import {
    saveTemplateError, 
    saveTemplateSuccess, 
    saveQualityTemplateError, 
    saveQualityTemplateSuccess, 
    fetchTemplatesListSuccess, 
    fetchTemplatesListError,
    getQualityTemplateByIdSuccess,
    getQualityTemplateByIdError,
    updateQualityTemplateSuccess,
    updateQualityTemplateError,
    deleteQualityTemplateSuccess,
    deleteQualityTemplateError,
    fetchTemplatesLinkListSuccess, 
    fetchTemplatesLinkListError,
    saveQualityTemplateLinkSuccess,
    saveQualityTemplateLinkError,
    getQualityTemplateLinkByIdSuccess,
    getQualityTemplateLinkByIdError,
    updateQualityTemplateLinkSuccess,
    updateQualityTemplateLinkError,
    deleteQualityTemplateLinkSuccess,
    deleteQualityTemplateLinkError,
} from "../actions/Quality";
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

function* saveQualityTemplate(data) {
    try {
        // let data = new FormData();
        console.log(data.payload)
        for (var key of data.payload.entries()) {
            console.log(key[0] + ', ' + key[1]);
        }
        const qualityTemplate = yield fetch(`${baseUrl}api/quality/template/save`, {
            method: 'POST',
            body: data.payload,
            // headers: {'Content-Type': 'multipart/form-data', ...getHeaders()}
            headers: getHeaders()
        });
        if (qualityTemplate.status == 200) {
            let qualityTemplateResponse = yield qualityTemplate.json()
            yield put(saveQualityTemplateSuccess(qualityTemplateResponse.inwardEntryId));
        } else if (qualityTemplate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(saveQualityTemplateError('error'));
    } catch (error) {
        console.log(error)
        yield put(saveQualityTemplateError(error));
    }
}

function* getQualityTemplateById(data) {
    try {
        // let data = new FormData();
        const qualityTemplate = yield fetch(`${baseUrl}api/quality/template/${data.payload}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (qualityTemplate.status == 200) {
            let qualityTemplateResponse = yield qualityTemplate.json()
            yield put(getQualityTemplateByIdSuccess(qualityTemplateResponse));
        } else if (qualityTemplate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(getQualityTemplateByIdError('error'));
    } catch (error) {
        console.log(error)
        yield put(getQualityTemplateByIdError(error));
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

function* updateQualityTemplateById(data) {
    try {
        // let data = new FormData();
        const qualityTemplate = yield fetch(`${baseUrl}api/quality/template/update`, {
            method: 'PUT',
            body: data.payload,
            headers: getHeaders()
        });
        if (qualityTemplate.status == 200) {
            let qualityTemplateResponse = yield qualityTemplate.json()
            yield put(updateQualityTemplateSuccess(qualityTemplateResponse));
        } else if (qualityTemplate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateQualityTemplateError('error'));
    } catch (error) {
        console.log(error)
        yield put(updateQualityTemplateError(error));
    }
}

function* deleteQualityTemplateById(data) {
    try {
        // let data = new FormData();
        const qualityTemplate = yield fetch(`${baseUrl}api/quality/template/${data.payload}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (qualityTemplate.status == 200) {
            let qualityTemplateResponse = yield qualityTemplate.json()
            yield put(deleteQualityTemplateSuccess(qualityTemplateResponse));
        } else if (qualityTemplate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteQualityTemplateError('error'));
    } catch (error) {
        console.log(error)
        yield put(deleteQualityTemplateError(error));
    }
}

function* saveQualityTemplateLink(data) {
    try {
        // let data = new FormData();
        console.log(data.payload)
        const qualityTemplate = yield fetch(`${baseUrl}api/quality/templatemap/save`, {
            method: 'POST',
            body: data.payload,
            // headers: {'Content-Type': 'multipart/form-data', ...getHeaders()}
            headers: getHeaders()
        });
        if (qualityTemplate.status == 200) {
            let qualityTemplateResponse = yield qualityTemplate.json()
            yield put(saveQualityTemplateLinkSuccess(qualityTemplateResponse.inwardEntryId));
        } else if (qualityTemplate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(saveQualityTemplateLinkError('error'));
    } catch (error) {
        console.log(error)
        yield put(saveQualityTemplateLinkError(error));
    }
}

function* getQualityTemplateLinkById(data) {
    try {
        // let data = new FormData();
        const qualityTemplate = yield fetch(`${baseUrl}api/quality/templatemap/${data.payload}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (qualityTemplate.status == 200) {
            let qualityTemplateResponse = yield qualityTemplate.json()
            yield put(getQualityTemplateLinkByIdSuccess(qualityTemplateResponse));
        } else if (qualityTemplate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(getQualityTemplateLinkByIdError('error'));
    } catch (error) {
        console.log(error)
        yield put(getQualityTemplateLinkByIdError(error));
    }
}

function* fetchTemplateLinkList(action) {
    try {
        const fetchTemplateList =  yield fetch(`${baseUrl}api/quality/templatemap`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchTemplateList.status === 200) {
            const fetchTemplateListResponse = yield fetchTemplateList.json();
            yield put(fetchTemplatesLinkListSuccess(fetchTemplateListResponse));
        } else if (fetchTemplateList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchTemplatesLinkListError('error'));
    } catch (error) {
        yield put(fetchTemplatesLinkListError(error));
    }
}

function* updateQualityTemplateLinkById(data) {
    try {
        // let data = new FormData();
        const qualityTemplate = yield fetch(`${baseUrl}api/quality/template/update`, {
            method: 'PUT',
            body: data.payload,
            headers: getHeaders()
        });
        if (qualityTemplate.status == 200) {
            let qualityTemplateResponse = yield qualityTemplate.json()
            yield put(updateQualityTemplateLinkSuccess(qualityTemplateResponse));
        } else if (qualityTemplate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateQualityTemplateLinkError('error'));
    } catch (error) {
        console.log(error)
        yield put(updateQualityTemplateLinkError(error));
    }
}

export function* watchFetchRequests() {
    yield takeLatest(SAVE_TEMPLATE_REQUEST, saveTemplate);
    yield takeLatest(FETCH_TEMPLATE_LIST, fetchTemplateList);
    yield takeLatest(SAVE_QUALITY_TEMPLATE_REQUEST, saveQualityTemplate);
    yield takeLatest(GET_QUALITY_TEMPLATE_BY_ID_REQUEST, getQualityTemplateById);
    yield takeLatest(UPDATE_QUALITY_TEMPLATE_REQUEST, updateQualityTemplateById);
    yield takeLatest(DELETE_QUALITY_TEMPLATE_REQUEST, deleteQualityTemplateById);
    yield takeLatest(FETCH_TEMPLATE_LINK_LIST, fetchTemplateLinkList);
    yield takeLatest(SAVE_QUALITY_TEMPLATE_LINK_REQUEST, saveQualityTemplateLink);
    yield takeLatest(GET_QUALITY_TEMPLATE_LINK_BY_ID_REQUEST, getQualityTemplateLinkById);
    yield takeLatest(UPDATE_QUALITY_TEMPLATE_LINK_REQUEST, updateQualityTemplateLinkById);
}

export default function* qualitySagas() {
    yield all([fork(watchFetchRequests)]);
}
