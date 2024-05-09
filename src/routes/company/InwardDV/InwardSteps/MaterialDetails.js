import React, {useEffect, useState} from "react";
import {AutoComplete, Form, Input, Button, Icon, Row, Col, Card, Select, Collapse} from "antd";
import {connect} from "react-redux";

import {formItemLayout} from '../Create';
import {fetchDVMaterialList, fetchVendorList, setInwardDVDetails, checkIfCoilExists, getGradeByMaterialId, fetchPartyList} from "../../../../appRedux/actions";
import { generateInwardId} from "../../../../appRedux/actions";
const MaterialDetailsForm = (props) => {
    const Option = Select.Option;
    const { Panel } = Collapse;
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
        //         props.setInwardDVDetails({ ...props.inward, ...inward});
        //         props.getGradeByMaterialId(props.params!=="" ?props.inward.material.matId :props.inward.description);
        //         props.updateStep(3);
        //     }
        // });
    };
    // const handleChange = (e,path) =>{
    //     if(path === 'material.description'){
    //     props.inward.material.description = e.target.value;
    //     } else if (path === 'fWidth'){
    //         props.inward.fWidth = e.target.value;
    //     }
    //     else if (path === 'fThickness'){
    //         props.inward.fThickness = e.target.value;
    //     }
    //     else if (path === 'fpresent'){
    //         props.inward.fpresent = e.target.value;
    //     } else if (path === 'fQuantity') {
    //         props.inward.fQuantity = e.target.value;
    //     }
    // }
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
        props.generateInwardId({
            fieldName: "INWARD_ITEM_ID",
            ipAddress: "1.1.1.1",
            requestId: "GENERATE_SEQ",
            userId: ""
        })
        props.fetchVendorList({
            searchText:"",
            pageNo: "1",
            pageSize: "15",
            ipAddress: "1.1.1.1",
            requestId: "VENDOR_LIST_GET",
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
    const [vendorBatchNo, setVendorBatchNo] = useState();
    const [vendorName, setVendorName] = useState();
    useEffect(() => {
      debugger
      const vendorId = props.inwardDV.vendorName;
      let vendorBatchNo = '';
      let vendorName = '';
      const response = props.vendor.content
          const selectedVendorName = response.find(vendor => vendor.vendorId === vendorId);
          vendorName = selectedVendorName.vendorName;
      setVendorBatchNo(vendorBatchNo);
      setVendorName(vendorName);
    },[])

    
    const [selectedItem, setSelectedItem] = useState(null);
    const [expandedList, setExpandedList] = useState([]);

    const handleAddItem = () => {
        if (selectedItem) {
            setExpandedList([...expandedList, selectedItem]);
            setSelectedItem(null);
        }
    };

    // const handleChange = (value, option) => {
    //     setSelectedItem(option.props.children);
    // };
    const handleChange = (value, option) => {
        debugger
        const itemId = parseInt(option.key); // Convert to number
        console.log("Selected Item ID:", itemId);
        console.log("Material List Content:", props.materialDV.DVMaterialList.content);
        const selectedItemDetails = props.materialDV.DVMaterialList.content.find(item => {
            console.log("Comparing with Item ID:", item.itemId);
            return parseInt(item.itemId) === itemId; // Convert to number
        });
        console.log("Selected Item Details:", selectedItemDetails);
        if (selectedItemDetails) {
            setSelectedItem(selectedItemDetails);
        } else {
            // Handle case where item is not found
            console.error(`Item with ID ${itemId} not found`);
        }
    };
    const columnLabels = ["Item details", "Unit", "Unit value", "Net weight", "Rate", "Value", "Actual no.of pcs", "Theoretical weight", "Weight variance", "Theoretical no.of pcs"];
    
    return (
        <>
            <Col span={14}>
            {/* <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4"> */}
            <Form {...formItemLayout} className="login-form gx-pt-4">
                <Form.Item label="Inward ID">
                    {getFieldDecorator('inwardId', {
                        initialValue: props.inwardId?.seqNo
                        // rules: [{ required: true, message: 'Please input the coil width!' }
                        // ],
                    })(
                        <Input id="inwardId" disabled/>
                    )}
                </Form.Item>
                <Form.Item label="Item Name">
                                {getFieldDecorator("itemName", {
                                    rules: [{
                                        required: true,
                                        message: "Please select item!",
                                    }],
                                })(
                                    <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="Select item"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                    filterSort={(optionA, optionB) =>
                                        optionA.props.children.toLowerCase().localeCompare(optionB.props.children.toLowerCase())
                                    }
                                    onChange={handleChange}
                                    value={selectedItem && selectedItem.itemId}
                                >
                                    {props.materialDV?.DVMaterialList?.content?.map((category) => (
                                        <Option key={category.itemId} value={category.itemId}>
                                            {`${category.itemName}: ${category.categoryEntity?.categoryName || '-'} | ${
                                                category.subCategoryEntity?.subcategoryName || '-'
                                            }`}
                                        </Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>
              
                <Row className="gx-mt-4">
                    <Col span={24} style={{ textAlign: "center"}}>
                         <Button type="primary" onClick={handleAddItem}>
                                Add Item
                         </Button>
                    </Col>
                </Row>
            </Form>
            </Col>
            <Col span={10} className="gx-pt-4">
                <Card title="Inward Details" style={{ width: 500, padding: '0.5px 0.5px'}}>
                    {props.inwardDV.purposeType && <p>Purpose Type : {props.inwardDV.purposeType}</p>}
                    {props.inwardDV.vendorName && <p>Vendor Name : {vendorName}</p>}
                    {props.inwardDV.vendorName && <p>Vendor ID : {props.inwardDV.vendorName}</p>}
                    {/* {props.inwardDV.vendorId && <p>Vendor BatchNo : {vendorBatchNo}</p>} */}
                   
                </Card>
            </Col>
            
            <Row gutter={[16, 16]}>
                {columnLabels.map((label, index) => (
                    <Col key={index} lg={index === 0 ? 5 : 2} md={2} sm={24} xs={24}>
                        <span>{label}</span>
                    </Col>
                ))}
            </Row>
            <Row gutter={[16, 16]} className="gx-ml-2">
                    {expandedList.map((item, index) => (
                        <React.Fragment key={index}>
                            <Col lg={5} md={5} sm={24} xs={24}>
                                <Collapse>
                                    <Panel header={`${item.itemName}: ${item.categoryEntity?.categoryName || '-'} | ${item.subCategoryEntity?.subcategoryName || '-'}`} key={index}>
                                        <p>Item HSN code: {item.itemHsnCode}</p>
                                        <p>Item code: {item.itemCode}</p>
                                        <p>Item grade: {item.itemCode}</p>
                                        <p>Item ID: {item.itemId}</p>
                                        <p>Main category: {item.categoryEntity?.categoryName || '-'}</p>
                                        <p>Sub category: {item.subCategoryEntity?.subcategoryName || '-'}</p>
                                        <p>Main category HSN code: {item.categoryEntity?.categoryHsnCode || '-'}</p>
                                        <p>Display name: {item.categoryEntity?.displayName || '-'}</p>
                                        <p>Brand name: {item.categoryEntity?.brandName || '-'}</p>
                                        <p>Manufacturers name: {item.categoryEntity?.manufacturerName || '-'}</p>
                                        <p>Additional Parameters:</p>
                                        <ul>
                                            {item.additionalParams && JSON.parse(item.additionalParams).map((param, paramIndex) => (
                                                <li key={paramIndex}>
                                                    {param.parameterName}: {param.units} {param.unitType}
                                                </li>
                                            ))}
                                        </ul>
                                        {item.itemImage && <img src={item.itemImage} alt="Item Image"/>}
                                        {item.crossSectionalImage && <img src={item.crossSectionalImage} alt="Cross-sectional Image"/>} 
                                    </Panel>
                                </Collapse>
                            </Col>
                            <Col lg={2} md={2} sm={24} xs={24}>
                                <Select style={{ width: '100%' }} defaultValue="Unit">
                                    <Option value="meters">Meters</Option>
                                    <Option value="pieces">Pieces</Option>
                                    <Option value="feet">Feet</Option>
                                </Select>
                            </Col>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((inputIndex) => (
                                <Col key={inputIndex} lg={2} md={2} sm={24} xs={24}>
                                    {/* <Input style={{ width: '100%' }} placeholder={`Input ${item.itemId}-${inputIndex}`}/> */}
                                    <Input style={{ width: '100%' }} />
                                </Col>
                            ))}
                        </React.Fragment>
                    ))}
                </Row>

            {/* <Row className="gx-mt-4"> */}
                    <Col span={24} style={{ textAlign: "left"}} className="gx-mt-5 gx-ml-50">
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
    inwardId: state.inwardDV.inwardId,
    inward: state.inward.inward,
    material: state.material,
    inwardStatus: state.inward,
    party: state.party,
    inwardDV: state.inwardDV.inward,
    vendor: state.vendor.vendorList,
});

const MaterialDetails = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            inwardId: Form.createFormField({
                ...props.inwardDV.inwardId,
                value: (props.inwardDV.inwardId) ? props.inwardDV.inwardId : props.inwardId?.seqNo,
            }),
            itemName: Form.createFormField({
                ...props.inwardDV.itemName,
                value: (props.inwardDV.itemName) ? props.inwardDV.itemName : '',
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
        props.setInwardDVDetails({ ...props.inwardDV, ...values});
    },
})(MaterialDetailsForm);

export default connect(mapStateToProps, {
    setInwardDVDetails,
    checkIfCoilExists,
    fetchPartyList,
    getGradeByMaterialId,
    fetchDVMaterialList,
    generateInwardId,
    fetchVendorList
})(MaterialDetails);
