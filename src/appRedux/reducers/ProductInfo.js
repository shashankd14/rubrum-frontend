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
    FETCH_PRODUCT_FORMS_ERROR
    ,
} from "../../constants/ActionTypes";

const INIT_STATE = {
    brandList: [],
    loading: false,
    error: false,
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
        default:
            return state;
    }
}
