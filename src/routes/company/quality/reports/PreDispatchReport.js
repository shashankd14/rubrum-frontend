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
            title: "Coil Number",
            dataIndex: "coilNumber",
            key: "coilNumber",
            filters: [],
            sorter: (a, b) => a.coilNumber.length - b.coilNumber.length,
            sortOrder: sortedInfo.columnKey === "coilNumber" && sortedInfo.order,
        },
        {
            title: "Batch No",
            dataIndex: "batchNumber",
            key: "batchNumber",
            filteredValue: filteredInfo ? filteredInfo["batchNumber"] : null,
            onFilter: (value, record) => record.batchNumber == value,
            filters:
                props.inward.inwardList.length > 0
                    ? [
                        ...new Set(
                            props.inward.inwardList.map((item) => item.batchNumber)
                        ),
                    ].map((partyName) => ({ text: partyName, value: partyName }))
                    : [],
            sorter: (a, b) => a.batchNumber.length - b.batchNumber.length,
            sortOrder: sortedInfo.columnKey === "batchNumber" && sortedInfo.order,
        },
        {
            title: "Plan Date",
            dataIndex: "dReceivedDate",
            render(value) {
                return moment(value).format("Do MMM YYYY");
            },
            key: "dReceivedDate",
            filters: [],
            sorter: (a, b) => a.dReceivedDate - b.dReceivedDate,
            sortOrder: sortedInfo.columnKey === "dReceivedDate" && sortedInfo.order,
        },
        {
            title: "Material",
            dataIndex: "material.description",
            key: "material.description",
            filteredValue: filteredInfo ? filteredInfo["material.description"] : null,
            onFilter: (value, record) => record.material.description == value,
            filters:
                props.inward.inwardList.length > 0
                    ? [
                        ...new Set(
                            props.inward.inwardList.map((item) => item.material.description)
                        ),
                    ].map((material) => ({ text: material, value: material }))
                    : [],
            sorter: (a, b) =>
                a.material.description.length - b.material.description.length,
            sortOrder:
                sortedInfo.columnKey === "material.description" && sortedInfo.order,
        },
        {
            title: "Status",
            dataIndex: "status.statusName",
            key: "status.statusName",
            filters: [],
            sorter: (a, b) => a.status.statusName.length - b.status.statusName.length,
            sortOrder:
                sortedInfo.columnKey === "status.statusName" && sortedInfo.order,
        },
        {
            title: "Thickness",
            dataIndex: "fThickness",
            key: "fThickness",
            filters: [],
            sorter: (a, b) => a.fThickness - b.fThickness,
            sortOrder: sortedInfo.columnKey === "fThickness" && sortedInfo.order,
        },
        {
            title: "Weight",
            dataIndex: "fQuantity",
            key: "fQuantity",
            filters: [],
            sorter: (a, b) => a.fQuantity - b.fQuantity,
            sortOrder: sortedInfo.columnKey === "fQuantity" && sortedInfo.order,
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
            props.history.push({pathname: '/company/quality/reports/create/inward', state: {selectedItemForQr: selectedItemForQr, templateDetails: props.template.data, action: 'create'}})
        }
    }, [props.template.loading, props.template.error]);

    const showTemplateList = (record, key) => {
        console.log(record, key)
        setSelectedItemForQr(record)
        props.fetchTemplatesLinkList({ partyId: record.party.nPartyId });
    }

    const showReportView = (record, key) => {
        console.log(record, key)
        const templateDetails = qualityReportList.find(qr => qr.coilNumber === record.coilNumber && qr.inwardId === record.inwardEntryId)
        props.history.push({pathname: '/company/quality/reports/create/inward', state: {selectedItemForQr: record, templateDetails: templateDetails, action: 'view'}})
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
    };

    const onEdit = (record, key, e) => {
        console.log(record, key)
        const templateDetails = qualityReportList.find(qr => qr.coilNumber === record.coilNumber && qr.inwardId === record.inwardEntryId)
        props.history.push({pathname: '/company/quality/reports/create/inward', state: {selectedItemForQr: record, templateDetails: templateDetails, action: 'edit'}})
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
                    title={`Batch No: ${selectedItemForQr?.batchNumber}`}
                    visible={showCreateModal}
                    onOk={() => showCreateQr(true)}
                    onCancel={() => setShowCreateModal(false)}
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
                                    <p>Processing</p>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={6}>
                                    <strong>Coil No.</strong>
                                    <p>{selectedItemForQr?.coilNumber}</p>
                                </Col>
                                <Col span={6}>
                                    <strong>Batch No.</strong>
                                    <p>{selectedItemForQr?.batchNumber}</p>
                                </Col>
                                <Col span={6}>
                                    <strong>Thickness</strong>
                                    <p>{selectedItemForQr?.fThickness}</p>
                                </Col>
                                <Col span={6} >
                                    <strong>Weight</strong>
                                    <p>Processing</p>
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
    fetchQualityReportStageList
})(withRouter(PreDispatchReport));