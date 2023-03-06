import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { useHistory } from "react-router";
import { Button, Card, Col, Divider, Icon, Radio, Row, Select, Table } from 'antd'
import {
    fetchPartyList,
    fetchInwardList,
} from "../../../../appRedux/actions";
import moment from "moment";
import { useIntl } from "react-intl";
import SearchBox from "../../../../components/SearchBox";

import IntlMessages from "../../../../util/IntlMessages";

const InwardTemplate = (props) => {

    const intl = useIntl();
    const history = useHistory();
    const [sortedInfo, setSortedInfo] = useState({
        order: "descend",
        columnKey: "age",
    });
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [filteredInwardList, setFilteredInwardList] = useState(
        props.inward.inwardList
    );

    const [pageNo, setPageNo] = React.useState(1);
    const [totalPageItems, setTotalItems] = React.useState(0);
    const [partyList, setPartyList] = useState([]);
    const [customerValue, setCustomerValue] = useState("");
    const { totalItems } = props.inward;

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
            title: "Party Name",
            dataIndex: "party.partyName",
            key: "party.partyName",
            filteredValue: filteredInfo ? filteredInfo["party.partyName"] : null,
            onFilter: (value, record) => record.party.partyName == value,
            filters:
                props.inward.inwardList.length > 0
                    ? [
                        ...new Set(
                            props.inward.inwardList.map((item) => item.party.partyName)
                        ),
                    ].map((partyName) => ({ text: partyName, value: partyName }))
                    : [],
            sorter: (a, b) => a.party.partyName.length - b.party.partyName.length,
            sortOrder: sortedInfo.columnKey === "party.partyName" && sortedInfo.order,
        },
        {
            title: "Inward Date",
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
                        onClick={() => props.history.push(`${record.coilNumber}`)}
                    >
                        Create QR
                    </span>
                    <Divider type="vertical" />
                    <span
                        className="gx-link"
                        onClick={() => props.history.push(`${record.coilNumber}`)}
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

    const onDelete = (record, key, e) => {
        console.log(record, key);
    };

    const onEdit = (record, key, e) => {
        console.log(record, key);
    };

    const handleChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
        setFilteredInfo(filters);
    };

    useEffect(() => {
        if (!props.inward.loading && props.inward.success) {
            setFilteredInwardList(props.inward.inwardList);
        }
    }, [props.inward.loading, props.inward.success]);

    useEffect(() => {
        if (searchValue) {
            if (searchValue.length >= 3) {
                setPageNo(1);
                props.fetchInwardList(1, 15, searchValue);
            }
        } else {
            setPageNo(1);
            props.fetchInwardList(1, 15, searchValue);
        }
    }, [searchValue]);


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
                        value={customerValue}
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
                                <Select.Option value={party.nPartyId}>{party.partyName}</Select.Option>
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
                    rowSelection={[]}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={filteredInwardList}
                    onChange={handleChange}
                    pagination={{
                        pageSize: 15,
                        onChange: (page) => {
                            setPageNo(page);
                            props.fetchInwardList(page, 15, searchValue);
                        },
                        current: pageNo,
                        total: totalPageItems,
                    }}
                />
            </div>
        </>
    )
}

const mapStateToProps = (state) => ({
    inward: state.inward,
    party: state.party,
});

export default connect(mapStateToProps, {
    fetchInwardList,
    fetchPartyList
})(InwardTemplate);