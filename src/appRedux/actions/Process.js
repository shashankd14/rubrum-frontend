import {
    FETCH_PROCESS_LIST_ERROR, 
    FETCH_PROCESS_LIST_REQUEST, 
    FETCH_PROCESS_LIST_SUCCESS
} from "../../constants/ActionTypes";

export const fetchProcessList = () => ({
    type: FETCH_PROCESS_LIST_REQUEST
});

export const fetchProcessListSuccess = (processList) => ({
    type: FETCH_PROCESS_LIST_SUCCESS,
    processList
});

export const fetchProcessListError = (error) => ({
    type: FETCH_PROCESS_LIST_ERROR,
    error
});