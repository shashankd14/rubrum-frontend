import React from "react";
import { Modal, Form, Col, Row, Select, Card, Input } from "antd";
import { connect } from "react-redux";
const Option = Select.Option;
export const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 12},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 12},
    },
};
const EditAdditionalRates=(props)=>{
    const { getFieldDecorator, getFieldValue } = props.form;
    const {editPriceModal, setEditPriceModal}=props;
return (
    <Modal
    visible={editPriceModal}
    width={700}
    title="Edit Additional Rate"
    onOk={() => setEditPriceModal(false)}
    onCancel={() => setEditPriceModal(false)}
    >
        <Card className="gx-card">
            <Row>
                <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                    <Form {...formItemLayout} className="gx-pt-4">
                   
                   <Form.Item label="Party Name">
                        {getFieldDecorator('partyId', {
                                rules: [{ required: true, message: 'Please select party name!' }],
                        })(
                        <Select
                        id="partyId"
                        mode="multiple"
                        style={{ width: '100%' }}
                        >                                                
                        {props.party?.partyList?.map(party => <Option value={party.nPartyId}>{party.partyName}</Option>)}
                        </Select>
                        )}
                    </Form.Item>
                    
                   
                    <Form.Item label="Process Name" >
                    {getFieldDecorator('processId', {
                        rules: [{ required: true, message: 'Please enter Process name!' }],
                    })(
                        <Select
                        showSearch
                        style={{width: 300}}
                        placeholder="Select a Process"
                       >
                        {props.process?.processList?.map(process => <Option value={process.processId}>{process.processName}</Option>)}
                       </Select>
                    )}
                    </Form.Item>
                    <Form.Item label="Range From">
                                        {getFieldDecorator('rangeFrom', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="rangeFrom" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Range To">
                                        {getFieldDecorator('rangeTo', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="rangeTo" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Rate">
                                        {getFieldDecorator('price', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="price" />
                                        )}
                                    </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Card>
    </Modal>
)
}
const mapStateToProps = state => ({
    party: state.party,
    process: state.process,
    rates: state.rates
});
const EditAdditionalRatesForm = Form.create({
    mapPropsToFields(props) {
        return {
            partyId: Form.createFormField({
                ...props.rates?.additionalRates?.partyId,
                value: props.rates?.additionalRates?.partyId|| undefined,
            }),
            processId: Form.createFormField({
                ...props.rates?.additionalRates?.processId,
                value: props.rates?.additionalRates?.processId || undefined,
            }),
            rangeFrom: Form.createFormField({
                ...props.rates?.additionalRates?.rangeFrom,
                value: props.rates?.additionalRates?.rangeFrom || '',
            }),
            rangeTo: Form.createFormField({
                ...props.rates?.additionalRates?.rangeTo,
                value: props.rates?.additionalRates?.rangeTo || '',
            }),
            price: Form.createFormField({
                ...props.rates?.additionalRates?.price,
                value: props.rates?.additionalRates?.price || '',
            }),
        };
    }
})(EditAdditionalRates);
export default connect(mapStateToProps, {
  
})(EditAdditionalRatesForm);