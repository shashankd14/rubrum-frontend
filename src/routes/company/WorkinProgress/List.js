import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Button, Card, Divider, Icon, Table} from "antd";
import moment from 'moment';
import {fetchWorkInProgressList} from "../../../appRedux/actions";
import {
    fetchInwardList,
    resetInwardForm
} from "../../../appRedux/actions/Inward";

function  List(props) {

    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [filteredInwardList, setFilteredInwardList] = useState(props.inward.inwardList);
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
        filters:[] ,
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
                <span className="gx-link" onClick={() => record.coilNumber? props.history.push(`plan/${record.coilNumber}`):props.history.push(`test/${record.instructionId}`)}>Finish</span>
            </span>
        ),
    },
    ];

    useEffect(() => {
        props.fetchInwardList();
    }, []);

    const handleChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
        setFilteredInfo(filters)
    };

    return (
        <Card>
            <Table rowSelection={[]}
                   className="gx-table-responsive"
                   columns={columns}
                   dataSource={filteredInwardList.filter(filteredInfo => filteredInfo.status.statusName ==='IN PROGRESS')}
                   onChange={handleChange}
            />
        </Card>
    );
}

const mapStateToProps = state => ({
    inward: state.inward,
});


export default connect(mapStateToProps, {
    fetchInwardList
})(List);