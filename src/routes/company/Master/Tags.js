import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Select,Tabs, message} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchClassificationList,addProccessTags,addEndUserTags,fetchTagsListById,deleteTagById, fetchEndUserTagsList, resetTagsState,updateTags} from "../../../appRedux/actions";

const Option = Select.Option;

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


const Tags = (props) => {
    const TabPane = Tabs.TabPane;
    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    const [mode, setMode] = useState('top');
    const [tabKey, setTabKey]= useState("1");
    const [showAddTags, setShowAddTags] = useState(false);
    const [tagsList, setTagsList] =useState(tabKey === "1"? props?.processTags: props?.endUserTags)
    const { getFieldDecorator } = props.form;
    const [tagsDeleted, setTagsDeleted] = useState(props?.tagsDeleteSuccess);
    const [tagId, setTagId]= useState("")
    const [showEditTags, setShowEditTags] = useState(false);
    const [editFlag, setEditFlag]= useState(false);
    

    const columns = [{
        title: 'Tag Id',
        dataIndex: 'tagId',
        key: 'tagId',
        filters: [],
        render: (text, record) => {
            return record?.tagId
        }
    },{
        title: 'Tag Name',
        dataIndex: 'tagName',
        key: 'tagName',
        filters: [],
        render: (text, record) => {
            return record?.tagName
        }
    },
    {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (text, record, index) => (
            <span>
                <span className="gx-link" onClick={(e) => onEdit(e,record)}>Edit</span>
                <Divider type="vertical"/>
                <span className="gx-link" onClick={(e) => onDelete(e,record)}>Delete</span>
            </span>
        ),
    },
    ];
    const onEdit = (e,record)=>{
        e.preventDefault();
        const {form} = props;
        form.setFieldsValue({
            tagName: record?.tagName
        });
        setTagId(record?.tagId)
        //  setShowAddTags(true)
        setTimeout(() => {
            setShowEditTags(true) 
        }, 1000);
    }
    const onDelete = (e,record)=>{
        e.preventDefault();
            const payload={
                tagId: record?.tagId,
                type: tabKey ==="1"?"packetClassification":"endusertags"
            }
         props.deleteTagById(payload);   
        
    }
    const addTags=(e)=> {
        e.preventDefault();
        if(showEditTags){
            props.form.validateFields((err, values) => {
            if (!err) {
              
               const payload={
                type: tabKey ==="1"?"packetClassification":"endusertags",
                tagsBody:{...values,tagId: tagId}
               }
                props.updateTags(payload);
                setShowEditTags(false)
                }
            });
        }else{
            props.form.validateFields((err, values) => {
                if (!err) {
                    let payload=[];
                    payload.push(values)
                 tabKey==="1"?props.addProccessTags(payload): props.addEndUserTags(payload);
    
                  setShowAddTags(false);
                }
            });
        }
        
    }
   
useEffect(()=>{
    setTimeout(() => {
        props.fetchClassificationList();
        props.fetchEndUserTagsList();
    }, 1000);
   
},[showAddTags, tagsDeleted, editFlag])
useEffect(()=>{
    setTagsList(tabKey ==="1"? props?.processTags: props?.endUserTags)
},[props?.processTags, props?.endUserTags, tabKey])
useEffect(()=>{
    if(props?.tagsDeleteSuccess) {
        setTagsDeleted(props?.packetClassification?.tagsDeleteSuccess)
        message.success('Tags deleted Successfully', 2).then(() => {
        setTimeout(() => {
            props.resetTagsState();
        }, 1000);
});
}
},[props?.tagsDeleteSuccess])
useEffect(()=>{
    if(props?.tagsEditSuccess) {
        setEditFlag(props?.packetClassification?.tagsEditSuccess)
        message.success('Tags Updates Successfully', 2).then(() => {
        setTimeout(() => {
            props.resetTagsState();
        }, 1000);
});
}
},[props?.tagsEditSuccess])
 const handleChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
        // setFilteredInfo(filters)
    };

  const callback=(key)=>{
    setTabKey(key)
  }

    return (
        <div>
            <h1><IntlMessages id="sidebar.company.tagsList"/></h1>
          
                <div className="gx-flex-row gx-flex-1">
                    <div className="gx-flex-row gx-w-50">
                        <Button type="primary" icon={() => <i className="icon icon-add"/>} size="default"
                                onClick={()=> setShowAddTags(true)}
                        >Add Tag</Button>
                        {/* <SearchBox styleName="gx-flex-1" placeholder="Search for process name or party name..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/> */}
                    </div>
                </div>
                <Tabs
          defaultActiveKey="1"
          tabPosition={mode}
          onChange={callback}
            >
                <TabPane tab="Process Tags" key="1">
                  <Card>
                <Table rowSelection={[]}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={tagsList}
                    onChange={handleChange}
                />

                <Modal
                    title='Add Tags'
                    visible={showAddTags || showEditTags}
                    onOk={addTags}
                    width={600}
                    onCancel={() => {
                        props.form.resetFields();
                        setShowAddTags(false);
                        setShowEditTags(false)
                    }}
                >
                    <Card className="gx-card">
                        <Row>
                            <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                                <Form {...formItemLayout} className="gx-pt-4">
                                    
                                    <Form.Item label="Tag Name" >
                                        {getFieldDecorator('tagName', {
                                            rules: [{ required: true, message: 'Please enter Tags name!' }],
                                            })(
                                                <Input id="tagName"/>
                                        )}
                                    </Form.Item>
                                    
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </Modal>
            </Card></TabPane>
            <TabPane tab="EndUser Tags" key="2">
            <Card>
                <Table rowSelection={[]}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={tagsList}
                    onChange={handleChange}
                />

                <Modal
                    title='Add Tags'
                    visible={showAddTags || showEditTags}
                    onOk={addTags}
                    width={600}
                    onCancel={() => {
                        props.form.resetFields();
                        setShowAddTags(false);
                        setShowEditTags(false)
                        // setEditRates(false)
                    }}
                >
                    <Card className="gx-card">
                        <Row>
                            <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                                <Form {...formItemLayout} className="gx-pt-4">
                                    
                                    <Form.Item label="Tag Name" >
                                        {getFieldDecorator('tagName', {
                                            rules: [{ required: true, message: 'Please enter Tags name!' }],
                                            })(
                                                <Input id="tagName"/>
                                        )}
                                    </Form.Item>
                                    
                                    
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </Modal>
            </Card></TabPane>
            </Tabs>
        </div>
    );
}

const mapStateToProps = state => ({
    processTags: state.packetClassification?.processTags,
    endUserTags: state.packetClassification?.endUserTags,
    tagsDeleteSuccess: state.packetClassification?.tagsDeleteSuccess,
    tagsEditSuccess: state.packetClassification?.tagsEditSuccess
});

const addTagsForm = Form.create({
    mapPropsToFields(props) {
        const tagList = [...props?.processTags,...props?.endUserTags];
        return {
            tagName: Form.createFormField({
                ...tagList,
                value: tagList.tagName|| '',
            })
        };
    }
})(Tags);

export default connect(mapStateToProps, {
    addProccessTags,
    fetchClassificationList,
    addEndUserTags,
    fetchTagsListById,
    fetchEndUserTagsList,
    deleteTagById,
    resetTagsState,
    updateTags
})(addTagsForm);