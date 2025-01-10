import {
  FETCH_PARTY_LIST_REQUEST,
  FETCH_PARTY_LIST_SUCCESS,
  FETCH_PARTY_LIST_ERROR,
  ADD_PARTY_REQUEST,
  ADD_PARTY_SUCCESS,
  ADD_PARTY_ERROR,
  FETCH_PARTY_LIST_ID_ERROR,
  FETCH_PARTY_LIST_ID_REQUEST,
  FETCH_PARTY_LIST_ID_SUCCESS,
  UPDATE_PARTY_REQUEST,
  UPDATE_PARTY_SUCCESS,
  UPDATE_PARTY_ERROR,
  RESET_PARTY_REQUEST,
} from '../../constants/ActionTypes';

const INIT_STATE = {
  partyList: [],
  party: {},
  loading: false,
  error: false,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case FETCH_PARTY_LIST_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case FETCH_PARTY_LIST_SUCCESS: {
      return {
        ...state,
        loading: false,
        partyList: action.partyList,
      };
    }
    case FETCH_PARTY_LIST_ERROR: {
      return {
        ...state,
        loading: false,
        partyList: [],
        error: true,
      };
    }

    case ADD_PARTY_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case ADD_PARTY_SUCCESS: {
      return {
        ...state,
        loading: false,
      };
    }
    case ADD_PARTY_ERROR: {
      return {
        ...state,
        loading: false,
        error: true,
      };
    }

    case FETCH_PARTY_LIST_ID_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case FETCH_PARTY_LIST_ID_SUCCESS: {
      return {
        ...state,
        loading: false,
        party: action.party,
      };
    }
    case FETCH_PARTY_LIST_ID_ERROR: {
      return {
        ...state,
        loading: false,
        error: true,
      };
    }

    case RESET_PARTY_REQUEST: {
      return {
        ...state,
        party: {},
      };
    }

    case UPDATE_PARTY_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case UPDATE_PARTY_SUCCESS: {
      return {
        ...state,
        loading: false,
      };
    }
    case UPDATE_PARTY_ERROR: {
      return {
        ...state,
        loading: false,
        error: true,
      };
    }

    default:
      return state;
  }
};
