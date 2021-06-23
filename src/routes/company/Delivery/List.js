import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {fetchDeliveryList, fetchPartyList, getCoilsByPartyId} from "../../../appRedux/actions";
import {Button, Card, Table, Select} from "antd";
import moment from 'moment';
const Option = Select.Option;
function  List(props) {

    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });

    const [filteredInfo, setFilteredInfo] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [searchValue, setSearchValue] = useState('');
    const [deliveryList, setDeliveryList] = useState(props.deliveryList)
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
        title: 'Customer Name',
        dataIndex: '',
        key: '',
        filters: []
    },
    {
        title: 'Quantity Delivered',
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
        props.fetchPartyList();
    }, [])
    useEffect(() => {
        if (searchValue) {
            const filteredData = props.deliveryList.filter((inward) => {
                if (inward.coilNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
                    inward.party.partyName.toLowerCase().includes(searchValue.toLowerCase()) ||
                    inward.vInvoiceNo.toLowerCase().includes(searchValue.toLowerCase())) {
                    return inward
                }
            });
            setDeliveryList(filteredData);
        } else {
            setDeliveryList(props.deliveryList);
        }
    }, [searchValue])
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
    const handleCustomerChange = (value) => {
        props.getCoilsByPartyId(value);
    }
    function handleBlur() {
    }

    function handleFocus() {
    }


    return (
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
                                <Option value={party.nPartyId}>{party.partyName}</Option>
                            ))}
                        </Select>
                    </div>
                   </div>
            <Table rowSelection={handleSelection}
                   className="gx-table-responsive"
                   columns={columns}
                   dataSource={deliveryList}
                   onChange={handleChange}
            />
        </Card>
    );
}

const mapStateToProps = state => ({
    deliveryList: state.deliveries.deliveryList,
    party: state.party
});

export default connect(mapStateToProps, {
    fetchDeliveryList,
    fetchPartyList,
    getCoilsByPartyId
})(List);