import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Select,Checkbox} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchManufacturerList, deleteManufacturer, addManufacturer, fetchManufacturerListId, updateManufacturer, resetManufacturer, fetchStateList } from "../../../appRedux/actions";
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

const Manufacturer = (props) => {

    const Option = Select.Option;
    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [showAddManufacturer, setShowAddManufacturer] = useState(false);
    const [viewManufacturer, setViewManufacturer] = useState(false);
    const [viewManufacturerData, setViewManufacturerData] = useState({});
    const [editManufacturer, setEditManufacturer] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [filteredManufacturerList, setFilteredManufacturerList] = useState(props?.manufacturer?.manufacturerList?.content || []);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [totalPageItems, setTotalPageItems] = useState(0);
    const { totalItems } = props.manufacturer.manufacturerList;
    const {getFieldDecorator, getFieldValue} = props.form;

    const columns = [{
        title: 'Manufacturer Id',
        dataIndex: 'manufacturerId',
        key: 'manufacturerId',
        filters: [],
        sorter: (a, b) => {
            return a.manufacturerId - b.manufacturerId
        },
        sortOrder: sortedInfo.columnKey === 'manufacturerId' && sortedInfo.order,
    },
    {
        title: 'Manufacturer Name',
        dataIndex: 'manufacturerName',
        key: 'manufacturerName',
        filters: [],
        sorter: (a, b) => a.manufacturerName.length - b.manufacturerName.length,
        sortOrder: sortedInfo.columnKey === 'manufacturerName' && sortedInfo.order,
    },
    {
        title: 'Manufacturer Desc',
        dataIndex: 'manufacturerDesc',
        key: 'manufacturerDesc',
        sorter: (a, b) => a.manufacturerDesc.length - b.manufacturerDesc.length,
        sortOrder: sortedInfo.columnKey === 'manufacturerDesc' && sortedInfo.order,
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
                <span className="gx-link" onClick={(e) => onDelete(record, e)}>Delete</span>
            </span>
        ),
    },
    ];

    const onView = (record, e) => {
        e.preventDefault();
         setViewManufacturerData(record);
        props.fetchManufacturerListId({
            id: record.manufacturerId,
            searchText: '',
            pageNo: "1",
            pageSize: "2",
            ipAddress: '',
            requestId: '',
            userId: ''
        });
        setViewManufacturer(true);
    }
    const onDelete = (record,key, e) => {
        props.deleteManufacturer({
            ids: record.manufacturerId,
            ipAddress: "1.1.1.1",
            requestId: "MANUFACTURER_DELETE",
            userId: ""
        })
      }

      const onEdit = (record,e)=>{
        e.preventDefault();
        props.fetchManufacturerListId({
            id: record.manufacturerId,
            searchText: '',
            pageNo: "1",
            pageSize: "15",
            ipAddress: '',
            requestId: '',
            userId: ''
        });
        setEditManufacturer(true);
        setTimeout(() => {
            setShowAddManufacturer(true);
        }, 1000);
    }

    useEffect(() => {
        setTimeout(() => {
            props.fetchManufacturerList({
                searchText:"",
                pageNo:"1",
                pageSize:"15",
                ipAddress: "1.1.1.1",
                requestId: "MANUFACTURER_LIST_GET",
                userId: ""
            });
        }, 1000);
    }, [showAddManufacturer]);

    useEffect(() => {
        const { loading, error, manufacturerList } = props.manufacturer;
        if (!loading && !error) {
            setFilteredManufacturerList(manufacturerList)

        }
    }, [props.manufacturer]);

    const handleChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
        setFilteredInfo(filters);
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
        if (totalItems) {
          setTotalPageItems(totalItems);
        }
      }, [totalItems]);

      useEffect(() => {
        if (searchValue) {
          if (searchValue.length >= 3) {
            setPageNo(1);
            props.fetchManufacturerList({
                searchText:searchValue,
                pageNo:"1",
                pageSize:"15",
                ipAddress: "1.1.1.1",
                requestId: "MANUFACTURER_LIST_GET",
                userId: ""
            });
          }
        } else {
          setPageNo(1);
          props.fetchManufacturerList({
            searchText:searchValue,
            pageNo:"1",
            pageSize:"15",
            ipAddress: "1.1.1.1",
            requestId: "MANUFACTURER_LIST_GET",
            userId: ""
        });
        }
      }, [searchValue]);

    return (
        <div>
            <h1><IntlMessages id="master.company.manufacturerList"/></h1>
            <Card>
                <div className="gx-flex-row gx-flex-1">
                    <div className="table-operations gx-col">
                        <Button onClick={deleteSelectedCoils}>Delete</Button>
                        <Button onClick={exportSelectedData}>Export</Button>
                    </div>
                    <div className="gx-flex-row gx-w-50">
                        <Button type="primary" icon={() => <i className="icon icon-add"/>} size="default"
                                onClick={() => {
                                    props.resetManufacturer();
                                    props.form.resetFields()
                                    setShowAddManufacturer(true)
                                }}
                        >Add Manufacturer</Button>
                        <SearchBox styleName="gx-flex-1" placeholder="Search for manufacturer name..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                    </div>
                </div>
                <Table rowSelection={[]}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={filteredManufacturerList.content}
                    onChange={handleChange}
                    pagination={{
                        pageSize: 15,
                        onChange: (page) => {
                          setPageNo(page);
                          props.fetchManufacturerList({
                            searchText:searchValue,
                            pageNo: page,
                            pageSize: pageSize,
                            ipAddress: "1.1.1.1",
                            requestId: "MANUFACTURER_LIST_GET",
                            userId: ""
                        });
                        },
                        current: pageNo,
                        total: totalPageItems,
                      }}
                />
                <Modal
                    title='Manufacturer Details'
                    visible={viewManufacturer}
                    width={600}
                    onOk={() => setViewManufacturer(false)}
                    onCancel={() => setViewManufacturer(false)}

                >
                    <Card className="gx-card">
                        <Row>
                            <Col span={24}>
                                <Card>
                                <p><strong>Manufacturer Id :</strong> {viewManufacturerData?.manufacturerId}</p>
                                    <p><strong>Manufacturer Name :</strong> {viewManufacturerData?.manufacturerName}</p>
                                    <p><strong>Manufacturer Description :</strong> {viewManufacturerData?.manufacturerDesc}</p>
                                    
                                     </Card>
                            </Col>
                        </Row>
                    </Card>
                </Modal>
                <Modal
                    title={editManufacturer?'Edit Manufacturer':'Add Manufacturer'}
                    visible={showAddManufacturer}
                    onOk={(e) => {
                        if (editManufacturer) {
                            e.preventDefault();
                            props.form.validateFields((err, values) => {
                                if (!err) {
                                 const data = {
                                    values: {
                                      ...values,
                                    },
                                    manufacturerId: props?.manufacturer?.manufacturerId.manufacturerId
                                  }
                                  props.updateManufacturer(data);
                                  props.form.resetFields();
                                  setShowAddManufacturer(false);
                                  setEditManufacturer(false);
                                }
                            });
                        } else {
                            props.form.validateFields((err, values) => {
                                if (!err) {
                                 e.preventDefault();
                                 props.addManufacturer({
                                    ...values,
                                    ipAddress:"",
                                    requestId: "ADD_MANUFACTURER",
                                    userId: ""
                                  });
                                  props.form.resetFields();
                                  setShowAddManufacturer(false);
                                }
                            });
                        }
                    }}
                    width={800}
                    onCancel={() => {
                        props.form.resetFields();
                        setShowAddManufacturer(false);
                        setEditManufacturer(false)
                    }}
                >
                    <Card className="gx-card">
                        <Row>
                            <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                                <Form {...formItemLayout} className="gx-pt-4">
                                    <Form.Item label="Manufacturer Name">
                                        {getFieldDecorator('manufacturerName', {
                                            rules: [{ required: true, message: 'Please input manufacturer name!' }],
                                        })(
                                            <Input id="manufacturerName" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Manufacturer Desc">
                                        {getFieldDecorator('manufacturerDesc', {
                                            rules: [{ required: false, message: 'Please input manufacturer Description!' }],
                                        })(
                                            <Input id="manufacturerDesc" />
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
    packetClassification: state.packetClassification,
    location: state.location,
    manufacturer: state.manufacturer
});

const addManufacturerForm = Form.create({
    mapPropsToFields(props) {
        return {
            manufacturerName:Form.createFormField ({
                ...props.manufacturer?.manufacturerId?.manufacturerName,
                value: props.manufacturer?.manufacturerId?.manufacturerName|| '',
            }),
            manufacturerDesc:Form.createFormField ({
                ...props.manufacturer?.manufacturerId?.manufacturerDesc,
                value: props.manufacturer?.manufacturerId?.manufacturerDesc|| '',
            }),
        };
    }
})(Manufacturer);

export default connect(mapStateToProps, {
    fetchManufacturerList,
    addManufacturer,
    fetchManufacturerListId,
    updateManufacturer,
    resetManufacturer,
    deleteManufacturer,
    fetchStateList
})(addManufacturerForm);
