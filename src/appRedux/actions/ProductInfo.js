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
    
} from "../../constants/ActionTypes";

export const getProductBrands = (leafcategoryId) => ({
    type: FETCH_PRODUCT_BRANDS,
    leafcategoryId
});

export const getProductBrandsSuccess = (brandsList) => ({
    type: FETCH_PRODUCT_BRANDS_SUCCESS,
    brandsList
});

export const getProductBrandsError = (error) => ({
    type: FETCH_PRODUCT_BRANDS_ERROR,
    error
});

export const getProductsList = (brandId) => ({
    type: FETCH_PRODUCTS,
    brandId
});

export const getProductsListSuccess = (productsList) => ({
    type: FETCH_PRODUCTS_SUCCESS,
    productsList
});

export const getProductsListError = (error) => ({
    type: FETCH_PRODUCTS_ERROR,
    error
});

export const getProductForm = (productId) => ({
    type: FETCH_PRODUCT_FORMS,
    productId
});

export const getProductFormSuccess = (productsFormsList) => ({
    type: FETCH_PRODUCT_FORMS_SUCCESS,
    productsFormsList
});

export const getProductFormError = (error) => ({
    type: FETCH_PRODUCT_FORMS_ERROR,
    error
});

export const getProductUOM = (productId) => ({
    type: FETCH_PRODUCT_UOM,
    productId
});

export const getProductUOMSuccess = (productUomList) => ({
    type: FETCH_PRODUCT_UOM_SUCCESS,
    productUomList
});

export const getProductUOMError = (error) => ({
    type: FETCH_PRODUCT_UOM_ERROR,
    error
});