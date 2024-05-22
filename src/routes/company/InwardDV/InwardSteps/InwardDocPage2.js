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
    }, []);

    useEffect(() => {
        if (props.params !== '') {
            props.inward.customerId = props.inward.party?.nPartyId || '';
            props.inward.customerBatchNo = props.inward.customerBatchId;
        }
    }, [props.params])

    const handleSubmit = e => {
        debugger
        props.updateStep(5);
        e.preventDefault();
        props.setInwardDVDetails({ ...props.inwardDV, totalInwardValume: totalInwardAdd});
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

      const [vendorBatchNo, setVendorBatchNo] = useState();
      const [vendorName, setVendorName] = useState();
      useEffect(() => {
        debugger
        if (vendorName !== undefined){
        const vendorId = props.inwardDV.vendorName;
        let vendorBatchNo = '';
        let vendorName = '';
            const response = props.vendor.content
            const selectedVendorName = response.find(vendor => vendor.vendorId === vendorId);
            vendorName = selectedVendorName.vendorName;
        setVendorBatchNo(vendorBatchNo);
        setVendorName(vendorName);
        }
       
      },[props.vendor])

      const getItemDetails = (itemId) => {
        return props.material?.DVMaterialList?.content?.find(materialItem => materialItem.itemId === itemId);
      };

    //   const totalInwardVolume = 
    const [totalInwardAdd, setTotalInwardAdd] = useState(0);
    const handleExtraChargesChange = () => {
        debugger
        const extraCharges = props.form.getFieldsValue([
            'frieghtCharges', 'addInsurance', 'loadingAndUnloading', 'weightmenCharges', 'addSGST', 'addCGST', 'addIGST'
        ]);
        const totalAdditionalCharges = Object.values(extraCharges).reduce((acc, value) => acc + (parseFloat(value) || 0), 0);
        const totalInward = totalAdditionalCharges + (props.inwardDV.totalVolume || 0);
        // setFieldsValue({
        //     totalInwardValume: totalInward,
        // });
         setTotalInwardAdd(totalInward);
    };
    
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
                       
                    })(
                        // <Input id="frieghtCharges" onChange= {props.params!=="" ?(e) =>handleChange(e,'frieghtCharges'):""} style={widthStyle}/>
                        <Input id="frieghtCharges"  style={widthStyle} onChange={handleExtraChargesChange}/>
                    )}
                </Form.Item>
                <Form.Item label="Add Insurance">
                    {getFieldDecorator('addInsurance', {
                       
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
                    {getFieldDecorator('totalInwardValume', {
                       initialValue: props.inwardDV?.totalInwardVolume ? props.inwardDV?.totalInwardVolume : totalInwardAdd
                    })(
                        <Input id="totalInwardValume" disabled value={props.inwardDV?.totalInwardVolume? props.inwardDV.totalInwardVolume : totalInwardAdd} style={widthStyle}/>
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
            {/* } */}
            </Col>
            {/* <Col span={8} className="gx-pt-4">
                <Card title="Inward Details" style={{ width: 400 }}>
                    {props.inward.purposeType && <p>Purpose Type : {props.inward.purposeType}</p>}
                    <p>Vendor Name : {props.params !== "" }</p>
                    <p>Vendor ID :  </p>
                    <p>Vendor Batch No. :  </p>
                    <p>Item Name : Chips {props.params !== "" } </p>
                    <p>Net Weight :  {props.params !== "" } </p>
                    <p>Item Name : Chips {props.params !== "" } </p>
                    <p>Net Weight :  {props.params !== "" } </p>
                </Card>
            </Col> */}
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
                value: (props.inwardDV.options) ? props.inwardDV.options : '',
            }),
            frieghtCharges: Form.createFormField({
                ...props.inwardDV.frieghtCharges,
                value: (props.inwardDV.frieghtCharges) ? props.inwardDV.frieghtCharges : '',
            }),
            addInsurance: Form.createFormField({
                ...props.inwardDV.addInsurance,
                value: (props.inwardDV.addInsurance) ? props.inwardDV.addInsurance : '',
            }),
            loadingAndUnloading: Form.createFormField({
                ...props.inwardDV.loadingAndUnloading,
                value: (props.inwardDV.loadingAndUnloading) ? props.inwardDV.loadingAndUnloading : '',
            }),
            weightmenCharges: Form.createFormField({
                ...props.inwardDV.weightmenCharges,
                value: (props.inwardDV.weightmenCharges) ? props.inwardDV.weightmenCharges : '',
            }),
            addSGST: Form.createFormField({
                ...props.inwardDV.addSGST,
                value: (props.inwardDV.addSGST) ? props.inwardDV.addSGST : '',
            }),
            addCGST: Form.createFormField({
                ...props.inwardDV.addCGST,
                value: (props.inwardDV.addCGST) ? props.inwardDV.addCGST : '',
            }),
            addIGST: Form.createFormField({
                ...props.inwardDV.addIGST,
                value: (props.inwardDV.addIGST) ? props.inwardDV.addIGST : '',
            }),
            // totalInwardValume: Form.createFormField({
            //     ...props.inwardDV.totalInwardValume,
            //     value: (props.inwardDV.totalInwardValume) ? props.inwardDV.totalInwardValume : props.totalInwardAdd,
            // }),
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
