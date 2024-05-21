import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {setInwardDVDetails, checkCustomerBatchNumber} from "../../../../appRedux/actions";
import {Form, Spin, AutoComplete, Icon, Button, Col, Row, Input, Select, Card} from "antd";
import {formItemLayout} from '../Create';
import {fetchVendorList} from "../../../../appRedux/actions";
const Option = Select.Option;

const CreateVendorDetailsForm = (props) => {
    const {getFieldDecorator, setFieldsValue } = props.form;
   
    // useEffect(() => {
    //     if (props.params !== '') {
    //         props.inward.customerId = props.inward.party?.nPartyId || '';
    //         props.inward.customerBatchNo = props.inward.customerBatchId;
    //     }
    // }, [props.params])

    const handleSubmit = e => {
        debugger
        e.preventDefault();

        props.form.validateFields((err, values) => {
            if (!err) {
                props.updateStep(2);
            }
        });
    };
    console.log("22222")

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

    return (
        <>
        <Col span={16}>
                <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4" style={{"width":"70%"}}>
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
                </Card>
            </Col>
        </>
    )
}

const mapStateToProps = state => ({
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
