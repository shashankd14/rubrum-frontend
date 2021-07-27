import {Button, Card, Col, DatePicker, Divider, Form, Input, Modal, Row, Table, Select, Icon,Tabs, message} from "antd";
import React, {useEffect, useState, useRef, useContext} from "react";
import {connect, useSelector} from "react-redux";
import moment from "moment";
import {setProcessDetails, saveCuttingInstruction,resetInstruction ,updateInstruction, deleteInstructionById, instructionGroupsave} from '../../../appRedux/actions/Inward';
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
        md: {span: 14},
    },
};

const CreateCuttingDetailsForm = (props) => {
    const TabPane = Tabs.TabPane;
    const {getFieldDecorator} = props.form;
    let loading = '';
    const [cuts, setCuts] = useState([]);
    const [page, setPage] = useState(1);
    const [mode, setMode] = useState('top');
    const [balanced, setBalanced] = useState(true);
    const [tweight, settweight]= useState(0);
    const [totalActualweight, setTotalActualWeight] = useState(0);
    const [no, setNo]= useState();
    const [validate, setValidate]=useState(true);
    const lengthValue = props.coilDetails.instruction && props.coilDetails.instruction.length > 0 ? props.plannedLength(props.coilDetails) : props.coilDetails.fLength ? props.coilDetails.fLength  : props.plannedLength(props.coilDetails)
    const widthValue = props.coilDetails.instruction && props.coilDetails.instruction.length > 0  ? props.plannedWidth(props.coilDetails):  props.coilDetails.fWidth ? props.coilDetails.fWidth  : props.plannedWidth(props.coilDetails);
    const WeightValue = props.coilDetails.instruction && props.coilDetails.instruction.length > 0  ? props.plannedWeight(props.coilDetails):  props.coilDetails.fpresent ? props.coilDetails.fpresent  : props.plannedWeight(props.coilDetails);
    const [length, setlength]= useState(lengthValue);
    const [width, setwidth] = useState(widthValue);
    const [cutValue, setCutValue] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [balancedValue, setBalancedValue] = useState(false);
    const [bundledList, setbundledList]= useState(false);
    const [tpweight, settpweight]= useState();
    const [bundleTableData, setbundleTableData] = useState([]);
    const [cutsNo,setCutsNo]= useState(0);
    const [cutsLength, setCutsLength]= useState(0);
    const [bundleItemList, setBundleItemList] = useState([]);
    const [restTableData, setRestTableData] = useState([]);
    const [selectedPast , setSelectedPast] = useState([]);
    const [packetNo, setPacketNo]= useState(0);
    const [cutPayload,setCutPayload]= useState([]);
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
        },
        {
            title: 'Process Date',
            dataIndex:'processDate',
            render (value) {
                return moment(value).format('DD/MM/YYYY');
            },
            key: 'processDate',
        }
    ];
    const columnsSlitCut=[
        {
            title: 'Serial No',
           render : (text,record,index) => {
                return (index+1);
           }
        },
        {
            title: 'Length',
            dataIndex:'length',
            key: 'length',
        },
        {
            title: 'No of Cuts',
            dataIndex:'no',
            key: 'no',
        },
        {
            title: 'Weight',
            dataIndex:'weight',
            key:'weight',
        },
        {
            title:'Actions',
            dataIndex:'actions',
            render: (text, record,index) => (
                <span>
                <i className="icon icon-trash" onClick={(e) => {onDelete(record, e, 'slitCut'); }}/>
                </span>
              ),
              key:'action',
        }
    ];
    const columnsSlit=[
        {
            title: 'Serial No',
           render : (text,record,index) => {
                return index+1;
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
            title: 'Width',
            dataIndex:'plannedWidth',
            key: 'plannedWidth',
        },
        {
            title: 'Weight',
            dataIndex:'plannedWeight',
            key:'plannedWeight',
        }
    ];

    const onEdit=(record,index) => {
        const {form} = props;
        
            form.setFieldsValue({
                length:record.plannedLength,
                no:record.plannedNoOfPieces ,
                weight:record.plannedWeight

            });
    };
    const onDelete = (record, e, type) => {
        e.preventDefault();
        if(type === 'slitCut'){
             const data = restTableData.filter((item) => restTableData.indexOf(item) !==restTableData.indexOf(record))
             setRestTableData(data)
             props.deleteInstructionById(record.parentGroupId)
        }else{
            setValidate(false);
             const data = cuts.filter((item) => cuts.indexOf(item) !==cuts.indexOf(record))
             setCuts(data);
             setCutPayload(data);
            props.deleteInstructionById(record.instructionId)
        }
    };
    const onChange=()=>{
        setBalancedValue(true);
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
                setValidate(false);
                if((Number(tweight)+values.weight) > WeightValue){
                    message.error('Weight greater than available weight', 2);
                }else{
                    let slitcuts =[];
                    slitcuts.push({...props.inward.process,
                        plannedLength: props.inward.process.length,
                        plannedNoOfPieces: props.inward.process.no,
                        plannedWeight: props.inward.process.weight,
                        plannedWidth: props.coilDetails?.fWidth ? props.coilDetails.fWidth : props.coilDetails.plannedWidth,
                        inwardId: props.coilDetails.inwardEntryId ? props.coilDetails.inwardEntryId : "",
                        instructionId: props.coilDetails.instructionId ? props.coilDetails.instructionId : ""});
                  setCuts([...cuts, ...slitcuts]);
                  
                        props.resetInstruction();
                }
                
               
            }else{
                setValidate(true);
                message.error('Please enter the mandatory fields(*)',2);
            }
        });
    };
    useEffect(() => {
        if(props.inward.process.length && props.inward.process.no) {
            if(props.coilDetails.instructionId)

                props.setProcessDetails({...props.inward.process, weight:tweight && balancedValue ? WeightValue-Number(tweight):Math.round( 0.00000785*parseFloat(width)*parseFloat(props.inward.plan.fThickness)*parseFloat(props.inward.process.length)*parseFloat(props.inward.process.no))});
            else
                props.setProcessDetails({...props.inward.process, weight:tweight && balancedValue ? WeightValue-Number(tweight):Math.round( 0.00000785*parseFloat(props.inward.plan.fWidth)*parseFloat(props.inward.plan.fThickness)*parseFloat(props.inward.process.length)*parseFloat(props.inward.process.no))});
        }
    }, [props.inward.process.length, props.inward.process.no])
    
    useEffect(() => {
        if(props.slitCut && !props.wip){
          setCuts(props.coilDetails)
        }else{
        let data = props.childCoil ?props.coilDetails :(props.coilDetails && props.coilDetails.instruction)? props.coilDetails.instruction:props.coilDetails.childInstructions
        const lengthValue = props.coilDetails.instruction && props.coilDetails.instruction.length > 0 ? props.plannedLength(props.coilDetails) : props.coilDetails.fLength ? props.coilDetails.fLength  : props.plannedLength(props.coilDetails)
        const widthValue = props.coilDetails.instruction && props.coilDetails.instruction.length > 0  ? props.plannedWidth(props.coilDetails):  props.coilDetails.fWidth ? props.coilDetails.fWidth  : props.plannedWidth(props.coilDetails);
            setlength(lengthValue);
            setwidth(widthValue)
        if(data !== undefined){
            if(props.childCoil){
                let arrayData =data.childInstructions? data.childInstructions: [];;
                arrayData = arrayData.length>0? arrayData.flat():[];
                arrayData= arrayData.length>0?[...arrayData].filter(item => item.process.processId === 1 ):[]
                setCuts(arrayData)
            }else{
                data = data.flat();
                let cutsData = [...data];
                cutsData = props.wip ? (props.slitCut ? cutsData.filter(item => item.process.processId === 3 && item.status.statusId !==3) : cutsData.filter(item => item.process.processId === 1 && item.status.statusId !==3)) : cutsData.filter(item => item.process.processId === 1)
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
        setCutPayload(cuts);
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
                setCutPayload([]);
                props.setShowCuttingModal(false);
                props.resetInstruction();
            });
        }
    }, [props.inward.instructionSaveCuttingSuccess])
    useEffect(() =>{
        let listItem = bundleItemList.length> 0 ? bundleItemList :[];
       if(listItem.length === 0 && Object.keys(props.inward.groupId).length >0){
            listItem.push(props.inward.groupId);
        } else if(listItem.length> 0){
        let listItemValue = listItem.some(item => item.groupId == props.inward.groupId.groupId)
        if(!listItemValue){
            listItem.push(props.inward.groupId);
       }
    }
    setBundleItemList(listItem.length>0 ?[...listItem].flat():[...listItem]);
    },[props.inward.groupId])
    const onInputChange = (key, index, type) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const newData = [...tableData];
        const newIndex = (page - 1) * 10 + index;
        newData[newIndex][key] = type === 'select' ? { classificationId: Number(e) } : Number(e.target.value);
        setTableData(newData);
        
        
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
    const getBundleData =(selectedRows) =>{
        let data = bundleTableData.filter(i => !selectedRows.includes(i));
        return data;
    }
    const setSelection = (record, selected, selectedRows) => {
        setSelectedRowKeys(selectedRows);
        if(cutValue.length > 0){
            setRestTableData(cutValue);
        }
        let weights= selectedRows.map(i => i.plannedWeight);
        weights = selectedRows.length>0?weights.reduce((total, num) => total + num): 0;
        settpweight(weights);
    }
    const handleSelection = {
        onSelect: setSelection, getCheckboxProps: (record) => ({
            disabled: record.groupId !== null
        })
    }
    const getNoOfCuts=(e)=>{
        let cutsWidth = selectedRowKeys.reduce((a,c)=> c.plannedWidth)
        cutsWidth = selectedRowKeys.length ===1 ? cutsWidth.plannedWidth : cutsWidth;
        setPacketNo(Number(e.target.value));
        let cutsNumerator= (Number(tpweight)/Number(e.target.value))/((props.coil.fThickness)*(cutsWidth/1000)*(Number(cutsLength)/1000)*7.85);
        setCutsNo(cutsNumerator);
    }
    const getCuts=(e)=>{
        let cutsWidth = selectedRowKeys.reduce((a,c)=> c.plannedWidth)
        cutsWidth = selectedRowKeys.length ===1 ? cutsWidth.plannedWidth : cutsWidth;
        let cutsValue = [];
        for(let i=0; i <packetNo; i++) {
        let cutObj={
            weight: (Number(tpweight)/packetNo).toFixed(2),
            length:cutsLength,
            plannedWidth: cutsWidth,
            no: cutsNo.toFixed(0),
            processId: 3,
            parentGroupId: props.inward.groupId.groupId,
            inwardId: props.coil.inwardEntryId
        };
        cutsValue.push(cutObj);
    }
    
    setRestTableData(restTableData.length>0 ?[...restTableData,...cutsValue]: [...cutsValue])
    setCutValue(cutsValue)
    }
    const getTargetLength=(e)=>{
        setCutsLength(e.target.value)
    }
    const bundleListClick=()=>{
        setbundledList(true)
        let selectedPastList = selectedPast.length> 0 ? selectedPast:[];
        if(selectedRowKeys.length>0){
            selectedPastList.push(selectedRowKeys);
            setSelectedPast(selectedPastList);
        }
        let bundleData = bundleTableData.length === 0 ?cuts.filter(i => !selectedRowKeys.includes(i)): getBundleData(selectedRowKeys);
        // bundleData = bundleTableData.filter(i => !selectedPast.includes(i))
        setbundleTableData(bundleData)
        let selectedInstruction = selectedRowKeys.map(i => i.instructionId);
        let payload= {
            count: selectedRowKeys.length,
            instructionId: selectedInstruction
        }
        props.instructionGroupsave(payload);
        
    }
    const handleOk=()=>{
        if(props.wip){
            if (totalActualweight > tweight) {
                message.error('Actual Weight is greater than Total weight, Please modify actual weight!');
            } else {
                const coil = {
                    number: props.coil.coilNumber,
                    instruction: tableData
                };
                props.updateInstruction(coil);
                props.setShowCuttingModal();
            }
        }
        else if(validate === false){
            if(props.slitCut){
                props.saveCuttingInstruction(restTableData);
            }else{
                if(cutPayload.length>0) {
                    props.saveCuttingInstruction(cutPayload);
                }else{
                    props.setShowCuttingModal(false);
                }
                
            }
        }
        // else {
        //     message.error('Please enter the mandatory fields(*)',2);
        // }
        
    }
    
     return (
       
        <Modal
            title={props.wip ? (props.slitCut ? "Finish slit & cut Instruction" : "Finish Cutting Instruction") : "Cutting Instruction"}
            visible={props.showCuttingModal}
            onOk={() => {handleOk()}}
            width={1020}
            onCancel={() => {
                setCuts([]);
                setCutPayload([]);
                props.form.resetFields();
                setBalancedValue(false)
                props.setShowCuttingModal(false)}}
        >
        <Card className="gx-card" >
        {!props.wip && props.slitCut && <div>
        <Button type="primary" onClick={bundleListClick} icon={() => <i className="icon icon-add" />} size="medium"
        disabled= {selectedRowKeys.length < 1 ? true: false}>Bundle</Button> 
        </div>}
        <Tabs
          defaultActiveKey="1"
          tabPosition={mode}
            >
          <TabPane tab="Cutting Details" key="1">
          {props.slitCut && !props.wip ?  selectedRowKeys.length >0 && bundledList?
          <Row>
              <Col lg={cutValue.length > 0 ?14: 24} md={16} sm={24} xs={24}>
                {bundleItemList.length === 0 ? <>
                <Table className="gx-table-responsive"  columns={columnsSlit} dataSource={selectedRowKeys} pagination={false}/>
                <div style={{padding: "20px 0px 0px 25px"}}>
            <label for="tpweight">Total weight(kg):</label>
            <input type="text" className="bundle-input-class" id="tpweight" name="tpweight" value ={tpweight} disabled></input>
            <label for="tLength">Target length(mm):</label>
            <input type="text" className="bundle-input-class" id="tLength" name="tLength" onChange={getTargetLength}></input>
            </div><div style={{padding: "20px 0px 0px 25px"}}>
                    <label for="pNo">No of Packets :</label>
                    <input type="text" className="bundle-input-class" id="pNo" name="pNo" onChange={e => getNoOfCuts(e)}></input>
                    <label for="noOfCuts">No of Cuts</label>
                    <input type="text" id="noOfCuts" className="bundle-input-class" name="noOfCuts" value={cutsNo.toFixed(0)}></input>
                </div>
                <div style={{'padding-left': "65%"}}><Button type="primary" size="medium" onClick={getCuts}>Confirm</Button> 
                </div></>:
                bundleItemList.length > 0 && bundleItemList.map((item,idx) => <>
                <Table className="gx-table-responsive"  columns={columnsSlit} dataSource={selectedPast.length > 0 ?selectedPast[idx]:selectedRowKeys} pagination={false}/>
                <div style={{padding: "20px 0px 0px 25px"}}>
            <label for="tpweight">Total weight(kg):</label>
            <input type="text" className="bundle-input-class" id="tpweight" name="tpweight" value ={tpweight} disabled></input>
            <label for="tLength">Target length(mm):</label>
            <input type="text" className="bundle-input-class" id="tLength" name="tLength" onChange={getTargetLength}></input>
            </div><div style={{padding: "20px 0px 0px 25px"}}>
                    <label for="pNo">No of Packets :</label>
                    <input type="text" className="bundle-input-class" id="pNo" name="pNo" onChange={e => getNoOfCuts(e)}></input>
                    <label for="noOfCuts">No of Cuts</label>
                    <input type="text" id="noOfCuts" className="bundle-input-class" name="noOfCuts" value={cutsNo.toFixed(0)}></input>
                </div><div style={{'padding-left': "65%"}}><Button type="primary" size="medium" onClick={getCuts}>Confirm</Button> 
                </div></>)}
                <Table  rowSelection={handleSelection} className="gx-table-responsive"  showHeader={false} columns={columnsSlit} dataSource={bundleTableData} rowKey={record => record.instructionId}/>
            </Col>
            {cutValue.length > 0 &&<Col lg={10} md={16} sm={24} xs={24}>
            <Table className="gx-table-responsive" columns={columnsSlitCut} dataSource={restTableData.length>0?restTableData: cutValue} />
            </Col>}
        </Row>
          :<Table  rowSelection={handleSelection} className="gx-table-responsive"  columns={columnsSlit} dataSource={cuts} rowKey={record => record.instructionId}/>  : 
          <>{!props.wip && <Row>
          <Col lg={12} md={12} sm={24} xs={24}>   
          <p>Coil number : {props.coil.coilNumber}</p>
              <p>Customer Name : {props.coil.party.partyName}</p>
              {props.coil.customerBatchId && <p>Customer Batch No:{props.coil.customerBatchId}</p>}
              <p>Material Desc: {props.coil.material.description}</p>
              <p>Grade: {props.coil.materialGrade.gradeName}</p>
          </Col> 
          <Col lg={12} md={12} sm={24} xs={24}>
          <p>Inward specs: {props.coil.fThickness}X{props.coil.fWidth}X{props.coil.fLength}/{props.coil.fQuantity}</p>
              <p>Available Length(mm): {lengthValue}</p>
              <p>Available Weight(kg) : {WeightValue}</p>
              <p>Available Width(mm) : {width}</p>
          </Col>
      </Row>}
  
               <Row>
                    {!props.wip && <Col lg={10} md={12} sm={24} xs={24} className="gx-align-self-center">
                   

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
                                        Balance
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
                            <p>Customer Name : {props.coil.party.partyName}</p>
                            {props.coil.customerBatchId && <p>Customer Batch No:{props.coil.customerBatchId}</p>}
                            <p>Material Desc: {props.coil.material.description}</p>
                            <p>Grade: {props.coil.materialGrade.gradeName}</p>
                            
                        </Col>     
                                                    
                        <Col lg={8} md={12} sm={24} xs={24}>
                            <p>Inward specs: {props.coil.fThickness}X{props.coil.fWidth}X{props.coil.fLength}/{props.coil.fQuantity}</p>
                            <p>Available Length(mm): {lengthValue}</p>
                            <p>Available Weight(kg) : {WeightValue}</p>
                            <p>Available Width(mm) : {width}</p>
                        </Col>
                    
                    </>}

                    <Col lg={props.wip ? 24 : 14} md={props.wip ? 24 : 12} sm={24} xs={24}>
                    <Table  className="gx-table-responsive"  
                        columns={props.wip? columns :columnsPlan} 
                        dataSource={props.wip?tableData:cuts}
                        pagination={{
                            onChange(current) {
                              setPage(current);
                            }
                        }}
                    />             
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
            </Row></>}

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
    saveCut: state.saveCut,
    groupId: state.groupId
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
            packetLength: Form.createFormField({
                ...props.inward.process.packetLength,
                value: props.inward.process.packetLength || '',
            }),


        };
    },
    onValuesChange(props, values) {
        props.setProcessDetails({ ...props.inward.process, ...values});
    },
})(CreateCuttingDetailsForm);


export default  connect(mapStateToProps, {setProcessDetails, saveCuttingInstruction,resetInstruction, updateInstruction, deleteInstructionById, instructionGroupsave})(CuttingDetailsForm);