import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, AutoComplete, Select, Row, Col, Form, DatePicker, message} from "antd";
import moment from 'moment';
import { fetchPartyList, sendReportRequest } from "../../../appRedux/actions";
import {APPLICATION_DATE_FORMAT} from '../../../constants/index';

export const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 8},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 16},
    },
};

const { Option } = Select;

const Reports = (props) => {

    const { getFieldDecorator } = props.form;
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        props.fetchPartyList();
    }, []);

    useEffect(() => {
        if (props.isReportSuccess) {
            message.success('Report request submitted successfully');
        }
    }, [props.isReportSuccess]);

    useEffect(() => {
        if(props.party?.partyList?.length > 0) {
            const { Option } = AutoComplete;
            const options = props.party.partyList.map(party => (
                <Option key={party.nPartyId} value={`${party.nPartyId}`}>
                    {party.partyName}
                </Option>
            ));
            setDataSource(options);
        }
    }, [props.party]);

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                console.log('no error', values);
                const payload = {
                    ...values,
                    fromDate: `${values.fromDate.format('YYYY-MM-DD')}`,
                    toDate: `${values.toDate.format('YYYY-MM-DD')}`,
                }
                console.log('date', payload);
                props.sendReportRequest(payload);
            } else {
                console.log('error', err);
                message.error('Please correct the error and submit');
            }
        })
    }

    return (
        <div>
            <h1>Reports</h1>
            <Card className="gx-card">
                <Row>
                    <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                        <Form {...formItemLayout} className="gx-pt-4" onSubmit={handleSubmit}>
                            <Form.Item label="Customer Name">
                                {getFieldDecorator('partyId', {
                                    rules: [{ required: true, message: 'Please input the customer name!' }],
                                })(
                                    <AutoComplete
                                        style={{width: 250}}
                                        placeholder="Enter customer name"
                                        dataSource={dataSource}
                                        filterOption={(inputValue, option) =>
                                            option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label="From Date">
                                {getFieldDecorator('fromDate', {
                                    initialValue: moment(new Date(), APPLICATION_DATE_FORMAT),
                                    rules: [{ required: true, message: 'Please select From date' }],
                                })(
                                    <DatePicker
                                        style={{width: 250}}
                                        className="gx-mb-3 gx-w-200"
                                        format={APPLICATION_DATE_FORMAT}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label="To Date">
                                {getFieldDecorator('toDate', {
                                    initialValue: moment(new Date(), APPLICATION_DATE_FORMAT),
                                    rules: [{ required: true, message: 'Please select To date' }],
                                })(
                                    <DatePicker
                                        style={{width: 250}}
                                        className="gx-mb-3 gx-w-200"
                                        format={APPLICATION_DATE_FORMAT}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label="Report Type" className="gx-form-item-one-fourth">
                            {getFieldDecorator('reportName', {
                                    rules: [{ required: true, message: 'Please enter report type' }],
                                    })(
                                    <Select style={{width: 250}} placeholder="Select report type" onChange={() => {}}>
                                        <Option value="stock-report">Stock report</Option>
                                        <Option value="fg-report">FG report</Option>
                                        <Option value="wip-report">WIP report</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item style={{ justifyContent: "flex-end", margin: "20px", padding: "20px" }}>
                                <Button htmlType="submit" type="primary">Submit</Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Card>
        </div>
    );
}

const mapStateToProps = state => ({
    party: state.party,
    isReportSuccess: state.reports?.success
});

const ReportForm = Form.create()(Reports);

export default connect(mapStateToProps, {
    fetchPartyList,
    sendReportRequest
})(ReportForm);