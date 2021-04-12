import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {fetchDeliveryList} from "../../../appRedux/actions";
import {Button, Card, Table} from "antd";
import moment from 'moment';

function  List(props) {

    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });

    const [filteredInfo, setFilteredInfo] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
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
        title: 'Delivery Date',
        dataIndex: 'updatedOn',
        render(value) {
            return moment(value).format('DD/MM/YYYY');
        },
        key: 'updatedOn',
        filters: [],
        sorter: (a, b) => a.updatedOn.length - b.updatedOn.length,
        sortOrder: sortedInfo.columnKey === 'updatedOn' && sortedInfo.order,
    },
    {
        title: 'Total Quantity',
        dataIndex: 'totalWeight',
        key: 'totalWeight',
        filters: [],
        sortOrder: sortedInfo.columnKey === 'totalWeight' && sortedInfo.order,
    },
    {
        title: 'Vehicle Number',
        dataIndex: 'vehicleNo',
        key: 'vehicleNo',
        filters: [],
        sortOrder: sortedInfo.columnKey === 'vehicleNo' && sortedInfo.order,
    }
    ]

    useEffect(() => {
        props.fetchDeliveryList();
    }, [])

    const handleChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
        setFilteredInfo(filters)
    };
    const setSelection = (record, selected, selectedRows) => {
        setSelectedRowKeys(selectedRows)
        // props.setInwardSelectedForDelivery(selectedRows)
    }
    const handleSelection = {
        // selectedRowKey: props,
        onSelect: setSelection, getCheckboxProps: (record) => ({
            disabled: false
        })
    }

    return (
        <Card>
            <div className="gx-flex-row gx-flex-1">
                <div className="gx-flex-row gx-w-50">
                    {selectedRowKeys.length < 1 ? <Button type="primary" icon={() => <i className="icon icon-add" />} size="medium"
                            disabled
                        >Billing</Button> :
                            <Button type="primary" icon={() => <i className="icon icon-add" />} size="medium"
                                onClick={() => {
                                    props.history.push('/company/delivery/billingInfo')
                                }
                                }
                            >Billing</Button>}
                </div>  
            </div>

            <Table rowSelection={handleSelection}
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