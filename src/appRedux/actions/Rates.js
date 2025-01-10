import {
  FETCH_RATES_LIST_ERROR,
  FETCH_RATES_LIST_REQUEST,
  FETCH_RATES_LIST_SUCCESS,
  FETCH_PACKING_RATES_LIST_ERROR,
  FETCH_PACKING_RATES_LIST_REQUEST,
  FETCH_PACKING_RATES_LIST_SUCCESS,
  ADD_RATES_REQUEST,
  ADD_RATES_SUCCESS,
  ADD_RATES_ERROR,
  ADD_PACKING_RATES_REQUEST,
  ADD_PACKING_RATES_SUCCESS,
  ADD_PACKING_RATES_ERROR,
  FETCH_RATES_LIST_ID_REQUEST,
  FETCH_RATES_LIST_ID_SUCCESS,
  FETCH_RATES_LIST_ID_ERROR,
  FETCH_PACKING_RATES_LIST_ID_REQUEST,
  FETCH_PACKING_RATES_LIST_ID_SUCCESS,
  FETCH_PACKING_RATES_LIST_ID_ERROR,
  UPDATE_RATES_REQUEST,
  UPDATE_RATES_SUCCESS,
  UPDATE_RATES_ERROR,
  UPDATE_PACKING_RATES_REQUEST,
  UPDATE_PACKING_RATES_SUCCESS,
  UPDATE_PACKING_RATES_ERROR,
  RESET_RATES_REQUEST,
  RESET_PACKING_RATES_REQUEST,
  DELETE_RATES_BY_ID,
  DELETE_RATES_BY_ID_SUCCESS,
  DELETE_RATES_BY_ID_ERROR,
  ADD_ADDITIONAL_RATES_REQUEST,
  ADD_ADDITIONAL_RATES_SUCCESS,
  ADD_ADDITIONAL_RATES_ERROR,
  FETCH_STATIC_LIST_BY_PROCESSS,
  FETCH_STATIC_LIST_BY_PROCESSS_ERROR,
  FETCH_STATIC_LIST_BY_PROCESSS_SUCCESS,
  FETCH_ADDITIONAL_RATES_LIST_REQUEST,
  FETCH_ADDITIONAL_RATES_LIST_REQUEST_ERROR,
  FETCH_ADDITIONAL_RATES_LIST_REQUEST_SUCCESS,
  FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST,
  FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST_SUCCESS,
  FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST_ERROR,
  DELETE_ADDITIONAL_RATES_BY_ID,
  DELETE_ADDITIONAL_RATES_BY_ID_ERROR,
  DELETE_ADDITIONAL_RATES_BY_ID_SUCCESS,
  UPDATE_ADDITIONAL_RATES_REQUEST,
  UPDATE_ADDITIONAL_RATES_SUCCESS,
  UPDATE_ADDITIONAL_RATES_ERROR,
  DELETE_LAMINATION_CHARGES_ERROR,
} from '../../constants/ActionTypes';
import * as actionTypes from '../../constants/ActionTypes';

export const fetchRatesList = pagination => ({
  type: FETCH_RATES_LIST_REQUEST,
  pagination,
});

export const fetchRatesListSuccess = (ratesList, totalItems) => ({
  type: FETCH_RATES_LIST_SUCCESS,
  ratesList,
  totalItems,
});

export const fetchRatesListError = error => ({
  type: FETCH_RATES_LIST_ERROR,
  error,
});

export const fetchPackingRatesList = () => ({
  type: FETCH_PACKING_RATES_LIST_REQUEST,
});

export const fetchPackingRatesListSuccess = packingRateList => ({
  type: FETCH_PACKING_RATES_LIST_SUCCESS,
  packingRateList,
});

export const fetchPackingRatesListError = error => ({
  type: FETCH_PACKING_RATES_LIST_ERROR,
  error,
});

export const addRates = rates => ({
  type: ADD_RATES_REQUEST,
  rates,
});

export const addRatesSuccess = () => ({
  type: ADD_RATES_SUCCESS,
});

export const addRatesError = error => ({
  type: ADD_RATES_ERROR,
  error,
});

export const addPackingRates = packingRate => ({
  type: ADD_PACKING_RATES_REQUEST,
  packingRate,
});

export const addPackingRatesSuccess = () => ({
  type: ADD_PACKING_RATES_SUCCESS,
});

export const addPackingRatesError = error => ({
  type: ADD_PACKING_RATES_ERROR,
  error,
});

export const fetchRatesListById = rateId => ({
  type: FETCH_RATES_LIST_ID_REQUEST,
  rateId,
});

export const fetchRatesListByIdSuccess = rates => ({
  type: FETCH_RATES_LIST_ID_SUCCESS,
  rates,
});

export const fetchRatesListByIdError = error => ({
  type: FETCH_RATES_LIST_ID_ERROR,
  error,
});

export const fetchPackingRatesById = packingRatesId => ({
  type: FETCH_PACKING_RATES_LIST_ID_REQUEST,
  packingRatesId,
});

export const fetchPackingRatesByIdSuccess = packingRates => ({
  type: FETCH_PACKING_RATES_LIST_ID_SUCCESS,
  packingRates,
});

export const fetchPackingRatesByIdError = error => ({
  type: FETCH_PACKING_RATES_LIST_ID_ERROR,
  error,
});

export const resetRates = () => ({
  type: RESET_RATES_REQUEST,
});

export const resetPackingRates = () => ({
  type: RESET_PACKING_RATES_REQUEST,
});

export const updateRates = rates => ({
  type: UPDATE_RATES_REQUEST,
  rates,
});

export const updateRatesSuccess = () => ({
  type: UPDATE_RATES_SUCCESS,
});

export const updateRatesError = error => ({
  type: UPDATE_RATES_ERROR,
  error,
});

export const updatePackingRates = packingRates => ({
  type: UPDATE_PACKING_RATES_REQUEST,
  packingRates,
});

export const updatePackingRatesSuccess = () => ({
  type: UPDATE_PACKING_RATES_SUCCESS,
});

export const updatePackingRatesError = error => ({
  type: UPDATE_PACKING_RATES_ERROR,
  error,
});

export const deleteRates = payload => ({
  type: DELETE_RATES_BY_ID,
  payload,
});

export const deleteRatesSuccess = rates => ({
  type: DELETE_RATES_BY_ID_SUCCESS,
  rates,
});

export const deleteRatesError = error => ({
  type: DELETE_RATES_BY_ID_ERROR,
  error,
});
export const addAdditionalRates = payload => ({
  type: ADD_ADDITIONAL_RATES_REQUEST,
  payload,
});

export const addAdditionalRatesSuccess = () => ({
  type: ADD_ADDITIONAL_RATES_SUCCESS,
});

export const addAdditionalRatesError = error => ({
  type: ADD_ADDITIONAL_RATES_ERROR,
  error,
});
export const getStaticList = processId => ({
  type: FETCH_STATIC_LIST_BY_PROCESSS,
  processId,
});

export const getStaticListSuccess = rates => ({
  type: FETCH_STATIC_LIST_BY_PROCESSS_SUCCESS,
  rates,
});

export const getStaticListError = error => ({
  type: FETCH_STATIC_LIST_BY_PROCESSS_ERROR,
  error,
});
export const fetchAdditionalPriceList = () => ({
  type: FETCH_ADDITIONAL_RATES_LIST_REQUEST,
});

export const fetchAdditionalRatesListSuccess = ratesList => ({
  type: FETCH_ADDITIONAL_RATES_LIST_REQUEST_SUCCESS,
  ratesList,
});

export const fetchAdditionalRatesListError = error => ({
  type: FETCH_ADDITIONAL_RATES_LIST_REQUEST_ERROR,
  error,
});
export const fetchAdditionalPriceListById = rateId => ({
  type: FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST,
  rateId,
});

export const fetchAdditionalPriceListByIdSuccess = rates => ({
  type: FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST_SUCCESS,
  rates,
});

export const fetchAdditionalPriceListByIdError = error => ({
  type: FETCH_ADDITIONAL_RATES_LIST_BY_ID_REQUEST_ERROR,
  error,
});
export const deleteAdditionalRates = payload => ({
  type: DELETE_ADDITIONAL_RATES_BY_ID,
  payload,
});

export const deleteAdditionalRatesSuccess = rates => ({
  type: DELETE_ADDITIONAL_RATES_BY_ID_SUCCESS,
  rates,
});

export const deleteAdditionalRatesError = error => ({
  type: DELETE_ADDITIONAL_RATES_BY_ID_ERROR,
  error,
});
export const updateAdditionalRates = rates => ({
  type: UPDATE_ADDITIONAL_RATES_REQUEST,
  rates,
});

export const updateAdditionalRatesSuccess = () => ({
  type: UPDATE_ADDITIONAL_RATES_SUCCESS,
});

export const updateAdditionalRatesError = error => ({
  type: UPDATE_ADDITIONAL_RATES_ERROR,
  error,
});
//Lamination Charges
export const getLaminationChargesList = () => ({
  type: actionTypes.GET_LAMINATION_CHARGES_LIST_REQUEST,
});

export const getLaminationChargesListSuccess = laminationChargesList => ({
  type: actionTypes.GET_LAMINATION_CHARGES_LIST_SUCCESS,
  laminationChargesList,
});

export const getLaminationChargesListError = error => ({
  type: actionTypes.GET_LAMINATION_CHARGES_LIST_ERROR,
  error,
});

export const getLaminationChargesById = laminationId => ({
  type: actionTypes.GET_BY_ID_LAMINATION_CHARGES_REQUEST,
  laminationId,
});
export const getLaminationChargesByIdSuccess = laminationChargesById => ({
  type: actionTypes.GET_BY_ID_LAMINATION_CHARGES_SUCCESS,
  laminationChargesById,
});
export const getLaminationChargesByIdError = error => ({
  type: actionTypes.GET_BY_ID_LAMINATION_CHARGES_ERROR,
  error,
});

export const addLminationCharges = payload => ({
  type: actionTypes.SAVE_LAMINATION_CHARGES_REQUEST,
  payload,
});

export const addLminationChargesSuccess = () => ({
  type: actionTypes.SAVE_LAMINATION_CHARGES_SUCCESS,
});

export const addLminationChargesError = error => ({
  type: actionTypes.SAVE_LAMINATION_CHARGES_ERROR,
  error,
});
export const resetLaminationChargesRequest = () => ({
  type: actionTypes.RESET_LAMINATION_CHARGES_REQUEST,
});

export const updateLminationCharges = payload => ({
  type: actionTypes.UPDATE_LAMINATION_CHARGES_REQUEST,
  payload,
});

export const updateLminationChargesSuccess = () => ({
  type: actionTypes.UPDATE_LAMINATION_CHARGES_SUCCESS,
});

export const updateLminationChargesError = error => ({
  type: actionTypes.UPDATE_LAMINATION_CHARGES_ERROR,
  error,
});

export const deleteLminationCharges = payload => ({
  type: actionTypes.DELETE_LAMINATION_CHARGES_REQUEST,
  payload,
});

export const deleteLminationChargesSuccess = rates => ({
  type: actionTypes.DELETE_LAMINATION_CHARGES_SUCCESS,
  rates,
});

export const deleteLminationChargesError = error => ({
  type: actionTypes.DELETE_LAMINATION_CHARGES_ERROR,
  error,
});

export const getLaminationChargesByPartyId = partyId => ({
  type: actionTypes.GET_BY_PARTY_ID_LAMINATION_CHARGES_REQUEST,
  partyId,
});
export const getLaminationChargesByPartyIdSuccess = laminationChargesParty => ({
  type: actionTypes.GET_BY_PARTY_ID_LAMINATION_CHARGES_SUCCESS,
  laminationChargesParty,
});
export const getLaminationChargesByPartyIdError = error => ({
  type: actionTypes.GET_BY_PARTY_ID_LAMINATION_CHARGES_ERROR,
  error,
});

export const getLaminationChargesDropDown = () => ({
  type: actionTypes.GET_LAMINATION_CHARGES_DROPDOWN_REQUEST,
});
export const getLaminationChargesDropDownSuccess = laminationDropDown => ({
  type: actionTypes.GET_LAMINATION_CHARGES_DROPDOWN_SUCCESS,
  laminationDropDown,
});
export const getLaminationChargesDropDownError = error => ({
  type: actionTypes.GET_LAMINATION_CHARGES_DROPDOWN_ERROR,
  error,
});
