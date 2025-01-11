import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {setInwardDetails, checkCustomerBatchNumber} from "../../../../appRedux/actions";
import {Form, Spin, AutoComplete, Icon, Button, Col, Row, Input, Select} from "antd";
import {formItemLayout} from '../Create';

const Option = Select.Option;

const CreatePartyDetailsForm = (props) => {
    const {getFieldDecorator} = props.form;
    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        if(props.params !=="") {
            const { Option } = AutoComplete;
            const options = props.party.partyList.filter(party => {
            if (party?.nPartyId===  props.inward.party?.nPartyId)
            return (<Option key={party.nPartyId} value={`${party.nPartyId}`}>
                    {party.partyName}
                </Option>)
            });
            setDataSource(options);
        }
    }, [props.party]);
    useEffect(() => {
        if(props.party.partyList.length > 0) {

            const { Option } = AutoComplete;
            const options = props.party.partyList.map(party => (
                <Option key={party.nPartyId} value={`${party.nPartyId}`}>
                    {party.partyName}
                </Option>
            ));
            setDataSource(options);
        }
    }, [props.party]);

    useEffect(() => {
        if (props.params !== '') {
            props.inward.customerId = props.inward.party?.nPartyId || '';
            props.inward.customerBatchNo = props.inward.customerBatchId;
        }
    }, [props.params])
    const handleChange = e =>{
        props.inward.party.partyName = e;
    }
    const handleSubmit = e => {
        e.preventDefault();

        props.form.validateFields((err, values) => {
            if (!err) {
                props.updateStep(1);
            }
        });
    };
    const checkBatchNoExist = (rule, value, callback) => {
        if (!props.inwardStatus.loading && props.inwardStatus.success && !props.inwardStatus.duplicateBatchNo) {
            return callback();
        }
        callback('The coil number already exists');
    };
    return (
        <>
            {props.party.loading && <Spin className="gx-size-100 gx-flex-row gx-justify-content-center gx-align-items-center" size="large"/>}
            {props.party.partyList.length > 0 &&
                <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4" style={{"width":"70%"}}>
                    <Form.Item label="Customer Name">
                        {getFieldDecorator('partyName', {
                            rules: [{ required: true, message: 'Please input the customer name!' }],
                        })(
                            <AutoComplete
                                style={{width: 200}}
                                placeholder="enter customer name"
                                dataSource={dataSource}
                                onChange= {props.params !== "" ?(e) =>handleChange(e): ""}
                                filterOption={(inputValue, option) =>
                                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="Customer Id">
                            {getFieldDecorator('customerId', {
                            rules: [{ required: false, message: 'Please input the coil number!' }],
                            })(
                                <Input id="customerId" disabled/>
                            )}
                    </Form.Item>
                    <Form.Item label="Customer Batch No"
                    hasFeedback
                    validateStatus={props.inward.customerBatchNo ? props.inwardStatus.loading ? 'validating' : !props.inwardStatus.loading && props.inwardStatus.success && !props.inwardStatus.duplicateBatchNo  ? 'success' : props.inwardStatus.error || props.inwardStatus.duplicateBatchNo ? 'error' : '' : ''}
                    help={props.inwardStatus.loading ? 'We are checking if the Batch Number already exists' : (!props.inwardStatus.loading && props.inwardStatus.success && props.inwardStatus.duplicateBatchNo) ? "The Batch Number already exists" :  ''}>
                            {getFieldDecorator('customerBatchNo', {
                            rules: [{ required: false, message: 'Please input the Batch Number!' },
                            {validator: props.params ==="" ?checkBatchNoExist: ""}],
                            })(
                                <Input id="validating" onChange={(e) => props.checkCustomerBatchNumber(e.target.value)} onBlur= {(e) => props.checkCustomerBatchNumber(e.target.value)}/>
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
                            rules: [{ required: true, message: 'Please select a purpose type!' }],
                        })(
                            <Select placeholder="Select an option">
                                <Option value="TRADING">Trading (SELF)</Option>
                                <Option value="STEEL SERVICE CENTRE">Steel Service Centre (SSC)</Option>
                                <Option value="EXTERNAL PROCESS AGENT">External Process Agent (EPA)</Option>
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
    inwardStatus: state.inward,
});

const PartyDetailsForm = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            partyName: Form.createFormField({
                ...props.inward.partyName,
                value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
            }),
            customerId: Form.createFormField({
                ...props.inward.customerId,
                value: props.params !== "" ? props.inward.party?.nPartyId:(props.inward.customerId) ? props.inward.customerId : props.inward.partyName,
            }),
            customerBatchNo: Form.createFormField({
                ...props.inward.customerBatchNo,
                value: props.params !== "" ? props.inward.customerBatchId:(props.inward.customerBatchNo) ? props.inward.customerBatchNo : '',
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
    checkCustomerBatchNumber
})(PartyDetailsForm);
