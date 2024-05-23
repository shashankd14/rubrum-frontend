import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {setInwardDVDetails, fetchDVMaterialList, checkCustomerBatchNumber, generateConsignmentId, fetchLocationList, fetchVendorList, fetchDocumentTypeList} from "../../../../appRedux/actions";
import {Form, Spin, AutoComplete, Icon, Button, Col, Row, Input, Select, Card, DatePicker, Collapse} from "antd";
import {formItemLayout} from '../Create';
import { APPLICATION_DATE_FORMAT } from '../../../../constants';
import moment from "moment";
import { useHistory } from 'react-router-dom';

const Option = Select.Option;
const { Panel } = Collapse;
const widthStyle = {
    width: '50%',
  };

const CreateInwardDocPage2 = (props) => {
    const {getFieldDecorator, setFieldsValue} = props.form;
   const [totalInwardVolume, setTotalInwardVolume] = useState();
    useEffect(() => {     
        props.generateConsignmentId({
            fieldName: "CONSIGNMENT",
            ipAddress: "1.1.1.1",
            requestId: "GENERATE_SEQ",
            userId: ""
        })
        props.fetchLocationList({
            searchText:'',
            pageNo:"1",
            pageSize:"15",
            ipAddress: "1.1.1.1",
            requestId: "LOCATION_LIST_GET",
            userId: ""
        });
        props.fetchVendorList({
            searchText:"",
            pageNo: "1",
            pageSize: "15",
            ipAddress: "1.1.1.1",
            requestId: "VENDOR_LIST_GET",
            userId: ""
        });
        props.fetchDocumentTypeList({
            ipAddress: "1.1.1.1",
            requestId: "VENDOR_LIST_GET",
            userId: ""
        });
        props.fetchDVMaterialList({
            searchText:"",
            pageNo: "1",
            pageSize: "15",
            ipAddress: "1.1.1.1",
            requestId: "MATERIAL_LIST_GET",
            userId: ""
        });
        const totalInwardVolume = props.inwardDV.totalInwardVolume;
        setTotalInwardVolume(totalInwardVolume);
    }, []);

    const handleSubmit = e => {
        props.updateStep(5);
        e.preventDefault();
         props.setInwardDVDetails({ ...props.inwardDV, totalInwardVolume: totalInwardAdd? totalInwardAdd : totalInwardVolume});
        props.form.validateFields((err, values) => {
            if (!err) {
                props.updateStep(5);
            }
        });
    };
    const handleChangeDate = (date, dateString) => {
        props.form.setFieldsValue({
            documentDate: moment(dateString, APPLICATION_DATE_FORMAT),
        });
      };
      const handleChangeEwayBillDate = (date, dateString) => {
        props.form.setFieldsValue({
            ewayBillDate: moment(dateString, APPLICATION_DATE_FORMAT),
        });
      };

      const [vendorName, setVendorName] = useState();
      useEffect(() => {
        if (vendorName !== undefined){
        const vendorId = props.inwardDV.vendorName;
        let vendorName = '';
            const response = props.vendor.content
            const selectedVendorName = response.find(vendor => vendor.vendorId === vendorId);
            vendorName = selectedVendorName.vendorName;
        setVendorName(vendorName);
        }
       
      },[props.vendor])

      const getItemDetails = (itemId) => {
        return props.material?.DVMaterialList?.content?.find(materialItem => materialItem.itemId === itemId);
      };
 
     const [totalInwardAdd, setTotalInwardAdd] = useState(0);
    
  const handleExtraChargesChange = (allValues = {}) => {
    debugger
    const {
      frieghtCharges = 0,
      addInsurance = 0,
      loadingAndUnloading = 0,
      weightmenCharges = 0,
      addSGST = 0,
      addCGST = 0,
      addIGST = 0,
    } = allValues;
    const totalAdditionalCharges = [
      frieghtCharges,
      addInsurance,
      loadingAndUnloading,
      weightmenCharges,
      addSGST,
      addCGST,
      addIGST,
    ].reduce((acc, value) => acc + (parseFloat(value) || 0), 0);
    const totalInward = totalAdditionalCharges + (props.inwardDV.totalVolume || 0);
    setTotalInwardAdd(totalInward);
  };

  useEffect(() => {
    const initialValues = props.form.getFieldsValue([
      'frieghtCharges',
      'addInsurance',
      'loadingAndUnloading',
      'weightmenCharges',
      'addSGST',
      'addCGST',
      'addIGST',
    ]);
    handleExtraChargesChange(initialValues);
  }, [props.form]);
    
    return (
        <>
        <Col span={24} className="gx-ml-2">
                 <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4">
                   
                    <div>
                         <Row gutter={16}>
                            <Col span={8} ></Col>
                            <Col span={4} style={{textAlign: 'center'}}>Net Weight</Col>
                            <Col span={4} style={{textAlign: 'center'}}>Rate</Col>
                            <Col span={4} style={{textAlign: 'center'}}>Value</Col>
                        </Row>
                            {props.inwardDV?.itemsList?.map((item, index) => {
                        const itemDetails = getItemDetails(item.itemId);
                        return (
                        <Row gutter={16} key={index}>
                            <Col span={8}>
                            <Collapse>
                                {itemDetails && (
                                <Panel header={`${itemDetails.itemName}: ${itemDetails.categoryEntity?.categoryName || '-'} | ${itemDetails.subCategoryEntity?.subcategoryName || '-'}`} key={index}>
                                    <p>Item HSN code: {itemDetails.itemHsnCode}</p>
                                    <p>Item code: {itemDetails.itemCode}</p>
                                    <p>Item grade: {itemDetails.itemGrade}</p>
                                    <p>Item ID: {itemDetails.itemId}</p>
                                    <p>Main category: {itemDetails.categoryEntity?.categoryName || '-'}</p>
                                    <p>Sub category: {itemDetails.subCategoryEntity?.subcategoryName || '-'}</p>
                                    <p>Main category HSN code: {itemDetails.categoryEntity?.categoryHsnCode || '-'}</p>
                                    <p>Display name: {itemDetails.categoryEntity?.displayName || '-'}</p>
                                    <p>Brand name: {itemDetails.categoryEntity?.brandName || '-'}</p>
                                    <p>Manufacturers name: {itemDetails.categoryEntity?.manufacturerName || '-'}</p>
                                    <p>Per Meter: {itemDetails.perMeter}</p>
                                    <p>Per Feet: {itemDetails.perFeet}</p>
                                    <p>Per Pc: {itemDetails.perPC}</p>
                                    <p>Additional Parameters:</p>
                                    <ul>
                                    {itemDetails.additionalParams && JSON.parse(itemDetails.additionalParams).map((param, paramIndex) => (
                                        <li key={paramIndex}>
                                        {param.parameterName}: {param.units} {param.unitType}
                                        </li>
                                    ))}
                                    </ul>
                                    {itemDetails.itemImage && <img src={itemDetails.itemImage} alt="Item Image" />}
                                    {itemDetails.crossSectionalImage && <img src={itemDetails.crossSectionalImage} alt="Cross-sectional Image" />}
                                </Panel>
                                )}
                            </Collapse>
                               
                            </Col>
                            <Col span={4}>
                                <Input value={item.netWeight} readOnly />
                            </Col>
                            <Col span={4}>
                                <Input value={item.rate} readOnly />
                            </Col>
                            <Col span={4}>
                                <Input value={item.volume} disabled /> {/* Calculate value */}
                            </Col>
                            </Row>
                    );
                })}
                        <div className="gx-mt-4" style={{ backgroundColor: 'rgba(135, 206, 235, 0.2)', padding: '5px' }} >
                        <Row gutter={10} >
                            <Col span={8} className="gx-mt-2" style={{textAlign: 'right'}}>
                            <h3>Total</h3> 
                            </Col>
                            <Col span={4}>
                            <Input value={props.inwardDV.totalWeight} style={{ backgroundColor: 'blue', color: 'white' }} />
                            </Col>
                            <Col span={4}></Col>
                            <Col span={4}>
                            <Input value={props.inwardDV.totalVolume} style={{ backgroundColor: 'blue', color: 'white' }} />
                            </Col>
                        </Row>
                        </div>
                    </div>
                    <hr className="gx-mt-4"/>
                    <Col span={20} className="gx-mt-1">
                        <h3>Add Extra Charges</h3>
                        <Form.Item label="Select an option">
                        {getFieldDecorator('options', {
                            rules: [{ required: true, message: 'Please select a option!' }],
                        })(
                            <Select placeholder="Select an option" style={widthStyle}>
                                <Option value="OPTION-1">OPTION-1</Option>
                                <Option value="OPTION-2">OPTION-2</Option>
                                <Option value="OPTION-3">OPTION-3</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="Add Frieght Charges">
                    {getFieldDecorator('frieghtCharges', {
                       initialValue:0
                    })(
                        <Input id="frieghtCharges"  style={widthStyle} onChange={handleExtraChargesChange}/>
                    )}
                </Form.Item>
                <Form.Item label="Add Insurance">
                    {getFieldDecorator('addInsurance', {
                       initialValue:0
                       
                    })(
                        <Input id="addInsurance"style={widthStyle} onChange={handleExtraChargesChange}/>
                    )}
                </Form.Item>
                <Form.Item label="Add Loading and Unloading Charges">
                    {getFieldDecorator('loadingAndUnloading', {
                       
                    })(
                        <Input id="loadingAndUnloading"  style={widthStyle} onChange={handleExtraChargesChange}/>
                    )}
                </Form.Item>
                <Form.Item label="Add weightmen Charges">
                    {getFieldDecorator('weightmenCharges', {
                       
                    })(
                        <Input id="weightmenCharges"  style={widthStyle} onChange={handleExtraChargesChange}/>
                    )}
                </Form.Item>
                <Form.Item label="Add SGST">
                    {getFieldDecorator('addSGST', {
                       
                    })(
                        <Input id="addSGST" style={widthStyle} onChange={handleExtraChargesChange}/>
                    )}
                </Form.Item>
                <Form.Item label="Add CGST">
                    {getFieldDecorator('addCGST', {
                       
                    })(
                        <Input id="addCGST" style={widthStyle} onChange={handleExtraChargesChange}/>
                    )}
                </Form.Item>
                <Form.Item label="Add IGST">
                    {getFieldDecorator('addIGST', {
                       
                    })(
                        <Input id="addIGST" style={widthStyle} onChange={handleExtraChargesChange}/>
                    )}
                </Form.Item>
                <Form.Item label="Total Inward Value">
                    {getFieldDecorator('totalInwardVolume', {
                        initialValue:  props.inwardDV.totalInwardVolume ?  props.inwardDV.totalInwardVolume : totalInwardAdd
                    })(
                         <Input id="totalInwardVolume" disabled value={props.inwardDV.totalInwardVolume ?  props.inwardDV.totalInwardVolume : totalInwardAdd} style={widthStyle}/>
                    )}
                </Form.Item>
                </Col>
                    <Row className="gx-mt-4">
                        <Col span={20} offset={4} style={{ textAlign: "center"}}>
                            <Button style={{ marginLeft: 4 }} onClick={() => props.updateStep(3)}>
                                <Icon type="left"/>Back
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Forward<Icon type="right"/>
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Col>
        </>
    )
}

const mapStateToProps = state => ({
    party: state.party,
    inward: state.inward.inward,
    inwardStatus: state.inward,
    consignmentId: state.inwardDV.consignmentId,
    location: state.location,
    inwardDV: state.inwardDV.inward,
    vendor: state.vendor.vendorList,
    document: state.documentType.documentTypeList,
    material: state.materialDV,
});

const InwardDocPage2 = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
             options: Form.createFormField({
                ...props.inward.options,
                value: (props.inwardDV.options) ? props.inwardDV.options : props.inwardDV.extraChargesOption,
            }),
            frieghtCharges: Form.createFormField({
                ...props.inwardDV.frieghtCharges,
                value: (props.inwardDV.frieghtCharges) ? props.inwardDV.frieghtCharges : props.inwardDV.freightCharges,
            }),
            addInsurance: Form.createFormField({
                ...props.inwardDV.addInsurance,
                value: (props.inwardDV.addInsurance) ? props.inwardDV.addInsurance :  props.inwardDV.insuranceAmount,
            }),
            loadingAndUnloading: Form.createFormField({
                ...props.inwardDV.loadingAndUnloading,
                value: (props.inwardDV.loadingAndUnloading) ? props.inwardDV.loadingAndUnloading : props.inwardDV.loadingCharges,
            }),
            weightmenCharges: Form.createFormField({
                ...props.inwardDV.weightmenCharges,
                value: (props.inwardDV.weightmenCharges) ? props.inwardDV.weightmenCharges : '',
            }),
            addSGST: Form.createFormField({
                ...props.inwardDV.addSGST,
                value: (props.inwardDV.addSGST) ? props.inwardDV.addSGST : props.inwardDV.sgst,
            }),
            addCGST: Form.createFormField({
                ...props.inwardDV.addCGST,
                value: (props.inwardDV.addCGST) ? props.inwardDV.addCGST : props.inwardDV.cgst,
            }),
            addIGST: Form.createFormField({
                ...props.inwardDV.addIGST,
                value: (props.inwardDV.addIGST) ? props.inwardDV.addIGST : props.inwardDV.igst,
            })
        };
    },
    onValuesChange(props, values) {
        props.setInwardDVDetails({ ...props.inwardDV, ...values});
    },
})(CreateInwardDocPage2);

export default connect(mapStateToProps, {
    setInwardDVDetails,
    checkCustomerBatchNumber,
    generateConsignmentId,
    fetchLocationList,
    fetchVendorList,
    fetchDocumentTypeList,
    fetchDVMaterialList
})(InwardDocPage2);
