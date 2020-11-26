import {Button, Card, Col, DatePicker, Divider, Form, Icon, Input, Modal, Row, Table} from "antd";
import React, {useEffect, useState} from "react";
import {connect} from "react-redux";

import {setProcessDetails, saveCuttingInstruction} from '../../../appRedux/actions/Inward';

export const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 4},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 16},
    },
};

export const formItemLayoutSlitting = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 4},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 24, offset: 2},
    },
};

const columns = [
    {
        title: 'Serial No',
        dataIndex: 'name',
        key: 'name',
        render: text => <span className="gx-link">{text}</span>,
    },
    {
        title: 'Process Date',
        dataIndex: 'processDate',
        key: 'processDate',
    },
    {
        title: 'Length',
        dataIndex: 'length',
        key: 'length',
    },
    {
        title: 'No of Sheets',
        dataIndex: 'no',
        key: 'no',
    },
    {
        title: 'Weight',
        dataIndex: 'weight',
        key: 'weight',
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <span>
                <i className="icon icon-edit"/>
            </span>
        ),
    }
];
let uuid = 0;

const SlittingWidths = (props) => {
    const {getFieldDecorator, getFieldValue} = props.form;
    getFieldDecorator('keys', {initialValue: [{width:0, no:0, weight:0}]});
    const keys = getFieldValue('keys');

    const addNewKey = () => {
        const {form} = props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat({width:0, no:0, weight:0});
        console.log(keys);
        form.setFieldsValue({
            keys: nextKeys,
        });
    }

    const removeKey = (k) => {
        const {form} = props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }
        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }

    return (
        <>
            <Form {...formItemLayoutSlitting}>
                <Row>
                    <Col lg={6} md={6} sm={12} xs={24}>
                        <label>Width</label>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={24}>
                        <label>Nos</label>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={24}>
                        <label>Weight</label>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={24}>
                        <label>Action</label>
                    </Col>
                </Row>
                <Row>
                    {keys.map((k, index) => {
                        console.log(k);
                        return (
                        <>
                            <Col lg={6} md={6} sm={12} xs={24} key={index}>
                                <Form.Item>
                                    {getFieldDecorator(keys[index].width, {
                                        rules: [{ required: true, message: 'Please enter Length' },
                                            {pattern: "^(([1-9]*)|(([1-9]*)\\.([0-9]*)))$", message: 'Length should be a number'},],
                                    })(
                                        <Input id="length" />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col lg={6} md={6} sm={12} xs={24} key={index}>
                                <Form.Item>
                                    {getFieldDecorator(`nos[${index}]`, {
                                        rules: [{ required: true, message: 'Please enter Length' },
                                            {pattern: "^(([1-9]*)|(([1-9]*)\\.([0-9]*)))$", message: 'Length should be a number'},],
                                    })(
                                        <Input id="length" />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col lg={6} md={6} sm={12} xs={24} key={index}>
                                <Form.Item>
                                    {getFieldDecorator(`weights[${index}]`, {
                                        rules: [{ required: true, message: 'Please enter Length' },
                                            {pattern: "^(([1-9]*)|(([1-9]*)\\.([0-9]*)))$", message: 'Length should be a number'},],
                                    })(
                                        <Input id="length" />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col lg={6} md={6} sm={12} xs={24}>
                                <div style={{height: "40px"}} className="gx-flex-row gx-align-items-center">
                                    {keys.length-1 > 0 ? <i className="icon icon-trash gx-margin" onClick={() => removeKey(k)}/> : <></>}
                                    {index == keys.length-1 ? <i className="icon icon-add-circle" onClick={() => addNewKey()}/> : <></>}
                                </div>
                            </Col>
                        </>
                    ) }
                    )}
                </Row>
            </Form>
        </>
    )
}

const CreateCuttingDetailsForm = (props) => {
    const {getFieldDecorator} = props.form;
    const [cuts, setCuts] = useState([]);
console.log(props);
    const handleSubmit = e => {
        e.preventDefault();
        setCuts([...cuts, props.inward.process])
    };

    const addNewSize = () => {
        console.log('dsf');
    }

    useEffect(() => {
        if(props.inward.process.length && props.inward.process.no) {
            props.setProcessDetails({...props.inward.process, weight: 0.00000000785*parseFloat(props.inward.plan.fWidth)*parseFloat(props.inward.plan.fThickness)*parseFloat(props.inward.process.length)*parseFloat(props.inward.process.no)});
        }
    }, [props.inward.process.length, props.inward.process.no])

    return (
        <Modal
            title="Slitting Instruction"
            visible={props.showSlittingModal}
            onOk={() => props.saveCuttingInstruction(cuts)}
            width={1020}
            onCancel={() => props.setShowSlittingModal()}
        >
            <Row>
                <Col lg={12} md={16} sm={24} xs={24} span={16} className="gx-align-self-center">
                    <h3>Coil Details </h3>
                    <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4">
                        <Form.Item label="Length">
                            {getFieldDecorator('length', {
                                rules: [{ required: true, message: 'Please enter Length' },
                                    {pattern: "^(([1-9]*)|(([1-9]*)\\.([0-9]*)))$", message: 'Length should be a number'},],
                            })(
                                <Input id="length" />
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('slittingWidths', {
                                initialValue: {number: 0, currency: 'rmb'},
                            })(<SlittingWidthsForm/>)}
                        </Form.Item>
                        <Row className="gx-mt-4">
                            <Col span={16} style={{ textAlign: "center"}}>
                                <Button type="primary" htmlType="submit" onClick={() => addNewSize()}>
                                    Add Size<Icon type="right"/>
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <Table className="gx-table-responsive" columns={columns} dataSource={cuts}/>
                </Col>
            </Row>
        </Modal>
    )
}

const mapStateToProps = state => ({
    party: state.party,
    inward: state.inward,
});

const CuttingDetailsForm = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            processDate: Form.createFormField({
                ...props.inward.process.processDate,
                value: (props.inward.process.processDate) ? props.inward.process.processDate : '',
            }),
            length: Form.createFormField({
                ...props.inward.process.length,
                value: (props.inward.process.length) ? props.inward.process.length : '',
            }),
            no: Form.createFormField({
                ...props.inward.process.no,
                value: (props.inward.process.no) ? props.inward.process.no : '',
            }),
            weight: Form.createFormField({
                ...props.inward.process.weight,
                value: (props.inward.process.weight) ? props.inward.process.weight : '',
            }),
            coilDetails: Form.createFormField({
                value: props.coilDetails.plan
            })
        };
    },
    onValuesChange(props, values) {
        props.setProcessDetails({ ...props.inward.process, ...values});
    },
})(CreateCuttingDetailsForm);

const SlittingWidthsForm = Form.create({
    onFieldsChange(props, changedFields) {
        console.log(changedFields);
    },
})(SlittingWidths);

export default  connect(mapStateToProps, {setProcessDetails, saveCuttingInstruction})(CuttingDetailsForm);