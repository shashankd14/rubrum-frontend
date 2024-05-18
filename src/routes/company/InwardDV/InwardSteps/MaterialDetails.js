import React, {useEffect, useState} from "react";
import {AutoComplete, Form, Input, Button, Icon, Row, Col, Card, Select, Collapse} from "antd";
import {connect} from "react-redux";

import {formItemLayout} from '../Create';
import {fetchDVMaterialList, fetchVendorList, setInwardDVDetails, checkIfCoilExists, getGradeByMaterialId, fetchPartyList} from "../../../../appRedux/actions";
import { generateInwardId} from "../../../../appRedux/actions";
const MaterialDetailsForm = (props) => {
    const Option = Select.Option;
    const { Panel } = Collapse;
    const {getFieldDecorator, setFieldsValue} = props.form;
    const [dataSource, setDataSource] = useState([]);
    const [approxLength, setLength] = useState(0);

    const handleSubmit = e => {
        debugger
        e.preventDefault();
        props.updateStep(3);
        props.setInwardDVDetails({ ...props.inwardDV, itemsList:dataArr});

        props.form.validateFields((err, values) => {
            if (!err) {
                 props.updateStep(3);
                 
        props.setInwardDVDetails({ ...props.inwardDV, itemsList:dataArr});
            }
        });
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
    // useEffect(() => {
    //     if(props.inward.width && props.inward.thickness && props.inward.netWeight) {
    //         setLength((parseFloat(parseFloat(props.inward.netWeight)/(parseFloat(props.inward.thickness)* 7.85 *(props.inward.width/1000))).toFixed(4))*1000);
            
    //     }
    // }, [props.inward]);
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
    const [dataArr, setDataArr] = useState(props?.inwardDV?.itemsList || []);
    const defaultDataArrProps = {
        "itemId": "",
        "inwardItemId": "",
        "inwardId": "",
        "unit": "",
        "unitVolume": 0,
        "netWeight": 0,
        "rate": 0,
        "volume": 0,
        "actualNoofPieces": "0",
        "theoreticalWeight": "0",
        "weightVariance": "0",
        "theoreticalNoofPieces": "0"
    };

    const handleAddItem = () => {
        debugger
        if (selectedItem) {
            const newDataItem = {
                ...defaultDataArrProps,
                itemId: selectedItem.itemId // Assuming selectedItem has an itemId property
            };
    
            setDataArr(prevDataArr => [...prevDataArr, newDataItem]);
            // setExpandedList(prevExpandedList => [...prevExpandedList, selectedItem]);
            setSelectedItem(null);
    console.log("11111111111111", dataArr)
            console.log("Expanded List:", expandedList);
            console.log("Selected Item:", selectedItem);
        }
    };

    const handleChange = (value, option) => {
        debugger
        const itemId = parseInt(option.key); // Convert to number
        const selectedItemDetails = props.materialDV.DVMaterialList.content.find(item => {
            return parseInt(item.itemId) === itemId; // Convert to number
        });
        if (selectedItemDetails) {
            setSelectedItem(selectedItemDetails);
        } else {
            // Handle case where item is not found
            console.error(`Item with ID ${itemId} not found`);
        }
    };

    const getInwardItem = (itemId) => {
        return props.materialDV?.DVMaterialList?.content.find(e=>e.itemId === itemId);
    }


    const columnLabels = ["", "Unit", "Unit value", "Net weight", "Rate", "Value", "Actual no.of pcs", "Theoretical weight", "Weight variance", "Theoretical no.of pcs"];

    const [netWeight, setNetWeights] = useState(Array(dataArr.length).fill(0));

const handleNetWeightChange = (e, index, value) => {
    const newValue = parseFloat(e.target.value || 0);
    const newNetWeights = [...netWeight];
    newNetWeights[index] = newValue;
    setNetWeights(newNetWeights);
    setNetWeightValues(newNetWeights)
    dataArr[index][value] = e.target.value;
};
const totalNetWeight = netWeight.reduce((total, current) => total + current, 0);

const [unitValues, setUnitValues] = useState(Array(dataArr.length).fill(''));
const [rateValues, setRateValues] = useState(Array(dataArr.length).fill(''));
const [valueValues, setValueValues] = useState(Array(dataArr.length).fill(''));

// Update unit value state when input changes
const handleUnitChange = (e, index, value) => {
        const newUnitValues = [...unitValues];
        newUnitValues[index] = e.target.value;
        setUnitValues(newUnitValues);
     dataArr[index][value] = e.target.value;
     //for value calculation
     dataArr[index]["volume"] =  dataArr[index]["rate"] * dataArr[index][value];
     calculateTotalVolumeAndWaight();
};

// Update rate value state when input changes
const handleRateChange = (e, index, value) => {
    const newRateValues = [...rateValues];
    newRateValues[index] = e.target.value;
    setRateValues(newRateValues);
    dataArr[index][value] = e.target.value;
    //for value calculation
    dataArr[index]["volume"] =  dataArr[index]["unitVolume"] * dataArr[index][value];
    calculateTotalVolumeAndWaight();
};

function calculateTotalVolumeAndWaight() {
    let totalNetWeight = 0;
    dataArr.forEach(item => {
        totalNetWeight += parseFloat(item.netWeight) || 0;
    });

    let volumeTotal = 0;
    dataArr.forEach(item => {
        volumeTotal += parseFloat(item.volume) || 0;
    });
    setFieldsValue({
        totalVolume: volumeTotal,
        totalWeight: totalNetWeight,
    });
}


const [totalValue, setTotalValue] = useState(0);

// Calculate total value by summing up individual values
const calculateTotalValue = () => {
    let total = 0;
    valueValues.forEach(value => {
        total += parseFloat(value);
    });
    return total;
};

// Update total value whenever individual values change
useEffect(() => {
    const newTotalValue = calculateTotalValue();
    setTotalValue(newTotalValue);
}, [valueValues]);

const [selectedUnit, setSelectedUnit] = useState('meters');

// Handler for unit change
const handleUnitOptionChange = (value) => {
    setSelectedUnit(value);
};
const calculateTheoreticalWeight = (item, selectedUnit, unitValue) => {
    let rate;
    switch (selectedUnit) {
        case 'METERS':
            rate = item.perMeter;
            break;
        case 'PIECES':
            rate = item.perPC;
            break;
        case 'FEET':
            rate = item.perFeet;
            break;
        default:
            rate = 0;
    }
    // If rate is available, calculate theoretical weight
    if (rate) {
        return unitValue * rate;
    } else {
        return '';
    }
};
const [netWeightValues, setNetWeightValues] = useState(Array(dataArr.length).fill(''));
// Define function to calculate weight variance
const calculateWeightVariance = (theoreticalWeight, netWeight) => {
    return theoreticalWeight - netWeight;
};

const onDataChange = (e, index, value) => {
     debugger;
        setSelectedUnit(e);
        console.log(e, index);
        dataArr[index][value] = e;
        console.log(dataArr);    
};

const onBlurrChange = (e, index, value) => {
    debugger;
       console.log(e, index);
       dataArr[index][value] = e.target.value;
       console.log(dataArr);    
};

const [actualPieces, setActualPieces] = useState([]);

const handleActualPiecesChange = (e, index, value) => {
    const newActualPieces = [...actualPieces];
    newActualPieces[index] = e.target.value;
    setActualPieces(newActualPieces);
    dataArr[index][value] = e.target.value;
};

const calculateTheoreticalPieces = (perPiece, actualPieces) => {
    return perPiece * actualPieces;
};

    return (
        <>
        <div>
        <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4">
            <Row gutter={16}>
            <Col span={14}>
            {/* <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4"> */}
                <Form.Item label="Inward ID">
                    {getFieldDecorator('inwardId', {
                        initialValue: props.inwardId?.seqNo
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
            {/* </Form> */}
            </Col>
            <Col span={10} >
                <Card title="Inward Details" style={{ width: 500, padding: '0.5px 0.5px'}}>
                    {props.inwardDV.purposeType && <p>Purpose Type : {props.inwardDV.purposeType}</p>}
                    {props.inwardDV.vendorName && <p>Vendor Name : {vendorName}</p>}
                    {props.inwardDV.vendorName && <p>Vendor ID : {props.inwardDV.vendorName}</p>}
                </Card>
            </Col>
            </Row>
            <Col span={24}>
            <Row gutter={[16, 16]}>
                {columnLabels.map((label, index) => (
                    <Col key={index} lg={index === 0 ? 5 : 2} md={2} sm={24} xs={24} style={{ marginLeft: index < 2 ? '10px' : 0 }}>
                        <span>{label}</span>
                    </Col>
                ))}
            </Row>
            <Row gutter={[16, 16]} className="gx-ml-2">
                    {dataArr.map((item, index) => {
                        let inwardItem = getInwardItem(item.itemId);
                        return <React.Fragment key={index}>
                            <Col lg={5} md={5} sm={24} xs={24} style={{ marginRight: '-20' }}>
                            {/* <Form.Item style={{width: '100%'}}> */}
                                <Collapse>
                                    <Panel header={`${inwardItem.itemName}: ${inwardItem.categoryEntity?.categoryName || '-'} | ${inwardItem.subCategoryEntity?.subcategoryName || '-'}`} key={index}>
                                        <p>Item HSN code: {inwardItem.itemHsnCode}</p>
                                        <p>Item code: {inwardItem.itemCode}</p>
                                        <p>Item grade: {inwardItem.itemCode}</p>
                                        <p>Item ID: {inwardItem.itemId}</p>
                                        <p>Main category: {inwardItem.categoryEntity?.categoryName || '-'}</p>
                                        <p>Sub category: {inwardItem.subCategoryEntity?.subcategoryName || '-'}</p>
                                        <p>Main category HSN code: {inwardItem.categoryEntity?.categoryHsnCode || '-'}</p>
                                        <p>Display name: {inwardItem.categoryEntity?.displayName || '-'}</p>
                                        <p>Brand name: {inwardItem.categoryEntity?.brandName || '-'}</p>
                                        <p>Manufacturers name: {inwardItem.categoryEntity?.manufacturerName || '-'}</p>
                                        <p>Per Meter: {inwardItem.perMeter}</p>
                                        <p>Per Feet: {inwardItem.perFeet}</p>
                                        <p>Per Pc: {inwardItem.perPC}</p>
                                        <p>Additional Parameters:</p>
                                        <ul>
                                            {inwardItem.additionalParams && JSON.parse(inwardItem.additionalParams).map((param, paramIndex) => (
                                                <li key={paramIndex}>
                                                    {param.parameterName}: {param.units} {param.unitType}
                                                </li>
                                            ))}
                                        </ul>
                                        {inwardItem.itemImage && <img src={inwardItem.itemImage} alt="Item Image"/>}
                                        {inwardItem.crossSectionalImage && <img src={inwardItem.crossSectionalImage} alt="Cross-sectional Image"/>} 
                                    </Panel>
                                </Collapse>
                            {/* </Form.Item> */}
                            </Col>
                            <Col lg={2} md={2} sm={24} xs={24} style={{ marginRight: '-20' }}>
                            {/* <Form.Item> */}
                                {/* <Select style={{ width: '100%' }}  defaultValue="meters" onChange={onDataChange}> */}
                                <Select name='unit' style={{ width: '100%' }}  defaultValue="meters" onChange={(e) => {onDataChange(e, index, 'unit')}}>
                                    <Option value="METERS">Meters</Option>
                                    <Option value="PIECES">Pieces</Option>
                                    <Option value="FEET">Feet</Option>
                                </Select>
                            {/* </Form.Item> */}
                            </Col>
                            <Col lg={2} md={2} sm={24} xs={24}>
                                {/* unit value */}
                                <Input name='unitVolume' onChange={(e) => handleUnitChange(e, index, 'unitVolume')} value={unitValues[index]} ></Input>
                              
                            </Col>
                            <Col lg={2} md={2} sm={24} xs={24}>
                                {/* net weight */}
                                <Input name='netWeight' onChange={(e) => handleNetWeightChange(e, index, 'netWeight')}></Input>
                               
                            </Col>
                            <Col lg={2} md={2} sm={24} xs={24}>
                                {/* Rate */}
                                <Input name='rate' onChange={(e) => handleRateChange(e, index, 'rate')} value={dataArr[index]["rate"]}></Input>
                               
                            </Col>
                            <Col lg={2} md={2} sm={24} xs={24}>
                                {/*  value */}
                                {/* <Input name='volume' onKeyUp={(e) => onDataChange(e, index, 'volume')} value={valueValues[index]} disabled></Input> */}
                                <Input name='volume' value={dataArr[index]["volume"]} disabled></Input>
                                
                            </Col>
                            <Col lg={2} md={2} sm={24} xs={24}>
                                {/* Actual no of pieces */}
                                <Input name='actualNoofPieces' onChange={(e) => handleActualPiecesChange(e, index, 'actualNoofPieces')} value={actualPieces[index]}></Input>
                            </Col>
                            <Col lg={2} md={2} sm={24} xs={24}>
                                {/* theoretical weight */}
                                <Input name='theoreticalWeight' onFocus={(e) => onBlurrChange(e, index, 'theoreticalWeight')} value={calculateTheoreticalWeight(item, selectedUnit, unitValues[index])} ></Input>
                               
                            </Col>
                            <Col lg={2} md={2} sm={24} xs={24}>
                                {/*  weight varience */}
                                <Input name='weightVariance' onKeyUp={(e) => onBlurrChange(e, index, 'weightVariance')} value={calculateWeightVariance(calculateTheoreticalWeight(item, selectedUnit, unitValues[index]), netWeightValues[index])} ></Input>
                               
                            </Col>
                            <Col lg={2} md={2} sm={24} xs={24}>
                                {/* theoretical no of pieces */}
                                <Input name='theoreticalNoofPieces' onBlur={(e) => onBlurrChange(e, index, 'theoreticalNoofPieces')} value={calculateTheoreticalPieces(item.perPC, actualPieces[index])} ></Input>
                            </Col>
                            
                        </React.Fragment>
})}
                </Row>
                   
                <div className="gx-mt-4" style={{ backgroundColor: 'rgba(135, 206, 235, 0.2)', padding: '5px' }} >
                        <Row gutter={10} >
                            <Col span={9} className="gx-mt-2" style={{textAlign: 'right'}}>
                            <h3>Total</h3> 
                            </Col>
                            <Col span={3}>
                            {/* <Input style={{ backgroundColor: 'blue', color: 'white' }} value={totalNetWeight}/> */}
                            <Form.Item >
                            {getFieldDecorator('totalWeight', {
                                initialValue: props.inwardDV.totalWeight
                            })(
                                <Input id="totalWeight" value={props.inwardDV.totalWeight} style={{ backgroundColor: 'blue', color: 'white'}}/>
                            )}
                        </Form.Item>
                            </Col>
                            <Col span={1}></Col>
                            <Col span={3}>
                            {/* <Input style={{ backgroundColor: 'blue', color: 'white' }} value={totalValue}/> */}
                            <Form.Item >
                            {getFieldDecorator('totalVolume', {
                                initialValue: props.inwardDV.totalVolume
                            })(
                                <Input id="totalVolume" value={props.inwardDV.totalVolume} style={{ backgroundColor: 'blue', color: 'white'}}/>
                            )}
                        </Form.Item>
                            </Col>
                        </Row>
                        </div>
                {/* </Form> */}
                </Col>
            {/* <Row className="gx-mt-4"> */}
                    <Col span={24} style={{ textAlign: "left"}} className="gx-mt-5 gx-ml-50">
                        <Button style={{ marginLeft: 200 }} onClick={() => props.updateStep(1)}>
                            <Icon type="left"/>Back
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Forward<Icon type="right"/>
                        </Button>
                         {/* <Button type="primary" onClick={handleSubmit}>
                                Forward
                         </Button> */}
                    </Col>
                    </Form>
               </div> 
        </>
    )
}

const mapStateToProps = state => ({
    materialDV: state.materialDV,
    inwardId: state.inwardDV.inwardId,
    material: state.materialDV,
    inwardStatus: state.inward,
    party: state.party,
    inwardDV: state.inwardDV.inward,
    vendor: state.vendor.vendorList,
});

const MaterialDetails = Form.create({
    onFieldsChange(props, changedFields) {
        console.log("propsppppp onFields change", props)
    },
    mapPropsToFields(props) {
        console.log("propsppppp mapPropsToField", props)
        return {
            inwardId: Form.createFormField({
                ...props.inwardDV.inwardId,
                value: (props.inwardDV.inwardId) ? props.inwardDV.inwardId : props.inwardId?.seqNo,
            }),
            itemName: Form.createFormField({
                ...props.inwardDV.itemName,
                value: (props.inwardDV.itemName) ? props.inwardDV.itemName : '',
            }),
            totalVolume: Form.createFormField({
                // ...props.inwardDV.totalVolume,
                 value: props.inwardDV.totalVolume,
            }),
            totalWeight: Form.createFormField({
                // ...props.inwardDV.totalWeight,
                 value: props.inwardDV.totalWeight,
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
