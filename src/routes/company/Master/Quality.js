import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Icon, Tabs} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchMaterialList, addMaterial, fetchMaterialListById, updateMaterial, resetMaterial } from "../../../appRedux/actions";
import { onDeleteContact } from "../../../appRedux/actions";

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;


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

const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: {span: 24, offset: 0},
      sm: {span: 20, offset: 4},
    },
  };

const Quality = (props) => {

    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });

    const columns = [{
        title: 'S No',
        dataIndex: 'tempId',
        key: 'tempId',
        filters: [],
        sorter: (a, b) => {
            return a.tempId - b.tempId
        },
        sortOrder: sortedInfo.columnKey === 'matId' && sortedInfo.order,
    },
    {
        title: 'Template Code',
        dataIndex: 'templateCode',
        key: 'templateCode',
        filters: [],
        sorter: (a, b) => {
            return a.templateCode - b.templateCode
        },
        sortOrder: sortedInfo.columnKey === 'templateCode' && sortedInfo.order,
    },
    {
        title: 'Template Name',
        dataIndex: 'templateName',
        key: 'templateName',
        filters: [],
        sorter: (a, b) => {
            return a.templateName - b.templateName
        },
        sortOrder: sortedInfo.columnKey === 'templateName' && sortedInfo.order,
    },
    {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (text, record, index) => (
            <span>
                <span className="gx-link" onClick={(e) => onView(record, e)}>View</span>
                <Divider type="vertical"/>
                <span className="gx-link" onClick={(e) => onEdit(record,e)}>Edit</span>
                <Divider type="vertical"/>
                <span className="gx-link"onClick={() => {}}>Delete</span>
            </span>
        ),
    },
    ];

    const onView = (record, e) => {
    }

    const onDelete = (record,key, e) => {
      }
    const onEdit = (record,e)=>{      
    }

    const handleChange = (pagination, filters, sorter) => {
    };

    const clearFilters = () => {
    };

    const exportSelectedData = () => {

    }

    const getRadioFields = () => {
        console.log('dfd');
    };

    return (
        <div>
            <h1><IntlMessages id="sidebar.company.materialList"/></h1>
            <Card>
                <div className="gx-flex-row gx-flex-1">
                    {/* <div className="table-operations gx-col">
                        <Button onClick={deleteSelectedCoils}>Create Template</Button>
                        <Button onClick={exportSelectedData}>Export</Button>
                    </div> */}
                    <div className="gx-flex-row gx-w-50">
                        <SearchBox styleName="gx-flex-1" placeholder="Search template" value={''} onChange={(e) => {}}/>
                        <Button type="primary" icon={() => <i className="icon icon-add"/>} size="medium"
                                onClick={() => {
                                    // setshowCreateTemplate(true);
                                    // history.push(`${pathname}/createTemplate`);
                                    props.history.push('/company/master/quality/createTemplate')
                                }}
                        >Create Template</Button>
                    </div>
                </div>
                <Table rowSelection={[]}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={[]}
                    onChange={handleChange}
                />
            </Card>
        </div>
    );
}

const addMaterialForm = Form.create()(Quality);

export default addMaterialForm;