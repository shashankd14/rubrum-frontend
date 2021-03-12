import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {fetchDeliveryList} from "../../../appRedux/actions";
import {Card, Table} from "antd";
import moment from 'moment';

function  List(props) {

    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });

    const [filteredInfo, setFilteredInfo] = useState(null);
    const columns = [
    {
        title: 'Delivery Chalan Number',
        dataIndex: '',
        key: 'x',
        render: (text, record) => (
            <span>
            <span className="gx-link" onClick={() =>  props.history.push(`delivery/${record.deliveryId}`)}>{record.deliveryId}</span>  
            </span>
        ),
    },
    {
        title: 'Coil Number',
        dataIndex: 'instructionId',
        key: 'instructionId',
        filters: [],
        sortOrder: sortedInfo.columnKey === 'instructionId' && sortedInfo.order,
    },
    {
        title: 'Customer Name',
        dataIndex: '',
        key: '',
        filters: [],
        sortOrder: sortedInfo.columnKey === '' && sortedInfo.order,
    },
    {
        title: 'Delivery Date',
        dataIndex: 'updatedOn',
        render(value) {
            return moment(value).format('Do MMM YYYY');
        },
        key: 'updatedOn',
        filters: [],
        sorter: (a, b) => a.updatedOn.length - b.updatedOn.length,
        sortOrder: sortedInfo.columnKey === 'updatedOn' && sortedInfo.order,
    },
    {
        title: 'Total Quantity',
        dataIndex: 'packingWeight',
        key: 'packingWeight',
        filters: [],
        sortOrder: sortedInfo.columnKey === 'packingWeight' && sortedInfo.order,
    },
    {
        title: 'Vehicle Number',
        dataIndex: '',
        key: '',
        filters: [],
        sortOrder: sortedInfo.columnKey === '' && sortedInfo.order,
    },
    {
        title: 'Thickness',
        dataIndex: '',
        key: '',
        filters: [],
        sortOrder: sortedInfo.columnKey === 'instrctionId' && sortedInfo.order,
    },
        {
            title: 'Weight',
            dataIndex: '',
            key: '',
            filters: [],
            sortOrder: sortedInfo.columnKey === '' && sortedInfo.order,
        },
        {
            title: 'Status',
            dataIndex: '',
            key: '',
            filters: [],
            sortOrder: sortedInfo.columnKey === '' && sortedInfo.order,
        }
    ]

    useEffect(() => {
        props.fetchDeliveryList();
    }, [])

    const handleChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
        setFilteredInfo(filters)
    };

    return (
        <Card>
            <Table rowSelection={[]}
                   className="gx-table-responsive"
                   columns={columns}
                   dataSource={props.deliveryList}
                   onChange={handleChange}
            />
        </Card>
    );
}

const mapStateToProps = state => ({
    deliveryList: state.deliveries.deliveryList,
});

export default connect(mapStateToProps, {
    fetchDeliveryList,
})(List);