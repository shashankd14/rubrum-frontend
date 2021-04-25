import React from "react";
import {connect} from "react-redux";
import moment from "moment";
import {setInwardDetails} from "../../../../appRedux/actions";
import {Button, Col, Form, Icon, Input, Row, DatePicker, Card} from "antd";
import {formItemLayout} from "../Create";

import {APPLICATION_DATE_FORMAT} from '../../../../constants/index';

const InvoiceDetailsForm = (props) => {
    const {getFieldDecorator} = props.form;

    const handleSubmit = e => {
        e.preventDefault();

        props.form.validateFields((err, values) => {
            if (!err) {
                props.updateStep(3);
            }
        });
    };

    React.useEffect(() => {
        console.log(props.inward);
    }, [])
    let dimensionEdit = `${props.inward.fWidth} X ${props.inward.fThickness} X ${props.inward.fLength}`;
    let dimension = `${props.inward.width} X ${props.inward.thickness} X ${props.inward.length}`
    return (
        <>
            <Col span={14}>
                <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4">
                    <Form.Item label="Received Date">
                        {getFieldDecorator('receivedDate', {
                            initialValue: moment(new Date(), APPLICATION_DATE_FORMAT),
                            rules: [{ required: true, message: 'Please select a received date' }],
                        })(
                            <DatePicker
                                style={{width: 200}}
                                className="gx-mb-3 gx-w-100"
                                defaultValue={moment(new Date(), APPLICATION_DATE_FORMAT)}
                                format={APPLICATION_DATE_FORMAT}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="Batch No.">
                        {getFieldDecorator('batchNo', {
                            rules: [{ required: false, message: 'Please select a received date' }],
                        })(
                            <Input id="batchNo" />
                        )}
                    </Form.Item>
                    <Form.Item label="Vehicle number">
                        {getFieldDecorator('vehicleNumber', {
                            rules: [{ required: true, message: 'Please enter Vehicle Number' }],
                        })(
                            <Input id="vehicleNumber" />
                        )}
                    </Form.Item>
                    <Form.Item label="Invoice number">
                        {getFieldDecorator('invoiceNumber', {
                            rules: [{ required: true, message: 'Please enter invoice Number' }],
                        })(
                            <Input id="invoiceNumber" />
                        )}
                    </Form.Item>
                    <Form.Item label="Invoice date">
                        {getFieldDecorator('invoiceDate', {
                            initialValue: moment(new Date(), APPLICATION_DATE_FORMAT),
                            rules: [{ required: false, message: 'Please select a received date' }],
                        })(
                            <DatePicker
                                style={{width: 200}}
                                className="gx-mb-3 gx-w-100"
                                defaultValue={moment(new Date(), APPLICATION_DATE_FORMAT)}
                                format={APPLICATION_DATE_FORMAT}
                            />
                        )}
                    </Form.Item>
                    <Row className="gx-mt-4">
                        <Col span={24} offset={4} style={{ textAlign: "center"}}>
                            <Button style={{ marginLeft: 8 }} onClick={() => props.updateStep(1)}>
                                <Icon type="left"/>Back
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Forward<Icon type="right"/>
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Col>
            <Col span={10} className="gx-pt-4">
                <Card title="Coil Details" style={{ width: 300 }}>
                    <p>Customer Name : {props.inward.partyName}</p>
                    {props.inward.customerId && <p>Customer Id : {props.inward.customerId}</p>}
                    {props.inward.customerBatchNo && <p>Customer Batch No : {props.inward.customerBatchNo}</p>}
                    {props.inward.customerInvoiceNo && <p>Customer Invoice No : {props.inward.customerInvoiceNo}</p>}
                    {props.inward.purposeType && <p>Purpose Type : {props.inward.purposeType}</p>}
                    <p>Coil number : {props.inward.coilNumber}</p>
                    <p>Material Description : {props.params !== ""? props.inward.material.description : props.inward.description}</p>
                    <p>Dimensions : {props.params !== "" ? dimensionEdit:dimension}</p>
                    <p>Net Weight : {props.inward.netWeight}</p>
                    <p>Gross Weight : {props.inward.grossWeight}</p>
                </Card>
            </Col>
        </>
    )
}

const mapStateToProps = state => ({
    inward: state.inward.inward,
    material: state.material,
    inwardStatus: state.inward,
});

const InvoiceDetails = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            receivedDate: Form.createFormField({
                ...props.inward.receivedDate,
                value: (props.inward.receivedDate) ? props.inward.receivedDate : moment(new Date(), APPLICATION_DATE_FORMAT),
            }),
            batchNo: Form.createFormField({
                ...props.inward.batchNo,
                value: (props.inward.batchNo) ? props.inward.batchNo : '',
            }),
            vehicleNumber: Form.createFormField({
                ...props.inward.vehicleNumber,
                value: (props.inward.vehicleNumber) ? props.inward.vehicleNumber : '',
            }),
            invoiceNumber: Form.createFormField({
                ...props.inward.invoiceNumber,
                value: (props.inward.invoiceNumber) ? props.inward.invoiceNumber : '',
            }),
            invoiceDate: Form.createFormField({
                ...props.inward.invoiceDate,
                value: (props.inward.invoiceDate) ? props.inward.invoiceDate : moment(new Date(), APPLICATION_DATE_FORMAT),
            }),
        };
    },
    onValuesChange(props, values) {
        props.setInwardDetails({ ...props.inward, ...values});
    },
})(InvoiceDetailsForm);

export default connect(mapStateToProps, {
    setInwardDetails,
})(InvoiceDetails);
