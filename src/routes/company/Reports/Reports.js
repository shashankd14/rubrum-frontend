import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { Button, Card, AutoComplete, Select, Row, Col, Form, DatePicker, message, Typography } from "antd";
import moment from 'moment';
import { sendReportRequest, resetSendReportSuccess } from "../../../appRedux/actions";
import { APPLICATION_DATE_FORMAT } from '../../../constants/index';
import useGetReportCards from './useReportsApi';

export const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 16 },
    },
};

const { Option } = Select;
const dateRangeApplicableReportTypes = ['PURCHASE', 'SALES', 'JOB_ORDERS', 'FIFO_BREACH', 'AUDIT_TRAIL'];

const disabledDate = current => current && (
    current < moment().subtract(3, 'months').startOf('day') || current > moment().endOf('day')
);

const Reports = (props) => {

    const { getFieldDecorator, getFieldValue } = props.form;
    const [dataSource, setDataSource] = useState([]);
    const { fetchReportCards, reportsData, loading, error } = useGetReportCards();
    const { Title } = Typography;

    useEffect(() => {
        if (props.isReportSuccess) {
            message.success('Report request submitted successfully');
            props.resetSendReportSuccess();
        }
    }, [props.isReportSuccess]);

    useEffect(() => {
        if (props.party.partyList?.length > 0) {
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
        fetchReportCards().catch(err => {
            console.error('Error fetching report cards:', err);
        });
    }, []);

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                const payload = {
                    fromDate: values?.fromDate ? `${values?.fromDate?.format('YYYY-MM-DD')}` : undefined,
                    toDate: values?.toDate ? `${values?.toDate?.format('YYYY-MM-DD')}` : undefined,
                    locationId: Number(values.partyId),
                    reportType: values.reportName
                }
                props.sendReportRequest(payload);
            } else {
                message.error('Please correct the error and submit');
            }
        })
    }

    return (
        <div>
            <h1>Reports</h1>
            <Card className="gx-card">
                <div style={{ background: '#ECECEC', padding: '30px' }}>
                    <Row gutter={16} style={{ display: 'flex', flexDirection: 'column' }}>
                        <h5 level={4} style={{ display: 'inline' }}>
                            Purchase batch level KPI for last 30 days
                        </h5>
                        <Row>
                            <Col span={8}>
                                <Card style={{ margin: '0' }} title="MTD Purchase Qty" bordered={false}>
                                    {reportsData?.purchase?.period_purchase_qty_mt}
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card style={{ margin: '0' }} title="MTD Defective Coils Qty" bordered={false}>
                                    {reportsData?.purchase?.period_defective_coils_qty_mt}
                                </Card>
                            </Col>
                        </Row>
                    </Row>
                </div>
                <div style={{ background: '#ECECEC', padding: '0 30px 0' }}>
                    <Row gutter={16} style={{ display: 'flex', flexDirection: 'column' }}>
                        <h5 level={4} style={{ display: 'inline' }}>
                            Sales Batch level KPI for last 30 days
                        </h5>
                        <Row>
                            <Col span={6}>
                                <Card style={{ margin: '0' }} title="MTD Sales Qty" bordered={false}>
                                    {reportsData?.sales?.period_sales_qty_mt} MT
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card style={{ margin: '0' }} title="T-1 Sales Qty" bordered={false}>
                                    {reportsData?.sales?.last_day_sales_qty_mt} MT
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card style={{ margin: '0' }} title="MTD Non Coil to Coil (Processed Qty) Sales" bordered={false}>
                                    {reportsData?.sales?.period_processed_sales_qty_mt} MT
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card style={{ margin: '0' }} title="T-1 Non Coil to Coil (Processed Qty) Sales" bordered={false}>
                                    {reportsData?.sales?.last_day_processed_sales_qty_mt} MT
                                </Card>
                            </Col>
                        </Row>
                    </Row>
                </div>
                <div style={{ background: '#ECECEC', padding: '30px' }}>
                    <Row gutter={16} style={{ display: 'flex', flexDirection: 'column' }}>
                        <h5 level={4} style={{ display: 'inline' }}>
                            Stock Batch level KPI for last 30 days
                        </h5>
                        <Row>
                            <Col span={6}>
                                <Card style={{ margin: '0' }} title="Total Current Stock" bordered={false}>
                                    {reportsData?.stock?.total_current_stock_mt} MT
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card style={{ margin: '0' }} title="Sellable FG Stock (FG minus Scrap/Defect)" bordered={false}>
                                    {reportsData?.stock?.sellable_fg_stock_mt} MT
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card style={{ margin: '0' }} title="Coil Stock (Coil minus Scrap/Defect)" bordered={false}>
                                    {reportsData?.stock?.coil_stock_mt} MT
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card style={{ margin: '0' }} title="Days on Hand (Formula = Current Stock*30/Average of last 3 months Sale)" bordered={false}>
                                    {reportsData?.stock?.days_on_hand}
                                </Card>
                            </Col>
                        </Row>
                    </Row>
                </div>
                <div style={{ background: '#ECECEC', padding: '0 30px 0' }}>
                    <Row gutter={16} style={{ display: 'flex', flexDirection: 'column' }}>
                        <h5 level={4} style={{ display: 'inline' }}>
                            Open order SKU level
                        </h5>
                        <Row>
                            <Col span={5}>
                                <Card style={{ margin: '0' }} title="Current Open Orders Qty" bordered={false}>
                                    {reportsData?.openOrders?.open_orders_qty_mt} MT
                                </Card>
                            </Col>
                            <Col span={5}>
                                <Card style={{ margin: '0' }} title="Allocated Qty" bordered={false}>
                                    {reportsData?.openOrders?.allocated_qty_mt} MT
                                </Card>
                            </Col>
                            <Col span={5}>
                                <Card style={{ margin: '0' }} title="WIP Qty" bordered={false}>
                                    {reportsData?.openOrders?.wip_qty_mt} MT
                                </Card>
                            </Col>
                            <Col span={5}>
                                <Card style={{ margin: '0' }} title="Ready to deliver Qty" bordered={false}>
                                    {reportsData?.openOrders?.ready_to_deliver_qty_mt} MT
                                </Card>
                            </Col>
                            <Col span={5}>
                                <Card style={{ margin: '0' }} title="Pending Allocation Qty" bordered={false}>
                                    {reportsData?.openOrders?.pending_allocation_qty_mt} MT
                                </Card>
                            </Col>
                        </Row>
                    </Row>
                </div>
                <div style={{ background: '#ECECEC', padding: '30px' }}>
                    <Row gutter={16} style={{ display: 'flex', flexDirection: 'column' }}>
                        <h5 level={4} style={{ display: 'inline' }}>
                            Job Order Processing (Batch Level)
                        </h5>
                        <Row>
                            <Col span={5}>
                                <Card style={{ margin: '0' }} title="WIP Qty" bordered={false}>
                                    {reportsData?.jobOrders?.wip_qty_mt} MT
                                </Card>
                            </Col>
                            <Col span={5}>
                                <Card style={{ margin: '0' }} title="Ageing of Job Work Release Qty (Formula of Weighted average = Sumproduct of Qty and Ageing/Total Qty)" bordered={false}>
                                    {reportsData?.jobOrders?.wavg_ageing_job_work_release_days}
                                </Card>
                            </Col>
                            <Col span={5}>
                                <Card style={{ margin: '0' }} title="Ready to deliver Qty" bordered={false}>
                                    {reportsData?.jobOrders?.ready_to_deliver_qty_mt} MT
                                </Card>
                            </Col>
                            <Col span={5}>
                                <Card style={{ margin: '0' }} title="Ageing of Ready to deliver Qty (Formula of Weighted average = Sumproduct of Qty and Ageing/Total Qty)" bordered={false}>
                                    {reportsData?.jobOrders?.wavg_ageing_ready_to_deliver_days}
                                </Card>
                            </Col>
                        </Row>
                    </Row>
                </div>
                <div style={{ background: '#ECECEC', padding: '0 30px 30px 30px' }}>
                    <Row gutter={16} style={{ display: 'flex', flexDirection: 'column' }}>
                        <h5 level={4} style={{ display: 'inline' }}>
                            FIFO Breach (SKU Level)	
                        </h5>
                        <Row>
                            <Col span={8}>
                                <Card style={{ margin: '0' }} title="MTD Count of FIFO Breach Cases (exclude cases where breach is because of scrap/defect)" bordered={false}>
                                    {reportsData?.fifoBreach?.period_fifo_breach_cases}
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card style={{ margin: '0' }} title="T-1 Count of FIFO Breach Cases (exclude cases where breach is because of scrap/defect)" bordered={false}>
                                    {reportsData?.fifoBreach?.last_day_fifo_breach_cases}
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card style={{ margin: '0' }} title="QTD Top Defaulting Warehouse" bordered={false}>
                                    {reportsData?.fifoBreach?.top_defaulting_warehouse}
                                </Card>
                            </Col>
                        </Row>
                    </Row>
                </div>
                <Row>
                    <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                        <Form {...formItemLayout} className="gx-pt-4" onSubmit={handleSubmit}>
                            <Form.Item label="Customer Name">
                                {getFieldDecorator('partyId', {
                                    rules: [{ required: true, message: 'Please input the customer name!' }],
                                })(
                                    <AutoComplete
                                        style={{ width: 250 }}
                                        placeholder="Enter customer name"
                                        dataSource={dataSource}
                                        filterOption={(inputValue, option) =>
                                            option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label="Report Type" className="gx-form-item-one-fourth">
                                {getFieldDecorator('reportName', {
                                    rules: [{ required: true, message: 'Please enter report type' }],
                                })(
                                    <Select style={{ width: 250 }} placeholder="Select report type">
                                        <Option value="AUDIT_TRAIL">Audit Trail</Option>
                                        <Option value="PURCHASE">Purchase Report</Option>
                                        <Option value="SALES">Sales Report</Option>
                                        <Option value="STOCK">Stock Report</Option>
                                        <Option value="OPEN_ORDERS">Open Orders Report</Option>
                                        <Option value="JOB_ORDERS">Job Orders Report</Option>
                                        <Option value="FIFO_BREACH">FIFO Breach Report</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            {dateRangeApplicableReportTypes.includes(getFieldValue('reportName')) &&
                                <>
                                    <Form.Item label="From Date">
                                        {getFieldDecorator('fromDate', {
                                            initialValue: moment(new Date(), APPLICATION_DATE_FORMAT),
                                            rules: [{ required: true, message: 'Please select From date' }],
                                        })(
                                            <DatePicker
                                                style={{ width: 250 }}
                                                className="gx-mb-3 gx-w-200"
                                                format={APPLICATION_DATE_FORMAT}
                                                disabledDate={disabledDate}
                                            />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="To Date">
                                        {getFieldDecorator('toDate', {
                                            initialValue: moment(new Date(), APPLICATION_DATE_FORMAT),
                                            rules: [{ required: true, message: 'Please select To date' }],
                                        })(
                                            <DatePicker
                                                style={{ width: 250 }}
                                                className="gx-mb-3 gx-w-200"
                                                format={APPLICATION_DATE_FORMAT}
                                                disabledDate={disabledDate}
                                            />
                                        )}
                                    </Form.Item>
                                </>
                            }
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
    sendReportRequest,
    resetSendReportSuccess
})(ReportForm);