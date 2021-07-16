import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {fetchDeliveryList, fetchPartyList, fetchDeliveryListById} from "../../../appRedux/actions";
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
    const [searchValue, setSearchValue] = useState('');
    const [deliveryList, setDeliveryList] = useState(props.delivery.deliveryList)
    const columns = [
    {
        title: 'Delivery Chalan Number',
        dataIndex: 'deliveryId',
        key: 'x',
        render: (text, record) => (
            <span>
            <span className="gx-link" onClick={() =>  {props.fetchDeliveryListById(record.deliveryDetails.deliveryId);props.history.push(`delivery/${record.deliveryDetails.deliveryId}`)}}>{record.deliveryDetails.deliveryId}</span>  
            </span>
        ),
        sorter: (a, b) => a.deliveryDetails.deliveryId - b.deliveryDetails.deliveryId
    },
    {
        title: 'Delivery Date',
        dataIndex: 'updatedOn',
        render(value) {
            return moment(value).format('DD/MM/YYYY');
        },
        key: 'updatedOn',
        filters: [],
        sorter: (a, b) => a.updatedOn - b.updatedOn
    },
    
    {
        title: 'Customer Name',
        dataIndex: 'partyName',
        key: 'partyName',
        sorter: (a, b) => a.partyName.length - b.partyName.length,
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
        dataIndex: 'deliveryDetails.totalWeight',
        key: 'totalWeight',
        filters: [],
        sorter: (a, b) => a.deliveryDetails?.totalWeight - b.deliveryDetails?.totalWeight
    },
    {
        title: 'Vehicle Number',
        dataIndex: 'deliveryDetails.vehicleNo',
        key: 'vehicleNo',
        filters: [],
        sorter: (a, b) => a.deliveryDetails.vehicleNo.length - b.deliveryDetails.vehicleNo.length
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
            const filteredData = props.delivery.deliveryList.filter((deliveryEntry) => {
                if (deliveryEntry.coilNumber.includes(searchValue) ||
                    deliveryEntry.partyName.toLowerCase().includes(searchValue.toLowerCase()) ||
                    deliveryEntry?.customerBatchId.toLowerCase().includes(searchValue.toLowerCase())) {
                    return deliveryEntry
                }
            });
            setDeliveryList(filteredData);
        } else {
            setDeliveryList(props.delivery.deliveryList);
        }
    }, [searchValue])
    const handleChange = (pagination, filters, sorter) => {
        console.log('params', pagination, filters, sorter);
    };
    
    const handleCustomerChange = (value) => {
        let partyList = props.party.partyList.find(element =>  element.nPartyId === value);
        if (partyList.partyName) {
         const filteredData = props.delivery.deliveryList.filter((deliveryEntry) =>deliveryEntry.partyName===partyList.partyName);                setDeliveryList(filteredData);
        } else {
         setDeliveryList(props.delivery.deliveryList);
      }
    }
    useEffect(() => {
        if(!props.delivery.loading && props.delivery.success) {
            setDeliveryList(props.delivery.deliveryList);
        }
    }, [props.delivery.loading, props.delivery.success])


    return (
        <Card>
            <div className="gx-flex-row gx-flex-1">
            <SearchBox styleName="gx-flex-1" placeholder="Search for coil number or party name or customer batch No..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                    <div className="table-operations gx-col">
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Select a customer"
                            optionFilterProp="children"
                            onChange={handleCustomerChange}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {props.party.partyList.length > 0 && props.party.partyList.map((party) => (
                                <Option value={party.nPartyId}>{party.partyName}</Option>
                            ))}
                        </Select>
                    </div>
                   </div>
                   
                <Table
                rowSelection={[]}
                   className="gx-table-responsive"
                   columns={columns}
                   dataSource={deliveryList}
                   onChange={handleChange}
            />
        </Card>
    );
}

const mapStateToProps = state => ({
    delivery: state.deliveries,
    party: state.party,
});

export default connect(mapStateToProps, {
    fetchDeliveryList,
    fetchPartyList,
    fetchDeliveryListById
})(List);