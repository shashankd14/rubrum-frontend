import React, { useEffect } from "react";
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
                        {getFieldDecorator('aPartyId', {
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
                    {getFieldDecorator('aProcessId', {
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
                        {getFieldDecorator('aPrice', {
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

export default EditAdditionalRates;
