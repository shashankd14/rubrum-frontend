import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchPackingList, addPacking, fetchPackingListById, updatePacking, resetPacking } from "../../../appRedux/actions";

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

    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    const { getFieldDecorator, getFieldProps } = props.form;
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [filteredInwardList, setFilteredInwardList] = useState([]);

    const [viewPackingData, setViewPackingData] = useState({});

    const [showAddPacking, setShowAddPacking] = useState(false);
    const [viewPacking, setViewPacking] = useState(false);
    const [editPacking, setEditPacking] = useState(false);

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
    

    useEffect(() => {
        setTimeout(() => {
            props.fetchPackingList();
        }, 1000);
    }, [showAddPacking]);

    useEffect(() => {
        const { loading, error, packingList } = props.packing;
        if (!loading && !error) {
            setFilteredInwardList(packingList)
        }
    }, [props.packing]);

    useEffect(() => {
        const { packing } = props;
        if(searchValue) {
            const filteredData = packing?.packingList?.filter((packing) => {
                if(packing.packingItemId?.toString()?.includes(searchValue) ||
                    packing.description?.toString()?.includes(searchValue) ||
                    packing.unit?.toString() === searchValue) {
                    return packing;
                }
            });
            setFilteredInwardList(filteredData);
        } else {
            setFilteredInwardList(packing.packingList);
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

    const onView = (record, e) => {
        e.preventDefault();
        setViewPackingData(record);
        setViewPacking(true);
    }

    const onEdit = (record, e)=>{
        e.preventDefault();
        props.fetchPackingListById(record.itemId);
        setEditPacking(true);
        setTimeout(() => {
            setShowAddPacking(true);
        }, 1000); 
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
                                    props.form.resetFields();
                                    props.resetPacking();
                                    setShowAddPacking(true);
                                }}
                        >Add Packing</Button>
                        <SearchBox styleName="gx-flex-1" placeholder="Search for packing or packing grade..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                    </div>
                </div>
                <Table rowSelection={[]}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={filteredInwardList}
                    onChange={handleChange}
                />
                <Modal
                    title='Packing Details'
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
                    title={editPacking ? 'Edit Packing' : 'Add Packing'}
                    visible={showAddPacking}
                    onOk={(e) => {
                        e.preventDefault();
                        if (editPacking) {
                            props.form.validateFields((err, values) => {
                                if (!err) {
                                    console.log('Received values of form: ', values);
                                    const data = { values, id: props.packing?.packing?.itemId };
                                    props.updatePacking(data);
                                    setEditPacking(false);
                                    setShowAddPacking(false);
                                }
                            });
                            props.form.resetFields();
                        } else {
                            props.form.validateFields((err, values) => {
                                if (!err) {
                                    console.log('Received values of form: ', values);
                                    props.addPacking(values);
                                    setShowAddPacking(false);
                                }
                            });
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
                                <Form {...formItemLayout} className="gx-pt-4">
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
            </Card>
        </div>
    );
}

const mapStateToProps = state => ({
    packing: state.packing
});

const packingForm = Form.create({
    mapPropsToFields(props) {
        const grade = props.packing?.packing?.packingGrade?.map(packing => packing.gradeName);
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
        };
    },
})(Packing);

export default connect(mapStateToProps, {
    fetchPackingList,
    addPacking,
    fetchPackingListById,
    updatePacking,
    resetPacking
})(packingForm);