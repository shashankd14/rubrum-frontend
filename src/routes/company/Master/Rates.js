import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
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
  fetchPackingBucketList
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
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [searchValue, setSearchValue] = useState("");
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
    props.rates?.ratesList || []
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
      title: "Material description",
      dataIndex: "matGradeName",
      key: "matGradeName",
      filters: [],
      sorter: (a, b) => a.matGradeName - b.matGradeName,
      sortOrder: sortedInfo.columnKey === "matGradeName" && sortedInfo.order,
    },
    {
      title: "Thickness Range",
      dataIndex: "thicknessFrom",
      render: (text, record, index) =>
        record.thicknessFrom + "-" + record.thicknessTo,
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

  const onView = (record, e) => {
    e.preventDefault();
    if (tabKey === "1") {
      setViewMaterialData(record);
      setViewMaterial(true);
    } else if (tabKey === "3") {
      setViewPackingRateData(record);
      setViewPackingRate(true);
    } else {
      setViewMaterialData(record);
      setViewAdditionalRates(true);
    }
  };

  const onDelete = (record, e) => {
    e.preventDefault();
    if (tabKey === "1") {
      props.deleteRates(record?.id);
    } else {
      props.deleteAdditionalRates(record?.id);
    }
  };
  const onEdit = (record, e) => {
    e.preventDefault();
    if (tabKey === "1") {
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
  }, []);

  useEffect(() => {
    props.fetchRatesList();
  }, [showAddRates]);

  useEffect(() => {
    props.fetchPackingRatesList();
  }, [showAddPackingRates]);

  useEffect(() => {
    const { ratesList } = props.rates;

    setFilteredInwardList(ratesList);
  }, [props.rates.ratesList]);

  useEffect(() => {
    const { packingRateList } = props.rates;

    setfilteredPackingRateList(packingRateList)
  }, [props.rates.packingRateList]);

  useEffect(() => {
    if (props.rates.loading) {
      message.loading("Loading..");
    }
  }, [props.rates.loading]);

  useEffect(() => {
    if (props.rates.addSuccess || props.rates.deleteSuccess) {
      props.fetchRatesList();
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

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    setFilteredInfo(filters);
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
      console.log("record", record, selectedRows);
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
          </div>
          <div className="gx-flex-row gx-w-50">
            {tabKey === "2" && (
              <Button
                type="primary"
                icon={() => <i className="icon icon-add" />}
                size="medium"
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
                size="medium"
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
                size="medium"
                onClick={() => {
                  props.resetPackingRates();
                  props.form.resetFields();
                  setShowAddPackingRates(true);
                }}
              >
                Add Packing Rates
              </Button>
            )}
            <SearchBox
              styleName="gx-flex-1"
              placeholder="Search for process name or material or party name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
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
                <Option value={party.nPartyId}>{party.partyName}</Option>
              ))}
            </Select>
            <Select
              style={{ width: 300 }}
              className="additional_price_select"
              placeholder="Select a Process"
              onChange={handleProcessChange}
            >
              {props.process?.processList?.map((process) => (
                <Option value={process.processId}>
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
                    <Option value={item.id}>{item.priceDesc}</Option>
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
            <Table rowSelection={[]}
              className="gx-table-responsive"
              columns={packingRateColumn}
              dataSource={filteredPackingRateList}
              onChange={handleChange}
              />
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
                const data = { values, id: props.rates?.rates?.id };
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
                            mode="multiple"
                            style={{ width: "100%" }}
                          >
                            {props.party?.partyList?.map((party) => (
                              <Option value={party.nPartyId}>
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
                            mode="multiple"
                            style={{ width: "100%" }}
                            onChange={handleMaterialTypeChange}
                          >
                            {props.material?.materialList?.map((material) => (
                              <Option value={material.matId}>
                                {material.description}
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
                              <Option value={material.gradeId}>
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
                            <Option value={party.nPartyId}>
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
                          <Option value={process.processId}>
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
                            <Option value={material.matId}>
                              {material.description}
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
                          style={{ width: 300 }}
                          placeholder="Select a Grade"
                        >
                          {gradeList?.map((material) => (
                            <Option value={material.gradeId}>
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
                          message: "Please input the GST Number!",
                        },
                      ],
                    })(<Input id="thicknessFrom" />)}
                  </Form.Item>
                  <Form.Item label="Maximum Thickness">
                    {getFieldDecorator("thicknessTo", {
                      rules: [
                        {
                          required: true,
                          message: "Please input the GST Number!",
                        },
                      ],
                    })(<Input id="thicknessTo" />)}
                  </Form.Item>
                  <Form.Item label="Thickness Rate">
                    {getFieldDecorator("price", {
                      rules: [
                        {
                          required: true,
                          message: "Please input the GST Number!",
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
                            return <Option value={item?.bucketId}>{item?.packingBucketId}</Option>
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
                        <Option value={party.nPartyId}>
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
  packingRates: state.rates.packingRates
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
      matGradeId: Form.createFormField({
        ...props.rates?.rates?.matGradeName,
        value: props.rates?.rates?.matGradeName || undefined,
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
  fetchPackingBucketList
})(addRatesForm);
