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

const Location = (props) => {

    const Option = Select.Option;
    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [showAddLocation, setShowAddLocation] = useState(false);
    const [viewLocation, setViewLocation] = useState(false);
    const [viewLocationDate, setViewLocationData] = useState({});
    const [editLocation, setEditLocation] = useState(false);
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
        title: 'Location Id',
        dataIndex: 'nPartyId',
        key: 'nPartyId',
        filters: [],
        sorter: (a, b) => {
            return a.nPartyId - b.nPartyId
        },
        sortOrder: sortedInfo.columnKey === 'nPartyId' && sortedInfo.order,
    },
    {
        title: 'Location Name',
        dataIndex: 'partyName',
        key: 'partyName',
        filters: [],
        sorter: (a, b) => a.partyName.length - b.partyName.length,
        sortOrder: sortedInfo.columnKey === 'partyName' && sortedInfo.order,
    },
    {
        title: 'Location Address',
        dataIndex: 'address1.city',
        key: 'address1.city',
        sorter: (a, b) => a.address1?.city?.length - b.address1?.city?.length,
        sortOrder: sortedInfo.columnKey === 'address1.city' && sortedInfo.order,
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
        title: 'GST Number',
        dataIndex: 'gstNumber',
        key: 'gstNumber',
        filters: [],
        sorter: (a, b) => a.gstNumber.length - b.gstNumber.length,
        sortOrder: sortedInfo.columnKey === 'gstNumber' && sortedInfo.order,
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
         setViewLocationData(record);
        props.fetchPartyListId(record.nPartyId);
        setViewLocation(true);
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
        setEditLocation(true);
        setTimeout(() => {
            setShowAddLocation(true);
        }, 1000);

    }

    useEffect(() => {
        setTimeout(() => {
            props.fetchPartyList();
            props.fetchClassificationList();
            props.fetchEndUserTagsList();
            props.fetchTemplatesList()
        }, 1000);
    }, [showAddLocation]);

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
            <h1><IntlMessages id="sidebar.company.locationList"/></h1>
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
                                    setShowAddLocation(true)
                                }}
                        >Add Location</Button>
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
                    title='Party Details'
                    visible={viewLocation}
                    width={600}
                    onOk={() => setViewLocation(false)}
                    onCancel={() => setViewLocation(false)}

                >
                    <Card className="gx-card">
                        <Row>
                            <Col span={24}>
                                <Card>
                                    <p><strong>Location Name :</strong> {viewLocationDate?.partyName}</p>
                                    {viewLocationDate?.partyNickname && <p><strong>Party Nickname :</strong> {viewLocationDate?.partyNickname}</p>}
                                    <p><strong>Phone Number :</strong> {viewLocationDate?.phone1}</p>
                                    {viewLocationDate?.phone2 && <p><strong>Alternate phone number 1 :</strong> {viewLocationDate?.phone2}</p>}
                                    {viewLocationDate?.phone3 && <p><strong>Alternate phone number 2:</strong> {viewLocationDate?.phone3}</p>}
                                    <p><strong>E-mail :</strong> {viewLocationDate?.email1}</p>
                                    {viewLocationDate?.email2 && <p><strong>Alternate E-mail 1:</strong> {viewLocationDate?.email2}</p>}
                                    {viewLocationDate?.email3 && <p><strong>Alternate E-mail 2:</strong> {viewLocationDate?.email3}</p>}
                                    {viewLocationDate?.contactName && <p><strong>Contact Name :</strong> {viewLocationDate?.contactName}</p>}
                                    {viewLocationDate?.contactNumber && <p><strong>Contact Number :</strong> {viewLocationDate?.contactNumber}</p>}
                                    {viewLocationDate?.tanNumber && <p><strong>TAN Number :</strong> {viewLocationDate?.tanNumber}</p>}
                                    {viewLocationDate?.panNumber && <p><strong>PAN Number :</strong> {viewLocationDate?.panNumber}</p>}
                                    {viewLocationDate?.gstNumber && <p><strong>GST Number :</strong> {viewLocationDate?.gstNumber}</p>}
                                    {viewLocationDate?.address1 && <>
                                        <p><strong>Address :</strong> {viewLocationDate?.address1?.details}</p>
                                        <p><strong>City :</strong> {viewLocationDate?.address1?.city}</p>
                                        <p><strong>State :</strong> {viewLocationDate?.address1?.state}</p>
                                        <p><strong>Pincode :</strong> {viewLocationDate?.address1?.pincode}</p>
                                    </>}
                                    {viewLocationDate?.packetClassificationTags && <p><strong>Tags:</strong>{viewLocationDate?.packetClassificationTags?.map(item=> item.tagName)}</p>}
                                    {viewLocationDate?.endUserTags && <p><strong>EndUser Tags:</strong>{viewLocationDate?.endUserTags?.map(item=> item.tagName)}</p>}
                                    {props.partyId.dailyReportsList && <p><strong>Daily Reports List :</strong> {props.partyId?.dailyReportsList}</p>}
                                    {props.partyId?.monthlyReportsList && <p><strong>Monthly Reports List :</strong> {props.partyId?.monthlyReportsList}</p>}
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Modal>
                <Modal
                    title={editLocation?'Edit Location':'Add Location'}
                    visible={showAddLocation}
                    onOk={(e) => {
                        if (editLocation) {
        
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
                                  setShowAddLocation(false);
                                  setEditLocation(false);
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
                                  setShowAddLocation(false);
                                }
                            });
                        }
                    }}
                    width={800}
                    onCancel={() => {
                        props.form.resetFields();
                        setShowAddLocation(false);
                        setEditLocation(false)
                    }}
                >
                    <Card className="gx-card">
                        <Row>
                            <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                                <Form {...formItemLayout} className="gx-pt-4">
                                    <Form.Item label="Location/Branch Nick Name">
                                        {getFieldDecorator('partyName', {
                                            rules: [{ required: true, message: 'Please input location/branch name!' }],
                                        })(
                                            <Input id="partyName" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Location Address">
                                        {getFieldDecorator('locationAddress', {
                                            rules: [{ required: false, message: 'Please input address!' }],
                                        })(
                                            <Input id="locationAddress" />
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
                                        {getFieldDecorator("state", {
                                        rules: [
                                            {
                                            required: true,
                                            message: "Please select state!",
                                            },
                                        ],
                                        })(
                                        <Select
                                            showSearch
                                            style={{ width: 300 }}
                                            placeholder="Select a state"
                                        >
                                            {props.process?.processList?.map((process) => (
                                            <Option key={process.processId} value={process.processId}>
                                                {process.processName}
                                            </Option>
                                            ))}
                                        </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="GST Number">
                                        {getFieldDecorator('gstNumber', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="gstNumber" />
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

const addLocationForm = Form.create({
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
})(Location);

export default connect(mapStateToProps, {
    fetchPartyList,
    addParty,
    fetchPartyListId,
    updateParty,
    resetParty,
    fetchClassificationList,
    fetchEndUserTagsList,
    fetchTemplatesList
})(addLocationForm);
