import {FETCH_CLASSIFICATION_LIST_ERROR, 
    FETCH_CLASSIFICATION_LIST_REQUEST, 
    FETCH_CLASSIFICATION_LIST_SUCCESS,
    ADD_PROCESSTAGS_REQUEST,
    ADD_PROCESSTAGS_SUCCESS,
    ADD_PROCESSTAGS_ERROR,
    ADD_ENDUSERTAGS_SUCCESS,
    ADD_ENDUSERTAGS_REQUEST,
    ADD_ENDUSERTAGS_ERROR,
FETCH_TAGS_LIST_BY_ID_ERROR,
FETCH_TAGS_LIST_BY_ID_SUCCESS,
FETCH_TAGS_LIST_BY_ID_REQUEST, 
FETCH_ENDUSERTAGS_LIST_SUCCESS, 
FETCH_ENDUSERTAGS_LIST_REQUEST, 
FETCH_ENDUSERTAGS_LIST_ERROR,
DELETE_TAGS_BY_ID_REQUEST,
DELETE_TAGS_BY_ID_SUCCESS,
DELETE_TAGS_BY_ID_ERROR,
RESET_TAGS_STATE,
UPDATE_TAGS_ERROR,
UPDATE_TAGS_REQUEST,
UPDATE_TAGS_SUCCESS} from "../../constants/ActionTypes";

export const fetchClassificationList = () => ({
    type: FETCH_CLASSIFICATION_LIST_REQUEST,
});

export const fetchClassificationListSuccess = (processTags) => ({
    type: FETCH_CLASSIFICATION_LIST_SUCCESS,
    processTags
});

export const fetchClassificationListError = (error) => ({
    type: FETCH_CLASSIFICATION_LIST_ERROR,
    error
});

export const addProccessTags= (classificationName) => ({
    type: ADD_PROCESSTAGS_REQUEST,
    classificationName
});

export const addProccessTagsSuccess = () => ({
    type: ADD_PROCESSTAGS_SUCCESS
});

export const addProccessTagsError = (error) => ({
    type: ADD_PROCESSTAGS_ERROR,
    error
});
export const addEndUserTags= (classificationName) => ({
    type: ADD_ENDUSERTAGS_REQUEST,
    classificationName
});

export const addEndUserTagsSuccess = () => ({
    type: ADD_ENDUSERTAGS_SUCCESS
});

export const addEndUserTagsError = (error) => ({
    type: ADD_ENDUSERTAGS_ERROR,
    error
});
export const fetchTagsListById = (payload) => ({
    type: FETCH_TAGS_LIST_BY_ID_REQUEST,
    payload
});

export const fetchTagsListIdSuccess = (tags) => ({
    type: FETCH_TAGS_LIST_BY_ID_SUCCESS,
    tags
});

export const fetchTagsListIdError = (error) => ({
    type: FETCH_TAGS_LIST_BY_ID_ERROR,
    error
});
export const fetchEndUserTagsList = () => ({
    type: FETCH_ENDUSERTAGS_LIST_REQUEST,
});

export const fetchEndUserTagsSuccess = (endUserTags) => ({
    type: FETCH_ENDUSERTAGS_LIST_SUCCESS,
    endUserTags
});

export const fetchEndUserTagsError = (error) => ({
    type: FETCH_ENDUSERTAGS_LIST_ERROR,
    error
});
export const deleteTagById = (payload) => ({
    type: DELETE_TAGS_BY_ID_REQUEST,
    payload
});

export const deleteTagsListIdSuccess = (tags) => ({
    type: DELETE_TAGS_BY_ID_SUCCESS,
    tags
});

export const deleteTagsListIdError = (error) => ({
    type: DELETE_TAGS_BY_ID_ERROR,
    error
});
export const resetTagsState = () => ({
    type: RESET_TAGS_STATE,
})
export const updateTags = (payload) => ({
    type: UPDATE_TAGS_REQUEST,
    payload
});

export const updateTagsSuccess = () => ({
    type: UPDATE_TAGS_SUCCESS
    
});

export const updateTagsError = (error) => ({
    type: UPDATE_TAGS_ERROR,
    error
});