import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {setInwardDVDetails, checkCustomerBatchNumber} from "../../../../appRedux/actions";
import {Form, Spin, AutoComplete, Icon, Button, Col, Row, Input, Select} from "antd";
import {formItemLayout} from '../Create';

const Option = Select.Option;

const CreatePurposeTypeForm = (props) => {
    const {getFieldDecorator} = props.form;
    const [dataSource, setDataSource] = useState([]);
  
    // const handleSubmit = e => {
    //     debugger
    //     e.preventDefault();

    //     props.form.validateFields((err, values) => {
    //         if (!err) {
    //              props.updateStep(1);
    //         }
    //     });
    // };
    const handleSubmit = e => {
        props.updateStep(1);
    }
       
    return (
        <>
                {/* <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4" style={{"width":"70%"}}> */}
                <Form {...formItemLayout} className="login-form gx-pt-4" style={{"width":"70%"}}>    
                    <Form.Item label="Purpose Type">
                        {getFieldDecorator('purposeType', {
                            rules: [{ required: true, message: 'Please select a purpose type!' }],
                        })(
                            <Select placeholder="Select an option">
                                <Option value="TRADING">Trading (SELF)</Option>
                                <Option value="STEEL SERVICE CENTRE">Steel Service Centre (SSC)</Option>
                                <Option value="EXTERNAL PROCESS AGENT">External Process Agent (EPA)</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Row className="gx-mt-4">
                        <Col span={12} offset={4} style={{ textAlign: "center"}}>
                            {/* <Button type="primary" htmlType="submit">
                                Forward<Icon type="right"/>
                            </Button> */}
                             <Button type="primary" onClick={handleSubmit}>
                                Forward
                            </Button>
                        </Col>
                    </Row>
                </Form>
        </>
    )
}

const mapStateToProps = state => ({
    party: state.party,
    inward: state.inward.inward,
    inwardStatus: state.inward,
    inwardDV: state.inwardDV.inward
});

const PurposeTypeForm = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            purposeType: Form.createFormField({
                ...props.inwardDV.purposeType,
                value: (props.inwardDV.purposeType) ? props.inwardDV.purposeType : '',
            }),
        };
    },
    onValuesChange(props, values) {
        props.setInwardDVDetails({ ...props.inwardDV, ...values});
    },
})(CreatePurposeTypeForm);

export default connect(mapStateToProps, {
    setInwardDVDetails,
    checkCustomerBatchNumber
})(PurposeTypeForm);
