import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Select,Checkbox} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchVendorList, fetchVendorListId, addVendor, updateVendor, fetchStateList, fetchPartyList, addParty, fetchPartyListId, updateParty, resetParty, fetchClassificationList,fetchEndUserTagsList, fetchTemplatesList } from "../../../appRedux/actions";
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
    const [filteredVendorList, setFilteredVendorList] = useState(props.vendor?.vendorList || []);
    const [showAmtDcPdfFlg, setShowAmtDcPdfFlg] = useState(props.party?.showAmtDcPdfFlg==='Y'); // Default value
    const [purchaseReport, setPurchaseReport] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [totalPageItems, setTotalPageItems] = useState(0);
    
    const { totalItems } = props.vendor.vendorList;
    const {getFieldDecorator, getFieldValue} = props.form;

    const { vendor } = props.vendor;
    const [tagsList, setTagsList] =useState([{tagId: 1}]);

    getFieldDecorator('phoneKeys', {initialValue: [0]});
    getFieldDecorator('addressKeys', {initialValue: [0]});
    getFieldDecorator('emailKeys', {initialValue: [0]});

    const phoneKeys = getFieldValue('phoneKeys');
    const addressKeys = getFieldValue('addressKeys');
    const emailKeys = getFieldValue('emailKeys');


    const columns = [{
        title: 'Vendor Id',
        dataIndex: 'vendorId',
        key: 'vendorId',
        filters: [],
        sorter: (a, b) => {
            return a.vendorId - b.vendorId
        },
        sortOrder: sortedInfo.columnKey === 'vendorId' && sortedInfo.order,
    },
    {
        title: 'Vendor Name',
        dataIndex: 'vendorName',
        key: 'vendorName',
        filters: [],
        sorter: (a, b) => a.vendorName.length - b.vendorName.length,
        sortOrder: sortedInfo.columnKey === 'vendorName' && sortedInfo.order,
    },
    {
        title: 'Contact Info',
        dataIndex: 'contactInfo',
        key: 'contactInfo',
        render: (text, record) => (
           <div>
                <div style={{ margin: '0' }}>
                    <p style={{ margin: '0' }}>{record.contactNo}</p>
                    <p style={{ margin: '0' }}>{record.emailId}</p>
                </div> 
            </div>
        ),
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
        sorter: (a, b) => a.state?.length - b.state?.length,
        sortOrder: sortedInfo.columnKey === 'state' && sortedInfo.order,
    },
    // {
    //     title: 'Material Tags',
    //     dataIndex: 'packetClassificationTags',
    //     render (value) {
    //       return value?.map(item => item.tagName)
    //        },
    //      key: 'tags',
    //      filters: []
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
         setViewVendorData(record);
         props.fetchVendorListId({
            id: record.vendorId,
            pageNo: 1,
            pageSize: pageSize,
            ipAddress: "1.1.1.1",
            requestId: "VENDOR_ID_GET",
            userId: ''
        });
        setViewVendor(true);
    }
    const onDelete = (record,key, e) => {
        props.deleteVendor({
            id: record.vendorId,
            ipAddress: "1.1.1.1",
            requestId: "VENDOR_DELETE",
            userId: ''
        })
      }

      const onEdit = (record,e)=>{
        e.preventDefault();
        props.fetchVendorListId({
            id: record.vendorId,
            pageNo: 1,
            pageSize: pageSize,
            ipAddress: "1.1.1.1",
            requestId: "VENDOR_GET",
            userId: ''
        });
        setEditVendor(true);
        setTimeout(() => {
            setShowAddVendor(true);
        }, 1000);

    }

    useEffect(() => {
        setTimeout(() => {
            props.fetchVendorList({
                pageNo: 1,
                pageSize: pageSize,
                ipAddress: "1.1.1.1",
                requestId: "Vendor_LIST_GET",
                searchText: "",
                userId: ''
            });
            props.fetchStateList({
                ipAddress: "1.1.1.1",
                requestId: "STATE_LIST",
                userId: ""
            });
            
        }, 1000);
    }, [showAddVendor]);

    useEffect(() => {
        const { loading, error, vendorList } = props.vendor;
        if (!loading && !error) {
            setFilteredVendorList(vendorList)

        }
    }, [props.vendor]);

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
        if (totalItems) {
          setTotalPageItems(totalItems);
        }
      }, [totalItems]);

      useEffect(() => {
        if (searchValue) {
          if (searchValue.length >= 3) {
            setPageNo(1);
            props.fetchVendorList({
                searchText:searchValue,
                pageNo:"1",
                pageSize: pageSize,
                ipAddress: "1.1.1.1",
                requestId: "VENDOR_LIST_GET",
                userId: ""
            });
          }
        } else {
          setPageNo(1);
          props.fetchVendorList({
            searchText:searchValue,
            pageNo:"1",
            pageSize: pageSize,
            ipAddress: "1.1.1.1",
            requestId: "VENDOR_LIST_GET",
            userId: ""
        });
        }
      }, [searchValue]);
      useEffect(() => {
        // to show checked in checkbox
        const {vendor} = props.vendor
        setPurchaseReport(vendor.purchaseReport || "");
      }, [vendor]);
     
      const { purchaseReport: initialPurchaseReport, ...otherProps } = props.vendor.vendor;

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
                        <SearchBox styleName="gx-flex-1" placeholder="Search for vendor name..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                    </div>
                </div>
                <Table rowSelection={[]}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={filteredVendorList.content}
                    onChange={handleChange}
                    pagination={{
                        pageSize: pageSize,
                        onChange: (page) => {
                          setPageNo(page);
                          props.fetchVendorList({
                            searchText:searchValue,
                            pageNo: page,
                            pageSize: pageSize,
                            ipAddress: "1.1.1.1",
                            requestId: "VENDOR_LIST_GET",
                            userId: ""
                        });
                        },
                        current: pageNo,
                        total: totalPageItems,
                      }}
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
                                    <p><strong>Vendor Name :</strong> {viewVendorDate?.vendorName}</p>
                                    {viewVendorDate?.vendorNickName && <p><strong>Vendor Nickname :</strong> {viewVendorDate?.vendorNickName}</p>}
                                    <p><strong>Phone Number :</strong> {viewVendorDate?.phoneNo}</p>
                                    {/* {viewVendorDate?.phone2 && <p><strong>Alternate phone number 1 :</strong> {viewVendorDate?.phone2}</p>}
                                    {viewVendorDate?.phone3 && <p><strong>Alternate phone number 2:</strong> {viewVendorDate?.phone3}</p>} */}
                                    <p><strong>E-mail :</strong> {viewVendorDate?.emailId}</p>
                                    {/* {viewVendorDate?.email2 && <p><strong>Alternate E-mail 1:</strong> {viewVendorDate?.email2}</p>}
                                    {viewVendorDate?.email3 && <p><strong>Alternate E-mail 2:</strong> {viewVendorDate?.email3}</p>} */}
                                    {viewVendorDate?.contactName && <p><strong>Contact Name :</strong> {viewVendorDate?.contactName}</p>}
                                    {viewVendorDate?.contactNumber && <p><strong>Contact Number :</strong> {viewVendorDate?.contactNumber}</p>}
                                    {viewVendorDate?.tanNumber && <p><strong>TAN Number :</strong> {viewVendorDate?.tanNumber}</p>}
                                    {viewVendorDate?.panNumber && <p><strong>PAN Number :</strong> {viewVendorDate?.panNumber}</p>}
                                    {viewVendorDate?.gstNumber && <p><strong>GST Number :</strong> {viewVendorDate?.gstNumber}</p>}
                                    <p><strong>Address :</strong> {viewVendorDate?.address1}</p>
                                    <p><strong>City :</strong> {viewVendorDate?.city}</p>
                                    <p><strong>State :</strong> {viewVendorDate?.state}</p>
                                    <p><strong>Pin code :</strong> {viewVendorDate?.pincode}</p>
                                    {viewVendorDate?.alternateAddress1 && <p><strong>Alternate Address :</strong> {viewVendorDate?.alternateAddress1}</p>}
                                    {viewVendorDate?.alternateCity && <p><strong>Alternate City :</strong> {viewVendorDate?.alternateCity}</p>}
                                    {viewVendorDate?.alternateState && <p><strong>Alternate State :</strong> {viewVendorDate?.alternateState}</p>}
                                    {viewVendorDate?.alternatePincode && <p><strong>Alternate Pincode :</strong> {viewVendorDate?.alternatePincode}</p>}
                                    {viewVendorDate?.purchaseReport && <p><strong>Purchase Report:</strong>{viewVendorDate?.purchaseReport}</p>}
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
                            setPurchaseReport(initialPurchaseReport ? initialPurchaseReport : "");
                            e.preventDefault();
                            props.form.validateFields((err, values) => {
                                if (!err) {
                                 const data = {
                                    values: {
                                      ...values,
                                      ipAddress: "1.1.1.1",
                                      requestId:"VENDOR_EDIT",
                                      userId: "",
                                      purchaseReportsList: purchaseReport.join(','),
                                    },
                                    id: props.vendor?.vendor?.vendorId
                                  }
                                  props.updateVendor(data);
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
                                  props.addVendor({
                                    ...values,
                                    ipAddress: "1.1.1.1",
                                    requestId:"VENDOR_INSERT",
                                    userId: "",
                                    purchaseReportsList: purchaseReport.join(','),
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
                                        {getFieldDecorator('vendorName', {
                                            rules: [{ required: true, message: 'Please input Vendor name!' }],
                                        })(
                                            <Input id="vendorName" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Vendor/Supplier Nick Name">
                                        {getFieldDecorator('vendorNickName', {
                                            rules: [{ required: false, message: 'Please input Vendor nick name!' }],
                                        })(
                                            <Input id="vendorNickName" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Phone Number">
                                        {getFieldDecorator('phoneNo', {
                                            rules: [{ required: false, message: 'Please input phone No!' }],
                                        })(
                                            <Input id="phoneNo" />
                                        )}
                                    </Form.Item>
                                    {/* {phoneKeys.map((k, index) => {
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
                                    )})} */}

                                    <Form.Item label="Contact Name">
                                        {getFieldDecorator('contactName', {
                                            rules: [{ required: false, message: 'Please input Contact name!' }],
                                        })(
                                            <Input id="contactName" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Contact Number">
                                        {getFieldDecorator('contactNo', {
                                            rules: [{ required: false, message: 'Please input Contact number!' }],
                                        })(
                                            <Input id="contactNo" />
                                        )}
                                    </Form.Item>

                                     {addressKeys.map((k, index) => {
                                    const req = index ? false : true;
                                    const address = vendor?.address1? [vendor?.address1, vendor?.alternateAddress1] : [vendor?.address1];
                                    const city = vendor?.city ? [vendor?.city, vendor?.alternateCity] : [vendor?.city];
                                    const state = vendor?.state ? [vendor?.state, vendor?.alternateState] : [vendor?.state];
                                    const pincode = vendor?.pincode ? [vendor?.pincode, vendor?.alternatePincode] : [vendor?.pincode];
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
                                                // <Input id="state" />
                                                <Select
                                                showSearch
                                                // placeholder="Select a state"
                                                filterOption={(input, option) => {
                                                    return option?.props?.children?.toLowerCase().includes(input.toLowerCase());
                                                }}
                                                filterSort={(optionA, optionB) =>
                                                    optionA?.props?.children.toLowerCase().localeCompare(optionB?.props?.children.toLowerCase())
                                                }
                                            >
                                                 {props.location?.stateList?.map((state) => (
                                                <Option key={state.stateName} value={state.stateName}>
                                                    {state.stateName}
                                                </Option>
                                                ))} 
                                            </Select>
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

                                    <Form.Item label="Email Id">
                                        {getFieldDecorator('emailId', {
                                            rules: [{ required: false, message: 'Please input emailId!' }],
                                        })(
                                            <Input id="emailId" />
                                        )}
                                    </Form.Item>
                                    {/* {emailKeys.map((k, index) => {
                                    const req = index ? false : true;
                                    const email = vendor?.email3 ? [vendor?.email1,vendor?.email2,vendor?.email3] : (vendor?.email2 ? [vendor?.email1,vendor?.email2] : [vendor?.email1]);
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
                                    )})} */}

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
                                            value={purchaseReport}
                                            onChange={(checkedValues) => {setPurchaseReport(checkedValues)}}
                                        >
                                            <Checkbox value="DAILY">Daily</Checkbox>
                                            <Checkbox value="MONTHLY">Monthly</Checkbox>
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
    vendor: state.vendor,
    location: state.location,
    party: state.party,
    packetClassification: state.packetClassification,
    quality: state.quality,
    partyId: state.party.party
});

const addVendorForm = Form.create({
    mapPropsToFields(props) {
        const { vendor } = props.vendor;
        const phone = vendor?.phone3 ? [vendor?.phone1,vendor?.phone2,vendor?.phone3] : (vendor?.phone2 ? [vendor?.phone1,vendor?.phone2] : [vendor?.phone1]);
        const email = vendor?.email3 ? [vendor?.email1,vendor?.email2,vendor?.email3] : (vendor?.email2 ? [vendor?.email1,vendor?.email2] : [vendor?.email1]);
        const address = vendor?.address2?.details ? [vendor?.address1?.details, vendor?.address2?.details] : [vendor?.address1?.details];
        const city = vendor?.address2?.city ? [vendor?.address1?.city, vendor?.address2?.city] : [vendor?.address1?.city];
        const state = vendor?.address2?.state ? [vendor?.address1?.state, vendor?.address2?.state] : [vendor?.address1?.state];
        const pincode = vendor?.address2?.pincode ? [vendor?.address1?.pincode, vendor?.address2?.pincode] : [vendor?.address1?.pincode];
        // const tags = props?.vendor?.vendor?.tags.map(item=> item.classificationName)
        const checkboxValues = (vendor?.purchaseReport || '');
        return {
            vendorName:Form.createFormField ({
                ...props.vendor?.vendor?.vendorName,
                value: props.vendor?.vendor?.vendorName|| '',
            }),
            vendorNickName: Form.createFormField({
                ...props.vendor?.vendor?.vendorNickName,
                value: props.vendor?.vendor?.vendorNickName || '',
            }),
            phoneNo: Form.createFormField({
                ...props.vendor?.vendor?.phoneNo,
                value: props.vendor?.vendor?.phoneNo || '',
            }),
            phoneKeys: Form.createFormField({
                value: phone,
            }),
            contactName: Form.createFormField({
                ...props.vendor?.vendor?.contactName,
                value: props.vendor?.vendor?.contactName || '',
            }),
            contactNo: Form.createFormField({
                ...props.vendor?.vendor?.contactNo,
                value: props.vendor?.vendor?.contactNo || '',
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
            emailId: Form.createFormField({
                ...props.vendor?.vendor?.emailId,
                value: props.vendor?.vendor?.emailId || '',
            }),
            emailKeys: Form.createFormField({
                value: email
            }),
            panNumber: Form.createFormField({
                ...vendor?.panNumber,
                value: vendor?.panNumber || '',
            }),
            tanNumber: Form.createFormField({
                ...vendor?.tanNumber,
                value: vendor?.tanNumber || '',
            }),
            gstNumber: Form.createFormField({
                ...vendor?.gstNumber,
                value: vendor?.gstNumber || '',
            }),
            tags: Form.createFormField({
                ...props.vendor?.vendor?.tags,
                value: vendor?.tags?.map(item=> item.tagId) || [],
            }),
            endUsertags: Form.createFormField({
                ...props.vendor?.vendor?.endUserTags,
                value: vendor?.endUserTags?.map(item=> item.tagId) || [],
            }),
            qualityTemplates: Form.createFormField({
                ...props.vendor?.vendor?.templateIdList,
                value: vendor?.templateIdList?.map(item=> item.templateId) || [],
            }),
            showAmtDcPdfFlg: Form.createFormField({
                ...vendor?.showAmtDcPdfFlg,
                value: vendor?.showAmtDcPdfFlg || 'N',
            }),
            purchaseReport: Form.createFormField({
                ...vendor?.purchaseReport,
               //value: Array.isArray(checkboxValuesDR) ? checkboxValuesDR : [],
               value:checkboxValues
            }),
        };
    }
})(Vendor);

export default connect(mapStateToProps, {
    fetchVendorList,
    fetchVendorListId,
    addVendor,
    updateVendor,
    fetchStateList,
    fetchPartyList,
    addParty,
    fetchPartyListId,
    updateParty,
    resetParty,
    fetchClassificationList,
    fetchEndUserTagsList,
    fetchTemplatesList
})(addVendorForm);
