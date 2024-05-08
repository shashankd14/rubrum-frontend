import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {setInwardDVDetails, checkCustomerBatchNumber} from "../../../../appRedux/actions";
import {Form, Spin, AutoComplete, Icon, Button, Col, Row, Input, Select, Card} from "antd";
import {formItemLayout} from '../Create';
import {fetchVendorList} from "../../../../appRedux/actions";
const Option = Select.Option;

const CreateVendorDetailsForm = (props) => {
    const {getFieldDecorator, setFieldsValue } = props.form;
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
        props.updateStep(2);
        // e.preventDefault();

        // props.form.validateFields((err, values) => {
        //     if (!err) {
        //         props.updateStep(1);
        //     }
        // });
    };
    const checkBatchNoExist = (rule, value, callback) => {
        if (!props.inwardStatus.loading && props.inwardStatus.success && !props.inwardStatus.duplicateBatchNo) {
            return callback();
        }
        callback('The coil number already exists');
    };

    useEffect(() => {
        props.fetchVendorList({
            searchText:"",
            pageNo: "1",
            pageSize: "15",
            ipAddress: "1.1.1.1",
            requestId: "VENDOR_LIST_GET",
            userId: ""
        });
    }, []);
console.log("props.inwardDV.vendorId", props.inwardDV)
    return (
        <>
        <Col span={16}>
            {props.party.loading && <Spin className="gx-size-100 gx-flex-row gx-justify-content-center gx-align-items-center" size="large"/>}
            {props.party.partyList.length > 0 &&
                // <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4" style={{"width":"70%"}}>
                <Form {...formItemLayout} className="login-form gx-pt-4" >
                     <Form.Item label="Vendor Name">
                        {getFieldDecorator("vendorName", {
                          rules: [
                            {
                              required: true,
                              message: "Please select vendor name!",
                            },
                          ],
                        })(
                          <Select
                            id="vendorName"
                            showSearch
                            style={{ width: "100%" }}
                            filterOption={(input, option) =>
                              option.props.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                          }
                          allowClear
                          onChange={(value, option) => {
                            // Set the selected vendorId to the "vendorId" input
                            setFieldsValue({ vendorId: value });
                          }}
                        >
                          {props.vendor?.vendorList?.content?.map((vendor) => (
                            <Option key={vendor.vendorId} value={vendor.vendorId}>
                              {vendor.vendorName}
                            </Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    <Form.Item label="Vendor Id">
                            {getFieldDecorator('vendorId', {
                            rules: [{ required: false, message: 'Please input the coil number!' }],
                            })(
                                <Input id="vendorId" disabled/>
                            )}
                    </Form.Item>
                    <Form.Item label="Transporter Name">
                            {getFieldDecorator('transporterName', {
                            rules: [{ required: false, message: 'Please input the transporter name!' }],
                            })(
                                <Input id="transporterName" />
                            )}
                    </Form.Item>
                    <Form.Item label="Transporter Phone no">
                            {getFieldDecorator('transporterPhoneNo', {
                            rules: [{ required: false, message: 'Please input the transporter phone no!' }],
                            })(
                                <Input id="transporterPhoneNo" />
                            )}
                    </Form.Item>
                    <Row className="gx-mt-4">
                        <Col span={24} offset={4} style={{ textAlign: "center"}}>
                            <Button style={{ marginLeft: 8 }} onClick={() => props.updateStep(0)}>
                                <Icon type="left"/>Back
                            </Button>
                            {/* <Button type="primary" htmlType="submit">
                                Forward<Icon type="right"/>
                            </Button> */}
                            <Button type="primary" onClick={handleSubmit}>
                                Forward
                            </Button>
                        </Col>
                    </Row>
                </Form>
            }
            </Col>
            <Col span={8} className="gx-pt-4">
                <Card title="Inward Details" style={{ width: 400 }}>
                    {props.inwardDV.purposeType && <p>Purpose Type : {props.inwardDV.purposeType}</p>}
                </Card>
            </Col>
        </>
    )
}

const mapStateToProps = state => ({
    party: state.party,
    inward: state.inward.inward,
    inwardStatus: state.inward,
    vendor: state.vendor,
    inwardDV: state.inwardDV.inward
});

const VendorDetailsForm = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            vendorName: Form.createFormField({
                ...props.inwardDV.vendorName,
                 value: props.inwardDV.vendorName || '',
            }),
            vendorId: Form.createFormField({
                ...props.inwardDV.vendorName,
                 value: props.inwardDV.vendorName || '',
            }),
            transporterName: Form.createFormField({
                ...props.inwardDV.transporterName,
                 value: props.inwardDV.transporterName || '',
            }),  
            transporterPhoneNo: Form.createFormField({
                ...props.inwardDV.transporterPhoneNo,
                 value: props.inwardDV.transporterPhoneNo || '',
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
        };
    },
    onValuesChange(props, values) {
        props.setInwardDVDetails({ ...props.inwardDV, ...values});
    },
})(CreateVendorDetailsForm);

export default connect(mapStateToProps, {
    setInwardDVDetails,
    checkCustomerBatchNumber,
    fetchVendorList,
})(VendorDetailsForm);
