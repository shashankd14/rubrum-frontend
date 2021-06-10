import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchPartyList } from "../../../appRedux/actions";
import { onDeleteContact } from "../../../appRedux/actions";

const FormItem = Form.Item;
export const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 8},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 16},
    },
};


const Party = (props) => {

    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [showAddParty, setShowAddParty] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [filteredInwardList, setFilteredInwardList] = useState(props.party?.partyList || []);

    const {getFieldDecorator} = props.form;

    const columns = [{
        title: 'Party Id',
        dataIndex: 'nPartyId',
        key: 'nPartyId',
        filters: [],
        sorter: (a, b) => {
            return a.nPartyId - b.nPartyId
        },
        sortOrder: sortedInfo.columnKey === 'nPartyId' && sortedInfo.order,
    },
    {
        title: 'Party Name',
        dataIndex: 'nPartyName',
        key: 'nPartyName',
        filters: [],
        sorter: (a, b) => a.nPartyName.length - b.nPartyName.length,
        sortOrder: sortedInfo.columnKey === 'nPartyName' && sortedInfo.order,
    },
    {
        title: 'Tin Number',
        dataIndex: 'nTinNumber',
        key: 'nTinNumber',
        filters: [],
        sorter: (a, b) => a.createdOn.length - b.createdOn.length,
        sortOrder: sortedInfo.columnKey === 'nTinNumber' && sortedInfo.order,
    },
    {
        title: 'City',
        dataIndex: 'vCity',
        key: 'vCity',
        sorter: (a, b) => a.vCity.length - b.vCity.length,
        sortOrder: sortedInfo.columnKey === 'vCity' && sortedInfo.order,
    },
    {
        title: 'State',
        dataIndex: 'vState',
        key: 'vState',
        sorter: (a, b) => a.vState.length - b.vState.length,
        sortOrder: sortedInfo.columnKey === 'vState' && sortedInfo.order,
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
        props.fetchPartyList();
    }, []);

    useEffect(() => {
        const { loading, error, partyList } = props.party;
        if (!loading && !error) {
            setFilteredInwardList(partyList)
        }
    }, [props.party]);

    useEffect(() => {

        const { party } = props;
        if(searchValue) {
            const filteredData = party?.materialList?.filter((material) => {
                if(material.matId.toString() === searchValue ||
                    material.description.toLowerCase().includes(searchValue.toLowerCase()) ||
                    material.materialGrade.includes(searchValue)) {
                    return material;
                }
            });
            setFilteredInwardList(filteredData);
        } else {
            setFilteredInwardList(party.partyList);
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
            <h1><IntlMessages id="sidebar.company.partyList"/></h1>
            <Card>
                <div className="gx-flex-row gx-flex-1">
                    <div className="table-operations gx-col">
                        <Button onClick={deleteSelectedCoils}>Delete</Button>
                        <Button onClick={exportSelectedData}>Export</Button>
                        <Button onClick={clearFilters}>Clear All filters</Button>
                    </div>
                    <div className="gx-flex-row gx-w-50">
                        <Button type="primary" icon={() => <i className="icon icon-add"/>} size="medium"
                                onClick={() => setShowAddParty(true)}
                        >Add Party</Button>
                        <SearchBox styleName="gx-flex-1" placeholder="Search for coil number or party name..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                    </div>
                </div>
                <Table rowSelection={[]}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={filteredInwardList}
                    onChange={handleChange}
                />
                <Modal
                    title='Add Party'
                    visible={showAddParty}
                    onOk={() => {}}
                    width={900}
                    onCancel={() => {
                        setShowAddParty(false)
                    }}
                >
                    <Card className="gx-card">
                        <Row>
                            <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                                <Form {...formItemLayout} className="gx-pt-4">
                                    <Form.Item label="Party Name">
                                        {getFieldDecorator('partyName', {
                                            rules: [{ required: true, message: 'Please input Party name!' }],
                                        })(
                                            <Input id="partyName" />
                                        )}
                                    </Form.Item>
                                    <FormItem
                                        {...formItemLayout}
                                        label="Phone Number"
                                    >
                                        {getFieldDecorator('phone', {
                                            rules: [{required: true, message: 'Please input your phone number!'}],
                                        })(
                                        <Input id="phone" addonBefore={'+91'} style={{width: '100%'}}/>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="Alternate Phone Number"
                                    >
                                        {getFieldDecorator('phone1', {
                                            rules: [{required: true, message: 'Please input your alternate phone number!'}],
                                        })(
                                        <Input id="phone1" addonBefore={'+91'} style={{width: '100%'}}/>
                                        )}
                                    </FormItem>
                                    <Form.Item label="Address">
                                        {getFieldDecorator('address', {
                                            rules: [{ required: true, message: 'Please input the Address!' }],
                                        })(
                                            <Input id="address" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Address 1">
                                        {getFieldDecorator('address1', {
                                            rules: [{ required: false, message: 'Please input the Address Line 1!' }],
                                        })(
                                            <Input id="address1" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Address 2">
                                        {getFieldDecorator('address2', {
                                            rules: [{ required: false, message: 'Please input the Address Line 2!' }],
                                        })(
                                            <Input id="address2" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="City">
                                        {getFieldDecorator('city', {
                                            rules: [{ required: true, message: 'Please input the City!' }],
                                        })(
                                            <Input id="city" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="State">
                                        {getFieldDecorator('state', {
                                            rules: [{ required: true, message: 'Please input the State!' }],
                                        })(
                                            <Input id="state" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Pincode">
                                        {getFieldDecorator('pincode', {
                                            rules: [{ required: true, message: 'Please input the pincode!' }],
                                        })(
                                            <Input id="pincode" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="E-mail">
                                        {getFieldDecorator('email', {
                                            rules: [{ required: true, message: 'Please input the e-mail address!' }],
                                        })(
                                            <Input id="email" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Tin Number">
                                        {getFieldDecorator('tnumber', {
                                            rules: [{ required: true, message: 'Please input the Tin Number!' }],
                                        })(
                                            <Input id="tnumber" />
                                        )}
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </Modal>
            </Card>
        </div>
    );
}

const mapStateToProps = state => ({
    party: state.party
});

const addPartyForm = Form.create()(Party);

export default connect(mapStateToProps, {
    fetchPartyList,
})(addPartyForm);