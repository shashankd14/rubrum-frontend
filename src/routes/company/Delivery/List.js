import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {fetchDeliveryList, fetchPartyList, fetchDeliveryListById, postDeliveryConfirm,deleteByDeliveryId, resetDeleteInward} from "../../../appRedux/actions";
import {Card, Table, Select, Input, message} from "antd";
import SearchBox from "../../../components/SearchBox";
import ReconcileModal from "./ReconcileModal";
import moment from 'moment';
import IntlMessages from "../../../util/IntlMessages";
const Option = Select.Option;
function List(props) {

    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });

    const [filteredInfo, setFilteredInfo] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [deliveryList, setDeliveryList] = useState(props.delivery.deliveryList)
    const [reconcileModal, setreconcileModal] = useState(false);
    const [deliveryRecord, setDeliveryRecord] = useState();
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
        dataIndex: 'deliveryDetails.updatedOn',
        render(value) {
            return moment(value).format('DD/MM/YYYY');
        },
        key: 'updatedOn',
        filters: [],
        sorter: (a, b) => a.deliveryDetails.updatedOn - b.deliveryDetails.updatedOn
    },
    
    {
        title: 'Customer Name',
        dataIndex: 'partyName',
        key: 'partyName',
        sorter: (a, b) => a.partyName.length - b.partyName.length,
        filters: []
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
    },
    {
        title: 'Customer Invoice Number',
        dataIndex:'deliveryDetails.customerInvoiceNo',
        render: (text, record, index) => (
            <Input value={record.deliveryDetails.customerInvoiceNo} onChange={onInputChange("customerInvoiceNo", index)} />
          )
    },
    {
        title: 'Customer Invoice Date',
        dataIndex:'deliveryDetails.customerInvoiceDate',
        render: (text, record, index) => (
            <Input type="date" value={record.deliveryDetails.customerInvoiceDate} onChange={onInputChange("customerInvoiceDate", index)} />
          )
    },
    {
        title: 'Action',
        render: (text, record) => (
            <span>
                <i className="icon icon-add-circle" onClick={() => handleAdd(record)}/>
                <i className="icon icon-trash gx-margin" onClick={() => handleDelete(record)}/>
                <span className="gx-link"style={{display: "none"}} onClick={() => {setDeliveryRecord(record);setreconcileModal(true);}}>Reconcile</span>
            </span>
        ),
    },
    ]
    useEffect(() => {
        if(props.delivery.deleteSuccess) {
            message.success('Successfully deleted the coil', 2).then(() => {
                props.fetchDeliveryList();
                props.resetDeleteInward();
                
            });
        }
    }, [props.delivery.deleteSuccess])
    const handleDelete=(record)=>{
        props.deleteByDeliveryId(Number(record.deliveryDetails.deliveryId))
    }
    const handleAdd =(record)=>{
        let reqObj ={
           deliveryId: record.deliveryDetails.deliveryId,
            customerInvoiceDate:record.customerInvoiceDate,
            customerInvoiceNo:record.customerInvoice
        };
        props.postDeliveryConfirm(reqObj);

    }
    const onInputChange = (key, index, type) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const newData = [...deliveryList];
        newData[index].deliveryDetails[key] = e.target.value;
        setDeliveryList(newData);
    };
    useEffect(() => {
        props.fetchDeliveryList();
        props.fetchPartyList();
    }, [])
    useEffect(() => {
        if (searchValue) {
            const filteredData = props.delivery.deliveryList.filter((deliveryEntry) => {
                if (deliveryEntry?.coilNumber.includes(searchValue) ||
                    deliveryEntry?.partyName?.toLowerCase().includes(searchValue.toLowerCase()) ||
                    deliveryEntry?.customerBatchId?.toLowerCase().includes(searchValue.toLowerCase())) {
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
        <div><h1><IntlMessages id="sidebar.company.deliveryItems" /></h1>
        <Card>
            <div className="gx-flex-row gx-flex-1">
            {reconcileModal ? <ReconcileModal showModal={reconcileModal} deliveryRecord={deliveryRecord}/>: null}
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
        </div>
    );
}

const mapStateToProps = state => ({
    delivery: state.deliveries,
    party: state.party
});

export default connect(mapStateToProps, {
    fetchDeliveryList,
    fetchPartyList,
    fetchDeliveryListById,
    postDeliveryConfirm,
    deleteByDeliveryId,
    resetDeleteInward
})(List);