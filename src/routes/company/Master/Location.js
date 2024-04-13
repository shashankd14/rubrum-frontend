import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Select,Checkbox} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchLocationList, deleteLocation, addLocation, fetchLocationListId, updateLocation, resetLocation, fetchStateList } from "../../../appRedux/actions";
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
    const [filteredLocationList, setFilteredLocationList] = useState(props?.location?.locationList?.content || []);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [totalPageItems, setTotalPageItems] = useState(0);
    const { totalItems } = props.location.locationList;
    const {getFieldDecorator, getFieldValue} = props.form;

    const columns = [{
        title: 'Location Id',
        dataIndex: 'locationId',
        key: 'locationId',
        filters: [],
        sorter: (a, b) => {
            return a.locationId - b.locationId
        },
        sortOrder: sortedInfo.columnKey === 'locationId' && sortedInfo.order,
    },
    {
        title: 'Location Name',
        dataIndex: 'locationName',
        key: 'locationName',
        filters: [],
        sorter: (a, b) => a.locationName.length - b.locationName.length,
        sortOrder: sortedInfo.columnKey === 'locationName' && sortedInfo.order,
    },
    {
        title: 'Location Address',
        dataIndex: 'address1',
        key: 'address1',
        sorter: (a, b) => a.address1?.city?.length - b.address1?.city?.length,
        sortOrder: sortedInfo.columnKey === 'address1' && sortedInfo.order,
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
    //     title: 'GST Number',
    //     dataIndex: 'gstNo',
    //     key: 'gstNo',
    //     filters: [],
    //     sorter: (a, b) => a.gstNo.length - b.gstNo.length,
    //     sortOrder: sortedInfo.columnKey === 'gstNo' && sortedInfo.order,
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
         setViewLocationData(record);
        props.fetchLocationListId({
            id: record.locationId,
            searchText: '',
            pageNo: "1",
            pageSize: "15",
            ipAddress: '',
            requestId: '',
            userId: ''
        });
        setViewLocation(true);
    }
    const onDelete = (record,key, e) => {
        props.deleteLocation({
            ids: record.locationId,
            ipAddress: "1.1.1.1",
            requestId: "LOCATION_DELETE",
            userId: ""
        })
      }

      const onEdit = (record,e)=>{
        e.preventDefault();
        props.fetchLocationListId({
            id: record.locationId,
            searchText: '',
            pageNo: "1",
            pageSize: "15",
            ipAddress: '',
            requestId: '',
            userId: ''
        });
        setEditLocation(true);
        setTimeout(() => {
            setShowAddLocation(true);
        }, 1000);
    }

    useEffect(() => {
        debugger
        setTimeout(() => {
            props.fetchLocationList({
                searchText:"",
                pageNo:"1",
                pageSize:"15",
                ipAddress: "1.1.1.1",
                requestId: "LOCATION_LIST_GET",
                userId: ""
            });
            props.fetchStateList({
                ipAddress: "1.1.1.1",
                requestId: "STATE_LIST",
                userId: ""
            });
        }, 1000);
    }, [showAddLocation]);

    useEffect(() => {
        const { loading, error, locationList } = props.location;
        if (!loading && !error) {
            setFilteredLocationList(locationList)

        }
    }, [props.location]);

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
            props.fetchLocationList({
                searchText:searchValue,
                pageNo:"1",
                pageSize:"15",
                ipAddress: "1.1.1.1",
                requestId: "LOCATION_LIST_GET",
                userId: ""
            });
          }
        } else {
          setPageNo(1);
          props.fetchLocationList({
            searchText:searchValue,
            pageNo:"1",
            pageSize:"15",
            ipAddress: "1.1.1.1",
            requestId: "LOCATION_LIST_GET",
            userId: ""
        });
        }
      }, [searchValue]);
      console.log("state111111", props.location);

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
                                    props.resetLocation();
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
                    dataSource={filteredLocationList.content}
                    onChange={handleChange}
                    pagination={{
                        pageSize: 15,
                        onChange: (page) => {
                          setPageNo(page);
                          props.fetchLocationList({
                            searchText:searchValue,
                            pageNo: page,
                            pageSize: pageSize,
                            ipAddress: "1.1.1.1",
                            requestId: "LOCATION_LIST_GET",
                            userId: ""
                        });
                        },
                        current: pageNo,
                        total: totalPageItems,
                      }}
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
                                    <p><strong>Location Name :</strong> {viewLocationDate?.locationName}</p>
                                    <p><strong>Location Address :</strong> {viewLocationDate?.address1}</p>
                                    {viewLocationDate?.address2 && <p><strong>Location Address 2 :</strong> {viewLocationDate?.address2}</p>}
                                    <p><strong>Location City :</strong> {viewLocationDate?.city}</p>
                                    <p><strong>Location State :</strong> {viewLocationDate?.state}</p>
                                    {viewLocationDate?.address2 && <p><strong>Pin code :</strong> {viewLocationDate?.pinCode}</p> }
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
                            e.preventDefault();
                            props.form.validateFields((err, values) => {
                                if (!err) {
                                 const data = {
                                    values: {
                                      ...values,
                                    },
                                    locationId: props?.location?.locationId.locationId
                                  }
                                  props.updateLocation(data);
                                  props.form.resetFields();
                                  setShowAddLocation(false);
                                  setEditLocation(false);
                                }
                            });
                        } else {
                            props.form.validateFields((err, values) => {
                                if (!err) {
                                 e.preventDefault();
                                  // props.addLocation(values);
                                 props.addLocation({
                                    ...values,
                                    ipAddress:"",
                                    requestId: "ADD_LOCATION",
                                    userId: ""
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
                                        {getFieldDecorator('locationName', {
                                            rules: [{ required: true, message: 'Please input location/branch name!' }],
                                        })(
                                            <Input id="locationName" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Location Address">
                                        {getFieldDecorator('locationAddress', {
                                            rules: [{ required: false, message: 'Please input address!' }],
                                        })(
                                            <Input id="locationAddress" />
                                        )}
                                    </Form.Item>
                                    {/* <Form.Item label="Location Address2">
                                        {getFieldDecorator('locationAddress2', {
                                            // rules: [{ required: false, message: 'Please input address!' }],
                                        })(
                                            <Input id="locationAddress2" />
                                        )}
                                    </Form.Item> */}
                                    <Form.Item label="City">
                                        {getFieldDecorator('city', {
                                            rules: [{ required: false, message: 'Please input city!' }],
                                        })(
                                            <Input id="city" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="PinCode">
                                        {getFieldDecorator('pincode', {
                                            rules: [{ required: false, message: 'Please input pincode!' }],
                                        })(
                                            <Input id="pincode" />
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
                                    <Form.Item label="GST Number">
                                        {getFieldDecorator('gstNo', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="gstNo" />
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
    packetClassification: state.packetClassification,
    location: state.location
});

const addLocationForm = Form.create({
    mapPropsToFields(props) {
        return {
            locationName:Form.createFormField ({
                ...props.location?.locationId?.locationName,
                value: props.location?.locationId?.locationName|| '',
            }),
            locationAddress:Form.createFormField ({
                ...props.location?.locationId?.address1,
                value: props.location?.locationId?.address1|| '',
            }),
            locationAddress2:Form.createFormField ({
                ...props.location?.locationId?.address2,
                value: props.location?.locationId?.address2|| '',
            }),
            city:Form.createFormField ({
                ...props.location?.locationId?.city,
                value: props.location?.locationId?.city|| '',
            }),      
            pincode:Form.createFormField ({
                ...props.location?.locationId?.pincode,
                value: props.location?.locationId?.pincode|| '',
            }),
            state:Form.createFormField ({
                ...props.location?.locationId?.state,
                value: props.location?.locationId?.state|| '',
            }),
            gstNo:Form.createFormField ({
                ...props.location?.locationId?.gstNo,
                value: props.location?.locationId?.gstNo|| '',
            }),
        };
    }
})(Location);

export default connect(mapStateToProps, {
    fetchLocationList,
    addLocation,
    fetchLocationListId,
    updateLocation,
    resetLocation,
    deleteLocation,
    fetchStateList
})(addLocationForm);
