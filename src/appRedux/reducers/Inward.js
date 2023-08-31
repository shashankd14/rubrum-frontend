import {
    FETCH_INWARD_LIST_REQUEST,
    FETCH_INWARD_LIST_SUCCESS,
    FETCH_INWARD_LIST_ERROR,

    FETCH_WIP_INWARD_LIST_REQUEST,
    FETCH_WIP_INWARD_LIST_SUCCESS,
    FETCH_WIP_INWARD_LIST_ERROR,

    SET_INWARD_DETAILS,
    SUBMIT_INWARD_ENTRY,
    SUBMIT_INWARD_SUCCESS,
    SUBMIT_INWARD_ERROR,
    CHECK_COIL_EXISTS,
    CHECK_COIL_EXISTS_SUCCESS,
    CHECK_COIL_EXISTS_ERROR,
    FETCH_INWARD_LIST_BY_PARTY_REQUEST,
    FETCH_INWARD_LIST_BY_PARTY_SUCCESS,
    FETCH_INWARD_LIST_BY_PARTY_ERROR,
    FETCH_INWARD_PLAN_DETAILS_REQUESTED,
    FETCH_INWARD_PLAN_DETAILS_SUCCESS,
    FETCH_INWARD_PLAN_DETAILS_ERROR,
    SET_PROCESS_DETAILS,
    RESET_INWARD_FORM,
    RESET_DELETE_INWARD,
    REST_ISDELETED,
    REQUEST_SAVE_SLITTING_DETAILS,
    SAVE_SLITTING_DETAILS_SUCCESS,
    SAVE_SLITTING_DETAILS_ERROR,
    REQUEST_SAVE_CUTTING_DETAILS,
    SAVE_CUTTING_DETAILS_SUCCESS,
    SAVE_CUTTING_DETAILS_ERROR,
    REQUEST_UPDATE_INSTRUCTION_DETAILS,
    REQUEST_UPDATE_INSTRUCTION_DETAILS_SUCCESS,
    REQUEST_UPDATE_INSTRUCTION_DETAILS_ERROR,
    RESET_INSTRUCTION_FORM, FETCH_MATERIAL_GRADE_LIST_REQUEST, FETCH_MATERIAL_GRADE_LIST_SUCCESS,

    SET_INWARD_SELECTED_FOR_DELIVERY,
    POST_DELIVERY_CONFIRM_REQUESTED,
    POST_DELIVERY_CONFIRM_SUCCESS,
    POST_DELIVERY_CONFIRM_ERROR,

	FETCH_INWARD_INSTRUCTION_DETAILS_REQUESTED,
    FETCH_INWARD_INSTRUCTION_DETAILS_SUCCESS,
    FETCH_INWARD_INSTRUCTION_DETAILS_ERROR,
    FETCH_INWARD_INSTRUCTION_WIP_DETAILS_REQUESTED,
    FETCH_INWARD_INSTRUCTION_WIP_DETAILS_SUCCESS,
    FETCH_INWARD_INSTRUCTION_WIP_DETAILS_ERROR,
    SAVE_UNPROCESSED_FOR_DELIVERY,
    SAVE_UNPROCESSED_FOR_DELIVERY_ERROR,
    SAVE_UNPROCESSED_FOR_DELIVERY_SUCCESS,
    FETCH_DELIVERY_LIST_REQUEST_BY_ID,
    FETCH_DELIVERY_LIST_SUCCESS_BY_ID,
    FETCH_INWARD_LIST_BY_ID_SUCCESS,
    FETCH_INWARD_LIST_BY_ID_ERROR,
    FETCH_INWARD_LIST_BY_ID,
    DELETE_INWARD_LIST_BY_ID,
    DELETE_INWARD_LIST_BY_ID_SUCCESS,
    DELETE_INWARD_LIST_BY_ID_ERROR,
    UPDATE_INWARD_LIST,
    UPDATE_INWARD_LIST_SUCCESS,
    UPDATE_INWARD_LIST_ERROR,
    DELETE_INSTRUCTION_BY_ID,
    DELETE_INSTRUCTION_BY_ID_SUCCESS,
    DELETE_INSTRUCTION_BY_ID_SUCCESS_SLIT,
    DELETE_INSTRUCTION_BY_ID_ERROR,
    CHECK_BATCH_NO_EXIST,
    CHECK_BATCH_NO_EXIST_SUCCESS,
    CHECK_BATCH_NO_EXIST_ERROR,
    INSTRUCTION_GROUP_SAVE,
    INSTRUCTION_GROUP_SAVE_SUCCESS,
    INSTRUCTION_GROUP_SAVE_ERROR,
    PDF_GENERATE_INWARD,
    PDF_GENERATE_INWARD_ERROR,
    PDF_GENERATE_INWARD_SUCCESS,
    PDF_GENERATE_DELIVERY,
    PDF_GENERATE_DELIVERY_ERROR,
    PDF_GENERATE_DELIVERY_SUCCESS,
    PDF_S3_URL,
    PDF_S3_URL_SUCCESS,
    PDF_S3_URL_ERROR,
    GET_RECONCILE_REPORT_SUCCESS,
    GET_RECONCILE_REPORT,
    GET_RECONCILE_REPORT_ERROR,
    GET_PACKET_WISE_PRICE_DC_REQUEST,
    GET_PACKET_WISE_PRICE_DC_SUCCESS,
    GET_PACKET_WISE_PRICE_DC_ERROR
} from "../../constants/ActionTypes";
import * as actionTypes from "../../constants/ActionTypes";

const INIT_STATE = {
    inwardList: [],
    wipList: [],
    totalItems: 0,
    wipLoading: false,
    wipSuccess: false,
    wipError: false,
    loading: false,
    success: false,
    error: false,
    inward: {},
    inwardEntry:{},
    inwardSubmitLoading: false,
    inwardSubmitSuccess: false,
    inwardSubmitError: false,
    planLoading: false,
    planSuccess: false,
    planError: false,
    plan: {},
    process: {},
    instructionSaveCuttingLoading: false,
    instructionSaveSlittingLoading: false,
    instructionSaveSlittingSuccess: false,
    instructionSaveCuttingSuccess: false,
    instructionSaveError: false,
    materialGrades: {},
    inwardListForDelivery: undefined,
    vehicleNumber: '',
    deleteSuccess: false,
    deleteFail: false,
    inwardUpdateLoading: false,
    inwardUpdateSuccess: false,
    inwardUpdateError: false,
    saveCut:[],
    saveSlit:[],
    submitInward:'',
    groupId:{},
    pdfError: false,
    pdfLoading:false,
    pdfSuccess: false,
    dcpdfError: false,
    dcpdfLoading:false,
    dcpdfSuccess: false,
    deliverySuccess:false,
    deliveryError: false,
    isDeleted: false,
    unprocessedSuccess:{},
    s3pdfurl:{},
    instructionUpdateSuccess:false,
    instructionUpdateFailure: false,
    reconcileData:[],
    planQRError: false,
    planQRLoading:false,
    planQRSuccess: false,
    QrSuccess:false,
    QrLoading: false,
    QrError: false,
    packetwisePriceDC:{}
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_INWARD_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_INWARD_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                inwardList: action.inwardList,
                totalItems: action.totalItems,
                success: true
            }
        }

        case FETCH_WIP_INWARD_LIST_REQUEST: {
            return {
                ...state,
                wipLoading: true,
                wipSuccess: false
            }
        }
        case FETCH_WIP_INWARD_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                wipList: action.wipList,
                totalItems: action.totalItems,
                wipSuccess: true
            }
        }

        case FETCH_WIP_INWARD_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                wipSuccess:false,
                wipList: [],
                wipError: true,
                wipSuccess: false
            }
        }

        case CHECK_COIL_EXISTS: {
            return {
                ...state,
                loading: true,
            }
        }
        case CHECK_COIL_EXISTS_SUCCESS: {
            return {
                ...state,
                loading: false,
                success: true,
                duplicateCoil: action.status
            }
        }
        case CHECK_COIL_EXISTS_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }
        case CHECK_BATCH_NO_EXIST: {
            return {
                ...state,
                loading: true,
            }
        }
        case CHECK_BATCH_NO_EXIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                success: true,
                duplicateBatchNo: action.status
            }
        }
        case CHECK_BATCH_NO_EXIST_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }
        case FETCH_INWARD_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                inwardList: [],
                error: true
            }
        }
        case SET_INWARD_DETAILS: {
            return {
                ...state,
                inward: action.inward,
                inwardEntry: action.inward
            }
        }
        case SUBMIT_INWARD_ENTRY: {
            return {
                ...state,
                inwardSubmitLoading: true,
            }
        }
        case SUBMIT_INWARD_SUCCESS: {
            return {
                ...state,
                submitInward: action.inward,
                inwardSubmitLoading: false,
                inwardSubmitSuccess: true
            }
        }
        case SUBMIT_INWARD_ERROR: {
            return {
                ...state,
                inwardSubmitLoading: false,
                inwardSubmitError: true,
                inwardSubmitSuccess: false
            }
        }
        case FETCH_INWARD_LIST_BY_PARTY_REQUEST: {
            return {
                ...state,
                loading: true,
                error: false
            }
        }
        case FETCH_INWARD_LIST_BY_PARTY_SUCCESS: {
            return {
                ...state,
                loading: false,
                error: false,
                inwardList: action.payload,
            }
        }
        case FETCH_INWARD_LIST_BY_PARTY_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
                inwardList: [],
            }
        }
        case FETCH_INWARD_PLAN_DETAILS_REQUESTED: {
            return {
                ...state,
                planLoading: true
            }
        }
        case FETCH_INWARD_PLAN_DETAILS_SUCCESS: {
            return {
                ...state,
                planLoading: false,
                planSuccess: true,
                plan: action.payload
            }
        }
        case FETCH_INWARD_PLAN_DETAILS_ERROR: {
            return {
                ...state,
                planLoading: false,
                planSuccess: false,
                planError: action.error
            }
        }
        case FETCH_INWARD_INSTRUCTION_DETAILS_REQUESTED: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_INWARD_INSTRUCTION_DETAILS_SUCCESS: {
            return {
                ...state,
                loading: false,
                plan: action.payload
            }
        }
        case FETCH_INWARD_INSTRUCTION_DETAILS_ERROR: {
            return {
                ...state,
                loading:false
            }
        }
        case SET_PROCESS_DETAILS: {
            return {
                ...state,
                process: action.processDetails
            }
        }
        case RESET_INWARD_FORM: {
            return {
                ...state,
                inwardSubmitLoading: false,
                inwardSubmitSuccess: false,
                inwardSubmitError: false,
                inward:{},
                inwardUpdateLoading: false,
                inwardUpdateSuccess: false,
                inwardUpdateError: false,
                submitInward:'',
                pdfLoading:false,
                pdfSuccess:false,
                pdfError:false,
                QrSuccess:false,
                QrLoading: false,
                QrError: false,
                
            }
        }
        
        case REQUEST_SAVE_CUTTING_DETAILS: {
            return {
                ...state,
                instructionSaveCuttingLoading: true,
                instructionSaveCuttingSuccess: false,
                instructionSaveError: false,
                loading: true
            }
        }
        case SAVE_CUTTING_DETAILS_SUCCESS: {
            return {
                ...state,
                saveCut: action.payload,
                instructionSaveCuttingLoading: false,
                instructionSaveCuttingSuccess: true,
                instructionSaveError: false,
                loading: false
            }
        }
        case SAVE_CUTTING_DETAILS_ERROR: {
            return {
                ...state,
                instructionSaveCuttingLoading: false,
                instructionSaveCuttingSuccess: false,
                instructionSaveError: true,
                loading: false
            }
        }
        case INSTRUCTION_GROUP_SAVE: {
            return {
                ...state,
                loading: true
            }
        }
        case INSTRUCTION_GROUP_SAVE_SUCCESS: {
            return {
                ...state,
                groupId: action.payload,
                loading : false
            }
        }
        case INSTRUCTION_GROUP_SAVE_ERROR: {
            return {
                ...state,
                loading: false
            }
        }
        case REQUEST_SAVE_SLITTING_DETAILS: {
            return {
                ...state,
                instructionSaveSlittingLoading: true,
                instructionSaveSlittingSuccess: false,
                instructionSaveError: false,
                loading: true
            }
        }
        case SAVE_SLITTING_DETAILS_SUCCESS: {
            return {
                ...state,
                saveSlit:action.payload,
                instructionSaveSlittingLoading: false,
                instructionSaveSlittingSuccess: true,
                instructionSaveError: false,
                loading: false
            }
        }
        case SAVE_SLITTING_DETAILS_ERROR: {
            return {
                ...state,
                instructionSaveSlittingLoading: false,
                instructionSaveSlittingSuccess: false,
                instructionSaveError: true,
                loading: false
            }
        }
        case REQUEST_UPDATE_INSTRUCTION_DETAILS: {
            return {
                ...state,
                loading: true,
                instructionUpdateSuccess:false,
                instructionUpdateFailure: false,
                error: false
            }
        }
        case REQUEST_UPDATE_INSTRUCTION_DETAILS_SUCCESS: {
            return {
                ...state,
                loading: false,
                instructionUpdateSuccess:true,
                instructionUpdateFailure: false,
                error: false
            }
        }
        case REQUEST_UPDATE_INSTRUCTION_DETAILS_ERROR: {
            return {
                ...state,
                loading: true,
                instructionUpdateSuccess:false,
                instructionUpdateFailure: true,
                error: true
            }
        }
        case FETCH_MATERIAL_GRADE_LIST_SUCCESS:{
            return {
                ...state,
                materialGrades: action.payload
            }
        }
        case FETCH_INWARD_LIST_BY_ID:{
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_INWARD_LIST_BY_ID_SUCCESS:{
            return {
                ...state,
                loading:false,
                inward: action.payload
            }
        }
        case RESET_INSTRUCTION_FORM: {
            return {
                ...state,
                instructionSaveSlittingLoading: false,
                instructionSaveCuttingLoading: false,
                instructionSaveSlittingSuccess: false,
                instructionSaveCuttingSuccess: false,
                instructionSaveError: false,
                pdfSuccess:false,
                pdfLoading: false,
                pdfError: false,
                deliverySuccess:false,
                deliveryError: false,
                dcpdfError:false,
                dcpdfSuccess: false,
                dcpdfLoading: false,
                unprocessedSuccess:{},
                instructionUpdateSuccess:false,
                instructionUpdateFailure: false,
                QrSuccess:false,
                QrLoading: false,
                QrError: false,
            }
        }
        
        case SET_INWARD_SELECTED_FOR_DELIVERY: {
            return {
                ...state,
                inwardListForDelivery:action.payload
            }
        }
        case POST_DELIVERY_CONFIRM_REQUESTED: {
            return {
                ...state,
                loading: true,
                deliverySuccess: false,
                deliveryError: false
            }
        }
        case POST_DELIVERY_CONFIRM_ERROR: {
            return{
                ...state,
                loading: false,
               deliverySuccess: false,
                deliveryError: true
            }
        }
        case POST_DELIVERY_CONFIRM_SUCCESS: {
            return{
                ...state,
                loading: false,
                deliverySuccess: true,
                deliveryError: false
            }
        }
        case FETCH_INWARD_INSTRUCTION_WIP_DETAILS_REQUESTED: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_INWARD_INSTRUCTION_WIP_DETAILS_SUCCESS: {
            return {
                ...state,
                loading: false,
                inwardList: action.inwardList
            }
        }
        case FETCH_DELIVERY_LIST_REQUEST_BY_ID: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_DELIVERY_LIST_SUCCESS_BY_ID: {
            return {
                ...state,
                loading: false,
                deliveryList: action.deliveryList
            }
        }
        case SAVE_UNPROCESSED_FOR_DELIVERY: {
            return {
                ...state,
                loading: true
            }
        }
        case SAVE_UNPROCESSED_FOR_DELIVERY_SUCCESS: {
            return {
                ...state,
                loading: false,
                unprocessedSuccess: action.payload
            }
        }
        case SAVE_UNPROCESSED_FOR_DELIVERY_ERROR: {
            return {
                ...state,
                loading: false
            }
        }
        case DELETE_INWARD_LIST_BY_ID:{
            return {
                ...state,
                loading: true,
                deleteSuccess:false,
                deleteFail: false
            }
        }
        case DELETE_INWARD_LIST_BY_ID_SUCCESS:{
            return {
                ...state,
                loading: false,
                deleteSuccess:true,
                deleteFail: false
            }
        }
        case DELETE_INWARD_LIST_BY_ID_ERROR:{
            return {
                ...state,
                loading: false,
                deleteSuccess:false,
                deleteFail: true
            }
        }
        case RESET_DELETE_INWARD: {
            return {
                ...state,
                deleteFail: false,
                deleteSuccess: false
            }
        }
        case UPDATE_INWARD_LIST: {
            return {
                ...state,
                inwardUpdateLoading: true,
            }
        }
        case UPDATE_INWARD_LIST_SUCCESS: {
            return {
                ...state,
                inwardUpdateLoading: false,
                inwardUpdateSuccess: true
            }
        }
        case UPDATE_INWARD_LIST_ERROR: {
            return {
                ...state,
                inwardUpdateLoading: false,
                inwardUpdateError: true
            }
        }
        case DELETE_INSTRUCTION_BY_ID: {
            return {
                ...state,
                loading: true,
            }
        }
        case REST_ISDELETED: {
            return {
                ...state,
                isDeleted: false
            }
        }
        case DELETE_INSTRUCTION_BY_ID_SUCCESS_SLIT: {
            return {
                ...state,
                loading: false,
                isDeleted: true
            }
        }
        case DELETE_INSTRUCTION_BY_ID_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case DELETE_INSTRUCTION_BY_ID_ERROR: {
            return {
                ...state,
                loading: false,
                isDeleted: false
            }
        }
        case PDF_GENERATE_INWARD: {
            return {
                ...state,
                pdfLoading: true,
            }
        }
        case PDF_GENERATE_INWARD_SUCCESS: {
            return {
                ...state,
                pdfLoading: false,
                pdfSuccess: true,
            }
        }
        case PDF_GENERATE_INWARD_ERROR: {
            return {
                ...state,
                pdfLoading: false,
                pdfSuccess: false,
                pdfError: true
            }
        }
        case PDF_GENERATE_DELIVERY: {
            return {
                ...state,
                dcpdfLoading: true,
            }
        }
        case PDF_GENERATE_DELIVERY_SUCCESS: {
            return {
                ...state,
                dcpdfLoading: false,
                dcpdfSuccess: true,
            }
        }
        case PDF_GENERATE_DELIVERY_ERROR: {
            return {
                ...state,
                dcpdfLoading: false,
                dcpdfSuccess: false,
                dcpdfError: true
            }
        }
        case PDF_S3_URL: {
            return {
                ...state,
            }
        }
        case PDF_S3_URL_SUCCESS: {
            return {
                ...state,
                loading:false,
                success:true,
                s3pdfurl: action.payload,
            }
        }
        case PDF_S3_URL_ERROR: {
            return {
                ...state,
                loading:false,
                error:true,
                s3pdfurl:{}
            }
        }
        case GET_RECONCILE_REPORT: {
            return {
                ...state,
            }
        }
        case GET_RECONCILE_REPORT_SUCCESS: {
            return {
                ...state,
                loading:false,
                success:true,
                reconcileData: action.payload,
            }
        }
        case GET_RECONCILE_REPORT_ERROR: {
            return {
                ...state,
                loading:false,
                success:false,
                error: true
            }
        }
        case actionTypes.QR_Code_GENERATE_PLAN: {
            return {
                ...state,
                planQRLoading: true,
            }
        }
        case actionTypes.QR_Code_GENERATE_PLAN_SUCCESS: {
            return {
                ...state,
                planQRLoading: false,
                planQRSuccess: true,
            }
        }
        case actionTypes.QR_Code_GENERATE_PLAN_ERROR: {
            return {
                ...state,
                planQRLoading: false,
                planQRSuccess: false,
                planQRError: true
            }
        }
        
        case actionTypes.QR_GENERATE_INWARD: {
            return {
                ...state,
                QrLoading: true,
            }
        }
        case actionTypes.QR_GENERATE_INWARD_SUCCESS: {
            return {
                ...state,
                QrLoading: false,
                QrSuccess: true,
            }
        }
        case actionTypes.QR_GENERATE_INWARD_ERROR: {
            return {
                ...state,
                QrLoading: false,
                QrSuccess: false,
                QrError: true
            }
        }
        case GET_PACKET_WISE_PRICE_DC_REQUEST: {
            return {
                ...state,
            }
        }
        case GET_PACKET_WISE_PRICE_DC_SUCCESS: {
            return {
                ...state,
                loading:false,
                success:true,
                packetwisePriceDC: action.payload,
            }
        }
        case GET_PACKET_WISE_PRICE_DC_ERROR: {
            return {
                ...state,
                loading:false,
                success:false,
                error: true
            }
        }
        
        default:
            return state;
    }
}
