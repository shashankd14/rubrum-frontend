import React, {useEffect, useState} from "react";
import {AutoComplete, Form, Input, Button, Icon, Row, Col, Card} from "antd";
import {connect} from "react-redux";

import {formItemLayout} from '../Create';
import {setInwardDetails, checkIfCoilExists, getGradeByMaterialId} from "../../../../appRedux/actions";

const CoilDetailsForm = (props) => {
    const {getFieldDecorator} = props.form;
    const [dataSource, setDataSource] = useState([]);
    const [approxLength, setLength] = useState(0);

    const handleSubmit = e => {
        e.preventDefault();

        props.form.validateFields((err, values) => {
            if (!err) {
                props.updateStep(2);
            }
        });
    };

    const checkWidth = (rule, value, callback) => {
        if (parseFloat(value) < 2000) {
            return callback();
        }
        callback('Width must be less than 2000mm');
    };

    const checkThickness = (rule, value, callback) => {
        if (parseFloat(value) < 100) {
            return callback();
        }
        callback('Thickness must be less than 100mm');
    };

    useEffect(() => {
        if(props.material.materialList.length > 0) {
            let materialListArr = props.material.materialList.map(material => ({ value: material.matId, text: material.description }));
            setDataSource(materialListArr);
        }
    }, [props.material]);

    useEffect(() => {
        if(props.inward.width && props.inward.thickness && props.inward.netWeight) {
            setLength(parseFloat(props.inward.netWeight)/(parseFloat(props.inward.thickness) * props.inward.width * 0.0785));
        }
    }, [props.inward]);

    return (
        <>
            <Col span={14}>
            <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4">
                <Form.Item
                    label="Coil number"
                    hasFeedback
                    validateStatus={props.inward.coilNumber ? props.inwardStatus.loading ? 'validating' : !props.inwardStatus.loading && props.inwardStatus.success && !props.inwardStatus.duplicateCoil  ? 'success' : props.inwardStatus.error ? 'error' : '' : ''}
                    help={props.inwardStatus.loading ? 'We are checking if the coil number already exists' : ''}
                >
                    {getFieldDecorator('coilNumber', {
                        rules: [{ required: true, message: 'Please input the coil number!' }],
                    })(
                        <Input id="validating" onBlur={(e) => props.checkIfCoilExists(e.target.value)} />
                    )}
                </Form.Item>
                <Form.Item label="Material Description">
                    {getFieldDecorator('material', {
                        rules: [{ required: true, message: 'Please input the material description!' }],
                    })(
                        <AutoComplete
                            style={{width: 200}}
                            onSelect={(value, option) => {
                                // props.getGradeByMaterialId();
                            }}
                            placeholder="enter material"
                            dataSource={dataSource}
                            filterOption
                        />
                    )}
                </Form.Item>
                <Form.Item label="Coil Width">
                    {getFieldDecorator('width', {
                        rules: [{ required: true, message: 'Please input the coil width!' },
                            {pattern: "^(([1-9]*)|(([1-9]*)\\.([0-9]*)))$", message: 'Width should be a number'},
                            {validator: checkWidth}
                        ],
                    })(
                        <Input id="coilWidth" />
                    )}
                </Form.Item>
                <Form.Item label="Coil Thickness">
                    {getFieldDecorator('thickness', {
                        rules: [{ required: true, message: 'Please input the coil thickness!' },
                            {pattern: "^(([1-9]*)|(([1-9]*)\\.([0-9]*)))$", message: 'Coil thickness should be a number'},
                            {validator: checkThickness}
                        ],
                    })(
                        <Input id="coilThickness" />
                    )}
                </Form.Item>
                <Form.Item label="Net Weight">
                    {getFieldDecorator('netWeight', {
                        rules: [{ required: true, message: 'Please input the coil net weight!' }],
                    })(
                        <Input id="coilNetWeight" />
                    )}
                </Form.Item>
                <Form.Item label="Gross Weight">
                    {getFieldDecorator('grossWeight', {
                        rules: [{ required: true, message: 'Please input the coil gross weight!' }],
                    })(
                        <Input id="coilGrossWeight" />
                    )}
                </Form.Item>
                <Form.Item label="Coil Length">
                    {getFieldDecorator('length', {
                        rules: [{ required: false, message: 'Please input the coil number!' }],
                    })(
                        <>
                            <Input id="coilLength" value={approxLength} name="length" />Approx
                        </>
                    )}
                </Form.Item>
                <Row className="gx-mt-4">
                    <Col span={24} style={{ textAlign: "center"}}>
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
            <Col span={10} className="gx-pt-4">
                <Card title="Coil Details" style={{ width: 300 }}>
                    <p>Customer Name : {props.inward.partyName}</p>
                    {props.inward.customerId && <p>Customer Id : {props.inward.customerId}</p>}
                    {props.inward.customerBatchNo && <p>Customer Batch No : {props.inward.customerBatchNo}</p>}
                    {props.inward.customerInvoiceNo && <p>Customer Invoice No : {props.inward.customerInvoiceNo}</p>}
                    {props.inward.purposeType && <p>Purpose Type : {props.inward.purposeType}</p>}
                </Card>
            </Col>
        </>
    )
}

const mapStateToProps = state => ({
    inward: state.inward.inward,
    material: state.material,
    inwardStatus: state.inward,
});

const CoilDetails = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            coilNumber: Form.createFormField({
                ...props.inward.coilNumber,
                value: (props.inward.coilNumber) ? props.inward.coilNumber : '',
            }),
            material: Form.createFormField({
                ...props.inward.material,
                value: (props.inward.material) ? props.inward.material : '',
            }),
            width: Form.createFormField({
                ...props.inward.width,
                value: (props.inward.width) ? props.inward.width : '',
            }),
            thickness: Form.createFormField({
                ...props.inward.thickness,
                value: (props.inward.thickness) ? props.inward.thickness : '',
            }),
            length: Form.createFormField({
                ...props.inward.length,
                value: (props.inward.length) ? props.inward.length : '',
            }),
            netWeight: Form.createFormField({
                ...props.inward.netWeight,
                value: (props.inward.netWeight) ? props.inward.netWeight : '',
            }),
            grossWeight: Form.createFormField({
                ...props.inward.grossWeight,
                value: (props.inward.grossWeight) ? props.inward.grossWeight : '',
            }),

        };
    },
    onValuesChange(props, values) {
        props.setInwardDetails({ ...props.inward, ...values});
    },
})(CoilDetailsForm);

export default connect(mapStateToProps, {
    setInwardDetails,
    checkIfCoilExists,
    getGradeByMaterialId
})(CoilDetails);
