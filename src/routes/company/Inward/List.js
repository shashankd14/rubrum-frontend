import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Icon, Table, message} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import {
    fetchInwardList,
    resetInwardForm,
    deleteInwardEntryById,
    resetDeleteInward
} from "../../../appRedux/actions/Inward";
import { onDeleteContact } from "../../../appRedux/actions";

const List = (props) => {

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
        render: (text, record, index) => (
            <span>
                <span className="gx-link" onClick={() => props.history.push(`${record.coilNumber}`)}>View</span>
                <Divider type="vertical"/>
                <span className="gx-link" onClick={() => props.history.push(`create/${record.inwardEntryId}`)}>Edit</span>
                <Divider type="vertical"/>
                <span className="gx-link"onClick={(e) => onDelete(record, index,e)}>Delete</span>
            </span>
        ),
    },
    ];
    const onDelete = (record,key, e) => {
        let id = []
        id.push(record.inwardEntryId);
        e.preventDefault();
        props.deleteInwardEntryById(id)
        console.log(record,key)
      }
      useEffect(() => {
        if(props.inward.deleteSuccess) {
            message.success('Successfully deleted the coil', 2).then(() => {
                props.resetDeleteInward();
            });
        }
    }, [props.inward.deleteSuccess])
    useEffect(() => {
        if(props.inward.deleteFail) {
            message.success('Uanble to delete the coil', 2).then(() => {
            props.resetDeleteInward();
            });
        }
    }, [props.inward.deleteFail])
    useEffect(() => {
        props.fetchInwardList();
    }, []);

    useEffect(() => {
        if(searchValue) {
            const filteredData = props.inward.inwardList.filter((inward) => {
                if(inward.coilNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
                    inward.party.nPartyName.toLowerCase().includes(searchValue.toLowerCase()) ||
                    inward.vInvoiceNo.toLowerCase().includes(searchValue.toLowerCase())) {
                    return inward
                }
            });
            setFilteredInwardList(filteredData);
        } else {
            setFilteredInwardList(props.inward.inwardList);
        }
    }, [searchValue])

    const handleChange = (pagination, filters, sorter) => {
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

    const exportSelectedData = () => {

    }

    const deleteSelectedCoils = () => {
        console.log('dfd');
    };

    useEffect(() => {
        if(!props.inward.loading && props.inward.success) {
            setFilteredInwardList(props.inward.inwardList);
        }
    }, [props.inward.loading, props.inward.success])

    return (
        <div>
            <h1><IntlMessages id="sidebar.company.inwardList"/></h1>
            <Card>
                <div className="gx-flex-row gx-flex-1">
                    <div className="table-operations gx-col">
                        <Button onClick={deleteSelectedCoils}>Delete</Button>
                        <Button onClick={exportSelectedData}>Export</Button>
                        <Button onClick={clearFilters}>Clear All filters</Button>
                    </div>
                    <div className="gx-flex-row gx-w-50">
                        <Button type="primary" icon={() => <i className="icon icon-add"/>} size="medium"
                                onClick={() => {
                                        props.resetInwardForm();
                                        props.history.push('/company/inward/create')
                                    }
                                }
                        >Add Inward</Button>
                        <SearchBox styleName="gx-flex-1" placeholder="Search for coil number or party name..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                    </div>
                </div>
                <Table rowSelection={[]}
                       className="gx-table-responsive"
                       columns={columns}
                       dataSource={filteredInwardList}
                       onChange={handleChange}
                />
            </Card>
        </div>
    );
}

const mapStateToProps = state => ({
    inward: state.inward,
});

export default connect(mapStateToProps, {
    fetchInwardList,
    resetInwardForm,
    deleteInwardEntryById,
    resetDeleteInward
})(List);