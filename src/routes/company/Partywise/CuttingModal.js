import {Button, Card, Col, DatePicker, Divider, Form, Input, Modal, Row, Table, Select, Icon,Tabs, message} from "antd";
import React, {useEffect, useState, useRef, useContext} from "react";
import {connect, useSelector} from "react-redux";
import moment from "moment";
import {setProcessDetails, saveCuttingInstruction,resetInstruction ,updateInstruction, deleteInstructionById} from '../../../appRedux/actions/Inward';
import { showMessage } from "../../../appRedux/actions";
import {APPLICATION_DATE_FORMAT} from '../../../constants';
import { indexOf } from "lodash-es";
import { sheets } from "less";

const Option = Select.Option;

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

const CreateCuttingDetailsForm = (props) => {
    const TabPane = Tabs.TabPane;
    const {getFieldDecorator} = props.form;
    let loading = '';
    const [cuts, setCuts] = useState([]);
    const [mode, setMode] = useState('top');
    const [balanced, setBalanced] = useState(true);
    const [tweight, settweight]= useState(0);
    const [totalActualweight, setTotalActualWeight] = useState(0);
    const [no, setNo]= useState();
    const lengthValue = props.coilDetails.instruction && props.coilDetails.instruction.length > 0 ? props.plannedLength(props.coilDetails) : props.coilDetails.fLength ? props.coilDetails.fLength  : props.plannedLength(props.coilDetails)
    const widthValue = props.coilDetails.instruction && props.coilDetails.instruction.length > 0  ? props.plannedWidth(props.coilDetails):  props.coilDetails.fWidth ? props.coilDetails.fWidth  : props.plannedWidth(props.coilDetails);
    const WeightValue = props.coilDetails.instruction && props.coilDetails.instruction.length > 0  ? props.plannedWeight(props.coilDetails):  props.coilDetails.fpresent ? props.coilDetails.fpresent  : props.plannedWeight(props.coilDetails);
    const [length, setlength]= useState(lengthValue);
    const [width, setwidth] = useState(widthValue);
    const [cutValue, setCutValue] = useState([]);
    const [objValue,setObjValue]= useState();
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    
    // const dataSource= props.wip?((props.coilDetails && props.coilDetails.instruction)? props.coilDetails.instruction:props.coilDetails.childInstructions): cuts;
    const [tableData, setTableData] = useState(props.wip?(props.childCoil ?props.coilDetails :(props.coilDetails && props.coilDetails.instruction)? props.coilDetails.instruction:props.coilDetails.childInstructions): cuts);
    const columns=[

        {
            title: 'Serial No',
            dataIndex:'instructionId',
            key: 'instructionId',
                                  
        },
        {
            title: 'Process Date',
            dataIndex:'instructionDate',
            render (value) {
                return moment(value).format('DD/MM/YYYY');
            },
            key: 'instructionDate',
        },
        {
            title: 'Length',
            dataIndex:'plannedLength',
            key: 'plannedLength',
        },
        {
            title: 'Actual Length',
            dataIndex:'actualLength',
            render: (text, record, index) => (
                <Input value={record.actualLength}  onChange={onInputChange("actualLength", index)} />
              )
        },
        {
            title: 'No of Sheets',
            dataIndex:'plannedNoOfPieces',
            key: 'plannedNoOfPieces',
        },
        {
            title: 'Actual No of Sheets',
            dataIndex:'actualNoOfPieces',
            render: (text, record, index) => (
                <Input value={record.actualNoOfPieces} onChange={onInputChange("actualNoOfPieces", index)} />
              )
        },
        {
            title: 'Weight',
            dataIndex:'plannedWeight',
            key:'plannedWeight'
        },
        {
            title: 'Actual Weight',
            dataIndex:'actualWeight',
            render: (text, record, index) => (
                <Input value={record.actualWeight}  onChange={onInputChange("actualWeight", index)} onBlur={() => {
                    let actualTotalWeight = cuts.map(i => i.actualWeight);
                    actualTotalWeight = actualTotalWeight.filter(i => i !== undefined);
                    actualTotalWeight = actualTotalWeight.length > 0 ? actualTotalWeight.reduce((total, num) => Number(total) + Number(num)) : 0;
                    setTotalActualWeight(actualTotalWeight);
                }} />
              )
        },
        {
            title: 'Classification',
            dataIndex: 'packetClassification',
            render: (text, record, index) => {
                return <Select style={{width: '100%'}} value={record?.packetClassification?.classificationId} onChange={onInputChange("packetClassification", index, 'select')} >
                    {props.classificationList?.map(item => {
                        return <Option value={item.classificationId}>{item.classificationName}</Option>
                    })}
                </Select>
            }
        }
    ];
    const columnsPlan=[
        {
            title: 'Serial No',
            dataIndex:'instructionId',
            key: 'instructionId',
           render : (text,record,index) => {
                return (index+1);
           }
        },
        {
            title: 'Process Date',
            dataIndex:'processDate',
            render (value) {
                return moment(value).format('DD/MM/YYYY');
            },
            key: 'processDate',
        },
        {
            title: 'Length',
            dataIndex:'plannedLength',
            key: 'plannedLength',
        },
        {
            title: 'No of Sheets',
            dataIndex:'plannedNoOfPieces',
            key: 'plannedNoOfPieces',
        },
        {
            title: 'Weight',
            dataIndex:'plannedWeight',
            key:'plannedWeight',
        },
        {
            title:'Actions',
            dataIndex:'actions',
            render: (text, record,index) => (
                <span>
                <i className="icon icon-edit" onClick={() => {onEdit(record,index);}} /> <></>
                <i className="icon icon-trash" onClick={(e) => {onDelete(record, e); }}/>
                </span>
              ),
              key:'action',
        }
    ];
    const columnsSlit=[
        {
            title: 'Serial No',
            dataIndex:'instructionId',
            key: 'instructionId',
           render : (text,record,index) => {
                return (index+1);
           }
        },
        {
            title: 'Process Date',
            dataIndex:'processDate',
            render (value) {
                return moment(value).format('DD/MM/YYYY');
            },
            key: 'processDate',
        },
        {
            title: 'Length',
            dataIndex:'plannedLength',
            key: 'plannedLength',
        },
        {
            title: 'No of Sheets',
            dataIndex:'plannedNoOfPieces',
            key: 'plannedNoOfPieces',
        },
        {
            title: 'Weight',
            dataIndex:'plannedWeight',
            key:'plannedWeight',
        },
        {
            title: 'Cut-Length',
            dataIndex: 'plannedLength',
            render: (text, record, index) => {
                return <Input onChange={onInputChange("plannedLength", index)} />
            }
        },
        {
            title: 'No Of Cut Pieces',
            dataIndex: 'plannedNoOfPieces',
            render: (text, record, index) => {
                return <Input onChange={onInputChange("plannedNoOfPieces", index)} onBlur={()=>{setTimeout(() => {
                    if(cutValue.length>0){
                        let cutIndex = cutValue.map(item =>{
                            if(cutValue.indexOf(item) === index){
                                let length = item.plannedLength;
                                let pieces = item.plannedNoOfPieces;
                                item.plannedWeight = Math.round( 0.00000785*parseFloat(record.plannedWidth)*parseFloat(props.inward.plan.fThickness)*parseFloat(length)*parseFloat(pieces))
                            }
                            return item;
                        });
                        setCutValue(cutIndex);
                    }
                }, 2000);
                    
                }}/>
            }
        },
        {
            title: 'Cut- Weight',
            dataIndex: 'plannedWeight',
            render: (text, record, index) => {
                return <Input value={cutValue && cutValue[index]?.plannedWeight?cutValue[index].plannedWeight: record.plannedWeight} disabled={true}/>
            }
        },
        {
            title:'Actions',
            dataIndex:'actions',
            render: (text, record,index) => (
                <span>
                <i className="icon icon-edit" onClick={() => {onEdit(record,index);}} /> <></>
                <i className="icon icon-trash" onClick={(e) => {onDelete(record, e); }}/>
                </span>
              ),
              key:'action',
        }
    ];

    const onEdit=(record,index) => {
        const {form} = props;
        const data= props.record;
        if(indexOf(data)<4 )
        {
            let values= {
                processDate: record.processDate ,
                length:record.length,
                no:record.no ,
                weight:record.weight,
                index:index
            }
            props.setProcessDetails(values);
        }
    };

    const onDelete = (record, e) => {
        e.preventDefault();
        const data = cuts.filter(record => cuts.indexOf(record) );
        props.deleteInstructionById(record.instructionId)
        setCuts(data);
    };
    const onChange=()=>{
        props.form.setFieldsValue({
            no: no
        });
    }
    const handleModeChange = (e) => {
        setMode(e.target.value);
    };

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                if((Number(tweight)+values.weight) > WeightValue){
                    message.error('Weight greater than available weight', 2);
                }else{
                    setCuts([...cuts, {...props.inward.process,
                        plannedLength: props.inward.process.length,
                        plannedWidth: props.inward.process.width,
                        plannedNoOfPieces: props.inward.process.no,
                        plannedWeight: props.inward.process.weight,
                        plannedWidth: props.coilDetails.plannedWidth,
                        inwardId: props.coilDetails.inwardEntryId ? props.coilDetails.inwardEntryId : "",
                        instructionId: props.coilDetails.instructionId ? props.coilDetails.instructionId : ""}]);
                        props.resetInstruction();
                }
               
            }
        });
    };

    
    useEffect(() => {
        if(props.inward.process.length && props.inward.process.no) {
            if(props.coilDetails.instructionId)

                props.setProcessDetails({...props.inward.process, weight:tweight && !balanced ? WeightValue-Number(tweight):Math.round( 0.00000785*parseFloat(width)*parseFloat(props.inward.plan.fThickness)*parseFloat(props.inward.process.length)*parseFloat(props.inward.process.no))});
            else
                props.setProcessDetails({...props.inward.process, weight:tweight && !balanced ? WeightValue-Number(tweight):Math.round( 0.00000785*parseFloat(props.inward.plan.fWidth)*parseFloat(props.inward.plan.fThickness)*parseFloat(props.inward.process.length)*parseFloat(props.inward.process.no))});
        }
    }, [props.inward.process.length, props.inward.process.no])
    
    useEffect(() => {
        if(props.slitCut){
            setCuts(props.coilDetails)
            
        }else{
        let data = props.childCoil ?props.coilDetails :(props.coilDetails && props.coilDetails.instruction)? props.coilDetails.instruction:props.coilDetails.childInstructions
        const lengthValue = props.coilDetails.instruction && props.coilDetails.instruction.length > 0 ? props.plannedLength(props.coilDetails) : props.coilDetails.fLength ? props.coilDetails.fLength  : props.plannedLength(props.coilDetails)
        const widthValue = props.coilDetails.instruction && props.coilDetails.instruction.length > 0  ? props.plannedWidth(props.coilDetails):  props.coilDetails.fWidth ? props.coilDetails.fWidth  : props.plannedWidth(props.coilDetails);
            setlength(lengthValue);
            setwidth(widthValue)
        if(data !== undefined){
            if(props.childCoil){
                const arrayData =[];
                arrayData.push(data);
                data= arrayData
            }else{
                data = data.flat();
                let cutsData = [...data];
                cutsData = cutsData.filter(item => item.process.processId === 1  && item.status.statusId !== 3)
                setCuts(cutsData);
            }
            
        }
       
        }}, [props.coilDetails]);
    useEffect(() => {
        if(props.inward.instructionSaveCuttingLoading && !props.wip) {
            loading = message.loading('Saving Cut Instruction..');
            
        }
    }, [props.inward.instructionSaveCuttingLoading]);
    useEffect(()=>{
        let cutsArray = cuts.map(i => i.plannedWeight);
        cutsArray = cutsArray.filter(i => i !== undefined)
       cutsArray = cutsArray.length > 0? cutsArray.reduce((total, num) => Number(total) + Number(num)) : 0
        settweight(cutsArray)

        if (props.wip) {
            let actualUpdate = cuts.map(item => {
                if (!item.actualNoOfPieces && item.actualNoOfPieces !== 0) item.actualNoOfPieces  =  item.plannedNoOfPieces;
                if (!item.actualLength && item.actualLength !== 0) item.actualLength  =  item.plannedLength;
                if (!item.actualWeight && item.actualWeight !== 0) item.actualWeight  =  item.plannedWeight;
                if (!item.packetClassification?.classificationId) item.packetClassification = {
                    classificationId: 1
                }
                return item;
            });
            setTableData(actualUpdate);

            let actualTotalWeight = cuts.map(i => i.actualWeight);
            actualTotalWeight = actualTotalWeight.filter(i => i !== undefined);
            actualTotalWeight = actualTotalWeight.length > 0 ? actualTotalWeight.reduce((total, num) => Number(total) + Number(num)) : 0;
            setTotalActualWeight(actualTotalWeight);
        }

    },[cuts])
    useEffect(() => {
        if(props.inward.instructionSaveCuttingSuccess && !props.wip) {
            loading = '';
            message.success('Cutting instruction saved successfully', 2).then(() => {
                props.setShowCuttingModal(false);
                props.resetInstruction();
            });
        }
    }, [props.inward.instructionSaveCuttingSuccess])

    const onInputChange = (key, index, type) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if(props.slitCut){
            const newData = [...cuts];
            let arrayData= [];
            let obj ={
                instructionId: newData[index].instructionId
            }
            obj.plannedWeight=0;
            obj.processId = 3;
            if(key === 'plannedLength'){
                obj.plannedLength= Number(e.target.value);
                let cutIndex = cutValue.map(item =>{
                    if(cutValue.indexOf(item) === index){
                        item.plannedLength=Number(e.target.value) 
                    }
                    return item;
                });
                setCutValue(cutIndex)
            }else if(key === 'plannedNoOfPieces'){
                obj.plannedNoOfPieces= Number(e.target.value);
                let cutIndex = cutValue.map(item =>{
                    if(cutValue.indexOf(item) === index){
                        item.plannedNoOfPieces=Number(e.target.value)  
                    }
                    return item;
                });
                setCutValue(cutIndex)
            }
            let obj1 = Object.keys(obj);
            if(cutValue && cutValue.length> 0){
                let cuts = cutValue.map(item =>{
                    if(obj.instructionId === item.instructionId){
                            obj = {...obj,...item}
                    }else{
                        if(obj1.length === 2){
                            arrayData.push(item)
                            setObjValue({...obj})
                        }else if(obj1.length===3){
                            setObjValue({...obj,...objValue})
                        }
                        obj ={...obj,...objValue}
                    }
                })
            }
            obj= {...obj,...objValue}
            arrayData.push(obj);
            setCutValue(arrayData);
            
        }else{
            const newData = [...tableData];
            newData[index][key] = type === 'select' ? { classificationId: Number(e) } : Number(e.target.value);
            if (key === 'actualWeight') {
                const data = (newData[index]['plannedLength']*(e.target.value/newData[index]['plannedWeight']));
                newData[index]['actualLength'] = Number.isInteger(data) ? data : data.toFixed(1);
            }
            setTableData(newData);
        }
        
    };
    const handleChange = (e) =>{
        if(e.target.value !== ''){
            setBalanced(false)
           
        } else{
            setBalanced(true)
        }
        let length = e.target.value;
       setNo(((WeightValue-Number(tweight))/(0.00000785 *width*props.coil.fThickness*Number(length))).toFixed(0));
    }
    const setSelection = (record, selected, selectedRows) => {
        setSelectedRowKeys(selectedRows)
        // props.setInwardSelectedForDelivery(selectedRows)
    }
    const handleSelection = {
        // selectedRowKey: props,
        onSelect: setSelection, getCheckboxProps: (record) => ({
            disabled: false
        })
    }

     return (
        <Modal
            title={props.wip ? "Finish Cutting Instruction" : "Cutting Instruction"}
            visible={props.showCuttingModal}
            onOk={() => {
                if(props.wip){
                    if (totalActualweight > tweight) {
                        message.error('Actual Weight is greater than Total weight, Please modify actual weight!');
                    } else {
                        props.updateInstruction(tableData);
                        props.setShowCuttingModal();
                    }
                }
                else if(props.slitCut){
                    props.saveCuttingInstruction(cutValue);
                }else{
                    props.saveCuttingInstruction(cuts);
                }

            }}
            width={1020}
            onCancel={() => {
                setCuts([]);
                props.form.resetFields();
                props.setShowCuttingModal(false)}}
        >
        <Card className="gx-card" >

        <Tabs
          defaultActiveKey="1"
          tabPosition={mode}
            >
          <TabPane tab="Cutting Details" key="1">
          {props.slitCut ? <Table  rowSelection={handleSelection} className="gx-table-responsive"  columns={columnsSlit} dataSource={cuts}/>  : 
        <Row>
          {!props.wip && <Col lg={12} md={12} sm={24} xs={24} className="gx-align-self-center">

                <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4">
                
                    <Form.Item label="Process Date" >
                        {getFieldDecorator('processDate', {
                            initialValue: moment(new Date(), APPLICATION_DATE_FORMAT),
                            rules: [{ required: true, message: 'Please select a Process date' }],
                            })(
                            <DatePicker
                            placeholder="dd/mm/yy"
                            style={{width: 200}}
                            defaultValue={moment(new Date(), APPLICATION_DATE_FORMAT)}
                            format={APPLICATION_DATE_FORMAT}
                            disabled={props.wip ? true : false}/>
                            )}
                    </Form.Item>
                    <Form.Item label="Length">
                        {getFieldDecorator('length', {
                            rules: [{ required: true, message: 'Please enter Length' },
                                    {pattern: "^[0-9]*$", message: 'Length should be a number'},],
                            })(
                            <Input id="length" disabled={props.wip ? true : false} onChange={(e)=>handleChange(e)}/>
                                )}
                    </Form.Item>
                    <Form.Item label="No of cuts">
                            {getFieldDecorator('no', {
                                rules: [{ required: true, message: 'Please enter number of cuts required' }
                                    ],
                            })(
                            <Input id="noOfCuts" disabled={props.wip ? true : false}/>
                                )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={onChange} disabled={props.wip ? true :balanced ? true : false}>
                                Balanced
                        </Button>
                    </Form.Item>
                    <Form.Item label="Weight">
                        {getFieldDecorator('weight', {
                                rules: [{ required: true, message: 'Please fill other details to calculate weight' },
                                    ],
                            })(
                                <Input id="weight" disabled={true}  />
                            )}
                    </Form.Item>
                    <Row className="gx-mt-4">
                        <Col span={24} style={{ textAlign: "center"}}>
                        <Button id="button" type="primary" htmlType="submit" disabled={props.wip ? true : false} value="text" >
                        {props.inward.process.index ? "Update size" : "Add size" } <Icon type="right"/>
                        </Button>
                        </Col>
                    </Row>
                </Form>
            </Col>}

            {props.wip && <>
                <Col lg={8} md={12} sm={24} xs={24}>
                    <p>Coil number : {props.coil.coilNumber}</p>
                    <p>Inward length(mm): {props.coil.fLength}</p>
                    <p>Available Length(mm): {lengthValue}</p>
                    <p>Available Weight(kg) : {WeightValue}</p>
                    <p>Inward Weight(kg) : {props.coil.fQuantity}</p>
                    <p>Grade: {props.coil.materialGrade.gradeName}</p>
                </Col>     
                                            
                <Col lg={8} md={12} sm={24} xs={24}>
                    <p>Material : {props.coil.material.description}</p>
                    <p>Customer Name : {props.coil.party.nPartyName}</p>
                    <p>Thickness(mm): {props.coil.fThickness}</p>
                    <p>Inward Width(mm) : {props.coil.fWidth}</p>
                    <p>Available Width(mm) : {width}</p>
                </Col>
            
            </>}

            <Col lg={props.wip ? 24 : 12} md={props.wip ? 24 : 12} sm={24} xs={24}>
            <Table  className="gx-table-responsive"  columns={props.wip? columns :columnsPlan} dataSource={props.wip?tableData:cuts}/>             
            {props.wip ? <div className='form-wrapper'>
                <Form.Item label="Total weight(kg)">
                    {getFieldDecorator('tweight', {
                        rules: [{ required: false}],
                    })(
                        <>
                            <Input id="tweight" disabled={true} value={tweight} name="tweight" />
                        </>
                    )}
                </Form.Item>
                <Form.Item label="Actual weight(kg)">
                    {getFieldDecorator('totalActualweight', {
                        rules: [{ required: false }],
                    })(
                        <>
                            <Input id="totalActualweight" disabled={true} value={totalActualweight} name="totalActualweight" />
                        </>
                    )}
                </Form.Item>
            </div> : <Form.Item label="Total weight(kg)">
                    {getFieldDecorator('tweight', {
                        rules: [{ required: false}],
                    })(
                        <>
                            <Input id="tweight" disabled={true} value={tweight} name="tweight" />
                        </>
                    )}
                </Form.Item>}
            </Col>
    </Row>}

          </TabPane>
            </Tabs>
            </Card>
       </Modal>
    )
}

const mapStateToProps = state => ({
    party: state.party,
    inward: state.inward,
    classificationList: state.packetClassification?.classificationList,
    saveCut: state.saveCut
});

const CuttingDetailsForm = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            processDate: Form.createFormField({
                ...props.inward.process.processDate,
                value: (props.inward.process.processDate) ? props.inward.process.processDate : moment(new Date(), APPLICATION_DATE_FORMAT),
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
            totalActualweight: Form.createFormField({
                ...props.inward.process.totalActualweight,
                value: props.inward.process.totalActualweight || '',
            }),
        };
    },
    onValuesChange(props, values) {
        props.setProcessDetails({ ...props.inward.process, ...values});
    },
})(CreateCuttingDetailsForm);


export default  connect(mapStateToProps, {setProcessDetails, saveCuttingInstruction,resetInstruction, updateInstruction, deleteInstructionById})(CuttingDetailsForm);