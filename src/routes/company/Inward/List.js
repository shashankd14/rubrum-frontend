import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Icon, Table} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import {
    fetchInwardList,
} from "../../../appRedux/actions/Inward";

const List = (props) => {

    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    const [filteredInfo, setFilteredInfo] = useState(null);

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
        filters: [],
        sorter: (a, b) => a.party.nPartyName.length - b.party.nPartyName.length,
        sortOrder: sortedInfo.columnKey === 'party.nPartyName' && sortedInfo.order,
    },
    {
        title: 'Inward Date',
        dataIndex: 'dReceivedDate',
        render (value) {
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
        filters: [],
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
                <span className="gx-link">View</span>
                <Divider type="vertical"/>
                <span className="gx-link">Edit</span>
                <Divider type="vertical"/>
                <span className="gx-link">Delete</span>
            </span>
        ),
    },
    ];

    useEffect(() => {
        props.fetchInwardList();
    }, []);

    const handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
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

    const setAgeSort = () => {
        sortedInfo({
            order: 'descend',
            columnKey: 'coilNumber',
        });
    };

    return (
        <div>
            <h1><IntlMessages id="sidebar.company.inwardList"/></h1>
            <Card>
                <div className="gx-flex-row gx-flex-1">
                    <div className="table-operations gx-col">
                        <Button onClick={setAgeSort}>Delete</Button>
                        <Button onClick={clearFilters}>Export</Button>
                    </div>
                    <div className="gx-flex-row gx-w-50">
                        <Button type="primary" icon={() => <i className="icon icon-add"/>} size="medium"
                                onClick={() => props.history.push('/company/inward/create')}
                        >Add Inward</Button>
                        <SearchBox styleName="gx-flex-1" placeholder="Search for coil number or party name..."/>
                    </div>
                </div>
                <Table className="gx-table-responsive" columns={columns} dataSource={props.inward.inwardList} onChange={handleChange}/>
            </Card>
        </div>
    );
}

const mapStateToProps = state => ({
    inward: state.inward,
});

export default connect(mapStateToProps, {
    fetchInwardList
})(List);
