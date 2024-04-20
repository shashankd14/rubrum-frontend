import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {setInwardDetails, checkCustomerBatchNumber} from "../../../../appRedux/actions";
import {Form, Spin, AutoComplete, Icon, Button, Col, Row, Input, Select, Card, DatePicker} from "antd";
import {formItemLayout} from '../Create';
import { APPLICATION_DATE_FORMAT } from '../../../../constants';
import moment from "moment";

const Option = Select.Option;

const CreateInwardDocPage1 = (props) => {
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
        props.updateStep(5);
        // e.preventDefault();

        // props.form.validateFields((err, values) => {
        //     if (!err) {
        //         props.updateStep(4);
        //     }
        // });
    };
    const checkBatchNoExist = (rule, value, callback) => {
        if (!props.inwardStatus.loading && props.inwardStatus.success && !props.inwardStatus.duplicateBatchNo) {
            return callback();
        }
        callback('The coil number already exists');
    };
    const handleChangeDate = (date, dateString) => {
        props.form.setFieldsValue({
            documentDate: moment(dateString, APPLICATION_DATE_FORMAT),
        });
      };
      const handleChangeEwayBillDate = (date, dateString) => {
        props.form.setFieldsValue({
            ewayBillDate: moment(dateString, APPLICATION_DATE_FORMAT),
        });
      };


    return (
        <>
        <Col span={24}>
            {props.party.loading && <Spin className="gx-size-100 gx-flex-row gx-justify-content-center gx-align-items-center" size="large"/>}
            {props.party.partyList.length > 0 &&
                // <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4" style={{"width":"70%"}}>
                <Form {...formItemLayout} className="login-form gx-pt-4" >
                   
                    <div>
                        <Row gutter={16}>
                            <Col span={8} ></Col>
                            <Col span={4} style={{textAlign: 'center'}}>Net Weight</Col>
                            <Col span={4} style={{textAlign: 'center'}}>Rate</Col>
                            <Col span={4} style={{textAlign: 'center'}}>Value</Col>
                        </Row>
                        <Row gutter={16}>
                        <Col span={8}>
                        <AutoComplete
                            // style={{width: 200}}
                            placeholder="Select item"
                            dataSource={dataSource}
                            onChange= {props.params!=="" ?(e) =>handleChange(e,'material.description'):""}
                            filterOption={(inputValue, option) => {
                                return option.props.children?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 || false
                            }
                            }
                        />
                        </Col>
                        <Col span={4}>
                        <Input></Input>
                        </Col>
                        <Col span={4}>
                        <Input></Input>
                        </Col>
                        <Col span={4}>
                        <Input></Input>
                        </Col>
                        </Row>
                        <div className="gx-mt-4" style={{ backgroundColor: 'rgba(135, 206, 235, 0.2)', padding: '5px' }} >
                        <Row gutter={10} >
                            <Col span={8} className="gx-mt-2" style={{textAlign: 'right'}}>
                            <h3>Total</h3> 
                            </Col>
                            <Col span={4}>
                            <Input style={{ backgroundColor: 'blue', color: 'white' }} />
                            </Col>
                            <Col span={4}></Col>
                            <Col span={4}>
                            <Input style={{ backgroundColor: 'blue', color: 'white' }} />
                            </Col>
                        </Row>
                        </div>
                    </div>
                    {/* <Col span={16} className="gx-mt-4" style={{ border: '1px solid #ccc', padding: '10px' }}> */}
                    <hr className="gx-mt-4"/>
                    <Col span={16} className="gx-mt-1">
                        <h3>Add Extra Charges</h3>
                        {/* <col span={16}> */}
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
                        {/* </col> */}
                    </Col>
                    <Row className="gx-mt-4">
                        <Col span={20} offset={4} style={{ textAlign: "center"}}>
                            <Button style={{ marginLeft: 6 }} onClick={() => props.updateStep(3)}>
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
            {/* <Col span={8} className="gx-pt-4">
                <Card title="Inward Details" style={{ width: 400 }}>
                    {props.inward.purposeType && <p>Purpose Type : {props.inward.purposeType}</p>}
                    <p>Vendor Name : {props.params !== "" }</p>
                    <p>Vendor ID :  </p>
                    <p>Vendor Batch No. :  </p>
                    <p>Item Name : Chips {props.params !== "" } </p>
                    <p>Net Weight :  {props.params !== "" } </p>
                    <p>Item Name : Chips {props.params !== "" } </p>
                    <p>Net Weight :  {props.params !== "" } </p>
                </Card>
            </Col> */}
        </>
    )
}

const mapStateToProps = state => ({
    party: state.party,
    inward: state.inward.inward,
    inwardStatus: state.inward,
});

const InwardDocPage1 = Form.create({
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
})(CreateInwardDocPage1);

export default connect(mapStateToProps, {
    setInwardDetails,
    checkCustomerBatchNumber
})(InwardDocPage1);
