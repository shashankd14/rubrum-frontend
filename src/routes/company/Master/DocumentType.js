import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Select,Checkbox} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchDocumentTypeList, deleteDocumentType, addDocumentType, fetchDocumentTypeListId, updateDocumentType, resetManufacturer, fetchStateList } from "../../../appRedux/actions";
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

const DocumentType = (props) => {

    const Option = Select.Option;
    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [showAddDocumentType, setShowAddDocumentType] = useState(false);
    const [viewDocumentType, setViewDocumentType] = useState(false);
    const [viewDocumentTypeData, setViewDocumentTypeData] = useState({});
    const [editDocumentType, setEditDocumentType] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [filteredDocumentTypeList, setFilteredDocumentTypeList] = useState(props?.documentType?.documentTypeList || []);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [totalPageItems, setTotalPageItems] = useState(0);
    const { totalItems } = props.documentType?.documentTypeList;
    const {getFieldDecorator, getFieldValue} = props.form;

    const columns = [{
        title: 'Document Id',
        dataIndex: 'docId',
        key: 'docId',
        filters: [],
        sorter: (a, b) => {
            return a.docId - b.docId
        },
        sortOrder: sortedInfo.columnKey === 'docId' && sortedInfo.order,
    },
    {
        title: 'Document Type',
        dataIndex: 'docName',
        key: 'docName',
        filters: [],
        sorter: (a, b) => a.docName.length - b.docName.length,
        sortOrder: sortedInfo.columnKey === 'docName' && sortedInfo.order,
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
         setViewDocumentTypeData(record);
        props.fetchDocumentTypeListId({
            id: record.docId,
            searchText: '',
            pageNo: "1",
            pageSize: "2",
            ipAddress: '',
            requestId: '',
            userId: ''
        });
        setViewDocumentType(true);
    }
    const onDelete = (record,key, e) => {
        props.deleteDocumentType({
            ids: record.docId,
            ipAddress: "1.1.1.1",
            requestId: "",
            userId: ""
        })
      }

      const onEdit = (record,e)=>{
        e.preventDefault();
        props.fetchDocumentTypeListId({
            id: record.docId,
            searchText: '',
            pageNo: "1",
            pageSize: "15",
            ipAddress: '',
            requestId: '',
            userId: ''
        });
        setEditDocumentType(true);
        setTimeout(() => {
            setShowAddDocumentType(true);
        }, 1000);
    }

    useEffect(() => {
        setTimeout(() => {
            props.fetchDocumentTypeList({
                ipAddress: "1.1.1.1",
                requestId: "DOCUMENT_LIST_GET",
                userId: ""
            });
        }, 1000);
    }, [showAddDocumentType]);

    useEffect(() => {
        debugger
        const { loading, error, documentTypeList } = props.documentType;
        if (!loading && !error) {
            setFilteredDocumentTypeList(documentTypeList)

        }
    }, [props.documentType]);

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
            props.fetchDocumentTypeList({
                ipAddress: "1.1.1.1",
                requestId: "DOCUMENT_LIST_GET",
                userId: ""
            });
          }
        } else {
          setPageNo(1);
          props.fetchDocumentTypeList({
            ipAddress: "1.1.1.1",
            requestId: "DOCUMENT_LIST_GET",
            userId: ""
        });
        }
      }, [searchValue]);

    return (
        <div>
            <h1><IntlMessages id="master.company.DocumentList"/></h1>
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
                                    setShowAddDocumentType(true)
                                }}
                        >Add Document Type</Button>
                        <SearchBox styleName="gx-flex-1" placeholder="Search for document name..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                    </div>
                </div>
                <Table rowSelection={[]}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={filteredDocumentTypeList}
                    onChange={handleChange}
                    pagination={{
                        pageSize: 15,
                        onChange: (page) => {
                          setPageNo(page);
                          props.fetchDocumentTypeList({
                            searchText:searchValue,
                            pageNo: page,
                            pageSize: pageSize,
                            ipAddress: "1.1.1.1",
                            requestId: "DOCUMENT_LIST_GET",
                            userId: ""
                        });
                        },
                        current: pageNo,
                        total: totalPageItems,
                      }}
                />
                <Modal
                    title='Document Type Details'
                    visible={viewDocumentType}
                    width={600}
                    onOk={() => setViewDocumentType(false)}
                    onCancel={() => setViewDocumentType(false)}

                >
                    <Card className="gx-card">
                        <Row>
                            <Col span={24}>
                                <Card>
                                <p><strong>Document Id :</strong> {viewDocumentTypeData?.docId}</p>
                                    <p><strong>Document Name :</strong> {viewDocumentTypeData?.docName}</p>
                                    
                                     </Card>
                            </Col>
                        </Row>
                    </Card>
                </Modal>
                <Modal
                    title={editDocumentType?'Edit Document':'Add Document'}
                    visible={showAddDocumentType}
                    onOk={(e) => {
                        if (editDocumentType) {
                            e.preventDefault();
                            props.form.validateFields((err, values) => {
                                if (!err) {
                                 const data = {
                                    values: {
                                      ...values,
                                    },
                                    docId: props?.documentType?.documentTypeId.docId
                                  }
                                  props.updateDocumentType(data);
                                  props.form.resetFields();
                                  setShowAddDocumentType(false);
                                  setEditDocumentType(false);
                                }
                            });
                        } else {
                            props.form.validateFields((err, values) => {
                                if (!err) {
                                 e.preventDefault();
                                 props.addDocumentType({
                                    values
                                  });
                                  props.form.resetFields();
                                  setShowAddDocumentType(false);
                                }
                            });
                        }
                    }}
                    width={800}
                    onCancel={() => {
                        props.form.resetFields();
                        setShowAddDocumentType(false);
                        setEditDocumentType(false)
                    }}
                >
                    <Card className="gx-card">
                        <Row>
                            <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                                <Form {...formItemLayout} className="gx-pt-4">
                                    <Form.Item label="Document Name">
                                        {getFieldDecorator('docName', {
                                            rules: [{ required: true, message: 'Please input document name!' }],
                                        })(
                                            <Input id="docName" />
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
   documentType: state.documentType
});

const addDocumentTypeForm = Form.create({
    mapPropsToFields(props) {
        return {
            docName:Form.createFormField ({
                ...props.documentType?.documentTypeId?.docName,
                value: props.documentType?.documentTypeId?.docName|| '',
            }),
        };
    }
})(DocumentType);

export default connect(mapStateToProps, {
    fetchDocumentTypeList,
    addDocumentType,
    fetchDocumentTypeListId,
    updateDocumentType,
    resetManufacturer,
    deleteDocumentType,
    fetchStateList
})(addDocumentTypeForm);
