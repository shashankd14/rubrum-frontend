import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Icon, Table, message} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchRatesList } from "../../../appRedux/actions";
import { onDeleteContact } from "../../../appRedux/actions";

const Rates = (props) => {

    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [filteredInwardList, setFilteredInwardList] = useState(props.rates?.ratesList || []);

    const columns = [{
        title: 'Rate Id',
        dataIndex: 'rateId',
        key: 'rateId',
        filters: [],
        sorter: (a, b) => {
            return a.rateId - b.rateId
        },
        sortOrder: sortedInfo.columnKey === 'rateId' && sortedInfo.order,
    },
    {
        title: 'Party Name',
        dataIndex: 'partyRates.nPartyName',
        key: 'partyRates.nPartyName',
        filters: [],
        sorter: (a, b) => a.partyRates.nPartyName.length - b.partyRates.nPartyName.length,
        sortOrder: sortedInfo.columnKey === 'partyRates.nPartyName' && sortedInfo.order,
    },
    {
        title: 'Process Name',
        dataIndex: 'process.processName',
        key: 'process.processName',
        filters: [],
        sorter: (a, b) => a.process.processName.length - b.process.processName.length,
        sortOrder: sortedInfo.columnKey === 'process.processName' && sortedInfo.order,
    },
    {
        title: 'Material description',
        dataIndex: 'materialType.description',
        key: 'materialType.description',
        filters: [],
        sorter: (a, b) => a.materialType.description.length - b.materialType.description.length,
        sortOrder: sortedInfo.columnKey === 'materialType.description' && sortedInfo.order,
    },
    {
        title: 'Thickness rate',
        dataIndex: 'thicknessRate',
        key: 'thicknessRate',
        sorter: (a, b) => a.thicknessRate - b.thicknessRate,
        sortOrder: sortedInfo.columnKey === 'thicknessRate' && sortedInfo.order,
    },
    {
        title: 'Packaging charges',
        dataIndex: 'packagingCharges',
        key: 'packagingCharges',
        sorter: (a, b) => a.packagingCharges - b.packagingCharges,
        sortOrder: sortedInfo.columnKey === 'packagingCharges' && sortedInfo.order,
    },
    {
        title: 'Lamination charges',
        dataIndex: 'laminationCharges',
        key: 'laminationCharges',
        sorter: (a, b) => a.laminationCharges - b.laminationCharges,
        sortOrder: sortedInfo.columnKey === 'laminationCharges' && sortedInfo.order,
    },
    {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (text, record, index) => (
            <span>
                <span className="gx-link" onClick={() => {}}>View</span>
                <Divider type="vertical"/>
                <span className="gx-link" onClick={() => {}}>Edit</span>
                <Divider type="vertical"/>
                <span className="gx-link"onClick={() => {}}>Delete</span>
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
    const onEdit = (record,key,e)=>{
        props.fetchPartyListById(record.inwardEntryId);
        setTimeout(() => {
            props.history.push(`create/${record.inwardEntryId}`)
        }, 2000);
                
    }

    useEffect(() => {
        props.fetchRatesList();
    }, []);

    useEffect(() => {
        const { loading, error, ratesList } = props.rates;
        if (!loading && !error) {
            setFilteredInwardList(ratesList)
        }
    }, [props.rates]);

    useEffect(() => {

        const { rates } = props;
        if(searchValue) {
            const filteredData = rates?.ratesList?.filter((rate) => {
                if(rate.rateId.toString() === searchValue ||
                rate.partyRates.nPartyName.toLowerCase().includes(searchValue.toLowerCase()) ||
                rate.materialType.description.toLowerCase().includes(searchValue.toLowerCase()) ||
                rate.process.processName.toLowerCase().includes(searchValue)) {
                    return rate;
                }
            });
            setFilteredInwardList(filteredData);
        } else {
            setFilteredInwardList(rates.ratesList);
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

    return (
        <div>
            <h1><IntlMessages id="sidebar.company.ratesList"/></h1>
            <Card>
                <div className="gx-flex-row gx-flex-1">
                    <div className="table-operations gx-col">
                        <Button onClick={deleteSelectedCoils}>Delete</Button>
                        <Button onClick={exportSelectedData}>Export</Button>
                        <Button onClick={clearFilters}>Clear All filters</Button>
                    </div>
                    <div className="gx-flex-row gx-w-50">
                        <Button type="primary" icon={() => <i className="icon icon-add"/>} size="medium"
                                onClick={() => {}}
                        >Add Rates</Button>
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
    rates: state.rates
});

export default connect(mapStateToProps, {
    fetchRatesList,
})(Rates);