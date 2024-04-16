import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
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
} from 'antd';
import moment from 'moment';
import SearchBox from '../../../components/SearchBox';

import IntlMessages from '../../../util/IntlMessages';
import {
  fetchYLRList,
  fetchMaterialList,
  addYLR,
  fetchYLRbyId,
  updateYLR,
  resetYLR,
  fetchClassificationList,
  fetchPartyList,
  deleteYLR
} from '../../../appRedux/actions';
import { onDeleteContact } from '../../../appRedux/actions';

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

const YieldLoss = (props) => {
  const [sortedInfo, setSortedInfo] = useState({
    order: 'descend',
    columnKey: 'age',
  });
  const { getFieldDecorator, getFieldValue, getFieldProps } = props.form;
  getFieldDecorator('keys', { initialValue: [0] });
  const [showAddYLR, setShowAddYLR] = useState(false);
  const [viewYLR, setViewYLR] = useState(false);
  const [editYLR, setEditYLR] = useState(false);
  const [viewYLRData, setViewYLRData] = useState({});
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [filteredYLRList, setFilteredYLRList] = useState(
    props.yieldLossRatio?.YLRList?.content || []
  );
  const [pageNo, setPageNo] = React.useState(1);
  const [totalPageItems, setTotalItems] = React.useState(0);
  const [customerValue, setCustomerValue] = useState("");
  const [pageSize, setPageSize] = useState(15);

  const keys = getFieldValue('keys');
  const Option = Select.Option;

  const columns = [
    {
      title: 'YLR Id',
      dataIndex: 'ylrId',
      key: 'ylrId',
      filters: [],
      sorter: (a, b) => {
        return a.ylrId - b.ylrId;
      },
      sortOrder: sortedInfo.columnKey === 'ylrId' && sortedInfo.order,
    },
    {
      title: 'Party Name',
      dataIndex: 'partyName',
      key: 'partyName',
      filters: [],
      sorter: (a, b) => {
        return a.partyName - b.partyName;
      },
      sortOrder: sortedInfo.columnKey === 'partyName' && sortedInfo.order,
    },
    {
      title: 'Process Name',
      dataIndex: 'processName',
      key: 'processName',
      filters: [],
      sorter: (a, b) => {
        return a.processName - b.processName;
      },
      sortOrder: sortedInfo.columnKey === 'processName' && sortedInfo.order,
    },

    {
      title: 'Range',
      dataIndex: "lossRatioPercentageFrom",
      render: (text, record, index) => record.lossRatioPercentageFrom + "-" + record.lossRatioPercentageTo,
      // dataIndex: 'description',
      // key: 'description',
      // filteredValue: filteredInfo ? filteredInfo['description'] : null,
      // filters: [
      //   ...new Set(props.material.materialList.map((item) => item.description)),
      // ].map((material) => {
      //   return { text: material || '', value: material || '' };
      // }),
      // onFilter: (value, record) => record.description == value,
      // sorter: (a, b) => a.description?.length - b.description?.length,
      // sortOrder: sortedInfo.columnKey === 'description' && sortedInfo.order,
    },
    {
      title: 'Comment',
      dataIndex: 'comments',
      key: 'comments',
      filters: [],
      sorter: (a, b) => {
        return a.comments - b.comments;
      },
      sortOrder: sortedInfo.columnKey === 'comments' && sortedInfo.order,
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text, record, index) => (
        <span>
          <span className='gx-link' onClick={(e) => onView(record, e)}>
            View
          </span>
          <Divider type='vertical' />
          <span className='gx-link' onClick={(e) => onEdit(record, e)}>
            Edit
          </span>
          <Divider type='vertical' />
          <span className='gx-link' onClick={(e) => onDelete(record, e)}>
            Delete
          </span>
        </span>
      ),
    },
  ];

  const onView = (record, e) => {
    e.preventDefault();
    setViewYLRData(record);
    setViewYLR(true);
  };

  const onDelete = (record, key, e) => {
    props.deleteYLR({
      ids: record.ylrId,
        ipAddress: '1.1.1.1',
        requestId: "YLR_MASTER_DELETE",
        userId: ''
    });
  };
  const onEdit = (record, e) => {
    e.preventDefault();
    props.fetchYLRbyId({
      ylrId: record.ylrId,
      pageNo: 1,
      pageSize: 15,
      ipAddress: '',
      requestId: "YLR_MASTER_GET_BY_ID",
      userId: ''
    });
    setEditYLR(true);
    setTimeout(() => {
      setShowAddYLR(true);
    }, 1000);
  };

  useEffect(() => {
    setTimeout(() => {
      props.fetchYLRList({
        pageNo: "1",
        pageSize: "25",
        partyId: "",
        ipAddress: "",
        requestId: "YLR_MASTER_GET",
        userId: ""
    });
      props.fetchMaterialList();
      props.fetchPartyList();
      props.fetchClassificationList();
    }, 1000);
  }, [showAddYLR]);

  useEffect(() => {
    const { loading, error, YLRList } = props.yieldLossRatio;
    if (!loading && !error) {
      setFilteredYLRList(YLRList.content);
    }
  }, [props.yieldLossRatio]);

  // useEffect(() => {
  //   const { ylr } = props;
  //   if (searchValue) {
  //     const filteredData = ylr?.YLRList?.filter((material) => {
  //       if (
  //         material.processName.toString() === searchValue ||
  //         material.processName
  //           ?.toLowerCase()
  //           .includes(searchValue.toLowerCase()) ||
  //         material.materialGrade?.includes(searchValue)
  //       ) {
  //         return material;
  //       }
  //     });
  //     setFilteredYLRList(filteredData);
  //   } else {
  //     setFilteredYLRList(ylr?.YLRList?.content);
  //   }
  // }, [searchValue]);

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    setFilteredInfo(filters);
  };

  const clearFilters = () => {
    setFilteredInfo(null);
  };

  const clearAll = () => {
    setSortedInfo(null);
    setFilteredInfo(null);
  };

  const exportSelectedData = () => {};

  const deleteSelectedCoils = () => {
    console.log('dfd');
  };

  const addNewKey = (idx) => {
    const { form } = props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(idx + 1);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  const removeKey = (k) => {
    const { form } = props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter((key, idx) => idx !== k),
    });
  };

  const handleSelectChange = (e) => {
    console.log(e);
  };

  const [selectedParty, setSelectedParty] = useState('');
  const [selectedProcessId, setSelectedProcessId] = useState('');
  const handleProcessChange = (e) => {
    if (e?.target?.name === 'partyName') {
      setSelectedParty(e.target.value);
    } else {
      props.getStaticList(e);
      setSelectedProcessId(e);
    }
  };
  const handlePartyChange = (e) => {
    setSelectedParty(e);
  };

  const handleCustomerChange = (partyId) => {
    if (partyId) {
      // setCustomerValue(partyId);
      setPageNo(1);
      props.fetchYLRList({
        pageNo: "1",
        pageSize: "25",
        partyId: partyId,
        ipAddress: "",
        requestId: "YLR_MASTER_GET",
        userId: ""
    });
    } else {
      setCustomerValue("");
      setFilteredYLRList(filteredYLRList);
    }
  };

  return (
    <div>
      <h1>
        <IntlMessages id='sidebar.company.yieldLossList' />
      </h1>
      <Card>
        <div className='gx-flex-row gx-flex-1'>
          <div className='table-operations gx-col'>
          <Select
              id="select"
              showSearch
              style={{ width: 250, paddingTop: '-50px' }}
              placeholder="Select a customer"
              optionFilterProp="children"
              onChange={handleCustomerChange}
              // value={customerValue}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              >
              {props.party?.partyList?.map((party) => (
                <Option key={party.nPartyId} value={party.nPartyId}>
                  {party.partyName}
                </Option>
              ))}
            </Select>&emsp;
            <Button onClick={exportSelectedData}>Export</Button>
            <Button onClick={clearFilters}>Clear All filters</Button>
          </div>
          <div className='gx-flex-row gx-w-50'>
            <Button
              type='primary'
              icon={() => <i className='icon icon-add' />}
              size='default'
              onClick={() => {
                props.form.resetFields();
                props.resetYLR();
                setShowAddYLR(true);
              }}
            >
              Add Yield Loss
            </Button>
            {/* <SearchBox
              styleName='gx-flex-1'
              placeholder='Search for yield loss...'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            /> */}
          </div>
        </div>
        
        <Table
          rowSelection={[]}
          className='gx-table-responsive'
          columns={columns}
          dataSource={filteredYLRList}
          onChange={handleChange}
          // pagination={{
          //   pageSize: 15,
          //   onChange: (page) => {
          //     setPageNo(page);
          //     props.fetchInwardList(page, pageSize, searchValue, customerValue);
          //   },
          //   current: pageNo,
          //   total: totalPageItems,
          // }}
        />

        <Modal
          title='Yield Loss Ratio Details'
          visible={viewYLR}
          onCancel={() => setViewYLR(false)}
          onOk={() => setViewYLR(false)}
          width={600}
        >
          <Card>
            <Row>
              <Col span={24}>
                <Card>
                <p><strong>Party Name :</strong> {viewYLRData?.partyName}</p>
                <p><strong>Process Name :</strong> {viewYLRData?.processName}</p>
                <p><strong>Loss Ratio from :</strong> {viewYLRData?.lossRatioPercentageFrom}</p>
                <p><strong>Loss Ratio to :</strong> {viewYLRData?.lossRatioPercentageTo}</p>
                <p><strong>Comment :</strong> {viewYLRData?.comments}</p>
                </Card>
              </Col>
            </Row>
          </Card>
        </Modal>

        <Modal
          title={editYLR ? 'Edit yield loss ratio' : 'Add yield loss ratio'}
          visible={showAddYLR}
          onOk={(e) => {
            e.preventDefault();
            if (editYLR) {
              props.form.validateFields((err, values) => {
                if (!err) {
                  console.log('Received values of form: ', values);
                  const data = { values, ylrId: props.yieldLossRatio?.YLR?.ylrId };
                  props.updateYLR(data);
                  props.form.resetFields();
                  setEditYLR(false);
                  setShowAddYLR(false);
                }
              });
              props.form.resetFields();
            } else {
              props.form.validateFields((err, values) => {
                if (!err) {
                  console.log('Received values of form: ', values);
                  props.addYLR(values);
                  setShowAddYLR(false);
                }
              });
              props.form.resetFields();
            }
          }}
          width={700}
          onCancel={() => {
            props.resetYLR();
            props.form.resetFields();
            setShowAddYLR(false);
            setEditYLR(false);
          }}
        >
          <Card className='gx-card'>
            <Row>
              <Col
                lg={24}
                md={24}
                sm={24}
                xs={24}
                className='gx-align-self-center'
              >
                <Form {...formItemLayout} className='gx-pt-4'>
                  <Form.Item label='Party Name'>
                    {getFieldDecorator('partyIdList', {
                      rules: [
                        {
                          required: true,
                          message: 'Please select party name!',
                        },
                      ],
                    })(
                      <Select
                        id='partyId'
                        showSearch
                        mode='multiple'
                        placeholder='Select customer'
                        style={{ width: '100%' }}
                        filterOption={(input, option) => {
                          return option?.props?.children
                            ?.toLowerCase()
                            .includes(input.toLowerCase());
                        }}
                        filterSort={(optionA, optionB) =>
                          optionA?.props?.children
                            .toLowerCase()
                            .localeCompare(
                              optionB?.props?.children.toLowerCase()
                            )
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

                  <Form.Item label='Process Tags'>
                    {getFieldDecorator('tags', {
                      rules: [
                        { required: true, message: 'Please enter Tags!' },
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

                  {keys.map((k, index) => {
                    return (
                      <div key={k}>
                        <Form.Item label='Range from'>
                          {getFieldDecorator(`lossRatioPercentageFrom[${index}]`, {
                            initialValue: props.yieldLossRatio.YLR?.lossRatioPercentageFrom,
                            rules: [
                              {
                                required: true,
                                message: 'Please enter range!',
                              },
                            ],
                          })(<Input id={`lossRatioPercentageFrom${index}`} {...getFieldProps} />)}
                        </Form.Item>
                        <Form.Item label='Range to'>
                          {getFieldDecorator(`lossRatioPercentageTo[${index}]`, {
                            initialValue:props.yieldLossRatio.YLR?.lossRatioPercentageTo || '',
                            rules: [
                              {
                                required: true,
                                message: 'Please enter range!',
                              },
                            ],
                          })(
                            <Input id={`lossRatioPercentageTo${index}`} {...getFieldProps} />
                          )}
                        </Form.Item>
                        <Form.Item label='Comment'>
                          {getFieldDecorator(`comments[${index}]`, {
                            initialValue: props.yieldLossRatio.YLR?.comments || '',
                            rules: [
                              {
                                required: true,
                                message: 'Please enter comment!',
                              },
                            ],
                          })(
                            <Input id={`comments${index}`} {...getFieldProps} />
                          )}
                        </Form.Item>
                        <div style={{ marginLeft: '200px' }}>
                          {keys.length - 1 > 0 && (
                            <i
                              className='icon icon-trash gx-margin'
                              onClick={() => removeKey(index)}
                            />
                          )}
                          {index === keys.length - 1 && (
                            <i
                              className='icon icon-add-circle gx-margin'
                              onClick={() => addNewKey(index)}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </Form>
              </Col>
            </Row>
          </Card>
        </Modal>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => ({
  yieldLossRatio: state.yieldLossRatio,
  material: state.material,
  party: state.party,
  packetClassification: state.packetClassification,
  process: state.process
});

const addYieldLossForm = Form.create({
  mapPropsToFields(props) {
    return {
      partyIdList:Form.createFormField ({
        ...props.yieldLossRatio?.YLR?.partyId,
        value: props.yieldLossRatio.YLR.partyId || [],
       }),
       tags: Form.createFormField({
        ...props.yieldLossRatio?.YLR?.processId,
        value: props.yieldLossRatio?.YLR?.processId || [],
      }),
      lossRatioPercentageFrom: Form.createFormField({
        ...props.yieldLossRatio?.YLR?.lossRatioPercentageFrom,
        value: props.yieldLossRatio?.YLR?.lossRatioPercentageFrom || '',
      }),
      lossRatioPercentageTo: Form.createFormField({
        ...props.yieldLossRatio?.YLR?.lossRatioPercentageTo,
        value: props.yieldLossRatio?.YLR?.lossRatioPercentageTo || '',
      }),
      comments: Form.createFormField({
        ...props.yieldLossRatio?.YLR?.comments,
        value: props.yieldLossRatio?.YLR?.comments || '',
      }),
    };
  },
})(YieldLoss);

export default connect(mapStateToProps, {
  fetchYLRList,
  fetchMaterialList,
  addYLR,
  fetchYLRbyId,
  updateYLR,
  resetYLR,
  fetchClassificationList,
  fetchPartyList,
  deleteYLR
})(addYieldLossForm);
