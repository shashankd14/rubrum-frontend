import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Select,Checkbox, Tabs} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchMainCategoryList, fetchMainCategoryId, deleteMainCategory, addSubCategory, addMainCategory, fetchSubCategoryList, deleteSubCategory, fetchSubCategoryId, updateSubCategory, updateMainCategory, resetMainCategory, resetSubCategory } from "../../../appRedux/actions";
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

const Category = (props) => {
    
    const TabPane = Tabs.TabPane;
    const Option = Select.Option;
    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [showAddMainCategory, setShowAddMainCategory] = useState(false);
    const [showAddSubCategory, setShowAddSubCategory] = useState(false);
    const [editSubCategory, setEditSubCategory] = useState(false);
    const [viewMainCategory, setViewMainCategory] = useState(false);
    const [viewSubCategory, setViewSubCategory] = useState(false);
    const [viewMainCategoryData, setViewMainCategoryData] = useState({});
    const [viewSubCategoryData, setViewSubCategoryData] = useState({});
    const [editMainCategory, setEditMainCategory] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [filteredMainCategoryList, setFilteredMainCategoryList] = useState(props?.category?.mainCategoryList?.content || []);
    const [filteredSubCategoryList, setFilteredSubCategoryList] = useState(props?.category?.subCategoryList?.content || []);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [totalPageItems, setTotalPageItems] = useState(0);
    const [tabKey, setTabKey] = useState("1");
    const [mode, setMode] = useState("top");

    const {getFieldDecorator, getFieldValue, getFieldProps} = props.form;
    // const { totalItems } = props.location.locationList;
    const { totalItems } = props.category.mainCategoryList;

    const columns = [{
        title: 'Category Id',
        dataIndex: 'categoryId',
        key: 'categoryId',
        filters: [],
        sorter: (a, b) => {
            return a.categoryId - b.categoryId
        },
        sortOrder: sortedInfo.columnKey === 'categoryId' && sortedInfo.order,
    },
    {
        title: 'Category Name',
        dataIndex: 'categoryName',
        key: 'categoryName',
        filters: [],
        sorter: (a, b) => a.categoryName.length - b.categoryName.length,
        sortOrder: sortedInfo.columnKey === 'categoryName' && sortedInfo.order,
    },
    {
        title: 'Item Code',
        dataIndex: 'categoryHsnCode',
        key: 'categoryHsnCode',
        filters: [],
        sorter: (a, b) => a.categoryHsnCode.length - b.categoryHsnCode.length,
        sortOrder: sortedInfo.columnKey === 'categoryHsnCode' && sortedInfo.order,
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

    const columnsSub = [{
        title: 'Category Id',
        dataIndex: 'subcategoryId',
        key: 'subcategoryId',
        filters: [],
        sorter: (a, b) => {
            return a.subcategoryId - b.subcategoryId
        },
        sortOrder: sortedInfo.columnKey === 'subcategoryId' && sortedInfo.order,
    },
    // {
    //     title: 'Main Category Name',
    //     dataIndex: 'categoryName',
    //     key: 'categoryName',
    //     filters: [],
    //     sorter: (a, b) => a.categoryName.length - b.categoryName.length,
    //     sortOrder: sortedInfo.columnKey === 'categoryName' && sortedInfo.order,
    // },
    {
        title: 'Sub Category Name',
        dataIndex: 'subcategoryName',
        key: 'subcategoryName',
        filters: [],
        sorter: (a, b) => a.subcategoryName.length - b.subcategoryName.length,
        sortOrder: sortedInfo.columnKey === 'subcategoryName' && sortedInfo.order,
    },
    {
        title: 'Item Code',
        dataIndex: 'subcategoryHsnCode',
        key: 'subcategoryHsnCode',
        filters: [],
        sorter: (a, b) => a.subcategoryHsnCode.length - b.subcategoryHsnCode.length,
        sortOrder: sortedInfo.columnKey === 'subcategoryHsnCode' && sortedInfo.order,
    },
    {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (text, record, index) => (
            <span>
                <span className="gx-link" onClick={(e) => onViewSub(record, e)}>View</span>
                <Divider type="vertical"/>
                <span className="gx-link" onClick={(e) => onEditSub(record, e)}>Edit</span>
                <Divider type="vertical"/>
                <span className="gx-link" onClick={(e) => onDelete(record, e)}>Delete</span>
            </span>
        ),
    },
    ];

    const onView = (record, e) => {
        e.preventDefault();
         setViewMainCategoryData(record);
        props.fetchMainCategoryId({
            id: record.categoryId,
            searchText: '',
            pageNo: "1",
            pageSize: "15",
            ipAddress: '',
            requestId: '',
            userId: ''
        });
        setViewMainCategory(true);
    }
    const onViewSub = (record, e) => {
        e.preventDefault();
        setViewSubCategoryData(record);
        props.fetchSubCategoryId({
            id: record.categoryId,
            searchText: '',
            pageNo: "1",
            pageSize: "15",
            ipAddress: '',
            requestId: '',
            userId: ''
        });
        setViewSubCategory(true);
    }
    
    const onDelete = (record,key, e) => {
        props.deleteMainCategory({
            ids: record.categoryId,
            ipAddress: "1.1.1.1",
            requestId: "MAIN_CATEGORY_DELETE",
            userId: ""
        })
        props.deleteSubCategory({
            ids: record.subcategoryId,
            ipAddress: "1.1.1.1",
            requestId: "SUB_CATEGORY_DELETE",
            userId: ""
        })
      }

      const onEdit = (record,e)=>{
        e.preventDefault();
        props.fetchMainCategoryId({
            id: record.categoryId,
            searchText: '',
            pageNo: "1",
            pageSize: "15",
            ipAddress: '',
            requestId: '',
            userId: ''
        });
        setEditMainCategory(true);
        setTimeout(() => {
            setShowAddMainCategory(true);
        }, 1000);
    }

    const onEditSub = (record,e)=>{
         debugger
        e.preventDefault();
        props.fetchSubCategoryId({
            id: record.subcategoryId,
            searchText: '',
            pageNo: "1",
            pageSize: "15",
            ipAddress: '',
            requestId: '',
            userId: ''
        });
        setEditSubCategory(true);
        setTimeout(() => {
            setShowAddSubCategory(true);
        }, 1000);
    }

    useEffect(() => {
        setTimeout(() => {
            props.fetchMainCategoryList({
                searchText:"",
                pageNo:"1",
                pageSize:"15",
                ipAddress: "1.1.1.1",
                requestId: "MAIN_CATEGORY_LIST_GET",
                userId: ""
            });
        }, 1000);
    }, [showAddMainCategory]);

    useEffect(() => {
        setTimeout(() => {
            props.fetchSubCategoryList({
                searchText:"",
                pageNo:"1",
                pageSize:"15",
                ipAddress: "1.1.1.1",
                requestId: "SUB_CATEGORY_LIST_GET",
                userId: ""
            });
        }, 1000);
    }, [showAddSubCategory]);

    useEffect(() => {
        const { loading, error, mainCategoryList, subCategoryList } = props.category;
        if (!loading && !error) {
            setFilteredMainCategoryList(mainCategoryList);
            setFilteredSubCategoryList(subCategoryList);
        }
    }, [props.category]);

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
            props.fetchMainCategoryList({
                searchText:searchValue,
                pageNo:"1",
                pageSize:"15",
                ipAddress: "1.1.1.1",
                requestId: "MAIN_LIST_GET",
                userId: ""
            });
          }
        } else {
          setPageNo(1);
          props.fetchMainCategoryList({
            searchText:searchValue,
            pageNo:"1",
            pageSize:"15",
            ipAddress: "1.1.1.1",
            requestId: "MAIN_LIST_GET",
            userId: ""
        });
        }
      }, [searchValue]);

      useEffect(() => {
        if (searchValue) {
          if (searchValue.length >= 3) {
            setPageNo(1);
            props.fetchSubCategoryList({
                searchText:searchValue,
                pageNo:"1",
                pageSize:"15",
                ipAddress: "1.1.1.1",
                requestId: "SUB_LIST_GET",
                userId: ""
            });
          }
        } else {
          setPageNo(1);
          props.fetchSubCategoryList({
            searchText:searchValue,
            pageNo:"1",
            pageSize:"15",
            ipAddress: "1.1.1.1",
            requestId: "SUB_LIST_GET",
            userId: ""
        });
        }
      }, [searchValue]);

    const callback = (key) => {
        setTabKey(key);
      };

    return (
        <div>
            <h1><IntlMessages id="sidebar.master.category"/></h1>
            <Card>
                <div className="gx-flex-row gx-flex-1">
                    <div className="table-operations gx-col">
                        <Button onClick={deleteSelectedCoils}>Delete</Button>
                        <Button onClick={exportSelectedData}>Export</Button>
                    </div>
                    <div className="gx-flex-row gx-w-50">
                        {tabKey === "1" && (
                        <Button type="primary" icon={() => <i className="icon icon-add"/>} size="default"
                                onClick={() => {
                                    props.resetMainCategory();
                                    props.form.resetFields()
                                    setShowAddMainCategory(true)
                                }}
                        >Add Category</Button>
                        )}
                        {tabKey === "2" && (
                        <Button type="primary" icon={() => <i className="icon icon-add"/>} size="default"
                                onClick={() => {
                                    props.resetSubCategory();
                                    props.form.resetFields()
                                    setShowAddSubCategory(true)
                                }}
                        >Add Category</Button>
                        )}
                        <SearchBox styleName="gx-flex-1" placeholder="Search for main category name..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                    </div>
                </div>
                <Tabs defaultActiveKey="1" tabPosition={mode} onChange={callback}>
                <TabPane tab={<IntlMessages id="master.company.mainCategory" />} key="1">
                <Table rowSelection={[]}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={filteredMainCategoryList.content}
                    onChange={handleChange}
                    pagination={{
                        pageSize: 15,
                        onChange: (page) => {
                          setPageNo(page);
                          props.fetchMainCategoryList({
                            searchText:searchValue,
                            pageNo: page,
                            pageSize: pageSize,
                            ipAddress: "1.1.1.1",
                            requestId: "LOCATION_LIST_GET",
                            userId: ""
                        });
                        },
                        current: pageNo,
                        total: totalPageItems,
                      }}
                />
              </TabPane>
              <TabPane tab={<IntlMessages id="sidebar.master.subCategory" />} key="2">
                <Table rowSelection={[]}
                    className="gx-table-responsive"
                    columns={columnsSub}
                    dataSource={filteredSubCategoryList.content}
                    onChange={handleChange}
                />
              </TabPane>
              </Tabs>
                <Modal
                    title='Main Category Details'
                    visible={viewMainCategory}
                    width={600}
                    onOk={() => setViewMainCategory(false)}
                    onCancel={() => setViewMainCategory(false)}

                >
                    <Card className="gx-card">
                        <Row>
                            <Col span={24}>
                                <Card>
                                {viewMainCategoryData?.categoryName && <p><strong>Item Name :</strong> {viewMainCategoryData?.categoryName}</p>}
                                {viewMainCategoryData?.categoryHsnCode && <p><strong>Item code :</strong> {viewMainCategoryData?.categoryHsnCode}</p>}
                               </Card>
                            </Col>
                        </Row>
                    </Card>
                </Modal>
                <Modal
                    title='Sub Category Details'
                    visible={viewSubCategory}
                    width={600}
                    onOk={() => setViewSubCategory(false)}
                    onCancel={() => setViewSubCategory(false)}

                >
                    <Card className="gx-card">
                        <Row>
                            <Col span={24}>
                                <Card>
                                {viewSubCategoryData?.subcategoryName && <p><strong>Item Name :</strong> {viewSubCategoryData?.subcategoryName}</p>}
                                {viewSubCategoryData?.subcategoryHsnCode && <p><strong>Item code :</strong> {viewSubCategoryData?.subcategoryHsnCode}</p>}
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Modal>
                <Modal
                    title={editMainCategory?'Edit Category':'Add Category'}
                    visible={showAddMainCategory}
                    onOk={(e) => {
                        if (editMainCategory) {
                            // e.preventDefault();
                            props.form.validateFields(['categoryName', 'categoryHsnCode'],(err, values) => {
                                if (!err) {
                                 const data = {
                                    values: {
                                      ...values,   
                                    ipAddress:"",
                                    requestId: "UPDATE_MAIN_CATEGORY",
                                    userId: ""
                                    },
                                    id: props.category?.mainCategoryId?.categoryId
                                  }
                                  props.updateMainCategory(data);
                                  props.form.resetFields();
                                  setShowAddMainCategory(false);
                                  setEditMainCategory(false);
                                }
                            });
                        } else {
                            props.form.validateFields(['categoryName', 'categoryHsnCode'],(err, values) => {
                                if (!err) {
                                    debugger
                                //  e.preventDefault();
                                 props.addMainCategory({
                                    ...values,
                                    ipAddress:"",
                                    requestId: "ADD_MAIN_CATEGORY",
                                    userId: ""
                                  });
                                  props.form.resetFields();
                                  setShowAddMainCategory(false);
                                }
                            });
                        }
                    }}
                    width={800}
                    onCancel={() => {
                        props.form.resetFields();
                        setShowAddMainCategory(false);
                        setEditMainCategory(false);
                    }}
                >
                    <Card className="gx-card">
                        <Row>
                            <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                                <Form {...formItemLayout} className="gx-pt-4">
                                <Form.Item label='Item Name'>
                                  {getFieldDecorator('categoryName', {
                                    rules: [
                                      {
                                        required: true,
                                        message: 'Please enter Item Name',
                                      },
                                    ],
                                  })(
                                    <Input id='categoryName' {...getFieldProps} />
                                  )}
                                </Form.Item>
                                <Form.Item label='Item Code'>
                                  {getFieldDecorator('categoryHsnCode', {
                                    rules: [
                                      {
                                        required: true,
                                        message: 'Please enter item code',
                                      },
                                    ],
                                  })(
                                    <Input id='categoryHsnCode' {...getFieldProps} />
                                  )}
                                </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </Modal>
                {/* Sub CAtegory */}
                 <Modal
                    title={editSubCategory?'Edit Category':'Add Category'}
                    visible={showAddSubCategory}
                    onOk={(e) => {
                        debugger
                        if (editSubCategory) {
                            e.preventDefault();
                            props.form.validateFields(['subcategoryId', 'itemName', 'itemCode'],(err, values) => {
                                debugger
                                if (!err) {
                                 const data = {
                                    values: {
                                      ...values,
                                      ipAddress:"",
                                      requestId: "UPDATE_SUB_CATEGORY",
                                      userId: ""
                                    },
                                    id: props.category?.subCategoryId?.subcategoryId
                                  }
                                  props.updateSubCategory(data);
                                  props.form.resetFields();
                                  setShowAddSubCategory(false);
                                  setEditSubCategory(false);
                                }
                            });
                        } else {
                            props.form.validateFields(['subcategoryId', 'itemName', 'itemCode'],(err, values) => {
                                if (!err) {
                                 e.preventDefault();
                                 props.addSubCategory({
                                    ...values,
                                    ipAddress:"",
                                    requestId: "ADD_SUB_CATEGORY",
                                    userId: ""
                                  });
                                  props.form.resetFields();
                                  setShowAddSubCategory(false);
                                }
                            });
                        }
                    }}
                    width={800}
                    onCancel={() => {
                        props.form.resetFields();
                        setShowAddSubCategory(false);
                        setEditSubCategory(false)
                    }}
                >
                    <Card className="gx-card">
                        <Row>
                            <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                                <Form {...formItemLayout} className="gx-pt-4">
                                <Form.Item label="Main Category">
                                {getFieldDecorator("subcategoryId", {
                                    rules: [{
                                        required: true,
                                        message: "Please select main category!",
                                    }],
                                })(
                                    <Select
                                    id="subcategoryId"
                                    showSearch
                                    // mode='multiple'
                                    style={{ width: "100%" }}
                                    filterOption={(input, option) => {
                                        return option?.props?.children?.toLowerCase().includes(input.toLowerCase());
                                    }}
                                    filterSort={(optionA, optionB) =>
                                        optionA?.props?.children.toLowerCase().localeCompare(optionB?.props?.children.toLowerCase())
                                    }
                                    >
                                    {filteredMainCategoryList.content?.map((category) => (
                                        <Option key={category.categoryId} value={category.categoryId}>
                                        {category.categoryName}
                                        </Option>
                                    ))}
                                    </Select>
                                )}
                                </Form.Item>
                                <Form.Item label='Item Name'>
                                  {getFieldDecorator('itemName', {
                                    rules: [
                                      {
                                        required: true,
                                        message: 'Please enter Item Name',
                                      },
                                    ],
                                  })(
                                    <Input id='itemName' {...getFieldProps} />
                                  )}
                                </Form.Item>
                                <Form.Item label='Item Code'>
                                  {getFieldDecorator('itemCode', {
                                    rules: [
                                      {
                                        required: true,
                                        message: 'Please enter item code',
                                      },
                                    ],
                                  })(
                                    <Input id='itemCode' {...getFieldProps} />
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
    mainCategory: state.category.mainCategoryList,
    category:state.category,
    // subCategory: state.category.subCategoryList,
});

const addCategoryForm = Form.create({
    mapPropsToFields(props) {
        return {
            categoryName:Form.createFormField ({
                ...props.category?.mainCategoryId?.categoryName,
                value: props.category?.mainCategoryId?.categoryName|| '',
            }),
            categoryHsnCode: Form.createFormField({
                ...props.category?.mainCategoryId?.categoryHsnCode,
                value: props.category?.mainCategoryId?.categoryHsnCode || '',
            }),
            
            subcategoryId: Form.createFormField({
                ...props.category?.subCategoryId?.categoryId,
                value: props.category?.subCategoryId?.categoryId || '',
            }),
            itemName: Form.createFormField({
                ...props.category?.subCategoryId?.subcategoryName,
                value: props.category?.subCategoryId?.subcategoryName || '',
            }),
            itemCode: Form.createFormField({
                ...props.category?.subCategoryId?.subcategoryHsnCode,
                value: props.category?.subCategoryId?.subcategoryHsnCode || '',
            }),
        };
    }
})(Category);

export default connect(mapStateToProps, {
    fetchMainCategoryList,
    fetchMainCategoryId,
    addMainCategory,
    addSubCategory,
    deleteMainCategory,
    fetchSubCategoryList,
    deleteSubCategory,
    fetchSubCategoryId,
    updateSubCategory,
    updateMainCategory,
    resetMainCategory,
    resetSubCategory,
})(addCategoryForm);
