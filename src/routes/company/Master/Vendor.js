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

const Vendor = (props) => {

    const Option = Select.Option;
    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [showAddVendor, setShowAddVendor] = useState(false);
    const [viewVendor, setViewVendor] = useState(false);
    const [viewVendorDate, setViewVendorData] = useState({});
    const [editVendor, setEditVendor] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [filteredInwardList, setFilteredInwardList] = useState(props.party?.partyList || []);
    const [showAmtDcPdfFlg, setShowAmtDcPdfFlg] = useState(props.party?.showAmtDcPdfFlg==='Y'); // Default value
    const [dailyReportsList, setDailyReportsList] = useState([]);
    const [monthlyReportsList, setMonthlyReportsList] = useState([]); 

    const {getFieldDecorator, getFieldValue} = props.form;

    const { party } = props.party;
    const [tagsList, setTagsList] =useState([{tagId: 1}]);

    getFieldDecorator('phoneKeys', {initialValue: [0]});
    getFieldDecorator('addressKeys', {initialValue: [0]});
    getFieldDecorator('emailKeys', {initialValue: [0]});

    const phoneKeys = getFieldValue('phoneKeys');
    const addressKeys = getFieldValue('addressKeys');
    const emailKeys = getFieldValue('emailKeys');


    const columns = [{
        title: 'Vendor Id',
        dataIndex: 'nPartyId',
        key: 'nPartyId',
        filters: [],
        sorter: (a, b) => {
            return a.nPartyId - b.nPartyId
        },
        sortOrder: sortedInfo.columnKey === 'nPartyId' && sortedInfo.order,
    },
    {
        title: 'Vendor Name',
        dataIndex: 'partyName',
        key: 'partyName',
        filters: [],
        sorter: (a, b) => a.partyName.length - b.partyName.length,
        sortOrder: sortedInfo.columnKey === 'partyName' && sortedInfo.order,
    },
    {
        title: 'Contact Info',
        dataIndex: 'address1.city',
        key: 'address1.city',
        sorter: (a, b) => a.address1?.city?.length - b.address1?.city?.length,
        sortOrder: sortedInfo.columnKey === 'address1.city' && sortedInfo.order,
    },
    {
        title: 'GST Number',
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
        title: 'Material Tags',
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
         setViewVendorData(record);
        props.fetchPartyListId(record.nPartyId);
        setViewVendor(true);
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
        setEditVendor(true);
        setTimeout(() => {
            setShowAddVendor(true);
        }, 1000);

    }

    useEffect(() => {
        setTimeout(() => {
            props.fetchPartyList();
            props.fetchClassificationList();
            props.fetchEndUserTagsList();
            props.fetchTemplatesList()
        }, 1000);
    }, [showAddVendor]);

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

    useEffect(() => {
        // to show checked in checkbox
        const {party} = props.party
        setDailyReportsList(party.dailyReportsList || []);
        setMonthlyReportsList(party.monthlyReportsList || []);
      }, [party]);
      const { dailyReportsList: initialDailyReportsList, monthlyReportsList: initialMonthlyReportsList, ...otherProps } = props.party.party;

    return (
        <div>
            <h1><IntlMessages id="sidebar.company.vendorList"/></h1>
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
                                    setShowAddVendor(true)
                                }}
                        >Add Vendor</Button>
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
                    title='Vendor Details'
                    visible={viewVendor}
                    width={600}
                    onOk={() => setViewVendor(false)}
                    onCancel={() => setViewVendor(false)}

                >
                    <Card className="gx-card">
                        <Row>
                            <Col span={24}>
                                <Card>
                                    <p><strong>Vendor Name :</strong> {viewVendorDate?.partyName}</p>
                                    {viewVendorDate?.partyNickname && <p><strong>Vendor Nickname :</strong> {viewVendorDate?.partyNickname}</p>}
                                    <p><strong>Phone Number :</strong> {viewVendorDate?.phone1}</p>
                                    {viewVendorDate?.phone2 && <p><strong>Alternate phone number 1 :</strong> {viewVendorDate?.phone2}</p>}
                                    {viewVendorDate?.phone3 && <p><strong>Alternate phone number 2:</strong> {viewVendorDate?.phone3}</p>}
                                    <p><strong>E-mail :</strong> {viewVendorDate?.email1}</p>
                                    {viewVendorDate?.email2 && <p><strong>Alternate E-mail 1:</strong> {viewVendorDate?.email2}</p>}
                                    {viewVendorDate?.email3 && <p><strong>Alternate E-mail 2:</strong> {viewVendorDate?.email3}</p>}
                                    {viewVendorDate?.contactName && <p><strong>Contact Name :</strong> {viewVendorDate?.contactName}</p>}
                                    {viewVendorDate?.contactNumber && <p><strong>Contact Number :</strong> {viewVendorDate?.contactNumber}</p>}
                                    {viewVendorDate?.tanNumber && <p><strong>TAN Number :</strong> {viewVendorDate?.tanNumber}</p>}
                                    {viewVendorDate?.panNumber && <p><strong>PAN Number :</strong> {viewVendorDate?.panNumber}</p>}
                                    {viewVendorDate?.gstNumber && <p><strong>GST Number :</strong> {viewVendorDate?.gstNumber}</p>}
                                    {viewVendorDate?.address1 && <>
                                        <p><strong>Address :</strong> {viewVendorDate?.address1?.details}</p>
                                        <p><strong>City :</strong> {viewVendorDate?.address1?.city}</p>
                                        <p><strong>State :</strong> {viewVendorDate?.address1?.state}</p>
                                        <p><strong>Pincode :</strong> {viewVendorDate?.address1?.pincode}</p>
                                    </>}
                                    {viewVendorDate?.packetClassificationTags && <p><strong>Tags:</strong>{viewVendorDate?.packetClassificationTags?.map(item=> item.tagName)}</p>}
                                    {viewVendorDate?.endUserTags && <p><strong>EndUser Tags:</strong>{viewVendorDate?.endUserTags?.map(item=> item.tagName)}</p>}
                                    {props.partyId.dailyReportsList && <p><strong>Daily Reports List :</strong> {props.partyId?.dailyReportsList}</p>}
                                    {props.partyId?.monthlyReportsList && <p><strong>Monthly Reports List :</strong> {props.partyId?.monthlyReportsList}</p>}
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Modal>
                <Modal
                    title={editVendor?'Edit Vendor':'Add Vendor'}
                    visible={showAddVendor}
                    onOk={(e) => {
                        if (editVendor) {
        
                            // Set the initial state with the values from the API
                            setDailyReportsList(initialDailyReportsList ? initialDailyReportsList.split(',') : []);
                            setMonthlyReportsList(initialMonthlyReportsList ? initialMonthlyReportsList.split(',') : []);
                            e.preventDefault();
                            props.form.validateFields((err, values) => {
                                if (!err) {
                                 const data = {
                                    values: {
                                      ...values,
                                      showAmtDcPdfFlg: showAmtDcPdfFlg ? 'Y' : 'N',
                                      dailyReportsList: dailyReportsList.join(','),
                                      monthlyReportsList: monthlyReportsList.join(','),
                                    },
                                    id: props.party?.party?.nPartyId
                                  }
                                  props.updateParty(data);
                                  props.form.resetFields();
                                  setShowAddVendor(false);
                                  setEditVendor(false);
                                }
                            });
                        } else {
                            props.form.validateFields((err, values) => {
                                if (!err) {
                                 e.preventDefault();
                                  // props.addParty(values);
                                 props.addParty({
                                    ...values,
                                    showAmtDcPdfFlg: showAmtDcPdfFlg ? 'Y' : 'N',
                                    dailyReportsList: dailyReportsList.join(','),
                                    monthlyReportsList: monthlyReportsList.join(','),
                                  });
                                  props.form.resetFields();
                                  setShowAddVendor(false);
                                }
                            });
                        }
                    }}
                    width={800}
                    onCancel={() => {
                        props.form.resetFields();
                        setShowAddVendor(false);
                        setEditVendor(false)
                    }}
                >
                    <Card className="gx-card">
                        <Row>
                            <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                                <Form {...formItemLayout} className="gx-pt-4">
                                    <Form.Item label="Vendor/Supplier">
                                        {getFieldDecorator('partyName', {
                                            rules: [{ required: true, message: 'Please input Vendor name!' }],
                                        })(
                                            <Input id="partyName" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Vendor/Supplier Nick Name">
                                        {getFieldDecorator('partyNickname', {
                                            rules: [{ required: false, message: 'Please input Vendor nick name!' }],
                                        })(
                                            <Input id="partyNickname" />
                                        )}
                                    </Form.Item>
                                    {phoneKeys.map((k, index) => {
                                    const req = index ? false : true;
                                    const phone = party?.phone3 ? [party?.phone1,party?.phone2,party?.phone3] : (party?.phone2 ? [party?.phone1,party?.phone2] : [party?.phone1]);
                                    return (
                                        <Form.Item  {...formItemLayout} className='phone'
                                            label={index ? `Alternate Phone Number ${index}` : 'Phone Number'}
                                        >
                                            {getFieldDecorator(`phone[${index}]`, {
                                                initialValue: phone[index],
                                                rules: [{required: req, message: `Please input your ${index ? `Alternate Phone Number ${index}!` : 'Phone Number!'}`}],
                                            })(
                                            <Input id="phone1" addonBefore={'+91'} style={{width: '100%'}}/>
                                            )}
                                            {phoneKeys.length-1 > 0 && <i className="icon icon-trash gx-margin" onClick={() => removeKey(index, 'phoneKeys', 'phone')}/> }
                                            {index == phoneKeys.length-1 && phoneKeys.length <=2 && <i className="icon icon-add-circle" onClick={() => addNewKey(index, 'phoneKeys')}/> }
                                        </Form.Item>
                                    )})}

                                    <Form.Item label="Contact Name">
                                        {getFieldDecorator('contactName', {
                                            rules: [{ required: false, message: 'Please input Contact name!' }],
                                        })(
                                            <Input id="contactName" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Contact Number">
                                        {getFieldDecorator('contactNumber', {
                                            rules: [{ required: false, message: 'Please input Contact number!' }],
                                        })(
                                            <Input id="contactNumber" />
                                        )}
                                    </Form.Item>
                                    {/* <Form.Item label="Address">
                                        {getFieldDecorator('address', {
                                            rules: [{ required: false, message: 'Please input address!' }],
                                        })(
                                            <Input id="address" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="City">
                                        {getFieldDecorator('city', {
                                            rules: [{ required: false, message: 'Please input city!' }],
                                        })(
                                            <Input id="city" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="State">
                                        {getFieldDecorator('state', {
                                            rules: [{ required: false, message: 'Please input state!' }],
                                        })(
                                            <Input id="state" />
                                        )}
                                    </Form.Item> */}

                                     {addressKeys.map((k, index) => {
                                    const req = index ? false : true;
                                    const address = party?.address2?.details ? [party?.address1?.details, party?.address2?.details] : [party?.address1?.details];
                                    const city = party?.address2?.city ? [party?.address1?.city, party?.address2?.city] : [party?.address1?.city];
                                    const state = party?.address2?.state ? [party?.address1?.state, party?.address2?.state] : [party?.address1?.state];
                                    const pincode = party?.address2?.pincode ? [party?.address1?.pincode, party?.address2?.pincode] : [party?.address1?.pincode];
                                    return (
                                        <div>
                                        <Form.Item  {...formItemLayout} className='address'
                                            label={index ? `Alternate address ${index}` : 'Address'}
                                        >
                                            {getFieldDecorator(`address[${index}]`, {
                                                initialValue: address[index],
                                                rules: [{required: req, message: `Please input the ${index ? `Alternative address ${index}!` : 'Address!'}`}],
                                            })(
                                                <Input id="address" />
                                            )}
                                        </Form.Item>
                                        <Form.Item {...formItemLayout} className='address'
                                            label='City'
                                        >
                                        {getFieldDecorator(`city[${index}]`, {
                                                initialValue: city[index],
                                                rules: [{ required: req, message: 'Please input the City!' }],
                                            })(
                                                <Input id="city" />
                                            )}

                                        </Form.Item>

                                        <Form.Item {...formItemLayout} className='address'
                                            label='State'
                                        >
                                        {getFieldDecorator(`state[${index}]`, {
                                                initialValue: state[index],
                                                rules: [{ required: req, message: 'Please input the State!' }],
                                            })(
                                                <Input id="state" />
                                            )}
                                        </Form.Item>
                                        <Form.Item {...formItemLayout} className='address'
                                            label='Pincode'
                                        >
                                        {getFieldDecorator(`pincode[${index}]`, {
                                                initialValue: pincode[index],
                                                rules: [{ required: req, message: 'Please input the pincode!' }],
                                            })(
                                                <Input id="pincode" />
                                            )}
                                        </Form.Item>
                                        <div className='add-address'>
                                            {addressKeys.length-1 > 0 && <i className="icon icon-trash gx-margin" onClick={() => removeKey(index, 'addressKeys', 'address')}/> }
                                            {index == addressKeys.length-1 && addressKeys.length <=1 && <i className="icon icon-add-circle" onClick={() => addNewKey(index, 'addressKeys')}> Add Alternate address</i> }
                                        </div>
                                        </div>
                                    )})} 

                                    {emailKeys.map((k, index) => {
                                    const req = index ? false : true;
                                    const email = party?.email3 ? [party?.email1,party?.email2,party?.email3] : (party?.email2 ? [party?.email1,party?.email2] : [party?.email1]);
                                    return (
                                        <Form.Item  {...formItemLayout} className='email'
                                            label={index ? `Alternate E-mail ${index}` : 'E-mail'}
                                        >
                                            {getFieldDecorator(`email[${index}]`, {
                                                initialValue: email[index],
                                                rules: [{required: req, message: `Please input your ${index ? `Alternate e-mail address ${index}!` : 'e-mail address!'}`}],
                                            })(
                                                <Input id="email" />
                                            )}
                                            {emailKeys.length-1 > 0 && <i className="icon icon-trash gx-margin" onClick={() => removeKey(index, 'emailKeys', 'email')}/> }
                                            {index == emailKeys.length-1 && emailKeys.length <=2 && <i className="icon icon-add-circle" onClick={() => addNewKey(index, 'emailKeys')}/> }
                                        </Form.Item>
                                    )})}

                                    <Form.Item label="PAN Number">
                                        {getFieldDecorator('panNumber', {
                                            // rules: [{ required: false, message: 'Please input the PAN Number!' }],
                                        })(
                                            <Input id="panNumber" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="TAN Number">
                                        {getFieldDecorator('tanNumber', {
                                            // rules: [{ required: false, message: 'Please input the TAN Number!' }],
                                        })(
                                            <Input id="tanNumber" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="GST Number">
                                        {getFieldDecorator('gstNumber', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="gstNumber" />
                                        )}
                                    </Form.Item>
                                    
                                    {/* <Form.Item label="End User Tags">
                                        {getFieldDecorator('endUsertags', {
                                            rules: [{ required: true, message: 'Please enter End UserTags!' }],
                                        })(
                                            <Select
                                             id="endUsertags"
                                             showSearch
                                             mode="multiple"
                                             style={{ width: '100%' }}
                                             filterOption={(input, option) => {
                                                return option?.props?.children?.toLowerCase().includes(input.toLowerCase());
                                            }}
                                            filterSort={(optionA, optionB) =>
                                                optionA?.props?.children.toLowerCase().localeCompare(optionB?.props?.children.toLowerCase())
                                            }
                                             onChange={handleSelectChange}
                                             >{props?.packetClassification?.endUserTags?.map(item => {
                                                return <Option value={item?.tagId}>{item.tagName}</Option>
                                            })}</Select>
                                        )}
                                    </Form.Item> */}
                                    
                                    <Form.Item label = "Purchase Reports">
                                        <Checkbox.Group
                                            id="purchaseReports"
                                            value={dailyReportsList}
                                            onChange={(checkedValues) => {setDailyReportsList(checkedValues)}}
                                        >
                                            <Checkbox value="Daily">Daily</Checkbox>
                                            <Checkbox value="Monthly">Monthly</Checkbox>
                                        </Checkbox.Group>
                                    </Form.Item>
                                    {/* <Form.Item label = "Monthly Reports">
                                        <Checkbox.Group id="monthlyReportsList"
                                            value={monthlyReportsList}
                                            onChange={(checkedValues) => {setMonthlyReportsList(checkedValues)}}>
                                            <Checkbox value="INWARDREPORT">INWARDREPORT</Checkbox>
                                            <Checkbox value="STOCKREPORT">STOCKREPORT</Checkbox>
                                            <Checkbox value="OUTWARDREPORT">OUTWARDREPORT</Checkbox>
                                            <Checkbox value="PROCESSINGREPORT ">PROCESSINGREPORT </Checkbox>
                                        </Checkbox.Group>
                                    </Form.Item> */}
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

const addVendorForm = Form.create({
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
            email: Form.createFormField({
                value: email
            }),
            emailKeys: Form.createFormField({
                value: email
            }),
            panNumber: Form.createFormField({
                ...party?.panNumber,
                value: party?.panNumber || '',
            }),
            tanNumber: Form.createFormField({
                ...party?.tanNumber,
                value: party?.tanNumber || '',
            }),
            gstNumber: Form.createFormField({
                ...party?.gstNumber,
                value: party?.gstNumber || '',
            }),
            tags: Form.createFormField({
                ...props.party?.party?.tags,
                value: party?.tags?.map(item=> item.tagId) || [],
            }),
            endUsertags: Form.createFormField({
                ...props.party?.party?.endUserTags,
                value: party?.endUserTags?.map(item=> item.tagId) || [],
            }),
            qualityTemplates: Form.createFormField({
                ...props.party?.party?.templateIdList,
                value: party?.templateIdList?.map(item=> item.templateId) || [],
            }),
            showAmtDcPdfFlg: Form.createFormField({
                ...party?.showAmtDcPdfFlg,
                value: party?.showAmtDcPdfFlg || 'N',
            }),
            dailyReportsList: Form.createFormField({
                ...party?.dailyReportsList,
               //value: Array.isArray(checkboxValuesDR) ? checkboxValuesDR : [],
               value:checkboxValuesDR
            }),
            monthlyReportsList: Form.createFormField({
                ...party?.monthlyReportsList,
               value: Array.isArray(checkboxValuesMR) ? checkboxValuesMR : [],
            }),
        };
    }
})(Vendor);

export default connect(mapStateToProps, {
    fetchPartyList,
    addParty,
    fetchPartyListId,
    updateParty,
    resetParty,
    fetchClassificationList,
    fetchEndUserTagsList,
    fetchTemplatesList
})(addVendorForm);