import { all, put, fork, takeLatest, take, call } from 'redux-saga/effects';
import { getUserToken } from './common';
import toNumber from 'lodash';
import moment from 'moment';
import {
  GENERATE_INWARD_LABEL_PRINT_PDF_REQUEST,
  GENERATE_WIP_LABEL_PRINT_PDF_REQUEST,
  GENERATE_FG_LABEL_PRINT_PDF_REQUEST,
  GENERATE_EDIT_FINISH_LABEL_PRINT_PDF_REQUEST,
} from '../../constants/ActionTypes';

import { labelPrintInwardSuccess, labelPrintInwardError } from '../actions';
import { userSignOutSuccess } from '../../appRedux/actions/Auth';
import * as actions from '../actions';

const baseUrl = process.env.REACT_APP_BASE_URL;

const getHeaders = () => ({
  Authorization: getUserToken(),
});

function* GenerateInwardLabelPrint(action) {
  try {
    const pdfGenerate = yield fetch(
      `${baseUrl}api/inwardEntry/getLabels/inward/${action.payloadpdf.inwardEntryId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getHeaders() },
        body: JSON.stringify(action.payloadpdf),
      }
    );

    if (pdfGenerate.status === 200) {
      const pdfGenerateResponse = yield pdfGenerate.json();
      let pdfWindow = window.open('');
      pdfWindow.document.write(
        "<iframe width='100%' height='600%' src='" +
          pdfGenerateResponse.inward_label +
          "'></iframe>"
      );
      yield put(labelPrintInwardSuccess(pdfGenerateResponse));
    } else if (pdfGenerate.status === 401) {
      yield put(userSignOutSuccess());
    } else yield put(labelPrintInwardError('error'));
  } catch (error) {
    yield put(labelPrintInwardError(error));
  }
}

function* GenerateWIPLabelPrint(action) {
  console.log('action.inwardEntryId', action.payloadpdf.inwardEntryId);
  try {
    const generateLabelPdf = yield fetch(
      `${baseUrl}api/inwardEntry/getLabels/wip/${action.payloadpdf.inwardEntryId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getHeaders() },
        body: JSON.stringify(action.payloadpdf),
      }
    );
    if (generateLabelPdf.status === 200) {
      const generateLabelPdfResponse = yield generateLabelPdf.json();
      yield put(actions.labelPrintWIPSuccess(generateLabelPdfResponse));
    } else if (generateLabelPdf.status === 401) {
      yield put(userSignOutSuccess());
    } else yield put(actions.labelPrintWIPSuccess('error'));
  } catch (error) {
    yield put(actions.labelPrintWIPSuccess(error));
  }
}

function* GenerateFGLabelPrint(action) {
  console.log('action.inwardEntryId', action.payloadpdf.inwardEntryId);
  try {
    const generateLabelPdf = yield fetch(
      `${baseUrl}api/inwardEntry/getLabels/fg/${action.payloadpdf.inwardEntryId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getHeaders() },
        body: JSON.stringify(action.payloadpdf),
      }
    );
    if (generateLabelPdf.status === 200) {
      const generateLabelPdfResponse = yield generateLabelPdf.json();
      yield put(actions.labelPrintFGSuccess(generateLabelPdfResponse));
    } else if (generateLabelPdf.status === 401) {
      yield put(userSignOutSuccess());
    } else yield put(actions.labelPrintFGError('error'));
  } catch (error) {
    yield put(actions.labelPrintFGError(error));
  }
}

function* GenerateEditFinishLabelPrint(action) {
  const { number, instruction, unfinish, editFinish } = action.payloadpdf;
    const ins = instruction.map(item => {
        let insObj = {
            instructionId: item.instructionId ? item.instructionId : null,
            parentInstructionId: item.parentInstructionId ? item.parentInstructionId : null,
            processId: item?.process?.processId ? item?.process?.processId : 1,
            instructionDate: item.instructionDate ? moment(item.instructionDate).format('YYYY-MM-DD HH:mm:ss') : null,
            plannedLength: item.plannedLength ? item.plannedLength : 0,
            plannedWidth: item.plannedWidth ? item.plannedWidth : 0,
            plannedWeight: item.plannedWeight ? item.plannedWeight : 0,
            plannedNoOfPieces: item.plannedNoOfPieces ? item.plannedNoOfPieces : 0,
            actualWeight: toNumber(item.actualWeight) || 0,
            actualWidth: toNumber(item.actualWidth) || 0,
            actualLength: toNumber(item.actualLength) || 0,
            noOfPieces: item.noOfPieces ? item.noOfPieces : 0,
            actualNoOfPieces: item.actualNoOfPieces ? item.actualNoOfPieces : 0,
            wastage: item.wastage ? item.wastage : 0,
            damage: item.damage ? item.damage : 0,
            packingWeight: item.packingWeight ? item.packingWeight : 0,
            createdBy: item.createdBy ? item.createdBy : 1,
            updatedBy: item.updatedBy ? item.updatedBy : 1,
            packetClassificationId: item.packetClassification?.classificationId || item.packetClassification?.tagId || '',
            endUserTagId:item?.endUserTagsentity?.tagId || ""
        }
        return insObj;
    });
    const filteredData = ins.filter(each => each.packetClassificationId !== 0 && each.packetClassificationId !== "");
    const req = {
        taskType: editFinish ?"FGtoFG":unfinish ? "FGtoWIP" :"WIPtoFG",
        instructionDtos: (unfinish || editFinish) ? ins : filteredData
    }
  try {
    const pdfGenerate = yield fetch(`${baseUrl}api/pdf/labelprint/fg`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getHeaders() },
      body: JSON.stringify(req),
    });
    console.log("action.payloadpdf", req)

    if (pdfGenerate.status === 200) {
      const pdfGenerateResponse = yield pdfGenerate.json();
      let pdfWindow = window.open('');
      pdfWindow.document.write(
        "<iframe width='100%' height='600%' src='data:application/pdf;base64, " +
        encodeURI(pdfGenerateResponse.encodedBase64String) + "'></iframe>"
   )       
      yield put(actions.labelPrintEditFinishSuccess(pdfGenerateResponse));
    } else if (pdfGenerate.status === 401) {
      yield put(userSignOutSuccess());
    } else yield put(actions.labelPrintEditFinishError('error'));
  } catch (error) {
    yield put(actions.labelPrintEditFinishError(error));
  }
}

export function* watchFetchRequests() {
  yield takeLatest(
    GENERATE_INWARD_LABEL_PRINT_PDF_REQUEST,
    GenerateInwardLabelPrint
  );
  yield takeLatest(GENERATE_WIP_LABEL_PRINT_PDF_REQUEST, GenerateWIPLabelPrint);
  yield takeLatest(GENERATE_FG_LABEL_PRINT_PDF_REQUEST, GenerateFGLabelPrint);
  yield takeLatest(
    GENERATE_EDIT_FINISH_LABEL_PRINT_PDF_REQUEST,
    GenerateEditFinishLabelPrint
  );
}

export default function* labelPrintSaga() {
  yield all([fork(watchFetchRequests)]);
}
