import React, {useEffect, useState} from "react";
import {AutoComplete, Form, Input, DatePicker, Button, Icon} from "antd";
import {connect} from "react-redux";
import moment from "moment";
import {setInwardDetails} from "../../../../appRedux/actions";
import {formItemLayout} from '../Create';
import {dateFormat} from "util/config";

const InvoiceDetailsForm = (props) => {
    const {getFieldDecorator} = props.form;
    const [dataSource, setDataSource] = useState([]);

    const handleSubmit = e => {
        e.preventDefault();

        props.form.validateFields((err, values) => {
            if (!err) {
                props.updateStep(1);
            }
        });
    };

    useEffect(() => {
        if(props.material.materialList.length > 0) {
            let materialListArr = props.material.materialList.map(material => material.description);
            setDataSource(materialListArr);
        }
    }, [props.material]);

    return (
        <>
            <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form ">
                <Form.Item
                    label="Coil number"
                    hasFeedback
                    validateStatus=""
                    help="The information is being validated..."
                >
                    <Input placeholder="I'm the content is being validated" id="validating" />
                </Form.Item>
                <Form.Item
                    label="Coil number"
                    hasFeedback
                    validateStatus=""
                    help="The information is being validated..."
                >
                    <DatePicker defaultValue={moment(moment(), dateFormat)} format={dateFormat} />
                </Form.Item>
                <Form.Item label="Material">
                    {getFieldDecorator('material', {
                        rules: [{ required: true, message: 'Please input the party name!' }],
                    })(
                        <AutoComplete
                            style={{width: 200}}
                            onSelect={(value, option) => {
                                console.log(value);
                            }}
                            placeholder="enter material"
                            dataSource={dataSource}
                            filterOption
                        />
                    )}
                </Form.Item>
                {/*<Form.Item wrapperCol={{ span: 12, offset: 6 }}>*/}
                {/*    <Button type="primary" htmlType="submit">*/}
                {/*        Back<Icon type="right"/>*/}
                {/*    </Button>*/}
                {/*</Form.Item>*/}
                <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                    <Button type="primary" htmlType="submit">
                        Forward<Icon type="right"/>
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}


const mapStateToProps = state => ({
    inward: state.inward.inward,
    material: state.material,
});

const InvoiceDetails = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            partyName: Form.createFormField({
                ...props.inward.partyName,
                value: (props.inward.partyName) ? props.inward.partyName : '',
            }),
        };
    },
    onValuesChange(props, values) {
        props.setInwardDetails({ ...props.inward, ...values});
    },
})(InvoiceDetailsForm);

export default connect(mapStateToProps, {
    setInwardDetails,
})(InvoiceDetails);
