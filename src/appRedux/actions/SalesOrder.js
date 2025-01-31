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
} from '../../constants/ActionTypes';

export const fetchSalesOrderList = (page, pageSize, searchValue) =>  ({
  type: REQUEST_SALES_ORDER_LIST,
  page,
  pageSize,
  searchValue,
});

export const fetchSalesOrderError = (error) =>  ({
  type: REQUEST_SALES_ORDER_LIST_ERROR,
  error
});

export const fetchSalesOrderSuccess = (list) =>  ({
  type: REQUEST_SALES_ORDER_LIST_SUCCESS,
  list
});

export const fetchPacketList = (page, pageSize, searchValue) =>  ({
  type: REQUEST_ALL_PACKETS_LIST,
  page,
  pageSize,
  searchValue,
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