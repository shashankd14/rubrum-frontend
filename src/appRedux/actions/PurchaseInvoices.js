import {
  FETCH_PURCHASE_INVOICES_LIST,
  FETCH_PURCHASE_INVOICES_LIST_SUCCESS,
  FETCH_PURCHASE_INVOICES_LIST_ERROR,
} from "../../constants/ActionTypes";

export const fetchPurchaseInvoices = (page, pageSize, searchValue, partyId, inwardDate) => ({
  type: FETCH_PURCHASE_INVOICES_LIST,
  page,
  pageSize,
  searchValue,
  partyId,
  inwardDate, 
});

export const fetchPurchaseInvoicesSuccess = (purchaseInvoicesList) => ({
  type: FETCH_PURCHASE_INVOICES_LIST_SUCCESS,
  purchaseInvoicesList,
});

export const fetchPurchaseInvoicesError = (error) => ({
  type: FETCH_PURCHASE_INVOICES_LIST_ERROR,
  error,
});