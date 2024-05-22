import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {setInwardDVDetails, checkCustomerBatchNumber} from "../../../../appRedux/actions";
import {Form, Spin, AutoComplete, Icon, Button, Col, Row, Input, Select, Card} from "antd";
import {formItemLayout} from '../Create';
import {fetchVendorList, fetchDVMaterialList} from "../../../../appRedux/actions";
const Option = Select.Option;

const CreateVendorDetailsForm = (props) => {
    const {getFieldDecorator, setFieldsValue } = props.form;
   
    const handleSubmit = e => {
        e.preventDefault();
        // props.setInwardDVDetails({ ...props.inwardDV});
        props.form.validateFields((err, values) => {
            if (!err) {
                props.updateStep(2);
            }
        });
    };

    useEffect(() => {
        props.fetchVendorList({
            searchText:"",
            pageNo: "1",
            pageSize: "15",
            ipAddress: "1.1.1.1",
            requestId: "VENDOR_LIST_GET",
            userId: ""
        });
        props.fetchDVMaterialList({
            searchText: '',
            pageNo: '1',
            pageSize: '15',
            ipAddress: '1.1.1.1',
            requestId: 'MATERIAL_LIST_GET',
            userId: '',
          });
    }, []);

    const [vendorId, setVendorId] = useState('');

    const handleVendorChange = (value) => {
      const selectedVendor = props.vendor?.vendorList?.content?.find(
        (vendor) => vendor.vendorId === value
      );
    setVendorId(selectedVendor.vendorId);
    };

    return (
        <>
        <Col span={16}>
                <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4" style={{"width":"70%"}}>
                     <Form.Item label="Vendor Name">
                        {getFieldDecorator("vendorId", {
                          rules: [
                            {
                              required: true,
                              message: "Please select vendor name!",
                            },
                          ],
                        })(
                          <Select
                            id="vendorId"
                            showSearch
                            style={{ width: "100%" }}
                            filterOption={(input, option) =>
                              option.props.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                          }
                          allowClear
                          onChange={handleVendorChange}
                        >
                          {props.vendor?.vendorList?.content?.map((vendor) => (
                            <Option key={vendor.vendorId} value={vendor.vendorId}>
                              {vendor.vendorName}
                            </Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    <Form.Item label="Vendor Id">
                            {getFieldDecorator('vendorId', {
                                initialValue: props.inwardDV?.vendorId ? props.inwardDV?.vendorId : vendorId,
                            rules: [{ required: false }],
                            })(
                                <Input id="vendorId" disabled value={props.inwardDV?.vendorId ? props.inwardDV?.vendorId : vendorId}/>
                            )}
                    </Form.Item>
                    <Form.Item label="Transporter Name">
                            {getFieldDecorator('transporterName', {
                            rules: [{ required: false, message: 'Please input the transporter name!' }],
                            })(
                                <Input id="transporterName" />
                            )}
                    </Form.Item>
                    <Form.Item label="Transporter Phone no">
                            {getFieldDecorator('transporterPhoneNo', {
                            rules: [{ required: false, message: 'Please input the transporter phone no!' }],
                            })(
                                <Input id="transporterPhoneNo" />
                            )}
                    </Form.Item>
                    <Row className="gx-mt-4">
                        <Col span={24} offset={4} style={{ textAlign: "center"}}>
                            <Button style={{ marginLeft: 8 }} onClick={() => props.updateStep(0)}>
                                <Icon type="left"/>Back
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Forward<Icon type="right"/>
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Col>
            <Col span={8} className="gx-pt-4">
                <Card title="Inward Details" style={{ width: 400 }}>
                    {props.inwardDV.purposeType && <p>Purpose Type : {props.inwardDV.purposeType}</p>}
                </Card>
            </Col>
        </>
    )
}

const mapStateToProps = state => ({
    vendor: state.vendor,
    inwardDV: state.inwardDV.inward
});

const VendorDetailsForm = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            vendorId: Form.createFormField({
                ...props.inwardDV.vendorId,
                 value: props.inwardDV.vendorId || '',
            }),
            transporterName: Form.createFormField({
                ...props.inwardDV.transporterName,
                 value: props.inwardDV.transporterName || '',
            }),  
            transporterPhoneNo: Form.createFormField({
                ...props.inwardDV.transporterPhoneNo,
                 value: props.inwardDV.transporterPhoneNo || '',
            }),
        };
    },
    onValuesChange(props, values) {
        props.setInwardDVDetails({ ...props.inwardDV, ...values});
    },
})(CreateVendorDetailsForm);

export default connect(mapStateToProps, {
    setInwardDVDetails,
    checkCustomerBatchNumber,
    fetchVendorList,
    fetchDVMaterialList
})(VendorDetailsForm);
