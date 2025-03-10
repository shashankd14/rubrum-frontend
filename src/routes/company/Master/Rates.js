import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  Button,
  Card,
  Divider,
  Table,
  Modal,
  Row,
  Col,
  Form,
  Input,
  Select,
  Checkbox,
  Tabs,
  message,
} from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import moment from "moment";
import SearchBox from "../../../components/SearchBox";
import EditAdditionalRates from "./editAdditionalRates";
import { LeftOutlined, RightOutlined, EllipsisOutlined } from '@ant-design/icons';
import IntlMessages from "../../../util/IntlMessages";
import {
  fetchRatesList,
  fetchPackingRatesList,
  fetchPartyList,
  fetchMaterialList,
  fetchProcessList,
  addRates,
  addPackingRates,
  fetchAdditionalPriceList,
  fetchAdditionalPriceListById,
  getStaticList,
  fetchRatesListById,
  fetchPackingRatesById,
  updateRates,
  updatePackingRates,
  resetRates,
  resetPackingRates,
  deleteRates,
  deleteAdditionalRates,
  fetchPackingBucketList,
  getLaminationChargesList,
  getLaminationChargesById,
  addLminationCharges,
  updateLminationCharges,
  deleteLminationCharges,
  resetLaminationChargesRequest
} from "../../../appRedux/actions";
import { onDeleteContact } from "../../../appRedux/actions";
import AdditionalRates from "./addAdditionalRates";

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
    md: { span: 16 },
  },
};

const Rates = (props) => {
  const TabPane = Tabs.TabPane;
  const [sortedInfo, setSortedInfo] = useState({
    order: "descend",
    columnKey: "age",
  });
  const laminationDD = [
    {laminationDetailsId : 1, laminationDetailsDesc : "Single Side lamination charges per meter (labour)"},
    {laminationDetailsId : 2, laminationDetailsDesc : "Single Side lamination charges per meter (material)"},
    {laminationDetailsId : 3, laminationDetailsDesc : "Single Side lamination charges per meter (labour and material)"},
    {laminationDetailsId : 4, laminationDetailsDesc : "Double Side lamination charges per meter (labour)"},
    {laminationDetailsId : 5, laminationDetailsDesc : "Double Side lamination charges per meter (material)"},
    {laminationDetailsId : 6, laminationDetailsDesc : "Double Side lamination charges per meter (labour and material)"},
  ]
  const [selectedOption, setSelectedOption] = useState(laminationDD[0].laminationDetailsId);
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchThickness, setSearchThickness] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: props.rates.totalItems || 0, });
  const [pageNo, setPageNo] = useState(1);
  const [showAddRates, setShowAddRates] = useState(false);
  const [showAddPackingRates, setShowAddPackingRates] = useState(false);
  const [viewMaterial, setViewMaterial] = useState(false);
  const [viewPackingRate, setViewPackingRate] = useState(false);
  const [editRates, setEditRates] = useState(false);
  const [editPackingRates, setEditPackingRates] = useState(false);
  const [viewMaterialData, setViewMaterialData] = useState({});
  const [viewPackingRateData, setViewPackingRateData] = useState({});
  const [type, setType] = useState([]);
  const [filteredInwardList, setFilteredInwardList] = useState(
    []
  );
  const [filteredPackingRateList, setfilteredPackingRateList] = useState();
  const [gradeList, setGradeList] = useState([]);
  const [checked, setChecked] = useState(false);
  const { getFieldDecorator } = props.form;
  const [tabKey, setTabKey] = useState("1");
  const [mode, setMode] = useState("top");
  const [selectedRows, setSelectedRows] = useState([]);
  const [showAdditionalRates, setShowAdditionalRates] = useState(false);
  const [staticList, setStaticList] = useState([]);
  const [selectedProcessId, setSelectedProcessId] = useState("");
  const [additionPriceList, setAdditionalPriceList] = useState([]);
  const [viewAdditionalRates, setViewAdditionalRates] = useState(false);
  const [editPriceModal, setEditPriceModal] = useState(false);
  const [staticSelected, setStaticSelected] = useState();
  const [selectedParty, setSelectedParty] = useState("");
  const [totalPageItems, setTotalItems] = useState(0); 
  const { ratesList, totalItems } = props.rates;
  const [showAddLaminationCharges, setShowAddLaminationCharges] = useState(false);
  const [editLaminationCharges, setEditLaminationCharges] = useState(false);
  const [viewLaminationChargesData, setViewLaminationChargesData] = useState({});
  const [viewLaminationCharges, setViewLaminationCharges] = useState(false);
  const [laminationChargesList, setLaminationChargesList] = useState([]);
  const [laminationStaticSelected, setLaminationStaticSelected] = useState();
  const columns = [
    {
      title: "Rate Id",
      dataIndex: "id",
      key: "id",
      filters: [],
      sorter: (a, b) => {
        return a.id - b.id;
      },
      sortOrder: sortedInfo.columnKey === "id" && sortedInfo.order,
    },
    {
      title: "Party Name",
      dataIndex: "partyName",
      key: "partyName",
      filteredValue: filteredInfo ? filteredInfo["partyName"] : null,
        filters: [...new Set(props.rates.ratesList.map(item => item.partyName))].map(material => {
            return ({ text: material || '', value: material || '' })}),
        onFilter: (value, record) => record.partyName == value,
        sorter: (a, b) => a.partyName?.length - b.partyName?.length,
        sortOrder: sortedInfo.columnKey === 'partyName' && sortedInfo.order,
    },
    {
      title: "Process Name",
      dataIndex: "processName",
      key: "processName",
      filteredValue: filteredInfo ? filteredInfo["processName"] : null,
        filters: [...new Set(props.rates.ratesList.map(item => item.processName))].map(material => {
            return ({ text: material || '', value: material || '' })}),
        onFilter: (value, record) => record.processName == value,
        sorter: (a, b) => a.processName?.length - b.processName?.length,
        sortOrder: sortedInfo.columnKey === 'processName' && sortedInfo.order,
    },
    {
      title: "Material description",
      dataIndex: "materialDescription",
      key: "materialDescription",
      filteredValue: filteredInfo ? filteredInfo["materialDescription"] : null,
        filters: [...new Set(props.rates.ratesList.map(item => item.materialDescription))].map(material => {
            return ({ text: material || '', value: material || '' })}),
        onFilter: (value, record) => record.materialDescription == value,
        sorter: (a, b) => a.materialDescription?.length - b.materialDescription?.length,
        sortOrder: sortedInfo.columnKey === 'materialDescription' && sortedInfo.order,
    },
    {
      title: "Material Grade",
      dataIndex: "matGradeName",
      key: "matGradeName",
      filteredValue: filteredInfo ? filteredInfo["matGradeName"] : null,
        filters: [...new Set(props.rates.ratesList.map(item => item.matGradeName))].map(material => {
            return ({ text: material || '', value: material || '' })}),
        onFilter: (value, record) => record.matGradeName == value,
        sorter: (a, b) => a.matGradeName?.length - b.matGradeName?.length,
        sortOrder: sortedInfo.columnKey === 'matGradeName' && sortedInfo.order,
    },
    {
      title: "Thickness Range",
      dataIndex: "thicknessFrom",
      render: (text, record) => `${record.thicknessFrom}-${record.thicknessTo}`,
      filteredValue: filteredInfo ? filteredInfo["thicknessFrom"] : null,
       filters: [
           ...new Set(
           props.rates.ratesList.map(
          (item) => `${item.thicknessFrom}-${item.thicknessTo}`
          )
          ),
         ].map((thicknessRange) => {
        return { text: thicknessRange || '', value: thicknessRange || '' };
        }),
      onFilter: (value, record) => {
       const [from, to] = value.split('-');
       const thicknessFrom = parseFloat(from);
       const thicknessTo = parseFloat(to);
      return (
      thicknessFrom <= record.thicknessFrom && thicknessTo >= record.thicknessTo
       );
     },
      sorter: (a, b) =>
      a.thicknessFrom - b.thicknessFrom || a.thicknessTo - b.thicknessTo,
      sortOrder: sortedInfo.columnKey === 'thicknessFrom' && sortedInfo.order,
    },
    {
      title: "Thickness rate",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      sortOrder: sortedInfo.columnKey === "price" && sortedInfo.order,
    },

    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record, index) => (
        <span>
          <span className="gx-link" onClick={(e) => onView(record, e)}>
            View
          </span>
          <Divider type="vertical" />
          <span className="gx-link" onClick={(e) => onEdit(record, e)}>
            Edit
          </span>
          <Divider type="vertical" />
          <span className="gx-link" onClick={(e) => onDelete(record, e)}>
            Delete
          </span>
        </span>
      ),
    },
  ];
  const additionalPriceColumns = [
    {
      title: "Party Name",
      dataIndex: "partyName",
      key: "partyName",
      filters: [],
      sorter: (a, b) => a.partyName - b.partyName,
      sortOrder: sortedInfo.columnKey === "partyName" && sortedInfo.order,
    },
    {
      title: "Process Name",
      dataIndex: "processName",
      key: "processName",
      filters: [],
      sorter: (a, b) => a.processName - b.processName,
      sortOrder: sortedInfo.columnKey === "processName" && sortedInfo.order,
    },
    {
      title: "Range",
      dataIndex: "thicknessFrom",
      render: (text, record, index) => record.rangeFrom + "-" + record.rangeTo,
    },
    {
      title: "Additional Rates",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      sortOrder: sortedInfo.columnKey === "price" && sortedInfo.order,
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record, index) => (
        <span>
          <span className="gx-link" onClick={(e) => onView(record, e)}>
            View
          </span>
          <Divider type="vertical" />
          <span className="gx-link" onClick={(e) => onEdit(record, e)}>
            Edit
          </span>
          <Divider type="vertical" />
          <span className="gx-link" onClick={(e) => onDelete(record, e)}>
            Delete
          </span>
        </span>
      ),
    },
  ];

  const packingRateColumn = [{
    title: 'S No',
    dataIndex: 'packingRateId',
    key: 'packingRateId',
    filters: [],
    sorter: (a, b) => {
        return a.packingRateId - b.packingRateId
    },
    sortOrder: sortedInfo.columnKey === 'packingRateId' && sortedInfo.order,
},
{
    title: 'Party Name',
    dataIndex: 'partyName',
    key: 'partyName',
    filters: [],
    sorter: (a, b) => {
        return a.partyName - b.partyName
    },
    sortOrder: sortedInfo.columnKey === 'partyName' && sortedInfo.order,
},
{
    title: 'Bucket Name',
    dataIndex: 'packingBucketName',
    key: 'packingBucketName',
    filters: [],
    sorter: (a, b) => {
        return a.packingBucketName - b.packingBucketName
    },
    sortOrder: sortedInfo.columnKey === 'packingBucketName' && sortedInfo.order,
},
{
  title: 'Rate',
  dataIndex: 'packingRate',
  key: 'packingRate',
  filters: [],
  sorter: (a, b) => {
      return a.packingRate - b.packingRate
  },
  sortOrder: sortedInfo.columnKey === 'packingRate' && sortedInfo.order,
},
{
  title: 'Description',
  dataIndex: 'packingRateDesc',
  key: 'packingRateDesc',
  filteredValue: filteredInfo ? filteredInfo["packingRateDesc"] : null,
  filters: [],
  onFilter: (value, record) => record.packingRateDesc == value,
  sorter: (a, b) => a.packingRateDesc?.length - b.packingRateDesc?.length,
  sortOrder: sortedInfo.columnKey === 'packingRateDesc' && sortedInfo.order,
},
{
    title: 'Action',
    dataIndex: '',
    key: 'x',
    render: (text, record, index) => (
        <span>
            <span className="gx-link" onClick={(e) => onView(record, e)}>View</span>
            <Divider type="vertical"/>
            <span className="gx-link" onClick={(e) => onEdit(record,e)}>Edit</span>
            <Divider type="vertical"/>
            <span className="gx-link"onClick={() => {}}>Delete</span>
        </span>
    ),
},
];

const laminationChargesColumn = [{
  title: 'Lamination ID',
  dataIndex: 'laminationId',
  key: 'laminationId',
  filters: [],
  sorter: (a, b) => {
      return a.laminationId - b.laminationId
  },
  sortOrder: sortedInfo.columnKey === 'laminationId' && sortedInfo.order,
},
{
  title: 'Party Name',
  dataIndex: 'partyName',
  key: 'partyName',
  filters: [],
  sorter: (a, b) => {
      return a.partyName - b.partyName
  },
  sortOrder: sortedInfo.columnKey === 'partyName' && sortedInfo.order,
},
{
title: 'Charges',
dataIndex: 'charges',
key: 'charges',
filters: [],
sorter: (a, b) => {
    return a.laminationSSmaterial - b.laminationSSmaterial
},
sortOrder: sortedInfo.columnKey === 'laminationSSmaterial' && sortedInfo.order,
},
{
  title: 'Action',
  dataIndex: '',
  key: 'x',
  render: (text, record, index) => (
      <span>
          <span className="gx-link" onClick={(e) => onView(record, e)}>View</span>
          <Divider type="vertical"/>
          <span className="gx-link" onClick={(e) => onEdit(record,e)}>Edit</span>
          <Divider type="vertical"/>
          <span className="gx-link"onClick={(e) => onDelete(record,e)}>Delete</span>
      </span>
  ),
},
];

  const onView = (record, e) => {
    e.preventDefault();
    if (tabKey === "1") {
      setViewMaterialData(record);
      setViewMaterial(true);
    } else if (tabKey === "3") {
      setViewPackingRateData(record);
      setViewPackingRate(true);
    } else if (tabKey === "4") {
      setViewLaminationChargesData(record);
      setViewLaminationCharges(true);
    } else {
      setViewMaterialData(record);
      setViewAdditionalRates(true);
    }
  };

  const onDelete = (record, e) => {
    e.preventDefault();
    if (tabKey === "1") {
      props.deleteRates(record?.id);
    } else if (tabKey === "4"){
      props.deleteLminationCharges(record.laminationId)
    } else {
      props.deleteAdditionalRates(record?.id);
    }
  };
  const onEdit = (record, e) => {   
    e.preventDefault();
    if (tabKey === "1") { 
    const list = props.material.materialList.filter(
      (material) => material.matId === record.matId
    );
    setGradeList(list.map((item) => item.materialGrade)?.flat());
      props.fetchRatesListById(record.id);
      setEditRates(true);
      setTimeout(() => {
        setShowAddRates(true);
      }, 1000);
    } else if (tabKey === "3") {
      props.fetchPackingRatesById(record.packingRateId);
      setEditPackingRates(true);
      setTimeout(() => {
        setShowAddPackingRates(true);
      }, 1000);
    } else if (tabKey === "4") {
     props.getLaminationChargesById(record.laminationId);
      setEditLaminationCharges(true);
      setTimeout(() => {
        setShowAddLaminationCharges(true);
      }, 1000);
    } else {
      props.fetchAdditionalPriceListById(record.id);
      setTimeout(() => {
        setEditPriceModal(true);
      }, 1000);
    }
  };
  useEffect(() => {
    props.fetchPartyList();
    props.fetchMaterialList();
    props.fetchProcessList();
    props.fetchAdditionalPriceList();
    props.fetchPackingRatesList();
    props.fetchPackingBucketList();
    props.getLaminationChargesList();
  }, []);

  useEffect(() => {
    props.fetchRatesList();
  }, [showAddRates]);

  useEffect(() => {
    props.getLaminationChargesList();
  }, [showAddLaminationCharges, editLaminationCharges]);

  useEffect(() => {
   // props.fetchPackingRatesList();
   props.fetchRatesList({
    pageNo: pagination.current,
    pageSize: pagination.pageSize,
    searchText: searchValue,
    thicknessRange: searchThickness,
  });
  }, [showAddPackingRates]);

  // useEffect(() => {
  //   const { ratesList } = props.rates;

  //   setFilteredInwardList(ratesList);
  // }, [props.rates.ratesList]);

  useEffect(() => {
    const { packingRateList } = props.rates;
    setfilteredPackingRateList(packingRateList)
  }, [props.rates.packingRateList]);
  
  useEffect(() => {
      setLaminationChargesList(props.rates?.laminationChargesList || [])
  }, [props.rates.laminationChargesList]);

  // useEffect(() => {
  //   if (props.rates.loading) {
  //     message.loading("Loading..");
  //   }
  // }, [props.rates.loading]);

  useEffect(() => {
    if (props.rates.addSuccess || props.rates.deleteSuccess) {
      props.fetchRatesList({
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        searchText: searchValue,
        thicknessRange: searchThickness,
      });
     // props.fetchRatesList();
      props.resetRates();
    }
    if (props?.rates?.staticList) {
      setStaticList(props.rates.staticList);
    }
    if (
      props?.rates?.deleteAdditionalSuccess ||
      props?.rates?.addAdditionalSuccess ||
      editPriceModal
    ) {
      props.fetchAdditionalPriceList();
      props.resetRates();
    }
  }, [
    editPriceModal,
    props.rates.addSuccess,
    props.rates.deleteSuccess,
    props.rates.staticList,
    props.rates.deleteAdditionalSuccess,
    props.rates?.addAdditionalSuccess,
  ]);

  useEffect(() => {
    const list = props?.rates?.additionalRatesList.filter(
      (item) =>
        item?.additionalPriceId === staticSelected &&
        item.processId === selectedProcessId &&
        item?.partyId === selectedParty
    );
    setAdditionalPriceList(list);
  }, [props?.rates?.additionalRatesList]);
  useEffect(() => {
    const list = props?.rates?.laminationChargesList.filter(
      (item) =>
        item?.laminationDetailsId === laminationStaticSelected &&
       // item.processId === selectedProcessId &&
        item?.partyId === selectedParty
    );
    setLaminationChargesList(list);
  }, [props?.rates?.laminationChargesList]);

  useEffect(() => {
    const { rates } = props;
    if (searchValue) {
      if (tabKey === "3") {
        const filteredData = rates?.packingRateList?.filter((rate) => {
          if (
            rate?.partyName?.toString().includes(searchValue) ||
            rate?.packingBucketName?.toString().includes(searchValue) ||
            rate?.packingRate?.toString() === searchValue ||
            rate?.packingRateDesc?.toString().includes(searchValue)
          ) {
            return rate;
          }
        });
        setfilteredPackingRateList(filteredData);
      }
      else {
        const filteredData = rates?.ratesList?.filter((rate) => {
          if (
            rate?.id?.toString() === searchValue ||
            rate?.partyId?.toString() === searchValue ||
           ( rate?.partyName?.toLowerCase().includes(searchValue.toLowerCase())) ||
            rate?.matGradeId?.toString() === searchValue ||
            rate?.processId?.toString() === searchValue ||
            rate?.price?.toString() === searchValue
          ) {
            return rate;
          }
        });
        setFilteredInwardList(filteredData);
      }
    } else {
      setFilteredInwardList(rates.ratesList);
      setfilteredPackingRateList(rates.packingRateList);
    }
  }, [searchValue]);

  // useEffect(() => {
  //   if (searchValue) {
  //     if (searchValue.length >= 3) {
  //       setPageNo(1);
  //       props.fetchRatesList(1, 15, searchValue);
  //     }
  //   } else {
  //     setPageNo(1);
  //     props.fetchRatesList(1, 15, searchValue);
  //   }
  // }, [searchValue]);

  useEffect(() => {
    if (checked) {
      const list = props.material.materialList.filter((item) =>
        type?.includes(item.matId)
      );
      setGradeList(list.map((item) => item.materialGrade)?.flat());
    } else {
      const list = props.material.materialList.filter(
        (material) => material.matId === type
      );
      setGradeList(list.map((item) => item.materialGrade)?.flat());
    } 
  }, [type, checked]);

  useEffect(() => {
    if (totalItems) {
      setTotalItems(totalItems);
    }
  }, [totalItems]);

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    setFilteredInfo(filters);
    setPagination(pagination)
  };

  const handleMaterialTypeChange = (e) => {
    console.log("material", e);
    setType(e);
  };

  const checkboxChange = (e) => {
    setChecked(e.target.checked);
    console.log(`checked = ${e.target.checked}`);
  };
  const callback = (key) => {
    setTabKey(key);
  };
  const rowSelection = {
    onSelect: (record, selected, selectedRows) => {
      setSelectedRows(selectedRows);
    },
  };

  const handleProcessChange = (e) => {
    if (e?.target?.name === "partyName") {
      setSelectedParty(e.target.value);
    } else {
      props.getStaticList(e);
      setSelectedProcessId(e);
    }
  };
  const handlePartyChange = (e) => {
      setSelectedParty(e);
  };
  const handleStaticChange = (e) => {
    setStaticSelected(e);
    const list = props?.rates?.additionalRatesList.filter(
      (item) =>
        item?.additionalPriceId === e &&
        item?.processId === selectedProcessId &&
        item?.partyId === selectedParty
    );
    setAdditionalPriceList(list);
  };
  const handleLaminationChange = (e) => {
    setLaminationStaticSelected(e);
    const list = props?.rates?.laminationChargesList.filter(
      (item) =>
        item?.laminationDetailsId === e &&
        item?.partyId === selectedParty
    );
    setLaminationChargesList(list);
  };
  const clearFilters = (value) => {
    setFilteredInfo(null);
  };

  useEffect(() => {
    setFilteredInwardList(props.rates.ratesList || []);
  }, [props.rates.ratesList]);

  const fetchData = () => {
    props.fetchRatesList({
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      searchText: searchValue,
      thicknessRange: searchThickness,
    });
  };
  useEffect(() => {
    fetchData();
  }, [pagination]);

  useEffect(() => {
    props.fetchRatesList({
      pageNo: 1,
      pageSize: pagination.pageSize,
      searchText: searchValue,
      thicknessRange: '',
    });
    const filteredData = props.rates?.ratesList?.filter((rate) => {
      if (
         ( rate?.partyName?.toLowerCase().includes(searchValue.toLowerCase())) ||
        (rate?.processName?.toLowerCase().includes(searchValue.toLowerCase())) ||
        (rate?.materialDescription?.toLowerCase().includes(searchValue.toLowerCase())) ||
        (rate?.matGradeName?.toLowerCase().includes(searchValue.toLowerCase()))
      ) {
        return rate;
      }
    });
    setFilteredInwardList(filteredData);
  }, [ searchValue]);
  useEffect(() => {
    props.fetchRatesList({
      pageNo: 1,
      pageSize: pagination.pageSize,
      searchText: '',
      thicknessRange: searchThickness,
      })
  }, [ searchThickness]);

  const handleDropdownChange = (value) => {
    setSelectedOption(value);
  };
  const filteredLaminations = props.laminationCharges.filter(
    (item) => item.partyId === selectedParty
  );
  return (
    <div>
      <h1>
        <IntlMessages id="sidebar.company.ratesList" />
      </h1>
      <Card>
        <div className="gx-flex-row gx-flex-1">
          <div className="table-operations gx-col">
            <Button>Delete</Button>
            <Button>Export</Button>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
          <div className="gx-flex-row gx-w-50">
            {tabKey === "2" && (
              <Button
                type="primary"
                icon={() => <i className="icon icon-add" />}
                size="default"
                onClick={() => {
                  setShowAdditionalRates(true);
                }}
              >
                Add Additional Rates
              </Button>
            )}
            {tabKey === "1" && (
              <Button
                type="primary"
                icon={() => <i className="icon icon-add" />}
                size="default"
                onClick={() => {
                  props.resetRates();
                  props.form.resetFields();
                  setShowAddRates(true);
                }}
              >
                Add Rates
              </Button>
            )}
            {tabKey === "3" && (
              <Button
                type="primary"
                icon={() => <i className="icon icon-add" />}
                size="default"
                onClick={() => {
                  props.resetPackingRates();
                  props.form.resetFields();
                  setShowAddPackingRates(true);
                }}
              >
                Add Packing Rates
              </Button>
            )}
            {tabKey === "4" && (
              <Button
                type="primary"
                icon={() => <i className="icon icon-add" />}
                size="default"
                onClick={() => {
                 props.resetLaminationChargesRequest();
                  props.form.resetFields();
                  setShowAddLaminationCharges(true);
                }}
              >
                Add Lamination Charges
              </Button>
            )}
            <SearchBox
              styleName="gx-flex-1"
              placeholder="Search for party name, process name or material ..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />&nbsp;
              {tabKey === "1" && (
            <SearchBox
              styleName="gx-flex-1"
              placeholder="Search for thickness range..."
              value={searchThickness}
              onChange={(e) => setSearchThickness(e.target.value)}
            />
            )}
          </div>
        </div>
        <Tabs defaultActiveKey="1" tabPosition={mode} onChange={callback}>
          <TabPane tab="Base Rates" key="1">
            <Table
              rowSelection={rowSelection}
              className="gx-table-responsive"
              columns={columns}
              dataSource={filteredInwardList}
              onChange={handleChange}
              pagination={{
                ...pagination,
                total: props.rates.totalItems || 0, 
                itemRender: (current, type, originalElement) => {
                  if (type === 'prev') {
                    return <LeftOutlined />;
                  }
                  if (type === 'next') {
                    return <RightOutlined />;
                  }
                  if (type === 'jump-prev' || type === 'jump-next') {
                    return <EllipsisOutlined />;
                  }
                  return originalElement;
                },
                showLessItems: true, 
                pageSizeOptions: ['10', '20', '50'],
              }}
            />
          </TabPane>
          <TabPane tab="Additional Rates" key="2" className="additionalTab">
            <Select
              style={{ width: 300 }}
              className="additional_price_select"
              placeholder="Select Party"
              name="partyName"
              onChange={handlePartyChange}
            >
              {props.party?.partyList?.map((party) => (
                <Option key={party.nPartyId} value={party.nPartyId}>{party.partyName}</Option>
              ))}
            </Select>
            <Select
              style={{ width: 300 }}
              className="additional_price_select"
              placeholder="Select a Process"
              onChange={handleProcessChange}
            >
              {props.process?.processList?.map((process) => (
                <Option key={process.processId} value={process.processId}>
                  {process?.processName}
                </Option>
              ))}
            </Select>
            {staticList.length > 0 && (
              <>
                <Select
                  style={{ width: 300 }}
                  placeholder="Select"
                  className="additional_price_select"
                  onChange={handleStaticChange}
                >
                  {staticList?.map((item) => (
                    <Option key={item.id} value={item.id}>{item.priceDesc}</Option>
                  ))}
                </Select>
              </>
            )}
            {additionPriceList.length > 0 && (
              <>
                <Table
                  rowSelection={[]}
                  className="gx-table-responsive"
                  columns={additionalPriceColumns}
                  dataSource={additionPriceList}
                  onChange={handleChange}
                />
              </>
            )}
          </TabPane>
          <TabPane tab="Packing Rate" key="3">
            <Table 
              className="gx-table-responsive"
              columns={packingRateColumn}
              dataSource={filteredPackingRateList}
              onChange={handleChange}
              />
          </TabPane>
          <TabPane tab="Lamination Charges" key="4">
          <Select
              style={{ width: 300 }}
              className="additional_price_select"
              placeholder="Select Party"
              name="partyName"
              onChange={handlePartyChange}
            >
              {props.party?.partyList?.map((party) => (
                <Option key={party.nPartyId} value={party.nPartyId}>{party.partyName}</Option>
              ))}
            </Select>
            {props.laminationCharges.length > 0 && (
              <>
                <Select
                  style={{ width: 400 }}
                  placeholder="Select lamination"
                  className="additional_price_select"
                  onChange={handleLaminationChange}
                >
                  {filteredLaminations?.map((item) => (
                    <Option key={item.laminationDetailsId} value={item.laminationDetailsId}>{item.laminationDetailsDesc}</Option>
                  ))}
                </Select>
              </>
            )}
            {laminationChargesList.length > 0 && (
            <Table 
              className="gx-table-responsive"
              columns={laminationChargesColumn}
              dataSource={laminationChargesList}
              onChange={handleChange}
              />
            )}
          </TabPane>
        </Tabs>
        <Modal
          title="Rates Details"
          visible={viewMaterial}
          onOk={() => setViewMaterial(false)}
          onCancel={() => setViewMaterial(false)}
        >
          <Card className="gx-card">
            <Row>
              <Col span={24}>
                <Card>
                  <p>
                    <strong>Party Name :</strong> {viewMaterialData?.partyId}
                  </p>
                  <p>
                    <strong>Material Type :</strong>{" "}
                    {viewMaterialData?.matGradeId}
                  </p>
                  <p>
                    <strong>Process Name :</strong>{" "}
                    {viewMaterialData?.processId}
                  </p>
                  <p>
                    <strong>Minimum Thickness :</strong>{" "}
                    {viewMaterialData?.thicknessFrom}
                  </p>
                  <p>
                    <strong>Maximum Thickness :</strong>{" "}
                    {viewMaterialData?.thicknessTo}
                  </p>
                  <p>
                    <strong>Thickness Rate :</strong> {viewMaterialData?.price}
                  </p>
                </Card>
              </Col>
            </Row>
          </Card>
        </Modal>
        <Modal
          title="Additional Rates Details"
          visible={viewAdditionalRates}
          onOk={() => setViewAdditionalRates(false)}
          onCancel={() => setViewAdditionalRates(false)}
        >
          <Card className="gx-card">
            <Row>
              <Col span={24}>
                <Card>
                  <p>
                    <strong>Party Name :</strong> {viewMaterialData?.partyId}
                  </p>
                  <p>
                    <strong>Process Name :</strong>{" "}
                    {viewMaterialData?.processId}
                  </p>
                  <p>
                    <strong>Minimum Range :</strong>{" "}
                    {viewMaterialData?.rangeFrom}
                  </p>
                  <p>
                    <strong>Maximum Range :</strong> {viewMaterialData?.rangeTo}
                  </p>
                  <p>
                    <strong>Rate :</strong> {viewMaterialData?.price}
                  </p>
                </Card>
              </Col>
            </Row>
          </Card>
        </Modal>
        <Modal
          title="Add Rates"
          visible={showAddRates}
          onOk={(e) => {
            e.preventDefault();
            if (editRates) {
              props.form.validateFields((err, values) => {
                values.partyId = [values.partyId];
                values.matGradeId = [values.matGradeId];
                const data = { values, id: props.rates?.rates?.id  };
                 props.updateRates(data);
                props.form.resetFields();
                setEditRates(false);
                setShowAddRates(false);
              });
            } else {
              props.form.validateFields((err, values) => {
                if (checked) {
                  props.addRates(values);
                } else {
                  const payload = {
                    ...values,
                    matGradeId: [values.matGradeId],
                    partyId: [values.partyId],
                  };
                  props.addRates(payload);
                }

                props.form.resetFields();
                setChecked(false);
                setShowAddRates(false);
              });
            }
          }}
          width={600}
          onCancel={() => {
            props.form.resetFields();
            setShowAddRates(false);
            setEditRates(false);
          }}
        >
          <Card className="gx-card">
            <Row>
              <Col
                lg={24}
                md={24}
                sm={24}
                xs={24}
                className="gx-align-self-center"
              >
                <Form {...formItemLayout} className="gx-pt-4">
                  <Form.Item>
                    <Checkbox onChange={checkboxChange}>
                      Apply to multiple fields
                    </Checkbox>
                  </Form.Item>
                  {checked && (
                    <>
                      <Form.Item label="Party Name">
                        {getFieldDecorator("partyId", {
                          rules: [
                            {
                              required: true,
                              message: "Please select party name!",
                            },
                          ],
                        })(
                          <Select
                            id="partyId"
                            showSearch
                            mode="multiple"
                            style={{ width: "100%" }}
                          >
                            {props.party?.partyList?.map((party) => (
                              <Option key={party.nPartyId} value={party.nPartyId}>
                                {party.partyName}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                      <Form.Item label="Material Type">
                        {getFieldDecorator("materialType", {
                          rules: [
                            {
                              required: true,
                              message: "Please select material type!",
                            },
                          ],
                        })(
                          <Select
                            id="materialType"
                            showSearch
                            mode="multiple"
                            style={{ width: "100%" }}
                            onChange={handleMaterialTypeChange}
                          >
                            {props.material?.materialList?.map((material) => (
                              <Option key={material.matId} value={material.matId}>
                                {material?.description}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                      <Form.Item label="Material Grade">
                        {getFieldDecorator("matGradeId", {
                          rules: [
                            {
                              required: true,
                              message: "Please select material grade!",
                            },
                          ],
                        })(
                          <Select
                            id="matGradeId"
                            mode="multiple"
                            style={{ width: "100%" }}
                          >
                            {gradeList?.map((material) => (
                              <Option key={material.gradeId} value={material.gradeId}>
                                {material.gradeName}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    </>
                  )}
                  {!checked && (
                    <Form.Item label="Party Name">
                      {getFieldDecorator("partyId", {
                        rules: [
                          {
                            required: true,
                            message: "Please enter Party name!",
                          },
                        ],
                      })(
                        <Select
                          showSearch
                          style={{ width: 300 }}
                          placeholder="Select a Party"
                        >
                          {props.party?.partyList?.map((party) => (
                            <Option key={party.nPartyId} value={party.nPartyId}>
                              {party.partyName}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  )}
                  <Form.Item label="Process Name">
                    {getFieldDecorator("processId", {
                      rules: [
                        {
                          required: true,
                          message: "Please enter Process name!",
                        },
                      ],
                    })(
                      <Select
                        showSearch
                        style={{ width: 300 }}
                        placeholder="Select a Process"
                      >
                        {props.process?.processList?.map((process) => (
                          <Option key={process.processId} value={process.processId}>
                            {process.processName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  {!checked && (
                    <Form.Item label="Material Type">
                      {getFieldDecorator("materialType", {
                        rules: [
                          {
                            required: true,
                            message: "Please enter material Type!",
                          },
                        ],
                      })(
                        <Select
                          showSearch
                          value={type}
                          style={{ width: 300 }}
                          placeholder="Select a Material"
                          onChange={handleMaterialTypeChange}
                        >
                          {props.material?.materialList?.map((material) => (
                            <Option key={material.matId} value={material.matId}>
                              {material?.description}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  )}
                  {!checked && (
                    <Form.Item label="Material Grade">
                      {getFieldDecorator("matGradeId", {
                        rules: [
                          { required: true, message: "Please enter grade!" },
                        ],
                      })(
                        <Select
                          showSearch
                          mode='multiple'
                          style={{ width: 300 }}
                          placeholder="Select a Grade"
                        >
                          {gradeList?.map((material) => (
                            <Option key={material.gradeId} value={material.gradeId}>
                              {material.gradeName}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  )}
                  <Form.Item label="Minimum Thickness">
                    {getFieldDecorator("thicknessFrom", {
                      rules: [
                        {
                          required: true,
                          message: "Please input the minimum thickness!",
                        },
                      ],
                    })(<Input id="thicknessFrom" />)}
                  </Form.Item>
                  <Form.Item label="Maximum Thickness">
                    {getFieldDecorator("thicknessTo", {
                      rules: [
                        {
                          required: true,
                          message: "Please input the maximum thickness!",
                        },
                      ],
                    })(<Input id="thicknessTo" />)}
                  </Form.Item>
                  <Form.Item label="Thickness Rate">
                    {getFieldDecorator("price", {
                      rules: [
                        {
                          required: true,
                          message: "Please input the thickness rate!",
                        },
                      ],
                    })(<Input id="price" />)}
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Card>
        </Modal>

        <Modal
          title="Packing Rates Details"
          visible={viewPackingRate}
          onOk={() => setViewPackingRate(false)}
          onCancel={() => setViewPackingRate(false)}
        >
          <Card className="gx-card">
            <Row>
              <Col span={24}>
                <Card>
                  <p>
                    <strong>Bucket Name:</strong> {viewPackingRateData?.packingBucketName}
                  </p>
                  <p>
                    <strong>Party Name:</strong>{" "}
                    {viewPackingRateData?.partyName}
                  </p>
                  <p>
                    <strong>Packing Rate:</strong>{" "}
                    {viewPackingRateData?.packingRate}
                  </p>
                  <p>
                    <strong>Description:</strong> {viewPackingRateData?.packingRateDesc}
                  </p>
                </Card>
              </Col>
            </Row>
          </Card>
        </Modal>

        <Modal
          title={editPackingRates ? "Edit Packing Rates" : "Add Packing Rates"}
          visible={showAddPackingRates}
          onOk={(e) => {
            e.preventDefault();
            if (editPackingRates) {
              const values = props.form.getFieldsValue();
              console.log('Received values of form: ', values);
              if (values.packingBucketId !== '' && values.rPartyId !== '' && values.packingRate !== '' && values.packingRateDesc !== '') {
                const packingRateId = props?.packingRates?.packingRateId;
                props.updatePackingRates({ ...values, packingRateId });
                setEditPackingRates(false);
                setShowAddPackingRates(false);
              }
            } else {
              const values = props.form.getFieldsValue();
              console.log('Received values of form: ', values);
              if (values.packingBucketId !== '' && values.rPartyId !== '' && values.packingRate !== '' && values.packingRateDesc !== '') {
                props.addPackingRates(values);
                setShowAddPackingRates(false);
              }
            }
            props.form.resetFields();
          }}
          width={600}
          onCancel={() => {
            props.form.resetFields();
            setShowAddPackingRates(false);
            setEditPackingRates(false);
          }}
        >
          <Card className="gx-card">
            <Row>
              <Col
                lg={24}
                md={24}
                sm={24}
                xs={24}
                className="gx-align-self-center"
              >
                <Form {...formItemLayout} className="gx-pt-4">
                <Form.Item label="Bucket Id">
                    {getFieldDecorator('packingBucketId', {
                        rules: [{ required: true, message: 'Please select Items' }],
                    })(
                        <Select
                        id="packingItem"
                        showSearch
                        style={{ width: '100%' }}
                        filterOption={(input, option) => {
                            return option?.props?.children?.toLowerCase().includes(input.toLowerCase());
                        }}
                        filterSort={(optionA, optionB) =>
                            optionA?.props?.children.toLowerCase().localeCompare(optionB?.props?.children.toLowerCase())
                        }
                        >{props?.packing?.bucketList?.map(item => {
                            return <Option key={item?.bucketId} value={item?.bucketId}>{item?.packingBucketId}</Option>
                        })}</Select>
                    )}
                </Form.Item>
                <Form.Item label="Party Name">
                  {getFieldDecorator("rPartyId", {
                    rules: [{
                        required: true,
                        message: "Please select party name!",
                      }],
                  })(
                    <Select
                      id="partyId"
                      showSearch
                      style={{ width: "100%" }}
                      filterOption={(input, option) => {
                        return option?.props?.children?.toLowerCase().includes(input.toLowerCase());
                      }}
                      filterSort={(optionA, optionB) =>
                        optionA?.props?.children.toLowerCase().localeCompare(optionB?.props?.children.toLowerCase())
                      }
                    >
                      {props.party?.partyList?.map((party) => (
                        <Option key={party.nPartyId} value={party.nPartyId}>
                          {party.partyName}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="Packing Rate" >
                      {getFieldDecorator('packingRate', {
                          rules: [{ required: true, message: 'Please enter rate' }],
                          })(
                          <Input id="packingRate" />
                      )}
                  </Form.Item>
                  <Form.Item label="Description" >
                      {getFieldDecorator('packingRateDesc', {
                          rules: [{ required: true, message: 'Please enter description' }],
                          })(
                          <Input id="packingRateDesc" />
                      )}
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Card>
        </Modal>
      {/* Lamination Charges */}
      <Modal
          title="Lamination Charges Details"
          visible={viewLaminationCharges}
          onOk={() => setViewLaminationCharges(false)}
          onCancel={() => setViewLaminationCharges(false)}
          width={700}
        >
          <Card className="gx-card">
            <Row>
              <Col span={24}>
                <Card>
                <p>
                    <strong>Party Name:</strong>{" "}
                    {viewLaminationChargesData?.partyName}
                  </p>
                  <p>
                    <strong>Lamination Details Name:</strong> {" "} 
                    {viewLaminationChargesData?.laminationDetailsDesc}
                  </p>
                  <p>
                    <strong>Lamination Charges:</strong> {" "} 
                    {viewLaminationChargesData?.charges}
                  </p>
                </Card>
              </Col>
            </Row>
          </Card>
        </Modal>

      <Modal
          title={editLaminationCharges ? "Edit Lamination Charges" : "Add Lamination Charges"}
          visible={showAddLaminationCharges}
          onOk={(e) => {
            e.preventDefault();
            if (editLaminationCharges) {
              const values = props.form.getFieldsValue();
              console.log('Received values of form: ', values);
               if (values.laminationDetailsId !== '' && values.lPartyId !== '' && values.charges !== '') {
                 const laminationId = props?.rates?.laminationCharges?.laminationId;
                 props.updateLminationCharges({...values, laminationId});
                setEditLaminationCharges(false);
                setShowAddLaminationCharges(false);
               }
            } else {
              const values = props.form.getFieldsValue();
              console.log('Received values of form: ', values);

              if (values.laminationDetailsId !== '' && values.lPartyId !== '' && values.charges !== '') {
                props.addLminationCharges(values);
                setShowAddLaminationCharges(false);
               }
            }
            props.form.resetFields();
          }}
          width={750}
          onCancel={() => {
            props.form.resetFields();
            setShowAddLaminationCharges(false);
            setEditLaminationCharges(false);
          }}
        >
          <Card className="gx-card">
            <Row>
              <Col
                lg={24}
                md={24}
                sm={24}
                xs={24}
                className="gx-align-self-center"
              >
                <Form {...formItemLayout} className="gx-pt-4">
                <Form.Item label="Party Name">
                  {getFieldDecorator("lPartyId", {
                    rules: [{
                        required: true,
                        message: "Please select party name!",
                      }],
                  })(
                    <Select
                      id="lPartyId"
                      showSearch
                     // mode='multiple'
                      style={{ width: "100%" }}
                      filterOption={(input, option) => {
                        return option?.props?.children?.toLowerCase().includes(input.toLowerCase());
                      }}
                      filterSort={(optionA, optionB) =>
                        optionA?.props?.children.toLowerCase().localeCompare(optionB?.props?.children.toLowerCase())
                      }
                    >
                      {props.party?.partyList?.map((party) => (
                        <Option key={party.nPartyId} value={party.nPartyId}>
                          {party.partyName}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>

                <Form.Item label="Select Lamination Details">
                  {getFieldDecorator("laminationDetailsId", {
                    rules: [{
                        required: true,
                        message: "Please select lamination!",
                      }],
                  })(
                    <Select
                      id="laminationDetailsId"
                      showSearch
                     // mode='multiple'
                      style={{ width: "100%" }}
                      onChange={handleDropdownChange}
                      value={selectedOption}
                      filterOption={(input, option) => {
                        return option?.props?.children?.toLowerCase().includes(input.toLowerCase());
                      }}
                      filterSort={(optionA, optionB) =>
                        optionA?.props?.children.toLowerCase().localeCompare(optionB?.props?.children.toLowerCase())
                      }
                    >
                       {laminationDD.map((option) => (
                          <option key={option.laminationDetailsId} value={option.laminationDetailsId}>
                            {option.laminationDetailsDesc}
                          </option>
                        ))}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="Lamination Charges" >
                      {getFieldDecorator('charges', {
                          rules: [{ required: true, message: 'Please enter charges' }],
                          })(
                          <Input id="charges" />
                      )}
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Card>
        </Modal>

        {showAdditionalRates && (
          <AdditionalRates
            form={props.form}
            showAdditionalRates={showAdditionalRates}
            setShowAdditionalRates={(w) => setShowAdditionalRates(w)}
          />
        )}
        <EditAdditionalRates
          editPriceModal={editPriceModal}
          setEditPriceModal={(w) => setEditPriceModal(w)}
          {...props}
        />
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => ({
  rates: state.rates,
  material: state.material,
  party: state.party,
  process: state.process,
  aRates: state.rates.additionalRates,
  packing: state.packing,
  packingRates: state.rates.packingRates,
  laminationCharges: state.rates.laminationChargesList,
  laminationChargesView: state.rates.laminationChargesById
});

const addRatesForm = Form.create({
  mapPropsToFields(props) {
    return {
      partyId: Form.createFormField({
        ...props.rates?.rates?.partyId,
        value: props.rates?.rates?.partyId || undefined,
      }),
      processId: Form.createFormField({
        ...props.rates?.rates?.processId,
        value: props.rates?.rates?.processId || undefined,
      }),
      materialType: Form.createFormField({
        ...props.rates?.rates?.matId,
        value: props.rates?.rates?.matId || undefined,
      }),
      matGradeName: Form.createFormField({
        ...props.rates?.rates?.matGradeName,
        value: props.rates?.rates?.matGradeName || undefined,
      }),
      matGradeId: Form.createFormField({
        ...props.rates?.rates?.matGradeId,
        value: props.rates?.rates?.matGradeId || undefined,
      }),
      thicknessFrom: Form.createFormField({
        ...props.rates?.rates?.thicknessFrom,
        value: props.rates?.rates?.thicknessFrom || "",
      }),
      thicknessTo: Form.createFormField({
        ...props.rates?.rates?.thicknessTo,
        value: props.rates?.rates?.thicknessTo || "",
      }),
      price: Form.createFormField({
        ...props.rates?.rates?.price,
        value: props.rates?.rates?.price || "",
      }),
      // packagingCharges: Form.createFormField({
      //     ...props.rates?.rates?.packagingCharges,
      //     value: props.rates?.rates?.packagingCharges || '',
      // }),
      // laminationCharges: Form.createFormField({
      //     ...props.rates?.rates?.laminationCharges,
      //     value: props.rates?.rates?.laminationCharges || '',
      // }),
      aPartyId: Form.createFormField({
        ...props.aRates?.partyId,
        value: props.aRates?.partyId || undefined,
      }),
      aProcessId: Form.createFormField({
        ...props.aRates?.processId,
        value: props.aRates?.processId || undefined,
      }),
      rangeFrom: Form.createFormField({
        ...props.aRates?.rangeFrom,
        value: props.aRates?.rangeFrom || "",
      }),
      rangeTo: Form.createFormField({
        ...props.aRates?.rangeTo,
        value: props.aRates?.rangeTo || "",
      }),
      aPrice: Form.createFormField({
        ...props.aRates?.price,
        value: props.aRates?.price || "",
      }),
      packingBucketId: Form.createFormField({
        ...props.packingRates?.packingBucketId,
        value: props.packingRates?.packingBucketId || "",
      }),
      rPartyId: Form.createFormField({
        ...props.packingRates?.partyId,
        value: props.packingRates?.partyId || "",
      }),
      packingRate: Form.createFormField({
        ...props.packingRates?.packingRate,
        value: props.packingRates?.packingRate || "",
      }),
      packingRateDesc: Form.createFormField({
        ...props.packingRates?.packingRateDesc,
        value: props.packingRates?.packingRateDesc || "",
      }),
      lPartyId: Form.createFormField({
        ...props.laminationChargesView?.partyId,
        value: props.laminationChargesView?.partyId || "",
      }),
      laminationDetailsId: Form.createFormField({
        ...props.laminationChargesView?.laminationDetailsId,
        value: props.laminationChargesView?.laminationDetailsId || "",
      }),
      charges: Form.createFormField({
        ...props.laminationChargesView?.charges,
        value: props.laminationChargesView?.charges || "",
      }),
      laminationId: Form.createFormField({
        ...props.laminationChargesView?.laminationId,
        value: props.laminationChargesView?.laminationId || "",
      }),
      laminationDetailsDesc: Form.createFormField({
        ...props.laminationChargesView?.laminationDetailsDesc,
        value: props.laminationChargesView?.laminationDetailsDesc || "",
      }),
    };
  },
})(Rates);

export default connect(mapStateToProps, {
  fetchRatesList,
  fetchPackingRatesList,
  fetchPartyList,
  fetchMaterialList,
  fetchProcessList,
  addRates,
  addPackingRates,
  fetchRatesListById,
  fetchPackingRatesById,
  updateRates,
  updatePackingRates,
  resetRates,
  resetPackingRates,
  deleteRates,
  deleteAdditionalRates,
  getStaticList,
  fetchAdditionalPriceList,
  fetchAdditionalPriceListById,
  fetchPackingBucketList,
  getLaminationChargesList,
  getLaminationChargesById,
  addLminationCharges,
  updateLminationCharges,
  deleteLminationCharges,
  resetLaminationChargesRequest
})(addRatesForm);
