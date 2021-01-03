import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {fetchDeliveryList} from "../../../appRedux/actions";
import {Card, Table} from "antd";

function  List(props) {

    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });

    const [filteredInfo, setFilteredInfo] = useState(null);
    const columns = [{
        title: 'Delivery ID',
        dataIndex: 'deliveryId',
        key: 'deliveryId',
        filters: [],
        sortOrder: sortedInfo.columnKey === 'deliveryId' && sortedInfo.order,
    },
        {
            title: 'Instruction ID',
            dataIndex: 'instructionId',
            key: 'instructionId',
            filters: [],
            sortOrder: sortedInfo.columnKey === 'instructionId' && sortedInfo.order,
        },
        {
            title: 'Delivery Date',
            dataIndex: 'instructionId',
            key: 'instructionId',
            filters: [],
            sortOrder: sortedInfo.columnKey === 'instructionId' && sortedInfo.order,
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