import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import {Link, useHistory, useLocation, withRouter} from "react-router-dom";
import { Button, Card, Col, Divider, Icon, Modal, Radio, Row, Select, Table } from 'antd'
import {
    fetchPartyList,
    fetchInwardList,
    fetchTemplatesList,
    fetchTemplatesLinkList,
    getQualityTemplateById,
    fetchQualityReportList,
    getQualityReportById,
    updateQualityReport,
    deleteQualityReport,
    fetchQualityReportStageList
} from "../../../../appRedux/actions";
import moment from "moment";
import { useIntl } from "react-intl";
import SearchBox from "../../../../components/SearchBox";

import IntlMessages from "../../../../util/IntlMessages";
import { compose } from 'redux';

const PreDispatchReport = (props) => {

    const intl = useIntl();
    const history = useHistory();
    const location = useLocation();
    const [sortedInfo, setSortedInfo] = useState({
        order: "descend",
        columnKey: "age",
    });
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [filteredPreDispatchList, setFilteredPreDispatchList] = useState([]);
    const [qualityReportList, setQualityReportList] = useState([]);

    const [pageNo, setPageNo] = React.useState(1);
    const [totalPageItems, setTotalItems] = React.useState(0);
    const [partyList, setPartyList] = useState([]);
    const [templateList, setTemplateList] = useState([]);
    const [templateLinkList, setTemplateLinkList] = useState([]);
    const [templateId, setTemplateId] = useState();
    const { totalItems } = props.inward;
    const [selectedItemForQr, setSelectedItemForQr] = useState({})
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCreateQrScreen, setShowCreateQrScreen] = useState(false);



    const columns = [
        {
            title: "Delivery Date",
            dataIndex: "deliveryDate",
            key: "deliveryDate",
            filters: [],
            sorter: (a, b) => a.deliveryDate.length - b.deliveryDate.length,
            sortOrder: sortedInfo.columnKey === "deliveryDate" && sortedInfo.order,
        },
        {
            title: "Delivery Chalan",
            dataIndex: "deliveryChalanNo",
            key: "deliveryChalanNo",
            filters: [],
            sorter: (a, b) => a.deliveryChalanNo.length - b.deliveryChalanNo.length,
            sortOrder: sortedInfo.columnKey === "deliveryChalanNo" && sortedInfo.order,
        },
        {
            title: "Batch No",
            dataIndex: "customerBatchNo",
            key: "customerBatchNo",
            filteredValue: filteredInfo ? filteredInfo["customerBatchNo"] : null,
            onFilter: (value, record) => record.customerBatchNo == value,
            sorter: (a, b) => a.customerBatchNo.length - b.customerBatchNo.length,
            sortOrder: sortedInfo.columnKey === "customerBatchNo" && sortedInfo.order,
        },
        {
            title: "Qty Delivered",
            dataIndex: "qtyDelivered",
            key: "qtyDelivered",
            filters: [],
            sorter: (a, b) => a.qtyDelivered - b.qtyDelivered,
            sortOrder: sortedInfo.columnKey === "qtyDelivered" && sortedInfo.order,
        },
        {
            title: "Vehicle No.",
            dataIndex: "vehicleNo",
            key: "vehicleNo",
            filteredValue: filteredInfo ? filteredInfo["vehicleNo"] : null,
            onFilter: (value, record) => record.vehicleNo == value,
            sorter: (a, b) =>
                a.vehicleNo.length - b.vehicleNo.length,
            sortOrder:
                sortedInfo.columnKey === "vehicleNo" && sortedInfo.order,
        },
        {
            title: "End Users",
            dataIndex: "endUserTags",
            key: "endUserTags",
            filters: [],
            sorter: (a, b) => a.endUserTags.length - b.endUserTags.length,
            sortOrder:
                sortedInfo.columnKey === "endUserTags" && sortedInfo.order,
        },
        {
            title: "Customer Invoice No.",
            dataIndex: "customerInvoiceNo",
            key: "customerInvoiceNo",
            filters: [],
            sorter: (a, b) => a.customerInvoiceNo - b.customerInvoiceNo,
            sortOrder: sortedInfo.columnKey === "customerInvoiceNo" && sortedInfo.order,
        },
        {
            title: "Customer Invoice Date",
            dataIndex: "customerInvoiceDate",
            key: "customerInvoiceDate",
            filters: [],
            sorter: (a, b) => a.customerInvoiceDate - b.customerInvoiceDate,
            sortOrder: sortedInfo.columnKey === "customerInvoiceDate" && sortedInfo.order,
        },
        {
            title: "Action",
            dataIndex: "",
            key: "x",
            render: (text, record, index) => (
                <span>
                    <span
                        className="gx-link"
                        onClick={(e) => showTemplateList(record, index, e)}
                    >
                        Create QR
                    </span>
                    <Divider type="vertical" />
                    <span
                        className="gx-link"
                        onClick={(e) => showReportView(record, index, e)}
                    >
                        View
                    </span>
                    <Divider type="vertical" />
                    <span className="gx-link" onClick={(e) => onEdit(record, index, e)}>
                        Edit
                    </span>
                    <Divider type="vertical" />
                    <span className="gx-link" onClick={(e) => onDelete(record, index, e)}>
                        Delete
                    </span>
                </span>
            ),
        },
    ];

    useEffect(() => {
        props.fetchQualityReportStageList({stage: "predispatch", page: 1, pageSize: 15, partyId: ''});
        props.fetchQualityReportList();
        props.fetchPartyList();
        props.fetchTemplatesList();
    }, []);

    useEffect(() => {
        if (!props.template.loading && !props.template.error && props.template.operation == "fetchQualityReport") {
            console.log(props.template)
            setQualityReportList(props.template.data)
        } else if (!props.template.loading && !props.template.error && props.template.operation == "fetchQualityReportStage") {
            console.log(props.template)
            setFilteredPreDispatchList(props.template.data)
        }
    }, [props.template.loading, props.template.error, props.template.operation]);


    const showCreateQr = () => {
        // props.history.push()
        props.getQualityTemplateById(templateId)
    }

    useEffect(() => {
        if (!props.template.loading && !props.template.error && props.template.operation === 'templateById') {
            console.log(props)
            setShowCreateQrScreen(true)
            // history.push('/company/quality/reports/create/inward')
            props.history.push({pathname: '/company/quality/reports/create/predispatch', state: {selectedItemForQr: selectedItemForQr, templateDetails: props.template.data, action: 'create'}})
        }
    }, [props.template.loading, props.template.error]);

    const showTemplateList = (record, key) => {
        console.log(record, key)
        setSelectedItemForQr(record)
        setShowCreateModal(true)
        props.fetchTemplatesLinkList({ partyId: record.npartyId });
    }

    const showReportView = (record, key) => {
        console.log(record, key)
        const templateDetails = qualityReportList.find(qr => qr.coilNumber === record.coilNumber && qr.inwardId === record.inwardEntryId)
        props.history.push({pathname: '/company/quality/reports/create/predispatch', state: {selectedItemForQr: record, templateDetails: templateDetails, action: 'view'}})
    }

    useEffect(() => {
        if (!props.template.loading && !props.template.error && props.template.operation == "templateLinkList") {
            console.log(props.template)
            setTemplateLinkList(props.template.data)
            setShowCreateModal(true)
        }
    }, [props.template.loading, props.template.error]);

    const onDelete = (record, key, e) => {
        console.log(record, key);
        props.deleteQualityReport(record.qirId);
    };

    const onEdit = (record, key, e) => {
        console.log(record, key)
        const templateDetails = qualityReportList.find(qr => qr.coilNumber === record.coilNumber && qr.inwardId === record.inwardEntryId)
        props.history.push({pathname: '/company/quality/reports/create/predispatch', state: {selectedItemForQr: record, templateDetails: templateDetails, action: 'edit'}})
    };

    const handleChange = (e) => {
        console.log(e)
        setTemplateId(e)
    };

    useEffect(() => {
        if (!props.inward.loading && props.inward.success) {
          setFilteredPreDispatchList(props.inward.inwardList);
        }
    }, [props.inward.loading, props.inward.success]);

    useEffect(() => {
        if (!props.template.loading && !props.template.error && props.template.operation === 'templateList') {
            console.log(props.template)
            setTemplateList(props.template.data)
        }
    }, [props.template.loading, props.template.error]);

    useEffect(() => {
        if (!props.party.loading && !props.party.error) {
            console.log(props.party)
            setPartyList(props.party.partyList)
        }
    }, [props.party.loading, props.party.error]);

    // useEffect(() => {
    //     if (searchValue) {
    //         if (searchValue.length >= 3) {
    //             setPageNo(1);
    //             props.fetchInwardList(1, 15, searchValue);
    //         }
    //     } else {
    //         setPageNo(1);
    //         props.fetchInwardList(1, 15, searchValue);
    //     }
    // }, [searchValue]);


    return (
        <>
            
                <div className="gx-flex-row gx-flex-1">
                    <div className="table-operations gx-col">
                        <Select
                            id="select"
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Select a customer"
                            optionFilterProp="children"
                            onChange={handleChange}
                            value={templateId}
                            // onFocus={handleFocus}
                            // onBlur={handleBlur}
                            filterOption={(input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                        >

                            {partyList.length > 0 &&
                                partyList.map((party) => (
                                    <Select.Option key={party.nPartyId} value={party.nPartyId}>{party.partyName}</Select.Option>
                                ))}
                        </Select>
                    </div>
                    <div className="table-operations gx-col">
                        <SearchBox
                            styleName="gx-flex-1"
                            placeholder="Search for customers"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}>
                        </SearchBox>

                    </div>
                </div>
                <div className="gx-flex-row gx-flex-1">
                    <Table
                        className="gx-table-responsive"
                        columns={columns}
                        dataSource={filteredPreDispatchList}
                        onChange={handleChange}
                        pagination={{
                            pageSize: 15,
                            onChange: (page) => {
                                setPageNo(page);
                                props.fetchPreDispatchList(page, 15, searchValue);
                            },
                            current: pageNo,
                            total: totalPageItems,
                        }}
                    />
                </div>

                <Modal
                    title={`Batch No: ${selectedItemForQr?.customerBatchNo}`}
                    visible={showCreateModal}
                    onOk={() => showCreateQr(true)}
                    onCancel={() => setShowCreateModal(false)}
                    destroyOnClose={true}
                >
                    <Row>
                        <Col span={24}>
                            <Row>
                                <Col span={12}>
                                    <strong>Customer Name</strong>
                                    <p>{selectedItemForQr?.party?.partyName}</p>
                                </Col>
                                <Col span={12} style={{ right: 0, position: 'absolute' }}>
                                    <strong>Stage</strong>
                                    <p>Pre Dispatch</p>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={6}>
                                    <strong>Coil No.</strong>
                                    <p>{selectedItemForQr?.coilNo}</p>
                                </Col>
                                <Col span={6}>
                                    <strong>Batch No.</strong>
                                    <p>{selectedItemForQr?.customerBatchNo}</p>
                                </Col>
                                <Col span={6}>
                                    <strong>Delivery Date</strong>
                                    <p>{selectedItemForQr?.deliveryDate}</p>
                                </Col>
                                <Col span={6} >
                                    <strong>Qty Delivered</strong>
                                    <p>{selectedItemForQr?.qtyDelivered}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <strong>Customer Invoice Date</strong>
                                    <p>{selectedItemForQr?.customerInvoiceDate}</p>
                                </Col>
                                <Col span={12} style={{ right: 0, position: 'absolute' }}>
                                    <strong>Customer Invoice No.</strong>
                                    <p>{selectedItemForQr?.customerInvoiceNo}</p>
                                </Col>
                            </Row>
                            <Divider />
                            <Row>
                                <strong>Template ID & Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Linking Parameter</strong>
                                <Select
                                    id="select"
                                    showSearch
                                    style={{ width: "100%" }}
                                    placeholder="Select a customer"
                                    optionFilterProp="children"
                                    onChange={handleChange}
                                    value={templateId}
                                    // onFocus={handleFocus}
                                    // onBlur={handleBlur}
                                    filterOption={(input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >

                                    {templateLinkList.length > 0 &&
                                        templateLinkList.map((link) => (
                                            <Select.Option value={link.templateId}>{`${link.templateId}-${link.templateName}`}</Select.Option>
                                        ))}
                                </Select>
                            </Row>
                        </Col>
                    </Row>
                </Modal>
            
        </>
    )
}

const mapStateToProps = (state) => ({
    template: state.quality,
    inward: state.inward,
    party: state.party,
});

export default connect(mapStateToProps, {
    fetchTemplatesList,
    fetchPartyList,
    fetchTemplatesLinkList,
    getQualityTemplateById,
    fetchQualityReportList,
    getQualityReportById,
    updateQualityReport,
    deleteQualityReport,
    fetchQualityReportStageList
})(withRouter(PreDispatchReport));