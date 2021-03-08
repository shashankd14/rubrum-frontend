import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { Button, Card, Divider, Icon, Select, Table } from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import {
    fetchInwardList,
    getCoilsByPartyId
} from "../../../appRedux/actions/Inward";
import { fetchPartyList, setInwardSelectedForDelivery } from "../../../appRedux/actions";

const Option = Select.Option;

const List = (props) => {

    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [filteredInwardList, setFilteredInwardList] = useState(props.inward.inwardList);
    const [selectedRowKeys, setSelectedRowKeys] = useState([])

    const columns = [{
        title: 'Coil Number',
        dataIndex: 'coilNumber',
        key: 'coilNumber',
        filters: [],
        sorter: (a, b) => a.coilNumber.length - b.coilNumber.length,
        sortOrder: sortedInfo.columnKey === 'coilNumber' && sortedInfo.order,
    },
    {
        title: 'Party Name',
        dataIndex: 'party.nPartyName',
        key: 'party.nPartyName',
        filteredValue: filteredInfo ? filteredInfo["party.nPartyName"] : null,
        onFilter: (value, record) => record.party.nPartyName == value,
        filters: props.inward.inwardList.length > 0 ? [...new Set(props.inward.inwardList.map(item => item.party.nPartyName))].map(partyName => ({ text: partyName, value: partyName })) : [],
        sorter: (a, b) => a.party.nPartyName.length - b.party.nPartyName.length,
        sortOrder: sortedInfo.columnKey === 'party.nPartyName' && sortedInfo.order,
    },
    {
        title: 'Inward Date',
        dataIndex: 'dReceivedDate',
        render(value) {
            return moment(value).format('Do MMM YYYY');
        },
        key: 'dReceivedDate',
        filters: [],
        sorter: (a, b) => a.dReceivedDate.length - b.dReceivedDate.length,
        sortOrder: sortedInfo.columnKey === 'dReceivedDate' && sortedInfo.order,
    },
    {
        title: 'Material',
        dataIndex: 'material.description',
        key: 'material.description',
        filteredValue: filteredInfo ? filteredInfo["material.description"] : null,
        onFilter: (value, record) => record.material.description == value,
        filters: props.inward.inwardList.length > 0 ? [...new Set(props.inward.inwardList.map(item => item.material.description))].map(material => ({ text: material, value: material })) : [],
        sorter: (a, b) => a.material.description.length - b.material.description.length,
        sortOrder: sortedInfo.columnKey === 'material.description' && sortedInfo.order,
    },
    {
        title: 'Status',
        dataIndex: 'status.statusName',
        key: 'status.statusName',
        filters: [],
        sorter: (a, b) => a.status.statusName.length - b.status.statusName.length,
        sortOrder: sortedInfo.columnKey === 'status.statusName' && sortedInfo.order,
    },
    {
        title: 'Thickness',
        dataIndex: 'fThickness',
        key: 'fThickness',
        filters: [],
        sorter: (a, b) => a.fThickness.length - b.fThickness.length,
        sortOrder: sortedInfo.columnKey === 'fThickness' && sortedInfo.order,
    },
    {
        title: 'Weight',
        dataIndex: 'fQuantity',
        key: 'fQuantity',
        filters: [],
        sorter: (a, b) => a.fQuantity.length - b.fQuantity.length,
        sortOrder: sortedInfo.columnKey === 'fQuantity' && sortedInfo.order,
    },
    {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (text, record) => (
            <span>
                <span className="gx-link" onClick={() => props.history.push(`plan/${record.coilNumber}`)}>Plan</span>
                <Divider type="vertical" />
                <span className="gx-link">Bill</span>
                <Divider type="vertical" />
                <span className="gx-link">Transfer</span>
            </span>
        ),
    },
    ];

    useEffect(() => {
        props.fetchPartyList();
        props.fetchInwardList();
    }, []);

    useEffect(() => {
        if (searchValue) {
            const filteredData = props.inward.inwardList.filter((inward) => {
                if (inward.coilNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
                    inward.party.nPartyName.toLowerCase().includes(searchValue.toLowerCase()) ||
                    inward.vInvoiceNo.toLowerCase().includes(searchValue.toLowerCase())) {
                    return inward
                }
            });
            setFilteredInwardList(filteredData);
        } else {
            setFilteredInwardList(props.inward.inwardList);
        }
    }, [searchValue])

    const handleChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
        setFilteredInfo(filters)
    };

    const clearFilters = () => {
        setFilteredInfo(null);
    };

    const clearAll = () => {
        setSortedInfo(null);
        setFilteredInfo(null);
    };

    const exportSelectedData = () => {

    }

    const handleCustomerChange = (value) => {
        props.getCoilsByPartyId(value);
    }

    function handleBlur() {
        console.log('blur');
    }

    function handleFocus() {
        console.log('focus');
    }

    const setSelection = (record, selected, selectedRows) => {
        setSelectedRowKeys(selectedRows)
        props.setInwardSelectedForDelivery(selectedRows)
        console.log(selectedRows)
    }

    const handleSelection = {
        // selectedRowKey: props,
        onSelect: setSelection, getCheckboxProps: (record) => ({
            disabled: record.status.statusName !== 'READY TO DELIVER'
        }),
        // onChange: (selectedRowKey) => {
        //     // props.onRowSelect(selectedRowKey);
        //     console.log(selectedRowKey)
        // }
    }


    return (
        <div>
            <h1><IntlMessages id="sidebar.company.partywiseRegister" /></h1>
            <Card>
                <div className="gx-flex-row gx-flex-1">
                    <div className="table-operations gx-col">
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Select a customer"
                            optionFilterProp="children"
                            onChange={handleCustomerChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {props.party.partyList.length > 0 && props.party.partyList.map((party) => (
                                <Option value={party.nPartyId}>{party.nPartyName}</Option>
                            ))}
                        </Select>
                        <Button onClick={exportSelectedData}>Export</Button>
                        <Button onClick={clearFilters}>Clear All filters</Button>
                    </div>
                    <div className="gx-flex-row gx-w-50">
                        {selectedRowKeys.length < 1 ? <Button type="primary" icon={() => <i className="icon icon-add" />} size="medium"
                            disabled
                        >Delivery</Button> :
                            <Button type="primary" icon={() => <i className="icon icon-add" />} size="medium"
                                onClick={() => {
                                    props.history.push('/company/partywise-register/delivery')
                                }
                                }
                            >Delivery</Button>}
                        <Button type="primary" icon={() => <i className="icon icon-add" />} size="medium"
                            onClick={() => {

                                props.history.push('/company/inward/create')
                            }}
                        >Add Inward</Button>
                        <SearchBox styleName="gx-flex-1" placeholder="Search for coil number or party name..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                    </div>
                </div>
                <Table rowSelection={handleSelection}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={filteredInwardList}
                    onChange={handleChange}
                />
            </Card>
        </div>
    );
}

const mapStateToProps = state => ({
    inward: state.inward,
    party: state.party,
});

export default connect(mapStateToProps, {
    fetchPartyList,
    fetchInwardList,
    getCoilsByPartyId,
    getCoilsByPartyId,
    setInwardSelectedForDelivery,
})(List);
