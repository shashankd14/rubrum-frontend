import {all, fork} from "redux-saga/effects";
import authSagas from "./Auth";
import notesSagas from "./Notes";
import inwardSagas from "./Inward";
import partySagas from "./Party";
import materialSagas from "./Material";

export default function* rootSaga(getState) {
  yield all([fork(authSagas)]);
  yield all([fork(notesSagas)]);
  yield all([fork(inwardSagas)]);
  yield all([fork(partySagas)]);
  yield all([fork(materialSagas)]);
}
