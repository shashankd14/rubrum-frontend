import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Select} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchRatesList, fetchPartyList, fetchMaterialList, fetchProcessList, addRates, fetchRatesListById, updateRates, resetRates} from "../../../appRedux/actions";
import { onDeleteContact } from "../../../appRedux/actions";

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
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [showAddTags, setShowAddTags] = useState(false);
    const [viewMaterial, setViewMaterial] = useState(false);
    const [tagsName, setTagName] = useState("");
    const [viewMaterialData, setViewMaterialData] = useState({});
    const [filteredInwardList, setFilteredInwardList] = useState(props.rates?.ratesList || []);
    const [tagsList, setTagsList] =useState([])

    const { getFieldDecorator } = props.form;

    const columns = [{
        title: 'Tag Name',
        dataIndex: 'tagName',
        key: 'tagName',
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
        setTagName(record.tagName)
        setShowAddTags(true)
        
        //todo
                
    }
    const addTags=()=> {
         let tagsList=[]
         tagsList.push({tagName:tagsName})
            props.form.resetFields();
            setTagsList(tagsList)
            setShowAddTags(false)
    
    }
    
 const handleTagsChange =(e)=>{
    setTagName(e.target.value)
   
}

    useEffect(() => {

        const { rates } = props;
        if(searchValue) {
            const filteredData = rates?.ratesList?.filter((rate) => {
                if(rate?.rateId?.toString() === searchValue ||
                    rate?.partyRates?.partyName?.toLowerCase().includes(searchValue.toLowerCase()) ||
                    rate?.process?.processName.toLowerCase().includes(searchValue)) {
                    return rate;
                }
            });
            setFilteredInwardList(filteredData);
        } else {
            setFilteredInwardList(rates.ratesList);
        }
    }, [searchValue])
    const handleChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
        setFilteredInfo(filters)
    };

    const clearAll = () => {
        setSortedInfo(null);
        setFilteredInfo(null);
    };


    return (
        <div>
            <h1><IntlMessages id="sidebar.company.ratesList"/></h1>
            <Card>
                <div className="gx-flex-row gx-flex-1">
                    <div className="gx-flex-row gx-w-50">
                        <Button type="primary" icon={() => <i className="icon icon-add"/>} size="medium"
                                onClick={()=> setShowAddTags(true)}
                        >Add Tags</Button>
                        <SearchBox styleName="gx-flex-1" placeholder="Search for process name or party name..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
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
                                    
                                    <Form.Item label="Tags Name" >
                                        {getFieldDecorator('tagsName', {
                                            rules: [{ required: true, message: 'Please enter Tags name!' }],
                                            })(
                                                <Input id="tagsName" value={tagsName} onChange={handleTagsChange}/>
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
    rates: state.rates,
    material: state.material,
    party: state.party,
    process: state.process
});

const addTagsForm = Form.create({
    mapPropsToFields(props) {
        return {
            tags: Form.createFormField({
                ...props.rates?.rates?.partyRates?.nPartyId,
                value: props.rates?.rates?.partyRates?.nPartyId|| undefined,
            })
        };
    }
})(Tags);

export default connect(mapStateToProps, {
    fetchRatesList,
    fetchPartyList,
    fetchMaterialList,
    fetchProcessList,
    addRates,
    fetchRatesListById,
    updateRates,
    resetRates
})(addTagsForm);