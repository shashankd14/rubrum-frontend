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

    FETCH_PRODUCTS_THICKNESS_SUCCESS,
    FETCH_PRODUCTS_WIDTH_SUCCESS,
    FETCH_PRODUCTS_OD_SUCCESS,
    FETCH_PRODUCTS_ID_SUCCESS,
    FETCH_PRODUCTS_LENGTH_SUCCESS,
    FETCH_PRODUCTS_NB_SUCCESS
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

export const getProductGrades = (productId) => ({
    type: FETCH_PRODUCT_GRADES,
    productId
});

export const getProductGradesSuccess = (productGradesList) => ({
    type: FETCH_PRODUCT_GRADES_SUCCESS,
    productGradesList
});

export const getProductGradesError = (error) => ({
    type: FETCH_PRODUCT_GRADES_ERROR,
    error
});

export const getProductSubGrades = (gradeId) => ({
    type: FETCH_PRODUCT_SUB_GRADES,
    gradeId
});

export const getProductSubGradesSuccess = (productSubGradesList) => ({
    type: FETCH_PRODUCT_SUB_GRADES_SUCCESS,
    productSubGradesList
});

export const getProductSubGradesError = (error) => ({
    type: FETCH_PRODUCT_SUB_GRADES_ERROR,
    error
});

export const getProductSurfaceList = (productId) => ({
    type: FETCH_PRODUCT_SURFACE_LIST,
    productId
});

export const getProductSurfaceListSuccess = (productSurfaceList) => ({
    type: FETCH_PRODUCT_SURFACE_LIST_SUCCESS,
    productSurfaceList
});

export const getProductSurfaceListError = (error) => ({
    type: FETCH_PRODUCT_SURFACE_LIST_ERROR,
    error
});

export const getProductCoatingList = (productId) => ({
    type: FETCH_PRODUCT_COATING_LIST,
    productId
});

export const getProductCoatingListSuccess = (productCoatingList) => ({
    type: FETCH_PRODUCT_COATING_LIST_SUCCESS,
    productCoatingList
});

export const getProductCoatingListError = (error) => ({
    type: FETCH_PRODUCT_COATING_LIST_ERROR,
    error
});

export const getRefinedProducts = (allDetails, fieldType = '') => ({
    type: FETCH_PRODUCTS_REFINED,
    allDetails,
    fieldType
});

export const getRefinedProductsSuccess = (productsList) => ({
    type: FETCH_PRODUCTS_REFINED_SUCCESS,
    productsList,
});

export const getRefinedProductsError = (error) => ({
    type: FETCH_PRODUCTS_REFINED_ERROR,
    error
});

export const getProductThicknessSuccess = (productThicknesses) => ({
    type: FETCH_PRODUCTS_THICKNESS_SUCCESS,
    productThicknesses
});

export const getProductWidthSuccess = (productWidths) => ({
    type: FETCH_PRODUCTS_WIDTH_SUCCESS,
    productWidths
});

export const getProductLengthSuccess = (productLengths) => ({
    type: FETCH_PRODUCTS_LENGTH_SUCCESS,
    productLengths
});

export const getProductNbSuccess = (nb) => ({
    type: FETCH_PRODUCTS_NB_SUCCESS,
    nb
});

export const getProductOdSuccess = (productOd) => ({
    type: FETCH_PRODUCTS_OD_SUCCESS,
    productOd
});

export const getProductIdSuccess = (productID) => ({
    type: FETCH_PRODUCTS_ID_SUCCESS,
    productID
});