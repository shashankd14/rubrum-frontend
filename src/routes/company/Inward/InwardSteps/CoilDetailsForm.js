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
                props.setInwardDetails({ ...props.inward, length: approxLength});
                props.getGradeByMaterialId(props.params!=="" ?props.inward.material.matId :props.inward.description);
                props.updateStep(2);
            }
        });
    };
    const handleChange = e =>{
        
        props.inward.material.description = e;
        console.log(e);
    }
    const checkCoilExists = (rule, value, callback) => {
        if (!props.inwardStatus.loading && props.inwardStatus.success && !props.inwardStatus.duplicateCoil) {
            return callback();
        }
        callback('The coil number already exists');
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
        if (props.params !== ""){
            const { Option } = AutoComplete;
            const options = props.material.materialList.filter(material => {
            if (material.matId===  props.inward.material.matId)
                return (<Option key={material.matId} value={`${material.matId}`}>
                        {material.description}
                    </Option>)
                });
                setDataSource(options);
        }   
    }, [props.material]);
    useEffect(() => {
        if(props.material.materialList.length > 0) {

            const { Option } = AutoComplete;
            const options = props.material.materialList.map(material => (
                <Option key={material.matId} value={`${material.matId}`}>
                    {material.description}
                </Option>
            ));
            setDataSource(options);
        }
    }, [props.material]);

    useEffect(() => {
        if(props.inward.width && props.inward.thickness && props.inward.netWeight) {
            setLength(parseFloat(parseFloat(props.inward.grossWeight)/7.85/(parseFloat(props.inward.thickness)/props.inward.width)).toFixed(4));
        }
    }, [props.inward]);

    return (
        <>
            <Col span={14}>
            <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4">
                <Form.Item
                    label="Coil number"
                    hasFeedback
                    validateStatus={props.inward.coilNumber ? props.inwardStatus.loading ? 'validating' : !props.inwardStatus.loading && props.inwardStatus.success && !props.inwardStatus.duplicateCoil  ? 'success' : props.inwardStatus.error || props.inwardStatus.duplicateCoil ? 'error' : '' : ''}
                    help={props.inwardStatus.loading ? 'We are checking if the coil number already exists' : (!props.inwardStatus.loading && props.inwardStatus.success && props.inwardStatus.duplicateCoil) ? "The coil number already exists" :  ''}
                >
                    {getFieldDecorator('coilNumber', {
                        rules: [{ required: true, message: 'Please input the coil number!' },
                            {validator: props.params ==="" ?checkCoilExists: ""}],
                    })(
                        <Input id="validating" onChange={(e) => props.checkIfCoilExists(e.target.value)} onBlur={props.params !== "" ? "" :(e) => props.checkIfCoilExists(e.target.value)} />
                    )}
                </Form.Item>
                <Form.Item label="Material Description">
                    {getFieldDecorator('description', {
                        rules: [{ required: true, message: 'Please input the material description!' }],
                    })(
                        <AutoComplete
                            style={{width: 200}}
                            placeholder="enter material"
                            dataSource={dataSource}
                            onChange= {props.params!=="" ?(e) =>handleChange(e):""}
                            filterOption={(inputValue, option) =>
                                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                        />
                    )}
                </Form.Item>
                <Form.Item label="Coil Width (in mm)">
                    {getFieldDecorator('width', {
                        rules: [{ required: true, message: 'Please input the coil width!' }
                        ],
                    })(
                        <Input id="coilWidth" />
                    )}
                </Form.Item>
                <Form.Item label="Coil Thickness (in mm)">
                    {getFieldDecorator('thickness', {
                        rules: [{ required: true, message: 'Please input the coil thickness!' },
                            {pattern: "^[1-9]*$", message: 'Coil thickness should be a number'},
                            {validator: checkThickness}
                        ],
                    })(
                        <Input id="coilThickness" />
                    )}
                </Form.Item>
                <Form.Item label="Net Weight (in kgs)">
                    {getFieldDecorator('netWeight', {
                        rules: [{ required: true, message: 'Please input the coil net weight!' }],
                    })(
                        <Input id="coilNetWeight" />
                    )}
                </Form.Item>
                <Form.Item label="Gross Weight (in kgs)">
                    {getFieldDecorator('grossWeight', {
                        rules: [{ required: true, message: 'Please input the coil gross weight!' }],
                    })(
                        <Input id="coilGrossWeight" />
                    )}
                </Form.Item>
                <Form.Item label="Coil Length (in mts)">
                    {getFieldDecorator('approxLength', {
                        rules: [{ required: false, message: 'Please input the coil number!' }],
                    })(
                        <>
                            <Input id="coilLength" value={approxLength} name="approxLength" />Approx
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
            description: Form.createFormField({
                ...props.inward.description,
                value: props.params !== "" ?props.inward.material.description :(props.inward.description) ? (props.inward.description):'' ,
            }),
            width: Form.createFormField({
                ...props.inward.width,
                value: props.params !== "" ? props.inward.fWidth :(props.inward.width) ? props.inward.width : '',
            }),
            thickness: Form.createFormField({
                ...props.inward.thickness,
                value:  (props.inward.thickness) ? props.inward.thickness : '',
            }),
            approxLength: Form.createFormField({
                ...props.inward.approxLength,
                value: (props.inward.approxLength) ? props.inward.approxLength : '',
            }),
            netWeight: Form.createFormField({
                ...props.inward.netWeight,
                value:  props.params !== "" ? props.inward.grossWeight :(props.inward.netWeight) ? props.inward.netWeight : '',
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
