import { stubFalse } from "lodash";
import {
    FETCH_RATES_LIST_REQUEST,
    FETCH_RATES_LIST_SUCCESS,
    FETCH_RATES_LIST_ERROR,
    FETCH_PACKING_RATES_LIST_ERROR, 
    FETCH_PACKING_RATES_LIST_REQUEST, 
    FETCH_PACKING_RATES_LIST_SUCCESS,
    ADD_RATES_REQUEST,
    ADD_RATES_SUCCESS,
    ADD_RATES_ERROR,
    ADD_PACKING_RATES_REQUEST,
    ADD_PACKING_RATES_SUCCESS,
    ADD_PACKING_RATES_ERROR,
    FETCH_RATES_LIST_ID_REQUEST,
    FETCH_RATES_LIST_ID_SUCCESS,
    FETCH_RATES_LIST_ID_ERROR,
    FETCH_PACKING_RATES_LIST_ID_REQUEST,
    FETCH_PACKING_RATES_LIST_ID_SUCCESS,
    FETCH_PACKING_RATES_LIST_ID_ERROR,
    UPDATE_RATES_REQUEST,
    UPDATE_RATES_SUCCESS,
    UPDATE_RATES_ERROR,
    UPDATE_PACKING_RATES_REQUEST,
    UPDATE_PACKING_RATES_SUCCESS,
    UPDATE_PACKING_RATES_ERROR,
    RESET_RATES_REQUEST,
    RESET_PACKING_RATES_REQUEST,
    DELETE_RATES_BY_ID,
    DELETE_RATES_BY_ID_SUCCESS,
    DELETE_RATES_BY_ID_ERROR,
    ADD_ADDITIONAL_RATES_REQUEST,
    ADD_ADDITIONAL_RATES_SUCCESS,
    ADD_ADDITIONAL_RATES_ERROR,
    FETCH_STATIC_LIST_BY_PROCESSS,
    FETCH_STATIC_LIST_BY_PROCESSS_ERROR,
    FETCH_STATIC_LIST_BY_PROCESSS_SUCCESS,
    FETCH_ADDITIONAL_RATES_LIST_REQUEST_SUCCESS,
    FETCH_ADDITIONAL_RATES_LIST_REQUEST_ERROR,
    FETCH_ADDITIONAL_RATES_LIST_REQUEST,
    FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST,
    FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST_SUCCESS,
    FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST_ERROR,
    DELETE_ADDITIONAL_RATES_BY_ID,
    DELETE_ADDITIONAL_RATES_BY_ID_ERROR,
    DELETE_ADDITIONAL_RATES_BY_ID_SUCCESS,
    UPDATE_ADDITIONAL_RATES_ERROR,
    UPDATE_ADDITIONAL_RATES_REQUEST,
    UPDATE_ADDITIONAL_RATES_SUCCESS
} from "../../constants/ActionTypes";

const INIT_STATE = {
    ratesList: [],
    packingRateList: [],
    rates: {},
    packingRates: {},
    loading: false,
    error: false,
    addSuccess:false,
    deleteSuccess: false,
    addAdditionalSuccess:false,
    staticList:[],
    additionalRatesList:[],
    additionalRates:{},
    deleteAdditionalSuccess: false,
    updateAdditionalSuccess:false,
    updateAdditionalFailure: false,
    totalItems: 0,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_RATES_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_RATES_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                ratesList: action.ratesList.content,
                totalItems: action.ratesList.totalItems
            }
        }
        case FETCH_RATES_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                ratesList: [],
                error: true
            }
        }

        case FETCH_PACKING_RATES_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_PACKING_RATES_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                packingRateList: action.packingRateList
            }
        }
        case FETCH_PACKING_RATES_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                packingRateList: [],
                error: true
            }
        }

        case ADD_RATES_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case ADD_RATES_SUCCESS: {
            return {
                ...state,
                loading: false,
                addSuccess: true
            }
        }
        case ADD_RATES_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case ADD_PACKING_RATES_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case ADD_PACKING_RATES_SUCCESS: {
            return {
                ...state,
                loading: false,
            }
        }
        case ADD_PACKING_RATES_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_RATES_LIST_ID_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_RATES_LIST_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                rates: action.rates
            }
        }
        case FETCH_RATES_LIST_ID_ERROR: {
            return {
                ...state,
                loading: false,
                rates: {},
                error: true
            }
        }

        case FETCH_PACKING_RATES_LIST_ID_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_PACKING_RATES_LIST_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                packingRates: action.packingRates
            }
        }
        case FETCH_PACKING_RATES_LIST_ID_ERROR: {
            return {
                ...state,
                loading: false,
                packingRates: {},
                error: true
            }
        }

        case RESET_RATES_REQUEST: {
            return {
                ...state,
                loading:false,
                rates: {},
                deleteSuccess:false,
                addSuccess:false,
                addAdditionalSuccess:false,
                addAdditionalFailed:false,
                deleteAdditionalSuccess:false,
                updateAdditionalFailure:false,
                updateAdditionalSuccess:false,
                
            }
        }

        case RESET_PACKING_RATES_REQUEST: {
            return {
                ...state,
                packingRates: {}
            }
        }

        case UPDATE_RATES_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case UPDATE_RATES_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case UPDATE_RATES_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        } 

        case UPDATE_PACKING_RATES_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case UPDATE_PACKING_RATES_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case UPDATE_PACKING_RATES_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        } 
        case DELETE_RATES_BY_ID: {
            return {
                ...state,
                loading: true
            }
        }

        case DELETE_RATES_BY_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                deleteSuccess: true
            }
        }
        case DELETE_RATES_BY_ID_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }
        case ADD_ADDITIONAL_RATES_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case ADD_ADDITIONAL_RATES_SUCCESS: {
            return {
                ...state,
                loading: false,
                addAdditionalSuccess: true,
                addAdditionalFailed:false
            }
        }
        case ADD_ADDITIONAL_RATES_ERROR: {
            return {
                ...state,
                loading: false,
                addAdditionalFailed: true,
            }
        }
        case FETCH_STATIC_LIST_BY_PROCESSS: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_STATIC_LIST_BY_PROCESSS_SUCCESS: {
            return {
                ...state,
                loading: false,
                staticList: action.rates
            }
        }
        case FETCH_STATIC_LIST_BY_PROCESSS_ERROR: {
            return {
                ...state,
                loading: false,
                rates: {},
                error: true
            }
        }
        case FETCH_ADDITIONAL_RATES_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_ADDITIONAL_RATES_LIST_REQUEST_SUCCESS: {
            return {
                ...state,
                loading: false,
                additionalRatesList: action.ratesList
            }
        }
        case FETCH_ADDITIONAL_RATES_LIST_REQUEST_ERROR: {
            return {
                ...state,
                loading: false,
                additionalRatesList: [],
                error: true
            }
        }
        case FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST_SUCCESS: {
            return {
                ...state,
                loading: false,
                additionalRates: action.rates
            }
        }
        case FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST_ERROR: {
            return {
                ...state,
                loading: false,
                additionalRates: {},
                error: true
            }
        }
        case DELETE_ADDITIONAL_RATES_BY_ID: {
            return {
                ...state,
                loading: true
            }
        }
        case DELETE_ADDITIONAL_RATES_BY_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                deleteAdditionalSuccess: true
            }
        }
        case DELETE_ADDITIONAL_RATES_BY_ID_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }
        case UPDATE_ADDITIONAL_RATES_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case UPDATE_ADDITIONAL_RATES_SUCCESS: {
            return {
                ...state,
                loading: false,
                updateAdditionalSuccess:true
            }
        }
        case UPDATE_ADDITIONAL_RATES_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
                updateAdditionalFailure:true
            }
        }
        default:
            return state;
    }
}
