import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
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
  Checkbox,
  Select,
  Icon,
} from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import SearchBox from '../../../components/SearchBox';

import IntlMessages from '../../../util/IntlMessages';
import {
  fetchDVMaterialList,
  addDVMaterial,
  fetchDVMaterialListById,
  updateDVMaterial,
  resetMaterial,
  fetchMainCategoryList,
  fetchSubCategoryList,
  deleteDVMaterial
} from '../../../appRedux/actions';
import { onDeleteContact } from '../../../appRedux/actions';
import '../../../styles/components/Master/MaterialDV.css';
import Dragger from 'antd/lib/upload/Dragger';

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 8 },
    ml: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 16 },
    lg: { span: 16 },
  },
};

const MaterialDV = (props) => {
  const Option = Select.Option;
  const [sortedInfo, setSortedInfo] = useState({
    order: 'descend',
    columnKey: 'age',
  });
  const { getFieldDecorator, getFieldValue, getFieldProps } = props.form;
  getFieldDecorator('keys', { initialValue: [0] });
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [viewMaterial, setViewMaterial] = useState(false);
  const [editMaterial, setEditMaterial] = useState(false);
  const [viewMaterialData, setViewMaterialData] = useState({});
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [filteredMaterialList, setFilteredMaterialList] = useState(
    props.materialDV.DVMaterialList || []
  );
  const [addSubCategory, setAddSubCategory] = useState(false);
  const [addMainCategory, setAddMainCategory] = useState(false);
  const [selectedUnitInches, setSelectedUnitInches] = useState();
  const [selectedUnitmm, setSelectedUnitmm] = useState();
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPageItems, setTotalPageItems] = useState(0);
  const { totalItems } = props.materialDV.DVMaterialList;

  const keys = getFieldValue('keys');

  const columns = [
    {
      title: 'Material ID',
      dataIndex: 'itemId',
      key: 'itemId',
      filters: [],
      sorter: (a, b) => {
        return a.itemId - b.itemId;
      },
      sortOrder: sortedInfo.columnKey === 'itemId' && sortedInfo.order,
    },
    {
      title: 'Material Name',
      dataIndex: 'itemName',
      key: 'itemName',
      filters: [],
      sorter: (a, b) => {
        return a.itemName - b.itemName;
      },
      sortOrder: sortedInfo.columnKey === 'itemName' && sortedInfo.order,
    },
    {
      title: 'Material Code',
      dataIndex: 'itemCode',
      key: 'itemCode',
      filters: [],
      sorter: (a, b) => {
        return a.itemCode - b.itemCode;
      },
      sortOrder: sortedInfo.columnKey === 'itemCode' && sortedInfo.order,
    },
    {
      title: 'HSN Code',
      dataIndex: 'itemHsnCode',
      key: 'itemHsnCode',
      filters: [],
      sorter: (a, b) => {
        return a.itemHsnCode - b.itemHsnCode;
      },
      sortOrder: sortedInfo.columnKey === 'itemHsnCode' && sortedInfo.order,
    },
    {
      title: 'Material Date',
      dataIndex: 'createdOn',
      render: (value) => {
        return moment(value).format('Do MMM YYYY');
      },
      key: 'createdOn',
      filters: [],
      sorter: (a, b) => a.createdOn.length - b.createdOn.length,
      sortOrder: sortedInfo.columnKey === 'createdOn' && sortedInfo.order,
    },
    
    // {
    //   title: 'Material',
    //   dataIndex: 'description',
    //   key: 'description',
    //   // filteredValue: filteredInfo ? filteredInfo['description'] : null,
    //   // filters: [
    //   //   ...new Set(props.material.materialList.map((item) => item.description)),
    //   // ].map((material) => {
    //   //   return { text: material || '', value: material || '' };
    //   // }),
    //   // onFilter: (value, record) => record.description == value,
    //   // sorter: (a, b) => a.description?.length - b.description?.length,
    //   // sortOrder: sortedInfo.columnKey === 'description' && sortedInfo.order,
    // },
    // {
    //   title: 'Material Grade',
    //   dataIndex: 'materialGrade',
    //   key: 'materialGrade',
    //   render: (value) => {
    //     const grade = value.map((grade) => {
    //       return grade.gradeName;
    //     });
    //     return grade.toString();
    //   },
    //   sorter: (a, b) => a.materialGrade?.length - b.materialGrade?.length,
    //   sortOrder: sortedInfo.columnKey === 'materialGrade' && sortedInfo.order,
    // },
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
    setViewMaterialData(record);
    props.fetchDVMaterialListById({
      id: record.itemId,
      pageNo: 1,
      pageSize: pageSize,
      ipAddress: "1.1.1.1",
      requestId: "MATERIAL_ID_GET",
      userId: ''
  });
    setViewMaterial(true);
  };

  const onDelete = (record, key, e) => {
    props.deleteDVMaterial({
      id: record.itemId,
      ipAddress: "1.1.1.1",
      requestId: "MATERIAL_ID_DELETE",
      userId: ''
  });
  };
  const onEdit = (record, e) => {
    e.preventDefault();
    props.fetchDVMaterialListById(record.matId);
    setEditMaterial(true);
    setTimeout(() => {
      setShowAddMaterial(true);
    }, 1000);
  };

  useEffect(() => {
    setTimeout(() => {
      props.fetchDVMaterialList({
        pageNo: 1,
        searchText: searchValue,
        pageSize: pageSize,
        ipAddress: "1.1.1.1",
        requestId: "Material_GET",
        userId: ''
    });
    props.fetchMainCategoryList({
      pageNo: 1,
      searchText: "",
      pageSize: pageSize,
      ipAddress: "1.1.1.1",
      requestId: "MAIN_CATEGORY_GET",
      userId: ''
  });
    props.fetchSubCategoryList({
      pageNo: 1,
      searchText: "",
      pageSize: pageSize,
      ipAddress: "1.1.1.1",
      requestId: "SUB_CATEGORY_GET",
      userId: ''
  });
    }, 1000);
  }, [showAddMaterial]);

  useEffect(() => {
    const { loading, error, DVMaterialList } = props.materialDV;
    if (!loading && !error) {
      setFilteredMaterialList(DVMaterialList);
    }
  }, [props.materialDV]);

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    setFilteredInfo(filters);
  };

  const handleUnitChangeInches = value => {
    setSelectedUnitInches(value);
  };

  const handleUnitChangemm = value => {
    setSelectedUnitmm(value);
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

  const onCrossFileChange = (e) => {};
  const onItemFileChange = (e) => {};
  useEffect(() => {
    if (totalItems) {
      setTotalPageItems(totalItems);
    }
  }, [totalItems]);

  useEffect(() => {
    if (searchValue) {
      if (searchValue.length >= 3) {
        setPageNo(1);
        props.fetchDVMaterialList({
            searchText:searchValue,
            pageNo:"1",
            pageSize: pageSize,
            ipAddress: "1.1.1.1",
            requestId: "MAIN_LIST_GET",
            userId: ""
        });
      }
    } else {
      setPageNo(1);
      props.fetchDVMaterialList({
        searchText:searchValue,
        pageNo:"1",
        pageSize: pageSize,
        ipAddress: "1.1.1.1",
        requestId: "MAIN_LIST_GET",
        userId: ""
    });
    }
  }, [searchValue]);

  return (
    <div>
      <h1>
        <IntlMessages id='sidebar.company.materialList' />
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
                setShowAddMaterial(true);
              }}
            >
              Add Material
            </Button>
            <SearchBox
              styleName='gx-flex-1'
              placeholder='Search for material name...'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
        <Table
          rowSelection={[]}
          className='gx-table-responsive'
          columns={columns}
          dataSource={filteredMaterialList.content}
          onChange={handleChange}
          pagination={{
            pageSize: pageSize,
            onChange: (page) => {
              setPageNo(page);
              props.fetchDVMaterialList({
                searchText:searchValue,
                pageNo: page,
                pageSize: pageSize,
                ipAddress: "1.1.1.1",
                requestId: "MATERIAL_LIST_GET",
                userId: ""
            });
            },
            current: pageNo,
            total: totalPageItems,
          }}
        />

        <Modal
          title='Material Details'
          visible={viewMaterial}
          onCancel={() => setViewMaterial(false)}
          onOk={() => setViewMaterial(false)}
          width={600}
        >
          <Card>
            <Row>
              <Col span={24}>
                <Card>
                  <p>Material Name: {viewMaterialData?.itemName}</p>
                  <p>Material Code: {viewMaterialData?.itemCode}</p>
                  <p>HSN Code: {viewMaterialData?.itemHsnCode}</p>
                  {viewMaterialData?.categoryName && <p>Main Category Name: {viewMaterialData?.categoryName}</p> }
                  {viewMaterialData?.categoryName &&<p>Sub Category Name: {viewMaterialData?.subcategoryName}</p>}
                  <p>Display Name: {viewMaterialData?.displayName}</p>
                  <p>Brand Name : {viewMaterialData?.brandName}</p>
                  <p>Manufacturer Name: {viewMaterialData?.manufacturerName}</p>
                 {/* {viewMaterialData?.description && (
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
                  )}*/}
                </Card>
              </Col>
            </Row>
          </Card>
        </Modal>

        <Modal
          title='Add Material'
          visible={showAddMaterial}
          onOk={(e) => {
            e.preventDefault();
            if (editMaterial) {
              props.form.validateFields((err, values) => {
                if (!err) {
                  console.log('Received values of form: ', values);
                  const data = { values, id: props.material?.material?.matId };
                  props.updateDVMaterial(data);
                  setEditMaterial(false);
                  setShowAddMaterial(false);
                }
              });
              props.form.resetFields();
            } else {
              props.form.validateFields((err, values) => {
                if (!err) {
                  console.log('Received values of form: ', values);
                  props.addDVMaterial(values);
                  setShowAddMaterial(false);
                }
              });
              props.form.resetFields();
            }
          }}
          width={900}
          onCancel={() => {
            props.resetMaterial();
            props.form.resetFields();
            setShowAddMaterial(false);
            setEditMaterial(false);
          }}
        >
          <Card className='gx-card'>
            <Form {...formItemLayout} className='gx-pt-4'>
              <Row>
                <Col
                  lg={24}
                  md={24}
                  sm={24}
                  xs={24}
                  className='gx-align-self-center'
                >
                  <Form.Item label='Item Name'>
                    {getFieldDecorator('itemName', {
                      rules: [
                        { required: true, message: 'Please enter Item Name' },
                      ],
                    })(<Input id='itemName' {...getFieldProps} />)}
                  </Form.Item>
                  <Form.Item label='Item Code'>
                    {getFieldDecorator('itemCode', {
                      rules: [
                        { required: true, message: 'Please enter item code' },
                      ],
                    })(<Input id='itemCode' {...getFieldProps} />)}
                  </Form.Item>
                  <Form.Item label='Item HSN Code'>
                    {getFieldDecorator('itemHsnCode', {
                      rules: [
                        { required: true, message: 'Please enter HSN code' },
                      ],
                    })(<Input id='itemHsnCode' {...getFieldProps} />)}
                  </Form.Item>
                  <Form.Item label='Item Grade'>
                    {getFieldDecorator('itemGradeId', {
                      rules: [
                        { required: true, message: 'Please enter item grade' },
                      ],
                    })(<Input id='itemGradeId' {...getFieldProps} />)}
                  </Form.Item>
                  
                  <Form.Item label="Item Main category">
                        {getFieldDecorator("categoryId", {
                          rules: [
                            {
                              required: true,
                              message: "Please select category!",
                            },
                          ],
                        })(
                          <Select
                            id="categoryId"
                            showSearch
                            mode="multiple"
                            style={{ width: "100%" }}
                            filterOption={(input, option) =>
                              option.props.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                          }
                          allowClear
                          >
                            {props.category?.mainCategoryList?.content?.map((mcategory) => (
                              <Option key={mcategory.categoryId} value={mcategory.categoryId}>
                                {mcategory.categoryName}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                      {/* <Button
                        type='primary'
                        htmlType='submit'
                        onClick={() => setAddMainCategory(true)}
                      >
                        Add
                      </Button>
                      <Modal
                        title='Add Main Category'
                        visible={addMainCategory}
                        onCancel={() => setAddMainCategory(false)}
                      >
                        <Card className='gx-card'>
                          <Form {...formItemLayout} className='gx-pt-4'>
                            <Row>
                              <Col
                                lg={24}
                                md={24}
                                sm={24}
                                xs={24}
                                className='gx-align-self-center'
                              >
                                <Form.Item label='Item Name'>
                                  {getFieldDecorator('itemName', {
                                    rules: [
                                      {
                                        required: true,
                                        message: 'Please enter Item Name',
                                      },
                                    ],
                                  })(
                                    <Input id='itemName' {...getFieldProps} />
                                  )}
                                </Form.Item>
                                <Form.Item label='Item Code'>
                                  {getFieldDecorator('itemCode', {
                                    rules: [
                                      {
                                        required: true,
                                        message: 'Please enter item code',
                                      },
                                    ],
                                  })(
                                    <Input id='itemCode' {...getFieldProps} />
                                  )}
                                </Form.Item>
                              </Col>
                            </Row>
                          </Form>
                        </Card>
                      </Modal>*/}
                    {/* </Col>  */}

                    <Form.Item label="Item Sub category">
                        {getFieldDecorator("subCategoryId", {
                          rules: [
                            {
                              required: true,
                              message: "Please select category!",
                            },
                          ],
                        })(
                          <Select
                            id="subCategoryId"
                            showSearch
                            mode="multiple"
                            style={{ width: "100%" }}
                            filterOption={(input, option) =>
                              option.props.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                          }
                          allowClear
                          >
                            {props.category?.subCategoryList?.content?.map((mcategory) => (
                              <Option key={mcategory.subcategoryId} value={mcategory.subcategoryId}>
                                {mcategory.subcategoryName}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                      {/* <Button
                        type='primary'
                        onClick={() => {
                          props.form.resetFields();
                          props.resetMaterial();
                          setAddSubCategory(true);
                        }}
                      >
                        Add
                      </Button>

                      <Modal
                        title='Add sub Category'
                        visible={addSubCategory}
                        onCancel={() => setAddSubCategory(false)}
                      >
                        <Card className='gx-card'>
                          <Form {...formItemLayout} className='gx-pt-4'>
                            <Row>
                              <Col
                                lg={24}
                                md={24}
                                sm={24}
                                xs={24}
                                className='gx-align-self-center'
                              >
                                <Form.Item label='Main Category'>
                                  {getFieldDecorator('selectMainCategory', {
                                    rules: [
                                      {
                                        required: true,
                                        message: 'Please select Main Category!',
                                      },
                                    ],
                                  })(
                                    <Select
                                      id='selectMainCategory'
                                      showSearch
                                      mode='multiple'
                                      style={{ width: '100%' }}
                                      //  onChange={handleSelectChange}
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
                                <Form.Item label='Item Name'>
                                  {getFieldDecorator('itemName', {
                                    rules: [
                                      {
                                        required: true,
                                        message: 'Please enter Item Name',
                                      },
                                    ],
                                  })(
                                    <Input id='itemName' {...getFieldProps} />
                                  )}
                                </Form.Item>
                                <Form.Item label='Item Code'>
                                  {getFieldDecorator('itemCode', {
                                    rules: [
                                      {
                                        required: true,
                                        message: 'Please enter item code',
                                      },
                                    ],
                                  })(
                                    <Input id='itemCode' {...getFieldProps} />
                                  )}
                                </Form.Item>
                              </Col>
                            </Row>
                          </Form>
                        </Card>
                      </Modal> */}
                    {/* </Col> */}

                  <Form.Item label='Display Name'>
                    {getFieldDecorator('displayName', {
                      rules: [
                        {
                          required: false,
                          message: 'Please enter display name',
                        },
                      ],
                    })(<Input id='displayName' {...getFieldProps} />)}
                  </Form.Item>
                  <Form.Item label='Brand Name'>
                    {getFieldDecorator('brandName', {
                      // rules: [{ required: false, message: 'Please enter Item sub category' }],
                    })(<Input id='brandName' {...getFieldProps} />)}
                  </Form.Item>
                  <Form.Item label='Manufacturers Name'>
                    {getFieldDecorator('manufacturerName', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(<Input id='manufacturerName' {...getFieldProps} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ marginBottom: '-15px' }}>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className='gx-align-self-center'
                >
                  <Form.Item>
                    <Checkbox
                    // onChange={checkboxChange}
                    >
                      Length
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Form.Item>
                  <Col className='flex-row'>
                    {getFieldDecorator('meter', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(<Input id='meter' {...getFieldProps} />)}
                    <label className='left-side-label'>Meters</label>
                  </Col>
                </Form.Item>

                <Form.Item>
                  <Col className='flex-row'>
                    {getFieldDecorator('feet', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(<Input id='feet' {...getFieldProps} disabled />)}
                    <label className='left-side-label'>Feet</label>
                  </Col>
                </Form.Item>
              </Row>

              <Row style={{ marginBottom: '-15px' }}>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className='gx-align-self-center'
                >
                  <Form.Item>
                    <Checkbox
                    // onChange={checkboxChange}
                    >
                      Width
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Form.Item>
                  <Col className='flex-row'>
                    {getFieldDecorator('widthMeter', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(<Input id='widthMeter' {...getFieldProps} />)}
                    <label className='left-side-label'>Meters</label>
                  </Col>
                </Form.Item>

                <Form.Item>
                  <Col className='flex-row'>
                    {getFieldDecorator('widthFeet', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(<Input id='widthFeet' {...getFieldProps} disabled />)}
                    <label className='left-side-label'>Feet</label>
                  </Col>
                </Form.Item>
              </Row>

              <Row style={{ marginBottom: '-15px' }}>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className='gx-align-self-center'
                >
                  <Form.Item>
                    <Checkbox
                    // onChange={checkboxChange}
                    >
                      Flange1
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Form.Item>
                  <Col className='flex-row'>
                    {getFieldDecorator('F1mm', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(<Input id='F1mm' {...getFieldProps} />)}
                    <label className='left-side-label'>mm</label>
                  </Col>
                </Form.Item>

                <Form.Item>
                  <Col className='flex-row-mm'>
                    {getFieldDecorator('f1inches', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(<Input id='f1inches' {...getFieldProps} disabled />)}
                    <label className='left-side-label-mm'>Inches</label>
                  </Col>
                </Form.Item>
              </Row>

              <Row style={{ marginBottom: '-15px' }}>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className='gx-align-self-center'
                >
                  <Form.Item>
                    <Checkbox
                    // onChange={checkboxChange}
                    >
                      Flange2
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Form.Item>
                  <Col className='flex-row'>
                    {getFieldDecorator('F2mm', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(<Input id='F2mm' {...getFieldProps} />)}
                    <label className='left-side-label'>mm</label>
                  </Col>
                </Form.Item>

                <Form.Item>
                  <Col className='flex-row-mm'>
                    {getFieldDecorator('f2inches', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(<Input id='f2inches' {...getFieldProps} disabled />)}
                    <label className='left-side-label-mm'>Inches</label>
                  </Col>
                </Form.Item>
              </Row>

              <Row style={{ marginBottom: '-15px' }}>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className='gx-align-self-center'
                >
                  <Form.Item>
                    <Checkbox
                    // onChange={checkboxChange}
                    >
                      Thickness
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Form.Item>
                  <Col className='flex-row'>
                    {getFieldDecorator('thicknessmm', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(<Input id='thicknessmm' {...getFieldProps} />)}
                    <label className='left-side-label'>mm</label>
                  </Col>
                </Form.Item>

                <Form.Item>
                  <Col className='flex-row-mm'>
                    {getFieldDecorator('thicknessInches', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(
                      <Input id='thicknessInches' {...getFieldProps} disabled />
                    )}
                    <label className='left-side-label-mm'>Inches</label>
                  </Col>
                </Form.Item>

                <Form.Item>
                  <Col className='flex-row' style={{ marginRight: '-40px' }}>
                    {getFieldDecorator('thicknessGuage', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(
                      <Input id='thicknessGuage' {...getFieldProps} disabled />
                    )}
                    <label
                      className='left-side-label'
                      style={{ marginRight: '-40px' }}
                    >
                      Guage
                    </label>
                  </Col>
                </Form.Item>
              </Row>

              <Row style={{ marginBottom: '-15px' }}>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className='gx-align-self-center'
                >
                  <Form.Item>
                    <Checkbox
                    // onChange={checkboxChange}
                    >
                      Height
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Form.Item>
                  <Col className='flex-row'>
                    {getFieldDecorator('heightmm', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(<Input id='heightmm' {...getFieldProps} />)}
                    <label className='left-side-label'>mm</label>
                  </Col>
                </Form.Item>

                <Form.Item>
                  <Col className='flex-row-mm'>
                    {getFieldDecorator('heightInches', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(<Input id='heightInches' {...getFieldProps} disabled />)}
                    <label className='left-side-label-mm'>Inches</label>
                  </Col>
                </Form.Item>
              </Row>

              <Row style={{ marginBottom: '-15px' }}>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className='gx-align-self-center'
                >
                  <Form.Item>
                    <Checkbox
                    // onChange={checkboxChange}
                    >
                      OD
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Form.Item>
                  <Col className='flex-row'>
                    {getFieldDecorator('ODmm', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(<Input id='ODmm' {...getFieldProps} />)}
                    <label className='left-side-label'>mm</label>
                  </Col>
                </Form.Item>

                <Form.Item>
                  <Col className='flex-row-mm'>
                    {getFieldDecorator('ODInches', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(<Input id='ODInches' {...getFieldProps} disabled />)}
                    <label className='left-side-label-mm'>Inches</label>
                  </Col>
                </Form.Item>
              </Row>

              <Row style={{ marginBottom: '-15px' }}>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className='gx-align-self-center'
                >
                  <Form.Item>
                    <Checkbox
                    // onChange={checkboxChange}
                    >
                      NB
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Form.Item>
                  <Col className='flex-row'>
                    {getFieldDecorator('NBmm', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(<Input id='NBmm' {...getFieldProps} />)}
                    <label className='left-side-label'>mm</label>
                  </Col>
                </Form.Item>

                <Form.Item>
                  <Col className='flex-row-mm'>
                    {getFieldDecorator('NBInches', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(<Input id='NBInches' {...getFieldProps} disabled />)}
                    <label className='left-side-label-mm'>Inches</label>
                  </Col>
                </Form.Item>
              </Row>

              <Row>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className='gx-align-self-center'
                >
                  <Form.Item>
                    <Checkbox
                    // onChange={checkboxChange}
                    ></Checkbox>
                    <Input
                      placeholder='Enter parameter name'
                      {...getFieldProps}
                      style={{ marginRight: '-70px', marginLeft: '8px' }}
                    />
                  </Form.Item>
                </Col>

                <Form.Item>
                  <Col className='flex-row' style={{ marginTop: '6px' }}>
                    {getFieldDecorator('parametermm', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(<Input id='parametermm' {...getFieldProps} />)}
                     <Select value={selectedUnitmm} onChange={handleUnitChangemm} placeholder='Select unit'>
                        <Option value="inches">Meters</Option>
                        <Option value="feet">mm</Option>
                    </Select>
                  </Col>
                </Form.Item>
                <Form.Item>
                  <Col className='flex-row' style={{ marginTop: '6px' }}>
                    {getFieldDecorator('parameterInches', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(<Input id='parameterInches' {...getFieldProps} />)}
                    <Select value={selectedUnitInches} onChange={handleUnitChangeInches} placeholder='Select unit'>
                        <Option value="inches">Inches</Option>
                        <Option value="feet">Feet</Option>
                    </Select>
                  </Col>
                </Form.Item>
              </Row>

              <Button type='primary' htmlType='submit' icon='plus'>
                Add Parameter
              </Button>

              <Row>
                <Col lg={12} md={12} sm={24} xs={24}>
                  <h4>Item Image</h4>
                  <Dragger
                    name='itemImage'
                    height={50}
                    onChange={(e) => onItemFileChange(e)}
                  >
                    <p>
                      <Icon type='upload' />
                      &nbsp; Image upload here
                    </p>
                  </Dragger>
                </Col>
                <Col lg={12} md={12} sm={24} xs={24}>
                  <h4>Cross Sectional Image</h4>
                  <Dragger
                    name='crossSectionalImage'
                    height={50}
                    onChange={(e) => onItemFileChange(e)}
                  >
                    <p>
                      <Icon type='upload' />
                      &nbsp; Image upload here
                    </p>
                  </Dragger>
                </Col>
              </Row>

              <Row style={{ marginTop: '20px', marginLeft: '5px' }}>
                {' '}
                <h3>Section Weight</h3>
              </Row>

              <Form.Item>
                <Col
                  style={{ display: 'flex' }}
                  lg={24}
                  md={24}
                  sm={24}
                  xs={24}
                >
                  <Col lg={12} md={12} sm={24} xs={24}>
                    {getFieldDecorator('perMeter', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(<Input id='perMeter' {...getFieldProps} />)}
                  </Col>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <label>Kg per meter</label>
                  </Col>
                </Col>
              </Form.Item>
              <Form.Item>
                <Col
                  style={{ display: 'flex' }}
                  lg={24}
                  md={24}
                  sm={24}
                  xs={24}
                >
                  <Col lg={12} md={12} sm={24} xs={24}>
                    {getFieldDecorator('perFeet', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(<Input id='perFeet' {...getFieldProps} />)}
                  </Col>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <label>Kg per feet</label>
                  </Col>
                </Col>
              </Form.Item>
              <Form.Item>
                <Col
                  style={{ display: 'flex' }}
                  lg={24}
                  md={24}
                  sm={24}
                  xs={24}
                >
                  <Col lg={12} md={12} sm={24} xs={24}>
                    {getFieldDecorator('perPC', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                    })(<Input id='perPC' {...getFieldProps} />)}
                  </Col>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <label>Kg per pc</label>
                  </Col>
                </Col>
              </Form.Item>

              {/* <Row>
                <Col
                  lg={24}
                  md={24}
                  sm={24}
                  xs={24}
                  className='gx-align-self-center'
                >
                  <Form.Item>
                    {/* <Col className='flex-row'> */}
                   {/*  <Col style={{ display: 'flex', flexDirection: 'row' }}>
                      {getFieldDecorator('sectionWeightKg', {
                        // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                      })(<Input id='sectionWeightKg' {...getFieldProps} />)}
                      <label
                        className='left-side-label'
                        style={{ marginRight: '-40px' }}
                      >
                        kg per meter
                      </label>
                    </Col>
                  </Form.Item>
                </Col>
              </Row> */}
            </Form>
          </Card>
        </Modal>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => ({
  materialDV: state.materialDV,
  category: state.category
});

const addMaterialDVForm = Form.create({
  mapPropsToFields(props) {
    const grade = props.material?.material?.materialGrade?.map(
      (material) => material.gradeName
    );
    return {
      itemName:Form.createFormField ({
          ...props.materialDV?.DVMaterialID?.ItemName,
          value: props.materialDV?.DVMaterialID?.ItemName|| '',
      }),
      itemCode:Form.createFormField ({
          ...props.materialDV?.DVMaterialID?.itemCode,
          value: props.materialDV?.DVMaterialID?.itemCode|| '',
      }),
      itemGradeId:Form.createFormField ({
          ...props.materialDV?.DVMaterialID?.itemGradeId,
          value: props.materialDV?.DVMaterialID?.itemGradeId|| '',
      }),
      categoryId:Form.createFormField ({
          ...props.materialDV?.DVMaterialID?.categoryId,
          value: props.materialDV?.DVMaterialID?.categoryId|| '',
      }),
      subCategoryId:Form.createFormField ({
          ...props.materialDV?.DVMaterialID?.subCategoryId,
          value: props.materialDV?.DVMaterialID?.subCategoryId|| '',
      }),
      displayName:Form.createFormField ({
          ...props.materialDV?.DVMaterialID?.displayName,
          value: props.materialDV?.DVMaterialID?.displayName|| '',
      }),
      brandName:Form.createFormField ({
          ...props.materialDV?.DVMaterialID?.brandName,
          value: props.materialDV?.DVMaterialID?.brandName|| '',
      }),
      manufacturerName:Form.createFormField ({
          ...props.materialDV?.DVMaterialID?.manufacturerName,
          value: props.materialDV?.DVMaterialID?.manufacturerName|| '',
      }),
      perMeter:Form.createFormField ({
          ...props.materialDV?.DVMaterialID?.perMeter,
          value: props.materialDV?.DVMaterialID?.perMeter|| '',
      }),
      perFeet:Form.createFormField ({
          ...props.materialDV?.DVMaterialID?.perFeet,
          value: props.materialDV?.DVMaterialID?.perFeet|| '',
      }),
      perPC:Form.createFormField ({
          ...props.materialDV?.DVMaterialID?.perPC,
          value: props.materialDV?.DVMaterialID?.perPC|| '',
      }),
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
})(MaterialDV);

export default connect(mapStateToProps, {
  fetchDVMaterialList,
  addDVMaterial,
  fetchDVMaterialListById,
  updateDVMaterial,
  resetMaterial,
  fetchMainCategoryList,
  fetchSubCategoryList,
  deleteDVMaterial
})(addMaterialDVForm);
