import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Table,
  Select,
  Icon,
  Tabs,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import moment from "moment";
import {
  setProcessDetails,
  saveCuttingInstruction,
  resetInstruction,
  updateInstruction,
  deleteInstructionById,
  instructionGroupsave,
  pdfGenerateInward,
  QrCodeGeneratePlan,
  updateClassificationSlitAndCutBeforeFinish,
} from "../../../appRedux/actions/Inward";
import { labelPrintEditFinish } from "../../../appRedux/actions/LabelPrint";
import {
  APPLICATION_DATE_FORMAT,
  METAL_DENSITY,
  STATUS_IN_PROGRESS,
} from "../../../constants";
import { fetchYLRList } from "../../../appRedux/actions";
import {
  getMainColumns,
  getPlanColumns,
  getSlitCutColumns,
  getSlitColumns,
  getYieldLossColumns,
} from "./CuttingTableColumns";

const Option = Select.Option;

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 14 },
  },
};

const userId = localStorage.getItem("userId");

const CreateCuttingDetailsForm = (props) => {
  const TabPane = Tabs.TabPane;
  const { getFieldDecorator } = props.form;
  let loading = "";
  const [confirmClicks, setConfirmClicks] = useState([]);
  const [showPositiveToleranceModal, setShowPositiveToleranceModal] =
    useState(false);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState({});
  const [cuts, setCuts] = useState([]);
  const [insData, setInstruction] = useState({});
  const [page, setPage] = useState(1);
  const [balanced, setBalanced] = useState(true);
  const [tweight, settweight] = useState(0);
  const [totalActualweight, setTotalActualWeight] = useState(0);
  const [no, setNo] = useState();
  const [validate, setValidate] = useState(true);
  const [editingRecord, setEditingRecord] = useState(false);

  const lengthValue =
    props.coilDetails.availableLength >= 0
      ? props.coilDetails.availableLength
      : props.plannedLength(props.coilDetails);
  const widthValue = props.coilDetails.fWidth
    ? props.coilDetails.fWidth
    : props.plannedWidth(props.coilDetails);
  const WeightValue =
    props.coilDetails.fpresent >= 0
      ? props.coilDetails.fpresent
      : props.plannedWeight(props.coilDetails);
  let widthCheck =
    lengthValue !== 0 && WeightValue !== 0
      ? props.coilDetails.fWidth || props.coilDetails.plannedWidth
      : widthValue;
  const [currentWeight, setcurrentWeight] = useState(
    props.coilDetails.fpresent >= 0
      ? props.coilDetails.fpresent
      : props.plannedWeight(props.coilDetails),
  );
  const [length, setlength] = useState(lengthValue);
  const [width, setwidth] = useState(widthCheck);
  const [cutValue, setCutValue] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [balancedValue, setBalancedValue] = useState(false);
  const [bundledList, setbundledList] = useState(false);
  const [bundledListReq, setbundledListReq] = useState([]);
  const [bundledListRes, setbundledListRes] = useState(undefined);
  const [tpweight, settpweight] = useState([]);
  const [weightIndex, setWeightIndex] = useState();
  const [bundleTableData, setbundleTableData] = useState([]);
  const [cutsNo, setCutsNo] = useState([]);
  const [cutsLength, setCutsLength] = useState(0);
  const [bundleItemList, setBundleItemList] = useState([]);
  const [restTableData, setRestTableData] = useState([]);
  const [selectedPast, setSelectedPast] = useState([]);
  const [packetNo, setPacketNo] = useState(0);
  const [cutPayload, setCutPayload] = useState([]);
  const [selectedKey, setSelectedKey] = useState([]);
  const [saveInstruction, setSaveInstruction] = useState([]);
  const [saveCutting, setSaveCutting] = useState([]);
  const [unsavedDeleteId, setUnsavedDeleteId] = useState(0);
  const [slitPartId, setSlitPartId] = useState("");
  const [tagsName, setTagsName] = useState("");
  const [endUserTagList, setEndUserTagList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [packetClassification, setPacketClassification] = useState([]);
  const [editedRecordState, setEditedRecordState] = useState([]);
  const [salesOrders, setSalesOrders] = useState(props?.salesOrders || []);
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState(
    props.wip
      ? props.childCoil
        ? props.coilDetails
        : props.coilDetails && props.coilDetails.instruction
          ? props.coilDetails.instruction
          : props.coilDetails.childInstructions
      : cuts,
  );

  const onInputChange = (key, index, record, type) => (e) => {
    let editedRecord = [];
    editedRecord.push(record);
    editedRecord = [...new Set([...editedRecordState, ...editedRecord])];
    setEditedRecordState(editedRecord);
    const newData = [...tableData];
    const newIndex = (page - 1) * 10 + index;
    newData[newIndex][key] =
      type === "select"
        ? key === "endUserTagsentity"
          ? { tagId: Number(e) }
          : { classificationId: Number(e) }
        : Number(e.target.value);
    // Yield loss Ratio
    if (
      (key === "packetClassification" && type === "select") ||
      key === "actualWeight"
    ) {
      const edgeTrimWeights = newData
        .filter((record) => {
          const classificationName = getPackatClassificationName(
            record.packetClassification?.classificationId ||
              record.packetClassification?.tagId,
          );
          return (
            classificationName === "EDGE TRIM" ||
            classificationName === "CUT ENDS"
          );
        })
        .map((record) => record.actualWeight);

      const totalActualWeight = newData.reduce(
        (total, record) => total + record.actualWeight,
        0,
      );

      const sumEdgeTrimWeight = edgeTrimWeights.reduce(
        (total, weight) => total + weight,
        0,
      );

      const yieldLossRatio = (sumEdgeTrimWeight / totalActualWeight) * 100;
      setactualYLR(yieldLossRatio);
    }
    setTableData(newData);
  };

  const handleWeight = (e, record) => {
    e.preventDefault();
    // if (
    //   Number(record.plannedWeight) + totalActualweight > tweight ||
    //   Number(record.actualWeight) + totalActualweight > tweight
    // ) {
    //   message.error("Error! Please adjust the weight");
    // }
    const instructionList = tableData
      .slice(0, tableData.length - 1)
      .filter((item) =>
        editedRecordState.some(
          (record) =>
            record !== undefined && record.instructionId === item.instructionId,
        ),
      );

    let instructionPayload = [
      {
        partDetailsRequest: {
          targetWeight: "0",
          length: "0",
          createdBy: userId,
          updatedBy: userId,
          deleteUniqId: 0,
        },
        instructionRequestDTOs: [
          {
            processId: props.slitCut === true ? 2 : 1,
            // processId: 2,
            // instructionDate: "2022-04-28 21:04:49",
            instructionDate: record?.instructionDate,
            plannedLength: record?.plannedLength,
            actualLength: record?.actualLength,
            actualNoOfPieces: record?.actualNoOfPieces,
            actualWeight: record?.actualWeight,
            plannedWidth: record?.plannedWidth,
            // plannedNoOfPieces: record?.plannedWidth,
            plannedNoOfPieces: record?.plannedNoOfPieces,
            isSlitAndCut: props.slitCut,
            // plannedNoOfPieces: "1",
            status: 1,
            createdBy: userId,
            updatedBy: userId,
            groupId: null,
            plannedWeight:
              (props?.coilDetails?.scrapWeight === null
                ? 0
                : props?.coilDetails?.scrapWeight) || record.actualWeight,
            inwardId: props?.coilDetails?.inwardEntryId,
            parentInstructionId: "",
            endUserTagId: record?.endUserTagsentity?.tagId,
            deleteUniqId: 0,
            isScrapWeightUsed: true,
            packetClassificationId:
              record?.packetClassification?.tagId ||
              record?.packetClassification?.classificationId,
          },
        ],
      },
    ];
    props.saveCuttingInstruction(instructionPayload);
    const coil = {
      number: props.coil.coilNumber,
      instruction: instructionList,
    };
    props.updateInstruction(coil);
    // props.labelPrintEditFinish(coil);
    props.setShowCuttingModal(false);
  };

  const onUpdateClassificationWIP = (index, record) => {
    let payload = {
      instructionId: record.instructionId,
      inwardId: record.inwardEntryId,
      packetClassificationId: record.packetClassification.classificationId,
    };
    //console.log('payload  ==  ',payload);
    props.updateClassificationSlitAndCutBeforeFinish(payload);
  };

  const handleClassificationChange = (value, index, record) => {
    record.packetClassificationId = value;
    record.packetClassificationName = getPackatClassificationName1(value);
    // if (record.packetClassification === 27 || record.packetClassification === 26) {
    if (
      record.packetClassificationName === "WIP(EDGE TRIM)" ||
      record.packetClassificationName === "WIP(CUT ENDS)"
    ) {
      // Calculate new plannedWeight by adding a certain amount in array
      const plannedWeight = parseFloat(record.plannedWeight);
      const newWeightAddition = plannedWeight;
      setWeightAdditions([...weightAdditions, newWeightAddition]);
    } else {
      // Remove weight addition if packet classification is not 27 or 26
      const plannedWeight = parseFloat(record.plannedWeight);
      const removedWeightAddition = plannedWeight;
      setWeightAdditions(
        weightAdditions.filter(
          (addition) => addition !== removedWeightAddition,
        ),
      );
    }
  };

  const handleTagsChange = (record, e, type = "") => {
    setTagsName(e);
    if (type === "endUser") {
      record.endUserTagId = e;
    } else {
      record.packetClassificationId = e;
    }
  };

  const onEdit = (record, index) => {
    const { form } = props;
    setEditingRecord(index + 1);
    if (record.instructionId) {
      setSaveCutting((prev) => [
        ...prev,
        {
          ...record,
        },
      ]);
    }
    form.setFieldsValue({
      length: record.plannedLength,
      no: record.plannedNoOfPieces,
      weight: record.plannedWeight,
    });
    setTagsName(record?.packetClassification?.tagId);
  };

  const columns = getMainColumns({
    onInputChange,
    props,
    packetClassification,
    handleWeight,
    onUpdateClassificationWIP,
    page,
  });

  const columnsPlan = getPlanColumns({
    page,
    packetClassification,
    handleClassificationChange,
    handleTagsChange,
    onEdit,
    setDeleteRecord,
    setshowDeleteModal,
    props,
  });

  const columnsSlitCut = getSlitCutColumns({
    endUserTagList,
    handleTagsChange,
    setDeleteRecord,
    setshowDeleteModal,
  });

  const columnsSlit = getSlitColumns({ page });

  const columnYieldLoss = getYieldLossColumns({ page });

  const [weightAdditions, setWeightAdditions] = useState([]);
  const [totalWeightAddition, setTotalWeightAddition] = useState(0);
  const [cuttingfilteredData, setCuttingFilteredData] = useState();
  const getPackatClassificationName1 = (value) => {
    // return packetClassification.filter((item)=>item.tagId==value)?.[0].tagName;
    // return packetClassification.filter((item)=>item.tagId==value)?.[0].tagId;
  };

  const ratio = ((totalWeightAddition / tweight) * 100).toFixed(2);

  React.useEffect(() => {
    setSalesOrders(props?.salesOrders || []);
  }, [props.salesOrders]);

  React.useEffect(() => {
    const newTotalWeightAddition = weightAdditions.reduce(
      (total, addition) => total + addition,
      0,
    );
    setTotalWeightAddition(newTotalWeightAddition);
  }, [weightAdditions]);

  const resetSaveInstruction = (record) => {
    setSaveInstruction((prev) =>
      prev.filter((item) => item.deleteUniqId !== record.deleteUniqId),
    );
  };

  const onDelete = ({ record, e, type }) => {
    e.preventDefault();
    const payload = {
      instructionId: record.instructionId,
    };

    if (record.instructionId) {
      // ✅ Saved record - delete from backend
      setlength(
        (prevLength) =>
          prevLength +
          Number(record.plannedLength) * Number(record.plannedNoOfPieces),
      );
      setcurrentWeight(
        (prevWeight) => prevWeight + Number(record.plannedWeight),
      );

      props.deleteInstructionById(payload, "cut");

      if (props.slitCut) {
        setCutValue((prev) =>
          prev.filter((item) => item.partId !== record.partId),
        );
        setRestTableData((prev) =>
          prev.filter((item) => item.partId !== record.partId),
        );

        const res = cuts.filter(
          (data) => data.groupId === record.parentGroupId,
        );
        res.forEach((item) => {
          item.groupId = null;
        });

        setBundleItemList((prev) =>
          prev.filter((item) => item.groupId !== record.parentGroupId),
        );
        setbundledList(false);

        if (cuts.length !== bundleTableData.length) {
          setbundleTableData((prev) => {
            const updated = prev.filter(
              (item) => item.groupId !== res?.groupId,
            );
            return res?.length ? [...updated, ...res] : prev;
          });
        } else {
          setSelectedRowKeys([]);
          setSelectedPast([]);
          settpweight([]);
          setCutsNo([]);
        }
      } else {
        setCuts((prev) =>
          prev.filter((item) => item.instructionId !== record.instructionId),
        );
      }

      props.form.setFieldsValue({ no: 0 });
      setshowDeleteModal(false);
    } else if (type === "slitCut") {
      // ✅ Unsaved slitCut record
      setCutValue((prev) => {
        const filtered = prev.filter(
          (item) => item.deleteUniqId !== record.deleteUniqId,
        );
        setRestTableData(filtered);
        setConfirmClicks(filtered.map((item) => item.index));
        return filtered;
      });

      resetSaveInstruction(record);
      setshowDeleteModal(false);
    } else {
      // ✅ Unsaved cutting record
      setValidate(false);

      // Fix: Safely update saveInstruction
      setSaveInstruction((prev) => {
        if (!prev || prev.length === 0) return [];
        return prev.map((instruction) => ({
          ...instruction,
          instructionRequestDTOs: instruction.instructionRequestDTOs.filter(
            (item) => item.deleteUniqId !== record.deleteUniqId,
          ),
        }));
      });

      setlength(
        (prevLength) =>
          prevLength +
          Number(record.plannedLength) * Number(record.plannedNoOfPieces),
      );
      setcurrentWeight(
        (prevWeight) => prevWeight + Number(record.plannedWeight),
      );
      if (record.soRefNo) {
        const filteredSalesOrders = salesOrders.map((so) =>
          so.refno === record.soRefNo
            ? { ...so, isDisplay: true }
            : so,
        );
        setSalesOrders(filteredSalesOrders);
      }

      // Fix: Better filtering using deleteUniqId
      setCuts((prev) =>
        prev.filter((item) => item.deleteUniqId !== record.deleteUniqId),
      );
      setCutPayload((prev) =>
        prev.filter((item) => item.deleteUniqId !== record.deleteUniqId),
      );

      // Also update saveCutting state
      setSaveCutting((prev) =>
        prev.filter((item) => item.deleteUniqId !== record.deleteUniqId),
      );

      setshowDeleteModal(false);
      props.form.setFieldsValue({ no: 0 });
    }
  };

  const onChange = () => {
    setBalancedValue(true);
    props.form.setFieldsValue({
      no: no,
    });
  };

  //Add Size >
  const handleSubmit = (e) => {
    e.preventDefault();
    let remainWeight;
    props.form.validateFields((err, values) => {
      if (!err) {
        let instructionPlanDto = {
          targetWeight: "",
          length: "",
          createdBy: userId,
          updatedBy: userId,
        };

        setValidate(false);
        if (values.weight > currentWeight) {
          message.error("Weight greater than available weight", 2);
        } else if (
          length <
          props.inward.process.length * props.inward.process.no
        ) {
          message.error("Length greater than available length", 2);
        } else {
          remainWeight = currentWeight - values.weight;

          let slitcuts = [];

          if (editingRecord) {
            // ✏️ EDIT existing record

            // Step 1: Update saveCutting
            const updatedCutting = saveCutting.map((item, index) =>
              index + 1 === editingRecord
                ? {
                    ...item,
                    plannedLength: values.length,
                    plannedNoOfPieces: values.no,
                    plannedWeight: values.weight,
                    packetClassificationId: tagsName,
                    updatedBy: userId,
                    status: item?.instructionId
                      ? item?.status?.statusId
                      : item?.status, // Keep status if already saved
                    process: item?.instructionId ? undefined : item?.process,
                    processId: item?.instructionId
                      ? item?.process?.processId
                      : item?.process, // Keep status if already saved
                  }
                : item,
            );

            setSaveCutting(updatedCutting);

            // Step 2: Update cuts
            setCuts((prev) =>
              prev.map((item, index) =>
                index + 1 === editingRecord
                  ? {
                      ...item,
                      plannedLength: values.length,
                      plannedNoOfPieces: values.no,
                      plannedWeight: values.weight,
                      packetClassificationId: tagsName,
                      updatedBy: "1",
                      status: item.instructionId ? item.statusId : item?.status, // Keep status if already saved
                      process: item?.instructionId ? undefined : item?.process, // Only set process for unsaved items
                      processId: item?.instructionId
                        ? item?.process?.processId
                        : item?.process,
                    }
                  : item,
              ),
            );

            // ✅ FIX: Step 3: Rebuild saveInstruction with updatedCutting
            setSaveInstruction([
              {
                partDetailsRequest: instructionPlanDto,
                instructionRequestDTOs: updatedCutting, // Use the updated array
                deleteUniqId: unsavedDeleteId,
              },
            ]);

            setEditingRecord(false);
          } else {
            // ➕ CREATE new record
            const newCut = {
              processId: props.slitCut ? 2 : 1,
              instructionDate: moment().format("YYYY-MM-DD HH:mm:ss"),
              plannedLength: props.inward.process.length,
              plannedNoOfPieces: props.inward.process.no,
              plannedWeight: props.inward.process.weight.toFixed(2),
              isSlitAndCut: props.slitCut,
              status: 1,
              createdBy: userId,
              updatedBy: userId,
              plannedWidth: props.coilDetails?.fWidth
                ? props.coilDetails.fWidth
                : props.coilDetails.plannedWidth,
              inwardId: props.coilDetails?.inwardEntryId || "",
              parentInstructionId: props.coilDetails?.instructionId || "",
              groupId: "",
              deleteUniqId: unsavedDeleteId,
              packetClassificationId: null,
              endUserTagId: null,
              isScrapWeightUsed: false,
              soRefNo: props.inward.process.soRefNo || "",
              soAllocationId: props.inward.process.soAllocationId || "",
              mmid: props.inward.process.mmid || "",
            };
            slitcuts = [newCut];

            setSaveCutting((prev) => [...prev, newCut]);
            setCuts((prev) => [...prev, newCut]);

            if (props.inward.process.soRefNo) {
              const filteredSalesOrders = salesOrders.map((so) =>
                so.refno === props.inward.process.soRefNo
                  ? { ...so, isDisplay: false }
                  : so,
              );
              setSalesOrders(filteredSalesOrders);
            }

              // ✅ FIX: APPEND to saveInstruction instead of replacing
              setSaveInstruction((prev) => {
                if (prev.length === 0) {
                  // First cut - create new instruction
                  return [
                    {
                      partDetailsRequest: instructionPlanDto,
                      instructionRequestDTOs: [newCut],
                      deleteUniqId: unsavedDeleteId,
                    },
                  ];
                }

                // Subsequent cuts - append to existing instruction
                return [
                  {
                    ...prev[0],
                    instructionRequestDTOs: [
                      ...prev[0].instructionRequestDTOs,
                      newCut,
                    ],
                  },
                ];
              });
          }

          // shared updates
          setcurrentWeight(remainWeight);
          setlength(
            length - props.inward.process.length * props.inward.process.no,
          );

          props.resetInstruction();
          setUnsavedDeleteId((prev) => prev + 1);
          props.setProcessDetails({});
        }
      } else {
        setValidate(true);
        message.error("Please enter the mandatory fields(*)", 2);
      }
    });
  };

  useEffect(() => {
    if (props.inward.process.length && props.inward.process.no) {
      let weight = cuts.map((i) =>
        !i.instructionId ? Number(i.plannedWeight) : 0,
      );
      weight =
        cuts.length > 0
          ? weight.reduce((total, num) => total + Number(num))
          : 0;
      if (props.coilDetails.instructionId)
        props.setProcessDetails({
          ...props.inward.process,
          weight:
            Number(tweight) >= 0 && balancedValue
              ? WeightValue - Number(weight)
              : Math.round(
                  0.0000081 *
                    parseFloat(width) *
                    parseFloat(props.inward.plan.fThickness) *
                    parseFloat(props.inward.process.length) *
                    parseFloat(props.inward.process.no),
                ),
        });
      else
        props.setProcessDetails({
          ...props.inward.process,
          weight:
            Number(tweight) >= 0 && balancedValue
              ? WeightValue - Number(weight)
              : Math.round(
                  0.0000081 *
                    parseFloat(props.inward.plan.fWidth) *
                    parseFloat(props.inward.plan.fThickness) *
                    parseFloat(props.inward.process.length) *
                    parseFloat(props.inward.process.no),
                ),
        });
    }
  }, [props.inward.process.length, props.inward.process.no]);

  useEffect(() => {
    setcurrentWeight(props.coilDetails.fpresent);
  }, [props.coilDetails.fpresent]);

  useEffect(() => {
    if (props.slitCut && !props.wip) {
      let cutList = props.coil.instruction.flat();
      cutList = cutList.filter((item) => item.process.processId === 3);
      let cutTableData = props.coilDetails.flat();
      cutTableData = cutTableData.filter((item) => item.isSlitAndCut === true);
      let tableList = [];
      for (let i = 0; i < cutTableData.length; i++) {
        let tableObj = {
          ...cutTableData[i],
          key: i,
          processDate: cutTableData[i].processDate,
          plannedLength: cutTableData[i].plannedLength,
          plannedWidth: cutTableData[i].plannedWidth,
          plannedWeight: cutTableData[i].plannedWeight,
        };
        tableList.push(tableObj);
      }
      setCuts(tableList);
      setCutValue(cutList);
      setbundleTableData(bundleTableData.length > 0 ? tableList : []);
      setRestTableData([]);
    } else {
      let data = props.childCoil
        ? props.coilDetails
        : props.coilDetails && props.coilDetails.instruction
          ? props.coilDetails.instruction
          : props.coilDetails.childInstructions;
      const lengthValue = props.coilDetails.availableLength
        ? props.coilDetails.availableLength
        : props.plannedLength(props.coilDetails);
      const widthValue = props.coilDetails.fWidth
        ? props.coilDetails.fWidth
        : props.plannedWidth(props.coilDetails);
      setlength(lengthValue);
      setwidth(widthValue);
      if (data !== undefined) {
        if (props.childCoil) {
          setInstruction(data);
          let arrayData = data.childInstructions ? data.childInstructions : [];
          arrayData = arrayData.length > 0 ? arrayData.flat() : [];
          arrayData =
            arrayData.length > 0
              ? [...arrayData].filter((item) => item.process.processId === 1)
              : [];
          setCuts(arrayData);
        } else {
          data = data.flat();
          let cutsData = [...data];
          cutsData = cutsData.filter((item) => {
            const isSlitCut = props.slitCut;
            const processId = isSlitCut ? 3 : 1;

            // Determine the desired status
            let statusId;
            if (props.unfinish || props.editFinish) {
              statusId = 3;
            } else if (props.wip) {
              statusId = 2;
            } else {
              //added default to remove already delivered packets from the list
              statusId = STATUS_IN_PROGRESS; // no specific status filter
            }

            // Parent group check only applies for slitCut items
            const parentGroupCheck = isSlitCut
              ? item.parentGroupId !== null
              : true;

            // If no status filter, just filter by process
            if (statusId === null) return item.process.processId === 1;

            return (
              item.process.processId === processId &&
              item.status.statusId === statusId &&
              parentGroupCheck
            );
          });
          setCuts(cutsData);
        }
      }
    }
  }, [props.coilDetails]);

  useEffect(() => {
    if (props.inward.instructionSaveCuttingLoading && !props.wip) {
      loading = message.loading("Saving Cut Instruction & Generating pdf..");
    }
  }, [props.inward.instructionSaveCuttingLoading]);

  useEffect(() => {
    if (!props.inward.loading && props.inward.groupId.groupId) {
      setbundledListRes(props.inward.groupId.groupId);
    }
  }, [props.inward.loading]);

  useEffect(() => {
    setCutPayload(cuts);
    let cutsArray = cuts.map((i) => i.plannedWeight);
    cutsArray = cutsArray.filter((i) => i !== undefined);
    cutsArray =
      cutsArray.length > 0
        ? cutsArray.reduce((total, num) => Number(total) + Number(num))
        : 0;
    settweight(Number(cutsArray));
    if (props.unfinish) {
      let actualUpdate = cuts.map((item) => {
        item.actualLength = 0;
        item.actualNoOfPieces = 0;
        item.actualWeight = 0;
        item.actualWidth = 0;
        if (item.packetClassification?.tagId)
          item.packetClassification = {
            tagId: 0,
          };
        return item;
      });
      setTableData(actualUpdate);
    } else if (props.editFinish) {
      setTableData(cuts);
    } else if (props.wip) {
      let actualUpdate = cuts.map((item) => {
        if (!item.actualNoOfPieces && item.actualNoOfPieces !== 0)
          item.actualNoOfPieces = item.plannedNoOfPieces;
        if (!item.actualLength && item.actualLength !== 0)
          item.actualLength = item.plannedLength;
        if (!item.actualWeight && item.actualWeight !== 0)
          item.actualWeight = item.plannedWeight;
        if (!item.actualWidth && item.actualWidth !== 0)
          item.actualWidth = item.plannedWidth;
        // if (!item.packetClassification?.tagId)
        //   item.packetClassification = {
        //     tagId: 0,
        //   };
        return item;
      });
      setTableData(actualUpdate);
      let actualTotalWeight = cuts.map((i) => i.actualWeight);
      actualTotalWeight = actualTotalWeight.filter((i) => i !== undefined);
      actualTotalWeight =
        actualTotalWeight.length > 0
          ? actualTotalWeight.reduce(
              (total, num) => Number(total) + Number(num),
            )
          : 0;
      setTotalActualWeight(actualTotalWeight);
    }
  }, [cuts]);

  useEffect(() => {
    if (props.inward.pdfSuccess && !props.wip) {
      message
        .success("Cutting instruction saved & PDF generated successfully", 2)
        .then(() => {
          setCutPayload([]);
          props.setShowCuttingModal(false);
          props.resetInstruction();
        });
    }
  }, [props.inward.pdfSuccess]);

  useEffect(() => {
    let payload = {};
    if (!props.wip) {
      if (props.inward.instructionSaveCuttingSuccess) {
        if (props.slitCut) {
          let partId = props.inward?.saveSlit[0]?.partDetailsId;
          let instructions = props.inward?.saveCut.map(
            (cut) => cut.instructions,
          );
          instructions = instructions.flat();
          instructions = instructions.map((ins) => ins.parentGroupId);
          payload = {
            partDetailsId: slitPartId !== partId ? partId : null,
            groupIds: [...new Set(instructions)],
          };
          setSlitPartId(partId);
        } else {
          let partId = props.inward.saveCut[0].partDetailsId;
          payload = {
            groupIds: null,
            partDetailsId: partId,
          };
        }
        loading = "";
        props.pdfGenerateInward(payload);
        dispatch(QrCodeGeneratePlan(payload));
      }
    } else {
      if (props.inward.instructionSaveCuttingSuccess)
        setTimeout(() => {
          message.success("Cutting Instruction Saved", 2).then(() => {
            // props.setShowCuttingModal(false);
            props.resetInstruction();
          });
        }, 1000);
    }
  }, [props.inward.instructionSaveCuttingSuccess]);

  useEffect(() => {
    if (props?.inward?.instructionUpdateSuccess) {
      message.success("Successfully Updated!", 2).then(() => {
        props.resetInstruction();
      });
    }
  }, [props?.inward?.instructionUpdateSuccess]);

  useEffect(() => {
    let listItem = bundleItemList.length > 0 ? bundleItemList : [];
    if (listItem.length === 0 && Object.keys(props.inward.groupId).length > 0) {
      listItem.push(props.inward.groupId);
    } else if (listItem.length > 0) {
      let listItemValue = listItem.some(
        (item) => item.groupId === props.inward.groupId.groupId,
      );
      if (!listItemValue) {
        listItem.push(props.inward.groupId);
      }
    }
    setBundleItemList(
      listItem.length > 0 ? [...listItem].flat() : [...listItem],
    );
  }, [props.inward.groupId]);

  useEffect(() => {
    let processTags = [{ tagId: 0, tagName: "Select" }];
    processTags = [...processTags, ...props?.processTags];
    setPacketClassification(processTags);
  }, [props.processTags]);

  const [actualYLR, setactualYLR] = useState(0);
  const getPackatClassificationName = (value) => {
    if (value === undefined) {
      value = 0;
    }
    return packetClassification.filter((item) => item.tagId == value)?.[0]
      .tagName;
  };

  const handleChange = (e) => {
    if (e.target.value !== "") {
      setBalanced(false);
    } else {
      setBalanced(true);
    }
    let length = e.target.value;
    let numerator =
      props.coilDetails.fpresent || props.coilDetails.plannedWeight || 0;
    let weight = cuts.map((i) =>
      !i.instructionId ? Number(i.plannedWeight) : 0,
    );
    weight =
      cuts.length > 0 ? weight.reduce((total, num) => total + Number(num)) : 0;
    if (weight) {
      numerator = numerator - Number(weight);
    }
    setNo(
      Math.floor(
        numerator /
          (0.0000081 * width * props.coil.fThickness * Number(length)),
      ).toFixed(0),
    );
  };

  const setSelection = (record, selected, selectedRows) => {
    setSelectedRowKeys(selectedRows);
    let weights = selectedRows.map((i) => i.plannedWeight);
    weights =
      selectedRows.length > 0
        ? weights.reduce((total, num) => total + Number(num))
        : 0;
    setWeightIndex(weights); // set value to fetch index on bundle click
  };
  const handleSelection = {
    //  selectedRowKeys:selectedKey,
    onSelect: setSelection,
    // onChange: setChangeSelection,
    getCheckboxProps: (record) => {
      return {
        disabled: record.groupId !== null,
      };
    },
  };
  const handleRowSelection = {
    getCheckboxProps: (record) => ({
      disabled: bundledList,
    }),
  };
  const getNoOfCuts = (e, idx) => {
    let cutsWidth = selectedRowKeys.reduce((a, c) => c.plannedWidth);
    cutsWidth =
      selectedRowKeys.length === 1 ? cutsWidth.plannedWidth : cutsWidth;
    setPacketNo(Number(e.target.value));
    let cutsNumerator =
      Number(tpweight[idx]) /
      Number(e.target.value) /
      (props.coil.fThickness *
        (cutsWidth / 1000) *
        (Number(cutsLength) / 1000) *
        METAL_DENSITY);
    let cutsNumber = [];
    if (cutsNumerator !== Infinity) {
      cutsNumber[idx] = cutsNumerator;
    }
    setCutsNo(cutsNumber);
  };

  const getConfirmDisabled = (idx) => {
    return confirmClicks.includes(idx);
  };
  const getCuts = (e, idx) => {
    let cutsWidth = selectedRowKeys.reduce((a, c) => c.plannedWidth);
    cutsWidth =
      selectedRowKeys.length === 1 ? cutsWidth.plannedWidth : cutsWidth;
    setEndUserTagList(selectedRowKeys?.map((item) => item?.endUserTagsentity));
    setTagsList(selectedRowKeys?.map((item) => item?.packetClassification));
    let cutsValue = [];
    let instructionPlanDto = {
      createdBy: userId,
      updatedBy: userId,
    };
    for (let i = 0; i < packetNo; i++) {
      setEndUserTagList(
        selectedRowKeys?.map((item) => item?.endUserTagsentity),
      );
      let cutObj = {
        processId: 3,
        instructionDate: moment().format("YYYY-MM-DD HH:mm:ss"),
        plannedLength: cutsLength,
        plannedNoOfPieces: cutsNo[idx]?.toFixed(0),
        plannedWeight: (Number(tpweight[idx]) / packetNo).toFixed(2),
        isSlitAndCut: false,
        status: 1,
        createdBy: userId,
        updatedBy: userId,
        plannedWidth: cutsWidth,
        inwardId: props.coil.inwardEntryId,
        parentInstructionId: props.coilDetails.instructionId
          ? props.coilDetails.instructionId
          : "",
        groupId: props.inward.groupId.groupId,
        deleteUniqId: unsavedDeleteId,
        index: idx,
        isScrapWeightUsed: false,
        endUserTagId: "",
      };
      cutsValue.push(cutObj);
    }
    instructionPlanDto.deleteUniqId = unsavedDeleteId;
    let instructionPayload = {
      partDetailsRequest: instructionPlanDto,
      instructionRequestDTOs: cutsValue,
      deleteUniqId: unsavedDeleteId,
      parentInstructionIds: {
        instructionIds: bundledListReq,
        groupId: bundledListRes,
      },
    };
    let payload = saveInstruction.length > 0 ? [...saveInstruction] : [];
    payload.push(instructionPayload);
    setUnsavedDeleteId((prev) => prev + 1);
    setSaveInstruction(payload);
    setRestTableData(
      cutValue.length > 0
        ? restTableData.length
          ? [...restTableData, ...cutsValue]
          : [...cutValue, ...cutsValue]
        : [...cutsValue],
    );
    setCutValue(cutsValue);
    setConfirmClicks((prev) => [...prev, idx]);
  };
  const getTargetLength = (e, idx) => {
    setCutsLength(e.target.value);
    let cutsWidth = selectedRowKeys.reduce((a, c) => c.plannedWidth);
    cutsWidth =
      selectedRowKeys.length === 1 ? cutsWidth.plannedWidth : cutsWidth;
    let cutsNumerator =
      Number(tpweight[idx]) /
      Number(packetNo) /
      (props.coil.fThickness *
        (cutsWidth / 1000) *
        (Number(e.target.value) / 1000) *
        METAL_DENSITY);
    let cutsNumber = [];
    if (cutsNumerator !== Infinity) {
      cutsNumber[idx] = cutsNumerator;
    }
    setCutsNo(cutsNumber);
  };

  const bundleListClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const newArray = selectedRowKeys.map((row) => row.plannedWidth);
    const isSameWidth = newArray.every((arr) => arr === newArray[0]);
    //Restricting bundle selection with same width
    if (isSameWidth) {
      setSelectedKey([]);
      setbundledList(true);
      let selectedPastList = selectedPast.length > 0 ? selectedPast : [];

      if (selectedRowKeys.length > 0) {
        selectedPastList.push(selectedRowKeys);
        setSelectedPast(selectedPastList);
      }
      let bundleData =
        bundleTableData.length === 0
          ? cuts.filter((i) => !selectedRowKeys.includes(i))
          : bundleTableData.filter((i) => !selectedRowKeys.includes(i));
      setbundleTableData(bundleData);
      let selectedInstruction = selectedRowKeys.map((i) => i.instructionId);
      let payload = {
        count: selectedRowKeys.length,
        instructionId: selectedInstruction,
      };
      // indexing total weight of selected instruction
      if (tpweight.length === 0 && selectedRowKeys.length) {
        let weights = [];
        weights[0] = weightIndex;
        settpweight(weights);
      } else {
        let weights = tpweight;
        let index = tpweight.length;
        weights[index] = weightIndex;
        settpweight(weights);
      }
      setbundledListReq(selectedInstruction);
      props.instructionGroupsave(payload);
    } else {
      Modal.error({
        title: "Invalid attempt",
        content:
          "Instructions with different width cannot be bundled. Please check!",
      });
    }
  };

  useEffect(() => {
    if (props.yieldLossRatioParty === undefined) {
      props.fetchYLRList({
        pageNo: "1",
        pageSize: "500",
        partyId: props?.coil?.party?.nPartyId,
        ipAddress: "",
        requestId: "YLR_PLAN_GET",
        userId: "",
      });
    }
  }, []);

  //calculate Coil level yield loss ratio
  const [plannedCoilLevelYLR, setPlannedCoilLevelYLR] = useState(0);
  const [actualCoilLevelYLR, setActualCoilLevelYLR] = useState(0);
  useEffect(() => {
    let response = props.coilDetails.instruction;
    if (response !== undefined) {
      const filteredInstructions = response?.filter((instruction) =>
        instruction.some(
          (item) =>
            (item.packetClassification?.classificationName ===
              "WIP(EDGE TRIM)" ||
              item.packetClassification?.classificationName ===
                "WIP(CUT ENDS)" ||
              item.packetClassification?.classificationName === "EDGE TRIM" ||
              item.packetClassification?.classificationName === "CUT ENDS") &&
            item.packetClassification?.classificationName !== null,
        ),
      );
      //planned YLR
      let sumOfScrapPlannedWeight = 0;
      filteredInstructions.forEach((instruction) => {
        sumOfScrapPlannedWeight += instruction[0].plannedWeight || 0;
      });

      //total plannedWeight
      let sumOfTotalPlannedWeight = 0;
      response.forEach((innerArray) => {
        innerArray.forEach((weight) => {
          if (weight.process.processId !== 3) {
            sumOfTotalPlannedWeight += weight.plannedWeight || 0;
          }
        });
      });
      let coilPlannedYLR = 0;
      coilPlannedYLR =
        (sumOfScrapPlannedWeight / sumOfTotalPlannedWeight) * 100;
      setPlannedCoilLevelYLR(coilPlannedYLR);

      //Actual YLR
      let sumOfScrapActualWeight = 0;
      filteredInstructions.forEach((instruction) => {
        sumOfScrapActualWeight += instruction[0].actualWeight || 0;
      });
      //total actualWeight
      let sumOfTotalActualWeight = 0;
      response.forEach((weight) => {
        sumOfTotalActualWeight += weight[0].actualWeight || 0;
      });
      let coilActualYLR = 0;
      coilActualYLR = (sumOfScrapActualWeight / sumOfTotalActualWeight) * 100;
      setActualCoilLevelYLR(coilActualYLR);
    }
  }, []);

  useEffect(() => {
    if (
      props.inward?.isPositiveToleranceError &&
      props.inward?.ptErrorCode === "PT_AVAILABLE"
    )
      setShowPositiveToleranceModal(true);
    else if (
      props?.inward?.isPositiveToleranceError &&
      props.inward?.ptErrorCode === "PT_UPPERLIMIT_REACHED"
    )
      message.error(
        "Positive tolerance limit reached. You can add up to 5% of the coil weight as Positive Tolerance (PT).",
      );
    else setShowPositiveToleranceModal(false);
  }, [props.inward?.isPositiveToleranceError]);

  const handlePositiveToleranceAccepted = () => {
    const instructionList = tableData.filter((item) =>
      editedRecordState.some(
        (record) => record.instructionId === item.instructionId,
      ),
    );
    const coil = {
      positiveToleranceFlag: "ACCEPTED",
      number: props.coil.coilNumber,
      instruction: instructionList,
      unfinish: props?.unfinish,
      editFinish: props?.editFinish,
    };
    props.updateInstruction(coil);
    // props.labelPrintEditFinish(coil);
    setShowPositiveToleranceModal(false);
    if (props.setShowSlittingModal) props.setShowSlittingModal(false);
  };

  useEffect(() => {
    if (props.yieldLossRatioParty !== undefined) {
      const filterContentByProcessName = (processName, content) => {
        return content.filter((item) => item.processName === processName);
      };

      const filteredDataSlitting = filterContentByProcessName(
        "CUTTING",
        props.yieldLossRatioParty,
      );
      setCuttingFilteredData(filteredDataSlitting);
    }
  }, [props.yieldLossRatioParty]);

  const handleOk = (e) => {
    e.preventDefault();
    if (props?.unfinish) {
      const coil = {
        number: props.coil.coilNumber,
        instruction: tableData,
        unfinish: props?.unfinish,
        editFinish: props?.editFinish,
      };
      props.updateInstruction(coil);
      // props.labelPrintEditFinish(coil);
      props.setShowCuttingModal(false);
    } else if (props?.editFinish) {
      const instructionList = tableData.filter((item) =>
        editedRecordState.some(
          (record) => record.instructionId === item.instructionId,
        ),
      );
      const coil = {
        positiveToleranceFlag: "PT_CHECK_REQUIRED",
        number: props.coil.coilNumber,
        instruction: instructionList,
        unfinish: props?.unfinish,
        editFinish: props?.editFinish,
      };
      props.updateInstruction(coil);
      // props.labelPrintEditFinish(coil);
      if (props.setShowSlittingModal) props.setShowSlittingModal(false);
      return;
    } else if (props.wip) {
      const isAllWip = tableData.every(
        (item) => item?.packetClassification?.tagId === 0,
      );
      if (isAllWip) {
        message.error(
          "Unable to finish Instructions. Please select the classification",
        );
      } else if (totalActualweight > tweight) {
        message.error(
          "Actual Weight is greater than Total weight, Please modify actual weight!",
        );
      } else {
        const instructionList = tableData.filter(
          (item) =>
            item?.packetClassification?.tagId !== 0 &&
            item?.packetClassification?.classificationId !== 0 &&
            item?.packetClassification !== "" &&
            item?.packetClassification !== null,
        );
        if (instructionList.length === 0) {
          message.error(
            "Please select classification for atleast one sku if you want to finish",
          );
          return;
        }
        const coil = {
          number: props.coil.coilNumber,
          instruction: instructionList,
          actualYieldLossRatio: actualYLR,
          plannedCoilLevelYLR: plannedCoilLevelYLR,
          actualCoilLevelYLR: actualCoilLevelYLR,
        };
        props.updateInstruction(coil);
        // props.labelPrintEditFinish(coil);
        props.setShowCuttingModal();
      }
    }

    if (props.slitCut && !props.wip) {
      if (
        saveInstruction.length === 0 &&
        props.inward?.saveSlit[0]?.partDetailsId !== slitPartId
      ) {
        let partId = props.inward?.saveSlit[0]?.partDetailsId;
        let payload = {
          groupIds: null,
          partDetailsId: partId,
        };
        setSlitPartId(partId);
        props.pdfGenerateInward(payload);
        dispatch(QrCodeGeneratePlan(payload));
      } else if (
        saveInstruction.length === 0 &&
        props.inward?.saveSlit[0]?.partDetailsId === slitPartId
      ) {
        message.error(
          "Please enter the cut instructions for existing slits or the new slit to proceed with pdf generation",
        );
      } else {
        // saveInstruction.map((ins) => {
        //   return ins.instructionRequestDTOs?.map((item) => {
        //     if (item?.endUserTagId !== null) {
        props.saveCuttingInstruction(saveInstruction);
        setSaveInstruction([]);
        setSaveCutting([]);
        // } else {
        //   message.error("Please select End User Tags");
        // }
        //   });
        // });
      }
    } else if (validate === false) {
      if (cutPayload.length > 0) {
        const modifiedSlitInstruction = saveInstruction.map((instruction) => {
          // Add totalYield to partDetailsRequest
          return {
            ...instruction,
            partDetailsRequest: {
              ...instruction.partDetailsRequest,
              totalYieldLoss: ratio,
            },
          };
        });
        // props.saveCuttingInstruction(saveInstruction);
        props.saveCuttingInstruction(modifiedSlitInstruction);
        setSaveInstruction([]);
        setSaveCutting([]);
      } else {
        props.setShowCuttingModal(false);
      }
    } else if (props.coilDetails && props.coilDetails.instruction) {
      const coil = {
        number: props.coil.coilNumber,
        instruction: props.coilDetails.instruction,
        editFinish: true,
      };
      props.updateInstruction(coil);
    }
  };

  const handleCancel = () => {
    setCuts([]);
    setCutPayload([]);
    setSaveCutting([]);
    props.form.resetFields();
    props.setProcessDetails({});
    setBalancedValue(false);
    props.setShowCuttingModal(false);
  };

  const addRow = () => {
    const newData = {
      processDate: new Date(),
      plannedLength: "",
      actualLength: "",
      plannedWeight: props?.coilDetails?.scrapWeight || 0,
      actualWeight: "",
      packetClassification: {
        tagName: "",
      },
      endUserTags: {
        tagsName: "",
      },
    };
    setTableData([...tableData, newData]);
  };
  const getFooterButtons = () => {
    return [
      <Button key="back" onClick={handleCancel}>
        Cancel
      </Button>,
      <Button
        key="submit"
        type="primary"
        loading={loading}
        disabled={props.inward.loading || cuts.length === 0}
        onClick={handleOk}
      >
        {props.inward.loading
          ? "Loading..."
          : cuts.length > 0
            ? props.wip && !props.unfinish
              ? "Finish"
              : props.wip && props.unfinish
                ? "Unfinish"
                : "Save & Generate"
            : props.wip && props.unfinish
              ? "Unfinish"
              : "OK"}
      </Button>,
    ];
  };

  const setSoValues = (record) => {
    const soLength = String(record.length);
    const calculatedNo = Math.floor(
      record.itemQty /
        (0.0000081 * record.width * record.thickness * Number(record.length)),
    ).toFixed(0);

    setNo(calculatedNo);

    props.setProcessDetails({
      ...props.inward.process,
      length: soLength,
      weight: record.itemQty,
      no: calculatedNo,
      soRefNo: record.refno,
      soAllocationId: record.soAllocationId,
      mmid: record.mmId,
    });
  };

  return (
    <Modal
      title={
        props.wip
          ? props.slitCut
            ? props.editFinish
              ? "Edit Finish slit & cut Instruction"
              : props.unfinish
                ? "UnFinish slit & cut Instruction"
                : "Finish slit & cut Instruction"
            : props.editFinish
              ? "Edit Finish Cutting Instruction"
              : props.unfinish
                ? "UnFinish Cutting Instruction"
                : "Finish Cutting Instruction"
          : "Cutting Instruction"
      }
      visible={props.showCuttingModal}
      onOk={handleOk}
      width={1300}
      onCancel={handleCancel}
      footer={getFooterButtons()}
    >
      <Card className="gx-card">
        {!props.wip && props.slitCut && (
          <div>
            <Button
              type="primary"
              onClick={bundleListClick}
              icon={() => <i className="icon icon-add" />}
              size="default"
              disabled={selectedRowKeys.length < 1 ? true : false}
            >
              Bundle
            </Button>
          </div>
        )}
        <Tabs defaultActiveKey="1" tabPosition="top">
          <TabPane tab="Cutting Details" key="1">
            {props.slitCut && !props.wip ? (
              selectedRowKeys.length > 0 && bundledList ? (
                <Row>
                  <Col
                    lg={cutValue.length > 0 ? 14 : 24}
                    md={16}
                    sm={24}
                    xs={24}
                  >
                    {bundleItemList.length === 0 ? (
                      <>
                        <Table
                          className="gx-table-responsive"
                          rowSelection={handleRowSelection}
                          columns={columnsSlit}
                          dataSource={selectedRowKeys}
                          pagination={{
                            onChange(current) {
                              setPage(current);
                            },
                          }}
                        />
                        <div style={{ padding: "20px 0px 0px 25px" }}>
                          <label for="tLength">Target length(mm):</label>
                          <input
                            type="text"
                            className="bundle-input-class"
                            id="tLength"
                            name="tLength"
                            onChange={(e) => getTargetLength(e, 0)}
                          ></input>
                          <label for="tpweight">Total weight(kg):</label>
                          <input
                            type="text"
                            className="bundle-input-class"
                            id="tpweight"
                            name="tpweight"
                            value={tpweight[0]}
                            disabled
                          ></input>
                        </div>
                        <div style={{ padding: "20px 0px 0px 25px" }}>
                          <label for="pNo">Number of Packets :</label>
                          <input
                            type="text"
                            className="bundle-input-class"
                            id="pNo"
                            name="pNo"
                            onChange={(e) => getNoOfCuts(e, 0)}
                          ></input>
                          <label for="noOfCuts">Number of Cuts :</label>
                          <input
                            type="text"
                            id="noOfCuts"
                            className="bundle-input-class"
                            name="noOfCuts"
                            value={cutsNo.length ? cutsNo[0]?.toFixed(0) : 0}
                          ></input>
                        </div>
                        <div
                          style={{
                            "padding-left": "72%",
                            "margin-top": "10px",
                          }}
                        >
                          <Button
                            type="primary"
                            size="default"
                            onClick={(e) => getCuts(e, 0)}
                          >
                            Confirm
                          </Button>
                        </div>
                      </>
                    ) : (
                      bundleItemList.length > 0 &&
                      bundleItemList.map((item, idx) => (
                        <>
                          <Table
                            rowSelection={handleRowSelection}
                            className="gx-table-responsive"
                            columns={columnsSlit}
                            dataSource={
                              selectedPast.length > 0
                                ? selectedPast[idx]
                                : selectedRowKeys
                            }
                            pagination={false}
                          />
                          <div style={{ padding: "20px 0px 0px 25px" }}>
                            <label for="tLength">Target length(mm):</label>
                            <input
                              type="text"
                              className="bundle-input-class"
                              id="tLength"
                              name="tLength"
                              onChange={(e) => getTargetLength(e, idx)}
                            ></input>
                            <label for="tpweight">Total weight(kg):</label>
                            <input
                              type="text"
                              className="bundle-input-class"
                              id="tpweight"
                              name="tpweight"
                              value={tpweight[idx]}
                              disabled
                            ></input>
                          </div>
                          <div style={{ padding: "20px 0px 0px 25px" }}>
                            <label for="pNo">Number of Packets :</label>
                            <input
                              type="text"
                              className="bundle-input-class"
                              id="pNo"
                              name="pNo"
                              onChange={(e) => getNoOfCuts(e, idx)}
                            ></input>
                            <label for="noOfCuts">Number of Cuts :</label>
                            <input
                              type="text"
                              id="noOfCuts"
                              className="bundle-input-class"
                              name="noOfCuts"
                              value={
                                cutsNo.length ? cutsNo[idx]?.toFixed(0) : 0
                              }
                            ></input>
                          </div>
                          <div
                            style={{
                              "padding-left": "72%",
                              "margin-top": "10px",
                            }}
                          >
                            <Button
                              type="primary"
                              size="default"
                              disabled={getConfirmDisabled(idx)}
                              onClick={(e) => getCuts(e, idx)}
                            >
                              Confirm
                            </Button>
                          </div>
                        </>
                      ))
                    )}
                    <Table
                      rowSelection={handleSelection}
                      className="gx-table-responsive"
                      showHeader={false}
                      columns={columnsSlit}
                      dataSource={bundleTableData}
                      pagination={{
                        onChange(current) {
                          setPage(current);
                        },
                      }}
                    />
                  </Col>
                  {cutValue.length > 0 && (
                    <Col lg={10} md={16} sm={24} xs={24}>
                      <Table
                        className="gx-table-responsive"
                        columns={columnsSlitCut}
                        dataSource={
                          restTableData.length ? restTableData : cutValue
                        }
                      />
                    </Col>
                  )}
                </Row>
              ) : (
                <>
                  <Table
                    rowSelection={handleSelection}
                    className="gx-table-responsive"
                    columns={columnsSlit}
                    dataSource={cuts}
                    pagination={{
                      onChange(current) {
                        setPage(current);
                      },
                    }}
                  />
                  {cutValue.length > 0 && (
                    <Col lg={10} md={16} sm={24} xs={24}>
                      <Table
                        className="gx-table-responsive"
                        columns={columnsSlitCut}
                        dataSource={
                          restTableData.length ? restTableData : cutValue
                        }
                      />
                    </Col>
                  )}
                </>
              )
            ) : (
              <div>
                {props?.wip && !props.unfinish && (
                  <Row>
                    <Col lg={8} md={12} sm={24} xs={24}>
                      <Button type="primary" onClick={addRow}>
                        Add Row
                      </Button>
                    </Col>
                  </Row>
                )}
                {!props.wip && (
                  <Row>
                    <Col lg={12} md={12} sm={24} xs={24}>
                      <p>Batch no: {props.coil.coilNumber}</p>
                      <p>Location Name: {props?.coil?.party?.partyName}</p>
                      {props.coil.customerBatchId && (
                        <p>
                          SC inward id:
                          {props.coil.customerBatchId == undefined ||
                          props.coil.customerBatchId == null
                            ? props.coil.customerBatchId
                            : "-"}
                        </p>
                      )}
                      <p>Material Desc: {props.coil?.material?.description}</p>
                      <div
                        style={{
                          marginTop: "10px",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <p style={{ marginBottom: 0 }}>Sales Order: </p>
                        <Select
                          style={{ width: "400px", marginLeft: "10px" }}
                          onSelect={(value) => setSoValues(value)}
                        >
                          {salesOrders?.filter((item) => item.isDisplay !== false)?.map((item, index) => (
                            <Option
                              key={`${item.refno}${index}`}
                              value={item}
                              label={item.refno}
                            >
                              {item.refno} <b>Length: {item.length}</b>
                            </Option>
                          ))}
                        </Select>
                        <p></p>
                      </div>
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                      <p>
                        Inward specs: {props.coil.fThickness} x
                        {props.coil.fWidth} x {props.coil.fLength} /
                        {props.coil.fQuantity}
                      </p>
                      <p>Available Length (mm): {length}</p>
                      <p>
                        Available Weight (As per plan)(in kg): {currentWeight}
                      </p>
                      <p>Available Width (mm): {widthValue}</p>
                      <p>Grade: {props.coil?.materialGrade?.gradeName}</p>
                    </Col>
                  </Row>
                )}

                <Row>
                  {!props.wip && (
                    <Col
                      lg={8}
                      md={12}
                      sm={24}
                      xs={24}
                      className="gx-align-self-center"
                    >
                      <Form
                        {...formItemLayout}
                        onSubmit={handleSubmit}
                        className="login-form gx-pt-4"
                      >
                        <Form.Item label="Process Date">
                          {getFieldDecorator("processDate", {
                            initialValue: moment(
                              new Date(),
                              APPLICATION_DATE_FORMAT,
                            ),
                            rules: [
                              {
                                required: true,
                                message: "Please select a Process date",
                              },
                            ],
                          })(
                            <DatePicker
                              placeholder="dd/mm/yy"
                              style={{ width: 200 }}
                              format={APPLICATION_DATE_FORMAT}
                              disabled={props.wip ? true : false}
                            />,
                          )}
                        </Form.Item>
                        <Form.Item label="Length">
                          {getFieldDecorator("length", {
                            rules: [
                              {
                                required: true,
                                message: "Please enter Length",
                              },
                              {
                                pattern: "^[0-9]+$",
                                message: "Length should be a number",
                              },
                            ],
                          })(
                            <Input
                              id="length"
                              disabled={props.wip ? true : false}
                              onChange={(e) => handleChange(e)}
                            />,
                          )}
                        </Form.Item>
                        <Form.Item label="No of cuts">
                          {getFieldDecorator("no", {
                            rules: [
                              {
                                required: true,
                                message: "Please enter number of cuts required",
                              },
                            ],
                          })(
                            <Input
                              id="noOfCuts"
                              disabled={props.wip ? true : false}
                            />,
                          )}
                        </Form.Item>

                        <Form.Item>
                          <Button
                            type="primary"
                            onClick={onChange}
                            disabled={
                              props.wip ? true : balanced ? true : false
                            }
                          >
                            Balance
                          </Button>
                        </Form.Item>
                        <Form.Item label="Weight">
                          {getFieldDecorator("weight", {
                            rules: [
                              {
                                required: true,
                                message:
                                  "Please fill other details to calculate weight",
                              },
                            ],
                          })(<Input id="weight" disabled={true} />)}
                        </Form.Item>
                        <Row className="gx-mt-4">
                          <Col span={24} style={{ textAlign: "center" }}>
                            <Button
                              id="button"
                              type="primary"
                              htmlType="submit"
                              disabled={props.wip ? true : false}
                              value="text"
                            >
                              {props.inward.process.index
                                ? "Update size"
                                : "Add size"}{" "}
                              <Icon type="right" />
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </Col>
                  )}

                  {props.wip && (
                    <>
                      <Col lg={8} md={12} sm={24} xs={24}>
                        <p>Inward number : {props.coil.coilNumber}</p>
                        <p>Location Name : {props.coil.party.partyName}</p>
                        {props.coil.customerBatchId && (
                          <p>
                            SC inward id:
                            {props.coil.customerBatchId === undefined ||
                            props.coil.customerBatchId == null
                              ? props.coil.customerBatchId
                              : "-"}
                          </p>
                        )}
                        <p>
                          Material Desc: {props.coil?.material?.description}
                        </p>
                        <p>Grade: {props.coil?.materialGrade?.gradeName}</p>
                        <p>
                          Coil level Planned YLR (%):{" "}
                          {plannedCoilLevelYLR.toFixed(2)}
                        </p>
                      </Col>

                      <Col lg={8} md={12} sm={24} xs={24}>
                        <p>
                          Inward specs: {props.coil.fThickness}X
                          {props.coil.fWidth}X{props.coil.fLength}/
                          {props.coil.fQuantity}
                        </p>
                        <p>
                          Available Length(mm):{" "}
                          {props.childCoil ? insData.actualLength : length}
                        </p>
                        <p>
                          Available Weight(kg) :{" "}
                          {props.childCoil
                            ? insData.actualWeight
                            : currentWeight}
                        </p>
                        <p>
                          Available Width(mm) :{" "}
                          {props.childCoil ? insData.actualWidth : width}
                        </p>
                        <p>
                          Coil level Actual YLR (%) :{" "}
                          {actualCoilLevelYLR.toFixed(2)}
                        </p>
                      </Col>
                    </>
                  )}

                  <Col
                    lg={props.wip ? 24 : 16}
                    md={props.wip ? 24 : 12}
                    sm={24}
                    xs={24}
                  >
                    <Table
                      className="gx-table-responsive"
                      columns={props.wip ? columns : columnsPlan}
                      dataSource={props.wip ? tableData : cuts}
                      pagination={{
                        onChange(current) {
                          setPage(current);
                        },
                      }}
                    />
                    {props.wip ? (
                      <Col lg={12} md={12} sm={24} xs={24}>
                        <div className="form-wrapper">
                          <Form.Item label="Total weight(kg)">
                            {getFieldDecorator("tweight", {
                              rules: [{ required: false }],
                            })(
                              <>
                                <Input
                                  id="tweight"
                                  disabled={true}
                                  value={tweight}
                                  name="tweight"
                                />
                              </>,
                            )}
                          </Form.Item>
                          <Form.Item label="Actual weight(kg)">
                            {getFieldDecorator("totalActualweight", {
                              rules: [{ required: false }],
                            })(
                              <>
                                <Input
                                  id="totalActualweight"
                                  disabled={true}
                                  value={totalActualweight}
                                  name="totalActualweight"
                                />
                              </>,
                            )}
                          </Form.Item>
                          <Form.Item label="Actual yield loss ratio (plan level) %">
                            {getFieldDecorator("ratio", {
                              rules: [{ required: false }],
                            })(
                              <>
                                <Input
                                  id="ratio"
                                  disabled={true}
                                  value={actualYLR.toFixed(2)}
                                  name="ratio"
                                />
                              </>,
                            )}
                          </Form.Item>
                        </div>
                      </Col>
                    ) : (
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="Total weight(kg)">
                            {getFieldDecorator("tweight", {
                              rules: [{ required: false }],
                            })(
                              <>
                                <Input
                                  id="tweight"
                                  disabled={true}
                                  value={tweight}
                                  name="tweight"
                                />
                              </>,
                            )}
                          </Form.Item>
                        </Col>
                        {/* <Col span={12}>
                      <Form.Item label="Total yield loss ratio">
                        {getFieldDecorator("ratio", {
                          rules: [{ required: false }],
                        })(
                          <>
                            <Input
                              id="ratio"
                              disabled={true}
                              value={ratio}
                              name="ratio"
                            />
                          </>
                        )}
                       </Form.Item>
                      </Col>  */}
                      </Row>
                    )}
                  </Col>
                </Row>
              </div>
            )}

            <Modal
              title="Delete confirmation"
              visible={showDeleteModal}
              onOk={() => {
                onDelete(deleteRecord);
              }}
              onCancel={() => setshowDeleteModal(false)}
            >
              <p>Are you sure to proceed for delete ? </p>
              <p>Please click OK to confirm</p>
            </Modal>
            <Modal
              width={700}
              title="Additional weight confirmation"
              visible={showPositiveToleranceModal}
              onOk={() => {
                handlePositiveToleranceAccepted();
              }}
              onCancel={() => setShowPositiveToleranceModal(false)}
            >
              <p>
                Are you sure you want to add additional weight{" "}
                {props.inward.ptWeight}kgs for the packet ?
              </p>
              <p>Please click OK to confirm</p>
            </Modal>
          </TabPane>
          <TabPane tab="Customer Yield Loss Reference" key="3">
            <Row>
              <Col lg={20} md={20} sm={24} xs={24}>
                <Table
                  className="gx-table-responsive"
                  columns={columnYieldLoss}
                  dataSource={cuttingfilteredData}
                />
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  party: state.party,
  inward: state.inward,
  processTags: state.packetClassification?.processTags,
  saveCut: state.saveCut,
  groupId: state.groupId,
  yieldLossRatioParty: state.yieldLossRatio.YLRList.content,
});

const CuttingDetailsForm = Form.create({
  onFieldsChange(props, changedFields) {},
  mapPropsToFields(props) {
    return {
      processDate: Form.createFormField({
        ...props.inward.process.processDate,
        value: props.inward.process.processDate
          ? props.inward.process.processDate
          : moment(new Date(), APPLICATION_DATE_FORMAT),
      }),
      length: Form.createFormField({
        ...props.inward.process.length,
        value: props.inward.process.length ? props.inward.process.length : "",
      }),
      no: Form.createFormField({
        ...props.inward.process.no,
        value: props.inward.process.no ? props.inward.process.no : "",
      }),
      weight: Form.createFormField({
        ...props.inward.process.weight,
        value: props.inward.process.weight ? props.inward.process.weight : "",
      }),
      totalActualweight: Form.createFormField({
        ...props.inward.process.totalActualweight,
        value: props.inward.process.totalActualweight || "",
      }),
      packetLength: Form.createFormField({
        ...props.inward.process.packetLength,
        value: props.inward.process.packetLength || "",
      }),
    };
  },
  onValuesChange(props, values) {
    props.setProcessDetails({ ...props.inward.process, ...values });
  },
})(CreateCuttingDetailsForm);

export default connect(mapStateToProps, {
  setProcessDetails,
  saveCuttingInstruction,
  resetInstruction,
  updateInstruction,
  deleteInstructionById,
  instructionGroupsave,
  pdfGenerateInward,
  QrCodeGeneratePlan,
  labelPrintEditFinish,
  fetchYLRList,
  updateClassificationSlitAndCutBeforeFinish,
})(CuttingDetailsForm);
