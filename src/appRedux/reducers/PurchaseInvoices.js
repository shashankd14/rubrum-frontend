import {
  FETCH_PURCHASE_INVOICES_LIST,
  FETCH_PURCHASE_INVOICES_LIST_SUCCESS,
  FETCH_PURCHASE_INVOICES_LIST_ERROR,
} from "../../constants/ActionTypes";

const INIT_STATE = {
  list: [],
  loading: false,
  error: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
      case FETCH_PURCHASE_INVOICES_LIST: {
        return {
          ...state,
          loading: true,
        };
      }
      case FETCH_PURCHASE_INVOICES_LIST_SUCCESS: {
        return {
          ...state,
          loading: false,
          list: action.purchaseInvoicesList.content,
          totalItems: action.purchaseInvoicesList.totalItems,
        };
      }
      case FETCH_PURCHASE_INVOICES_LIST_ERROR: {
        return {
          ...state,
          loading: false,
          list: [],
          error: true,
        };
      }
      default:
        return state;
    }
}
