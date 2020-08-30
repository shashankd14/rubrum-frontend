import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {setInwardDetails} from "../../../../appRedux/actions";
import {Form, Spin, AutoComplete, Icon, Button, Col, Row, Input, Select} from "antd";
import {formItemLayout} from '../Create';

const Option = Select.Option;

const CreatePartyDetailsForm = (props) => {
    const {getFieldDecorator} = props.form;
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        if(props.party.partyList.length > 0) {

            const { Option } = AutoComplete;
            const options = props.party.partyList.map(party => (
                <Option key={party.nPartyId} value={`${party.nPartyId}`}>
                    {party.nPartyName}
                </Option>
            ));
            setDataSource(options);
        }
    }, [props.party]);

    const handleSubmit = e => {
        e.preventDefault();

        props.form.validateFields((err, values) => {
            if (!err) {
                props.updateStep(1);
            }
        });
    };

    return (
        <>
            {props.party.loading && <Spin className="gx-flex-row gx-justify-content-center" size="large"/>}
            {props.party.partyList.length > 0 &&
                <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4" style={{"width":"70%"}}>
                    <Form.Item label="Customer Name">
                        {getFieldDecorator('partyName', {
                            rules: [{ required: true, message: 'Please input the customer name!' }],
                        })(
                            <AutoComplete
                                style={{width: 200}}
                                onSelect={(value, option) => {
                                   console.log(value);
                                }}
                                placeholder="enter partyname"
                                dataSource={dataSource}
                                filterOption
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="Customer Id">
                            {getFieldDecorator('customerId', {
                            rules: [{ required: false, message: 'Please input the coil number!' }],
                            })(
                                <Input id="customerId" />
                            )}
                    </Form.Item>
                    <Form.Item label="Customer Batch No">
                            {getFieldDecorator('customerBatchNo', {
                            rules: [{ required: false, message: 'Please input the coil number!' }],
                            })(
                                <Input id="customerBatchNo" />
                            )}
                    </Form.Item>
                    <Form.Item label="Customer Invoice No">
                            {getFieldDecorator('customerInvoiceNo', {
                            rules: [{ required: false, message: 'Please input the coil number!' }],
                            })(
                                <Input id="customerInvoiceNo" />
                            )}
                    </Form.Item>
                    <Form.Item label="Purpose Type">
                        {getFieldDecorator('purposeType', {
                            rules: [{ required: false, message: 'Please select a purpose type!' }],
                        })(
                            <Select placeholder="Select an option">
                                <Option value="self">Trading (SELF)</Option>
                                <Option value="ssc">Steel Service Centre (SSC)</Option>
                                <Option value="epa">External Process Agent (EPA)</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Row className="gx-mt-4">
                        <Col span={12} offset={4} style={{ textAlign: "center"}}>
                            <Button type="primary" htmlType="submit">
                                Forward<Icon type="right"/>
                            </Button>
                        </Col>
                    </Row>
                </Form>
            }
        </>
    )
}

const mapStateToProps = state => ({
    party: state.party,
    inward: state.inward.inward,
});

const PartyDetailsForm = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            partyName: Form.createFormField({
                ...props.inward.partyName,
                value: (props.inward.partyName) ? props.inward.partyName : '',
            }),
            customerId: Form.createFormField({
                ...props.inward.customerId,
                value: (props.inward.customerId) ? props.inward.customerId : '',
            }),
            customerBatchNo: Form.createFormField({
                ...props.inward.customerBatchNo,
                value: (props.inward.customerBatchNo) ? props.inward.customerBatchNo : '',
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
        props.setInwardDetails({ ...props.inward, ...values});
    },
})(CreatePartyDetailsForm);

export default connect(mapStateToProps, {
    setInwardDetails,
})(PartyDetailsForm);
