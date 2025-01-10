import {
  FETCH_CLASSIFICATION_LIST_REQUEST,
  FETCH_CLASSIFICATION_LIST_SUCCESS,
  FETCH_CLASSIFICATION_LIST_ERROR,
  ADD_PROCESSTAGS_REQUEST,
  ADD_PROCESSTAGS_SUCCESS,
  ADD_PROCESSTAGS_ERROR,
  ADD_ENDUSERTAGS_REQUEST,
  ADD_ENDUSERTAGS_SUCCESS,
  ADD_ENDUSERTAGS_ERROR,
  FETCH_TAGS_LIST_BY_ID_SUCCESS,
  FETCH_TAGS_LIST_BY_ID_ERROR,
  FETCH_TAGS_LIST_BY_ID_REQUEST,
  FETCH_ENDUSERTAGS_LIST_SUCCESS,
  FETCH_ENDUSERTAGS_LIST_ERROR,
  FETCH_ENDUSERTAGS_LIST_REQUEST,
  DELETE_TAGS_BY_ID_REQUEST,
  DELETE_TAGS_BY_ID_ERROR,
  DELETE_TAGS_BY_ID_SUCCESS,
  RESET_TAGS_STATE,
  UPDATE_TAGS_ERROR,
  UPDATE_TAGS_REQUEST,
  UPDATE_TAGS_SUCCESS,
} from '../../constants/ActionTypes';

const INIT_STATE = {
  processTags: [],
  loading: false,
  error: false,
  tags: {},
  endUserTags: [],
  tagsDeleteError: false,
  tagsDeleteSuccess: false,
  tagsEditSuccess: false,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case FETCH_CLASSIFICATION_LIST_REQUEST: {
      return {
        ...state,
      };
    }
    case FETCH_CLASSIFICATION_LIST_SUCCESS: {
      return {
        ...state,
        error: false,
        processTags: action.processTags,
      };
    }
    case FETCH_CLASSIFICATION_LIST_ERROR: {
      return {
        ...state,
        processTags: [],
        error: true,
      };
    }
    case FETCH_ENDUSERTAGS_LIST_REQUEST: {
      return {
        ...state,
      };
    }
    case FETCH_ENDUSERTAGS_LIST_SUCCESS: {
      return {
        ...state,
        error: false,
        endUserTags: action.endUserTags,
      };
    }
    case FETCH_ENDUSERTAGS_LIST_ERROR: {
      return {
        ...state,
        endUserTags: [],
        error: true,
      };
    }
    case ADD_PROCESSTAGS_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case ADD_PROCESSTAGS_SUCCESS: {
      return {
        ...state,
        loading: false,
      };
    }
    case ADD_PROCESSTAGS_ERROR: {
      return {
        ...state,
        loading: false,
        error: true,
      };
    }
    case ADD_ENDUSERTAGS_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case ADD_ENDUSERTAGS_SUCCESS: {
      return {
        ...state,
        loading: false,
      };
    }
    case ADD_ENDUSERTAGS_ERROR: {
      return {
        ...state,
        loading: false,
        error: true,
      };
    }
    case FETCH_TAGS_LIST_BY_ID_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case FETCH_TAGS_LIST_BY_ID_SUCCESS: {
      return {
        ...state,
        loading: false,
        tags: action.tags,
      };
    }
    case FETCH_TAGS_LIST_BY_ID_ERROR: {
      return {
        ...state,
        loading: false,
        error: true,
      };
    }
    case DELETE_TAGS_BY_ID_REQUEST: {
      return {
        ...state,
        loading: true,
        tagsDeleteError: false,
        tagsDeleteSuccess: false,
      };
    }
    case DELETE_TAGS_BY_ID_SUCCESS: {
      return {
        ...state,
        loading: false,
        tagsDeleteSuccess: true,
      };
    }
    case DELETE_TAGS_BY_ID_ERROR: {
      return {
        ...state,
        loading: false,
        error: true,
        tagsDeleteError: true,
      };
    }
    case RESET_TAGS_STATE: {
      return {
        ...state,
        tagsDeleteSuccess: false,
        tagsDeleteError: false,
        tagsEditSuccess: false,
      };
    }
    case UPDATE_TAGS_REQUEST: {
      return {
        ...state,
        loading: true,
        tagsEditSuccess: false,
      };
    }
    case UPDATE_TAGS_SUCCESS: {
      return {
        ...state,
        loading: false,
        tagsEditSuccess: true,
      };
    }
    case UPDATE_TAGS_ERROR: {
      return {
        ...state,
        loading: false,
        error: true,
        tagsEditSuccess: false,
      };
    }

    default:
      return state;
  }
};
