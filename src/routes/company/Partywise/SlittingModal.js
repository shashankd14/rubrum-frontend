import {Button, Col, Form, Icon, Input, message, Modal, Row, Table, Tabs, DatePicker, Radio, Select, Collapse} from "antd";
import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import moment from "moment";
import {APPLICATION_DATE_FORMAT} from '../../../constants';
import {setProcessDetails, saveSlittingInstruction, resetInstruction, updateInstruction, deleteInstructionById,pdfGenerateInward, resetIsDeleted } from '../../../appRedux/actions/Inward';
import { set } from "nprogress";
import { values } from "lodash";

const { Panel } = Collapse;
const Option = Select.Option;

export const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 4},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 16},
    },
};

export const formItemLayoutSlitting = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 10},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 24, offset: 2},
    },
};

let uuid = 0;

const SlittingWidths = (props) => {
    const {getFieldDecorator, getFieldValue, getFieldProps} = props.form;
    getFieldDecorator('keys', {initialValue: [{width:0, no:0, weight:0}]});
    const [value, setValue] = useState(props.value);
    const [targetWeight, settargetWeight]= useState(0);
    const [availLength, setavailLength]= useState(0);
    
    const lengthValue1 = props.coilDetails.availableLength >=0? props.coilDetails.availableLength : props.plannedLength(props.coilDetails);
    const widthValue1 = props.coilDetails.instruction && props.coilDetails.instruction.length > 0  ? props.plannedWidth(props.coilDetails):  props.coilDetails.fWidth ? props.coilDetails.fWidth  : props.plannedWidth(props.coilDetails);
    const weightValue1 = props.coilDetails.fpresent >=0 ? props.coilDetails.fpresent  : props.plannedWeight(props.coilDetails);
    const [len, setlen]= useState(lengthValue1);
    const [width, setwidth] = useState(widthValue1);
    const [weightValue, setWeightValue] = useState(weightValue1);
    const [twidth, settwidth]= useState(0);
    const [oldLength, setOldLength]= useState(0);
    const [equalParts, setEqualParts]= useState(0);
    const [equalPartsDisplay, setEqualPartsDisplay]=useState(0);
    const [unsavedDeleteId, setUnsavedDeleteId] = useState(0);
    const keys = getFieldValue('keys');
    const callBackValue =(n)=>{
        let cuts = 0;
        if(props.cuts && props.cuts.length){
            if(n === 'length'){
                cuts = props.cuts.map(i => Number(i.plannedLength));
                cuts = [...new Set(cuts)];
            }else{
                cuts =  props.cuts.map(i => i.plannedWidth);
            }
            cuts = cuts.filter(i => i !== undefined)
            cuts = cuts.length > 0? cuts.reduce((total, num) => Number(total) + Number(num)) : 0
            
        }
        return cuts;
        
    }
    let cutLength = callBackValue('length');
    let cutWidth = callBackValue('width');
    let noParts = 0;
    useEffect(()=>{
        props.setSlitInstructionList(props.slitInstruction)
    },[props.slitInstruction])
    useEffect(() => {
      getEditValue();
    }, [props.length]);

    useEffect(() => {
       setValue(props.value);
      }, [props.value]);
   
    useEffect(() => {
        // if (!props.wip) { props.setslitpayload(props.cuts); }
       let lengthValue1 = 0;
       let widthValue1 = 0;
       let weightValue = 0;
       if(props.coilDetails.fpresent >=0) {
         lengthValue1 = props.coilDetails.availableLength ? props.coilDetails.availableLength  : props.plannedLength(props.coilDetails)
        widthValue1 = props.coilDetails.fWidth ? props.coilDetails.fWidth  : props.plannedWidth(props.coilDetails);
        weightValue = props.coilDetails.fpresent ? props.coilDetails.fpresent  : props.plannedWeight(props.coilDetails);
        } else{
        widthValue1 = props.plannedWidth(props.coilDetails);
         weightValue = props.plannedWeight(props.coilDetails);
         lengthValue1 =  props.plannedLength(props.coilDetails)
         } 
         props.widthValue(width);
        // props.lengthValue(len);
        let cuts = props.cuts.map(i => i.plannedWeight);
       cuts = cuts.filter(i => i !== undefined)
        cuts = cuts.length > 0? cuts.reduce((total, num) => Number(total) + Number(num)) : 0
        props.setweight(cuts)
        if(props.setDeleted){
            setWeightValue(weightValue-cuts);
        }
        if(len !== 0 && width === 0){
            setwidth(widthValue1)
        }
        // if(weightValue !== 0 && width === 0){
        //     setwidth(widthValue1)
        // }
        if(props.cuts && props.cuts.length === 0){
            setwidth(widthValue1);
            setlen(lengthValue1);
            setWeightValue(weightValue);
        }
        
    }, [props.coilDetails, props.cuts]);
    useEffect(() =>{
        setWeightValue(props.coilDetails.fpresent)
    },[props.coilDetails.fpresent])
    useEffect(()=>{
        if (props.wip) {
            let actualUpdate = props.cuts.map(item => {
                if (!item.actualLength && item.actualLength !== 0) item.actualLength  =  item.plannedLength;
                if (!item.actualWidth && item.actualWidth !== 0) item.actualWidth  =  item.plannedWidth;
                if (!item.actualWeight && item.actualWeight !== 0) item.actualWeight  =  item.plannedWeight;
                if (!item.packetClassification?.classificationId) item.packetClassification = {
                    classificationId: item.plannedWidth < 20 ? 2 : 6
                }
                return item;
            });
            props.setTableData(actualUpdate);

            let actualTotalWeight = props.cuts.map(i => i.actualWeight);
            actualTotalWeight = actualTotalWeight.filter(i => i !== undefined);
            actualTotalWeight = actualTotalWeight.length > 0 ? actualTotalWeight.reduce((total, num) => Number(total) + Number(num)) : 0;
            props.totalActualweight(actualTotalWeight);
        }

    },[props.cuts])
    
    useEffect(()=>{
        if(props.reset){
            settargetWeight(0);
            setavailLength(0);
            props.form.resetFields();
            settwidth(0);
        }
    },[props.reset])
   
    const getEditValue =() =>{
        if(props.cuts.length> 0 && props.length !== undefined){
            const index = 0;
            const obj = props.cuts[props.length];
            const arr = [obj.plannedWidth,obj.plannedNoOfPieces, obj.plannedWeight];
            const array = ["widths[0]","nos[0]","weights[0]"];
            for (let i=0; i<array.length; i++){
                props.form.setFieldsValue({
                    [array[i]]: `${arr[i]}`
               });
            }
            props.form.setFieldsValue({
                length: obj.length
            });
        }
    }
    // - function to apply same data for remaining equals parts
    const applyData=() =>{
        const slits =[];
        let equalPanelList = [];
     let equalInstructions= [...props.slitEqualInstruction]
        let weight = props.cuts[0].plannedWeight;
        weight = Number(weight) * (equalPartsDisplay);
        for(let i=0; i<equalPartsDisplay; i++){
            slits.push(...props.cuts)
            equalInstructions.push(...props.slitEqualInstruction);
            equalPanelList.push(slits);
        }
        if(weight > weightValue){
            setWeightValue(0);
        }else{
            setWeightValue(weightValue- weight);
        }
       props.setSlits(slits);
        props.setSlitInstruction(equalInstructions); // Setting payload for equal parts
        props.setPanelList(equalPanelList);
        if (!props.wip) { props.setslitpayload(slits) }
        setEqualParts(0);
        setEqualPartsDisplay(0);
    }
    // - function to add the instruction
    const addNewSize = (e) => {
        let wValue;
        let slitInstructionPayload = props.slitInstructionList.length>0 ? [...props.slitInstructionList]: [];
        props.form.validateFields((err, values) => {
            if (!err) {
                props.validate(false);
                let totalWidth = 0;
                let totalWeight =  props.slitInstructionList.length?props.slitInstructionList.map(i => Number(i.partDetailsRequest.targetWeight)):0
                totalWeight = totalWeight.length?totalWeight.reduce((sum,total) => sum+ total): 0;
                const widthValue = props.coilDetails.fWidth ? props.coilDetails.fWidth : props.plannedWidth(props.coilDetails)
                const lengthValue = props.coilDetails.availableLength ? props.coilDetails.availableLength : props.plannedLength(props.coilDetails)
                const weightValue1 = props.coilDetails.fpresent >= 0? props.coilDetails.fpresent : props.plannedWeight(props.coilDetails)
                const slits = [];
                let slitArray = [];
                let uniqId = '';
                // if(cutLength === 0){
                //     setOldLength(Number(availLength));
                // }
                let instructionPlanDto = {
                        "targetWeight": targetWeight,
                        "length": availLength,
                        "createdBy": "1",
                        "updatedBy":"1",
                    }
                for(let i=0; i < values.widths.length; i++) {
                    for (let j=0; j<values.nos[i];j++){
                        let slitValue = {
                            processId:2,
                            instructionDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                            plannedLength: availLength,
                            plannedWidth: values.widths[i],
                            isSlitAndCut:props.slitCut ? true :false,
                            plannedNoOfPieces:values.nos[i],
                            status: 1,
                            createdBy: "1",
                            updatedBy:"1",
                            groupId: null,
                            plannedWeight:(values.weights[i]/values.nos[i]).toFixed(2),
                            inwardId: props.coilDetails.inwardEntryId ? props.coilDetails.inwardEntryId : '',
                            parentInstructionId: props.coilDetails.instructionId ? props.coilDetails.instructionId : '',
                            deleteUniqId: unsavedDeleteId
                        }
                        slits.push(slitValue);
                    }
                    
                    wValue = targetWeight*((values.widths[i]*values.nos[i]/widthValue1))
                    totalWidth += values.widths[i]*values.nos[i];
                    totalWeight+= Number(values.weights[i]);
                    instructionPlanDto.deleteUniqId = unsavedDeleteId;
                    settwidth(totalWidth); 
                 }
                 let lengthList = slits.map(item => Number(item.plannedLength));
                    lengthList = [...new Set(lengthList)];
                    let sumLength = lengthList.reduce((sum,total) => sum+total);
                 slitArray.push(slits);
                 let instructionPayload ={
                     "partDetailsRequest": instructionPlanDto,
                     "instructionRequestDTOs": slits
                 }
                 slitInstructionPayload.push(instructionPayload);
                 setUnsavedDeleteId(prev => prev + 1);
                 let remainWeight = (props.coilDetails.fpresent || props.coilDetails.plannedWeight);
                 if(Number(availLength)  > lengthValue) {
                    message.error('Length greater than available length', 2);
                }else if(totalWeight > remainWeight) {
                   message.error('Weight greater than available weight', 2);
                   
                }else if(totalWidth !== widthValue) {
                    message.error('Sum of slits width is not same as width of coil.', 2);
                }else if((totalWidth) > widthValue) {
                        message.error('Sum of slits width is greater than width of coil.', 2);
                 } else{
                    setWeightValue(remainWeight-(totalWeight));
                    setlen(lengthValue - sumLength)
                        props.setPanelList(slitArray)
                        props.setSlits(slits);
                        props.setslitpayload(slits);
                        props.setSlitInstruction(slitInstructionPayload);
                        props.setSlitInstructionList(slitInstructionPayload);
                        props.setSlitEqualInstruction(slitInstructionPayload);
                        settargetWeight(value ===1 ?targetWeight: 0);
                        setavailLength(value ===1 ?availLength: 0);
                        setEqualPartsDisplay(value === 1?equalParts > slitInstructionPayload.length? equalParts - slitInstructionPayload.length :0: 0)
                        props.form.resetFields();
                }
            }
                else {
                    props.validate(true);
                }
        });
    }
    const addNewKey = () => {
        const {form} = props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat({width:0, no:0, weight:0});
        form.setFieldsValue({
            keys: nextKeys,
        });
    }
    const removeKey = (k) => {
        const {form} = props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }
        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }
    const handleBlur = (e, i)=>{
        props.form.validateFields((err, values) => {
            let widthEntry = 0;
            let array = [];
            let wValue;
            let widthCheck = (widthValue1 === 0 && width !== 0 )? width: widthValue1;
            if(!err){
                for(let i=0; i< values.widths.length; i++){
                    array.push(`weights[${i}]`);
                    widthEntry += Number(values.widths[i])*Number(values.nos[i]);
                }
                
                wValue = Number(targetWeight)*((Number(values.widths[i])*Number(values.nos[i]))/widthCheck)
                props.form.setFieldsValue({
                  [array[i]]: wValue
                });
                settwidth(widthEntry);
                if(lengthValue1>= (availLength+cutLength)){
                    // setlen(lengthValue1-(availLength+cutLength))
                    props.lengthValue(lengthValue1-(availLength+cutLength))
                    setwidth(width- (widthEntry));
                    props.widthValue(width- (widthEntry))
                    
                }
                if(width >= (widthEntry+cutWidth)){
                    setwidth(width- (widthEntry+cutWidth));
                    props.widthValue(width- (widthEntry+cutWidth))
                }
            }
      })
    }
    const onChange=()=>{
        props.form.setFieldsValue({
            length: len
        });
    }
    const handleBlurEvent= e =>{
        setEqualParts(Number(e.target.value));
        setEqualPartsDisplay(Number(e.target.value));
        props.setParts(Number(e.target.value));
        if(value === 2){
            settargetWeight(0);
        }else {
            settargetWeight((weightValue/Number(e.target.value)).toFixed(2));
         }
    }
    const onTargetChange=  e=>{
        let weight = props.coilDetails?.fQuantity ? props.coilDetails.fQuantity : props.plannedWeight(props.coilDetails);
        let length = props.coilDetails?.fLength ? props.coilDetails.fLength : props.plannedLength(props.coilDetails);
        settargetWeight(e.target.value);
        setavailLength((length*(e.target.value/weight)).toFixed(0))
    }
    const radioChange = e => {
        let weight = props.coilDetails?.fQuantity ? props.coilDetails.fQuantity : props.plannedWeight(props.coilDetails);
        let length = props.coilDetails?.fLength ? props.coilDetails.fLength : props.plannedLength(props.coilDetails);
        
        settargetWeight((weightValue/equalParts));
        if(e.target.value=== 1){
            setavailLength((length*((weightValue/equalParts)/weight)).toFixed(0));
        }
        else{
            setavailLength(0);
            settargetWeight(0);
        }
        setValue(e.target.value);
      };
   return (
        <>
            <Form {...formItemLayoutSlitting}>
                {!props.wip && <><label>Current Available length : {len}mm</label>
                <div><label>Available Width : {weightValue > 0 ? (props.coilDetails.fWidth || props.coilDetails.plannedWidth) : 0}mm</label></div> 
                <div><label>Current Available Weight : {weightValue.toFixed(1)}kg</label></div> 
                </>}
                {!props.wip && 
                <><Form.Item label="Process Date" >
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
                
                <Form.Item label="No Of Parts">
                    {getFieldDecorator('noParts', {
                        rules: [{ required: (value=== 2 || value===1) && equalParts !== 0? false : true, message: 'Please enter no.of Parts' }],
                    })(
                        <Input id="noParts" onBlur={handleBlurEvent} disabled ={(value == 0 || value == 4)? false: true}/>
                    )}
                </Form.Item>
                <Form.Item>
                {getFieldDecorator('radioParts', {
                        rules: [{ required: (value === 2 ||  value === 1) && equalParts !== 0? false : true, message: 'Please select Parts' }],
                    })(
                        <Radio.Group id="radioParts" onChange={radioChange} disabled={(value == 0 || value == 4) && weightValue !== 0? false: true} value={value}>
                        <Radio value={1}>Equal</Radio>
                        <Radio value={2}>Unequal</Radio>
                    </Radio.Group>
                    )}
                   
                </Form.Item>
                
                <Form.Item label="Target Weight(kg)">
                    {getFieldDecorator('targetWeight')(
                        <>
                            <Input id="targetWeight" disabled={value === 1?true: false} value={targetWeight} name="targetWeight" onChange={onTargetChange}/>
                        </>
                    )}
                </Form.Item>
                <Form.Item label="Length(mm)">
                    {getFieldDecorator('length')(
                        <>
                            <Input id="length" disabled={true} value={availLength} name="length" />
                        </>
                    )}
                </Form.Item>
                <Row>
                    <Col lg={6} md={6} sm={12} xs={24}>
                        <label>Width</label>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={24}>
                        <label>Nos</label>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={24}>
                        <label>Weight</label>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={24}>
                        <label>Action</label>
                    </Col>
                </Row>
                <Row>
                    {keys.map((k, index) => {
                        return (
                        <>
                            <Col lg={6} md={6} sm={12} xs={24}>
                                <Form.Item name="widths" >
                                    {getFieldDecorator(`widths[${index}]`, {
                                        rules: [{ required: true, message: 'Please enter width' },
                                            {pattern: `^[+-]?[0-9]*\.[0-9]{0,1}$`, message: 'Width greater than available width'},],
                                    })(
                                        <Input id="widths" disabled={props.wip ? true : false} onBlur={(e) =>handleBlur(e, index)} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col lg={6} md={6} sm={12} xs={24}>
                                <Form.Item name="nos">
                                    {getFieldDecorator(`nos[${index}]`, {
                                        rules: [{ required: true, message: 'Please enter nos' },
                                            {pattern: "^[0-9]*$", message: 'Number of slits should be a number'},],
                                    })(
                                        <Input id="nos" disabled={props.wip ? true : false} onBlur={(e)=>handleBlur(e,index)}/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col lg={6} md={6} sm={12} xs={24}>
                                <Form.Item name="weights">
                                    {getFieldDecorator(`weights[${index}]`)(
                                        <Input id="weights" disabled={true} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col lg={6} md={6} sm={12} xs={24}>
                                <div style={{height: "40px"}} className="gx-flex-row gx-align-items-center">
                                    {keys.length-1 > 0 ? <i className="icon icon-trash gx-margin" onClick={() => removeKey(k)}/> : <></>}
                                    {index == keys.length-1 ? <i className="icon icon-add-circle" onClick={() => addNewKey()}/> : <></>}
                                </div>
                            </Col>
                        </>
                    ) }
                    )}
                </Row>
                <Form.Item label="Total width(mm)">
                    {getFieldDecorator('twidth', {
                        rules: [{ required: false}],
                    })(
                        <>
                            <Input id="twidth" disabled={true} value={twidth} name="twidth" />
                        </>
                    )}
                </Form.Item>
                
                <Form.Item>
                <Row className="gx-mt-4">
                    <Col span={16} style={{ textAlign: "center"}}>
                        <Button type="primary" htmlType="submit" onClick={() => addNewSize()} disabled={props.wip ? true : (props.slitInstructionList.length === equalParts)? true: false}>
                            Add Size<Icon type="right"/>
                        </Button>
                    </Col>
                </Row>
                 <Button type="primary" onClick={applyData} hidden={value=== 1 && equalParts > 1 && props.slitInstructionList.length !== equalParts? false: true} disabled={value===1 && equalPartsDisplay !== 0 ? (props.cuts.length=== 0 ?  true : false) :true}>
                           Apply to remainig {equalPartsDisplay} parts <Icon type="right"/>
                </Button>
                </Form.Item></>}
                </Form>
        </>
    )
}

const CreateSlittingDetailsForm = (props) => {
    const TabPane = Tabs.TabPane;
    const [mode, setMode] = useState('top');
    const {getFieldDecorator} = props.form;
    const [cuts, setCuts] = useState([]);
    const [slitPayload, setslitpayload]= useState([]);
    const [length,setLength]= useState();
    let loading = '';
    let cutArray=[];
    const [reset, setreset] = useState(true);
    const [slitInstruction, setSlitInstruction] = useState([]);
    const [slitInstructionList, setSlitInstructionList] = useState(slitInstruction);
    const [slitEqualInstruction, setSlitEqualInstruction]= useState([]);
const columns = [
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
        dataIndex: 'actualLength',
        render: (text, record, index) => { // addonAfter={<p>Enter valid length</p>}
            return <Input value={record.actualLength} onChange={onInputChange("actualLength", index)} />
        }
    },
    {
        title: 'Width',
        dataIndex:'plannedWidth',
        key: 'plannedWidth',
    },
    {
        title: 'Actual Width',
        dataIndex: 'actualWidth',
        render: (text, record, index) => {
            return <Input value={record.actualWidth} onChange={onInputChange("actualWidth", index)} />
        }
    },
    {
        title: 'Weight',
        dataIndex:'plannedWeight',
        key: 'plannedWeight',
    },
    {
        title: 'Actual Weight',
        dataIndex: 'actualWeight',
        render: (text, record, index) => {
            return <Input value={record.actualWeight} onChange={onInputChange("actualWeight", index)} onBlur={() => {
                let actualTotalWeight = cuts.map(i => i.actualWeight);
                actualTotalWeight = actualTotalWeight.filter(i => i !== undefined);
                actualTotalWeight = actualTotalWeight.length > 0 ? actualTotalWeight.reduce((total, num) => Number(total) + Number(num)) : 0;
                setTotalActualWeight(actualTotalWeight);
            }} />
        }
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
        key: 'index',
        render:(text, record, index) => ((page-1)*10+index + 1 )
        
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
        render (value) {
            return Math.round(value);
        },
        key:'plannedWeight',
    },
    {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (text, record, index) => (
            <span>
                <span className="gx-link" onClick={(e) => {onEdit(index, e); }}><Icon type="edit" /></span>
                <span className="gx-link" onClick={(e) => {
                    setDeleteRecord({ e, record, key: index });
                    setshowDeleteModal(true); }}><Icon type="delete" /></span>
            </span>
            
        ),
    },
    
    {
        title: 'Slitting Date',
        render:() =>(moment(new Date()).format('DD/MM/YYYY')),
        key: 'instructionDate',
    }
];
    const [tableData, setTableData] = useState(props.wip?(props.childCoil ?props.coilDetails :(props.coilDetails && props.coilDetails.instruction)? props.coilDetails.instruction:props.coilDetails.childInstructions): cuts);
    const [insData, setInstruction] = useState({});
    const [tweight, settweight]= useState(0);
    const [totalActualweight, setTotalActualWeight] = useState(0);
    const [page, setPage] = useState(1);
    const [edit, setEdit] = useState([]);
    const [validate, setValidate]= useState(true);
    const [lengthValue, setLengthValue] = useState();
    const [widthValue, setWidthValue]= useState();
    const [form, setForm]= useState(false);
    const [slittingDetail, setSlittingDetail] = useState([])
    const [value, setValue]= useState(4);
    const [parts, setParts]=useState(0);
    const [deleteSelected, setDeletedSelected] = useState(false)
    const [showDeleteModal, setshowDeleteModal] = useState(false);
    const [deleteRecord, setDeleteRecord] = useState({});
    const [panelList, setPanelList]= useState([]);
    const onDelete = ({ record, key, e }) => {
        e.preventDefault();

        setDeletedSelected(true);
        if (record.isSlitAndCut && record.groupId) {
            message.error('Unable to delete! As part instruction is already bundled');
        }
        else if (record.instructionId && record.partId) {
            const payload = {
                partId: record.partId
            }
            props.deleteInstructionById(payload, 'slit');
            setshowDeleteModal(false);
            props.setShowSlittingModal(false);
        } else {
            const data = cuts.filter(item => {
                if (item.deleteUniqId || item.deleteUniqId === 0) {
                    return item.deleteUniqId !== record.deleteUniqId;
                } else {
                    return cuts.indexOf(item) !== key;
                }
            });
            let payload = [];
            slitInstructionList.forEach(part => {
                const id = part.partDetailsRequest.deleteUniqId
                if (id && id !== record.deleteUniqId) {
                    payload.push(part);
                }
            });
            setSlitInstructionList(payload);
            setSlitInstruction(payload);
            setSlitEqualInstruction(payload);
            setValidate(false);
            setslitpayload(data);
            setPanelList([data]);
            setCuts(data);
            setshowDeleteModal(false);
        }
      }
    const onEdit = (key, e) => {
        // const data = cuts.filter(item => cuts.indexOf(item) !== key);
        // setEdit(cuts.filter(item => cuts.indexOf(item) === key))
        setLength(key);
        // setCuts(data)
      }
    
   useEffect(()=>{
       if (!props.inward.isDeleted) {
            const result = cuts.filter(item => item.instructionId === props.coilDetails.instructionId) 
            let resetter = cuts.length> 0 ? result.length > 0 ? true : false : true
            setreset(resetter);
       }
   },[props.coilDetails])
    useEffect(() => {
        setValue(0)
        setSlitInstruction([])
    let data = props.childCoil ?props.coilDetails :(props.coilDetails && props.coilDetails.instruction)? props.coilDetails.instruction:props.coilDetails.childInstructions;
   
    if(props.childCoil){
        setInstruction(data);
        data = data.childInstructions || [];
        let arrayData = [...data];
        arrayData = arrayData.flat();
        arrayData= arrayData.length>0?[...arrayData].filter(item => item.process.processId === 2 ):[]
        setCuts(arrayData);
        setslitpayload([])
        
    } else{
        data = data.flat();
        data = props.wip ? data.filter(item => item.process.processId === 2 && item.status.statusId !==3 && item.groupId === null) :props.slitCut ? data.filter(item => item.process.processId === 2 && item.isSlitAndCut === true ):data.filter(item => item.process.processId === 2 && item.isSlitAndCut === false)
        let partIdList = data.map(item => item.partId);
        partIdList = [...new Set(partIdList)];
        let list1 = []
        for(let i=0; i< partIdList.length;i++){
            let mapList = data.filter(list => list.partId === partIdList[i])
            list1.push(mapList)
        }
        setPanelList(list1);  
        let cutsData = [...data];
        cutsData = props.wip ? cutsData.filter(item => item.process.processId === 2 && item.status.statusId !==3 && item.groupId === null) :props.slitCut ? cutsData.filter(item => item.process.processId === 2 && item.isSlitAndCut === true ):cutsData.filter(item => item.process.processId === 2 && item.isSlitAndCut === false)
        setSlittingDetail(cutsData)
        setCuts(cutsData);
        setslitpayload([])
        
    }
    setForm(false);
    if(props.wip){
     let newData = [...data];
     setTableData(newData);
    }
    props.resetIsDeleted(false);
 }, [props.coilDetails]);

  const onInputChange = (key, index, type) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newData = [...tableData];
    const newIndex = (page - 1) * 10 + index;
    newData[newIndex][key] = type === 'select' ? { classificationId: Number(e) } : Number(e.target.value);
    if (key === 'actualWeight') {
        const data = (e.target.value / ((newData[newIndex]['actualWidth'] / 1000) * 7.85 * props.coil.fThickness )) * 1000;
        newData[newIndex]['actualLength'] = Number.isInteger(data) ? data : data.toFixed(1);
    }
    setTableData(newData);
  };
    
    useEffect(() => {
        if(props.slitCut){
            if(props.inward.instructionSaveSlittingLoading && !props.wip) {
                loading = message.loading('Saving Slit Instruction..');
                
            }
        }else{
            if(props.inward.instructionSaveSlittingLoading && !props.inward.pdfSuccess && !props.wip) {
                loading = message.loading('Saving Slit Instruction & Generating pdf..');
                
            }
        }
       
    }, [props.inward.instructionSaveSlittingLoading]);
    useEffect(()=>{
        if(props.inward.pdfSuccess && !props.wip) {
            message.success('Slitting instruction saved & pdf generated successfully', 2).then(() => {
               props.resetIsDeleted(false);
               props.setShowSlittingModal(false);
                props.resetInstruction();
                
            });
        }
    },[props.inward.pdfSuccess])
    useEffect(() => {
        if(props.slitCut){
            if(props.inward.instructionSaveSlittingSuccess && !props.wip) {
                loading = '';
                message.success('Slitting instruction saved', 2).then(() => {
                    if(props.slitCut){
                        let cutList = props.inward.saveSlit.map(slit => {
                            return [...slit.instructions]
                        })
                        let coilList = props.coilDetails.instruction.flat();
                        cutList = cutList.flat(); 
                        cutList = [...coilList,...cutList]
                       props.setCutting([...new Set(cutList)]);
                    }
                    props.resetIsDeleted(false);
                    props.setShowSlittingModal(false);
                    props.resetInstruction();
                    
                });
            }
        }else{
            if(props.inward.instructionSaveSlittingSuccess && !props.wip && !props.slitCut) {
                let partId = props.inward.saveSlit[0].partDetailsId
                let payload={
                    groupIds: null,
                    partDetailsId: partId
                }
                props.pdfGenerateInward(payload);
                loading = ''; 
            }
        }
       
    }, [props.inward.instructionSaveSlittingSuccess])
    const handleCancel=(e) => {
        e.preventDefault();
        props.resetIsDeleted(false);
        setCuts([]);
        setForm(true)
        setValue(value+3);
        setDeletedSelected(false);
        props.setShowSlittingModal(false)
    }
    const handleOk =(e,name) => {
        e.preventDefault();
        if(props.wip){
            const isAllWip = tableData.every(item => item.packetClassification.classificationId === 6);
            if (isAllWip) {
                message.error('Unable to finish Instructions. All packets are classified as WIP');
            }
             else if (totalActualweight > tweight) {
                message.error('Actual Weight is greater than Total weight, Please modify actual weight!');
            } else {
                const coil = {
                    number: props.coil.coilNumber,
                    instruction: tableData
                };
                props.updateInstruction(coil);
                props.setShowSlittingModal(false)
            }
        }
        
        if(validate === false){
            if(slitInstruction.length === parts){
                setValue(value+3);
                setDeletedSelected(false);
                if(name === 'Slitting'){
                    if(slitPayload.length > 0){
                        props.saveSlittingInstruction(slitInstruction);
                        
                    }else{
                        props.resetIsDeleted(false);
                        props.setShowSlittingModal(false);
                    }
                    
                } else{
                    if(name === 'SlitCut'){
                        if(slitPayload.length > 0){
                            props.saveSlittingInstruction(slitInstruction);
                         }
                    } else{
                         props.resetIsDeleted(false);
                         props.setShowSlittingModal(false);
                    }
                }
             } else{
                if(name === 'slittingDetail'){
                    setValue(value+3);
                    props.resetIsDeleted(false);
                     props.setShowSlittingModal(false);
                     props.setShowCuttingModal(true);
                     props.setCutting(cuts);
                     setDeletedSelected(false);
                 } else{
                    message.error('Please enter instructions for all parts');
                 }
           
            }
        }else{ 
            if(name === 'slittingDetail'){
               setValue(value+3);
               props.resetIsDeleted(false);
                props.setShowSlittingModal(false);
                props.setShowCuttingModal(true);
                props.setCutting(cuts);
                setDeletedSelected(false);
            } 
        } 
        
    }
    return (
        
        <Modal
            title={props.wip ? "Finish Slitting Instruction" : "Slitting Instruction"}
            visible={props.showSlittingModal}
            onOk={handleOk}
            width={1020}
            onCancel={handleCancel}
            footer={props.slitCut ? slittingDetail.length === cuts.length ?[
                <Button key="back" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={(e)=>{handleOk(e,'slittingDetail')}}>
                  Proceed to Cut
                </Button>
              ]:[
                <Button key="back" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" disabled={props.inward.loading} loading={loading} onClick={(e)=>{handleOk(e,'SlitCut')}}>
                  { props.inward.loading ? 'Loading...' : 'Send for Cut' }
                </Button>
              ]:cuts.length>0 ?props.wip?[
                <Button key="back" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary"  loading={loading} onClick={(e)=>{handleOk(e,'Slitting')}}>
                 OK
                </Button>]: [
                <Button key="back" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" loading={loading} disabled={props.inward.loading} onClick={(e)=>{handleOk(e,'Slitting')}}>
                 { props.inward.loading ? 'Loading...' : 'Save and Generate' }
                </Button>]: [<Button key="back" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={(e)=>{handleOk(e,'Slitting')}}>
                 OK
                </Button>]}
        >
            <Tabs
                defaultActiveKey="1"
                tabPosition={mode}
            >
                <TabPane tab="Slitting Instruction" key="1">
                    {props.wip ? 
                    <Row>
                        <Form {...formItemLayout} className="login-form gx-pt-4">
                            <Form.Item>
                                <SlittingWidthsForm setSlitEqualInstruction={setSlitEqualInstruction} setSlitInstructionList={setSlitInstructionList} slitEqualInstruction={slitEqualInstruction} slitInstructionList={slitInstructionList} setSlits={(slits) => setCuts([...cuts,...slits])} setTableData={setTableData} setweight={(w) => settweight(w.toFixed(0))} totalActualweight={(w) => setTotalActualWeight(w)} coilDetails={props.coilDetails} wip={props.wip} plannedLength={props.plannedLength} plannedWidth ={props.plannedWidth} plannedWeight ={props.plannedWeight} length={length} cuts={cuts} edit={edit} tweight={tweight} lengthValue={(lengthValue) => setLengthValue(lengthValue)} widthValue={(widthValue) => setWidthValue(widthValue)} reset={form} />
                            </Form.Item>
                        </Form>
                        <Col lg={8} md={12} sm={24} xs={24}>
                            <p>Coil number : {props.coil.coilNumber}</p>
                            <p>Available Weight(kg) : {props.childCoil ? insData.actualWeight : props.coil.fpresent}</p>
                            <p>Available length(mm) : {props.childCoil ? insData.actualLength : props.coil.availableLength}</p>
                            <p>Inward Weight(kg) : {props.coil.fQuantity}</p>
                            <p>Grade: {props.coil.materialGrade.gradeName}</p>  
                        </Col>     
                                                    
                        <Col lg={8} md={12} sm={24} xs={24}>
                            <p>Material : {props.coil.material.description}</p>
                            <p>Customer Name : {props.coil.party.partyName}</p>
                            <p>Thickness(mm): {props.coil.fThickness}</p>
                            <p>Width(mm) : {props.coil.fWidth}</p>
                            <p>Available Width(mm): {props.childCoil ? insData.actualWidth : widthValue}</p>
                        </Col>

                        <Col lg={24} md={24} sm={24} xs={24}>
                            <Table className="gx-table-responsive" 
                                columns={props.wip?columns: columnsPlan} 
                                dataSource={props.wip?tableData:reset ?cuts: cutArray}
                                pagination={{
                                    onChange(current) {
                                      setPage(current);
                                    }
                                  }}
                            />
                            <div className="form-wrapper">
                                    <Form.Item className="form-item" label="Total weight(kg)">
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
                                </div>
                        </Col>
                    </Row>
                    : 
                    <Row>
                        <Col lg={12} md={16} sm={24} xs={24} span={16} className="gx-align-self-center">
                            
                        <Form {...formItemLayout} className="login-form gx-pt-4">
                            
                                <Form.Item>
                                    <SlittingWidthsForm 
                                        setSlitEqualInstruction={setSlitEqualInstruction} 
                                        setSlitInstructionList={setSlitInstructionList} 
                                        slitEqualInstruction={slitEqualInstruction} 
                                        slitInstructionList={slitInstructionList} 
                                        setslitpayload={(slits) => setslitpayload([...slitPayload,...slits])} 
                                        setSlitInstruction={(slitInstruction) => setSlitInstruction([...slitInstruction])} 
                                        slitInstruction={slitInstruction} 
                                        setSlits={(slits) => setCuts([...cuts,...slits])} 
                                        setweight={(w) => settweight(w)} 
                                        coilDetails={props.coilDetails} 
                                        wip={props.wip} 
                                        plannedLength={props.plannedLength} 
                                        plannedWidth ={props.plannedWidth} 
                                        plannedWeight ={props.plannedWeight} 
                                        length={length} 
                                        cuts={cuts} 
                                        edit={edit} 
                                        tweight={tweight} 
                                        lengthValue={(lengthValue) => setLengthValue(lengthValue.toFixed(1))} 
                                        widthValue={(widthValue) => setWidthValue(widthValue)} 
                                        reset={form} 
                                        validate={(valid) => setValidate(valid)} 
                                        value={value} 
                                        setDeleted = {deleteSelected} 
                                        slitCut={props.slitCut} 
                                        setParts ={(parts)=>setParts(parts)}
                                        setPanelList={(list) => setPanelList([...panelList,...list])}/>
                                </Form.Item>

                            </Form>
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                        {panelList.length > 0 && panelList.map((item,index) =>
                            (<Collapse accordion>
                            <Panel header={index+1} key="1">
                            <Table className="gx-table-responsive" columns={props.wip?columns: columnsPlan} dataSource={props.wip?tableData:reset ?item: cutArray} pagination={{
                                   onChange(current) {
                                     setPage(current);
                                   }
                                 }}/>
                           </Panel>
   
                       </Collapse>)
                        )}
                        
                            
                            
                            <Form.Item label="Total weight(kg)">
                                {getFieldDecorator('tweight', {
                                    rules: [{ required: false}],
                                })(
                                    <>
                                        <Input id="tweight" disabled={true} value={tweight} name="tweight" />
                                    </>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>}

                    <Modal 
                        title='Confirmation'
                        visible={showDeleteModal}
                        width={400}
                        onOk={() => {
                            onDelete(deleteRecord);
                        }}
                        onCancel={() => setshowDeleteModal(false)}
                    >
                        <p>All Instructions associated to this part will be deleted.</p>
                        <p>Please click OK to proceed for delete</p>
                    </Modal>
        
                </TabPane>

                { !props.wip && <TabPane tab="Coil Details" key="2">
                    <Row>
                        <Col lg={12} md={12} sm={24} xs={24}>   
                            <p>Coil number : {props.coil.coilNumber}</p>
                            <p>Customer Name : {props.coil.party.partyName}</p>
                            {props.coil.customerBatchId && <p>Customer Batch No:{props.coil.customerBatchId}</p>}
                            <p>Material Desc: {props.coil.material.description}</p>
                            <p>Grade: {props.coil.materialGrade.gradeName}</p>
                        </Col> 
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <p>Inward specs: {props.coil.fThickness}X{props.coil.fWidth}X{props.coil.fLength}/{props.coil.fQuantity}</p>
                            <p>Available Length(mm): {props.coil.availableLength}</p>
                            <p>Available Weight(kg) : {props.coil.fpresent}</p>
                            <p>Available Width((mm) : {props.coil.fpresent > 0 ? (props.coilDetails.fWidth || props.coilDetails.plannedWidth ) : 0}</p>
                        </Col>
                    </Row>
                </TabPane>}

                </Tabs>
         </Modal>
    )
}

const mapStateToProps = state => ({
    party: state.party,
    inward: state.inward,
    classificationList: state.packetClassification?.classificationList
});

const SlittingDetailsForm = Form.create({

    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            width: Form.createFormField({
                ...props.inward.process.width,
                value: (props.inward.process.width) ? props.inward.process.width : '',
            }),
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
            twidth: Form.createFormField({
                ...props.inward.process.twidth,
                value: (props.inward.process.twidth) ? props.inward.process.twidth : '',
            }),
            totalActualweight: Form.createFormField({
                ...props.inward.process.totalActualweight,
                value: props.inward.process.totalActualweight || '',
            }),
            targetWeight: Form.createFormField({
                ...props.inward.process.targetWeight,
                value: (props.inward.process.targetWeight) ? props.inward.process.targetWeight : '',
            }),
            noParts: Form.createFormField({
                ...props.inward.process.noParts,
                value: (props.inward.process.noParts) ? props.inward.process.noParts : '',
            }),
            
        };
    },
    onValuesChange(props, values) {
        props.setProcessDetails({ ...props.inward.process, ...values});
    },
})(CreateSlittingDetailsForm);

const SlittingWidthsForm = Form.create()(SlittingWidths);

export default connect(mapStateToProps, {setProcessDetails, saveSlittingInstruction, resetInstruction, updateInstruction,deleteInstructionById, pdfGenerateInward, resetIsDeleted })(SlittingDetailsForm);