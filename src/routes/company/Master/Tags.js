import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Select} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchClassificationList,addPacketClassification} from "../../../appRedux/actions";

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

    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    const [searchValue, setSearchValue] = useState('');
    const [showAddTags, setShowAddTags] = useState(false);
    const [tagsName, setTagName] = useState("");
    const [tagsList, setTagsList] =useState(props?.classificationList || [])

    const { getFieldDecorator } = props.form;

    const columns = [{
        title: 'Tag Name',
        dataIndex: 'classificationName',
        key: 'classificationName',
        filters: []
    },
    {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (text, record, index) => (
            <span>
                <span className="gx-link" onClick={(e) => onEdit(record,e)}>Edit</span>
            </span>
        ),
    },
    ];
    const onEdit = (record,e)=>{
        e.preventDefault();
        setTagName(record.classificationName)
        setShowAddTags(true)
                
    }
    const addTags=()=> {
        props.form.validateFields((err, values) => {
            if (!err) {
                let payload=[];
                payload.push(values)
              console.log('Received values of form: ', values);
              props.addPacketClassification(payload);
              props.form.resetFields();
              setShowAddTags(false);
            }
        });
    }
    
 const handleTagsChange =(e)=>{
    setTagName(e.target.value)
   
}
useEffect(()=>{
    props.fetchClassificationList();
},[showAddTags])
useEffect(()=>{
    setTagsList(props.classificationList)
},[props?.classificationList])

    // useEffect(() => {

    //     const { classificationList } = props;
    //     if(searchValue) {
    //         const filteredData = classificationList.filter((tag) => {
    //             if( tag?.classificationName.toLowerCase().includes(searchValue.toLowerCase())){
    //                 return tag;
    //             }
    //         });
    //         setFilteredInwardList(filteredData);
    //     } else {
    //         setFilteredInwardList(classificationList);
    //     }
    // }, [searchValue])
    const handleChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
        // setFilteredInfo(filters)
    };

    // const clearAll = () => {
    //     setSortedInfo(null);
    //     setFilteredInfo(null);
    // };


    return (
        <div>
            <h1><IntlMessages id="sidebar.company.ratesList"/></h1>
            <Card>
                <div className="gx-flex-row gx-flex-1">
                    <div className="gx-flex-row gx-w-50">
                        <Button type="primary" icon={() => <i className="icon icon-add"/>} size="medium"
                                onClick={()=> setShowAddTags(true)}
                        >Add Tag</Button>
                        {/* <SearchBox styleName="gx-flex-1" placeholder="Search for process name or party name..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/> */}
                    </div>
                </div>
                <Table rowSelection={[]}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={tagsList}
                    onChange={handleChange}
                />

                <Modal
                    title='Add Rates'
                    visible={showAddTags}
                    onOk={addTags}
                    width={600}
                    onCancel={() => {
                        props.form.resetFields();
                        setShowAddTags(false);
                        // setEditRates(false)
                    }}
                >
                    <Card className="gx-card">
                        <Row>
                            <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                                <Form {...formItemLayout} className="gx-pt-4">
                                    
                                    <Form.Item label="Tag Name" >
                                        {getFieldDecorator('classificationName', {
                                            rules: [{ required: true, message: 'Please enter Tags name!' }],
                                            })(
                                                <Input id="classificationName" value={tagsName} onChange={handleTagsChange}/>
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
    classificationList: state.packetClassification?.classificationList,
});

const addTagsForm = Form.create({
    mapPropsToFields(props) {
        const { classificationList } = props.classificationList;
        return {
            tags: Form.createFormField({
                ...classificationList?.classificationName,
                value: classificationList?.classificationName || '',
            })
        };
    }
})(Tags);

export default connect(mapStateToProps, {
    addPacketClassification,
    fetchClassificationList
})(addTagsForm);