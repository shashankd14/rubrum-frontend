import {
    FETCH_INWARD_LIST_REQUEST,
    FETCH_INWARD_LIST_SUCCESS,
    FETCH_INWARD_LIST_ERROR,

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

    FETCH_MATERIAL_GRADE_LIST_REQUEST,
    FETCH_MATERIAL_GRADE_LIST_SUCCESS,
    FETCH_MATERIAL_GRADE_LIST_ERROR,

    SET_INWARD_SELECTED_FOR_DELIVERY,
    POST_DELIVERY_CONFORM_REQUESTED,
    POST_DELIVERY_CONFORM_SUCCESS,
    POST_DELIVERY_CONFORM_ERROR,
    FETCH_INWARD_LIST_BY_INSTRUCTION_REQUEST,
    FETCH_INWARD_LIST_BY_INSTRUCTION_REQUEST_SUCCESS,
    FETCH_INWARD_LIST_BY_INSTRUCTION_REQUEST_ERROR
} from "../../constants/ActionTypes";

export const fetchInwardList = () => ({
  type: FETCH_INWARD_LIST_REQUEST,
});

export const fetchInwardListSuccess = (inwardList) => ({
    type: FETCH_INWARD_LIST_SUCCESS,
    inwardList
});

export const fetchInwardListError = (error) => ({
    type: FETCH_INWARD_LIST_ERROR,
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
export const updateInstruction = (instruction) => ({
    type: REQUEST_UPDATE_INSTRUCTION_DETAILS,
    instruction
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

export const setInwardSelectedForDelivery = (payload) =>  ({
    type: SET_INWARD_SELECTED_FOR_DELIVERY,
    payload:payload
})

export const postDeliveryConform = (payload) => ({
    type: POST_DELIVERY_CONFORM_REQUESTED,
    payload:payload
})

export const postDeliveryConformSuccess = (payload) => ({
    type: POST_DELIVERY_CONFORM_SUCCESS,
    payload:payload
})

export const postDeliveryConformError = (error) => ({
    type: POST_DELIVERY_CONFORM_ERROR,
    payload:error
})

export const getCoilsByInstructionId = (partyId) => ({
    type: FETCH_INWARD_LIST_BY_INSTRUCTION_REQUEST,
    partyId
});

export const getCoilsByInstructionIdSuccess = (payload) => ({
    type: FETCH_INWARD_LIST_BY_INSTRUCTION_REQUEST_SUCCESS,
    payload
});

export const getCoilsByInstructionIdError = (error) => ({
    type: FETCH_INWARD_LIST_BY_INSTRUCTION_REQUEST_ERROR,
    error
});