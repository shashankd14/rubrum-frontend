import {
    FETCH_PRODUCT_BRANDS, 
    FETCH_PRODUCT_BRANDS_SUCCESS,
    FETCH_PRODUCT_BRANDS_ERROR,
    FETCH_PRODUCTS,
    FETCH_PRODUCTS_SUCCESS,
    FETCH_PRODUCTS_ERROR,
    
    FETCH_PRODUCT_UOM,
    FETCH_PRODUCT_UOM_SUCCESS,
    FETCH_PRODUCT_UOM_ERROR,

    FETCH_PRODUCT_FORMS,
    FETCH_PRODUCT_FORMS_SUCCESS,
    FETCH_PRODUCT_FORMS_ERROR,

    FETCH_PRODUCT_GRADES, 
    FETCH_PRODUCT_GRADES_SUCCESS, 
    FETCH_PRODUCT_GRADES_ERROR,
    
    FETCH_PRODUCT_SUB_GRADES, 
    FETCH_PRODUCT_SUB_GRADES_SUCCESS, 
    FETCH_PRODUCT_SUB_GRADES_ERROR,
   
    FETCH_PRODUCT_SURFACE_LIST, 
    FETCH_PRODUCT_SURFACE_LIST_SUCCESS, 
    FETCH_PRODUCT_SURFACE_LIST_ERROR,
   
    FETCH_PRODUCT_COATING_LIST, 
    FETCH_PRODUCT_COATING_LIST_SUCCESS, 
    FETCH_PRODUCT_COATING_LIST_ERROR,

    FETCH_PRODUCTS_REFINED, 
    FETCH_PRODUCTS_REFINED_SUCCESS, 
    FETCH_PRODUCTS_REFINED_ERROR,
} from "../../constants/ActionTypes";

const INIT_STATE = {
    brandList: [],
    loading: false,
    error: false,
    refinedProducts: []
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_PRODUCT_BRANDS: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_PRODUCT_BRANDS_SUCCESS: {
            return {
                ...state,
                loading: false,
                brandList: action.brandsList
            }
        }
        case FETCH_PRODUCT_BRANDS_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_PRODUCTS: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_PRODUCTS_SUCCESS: {
            return {
                ...state,
                loading: false,
                productsList: action.productsList
            }
        }
        case FETCH_PRODUCTS_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }
        case FETCH_PRODUCT_FORMS: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_PRODUCT_FORMS_SUCCESS: {
            return {
                ...state,
                loading: false,
                productsFormsList: action.productsFormsList
            }
        }
        case FETCH_PRODUCT_FORMS_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }
        case FETCH_PRODUCT_UOM: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_PRODUCT_UOM_SUCCESS: {
            return {
                ...state,
                loading: false,
                productUomList: action.productUomList
            }
        }
        case FETCH_PRODUCT_UOM_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_PRODUCT_GRADES: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_PRODUCT_GRADES_SUCCESS: {
            return {
                ...state,
                loading: false,
                productGradesList: action.productGradesList
            }
        }
        case FETCH_PRODUCT_GRADES_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }
        case FETCH_PRODUCT_SUB_GRADES: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_PRODUCT_SUB_GRADES_SUCCESS: {
            return {
                ...state,
                loading: false,
                productSubGradesList: action.productSubGradesList
            }
        }
        case FETCH_PRODUCT_SUB_GRADES_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }
        
        case FETCH_PRODUCT_SURFACE_LIST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_PRODUCT_SURFACE_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                productSurfaceList: action.productSurfaceList
            }
        }
        case FETCH_PRODUCT_SURFACE_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_PRODUCT_COATING_LIST: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_PRODUCT_COATING_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                productCoatingList: action.productCoatingList
            }
        }
        case FETCH_PRODUCT_COATING_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        case FETCH_PRODUCTS_REFINED: {
            return {
                ...state,
                loading: true
            }
        }
        case FETCH_PRODUCTS_REFINED_SUCCESS: {
            return {
                ...state,
                loading: false,
                refinedProducts: action.productsList?.content
            }
        }
        case FETCH_PRODUCTS_REFINED_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        default:
            return state;
    }
}
