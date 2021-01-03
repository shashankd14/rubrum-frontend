import {Button, Col, Form, Icon, Input, message, Modal, Row, Table} from "antd";
import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import moment from "moment";

import {APPLICATION_DATE_FORMAT} from '../../../constants';
import {setProcessDetails, saveSlittingInstruction, resetInstruction} from '../../../appRedux/actions/Inward';

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
        title: 'Width',
        dataIndex: 'width',
        key: 'width',
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

    const addNewSize = (e) => {
        props.form.validateFields((err, values) => {
            if (!err) {
                let totalWidth = 0
                const slits = []
                for(let i=0; i < values.widths.length; i++) {
                    slits.push({name: i+1, processDate: moment().format(APPLICATION_DATE_FORMAT),
                        length: values.length,width: values.widths[i],
                        no: values.nos[i],
                        weight:values.weights[i],
                        inwardId: props.coilDetails.inwardEntryId ? props.coilDetails.inwardEntryId : '',
                        instructionId: props.coilDetails.instructionId ? props.coilDetails.instructionId : '',
                    })
                    totalWidth += values.widths[i]*values.nos[i];
                }
                if(totalWidth > props.coilDetails.fWidth) {
                    message.error('Sum of slits width is greater than width of coil.', 2);
                } else
                    props.setSlits(...slits);
            }
        });
    }

    const addNewKey = () => {
        const {form} = props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat({width:0, no:0, weight:0});
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
                <label>Available length : {props.coilDetails.fLength}</label>
                <div><label>Available width : {props.coilDetails.fWidth}</label></div>

                <Form.Item label="Length">
                    {getFieldDecorator('length', {
                        rules: [{ required: true, message: 'Please enter Length' },
                            {pattern: "^(([1-9]*)|(([1-9]*)\\.([0-9]*)))$", message: 'Length should be a number'},],
                    })(
                        <Input id="length" />
                    )}
                </Form.Item>
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
                        return (
                        <>
                            <Col lg={6} md={6} sm={12} xs={24}>
                                <Form.Item>
                                    {getFieldDecorator(`widths[${index}]`, {
                                        rules: [{ required: true, message: 'Please enter width' },
                                            {pattern: "^(([1-9]*)|(([1-9]*)\\.([0-9]*)))$", message: 'Width should be a number'},],
                                    })(
                                        <Input id="length" />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col lg={6} md={6} sm={12} xs={24}>
                                <Form.Item>
                                    {getFieldDecorator(`nos[${index}]`, {
                                        rules: [{ required: true, message: 'Please enter nos' },
                                            {pattern: "^(([1-9]*)|(([1-9]*)\\.([0-9]*)))$", message: 'Number of slits should be a number'},],
                                    })(
                                        <Input id="length" />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col lg={6} md={6} sm={12} xs={24}>
                                <Form.Item>
                                    {getFieldDecorator(`weights[${index}]`, {
                                        rules: [{ required: true, message: 'Please enter weight' },
                                            {pattern: "^(([1-9]*)|(([1-9]*)\\.([0-9]*)))$", message: 'Weight should be a number'},],
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
                <Row className="gx-mt-4">
                    <Col span={16} style={{ textAlign: "center"}}>
                        <Button type="primary" htmlType="submit" onClick={() => addNewSize()}>
                            Add Size<Icon type="right"/>
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

const CreateCuttingDetailsForm = (props) => {
    const {getFieldDecorator} = props.form;
    const [cuts, setCuts] = useState([]);
    let loading = '';

    useEffect(() => {
        if(props.inward.process.length && props.inward.process.no) {
            props.setProcessDetails({...props.inward.process, weight: 0.00000000785*parseFloat(props.inward.plan.fWidth)*parseFloat(props.inward.plan.fThickness)*parseFloat(props.inward.process.length)*parseFloat(props.inward.process.no)});
        }
    }, [props.inward.process.length, props.inward.process.no])

    useEffect(() => {
        if(props.inward.instructionSaveLoading) {
            loading = message.loading('Saving Slit Instruction..');
        }
    }, [props.inward.instructionSaveLoading]);

    useEffect(() => {
        if(props.inward.instructionSaveSuccess) {
            loading = '';
            message.success('Slitting instruction saved successfully', 2).then(() => {
                props.setShowSlittingModal(false);
                props.resetInstruction();
            });
        }
    }, [props.inward.instructionSaveSuccess])

    return (
        <Modal
            title="Slitting Instruction"
            visible={props.showSlittingModal}
            onOk={() => props.saveSlittingInstruction(cuts)}
            width={1020}
            onCancel={() => props.setShowSlittingModal(false)}
        >
            <Row>
                <Col lg={12} md={16} sm={24} xs={24} span={16} className="gx-align-self-center">
                    <h3>Coil Details </h3>
                    <Form {...formItemLayout} className="login-form gx-pt-4">
                        <Form.Item>
                            <SlittingWidthsForm setSlits={(slits) => setCuts([...cuts, slits])} coilDetails={props.inward.plan}/>
                        </Form.Item>

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
        };
    },
    onValuesChange(props, values) {
        props.setProcessDetails({ ...props.inward.process, ...values});
    },
})(CreateCuttingDetailsForm);

const SlittingWidthsForm = Form.create()(SlittingWidths);

export default  connect(mapStateToProps, {setProcessDetails, saveSlittingInstruction, resetInstruction})(CuttingDetailsForm);