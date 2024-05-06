import {
    FETCH_DV_MATERIAL_LIST_REQUEST,
    FETCH_DV_MATERIAL_LIST_SUCCESS,
    FETCH_DV_MATERIAL_LIST_ERROR,
    ADD_DV_MATERIAL_REQUEST,
    ADD_DV_MATERIAL_SUCCESS,
    ADD_DV_MATERIAL_ERROR,
    FETCH_DV_MATERIAL_LIST_ID_REQUEST,
    FETCH_DV_MATERIAL_LIST_ID_SUCCESS,
    FETCH_DV_MATERIAL_LIST_ID_ERROR,
    UPDATE_DV_MATERIAL_REQUEST,
    UPDATE_DV_MATERIAL_SUCCESS,
    UPDATE_DV_MATERIAL_ERROR,
    RESET_DV_MATERIAL_REQUEST,
} from "../../constants/ActionTypes";

const INIT_STATE = {
    DVMaterialList: [],
    DVMaterialID: {},
    loading: false,
    error: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_DV_MATERIAL_LIST_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_DV_MATERIAL_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                DVMaterialList: action.DVMaterialList
            }
        }
        case FETCH_DV_MATERIAL_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                DVMaterialList: [],
                error: true
            }
        }

        case ADD_DV_MATERIAL_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case ADD_DV_MATERIAL_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case ADD_DV_MATERIAL_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_DV_MATERIAL_LIST_ID_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_DV_MATERIAL_LIST_ID_SUCCESS: {
            return {
                ...state,
                loading: false,
                DVMaterialID: action.DVmaterial
            }
        }
        case FETCH_DV_MATERIAL_LIST_ID_ERROR: {
            return {
                ...state,
                loading: false,
                DVMaterialID: {},
                error: true
            }
        }

        case RESET_DV_MATERIAL_REQUEST: {
            return {
                ...state,
                DVMaterial: {}
            }
        }

        case UPDATE_DV_MATERIAL_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }
        case UPDATE_DV_MATERIAL_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }
        case UPDATE_DV_MATERIAL_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        // case FETCH_DV_MATERIAL_GRADES: {
        //     return {
        //         ...state,
        //         loading: true
        //     }
        // }
        // case FETCH_DV_MATERIAL_GRADES_SUCCESS: {
        //     return {
        //         ...state,
        //         loading: false,
        //         operation: "fetchMaterialGrades"
        //     }
        // }
        // case FETCH_DV_MATERIAL_GRADES_ERROR: {
        //     return {
        //         ...state,
        //         loading: false,
        //         error: true,
        //     }
        // }

        // case FETCH_WIDTHS: {
        //     return {
        //         ...state,
        //         loading: true
        //     }
        // }
        // case FETCH_WIDTHS_SUCCESS: {
        //     return {
        //         ...state,
        //         loading: false,
        //         operation: "fetchWidths"
        //     }
        // }
        // case FETCH_WIDTHS_ERROR: {
        //     return {
        //         ...state,
        //         loading: false,
        //         error: true,
        //     }
        // }

        // case FETCH_LENGTHS: {
        //     return {
        //         ...state,
        //         loading: true
        //     }
        // }
        // case FETCH_LENGTHS_SUCCESS: {
        //     return {
        //         ...state,
        //         loading: false,
        //         operation: "fetchLengths"
        //     }
        // }
        // case FETCH_LENGTHS_ERROR: {
        //     return {
        //         ...state,
        //         loading: false,
        //         error: true,
        //     }
        // }

        // case FETCH_THICKNESS: {
        //     return {
        //         ...state,
        //         loading: true
        //     }
        // }
        // case FETCH_THICKNESS_SUCCESS: {
        //     return {
        //         ...state,
        //         loading: false,
        //         operation: "fetchThikness"
        //     }
        // }
        // case FETCH_THICKNESS_ERROR: {
        //     return {
        //         ...state,
        //         loading: false,
        //         error: true,
        //     }
        // }

        default:
            return state;
    }
}
