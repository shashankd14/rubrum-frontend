import {
    FETCH_INWARD_LIST_REQUEST,
    FETCH_INWARD_LIST_SUCCESS,
    FETCH_INWARD_LIST_ERROR,

    CHECK_COIL_EXISTS,

    SET_INWARD_DETAILS,
    SUBMIT_INWARD_ENTRY,
    SUBMIT_INWARD_SUCCESS,
    SUBMIT_INWARD_ERROR,
    CHECK_COIL_EXISTS_SUCCESS,
    CHECK_COIL_EXISTS_ERROR,
    FETCH_INWARD_LIST_BY_PARTY_REQUEST,
    FETCH_INWARD_LIST_BY_PARTY_SUCCESS,
    FETCH_INWARD_LIST_BY_PARTY_ERROR
} from "../../constants/ActionTypes";

export const fetchInwardList = () => ({
  type: FETCH_INWARD_LIST_REQUEST,
});

export const fetchInwardListSuccess = (inwardList) => ({
    type: FETCH_INWARD_LIST_SUCCESS,
    inwardList
});

export const fetchInwardListError = (error) => ({
    type: FETCH_INWARD_LIST_ERROR,
    error
});

export const setInwardDetails = (inward) => ({
    type: SET_INWARD_DETAILS,
    inward
});

export const checkIfCoilExists = (coilNumber) => ({
    type: CHECK_COIL_EXISTS,
    coilNumber
});

export const checkDuplicateCoilSuccess = (status) => ({
    type: CHECK_COIL_EXISTS_SUCCESS,
    status
})

export const checkDuplicateCoilError = (error) => ({
    type: CHECK_COIL_EXISTS_ERROR,
    error
})

export const getGradeByMaterialId = (materialId) => ({

});

export const submitInwardEntry = (inward) => ({
    type: SUBMIT_INWARD_ENTRY,
    inward
});

export const submitInwardSuccess = (inward) => ({
    type: SUBMIT_INWARD_SUCCESS,
    inward
});

export const submitInwardError = (inward) => ({
    type: SUBMIT_INWARD_ERROR,
    inward
});

export const getCoilsByPartyId = (partyId) => ({
    type: FETCH_INWARD_LIST_BY_PARTY_REQUEST,
    partyId
});

export const getCoilsByPartyIdSuccess = (payload) => ({
    type: FETCH_INWARD_LIST_BY_PARTY_SUCCESS,
    payload
});

export const getCoilsByPartyIdError = (error) => ({
    type: FETCH_INWARD_LIST_BY_PARTY_ERROR,
    error
});
