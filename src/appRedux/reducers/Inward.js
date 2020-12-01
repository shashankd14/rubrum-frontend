import {
    FETCH_INWARD_LIST_REQUEST,
    FETCH_INWARD_LIST_SUCCESS,
    FETCH_INWARD_LIST_ERROR,

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
    REQUEST_SAVE_SLITTING_DETAILS,
    SAVE_SLITTING_DETAILS_SUCCESS,
    SAVE_SLITTING_DETAILS_ERROR,
    REQUEST_SAVE_CUTTING_DETAILS,
    SAVE_CUTTING_DETAILS_SUCCESS,
    SAVE_CUTTING_DETAILS_ERROR,
    RESET_INSTRUCTION_FORM
} from "../../constants/ActionTypes";

const INIT_STATE = {
    inwardList: [],
    loading: false,
    success: false,
    error: false,
    inward: {},
    inwardSubmitLoading: false,
    inwardSubmitSuccess: false,
    inwardSubmitError: false,
    planLoading: false,
    planSuccess: false,
    planError: false,
    plan: {},
    process: {},
    instructionSaveLoading: false,
    instructionSaveSuccess: false,
    instructionSaveError: false,
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
                inwardList: action.inwardList
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
                inward: action.inward
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
                inwardSubmitLoading: false,
                inwardSubmitSuccess: true
            }
        }
        case SUBMIT_INWARD_ERROR: {
            return {
                ...state,
                inwardSubmitLoading: false,
                inwardSubmitError: true
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
                inward: {},
            }
        }
        case REQUEST_SAVE_CUTTING_DETAILS: {
            return {
                ...state,
                instructionSaveLoading: true,
                instructionSaveSuccess: false,
                instructionSaveError: false,
            }
        }
        case SAVE_CUTTING_DETAILS_SUCCESS: {
            return {
                ...state,
                instructionSaveLoading: false,
                instructionSaveSuccess: true,
                instructionSaveError: false,
            }
        }
        case SAVE_CUTTING_DETAILS_ERROR: {
            return {
                ...state,
                instructionSaveLoading: false,
                instructionSaveSuccess: false,
                instructionSaveError: true,
            }
        }
        case REQUEST_SAVE_SLITTING_DETAILS: {
            return {
                ...state,
                instructionSaveLoading: true,
                instructionSaveSuccess: false,
                instructionSaveError: false,
            }
        }
        case SAVE_SLITTING_DETAILS_SUCCESS: {
            return {
                ...state,
                instructionSaveLoading: false,
                instructionSaveSuccess: true,
                instructionSaveError: false,
            }
        }
        case SAVE_SLITTING_DETAILS_ERROR: {
            return {
                ...state,
                instructionSaveLoading: false,
                instructionSaveSuccess: false,
                instructionSaveError: true,
            }
        }
        case RESET_INSTRUCTION_FORM: {
            return {
                ...state,
                instructionSaveLoading: false,
                instructionSaveSuccess: false,
                instructionSaveError: false,
            }
        }
        default:
            return state;
    }
}
