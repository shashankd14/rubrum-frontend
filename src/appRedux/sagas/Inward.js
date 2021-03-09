import {all, put, fork, takeLatest, take, call} from "redux-saga/effects";
import moment from "moment";
import {
    CHECK_COIL_EXISTS,
    FETCH_INWARD_LIST_REQUEST,
    SUBMIT_INWARD_ENTRY,
    FETCH_INWARD_LIST_BY_PARTY_REQUEST,
    FETCH_INWARD_PLAN_DETAILS_REQUESTED,
    REQUEST_SAVE_CUTTING_DETAILS,
    REQUEST_SAVE_SLITTING_DETAILS, FETCH_MATERIAL_GRADE_LIST_REQUEST,
    POST_DELIVERY_CONFORM_REQUESTED,
    REQUEST_UPDATE_INSTRUCTION_DETAILS,
    FETCH_INWARD_INSTRUCTION_DETAILS_REQUESTED,
    FETCH_INWARD_INSTRUCTION_WIP_DETAILS_REQUESTED
} from "../../constants/ActionTypes";

import {
    fetchInwardListError,
    fetchInwardListSuccess,
    submitInwardSuccess,
    submitInwardError,
    checkDuplicateCoilSuccess,
    checkDuplicateCoilError,
    getCoilsByPartyIdSuccess,
    getCoilsByPartyIdError,
    getCoilPlanDetailsSuccess,
    getCoilPlanDetailsError,
    saveCuttingInstructionSuccess,
    saveCuttingInstructionError,
    saveSlittingInstructionSuccess,
    saveSlittingInstructionError,
    getGradeByMaterialIdSuccess,
    getGradeByMaterialIdError,
    postDeliveryConformSuccess,
    postDeliveryConformError,
    updateInstructionSuccess,
    updateInstructionError,
    getInstructionByIdSuccess,
    getInstructionByIdError,
    getInstructionWipListSuccess,
    getInstructionWipListError
} from "../actions";
import {CUTTING_INSTRUCTION_PROCESS_ID, SLITTING_INSTRUCTION_PROCESS_ID} from "../../constants";
import { formItemLayout } from "../../routes/company/Partywise/CuttingModal";

function* fetchInwardList() {
    try {
        const fetchInwardList =  yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/inwardEntry/list', {
            method: 'GET',
        });
        if(fetchInwardList.status === 200) {
            const fetchInwardListResponse = yield fetchInwardList.json();
            const inwardResponse = [];
            if(fetchInwardListResponse.length > 0) {
                fetchInwardListResponse.map((inward) => {
                    let eachInward = {...inward};
                    eachInward.key = inward.coilNumber;
                    if(inward.instruction.length > 0) {
                        eachInward.children = inward.instruction;
                        inward.instruction.map((instruction, index) => {
                            eachInward.children[index].key = `${inward.coilNumber}-${instruction.instructionId}`;
                            eachInward.children[index].coilNumber = instruction.instructionId;
                            eachInward.children[index].party = inward.party;
                            eachInward.children[index].material = inward.material;
                            if(instruction.childInstructions && instruction.childInstructions.length > 0) {
                                eachInward.children[index].children = instruction.childInstructions;
                                eachInward.children[index].children.map((childInstruction, childIndex) => {
                                    eachInward.children[index].children[childIndex].key = `${inward.coilNumber}-${instruction.instructionId}-${childInstruction.instructionId}`;
                                    eachInward.children[index].children[childIndex].coilNumber = instruction.instructionId;
                                    eachInward.children[index].children[childIndex].party = inward.party;
                                    eachInward.children[index].children[childIndex].material = inward.material;
                                })
                            }
                        })
                    }
                    inwardResponse.push(eachInward);
                });
            }
            yield put(fetchInwardListSuccess(inwardResponse));
        } else
            yield put(fetchInwardListError('error'));
    } catch (error) {
        yield put(fetchInwardListError(error));
    }
}

function* fetchInwardInstructionWIPDetails(action) {
    try {
        const fetchInwardList =  yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/instruction/listWIP', {
            method: 'GET',
        });
        if(fetchInwardList.status === 200) {
            const fetchInwardListResponse = yield fetchInwardList.json();
            // const inwardResponse = [];
            // if(fetchInwardListResponse.length > 0) {
            //     fetchInwardListResponse.map((inward) => {
            //         let eachInward = {...inward};
            //         eachInward.key = inward.coilNumber;
            //         if(inward.instruction.length > 0) {
            //             eachInward.children = inward.instruction;
            //             inward.instruction.map((instruction, index) => {
            //                 eachInward.children[index].key = `${inward.coilNumber}-${instruction.instructionId}`;
            //                 eachInward.children[index].coilNumber = instruction.instructionId;
            //                 eachInward.children[index].party = inward.party;
            //                 eachInward.children[index].material = inward.material;
            //                 if(instruction.childInstructions && instruction.childInstructions.length > 0) {
            //                     eachInward.children[index].children = instruction.childInstructions;
            //                     eachInward.children[index].children.map((childInstruction, childIndex) => {
            //                         eachInward.children[index].children[childIndex].key = `${inward.coilNumber}-${instruction.instructionId}-${childInstruction.instructionId}`;
            //                         eachInward.children[index].children[childIndex].coilNumber = instruction.instructionId;
            //                         eachInward.children[index].children[childIndex].party = inward.party;
            //                         eachInward.children[index].children[childIndex].material = inward.material;
            //                     })
            //                 }
            //             })
            //         }
            //         inwardResponse.push(eachInward);
            //     });
            // }
            yield put(getInstructionWipListSuccess(fetchInwardListResponse));
        } else
            yield put(getInstructionWipListError('error'));
    } catch (error) {
        yield put(getInstructionWipListError(error));
    }
}
function* checkCoilDuplicate(action) {
    try {
        const checkCoilDuplicate =  yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/inwardEntry/isCoilPresent?coilNumber=${action.coilNumber}`, {
            method: 'GET',
        });
        if(checkCoilDuplicate.status === 200) {
            const checkCoilDuplicateResponse = yield checkCoilDuplicate.json();
            yield put(checkDuplicateCoilSuccess(checkCoilDuplicateResponse));
        } else
            yield put(checkDuplicateCoilError('error'));
    } catch (error) {
        yield put(checkDuplicateCoilError(error));
    }
}

function* submitInward(action) {
    try {
        let data = new FormData();
        //customer details
        data.append('partyId', action.inward.partyName);
        data.append('customerCoilId',  action.inward.customerId);
        data.append('customerBatchId',  action.inward.customerBatchNo);
        data.append('customerInvoiceNo',  action.inward.customerInvoiceNo);
        data.append('purposeType', action.inward.purposeType);

        //coil details
        data.append('coilNumber', action.inward.coilNumber);
        data.append('materialId',  action.inward.material);
        data.append('width', action.inward.width);
        data.append('thickness',  action.inward.thickness);
        action.inward.length && data.append('length',  action.inward.length);
        data.append('presentWeight',  action.inward.netWeight);
        data.append('grossWeight',  action.inward.grossWeight);

        // invoice details
        data.append('inwardDate',  moment(action.inward.receivedDate).format('YYYY-MM-DD HH:mm:ss'));
        data.append('bathchNumber',  action.inward.batchNo);
        data.append('vehicleNumber', action.inward.vehicleNumber);
        data.append('invoiceDate', moment(action.inward.invoiceDate).format('YYYY-MM-DD HH:mm:ss'));
        data.append('invoiceNumber', action.inward.invoiceNumber);

        //quality details
        data.append('materialGradeId',  action.inward.grade);
        data.append('testCertificateNumber',  action.inward.testCertificateNo);
        data.append('remarks',  action.inward.remarks);

        if(action.inward.testFile) {
            data.append('testCertificateFile', action.inward.testFile.fileList[0].originFileObj, action.inward.testFile.fileList[0].name);
        }

        data.append('statusId',  1);
        data.append('heatnumber',  '123');
        data.append('plantname',  'test plant name');
        // data.append('customerInvoiceDajte',  action.inward.grade);
        data.append('createdBy',  1);
        data.append('updatedBy',  1);

        const newInwardEntry =  yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/inwardEntry/addNew', {
            method: 'POST',
            body: data
        });
        if(newInwardEntry.status == 200) {
            yield put(submitInwardSuccess());
        } else
            yield put(submitInwardError('error'));
    } catch (error) {
        yield put(submitInwardError(error));
    }
}

function* fetchInwardListByParty(action) {
    try {
        const fetchPartyInwardList =  yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/inwardEntry/getByPartyId/${action.partyId}`, {
            method: 'GET',
        });
        if(fetchPartyInwardList.status === 200) {
            const fetchPartyInwardListResponse = yield fetchPartyInwardList.json();
            yield put(getCoilsByPartyIdSuccess(fetchPartyInwardListResponse.body));
        } else
            yield put(getCoilsByPartyIdError('error'));
    } catch (error) {
        yield put(getCoilsByPartyIdError(error));
    }
}

function* fetchInwardPlanDetails(action) {
    try {
        const fetchInwardPlan =  yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/inwardEntry/getByCoilId/${action.coilNumber}`, {
            method: 'GET',
        });
        if(fetchInwardPlan.status === 200) {
            const fetchInwardPlanResponse = yield fetchInwardPlan.json();
            const formattedResponse = []
            fetchInwardPlanResponse.instruction.map((instruction) => {
                if(instruction.groupId) {
                    // if(instruction.childInstructions.length > 0) {
                    //     const formattedChildren = [];
                    //     instruction.childInstructions.map((childInstruction) => {
                    //         if(childInstruction.groupId) {
                    //             if (formattedChildren[childInstruction.groupId]) {
                    //                 formattedChildren[childInstruction.groupId] = [...formattedChildren[childInstruction.groupId], instruction];
                    //             } else
                    //                 formattedChildren[childInstruction.groupId] = [childInstruction];
                    //         } else {
                    //             formattedChildren.push(childInstruction);
                    //         }
                    //     })
                    //     instruction['formattedChildren'] = formattedChildren;
                    // }
                    if(formattedResponse[instruction.groupId]) {
                        formattedResponse[instruction.groupId] = [...formattedResponse[instruction.groupId], instruction];
                    } else {
                        formattedResponse[instruction.groupId] = [];
                        formattedResponse[instruction.groupId].push(instruction);
                    }
                } else
                    formattedResponse.push([instruction]);
            })
            fetchInwardPlanResponse.instruction = formattedResponse;
            yield put(getCoilPlanDetailsSuccess(fetchInwardPlanResponse));
        } else
            yield put(getCoilPlanDetailsError('error'));
    } catch (error) {
        yield put(getCoilPlanDetailsError(error));
    }
}

function* requestSaveCuttingInstruction(action) {
    const requestBody = [];
    action.cuttingDetails.map((cutDetails) => {
        const req = {
            processId: CUTTING_INSTRUCTION_PROCESS_ID,
            instructionDate :  moment(cutDetails.processDate).format('YYYY-MM-DD HH:mm:ss'),
            plannedLength: cutDetails.length,
            plannedWeight: cutDetails.weight,
            plannedNoOfPieces: cutDetails.no,
            status: 1,
            "createdBy" : "1",
            "updatedBy" : "1",
            inwardId: cutDetails.inwardId ? cutDetails.inwardId : "",
            parentInstructionId: cutDetails.instructionId ? cutDetails.instructionId : ""
        }
        requestBody.push(req);
    })
    try {
        const fetchPartyInwardList =  yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/instruction/save`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });
        if(fetchPartyInwardList.status === 200) {
            yield put(saveCuttingInstructionSuccess(fetchPartyInwardList));
        } else
            yield put(saveCuttingInstructionError('error'));
    } catch (error) {
        yield put(saveCuttingInstructionError(error));
    }
}

function* requestSaveSlittingInstruction(action) {
    const requestBody = [];
    action.slittingDetails.map((slitDetails) => {
        const req = {
            processId: SLITTING_INSTRUCTION_PROCESS_ID,
            instructionDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            plannedLength: slitDetails.length,
            plannedWidth: slitDetails.width,
            plannedWeight: slitDetails.weight,
            plannedNoOfPieces: slitDetails.no,
            status: 1,
            "createdBy" : "1",
            "updatedBy" : "1",
            inwardId: slitDetails.inwardId ? slitDetails.inwardId : '',
            parentInstructionId: slitDetails.instructionId ? slitDetails.instructionId : '',
        }
        requestBody.push(req);
    })
    try {
        const fetchPartyInwardList =  yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/instruction/save`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });
        if(fetchPartyInwardList.status === 200) {
            yield put(saveSlittingInstructionSuccess(fetchPartyInwardList));
        } else
            yield put(saveSlittingInstructionError('error'));
    } catch (error) {
        yield put(saveSlittingInstructionError(error));
    }
}
function* requestUpdateInstruction(action) {
        const ins = action.instruction.map(item => {
            let insObj = {
            instructionId: item.instructionId? item.instructionId: null,
            parentInstructionId: item.parentInstructionId ?item.parentInstructionId: null,
            processdId: item.processId? item.processId: null,
            instructionDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            plannedLength : item.plannedLength? item.plannedLength: null,
		    plannedWidth : item.plannedWidth ?item.plannedWidth: null,
		    plannedWeight : item.plannedWeight ? formItemLayout.plannedWeight: null,
		    plannedNoOfPieces: item.plannedNoOfPieces ? item.plannedNoOfPieces: null,
            actualWeight: item.actualWeight? item.actualWeight: null,
            noOfPieces: item.noOfPieces ? item.noOfPieces : null,
            actualNoOfPieces: item.actualNoOfPieces ? item.actualNoOfPieces: null,
            wastage: item.wastage? item.wastage : null,
            damage: item.damage? item.damage : null,
            packingWeight: item.packingWeight? item.packingWeight : null,
            createdBy: item.createdBy? item.createdBy : null,
            updatedBy: item.updatedBy? item.updatedBy : null
                
            }
            return insObj
        })
        const req = {
            isFinishTask: true,
            instructionDtos:ins
        }
    try {
      const updateInstruction= yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/instruction/update`, {method:'PUT', headers: { "Content-Type": "application/json" }, body: JSON.stringify(req)
        });
        yield put(updateInstructionSuccess(updateInstruction));

    } catch (error) {
        yield put(updateInstructionError(error));
    }
}

function* requestGradesByMaterialId(action) {
    try {
        const fetchGradesByMaterialIdList =  yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/materialGrade/getByMaterialId/${action.materialId}`, {
            method: 'GET',
        });
        if(fetchGradesByMaterialIdList.status === 200) {
            const fetchGradesByMaterialIdListResponse = yield fetchGradesByMaterialIdList.json();
            yield put(getGradeByMaterialIdSuccess(fetchGradesByMaterialIdListResponse));
        } else
            yield put(getGradeByMaterialIdError('error'));
    } catch (error) {
        yield put(getGradeByMaterialIdError(error));
    }
}

function* postDeliveryConformRequest(payload) {

    console.log("in saga", payload)

    try{
        const postConform = yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/delivery/save`,{
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify()
        })

        if(postConform.status === 200) {
            yield put(postDeliveryConformSuccess());
        } else
            yield put(postDeliveryConformError('error'));
    } catch (error) {
    yield put(postDeliveryConformError(error));
}
}
function* fetchInwardInstructionDetails(action) {
    try {
        const fetchInwardInstruction =  yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/instruction/getById/${action.instructionId}`, {
            method: 'GET',
        });
        if(fetchInwardInstruction.status === 200) {
            const fetchInwardPlanResponse = yield fetchInwardInstruction.json();
            const formattedResponse = []
            fetchInwardPlanResponse.instruction.map((instruction) => {
                if(instruction.groupId) {
                    // if(instruction.childInstructions.length > 0) {
                    //     const formattedChildren = [];
                    //     instruction.childInstructions.map((childInstruction) => {
                    //         if(childInstruction.groupId) {
                    //             if (formattedChildren[childInstruction.groupId]) {
                    //                 formattedChildren[childInstruction.groupId] = [...formattedChildren[childInstruction.groupId], instruction];
                    //             } else
                    //                 formattedChildren[childInstruction.groupId] = [childInstruction];
                    //         } else {
                    //             formattedChildren.push(childInstruction);
                    //         }
                    //     })
                    //     instruction['formattedChildren'] = formattedChildren;
                    // }
                    if(formattedResponse[instruction.groupId]) {
                        formattedResponse[instruction.groupId] = [...formattedResponse[instruction.groupId], instruction];
                    } else {
                        formattedResponse[instruction.groupId] = [];
                        formattedResponse[instruction.groupId].push(instruction);
                    }
                } else
                    formattedResponse.push([instruction]);
            })
            fetchInwardPlanResponse.instruction = formattedResponse;
            yield put(getInstructionByIdSuccess(fetchInwardPlanResponse));
        } else
            yield put(getInstructionByIdError('error'));
    } catch (error) {
        yield put(getInstructionByIdError(error));
    }
}

export function* watchFetchRequests() {
    yield takeLatest(FETCH_INWARD_LIST_REQUEST, fetchInwardList);
    yield takeLatest(SUBMIT_INWARD_ENTRY, submitInward);
    yield takeLatest(CHECK_COIL_EXISTS, checkCoilDuplicate);
    yield takeLatest(FETCH_INWARD_LIST_BY_PARTY_REQUEST, fetchInwardListByParty);
    yield takeLatest(FETCH_INWARD_PLAN_DETAILS_REQUESTED, fetchInwardPlanDetails);
    yield takeLatest(REQUEST_SAVE_CUTTING_DETAILS, requestSaveCuttingInstruction);
    yield takeLatest(REQUEST_SAVE_SLITTING_DETAILS, requestSaveSlittingInstruction);
    yield takeLatest(REQUEST_UPDATE_INSTRUCTION_DETAILS, requestUpdateInstruction);
    yield takeLatest(FETCH_MATERIAL_GRADE_LIST_REQUEST, requestGradesByMaterialId);
    yield takeLatest(POST_DELIVERY_CONFORM_REQUESTED, postDeliveryConformRequest);
    yield takeLatest(FETCH_INWARD_INSTRUCTION_DETAILS_REQUESTED, fetchInwardInstructionDetails);
    yield takeLatest(FETCH_INWARD_INSTRUCTION_WIP_DETAILS_REQUESTED, fetchInwardInstructionWIPDetails);
}

export default function* inwardSagas() {
    yield all([fork(watchFetchRequests)]);
}
