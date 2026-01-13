import React, { useEffect, useState } from "react";
import {
  Card,
  Radio,
  Modal,
  Row,
  Col,
  Form,
  Input,
  Select,
  Checkbox,
  message,
} from "antd";
import { connect } from "react-redux";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { addAdditionalRates, resetRates } from "../../../appRedux/actions";

const Option = Select.Option;
export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 12 },
  },
};
const AdditionalRates = (props) => {
  const { getFieldDecorator, getFieldValue } = props.form;
  const { form } = props;
  const keys = getFieldValue("keys");
  const [parts, setParts] = useState("");
  const [processId, setProcessId] = useState();
  const [slits, setSlits] = useState("");
  const [bundleWeight, setBundleWeight] = useState("");
  const [checked, setChecked] = useState(false);
  const [showAdditionalRates, setShowAdditionalRates] = useState(
    props?.showAdditionalRates
  );
  const [balanceCoil, setBalanceCoil] = useState("");
  const [length, setLength] = useState("");
  useEffect(() => {
    props.setShowAdditionalRates(showAdditionalRates);
  }, [showAdditionalRates]);
  useEffect(() => {
    if (props?.rates?.addAdditionalSuccess) {
      message.success("Additional Rates added successfully", 2);
      setShowAdditionalRates(false);
    }
    if (props?.rates?.addAdditionalFailed) {
      message.error("Please try with new range", 2);
    }
    props.resetRates();
  }, [props.rates.addAdditionalSuccess, props?.rates.addAdditionalFailed]);

  const checkboxChange = (e: CheckboxChangeEvent) => {
    setChecked(e.target.checked);
  };
  const processSelectChange = (e) => {
    setProcessId(e);
  };
  const radioChange = (e) => {
    if (e.target.name === "parts") {
      setParts(e.target.value);
    } else if (e.target.name === "slits") {
      setSlits(e.target.value);
    } else if (e.target.name === "bundleweight") {
      setBundleWeight(e.target.value);
    } else if (e.target.name === "balanceCoil") {
      setBalanceCoil(e.target.value);
    } else if (e.target.name === "length") {
      setLength(e.target.value);
    }
  };
  const addNewKey = (type) => {
    const { form } = props;
    const keys = form.getFieldValue(`${type}`);
    const nextKeys = keys.concat({ rangeFrom: 0, rangeTo: 0, rate: 0 });
    form.setFieldsValue({
      [type]: nextKeys,
    });
  };
  const removeKey = (k, type) => {
    const { form } = props;
    // can use data-binding to get
    const keys = form.getFieldValue(`${type}`);
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    // can use data-binding to set
    form.setFieldsValue({
      [type]: keys.filter((key) => key !== k),
    });
  };
  const multipleFields = (type) => {
    getFieldDecorator(`${type}`, {
      initialValue: [{ rangeFrom: 0, rangeTo: 0, rate: 0 }],
    });
    const keys = form.getFieldValue(`${type}`);
    return (
      <>
        <Row>
          <Col lg={6} md={6} sm={12} xs={24}>
            <label>Range From</label>
          </Col>
          <Col lg={6} md={6} sm={12} xs={24}>
            <label>Range To</label>
          </Col>
          <Col lg={6} md={6} sm={12} xs={24}>
            <label>Additional Rate</label>
          </Col>
          <Col lg={6} md={6} sm={12} xs={24}>
            <label>Action</label>
          </Col>
        </Row>
        <Row>
          {keys.map((k, index) => {
            return (
              <>
                <Col lg={6} md={6} sm={12} xs={24}>
                  <Form.Item name={"minimum" + type}>
                    {getFieldDecorator(`minimum${type}[${index}]`, {
                      rules: [
                        { required: true, message: "Please enter width" },
                        {
                          pattern: "^[0-9]*$",
                          message: "Width greater than available width",
                        },
                      ],
                    })(<Input id={"minimum" + type} />)}
                  </Form.Item>
                </Col>
                <Col lg={6} md={6} sm={12} xs={24}>
                  <Form.Item name={"maximum" + type}>
                    {getFieldDecorator(`maximum${type}[${index}]`, {
                      rules: [
                        { required: true, message: "Please enter nos" },
                        {
                          pattern: "^[0-9]*$",
                          message: "Number of slits should be a number",
                        },
                      ],
                    })(<Input id={"maximum" + type} />)}
                  </Form.Item>
                </Col>
                <Col lg={6} md={6} sm={12} xs={24}>
                  <Form.Item name={type + "rate"}>
                    {getFieldDecorator(`${type}Rate[${index}]`)(
                      <Input id={type + "rate"} />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={6} sm={12} xs={24}>
                  <div
                    style={{ height: "40px" }}
                    className="gx-flex-row gx-align-items-center"
                  >
                    {keys.length - 1 > 0 ? (
                      <i
                        className="icon icon-trash gx-margin"
                        onClick={() => removeKey(k, type)}
                      />
                    ) : (
                      <></>
                    )}
                    {index == keys.length - 1 ? (
                      <i
                        className="icon icon-add-circle"
                        onClick={() => addNewKey(type)}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>
      </>
    );
  };
  const getLengthCriteria = () => {
    return (
      (processId === 3 || processId === 1) && (
        <>
          <Form.Item label="Is length a criteria?">
            {getFieldDecorator("radioLength", {
              rules: [{ required: true, message: "Please select radio" }],
            })(
              <Radio.Group
                id="radioLength"
                name="length"
                onChange={radioChange}
                value={length}
              >
                <Radio value={"yesLength"}>Yes</Radio>
                <Radio value={"noLength"}>No</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          {length === "yesLength" && multipleFields("length")}
        </>
      )
    );
  };
  const handleOk = (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      let payload = {
        partyId: checked ? values?.partyId : [values?.partyId],
        processId: values?.processId,
        laminationSSlabour:values?.laminationSSlabour,
        laminationDSlabour:values?.laminationDSlabour,
        laminationSSmaterial:values?.laminationSSmaterial,
        laminationDSmaterial:values?.laminationDSmaterial
      };

      let payloadArray = [];
      if (values?.radioParts === "yesparts") {
        const parts = values?.minimumparts?.map((item, idx) => {
          payload = {
            ...payload,
            additionalPriceId: processId ===3?"11":"1",
            rangeFrom: item,
            rangeTo: values?.maximumparts[idx],
            price: values?.partsRate[idx],
          };
          payloadArray.push(payload);
        });
      }
      if (values?.radioSlits === "yesslits") {
        const slits = values?.minimumslits?.map((item, idx) => {
          payload = {
            ...payload,
            additionalPriceId: processId===3?"12":"3",
            rangeFrom: item,
            rangeTo: values?.maximumslits[idx],
            price: values?.slitsRate[idx],
          };
          payloadArray.push(payload);
        });
      }
      if (values?.radioWeight === "yes") {
        const bundleweight = values?.minimumbundleweight?.map((item, idx) => {
          payload = {
            ...payload,
            additionalPriceId: processId === 1 ? "8":processId===3?"10" : "3",
            rangeFrom: item,
            rangeTo: values?.maximumbundleweight[idx],
            price: values?.bundleweightRate[idx],
          };
          payloadArray.push(payload);
        });
      }
      if (values?.radioLength === "yesLength") {
        const length = values?.minimumlength?.map((item, idx) => {
          payload = {
            ...payload,
            additionalPriceId: processId===3?"14":"6",
            rangeFrom: item,
            rangeTo: values?.maximumlength[idx],
            price: values?.lengthRate[idx],
          };
          payloadArray.push(payload);
        });
      }
      if (values?.balanceCoil === "yesBalance") {
        payload = {
          ...payload,
          additionalPriceId: processId === 1 ? "7" :processId ===3?"9": "4",
          rangeFrom: "",
          rangeTo: "",
          price: values?.balanceCoilRate,
        };
        payloadArray.push(payload);
      }
      props.addAdditionalRates(payloadArray);
    });
  };

  return (
    <Modal
      title="Add Additional Rates"
      visible={props.showAdditionalRates}
      width={900}
      onCancel={() => setShowAdditionalRates(false)}
      onOk={handleOk}
    >
      <Card className="gx-card">
        <Row>
          <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
            <Form {...formItemLayout} className="gx-pt-4">
              <Form.Item>
                <Checkbox onChange={checkboxChange}>
                  Apply to multiple fields
                </Checkbox>
              </Form.Item>
              {checked && (
                <>
                  <Form.Item label="Location">
                    {getFieldDecorator("partyId", {
                      rules: [
                        {
                          required: true,
                          message: "Please select location!",
                        },
                      ],
                    })(
                      <Select
                        id="partyId"
                        mode="multiple"
                        style={{ width: "100%" }}
                      >
                        {props.party?.partyList?.map((party) => (
                          <Option value={party.nPartyId}>
                            {party.partyName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </>
              )}
              {!checked && (
                <Form.Item label="Location">
                  {getFieldDecorator("partyId", {
                    rules: [
                      { required: true, message: "Please enter location!" },
                    ],
                  })(
                    <Select
                      showSearch
                      style={{ width: 300 }}
                      placeholder="Select a Location"
                    >
                      {props.party?.partyList?.map((party) => (
                        <Option value={party.nPartyId}>
                          {party.partyName}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              )}
              <Form.Item label="Process Name">
                {getFieldDecorator("processId", {
                  rules: [
                    { required: true, message: "Please enter Process name!" },
                  ],
                })(
                  <Select
                    showSearch
                    style={{ width: 300 }}
                    placeholder="Select a Process"
                    onChange={processSelectChange}
                  >
                    {props.process?.processList?.map((process) => (
                      <Option value={process.processId}>
                        {process.processName}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              {/* Slit specific fields - start */}
              {processId === 2 || processId === 3 ? (
                <>
                  <Form.Item label="No of parts alert to activate?">
                    {getFieldDecorator("radioParts", {
                      rules: [
                        { required: true, message: "Please select Parts" },
                      ],
                    })(
                      <Radio.Group
                        id="radioParts"
                        name="parts"
                        onChange={radioChange}
                        value={parts}
                      >
                        <Radio value={"yesparts"}>Yes</Radio>
                        <Radio value={"noparts"}>No</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                  {parts === "yesparts" && multipleFields("parts")}
                  <Form.Item label="No of slits alert to activate?">
                    {getFieldDecorator("radioSlits", {
                      rules: [
                        { required: true, message: "Please select Slits" },
                      ],
                    })(
                      <Radio.Group
                        id="radioSlits"
                        name="slits"
                        onChange={radioChange}
                        value={slits}
                      >
                        <Radio value={"yesslits"}>Yes</Radio>
                        <Radio value={"noslits"}>No</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                  {slits === "yesslits" && multipleFields("slits")}
                  {/* Slit specific fields -end */}
                  {getLengthCriteria()}
                </>
              ) : (
                getLengthCriteria()
              )}
              {/* Bundle weight field start */}
              <Form.Item label="Bundle weight alert to activate?">
                {getFieldDecorator("radioWeight", {
                  rules: [
                    { required: true, message: "Please select Bundle Weight" },
                  ],
                })(
                  <Radio.Group
                    id="radioWeight"
                    name="bundleweight"
                    onChange={radioChange}
                    value={bundleWeight}
                  >
                    <Radio value={"yes"}>Yes</Radio>
                    <Radio value={"no"}>No</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              {bundleWeight === "yes" && multipleFields("bundleweight")}
              {/* Bundle weight field -end */}
              {/* Balanced coil fields-- start */}
              <Form.Item label="Balance coil removed and processed again">
                {getFieldDecorator("balanceCoil", {
                  rules: [{ required: true, message: "Please select Slits" }],
                })(
                  <Radio.Group
                    id="balanceCoil"
                    name="balanceCoil"
                    onChange={radioChange}
                    value={balanceCoil}
                  >
                    <Radio value={"yesBalance"}>Yes</Radio>
                    <Radio value={"noBalance"}>No</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              {balanceCoil === "yesBalance" && (
                <>
                  <Form.Item label="Additional Rate">
                    {getFieldDecorator("balanceCoilRate", {
                      rules: [
                        { required: true, message: "Please input the Rate!" },
                      ],
                    })(<Input id="balanceCoilRate" />)}
                  </Form.Item>
                </>
              )}
              {/* Balanced coil fields - end */}
            </Form>
          </Col>
        </Row>
      </Card>
    </Modal>
  );
};
const mapStateToProps = (state) => ({
  party: state.party,
  process: state.process,
  rates: state.rates,
});
const addAdditionalRatesForm = Form.create({
  mapPropsToFields(props) {
    return {
      partyId: Form.createFormField({
        ...props.rates?.rates?.partyId,
        value: props.rates?.rates?.partyId || undefined,
      }),
      processId: Form.createFormField({
        ...props.rates?.rates?.processId,
        value: props.rates?.rates?.processId || undefined,
      }),
      laminationSSlabour: Form.createFormField({
        ...props.rates?.rates?.laminationSSlabour,
        value: props.rates?.rates?.laminationSSlabour || undefined,
      }),
      laminationSSmaterial: Form.createFormField({
        ...props.rates?.rates?.laminationSSmaterial,
        value: props.rates?.rates?.laminationSSmaterial || undefined,
      }),
      laminationDSlabour: Form.createFormField({
        ...props.rates?.rates?.laminationDSlabour,
        value: props.rates?.rates?.laminationDSlabour || undefined,
      }),
      laminationDSmaterial: Form.createFormField({
        ...props.rates?.rates?.laminationDSmaterial,
        value: props.rates?.rates?.laminationDSmaterial || undefined,
      }),
    };
  },
})(AdditionalRates);
export default connect(mapStateToProps, {
  addAdditionalRates,
  resetRates,
})(addAdditionalRatesForm);
