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
  addMaterial,
  fetchMaterialListById,
  updateMaterial,
  resetMaterial,
  fetchClassificationList,
  fetchPartyList,
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
  const [viewMaterial, setViewMaterial] = useState(false);
  const [editMaterial, setEditMaterial] = useState(false);
  const [viewMaterialData, setViewMaterialData] = useState({});
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [filteredYLRList, setFilteredYLRList] = useState(
    props.yieldLossRatio?.YLRList || []
  );
console.log("1111111111", props)
console.log("22222", props.yieldLossRatio)
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
          <span className='gx-link' onClick={() => {}}>
            Delete
          </span>
        </span>
      ),
    },
  ];

  const onView = (record, e) => {
    e.preventDefault();
    setViewMaterialData(record);
    setViewMaterial(true);
  };

  const onDelete = (record, key, e) => {
    let id = [];
    id.push(record.inwardEntryId);
    e.preventDefault();
    props.deleteInwardEntryById(id);
    console.log(record, key);
  };
  const onEdit = (record, e) => {
    e.preventDefault();
    props.fetchMaterialListById(record.matId);
    setEditMaterial(true);
    setTimeout(() => {
      setShowAddYLR(true);
    }, 1000);
  };

  useEffect(() => {
    debugger
    console.log('showAddYLR:', showAddYLR);
    setTimeout(() => {
      props.fetchYLRList({
        pageNo: "1",
        pageSize: "15",
        partyId: "",
        ipAddress: "1.1.1.1",
        requestId: "YLR_MASTER_GET",
        userId: ""
    });
      // props.fetchMaterialList();
      // props.fetchPartyList();
      // props.fetchClassificationList();
    }, 1000);
  }, [showAddYLR]);

  // const dispatch = useDispatch();
  // useEffect(() => {
  //   debugger
  //   console.log('showAddYLR:', showAddYLR);
  //   props.fetchYLRList();
  //   setTimeout(() => {
  //     console.log('Calling fetchYLRList...');
  //     dispatch(fetchYLRList({
  //       pageNo: 1,
  //       pageSize: 15,
  //       partyId: '',
  //       ipAddress: "1.1.1.1",
  //       requestId: "YLR_MASTER_GET",
  //       userId: ""
  //     }));
  //   }, 1000);
  // }, []); 

  useEffect(() => {
    const { loading, error, YLRList } = props.yieldLossRatio;
    if (!loading && !error) {
      setFilteredYLRList(YLRList);
    }
  }, [props.yieldLossRatio]);
  console.log("filteredYLR", filteredYLRList);

  // useEffect(() => {
  //   const { material } = props;
  //   if (searchValue) {
  //     const filteredData = material?.materialList?.filter((material) => {
  //       if (
  //         material.matId.toString() === searchValue ||
  //         material.description
  //           ?.toLowerCase()
  //           .includes(searchValue.toLowerCase()) ||
  //         material.materialGrade?.includes(searchValue)
  //       ) {
  //         return material;
  //       }
  //     });
  //     setFilteredYLRList(filteredData);
  //   } else {
  //     setFilteredYLRList(material.materialList);
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
    const grade = form.getFieldValue('grade');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter((key, idx) => idx !== k),
      grade: grade.filter((key, idx) => idx !== k),
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

  return (
    <div>
      <h1>
        <IntlMessages id='sidebar.company.yieldLossList' />
      </h1>
      <Card>
        <div className='gx-flex-row gx-flex-1'>
          <div className='table-operations gx-col'>
            <Button onClick={deleteSelectedCoils}>Delete</Button>
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
                props.resetMaterial();
                setShowAddYLR(true);
              }}
            >
              Add Yield Loss
            </Button>
            <SearchBox
              styleName='gx-flex-1'
              placeholder='Search for yield loss...'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
        <hr />
        <Select
          id='partyId'
          showSearch
          placeholder='Select customer'
          style={{ width: 300 }}
          className="additional_price_select"
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
        >
          {props.party?.partyList?.map((party) => (
            <Option key={party.nPartyId} value={party.nPartyId}>
              {party.partyName}
            </Option>
          ))}
        </Select>
        <Select
          id='tags'
          placeholder='Select process tag'
          showSearch
          style={{ width: 300 }}
          className="additional_price_select"
          onChange={handleSelectChange}
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
        >
          {props?.packetClassification?.processTags?.map((item) => {
            return <Option value={item?.tagId}>{item?.tagName}</Option>;
          })}
        </Select>
        <Table
          rowSelection={[]}
          className='gx-table-responsive'
          columns={columns}
          dataSource={filteredYLRList}
          onChange={handleChange}
        />

        <Modal
          title='Yield Loss Ratio Details'
          visible={viewMaterial}
          onCancel={() => setViewMaterial(false)}
          onOk={() => setViewMaterial(false)}
          width={600}
        >
          <Card>
            <Row>
              <Col span={24}>
                <Card>
                  {viewMaterialData?.description && (
                    <p>
                      <strong>Material Type :</strong>{' '}
                      {viewMaterialData.description}
                    </p>
                  )}
                  {viewMaterialData?.materialGrade && (
                    <p>
                      <strong>Material Grade :</strong>{' '}
                      {viewMaterialData?.materialGrade?.reduce(
                        (acc, grade, index, arr) =>
                          acc.concat(
                            `${grade.gradeName}${
                              index === arr.length - 1 ? '' : ','
                            } `
                          ),
                        ''
                      )}
                    </p>
                  )}
                </Card>
              </Col>
            </Row>
          </Card>
        </Modal>

        <Modal
          title='Add yield loss ratio'
          visible={showAddYLR}
          onOk={(e) => {
            e.preventDefault();
            if (editMaterial) {
              props.form.validateFields((err, values) => {
                if (!err) {
                  console.log('Received values of form: ', values);
                  const data = { values, id: props.material?.material?.matId };
                  props.updateMaterial(data);
                  setEditMaterial(false);
                  setShowAddYLR(false);
                }
              });
              props.form.resetFields();
            } else {
              props.form.validateFields((err, values) => {
                if (!err) {
                  console.log('Received values of form: ', values);
                  props.addMaterial(values);
                  setShowAddYLR(false);
                }
              });
              props.form.resetFields();
            }
          }}
          width={700}
          onCancel={() => {
            props.resetMaterial();
            props.form.resetFields();
            setShowAddYLR(false);
            setEditMaterial(false);
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
                    {getFieldDecorator('partyId', {
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
                        id='tags'
                        placeholder='Select process tag'
                        showSearch
                        mode='multiple'
                        style={{ width: '100%' }}
                        onChange={handleSelectChange}
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
                        {props?.packetClassification?.processTags?.map(
                          (item) => {
                            return (
                              <Option value={item?.tagId}>
                                {item?.tagName}
                              </Option>
                            );
                          }
                        )}
                      </Select>
                    )}
                  </Form.Item>

                  {keys.map((k, index) => {
                    return (
                      <div key={k}>
                        <Form.Item label='Range from'>
                          {getFieldDecorator(`rangeFrom[${index}]`, {
                            initialValue:
                              props.material?.material?.materialGrade?.map(
                                (material) => material.gradeName
                              )[index] || '',
                            rules: [
                              {
                                required: true,
                                message: 'Please enter range!',
                              },
                            ],
                          })(<Input id={`grade${index}`} {...getFieldProps} />)}
                        </Form.Item>
                        <Form.Item label='Range to'>
                          {getFieldDecorator(`rangeTo[${index}]`, {
                            initialValue:
                              props.material?.material?.materialGrade?.map(
                                (material) => material.rangeTo
                              )[index] || '',
                            rules: [
                              {
                                required: true,
                                message: 'Please enter range!',
                              },
                            ],
                          })(
                            <Input id={`rangeTo${index}`} {...getFieldProps} />
                          )}
                        </Form.Item>
                        <Form.Item label='Comment'>
                          {getFieldDecorator(`comment[${index}]`, {
                            initialValue:
                              props.material?.material?.materialGrade?.map(
                                (material) => material.comment
                              )[index] || '',
                            rules: [
                              {
                                required: true,
                                message: 'Please enter comment!',
                              },
                            ],
                          })(
                            <Input id={`comment${index}`} {...getFieldProps} />
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

                  {/* {keys.map((k, index) => {
                    return (
                        <div key={k}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Range from">
                                        {getFieldDecorator(`rangeFrom[${index}]`, {
                                            initialValue: props.material?.material?.materialGrade?.[index]?.rangeFrom || "",
                                            rules: [{ required: true, message: 'Please enter range from' }]
                                        })(
                                            <Input id={`rangeFrom${index}`} {...getFieldProps}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Range to">
                                        {getFieldDecorator(`rangeTo[${index}]`, {
                                            initialValue: props.material?.material?.materialGrade?.[index]?.rangeTo || "",
                                            rules: [{ required: true, message: 'Please enter range to' }]
                                        })(
                                            <Input id={`rangeTo${index}`} {...getFieldProps}/>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label="Comment">
                                {getFieldDecorator(`comment[${index}]`, {
                                    initialValue: props.material?.material?.materialGrade?.[index]?.comment || "",
                                })(
                                    <Input id={`comment${index}`} {...getFieldProps}/>
                                )}
                            </Form.Item>
                            {keys.length-1 > 0 && <i className="icon icon-trash gx-margin" onClick={() => removeKey(index)}/> }
                            {index === keys.length-1 && (
                                <Form.Item>
                                    <i className="icon icon-add-circle" onClick={() => addNewKey(index)}/> 
                                </Form.Item>
                            )}
                        </div>
                    );
                })} */}

                  {/* {keys.map((k, index) => {
                    return (
                        <div key={k}>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item label="Range from">
                                        {getFieldDecorator(`rangeFrom[${index}]`, {
                                            initialValue: props.material?.material?.materialGrade?.[index]?.rangeFrom || "",
                                            rules: [{ required: true, message: 'Please enter range from' }]
                                        })(
                                            <Input id={`rangeFrom${index}`} {...getFieldProps} style={{ width: '100%' }}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Range to">
                                        {getFieldDecorator(`rangeTo[${index}]`, {
                                            initialValue: props.material?.material?.materialGrade?.[index]?.rangeTo || "",
                                            rules: [{ required: true, message: 'Please enter range to' }]
                                        })(
                                            <Input id={`rangeTo${index}`} {...getFieldProps} style={{ width: '100%' }}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Comment">
                                        {getFieldDecorator(`comment[${index}]`, {
                                            initialValue: props.material?.material?.materialGrade?.[index]?.comment || "",
                                        })(
                                            <Input id={`comment${index}`} {...getFieldProps} style={{ width: '100%' }}/>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            {keys.length-1 > 0 && <i className="icon icon-trash gx-margin" onClick={() => removeKey(index)}/> }
                            {index === keys.length-1 && (
                                <Form.Item>
                                    <i className="icon icon-add-circle" onClick={() => addNewKey(index)}/> 
                                </Form.Item>
                            )}
                        </div>
                    );
                })} */}
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
});

const addYieldLossForm = Form.create({
  mapPropsToFields(props) {
    const grade = props.material?.material?.materialGrade?.map(
      (material) => material.gradeName
    );
    return {
      description: Form.createFormField({
        value: props.material?.material?.description || '',
      }),
      grade: Form.createFormField({
        value: grade || [],
      }),
      keys: Form.createFormField({
        value: grade || [0],
      }),
      materialCode: Form.createFormField({
        value: props.material?.material?.materialCode || '',
      }),
      hsnCode: Form.createFormField({
        value: props.material?.material?.hsnCode || '',
      }),
    };
  },
})(YieldLoss);

export default connect(mapStateToProps, {
  fetchYLRList,
  fetchMaterialList,
  addMaterial,
  fetchMaterialListById,
  updateMaterial,
  resetMaterial,
  fetchClassificationList,
  fetchPartyList,
})(addYieldLossForm);
