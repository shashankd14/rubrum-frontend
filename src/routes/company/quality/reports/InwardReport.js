import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { Link, useHistory, useLocation, withRouter } from "react-router-dom";
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
import StatusButton from './create/StatusButton';

const InwardReport = (props) => {

    const intl = useIntl();
    const history = useHistory();
    const location = useLocation();
    const [sortedInfo, setSortedInfo] = useState({
        order: "descend",
        columnKey: "age",
    });
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [filteredInwardList, setFilteredInwardList] = useState([]);
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
    const [action, setAction] = useState(undefined);

    const disabledEle = 'disabled-ele';
    const renderStatusColumn = (record) => {
        const qirId = record.qirId;

        if (qirId === null) {
          return (
            <button className="cylinder-button">
              ToDo
            </button>
          );
        } else {
          return (
            <button className="cylinder-button">
              Completed
            </button>
          );
        }
      };

    const columns = [
        {
            title: "Coil Number",
            dataIndex: "coilNo",
            key: "coilNo",
            filters: [],
            sorter: (a, b) => a.coilNo.length - b.coilNo.length,
            sortOrder: sortedInfo.columnKey === "coilNo" && sortedInfo.order,
        },
        {
            title: "Batch Number",
            dataIndex: "customerBatchNo",
            key: "customerBatchNo",
            filteredValue: filteredInfo ? filteredInfo["customerBatchNo"] : null,
            onFilter: (value, record) => record.customerBatchNo == value,
            filters: [],
            sorter: (a, b) => a.customerBatchNo.length - b.customerBatchNo.length,
            sortOrder: sortedInfo.columnKey === "customerBatchNo" && sortedInfo.order,
        },
        {
            title: "Inward Date",
            dataIndex: "planDate",
            render(value) {
               // return moment(value).format("Do MMM YYYY");
               const formattedDate = moment(value, "DD/MM/YYYY").format("Do MMM YYYY");
                return <span>{formattedDate}</span>;
            },
            key: "planDate",
            filters: [],
            //sorter: (a, b) => a.planDate - b.planDate,
            sorter: (a, b) => moment(a.planDate, "DD/MM/YYYY").valueOf() - moment(b.planDate, "DD/MM/YYYY").valueOf(),
            sortOrder: sortedInfo.columnKey === "planDate" && sortedInfo.order,
        },
        {
            title: "Material",
            dataIndex: "materialGrade",
            key: "materialGrade",
            filteredValue: filteredInfo ? filteredInfo["materialGrade"] : null,
            onFilter: (value, record) => record.materialGrade == value,
            filters: [],
            sorter: (a, b) =>
                a.materialGrade.length - b.materialGrade.length,
            sortOrder:
                sortedInfo.columnKey === "materialGrade" && sortedInfo.order,
        },
        {
            title: "Thickness",
            dataIndex: "fthickness",
            key: "fthickness",
            filters: [],
            sorter: (a, b) => a.fthickness - b.fthickness,
            sortOrder: sortedInfo.columnKey === "fthickness" && sortedInfo.order,
        },
        {
            title: "Weight",
            dataIndex: "targetWeight",
            key: "targetWeight",
            filters: [],
            sorter: (a, b) => a.targetWeight - b.targetWeight,
            sortOrder: sortedInfo.columnKey === "targetWeight" && sortedInfo.order,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            filters: [],
            sorter: (a, b) => a.status.length - b.status.length,
            sortOrder:
                sortedInfo.columnKey === "status" && sortedInfo.order,
                render: (text, record) => renderStatusColumn(record),
        },
        {
            title: "Action",
            dataIndex: "",
            key: "x",
            render: (text, record, index) => (
                <span>
                    <span
                        className={`gx-link ${record.qirId && disabledEle}`}
                        onClick={(e) => showTemplateList(record, index, e)}
                    >
                        Create QR
                    </span>
                    <Divider type="vertical" />
                    <span
                        className={`gx-link ${!record.qirId && disabledEle}`}
                        //className={`gx-link ${record.qirId && disabledEle}`}
                        onClick={(e) => showReportView(record, index, e)}
                    >
                        View
                    </span>
                    <Divider type="vertical" />
                    <span className={`gx-link ${!record.qirId && disabledEle}`} onClick={(e) => onEdit(record, index, e)}>
                    {/* <span className={`gx-link ${record.qirId && disabledEle}`} onClick={(e) => onEdit(record, index, e)}> */}
                        Edit
                    </span>
                    <Divider type="vertical" />
                    <span className={`gx-link ${!record.qirId && disabledEle}`} onClick={(e) => onDelete(record, index, e)}>
                    {/* <span className={`gx-link ${record.qirId && disabledEle}`} onClick={(e) => onDelete(record, index, e)}> */}
                        Delete
                    </span>
                </span>
            ),
        },
    ];

    useEffect(() => {
        props.fetchQualityReportStageList({ stage: "inward", page: 1, pageSize: 15, partyId: '' });
        // props.fetchInwardList();
        props.fetchQualityReportList();
        props.fetchPartyList();
        props.fetchTemplatesList();
    }, []);

    // useEffect(() => {
    //     if (searchValue) {
    //       if (searchValue.length >= 3) {
    //         setPageNo(1);
    //         props.fetchQualityReportStageList(1, 15, searchValue);
    //       }
    //     } else {
    //       setPageNo(1);
    //       props.fetchQualityReportStageList(1, 15, searchValue);
    //     }
    //   }, [searchValue]);

    useEffect(() => {
        const { template } = props;
        if(searchValue) {
            const filteredData = filteredInwardList.filter(item => 
            (item.coilNo.toLowerCase().includes(searchValue.toLowerCase())) ||
            (item.customerBatchNo.toLowerCase().includes(searchValue.toLowerCase())));

            setFilteredInwardList(filteredData);
            console.log("filteredData", filteredData);
        } else {
            setFilteredInwardList(template.data);
        }  
           
    }, [searchValue]);


    useEffect(() => {
        if (!props.template.loading && !props.template.error && props.template.operation == "fetchQualityReport") {
            console.log(props.template)
            setQualityReportList(props.template.data)
        } else if (!props.template.loading && !props.template.error && props.template.operation == "fetchQualityReportStage") {
            console.log(props.template)
            setFilteredInwardList(props.template.data)
        } else if (!props.template.loading && !props.template.error && props.template.operation === 'templateById') {
            console.log(props)
            setShowCreateQrScreen(true)
            // history.push('/company/quality/reports/create/inward')
            props.history.push({ pathname: '/company/quality/reports/create/inward', state: { selectedItemForQr: selectedItemForQr, templateDetails: props.template.data, action: 'create' } })
        } else if (!props.template.loading && !props.template.error && props.template.operation == "templateLinkList") {
            var tempData = props.template.data;
            setTemplateLinkList(tempData.filter(x=> x.stageName==="INWARD"))
            setShowCreateModal(true)
        } else if (!props.template.loading && !props.template.error && props.template.operation === 'templateList') {
            console.log(props.template)
            setTemplateList(props.template.data)
        } else if (!props.template.loading && !props.template.error && props.template.operation == "qualityReportById") {
            console.log("qualityReportById", props.template)
            props.history.push({ pathname: '/company/quality/reports/create/inward', state: { selectedItemForQr: selectedItemForQr, templateDetails: props.template.data, action: action } })
        }
    }, [props.template.loading, props.template.error, props.template.operation]);
    const showCreateQr = () => {
        // props.history.push()
        setAction('create');
        if (templateId)
        {
            setTemplateId(templateId);
            props.getQualityTemplateById(templateId)
        }
    }

    const showTemplateList = (record, key) => {
        console.log(record, key)
        setSelectedItemForQr(record)
        setShowCreateModal(true);
        props.fetchTemplatesLinkList({ partyId: record.npartyId});
    }

    const showReportView = (record, key) => {
        console.log("record, key", record, key)
        setSelectedItemForQr(record)
        // const templateDetails = qualityReportList.find(qr => qr.coilNumber === record.coilNumber && qr.inwardId === record.inwardEntryId)
        // props.history.push({pathname: '/company/quality/reports/create/postdispatch', state: {selectedItemForQr: record, templateDetails: templateDetails, action: 'view'}})
        setAction('view');
        props.getQualityReportById(record.qirId);

    }

    const onDelete = (record, key, e) => {
        console.log(record, key);
        console.log("record.qirId", record.qirId);
        props.deleteQualityReport(record.qirId);
    };

    const onEdit = (record, key, e) => {
        console.log(record, key)
        setSelectedItemForQr(record)
        setAction('edit');
        props.getQualityReportById(record.qirId);
    };

    const handleChange = (e) => {
        console.log(e)
        setTemplateId(e)
    };

    useEffect(() => {
        if (!props.party.loading && !props.party.error) {
            console.log(props.party)
            setPartyList(props.party.partyList)
        }
    }, [props.party.loading, props.party.error]);


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
                        placeholder="Search by Coil no. or Customer batch no"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}>
                    </SearchBox>

                </div>
            </div>
            <div className="gx-flex-row gx-flex-1">
                {(filteredInwardList.length > 0) && <Table
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={filteredInwardList}
                    pagination={{
                        pageSize: 15,
                        onChange: (page) => {
                            setPageNo(page);
                            props.fetchQualityReportStageList(page, 15, searchValue);
                        },
                        current: pageNo,
                        total: totalPageItems,
                    }}
                />}
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
                                <p>{selectedItemForQr?.partyName}</p>
                            </Col>
                            <Col span={12} style={{ right: 0, position: 'absolute' }}>
                                <strong>Stage</strong>
                                <p>Inward</p>
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
                                <strong>Thickness</strong>
                                <p>{selectedItemForQr?.fthickness}</p>
                            </Col>
                            <Col span={6} >
                                <strong>Weight</strong>
                                <p>{selectedItemForQr?.targetWeight}</p>
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
    fetchInwardList,
    fetchTemplatesList,
    fetchPartyList,
    fetchTemplatesLinkList,
    getQualityTemplateById,
    fetchQualityReportList,
    getQualityReportById,
    updateQualityReport,
    deleteQualityReport,
    fetchQualityReportStageList
})(withRouter(InwardReport));