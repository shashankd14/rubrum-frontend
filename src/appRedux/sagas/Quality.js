//src-appredux-saga-quality.js

import { all, put, fork, takeLatest } from "redux-saga/effects";
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
    UPDATE_QUALITY_TEMPLATE_LINK_REQUEST,
    FETCH_QUALITY_REPORT_STAGE_REQUEST,
    FETCH_QUALITY_REPORT_REQUEST,
    SAVE_QUALITY_REPORT_REQUEST,
    GET_QUALITY_REPORT_BY_ID_REQUEST,
    UPDATE_QUALITY_REPORT_REQUEST,
    DELETE_QUALITY_REPORT_REQUEST,
    FETCH_KQP_LIST,
    SAVE_KQP_REQUEST,
    GET_KQP_BY_ID_REQUEST,
    UPDATE_KQP_REQUEST,
    DELETE_KQP_REQUEST,
    FETCH_KQP_LINK_LIST,
    SAVE_KQP_LINK_REQUEST,
    GET_KQP_LINK_BY_ID_REQUEST,
    UPDATE_KQP_LINK_REQUEST,
    DELETE_KQP_LINK_REQUEST,
    GET_THICKNESS_LIST_QM_REQUEST,
    GET_WIDTH_LIST_QM_REQUEST,
    GET_LENGTH_LIST_QM_REQUEST,
    DELETE_QUALITY_TEMPLATE_LINK_REQUEST,
    GET_PACKET_DETAILS_QUALITY_PROCESS_REQUEST,
    GENERATE_INWARD_PDF_QUALITY_MODULE_REPORT_REQUEST,
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
    fetchKqpListSuccess,
    fetchKqpListError,
    saveKqpSuccess,
    saveKqpError,
    getKqpByIdSuccess,
    getKqpByIdError,
    updateKqpSuccess,
    updateKqpError,
    deleteKqpSuccess,
    deleteKqpError,
    fetchKqpLinkListSuccess,
    fetchKqpLinkListError,
    saveKqpLinkSuccess,
    saveKqpLinkError,
    getKqpLinkByIdSuccess,
    getKqpLinkByIdError,
    updateKqpLinkSuccess,
    updateKqpLinkError,
    deleteKqpLinkSuccess,
    deleteKqpLinkError,
    fetchQualityReportStageListSuccess,
    fetchQualityReportStageListError,
    fetchQualityReportListSuccess,
    fetchQualityReportListError,
    saveQualityReportSuccess,
    saveQualityReportError,
    getQualityReportByIdSuccess,
    getQualityReportByIdError,
    updateQualityReportSuccess,
    updateQualityReportError,
    deleteQualityReportSuccess,
    deleteQualityReportError,
    getThicknessListQMSuccess,
    getThicknessListQMError,
    getWidthListQMSuccess,
    getWidthListQMError,
    getLengthListQMSuccess,
    getLengthListQMError,
    getQualityPacketDetailsSuccess,
    getQualityPacketDetailsError,
    pdfGenerateQMreportInwardSuccess,
    pdfGenerateQMreportInwardError,
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
        const fetchTemplateList = yield fetch(`${baseUrl}api/quality/template`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (fetchTemplateList.status === 200) {
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
        window.location.reload();
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
            headers: { 'Content-Type': 'application/json', ...getHeaders() }
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

function* fetchTemplateLinkList(payload) {
    try{
       const reqUrl = (payload && payload.params && payload.params.partyId) ? `${baseUrl}api/quality/templatemap/party/${payload.params.partyId}` : `${baseUrl}api/quality/templatemap`
        const fetchTemplateList = yield fetch(reqUrl, {
            method: 'GET',
            headers: getHeaders()
        });
    // try {
    //     const fetchTemplateList = yield fetch(`${baseUrl}api/quality/templatemap`, {
    //         method: 'GET',
    //         headers: getHeaders()
    //     });
        if (fetchTemplateList.status === 200) {
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

// ======= save quality report ===========

function* fetchQualityReportStageList(req) {
    console.log(req.payload)
    try {
        const endP = (req.payload.stage.includes('processing') || req.payload.stage.includes('inward') )? 'listpage' : 'dispatchlist'
        const url = `${baseUrl}api/quality/qir/${req.payload.stage}/${endP}`
        console.log('url', url)
        const fetchQRList =  yield fetch( url, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchQRList.status === 200) {
            const fetchQRListResponse = yield fetchQRList.json();
            console.log('fetchQRListResponse', fetchQRListResponse)
            yield put(fetchQualityReportStageListSuccess(fetchQRListResponse));
        } else if (fetchQRList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchQualityReportStageListError('error'));
    } catch (error) {
        yield put(fetchQualityReportStageListError(error));
    }
}

function* fetchQualityReportStageList1(req) {
    console.log(req.payload)
    try {
        // const fetchQRList =  yield fetch(`${baseUrl}api/quality/reports/${req.payload.stage}/${req.payload.page}/${req.payload.pageSize}?searchText=&partyId=`, {
        const endPoint = req.payload.stage === "inwardlist" ? "/api/quality/reports/inwardlist/1/1" : req.payload.stage === "preprocessing" ? "/api/quality/qir/fetchpacketdtls" : req.payload.stage === "processing" ? "/api/quality/qir/fetchpacketdtls" : req.payload.stage === "predispatch" ? "/api/quality/qir/dispatchlist" : "/api/quality/qir/dispatchlist"
        const methodType = req.payload.stage === "inwardlist" ? "GET" : req.payload.stage === "preprocessing" ? "POST" : req.payload.stage === "processing" ? "POST" : req.payload.stage === "predispatch" ? "GET" : "GET"
        const url = `${baseUrl}${endPoint}`;
        const data = methodType === 'POST' ? {
            method: methodType,
            headers: getHeaders(),
            body: JSON.stringify({
            "coilNo": "19365",
            "partDetailsId": "DOC_16605381763598078"
        })} : {
            method: methodType,
            headers: getHeaders(),
            }
        
        const fetchQRList = yield fetch(url, data);
        if (fetchQRList.status === 200) {
            const fetchQRListResponse = yield fetchQRList.json();
            console.log('fetchQRListResponse', req.payload.stage === "inwardlist" ? fetchQRListResponse.content : fetchQRListResponse)
            yield put(fetchQualityReportStageListSuccess(req.payload.stage === "inwardlist" ? fetchQRListResponse.content : fetchQRListResponse));
        } else if (fetchQRList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchQualityReportStageListError('error'));
    } catch (error) {
        yield put(fetchQualityReportStageListError(error));
    }
}

function* fetchQualityReportList(action) {
    try {
        const fetchQRList = yield fetch(`${baseUrl}api/quality/inspectionreport`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (fetchQRList.status === 200) {
            const fetchQRListResponse = yield fetchQRList.json();
            yield put(fetchQualityReportListSuccess(fetchQRListResponse));
        } else if (fetchQRList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchQualityReportListError('error'));
    } catch (error) {
        yield put(fetchQualityReportListError(error));
    }
}

function* saveQualityReport(data) {
    try {
        // let data = new FormData();
        console.log(data.payload)
        // /api/quality/qir/save
        const qualityTemplate = yield fetch(`${baseUrl}api/quality/qir/save`, {
            method: 'POST',
            body: data.payload,
            // headers: {'Content-Type': 'multipart/form-data', ...getHeaders()}
            headers: getHeaders()
        });
        if (qualityTemplate.status == 200) {
            let qualityTemplateResponse = yield qualityTemplate.json()
            yield put(saveQualityReportSuccess(qualityTemplateResponse.inwardEntryId));
        } else if (qualityTemplate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(saveQualityReportError('error'));
    } catch (error) {
        console.log(error)
        yield put(saveQualityReportError(error));
    }
}

function* getQualityReportById(data) {
    try {
        // let data = new FormData();
        const qualityTemplate = yield fetch(`${baseUrl}api/quality/qir/${data.payload}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (qualityTemplate.status == 200) {
            let qualityTemplateResponse = yield qualityTemplate.json()
            yield put(getQualityReportByIdSuccess(qualityTemplateResponse));
        } else if (qualityTemplate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(getQualityReportByIdError('error'));
    } catch (error) {
        console.log(error)
        yield put(getQualityReportByIdError(error));
    }
}

function* updateQualityReportById(data) {
    try {
        // let data = new FormData();
        const qualityTemplate = yield fetch(`${baseUrl}api/quality/inspectionreport/update`, {
            method: 'PUT',
            body: data.payload,
            headers: getHeaders()
        });
        if (qualityTemplate.status == 200) {
            let qualityTemplateResponse = yield qualityTemplate.json()
            yield put(updateQualityReportSuccess(qualityTemplateResponse));
        } else if (qualityTemplate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateQualityReportError('error'));
    } catch (error) {
        console.log(error)
        yield put(updateQualityReportError(error));
    }
}

function* deleteQualityReportById(data) {
    try {
        // let data = new FormData();
        const qualityTemplate = yield fetch(`${baseUrl}api/quality/qir/${data.payload}`, {
            method: 'DELETE',
            body: data.payload,
            headers: getHeaders()
        });
        window.location.reload();
        if (qualityTemplate.status == 200) {
            let qualityTemplateResponse = yield qualityTemplate.json()
            yield put(deleteQualityReportSuccess(qualityTemplateResponse));
        } else if (qualityTemplate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteQualityReportError('error'));
    } catch (error) {
        console.log(error)
        yield put(deleteQualityReportError(error));
    }
}

// ========== KQP Templates ==============

function* fetchKqpList(action) {
    try {
        const fetchQRList = yield fetch(`${baseUrl}api/quality/kqp`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (fetchQRList.status === 200) {
            const fetchQRListResponse = yield fetchQRList.json();
            yield put(fetchKqpListSuccess(fetchQRListResponse));
        } else if (fetchQRList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchKqpListError('error'));
    } catch (error) {
        yield put(fetchKqpListError(error));
    }
}

function* saveKqp(data) {
    try {
        // let data = new FormData();
        console.log(data.payload)
        const qualityTemplate = yield fetch(`${baseUrl}api/quality/kqp/save`, {
            method: 'POST',
            body: data.payload,
            headers: { 'Content-Type': 'application/json', ...getHeaders() }
            // headers: getHeaders()
        });
        if (qualityTemplate.status == 200) {
            let qualityTemplateResponse = yield qualityTemplate.json()
            yield put(saveKqpSuccess(qualityTemplateResponse.inwardEntryId));
        } else if (qualityTemplate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(saveKqpError('error'));
    } catch (error) {
        console.log(error)
        yield put(saveKqpError(error));
    }
}

function* getKqpById(data) {
    try {
        // let data = new FormData();
        const qualityTemplate = yield fetch(`${baseUrl}api/quality/kqp/${data.payload}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (qualityTemplate.status == 200) {
            let qualityTemplateResponse = yield qualityTemplate.json()
            yield put(getKqpByIdSuccess(qualityTemplateResponse));
        } else if (qualityTemplate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(getKqpByIdError('error'));
    } catch (error) {
        console.log(error)
        yield put(getKqpByIdError(error));
    }
}

function* updateKqpById(data) {
    try {
        // let data = new FormData();
        const qualityTemplate = yield fetch(`${baseUrl}api/quality/kqp/update`, {
            method: 'PUT',
            body: data.payload,
            headers: { 'Content-Type': 'application/json', ...getHeaders() }
        });
        if (qualityTemplate.status == 200) {
            let qualityTemplateResponse = yield qualityTemplate.json()
            yield put(updateKqpSuccess(qualityTemplateResponse));
        } else if (qualityTemplate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateKqpError('error'));
    } catch (error) {
        console.log(error)
        yield put(updateKqpError(error));
    }
}

function* deleteKqpById(data) {
    try {
        // let data = new FormData();
        const qualityTemplate = yield fetch(`${baseUrl}api/quality/kqp/${data.payload}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        window.location.reload();
        if (qualityTemplate.status == 200) {
            let qualityTemplateResponse = yield qualityTemplate.json()
            yield put(deleteKqpSuccess(qualityTemplateResponse));
        } else if (qualityTemplate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteKqpError('error'));
    } catch (error) {
        console.log(error)
        yield put(deleteKqpError(error));
    }
}

// ========== KQP Templates Link ==============

function* fetchKqpLinkList(action) {
    try {
        const fetchQRList = yield fetch(`${baseUrl}api/quality/kqppartymap`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (fetchQRList.status === 200) {
            const fetchQRListResponse = yield fetchQRList.json();
            yield put(fetchKqpLinkListSuccess(fetchQRListResponse));
        } else if (fetchQRList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchKqpLinkListError('error'));
    } catch (error) {
        yield put(fetchKqpLinkListError(error));
    }
}

function* saveKqpLink(data) {
    try {
        // let data = new FormData();
        console.log("data.payload", data.payload);
        const qualityTemplate = yield fetch(`${baseUrl}api/quality/kqppartymap/save`, {
            method: 'POST',
            body: data.payload,
            // headers: {'Content-Type': 'multipart/form-data', ...getHeaders()}
           // headers: getHeaders()
            headers: { 'Content-Type': 'application/json', ...getHeaders() }
        });
        if (qualityTemplate.status == 200) {
            let qualityTemplateResponse = yield qualityTemplate.json()
            yield put(saveKqpLinkSuccess(qualityTemplateResponse.inwardEntryId));
        } else if (qualityTemplate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(saveKqpLinkError('error'));
    } catch (error) {
        console.log(error)
        yield put(saveKqpLinkError(error));
    }
}

function* getKqpLinkById(data) {
    try {
        // let data = new FormData();
        const qualityTemplate = yield fetch(`${baseUrl}api/quality/kqppartymap/${data.payload}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (qualityTemplate.status == 200) {
            let qualityTemplateResponse = yield qualityTemplate.json()
            yield put(getKqpLinkByIdSuccess(qualityTemplateResponse));
        } else if (qualityTemplate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(getKqpLinkByIdError('error'));
    } catch (error) {
        console.log(error)
        yield put(getKqpLinkByIdError(error));
    }
}

function* updateKqpLinkById(data) {
    try {
        // let data = new FormData();
        const qualityTemplate = yield fetch(`${baseUrl}api/quality/kqppartymap/update`, {
            method: 'PUT',
            body: data.payload,
            headers: getHeaders()
        });
        if (qualityTemplate.status == 200) {
            let qualityTemplateResponse = yield qualityTemplate.json()
            yield put(updateKqpLinkSuccess(qualityTemplateResponse));
        } else if (qualityTemplate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateKqpLinkError('error'));
    } catch (error) {
        console.log(error)
        yield put(updateKqpLinkError(error));
    }
}

function* deleteKqpLinkById(data) {
    try {
        // let data = new FormData();
        const qualityTemplate = yield fetch(`${baseUrl}api/quality/kqppartymap/${data.payload}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        window.location.reload();
        if (qualityTemplate.status == 200) {
            let qualityTemplateResponse = yield qualityTemplate.json()
            yield put(deleteKqpLinkSuccess(qualityTemplateResponse));
        } else if (qualityTemplate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteKqpLinkError('error'));
    } catch (error) {
        console.log(error)
        yield put(deleteKqpLinkError(error));
    }
}
//delete templateMap by id
function* deleteQualityTemplateLinkById(data) {
    try {
        // let data = new FormData();
        const qualityTemplate = yield fetch(`${baseUrl}api/quality/templatemap/${data.payload}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        window.location.reload();
        if (qualityTemplate.status == 200) {
            let qualityTemplateResponse = yield qualityTemplate.json()
            yield put(deleteQualityTemplateLinkSuccess(qualityTemplateResponse));
        } else if (qualityTemplate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteQualityTemplateLinkError('error'));
    } catch (error) {
        console.log(error)
        yield put(deleteQualityTemplateLinkError(error));
    }
}
//get List of thickness QM dropdown
function* getThicknessList(action) {
    try {
        const fetchThicknessList = yield fetch(`${baseUrl}api/quality/templatemap/getallthickness`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchThicknessList.status === 200){
            const fetchThicknessListResponse = yield fetchThicknessList.json();
            yield put(getThicknessListQMSuccess(fetchThicknessListResponse));
        } else if (fetchThicknessList === 401){
            yield put(userSignOutSuccess());
        } else 
            yield put(getThicknessListQMError('error'));
    } catch (error) {
        yield put(getThicknessListQMError(error));
    }
}
//get List of width QM dropdown
function* getWidthList(action) {
    try {
        const fetchWidthList = yield fetch(`${baseUrl}api/quality/templatemap/getallwidth`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchWidthList.status === 200){
            const fetchWidthListResponse = yield fetchWidthList.json();
            yield put(getWidthListQMSuccess(fetchWidthListResponse));
        } else if (fetchWidthList === 401){
            yield put(userSignOutSuccess());
        } else 
            yield put(getWidthListQMError('error'));
    } catch (error) {
        yield put(getWidthListQMError(error));
    }
}
//get List of length QM dropdown
function* getLengthList(action) {
    try {
        const fetchLengthList = yield fetch(`${baseUrl}api/quality/templatemap/getalllength`, {
            method: 'GET',
            headers: getHeaders()
        });
        if(fetchLengthList.status === 200){
            const fetchLengthListResponse = yield fetchLengthList.json();
            yield put(getLengthListQMSuccess(fetchLengthListResponse));
        } else if (fetchLengthList === 401){
            yield put(userSignOutSuccess());
        } else 
            yield put(getLengthListQMError('error'));
    } catch (error) {
        yield put(getLengthListQMError(error));
    }
}

//Get packetDetails in quality processStage
function* getPacketDetailsQuality(data) {
    try {
        const qualityTemplate = yield fetch(`${baseUrl}api/quality/qir/fetchpacketdtls`, {
            method: 'POST',
            body: data.payload,
            headers: { 'Content-Type': 'application/json', ...getHeaders() }
        });
        if (qualityTemplate.status == 200) {
            let qualityTemplateResponse = yield qualityTemplate.json()
            yield put(getQualityPacketDetailsSuccess(qualityTemplateResponse));
        } else if (qualityTemplate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(getQualityPacketDetailsError('error'));
    } catch (error) {
        console.log(error)
        yield put(getQualityPacketDetailsError(error));
    }
}
//QM report inward pdf
function* generateQMreportInwardPdf(action) {
    debugger
    //try {
        // const pdfGenerate =  yield fetch(`${baseUrl}api/pdf/inward`, {
        //     method: 'POST',
        //     headers: { "Content-Type": "application/json", ...getHeaders()},
        //     body: JSON.stringify(action.payload)
        // });
        let pdfGenerate
    try {
        // inward pdf
        if(action.payload.type === 'inward'){
            pdfGenerate = yield fetch(`${baseUrl}api/pdf/inward`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    ...getHeaders()
                  },
                body: JSON.stringify(action.payload.inwardId)
            });
        }else if(action.payload.type === 'preProcessing'){
            pdfGenerate = yield fetch(`${baseUrl}api/pdf`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    ...getHeaders()
                  },
                body: JSON.stringify(action.payload.partDetailsId)
            });
        } else if(action.payload.type === 'preDispatch'){
            pdfGenerate = yield fetch(`${baseUrl}api/pdf/delivery`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    ...getHeaders()
                  },
                body: JSON.stringify(action.payload.partDetailsId)
            });
        }
        if(pdfGenerate.status === 200) {
            const pdfGenerateResponse = yield pdfGenerate.json();
            let pdfWindow = window.open("")
               pdfWindow.document.write(
                  "<iframe width='100%' height='600%' src='data:application/pdf;base64, " +
                    encodeURI(pdfGenerateResponse.encodedBase64String) + "'></iframe>"
               )                 
            yield put(pdfGenerateQMreportInwardSuccess(pdfGenerateResponse));
        } else if (pdfGenerate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(pdfGenerateQMreportInwardError('error'));
    } catch (error) {
        yield put(pdfGenerateQMreportInwardError(error));
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
    yield takeLatest(FETCH_QUALITY_REPORT_STAGE_REQUEST, fetchQualityReportStageList);
    yield takeLatest(FETCH_QUALITY_REPORT_REQUEST, fetchQualityReportList);
    yield takeLatest(SAVE_QUALITY_REPORT_REQUEST, saveQualityReport);
    yield takeLatest(GET_QUALITY_REPORT_BY_ID_REQUEST, getQualityReportById);
    yield takeLatest(UPDATE_QUALITY_REPORT_REQUEST, updateQualityReportById);
    yield takeLatest(DELETE_QUALITY_REPORT_REQUEST, deleteQualityReportById);
    yield takeLatest(FETCH_KQP_LIST, fetchKqpList);
    yield takeLatest(SAVE_KQP_REQUEST, saveKqp);
    yield takeLatest(GET_KQP_BY_ID_REQUEST, getKqpById);
    yield takeLatest(UPDATE_KQP_REQUEST, updateKqpById);
    yield takeLatest(DELETE_KQP_REQUEST, deleteKqpById);
    yield takeLatest(FETCH_KQP_LINK_LIST, fetchKqpLinkList);
    yield takeLatest(SAVE_KQP_LINK_REQUEST, saveKqpLink);
    yield takeLatest(GET_KQP_LINK_BY_ID_REQUEST, getKqpLinkById);
    yield takeLatest(UPDATE_KQP_LINK_REQUEST, updateKqpLinkById);
    yield takeLatest(DELETE_KQP_LINK_REQUEST, deleteKqpLinkById);
    yield takeLatest(GET_THICKNESS_LIST_QM_REQUEST, getThicknessList);
    yield takeLatest(GET_WIDTH_LIST_QM_REQUEST, getWidthList);
    yield takeLatest(GET_LENGTH_LIST_QM_REQUEST, getLengthList);
    yield takeLatest(DELETE_QUALITY_TEMPLATE_LINK_REQUEST, deleteQualityTemplateLinkById);
    yield takeLatest(GET_PACKET_DETAILS_QUALITY_PROCESS_REQUEST, getPacketDetailsQuality);
    yield takeLatest(GENERATE_INWARD_PDF_QUALITY_MODULE_REPORT_REQUEST, generateQMreportInwardPdf);
}

export default function* qualitySagas() {
    yield all([fork(watchFetchRequests)]);
}
