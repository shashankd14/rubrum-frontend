import React, { useEffect } from 'react';
import { Modal, Form, Col, Row, Select, Card, Input, message } from 'antd';
import { connect } from 'react-redux';
import { updateAdditionalRates, resetRates } from '../../../appRedux/actions';
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
const EditAdditionalRates = props => {
  const { getFieldDecorator, getFieldValue } = props.form;
  const { editPriceModal, setEditPriceModal } = props;
  useEffect(() => {
    if (props?.rates?.updateAdditionalSuccess) {
      message.success('Additional Rates updated Successfully!');
      props.resetRates();
      setEditPriceModal(false);
    }
    if (props?.rates?.updateAdditionalFailure) {
      props.resetRates();
      message.error('Please try with different range!', 2);
    }
  }, [
    props?.rates?.updateAdditionalSuccess,
    props?.rates?.updateAdditionalFailure,
  ]);
  const handleOk = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      let payload = [
        {
          partyId: [values?.aPartyId],
          processId: values?.aProcessId,
          price: values?.aPrice,
          additionalPriceId: props?.aRates?.additionalPriceId,
          rangeFrom: values?.rangeFrom,
          rangeTo: values?.rangeTo,
          laminationSSlabour: values?.laminationSSlabour,
          laminationDSlabour: values?.laminationDSlabour,
          laminationSSmaterial: values?.laminationSSmaterial,
          laminationDSmaterial: values?.laminationDSmaterial,
        },
      ];
      props.updateAdditionalRates(payload);
    });
  };

  return (
    <Modal
      visible={editPriceModal}
      width={800}
      title="Edit Additional Rate"
      onOk={handleOk}
      onCancel={() => setEditPriceModal(false)}
    >
      <Card className="gx-card">
        <Row>
          <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
            <Form {...formItemLayout} className="gx-pt-4">
              <Form.Item label="Party Name">
                {getFieldDecorator('aPartyId', {
                  rules: [
                    { required: true, message: 'Please select party name!' },
                  ],
                })(
                  <Select
                    id="partyId"
                    mode="multiple"
                    style={{ width: '100%' }}
                  >
                    {props.party?.partyList?.map(party => (
                      <Option key={party.nPartyId} value={party.nPartyId}>
                        {party.partyName}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>

              <Form.Item label="Process Name">
                {getFieldDecorator('aProcessId', {
                  rules: [
                    { required: true, message: 'Please enter Process name!' },
                  ],
                })(
                  <Select
                    showSearch
                    style={{ width: 300 }}
                    placeholder="Select a Process"
                  >
                    {props.process?.processList?.map(process => (
                      <Option key={process.processId} value={process.processId}>
                        {process.processName}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="Range From">
                {getFieldDecorator('rangeFrom', {
                  rules: [
                    { required: true, message: 'Please input the GST Number!' },
                  ],
                })(<Input id="rangeFrom" />)}
              </Form.Item>
              <Form.Item label="Range To">
                {getFieldDecorator('rangeTo', {
                  rules: [
                    { required: true, message: 'Please input the GST Number!' },
                  ],
                })(<Input id="rangeTo" />)}
              </Form.Item>
              <Form.Item label="Rate">
                {getFieldDecorator('aPrice', {
                  rules: [
                    { required: true, message: 'Please input the GST Number!' },
                  ],
                })(<Input id="price" />)}
              </Form.Item>
              <Form.Item label="Single side lamination charges per meter (Labour)">
                {getFieldDecorator(
                  'laminationSSlabour',
                  {},
                )(<Input id="laminationSSlabour" />)}
              </Form.Item>
              <Form.Item label="Single side lamination charges per meter (Material)">
                {getFieldDecorator(
                  'laminationSSmaterial',
                  {},
                )(<Input id="laminationSSmaterial" />)}
              </Form.Item>
              <Form.Item label="Double side lamination charges per meter (Labour)">
                {getFieldDecorator(
                  'laminationDSlabour',
                  {},
                )(<Input id="laminationDSlabour" />)}
              </Form.Item>
              <Form.Item label="Double side lamination charges per meter (Material)">
                {getFieldDecorator(
                  'laminationDSmaterial',
                  {},
                )(<Input id="laminationDSmaterial" />)}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </Modal>
  );
};
const mapStateToProps = state => ({
  rates: state.rates,
});
export default connect(mapStateToProps, {
  updateAdditionalRates,
  resetRates,
})(EditAdditionalRates);
