import React, {useEffect, useState} from "react";
import {AutoComplete, Button, Card, DatePicker, Form, Icon, Input, Select, Tooltip} from "antd";
import {connect} from "react-redux";
import {fetchPartyList, fetchMaterialList, setInwardDetails, submitInwardEntry} from "../../../appRedux/actions";

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 3},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const CreateForm = (props) => {
    const {getFieldDecorator} = props.form;
    const [dataSource, setDataSource] = useState([]);
    const [materialDataSource, setMaterialDataSource] = useState([]);

    useEffect(() => {
        if(props.party.partyList.length > 0) {

            const { Option } = AutoComplete;

            const options = props.party.partyList.map(party => (
                <Option key={party.nPartyId} value={`${party.nPartyId}`}>
                    {party.nPartyName}
                </Option>
            ));
            setDataSource(options);
        }
    }, [props.party]);

    useEffect(() => {
        if(props.material.materialList.length > 0) {
            let materialListArr = props.material.materialList.map(material => material.description);
            setMaterialDataSource(materialListArr);
        }
    }, [props.material]);

    useEffect(() => {
        props.fetchPartyList();
        props.fetchMaterialList();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                props.submitInwardEntry(values);
            }
        });
    }

    const config = {
        rules: [{type: 'object', required: true, message: 'Please select an inward date!', defaultValue: new Date()}],
    };

    return (
        <Card className="gx-card" title="Inward Entry">
            <Form onSubmit={handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="Party Name"
                >
                    {getFieldDecorator('partyName', {
                        rules: [{
                            required: true, message: 'Please enter a party name!',
                        }],
                    })(
                        <AutoComplete
                            style={{width: 200}}
                            onSelect={(value, option) => {console.log(option)}}
                            onSearch={() => {console.log('search')}}
                            placeholder="input here"
                            dataSource={dataSource}
                            filterOption
                        />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
              Coil number&nbsp;
                            <Tooltip title="Enter a unique coil number?">
                <Icon type="question-circle-o"/>
              </Tooltip>
            </span>
                    )}
                >
                    {getFieldDecorator('coilNumber', {
                        rules: [{required: true, message: 'Please input your coil number!', whitespace: false}],
                    })(
                        <Input  style={{width: 200}}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Inward Date"
                >
                    {getFieldDecorator('inwardDate', config)(
                        <DatePicker
                            style={{width: 200}}
                            className="gx-mb-3 gx-w-100"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>Vehicle number</span>
                    )}
                >
                    {getFieldDecorator('vehicleNumber', {
                        rules: [{required: true, message: 'Please input your vehicle number!', whitespace: false}],
                    })(
                        <Input  style={{width: 200}}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>Invoice number</span>
                    )}
                >
                    {getFieldDecorator('invoiceNumber', {
                        rules: [{required: true, message: 'Please input your invoice number!', whitespace: false}],
                    })(
                        <Input  style={{width: 200}}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>Invoice date</span>
                    )}
                >
                    {getFieldDecorator('invoiceDate', config)(
                        <DatePicker
                            style={{width: 200}}
                            className="gx-mb-3 gx-w-100"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Material Description"
                >
                    {getFieldDecorator('materialDesc', {
                        rules: [{
                            required: true, message: 'Please enter a material description!',
                        }],
                    })(
                        <AutoComplete
                            dataSource={materialDataSource}
                            style={{width: 200}}
                            onSelect={(value) => {console.log(value)}}
                            onSearch={() => {console.log('search')}}
                            placeholder="input here"
                        />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>Width</span>
                    )}
                >
                    {getFieldDecorator('width', {
                        rules: [{required: true, message: 'Please input your width number!', whitespace: false}],
                    })(
                        <Input  style={{width: 200}}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>Thickness</span>
                    )}
                >
                    {getFieldDecorator('thickness', {
                        rules: [{required: true, message: 'Please input your Thickness!', whitespace: false}],
                    })(
                        <Input  style={{width: 200}}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>Weight</span>
                    )}
                >
                    {getFieldDecorator('weight', {
                        rules: [{required: true, message: 'Please input your weight!', whitespace: false}],
                    })(
                        <Input  style={{width: 200}}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>Length</span>
                    )}
                >
                    {getFieldDecorator('length', {
                        rules: [{required: true, message: 'Please input your length!', whitespace: false}],
                    })(
                        <Input  style={{width: 200}}/>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">Register</Button>
                </FormItem>
            </Form>
        </Card>
    )
}

const mapStateToProps = state => ({
    party: state.party,
    material: state.material,
    inward: state.inward,
});

const Create = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            partyName: Form.createFormField({
                ...props.inward.inward.partyName,
                value: (props.inward.inward.partyName) ? props.inward.inward.partyName : '',
            }),
            coilNumber: Form.createFormField({
                ...props.inward.inward.coilNumber,
                value: (props.inward.inward.coilNumber) ? props.inward.inward.coilNumber : '',
            }),
            inwardDate: Form.createFormField({
                ...props.inward.inward.inwardDate,
                value: (props.inward.inward.inwardDate) ? props.inward.inward.inwardDate : '',
            }),
            vehicleNumber: Form.createFormField({
                ...props.inward.inward.vehicleNumber,
                value: (props.inward.inward.vehicleNumber) ? props.inward.inward.vehicleNumber : '',
            }),
            invoiceNumber: Form.createFormField({
                ...props.inward.inward.invoiceNumber,
                value: (props.inward.inward.invoiceNumber) ? props.inward.inward.invoiceNumber : '',
            }),
            invoiceDate: Form.createFormField({
                ...props.inward.inward.invoiceDate,
                value: (props.inward.inward.invoiceDate) ? props.inward.inward.invoiceDate : '',
            }),
            materialDesc: Form.createFormField({
                ...props.inward.inward.materialDesc,
                value: (props.inward.inward.materialDesc) ? props.inward.inward.materialDesc : '',
            }),
            width: Form.createFormField({
                ...props.inward.inward.width,
                value: (props.inward.inward.width) ? props.inward.inward.width : '',
            }),
            thickness: Form.createFormField({
                ...props.inward.inward.thickness,
                value: (props.inward.inward.thickness) ? props.inward.inward.thickness : '',
            }),
            weight: Form.createFormField({
                ...props.inward.inward.weight,
                value: (props.inward.inward.weight) ? props.inward.inward.weight : '',
            }),
            length: Form.createFormField({
                ...props.inward.inward.length,
                value: (props.inward.inward.length) ? props.inward.inward.length : '',
            }),
        };
    },
    onValuesChange(props, values) {
        props.setInwardDetails({ ...props.inward.inward, ...values});
    },
})(CreateForm);

export default connect(mapStateToProps, {
    fetchPartyList,
    fetchMaterialList,
    setInwardDetails,
    submitInwardEntry,
})(Create);
