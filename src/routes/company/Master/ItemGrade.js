import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Select,Checkbox} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchItemGradeList, deleteItemGrade, addItemGrade, fetchItemGradeListId, updateItemGrade, resetItemGrade} from "../../../appRedux/actions";
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

const ItemGrade = (props) => {

    const Option = Select.Option;
    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [showAddItemGrade, setShowAddItemGrade] = useState(false);
    const [viewItemGrade, setViewItemGrade] = useState(false);
    const [viewItemGradeData, setViewItemGradeData] = useState({});
    const [editItemGrade, setEditItemGrade] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [filteredItemGradeList, setFilteredItemGradeList] = useState(props?.itemGrade?.itemGradeList?.content || []);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [totalPageItems, setTotalPageItems] = useState(0);
    const { totalItems } = props.itemGrade.itemGradeList;
    const {getFieldDecorator, getFieldValue} = props.form;

    const columns = [{
        title: 'ItemGrade Id',
        dataIndex: 'itemgradeId',
        key: 'itemgradeId',
        filters: [],
        sorter: (a, b) => {
            return a.itemgradeId - b.itemgradeId
        },
        sortOrder: sortedInfo.columnKey === 'itemgradeId' && sortedInfo.order,
    },
    {
        title: 'ItemGrade Name',
        dataIndex: 'itemgradeName',
        key: 'itemgradeName',
        filters: [],
        sorter: (a, b) => a.itemgradeName.length - b.itemgradeName.length,
        sortOrder: sortedInfo.columnKey === 'itemgradeName' && sortedInfo.order,
    },
    {
        title: 'ItemGrade Desc',
        dataIndex: 'itemgradeDesc',
        key: 'itemgradeDesc',
        sorter: (a, b) => a.itemgradeDesc.length - b.itemgradeDesc.length,
        sortOrder: sortedInfo.columnKey === 'itemgradeDesc' && sortedInfo.order,
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
         setViewItemGradeData(record);
        props.fetchItemGradeListId({
            id: record.itemgradeId,
            searchText: '',
            pageNo: "1",
            pageSize: "2",
            ipAddress: '',
            requestId: '',
            userId: ''
        });
        setViewItemGrade(true);
    }
    const onDelete = (record,key, e) => {
        props.deleteItemGrade({
            ids: record.itemgradeId,
            ipAddress: "1.1.1.1",
            requestId: "itemgradeId_DELETE",
            userId: ""
        })
      }

      const onEdit = (record,e)=>{
        e.preventDefault();
        props.fetchItemGradeListId({
            id: record.itemgradeId,
            searchText: '',
            pageNo: "1",
            pageSize: "15",
            ipAddress: '',
            requestId: '',
            userId: ''
        });
        setEditItemGrade(true);
        setTimeout(() => {
            setShowAddItemGrade(true);
        }, 1000);
    }

    useEffect(() => {
        setTimeout(() => {
            props.fetchItemGradeList({
                searchText:"",
                pageNo:"1",
                pageSize:"15",
                ipAddress: "1.1.1.1",
                requestId: "itemgradeId_LIST_GET",
                userId: ""
            });
        }, 1000);
    }, [showAddItemGrade]);

    useEffect(() => {
        const { loading, error, itemGradeList } = props.itemGrade;
        if (!loading && !error) {
            setFilteredItemGradeList(itemGradeList)

        }
    }, [props.itemGrade]);

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
            props.fetchItemGradeList({
                searchText:searchValue,
                pageNo:"1",
                pageSize:"15",
                ipAddress: "1.1.1.1",
                requestId: "itemgradeId_LIST_GET",
                userId: ""
            });
          }
        } else {
          setPageNo(1);
          props.fetchItemGradeList({
            searchText:searchValue,
            pageNo:"1",
            pageSize:"15",
            ipAddress: "1.1.1.1",
            requestId: "itemgradeId_LIST_GET",
            userId: ""
        });
        }
      }, [searchValue]);
console.log("props.itemGrade?.itemGradeId?.itemgradeName", props.itemGrade?.itemGradeId?.itemgradeName)
    return (
        <div>
            <h1><IntlMessages id="master.company.itemGradeList"/></h1>
            <Card>
                <div className="gx-flex-row gx-flex-1">
                    <div className="table-operations gx-col">
                        <Button onClick={deleteSelectedCoils}>Delete</Button>
                        <Button onClick={exportSelectedData}>Export</Button>
                    </div>
                    <div className="gx-flex-row gx-w-50">
                        <Button type="primary" icon={() => <i className="icon icon-add"/>} size="default"
                                onClick={() => {
                                    props.resetItemGrade();
                                    props.form.resetFields()
                                    setShowAddItemGrade(true)
                                }}
                        >Add ItemGrade</Button>
                        <SearchBox styleName="gx-flex-1" placeholder="Search for item grade name..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                    </div>
                </div>
                <Table rowSelection={[]}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={filteredItemGradeList.content}
                    onChange={handleChange}
                    pagination={{
                        pageSize: 15,
                        onChange: (page) => {
                          setPageNo(page);
                          props.fetchItemGradeList({
                            searchText:searchValue,
                            pageNo: page,
                            pageSize: pageSize,
                            ipAddress: "1.1.1.1",
                            requestId: "itemgradeId_LIST_GET",
                            userId: ""
                        });
                        },
                        current: pageNo,
                        total: totalPageItems,
                      }}
                />
                <Modal
                    title='ItemGrade Details'
                    visible={viewItemGrade}
                    width={600}
                    onOk={() => setViewItemGrade(false)}
                    onCancel={() => setViewItemGrade(false)}

                >
                    <Card className="gx-card">
                        <Row>
                            <Col span={24}>
                                <Card>
                                <p><strong>Item Grade Id :</strong> {viewItemGradeData?.itemgradeId}</p>
                                    <p><strong>Item Grade Name :</strong> {viewItemGradeData?.itemgradeName}</p>
                                    <p><strong>Item Grade Description :</strong> {viewItemGradeData?.itemgradeDesc}</p>
                                    
                                     </Card>
                            </Col>
                        </Row>
                    </Card>
                </Modal>
                <Modal
                    title={editItemGrade?'Edit ItemGrade':'Add ItemGrade'}
                    visible={showAddItemGrade}
                    onOk={(e) => {
                        if (editItemGrade) {
                            e.preventDefault();
                            props.form.validateFields((err, values) => {
                                if (!err) {
                                    const data = {
                                        values: {
                                          ...values,
                                        },
                                        itemgradeId: props?.itemGrade?.itemGradeId.itemgradeId
                                      }
                                  props.updateItemGrade(data);
                                  props.form.resetFields();
                                  setShowAddItemGrade(false);
                                  setEditItemGrade(false);
                                }
                            });
                        } else {
                            props.form.validateFields((err, values) => {
                                if (!err) {
                                 e.preventDefault();
                                 props.addItemGrade({
                                    ...values,
                                    ipAddress:"",
                                    requestId: "ADD_ITEMGRADE",
                                    userId: ""
                                  });
                                  props.form.resetFields();
                                  setShowAddItemGrade(false);
                                }
                            });
                        }
                    }}
                    width={800}
                    onCancel={() => {
                        props.form.resetFields();
                        setShowAddItemGrade(false);
                        setEditItemGrade(false)
                    }}
                >
                    <Card className="gx-card">
                        <Row>
                            <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                                <Form {...formItemLayout} className="gx-pt-4">
                                    <Form.Item label="Item Grade Name">
                                        {getFieldDecorator('itemgradeName', {
                                            rules: [{ required: true, message: 'Please input item grade name!' }],
                                        })(
                                            <Input id="itemgradeName" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Item Grade Desc">
                                        {getFieldDecorator('itemgradeDesc', {
                                            rules: [{ required: false, message: 'Please input item grade Description!' }],
                                        })(
                                            <Input id="itemgradeDesc" />
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
    itemGrade: state.itemGrade,
});

const addItemGradeForm = Form.create({
    mapPropsToFields(props) {
        return {
            itemgradeName:Form.createFormField ({
                ...props.itemGrade?.itemGradeId?.itemgradeName,
                value: props.itemGrade?.itemGradeId?.itemgradeName|| '',
            }),
            itemgradeDesc:Form.createFormField ({
                ...props.itemGrade?.itemGradeId?.itemgradeDesc,
                value: props.itemGrade?.itemGradeId?.itemgradeDesc|| '',
            }),
        };
    }
})(ItemGrade);

export default connect(mapStateToProps, {
    fetchItemGradeList,
    addItemGrade,
    fetchItemGradeListId,
    updateItemGrade,
    resetItemGrade,
    deleteItemGrade
})(addItemGradeForm);
