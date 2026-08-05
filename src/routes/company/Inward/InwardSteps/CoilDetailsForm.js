import React, { useEffect, useRef, useState, useCallback } from "react";
import { AutoComplete, Form, Input, Button, Icon, Row, Col, Card, Select } from "antd";
import { connect } from "react-redux";

import { formItemLayout } from '../Create';
import { setInwardDetails, getGradeByMaterialId, fetchPartyList, fetchClassificationList, fetchEndUserTagsList } from "../../../../appRedux/actions";
import useCheckCoilNumberUnique from '../../../../util/hooks/useCheckCoilNumberUnique';
import useStatusList from '../../../../util/hooks/useStatusList';

const COIL = 'Coil';
const SHEET = 'Sheet';

const Option = Select.Option;

const CoilDetailsForm = (props) => {
    const { getFieldDecorator } = props.form;
    const [dataSource, setDataSource] = useState([]);
    const { checkCoilNumber } = useCheckCoilNumberUnique();
    const { fetchStatusList, statusList } = useStatusList();
    const originalCoilNumber = useRef(props.inward.coilNumber);

    const handleSubmit = e => {
        e.preventDefault();

        props.form.validateFields((err, values) => {
            if (!err) {
                let length = props.params !== "" ? (parseFloat(parseFloat(props.inward.fpresent) / (parseFloat(props.inward.fThickness) * 7.85 * (props.inward.fWidth / 1000))).toFixed(4)) * 1000 : (parseFloat(parseFloat(props.inward.netWeight) / (parseFloat(props.inward.thickness) * 7.85 * (props.inward.width / 1000))).toFixed(4)) * 1000;
                let inward = props.inward;
                if (props.params !== "") {
                    inward.fLength = length;
                } else {
                    inward.length = length
                }
                if(inward.inwardType === SHEET) {
                    inward.length = values.approxLength;
                }
                props.setInwardDetails({ ...props.inward, ...inward });
                props.getGradeByMaterialId(props.params !== "" ? props.inward.material.matId : props.inward.description);
                props.updateStep(2);
            }
        });
    };
    
    const handleChange = (e, path) => {
        if (path === 'material.description') {
            props.inward.material.description = e.target.value;
        } else if (path === 'fWidth') {
            props.inward.fWidth = e.target.value;
        }
        else if (path === 'fThickness') {
            props.inward.fThickness = e.target.value;
        }
        else if (path === 'fpresent') {
            props.inward.fpresent = e.target.value;
        } else if (path === 'fQuantity') {
            props.inward.fQuantity = e.target.value;
        }
    }
    const validateCoilNumber = (rule, value, callback) => {
        if (!value) {
            callback();
            return;
        }
        if (props.params !== "" && value === originalCoilNumber.current) {
            callback();
            return;
        }
        checkCoilNumber(value)
            .then(isPresent => {
                callback(isPresent ? 'The coil number already exists' : undefined);
            })
            .catch(() => {
                callback();
            });
    };

    const validateNumeric = (rule, value, callback) => {
        callback(value && !/^\d+(\.\d+)?$/.test(value) ? 'Please input a numeric value!' : undefined);
    };

    const validateInteger = (rule, value, callback) => {
        callback(value && !/^\d+$/.test(value) ? 'Please input a numeric value!' : undefined);
    };

    // for the edit flow
    useEffect(() => {
        if (props.params !== "") {
            props.getGradeByMaterialId(props.inward.material.matId);
            const { Option } = AutoComplete;
            const options = props.material.materialList.filter(material => {
                if (material.matId === props.inward.material.matId)
                    return (<Option key={material.matId} value={`${material.matId}`}>
                        {material.description}
                    </Option>)
            });
            setDataSource(options);
        }
    }, [props.material]);

    // for the create flow
    useEffect(() => {
        if (props.material.materialList.length > 0) {
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
        if (props.inward.inwardType === COIL && props.inward.width && props.inward.thickness && props.inward.netWeight) {
            let length = (parseFloat(parseFloat(props.inward.netWeight) / (parseFloat(props.inward.thickness) * 7.85 * (props.inward.width / 1000))).toFixed(4)) * 1000;
            props.setInwardDetails({ ...props.inward, approxLength : length });
        }
    }, [props.inward.thickness, props.inward.width, props.inward.netWeight, props.inward.inwardType]);

    const { fetchClassificationList, fetchEndUserTagsList } = props;
    const fetchSheetLists = useCallback(() => {
        if (props.inward.inwardType === SHEET) {
            fetchClassificationList();
            fetchEndUserTagsList();
            fetchStatusList();
        }
    }, [props.inward.inwardType]);

    useEffect(() => {
        fetchSheetLists();
    }, [fetchSheetLists]);

    useEffect(() => {
        props.setInwardDetails({ ...props.inward, inwardType: COIL });
    }, [])

    return (
        <>
            <Col span={14}>
                <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4">
                    <Form.Item label="Coil number">
                        {getFieldDecorator('coilNumber', {
                            validateTrigger: 'onBlur',
                            rules: [{ required: true, message: 'Please input the coil number!' },
                            { validator: validateCoilNumber }],
                        })(
                            <Input id="coilNumber" />
                        )}
                    </Form.Item>
                    <Form.Item label="Material Type">
                        {getFieldDecorator('inwardType', {
                            rules: [{ required: true, message: 'Please select a material type!' }],
                        })(
                            <Select placeholder="Select an option">
                                <Option initialVale={COIL} value={COIL}>Coil</Option>
                                <Option value={SHEET}>Sheet</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="Material Description">
                        {getFieldDecorator('description', {
                            rules: [{ required: true, message: 'Please input the material description!' }],
                        })(
                            <AutoComplete
                                style={{ width: 200 }}
                                placeholder="enter material"
                                dataSource={dataSource}
                                onChange={props.params !== "" ? (e) => handleChange(e, 'material.description') : ""}
                                filterOption={(inputValue, option) => {
                                    return option.props.children?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 || false
                                }
                                }
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="Coil Width (in mm)">
                        {getFieldDecorator('width', {
                            validateTrigger: 'onBlur',
                            rules: [{ required: true, message: 'Please input the coil width!' },
                            { validator: validateNumeric }
                            ],
                        })(
                            <Input id="coilWidth" onChange={props.params !== "" ? (e) => handleChange(e, 'fWidth') : ""} />
                        )}
                    </Form.Item>
                    <Form.Item label="Coil Thickness (in mm)">
                        {getFieldDecorator('thickness', {
                            validateTrigger: 'onBlur',
                            rules: [{ required: true, message: 'Please input the coil thickness!' },
                            { validator: validateNumeric }
                            ],
                        })(
                            <Input id="coilThickness" onChange={props.params !== "" ? (e) => handleChange(e, 'fThickness') : ""} />
                        )}
                    </Form.Item>
                    {props.inward.inwardType === SHEET && <>
                    <Form.Item label="End-user Tag">
                            {getFieldDecorator("endUserTagId", {
                            rules: [
                                { required: false, message: "Please select a end user tag!" },
                            ],
                        })(
                            <Select placeholder="Select an option">
                                {props?.packetClassification?.endUserTags.map((packetClassification) => (
                                    <Option key={packetClassification.tagId} value={packetClassification.tagId}>
                                        {packetClassification.tagName}
                                    </Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>
                        <Form.Item label="Classification Tag">
                            {getFieldDecorator("packetClassificationId", {
                                rules: [
                                    { required: false, message: "Please select a location!" },
                                ],
                            })(
                                <Select placeholder="Select an option">
                                    {props?.packetClassification?.processTags.map((packetClassification) => (
                                        <Option key={packetClassification.tagId} value={packetClassification.tagId}>
                                            {packetClassification.tagName}
                                        </Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="No of pieces">
                            {getFieldDecorator('noofpieces', {
                                validateTrigger: 'onBlur',
                                rules: [{ required: true, message: 'Please input the number of pieces!' },
                                { validator: validateInteger }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="Status">
                            {getFieldDecorator('statusId', {
                                rules: [{ required: true, message: 'Please select a status!' }],
                            })(
                                <Select placeholder="Select an option">
                                    {statusList.map((status) => (
                                        <Option key={status.statusId} value={status.statusId}>
                                            {status.statusName}
                                        </Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>
                        </>}
                    <Form.Item label="Net Weight (in kgs)">
                        {getFieldDecorator('netWeight', {
                            validateTrigger: 'onBlur',
                            rules: [{ required: true, message: 'Please input the coil net weight!' },
                            { validator: validateNumeric }],
                        })(
                            <Input id="coilNetWeight" onChange={props.params !== "" ? (e) => handleChange(e, 'fpresent') : ""} />
                        )}
                    </Form.Item>
                    <Form.Item label="Gross Weight (in kgs)">
                        {getFieldDecorator('grossWeight', {
                            validateTrigger: 'onBlur',
                            rules: [{ required: true, message: 'Please input the coil gross weight!' },
                            { validator: validateNumeric }],
                        })(
                            <Input id="coilGrossWeight" onChange={props.params !== "" ? (e) => handleChange(e, 'fQuantity') : ""} />
                        )}
                    </Form.Item>
                    <Form.Item label="Coil Length (in mts)">
                        {getFieldDecorator('approxLength', {
                            validateTrigger: 'onBlur',
                            rules: [{ required: false, message: 'Please input the coil number!' },
                            { validator: validateNumeric }],
                        })(
                            <Input id="coilLength" disabled={props.inward.inwardType === COIL} />
                        )} Approx
                    </Form.Item>
                    <Row className="gx-mt-4">
                        <Col span={24} style={{ textAlign: "center" }}>
                            <Button style={{ marginLeft: 8 }} onClick={() => props.updateStep(0)}>
                                <Icon type="left" />Back
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Forward<Icon type="right" />
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Col>
            <Col span={10} className="gx-pt-4">
                <Card title="Coil Details" style={{ width: 300 }}>
                    <p>Customer Name : {props.params !== "" && props.inward.party ? props.inward.party?.partyName : ''}</p>
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
    party: state.party,
    packetClassification: state.packetClassification,
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
            inwardType: Form.createFormField({
                ...props.inward.inwardType,
                value: (props.inward.inwardType) ? props.inward.inwardType : COIL,
            }),
            packetClassificationId: Form.createFormField({
                ...props.inward.packetClassificationId,
                value: (props.inward.packetClassificationId) ? props.inward.packetClassificationId : '',
            }),
            endUserTagId: Form.createFormField({
                ...props.inward.endUserTagId,
                value: (props.inward.endUserTagId) ? props.inward.endUserTagId : '',
            }),
            description: Form.createFormField({
                ...props.inward.description,
                value: props.params !== ""
                    ? (props.inward.description || props.inward.material?.description)
                    : (props.inward.description || ''),
            }),
            width: Form.createFormField({
                ...props.inward.width,
                value: props.params !== "" ? props.inward.fWidth : (props.inward.width) ? props.inward.width : '',
            }),
            thickness: Form.createFormField({
                ...props.inward.thickness,
                value: props.params !== "" ? props.inward.fThickness : (props.inward.thickness) ? props.inward.thickness : '',
            }),
            noofpieces: Form.createFormField({
                ...props.inward.noofpieces,
                value: props.params !== "" ? props.inward.noofpieces : (props.inward.noofpieces) ? props.inward.noofpieces : '',
            }),
            statusId: Form.createFormField({
                ...props.inward.statusId,
                value: props.params !== "" ? props.inward.statusId : (props.inward.statusId) ? props.inward.statusId : '',
            }),
            approxLength: Form.createFormField({
                ...props.inward.approxLength,
                value: props.params !== "" ? props.inward.fLength : (props.inward.approxLength) ? props.inward.approxLength : '',
            }),
            netWeight: Form.createFormField({
                ...props.inward.netWeight,
                value: props.params !== "" ? props.inward.fpresent : (props.inward.netWeight) ? props.inward.netWeight : '',
            }),
            grossWeight: Form.createFormField({
                ...props.inward.grossWeight,
                value: props.params !== "" ? props.inward.fQuantity : (props.inward.grossWeight) ? props.inward.grossWeight : '',
            }),
        };
    },
    onValuesChange(props, values) {
        props.setInwardDetails({ ...props.inward, ...values });
    },
})(CoilDetailsForm);

export default connect(mapStateToProps, {
    setInwardDetails,
    fetchPartyList,
    getGradeByMaterialId,
    fetchClassificationList,
    fetchEndUserTagsList
})(CoilDetails);
