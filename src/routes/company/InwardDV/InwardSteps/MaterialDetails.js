import React, {useEffect, useState} from "react";
import {AutoComplete, Form, Input, Button, Icon, Row, Col, Card, Select} from "antd";
import {connect} from "react-redux";

import {formItemLayout} from '../Create';
import {fetchDVMaterialList, setInwardDetails, checkIfCoilExists, getGradeByMaterialId, fetchPartyList} from "../../../../appRedux/actions";

const MaterialDetailsForm = (props) => {
    const Option = Select.Option;
    const {getFieldDecorator} = props.form;
    const [dataSource, setDataSource] = useState([]);
    const [approxLength, setLength] = useState(0);

    
    const handleSubmit = e => {
        e.preventDefault();
        props.updateStep(3);
        // props.form.validateFields((err, values) => {
        //     if (!err) {
        //         let length = props.params!== "" ?(parseFloat(parseFloat(props.inward.fpresent)/(parseFloat(props.inward.fThickness)* 7.85 *(props.inward.fWidth/1000))).toFixed(4))*1000:(parseFloat(parseFloat(props.inward.netWeight)/(parseFloat(props.inward.thickness)* 7.85 *(props.inward.width/1000))).toFixed(4))*1000;
        //         let inward = props.inward;
        //         if(props.params!== ""){
        //             inward.fLength = length;
        //         }else{
        //             inward.length = length
        //         }
        //         props.setInwardDetails({ ...props.inward, ...inward});
        //         props.getGradeByMaterialId(props.params!=="" ?props.inward.material.matId :props.inward.description);
        //         props.updateStep(3);
        //     }
        // });
    };
    const handleChange = (e,path) =>{
        if(path === 'material.description'){
        props.inward.material.description = e.target.value;
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
// for the edit flow
    // useEffect(() => {
    //     if (props.params !== ""){
    //         props.getGradeByMaterialId(props.inward.material.matId);
    //         const { Option } = AutoComplete;
    //         const options = props.material.materialList.filter(material => {
    //         if (material.matId===  props.inward.material.matId)
    //             return (<Option key={material.matId} value={`${material.matId}`}>
    //                     {material.description}
    //                 </Option>)
    //             });
    //             setDataSource(options);
    //     }   
    // }, [props.material]);
    // for the create flow
    // useEffect(() => {
    //     if(props.material.materialList.length > 0) {
    //         const { Option } = AutoComplete;
    //         const options = props.material.materialList.map(material => (
    //             <Option key={material.matId} value={`${material.matId}`}>
    //                 {material.description}
    //             </Option>
    //         ));
    //         setDataSource(options);
    //     }
    // }, [props.material]);
    useEffect(() => {
        props.fetchPartyList();
        props.fetchDVMaterialList({
            searchText:"",
            pageNo: "1",
            pageSize: "15",
            ipAddress: "1.1.1.1",
            requestId: "MATERIAL_LIST_GET",
            userId: ""
        });
    }, []);
    useEffect(() => {
        if(props.inward.width && props.inward.thickness && props.inward.netWeight) {
            setLength((parseFloat(parseFloat(props.inward.netWeight)/(parseFloat(props.inward.thickness)* 7.85 *(props.inward.width/1000))).toFixed(4))*1000);
            
        }
    }, [props.inward]);
    const partyName =(partyList) =>{
        partyList = partyList.find(item => item.nPartyId===Number(props.inward.partyName))
        return partyList?.partyName
    }
    console.log("props.materialDV.DVMaterialList", props.materialDV.DVMaterialList.content)
    return (
        <>
            <Col span={14}>
            {/* <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4"> */}
            <Form {...formItemLayout} className="login-form gx-pt-4">
                <Form.Item label="Inward ID">
                    {getFieldDecorator('width', {
                        // rules: [{ required: true, message: 'Please input the coil width!' }
                        // ],
                    })(
                        <Input id="coilWidth" onChange= {props.params!=="" ?(e) =>handleChange(e,'fWidth'):""}/>
                    )}
                </Form.Item>
                <Form.Item label="Item Name">
                                {getFieldDecorator("coilNumber", {
                                    rules: [{
                                        required: true,
                                        message: "Please select item!",
                                    }],
                                })(
                                    <Select
                                    id="itemName"
                                    showSearch
                                    style={{ width: "100%" }}
                                    placeholder="Select item"
                                    filterOption={(input, option) => {
                                        return option?.props?.children?.toLowerCase().includes(input.toLowerCase());
                                    }}
                                    filterSort={(optionA, optionB) =>
                                        optionA?.props?.children.toLowerCase().localeCompare(optionB?.props?.children.toLowerCase())
                                    }
                                    >
                                    {props.materialDV?.DVMaterialList?.content?.map((category) => (
                                        <Option key={category.itemId} value={category.itemId}>
                                        {`${category.itemName}: ${category.categoryEntity.categoryName} | ${category.subCategoryEntity.subcategoryName}`}
                                        </Option>
                                    ))}
                                    </Select>
                                )}
                                </Form.Item>
              
                <Row className="gx-mt-4">
                    <Col span={24} style={{ textAlign: "center"}}>
                         <Button type="primary" >
                                Add Item
                         </Button>
                    </Col>
                </Row>
            </Form>
            </Col>
            <Col span={10} className="gx-pt-4">
                <Card title="Inward Details" style={{ width: 500, padding: '0.5px 0.5px'}}>
                    {props.inward.purposeType && <p>Purpose Type : {props.inward.purposeType}</p>}
                    <p>Vendor Name : {props.params !== "" && props.inward.party ? props.inward.party?.partyName:partyName(props.party.partyList)}</p>
                    <p>Vendor ID : 1234{props.params !== "" && props.inward.party ? props.inward.party?.partyName:partyName(props.party.partyList)} | Vendor Batch No. :</p>
                    {/* <p>Transporter Name : {props.params !== "" && props.inward.party ? props.inward.party?.partyName:partyName(props.party.partyList)}</p>
                    <p>Transporter Phone : {props.params !== "" && props.inward.party ? props.inward.party?.partyName:partyName(props.party.partyList)}</p> */}
                   
                </Card>
            </Col>
            <Row className="gx-ml-2">
                <Col className="gx-ml-1">
                        <AutoComplete
                            // style={{width: 200}}
                            placeholder="Select item"
                            dataSource={dataSource}
                            onChange= {props.params!=="" ?(e) =>handleChange(e,'material.description'):""}
                            filterOption={(inputValue, option) => {
                                return option.props.children?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 || false
                            }
                            }
                        />
                </Col>
                <Col className="gx-ml-1">
                {/* <Select value={selectedUnitmm} onChange={handleUnitChangemm} placeholder='Select unit'> */}
                <Select >
                        <Option value="inches">Meters</Option>
                        <Option value="feet">Pieces</Option>
                        <Option value="feet">Feet</Option>
                    </Select>
                </Col>
                <Col className="gx-ml-1">
                <Input></Input>
                </Col>
                <Col className="gx-ml-1">
                <Input></Input>
                </Col>
                <Col className="gx-ml-1">
                <Input></Input>
                </Col>
                <Col className="gx-ml-1">
                <Input></Input>
                </Col>
                <Col className="gx-ml-1">
                <Input></Input>
                </Col>
                <Col className="gx-ml-1">
                <Input></Input>
                </Col>
                <Col className="gx-ml-1">
                <Input></Input>
                </Col>
                <Col className="gx-ml-1">
                <Input></Input>
                </Col>
            </Row>
            {/* <Row className="gx-mt-4"> */}
                    <Col span={24} style={{ textAlign: "left"}}>
                        <Button style={{ marginLeft: 200 }} onClick={() => props.updateStep(1)}>
                            <Icon type="left"/>Back
                        </Button>
                        {/* <Button type="primary" htmlType="submit">
                            Forward<Icon type="right"/>
                        </Button> */}
                         <Button type="primary" onClick={handleSubmit}>
                                Forward
                         </Button>
                    </Col>
                {/* </Row> */}
        </>
    )
}

const mapStateToProps = state => ({
    materialDV: state.materialDV,
    inward: state.inward.inward,
    material: state.material,
    inwardStatus: state.inward,
    party: state.party
});

const MaterialDetails = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            coilNumber: Form.createFormField({
                ...props.inward.coilNumber,
                value: (props.inward.coilNumber) ? props.inward.coilNumber : '',
            }),
            // description: Form.createFormField({
            //     ...props.inward.description,
            //     value: props.params !== "" ?props.inward.material.description :(props.inward.description) ? (props.inward.description):'' ,
            // }),
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
})(MaterialDetailsForm);

export default connect(mapStateToProps, {
    setInwardDetails,
    checkIfCoilExists,
    fetchPartyList,
    getGradeByMaterialId,
    fetchDVMaterialList
})(MaterialDetails);
