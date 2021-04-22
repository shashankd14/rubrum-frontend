import {Button, Col, Form, Icon, Input, message, Modal, Row, Table, Radio} from "antd";
import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import moment from "moment";

import {APPLICATION_DATE_FORMAT} from '../../../constants';
import {setProcessDetails, saveSlittingInstruction, resetInstruction, updateInstruction} from '../../../appRedux/actions/Inward';

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
        md: {span: 7},
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

    const lengthValue1 = props.coilDetails.instruction && props.coilDetails.instruction.length > 0 ? props.plannedLength(props.coilDetails) : props.coilDetails.fLength ? props.coilDetails.fLength  : props.plannedLength(props.coilDetails)
    const widthValue1 = props.coilDetails.instruction && props.coilDetails.instruction.length > 0  ? props.plannedWidth(props.coilDetails):  props.coilDetails.fWidth ? props.coilDetails.fWidth  : props.plannedWidth(props.coilDetails);
    const [len, setlen]= useState(lengthValue1);
    const [width, setwidth] = useState(widthValue1);
    const [twidth, settwidth]= useState(0);
    
    const keys = getFieldValue('keys');
    let widthChange = 0;
    let nosChange = 0;

    useEffect(() => {
        getAlert();
      }, [props.length]);
      useEffect(() => {
          let lengthValue1 = 0;
          let widthValue1 = 0;
          if(props.coilDetails.instruction && props.coilDetails.instruction.length > 0){
             lengthValue1 =  props.plannedLength(props.coilDetails)
             widthValue1 = props.plannedWidth(props.coilDetails);
          } else {
            lengthValue1 = props.coilDetails.fLength ? props.coilDetails.fLength  : props.plannedLength(props.coilDetails)
            widthValue1 = props.coilDetails.fWidth ? props.coilDetails.fWidth  : props.plannedWidth(props.coilDetails);
          }
        
        setwidth(widthValue1);
        setlen(lengthValue1);
    }, [props.coilDetails]);
    //   useEffect(() => {
    //     setlen(len+props.deletedLength);
    //   }, [props.deletedLength]);
     
    
    const getAlert =() =>{
        if(props.cuts.length> 0){
            const index = 0;
            const obj = props.cuts[props.length];
             const arr = [obj.width,obj.no, obj.weight];
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

    const addNewSize = (e) => {
        props.form.validateFields((err, values) => {
            if (!err) {
                let totalWidth = 0;
                let totalWeight = 0 ;
                const widthValue = props.coilDetails.fWidth ? props.coilDetails.fWidth : props.plannedWidth(props.coilDetails)
                const lengthValue = props.coilDetails.fLength ? props.coilDetails.fLength : props.plannedLength(props.coilDetails)
                const weightValue = props.coilDetails.fpresent >= 0? props.coilDetails.fpresent : props.plannedWeight(props.coilDetails)
                const slits = []
                for(let i=0; i < values.widths.length; i++) {
                    for (let j=0; j<values.nos[i];j++){
                        let slitValue = {
                            name: i+1, processDate: moment().format(APPLICATION_DATE_FORMAT),
                            length: values.length/values.nos[i],
                            width: values.widths[i],
                            no: j+1,
                            slitno:values.nos[i],
                            weight:values.weights[i],
                            inwardId: props.coilDetails.inwardEntryId ? props.coilDetails.inwardEntryId : '',
                            instructionId: props.coilDetails.instructionId ? props.coilDetails.instructionId : '',
                        }
                        slits.push(slitValue)
                        
                    }
                    totalWidth += values.widths[i]*values.nos[i];
                    totalWeight += values.weights[i]*values.nos[i];
                    settwidth(totalWidth);
                }
                if(totalWidth > widthValue) {
                    message.error('Sum of slits width is greater than width of coil.', 2);
                    props.form.resetFields();
                }else if(values.length > lengthValue) {
                    message.error('Length greater than available length', 2);
                    props.form.resetFields();
                }else if(totalWeight > weightValue) {
                    message.error('Weight greater than available weight', 2);
                    props.form.resetFields();
                } else
                    props.setSlits(slits);
                    props.form.resetFields();
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
    const handleChange = (e)=>{
        if(e.target.value != e.target.defaultValue){
        let finalLength = lengthValue1-Number(e.target.value);
        setlen(finalLength);
        }
    }
    const handleBlur = (e)=>{
        props.form.validateFields((err, values) => {
            let width = 0;
            let weight = 0
            if(!err){
                for(let i=0; i < values.widths.length; i++) {
                    width += values.widths[i]*values.nos[i];
                    weight +=Number(values.weights[i])*values.nos[i];
                    settwidth(width);
                    props.setweight(weight);
                }
            }
      })
    }
    const handleWidthChange = (e)=>{
        if(e.target.value != e.target.defaultValue){
        let finalLength = widthValue1-Number(e.target.value);
        setwidth(finalLength);
        }
    }
    const onChange=()=>{
        props.form.setFieldsValue({
            length: props.plannedLength(props.coilDetails)
        });
    }
    const maxWidth = parseInt(props.coilDetails.fWidth ? props.coilDetails.fWidth : props.plannedWidth(props.coilDetails)).toString().length;
    const maxLength = parseInt((props.coilDetails.fLength ? props.coilDetails.fLength  : props.plannedLength(props.coilDetails))).toString().length;
    const maxWeight = parseInt((props.coilDetails.fQuantity ? props.coilDetails.fQuantity  : props.plannedWeight(props.coilDetails))).toString().length;

    return (
        <>
            <Form {...formItemLayoutSlitting}>
                <label>Available length : {len}mm</label>
                <div><label>Available Width : {width}mm</label></div>
                <Form.Item>
                    {getFieldDecorator('Balanced', {
                    initialValue: "",
                    rules: [{
                    required: false,
                    }],
                    })(<Radio.Group onChange={onChange}>
                        <Radio value="balanced">Balanced</Radio> 
                    </Radio.Group>
                    )}

                </Form.Item>

                <Form.Item label="Length" dependencies={["length","widths[0]"]}>
                    {getFieldDecorator('length', {
                        rules: [{ required: true, message: 'Please enter Length' },
                            {pattern: `^[0-9]{0,${maxLength}}$`, message: 'Length greater than available length'},],
                    })(
                        <Input id="length" disabled={props.wip ? true : false} onChange ={handleChange} />
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
                                            {pattern: `^[0-9]{0,${maxWidth}}$`, message: 'Width greater than available width'},],
                                    })(
                                        <Input id="widths" disabled={props.wip ? true : false} onChange ={handleWidthChange} onBlur={handleBlur}/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col lg={6} md={6} sm={12} xs={24}>
                                <Form.Item name="nos">
                                    {getFieldDecorator(`nos[${index}]`, {
                                        rules: [{ required: true, message: 'Please enter nos' },
                                            {pattern: "^[0-9]*$", message: 'Number of slits should be a number'},],
                                    })(
                                        <Input id="nos" disabled={props.wip ? true : false} onBlur={handleBlur} {...getFieldProps('nos')}/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col lg={6} md={6} sm={12} xs={24}>
                                <Form.Item name="weights">
                                    {getFieldDecorator(`weights[${index}]`, {
                                        rules: [{ required: true, message: 'Please enter weight' },
                                            {pattern: `^[0-9]{0,${maxWeight}}$`, message: 'Weight greater than available weight'},],
                                    })(
                                        <Input id="weights" disabled={props.wip ? true : false} onBlur={handleBlur}/>
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
                <Row className="gx-mt-4">
                    <Col span={16} style={{ textAlign: "center"}}>
                        <Button type="primary" htmlType="submit" onClick={() => addNewSize()} disabled={props.wip ? true : false}>
                            Add Size<Icon type="right"/>
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

const CreateSlittingDetailsForm = (props) => {
    const {getFieldDecorator} = props.form;
    const [cuts, setCuts] = useState([]);
    const [length,setLength]= useState();
    let loading = '';
    let cutArray=[];
    const [reset, setreset] = useState(true);
    // const [deletedLength, setDeletedLength]= useState(0);
    
    
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
        dataIndex:'actualLength',
        render: (text, record, index) => (
            <Input value={text}  onChange={onInputChange("actualLength", index)} />
          )
    },
    {
        title: 'Width',
        dataIndex:'plannedWidth',
        key: 'plannedWidth',
    },
    {
        title: 'Actual Width',
        dataIndex:'actualWidth',
        render: (text, record, index) => (
            <Input value={text}  onChange={onInputChange("actualWidth", index)} />
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
            <Input value={text}  onChange={onInputChange("actualNoOfPieces", index)} />
          )
    },
    {
        title: 'Weight',
        dataIndex:'plannedWeight',
        key: 'plannedWeight',
    },
    {
        title: 'Actual Weight',
        dataIndex:'actualWeight',
        render: (text, record, index) => (
            <Input value={text}  onChange={onInputChange("actualWeight", index)} />
          )
    }
];
const columnsPlan=[
    {
        title: 'Serial No',
        key: 'index',
        render:(text, record, index) => (index + 1 )
        
    },
    {
        title: 'Slitting Date',
        render:() =>(moment(new Date()).format('DD/MM/YYYY')),
        key: 'instructionDate',
    },
    {
        title: 'Length',
        dataIndex:'length',
        key: 'length',
    },
    {
        title: 'Width',
        dataIndex:'width',
        key: 'width',
    },
    {
        title: 'Weight',
        dataIndex:'weight',
        key:'weight'
    },
    {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (text, record, index) => (
            <span>
                <span className="gx-link" onClick={(e) => {onEdit(index, e); }}><Icon type="edit" /></span>
                <span className="gx-link" onClick={(e) => {onDelete(index, e); }}><Icon type="delete" /></span>
            </span>
            
        ),
    },
];
    const [tableData, setTableData] = useState(props.wip?(props.childCoil ?props.coilDetails :(props.coilDetails && props.coilDetails.instruction)? props.coilDetails.instruction:props.coilDetails.childInstructions): cuts);
    const [tweight, settweight]= useState(0);
    const onDelete = (key, e) => {
        e.preventDefault();
        
        const data = cuts.filter(item => {
            // for (let i= Number(item.slitno)-1;i< Number(item.slitno);i++){
            //     if(cuts.indexOf(item) === key){
            //         setDeletedLength(Number(item.length));
            //     }
            // }
           
            return cuts.indexOf(item) !== key

        });
        setCuts(data);
      }
    const onEdit = (key, e) => {
        setLength(key);
      }
      
   useEffect(()=>{
   const result = cuts.filter(item => item.instructionId === props.coilDetails.instructionId) 
   let resetter = cuts.length> 0 ? result.length > 0 ? true : false : true
   setreset(resetter);
   },[props.coilDetails])
    useEffect(() => {
    let data = props.wip?(props.childCoil ?props.coilDetails :(props.coilDetails && props.coilDetails.instruction)? props.coilDetails.instruction:props.coilDetails.childInstructions): cuts;
    if(props.childCoil){
        const arrayData =[];
        arrayData.push(data);
        data= arrayData
    }
    const newData = [...data];

setTableData(newData);

}, [props.coilDetails]);

  const onInputChange = (key, index) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newData = [...tableData];
    newData[index][key] = Number(e.target.value);
    setTableData(newData);
  };
    useEffect(() => {
        if(props.inward.process.length && props.inward.process.no) {
            props.setProcessDetails({...props.inward.process, weight: 0.00000000785*parseFloat(props.inward.plan.fWidth)*parseFloat(props.inward.plan.fThickness)*parseFloat(props.inward.process.length)*parseFloat(props.inward.process.no)});
        }
    }, [props.inward.process.length, props.inward.process.no])

    useEffect(() => {
        if(props.inward.instructionSaveLoading && !props.wip) {
            loading = message.loading('Saving Slit Instruction..');
        }
    }, [props.inward.instructionSaveLoading]);

    useEffect(() => {
        if(props.inward.instructionSaveSuccess && !props.wip) {
            loading = '';
            message.success('Slitting instruction saved successfully', 2).then(() => {
                props.setShowSlittingModal(false);
                props.resetInstruction();
            });
        }
    }, [props.inward.instructionSaveSuccess])

    return (
        <Modal
            title="Slitting Instruction"
            visible={props.showSlittingModal}
            onOk={() => {
                if(props.wip){
                    props.updateInstruction(tableData);
                    props.setShowSlittingModal()
                }
                else{
                    props.saveSlittingInstruction(cuts);
                props.setShowSlittingModal()
                }
                
            }}
            width={1020}
            onCancel={() => props.setShowSlittingModal()}
        >
            <Row>
                <Col lg={12} md={16} sm={24} xs={24} span={16} className="gx-align-self-center">
                    <h3>Coil Details </h3>
                    <Form {...formItemLayout} className="login-form gx-pt-4">
                        <Form.Item>
                            <SlittingWidthsForm setSlits={(slits) => setCuts([...cuts,...slits])} setweight={(w) => settweight(w)} coilDetails={props.coilDetails} wip={props.wip} plannedLength={props.plannedLength} plannedWidth ={props.plannedWidth} plannedWeight ={props.plannedWeight} length={length} cuts={cuts}/>
                        </Form.Item>

                    </Form>
                </Col>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <Table className="gx-table-responsive" columns={props.wip?columns: columnsPlan} dataSource={props.wip?tableData:reset ?cuts : cutArray}/>
                    <Form.Item label="Total weight(mm)">
                    {getFieldDecorator('tweight', {
                        rules: [{ required: false}],
                    })(
                        <>
                            <Input id="tweight" disabled={true} value={tweight} name="tweight" />
                        </>
                    )}
                </Form.Item>
                </Col>
            </Row>
        </Modal>
    )
}

const mapStateToProps = state => ({
    party: state.party,
    inward: state.inward,
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
        };
    },
    onValuesChange(props, values) {
        props.setProcessDetails({ ...props.inward.process, ...values});
    },
})(CreateSlittingDetailsForm);

const SlittingWidthsForm = Form.create()(SlittingWidths);

export default connect(mapStateToProps, {setProcessDetails, saveSlittingInstruction, resetInstruction, updateInstruction})(SlittingDetailsForm);