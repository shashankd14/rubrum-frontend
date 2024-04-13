import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Select,Checkbox} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchPartyList, addParty, fetchPartyListId, updateParty, resetParty, fetchClassificationList,fetchEndUserTagsList, fetchTemplatesList } from "../../../appRedux/actions";
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
    const [viewParty, setViewParty] = useState(false);
    const [viewPartyDate, setViewPartyData] = useState({});
    const [editWeighbridge, setEditWeighbridge] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [filteredInwardList, setFilteredInwardList] = useState(props.party?.partyList || []);

    const {getFieldDecorator, getFieldValue} = props.form;

    const { party } = props.party;
    const [tagsList, setTagsList] =useState([{tagId: 1}]);

    getFieldDecorator('phoneKeys', {initialValue: [0]});
    getFieldDecorator('addressKeys', {initialValue: [0]});
    getFieldDecorator('emailKeys', {initialValue: [0]});

    const columns = [{
        title: 'Weighbridge Id',
        dataIndex: 'nPartyId',
        key: 'nPartyId',
        filters: [],
        sorter: (a, b) => {
            return a.nPartyId - b.nPartyId
        },
        sortOrder: sortedInfo.columnKey === 'nPartyId' && sortedInfo.order,
    },
    {
        title: 'Weighbridge Name',
        dataIndex: 'partyName',
        key: 'partyName',
        filters: [],
        sorter: (a, b) => a.partyName.length - b.partyName.length,
        sortOrder: sortedInfo.columnKey === 'partyName' && sortedInfo.order,
    },
    {
        title: 'Location Address',
        dataIndex: 'gstNumber',
        key: 'gstNumber',
        filters: [],
        sorter: (a, b) => a.gstNumber.length - b.gstNumber.length,
        sortOrder: sortedInfo.columnKey === 'gstNumber' && sortedInfo.order,
    },
    {
        title: 'City',
        dataIndex: 'address1.city',
        key: 'address1.city',
        sorter: (a, b) => a.address1?.city?.length - b.address1?.city?.length,
        sortOrder: sortedInfo.columnKey === 'address1.city' && sortedInfo.order,
    },
    {
        title: 'State',
        dataIndex: 'address1.state',
        key: 'address1.state',
        sorter: (a, b) => a.address1?.state?.length - b.address1?.state?.length,
        sortOrder: sortedInfo.columnKey === 'address1.state' && sortedInfo.order,
    },
    {
        title: 'Contact Number',
        dataIndex: 'packetClassificationTags',
        render (value) {
            return value?.map(item => item.tagName)
        },
        key: 'tags',
        filters: []
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
                <span className="gx-link"onClick={() => {}}>Delete</span>
            </span>
        ),
    },
    ];

    const onView = (record, e) => {
        e.preventDefault();
         setViewPartyData(record);
        props.fetchPartyListId(record.nPartyId);
        setViewParty(true);
    }
    const onDelete = (record,key, e) => {
        let id = []
        id.push(record.inwardEntryId);
        e.preventDefault();
        props.deleteInwardEntryById(id)
      }

      const onEdit = (record,e)=>{
        e.preventDefault();
        let classificationObj = record.packetClassificationTags.length===0? [{tagId:1}]: record.packetClassificationTags;
        setTagsList(classificationObj?.map(item =>item.tagId) || null)
        props.fetchPartyListId(record.nPartyId);
        setEditWeighbridge(true);
        setTimeout(() => {
            setShowAddWeighbridge(true);
        }, 1000);

    }

    useEffect(() => {
        setTimeout(() => {
            props.fetchPartyList();
            props.fetchClassificationList();
            props.fetchEndUserTagsList();
            props.fetchTemplatesList()
        }, 1000);
    }, [showAddWeighbridge]);

    useEffect(() => {
        const { loading, error, partyList } = props.party;
        if (!loading && !error) {
            setFilteredInwardList(partyList)

        }
    }, [props.party]);

    useEffect(() => {

        const { party } = props;
        if(searchValue) {
            const filteredData = party?.partyList?.filter(party => {
                if(party.nPartyId?.toString() === searchValue ||
                    party.partyName?.toLowerCase().includes(searchValue.toLowerCase()) ||
                    party.gstNumber?.includes(searchValue)) {
                    return party;
                }
            });
            setFilteredInwardList(filteredData);
        } else {
            setFilteredInwardList(party.partyList);
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

    const exportSelectedData = () => {

    }

    const deleteSelectedCoils = () => {
        console.log('dfd');
    };

    const addNewKey = (idx, key) => {
        const {form} = props;
        const value = form.getFieldValue(key);
        const nextValue = value.concat(idx+1);
        form.setFieldsValue({
            [key]: nextValue
        });
    }

    const removeKey = (index, key1, key2) => {
        const {form} = props;
        // can use data-binding to get
        const value1 = form.getFieldValue(key1);
        const value2 = form.getFieldValue(key2);
        // We need at least one passenger
        if (value1.length === 1) {
            return;
        }
        // can use data-binding to set
        form.setFieldsValue({
            [key1]: value1.filter((key, idx) => idx !== index),
            [key2]: value2.filter((key, idx) => idx !== index)
        });
    }
    const handleSelectChange=(e)=>{
        console.log(e)
    }

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
                                    props.resetParty();
                                    props.form.resetFields()
                                    setShowAddWeighbridge(true)
                                }}
                        >Add Weighbridge</Button>
                        <SearchBox styleName="gx-flex-1" placeholder="Search for party id or party name..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                    </div>
                </div>
                <Table rowSelection={[]}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={filteredInwardList}
                    onChange={handleChange}
                />
                <Modal
                    title='Weighbridge Details'
                    visible={viewParty}
                    width={600}
                    onOk={() => setViewParty(false)}
                    onCancel={() => setViewParty(false)}

                >
                    <Card className="gx-card">
                        <Row>
                            <Col span={24}>
                                <Card>
                                    <p><strong>Party Name :</strong> {viewPartyDate?.partyName}</p>
                                    {viewPartyDate?.partyNickname && <p><strong>Party Nickname :</strong> {viewPartyDate?.partyNickname}</p>}
                                    <p><strong>Phone Number :</strong> {viewPartyDate?.phone1}</p>
                                    {viewPartyDate?.phone2 && <p><strong>Alternate phone number 1 :</strong> {viewPartyDate?.phone2}</p>}
                                    {viewPartyDate?.phone3 && <p><strong>Alternate phone number 2:</strong> {viewPartyDate?.phone3}</p>}
                                    <p><strong>E-mail :</strong> {viewPartyDate?.email1}</p>
                                    {viewPartyDate?.email2 && <p><strong>Alternate E-mail 1:</strong> {viewPartyDate?.email2}</p>}
                                    {viewPartyDate?.email3 && <p><strong>Alternate E-mail 2:</strong> {viewPartyDate?.email3}</p>}
                                    {viewPartyDate?.contactName && <p><strong>Contact Name :</strong> {viewPartyDate?.contactName}</p>}
                                    {viewPartyDate?.contactNumber && <p><strong>Contact Number :</strong> {viewPartyDate?.contactNumber}</p>}
                                    {viewPartyDate?.tanNumber && <p><strong>TAN Number :</strong> {viewPartyDate?.tanNumber}</p>}
                                    {viewPartyDate?.panNumber && <p><strong>PAN Number :</strong> {viewPartyDate?.panNumber}</p>}
                                    {viewPartyDate?.gstNumber && <p><strong>GST Number :</strong> {viewPartyDate?.gstNumber}</p>}
                                    {viewPartyDate?.address1 && <>
                                        <p><strong>Address :</strong> {viewPartyDate?.address1?.details}</p>
                                        <p><strong>City :</strong> {viewPartyDate?.address1?.city}</p>
                                        <p><strong>State :</strong> {viewPartyDate?.address1?.state}</p>
                                        <p><strong>Pincode :</strong> {viewPartyDate?.address1?.pincode}</p>
                                    </>}
                                   
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
                                if (!err) {
                                 const data = {
                                    values: {
                                      ...values,
                                    },
                                    id: props.party?.party?.nPartyId
                                  }
                                  props.updateParty(data);
                                  props.form.resetFields();
                                  setShowAddWeighbridge(false);
                                  setEditWeighbridge(false);
                                }
                            });
                        } else {
                            props.form.validateFields((err, values) => {
                                if (!err) {
                                 e.preventDefault();
                                  // props.addParty(values);
                                 props.addParty({
                                    ...values,
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
                                        {getFieldDecorator('partyName', {
                                            rules: [{ required: true, message: 'Please input Weighbridge name!' }],
                                        })(
                                            <Input id="partyName" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Weighbridge Address">
                                        {getFieldDecorator('partyNickname', {
                                            rules: [{ required: false, message: 'Please input Address!' }],
                                        })(
                                            <Input id="partyNickname" />
                                        )}
                                    </Form.Item>

                                    <Form.Item label="City">
                                        {getFieldDecorator('contactName', {
                                            rules: [{ required: false, message: 'Please input City!' }],
                                        })(
                                            <Input id="contactName" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="State">
                                        {getFieldDecorator('qualityTemplates', {
                                            //rules: [{ required: true, message: 'Please enter Quality Templates!' }],
                                        })(
                                            <Select
                                             id="qualityTemplates"
                                             showSearch
                                             style={{ width: '100%' }}
                                             filterOption={(input, option) => {
                                                return option?.props?.children?.toLowerCase().includes(input.toLowerCase());
                                            }}
                                            filterSort={(optionA, optionB) =>
                                                optionA?.props?.children.toLowerCase().localeCompare(optionB?.props?.children.toLowerCase())
                                            }
                                             onChange={handleSelectChange}
                                             >{props?.quality?.data?.map(item => {
                                                return <Option value={item?.templateId}>{item.templateName}</Option>
                                            })}</Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Contact Number">
                                        {getFieldDecorator('panNumber', {
                                            rules: [{ required: false, message: 'Please input the contact Number!' }],
                                        })(
                                            <Input id="panNumber" />
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
    party: state.party,
    packetClassification: state.packetClassification,
    quality: state.quality,
    partyId: state.party.party
});

const addWeighbridgeForm = Form.create({
    mapPropsToFields(props) {
        const { party } = props.party;
        const phone = party?.phone3 ? [party?.phone1,party?.phone2,party?.phone3] : (party?.phone2 ? [party?.phone1,party?.phone2] : [party?.phone1]);
        const email = party?.email3 ? [party?.email1,party?.email2,party?.email3] : (party?.email2 ? [party?.email1,party?.email2] : [party?.email1]);
        const address = party?.address2?.details ? [party?.address1?.details, party?.address2?.details] : [party?.address1?.details];
        const city = party?.address2?.city ? [party?.address1?.city, party?.address2?.city] : [party?.address1?.city];
        const state = party?.address2?.state ? [party?.address1?.state, party?.address2?.state] : [party?.address1?.state];
        const pincode = party?.address2?.pincode ? [party?.address1?.pincode, party?.address2?.pincode] : [party?.address1?.pincode];
        // const tags = props?.party?.party?.tags.map(item=> item.classificationName)
       // const checkboxValuesDR = party?.dailyReportsList || [];
       const checkboxValuesDR = (party?.dailyReportsList || '').split(',').map(value => value.trim());
        const checkboxValuesMR = party?.monthlyReportsList || [];
        // console.log('Received dailyReportsList:', party?.dailyReportsList);
        // console.log('Parsed dailyReportsList:', checkboxValuesDR);
        return {
            partyName:Form.createFormField ({
                ...props.party?.party?.partyName,
                value: props.party?.party?.partyName|| '',
            }),
            partyNickname: Form.createFormField({
                ...props.party?.party?.partyNickname,
                value: props.party?.party?.partyNickname || '',
            }),
            phone: Form.createFormField({
                value: phone
            }),
            phoneKeys: Form.createFormField({
                value: phone,
            }),
            contactName: Form.createFormField({
                ...props.party?.party?.contactName,
                value: props.party?.party?.contactName || '',
            }),
            contactNumber: Form.createFormField({
                ...props.party?.party?.contactNumber,
                value: props.party?.party?.contactNumber || '',
            }),
            address: Form.createFormField({
                value: address
            }),
            addressKeys: Form.createFormField({
                value: address
            }),
            city: Form.createFormField({
                value: city
            }),
            state: Form.createFormField({
                value: state
            }),
            pincode: Form.createFormField({
                value: pincode
            }),
          
            tags: Form.createFormField({
                ...props.party?.party?.tags,
                value: party?.tags?.map(item=> item.tagId) || [],
            }),
            
        };
    }
})(Weighbridge);

export default connect(mapStateToProps, {
    fetchPartyList,
    addParty,
    fetchPartyListId,
    updateParty,
    resetParty,
    fetchClassificationList,
    fetchEndUserTagsList,
    fetchTemplatesList
})(addWeighbridgeForm);
