import { filter } from 'lodash';
import {
  REQUEST_ALL_PACKETS_LIST,
  REQUEST_ALL_PACKETS_LIST_ERROR,
  REQUEST_ALL_PACKETS_LIST_SUCCESS,
  REQUEST_SALES_ORDER_LIST,
  REQUEST_SALES_ORDER_LIST_ERROR,
  REQUEST_SALES_ORDER_LIST_SUCCESS,
  REQUEST_SAVE_SO_FOR_PACKET,
  REQUEST_SAVE_SO_FOR_PACKET_ERROR,
  REQUEST_SAVE_SO_FOR_PACKET_SUCCESS,
  REQUEST_SO_PDF,
  REQUEST_SO_PDF_SUCCESS,
  REQUEST_SO_PDF_ERROR,
  REQUEST_MATERIALS_BY_SO_ID,
  REQUEST_MATERIALS_BY_SO_ID_SUCCESS,
  REQUEST_MATERIALS_BY_SO_ID_ERROR,
} from "../../constants/ActionTypes";

export const fetchSalesOrderList = (page, pageSize, searchValue, partyId) =>  ({
  type: REQUEST_SALES_ORDER_LIST,
  page,
  pageSize,
  searchValue,
  partyId
});

export const fetchSalesOrderError = (error) =>  ({
  type: REQUEST_SALES_ORDER_LIST_ERROR,
  error
});

export const fetchSalesOrderSuccess = (list) =>  ({
  type: REQUEST_SALES_ORDER_LIST_SUCCESS,
  list
});

export const fetchPacketList = (
  page,
  pageSize,
  partyId,
  searchValue,
  planId,
  filterInfo = {}
) => ({
  type: REQUEST_ALL_PACKETS_LIST,
  page,
  pageSize,
  partyId,
  searchValue,
  planId,
  filters: filterInfo,
});

export const fetchPacketListSuccess = (list) =>  ({
  type: REQUEST_ALL_PACKETS_LIST_SUCCESS,
  list
});

export const fetchPacketListError = (error) =>  ({
  type: REQUEST_ALL_PACKETS_LIST_ERROR,
  error
});
export const saveSalesOrderForPacket = (postData) =>  ({
  type: REQUEST_SAVE_SO_FOR_PACKET,
  postData
});

export const saveSalesOrderForPacketSuccess = () =>  ({
  type: REQUEST_SAVE_SO_FOR_PACKET_SUCCESS,
});

export const saveSalesOrderForPacketError = (error) =>  ({
  type: REQUEST_SAVE_SO_FOR_PACKET_ERROR,
  error
});

export const openSoPdf = (soId) => ({
  type: REQUEST_SO_PDF,
  soId
});

export const openSoPdfSuccess = (soPdf) => ({
  type: REQUEST_SO_PDF_SUCCESS,
  soPdf
});

export const openSoPdfError = (soPdf) => ({
  type: REQUEST_SO_PDF_ERROR,
  soPdf
});

export const fetchMaterialsBySoID = (soId) => ({
  type: REQUEST_MATERIALS_BY_SO_ID,
  soId,
});

export const fetchMaterialsBySoIDSuccess = (materials, soId) => ({
  type: REQUEST_MATERIALS_BY_SO_ID_SUCCESS,
  materials,
  soId,
});

export const fetchMaterialsBySoIDError = (error) => ({
  type: REQUEST_MATERIALS_BY_SO_ID_ERROR,
  error,
});