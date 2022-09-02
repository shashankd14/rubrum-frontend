import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Tabs, Select} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchPackingList, fetchPackingBucketList, addPacking, 
    fetchPackingListById, fetchPackingBucketListById, updatePacking, 
    updatePackingBucket, resetPacking, addPackingBucket, resetPackingBucket } from "../../../appRedux/actions";

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

const Packing = (props) => {
    const TabPane = Tabs.TabPane;
    const Option = Select.Option;
    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    const { getFieldDecorator, getFieldProps } = props.form;
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [filteredInwardList, setFilteredInwardList] = useState([]);
    const [filteredBucketList, setFilteredBucketList] = useState([]);

    const [viewPackingData, setViewPackingData] = useState({});

    const [showAddPacking, setShowAddPacking] = useState(false);
    const [viewPacking, setViewPacking] = useState(false);
    const [editPacking, setEditPacking] = useState(false);

    const [viewBucketData, setViewBucketData] = useState({});

    const [showAddBucket, setShowAddBucket] = useState(false);
    const [viewBucket, setViewBucket] = useState(false);
    const [editBucket, setEditBucket] = useState(false);

    const [tabKey, setTabKey] = useState("1");
    const [unitValues, setUnitValues] = useState('');

    const columns = [{
        title: 'S No',
        dataIndex: 'itemId',
        key: 'itemId',
        filters: [],
        sorter: (a, b) => {
            return a.itemId - b.itemId
        },
        sortOrder: sortedInfo.columnKey === 'itemId' && sortedInfo.order,
    },
    {
        title: 'Packing Id',
        dataIndex: 'packingItemId',
        key: 'packingItemId',
        filters: [],
        sorter: (a, b) => {
            return a.packingItemId - b.packingItemId
        },
        sortOrder: sortedInfo.columnKey === 'packingItemId' && sortedInfo.order,
    },
    {
        title: 'Unit',
        dataIndex: 'unit',
        key: 'unit',
        filters: [],
        sorter: (a, b) => {
            return a.unit - b.unit
        },
        sortOrder: sortedInfo.columnKey === 'unit' && sortedInfo.order,
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        filteredValue: filteredInfo ? filteredInfo["description"] : null,
        filters: [],
        onFilter: (value, record) => record.description == value,
        sorter: (a, b) => a.description?.length - b.description?.length,
        sortOrder: sortedInfo.columnKey === 'description' && sortedInfo.order,
    },
    {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (text, record, index) => (
            <span>
                <span className="gx-link" onClick={(e) => onView(record, e)}>View</span>
                <Divider type="vertical"/>
                <span className="gx-link" onClick={(e) => onEdit(record, e)}>Edit</span>
                <Divider type="vertical"/>
                <span className="gx-link"onClick={() => {}}>Delete</span>
            </span>
        ),
    },
    ];

    const bucketColumns = [{
        title: 'S No',
        dataIndex: 'bucketId',
        key: 'bucketId',
        filters: [],
        sorter: (a, b) => {
            return a.bucketId - b.bucketId
        },
        sortOrder: sortedInfo.columnKey === 'bucketId' && sortedInfo.order,
    },
    {
        title: 'Bucket Id',
        dataIndex: 'packingBucketId',
        key: 'packingBucketId',
        filters: [],
        sorter: (a, b) => {
            return a.packingBucketId - b.packingBucketId
        },
        sortOrder: sortedInfo.columnKey === 'packingBucketId' && sortedInfo.order,
    },
    {
        title: 'Packing Item',
        dataIndex: 'packingItemId',
        key: 'packingItemId',
        filters: [],
        sorter: (a, b) => {
            return a.itemList?.length - b.itemList?.length
        },
        render: (text, value) => {
            const packingItemId = value?.itemList?.map((packing) => {
                return packing.packingItemId;
            });
            return packingItemId?.toString();
        },
        sortOrder: sortedInfo.columnKey === 'unit' && sortedInfo.order,
    },
    {
        title: 'Unit',
        dataIndex: 'unit',
        key: 'unit',
        filters: [],
        sorter: (a, b) => {
            return a.unit - b.unit
        },
        render: (text, value) => {
            const units = value?.itemList?.map((packing) => {
                return packing.unit;
            });
            return units?.toString();
        },
        sortOrder: sortedInfo.columnKey === 'unit' && sortedInfo.order,
    },
    {
        title: 'Qty',
        dataIndex: 'qty',
        key: 'qty',
        filters: [],
        sorter: (a, b) => {
            return a.qty - b.qty
        },
        sortOrder: sortedInfo.columnKey === 'qty' && sortedInfo.order,
    },
    {
        title: 'Description',
        dataIndex: 'packingBucketDesc',
        key: 'packingBucketDesc',
        filteredValue: filteredInfo ? filteredInfo["packingBucketDesc"] : null,
        filters: [],
        onFilter: (value, record) => record.packingBucketDesc == value,
        sorter: (a, b) => a.packingBucketDesc?.length - b.packingBucketDesc?.length,
        sortOrder: sortedInfo.columnKey === 'packingBucketDesc' && sortedInfo.order,
    },
    {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (text, record, index) => (
            <span>
                <span className="gx-link" onClick={(e) => onView(record, e)}>View</span>
                <Divider type="vertical"/>
                <span className="gx-link" onClick={(e) => onEdit(record, e)}>Edit</span>
                <Divider type="vertical"/>
                <span className="gx-link"onClick={() => {}}>Delete</span>
            </span>
        ),
    },
    ];

    useEffect(() => {
        setTimeout(() => {
            props.fetchPackingList();
            props.fetchPackingBucketList();
        }, 100);
    }, [showAddPacking, showAddBucket]);

    useEffect(() => {
        const { loading, error, packingList, bucketList } = props.packing;
        if (!loading && !error) {
            setFilteredInwardList(packingList);
            setFilteredBucketList(bucketList);
        }
    }, [props.packing]);

    useEffect(() => {
        const { packing } = props;
        if(searchValue) {
            if (tabKey === "1") {
                const filteredData = packing?.packingList?.filter((packing) => {
                    if(packing.packingItemId?.toString()?.includes(searchValue) ||
                        packing.description?.toString()?.includes(searchValue) ||
                        packing.unit?.toString() === searchValue) {
                        return packing;
                    }
                });
                setFilteredInwardList(filteredData);
            } else {
                const filteredData = packing?.bucketList?.filter((packing) => {
                    if(packing.packingBucketId?.toString()?.includes(searchValue) ||
                        packing.packingBucketDesc?.toString()?.includes(searchValue) ||
                        packing.qty?.toString() === searchValue) {
                        return packing;
                    }
                });
                setFilteredInwardList(filteredData);
            }
        } else {
            setFilteredInwardList(packing.packingList);
        }
    }, [searchValue])

    useEffect(() => {
        const units = props.packing?.bucket?.itemList?.map(itm => itm.unit).join(', ');
        setUnitValues(units);
    }, [props?.packing?.bucket?.itemList])

    const callback = (key) => {
        setTabKey(key);
    };

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

    const onView = (record, e) => {
        e.preventDefault();
        if (tabKey === "1") {
            setViewPackingData(record);
            setViewPacking(true);
        } else {
            setViewBucketData(record);
            setViewBucket(true);
        }
    }

    const onEdit = (record, e)=>{
        e.preventDefault();
        if (tabKey === "1") {
            props.fetchPackingListById(record.itemId);
            setEditPacking(true);
            setTimeout(() => {
                setShowAddPacking(true);
            }, 1000);
        } else {
            props.fetchPackingBucketListById(record.bucketId);
            setEditBucket(true);
            setTimeout(() => {
                setShowAddBucket(true);
            }, 1000);
        }
    }

    return (
        <div>
            <h1><IntlMessages id="sidebar.company.packingList"/></h1>
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
                                    if (tabKey === "1") {
                                        props.form.resetFields();
                                        props.resetPacking();
                                        setShowAddPacking(true);
                                    } else {
                                        props.form.resetFields();
                                        setShowAddBucket(true);
                                    }
                                }}
                        >{tabKey === "1" ? 'Add Packing Item' : 'Add Packing Bucket'}</Button>
                        <SearchBox styleName="gx-flex-1" placeholder="Search for packing or packing Item..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                    </div>
                </div>
                <Tabs defaultActiveKey="1" tabPosition='top' onChange={callback}>
                    <TabPane tab="Packing Item" key="1">
                        <Table rowSelection={[]}
                            className="gx-table-responsive"
                            columns={columns}
                            dataSource={filteredInwardList}
                            onChange={handleChange}
                        />
                    </TabPane>
                    <TabPane tab="Packing Bucket" key="2">
                        <Table rowSelection={[]}
                            className="gx-table-responsive"
                            columns={bucketColumns}
                            dataSource={filteredBucketList}
                            onChange={handleChange}
                        />
                    </TabPane>
                </Tabs>
                <Modal
                    title='Packing Item Details'
                    visible={viewPacking}
                    onCancel={() => setViewPacking(false)}
                    onOk={() => setViewPacking(false)}
                    width={600}
                >
                    <Card>
                        <Row>
                            <Col span={24}>
                                <Card>
                                    {viewPackingData?.packingItemId && <p><strong>Packing Id :</strong> {viewPackingData.packingItemId}</p>}
                                    {viewPackingData?.description && <p><strong>Packing description :</strong> {viewPackingData?.description}</p>}
                                    {viewPackingData?.unit && <p><strong>Packing unit :</strong> {viewPackingData?.unit}</p>}
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Modal>

                <Modal
                    title='Packing Bucket Details'
                    visible={viewBucket}
                    onCancel={() => setViewBucket(false)}
                    onOk={() => setViewBucket(false)}
                    width={600}
                >
                    <Card>
                        <Row>
                            <Col span={24}>
                                <Card>
                                    {viewBucketData?.packingBucketId && <p><strong>Bucket Id :</strong> {viewBucketData?.packingBucketId}</p>}
                                    {viewBucketData?.packingBucketDesc && <p><strong>Bucket description :</strong> {viewBucketData?.packingBucketDesc}</p>}
                                    {viewBucketData?.itemList && <p><strong>Packing Item list :</strong> {viewBucketData?.itemList?.map(itm => itm.packingItemId).join(', ')}</p>}
                                    {viewBucketData?.itemList && <p><strong>Packing Item units :</strong> {viewBucketData?.itemList?.map(itm => itm.unit).join(', ')}</p>}
                                    {viewBucketData?.qty && <p><strong>Qty :</strong> {viewBucketData?.qty}</p>}
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Modal>

                <Modal
                    title={editPacking ? 'Edit Packing' : 'Add Packing'}
                    visible={showAddPacking}
                    onOk={(e) => {
                        e.preventDefault();
                        if (editPacking) {
                            const values = props.form.getFieldsValue();
                            if (values.packingId !== '' && values.unit !== '' && values.description !== '') {
                                console.log('Received values of form: ', values);
                                const data = { values, id: props.packing?.packing?.itemId };
                                props.updatePacking(data);
                                setEditPacking(false);
                                setShowAddPacking(false);
                            }
                            props.form.resetFields();
                        } else {
                            const values = props.form.getFieldsValue();
                            if (values.packingId !== '' && values.unit !== '' && values.description !== '') {
                                console.log('Received values of form: ', values);
                                props.addPacking(values);
                                setShowAddPacking(false);
                            }
                            props.form.resetFields();
                        }
                    }}
                    width={600}
                    onCancel={() => {
                        props.resetPacking();
                        props.form.resetFields();
                        setShowAddPacking(false);
                        setEditPacking(false)
                    }}
                >
                    <Card className="gx-card">
                        <Row>
                            <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                                <Form name="item" {...formItemLayout} className="gx-pt-4">
                                    <Form.Item label="Packing Id" >
                                            {getFieldDecorator('packingId', {
                                                rules: [{ required: false, message: 'Please enter packing Id' }],
                                                })(
                                            <Input id="packingId" {...getFieldProps}/>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Packing Description" >
                                        {getFieldDecorator('description', {
                                            rules: [{ required: true, message: 'Please enter description' }],
                                            })(
                                            <Input id="description" {...getFieldProps}/>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Packing unit" >
                                        {getFieldDecorator('unit', {
                                            rules: [{ required: true, message: 'Please enter Packing unit' }],
                                            })(
                                            <Input id="unit" {...getFieldProps}/>
                                        )}
                                    </Form.Item>
                                </Form>
                            </Col>
                            
                        </Row>
                    </Card>
                </Modal>

                <Modal
                    title={editBucket ? 'Edit Packing Bucket' : 'Add Packing Bucket'}
                    visible={showAddBucket}
                    onOk={(e) => {
                        e.preventDefault();
                        if (editBucket) {
                            const values = props.form.getFieldsValue();
                            const { bucketDesc, bucketId, packingItem, qty} = values;
                            if (bucketDesc && bucketId && packingItem && qty) {
                                console.log('Received values of form: ', values);
                                const data = { values, id: props.packing?.bucket?.bucketId };
                                props.updatePackingBucket(data);
                                setEditBucket(false);
                                setShowAddBucket(false);
                            }
                            props.form.resetFields();
                        } else {
                            const values = props.form.getFieldsValue();
                            const { bucketDesc, bucketId, packingItem, qty} = values;
                            if (bucketDesc && bucketId && packingItem && qty) {
                                props.addPackingBucket(values);
                                setShowAddBucket(false);
                            }
                            props.form.resetFields();
                        }
                    }}
                    width={600}
                    onCancel={() => {
                        props.resetPackingBucket();
                        props.form.resetFields();
                        setShowAddBucket(false);
                        setEditBucket(false);
                    }}
                >
                    <Card className="gx-card">
                        <Row>
                            <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                                <Form name="bucket" {...formItemLayout} className="gx-pt-4">
                                    <Form.Item label="Packing Items">
                                        {getFieldDecorator('packingItem', {
                                            rules: [{ required: true, message: 'Please select Items' }],
                                        })(
                                            <Select
                                            id="packingItem"
                                            showSearch
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            onChange={(value) => {
                                                const unitVal = value?.map(itm => {
                                                    const obj = props?.packing?.packingList?.filter(i => i.itemId === itm)[0];
                                                    return obj.unit;
                                                });
                                                setUnitValues(unitVal?.join(', '));
                                            }}
                                            filterOption={(input, option) => {
                                                return option?.props?.children?.toLowerCase().includes(input.toLowerCase());
                                            }}
                                            filterSort={(optionA, optionB) =>
                                                optionA?.props?.children.toLowerCase().localeCompare(optionB?.props?.children.toLowerCase())
                                            }
                                            >{props?.packing?.packingList?.map(item => {
                                                return <Option value={item?.itemId}>{item?.packingItemId}</Option>
                                            })}</Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Packing bucket Id" >
                                            {getFieldDecorator('bucketId', {
                                                rules: [{ required: true, message: 'Please enter packing bucket Id' }],
                                                })(
                                            <Input id="bucketId" {...getFieldProps}/>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Units" >
                                        {getFieldDecorator('units', {
                                            initialValue: props.packing?.bucket?.itemList?.map(itm => itm.unit).join(', '),
                                            rules: [{ required: false }],
                                            })(
                                                <span id="unit" {...getFieldProps}>{unitValues}</span>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Quantity" >
                                        {getFieldDecorator('qty', {
                                            rules: [{ required: true, message: 'Please enter quantity' }],
                                            })(
                                            <Input id="qty" {...getFieldProps}/>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Description" >
                                        {getFieldDecorator('bucketDesc', {
                                            rules: [{ required: true, message: 'Please enter description' }],
                                            })(
                                            <Input id="bucketDesc" {...getFieldProps}/>
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
    packing: state.packing
});

const packingForm = Form.create({
    mapPropsToFields(props) {
        return {
            packingId: Form.createFormField({
                value: props.packing?.packing?.packingItemId || ''
            }),
            description: Form.createFormField({
                value: props.packing?.packing?.description || '',
            }),
            unit: Form.createFormField({
                value: props.packing?.packing?.unit || '',
            }),
            packingItem: Form.createFormField({
                value: props.packing?.bucket?.itemList?.map(itm => itm.itemId) || []
            }),
            bucketId: Form.createFormField({
                value: props.packing?.bucket?.packingBucketId || ''
            }),
            units: Form.createFormField({
                value: props.packing?.bucket?.itemList?.map(itm => itm.unit).join(', ') || ''
            }),
            qty: Form.createFormField({
                value: props.packing?.bucket?.qty || '',
            }),
            bucketDesc: Form.createFormField({
                value: props.packing?.bucket?.packingBucketDesc || '',
            }),
        };
    },
})(Packing);

export default connect(mapStateToProps, {
    fetchPackingList,
    addPacking,
    addPackingBucket,
    fetchPackingListById,
    fetchPackingBucketListById,
    updatePacking,
    updatePackingBucket,
    resetPacking,
    resetPackingBucket,
    fetchPackingBucketList
})(packingForm);