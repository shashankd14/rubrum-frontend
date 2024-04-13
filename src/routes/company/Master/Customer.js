import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Select,Checkbox} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchCustomerList, deleteCustomer, fetchPartyList, addCustomer, fetchCustomerListId, updateParty, resetParty, fetchClassificationList,fetchEndUserTagsList, fetchTemplatesList } from "../../../appRedux/actions";
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

const Customer = (props) => {

    const Option = Select.Option;
    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [viewCustomer, setViewCustomer] = useState(false);
    const [viewCustomerData, setViewCustomerData] = useState({});
    const [editCustomer, setEditCustomer] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [filteredInwardList, setFilteredInwardList] = useState(props.party?.partyList || []);
    const [filteredCustomerList, setFilteredCustomerList] = useState(props.customer?.customerList || []);
    const [showAmtDcPdfFlg, setShowAmtDcPdfFlg] = useState(props.party?.showAmtDcPdfFlg==='Y'); // Default value
    const [purchaseReportsList, setPurchaseReportsList] = useState([]);
    const [monthlyReportsList, setMonthlyReportsList] = useState([]); 
console.log("viewCustomerData", viewCustomerData)
    const {getFieldDecorator, getFieldValue} = props.form;

    const { customer } = props.customer;
    const [tagsList, setTagsList] =useState([{tagId: 1}]);

    getFieldDecorator('phoneKeys', {initialValue: [0]});
    getFieldDecorator('addressKeys', {initialValue: [0]});
    getFieldDecorator('emailKeys', {initialValue: [0]});

    const phoneKeys = getFieldValue('phoneKeys');
    const addressKeys = getFieldValue('addressKeys');
    const emailKeys = getFieldValue('emailKeys');

    const columns = [{
        title: 'Customer Id',
        dataIndex: 'customerId',
        key: 'customerId',
        filters: [],
        sorter: (a, b) => {
            return a.customerId - b.customerId
        },
        sortOrder: sortedInfo.columnKey === 'customerId' && sortedInfo.order,
    },
    {
        title: 'Customer Name',
        dataIndex: 'customerName',
        key: 'customerName',
        filters: [],
        sorter: (a, b) => a.customerName.length - b.customerName.length,
        sortOrder: sortedInfo.columnKey === 'customerName' && sortedInfo.order,
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
        dataIndex: 'city',
        key: 'city',
        sorter: (a, b) => a.city?.length - b.city?.length,
        sortOrder: sortedInfo.columnKey === 'city' && sortedInfo.order,
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
        sorter: (a, b) => a.address1?.state?.length - b.address1?.state?.length,
        sortOrder: sortedInfo.columnKey === 'state' && sortedInfo.order,
    },
    // {
    //     title: 'Process Tags',
    //     dataIndex: 'packetClassificationTags',
    //     render (value) {
    //         return value?.map(item => item.tagName)
    //     },
    //     key: 'tags',
    //     filters: []
    // },
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
         setViewCustomerData(record);
        props.fetchCustomerListId({
            id: record.customerId,
            searchText: '',
            pageNo: 1,
            pageSize: 15,
            ipAddress: "1.1.1.1",
            requestId: "CUSTOMER_GET",
            userId: ''
        });
        setViewCustomer(true);
    }
    const onDelete = (record,key, e) => {
        props.deleteCustomer({
            id: record.customerId,
            ipAddress: "1.1.1.1",
            requestId: "CUSTOMER_GET",
            userId: ''
        })

      }

      const onEdit = (record,e)=>{
        e.preventDefault();
        let classificationObj = record.packetClassificationTags.length===0? [{tagId:1}]: record.packetClassificationTags;
        setTagsList(classificationObj?.map(item =>item.tagId) || null)
        props.fetchCustomerListId(record.nPartyId);
        setEditCustomer(true);
        setTimeout(() => {
            setShowAddCustomer(true);
        }, 1000);

    }

    useEffect(() => {
        debugger
        setTimeout(() => {
            props.fetchCustomerList({
                pageNo: 1,
                pageSize: 11,
                ipAddress: "1.1.1.1",
                requestId: "CUSTOMER_GET",
                userId: ''
            });
            props.fetchPartyList();
            props.fetchClassificationList();
            props.fetchEndUserTagsList();
            props.fetchTemplatesList()
        }, 1000);
    }, []);

    useEffect(() => {
        const { loading, error, customerList } = props.customer;
        if (!loading && !error) {
            setFilteredCustomerList(customerList.content);

        }
    }, [props.customer]);

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
        const value = form.getFieldValue(key)
;
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

    // useEffect(() => {
    //     // to show checked in checkbox
    //     const {customer} = props.customer
    //     setDailyReportsList(customer.dailyReportsList || []);
    //     setMonthlyReportsList(customer.monthlyReportsList || []);
    //   }, [customer]);
    //   const { dailyReportsList: initialDailyReportsList, monthlyReportsList: initialMonthlyReportsList, ...otherProps } = props.customer.customer;

   return (
        <div>
            <h1><IntlMessages id="sidebar.company.customerList"/></h1>
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
                                    setShowAddCustomer(true)
                                }}
                        >Add Customer</Button>
                        <SearchBox styleName="gx-flex-1" placeholder="Search for party id or party name..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                    </div>
                </div>
                <Table rowSelection={[]}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={filteredCustomerList}
                    onChange={handleChange}
                />
                <Modal
                    title='Customer Details'
                    visible={viewCustomer}
                    width={600}
                    onOk={() => setViewCustomer(false)}
                    onCancel={() => setViewCustomer(false)}

                >
                    <Card className="gx-card">
                        <Row>
                            <Col span={24}>
                                <Card>
                                    <p><strong>Party Name :</strong> {viewCustomerData?.customerName}</p>
                                    {viewCustomerData?.customerNickName && <p><strong>Party Nickname :</strong> {viewCustomerData?.customerNickName}</p>}
                                    <p><strong>Phone Number :</strong> {viewCustomerData?.phoneNo}</p>
                                    <p><strong>E-mail :</strong> {viewCustomerData?.emailId}</p>
                                    {viewCustomerData?.contactName && <p><strong>Contact Name :</strong> {viewCustomerData?.contactName}</p>}
                                    {viewCustomerData?.contactNo && <p><strong>Contact Number :</strong> {viewCustomerData?.contactNo}</p>}
                                    {viewCustomerData?.tanNumber && <p><strong>TAN Number :</strong> {viewCustomerData?.tanNumber}</p>}
                                    {viewCustomerData?.panNumber && <p><strong>PAN Number :</strong> {viewCustomerData?.panNumber}</p>}
                                    {viewCustomerData?.gstNumber && <p><strong>GST Number :</strong> {viewCustomerData?.gstNumber}</p>}
                                    {viewCustomerData?.address1 && <>
                                        <p><strong>Address :</strong> {viewCustomerData?.alternateAddress1}</p>
                                        <p><strong>City :</strong> {viewCustomerData?.city}</p>
                                        <p><strong>State :</strong> {viewCustomerData?.state}</p>
                                        <p><strong>Pincode :</strong> {viewCustomerData?.pincode}</p>
                                    </>}
                                    {/* {viewCustomerData?.processTags && <p><strong>Tags:</strong>{viewCustomerData?.processTags?.map(item=> item.tagName)}</p>} */}
                                    {viewCustomerData?.processTags && <p><strong>Tags:</strong>{viewCustomerData?.processTags}</p>}
                                    {/* {props.customerId.dailyReportsList && <p><strong>Daily Reports List :</strong> {props.customerId?.dailyReportsList}</p>}
                                    {props.customerId?.monthlyReportsList && <p><strong>Monthly Reports List :</strong> {props.customerId?.monthlyReportsList}</p>} */}
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Modal>
                <Modal
                    title={editCustomer?'Edit Customer':'Add Customer'}
                    visible={showAddCustomer}
                    onOk={(e) => {
                        if (editCustomer) {
        
                            // Set the initial state with the values from the API
                            // setDailyReportsList(initialDailyReportsList ? initialDailyReportsList.split(',') : []);
                            // setMonthlyReportsList(initialMonthlyReportsList ? initialMonthlyReportsList.split(',') : []);
                            e.preventDefault();
                            props.form.validateFields((err, values) => {
                                if (!err) {
                                 const data = {
                                    values: {
                                      ...values,
                                    //   dailyReportsList: dailyReportsList.join(','),
                                    //   monthlyReportsList: monthlyReportsList.join(','),
                                    },
                                    id: props.customer?.party?.nPartyId
                                  }
                                  props.updateParty(data);
                                  props.form.resetFields();
                                  setShowAddCustomer(false);
                                  setEditCustomer(false);
                                }
                            });
                        } else {
                            props.form.validateFields((err, values) => {
                                debugger
                                if (!err) {
                                 e.preventDefault();
                                  // props.addCustomer(values);
                                 props.addCustomer({
                                    ...values,
                                    ipAddress: "1.1.1.1",
                                    requestId:"CUSTOMER_INSERT",
                                    userId: "",
                                    purchaseReportsList: purchaseReportsList.join(','),
                                  });
                                  props.form.resetFields();
                                  setShowAddCustomer(false);
                                }
                            });
                        }
                    }}
                    width={800}
                    onCancel={() => {
                        props.form.resetFields();
                        setShowAddCustomer(false);
                        setEditCustomer(false)
                    }}
                >
                    <Card className="gx-card">
                        <Row>
                            <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                                <Form {...formItemLayout} className="gx-pt-4">
                                    <Form.Item label="Party/Customer Name">
                                        {getFieldDecorator('partyName', {
                                            rules: [{ required: true, message: 'Please input Party name!' }],
                                        })(
                                            <Input id="partyName" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Party/Customer Nick Name">
                                        {getFieldDecorator('partyNickname', {
                                            rules: [{ required: false, message: 'Please input Party name!' }],
                                        })(
                                            <Input id="partyNickname" />
                                        )}
                                    </Form.Item>
                                    {phoneKeys.map((k, index) => {
                                    const req = index ? false : true;
                                    const phone = customer?.phone3 ? [customer?.phone1,customer?.phone2,customer?.phone3] : (customer?.phone2 ? [customer?.phone1,customer?.phone2] : [customer?.phone1]);
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
                                            // rules: [{ required: false, message: 'Please input Contact name!' }],
                                        })(
                                            <Input id="contactName" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Contact Number">
                                        {getFieldDecorator('contactNumber', {
                                            // rules: [{ required: false, message: 'Please input Contact number!' }],
                                        })(
                                            <Input id="contactNumber" />
                                        )}
                                    </Form.Item>

                                    {addressKeys.map((k, index) => {
                                    const req = index ? false : true;
                                    const address = customer?.address2?.details ? [customer?.address1?.details, customer?.address2?.details] : [customer?.address1?.details];
                                    const city = customer?.address2?.city ? [customer?.address1?.city, customer?.address2?.city] : [customer?.address1?.city];
                                    const state = customer?.address2?.state ? [customer?.address1?.state, customer?.address2?.state] : [customer?.address1?.state];
                                    const pincode = customer?.address2?.pincode ? [customer?.address1?.pincode, customer?.address2?.pincode] : [customer?.address1?.pincode];
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
                                    const email = customer?.email3 ? [customer?.email1,customer?.email2,customer?.email3] : (customer?.email2 ? [customer?.email1,customer?.email2] : [customer?.email1]);
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
                                   {/* <Form.Item label="Process Tags">
                                        {getFieldDecorator('tags', {
                                            rules: [{ required: true, message: 'Please enter Tags!' }],
                                        })(
                                            <Select
                                             id="tags"
                                             showSearch
                                             mode="multiple"
                                             style={{ width: '100%' }}
                                             onChange={handleSelectChange}
                                             filterOption={(input, option) => {
                                                return option?.props?.children?.toLowerCase().includes(input.toLowerCase());
                                            }}
                                            filterSort={(optionA, optionB) =>
                                                optionA?.props?.children.toLowerCase().localeCompare(optionB?.props?.children.toLowerCase())
                                            }
                                             >{props?.packetClassification?.processTags?.map(item => {
                                                return <Option value={item?.tagId}>{item?.tagName}</Option>
                                            })}</Select>
                                        )}
                                    </Form.Item> */}
                                     <Form.Item label = "Purchase Reports">
                                        <Checkbox.Group
                                            id="purchaseReports"
                                            value={purchaseReportsList}
                                            onChange={(checkedValues) => {setPurchaseReportsList(checkedValues)}}
                                        >
                                            <Checkbox value="Daily">Daily</Checkbox>
                                            <Checkbox value="Monthly">Monthly</Checkbox>
                                        </Checkbox.Group>
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
    customer: state.customer,
    party: state.party,
    packetClassification: state.packetClassification,
    quality: state.quality,
    partyId: state.party.party
});

const addCustomerForm = Form.create({
    mapPropsToFields(props) {
        const { customer } = props.customer;
        const phone = customer?.phone3 ? [customer?.phone1,customer?.phone2,customer?.phone3] : (customer?.phone2 ? [customer?.phone1,customer?.phone2] : [customer?.phone1]);
        const email = customer?.email3 ? [customer?.email1,customer?.email2,customer?.email3] : (customer?.email2 ? [customer?.email1,customer?.email2] : [customer?.email1]);
        const address = customer?.address2?.details ? [customer?.address1?.details, customer?.address2?.details] : [customer?.address1?.details];
        const city = customer?.address2?.city ? [customer?.address1?.city, customer?.address2?.city] : [customer?.address1?.city];
        const state = customer?.address2?.state ? [customer?.address1?.state, customer?.address2?.state] : [customer?.address1?.state];
        const pincode = customer?.address2?.pincode ? [customer?.address1?.pincode, customer?.address2?.pincode] : [customer?.address1?.pincode];
        const checkboxValues = (customer?.dailyReportsList || '').split(',').map(value => value.trim());
        return {
            customerName:Form.createFormField ({
                ...props.customer?.customer?.customerName,
                value: props.customer?.customer?.customerName|| '',
            }),
            customerNickname: Form.createFormField({
                ...props.customer?.customer?.customerNickname,
                value: props.customer?.customer?.customerNickname || '',
            }),
            phone: Form.createFormField({
                value: phone
            }),
            phoneKeys: Form.createFormField({
                value: phone,
            }),
            contactName: Form.createFormField({
                ...props.customer?.customer?.contactName,
                value: props.customer?.customer?.contactName || '',
            }),
            contactNumber: Form.createFormField({
                ...props.party?.customer?.contactNumber,
                value: props.party?.customer?.contactNumber || '',
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
                ...customer?.panNumber,
                value: customer?.panNumber || '',
            }),
            tanNumber: Form.createFormField({
                ...customer?.tanNumber,
                value: customer?.tanNumber || '',
            }),
            gstNumber: Form.createFormField({
                ...customer?.gstNumber,
                value: customer?.gstNumber || '',
            }),
            tags: Form.createFormField({
                ...props.customer?.customer?.tags,
                value: customer?.tags?.map(item=> item.tagId) || [],
            }),
            purchaseReportsList: Form.createFormField({
                ...customer?.purchaseReportsList,
               //value: Array.isArray(checkboxValuesDR) ? checkboxValuesDR : [],
               value:checkboxValues
            }),
            // monthlyReportsList: Form.createFormField({
            //     ...customer?.monthlyReportsList,
            //    value: Array.isArray(checkboxValuesMR) ? checkboxValuesMR : [],
            // }),
        };
    }
})(Customer);

export default connect(mapStateToProps, {
    fetchPartyList,
    addCustomer,
    deleteCustomer,
    fetchCustomerListId,
    updateParty,
    resetParty,
    fetchClassificationList,
    fetchEndUserTagsList,
    fetchTemplatesList,
    fetchCustomerList
})(addCustomerForm);