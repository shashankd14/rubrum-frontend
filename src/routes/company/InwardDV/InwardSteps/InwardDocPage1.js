import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {setInwardDVDetails, fetchDVMaterialList, checkCustomerBatchNumber, generateConsignmentId, fetchLocationList, fetchVendorList, fetchDocumentTypeList} from "../../../../appRedux/actions";
import {Form, Spin, AutoComplete, Icon, Button, Col, Row, Input, Select, Card, DatePicker} from "antd";
import {formItemLayout} from '../Create';
// import { APPLICATION_DATE_FORMAT } from '../../../../constants';
import moment from "moment";
import { useHistory } from 'react-router-dom';

const Option = Select.Option;

const CreateInwardDocPage1 = (props) => {
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
   
    const handleSubmit = e => {
        props.updateStep(4);
        e.preventDefault();

        props.form.validateFields((err, values) => {
            if (!err) {
                props.updateStep(4);
            }
        });
    };
    
    const handleChangeDate = (date, dateString) => {
        debugger
        props.form.setFieldsValue({
            documentDate: moment(dateString),
        });
      };
      const handleChangeEwayBillDate = (date, dateString) => {
        props.form.setFieldsValue({
            ewayBillDate: moment(dateString),
        });
      };

      const [vendorName, setVendorName] = useState();
      useEffect(() => {
        if (props.inwardDV.vendorName !== undefined){
        const vendorId = props.inwardDV.vendorName;
        let vendorName = '';
            const response = props.vendor.content
            const selectedVendorName = response.find(vendor => vendor.vendorId === vendorId);
            if (selectedVendorName !== undefined){
                vendorName = selectedVendorName.vendorName;
                   }
        setVendorName(vendorName);
        }
       
      },[props.vendor])

      useEffect(() => {
        setFieldsValue({
            consignmentId: props.consignmentId?.seqNo || props.inwardDV?.consignmentId,
        });
    }, [props.consignmentId?.seqNo, props.inwardDV?.consignmentId]);

    const getItemDetails = (itemId) => {
        return props.material?.DVMaterialList?.content.find(item => item.itemId === itemId);
    };
      
    return (
        <>
        <Col span={16} >
                <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4" >
                    <Row>
                        <Col span={12} >
                    <Form.Item label="Vendor Batch No">
                            {getFieldDecorator('vendorBatchNo', {
                          
                            })(
                                <Input id="vendorBatchNo" />
                            )}
                    </Form.Item>
                    <Form.Item label="Consignment Id">
                            {getFieldDecorator('consignmentId', {
                            initialValue: props.inwardDV.consignmentId
                            })(
                                <Input id="consignmentId" disabled/>
                            )}
                    </Form.Item>
                    <Form.Item label="Vehicle No">
                            {getFieldDecorator('vehicleNo', {
                             rules: [{ required: false, message: 'Please input the vehicle no!' }],
                            })(
                                <Input id="vehicleNo" />
                            )}
                    </Form.Item>
                    <Form.Item label="Document No">
                            {getFieldDecorator('documentNo', {
                             rules: [{ required: false, message: 'Please input the doc no!' }],
                            })(
                                <Input id="documentNo" />
                            )}
                    </Form.Item>
                    <Form.Item label="Eway bill No">
                            {getFieldDecorator('ewayBillNo', {
                             rules: [{ required: false, message: 'Please input the eway bill no!' }],
                            })(
                                <Input id="ewayBillNo" />
                            )}
                    </Form.Item>
                    </Col>
                    <Col span={12}>
                    <Form.Item label="Location Id">
                        {getFieldDecorator("locationId", {
                        //   rules: [
                        //     {
                        //       required: true,
                        //       message: "Please select location Id!",
                        //     },
                        //   ],
                        })(
                          <Select
                            id="locationId"
                            showSearch
                            style={{ width: 260 }}
                          >
                            {props.location?.locationList?.content?.map((party) => (
                              <Option key={party.locationId} value={party.locationId}>
                                {party.locationName}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                      <Form.Item label="Document type">
                        {getFieldDecorator("documentType", {
                        })(
                          <Select
                            id="documentType"
                            showSearch
                            style={{ width: 260 }}
                          >
                            {props.document?.map((party) => (
                              <Option key={party.docId} value={party.docId}>
                                {party.docName}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                      <Form.Item label="Document Date">
                        {getFieldDecorator('documentDate', {
                            // initialValue: moment(props.inward.receivedDate || new Date(), APPLICATION_DATE_FORMAT),
                            initialValue: props.inwardDV.documentDate ? moment(props.inwardDV.documentDate, 'YYYY-MM-DD') : moment(),
                            // rules: [{ required: true, message: 'Please select a document date' }],
                        })(
                            <DatePicker
                                 style={{width: 260}}
                                // className="gx-mb-3 gx-w-100"
                                // format={APPLICATION_DATE_FORMAT}
                                format= "YYYY-MM-DD"
                                onChange={handleChangeDate}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="Eway Bill Date">
                        {getFieldDecorator('ewayBillDate', {
                            // initialValue: moment(props.inward.ewayBilldDate || new Date(), APPLICATION_DATE_FORMAT),
                            initialValue: props.inwardDV.ewayBillDate ? moment(props.inwardDV.ewayBillDate, 'YYYY-MM-DD') : moment(),
                            // rules: [{ required: true, message: 'Please select a eway bill date' }],
                        })(
                            <DatePicker
                                 style={{width: 260}}
                                // className="gx-mb-3 gx-w-100"
                                format= "YYYY-MM-DD"
                                onChange={handleChangeEwayBillDate}
                            />
                        )}
                    </Form.Item>
                    </Col>
                    </Row>
                     <Row >
                        <Col span={24} >
                    <Form.Item label="Eway bill Value of goods">    
                            {getFieldDecorator('valueOfGoods', {
                            rules: [{ required: false, message: 'Please input the Eway bill Value of goods!' }],
                            })(
                                <Input id="valueOfGoods"/>
                            )}
                    </Form.Item>
                    </Col>
                    </Row> 
                    <Row className="gx-mt-4">
                        <Col span={24} offset={4} style={{ textAlign: "center"}}>
                            <Button style={{ marginLeft: 8 }} onClick={() => props.updateStep(2)}>
                                <Icon type="left"/>Back
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Forward<Icon type="right"/>
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Col>
            <Col span={8} className="gx-pt-4">
                <Card title="Inward Details" style={{ width: 400 }}>
                    {props.inwardDV.purposeType && <p>Purpose Type : {props.inwardDV.purposeType}</p>}
                    {props.inwardDV.vendorId && <p>Vendor ID : {props.inwardDV.vendorId}</p>}
                    {props.inwardDV.vendorName && <p>Vendor Name : { vendorName}</p>}
                    {props.inwardDV.vendorBatchNo && <p>Vendor BatchNo : {props.inwardDV.vendorBatchNo}</p>}
                    {props.inwardDV?.itemsList?.map((item, index) => {
                            const matchedItem = getItemDetails(item.itemId);
                            return (
                                <div key={index}>
                                    <p>Item ID: {item.itemId}</p>
                                    {matchedItem && (
                                        <>
                                            <p>Item Name: {matchedItem.itemName}</p>
                                            <p>Net Weight: {item.netWeight}</p>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                </Card>
            </Col>
        </>
    )
}

const mapStateToProps = state => ({
    consignmentId: state.inwardDV.consignmentId,
    location: state.location,
    inwardDV: state.inwardDV.inward,
    vendor: state.vendor.vendorList,
    document: state.documentType.documentTypeList,
    material: state.materialDV,
});

const InwardDocPage1 = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            vendorBatchNo: Form.createFormField({
                ...props.inwardDV.vendorBatchNo,
                // value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
                value: (props.inwardDV.vendorBatchNo) ? props.inwardDV.vendorBatchNo : ''
            }),
            consignmentId: Form.createFormField({
                value: props.inwardDV.consignmentId
            }),
            vehicleNo: Form.createFormField({
                ...props.inwardDV.vehicleNo,
                value: (props.inwardDV.vehicleNo) ? props.inwardDV.vehicleNo : ''
            }),
            documentNo: Form.createFormField({
                ...props.inwardDV.documentNo,
                value: (props.inwardDV.documentNo) ? props.inwardDV.documentNo : ''
            }),
            ewayBillNo: Form.createFormField({
                ...props.inwardDV.ewayBillNo,
                value: (props.inwardDV.ewayBillNo) ? props.inwardDV.ewayBillNo : ''
            }),
            locationId: Form.createFormField({
                ...props.inwardDV.locationId,
                value: (props.inwardDV.locationId) ? props.inwardDV.locationId : ''
            }),
            documentType: Form.createFormField({
                ...props.inwardDV.documentType,
                value: (props.inwardDV.documentType) ? props.inwardDV.documentType : ''
            }),
            documentDate: Form.createFormField({
                ...props.inwardDV.documentDate,
                // value: moment(props.inwardDV.documentDate || new Date(), APPLICATION_DATE_FORMAT)
                value: moment(props.inwardDV.documentDate || moment(props.inwardDV.documentDate, 'YYYY-MM-DD') || new Date()),
            }),
            ewayBillDate: Form.createFormField({
                ...props.inwardDV.ewayBillDate,
                // value: (props.inwardDV.ewayBillDate) ? props.inwardDV.ewayBillDate : ''
                value: moment(props.inwardDV.ewayBillDate || moment(props.inwardDV.ewayBillDate, 'YYYY-MM-DD') || new Date()),
            }),
            valueOfGoods: Form.createFormField({
                ...props.inwardDV.valueOfGoods,
                value: (props.inwardDV.valueOfGoods) ? props.inwardDV.valueOfGoods : ''
            }),
        };
    },
    onValuesChange(props, values) {
        props.setInwardDVDetails({ ...props.inwardDV, ...values});
    },
})(CreateInwardDocPage1);

export default connect(mapStateToProps, {
    setInwardDVDetails,
    checkCustomerBatchNumber,
    generateConsignmentId,
    fetchLocationList,
    fetchVendorList,
    fetchDocumentTypeList,
    fetchDVMaterialList
})(InwardDocPage1);
