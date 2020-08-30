import React from "react";
import {connect} from "react-redux";
import {setInwardDetails} from "../../../../appRedux/actions";
import {Form, Input, Upload, Icon, Row, Col, Button, Card} from "antd";
import {formItemLayout} from "../Create";

const QualityDetailsForm = (props) => {
    const {getFieldDecorator} = props.form;
    const { Dragger } = Upload;

    const handleSubmit = e => {
        e.preventDefault();

        props.form.validateFields((err, values) => {
            if (!err) {
                props.updateStep(4);
            }
        });
    };

    return (
        <>
            <Col span={14}>
        <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4">
            <Form.Item label="Grade">
                {getFieldDecorator('grade', {
                    rules: [{ required: false, message: 'Please select a received date' }],
                })(
                    <Input id="grade" />
                )}
            </Form.Item>
            <Form.Item label="Test Certificate No">
                {getFieldDecorator('testCertificateNo ', {
                    rules: [{ required: false, message: 'Please select a received date' }],
                })(
                    <Input id="testCertificateNo" />
                )}
            </Form.Item>
            <Form.Item label="Test File">
                {getFieldDecorator('testFile ', {
                    rules: [{ required: false, message: 'Please select a received date' }],
                })(
                    <Dragger
                        name= 'file'
                        multiple= {true}
                        beforeUpload={() => false}
                        action= ''
                            onChange = {(info) => console.log(info)}>
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                                band files
                            </p>
                    </Dragger>
                )}
            </Form.Item>
            <Form.Item label="More attachments">
                {getFieldDecorator('testFile ', {
                    rules: [{ required: false, message: 'Please select a received date' }],
                })(
                    <Dragger
                        name= 'file'
                        multiple= {true}
                        action= 'https://www.mocky.io/v2/5cc8019d300000980a055e76'
                        onChange = {(info) => console.log(info)}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                            band files
                        </p>
                    </Dragger>
                )}
            </Form.Item>
            <Form.Item label="Remarks">
                {getFieldDecorator('remarks', {
                    rules: [{ required: false, message: 'Please select a received date' }],
                })(
                    <Input id="batchNo" />
                )}
            </Form.Item>
            <Row className="gx-mt-4">
                <Col span={12} offset={4} style={{ textAlign: "center"}}>
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
            <Col span={10} className="gx-pt-4">
                <Card title="Coil Details" style={{ width: 300 }}>
                    <p>Customer Name : {props.inward.partyName}</p>
                    {props.inward.customerId && <p>Customer Id : {props.inward.customerId}</p>}
                    {props.inward.customerBatchNo && <p>Customer Batch No : {props.inward.customerBatchNo}</p>}
                    {props.inward.customerInvoiceNo && <p>Customer Invoice No : {props.inward.customerInvoiceNo}</p>}
                    {props.inward.purposeType && <p>Purpose Type : {props.inward.purposeType}</p>}
                    <p>Coil number : {props.inward.coilNumber}</p>
                    <p>Material Description : {props.inward.material}</p>
                    <p>Dimensions : {props.inward.width} X {props.inward.thickness} X {props.inward.length}</p>
                    <p>Net Weight : {props.inward.netWeight}</p>
                    <p>Gross Weight : {props.inward.grossWeight}</p>
                    {/*<p>Received Date : {props.inward.receivedDate}</p>*/}
                    {props.inward.batchNo && <p>Batch No : {props.inward.batchNo}</p>}
                    {props.inward.vehicleNumber && <p>Vehicle number : {props.inward.vehicleNumber}</p>}
                    {props.inward.invoiceNumber && <p>Invoice number : {props.inward.invoiceNumber}</p>}
                    {/*{props.inward.invoiceDate && <p>Invoice date : {props.inward.invoiceDate}</p>}*/}
                </Card>
            </Col>
            </>
    )
}

const mapStateToProps = state => ({
    inward: state.inward.inward,
});

const QualityDetails = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            grade: Form.createFormField({
                ...props.inward.grade,
                value: (props.inward.grade) ? props.inward.grade : '',
            }),
            testCertificateNo: Form.createFormField({
                ...props.inward.testCertificateNo,
                value: (props.inward.testCertificateNo) ? props.inward.testCertificateNo : '',
            }),
            remarks: Form.createFormField({
                ...props.inward.remarks,
                value: (props.inward.remarks) ? props.inward.remarks : '',
            }),
            invoiceNumber: Form.createFormField({
                ...props.inward.invoiceNumber,
                value: (props.inward.invoiceNumber) ? props.inward.invoiceNumber : '',
            }),
            invoiceDate: Form.createFormField({
                ...props.inward.invoiceDate,
                value: (props.inward.invoiceDate) ? props.inward.invoiceDate : '',
            }),
        };
    },
    onValuesChange(props, values) {
        props.setInwardDetails({ ...props.inward, ...values});
    },
})(QualityDetailsForm);

export default connect(mapStateToProps, {
    setInwardDetails,
})(QualityDetails);
