import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {setInwardDetails, checkCustomerBatchNumber} from "../../../../appRedux/actions";
import {Form, Spin, AutoComplete, Icon, Button, Col, Row, Input, Select, Card} from "antd";
import {formItemLayout} from '../Create';

const Option = Select.Option;

const CreateVendorDetailsForm = (props) => {
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
        props.updateStep(2);
        // e.preventDefault();

        // props.form.validateFields((err, values) => {
        //     if (!err) {
        //         props.updateStep(1);
        //     }
        // });
    };
    const checkBatchNoExist = (rule, value, callback) => {
        if (!props.inwardStatus.loading && props.inwardStatus.success && !props.inwardStatus.duplicateBatchNo) {
            return callback();
        }
        callback('The coil number already exists');
    };
    return (
        <>
        <Col span={14}>
            {props.party.loading && <Spin className="gx-size-100 gx-flex-row gx-justify-content-center gx-align-items-center" size="large"/>}
            {props.party.partyList.length > 0 &&
                // <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4" style={{"width":"70%"}}>
                <Form {...formItemLayout} className="login-form gx-pt-4" >
                    <Form.Item label="Vendor Name">
                        {getFieldDecorator('partyName', {
                            // rules: [{ required: true, message: 'Please input the Vendor name!' }],
                        })(
                            <AutoComplete
                                style={{width: 200}}
                                placeholder="enter vendor name"
                                dataSource={dataSource}
                                onChange= {props.params !== "" ?(e) =>handleChange(e): ""}
                                filterOption={(inputValue, option) =>
                                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="Vendor Id">
                            {getFieldDecorator('vendorId', {
                            rules: [{ required: false, message: 'Please input the coil number!' }],
                            })(
                                <Input id="customerId" disabled/>
                            )}
                    </Form.Item>
                    <Form.Item label="Transporter Name">
                            {getFieldDecorator('transporterName', {
                            rules: [{ required: false, message: 'Please input the transporter name!' }],
                            })(
                                <Input id="transporterName" />
                            )}
                    </Form.Item>
                    <Form.Item label="Transporter Phone no">
                            {getFieldDecorator('transporterName', {
                            rules: [{ required: false, message: 'Please input the transporter phone no!' }],
                            })(
                                <Input id="transporterPhone" />
                            )}
                    </Form.Item>
                    <Row className="gx-mt-4">
                        <Col span={24} offset={4} style={{ textAlign: "center"}}>
                            <Button style={{ marginLeft: 8 }} onClick={() => props.updateStep(0)}>
                                <Icon type="left"/>Back
                            </Button>
                            {/* <Button type="primary" htmlType="submit">
                                Forward<Icon type="right"/>
                            </Button> */}
                            <Button type="primary" onClick={handleSubmit}>
                                Forward
                            </Button>
                        </Col>
                    </Row>
                </Form>
            }
            </Col>
            <Col span={10} className="gx-pt-4">
                <Card title="Inward Details" style={{ width: 300 }}>
                    {props.inward.customerInvoiceNo && <p>Customer Invoice No : {props.inward.customerInvoiceNo}</p>}
                    {props.inward.purposeType && <p>Purpose Type : {props.inward.purposeType}</p>}
                </Card>
            </Col>
        </>
    )
}

const mapStateToProps = state => ({
    party: state.party,
    inward: state.inward.inward,
    inwardStatus: state.inward,
});

const VendorDetailsForm = Form.create({
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
})(CreateVendorDetailsForm);

export default connect(mapStateToProps, {
    setInwardDetails,
    checkCustomerBatchNumber
})(VendorDetailsForm);
