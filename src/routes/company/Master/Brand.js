import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Select,Checkbox} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchBrandList, deleteBrand, addBrand, fetchBrandListId, updateBrand, resetBrand, fetchStateList } from "../../../appRedux/actions";
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

const Brand = (props) => {

    const Option = Select.Option;
    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [showAddBrand, setShowAddBrand] = useState(false);
    const [viewBrand, setViewBrand] = useState(false);
    const [viewBrandData, setViewBrandData] = useState({});
    const [editBrand, setEditBrand] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [filteredBrandList, setFilteredBrandList] = useState(props?.brand?.brandList?.content || []);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [totalPageItems, setTotalPageItems] = useState(0);
    const { totalItems } = props.brand?.brandList;
    const {getFieldDecorator, getFieldValue} = props.form;

    const columns = [{
        title: 'Brand Id',
        dataIndex: 'brandId',
        key: 'brandId',
        filters: [],
        sorter: (a, b) => {
            return a.brandId - b.brandId
        },
        sortOrder: sortedInfo.columnKey === 'brandId' && sortedInfo.order,
    },
    {
        title: 'Brand Name',
        dataIndex: 'brandName',
        key: 'brandName',
        filters: [],
        sorter: (a, b) => a.brandName.length - b.brandName.length,
        sortOrder: sortedInfo.columnKey === 'brandName' && sortedInfo.order,
    },
    {
        title: 'Brand Description',
        dataIndex: 'brandDesc',
        key: 'brandDesc',
        filters: [],
        sorter: (a, b) => a.brandDesc.length - b.brandDesc.length,
        sortOrder: sortedInfo.columnKey === 'brandDesc' && sortedInfo.order,
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
         setViewBrandData(record);
        props.fetchBrandListId({
            id: record.brandId,
            searchText: '',
            pageNo: "1",
            pageSize: "15",
            ipAddress: '',
            requestId: 'BRAND_INSERT',
            userId: ''
        });
        setViewBrand(true);
    }
    const onDelete = (record,key, e) => {
        props.deleteBrand({
            ids: record.brandId,
            ipAddress: "1.1.1.1",
            requestId: "BRAND_DELETE",
            userId: ""
        })
      }

      const onEdit = (record,e)=>{
        e.preventDefault();
        props.fetchBrandListId({
            id: record.brandId,
            searchText: '',
            pageNo: "1",
            pageSize: "15",
            ipAddress: '',
            requestId: 'BRAND_UPDATE',
            userId: ''
        });
        setEditBrand(true);
        setTimeout(() => {
            setShowAddBrand(true);
        }, 1000);
    }

    useEffect(() => {
        setTimeout(() => {
            props.fetchBrandList({
                searchText:"",
                pageNo:"1",
                pageSize:"15",
                ipAddress: "1.1.1.1",
                requestId: "BRAND_LIST_GET",
                userId: ""
            });
        }, 1000);
    }, [showAddBrand]);

    useEffect(() => {
        const { loading, error, brandList } = props.brand;
        if (!loading && !error) {
            setFilteredBrandList(brandList)

        }
    }, [props.brand]);

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
            props.fetchBrandList({
                searchText:searchValue,
                pageNo:"1",
                pageSize:"15",
                ipAddress: "1.1.1.1",
                requestId: "BRAND_LIST_GET",
                userId: ""
            });
          }
        } else {
          setPageNo(1);
          props.fetchBrandList({
            searchText:searchValue,
            pageNo:"1",
            pageSize:"15",
            ipAddress: "1.1.1.1",
            requestId: "BRAND_LIST_GET",
            userId: ""
        });
        }
      }, [searchValue]);
console.log("brandbbbbb", props.brand)
    return (
        <div>
            <h1><IntlMessages id="master.company.brandList"/></h1>
            <Card>
                <div className="gx-flex-row gx-flex-1">
                    <div className="table-operations gx-col">
                        <Button onClick={deleteSelectedCoils}>Delete</Button>
                        <Button onClick={exportSelectedData}>Export</Button>
                    </div>
                    <div className="gx-flex-row gx-w-50">
                        <Button type="primary" icon={() => <i className="icon icon-add"/>} size="default"
                                onClick={() => {
                                    props.resetBrand();
                                    props.form.resetFields()
                                    setShowAddBrand(true)
                                }}
                        >Add Brand</Button>
                        <SearchBox styleName="gx-flex-1" placeholder="Search for brand name..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                    </div>
                </div>
                <Table rowSelection={[]}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={filteredBrandList.content}
                    onChange={handleChange}
                    pagination={{
                        pageSize: 15,
                        onChange: (page) => {
                          setPageNo(page);
                          props.fetchBrandList({
                            searchText:searchValue,
                            pageNo: page,
                            pageSize: pageSize,
                            ipAddress: "1.1.1.1",
                            requestId: "BRAND_LIST_GET",
                            userId: ""
                        });
                        },
                        current: pageNo,
                        total: totalPageItems,
                      }}
                />
                <Modal
                    title='Brand Details'
                    visible={viewBrand}
                    width={600}
                    onOk={() => setViewBrand(false)}
                    onCancel={() => setViewBrand(false)}

                >
                    <Card className="gx-card">
                        <Row>
                            <Col span={24}>
                                <Card>
                                    <p><strong>Brand Id :</strong> {viewBrandData?.brandId}</p>
                                    <p><strong>Brand Name :</strong> {viewBrandData?.brandName}</p>
                                    <p><strong>Brand Description :</strong> {viewBrandData?.brandDesc}</p>
                                     </Card>
                            </Col>
                        </Row>
                    </Card>
                </Modal>
                <Modal
                    title={editBrand?'Edit Brand':'Add Brand'}
                    visible={showAddBrand}
                    onOk={(e) => {
                        if (editBrand) {
                            e.preventDefault();
                            props.form.validateFields((err, values) => {
                                if (!err) {
                                 const data = {
                                    values: {
                                      ...values,
                                    },
                                    brandId: props?.brand?.brandId.brandId
                                  }
                                  props.updateBrand(data);
                                  props.form.resetFields();
                                  setShowAddBrand(false);
                                  setEditBrand(false);
                                }
                            });
                        } else {
                            props.form.validateFields((err, values) => {
                                if (!err) {
                                 e.preventDefault();
                                 props.addBrand({
                                    ...values,
                                    ipAddress:"",
                                    requestId: "ADD_BRAND",
                                    userId: ""
                                  });
                                  props.form.resetFields();
                                  setShowAddBrand(false);
                                }
                            });
                        }
                    }}
                    width={800}
                    onCancel={() => {
                        props.form.resetFields();
                        setShowAddBrand(false);
                        setEditBrand(false)
                    }}
                >
                    <Card className="gx-card">
                        <Row>
                            <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                                <Form {...formItemLayout} className="gx-pt-4">
                                    <Form.Item label="Brand Name">
                                        {getFieldDecorator('brandName', {
                                            rules: [{ required: true, message: 'Please input brand name!' }],
                                        })(
                                            <Input id="brandName" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Brand Description">
                                        {getFieldDecorator('brandDesc', {
                                            rules: [{ required: false, message: 'Please input description!' }],
                                        })(
                                            <Input id="brandDesc" />
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
    brand: state.brand
});

const addBrandForm = Form.create({
    mapPropsToFields(props) {
        return {
            brandName:Form.createFormField ({
                ...props.brand?.brandId?.brandName,
                value: props.brand?.brandId?.brandName|| '',
            }),
            brandDesc:Form.createFormField ({
                ...props.brand?.brandId?.brandDesc,
                value: props.brand?.brandId?.brandDesc|| '',
            }),
        };
    }
})(Brand);

export default connect(mapStateToProps, {
    fetchBrandList,
    addBrand,
    fetchBrandListId,
    updateBrand,
    resetBrand,
    deleteBrand,
    fetchStateList
})(addBrandForm);
