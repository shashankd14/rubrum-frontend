import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Select,Checkbox} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchWeighbridgeList, deleteWeighbridge, addWeighbridge, fetchWeighbridgeListId, updateWeighbridge, resetWeighbridge, fetchStateList } from "../../../appRedux/actions";
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

const Weighbridge = (props) => {

    const Option = Select.Option;
    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [showAddWeighbridge, setShowAddWeighbridge] = useState(false);
    const [viewWeighbridge, setViewWeighbridge] = useState(false);
    const [viewWeighbridgeData, setViewWeighbridgeData] = useState({});
    const [editWeighbridge, setEditWeighbridge] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [filteredWeighbridgeList, setFilteredWeighbridgeList] = useState(props?.weighbridge?.weighbridgeList?.content || []);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [totalPageItems, setTotalPageItems] = useState(0);
    const { totalItems } = props.weighbridge.weighbridgeList;
    const {getFieldDecorator, getFieldValue} = props.form;

    const columns = [{
        title: 'Weighbridge Id',
        dataIndex: 'weighbridgeId',
        key: 'weighbridgeId',
        filters: [],
        sorter: (a, b) => {
            return a.weighbridgeId - b.weighbridgeId
        },
        sortOrder: sortedInfo.columnKey === 'weighbridgeId' && sortedInfo.order,
    },
    {
        title: 'Weighbridge Name',
        dataIndex: 'weighbridgeName',
        key: 'weighbridgeName',
        filters: [],
        sorter: (a, b) => a.weighbridgeName.length - b.weighbridgeName.length,
        sortOrder: sortedInfo.columnKey === 'weighbridgeName' && sortedInfo.order,
    },
    {
        title: 'Weighbridge Address',
        dataIndex: 'address1',
        key: 'address1',
        sorter: (a, b) => a.address1?.city?.length - b.address1?.city?.length,
        sortOrder: sortedInfo.columnKey === 'address1' && sortedInfo.order,
    },
    {
        title: 'City',
        dataIndex: 'city',
        key: 'city',
        sorter: (a, b) => a.city?.length - b.city?.length,
        sortOrder: sortedInfo.columnKey === 'city' && sortedInfo.order,
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
        sorter: (a, b) => a.state?.length - b.state?.length,
        sortOrder: sortedInfo.columnKey === 'state' && sortedInfo.order,
    },
    {
        title: 'Contact Number',
        dataIndex: 'contactNo',
        key: 'contactNo',
        filters: [],
        sorter: (a, b) => a.contactNo.length - b.contactNo.length,
        sortOrder: sortedInfo.columnKey === 'contactNo' && sortedInfo.order,
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
         setViewWeighbridgeData(record);
        props.fetchWeighbridgeListId({
            id: record.locationId,
            searchText: '',
            pageNo: "1",
            pageSize: "15",
            ipAddress: '',
            requestId: '',
            userId: ''
        });
        setViewWeighbridge(true);
    }
    const onDelete = (record,key, e) => {
        debugger
        props.deleteWeighbridge({
            ids: record.weighbridgeId,
            ipAddress: "1.1.1.1",
            requestId: "WEIGHBRIDGE_DELETE",
            userId: ""
        })
      }

      const onEdit = (record,e)=>{
        debugger
        e.preventDefault();
        props.fetchWeighbridgeListId({
            id: record.weighbridgeId,
            searchText: '',
            pageNo: "1",
            pageSize: "15",
            ipAddress: '',
            requestId: '',
            userId: ''
        });
        setEditWeighbridge(true);
        setTimeout(() => {
            setShowAddWeighbridge(true);
        }, 1000);
    }

    useEffect(() => {
        setTimeout(() => {
            props.fetchWeighbridgeList({
                searchText:"",
                pageNo:"1",
                pageSize:"15",
                ipAddress: "1.1.1.1",
                requestId: "WEIGHBRIDGE_LIST_GET",
                userId: ""
            });
            props.fetchStateList({
                ipAddress: "1.1.1.1",
                requestId: "STATE_LIST",
                userId: ""
            });
        }, 1000);
    }, [showAddWeighbridge]);

    useEffect(() => {
        const { loading, error, weighbridgeList } = props.weighbridge;
        if (!loading && !error) {
            setFilteredWeighbridgeList(weighbridgeList)

        }
    }, [props.weighbridge]);

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
        debugger
        if (totalItems) {
          setTotalPageItems(totalItems);
        }
      }, [totalItems]);

      useEffect(() => {
        if (searchValue) {
          if (searchValue.length >= 3) {
            setPageNo(1);
            props.fetchWeighbridgeList({
                searchText:searchValue,
                pageNo:"1",
                pageSize:"15",
                ipAddress: "1.1.1.1",
                requestId: "WEIGHBRIDGE_LIST_GET",
                userId: ""
            });
          }
        } else {
          setPageNo(1);
          props.fetchWeighbridgeList({
            searchText:searchValue,
            pageNo:"1",
            pageSize:"15",
            ipAddress: "1.1.1.1",
            requestId: "WEIGHBRIDGE_LIST_GET",
            userId: ""
        });
        }
      }, [searchValue]);

    return (
        <div>
            <h1><IntlMessages id="master.company.weighbridgeList"/></h1>
            <Card>
                <div className="gx-flex-row gx-flex-1">
                    <div className="table-operations gx-col">
                        <Button onClick={deleteSelectedCoils}>Delete</Button>
                        <Button onClick={exportSelectedData}>Export</Button>
                    </div>
                    <div className="gx-flex-row gx-w-50">
                        <Button type="primary" icon={() => <i className="icon icon-add"/>} size="default"
                                onClick={() => {
                                    props.resetWeighbridge();
                                    props.form.resetFields()
                                    setShowAddWeighbridge(true)
                                }}
                        >Add Weighbridge</Button>
                        <SearchBox styleName="gx-flex-1" placeholder="Search for weighbridge name..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                    </div>
                </div>
                <Table rowSelection={[]}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={filteredWeighbridgeList.content}
                    onChange={handleChange}
                    pagination={{
                        pageSize: 15,
                        onChange: (page) => {
                          setPageNo(page);
                          props.fetchWeighbridgeList({
                            searchText:searchValue,
                            pageNo: page,
                            pageSize: pageSize,
                            ipAddress: "1.1.1.1",
                            requestId: "WEIGHBRIDGE_LIST_GET",
                            userId: ""
                        });
                        },
                        current: pageNo,
                        total: totalPageItems,
                      }}
                />
                <Modal
                    title='Weighbridge Details'
                    visible={viewWeighbridge}
                    width={600}
                    onOk={() => setViewWeighbridge(false)}
                    onCancel={() => setViewWeighbridge(false)}

                >
                    <Card className="gx-card">
                        <Row>
                            <Col span={24}>
                                <Card>
                                    <p><strong>Weighbridge Name :</strong> {viewWeighbridgeData?.weighbridgeName}</p>
                                    <p><strong>Weighbridge Address :</strong> {viewWeighbridgeData?.address1}</p>
                                    {viewWeighbridgeData?.address2 && <p><strong>Location Address 2 :</strong> {viewWeighbridgeData?.address2}</p>}
                                    <p><strong>Weighbridge City :</strong> {viewWeighbridgeData?.city}</p>
                                    <p><strong>Weighbridge State :</strong> {viewWeighbridgeData?.state}</p>
                                    <p><strong>Weighbridge Contact :</strong> {viewWeighbridgeData?.contactNo}</p>
                                    {viewWeighbridgeData?.address2 && <p><strong>Pin code :</strong> {viewWeighbridgeData?.pincode}</p> }
                                     </Card>
                            </Col>
                        </Row>
                    </Card>
                </Modal>
                <Modal
                    title={editWeighbridge?'Edit Weighbridge':'Add Weighbridge'}
                    visible={showAddWeighbridge}
                    onOk={(e) => {
                        if (editWeighbridge) {
                            e.preventDefault();
                            props.form.validateFields((err, values) => {
                                debugger
                                if (!err) {
                                 const data = {
                                    values: {
                                      ...values,
                                    },
                                    weighbridgeId: props?.weighbridge?.weighbridgeId.weighbridgeId
                                  }
                                  props.updateWeighbridge(data);
                                  props.form.resetFields();
                                  setShowAddWeighbridge(false);
                                  setEditWeighbridge(false);
                                }
                            });
                        } else {
                            props.form.validateFields((err, values) => {
                                debugger
                                if (!err) {
                                 e.preventDefault();
                                 props.addWeighbridge({
                                    ...values,
                                    ipAddress:"",
                                    requestId: "ADD_WEIGHBRIDGE",
                                    userId: ""
                                  });
                                  props.form.resetFields();
                                  setShowAddWeighbridge(false);
                                }
                            });
                        }
                    }}
                    width={800}
                    onCancel={() => {
                        props.form.resetFields();
                        setShowAddWeighbridge(false);
                        setEditWeighbridge(false)
                    }}
                >
                    <Card className="gx-card">
                        <Row>
                            <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                                <Form {...formItemLayout} className="gx-pt-4">
                                    <Form.Item label="Weighbridge Name">
                                        {getFieldDecorator('weighbridgeName', {
                                            rules: [{ required: true, message: 'Please input Weighbridge name!' }],
                                        })(
                                            <Input id="weighbridgeName" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Weighbridge Address">
                                        {getFieldDecorator('weighbridgeAddress', {
                                            rules: [{ required: false, message: 'Please input address!' }],
                                        })(
                                            <Input id="weighbridgeAddress" />
                                        )}
                                    </Form.Item>
                                    {/* <Form.Item label="Weighbridge Address2">
                                        {getFieldDecorator('weighbridgeAddress2', {
                                            // rules: [{ required: false, message: 'Please input address!' }],
                                        })(
                                            <Input id="weighbridgeAddress2" />
                                        )}
                                    </Form.Item> */}
                                    <Form.Item label="City">
                                        {getFieldDecorator('city', {
                                            rules: [{ required: false, message: 'Please input city!' }],
                                        })(
                                            <Input id="city" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="PinCode">
                                        {getFieldDecorator('pincode', {
                                            rules: [{ required: false, message: 'Please input pincode!' }],
                                        })(
                                            <Input id="pincode" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="State">
                                        {getFieldDecorator("state", {
                                        rules: [
                                            {
                                            required: true,
                                            message: "Please select state!",
                                            },
                                        ],
                                        })(
                                        <Select
                                            showSearch
                                            style={{ width: 300 }}
                                            placeholder="Select a state"
                                            filterOption={(input, option) => {
                                                return option?.props?.children?.toLowerCase().includes(input.toLowerCase());
                                            }}
                                            filterSort={(optionA, optionB) =>
                                                optionA?.props?.children.toLowerCase().localeCompare(optionB?.props?.children.toLowerCase())
                                            }
                                        >
                                             {props.location?.stateList?.map((state) => (
                                            <Option key={state.stateName} value={state.stateName}>
                                                {state.stateName}
                                            </Option>
                                            ))} 
                                        </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Contact Number">
                                        {getFieldDecorator('contactNo', {
                                            // rules: [{ required: true, message: 'Please input the contact Number!' }],
                                        })(
                                            <Input id="contactNo" />
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
    weighbridge: state.weighbridge
});

const addWeighbridgeForm = Form.create({
    mapPropsToFields(props) {
        return {
            weighbridgeName:Form.createFormField ({
                ...props.weighbridge?.weighbridgeId?.weighbridgeName,
                value: props.weighbridge?.weighbridgeId?.weighbridgeName|| '',
            }),
            weighbridgeAddress:Form.createFormField ({
                ...props.weighbridge?.weighbridgeId?.address1,
                value: props.weighbridge?.weighbridgeId?.address1|| '',
            }),
            weighbridgeAddress2:Form.createFormField ({
                ...props.weighbridge?.weighbridgeId?.address2,
                value: props.weighbridge?.weighbridgeId?.address2|| '',
            }),
            city:Form.createFormField ({
                ...props.weighbridge?.weighbridgeId?.city,
                value: props.weighbridge?.weighbridgeId?.city|| '',
            }),      
            pincode:Form.createFormField ({
                ...props.weighbridge?.weighbridgeId?.pincode,
                value: props.weighbridge?.weighbridgeId?.pincode|| '',
            }),
            state:Form.createFormField ({
                ...props.weighbridge?.weighbridgeId?.state,
                value: props.weighbridge?.weighbridgeId?.state|| '',
            }),
            contactNo:Form.createFormField ({
                ...props.weighbridge?.weighbridgeId?.contactNo,
                value: props.weighbridge?.weighbridgeId?.contactNo|| '',
            }),
        };
    }
})(Weighbridge);

export default connect(mapStateToProps, {
    fetchWeighbridgeList,
    addWeighbridge,
    fetchWeighbridgeListId,
    updateWeighbridge,
    resetWeighbridge,
    deleteWeighbridge,
    fetchStateList
})(addWeighbridgeForm);
