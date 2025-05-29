import React, {useEffect, useState} from "react";
import {AutoComplete, Form, Input, Button, Icon, Row, Col, Card} from "antd";
import {connect} from "react-redux";

import {formItemLayout} from '../Create';
import {setInwardDetails, checkIfCoilExists, getGradeByMaterialId, fetchPartyList} from "../../../../appRedux/actions";
import {METAL_DENSITY} from "../../../../constants";

const CoilDetailsForm = (props) => {
    const {getFieldDecorator} = props.form;
    const [dataSource, setDataSource] = useState([]);
    const [approxLength, setLength] = useState(0);

    
    const handleSubmit = e => {
        e.preventDefault();

        props.form.validateFields((err, values) => {
            if (!err) {
                let length = props.params!== "" ?(parseFloat(parseFloat(props.inward.fpresent)/(parseFloat(props.inward.fThickness)* METAL_DENSITY *(props.inward.fWidth/1000))).toFixed(4))*1000:(parseFloat(parseFloat(props.inward.netWeight)/(parseFloat(props.inward.thickness)* METAL_DENSITY *(props.inward.width/1000))).toFixed(4))*1000;
                let inward = props.inward;
                if(props.params!== ""){
                    inward.fLength = length;
                }else{
                    inward.length = length
                }
                props.setInwardDetails({ ...props.inward, ...inward});
                props.getGradeByMaterialId(props.params!=="" ?props.inward.material.matId :props.inward.description);
                props.updateStep(2);
            }
        });
    };
    const handleChange = (e,path) =>{
        if(path === 'material.description'){
        props.inward?.material?.description = e.target.value;
        } else if (path === 'fWidth'){
            props.inward.fWidth = e.target.value;
        }
        else if (path === 'fThickness'){
            props.inward.fThickness = e.target.value;
        }
        else if (path === 'fpresent'){
            props.inward.fpresent = e.target.value;
        } else if (path === 'fQuantity') {
            props.inward.fQuantity = e.target.value;
        }
    }
    const checkCoilExists = (rule, value, callback) => {
        if (!props.inwardStatus.loading && props.inwardStatus.success && !props.inwardStatus.duplicateCoil) {
            return callback();
        }
        callback('The inward id already exists');
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
// for the edit flow
    useEffect(() => {
        if (props.params !== ""){
            props.getGradeByMaterialId(props.inward?.material?.matId);
            const { Option } = AutoComplete;
            const options = props.material.materialList.filter(material => {
            if (material?.matId === props.inward?.material?.matId)
                return (<Option key={material.matId} value={`${material.matId}`}>
                        {material?.description}
                    </Option>)
                });
                setDataSource(options);
        }   
    }, [props.material]);
    // for the create flow
    useEffect(() => {
        if(props?.material?.materialList.length > 0) {
            const { Option } = AutoComplete;
            const options = props.material?.materialList.map(material => (
                <Option key={material?.matId} value={`${material?.matId}`}>
                    {material?.description}
                </Option>
            ));
            setDataSource(options);
        }
    }, [props.material]);

    useEffect(() => {
        props.fetchPartyList();
    }, []);

    useEffect(() => {
        if(props.inward.width && props.inward.thickness && props.inward.netWeight && props.inward.form == 1) {
            setLength((parseFloat(parseFloat(props.inward.netWeight)/(parseFloat(props.inward.thickness)* METAL_DENSITY *(props.inward.width/1000))).toFixed(4))*1000);
        }
    }, [props.inward]);

    const partyName =(partyList) =>{
        partyList = partyList.find(item => item.nPartyId === Number(props.inward.partyName))
        return partyList?.partyName
    }

    return (
        <>
            <Col span={14}>
            <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4">
                <Form.Item
                    label="Inward Id"
                    hasFeedback
                    validateStatus={props.inward.coilNumber ? props.inwardStatus.loading ? 'validating' : !props.inwardStatus.loading && props.inwardStatus.success && !props.inwardStatus.duplicateCoil  ? 'success' : props.inwardStatus.error || props.inwardStatus.duplicateCoil ? 'error' : '' : ''}
                    help={props.inwardStatus.loading ? 'We are checking if the inward id already exists' : (!props.inwardStatus.loading && props.inwardStatus.success && props.inwardStatus.duplicateCoil) ? "The inward id already exists" :  ''}
                >
                    {getFieldDecorator('coilNumber', {
                        rules: [{ required: true, message: 'Please input the inward id!' },
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
                            onChange= {props.params!=="" ?(e) =>handleChange(e,'material.description'):""}
                            filterOption={(inputValue, option) => {
                                return option.props.children?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 || false
                            }
                            }
                        />
                    )}
                </Form.Item>
                <Form.Item label="Coil Width (in mm)">
                    {getFieldDecorator('width', {
                        rules: [{ required: true, message: 'Please input the coil width!' }
                        ],
                    })(
                        <Input id="coilWidth" onChange= {props.params!=="" ?(e) =>handleChange(e,'fWidth'):""}/>
                    )}
                </Form.Item>
                <Form.Item label="Coil Thickness (in mm)">
                    {getFieldDecorator('thickness', {
                        rules: [{ required: true, message: 'Please input the coil thickness!' }
                        ],
                    })(
                        <Input id="coilThickness" onChange= {props.params!=="" ?(e) =>handleChange(e,'fThickness'):""}/>
                    )}
                </Form.Item>
                <Form.Item label="Net Weight (in kgs)">
                    {getFieldDecorator('netWeight', {
                        rules: [{ required: true, message: 'Please input the coil net weight!' }],
                    })(
                        <Input id="coilNetWeight"  onChange= {props.params!=="" ?(e) =>handleChange(e,'fpresent'):""}/>
                    )}
                </Form.Item>
                <Form.Item label="Gross Weight (in kgs)">
                    {getFieldDecorator('grossWeight', {
                        rules: [{ required: true, message: 'Please input the coil gross weight!' }],
                    })(
                        <Input id="coilGrossWeight" onChange={props.params!=="" ? (e)=>handleChange(e,'fQuantity'):""} />
                    )}
                </Form.Item>
                <Form.Item label="Coil Length (in mts)">
                    {getFieldDecorator('approxLength', {
                        rules: [{ required: false, message: 'Please input the inward id!' }],
                    })(
                        <>
                            <Input id="coilLength" value={props.params !=="" ?props.inward.fLength :approxLength} name="approxLength" />Approx
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
                <Card title="Inward Details" style={{ width: 300 }}>
                    <p>Location Name : {props.params !== "" && props.inward.party ? props.inward.party?.partyName:partyName(props.party.partyList)}</p>
                    {props.inward.customerId && <p>Location Id : {props.inward.customerId}</p>}
                    {props.inward.customerBatchNo && <p>SC inward id : {props.inward.customerBatchNo}</p>}
                    {props.inward.customerInvoiceNo && <p>Purchase Invoice No : {props.inward.customerInvoiceNo}</p>}
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
    party: state.party
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
                value: props.params !== "" ? props.inward?.material?.description :(props.inward.description) ? (props.inward.description):'' ,
            }),
            width: Form.createFormField({
                ...props.inward.width,
                value: props.params !== "" ? props.inward.fWidth :(props.inward.width) ? props.inward.width : '',
            }),
            thickness: Form.createFormField({
                ...props.inward.thickness,
                value:  props.params !== "" ? props.inward.fThickness :(props.inward.thickness) ? props.inward.thickness : '',
            }),
            approxLength: Form.createFormField({
                ...props.inward.length,
                value: props.params !== "" ? props.inward.fLength: (props.inward.length) ? props.inward.length : '',
            }),
            netWeight: Form.createFormField({
                ...props.inward.netWeight,
                value:  props.params !== "" ? props.inward.fpresent :(props.inward.netWeight) ? props.inward.netWeight : '',
            }),
            grossWeight: Form.createFormField({
                ...props.inward.grossWeight,
                value: props.params !== "" ? props.inward.fQuantity :(props.inward.grossWeight) ? props.inward.grossWeight : '',
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
    fetchPartyList,
    getGradeByMaterialId
})(CoilDetails);
