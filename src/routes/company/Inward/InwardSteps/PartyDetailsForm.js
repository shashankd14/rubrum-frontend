import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useIntl } from "react-intl";
import {
  setInwardDetails,
  checkCustomerBatchNumber,
  getPoDetails,
  fetchMaterialsByPoID,
  resetInwardForm,
  resetInwardFormPO
} from "../../../../appRedux/actions";
import { Form, Spin, Icon, Button, Col, Row, Input, Select } from "antd";
import { formItemLayout } from "../Create";
import IntlMessages from "util/IntlMessages";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const Option = Select.Option;

const CreatePartyDetailsForm = (props) => {
  const { getFieldDecorator } = props.form;
  const [value, setValue] = useState("");

  const history = useHistory();
  const intl = useIntl();

  useEffect(() => {
    props.form.setFieldsValue({
      purposeType: "STEEL SERVICE CENTRE",
      customerInvoiceNo: props.inwardStatus.saveTemporary
        ? props.inwardStatus.customerInvoiceNo
        : props.inward.customerInvoiceNo,
      invoiceNumber: props.inwardStatus.saveTemporary
        ? props.inwardStatus.invoiceNumber
        : props.inward.invoiceNumber,
      partyName: props.inwardStatus.saveTemporary
        ? props.inwardStatus.partyName
        : props.inward.partyName,
    });
  }, []);

  useEffect(() => {
    if (props.params !== "") {
      props.inward.customerId = props.inward.party?.nPartyId || "";
      props.inward.customerBatchNo = props.inward.customerBatchId;
    }
  }, [props.params]);

  const handleSubmit = (e) => {
    e.preventDefault();

    props.form.validateFields((err, values) => {
      if (!err) {
        props.updateStep(1);
      }
    });
  };
  const checkBatchNoExist = (rule, value, callback) => {
    if (
      value == "" ||
      (!props.inwardStatus.loading &&
        props.inwardStatus.success &&
        !props.inwardStatus.duplicateBatchNo)
    ) {
      return callback();
    }
    callback(
      intl.formatMessage({ id: "inward.create.label.customerBatchNoExists" })
    );
  };

  return (
    <>
      {props.party.loading && (
        <Spin
          className="gx-size-100 gx-flex-row gx-justify-content-center gx-align-items-center"
          size="large"
        />
      )}
      {props.party.partyList.length > 0 && (
        <Form
          {...formItemLayout}
          onSubmit={handleSubmit}
          className="login-form gx-pt-4"
          style={{ width: "70%" }}
        >
          <Form.Item
            label={intl.formatMessage({
              id: "inward.create.label.customerName",
            })}
          >
            {getFieldDecorator("partyName", {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage({
                    id: "inward.create.label.customerNameEmpty",
                  }),
                },
              ],
            })(
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select a location"
                optionFilterProp="children"
                onSelect={(value, option) => {
                  props.getPoDetails(value);
                }}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {props.party.partyList.map((party) => (
                  <Option key={party.nPartyId} value={`${party.nPartyId}`}>
                    {party.partyName}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: "inward.create.label.customerId" })}
          >
            {getFieldDecorator("customerId")(
              <Input id="customerId" disabled style={{ width: 200 }} />
            )}
          </Form.Item>
          <Form.Item label="PO number">
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "100%" }}>
                {getFieldDecorator("invoiceNumber", {
                  rules: [
                    { required: true, message: "Please enter PO number" },
                  ],
                })(
                  <Select
                    style={{ flex: 1, minWidth: 0 }}
                    labelInValue
                    mode="combobox"
                    optionLabelProp="label"
                    disabled={
                      props.inward.disableSelection ||
                      props.inwardStatus.saveTemporary
                    }
                    allowClear={true}
                    value={value}
                    notFoundContent={null}
                    showSearch={true}
                    placeholder="Select a PO number"
                    optionFilterProp="children"
                    showArrow={true}
                    onSelect={(poId, option) => {
                      props.fetchMaterialsByPoID(poId?.key);
                    }}
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {props.inwardStatus?.poList?.map((po) => (
                      <Option
                        key={po.poId}
                        value={`${po.poId}`}
                        label={po.poReference}
                      >
                        {po.poReference}
                      </Option>
                    ))}
                  </Select>
                )}
              </div>
              {props.inwardStatus.poDetailsLoading && (
                <Icon
                  type="loading"
                  style={{ fontSize: 24, marginLeft: "10px" }}
                  spin
                />
              )}
            </div>
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: "inward.create.label.customerBatchNo",
            })}
          >
            {getFieldDecorator("customerBatchNo", {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage({
                    id: "inward.create.label.scInwardId",
                  }),
                },
              ],
            })(<Input />)}
          </Form.Item>

          <Form.Item
            label={intl.formatMessage({
              id: "inward.create.label.customerInvoiceNo",
            })}
          >
            {getFieldDecorator("customerInvoiceNo", {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage({
                    id: "inward.create.label.purchaseInvoiceNo",
                  }),
                },
              ],
            })(
              <Input
                id="customerInvoiceNo"
                disabled={props.inwardStatus.saveTemporary}
              />
            )}
          </Form.Item>

          <Form.Item label="Purpose Type">
            {getFieldDecorator("purposeType", {
              rules: [
                { required: true, message: "Please select a purpose type!" },
              ],
            })(
              <Select placeholder="Select an option">
                <Option value="TRADING">
                  <IntlMessages id="inward.create.label.purchaseTypeTrading" />
                </Option>
                <Option value="STEEL SERVICE CENTRE">
                  <IntlMessages id="inward.create.label.purchaseTypeSSC" />
                </Option>
                <Option value="EXTERNAL PROCESS AGENT">
                  <IntlMessages id="inward.create.label.purchaseTypeEPA" />
                </Option>
              </Select>
            )}
          </Form.Item>
          <Row className="gx-mt-4">
            <Col span={12} offset={4} style={{ textAlign: "center" }}>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => history.goBack()}
              >
                <Icon type="left" />
                Back
              </Button>
              <Button type="primary" htmlType="submit">
                <IntlMessages id="Forward" />
                <Icon type="right" />
              </Button>
              {props.inward.disableSelection ||
              props.inwardStatus.saveTemporary ? (
                <Button
                  onClick={() => {
                    props.resetInwardFormPO();
                    props.form.resetFields();
                  }}
                >
                  Clear form
                </Button>
              ) : null}
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  party: state.party,
  inward: state.inward.inward,
  inwardStatus: state.inward,
});

const PartyDetailsForm = Form.create({
  onFieldsChange(props, changedFields) {},
  mapPropsToFields(props) {
    return {
      partyName: Form.createFormField({
        ...props.inward.partyName,
        value:
          props.params !== "" && props.inward.party
            ? props.inward.party.partyName
            : props.inward.partyName
            ? props.inward.partyName
            : "",
      }),
      customerId: Form.createFormField({
        ...props.inward.customerId,
        value:
          props.params !== ""
            ? props.inward.party?.nPartyId
            : props.inward.customerId
            ? props.inward.customerId
            : props.inward.partyName,
      }),
      customerBatchNo: Form.createFormField({
        ...props.inward.customerBatchNo,
        value:
          props.params !== ""
            ? props.inward?.customerBatchId !== "undefined"
              ? props.inward?.customerBatchId
              : ""
            : props.inward?.customerBatchNo !== "undefined"
            ? props.inward?.customerBatchNo
            : "",
      }),
      customerInvoiceNo: Form.createFormField({
        ...props?.inward?.customerInvoiceNo,
        value:
          props?.inward?.customerInvoiceNo !== "undefined"
            ? props?.inward?.customerInvoiceNo
            : "",
      }),
      purposeType: Form.createFormField({
        ...props.inward.purposeType,
        value: props.inward.purposeType ? props.inward.purposeType : "",
      }),
      invoiceNumber: Form.createFormField({
        ...props.inward.invoiceNumber,
        value: props.inward.invoiceNumber || "",
      }),
    };
  },
  onValuesChange(props, values) {
    props.setInwardDetails({ ...props.inward, ...values });
  },
})(CreatePartyDetailsForm);

export default connect(mapStateToProps, {
  setInwardDetails,
  resetInwardForm,
  checkCustomerBatchNumber,
  getPoDetails,
  fetchMaterialsByPoID,
  resetInwardFormPO,
})(PartyDetailsForm);
