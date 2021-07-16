import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {fetchDeliveryList, fetchPartyList, getCoilsByPartyId} from "../../../appRedux/actions";
import {Card, Table, Select, Input} from "antd";
import SearchBox from "../../../components/SearchBox";
import moment from 'moment';
const Option = Select.Option;
function List(props) {

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
        dataIndex: 'partyName',
        key: 'partyName',
        filters: []
    },
    {
        title: 'Customer Invoice Number',
        dataIndex:'customerInvoice',
        render: (text, record, index) => (
            <Input value={record.customerInvoice} onChange={onInputChange("customerInvoice", index)} />
          )
    },
    {
        title: 'Customer Invoice Date',
        dataIndex:'customerInvoiceDate',
        render: (text, record, index) => (
            <Input type="date" value={record.customerInvoiceDate} onChange={onInputChange("customerInvoiceDate", index)} />
          )
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

    const onInputChange = (key, index, type) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const newData = [...deliveryList];
        newData[index][key] =  e.target.value;
        setDeliveryList(newData);
        
        
    };
    useEffect(() => {
        props.fetchDeliveryList();
        props.fetchPartyList();
    }, [])
    useEffect(() => {
        if (searchValue) {
            const filteredData = props.deliveryList.filter((deliveryEntry) => {
                if (deliveryEntry.coilNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
                    deliveryEntry.partyName.toLowerCase().includes(searchValue.toLowerCase()) ||
                    deliveryEntry.customerBatchId.toLowerCase().includes(searchValue.toLowerCase())) {
                    return deliveryEntry
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
            if (value) {
                const filteredData = props.deliveryList.filter((deliveryEntry) =>deliveryEntry.partyName===value);
                setDeliveryList(filteredData);
            } else {
                setDeliveryList(props.deliveryList);
            }
          
        }
    function handleBlur() {
    }

    function handleFocus() {
    }
    useEffect(() => {
        if(!props.loading && props.success) {
            setDeliveryList(props.deliveryList);
        }
    }, [props.loading, props.success])


    return (
        <Card>
            <div className="gx-flex-row gx-flex-1">
            <SearchBox styleName="gx-flex-1" placeholder="Search for coil number or party name..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
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