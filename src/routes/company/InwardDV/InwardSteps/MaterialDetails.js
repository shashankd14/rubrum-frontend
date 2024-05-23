import React, { useEffect, useState } from 'react';
import {
  AutoComplete,
  Form,
  Input,
  Button,
  Icon,
  Row,
  Col,
  Card,
  Select,
  Collapse,
} from 'antd';
import { connect } from 'react-redux';

import { formItemLayout } from '../Create';
import {
  fetchDVMaterialList,
  fetchVendorList,
  setInwardDVDetails,
  checkIfCoilExists,
  getGradeByMaterialId,
  fetchPartyList,
} from '../../../../appRedux/actions';
import { generateInwardId } from '../../../../appRedux/actions';
const MaterialDetailsForm = (props) => {
  const Option = Select.Option;
  const { Panel } = Collapse;
  const { getFieldDecorator, setFieldsValue } = props.form;

  const handleSubmit = (e) => {
    e.preventDefault();
    props.updateStep(3);
    props.setInwardDVDetails({ ...props.inwardDV, itemsList: dataArr });

    props.form.validateFields((err, values) => {
      if (!err) {
        props.updateStep(3);

        props.setInwardDVDetails({ ...props.inwardDV, itemsList: dataArr });
      }
    });
  };

  useEffect(() => {
    props.fetchDVMaterialList({
      searchText: '',
      pageNo: '1',
      pageSize: '15',
      ipAddress: '1.1.1.1',
      requestId: 'MATERIAL_LIST_GET',
      userId: '',
    });
    props.generateInwardId({
      fieldName: 'INWARD_ITEM_ID',
      ipAddress: '1.1.1.1',
      requestId: 'GENERATE_SEQ',
      userId: '',
    });
    props.fetchVendorList({
      searchText: '',
      pageNo: '1',
      pageSize: '15',
      ipAddress: '1.1.1.1',
      requestId: 'VENDOR_LIST_GET',
      userId: '',
    });
  }, []);

  const [vendorName, setVendorName] = useState();
  useEffect(() => {
    const vendorId = props.inwardDV.vendorId;
    let vendorName = '';
    const response = props.vendor.content;
    const selectedVendorName = response.find(
      (vendor) => vendor.vendorId === vendorId
    );
       if (selectedVendorName !== undefined){
    vendorName = selectedVendorName.vendorName;
       }
    setVendorName(vendorName);
  }, []);

  const [selectedItem, setSelectedItem] = useState(null);
  const [dataArr, setDataArr] = useState(props?.inwardDV?.itemsList || []);
  const defaultDataArrProps = {
    itemId: '',
    inwardItemId: '',
    inwardId: '',
    unit: '',
    unitVolume: 0,
    netWeight: 0,
    rate: 0,
    volume: 0,
    actualNoofPieces: 0,
    theoreticalWeight: 0,
    weightVariance: 0,
    theoreticalNoofPieces: 0,
  };

  const handleAddItem = () => {
    if (selectedItem) {
      const newDataItem = {
        ...defaultDataArrProps,
        itemId: selectedItem.itemId, 
      };

      setDataArr((prevDataArr) => [...prevDataArr, newDataItem]);
      setSelectedItem(null);
    }
  };

  const handleChange = (value, option) => {
    const itemId = parseInt(option.key); // Convert to number
    const selectedItemDetails = props.materialDV.DVMaterialList.content.find(
      (item) => {
        return parseInt(item.itemId) === itemId; // Convert to number
      }
    );
    if (selectedItemDetails) {
      setSelectedItem(selectedItemDetails);
    } else {
      // Handle case where item is not found
      console.error(`Item with ID ${itemId} not found`);
    }
  };

  const calculateTheoreticalWeight = (index, value) => {
    let item = getInwardItem(dataArr[index].itemId);
    let theoreticalWeight = 0;
    if (dataArr[index].unit === 'METERS') {
        theoreticalWeight = item.perMeter * value;
    } else if (dataArr[index].unit === 'PIECES') {
        theoreticalWeight = item.perPC  * value;
    } else if (dataArr[index].unit === 'FEET') {
        theoreticalWeight = item.perFeet  * value;
    }
    dataArr[index].theoreticalWeight = theoreticalWeight;
  };

  const getInwardItem = (itemId) => {
    return props.materialDV?.DVMaterialList?.content?.find(
      (e) => e.itemId === itemId
    );
  };

  const columnLabels = [
    '',
    'Unit',
    'Unit value',
    'Net weight',
    'Rate',
    'Value',
    'Actual no.of pcs',
    'Theoretical weight',
    'Weight variance',
    'Theoretical no.of pcs',
  ];

  const [netWeight, setNetWeights] = useState(Array(dataArr.length).fill(0));
  const [selectedUnit, setSelectedUnit] = useState('meters');
  const [netWeightValues, setNetWeightValues] = useState(Array(dataArr.length).fill(''));
  const [unitValues, setUnitValues] = useState(Array(dataArr.length).fill(''));
  const [rateValues, setRateValues] = useState(Array(dataArr.length).fill(''));
  const [noOfPieces, setNoOfPieces] = useState(Array(dataArr.length).fill(''));

  const handleNetWeightChange = (e, index, value) => {
    const newValue = parseFloat(e.target.value || 0);
    const newNetWeights = [...netWeight];
    newNetWeights[index] = newValue;
    setNetWeights(newNetWeights);
    setNetWeightValues(newNetWeights);
    dataArr[index][value] = e.target.value;
    dataArr[index]['weightVariance'] = dataArr[index].theoreticalWeight - newValue
  };

  // Update unit value state when input changes
  const handleUnitChange = (e, index, value) => {
    const newUnitValues = [...unitValues];
    newUnitValues[index] = e.target.value;
    setUnitValues(newUnitValues);
    dataArr[index][value] = e.target.value;
    //for value calculation
    dataArr[index]['volume'] = dataArr[index]['rate'] * dataArr[index][value];
    calculateTotalVolumeAndWaight();
    calculateTheoreticalWeight(index, e.target.value);
  };

  // Update rate value state when input changes
  const handleRateChange = (e, index, value) => {
    const newRateValues = [...rateValues];
    newRateValues[index] = e.target.value;
    setRateValues(newRateValues);
    dataArr[index][value] = e.target.value;
    //for value calculation
    dataArr[index]['volume'] =
      dataArr[index]['unitVolume'] * dataArr[index][value];
    calculateTotalVolumeAndWaight();
  };

  function calculateTotalVolumeAndWaight() {
    let totalNetWeight = 0;
    dataArr.forEach((item) => {
      totalNetWeight += parseFloat(item.netWeight) || 0;
    });

    let volumeTotal = 0;
    dataArr.forEach((item) => {
      volumeTotal += parseFloat(item.volume) || 0;
    });
    setFieldsValue({
      totalVolume: volumeTotal,
      totalWeight: totalNetWeight,
    });
  }
  
  const onUnitChange = (e, index, value) => {
    setSelectedUnit(e);
    dataArr[index]['unit'] = e;
    calculateTheoreticalWeight(index, dataArr[index].unitVolume);
  };

  const onActualNoofPcChange = (e, index, value) =>{
    let noOfPC = [...noOfPieces];
    noOfPC[index] = e.target.value;
    setNoOfPieces(noOfPC);
    dataArr[index][value] = e.target.value;
    calculateTheoreticalNoofPc(index, e.target.value);
  }
  const calculateTheoreticalNoofPc = (index, value) => {
    let item = getInwardItem(dataArr[index].itemId);
    let theoreticalnoofPC = 0;
    let numericValue = parseFloat(value);
        theoreticalnoofPC = (item.perPC)  * (numericValue);
    dataArr[index].theoreticalNoofPieces = theoreticalnoofPC;
  };
  
  return (
    <>
      <div>
        <Form
          {...formItemLayout}
          onSubmit={handleSubmit}
          className='login-form gx-pt-4'
        >
          <Row gutter={16}>
            <Col span={14}>
              <Form.Item label='Inward ID'>
                {getFieldDecorator('inwardId', {
                  initialValue: props.inwardId?.seqNo,
                })(<Input id='inwardId' disabled />)}
              </Form.Item>
              <Form.Item label='Item Name'>
                {getFieldDecorator('itemName', {
                  rules: [
                    {
                      required: true,
                      message: 'Please select item!',
                    },
                  ],
                })(
                  <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder='Select item'
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.props.children
                        .toLowerCase()
                        .localeCompare(optionB.props.children.toLowerCase())
                    }
                    onChange={handleChange}
                    value={selectedItem && selectedItem.itemId}
                  >
                    {props.materialDV?.DVMaterialList?.content?.map(
                      (category) => (
                        <Option key={category.itemId} value={category.itemId}>
                          {`${category.itemName}: ${
                            category.categoryEntity?.categoryName || '-'
                          } | ${
                            category.subCategoryEntity?.subcategoryName || '-'
                          }`}
                        </Option>
                      )
                    )}
                  </Select>
                )}
              </Form.Item>

              <Row className='gx-mt-4'>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Button type='primary' onClick={handleAddItem}>
                    Add Item
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col span={10}>
              <Card
                title='Inward Details'
                style={{ width: 500, padding: '0.5px 0.5px' }}
              >
                {props.inwardDV.purposeType && (
                  <p>Purpose Type : {props.inwardDV.purposeType}</p>
                )}
                {props.inwardDV.vendorName && <p>Vendor Name : {props.inwardDV.vendorName? props.inwardDV.vendorName : vendorName}</p>}
                {props.inwardDV.vendorId && (
                  <p>Vendor ID : {props.inwardDV.vendorId}</p>
                )}
              </Card>
            </Col>
          </Row>
          <Col span={24}>
            <Row gutter={[16, 16]}>
              {columnLabels.map((label, index) => (
                <Col
                  key={index}
                  lg={index === 0 ? 5 : 2}
                  md={2}
                  sm={24}
                  xs={24}
                  style={{ marginLeft: index < 2 ? '10px' : 0 }}
                >
                  <span>{label}</span>
                </Col>
              ))}
            </Row>
            <Row gutter={[16, 16]} className='gx-ml-2'>
              {dataArr.map((item, index) => {
                let inwardItem = getInwardItem(item.itemId);
                // if(inwardItem !== undefined){
                return (
                  <React.Fragment key={index}>
                    <Col
                      lg={5}
                      md={5}
                      sm={24}
                      xs={24}
                      style={{ marginRight: '-20' }}
                    >
                      {/* <Form.Item style={{width: '100%'}}> */}
                      <Collapse>
                        <Panel
                          header={`${inwardItem.itemName}: ${
                            inwardItem.categoryEntity?.categoryName || '-'
                          } | ${
                            inwardItem.subCategoryEntity?.subcategoryName || '-'
                          }`}
                          key={index}
                        >
                          <p>Item HSN code: {inwardItem.itemHsnCode}</p>
                          <p>Item code: {inwardItem.itemCode}</p>
                          <p>Item grade: {inwardItem.itemCode}</p>
                          <p>Item ID: {inwardItem.itemId}</p>
                          <p>
                            Main category:{' '}
                            {inwardItem.categoryEntity?.categoryName || '-'}
                          </p>
                          <p>
                            Sub category:{' '}
                            {inwardItem.subCategoryEntity?.subcategoryName ||
                              '-'}
                          </p>
                          <p>
                            Main category HSN code:{' '}
                            {inwardItem.categoryEntity?.categoryHsnCode || '-'}
                          </p>
                          <p>
                            Display name:{' '}
                            {inwardItem.categoryEntity?.displayName || '-'}
                          </p>
                          <p>
                            Brand name:{' '}
                            {inwardItem.categoryEntity?.brandName || '-'}
                          </p>
                          <p>
                            Manufacturers name:{' '}
                            {inwardItem.categoryEntity?.manufacturerName || '-'}
                          </p>
                          <p>Per Meter: {inwardItem.perMeter}</p>
                          <p>Per Feet: {inwardItem.perFeet}</p>
                          <p>Per Pc: {inwardItem.perPC}</p>
                          <p>Additional Parameters:</p>
                          <ul>
                            {inwardItem.additionalParams &&
                              JSON.parse(inwardItem.additionalParams).map(
                                (param, paramIndex) => (
                                  <li key={paramIndex}>
                                    {param.parameterName}: {param.units}{' '}
                                    {param.unitType}
                                  </li>
                                )
                              )}
                          </ul>
                          {inwardItem.itemImage && (
                            <img src={inwardItem.itemImage} alt='Item Image' />
                          )}
                          {inwardItem.crossSectionalImage && (
                            <img
                              src={inwardItem.crossSectionalImage}
                              alt='Cross-sectional Image'
                            />
                          )}
                        </Panel>
                      </Collapse>
                    </Col>
                    <Col
                      lg={2}
                      md={2}
                      sm={24}
                      xs={24}
                      style={{ marginRight: '-20' }}
                    >
                      <Select
                        name='unit'
                        style={{ width: '100%' }}
                        value={dataArr[index]['unit']}
                        placeholder='Unit'
                        defaultValue='meters'
                        onChange={(e) => {
                          onUnitChange(e, index);
                        }}
                      >
                        <Option value='METERS'>Meters</Option>
                        <Option value='PIECES'>Pieces</Option>
                        <Option value='FEET'>Feet</Option>
                      </Select>
                    </Col>
                    <Col lg={2} md={2} sm={24} xs={24}>
                      {/* unit value */}
                      <Input
                        name='unitVolume'
                        onChange={(e) =>
                          handleUnitChange(e, index, 'unitVolume')
                        }
                        value={dataArr[index]['unitVolume']}
                      ></Input>
                    </Col>
                    <Col lg={2} md={2} sm={24} xs={24}>
                      {/* net weight */}
                      <Input
                        name='netWeight'
                        onChange={(e) =>
                          handleNetWeightChange(e, index, 'netWeight')
                        }
                        value={dataArr[index]['netWeight']}
                      ></Input>
                    </Col>
                    <Col lg={2} md={2} sm={24} xs={24}>
                      {/* Rate */}
                      <Input
                        name='rate'
                        onChange={(e) => handleRateChange(e, index, 'rate')}
                        value={dataArr[index]['rate']}
                      ></Input>
                    </Col>
                    <Col lg={2} md={2} sm={24} xs={24}>
                      {/*  value */}
                      <Input
                        name='volume'
                        value={dataArr[index]['volume']}
                        disabled
                      ></Input>
                    </Col>
                    <Col lg={2} md={2} sm={24} xs={24}>
                      {/* Actual no of pieces */}
                      <Input name='actualNoofPieces'  onChange={(e) =>
                          onActualNoofPcChange(e, index, 'actualNoofPieces')
                        }
                        value={dataArr[index]['actualNoofPieces']}></Input>
                    </Col>
                    <Col lg={2} md={2} sm={24} xs={24}>
                      {/* theoretical weight */}
                      <Input name='theoreticalWeight' value={dataArr[index]['theoreticalWeight']} disabled></Input>
                    </Col>
                    <Col lg={2} md={2} sm={24} xs={24}>
                      {/*  weight varience */}
                      <Input name='weightVariance' value={dataArr[index]['weightVariance']} disabled></Input>
                    </Col>
                    <Col lg={2} md={2} sm={24} xs={24}>
                      {/* theoretical no of pieces */}
                      <Input name='theoreticalNoofPieces' value={dataArr[index]['theoreticalNoofPieces']} disabled></Input>
                    </Col>
                  </React.Fragment>
                );
                // }
              })}
            </Row>

            <div
              className='gx-mt-4'
              style={{
                backgroundColor: 'rgba(135, 206, 235, 0.2)',
                padding: '5px',
              }}
            >
              <Row gutter={10}>
                <Col
                  span={9}
                  className='gx-mt-2'
                  style={{ textAlign: 'right' }}
                >
                  <h3>Total</h3>
                </Col>
                <Col span={3}>
                  <Form.Item>
                    {getFieldDecorator('totalWeight', {
                      initialValue: props.inwardDV.totalWeight,
                    })(
                      <Input
                        id='totalWeight'
                        value={props.inwardDV.totalWeight}
                        style={{ backgroundColor: 'blue', color: 'white' }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={3}>
                  <Form.Item>
                    {getFieldDecorator('totalVolume', {
                      initialValue: props.inwardDV.totalVolume,
                    })(
                      <Input
                        id='totalVolume'
                        value={props.inwardDV.totalVolume}
                        style={{ backgroundColor: 'blue', color: 'white' }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>
          <Col
            span={24}
            style={{ textAlign: 'left' }}
            className='gx-mt-5 gx-ml-50'
          >
            <Button
              style={{ marginLeft: 200 }}
              onClick={() => props.updateStep(1)}
            >
              <Icon type='left' />
              Back
            </Button>
            <Button type='primary' htmlType='submit'>
              Forward
              <Icon type='right' />
            </Button>
          </Col>
        </Form>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  materialDV: state.materialDV,
  inwardId: state.inwardDV.inwardId,
  material: state.materialDV,
  inwardStatus: state.inward,
  party: state.party,
  inwardDV: state.inwardDV.inward,
  vendor: state.vendor.vendorList,
});

const MaterialDetails = Form.create({
  onFieldsChange(props, changedFields) {},
  mapPropsToFields(props) {
    return {
      inwardId: Form.createFormField({
        ...props.inwardDV.inwardId,
        value: props.inwardDV.inwardId
          ? props.inwardDV.inwardId
          : props.inwardId?.seqNo,
      }),
      itemName: Form.createFormField({
        ...props.inwardDV.itemName,
        value: props.inwardDV.itemName ? props.inwardDV.itemName : '',
      }),
      totalVolume: Form.createFormField({
        // ...props.inwardDV.totalVolume,
        value: props.inwardDV.totalVolume,
      }),
      totalWeight: Form.createFormField({
        // ...props.inwardDV.totalWeight,
        value: props.inwardDV.totalWeight,
      }),
    };
  },
  onValuesChange(props, values) {
    props.setInwardDVDetails({ ...props.inwardDV, ...values });
  },
})(MaterialDetailsForm);

export default connect(mapStateToProps, {
  setInwardDVDetails,
  checkIfCoilExists,
  fetchPartyList,
  getGradeByMaterialId,
  fetchDVMaterialList,
  generateInwardId,
  fetchVendorList,
})(MaterialDetails);
