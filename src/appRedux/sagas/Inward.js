import { all, put, fork, takeLatest, take, call } from "redux-saga/effects";
import { getUserToken } from './common';
import toNumber from 'lodash';
import moment from "moment";
import {
    CHECK_COIL_EXISTS,
    FETCH_INWARD_LIST_REQUEST,
    FETCH_WIP_INWARD_LIST_REQUEST,
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
    PDF_GENERATE_INWARD,
    PDF_GENERATE_DELIVERY,
    PDF_S3_URL,
    GET_RECONCILE_REPORT_SUCCESS,
    GET_RECONCILE_REPORT,
    GET_RECONCILE_REPORT_ERROR,
    QR_Code_GENERATE_PLAN,
    QR_GENERATE_INWARD,
    GET_PACKET_WISE_PRICE_DC_REQUEST,
    GET_PACKET_WISE_PRICE_DC_FULL_HANDLING_REQUEST,
    COIL_NOT_FOUND,
    FETCH_INWARD_LIST_WITH_OLD_API_REQUEST,
    UPDATE_CLASSIFICATION_SLITANDCUT_BEFORE_FINISH
} from "../../constants/ActionTypes";

import {
    fetchInwardListError,
    fetchInwardListSuccess,
    fetchWIPInwardListSuccess,
    fetchWIPInwardListError,
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
    pdfGenerateError,
    generateDCPdfSuccess,
    generateDCPdfError,
    getS3PDFUrlError,
    getS3PDFUrlSuccess,
    getReconcileReport,
    getReconcileReportError,
    getReconcileReportSuccess,
    getPacketwisePriceDCSuccess,
    getPacketwisePriceDCError,
    QrGenerateInwardSuccess,
    getPacketwisePriceDCFullHandlingSuccess,
    getPacketwisePriceDCFullHandlingError,
    coilNotFound
} from "../actions";
import { CUTTING_INSTRUCTION_PROCESS_ID, SLITTING_INSTRUCTION_PROCESS_ID, SLIT_CUT_INSTRUCTION_PROCESS_ID } from "../../constants";
import { formItemLayout } from "../../routes/company/Partywise/CuttingModal";
import { userSignOutSuccess } from "../../appRedux/actions/Auth";
import * as actions from "../actions";

const baseUrl = process.env.REACT_APP_BASE_URL;

const getHeaders = () => ({
    Authorization: getUserToken()
});

 function* fetchInwardList({ page = '', pageSize = 15, searchValue = '', partyId = '', sortColumn='', sortOrder='' }) {
    const body = {
        pageNo: page,
        pageSize: pageSize,
        searchText: searchValue,
        partyId: partyId,
        sortColumn: sortColumn,
        sortOrder: sortOrder
    }
    try {
        // const fetchInwardList = yield fetch(`${baseUrl}api/inwardEntry/partywise/${page}/${pageSize}?searchText=${searchValue}&partyId=${partyId}`, {
            const fetchInwardList = yield fetch(`${baseUrl}api/inwardEntry/partywiselist`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders()},    
            body: JSON.stringify(body)
        });
        if (fetchInwardList.status === 200) {
            const fetchInwardListResponse = yield fetchInwardList.json();
            const inwardResponse = [];
            const { content, totalItems } = fetchInwardListResponse;
            if (content.length > 0) {
                content.map((inward) => {
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
                yield put(fetchInwardListSuccess(inwardResponse, totalItems));
            } 
            else if (content.length === 0) {
                 yield put(coilNotFound(totalItems));
            }
        } else if (fetchInwardList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchInwardListError('error'));
    } catch (error) {
        yield put(fetchInwardListError(error));
    }
}
//fetch inwardList with old api
function* fetchInwardListWithOldAPI({ page = 1, pageSize = 15, searchValue = '', partyId = '' }) {
    try {
        const fetchInwardList = yield fetch(`${baseUrl}api/inwardEntry/list/${page}/${pageSize}?searchText=${searchValue}&partyId=${partyId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (fetchInwardList.status === 200) {
            const fetchInwardListResponse = yield fetchInwardList.json();
            const inwardResponse = [];
            const { content, totalItems } = fetchInwardListResponse;
            if (content.length > 0) {
                content.map((inward) => {
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
                yield put(fetchInwardListSuccess(inwardResponse, totalItems));
            } 
            else if (content.length === 0) {
                 yield put(coilNotFound(totalItems));
            }
        } else if (fetchInwardList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchInwardListError('error'));
    } catch (error) {
        yield put(fetchInwardListError(error));
    }
}

function* fetchWIPInwardList({ page = 1, pageSize = 15, searchValue = '', partyId = '' }) {
    try {
        const fetchWIPInwardList = yield fetch(`${baseUrl}api/inwardEntry/wiplist/${page}/${pageSize}?searchText=${searchValue}&partyId=${partyId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (fetchWIPInwardList.status === 200) {
            const fetchWIPInwardListResponse = yield fetchWIPInwardList.json();
            const inwardResponse = [];
            const { content, totalItems } = fetchWIPInwardListResponse;
            if (content.length > 0) {
                content.map((inward) => {
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
            yield put(fetchWIPInwardListSuccess(inwardResponse, totalItems));
        } else if (fetchWIPInwardList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchWIPInwardListError('error'));
    } catch (error) {
        yield put(fetchWIPInwardListError(error));
    }
}

function* fetchInwardInstructionWIPDetails(action) {
    try {
        const fetchInwardList = yield fetch(`${baseUrl}api/instruction/listWIP`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (fetchInwardList.status === 200) {
            const fetchInwardListResponse = yield fetchInwardList.json();
            yield put(getInstructionWipListSuccess(fetchInwardListResponse));
        } else if (fetchInwardList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(getInstructionWipListError('error'));
    } catch (error) {
        yield put(getInstructionWipListError(error));
    }
}
function* checkCoilDuplicate(action) {
    try {
        const checkCoilDuplicate = yield fetch(`${baseUrl}api/inwardEntry/isCoilPresent?coilNumber=${action.coilNumber}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (checkCoilDuplicate.status === 200) {
            const checkCoilDuplicateResponse = yield checkCoilDuplicate.json();
            yield put(checkDuplicateCoilSuccess(checkCoilDuplicateResponse));
        } else if (checkCoilDuplicate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(checkDuplicateCoilError('error'));
    } catch (error) {
        yield put(checkDuplicateCoilError(error));
    }
}
function* checkCustomerBatchNumber(action) {
    try {
        const checkCustomerBatchNumberResponse = yield fetch(`${baseUrl}api/inwardEntry/isCustomerBatchIdPresent?customerBatchId=${action.customerBatchId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (checkCustomerBatchNumberResponse.status === 200) {
            const checkCoilDuplicateResponse = yield checkCustomerBatchNumberResponse.json();
            yield put(checkCustomerBatchNumberSuccess(checkCoilDuplicateResponse));
        } else if (checkCustomerBatchNumberResponse.status === 401) {
            yield put(userSignOutSuccess());
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
        data.append('coilNumber', 'test_coil');
        data.append('materialId', 123);
        data.append('width', action.inward.width !== undefined ? action.inward.width : Number(action.inward.fWidth));
        data.append('thickness', action.inward.thickness !== undefined ? action.inward.thickness: action.inward.fThickness);
        action.inward.length && data.append('length', action.inward.length);
        data.append('presentWeight', action.inward.netWeight!== undefined ? action.inward.netWeight: action.inward.grossWeight);
        data.append('grossWeight', action.inward.grossWeight);

        // invoice details
        data.append('inwardDate', moment(action.inward.receivedDate).format('YYYY-MM-DD HH:mm:ss'));
        data.append('batchNumber', action.inward.batchNo);
        data.append('tdcNo', action.inward.tdcNo);
        data.append('vehicleNumber', action.inward.vehicleNumber);
        data.append('invoiceDate', moment(action.inward.invoiceDate).format('YYYY-MM-DD HH:mm:ss'));
        data.append('invoiceNumber', action.inward.invoiceNumber);
        data.append('valueOfGoods', action.inward.valueOfGoods);

        //quality details
        data.append('materialGradeId', 12334);
        data.append('testCertificateNumber', action.inward.testCertificateNo);
        data.append('remarks', action.inward.remarks);
        data.append('mmId', action.inward.materialId);

        if (action.inward.testFile) {
            data.append('testCertificateFile', action.inward.testFile.fileList[0].originFileObj, action.inward.testFile.fileList[0].name);
        }

        data.append('statusId', 1);
        data.append('heatnumber', '123');
        data.append('plantname', 'test plant name');
        // data.append('customerInvoiceDajte',  action.inward.grade);
        data.append('createdBy', 1);
        data.append('updatedBy', 1);

        const newInwardEntry = yield fetch(`${baseUrl}api/inwardEntry/addNew`, {
            method: 'POST',
            body: data,
            headers: getHeaders()
        });
        if (newInwardEntry.status == 200) {
            let submitInwardResponse = yield newInwardEntry.json()
            yield put(submitInwardSuccess(submitInwardResponse.inwardEntryId));
        } else if (newInwardEntry.status === 401) {
            yield put(userSignOutSuccess());
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
        customerBatchId: action.inward.customerBatchNo || action.inward.customerBatchId || '',
        customerInvoiceNo: action.inward.customerInvoiceNo,
        coilNumber : (action.inward.coilNumber).toString(),
        inwardDate : moment(action.inward.receivedDate).format('YYYY-MM-DD HH:mm:ss'),
        batchNumber: action.inward.batchNo || '',
        vehicleNumber : action.inward.vehicleNumber !== undefined? action.inward.vehicleNumber : action.inward.vLorryNo,
        invoiceDate : moment(action.inward.invoiceDate).format('YYYY-MM-DD HH:mm:ss')!== undefined ?moment(action.inward.invoiceDate).format('YYYY-MM-DD HH:mm:ss'): null,
        invoiceNumber : action.inward.invoiceNumber !== undefined ? action.inward.invoiceNumber: action.inward.vInvoiceNo,
        valueOfGoods : action.inward.valueOfGoods !== undefined ? action.inward.valueOfGoods: 0,
        purposeType : action.inward.purposeType,
        testCertificateNumber: action.inward.testCertificateNo || action.inward.testCertificateNumber || '',
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
const newInwardEntry = yield fetch(`${baseUrl}api/inwardEntry/update`, {
            
                method: 'PUT',
                headers: { "Content-Type": "application/json", ...getHeaders()},
                body:JSON.stringify(insObj)
            
        });
        if (newInwardEntry.status == 200) {
            yield put(updateInwardSuccess(newInwardEntry));
        } else if (newInwardEntry.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateInwardError('error'));
    } catch (error) {
        yield put(submitInwardError(error));
    }
}

function* fetchInwardListByParty(action) {
    try {
        const fetchPartyInwardList = yield fetch(`${baseUrl}api/inwardEntry/getByPartyId/${action.partyId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (fetchPartyInwardList.status === 200) {
            const fetchPartyInwardListResponse = yield fetchPartyInwardList.json();
            yield put(getCoilsByPartyIdSuccess(fetchPartyInwardListResponse.body));
        } else if (fetchPartyInwardList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(getCoilsByPartyIdError('error'));
    } catch (error) {
        yield put(getCoilsByPartyIdError(error));
    }
}
function* fetchPartyListById(action) {
    try {
        const fetchPartyInwardList = yield fetch(`${baseUrl}api/inwardEntry/getById/${action.inwardEntryId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (fetchPartyInwardList.status === 200) {
            const fetchPartyInwardListResponse = yield fetchPartyInwardList.json();
            yield put(fetchPartyInwardListByIdSuccess(fetchPartyInwardListResponse));
        } else if (fetchPartyInwardList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(fetchPartyInwardListByIdError('error'));
    } catch (error) {
        yield put(fetchPartyInwardListByIdError(error));
    }
}

function* fetchInwardPlanDetails(action) {
    try {
        const fetchInwardPlan = yield fetch(`${baseUrl}api/inwardEntry/getByCoilId/${action.coilNumber}`, {
            method: 'GET',
            headers: getHeaders()
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
        } else if (fetchInwardPlan.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(getCoilPlanDetailsError('error'));
    } catch (error) {
        yield put(getCoilPlanDetailsError(error));
    }
}

function* requestSaveCuttingInstruction(action) {
    try {
        const fetchPartyInwardList = yield fetch(`${baseUrl}api/instruction/save`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders()},
            body: JSON.stringify(action.cuttingDetails)
        });
        if (fetchPartyInwardList.status === 201) {
            const fetchPartyListObj = yield fetchPartyInwardList.json()
            yield put(saveCuttingInstructionSuccess(fetchPartyListObj));
        } else if (fetchPartyInwardList.status === 401) {
            yield put(userSignOutSuccess());
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
        const groupSaveList = yield fetch(`${baseUrl}api/instructionGroup/save`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders()},
            body: JSON.stringify(action.groupDetails)
        });
        if (groupSaveList.status === 200) {
            const groupSaveListObj = yield groupSaveList.json()
            yield put(instructionGroupsaveSuccess(groupSaveListObj));
        } else if (groupSaveList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(instructionGroupsaveError('error'));
    } catch (error) {
        yield put(instructionGroupsaveError(error));
    }
}

function* requestSaveSlittingInstruction(action) {
    try {
        const fetchPartyInwardList = yield fetch(`${baseUrl}api/instruction/save`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders()},
            body: JSON.stringify(action.slittingDetails)
        });
        if (fetchPartyInwardList.status === 201) {
            const fetchPartyListObj = yield fetchPartyInwardList.json()
            yield put(saveSlittingInstructionSuccess(fetchPartyListObj));
        } else if (fetchPartyInwardList.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(saveSlittingInstructionError('error'));
    } catch (error) {
        yield put(saveSlittingInstructionError(error));
    }
}
function* requestUpdateInstruction(action) {
    const { number, instruction, unfinish, editFinish } = action.coil;
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
        instructionDtos: (unfinish || editFinish) ? ins : filteredData,
        actualYieldLossRatio: action.coil.actualYieldLossRatio,
        plannedCoilLevelYLR: action.coil.plannedCoilLevelYLR,
        actualCoilLevelYLR: action.coil.actualCoilLevelYLR
    }
    try {
        const updateInstruction = yield fetch(`${baseUrl}api/instruction/update`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json", ...getHeaders()},
            body: JSON.stringify(req)
        });
        if (updateInstruction.status === 200) {
            yield put(updateInstructionSuccess(updateInstruction));
        } else if (updateInstruction.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(updateInstructionError('error'));

    } catch (error) {
        yield put(updateInstructionError(error));
    }
}

function* requestGradesByMaterialId(action) {
    try {
        const fetchGradesByMaterialIdList = yield fetch(`${baseUrl}api/materialGrade/getByMaterialId/${action.materialId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (fetchGradesByMaterialIdList.status === 200) {
            const fetchGradesByMaterialIdListResponse = yield fetchGradesByMaterialIdList.json();
            yield put(getGradeByMaterialIdSuccess(fetchGradesByMaterialIdListResponse));
        } else if (fetchGradesByMaterialIdList.status === 401) {
            yield put(userSignOutSuccess());
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
            if (item.instructionId) {
                let tempItem = {};
                tempItem.instructionId = item.instructionId;
                tempItem.remarks = item.remarks;
                tempItem.weight = item.actualWeight || item.plannedWeight;
                packetsData.push(tempItem);
            }
        }
        req_obj = {
            vehicleNo: payload.payload?.vehicleNo,
            packingRateId: payload.payload?.packingRateId,
            laminationId: payload.payload?.laminationId,
            taskType:payload.payload?.taskType?payload.payload?.taskType:"",
            deliveryItemDetails: packetsData
        }
    }else{
        requestType= 'PUT';
        req_obj =payload.payload
    }
    try {
        const postConfirm = yield fetch(`${baseUrl}api/delivery/save`, {
            method: 'POST', headers: { "Content-Type": "application/json", ...getHeaders()}, body: JSON.stringify(req_obj)
        });
        if (postConfirm.status === 200 && requestType !== 'PUT') {
            yield put(postDeliveryConfirmSuccess());
           
        } else if(postConfirm.status === 200 && requestType === 'PUT'){
            yield put(postDeliveryConfirmSuccess(postConfirm));
        } else if (postConfirm.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(postDeliveryConfirmError('error'));
    } catch (error) {
        yield put(postDeliveryConfirmError(error));
    }
}

function* fetchInwardInstructionDetails(action) {
    try {
        const fetchInwardInstruction = yield fetch(`${baseUrl}api/instruction/getById/${action.instructionId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (fetchInwardInstruction.status === 200) {
            const fetchInwardPlanResponse = yield fetchInwardInstruction.json();
            yield put(getInstructionByIdSuccess(fetchInwardPlanResponse));
        } else if (fetchInwardInstruction.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(getInstructionByIdError('error'));
    } catch (error) {
        yield put(getInstructionByIdError(error));
    }
}
function* saveUnprocessedDelivery(action) {
    let fetchInwardInstruction
    try {
        if(action?.inwardEntryId?.motherCoilDispatch){
         fetchInwardInstruction = yield fetch(`${baseUrl}api/instruction/saveFullHandlingDispatch`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders()},
            body: JSON.stringify(action.inwardEntryId?.inwardEntryId)
        });
    }else{
        fetchInwardInstruction = yield fetch(`${baseUrl}api/instruction/saveUnprocessedForDelivery/${action.inwardEntryId?.inwardEntryId}`, {
            method: 'POST',
            headers: getHeaders()
        });
    }
        if (fetchInwardInstruction.status === 200) {
            const fetchInwardPlanResponse = yield fetchInwardInstruction.json();
            yield put(saveUnprocessedDeliverySuccess(fetchInwardPlanResponse));
        } else if (fetchInwardInstruction.status === 401) {
            yield put(userSignOutSuccess());
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
        const fetchInwardInstruction = yield fetch(`${baseUrl}api/inwardEntry/deleteById`, {
            method: 'DELETE',
            body: data,
            headers: getHeaders()
        });
        if (fetchInwardInstruction.status === 200) {
            yield put(deleteInwardEntryByIdSuccess(fetchInwardInstruction));
        } else if (fetchInwardInstruction.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteInwardEntryByIdError('error'));
    } catch (error) {
        yield put(deleteInwardEntryByIdError(error));
    }
}
function* deleteInstructionById(action) {
    try {
        const fetchInwardInstruction = yield fetch(`${baseUrl}api/instruction/${action.param}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                ...getHeaders()
            },
            body: JSON.stringify(action.payload)
        });
        if (fetchInwardInstruction.status === 200) {
            yield put(deleteInstructionByIdSuccess(fetchInwardInstruction, action.param));
        } else if (fetchInwardInstruction.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(deleteInstructionByIdError('error'));
    } catch (error) {
        yield put(deleteInstructionByIdError(error));
    }
}
function* pdfGenerateInward(action) {
    let partDetailsId = action.payload.partId;
    let pdfGenerate
    try {
        // inward pdf
        if(action.payload.type === 'inward'){
            pdfGenerate = yield fetch(`${baseUrl}api/pdf/inward`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    ...getHeaders()
                  },
                body: JSON.stringify(action.payload.payloadObj)
            });
        }else {
            pdfGenerate = yield fetch(`${baseUrl}api/pdf`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    ...getHeaders()
                  },
                body: JSON.stringify(action.payload)
            });
        } 
    //     else{
    //         // process pdf
    //     pdfGenerate = yield fetch(`http://steelproduct-env.eba-dn2yerzs.ap-south-1.elasticbeanstalk.com/api/pdf/${partDetailsId}`, {
    //         method: 'GET',
           
    //     });

    //    }
        
    if (pdfGenerate.status === 200) {
            const pdfGenerateResponse = yield pdfGenerate.json();
            
            let pdfWindow = window.open("")
               pdfWindow.document.write(
                  "<iframe width='100%' height='600%' src='data:application/pdf;base64, " +
                    encodeURI(pdfGenerateResponse.encodedBase64String) + "'></iframe>"
               )                 
            yield put(pdfGenerateSuccess(pdfGenerateResponse));
        } else if (pdfGenerate.status === 401) {
            yield put(userSignOutSuccess());
        }  else
            yield put(pdfGenerateError('error'));
    }
     catch (error) {
        yield put(pdfGenerateError(error));
    }
}
function* generateDCPdf(action) {
    try {
        const pdfGenerate = yield fetch(`${baseUrl}api/pdf/delivery`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders()},
            body: JSON.stringify(action.payload)
        });
        if (pdfGenerate.status === 200) {
            const pdfGenerateResponse = yield pdfGenerate.json();
            let pdfWindow = window.open("")
               pdfWindow.document.write(
                  "<iframe width='100%' height='600%' src='data:application/pdf;base64, " +
                    encodeURI(pdfGenerateResponse.encodedBase64String) + "'></iframe>"
               )                 
            yield put(generateDCPdfSuccess(pdfGenerateResponse));
        } else if (pdfGenerate.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(generateDCPdfError('error'));
    } catch (error) {
        yield put(generateDCPdfError(error));
    }
}
function* getS3PDFUrl(action) {
    try {
        const getS3PDFUrl = yield fetch(`${baseUrl}api/inwardEntry/getPlanPDFs/${action.inwardEntryId}`, { 
            method: 'GET',
            headers: getHeaders()
        });
        if (getS3PDFUrl.status === 200) {
            const response = yield getS3PDFUrl.json();
            yield put(getS3PDFUrlSuccess(response));
        } else if (getS3PDFUrl.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(getS3PDFUrlError('error'));
    } catch (error) {
        yield put(getS3PDFUrlError(error));
    }
}
function* getReconcileReportSaga(action) {
    try {
        const getreconcileData = yield fetch(`${baseUrl}api/reports/reconcile/${action.coilNumber}`, { 
            method: 'GET',
            headers: getHeaders()
        });
        if (getreconcileData.status === 200) {
            const response = yield getreconcileData.json();
            yield put(getReconcileReportSuccess(response));
        } else if (getreconcileData.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(getReconcileReportError('error'));
    } catch (error) {
        yield put(getReconcileReportError(error));
    }
}
// function* QrGenerateInward(action) {
//     try {
//         const qrGenerateInward = yield fetch(`${baseUrl}api/inwardEntry/qrcode/inward`, {
//             method: 'POST',
//             headers: { "Content-Type": "application/json", ...getHeaders()},
//             body: JSON.stringify(action.payload.payloadObj)
//         });
//         if (qrGenerateInward.status === 200) {
//             const qrGenerateInwardResponse = yield qrGenerateInward.json();
//             let pdfWindow = window.open("")
//                pdfWindow.document.write(
//                   "<iframe width='100%' height='600%' src='data:application/pdf;base64, " +
//                     encodeURI(qrGenerateInwardResponse.encodedBase64String) + "'></iframe>"
//                )                 
//             yield put(QrGenerateInwardSuccess(qrGenerateInwardResponse));
//         } else if (qrGenerateInward.status === 401) {
//             yield put(userSignOutSuccess());
//         } else
//             yield put(actions.QrGenerateInwardError('error'));
//     } catch (error) {
//         yield put(actions.QrGenerateInwardError(error));
//     }
// }

// function* QrGeneratePlan(action) {
//     try {
//             const response = yield call(fetch, `${baseUrl}api/instruction/qrcode/plan`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 ...getHeaders()
//             },
//             body: JSON.stringify(action.payload)
//         });
//         if (response.status === 200) {
//             const qrGenerateResponse = yield response.json();
//            let qrWindow = window.open('', "_blank")
//             qrWindow.document.write(
//                 "<iframe id='qr' width='100%' height='600%' src='data:application/pdf;base64, " +
//                 encodeURI(qrGenerateResponse.encodedBase64String) + "'></iframe>"
//             )
//             yield put(actions.QrCodeGeneratePlanSuccess(qrGenerateResponse));
//         } else if (response.status === 401) {
//             yield put(userSignOutSuccess());
//         } else {
//             yield put(actions.QrCodeGeneratePlanError('error'));
//         }
//     } catch (error) {
//         yield put(actions.QrCodeGeneratePlanError(error));
//     }
// }

function* getPacketwisePriceDCSaga(action) {

    console.log('Saga: ', action);
    let req_obj ={};
    if(action.payload?.inwardListForDelivery){
        let packetsData = [];
        for (let item of action.payload.inwardListForDelivery) {
            if (item.instructionId) {
                let tempItem = {};
                tempItem.instructionId = item.instructionId;
                tempItem.remarks = item.remarks;
                tempItem.weight = item.actualWeight || item.plannedWeight;
                packetsData.push(tempItem);
            }
        }
        req_obj = {
            vehicleNo: action.payload?.vehicleNo,
            packingRateId: action.payload?.packingRateId,
            laminationId: action.payload?.laminationId,
            taskType:action.payload?.taskType?action.payload?.taskType:"",
           //taskType:action.payload?.taskType,
            deliveryItemDetails: packetsData
        }
    }
    try {
        console.log('request: ', req_obj);
        const response = yield call(fetch, `${baseUrl}api/delivery/validatePriceMapping`, {
            method: 'POST', headers: { "Content-Type": "application/json", ...getHeaders()}, body: JSON.stringify(req_obj)
        });
        const respData=yield response.json();
        if (response.status === 200 ) {
            yield put(getPacketwisePriceDCSuccess(respData));
        } else if (response.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(getPacketwisePriceDCError('error'));
    } catch (error) {
        yield put(getPacketwisePriceDCError(error));
    }
}

function* getPacketwisePriceDCFullHandlingSaga(action) {
    let req_obj ={};
    if(action.payload){
        req_obj = {
            vehicleNo: action.payload?.vehicleNo,
            packingRateId: action.payload?.packingRateId,
            laminationId: action.payload?.laminationId,
            inwardList: action.payload?.inwardEntryId
        }
    }
    try {
        const response = yield call(fetch, `${baseUrl}api/delivery/validatePriceMappingFullHandling`, {
            method: 'POST', headers: { "Content-Type": "application/json", ...getHeaders()}, body: JSON.stringify(req_obj)
        });
        const respData=yield response.json();
        if (response.status === 200 ) {
            yield put(getPacketwisePriceDCFullHandlingSuccess(respData));
        } else if (response.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(getPacketwisePriceDCFullHandlingError('error'));
    } catch (error) {
        yield put(getPacketwisePriceDCFullHandlingError(error));
    }
}

function* updateClassificationSlitAndCutBeforeFinish(action) {
    const requestBody = [];    
    try {
        const updateClassification = yield fetch(`${baseUrl}api/instruction/update/classification`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", ...getHeaders()},
            body: JSON.stringify(action.payload)
        });
        if (updateClassification.status === 200) {
            const groupSaveListObj = yield updateClassification.json()
           // yield put(instructionGroupsaveSuccess(groupSaveListObj));
        } else if (updateClassification.status === 401) {
            yield put(userSignOutSuccess());
        } else
            yield put(instructionGroupsaveError('error'));
    } catch (error) {
        yield put(instructionGroupsaveError(error));
    }
}


export function* watchFetchRequests() {
    yield takeLatest(FETCH_INWARD_LIST_REQUEST, fetchInwardList);
    yield takeLatest(FETCH_INWARD_LIST_WITH_OLD_API_REQUEST, fetchInwardListWithOldAPI);
    yield takeLatest(FETCH_WIP_INWARD_LIST_REQUEST, fetchWIPInwardList);
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
    yield takeLatest(PDF_GENERATE_DELIVERY, generateDCPdf);
    yield takeLatest(PDF_S3_URL, getS3PDFUrl);
    yield takeLatest(GET_RECONCILE_REPORT, getReconcileReportSaga);
    // yield takeLatest(QR_Code_GENERATE_PLAN, QrGeneratePlan);
    // yield takeLatest(QR_GENERATE_INWARD, QrGenerateInward);
    yield takeLatest(GET_PACKET_WISE_PRICE_DC_REQUEST, getPacketwisePriceDCSaga);
    yield takeLatest(GET_PACKET_WISE_PRICE_DC_FULL_HANDLING_REQUEST, getPacketwisePriceDCFullHandlingSaga);
    yield takeLatest(UPDATE_CLASSIFICATION_SLITANDCUT_BEFORE_FINISH, updateClassificationSlitAndCutBeforeFinish);   

}

export default function* inwardSagas() {
    yield all([fork(watchFetchRequests)]);
}
