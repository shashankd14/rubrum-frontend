import {
    FETCH_INWARD_LIST_REQUEST,
    FETCH_INWARD_LIST_SUCCESS,
    FETCH_INWARD_LIST_ERROR,

    FETCH_WIP_INWARD_LIST_REQUEST,
    FETCH_WIP_INWARD_LIST_SUCCESS,
    FETCH_WIP_INWARD_LIST_ERROR,

    CHECK_COIL_EXISTS,

    SET_INWARD_DETAILS,
    SUBMIT_INWARD_ENTRY,
    SUBMIT_INWARD_SUCCESS,
    SUBMIT_INWARD_ERROR,
    CHECK_COIL_EXISTS_SUCCESS,
    CHECK_COIL_EXISTS_ERROR,
    FETCH_INWARD_LIST_BY_PARTY_REQUEST,
    FETCH_INWARD_LIST_BY_PARTY_SUCCESS,
    FETCH_INWARD_LIST_BY_PARTY_ERROR,

    FETCH_INWARD_PLAN_DETAILS_REQUESTED,
    FETCH_INWARD_PLAN_DETAILS_SUCCESS,
    FETCH_INWARD_PLAN_DETAILS_ERROR,
    SET_PROCESS_DETAILS,
    REQUEST_SAVE_CUTTING_DETAILS,
    SAVE_CUTTING_DETAILS_SUCCESS,
    SAVE_CUTTING_DETAILS_ERROR,

    REQUEST_SAVE_SLITTING_DETAILS,
    SAVE_SLITTING_DETAILS_SUCCESS,
    SAVE_SLITTING_DETAILS_ERROR,

    REQUEST_UPDATE_INSTRUCTION_DETAILS, 
    REQUEST_UPDATE_INSTRUCTION_DETAILS_SUCCESS,
    REQUEST_UPDATE_INSTRUCTION_DETAILS_ERROR,
   

    RESET_INSTRUCTION_FORM,
    RESET_INWARD_FORM,
    RESET_DELETE_INWARD,
    REST_ISDELETED,

    FETCH_MATERIAL_GRADE_LIST_REQUEST,
    FETCH_MATERIAL_GRADE_LIST_SUCCESS,
    FETCH_MATERIAL_GRADE_LIST_ERROR,

    SET_INWARD_SELECTED_FOR_DELIVERY,
    POST_DELIVERY_CONFIRM_REQUESTED,
    POST_DELIVERY_CONFIRM_SUCCESS,
    POST_DELIVERY_CONFIRM_ERROR,
    FETCH_INWARD_LIST_BY_INSTRUCTION_REQUEST,
    FETCH_INWARD_LIST_BY_INSTRUCTION_REQUEST_SUCCESS,
    FETCH_INWARD_LIST_BY_INSTRUCTION_REQUEST_ERROR,
    FETCH_INWARD_INSTRUCTION_DETAILS_REQUESTED,
    FETCH_INWARD_INSTRUCTION_DETAILS_SUCCESS,
    FETCH_INWARD_INSTRUCTION_DETAILS_ERROR,
    FETCH_INWARD_INSTRUCTION_WIP_DETAILS_REQUESTED,
    FETCH_INWARD_INSTRUCTION_WIP_DETAILS_SUCCESS,
    FETCH_INWARD_INSTRUCTION_WIP_DETAILS_ERROR,
    SAVE_UNPROCESSED_FOR_DELIVERY,
    SAVE_UNPROCESSED_FOR_DELIVERY_SUCCESS,
    SAVE_UNPROCESSED_FOR_DELIVERY_ERROR,
    FETCH_INWARD_LIST_BY_ID,
    FETCH_INWARD_LIST_BY_ID_SUCCESS,
    FETCH_INWARD_LIST_BY_ID_ERROR,
    UPDATE_INWARD_LIST,
    UPDATE_INWARD_LIST_SUCCESS,
    UPDATE_INWARD_LIST_ERROR,
    DELETE_INWARD_LIST_BY_ID,
    DELETE_INWARD_LIST_BY_ID_ERROR,
    DELETE_INWARD_LIST_BY_ID_SUCCESS,
    DELETE_INSTRUCTION_BY_ID,
    DELETE_INSTRUCTION_BY_ID_ERROR,
    DELETE_INSTRUCTION_BY_ID_SUCCESS,
    DELETE_INSTRUCTION_BY_ID_SUCCESS_SLIT,
    CHECK_BATCH_NO_EXIST,
    CHECK_BATCH_NO_EXIST_ERROR,
    CHECK_BATCH_NO_EXIST_SUCCESS,
    INSTRUCTION_GROUP_SAVE,
    INSTRUCTION_GROUP_SAVE_SUCCESS,
    INSTRUCTION_GROUP_SAVE_ERROR,
    PDF_GENERATE_INWARD,
    PDF_GENERATE_INWARD_ERROR,
    PDF_GENERATE_INWARD_SUCCESS,
    PDF_GENERATE_DELIVERY,
    PDF_GENERATE_DELIVERY_SUCCESS,
    PDF_GENERATE_DELIVERY_ERROR,
    PDF_S3_URL,
    PDF_S3_URL_SUCCESS,
    PDF_S3_URL_ERROR,
    GET_RECONCILE_REPORT,
    GET_RECONCILE_REPORT_SUCCESS,
    GET_RECONCILE_REPORT_ERROR,
    GET_PACKET_WISE_PRICE_DC_REQUEST,
    GET_PACKET_WISE_PRICE_DC_SUCCESS,
    GET_PACKET_WISE_PRICE_DC_ERROR
} from "../../constants/ActionTypes";
import * as actionTypes from "../../constants/ActionTypes";

export const fetchInwardList = (page, pageSize, searchValue, partyId, sortOrder, sortColumn) => ({
    type: FETCH_INWARD_LIST_REQUEST,
    page: page,
    pageSize: 15,
    searchValue: searchValue,
    partyId: partyId,
    sortOrder: sortOrder,
    sortColumn: sortColumn
});

export const fetchInwardListSuccess = (inwardList, totalItems) => ({
    type: FETCH_INWARD_LIST_SUCCESS,
    inwardList,
    totalItems
});

export const fetchInwardListError = (error) => ({
    type: FETCH_INWARD_LIST_ERROR,
    error
});
//inward search if data is not found
export const coilNotFound = (totalItems) => ({
    type: actionTypes.COIL_NOT_FOUND,
    totalItems: 'Coil not found.'
});
//inward with old api
export const fetchInwardListOldAPI = (page, pageSize, searchValue, partyId) => ({
    type: actionTypes.FETCH_INWARD_LIST_WITH_OLD_API_REQUEST,
    page,
    pageSize,
    searchValue,
    partyId
});

export const fetchInwardListOldAPISuccess = (inwardList, totalItems) => ({
    type: actionTypes.FETCH_INWARD_LIST_WITH_OLD_API_SUCCESS,
    inwardList,
    totalItems
});

export const fetchInwardListOldAPIError = (error) => ({
    type: actionTypes.FETCH_INWARD_LIST_WITH_OLD_API_ERROR,
    error
});

export const fetchWIPInwardList = (page, pageSize, searchValue, partyId) => ({
    type: FETCH_WIP_INWARD_LIST_REQUEST,
    page,
    pageSize,
    searchValue,
    partyId
});

export const fetchWIPInwardListSuccess = (wipList, totalItems) => ({
    type: FETCH_WIP_INWARD_LIST_SUCCESS,
    wipList,
    totalItems
});

export const fetchWIPInwardListError = (error) => ({
    type: FETCH_WIP_INWARD_LIST_ERROR,
    error
});

export const setInwardDetails = (inward) => ({
    type: SET_INWARD_DETAILS,
    inward
});

export const checkIfCoilExists = (coilNumber) => ({
    type: CHECK_COIL_EXISTS,
    coilNumber
});

export const checkDuplicateCoilSuccess = (status) => ({
    type: CHECK_COIL_EXISTS_SUCCESS,
    status
})

export const checkDuplicateCoilError = (error) => ({
    type: CHECK_COIL_EXISTS_ERROR,
    error
})
export const checkCustomerBatchNumber = (customerBatchId) => ({
    type: CHECK_BATCH_NO_EXIST,
    customerBatchId
});

export const checkCustomerBatchNumberSuccess = (status) => ({
    type: CHECK_BATCH_NO_EXIST_SUCCESS,
    status
})

export const checkCustomerBatchNumberError = (error) => ({
    type: CHECK_BATCH_NO_EXIST_ERROR,
    error
})

export const getGradeByMaterialId = (materialId) => ({
    type: FETCH_MATERIAL_GRADE_LIST_REQUEST,
    materialId
});

export const getGradeByMaterialIdSuccess = (payload) => ({
    type: FETCH_MATERIAL_GRADE_LIST_SUCCESS,
    payload
});

export const getGradeByMaterialIdError = (error) => ({
    type: FETCH_MATERIAL_GRADE_LIST_ERROR,
    error
});

export const fetchPartyListById = (inwardEntryId) => ({
    type: FETCH_INWARD_LIST_BY_ID,
    inwardEntryId
});

export const fetchPartyInwardListByIdSuccess = (payload) => ({
    type: FETCH_INWARD_LIST_BY_ID_SUCCESS,
    payload
});

export const fetchPartyInwardListByIdError = (error) => ({
    type: FETCH_INWARD_LIST_BY_ID_ERROR,
    error
});
export const updateInward = (inward) => ({
    type: UPDATE_INWARD_LIST,
    inward
});

export const updateInwardSuccess = (payload) => ({
    type: UPDATE_INWARD_LIST_SUCCESS,
    payload
});

export const updateInwardError = (error) => ({
    type: UPDATE_INWARD_LIST_ERROR,
    error
});

export const submitInwardEntry = (inward) => ({
    type: SUBMIT_INWARD_ENTRY,
    inward
});

export const submitInwardSuccess = (inward) => ({
    type: SUBMIT_INWARD_SUCCESS,
    inward
});

export const submitInwardError = (inward) => ({
    type: SUBMIT_INWARD_ERROR,
    inward
});

export const getCoilsByPartyId = (partyId) => ({
    type: FETCH_INWARD_LIST_BY_PARTY_REQUEST,
    partyId
});

export const getCoilsByPartyIdSuccess = (payload) => ({
    type: FETCH_INWARD_LIST_BY_PARTY_SUCCESS,
    payload
});

export const getCoilsByPartyIdError = (error) => ({
    type: FETCH_INWARD_LIST_BY_PARTY_ERROR,
    error
});

export const getCoilPlanDetails = (coilNumber) => ({
    type: FETCH_INWARD_PLAN_DETAILS_REQUESTED,
    coilNumber
})

export const getCoilPlanDetailsSuccess = (payload) => ({
    type: FETCH_INWARD_PLAN_DETAILS_SUCCESS,
    payload
})

export const getCoilPlanDetailsError = (error) => ({
    type: FETCH_INWARD_PLAN_DETAILS_ERROR,
    error
})

export const setProcessDetails = (processDetails) => ({
    type: SET_PROCESS_DETAILS,
    processDetails
});

export const saveCuttingInstruction = (cuttingDetails) => ({
    type: REQUEST_SAVE_CUTTING_DETAILS,
    cuttingDetails
});

export const saveCuttingInstructionSuccess = (payload) => ({
    type: SAVE_CUTTING_DETAILS_SUCCESS,
    payload
});

export const saveCuttingInstructionError = (error) => ({
    type: SAVE_CUTTING_DETAILS_ERROR,
    error
});
export const instructionGroupsave = (groupDetails) => ({
    type: INSTRUCTION_GROUP_SAVE,
    groupDetails
});

export const instructionGroupsaveSuccess = (payload) => ({
    type: INSTRUCTION_GROUP_SAVE_SUCCESS,
    payload
});

export const instructionGroupsaveError = (error) => ({
    type: INSTRUCTION_GROUP_SAVE_ERROR,
    error
});

export const saveSlittingInstruction = (slittingDetails) => ({
    type: REQUEST_SAVE_SLITTING_DETAILS,
    slittingDetails
});

export const saveSlittingInstructionSuccess = (payload) => ({
    type: SAVE_SLITTING_DETAILS_SUCCESS,
    payload
});

export const saveSlittingInstructionError = (error) => ({
    type: SAVE_SLITTING_DETAILS_ERROR,
    error
});
export const updateInstruction = (coil) => ({
    type: REQUEST_UPDATE_INSTRUCTION_DETAILS,
    coil
});
export const updateInstructionSuccess = (payload) => ({
    type: REQUEST_UPDATE_INSTRUCTION_DETAILS_SUCCESS,
    payload
});
export const updateInstructionError = (payload) => ({
    type: REQUEST_UPDATE_INSTRUCTION_DETAILS_ERROR,
    payload
});
export const resetInstruction = () => ({
    type: RESET_INSTRUCTION_FORM,
})

export const resetInwardForm = () => ({
    type: RESET_INWARD_FORM,
})
export const resetDeleteInward = () => ({
    type: RESET_DELETE_INWARD,
})

export const resetIsDeleted = () => ({
    type: REST_ISDELETED,
})

export const setInwardSelectedForDelivery = (payload) =>  ({
    type: SET_INWARD_SELECTED_FOR_DELIVERY,
    payload: payload
})

export const postDeliveryConfirm = (payload) => ({
    type: POST_DELIVERY_CONFIRM_REQUESTED,
    payload: payload
})

export const postDeliveryConfirmSuccess = (payload) => ({
    type: POST_DELIVERY_CONFIRM_SUCCESS,
    payload: payload
})

export const postDeliveryConfirmError = (error) => ({
    type: POST_DELIVERY_CONFIRM_ERROR,
    payload: error
})
export const getInstructionById = (instructionId) => ({
    type: FETCH_INWARD_INSTRUCTION_DETAILS_REQUESTED,
    instructionId
})

export const getInstructionByIdSuccess = (payload) => ({
    type: FETCH_INWARD_INSTRUCTION_DETAILS_SUCCESS,
    payload
})

export const getInstructionByIdError = (error) => ({
    type: FETCH_INWARD_INSTRUCTION_DETAILS_ERROR,
    error
})
export const getInstructionWipList = () => ({
    type: FETCH_INWARD_INSTRUCTION_WIP_DETAILS_REQUESTED
})

export const getInstructionWipListSuccess = (inwardList) => ({
    type: FETCH_INWARD_INSTRUCTION_WIP_DETAILS_SUCCESS,
    inwardList
})

export const getInstructionWipListError = (error) => ({
    type: FETCH_INWARD_INSTRUCTION_WIP_DETAILS_ERROR,
    error
})

export const saveUnprocessedDelivery = (inwardEntryId) => ({
    type: SAVE_UNPROCESSED_FOR_DELIVERY,
    inwardEntryId
});

export const saveUnprocessedDeliverySuccess = (payload) => ({
    type: SAVE_UNPROCESSED_FOR_DELIVERY_SUCCESS,
    payload
});

export const saveUnprocessedDeliveryError = (error) => ({
    type: SAVE_UNPROCESSED_FOR_DELIVERY_ERROR,
    error
});
export const deleteInwardEntryById = (inwardEntryId) => ({
    type: DELETE_INWARD_LIST_BY_ID,
    inwardEntryId
});

export const deleteInwardEntryByIdSuccess = (payload) => ({
    type: DELETE_INWARD_LIST_BY_ID_SUCCESS,
    payload
});

export const deleteInwardEntryByIdError = (error) => ({
    type: DELETE_INWARD_LIST_BY_ID_ERROR,
    error
});
export const deleteInstructionById = (payload, param) => ({
    type: DELETE_INSTRUCTION_BY_ID,
    payload,
    param
});

export const deleteInstructionByIdSuccess = (payload, process) => 
    process === 'slit' ? ({
        type: DELETE_INSTRUCTION_BY_ID_SUCCESS_SLIT,
        payload
    }) : ({
        type: DELETE_INSTRUCTION_BY_ID_SUCCESS,
        payload
    });

export const deleteInstructionByIdError = (error) => ({
    type: DELETE_INSTRUCTION_BY_ID_ERROR,
    error
});
export const pdfGenerateInward = (payload) => ({
    type: PDF_GENERATE_INWARD,
    payload
});

export const pdfGenerateSuccess = (payload) => ({
    type: PDF_GENERATE_INWARD_SUCCESS,
    payload
});

export const pdfGenerateError = (error) => ({
    type: PDF_GENERATE_INWARD_ERROR,
    error
});
export const generateDCPdf = (payload) => ({
    type: PDF_GENERATE_DELIVERY,
    payload
});

export const generateDCPdfSuccess = (payload) => ({
    type: PDF_GENERATE_DELIVERY_SUCCESS,
    payload
});

export const generateDCPdfError = (error) => ({
    type: PDF_GENERATE_DELIVERY_ERROR,
    error
});
export const getS3PDFUrl = (inwardEntryId) => ({
    type: PDF_S3_URL,
    inwardEntryId
});

export const getS3PDFUrlSuccess = (payload) => ({
    type: PDF_S3_URL_SUCCESS,
    payload
});

export const getS3PDFUrlError = (error) => ({
    type: PDF_S3_URL_ERROR,
    error
});
export const getReconcileReport = (coilNumber) => ({
    type: GET_RECONCILE_REPORT,
    coilNumber
});
export const getReconcileReportSuccess = (payload) => ({
    type: GET_RECONCILE_REPORT_SUCCESS,
    payload
});
export const getReconcileReportError = (error) => ({
    type: GET_RECONCILE_REPORT_ERROR,
    error
});
export const QrCodeGeneratePlan = (payload) => ({
    type: actionTypes.QR_Code_GENERATE_PLAN,
    payload
});

export const QrCodeGeneratePlanSuccess = (payload) => ({
    type: actionTypes.QR_Code_GENERATE_PLAN_SUCCESS,
    payload
});

export const QrCodeGeneratePlanError = (error) => ({
    type: actionTypes.QR_Code_GENERATE_PLAN_ERROR,
    error
});
export const QrGenerateInward = (payload) => ({
    type: actionTypes.QR_GENERATE_INWARD,
    payload
});

export const QrGenerateInwardSuccess = (payload) => ({
    type: actionTypes.QR_GENERATE_INWARD_SUCCESS,
    payload
});

export const QrGenerateInwardError = (error) => ({
    type: actionTypes.QR_GENERATE_INWARD_ERROR,
    error
});

export const getPacketwisePriceDC = (payload) => ({
    type: GET_PACKET_WISE_PRICE_DC_REQUEST,
    payload
});
export const getPacketwisePriceDCSuccess = (payload) => ({
    type: GET_PACKET_WISE_PRICE_DC_SUCCESS,
    payload
});
export const getPacketwisePriceDCError = (error) => ({
    type: GET_PACKET_WISE_PRICE_DC_ERROR,
    error
});

export const getPacketwisePriceDCFullHandling = (payload) => ({
    type: actionTypes.GET_PACKET_WISE_PRICE_DC_FULL_HANDLING_REQUEST,
    payload
});
export const getPacketwisePriceDCFullHandlingSuccess = (payload) => ({
    type: actionTypes.GET_PACKET_WISE_PRICE_DC_FULL_HANDLING_SUCCESS,
    payload
});
export const getPacketwisePriceDCFullHandlingError = (error) => ({
    type: actionTypes.GET_PACKET_WISE_PRICE_DC_FULL_HANDLING_ERROR,
    error
});

