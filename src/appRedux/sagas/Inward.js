import { all, put, fork, takeLatest, take, call } from "redux-saga/effects";
import { history } from '../store/index';
import toNumber from 'lodash';
import moment from "moment";
import {
    CHECK_COIL_EXISTS,
    FETCH_INWARD_LIST_REQUEST,
    SUBMIT_INWARD_ENTRY,
    FETCH_INWARD_LIST_BY_PARTY_REQUEST,
    FETCH_INWARD_PLAN_DETAILS_REQUESTED,
    REQUEST_SAVE_CUTTING_DETAILS,
    REQUEST_SAVE_SLITTING_DETAILS, FETCH_MATERIAL_GRADE_LIST_REQUEST,
    POST_DELIVERY_CONFIRM_REQUESTED,
    REQUEST_UPDATE_INSTRUCTION_DETAILS,
    REQUEST_UPDATE_INSTRUCTION_DETAILS_SUCCESS,

    FETCH_INWARD_INSTRUCTION_DETAILS_REQUESTED,
    FETCH_INWARD_INSTRUCTION_WIP_DETAILS_REQUESTED,
    SAVE_UNPROCESSED_FOR_DELIVERY,
    FETCH_INWARD_LIST_BY_ID,
    UPDATE_INWARD_LIST,
    DELETE_INWARD_LIST_BY_ID,
    DELETE_INSTRUCTION_BY_ID,
    CHECK_BATCH_NO_EXIST,
    INSTRUCTION_GROUP_SAVE,
    PDF_GENERATE_INWARD
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
    postDeliveryConfirmSuccess,
    postDeliveryConfirmError,
    updateInstructionSuccess,
    updateInstructionError,
    getInstructionByIdSuccess,
    getInstructionByIdError,
    getInstructionWipListSuccess,
    getInstructionWipListError,
    saveUnprocessedDeliverySuccess,
    saveUnprocessedDeliveryError,
    fetchPartyInwardListByIdSuccess,
    fetchPartyInwardListByIdError,
    updateInwardSuccess,
    updateInwardError,
    deleteInwardEntryByIdSuccess,
    deleteInwardEntryByIdError,
    deleteInstructionByIdSuccess,
    deleteInstructionByIdError,
    checkCustomerBatchNumberSuccess,
    checkCustomerBatchNumberError,
    instructionGroupsaveSuccess,
    instructionGroupsaveError,
    pdfGenerateSuccess,
    pdfGenerateError
} from "../actions";
import { CUTTING_INSTRUCTION_PROCESS_ID, SLITTING_INSTRUCTION_PROCESS_ID, SLIT_CUT_INSTRUCTION_PROCESS_ID } from "../../constants";
import { formItemLayout } from "../../routes/company/Partywise/CuttingModal";

function* fetchInwardList() {
    try {
        const fetchInwardList = yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/inwardEntry/list', {
            method: 'GET',
        });
        if (fetchInwardList.status === 200) {
            const fetchInwardListResponse = yield fetchInwardList.json();
            const inwardResponse = [];
            if (fetchInwardListResponse.length > 0) {
                fetchInwardListResponse.map((inward) => {
                    let eachInward = { ...inward };
                    eachInward.key = inward.coilNumber;
                    if (inward.instruction.length > 0) {
                        eachInward.children = inward.instruction;
                        inward.instruction.map((instruction, index) => {
                            eachInward.children[index].key = `${inward.coilNumber}-${instruction.instructionId}`;
                            eachInward.children[index].coilNumber = instruction.instructionId;
                            eachInward.children[index].party = inward.party;
                            eachInward.children[index].material = inward.material;
                            if (instruction.childInstructions && instruction.childInstructions.length > 0) {
                                eachInward.children[index].children = instruction.childInstructions;
                                eachInward.children[index].children.map((childInstruction, childIndex) => {
                                    eachInward.children[index].children[childIndex].key = `${inward.coilNumber}-${instruction.instructionId}-${childInstruction.instructionId}`;
                                    eachInward.children[index].children[childIndex].coilNumber = childInstruction.instructionId;
                                    eachInward.children[index].children[childIndex].party = inward.party;
                                    eachInward.children[index].children[childIndex].material = inward.material;
                                    eachInward.children[index].children[childIndex].customerBatchId = inward.customerBatchId;
                                    eachInward.children[index].children[childIndex].fThickness = inward.fThickness;
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
        const fetchInwardList = yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/instruction/listWIP', {
            method: 'GET',
        });
        if (fetchInwardList.status === 200) {
            const fetchInwardListResponse = yield fetchInwardList.json();
            yield put(getInstructionWipListSuccess(fetchInwardListResponse));
        } else
            yield put(getInstructionWipListError('error'));
    } catch (error) {
        yield put(getInstructionWipListError(error));
    }
}
function* checkCoilDuplicate(action) {
    try {
        const checkCoilDuplicate = yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/inwardEntry/isCoilPresent?coilNumber=${action.coilNumber}`, {
            method: 'GET',
        });
        if (checkCoilDuplicate.status === 200) {
            const checkCoilDuplicateResponse = yield checkCoilDuplicate.json();
            yield put(checkDuplicateCoilSuccess(checkCoilDuplicateResponse));
        } else
            yield put(checkDuplicateCoilError('error'));
    } catch (error) {
        yield put(checkDuplicateCoilError(error));
    }
}
function* checkCustomerBatchNumber(action) {
    try {
        const checkCustomerBatchNumberResponse = yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/inwardEntry/isCustomerBatchIdPresent?customerBatchId=${action.customerBatchId}`, {
            method: 'GET'
        });
        if (checkCustomerBatchNumberResponse.status === 200) {
            const checkCoilDuplicateResponse = yield checkCustomerBatchNumberResponse.json();
            yield put(checkCustomerBatchNumberSuccess(checkCoilDuplicateResponse));
        } else
            yield put(checkCustomerBatchNumberError('error'));
    } catch (error) {
        yield put(checkCustomerBatchNumberError(error));
    }
}

function* submitInward(action) {
    try {
        let data = new FormData();
        //customer details
        data.append('partyId', action.inward.partyName);
        data.append('customerCoilId', action.inward.customerId || action.inward.partyName);
        data.append('customerBatchId', action.inward.customerBatchNo);
        data.append('customerInvoiceNo', action.inward.customerInvoiceNo);
        data.append('purposeType', action.inward.purposeType);

        //coil details
        data.append('coilNumber', action.inward.coilNumber);
        data.append('materialId', action.inward.description);
        data.append('width', action.inward.width !== undefined ? action.inward.width : Number(action.inward.fWidth));
        data.append('thickness', action.inward.thickness !== undefined ? action.inward.thickness: action.inward.fThickness);
        action.inward.length && data.append('length', action.inward.length);
        data.append('presentWeight', action.inward.netWeight!== undefined ? action.inward.netWeight: action.inward.grossWeight);
        data.append('grossWeight', action.inward.grossWeight);

        // invoice details
        data.append('inwardDate', moment(action.inward.receivedDate).format('YYYY-MM-DD HH:mm:ss'));
        data.append('bathchNumber', action.inward.batchNo);
        data.append('vehicleNumber', action.inward.vehicleNumber);
        data.append('invoiceDate', moment(action.inward.invoiceDate).format('YYYY-MM-DD HH:mm:ss'));
        data.append('invoiceNumber', action.inward.invoiceNumber);
        data.append('valueOfGoods', action.inward.valueOfGoods);

        //quality details
        data.append('materialGradeId', action.inward.grade !== undefined ?action.inward.grade: Number(action.inward.materialGrade.gradeId));
        data.append('testCertificateNumber', action.inward.testCertificateNo);
        data.append('remarks', action.inward.remarks);

        if (action.inward.testFile) {
            data.append('testCertificateFile', action.inward.testFile.fileList[0].originFileObj, action.inward.testFile.fileList[0].name);
        }

        data.append('statusId', 1);
        data.append('heatnumber', '123');
        data.append('plantname', 'test plant name');
        // data.append('customerInvoiceDajte',  action.inward.grade);
        data.append('createdBy', 1);
        data.append('updatedBy', 1);

        const newInwardEntry = yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/inwardEntry/addNew', {
            method: 'POST',
            body: data
        });
        if (newInwardEntry.status == 200) {
            yield put(submitInwardSuccess());
        } else
            yield put(submitInwardError('error'));
    } catch (error) {
        yield put(submitInwardError(error));
    }
}
function* updateInward(action) {
    try {
        const partyId = action.inward.partyName !== undefined ?action.inward.partyName: action.inward.party.nPartyId;
        const materialId = action.inward.description !== undefined ? action.inward.description: action.inward.material.matId;
        	
        let insObj = {
    
        inwardId : (action.inward.inwardEntryId).toString(),
        partyId :	(partyId).toString(),
        coilNumber : (action.inward.coilNumber).toString(),
        inwardDate : moment(action.inward.receivedDate).format('YYYY-MM-DD HH:mm:ss'),
        vehicleNumber : action.inward.vehicleNumber !== undefined? action.inward.vehicleNumber : action.inward.vLorryNo,
        invoiceDate : moment(action.inward.invoiceDate).format('YYYY-MM-DD HH:mm:ss')!== undefined ?moment(action.inward.invoiceDate).format('YYYY-MM-DD HH:mm:ss'): null,
        invoiceNumber : action.inward.invoiceNumber !== undefined ? action.inward.invoiceNumber: action.inward.vInvoiceNo,
        valueOfGoods : action.inward.valueOfGoods !== undefined ? action.inward.valueOfGoods: 0,
        purposeType : action.inward.purposeType,
        materialId : (materialId).toString(),
        width : action.inward.width !== undefined ? action.inward.width : action.inward.fWidth,
        thickness : action.inward.thickness !== undefined ? action.inward.thickness : action.inward.fThickness,
        length : action.inward.length !== undefined ? action.inward.length : action.inward.fLength,
        statusId : action.inward.status.statusId!== undefined? action.inward.status.statusId: "1" ,
        heatnumber : "",
        plantname : "",
        process : "",
        presentWeight : action.inward.weight !== undefined ? action.inward.weight : action.inward.fQuantity,
        cast : "",
        materialGradeId : action.inward.grade !== undefined ?action.inward.grade: (action.inward.materialGrade.gradeId).toString(),
        createdBy : "1",
        updatedBy : "2"
        }
const newInwardEntry = yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/inwardEntry/update', {
            
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body:JSON.stringify(insObj)
            
        });
        if (newInwardEntry.status == 200) {
            yield put(updateInwardSuccess(newInwardEntry));
        } else
            yield put(updateInwardError('error'));
    } catch (error) {
        yield put(submitInwardError(error));
    }
}

function* fetchInwardListByParty(action) {
    try {
        const fetchPartyInwardList = yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/inwardEntry/getByPartyId/${action.partyId}`, {
            method: 'GET',
        });
        if (fetchPartyInwardList.status === 200) {
            const fetchPartyInwardListResponse = yield fetchPartyInwardList.json();
            yield put(getCoilsByPartyIdSuccess(fetchPartyInwardListResponse.body));
        } else
            yield put(getCoilsByPartyIdError('error'));
    } catch (error) {
        yield put(getCoilsByPartyIdError(error));
    }
}
function* fetchPartyListById(action) {
    try {
        const fetchPartyInwardList = yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/inwardEntry/getById/${action.inwardEntryId}`, {
            method: 'GET',
        });
        if (fetchPartyInwardList.status === 200) {
            const fetchPartyInwardListResponse = yield fetchPartyInwardList.json();
            yield put(fetchPartyInwardListByIdSuccess(fetchPartyInwardListResponse));
        } else
            yield put(fetchPartyInwardListByIdError('error'));
    } catch (error) {
        yield put(fetchPartyInwardListByIdError(error));
    }
}

function* fetchInwardPlanDetails(action) {
    try {
        const fetchInwardPlan = yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/inwardEntry/getByCoilId/${action.coilNumber}`, {
            method: 'GET',
        });
        if (fetchInwardPlan.status === 200) {
            const fetchInwardPlanResponse = yield fetchInwardPlan.json();
            const formattedResponse = []
            fetchInwardPlanResponse.instruction.map((instruction) => {
                if (instruction.groupId) {
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
                    if (formattedResponse[instruction.groupId]) {
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
            processId: cutDetails.processId?cutDetails.processId:CUTTING_INSTRUCTION_PROCESS_ID,
            instructionDate: moment(cutDetails.processDate).format('YYYY-MM-DD HH:mm:ss'),
            plannedLength: cutDetails.length,
            plannedWeight: cutDetails.weight,
            plannedNoOfPieces: cutDetails.no,
            plannedWidth: cutDetails.plannedWidth,
            status: 1,
            "createdBy": "1",
            "updatedBy": "1",
            inwardId: cutDetails.inwardId ? cutDetails.inwardId : "",
            parentInstructionId: cutDetails.instructionId ? cutDetails.instructionId : "",
            parentGroupId: cutDetails.parentGroupId ? cutDetails.parentGroupId : ""
        }
        requestBody.push(req);
    })
    try {
        const fetchPartyInwardList = yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/instruction/save`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });
        if (fetchPartyInwardList.status === 200) {
            const fetchPartyListObj = yield fetchPartyInwardList.json()
            yield put(saveCuttingInstructionSuccess(fetchPartyListObj));
        } else
            yield put(saveCuttingInstructionError('error'));
    } catch (error) {
        yield put(saveCuttingInstructionError(error));
    }
}

function* instructionGroupsave(action) {
    const requestBody = [];
    // action.groupDetails.map((groupCut) => {
    //     const req = {
    //             count : groupCut.no,
    //             instructionId:groupCut.instructionId
    //     }
    //     requestBody.push(req);
    // })
    try {
        const groupSaveList = yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/instructionGroup/save', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(action.groupDetails)
        });
        if (groupSaveList.status === 200) {
            const groupSaveListObj = yield groupSaveList.json()
            yield put(instructionGroupsaveSuccess(groupSaveListObj));
        } else
            yield put(instructionGroupsaveError('error'));
    } catch (error) {
        yield put(instructionGroupsaveError(error));
    }
}

function* requestSaveSlittingInstruction(action) {
    const requestBody = [];
    action.slittingDetails.map((slitDetails) => {
        const req = {
            processId: slitDetails.processId?slitDetails.processId:SLITTING_INSTRUCTION_PROCESS_ID,
            instructionDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            plannedLength: slitDetails.plannedLength,
            plannedWidth: slitDetails.plannedWidth,
            plannedWeight: slitDetails.plannedWeight,
            plannedNoOfPieces: slitDetails.plannedNoOfPieces,
            status: 1,
            "createdBy": "1",
            "updatedBy": "1",
            inwardId: slitDetails.inwardId ? slitDetails.inwardId : '',
            parentInstructionId: slitDetails.instructionId ? slitDetails.instructionId : '',
        }
        requestBody.push(req);
    })
    try {
        const fetchPartyInwardList = yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/instruction/save`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });
        if (fetchPartyInwardList.status === 200) {
            const fetchPartyListObj = yield fetchPartyInwardList.json()
            yield put(saveSlittingInstructionSuccess(fetchPartyListObj));
        } else
            yield put(saveSlittingInstructionError('error'));
    } catch (error) {
        yield put(saveSlittingInstructionError(error));
    }
}
function* requestUpdateInstruction(action) {
    const { number, instruction } = action.coil;
    let isCoilFinished = true;
    const ins = instruction.map(item => {
        let insObj = {
            instructionId: item.instructionId ? item.instructionId : null,
            parentInstructionId: item.parentInstructionId ? item.parentInstructionId : null,
            processId: item.process.processId ? item.process.processId : 1,
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
            packetClassificationId: item.packetClassification?.classificationId || ''
        }
        if (item.packetClassification?.classificationId !== 6) {
            insObj.status = 3
        } else {
            isCoilFinished = false;
        }
        return insObj
    })
    const req = {
        isFinishTask: true,
        instructionDtos: ins,
        isCoilFinished
    }
    if (isCoilFinished) {
        req.coilNumber = number;
    }
    try {
        const updateInstruction = yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/instruction/update', {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req)
        });
        if (updateInstruction.status === 200) {
            yield put(updateInstructionSuccess(updateInstruction));
        } else
            yield put(updateInstructionError('error'));

    } catch (error) {
        yield put(updateInstructionError(error));
    }
}

function* requestGradesByMaterialId(action) {
    try {
        const fetchGradesByMaterialIdList = yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/materialGrade/getByMaterialId/${action.materialId}`, {
            method: 'GET',
        });
        if (fetchGradesByMaterialIdList.status === 200) {
            const fetchGradesByMaterialIdListResponse = yield fetchGradesByMaterialIdList.json();
            yield put(getGradeByMaterialIdSuccess(fetchGradesByMaterialIdListResponse));
        } else
            yield put(getGradeByMaterialIdError('error'));
    } catch (error) {
        yield put(getGradeByMaterialIdError(error));
    }
}

function* postDeliveryConfirmRequest(payload) {
    let req_obj ={};
    let requestType = '';
    if(payload.payload?.inwardListForDelivery){
        let packetsData = [];
        for (let item of payload.payload.inwardListForDelivery) {
            let tempItem = {};
            tempItem.instructionId = item.instructionId;
            tempItem.remarks = item.remarks;
            tempItem.weight = item.actualWeight;
            packetsData.push(tempItem);
        }
        req_obj = {
            vehicleNo: payload.payload.vehicleNo,
            deliveryItemDetails: packetsData
        }
    }else{
        requestType= 'PUT';
       req_obj =payload.payload
    }
    try {
        const postConfirm = yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/delivery/save`, {
            method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify(req_obj)
        });
        if (postConfirm.status === 200 && requestType !== 'PUT') {
            yield put(postDeliveryConfirmSuccess());
            history.push('/company/partywise-register')
        } else if(requestType === 'PUT'){
            yield put(postDeliveryConfirmSuccess(postConfirm));
        }else
            yield put(postDeliveryConfirmError('error'));
    } catch (error) {
        yield put(postDeliveryConfirmError(error));
    }
}

function* fetchInwardInstructionDetails(action) {
    try {
        const fetchInwardInstruction = yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/instruction/getById/${action.instructionId}`, {
            method: 'GET',
        });
        if (fetchInwardInstruction.status === 200) {
            const fetchInwardPlanResponse = yield fetchInwardInstruction.json();
            yield put(getInstructionByIdSuccess(fetchInwardPlanResponse));
        } else
            yield put(getInstructionByIdError('error'));
    } catch (error) {
        yield put(getInstructionByIdError(error));
    }
}
function* saveUnprocessedDelivery(action) {
    try {
        const fetchInwardInstruction = yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/instruction/saveUnprocessedForDelivery/${action.inwardEntryId}`, {
            method: 'POST',
        });
        if (fetchInwardInstruction.status === 200) {
            const fetchInwardPlanResponse = yield fetchInwardInstruction.json();
            yield put(saveUnprocessedDeliverySuccess(fetchInwardPlanResponse));
        } else
            yield put(saveUnprocessedDeliveryError('error'));
    } catch (error) {
        yield put(saveUnprocessedDeliveryError(error));
    }
}
function* deleteInwardEntryById(action) {
    try {
        let data = new FormData();
        action.inwardEntryId.map(id =>data.append('ids', id))
        const fetchInwardInstruction = yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/inwardEntry/deleteById', {
            method: 'DELETE',
            body:data
        });
        if (fetchInwardInstruction.status === 200) {
            yield put(deleteInwardEntryByIdSuccess(fetchInwardInstruction));
        } else
            yield put(deleteInwardEntryByIdError('error'));
    } catch (error) {
        yield put(deleteInwardEntryByIdError(error));
    }
}
function* deleteInstructionById(action) {
    try {
        
        const fetchInwardInstruction = yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/instruction/deleteById/${action.id}`, {
            method: 'DELETE'
        });
        if (fetchInwardInstruction.status === 200) {
            yield put(deleteInstructionByIdSuccess(fetchInwardInstruction));
        } else
            yield put(deleteInstructionByIdError('error'));
    } catch (error) {
        yield put(deleteInstructionByIdError(error));
    }
}
function* pdfGenerateInward(action) {
    try {
        const pdfGenerate = yield fetch('http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/pdf/inward', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(action.payload)
        });
        if (pdfGenerate.status === 200) {
            const pdfGenerateResponse = yield pdfGenerate.json();
            yield put(pdfGenerateSuccess(pdfGenerateResponse));
        } else
            yield put(pdfGenerateError('error'));
    } catch (error) {
        yield put(pdfGenerateError(error));
    }
}


export function* watchFetchRequests() {
    yield takeLatest(FETCH_INWARD_LIST_REQUEST, fetchInwardList);
    yield takeLatest(SUBMIT_INWARD_ENTRY, submitInward);
    yield takeLatest(CHECK_COIL_EXISTS, checkCoilDuplicate);
    yield takeLatest( FETCH_INWARD_LIST_BY_ID, fetchPartyListById);
    yield takeLatest(FETCH_INWARD_LIST_BY_PARTY_REQUEST, fetchInwardListByParty);    
    yield takeLatest(FETCH_INWARD_PLAN_DETAILS_REQUESTED, fetchInwardPlanDetails);
    yield takeLatest(REQUEST_SAVE_CUTTING_DETAILS, requestSaveCuttingInstruction);
    yield takeLatest(REQUEST_SAVE_SLITTING_DETAILS, requestSaveSlittingInstruction);
    yield takeLatest(REQUEST_UPDATE_INSTRUCTION_DETAILS, requestUpdateInstruction);
    yield takeLatest(FETCH_MATERIAL_GRADE_LIST_REQUEST, requestGradesByMaterialId);
    yield takeLatest(POST_DELIVERY_CONFIRM_REQUESTED, postDeliveryConfirmRequest);
    yield takeLatest(FETCH_INWARD_INSTRUCTION_DETAILS_REQUESTED, fetchInwardInstructionDetails);
    yield takeLatest(FETCH_INWARD_INSTRUCTION_WIP_DETAILS_REQUESTED, fetchInwardInstructionWIPDetails);
    yield takeLatest(SAVE_UNPROCESSED_FOR_DELIVERY, saveUnprocessedDelivery);
    yield takeLatest(UPDATE_INWARD_LIST, updateInward);
    yield takeLatest(DELETE_INWARD_LIST_BY_ID, deleteInwardEntryById);
    yield takeLatest(DELETE_INSTRUCTION_BY_ID, deleteInstructionById);
    yield takeLatest(CHECK_BATCH_NO_EXIST, checkCustomerBatchNumber);
    yield takeLatest(INSTRUCTION_GROUP_SAVE, instructionGroupsave);
    yield takeLatest(PDF_GENERATE_INWARD, pdfGenerateInward);
}

export default function* inwardSagas() {
    yield all([fork(watchFetchRequests)]);
}
