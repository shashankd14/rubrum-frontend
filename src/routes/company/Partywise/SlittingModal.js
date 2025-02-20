import {
  Button,
  Card,
  Col,
  Collapse,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
  Tabs,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import moment from 'moment';
import { APPLICATION_DATE_FORMAT } from '../../../constants';
import {
  deleteInstructionById,
  pdfGenerateInward,
  QrCodeGeneratePlan,
  resetInstruction,
  resetIsDeleted,
  saveSlittingInstruction,
  setProcessDetails,
  updateInstruction,
  labelPrintEditFinish,
  fetchClassificationList, fetchYLRList
} from '../../../appRedux/actions';
import SlittingWidths from './Slitting/SlittingWidths';
const { Panel } = Collapse;
const Option = Select.Option;

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
  },
};

export const formItemLayoutSlitting = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 10 },
    //  lg: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24, offset: 2 },
    // lg: { span: 16 }
  },
};

const CreateSlittingDetailsForm = (props) => {
  const TabPane = Tabs.TabPane;
  const [mode, setMode] = useState('top');
  const { getFieldDecorator } = props.form;
  const [cuts, setCuts] = useState([]);
  const [slitPayload, setslitpayload] = useState([]);
  const [length, setLength] = useState();
  let loading = '';
  let cutArray = [];
  const [reset, setreset] = useState(true);
  const [slitInstruction, setSlitInstruction] = useState([]);
  const [slitInstructionList, setSlitInstructionList] =
    useState(slitInstruction);
  const [slitEqualInstruction, setSlitEqualInstruction] = useState([]);
  const columns = [
    {
      title: 'Serial No',
      dataIndex: 'instructionId',
      key: 'instructionId',
    },
    {
      title: 'Process Date',
      dataIndex: 'instructionDate',
      render(value) {
        return moment(value).format('DD/MM/YYYY');
      },
      key: 'instructionDate',
    },
    {
      title: 'Length',
      dataIndex: 'plannedLength',
      render: (text, record, index) =>
        record?.instructionId ? (
          text
        ) : (
          <Input
            value={record?.plannedLength}
            onChange={onInputChange('plannedLength', index, record)}
          />
        ),
    },
    {
      title: 'Actual Length',
      dataIndex: 'actualLength',
      render: (text, record, index) => {
        // addonAfter={<p>Enter valid length</p>}
        return (
          <Input
            disabled={props.unfinish}
            value={record.actualLength}
            onChange={onInputChange('actualLength', index, record)}
          />
        );
      },
    },
    {
      title: 'Width',
      dataIndex: 'plannedWidth',
      render: (text, record, index) =>
        record?.instructionId ? (
          text
        ) : (
          <Input
            value={record?.plannedWidth}
            onChange={onInputChange('plannedWidth', index, record)}
          />
        ),
    },
    {
      title: 'Actual Width',
      dataIndex: 'actualWidth',
      render: (text, record, index) => {
        return (
          <Input
            disabled={props.unfinish}
            value={record.actualWidth}
            onChange={onInputChange('actualWidth', index, record)}
          />
        );
      },
    },
    {
      title: 'Weight',
      dataIndex: 'plannedWeight',
      key: 'plannedWeight',
    },
    {
      title: 'Actual Weight',
      dataIndex: 'actualWeight',
      render: (text, record, index) => {
        return (
          <Input
            disabled={props.unfinish}
            value={record.actualWeight}
            onChange={onInputChange('actualWeight', index, record)}
            onBlur={() => {
              let actualTotalWeight = cuts.map((i) => i.actualWeight);
              actualTotalWeight = actualTotalWeight.filter(
                (i) => i !== undefined
              );
              actualTotalWeight =
                actualTotalWeight.length > 0
                  ? actualTotalWeight.reduce(
                      (total, num) => Number(total) + Number(num)
                    )
                  : 0;
              setTotalActualWeight(actualTotalWeight);
            }}
          />
        );
      },
    },
    {
      title: 'Classification',
      dataIndex: 'packetClassification',
      render: (text, record, index) => {
        return (
          <Select
            disabled={props.unfinish}
            dropdownMatchSelectWidth={false}
            style={{ width: '100%' }}
            value={
              record?.packetClassification?.tagId ||
              record?.packetClassification?.classificationId
            }
            onChange={onInputChange(
              'packetClassification',
              index,
              record,
              'select'
            )}
          >
            {packetClassification?.map((item) => {
              return <Option value={item.tagId}>{item.tagName}</Option>;
            })}
          </Select>
        );
      },
    },
    {
      title: 'End User Tags',
      dataIndex: 'party.endUserTags',
      render: (text, record, index) => {
        return (
          <Select
            showSearch
            disabled={props.unfinish}
            dropdownMatchSelectWidth={false}
            optionFilterProp='children'
            filterOption={(input, option) => {
              return option?.props?.children
                ?.toLowerCase()
                .includes(input.toLowerCase());
            }}
            style={{ width: '100px' }}
            value={record?.endUserTagsentity?.tagId}
            onChange={onInputChange(
              'endUserTagsentity',
              index,
              record,
              'select'
            )}
          >
            {props.coilDetails.party.endUserTags?.map((item) => {
              return <Option value={item.tagId}>{item.tagName}</Option>;
            })}
          </Select>
        );
      },
    },
    {
      title: '',
      render: (text, record) =>
        record?.instructionId ? (
          ''
        ) : (
          <a onClick={(e) => handleWeight(e, record)}>Save</a>
        ),
    },
  ];

  const desiredTags = ['WIP(CUT ENDS)', 'WIP(EDGE TRIM)', 'WIP(FG)'];
  const columnsPlan = [
    {
      title: 'Sr. No',
      key: 'index',
      dataIndex: 'index',
    },
    {
      title: 'Length',
      dataIndex: 'plannedLength',
      key: 'plannedLength',
    },
    {
      title: 'Width',
      dataIndex: 'plannedWidth',
      key: 'plannedWidth',
    },
    {
      title: 'Weight',
      dataIndex: 'plannedWeight',
      render(value) {
        return Math.round(value);
      },
      key: 'plannedWeight',
    },
    {
      title: 'Classification',
      dataIndex: 'packetClassification',
      render: (text, record, index) => {
        const filteredTags = packetClassification.filter((item) =>
          desiredTags.includes(item.tagName)
        );

        return (
          <Select
            disabled={props.unfinish}
            dropdownMatchSelectWidth={false}
            style={{ width: '100%' }}
            value={
              record?.packetClassification?.packetClassificationId ||
              record?.packetClassification?.classificationName ||
              record?.packetClassificationId
            }
            onChange={(value) =>
              handleClassificationChange(value, index, record)
            }
          >
            {filteredTags.map((item) => (
              <Option key={item.tagId} value={item.tagId}>
                {item.tagName}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: 'End User Tags',
      dataIndex: 'endUserTags.tagsName',
      render: (text, record, index) => {
        return (
          <Select
            showSearch
            style={{ width: '100px' }}
            dropdownMatchSelectWidth={false}
            optionFilterProp='children'
            filterOption={(input, option) => {
              return option?.props?.children
                ?.toLowerCase()
                .includes(input.toLowerCase());
            }}
            filterSort={(optionA, optionB) =>
              optionA?.props?.children
                .toLowerCase()
                .localeCompare(optionB?.props?.children.toLowerCase())
            }
            value={
              record?.endUserTagsentity
                ? record?.endUserTagsentity?.tagName
                : record?.endUserTagId
            }
            // onChange={(e) => handleTagsChange(record, e, "endUser")}
            onChange={(value) => handleTagsChange(value, index, record)}
          >
            {props?.coilDetails.party?.endUserTags?.map((item) => {
              return (
                <Option key={item.tagId} value={item.tagId}>
                  {item.tagName}
                </Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text, record, index) => (
        <span>
          <span
            className='gx-link'
            onClick={(e) => {
              onEdit(index, e);
            }}
          >
            <Icon type='edit' />
          </span>
          <span
            className='gx-link'
            onClick={(e) => {
              setDeleteRecord({ e, record, key: index });
              setshowDeleteModal(true);
            }}
          >
            <Icon type='delete' />
          </span>
        </span>
      ),
    },
  ];
  const [tableData, setTableData] = useState(
    props.wip
      ? props.childCoil
        ? props.coilDetails
        : props.coilDetails && props.coilDetails.instruction
        ? props.coilDetails.instruction
        : props.coilDetails.childInstructions
      : cuts
  );
  const [rowData, setRowData] = useState(false);
  const [insData, setInstruction] = useState({});
  const [tweight, settweight] = useState(0);
  const [totalActualweight, setTotalActualWeight] = useState(0);
  const [actualYLR, setactualYLR] = useState(0);
  const [page, setPage] = useState(1);
  const [edit, setEdit] = useState([]);
  const [validate, setValidate] = useState(true);
  const [lengthValue, setLengthValue] = useState();
  const [widthValue, setWidthValue] = useState();
  const [form, setForm] = useState(false);
  const [slittingDetail, setSlittingDetail] = useState([]);
  const [value, setValue] = useState(4);
  const [parts, setParts] = useState(0);
  const [deleteSelected, setDeletedSelected] = useState(false);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState({});
  const [panelList, setPanelList] = useState([]);
  const [yieldLossRatio, setYieldLossRatio] = useState([]);
  const [packetClassification, setPacketClassification] = useState([]);
  const [editedRecordState, setEditedRecordState] = useState([]);

  const [groupedInstructions, setGroupedInstructions] = useState(new Map());
  const dispatch = useDispatch();
  const onDelete = ({ record, key, e }) => {
    e.preventDefault();

    setDeletedSelected(true);
    if (record.isSlitAndCut && record.groupId) {
      message.error('Unable to delete! As part instruction is already bundled');
    } else if (record.instructionId && record.partId) {
      const payload = {
        partId: record.partId,
      };
      props.deleteInstructionById(payload, 'slit');
      setshowDeleteModal(false);
      props.setShowSlittingModal(false);
    } else {
      const data = cuts.filter((item) => {
        if (item.deleteUniqId || item.deleteUniqId === 0) {
          return item.deleteUniqId !== record.deleteUniqId;
        } else {
          return cuts.indexOf(item) !== key;
        }
      });
      let payload = [];
      slitInstructionList.forEach((part) => {
        const id = part.partDetailsRequest.deleteUniqId;
        if (id && id !== record.deleteUniqId) {
          payload.push(part);
        }
      });
      setSlitInstructionList(payload);
      setSlitInstruction(payload);
      setSlitEqualInstruction(payload);
      setValidate(false);
      setslitpayload(data);
      setPanelList([data]);
      setCuts(data);
      setshowDeleteModal(false);
    }
  };
  const onEdit = (key, e) => {
    // const data = cuts.filter(item => cuts.indexOf(item) !== key);
    // setEdit(cuts.filter(item => cuts.indexOf(item) === key))
    setLength(key);
    // setCuts(data)
  };

  useEffect(() => {
    if (!props.inward.isDeleted) {
      const result = cuts.filter(
        (item) => item.instructionId === props.coilDetails.instructionId
      );
      let resetter =
        cuts.length > 0 ? (result.length > 0 ? true : false) : true;
      setreset(resetter);
    }
  }, [props.coilDetails]);

  useEffect(() => {
    setValue(0);
    setSlitInstruction([]);
    let data = props.childCoil
      ? props.coilDetails
      : props.coilDetails && props.coilDetails.instruction
      ? props.coilDetails.instruction
      : props.coilDetails.childInstructions;

    if (props.childCoil) {
      setInstruction(data);
      data = data.childInstructions || [];
      let arrayData = [...data];
      arrayData = arrayData.flat();
      arrayData =
        arrayData.length > 0
          ? [...arrayData].filter((item) => item.process.processId === 2)
          : [];
      setCuts(arrayData);
      setslitpayload([]);
    } else {
      data = data.flat();
      data = props.wip
        ? props.unfinish || props.editFinish
          ? data.filter(
              (item) =>
                item.process.processId === 2 &&
                item.status.statusId === 3 &&
                item.groupId === null
            )
          : data.filter(
              (item) =>
                item.process.processId === 2 &&
                item.status.statusId === 2 &&
                item.groupId === null
            )
        : props.slitCut
        ? data.filter(
            (item) => item.process.processId === 2 && item.isSlitAndCut === true
          )
        : data.filter(
            (item) =>
              item.process.processId === 2 && item.isSlitAndCut === false
          );
      let partIdList = data.map((item) => item.partId);
      partIdList = [...new Set(partIdList)];
      let list1 = [];
      for (let i = 0; i < partIdList.length; i++) {
        let mapList = data.filter((list) => list.partId === partIdList[i]);
        list1.push(mapList);
      }
      setPanelList(list1);
      let cutsData = [...data];
      cutsData = props.wip
        ? props.unfinish || props.editFinish
          ? cutsData.filter(
              (item) =>
                item.process.processId === 2 &&
                item.status.statusId === 3 &&
                item.groupId === null
            )
          : cutsData.filter(
              (item) =>
                item.process.processId === 2 &&
                item.status.statusId !== 3 &&
                item.groupId === null
            )
        : props.slitCut
        ? cutsData.filter(
            (item) => item.process.processId === 2 && item.isSlitAndCut === true
          )
        : cutsData.filter(
            (item) =>
              item.process.processId === 2 && item.isSlitAndCut === false
          );
      setSlittingDetail(cutsData);
      setCuts(cutsData);
      setslitpayload([]);
    }
    setForm(false);
    if (props.wip) {
      let newData = [...data];
      setTableData(newData);
    }
    props.resetIsDeleted(false);
  }, [props.coilDetails]);

  const onInputChange =
    (key, index, record, type) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let editedRecord = [];
      editedRecord.push(record);
      editedRecord = [...new Set([...editedRecordState, ...editedRecord])];
      setEditedRecordState(editedRecord);
      const newData = [...tableData];
      const newIndex = (page - 1) * 10 + index;
      newData[newIndex][key] =
        type === 'select'
          ? key === 'endUserTagsentity'
            ? { tagId: Number(e) }
            : { classificationId: Number(e) }
          : Number(e.target.value);
      if (key === 'actualWeight') {
        const data =
          (e.target.value /
            ((newData[newIndex]['actualWidth'] / 1000) *
              7.85 *
              props.coil.fThickness)) *
          1000;
        newData[newIndex]['actualLength'] = Number.isInteger(data)
          ? data
          : data.toFixed(1);
      }
      // Yield loss Ratio
      if (
        (key === 'packetClassification' && type === 'select') ||
        key === 'actualWeight'
      ) {
        const edgeTrimWeights = newData
          .filter((record) => {
            const classificationName = getPackatClassificationName(
              record.packetClassification?.classificationId ||
                record.packetClassification?.tagId
            );
            return (
              classificationName === 'EDGE TRIM' ||
              classificationName === 'CUT ENDS'
            );
          })
          .map((record) => record.actualWeight);

        const totalActualWeight = newData.reduce(
          (total, record) => total + record.actualWeight,
          0
        );

        const sumEdgeTrimWeight = edgeTrimWeights.reduce(
          (total, weight) => total + weight,
          0
        );

        const yieldLossRatio = (sumEdgeTrimWeight / totalActualWeight) * 100;
        setactualYLR(yieldLossRatio);
      }
      setTableData(newData);
    };

  //calculate Coil level yield loss ratio
  const [plannedCoilLevelYLR, setPlannedCoilLevelYLR] = useState(0);
  const [actualCoilLevelYLR, setActualCoilLevelYLR] = useState(0);


  useEffect(() => {
    let response = props.coilDetails.instruction;
    const filteredInstructions = response?.filter((instruction) =>
      instruction.some(
        (item) =>
          (item.packetClassification?.classificationName === 'WIP(EDGE TRIM)' ||
            item.packetClassification?.classificationName === 'WIP(CUT ENDS)' ||
            item.packetClassification?.classificationName === 'EDGE TRIM' ||
            item.packetClassification?.classificationName === 'CUT ENDS') &&
          item.packetClassification?.classificationName !== null
      )
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
    coilPlannedYLR = (sumOfScrapPlannedWeight / sumOfTotalPlannedWeight) * 100;
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
  }, []);

  const handleTagsChange = (value, index, record) => {
    const tableIndex = record.tableIndex;

    panelList[tableIndex][record.index-1].endUserTagId = value;
    if (record?.endUserTagId === null || record?.endUserTagId !== value) {
      record.endUserTagId = value;
    }

    setPanelList([...panelList]);
  };

  // Initialize an array to store tableDatapacketWeight for each table index
  const [storedTableDatapacketWeights, setStoredTableDatapacketWeights] =
    useState(new Array(panelList.length).fill(0));
  //addition of total loss weight for each table
  const [totaltableDatapacketWeight, setTotaltableDatapacketWeight] = useState(
    new Array(panelList.length).fill(0)
  );

  const [
    storedTotalTableDatapacketWeights,
    setStoredTotalTableDatapacketWeights,
  ] = useState(new Array(panelList.length).fill(0));
  const [
    totaltableDatapacketPlannedWeight,
    setTotaltableDatapacketPlannedWeight,
  ] = useState(new Array(panelList.length).fill(0));

  const getPackatClassificationName = (value) => {
    if (value === undefined) {
      value = 0;
    }
    return packetClassification.filter((item) => item.tagId == value)?.[0]
      .tagName;
  };

  const handleClassificationChange = (value, index, record) => {
    const tableIndex = record.tableIndex;
    panelList[tableIndex][record.index-1].packetClassificationId = value;
    panelList[tableIndex][record.index-1].packetClassificationName =
      getPackatClassificationName(value);
    // Assuming packetClassification is an object within record to display option name in dropdown
    if (
      record?.packetClassificationId === null ||
      record?.packetClassificationId !== value
    ) {
      record.packetClassificationId = value;
      record.packetClassificationName = getPackatClassificationName(value);
    }

    var tableDatapacketWeight = 0;
    var tdTotalPlannedWeight = 0;

    panelList[tableIndex].map((tableRecord) => {
      // Update the relevant data in tableData
      if (
        tableRecord.packetClassificationName === 'WIP(EDGE TRIM)' ||
        tableRecord.packetClassificationName === 'WIP(CUT ENDS)'
      ) {
        tableDatapacketWeight +=
          tableRecord.plannedWeight !== undefined
            ? parseFloat(tableRecord.plannedWeight)
            : 0;
      }
      tdTotalPlannedWeight +=
        tableRecord.plannedWeight !== undefined
          ? parseFloat(tableRecord.plannedWeight)
          : 0;
      // Return the original tableRecord for other indices
      return tableRecord;
    });

    var TDlossRatio = (tableDatapacketWeight / tdTotalPlannedWeight) * 100;
    //addition of tableDatapacketWeight for total yield loss ratio
    var totaltableDatapacketWeight = 0;
    totaltableDatapacketWeight += tableDatapacketWeight;
    console.log('totaltableDatapacketWeight', totaltableDatapacketWeight);
    // Update storedTableDatapacketWeights with the cumulative tableDatapacketWeight for the specific table index
    const updatedStoredTableDatapacketWeights = [
      ...storedTableDatapacketWeights,
    ];
    updatedStoredTableDatapacketWeights[tableIndex] = tableDatapacketWeight;
    setStoredTableDatapacketWeights(updatedStoredTableDatapacketWeights);

    const updatedTotaltableDatapacketWeight =
      updatedStoredTableDatapacketWeights.reduce((acc, curr) => {
        // Check if the current element is a number
        if (typeof curr === 'number' && !isNaN(curr)) {
          return acc + curr; // Add only if it's a valid number
        }
        return acc; // Otherwise, return the accumulator unchanged
      }, 0);

    setTotaltableDatapacketWeight(updatedTotaltableDatapacketWeight);

    //Planned total weight calculation
    const updatedStoredPlannedWeights = [...storedTotalTableDatapacketWeights];
    updatedStoredPlannedWeights[tableIndex] = tdTotalPlannedWeight;
    setStoredTotalTableDatapacketWeights(updatedStoredPlannedWeights);

    const updatedTotalPlannedWeight = updatedStoredPlannedWeights.reduce(
      (acc, curr) => {
        // Check if the current element is a number
        if (typeof curr === 'number' && !isNaN(curr)) {
          return acc + curr; // Add only if it's a valid number
        }
        return acc; // Otherwise, return the accumulator unchanged
      },
      0
    );

    setTotaltableDatapacketPlannedWeight(updatedTotalPlannedWeight);

    const newArray = [...yieldLossRatio];
    newArray[tableIndex] = TDlossRatio !== undefined ? TDlossRatio : 0;
    setYieldLossRatio(newArray);
    setPanelList([...panelList]);
  };
  

  useEffect(() => {
    let processTags = [{ tagId: 0, tagName: 'Select' }];
    processTags = [...processTags, ...props?.processTags];
    setPacketClassification(processTags);
  }, [props.processTags]);

  useEffect(() => {
    if (props.slitCut) {
      if (props.inward.instructionSaveSlittingLoading && !props.wip) {
        loading = message.loading('Saving Slit Instruction..');
      }
    } else {
      if (
        props.inward.instructionSaveSlittingLoading &&
        !props.inward.pdfSuccess &&
        !props.wip
      ) {
        loading = message.loading('Saving Slit Instruction & Generating pdf..');
      }
    }
  }, [props.inward.instructionSaveSlittingLoading]);

  useEffect(() => {
    if (props.inward.pdfSuccess && !props.wip) {
      message
        .success('Slitting instruction saved & pdf generated successfully', 2)
        .then(() => {
          props.resetIsDeleted(false);
          props.setShowSlittingModal(false);
          props.resetInstruction();
        });
    }
  }, [props.inward.pdfSuccess]);
  //Yield loss ratio
  const columnYieldLoss = [
    {
      title: 'Sr. No',
      key: 'index',
      render: (text, record, index) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'Customer Name',
      dataIndex: 'partyName',
      key: 'partyName',
    },
    {
      title: 'Loss Ratio from',
      dataIndex: 'lossRatioPercentageFrom',
      key: 'lossRatioPercentageFrom',
    },
    {
      title: 'Loss Ratio to',
      dataIndex: 'lossRatioPercentageTo',
      key: 'lossRatioPercentageTo',
    },
    {
      title: 'Comments',
      dataIndex: 'comments',
      key: 'comments',
    },
  ];
  useEffect(() => {
    if (props.yieldLossRatioParty === undefined) {
      props.fetchYLRList({
        pageNo: '1',
        pageSize: '500',
        partyId: props.coil.party.nPartyId,
        ipAddress: '',
        requestId: 'YLR_PLAN_GET',
        userId: '',
      });
    }
  }, []);

  const [slittingfilteredData, setSlittingFilteredData] = useState();
  const [slitCutfilteredData, setSlitCutFilteredData] = useState();
  useEffect(() => {
    if (props.yieldLossRatioParty !== undefined) {
      const filterContentByProcessName = (processName, content) => {
        return content.filter((item) => item.processName === processName);
      };

      const filteredDataSlitting = filterContentByProcessName(
        'SLITTING',
        props.yieldLossRatioParty
      );
      const filteredDataSlitCut = filterContentByProcessName(
        'SLIT AND CUT',
        props.yieldLossRatioParty
      );
      setSlittingFilteredData(filteredDataSlitting);
      setSlitCutFilteredData(filteredDataSlitCut);
    }
  }, [props.yieldLossRatioParty]);

  useEffect(() => {
    if (
      props.slitCut &&
      props.inward.instructionSaveSlittingSuccess &&
      !props.wip
    ) {
      loading = '';
      message.success('Slitting instruction saved', 2).then(() => {
        props.resetInstruction();
        let cutList = props.inward?.saveSlit.map((slit) => [
          ...slit.instructions,
        ]);
        let coilList = props.coilDetails.instruction.flat();
        cutList = cutList.flat();
        cutList = [...coilList, ...cutList];
        props.setCutting([...new Set(cutList)]);
        props.resetIsDeleted(false);
        props.setShowSlittingModal(false);
      });
    } else if (
      props.inward.instructionSaveSlittingSuccess &&
      !props.wip &&
      !props.slitCut
    ) {
      let partId = props.inward.saveSlit[0].partDetailsId;
      let payload = {
        groupIds: null,
        partDetailsId: partId,
      };
      props.pdfGenerateInward(payload);
      dispatch(QrCodeGeneratePlan(payload));
      loading = '';
    } else if (
      props.inward.instructionSaveSlittingSuccess &&
      props.wip &&
      !props.slitCut
    ) {
      setTimeout(() => {
        message.success('Slitting instruction saved', 2).then(() => {
          props.setShowSlittingModal(false);
          props.resetInstruction();
        });
      }, 1000);
    }
  }, [props.inward.instructionSaveSlittingSuccess]);
  useEffect(() => {
    if (props?.inward?.instructionUpdateSuccess) {
      message.success('Successfully Updated!', 2).then(() => {
        props.resetInstruction();
      });
    }
  }, [props?.inward?.instructionUpdateSuccess]);

  const handleCancel = (e) => {
    e.preventDefault();
    props.resetIsDeleted(false);
    setCuts([]);
    setForm(true);
    setValue(value + 3);
    setDeletedSelected(false);
    props.setShowSlittingModal(false);
  };

  const sum =
    (totaltableDatapacketWeight / totaltableDatapacketPlannedWeight) * 100 || 0;

  useEffect(() => {
    const updatedTmpGroupedInstructions = new Map();

    const tmpLossRatio = Array(panelList.length).fill(0);
    // Group instructions by date
    panelList.forEach((innerArray, panelIndex) => {
      innerArray.forEach((item, rowIndex) => {
        // const instructionDate = item.instructionDate.split(' ')[0];
        const instructionDate = item.instructionDate;

        if (!updatedTmpGroupedInstructions.has(instructionDate)) {
          updatedTmpGroupedInstructions.set(instructionDate, []);
        }

        // Add 'tableIndex' property to each object inside the 'item' array
        // and update another property using 'tableIndex' and 'rowIndex'
        const updatedItem = {
          ...item,
          tableIndex: panelIndex,
          index: rowIndex+1,
          // Add your logic to update another property based on 'tableIndex' and 'rowIndex'
          anotherProperty: `${panelIndex}-${rowIndex}`,
        };

        updatedTmpGroupedInstructions.get(instructionDate).push(updatedItem);
      });
    });

    setYieldLossRatio(tmpLossRatio);
    // Update the state with the new tmpGroupedInstructions
    setGroupedInstructions(updatedTmpGroupedInstructions);
  }, [panelList]);

  const savePlan = (e, name, record) => {
    if (props?.unfinish) {
      const coil = {
        // actualYieldLossRatio: actualYLR,
        number: props.coil.coilNumber,
        instruction: tableData,
        unfinish: props?.unfinish,
        editFinish: props?.editFinish,
      };
      props.updateInstruction(coil);
      props.labelPrintEditFinish(coil);
      props.setShowSlittingModal(false);
    } else if (props.editFinish) {
      const instructionList = tableData.filter((item) =>
        editedRecordState.some(
          (record) => record.instructionId === item.instructionId
        )
      );
      const coil = {
        number: props.coil.coilNumber,
        instruction: instructionList,
        unfinish: props?.unfinish,
        editFinish: props?.editFinish,
      };
      props.updateInstruction(coil);
      props.labelPrintEditFinish(coil);
      props.setShowSlittingModal(false);
    } else if (props.editFinish) {
      const instructionList = tableData.filter((item) =>
        editedRecordState.some(
          (record) => record.instructionId === item.instructionId
        )
      );
      const coil = {
        number: props.coil.coilNumber,
        instruction: instructionList,
        unfinish: props?.unfinish,
        editFinish: props?.editFinish,
      };
      props.updateInstruction(coil);
      props.labelPrintEditFinish(coil);
      props.setShowSlittingModal(false);
    } else if (props.wip) {
      //
      const isAllWip = tableData.every(
        (item) =>
          item.packetClassification.tagId === 0 ||
          item.packetClassification.classificationId === 0
      );
      if (isAllWip) {
        message.error(
          'Unable to finish Instructions. Please select the classification'
        );
      } else if (totalActualweight > tweight) {
        message.error(
          'Actual Weight is greater than Total weight, Please modify actual weight!'
        );
      } else {
        const instructionList = tableData.filter(
          (item) =>
            item?.packetClassification?.tagId !== 0 &&
            item?.packetClassification?.classificationId !== 0 &&
            item?.packetClassification !== '' &&
            item?.packetClassification !== null
        );
        const coil = {
          actualYieldLossRatio: actualYLR,
          plannedCoilLevelYLR: plannedCoilLevelYLR,
          actualCoilLevelYLR: actualCoilLevelYLR,
          number: props.coil.coilNumber,
          instruction: instructionList,
        };
        props.updateInstruction(coil);
        props.labelPrintEditFinish(coil);
        props.setShowSlittingModal(false);
      }
    }

    if (validate === false) {
      if (slitInstruction.length === parts) {
        setValue(value + 3);
        setDeletedSelected(false);
        if (name === 'Slitting') {
          if (slitPayload.length > 0) {
            const modifiedSlitInstruction = slitInstruction.map(
              (instruction) => {
                // Map over each instruction in instructionRequestDTOs and add instructionwiseLoss
                const updatedInstructions =
                  instruction.instructionRequestDTOs.map(
                    (instructionDTO, index) => {
                      return {
                        ...instructionDTO,
                        // instructionwiseLoss: yieldLossRatio[index] // Assuming yieldLoss array is synchronized with instructionRequestDTOs
                      };
                    }
                  );

                // Add totalYield to partDetailsRequest1
                return {
                  ...instruction,
                  partDetailsRequest: {
                    ...instruction.partDetailsRequest,
                    plannedYieldLossRatio: sum,
                  },
                  instructionRequestDTOs: updatedInstructions, // Replace instructionRequestDTOs with updated array
                };
              }
            );
            // props.saveSlittingInstruction(slitInstruction);
            props.saveSlittingInstruction(modifiedSlitInstruction);
          } else {
            props.resetIsDeleted(false);
            props.setShowSlittingModal(false);
          }
        } else {
          if (name === 'SlitCut') {
            if (slitPayload.length > 0) {
              props.saveSlittingInstruction(slitInstruction);
            }
          } else {
            props.resetIsDeleted(false);
            props.setShowSlittingModal(false);
          }
        }
      } else {
        if (name === 'slittingDetail') {
          setValue(value + 3);
          props.resetIsDeleted(false);
          props.setShowSlittingModal(false);
          props.setShowCuttingModal(true);
          props.setCutting(cuts);
          setDeletedSelected(false);
        } else {
          message.error('Please enter instructions for all parts');
        }
      }
    } else {
      if (name === 'slittingDetail') {
        setValue(value + 3);
        props.resetIsDeleted(false);
        props.setShowSlittingModal(false);
        props.setShowCuttingModal(true);
        props.setCutting(cuts);
        setDeletedSelected(false);
      }
    }
  };

  const { confirm } = Modal;
  const handleOk = (e, name, record) => {
    if (slittingfilteredData !== undefined) {
      const lossRatioPercentageToValues = slittingfilteredData.map(
        (item) => item.lossRatioPercentageTo
      );

      const compareYieldLoss = lossRatioPercentageToValues.filter(
        (value) => sum > value
      );

      console.log('compareYieldLoss:', compareYieldLoss);

      if (compareYieldLoss.length > 0) {
        // message.warning('take approval from customer or change the plan');
        confirm({
          title: 'take approval from customer or change the plan.',
          okText: 'OK',
          onOk() {
            savePlan(e, name, record);
          },
        });
        return;
      }
    }

    // e.preventDefault();
    savePlan(e, name, record);
  };

  const handleWeight = (e, record) => {
    console.log('record', record);
    e.preventDefault();
    // if (
    //   Number(record.plannedWeight) + totalActualweight > tweight ||
    //   Number(record.actualWeight) + totalActualweight > tweight
    // ) {
    //   message.error("Error! Please adjust the weight");
    // } else
    if (
      record?.packetClassification?.tagId === 0 ||
      record?.packetClassification?.classificationId === 0
    ) {
      message.error('Error! Please select classification');
    } else {
      const instructionList = tableData
        .slice(0, tableData.length - 1)
        .filter((item) =>
          editedRecordState.some(
            (record) =>
              record !== undefined &&
              record.instructionId === item.instructionId
          )
        );

      const instructionPayload = [
        {
          partDetailsRequest: {
            targetWeight: '0',
            length: '0',
            createdBy: '1',
            updatedBy: '1',
            deleteUniqId: 0,
          },
          instructionRequestDTOs: [
            {
              processId: 2,
              // instructionDate: "2022-04-28 21:04:49",
              instructionDate: record?.instructionDate,
              plannedLength: record?.plannedLength,
              actualLength: record?.actualLength,
              actualWidth: record?.actualWidth,
              // actualWeight: record?.actualWeight,
              actualWeight:
                record?.actualWeight || props?.coilDetails?.scrapWeight,
              plannedWidth: record?.plannedWidth,
              isSlitAndCut: false,
              plannedNoOfPieces: '1',
              status: 1,
              createdBy: '1',
              updatedBy: '1',
              groupId: null,
              // plannedWeight:
              //   props?.coilDetails?.scrapWeight || record.actualWeight || 0,
              plannedWeight: props?.coilDetails?.scrapWeight || 0,
              inwardId: props?.coilDetails?.inwardEntryId,
              parentInstructionId: '',
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
      props.saveSlittingInstruction(instructionPayload);
      const coil = {
        number: props.coil.coilNumber,
        instruction: instructionList,
      };
      props.updateInstruction(coil);
      props.labelPrintEditFinish(coil);
    }
  };
  const addRow = () => {
    setRowData(true);
    const newData = {
      processDate: new Date(),
      plannedLength: '',
      actualLength: '',
      plannedWeight:
        props?.coilDetails?.scrapWeight === null
          ? 0
          : props?.coilDetails?.scrapWeight,
      actualWeight: '',
      packetClassification: {
        tagName: '',
      },
      endUserTags: {
        tagsName: '',
      },
    };
    setTableData([...tableData, newData]);
  };
  console.log('tableData Add row', tableData);
  const getFooterButtons = (type) => {
    return [
      <Button key='back' onClick={handleCancel}>
        Cancel
      </Button>,
      <Button
        key='submit'
        type='primary'
        loading={loading}
        disabled={props?.inward?.loading}
        onClick={(e) => {
          handleOk(e, type);
        }}
      >
        {props.inward.loading
          ? 'Loading...'
          : type === 'Slitting' && !props.wip
          ? 'Save & Generate'
          : type !== 'Slitting'
          ? 'Proceed for Cut'
          : 'OK'}
      </Button>,
    ];
  };

  return (
    <>
      <Modal
        title={
          props?.unfinish
            ? 'UnFinish Slitting Instruction'
            : props?.editFinish
            ? 'Edit Finish Slitting Instruction'
            : props.wip
            ? 'Finish Slitting Instruction'
            : 'Slitting Instruction'
        }
        visible={props.showSlittingModal}
        onOk={handleOk}
        width={1300}
        onCancel={handleCancel}
        footer={
          props.slitCut
            ? slittingDetail.length === cuts.length && !props.wip
              ? getFooterButtons('slittingDetail')
              : getFooterButtons('SlitCut')
            : cuts.length > 0
            ? getFooterButtons('Slitting')
            : getFooterButtons('Slitting')
        }
      >
        <Card className='gx-card'>
          <Tabs defaultActiveKey='1' tabPosition={mode}>
            <TabPane tab='Slitting Instruction' key='1'>
              {props.wip ? (
                <Row>
                  {!props.unfinish && (
                    <>
                      <Col lg={24} md={24} sm={24} xs={24}>
                        <Button type='primary' onClick={addRow}>
                          Add Row
                        </Button>
                      </Col>
                    </>
                  )}
                  <Form {...formItemLayout} className='login-form gx-pt-4'>
                    <Form.Item>
                      <SlittingWidthsForm
                        setSlitEqualInstruction={setSlitEqualInstruction}
                        setSlitInstructionList={setSlitInstructionList}
                        slitEqualInstruction={slitEqualInstruction}
                        slitInstructionList={slitInstructionList}
                        setSlits={(slits) => setCuts([...cuts, ...slits])}
                        setTableData={setTableData}
                        setweight={(w) => settweight(w)}
                        totalActualweight={(w) => setTotalActualWeight(w)}
                        coilDetails={props.coilDetails}
                        wip={props.wip}
                        unfinish={props.unfinish}
                        editFinish={props.editFinish}
                        plannedLength={props.plannedLength}
                        plannedWidth={props.plannedWidth}
                        plannedWeight={props.plannedWeight}
                        length={length}
                        cuts={cuts}
                        edit={edit}
                        tweight={tweight}
                        lengthValue={(lengthValue) =>
                          setLengthValue(lengthValue)
                        }
                        widthValue={(widthValue) => setWidthValue(widthValue)}
                        reset={form}
                      />
                    </Form.Item>
                  </Form>
                  <Col lg={8} md={12} sm={24} xs={24}>
                    <p>Coil number : {props.coil.coilNumber}</p>
                    <p>
                      Available Weight(kg) :{' '}
                      {props.childCoil
                        ? insData.actualWeight
                        : props.coil.fpresent}
                    </p>
                    <p>
                      Available length(mm) :{' '}
                      {props.childCoil
                        ? insData.actualLength
                        : props.coil.availableLength}
                    </p>
                    <p>Inward Weight(kg) : {props.coil.fQuantity}</p>
                    <p>Grade: {props.coil.materialGrade.gradeName}</p>
                    <p>
                      Coil level Planned YLR (%):{' '}
                      {isNaN(plannedCoilLevelYLR)
                        ? 0
                        : plannedCoilLevelYLR.toFixed(2)}
                    </p>
                  </Col>

                  <Col lg={8} md={12} sm={24} xs={24}>
                    <p>Material : {props.coil.material.description}</p>
                    <p>Customer Name : {props.coil.party.partyName}</p>
                    <p>Thickness(mm): {props.coil.fThickness}</p>
                    <p>Width(mm) : {props.coil.fWidth}</p>
                    <p>
                      Available Width(mm):{' '}
                      {props.childCoil ? insData.actualWidth : widthValue}
                    </p>
                    <p>
                      Coil level Actual YLR (%) :{' '}
                      {isNaN(actualCoilLevelYLR)
                        ? 0
                        : actualCoilLevelYLR.toFixed(2)}
                    </p>
                  </Col>

                  <Col lg={24} md={24} sm={24} xs={24}>
                    <Table
                      className='gx-table-responsive'
                      columns={props.wip ? columns : columnsPlan}
                      dataSource={
                        props.wip ? tableData : reset ? cuts : cutArray
                      }
                      pagination={{
                        onChange(current) {
                          setPage(current);
                        },
                      }}
                    />
                    <div className='form-wrapper'>
                      <Form.Item className='form-item' label='Total weight(kg)'>
                        {getFieldDecorator('tweight', {
                          rules: [{ required: false }],
                        })(
                          <>
                            <Input
                              id='tweight'
                              disabled={true}
                              value={tweight}
                              name='tweight'
                            />
                          </>
                        )}
                      </Form.Item>

                      <Form.Item label='Actual weight(kg)'>
                        {getFieldDecorator('totalActualweight', {
                          rules: [{ required: false }],
                        })(
                          <>
                            <Input
                              id='totalActualweight'
                              disabled={true}
                              value={totalActualweight}
                              name='totalActualweight'
                            />
                          </>
                        )}
                      </Form.Item>
                      <Form.Item label='Actual yield loss ratio (plan level) (%)'>
                        {getFieldDecorator('actualYieldLossRatio', {
                          initialValue:
                            props.coil.party.actualYieldLossRatio || '',
                          rules: [{ required: false }],
                        })(
                          <>
                            <Input
                              id='actualYieldLossRatio'
                              disabled={true}
                              value={actualYLR.toFixed(2)}
                              name='actualYieldLossRatio'
                            />
                          </>
                        )}
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col
                    lg={8}
                    md={16}
                    sm={24}
                    xs={24}
                    span={16}
                    className='gx-align-self-center'
                  >
                    <Form {...formItemLayout} className='login-form gx-pt-4'>
                      <Form.Item>
                        <SlittingWidthsForm
                          setSlitEqualInstruction={setSlitEqualInstruction}
                          setSlitInstructionList={setSlitInstructionList}
                          slitEqualInstruction={slitEqualInstruction}
                          slitInstructionList={slitInstructionList}
                          setslitpayload={(slits) =>
                            setslitpayload([...slitPayload, ...slits])
                          }
                          setSlitInstruction={(slitInstruction) =>
                            setSlitInstruction([...slitInstruction])
                          }
                          slitInstruction={slitInstruction}
                          setSlits={(slits) => setCuts([...cuts, ...slits])}
                          setweight={(w) => settweight(w)}
                          coilDetails={props.coilDetails}
                          wip={props.wip}
                          plannedLength={props.plannedLength}
                          plannedWidth={props.plannedWidth}
                          plannedWeight={props.plannedWeight}
                          length={length}
                          cuts={cuts}
                          edit={edit}
                          tweight={tweight}
                          lengthValue={(lengthValue) =>
                            setLengthValue(lengthValue.toFixed(1))
                          }
                          widthValue={(widthValue) => setWidthValue(widthValue)}
                          reset={form}
                          validate={(valid) => setValidate(valid)}
                          value={value}
                          setDeleted={deleteSelected}
                          slitCut={props.slitCut}
                          setParts={(parts) => setParts(parts)}
                          setPanelList={(list) =>
                            setPanelList([...panelList, ...list])
                          }
                        />
                      </Form.Item>
                    </Form>
                  </Col>
                  <Col lg={16} md={12} sm={24} xs={24}>
                    {Array.from(groupedInstructions.entries()).map(
                      ([date, instructions], tableIndex) => (
                        <Collapse accordion key={tableIndex}>
                          <Panel
                            header={`${tableIndex + 1} ${String.fromCharCode(
                              160
                            )} Slitting Date: ${date} ${String.fromCharCode(
                              160
                            )} Yield loss (%): ${
                              yieldLossRatio[tableIndex]
                                ? parseFloat(
                                    yieldLossRatio[tableIndex]
                                  ).toFixed(2)
                                : '0.00'
                            } `}
                            key={date}
                          >
                            <Table
                              className='gx-table-responsive'
                              columns={props.wip ? columns : columnsPlan}
                              dataSource={
                                props.wip
                                  ? tableData
                                  : reset
                                  ? instructions
                                  : cutArray
                              }
                              pagination={{
                                onChange(current) {
                                  setPage(current);
                                },
                              }}
                            />
                          </Panel>
                        </Collapse>
                      )
                    )}
                    <Row style={{ paddingLeft: 16 }}>
                      <Col lg={11} md={12} sm={24} xs={24}>
                        <Form.Item label='Total weight(kg)'>
                          {getFieldDecorator('tweight', {
                            rules: [{ required: false }],
                          })(
                            <>
                              <Input
                                id='tweight'
                                disabled={true}
                                value={tweight}
                                name='tweight'
                              />
                            </>
                          )}
                        </Form.Item>
                      </Col>
                      <Col lg={12} md={12} sm={24} xs={24}>
                        <Form.Item label='Planned yield loss (%)'>
                          {getFieldDecorator('plannedYieldLossRatio', {
                            rules: [{ required: false }],
                          })(
                            <>
                              <Input
                                id='plannedYieldLossRatio'
                                disabled={true}
                                value={sum.toFixed(2)}
                                name='plannedYieldLossRatio'
                              />
                            </>
                          )}
                        </Form.Item>
                      </Col>
                      {/* <Row style={{ paddingLeft: 16 }}> */}
                      <Col lg={24} md={24} sm={24} xs={24}>
                        <Form.Item label='Coil level planned yield loss (%)'>
                          {getFieldDecorator('plannedCoilLevelYLR', {
                            rules: [{ required: false }],
                          })(
                            <>
                              <Input
                                id='plannedCoilLevelYLR'
                                disabled={true}
                                value={
                                  isNaN(plannedCoilLevelYLR)
                                    ? 0
                                    : plannedCoilLevelYLR.toFixed(2)
                                }
                                name='plannedCoilLevelYLR'
                              />
                            </>
                          )}
                        </Form.Item>
                        <Form.Item
                          label='Coil level actual yield loss (%)'
                          style={{ marginLeft: 1 }}
                        >
                          {getFieldDecorator('actualCoilLevelYLR', {
                            rules: [{ required: false }],
                          })(
                            <>
                              <Input
                                id='actualCoilLevelYLR'
                                disabled={true}
                                value={
                                  isNaN(actualCoilLevelYLR)
                                    ? 0
                                    : actualCoilLevelYLR.toFixed(2)
                                }
                                name='actualCoilLevelYLR'
                              />
                            </>
                          )}
                        </Form.Item>
                      </Col>
                      {/* </Row> */}
                      {/* <Col lg={12} md={12} sm={24} xs={24}>
                        <Form.Item label='Total yield loss (%)'>
                          {getFieldDecorator('totalYieldLossRatio', {
                            rules: [{ required: false }],
                          })(
                            <>
                              <Input
                                id='totalYieldLossRatio'
                                disabled={true}
                                value={(sum).toFixed(2)}
                                name='totalYieldLossRatio'
                              />
                            </>
                          )}
                        </Form.Item>
                      </Col> */}
                    </Row>
                  </Col>
                </Row>
              )}

              <Modal
                title='Confirmation'
                visible={showDeleteModal}
                width={400}
                onOk={() => {
                  onDelete(deleteRecord);
                }}
                onCancel={() => setshowDeleteModal(false)}
              >
                <p>All Instructions associated to this part will be deleted.</p>
                <p>Please click OK to proceed for delete</p>
              </Modal>
            </TabPane>

            {!props.wip && (
              <TabPane tab='Coil Details' key='2'>
                <Row>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <p>Coil number : {props.coil.coilNumber}</p>
                    <p>Customer Name : {props.coil.party.partyName}</p>
                    {props.coil.customerBatchId && (
                      <p>Customer Batch No:{props.coil.customerBatchId}</p>
                    )}
                    <p>Material Desc: {props.coil.material.description}</p>
                    <p>Grade: {props.coil.materialGrade.gradeName}</p>
                  </Col>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <p>
                      Inward specs: {props.coil.fThickness}X{props.coil.fWidth}X
                      {props.coil.fLength}/{props.coil.fQuantity}
                    </p>
                    <p>Available Length(mm): {props.coil.availableLength}</p>
                    <p>Available Weight(kg) : {props.coil.fpresent}</p>
                    <p>
                      Available Width (mm) :{' '}
                      {props.coil.fpresent > 0
                        ? props.coilDetails.fWidth ||
                          props.coilDetails.plannedWidth
                        : 0}
                    </p>
                  </Col>
                </Row>
              </TabPane>
            )}
            {!props.wip && (
              <TabPane tab='Customer Yield Loss Reference' key='3'>
                <Row>
                  <Col lg={20} md={20} sm={24} xs={24}>
                    <Table
                      className='gx-table-responsive'
                      columns={columnYieldLoss}
                      dataSource={
                        props.slitCut
                          ? slitCutfilteredData
                          : slittingfilteredData
                      }
                    />
                  </Col>
                </Row>
              </TabPane>
            )}
          </Tabs>
        </Card>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  party: state.party,
  inward: state.inward,
  processTags: state.packetClassification?.processTags,
  yieldLossRatioParty: state.yieldLossRatio.YLRList.content,
});

const SlittingDetailsForm = Form.create({
  onFieldsChange(props, changedFields) {},
  mapPropsToFields(props) {
    return {
      width: Form.createFormField({
        ...props.inward.process.width,
        value: props.inward.process.width ? props.inward.process.width : '',
      }),
      processDate: Form.createFormField({
        ...props.inward.process.processDate,
        value: props.inward.process.processDate
          ? props.inward.process.processDate
          : moment(new Date(), APPLICATION_DATE_FORMAT),
      }),
      length: Form.createFormField({
        ...props.inward.process.length,
        value: props.inward.process.length ? props.inward.process.length : '',
      }),
      no: Form.createFormField({
        ...props.inward.process.no,
        value: props.inward.process.no ? props.inward.process.no : '',
      }),
      weight: Form.createFormField({
        ...props.inward.process.weight,
        value: props.inward.process.weight ? props.inward.process.weight : '',
      }),
      twidth: Form.createFormField({
        ...props.inward.process.twidth,
        value: props.inward.process.twidth ? props.inward.process.twidth : '',
      }),
      actualYieldLossRatio: Form.createFormField({
        ...props.inward.process.actualYieldLossRatio,
        value: props.inward.process.actualYieldLossRatio || '',
      }),
      targetWeight: Form.createFormField({
        ...props.inward.process.targetWeight,
        value: props.inward.process.targetWeight
          ? props.inward.process.targetWeight
          : '',
      }),
      noParts: Form.createFormField({
        ...props.inward.process.noParts,
        value: props.inward.process.noParts ? props.inward.process.noParts : '',
      }),
      plannedYieldLossRatio: Form.createFormField({
        ...props.inward.process.plannedYieldLossRatio,
        value: props.inward.process.plannedYieldLossRatio || '',
      }),
    };
  },
  onValuesChange(props, values) {
    props.setProcessDetails({ ...props.inward.process, ...values });
  },
})(CreateSlittingDetailsForm);

const SlittingWidthsForm = Form.create()(SlittingWidths);

export default connect(mapStateToProps, {
  setProcessDetails,
  saveSlittingInstruction,
  resetInstruction,
  updateInstruction,
  deleteInstructionById,
  pdfGenerateInward,
  resetIsDeleted,
  QrCodeGeneratePlan,
  labelPrintEditFinish,
  fetchClassificationList,
  fetchYLRList,
})(SlittingDetailsForm);
