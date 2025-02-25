import {
  REQUEST_ALL_PACKETS_LIST, REQUEST_ALL_PACKETS_LIST_ERROR,
  REQUEST_ALL_PACKETS_LIST_SUCCESS,
  REQUEST_SALES_ORDER_LIST,
  REQUEST_SALES_ORDER_LIST_ERROR,
  REQUEST_SALES_ORDER_LIST_SUCCESS, REQUEST_SAVE_SO_FOR_PACKET, REQUEST_SAVE_SO_FOR_PACKET_SUCCESS,
} from '../../constants/ActionTypes';


const INIT_STATE = {
  list: [],
  packets: [],
  loading: false,
  error: false,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case REQUEST_SALES_ORDER_LIST:
      return {
        ...state,
        loading: true,
        success: false,
      }
    case REQUEST_SALES_ORDER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.list,
      }
    case REQUEST_SALES_ORDER_LIST_ERROR:
      return {
        ...state,
        loading: false,
        list: [],
        error: true,
      }
    case REQUEST_ALL_PACKETS_LIST:
      return {
        ...state,
        loading: true
      }
    case REQUEST_ALL_PACKETS_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        packets: action.list,
      }
    case REQUEST_ALL_PACKETS_LIST_ERROR:
      return {
        ...state,
        loading: false,
        packets: [],
        error: true,
      }
    case REQUEST_SAVE_SO_FOR_PACKET:
      return {
        ...state,
        loading: true,
        error: false,
        success: false,
      }
    case REQUEST_SAVE_SO_FOR_PACKET_SUCCESS:
      return {
        ...state,
        loading: true,
        error: false,
        success: true,
      }
    default:
      return state;
  }
}