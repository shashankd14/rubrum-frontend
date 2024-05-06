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
  deleteDVMaterial,
  fetchManufacturerList,
  fetchItemGradeList
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
    debugger
    e.preventDefault();
    props.fetchDVMaterialListById({
      id: record.itemId,
      pageNo: 1,
      pageSize: pageSize,
      ipAddress: "1.1.1.1",
      requestId: "MATERIAL_ID_GET",
      userId: ''
  });
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
  props.fetchManufacturerList({
    pageNo: 1,
    searchText: "",
    pageSize: pageSize,
    ipAddress: "1.1.1.1",
    requestId: "MANUFACTURER_GET",
    userId: ''
});
props.fetchItemGradeList({
  searchText:searchValue,
  pageNo:"1",
  pageSize:"15",
  ipAddress: "1.1.1.1",
  requestId: "itemgradeId_LIST_GET",
  userId: ""
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

const [itemImageFile, setItemImageFile] = useState();
const [crossSectionalImageFile, setCrossSectionalImageFile] = useState();
  const onCrossFileChange = (info) => {
    if (info.file.status === 'uploading') {
      // File has been uploaded successfully
      setCrossSectionalImageFile(info.file.name);
    } else if (info.file.status === 'error') {
      // Error occurred while uploading the file
      console.error('Error uploading file:', info.file.error);
    }
  };
  const onItemFileChange = (info) => {
    if (info.file.status === 'uploading') {
      setItemImageFile(info.file.name);
    } else if (info.file.status === 'error') {
      console.error('Error uploading file:', info.file.error);
    }
  };
 
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

  const [lengthMeterValue, setLengthMeterValue] = useState('');
  const [widthMeterValue, setWidthMeterValue] = useState('');
  const [flange1MM, setFlange1MM] = useState('');
  const [flange2MM, setFlange2MM] = useState('');
  const [heightMMValue, setHeightMMValue] = useState('');
  const [ODMMValue, setODtMMValue] = useState('');
  const [NBMMValue, setNBMMValue] = useState('');
  const [thicknessmmInches, setThicknessmmInches] = useState('');
  const [thicknessmmGuage, setThicknessmmGuage] = useState('');

  const handleMeterChange = (e, setValue) => {
    const meters = e.target.value;
    const feet = meters * 3.28084; // 1 meter is approximately equal to 3.28084 feet
    setValue(meters);
    // Update the value of the corresponding feet input
    const feetInput = document.getElementById(`${setValue === setLengthMeterValue ? 'lengthFeet' : 'widthFeet'}`);
    if (feetInput) {
      feetInput.value = feet.toFixed(2);
    }
  };

  const handleMMChange = (e, setDimensionMM, inchesId) => {
    const mm = e.target.value;
    const inches = mm / 25.4; // Convert millimeters to inches
    setDimensionMM(mm); // Update the state with millimeter value
  
    // Now update the corresponding inches input
    const inchesInput = document.getElementById(inchesId);
    if (inchesInput) {
      inchesInput.value = inches.toFixed(2);
    }
  };

  const handleThicknessMMChange = (e) => {
    debugger
    const mm = e.target.value;
    const inches = mm / 25.4;
    setThicknessmmInches(mm);
    const gauge = (0.3249 * Math.pow(10, 4) / (mm - 215.15)).toFixed(2); // Example formula for gauge conversion
    setThicknessmmGuage(gauge);
    // Set values for inches and gauge fields
    const inchesInput = document.getElementById('thicknessInches');
    const gaugeInput = document.getElementById('thicknessGuage');
    if (inchesInput && gaugeInput) {
      inchesInput.value = inches.toFixed(2);
      gaugeInput.value = gauge;
    }
  };

  const handleCheckboxChange = (e, key) => {
    setCheckboxStates({ ...checkboxStates, [key]: e.target.checked });
  };
  const [checkboxStates, setCheckboxStates] = useState({
    length: false,
    width: false,
    flange1: false,
    flange2: false,
    thickness: false,
    height: false,
    OD: false,
    NB: false
  });
  const additionalParas = [];

  if (checkboxStates.length) {
    additionalParas.push({
      parameterName: 'Length',
      unitType: 'Meters',
      units: lengthMeterValue,
    });
    additionalParas.push({
      parameterName: 'Length',
      unitType: 'Feet',
      units: (parseFloat(lengthMeterValue) * 3.28084).toFixed(2),
    });
  }

  if (checkboxStates.width) {
    additionalParas.push({
      parameterName: 'Width',
      unitType: 'Meters',
      units: widthMeterValue,
    });
    additionalParas.push({
      parameterName: 'Width',
      unitType: 'Feet',
      units: (parseFloat(widthMeterValue) * 3.28084).toFixed(2),
    });
  }

  if (checkboxStates.flange1) {
    additionalParas.push({
      parameterName: 'Flange1',
      unitType: 'mm',
      units: flange1MM,
    });
    additionalParas.push({
      parameterName: 'Flange1',
      unitType: 'Inches',
      units: (parseFloat(flange1MM) / 25.4).toFixed(2),
    });
  }

  if (checkboxStates.flange2) {
    additionalParas.push({
      parameterName: 'Flange2',
      unitType: 'mm',
      units: flange2MM,
    });
    additionalParas.push({
      parameterName: 'Flange2',
      unitType: 'Inches',
      units: (parseFloat(flange2MM) / 25.4).toFixed(2),
    });
  }

  if (checkboxStates.thickness) {
    additionalParas.push({
      parameterName: 'Thickness',
      unitType: 'mm',
      units: thicknessmmInches,
    });
    additionalParas.push({
      parameterName: 'Thickness',
      unitType: 'Inches',
      units: (parseFloat(thicknessmmInches) / 25.4).toFixed(2),
    });
    additionalParas.push({
      parameterName: 'Thickness',
      unitType: 'Guage',
      units: (0.3249 * Math.pow(10, 4) / (thicknessmmInches - 215.15)).toFixed(2)
    });
  }

  if (checkboxStates.height) {
    additionalParas.push({
      parameterName: 'Height',
      unitType: 'mm',
      units: heightMMValue,
    });
    additionalParas.push({
      parameterName: 'Height',
      unitType: 'Inches',
      units: (parseFloat(heightMMValue) / 25.4).toFixed(2),
    });
  }

  if (checkboxStates.height) {
    additionalParas.push({
      parameterName: 'OD',
      unitType: 'mm',
      units: ODMMValue,
    });
    additionalParas.push({
      parameterName: 'OD',
      unitType: 'Inches',
      units: (parseFloat(ODMMValue) / 25.4).toFixed(2),
    });
  }

  if (checkboxStates.height) {
    additionalParas.push({
      parameterName: 'NB',
      unitType: 'mm',
      units: ODMMValue,
    });
    additionalParas.push({
      parameterName: 'NB',
      unitType: 'Inches',
      units: (parseFloat(NBMMValue) / 25.4).toFixed(2),
    });
  }
  
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
                  {viewMaterialData?.categoryEntity && <p>Main Category Name: {viewMaterialData?.categoryEntity.categoryName}</p> }
                  {viewMaterialData?.subCategoryEntity &&<p>Sub Category Name: {viewMaterialData?.subCategoryEntity.subcategoryName}</p>}
                  <p>Display Name: {viewMaterialData?.displayName}</p>
                  <p>Brand Name : {viewMaterialData?.brandName}</p>
                  <p>Manufacturer Name: {viewMaterialData?.manufacturerName}</p>
                  {viewMaterialData?.additionalParams && (
                  <div>
                    <p>Additional Parameters:</p>
                    {JSON.parse(viewMaterialData.additionalParams).map((param, index) => (
                      <p key={index}>
                        {param.parameterName}: {param.units} {param.unitType}
                      </p>
                    ))}
                  </div>
                )}
                {viewMaterialData?.crossSectionalImage && (
                <div>
                  <p>Item Image:</p>
                  <img src={viewMaterialData.itemImagePresignedURL} alt="ItemImage" />
                </div>
              )}
              <p></p>
              {viewMaterialData?.itemImage && (
                <div>
                  <p>Cross-sectional Image:</p>
                  <img src={viewMaterialData.crossSectionalImagePresignedURL} alt="Cross-sectionalImage" />
                </div>
              )}
              <p></p>
              <p>Section Weight</p>
              {viewMaterialData?.perFeet && <p>kg per meter: {viewMaterialData?.perFeet}</p> }
              {viewMaterialData?.perMeter && <p>kg per feet: {viewMaterialData?.perMeter}</p> }
              {viewMaterialData?.perPC && <p>per pc: {viewMaterialData?.perPC}</p> }
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
                  debugger
                  const data = { 
                    ...values, 
                    id: props.materialDV?.DVMaterialID?.itemId, 
                    itemImage: itemImageFile, 
                    crossSectionalImage: crossSectionalImageFile,
                    additionalParams: additionalParas 
                  };
                  props.updateDVMaterial(data);
                  setEditMaterial(false);
                  setShowAddMaterial(false);
                }
              });
              props.form.resetFields();
            } else {
              props.form.validateFields((err, values) => {
                if (!err) {
                  debugger
                  console.log('Received values of form: ', values);
                  const data = { 
                    ...values, 
                    itemImage: itemImageFile, 
                    crossSectionalImage: crossSectionalImageFile, 
                    additionalParams: additionalParas 
                  };
                  props.addDVMaterial(data);
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
                    })(
                    <Select
                      id="itemGradeId"
                      showSearch
                      style={{ width: "100%" }}
                      filterOption={(input, option) =>
                        option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                    }
                    allowClear
                    >
                      {props.itemGrade?.itemGradeList?.content?.map((grade) => (
                        <Option key={grade.itemgradeId} value={grade.itemgradeName}>
                          {grade.itemgradeName}
                        </Option>
                      ))}
                    </Select>
                  )}
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
                            id="subCategoryId1"
                            showSearch
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
                  <Form.Item label="Manufacturers Name">
                        {getFieldDecorator("manufacturerName", {
                          rules: [
                            {
                              required: true,
                              message: "Please select manufacturer name!",
                            },
                          ],
                        })(
                          <Select
                            id="manufacturerName"
                            showSearch
                            style={{ width: "100%" }}
                            filterOption={(input, option) =>
                              option.props.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                          }
                          allowClear
                          >
                            {props.manufacturer?.manufacturerList?.content?.map((manufacturer) => (
                              <Option key={manufacturer.manufacturerId} value={manufacturer.manufacturerId}>
                                {manufacturer.manufacturerName}
                              </Option>
                            ))}
                          </Select>
                        )}
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
                    <Checkbox onChange={(e) => handleCheckboxChange(e, 'length')}
                    >
                      Length
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Form.Item>
                  <Col className='flex-row'>
                    {getFieldDecorator('lengthMeter', {
                      onChange: (e) => handleMeterChange(e, setLengthMeterValue),
                      initialValue: lengthMeterValue 
                    })(<Input id='lengthMeter' {...getFieldProps} />)}
                    <label className='left-side-label'>Meters</label>
                  </Col>
                </Form.Item>

                <Form.Item>
                  <Col className='flex-row'>
                    {getFieldDecorator('lengthFeet', {
                       initialValue: (lengthMeterValue * 3.28084).toFixed(2)
                    })(<Input id='lengthFeet' {...getFieldProps} disabled />)}
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
                    onChange={(e) => handleCheckboxChange(e, 'width')}
                    >
                      Width
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Form.Item>
                  <Col className='flex-row'>
                    {getFieldDecorator('widthMeter', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                      onChange: (e) => handleMeterChange(e, setWidthMeterValue),
                      initialValue: widthMeterValue
                    })(<Input id='widthMeter' {...getFieldProps} />)}
                    <label className='left-side-label'>Meters</label>
                  </Col>
                </Form.Item>

                <Form.Item>
                  <Col className='flex-row'>
                    {getFieldDecorator('widthFeet', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                      initialValue: (widthMeterValue * 3.28084).toFixed(2)
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
                     onChange={(e) => handleCheckboxChange(e, 'flange1')}
                    >
                      Flange1
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Form.Item>
                  <Col className='flex-row'>
                    {getFieldDecorator('Flange1mm', {
                      // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                      onChange: (e) => handleMMChange(e, setFlange1MM),
                      initialValue: flange1MM 
                    })(<Input id='Flange1mm' {...getFieldProps} />)}
                    <label className='left-side-label'>mm</label>
                  </Col>
                </Form.Item>

                <Form.Item>
                  <Col className='flex-row-mm'>
                    {getFieldDecorator('flange1inches', {
                      initialValue: (flange1MM / 25.4).toFixed(2)
                    })(<Input id='flange1inches' {...getFieldProps} disabled />)}
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
                     onChange={(e) => handleCheckboxChange(e, 'flange2')}
                    >
                      Flange2
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Form.Item>
                  <Col className='flex-row'>
                    {getFieldDecorator('Flange2mm', {
                      onChange: (e) => handleMMChange(e, setFlange2MM),
                      initialValue: flange2MM 
                    })(<Input id='Flange2mm' {...getFieldProps} />)}
                    <label className='left-side-label'>mm</label>
                  </Col>
                </Form.Item>

                <Form.Item>
                  <Col className='flex-row-mm'>
                    {getFieldDecorator('flange2inches', {
                      initialValue: (flange2MM / 25.4).toFixed(2)
                    })(<Input id='flange2inches' {...getFieldProps} disabled />)}
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
                     onChange={(e) => handleCheckboxChange(e, 'thickness')}
                    >
                      Thickness
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Form.Item>
                  <Col className='flex-row'>
                    {getFieldDecorator('thicknessmm', {
                      onChange: handleThicknessMMChange,
                      //  initialValue: thicknessmmInches 
                    })(<Input id='thicknessmm' {...getFieldProps} />)}
                    <label className='left-side-label'>mm</label>
                  </Col>
                </Form.Item>

                <Form.Item>
                  <Col className='flex-row-mm'>
                    {getFieldDecorator('thicknessInches', {
                      initialValue: (thicknessmmInches / 25.4).toFixed(2)
                    })(
                      <Input id='thicknessInches' {...getFieldProps} disabled />
                    )}
                    <label className='left-side-label-mm'>Inches</label>
                  </Col>
                </Form.Item>

                <Form.Item>
                  <Col className='flex-row' style={{ marginRight: '-40px' }}>
                    {getFieldDecorator('thicknessGuage', {
                      initialValue: thicknessmmGuage
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
                     onChange={(e) => handleCheckboxChange(e, 'height')}
                    >
                      Height
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Form.Item>
                  <Col className='flex-row'>
                    {getFieldDecorator('heightmm', {
                      onChange: (e) => handleMMChange(e, setHeightMMValue),
                      initialValue: heightMMValue 
                    })(<Input id='heightmm' {...getFieldProps} />)}
                    <label className='left-side-label'>mm</label>
                  </Col>
                </Form.Item>

                <Form.Item>
                  <Col className='flex-row-mm'>
                    {getFieldDecorator('heightInches', {
                      initialValue: (heightMMValue / 25.4).toFixed(2),
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
                     onChange={(e) => handleCheckboxChange(e, 'OD')}
                    >
                      OD
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Form.Item>
                  <Col className='flex-row'>
                    {getFieldDecorator('ODmm', {
                      onChange: (e) => handleMMChange(e, setODtMMValue),
                      initialValue: ODMMValue 
                    })(<Input id='ODmm' {...getFieldProps} />)}
                    <label className='left-side-label'>mm</label>
                  </Col>
                </Form.Item>

                <Form.Item>
                  <Col className='flex-row-mm'>
                    {getFieldDecorator('ODInches', {
                      initialValue: (ODMMValue / 25.4).toFixed(2),
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
                     onChange={(e) => handleCheckboxChange(e, 'NB')}
                    >
                      NB
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Form.Item>
                  <Col className='flex-row'>
                    {getFieldDecorator('NBmm', {
                      onChange: (e) => handleMMChange(e, setNBMMValue),
                      initialValue: NBMMValue 
                    })(<Input id='NBmm' {...getFieldProps} />)}
                    <label className='left-side-label'>mm</label>
                  </Col>
                </Form.Item>

                <Form.Item>
                  <Col className='flex-row-mm'>
                    {getFieldDecorator('NBInches', {
                      initialValue: (NBMMValue / 25.4).toFixed(2),
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
                    onChange={(e) => onCrossFileChange(e)}
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
  category: state.category,
  manufacturer: state.manufacturer,
  itemGrade: state.itemGrade
});

const addMaterialDVForm = Form.create({
  mapPropsToFields(props) {
    const grade = props.material?.material?.materialGrade?.map(
      (material) => material.gradeName
    );
    return {
      itemName:Form.createFormField ({
          ...props.materialDV?.DVMaterialID?.itemName,
          value: props.materialDV?.DVMaterialID?.itemName|| '',
      }),
      itemCode:Form.createFormField ({
          ...props.materialDV?.DVMaterialID?.itemCode,
          value: props.materialDV?.DVMaterialID?.itemCode|| '',
      }),
      itemHsnCode:Form.createFormField ({
          ...props.materialDV?.DVMaterialID?.itemHsnCode,
          value: props.materialDV?.DVMaterialID?.itemHsnCode|| '',
      }),
      itemGradeId:Form.createFormField ({
          ...props.materialDV?.DVMaterialID?.itemGradeId,
          value: props.materialDV?.DVMaterialID?.itemGradeId|| '',
      }),
      categoryId:Form.createFormField ({
          ...props.materialDV?.DVMaterialID?.categoryEntity?.categoryId,
          value: props.materialDV?.DVMaterialID?.categoryEntity?.categoryId|| '',
      }),
      subCategoryId:Form.createFormField ({
          ...props.materialDV?.DVMaterialID?.subCategoryEntity?.subcategoryId,
          value: props.materialDV?.DVMaterialID?.subCategoryEntity?.subcategoryId|| '',
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
  deleteDVMaterial,
  fetchManufacturerList,
  fetchItemGradeList
})(addMaterialDVForm);
