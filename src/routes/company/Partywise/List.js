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
    let filter = props.inward.inwardList.map(item =>{
        if(item.instruction.length>0){
            item.children= item.instruction.filter(ins => ins.groupId === null)
         }
         return item
     })
    const [filteredInwardList, setFilteredInwardList] = useState(filter);
    const [expandedRow, setExpandedRecord] = useState([]);

    const [selectedCBKeys, setSelectedCBKeys] = React.useState([]);
    const [selectedRowData, setSelectedRowData] = React.useState([]);

    useEffect(() => {
        console.log('selected rows', selectedRowData, selectedCBKeys);
        props.setInwardSelectedForDelivery(selectedRowData);
    }, [selectedRowData]);

    const columns = [{
        title: 'Coil Number',
        dataIndex: 'coilNumber',
        key: 'coilNumber',
        filters: [],
        sorter: (a, b) => a.coilNumber?.length - b.coilNumber?.length,
        sortOrder: sortedInfo.columnKey === 'coilNumber' && sortedInfo.order,
        ellipsis: true
    },
    {
        title: 'Customer Batch No',
        dataIndex: 'customerBatchId',
        key: 'customerBatchId',
        filteredValue: filteredInfo ? filteredInfo["customerBatchId"] : null,
        onFilter: (value, record) => record.customerBatchId == value,
        filters: [],
        sorter: (a, b) => a.customerBatchId?.length - b.customerBatchId?.length,
        sortOrder: sortedInfo.columnKey === 'customerBatchId' && sortedInfo.order,
        render: (text, record) => {
            if (record.customerBatchId ) return record.customerBatchId;
            else {
                let batchId = '';
                expandedRow.forEach(row => {
                    if (row.child.includes(record.instructionId)) {
                        batchId = row.batch
                    }
                })
                return batchId;
            }
        }
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
        title: 'Thickness',
        dataIndex: 'fThickness',
        key: 'fThickness',
        filters: [],
        sorter: (a, b) => a.fThickness - b.fThickness,
        sortOrder: sortedInfo.columnKey === 'fThickness' && sortedInfo.order,
        render: (text, record) => {
            if (record.fThickness ) return record.fThickness;
            else {
                let thickness = '';
                expandedRow.forEach(row => {
                    if (row.child.includes(record.instructionId)) {
                        thickness = row.fThickness
                    }
                })
                return thickness;
            }
        }
    },
    {
        title: 'Width',
        dataIndex: 'fWidth',
        key: 'fWidth',
        filters: [],
        sorter: (a, b) => a.fWidth - b.fWidth,
        sortOrder: sortedInfo.columnKey === 'fWidth' && sortedInfo.order,
        render: (text, record) => {
            return record.fWidth || record.actualWidth || record.plannedWidth;
        }
    },
    {
        title: 'Length',
        dataIndex: 'fLength',
        key: 'fLength',
        filters: [],
        sorter: (a, b) => a.fLength - b.fLength,
        sortOrder: sortedInfo.columnKey === 'fLength' && sortedInfo.order,
        render: (text, record) => {
            return record.fLength || record.actualLength || record.plannedLength;
        }
    },
    {
        title: 'Present Weight',
        dataIndex: 'inStockWeight',
        key: 'inStockWeight',
        filters: [],
        sorter: (a, b) => a.inStockWeight - b.inStockWeight,
        sortOrder: sortedInfo.columnKey === 'inStockWeight' && sortedInfo.order,
        render: (text, record) => {
            return record.inStockWeight || record.actualWeight || record.plannedWeight;
        }
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
   
const getFilterData=(list)=>{
    let filter = list.map(item =>{
    if(item.instruction.length>0){
        item.children = item.instruction.filter(ins => ins.groupId === null);
    }
      return item
     })
    return filter;
}
    useEffect(() => {
        if(!props.inward.loading && props.inward.success) {
            setFilteredInwardList(getFilterData(props.inward.inwardList));
        }
    }, [props.inward.loading, props.inward.success])

    useEffect(() => {
        if (searchValue) {
            const filteredData = props.inward.inwardList.filter((inward) => {
                if (inward.coilNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
                    inward.party.partyName.toLowerCase().includes(searchValue.toLowerCase()) ||
                    inward.vInvoiceNo.toLowerCase().includes(searchValue.toLowerCase())) {
                    return inward
                }
            });
            
            setFilteredInwardList(getFilterData(filteredData));
        } else {
            setFilteredInwardList(getFilterData(props.inward.inwardList));
        }
    }, [searchValue])

    const handleChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
        setFilteredInfo(filters)
    };

    const clearFilters = (value) => {
        setFilteredInfo(null);
        setSearchValue('');
    };

    const clearAll = () => {
        setSortedInfo(null);
        setFilteredInfo(null);
    };

    const exportSelectedData = () => {

    }

    const handleCustomerChange = (value) => {
        if (value) {
            const filteredData = props.inward.inwardList.filter((inward) =>inward.party.nPartyId===value);
            setFilteredInwardList(filteredData);
        } else {
            setFilteredInwardList(props.inward.inwardList);
        }
      
    }

    const handleBlur= ()=> {
    }

    function handleFocus() {
    }

    const storeKey = data => {
        if (selectedCBKeys.includes(data.key)) {
          const newSet = selectedCBKeys;
          const index = selectedCBKeys.indexOf(data.key);
          newSet.splice(index, 1);
          setSelectedCBKeys(newSet);
          setSelectedRowData(oldData => oldData.filter(row => row.key !== data.key));
          return;
        } else {
            setSelectedCBKeys(oldArr => [...oldArr, data.key]);
            setSelectedRowData(oldData => [...oldData, data]);
        }
      };

    const getKey = data => {
        if (data.status.statusName === 'READY TO DELIVER') {
            storeKey(data);
            if (data.children) {
                data.children.map(item => getKey(item));
            }
        }
      };

      const rowSelection = {
        onSelect: (record) => {
            if (record.status.statusName === 'READY TO DELIVER') {
                getKey(record);
            }
        },
        getCheckboxProps: (record) => ({
            disabled: record.status.statusName !== 'READY TO DELIVER'
        }),
        onSelectAll: (selected, selectedRows, changeRows) => {
            if (changeRows.length === selectedCBKeys.length) {
                setSelectedCBKeys([]);
                setSelectedRowData([]);
            } else {
                changeRows.map(item => {
                    if (item.status.statusName === 'READY TO DELIVER') {
                      getKey(item)
                    }
                });
            }
            console.log(selectedRows);
          
        },
        selectedRowKeys: selectedCBKeys,
      };

    return (
        <div>
            <h1><IntlMessages id="sidebar.company.partywiseRegister" /></h1>
            <Card>
                <div className="gx-flex-row gx-flex-1">
                    <div className="table-operations gx-col">
                        <Select
                            id="select"
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
                        <Button onClick={exportSelectedData}>Export</Button>
                        <Button onClick={clearFilters}>Clear All filters</Button>
                    </div>
                    <div className="gx-flex-row gx-w-50">
                        <Button type="primary" 
                            icon={() => <i className="icon icon-add" />} 
                            size="medium"
                            onClick={() => {
                                props.history.push('/company/partywise-register/delivery')
                            }}
                            disabled={!!selectedCBKeys?.length < 1}
                        >Delivery</Button>
                            
                        <Button type="primary" icon={() => <i className="icon icon-add" />} size="medium"
                            onClick={() => {

                                props.history.push('/company/inward/create')
                            }}
                        >Add Inward</Button>
                        <SearchBox styleName="gx-flex-1" placeholder="Search for coil number or party name..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                    </div>
                </div>
                <Table
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={filteredInwardList}
                    onChange={handleChange}
                    rowSelection={rowSelection}
                    onExpand={(expanded, record) => {
                        const motherRecord = {
                            key: record.key,
                            child: record.instruction.map(r => r.instructionId),
                            batch: record.customerBatchId,
                            fThickness: record.fThickness
                        };
                        const result = expanded ? expandedRow : expandedRow.filter(row => row.key !== record.key);
                        setExpandedRecord([...result, motherRecord])
                    }}
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
    setInwardSelectedForDelivery,
})(List);
