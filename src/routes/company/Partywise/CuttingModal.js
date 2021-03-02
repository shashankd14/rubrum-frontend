import {Button, Card, Col, DatePicker, Divider, Form, Icon, Input, Modal, Row, Table} from "antd";
import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import moment from "moment";

import {setProcessDetails, saveCuttingInstruction} from '../../../appRedux/actions/Inward';
import {APPLICATION_DATE_FORMAT} from "../../../constants";

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

const columns = [
    {
        title: 'Serial No',
        render: record => record.map(r=> r.instructionId),
        key: 'instructionId',
        
    },
    {
        title: 'Process Date',
        render: (record) => record.map(r=>  moment(r.instructionDate).format('DD/MM/YYYY')),
        key: 'instructionDate',
    },
    {
        title: 'Length',
        render: record => record.map(r=> r.plannedLength),
        key: 'plannedLength',
    },
    {
        title: 'No of Sheets',
        render: record => record.map(r=> r.plannedNoOfPieces),
        key: 'plannedNoOfPieces',
    },
    {
        title: 'Weight',
        render: record => record.map(r=> r.plannedWeight),
        key: 'plannedWeight',
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

const CreateCuttingDetailsForm = (props) => {
    const {getFieldDecorator} = props.form;
    const [cuts, setCuts] = useState([]);

    const handleSubmit = e => {
        e.preventDefault();
        setCuts([...cuts, {...props.inward.process,
            inwardId: props.coilDetails.inwardEntryId ? props.coilDetails.inwardEntryId : "",
            instructionId: props.coilDetails.instructionId ? props.coilDetails.instructionId : ""
        }]);
    };

    useEffect(() => {
        if(props.inward.process.length && props.inward.process.no) {
            if(props.coilDetails.instructionId)
                props.setProcessDetails({...props.inward.process, weight: 0.00000000785*parseFloat(props.coilDetails.width)*parseFloat(props.inward.plan.fThickness)*parseFloat(props.inward.process.length)*parseFloat(props.inward.process.no)});
            else
                props.setProcessDetails({...props.inward.process, weight: 0.00000000785*parseFloat(props.inward.plan.fWidth)*parseFloat(props.inward.plan.fThickness)*parseFloat(props.inward.process.length)*parseFloat(props.inward.process.no)});
        }
    }, [props.inward.process.length, props.inward.process.no])

    return (
        <Modal
            title="Cutting Instruction"
            visible={props.showCuttingModal}
            onOk={() => props.saveCuttingInstruction(cuts)}
            width={1020}
            onCancel={() => props.setShowCuttingModal()}
        >
            <Row>
                <Col lg={12} md={12} sm={24} xs={24} className="gx-align-self-center">
                    <h3>Coil Details </h3>
                    <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4">
                    <Form.Item label="Received Date" >
                        {getFieldDecorator('processDate', {
                            rules: [{ required: true, message: 'Please select a received date' }],
                        })(
                            <DatePicker
                                placeholder="dd/mm/yy"
                                style={{width: 200}}
                                format="DD/MM/YYYY"
                                className="gx-mb-3 gx-w-100"
                                disabled={props.wip ? true : false}/>
                        )}
                    </Form.Item>
                    <Form.Item label="Length">
                        {getFieldDecorator('length', {
                            rules: [{ required: true, message: 'Please enter Length' },
                                {pattern: "^(([1-9]*)|(([1-9]*)\\.([0-9]*)))$", message: 'Length should be a number'},],
                        })(
                            <Input id="length" disabled={props.wip ? true : false}/>
                        )}
                    </Form.Item>
                    <Form.Item label="No of cuts">
                        {getFieldDecorator('no', {
                            rules: [{ required: true, message: 'Please enter number of cuts required' },
                                {pattern: "^(([1-9]*)|(([1-9]*)))$", message: 'Number of cuts should be a number'}],
                        })(
                            <Input id="noOfCuts" disabled={props.wip ? true : false}/>
                        )}
                    </Form.Item>
                    <Form.Item label="Weight">
                        {getFieldDecorator('weight', {
                            rules: [{ required: true, message: 'Please fill other details to calculate weight' },
                                {pattern: "^(([1-9]*)|(([1-9]*)))$", message: 'Number of cuts should be a number'}],
                        })(
                            <Input id="weight" disabled={true}  />
                        )}
                    </Form.Item>
                    <Row className="gx-mt-4">
                        <Col span={24} style={{ textAlign: "center"}}>
                            <Button type="primary" htmlType="submit" disabled={props.wip ? true : false}>
                                Add Size<Icon type="right"/>
                            </Button>
                        </Col>
                    </Row>
                </Form>
                </Col>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <Table className="gx-table-responsive" columns={columns} dataSource={props.wip ? props.coilDetails.instruction: cuts}/>
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

export default  connect(mapStateToProps, {setProcessDetails, saveCuttingInstruction})(CuttingDetailsForm);