import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {setInwardDVDetails, checkCustomerBatchNumber, generateConsignmentId, fetchLocationList, fetchVendorList, fetchDocumentTypeList} from "../../../../appRedux/actions";
import {Form, Spin, AutoComplete, Icon, Button, Col, Row, Input, Select, Card, DatePicker} from "antd";
import {formItemLayout} from '../Create';
import { APPLICATION_DATE_FORMAT } from '../../../../constants';
import moment from "moment";
import { useHistory } from 'react-router-dom';

const Option = Select.Option;

const CreateInwardDocPage1 = (props) => {
    const {getFieldDecorator} = props.form;
    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        if(props.params !=="") {
            const { Option } = AutoComplete;
            const options = props.party.partyList.filter(party => {
            if (party?.nPartyId===  props.inward.party?.nPartyId)
            return (<Option key={party.nPartyId} value={`${party.nPartyId}`}>
                    {party.partyName}
                </Option>)
            });
            setDataSource(options);
        }
    }, [props.party]);

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
    }, []);

    useEffect(() => {
        if(props.party.partyList.length > 0) {

            const { Option } = AutoComplete;
            const options = props.party.partyList.map(party => (
                <Option key={party.nPartyId} value={`${party.nPartyId}`}>
                    {party.partyName}
                </Option>
            ));
            setDataSource(options);
        }
    }, [props.party]);

    useEffect(() => {
        if (props.params !== '') {
            props.inward.customerId = props.inward.party?.nPartyId || '';
            props.inward.customerBatchNo = props.inward.customerBatchId;
        }
    }, [props.params])
    const handleChange = e =>{
        props.inward.party.partyName = e;
    }
    const handleSubmit = e => {
        debugger
        props.updateStep(4);
        e.preventDefault();

        props.form.validateFields((err, values) => {
            if (!err) {
                props.updateStep(4);
            }
        });
    };
    const checkBatchNoExist = (rule, value, callback) => {
        if (!props.inwardStatus.loading && props.inwardStatus.success && !props.inwardStatus.duplicateBatchNo) {
            return callback();
        }
        callback('The coil number already exists');
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
        const vendorId = props.inwardDV.vendorName;
        let vendorBatchNo = '';
        let vendorName = '';
        const response = props.vendor.content
            const selectedVendorName = response.find(vendor => vendor.vendorId === vendorId);
            vendorName = selectedVendorName.vendorName;
        setVendorBatchNo(vendorBatchNo);
        setVendorName(vendorName);
      },[])
      
    return (
        <>
        <Col span={16}>
            {/* {props.party.loading && <Spin className="gx-size-100 gx-flex-row gx-justify-content-center gx-align-items-center" size="large"/>}
            {props.party.partyList.length > 0 && */}
                <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4" style={{"width":"70%"}}>
                 {/* <Form {...formItemLayout} className="login-form gx-pt-4" > */}
                    <Row>
                        <Col span={12} >
                    <Form.Item label="Vendor Batch No">
                            {getFieldDecorator('vendorBatchNo', {
                          
                            })(
                                <Input id="vendorBatchNo" />
                            )}
                    </Form.Item>
                    {/* </Col>
                    </Row>
                    <Row>
                        <Col span={12}> */}
                    <Form.Item label="Consignment Id">
                            {getFieldDecorator('consignmentId', {
                            initialValue: props.consignmentId?.seqNo
                            })(
                                <Input id="consignmentId" disabled/>
                            )}
                    </Form.Item>
                    <Form.Item label="Vehicle No">
                            {getFieldDecorator('vehicleNo', {
                            // rules: [{ required: false, message: 'Please input the transporter phone no!' }],
                            })(
                                <Input id="vehicleNo" />
                            )}
                    </Form.Item>
                    <Form.Item label="Document No">
                            {getFieldDecorator('documentNo', {
                            // rules: [{ required: false, message: 'Please input the transporter phone no!' }],
                            })(
                                <Input id="documentNo" />
                            )}
                    </Form.Item>
                    <Form.Item label="Eway bill No">
                            {getFieldDecorator('ewayBillNo', {
                            // rules: [{ required: false, message: 'Please input the transporter phone no!' }],
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
                            style={{ width: "100%" }}
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
                            // mode="multiple"
                            style={{ width: "100%" }}
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
                            initialValue: moment(props.inward.receivedDate || new Date(), APPLICATION_DATE_FORMAT),
                            // rules: [{ required: true, message: 'Please select a document date' }],
                        })(
                            <DatePicker
                                 style={{width: 260}}
                                // className="gx-mb-3 gx-w-100"
                                format={APPLICATION_DATE_FORMAT}
                                onChange={handleChangeDate}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="Eway Bill Date">
                        {getFieldDecorator('ewayBillDate', {
                            initialValue: moment(props.inward.ewayBilldDate || new Date(), APPLICATION_DATE_FORMAT),
                            // rules: [{ required: true, message: 'Please select a eway bill date' }],
                        })(
                            <DatePicker
                                 style={{width: 260}}
                                // className="gx-mb-3 gx-w-100"
                                format={APPLICATION_DATE_FORMAT}
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
                            {/* <Button type="primary" onClick={handleSubmit}>
                                Forward
                            </Button> */}
                        </Col>
                    </Row>
                </Form>
            {/* } */}
            </Col>
            <Col span={8} className="gx-pt-4">
                <Card title="Inward Details" style={{ width: 400 }}>
                    {props.inwardDV.purposeType && <p>Purpose Type : {props.inwardDV.purposeType}</p>}
                    {props.inwardDV.vendorName && <p>Vendor Name : { vendorName}</p>}
                    {props.inwardDV.vendorId && <p>Vendor ID : {props.inwardDV.vendorName}</p>}
                    {props.inwardDV.vendorBatchNo && <p>Vendor BatchNo : {vendorBatchNo}</p>}
                    {props.inwardDV.itemName && <p>Item Name : {props.inwardDV.itemName}</p>}
                    <p>Net Weight :   </p>
                    <p>Item Name :  </p>
                    <p>Net Weight :   </p>
                </Card>
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
    document: state.documentType.documentTypeList
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
                ...props.inwardDV.consignmentId,
                // value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
                value: (props.inwardDV.consignmentId) ? props.inwardDV.vendorBatchNo : props.consignmentId?.seqNo
            }),
            vehicleNo: Form.createFormField({
                ...props.inwardDV.vehicleNo,
                // value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
                value: (props.inwardDV.vehicleNo) ? props.inwardDV.vehicleNo : ''
            }),
            documentNo: Form.createFormField({
                ...props.inwardDV.documentNo,
                // value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
                value: (props.inwardDV.documentNo) ? props.inwardDV.documentNo : ''
            }),
            ewayBillNo: Form.createFormField({
                ...props.inwardDV.ewayBillNo,
                // value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
                value: (props.inwardDV.ewayBillNo) ? props.inwardDV.ewayBillNo : ''
            }),
            locationId: Form.createFormField({
                ...props.inwardDV.locationId,
                // value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
                value: (props.inwardDV.locationId) ? props.inwardDV.locationId : ''
            }),
            documentType: Form.createFormField({
                ...props.inwardDV.documentType,
                // value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
                value: (props.inwardDV.documentType) ? props.inwardDV.documentType : ''
            }),
            documentDate: Form.createFormField({
                ...props.inwardDV.documentDate,
                // value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
                value: (props.inwardDV.documentDate) ? props.inwardDV.documentDate : ''
            }),
            ewayBillDate: Form.createFormField({
                ...props.inwardDV.ewayBillDate,
                // value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
                value: (props.inwardDV.ewayBillDate) ? props.inwardDV.ewayBillDate : ''
            }),
            valueOfGoods: Form.createFormField({
                ...props.inwardDV.valueOfGoods,
                // value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
                value: (props.inwardDV.valueOfGoods) ? props.inwardDV.valueOfGoods : ''
            }),
            partyName: Form.createFormField({
                ...props.inward.partyName,
                value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
            }),
            customerId: Form.createFormField({
                ...props.inward.customerId,
                value: props.params !== "" ? props.inward.party?.nPartyId:(props.inward.customerId) ? props.inward.customerId : props.inward.partyName,
            }),
            customerBatchNo: Form.createFormField({
                ...props.inward.customerBatchNo,
                value: props.params !== "" ? props.inward.customerBatchId:(props.inward.customerBatchNo) ? props.inward.customerBatchNo : '',
            }),
            customerInvoiceNo: Form.createFormField({
                ...props.inward.customerInvoiceNo,
                value: (props.inward.customerInvoiceNo) ? props.inward.customerInvoiceNo : '',
            }),
            purposeType: Form.createFormField({
                ...props.inward.purposeType,
                value: (props.inward.purposeType) ? props.inward.purposeType : '',
            }),
            locationId: Form.createFormField({
                ...props.inwardDV.locationId,
                value: (props.inwardDV.locationId) ? props.inwardDV.locationId : '',
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
    fetchDocumentTypeList
})(InwardDocPage1);
