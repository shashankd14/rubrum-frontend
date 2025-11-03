import React from "react";
import {connect} from "react-redux";
import moment from "moment";
import {setInwardDetails} from "../../../../appRedux/actions";
import {Button, Col, Form, Icon, Input, Row, DatePicker, Card} from "antd";
import {formItemLayout} from "../Create";

import {APPLICATION_DATE_FORMAT} from '../../../../constants/index';

const InvoiceDetailsForm = props => {
    const {getFieldDecorator } = props.form;

    const handleSubmit = e => {
        e.preventDefault();

        props.form.validateFields((err, values) => {
            if (!err) {
                props.updateStep(3);
            }
        });
    };

    const handleChange = (e, path) => {
        const { value } = e.target;
        props.inward[path] = value || '';
    }

    const handleChangeDate = (date, dateString) => {
        props.form.setFieldsValue({
            receivedDate: moment(dateString, APPLICATION_DATE_FORMAT),
        });
      };

      const handleChangeDateInvoice = (date) => {
        props.form.setFieldsValue({
            invoiceDate: moment(date, APPLICATION_DATE_FORMAT),
        });
      };

    React.useEffect(() => {
        if (props.params !== '') {
            props.inward.batchNo = props.inward.batchNumber;
            props.inward.tdcNo = props.inward.tdcNo;
            props.inward.vehicleNumber = props.inward.vLorryNo;
            props.inward.invoiceNumber = props.inward.vInvoiceNo;
        }
    }, [props.params])

    const partyName =(partyList) =>{
        partyList = partyList.find(item => item.nPartyId===Number(props.inward?.partyName))
        return partyList.partyName
    }
    let dimensionEdit = `${props.inward.fWidth} X ${props.inward.fThickness} X ${props.inward.fLength}`;
    let dimension = `${props.inward.width} X ${props.inward.thickness} X ${props.inward.length}`;
    return (
      <>
        <Col span={14}>
          <Form
            {...formItemLayout}
            onSubmit={handleSubmit}
            className="login-form gx-pt-4"
          >
            <Form.Item label="Received Date">
              {getFieldDecorator("receivedDate", {
                initialValue: moment(
                  props.inward.receivedDate || new Date(),
                  APPLICATION_DATE_FORMAT
                ),
                rules: [
                  { required: true, message: "Please select a received date" },
                ],
              })(
                <DatePicker
                  style={{ width: 200 }}
                  className="gx-w-100"
                  format={APPLICATION_DATE_FORMAT}
                  onChange={handleChangeDate}
                />
              )}
            </Form.Item>
            {/* <Form.Item label="Batch No.">
                        {getFieldDecorator('batchNo', {
                            rules: [{ required: false, message: 'Please select a Batch No' }],
                        })(
                            <Input id="batchNo" />
                        )}
                    </Form.Item> */}
            <Form.Item label="Vehicle number">
              {getFieldDecorator("vehicleNumber", {
                rules: [
                  { required: true, message: "Please enter Vehicle Number" },
                ],
              })(
                <Input
                  id="vehicleNumber"
                  onChange={(e) => handleChange(e, "vehicleNumber")}
                />
              )}
            </Form.Item>
            <Form.Item label="Value of Goods">
              {getFieldDecorator("valueOfGoods", {
                rules: [
                  { required: true, message: "Please enter value of goods" },
                ],
              })(<Input id="valueOfGoods" />)}
            </Form.Item>
            <Form.Item label="Invoice date">
              {getFieldDecorator("invoiceDate", {
                initialValue: moment(
                  props.inward.invoiceDate || new Date(),
                  APPLICATION_DATE_FORMAT
                ),
                rules: [
                  { required: true, message: "Please select a received date" },
                ],
              })(
                <DatePicker
                  style={{ width: 200 }}
                  className="gx-mb-3 gx-w-100"
                  format={APPLICATION_DATE_FORMAT}
                  onChange={handleChangeDateInvoice}
                />
              )}
            </Form.Item>
            <Row className="gx-mt-4">
              <Col span={24} offset={4} style={{ textAlign: "center" }}>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={() => props.updateStep(1)}
                >
                  <Icon type="left" />
                  Back
                </Button>
                <Button type="primary" htmlType="submit">
                  Forward
                  <Icon type="right" />
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col span={10} className="gx-pt-4">
          <Card title="Coil Details" style={{ width: 300 }}>
            <p>
              Location Name :{" "}
              {props.params !== "" && props?.inward?.party
                ? props?.inward?.party?.partyName
                : partyName(props?.party?.partyList)}
            </p>
            {props.inward.customerId && (
              <p>Location Id : {props?.inward?.customerId}</p>
            )}
            {props.inward.invoiceNumber && (
              <p>PO number : {props?.inward?.invoiceNumber?.label}</p>
            )}
            {props.inward.customerBatchNo && (
              <p>SC inward id : {props?.inward?.customerBatchNo}</p>
            )}
            {props.inward.customerInvoiceNo && (
              <p>Purchase Invoice No : {props?.inward?.customerInvoiceNo}</p>
            )}
            {props.inward.purposeType && (
              <p>Purpose Type : {props?.inward?.purposeType}</p>
            )}
            <p>Batch no. : {props?.inward?.coilNumber}</p>
            <p>
              Material Description :{" "}
              {props.params !== ""
                ? props.inward?.material?.description
                : props?.inward?.description}
            </p>
            <p>
              Dimensions : {props.params !== "" ? dimensionEdit : dimension}
            </p>
            <p>
              Net Weight :{" "}
              {props.params !== ""
                ? props?.inward?.fpresent
                : props?.inward?.netWeight}
            </p>
            <p>Gross Weight : {props?.inward?.grossWeight}</p>
          </Card>
        </Col>
      </>
    );
}

const mapStateToProps = state => ({
    inward: state.inward.inward,
    material: state.material,
    inwardStatus: state.inward,
    party: state.party
});

const InvoiceDetails = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            receivedDate: Form.createFormField({
                ...props.inward.dReceivedDate,
                 value: moment(props.inward.receivedDate || moment(props.inward.dReceivedDate) || new Date(), APPLICATION_DATE_FORMAT),
            }),
            batchNo: Form.createFormField({
                ...props.inward.batchNo,
                value:  props.inward.batchNo || '',
            }), 
            tdcNo: Form.createFormField({
                ...props.inward.tdcNo,
                value:  props.inward.tdcNo || '',
            }),
            vehicleNumber: Form.createFormField({
                ...props.inward.vehicleNumber,
                value: props.inward.vehicleNumber || '',
            }),
            valueOfGoods: Form.createFormField({
                ...props.inward.valueOfGoods,
                value: props.inward.valueOfGoods,
            }),
            invoiceDate: Form.createFormField({
                ...props.inward.dInvoiceDate,
                value: moment(props.inward.invoiceDate || moment(props.inward.dInvoiceDate) || new Date(), APPLICATION_DATE_FORMAT),
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
