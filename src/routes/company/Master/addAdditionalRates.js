import React, { useEffect, useState } from "react";
import { Card, Divider, Radio, Modal, Row, Col, Form, Input, Select, Checkbox} from "antd";
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

const Option = Select.Option;
export const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 12},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 12},
    },
};
const AdditionalRates=(props)=>{
    const { getFieldDecorator, getFieldValue } = props.form;
    getFieldDecorator('keys', {initialValue: [{width:0, no:0, weight:0}]});
    const keys = getFieldValue('keys');
    const [parts, setParts]= useState("");
    const [processId, setProcessId] = useState();
    const [slits, setSlits]= useState("");
    const[bundleWeight, setBundleWeight] = useState("")
    const [checked, setChecked]=useState(false)
    const [showAdditionalRates, setShowAdditionalRates]= useState(props?.showAdditionalRates)
    const [balanceCoil, setBalanceCoil]= useState("")
    const [length, setLength] =useState("")
      useEffect(()=>{
        props.setShowAdditionalRates(showAdditionalRates)
      },[showAdditionalRates])
      
    const checkboxChange = (e: CheckboxChangeEvent) => {
        setChecked(e.target.checked)
        console.log(`checked = ${e.target.checked}`);
      };
      const processSelectChange=(e)=>{
        setProcessId(e)
      }
      const radioChange=(e)=>{
        if(e.target.name==="parts"){
        setParts(e.target.value)
        } else if(e.target.name ==="slits"){
            setSlits(e.target.value)
        }else if(e.target.name ==="bundleweight"){
            setBundleWeight(e.target.value)
        }else if(e.target.name ==="balanceCoil"){
            setBalanceCoil(e.target.value)
        }else if(e.target.name==="length"){
            setLength(e.target.value)
        }
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
    const multipleFields=(type)=>{
        return <><Row>
        <Col lg={6} md={6} sm={12} xs={24}>
            <label>Range From</label>
        </Col>
        <Col lg={6} md={6} sm={12} xs={24}>
            <label>Range To</label>
        </Col>
        <Col lg={6} md={6} sm={12} xs={24}>
            <label>Additional Rate</label>
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
                    <Form.Item name={"minimum"+type} >
                        {getFieldDecorator(`minimum${type}[${index}]`, {
                            rules: [{ required: true, message: 'Please enter width' },
                                {pattern: "^[0-9]*$", message: 'Width greater than available width'},],
                        })(
                            <Input id={"minimum"+type} />
                        )}
                    </Form.Item>
                </Col>
                <Col lg={6} md={6} sm={12} xs={24}>
                    <Form.Item name={"maximum"+type}>
                        {getFieldDecorator(`maximum${type}[${index}]`, {
                            rules: [{ required: true, message: 'Please enter nos' },
                                {pattern: "^[0-9]*$", message: 'Number of slits should be a number'},],
                        })(
                            <Input id={"maximum"+type} />
                        )}
                    </Form.Item>
                </Col>
                <Col lg={6} md={6} sm={12} xs={24}>
                    <Form.Item name={type+"rate"}>
                        {getFieldDecorator(`${type}Rate[${index}]`)(
                            <Input id={type+"rate"} />
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
    </Row></>
      }
       const getLengthCriteria=()=>{
        return (processId ===3 || processId ===1) && <><Form.Item label="Is length a criteria?"
        >
        {getFieldDecorator('radioLength', {
                rules: [{ required: true, message: 'Please select radio' }],
            })(
                <Radio.Group id="radioLength" name ="length" onChange={radioChange} value={length}>
                <Radio value={'yesLength'}>Yes</Radio>
                <Radio value={'noLength'}>No</Radio>
            </Radio.Group>
            )}
        
        </Form.Item>
    {length ==="yesLength" &&multipleFields("length")}</>
      }
     
      return (
        <Modal
                 title='Add Additional Rates'
                 visible={props.showAdditionalRates}
                 width={900}
                 onCancel={()=>setShowAdditionalRates(false)}
                >
                    <Card className="gx-card">
                        <Row>
                            <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                                <Form {...formItemLayout} className="gx-pt-4">
                                <Form.Item >
                                    <Checkbox onChange={checkboxChange}>Apply to multiple fields</Checkbox>
                                    </Form.Item>
                                    {checked &&<><Form.Item label="Party Name">
                                        {getFieldDecorator('partyId', {
                                            rules: [{ required: true, message: 'Please select party name!' }],
                                        })(
                                            <Select
                                             id="partyId"
                                             mode="multiple"
                                             style={{ width: '100%' }}
                                            >                                                
                                            {props.party?.partyList?.map(party => <Option value={party.nPartyId}>{party.partyName}</Option>)}
                                            </Select>
                                        )}
                                        </Form.Item>
                                       
                                    </>
                                    }
                                    {!checked &&<Form.Item label="Party Name" >
                                        {getFieldDecorator('partyId', {
                                            rules: [{ required: true, message: 'Please enter Party name!' }],
                                            })(
                                                <Select
                                                showSearch
                                                style={{width: 300}}
                                                placeholder="Select a Party"
                                              >
                                                {props.party?.partyList?.map(party => <Option value={party.nPartyId}>{party.partyName}</Option>)}
                                              </Select>
                                        )}
                                    </Form.Item>}
                                    <Form.Item label="Process Name" >
                                        {getFieldDecorator('processId', {
                                            rules: [{ required: true, message: 'Please enter Process name!' }],
                                            })(
                                                <Select
                                                showSearch
                                                style={{width: 300}}
                                                placeholder="Select a Process"
                                                onChange={processSelectChange}
                                              >
                                                {props.process?.processList?.map(process => <Option value={process.processId}>{process.processName}</Option>)}
                                              </Select>
                                        )}
                                    </Form.Item>
                                    {/* Slit specific fields - start */}
                                    {(processId === 2|| processId ===3)?<>
                                        <Form.Item label="No of parts alert to activate?"
                                        >
                                        {getFieldDecorator('radioParts', {
                                                rules: [{ required: true, message: 'Please select Parts' }],
                                            })(
                                                <Radio.Group id="radioParts" name="parts" onChange={radioChange} value={parts}>
                                                <Radio value={'yesparts'}>Yes</Radio>
                                                <Radio value={'noparts'}>No</Radio>
                                            </Radio.Group>
                                            )}
                                        
                                        </Form.Item>
                                         {parts==="yesparts" && multipleFields("parts")}
                                    <Form.Item label="No of slits alert to activate?"
                                        >
                                        {getFieldDecorator('radioSlits', {
                                                rules: [{ required: true, message: 'Please select Slits' }],
                                            })(
                                                <Radio.Group id="radioSlits" name ="slits" onChange={radioChange} value={slits}>
                                                <Radio value={'yesslits'}>Yes</Radio>
                                                <Radio value={'noslits'}>No</Radio>
                                            </Radio.Group>
                                            )}
                                        
                                        </Form.Item>
                                    {slits ==="yesslits" && multipleFields("slits")}
                                    {/* Slit specific fields -end */}
                                  {getLengthCriteria()}
                                    </>:getLengthCriteria()}
                                    {/* Bundle weight field start */}
                                    <Form.Item label="Bundle weight alert to activate?"
                                        >
                                        {getFieldDecorator('radioWeight', {
                                                rules: [{ required: true, message: 'Please select Bundle Weight' }],
                                            })(
                                                <Radio.Group id="radioWeight" name="bundleweight" onChange={radioChange} value={bundleWeight}>
                                                <Radio value={'yes'}>Yes</Radio>
                                                <Radio value={'no'}>No</Radio>
                                            </Radio.Group>
                                            )}
                                        
                                        </Form.Item>
                                        {bundleWeight === "yes" && multipleFields("bundleweight")}
                                    {/* Bundle weight field -end */}
                                    {/* Balanced coil fields-- start */}
                                    <Form.Item label="Balance coil removed and processed again"
                                        >
                                        {getFieldDecorator('balanceCoil', {
                                                rules: [{ required: true, message: 'Please select Slits' }],
                                            })(
                                                <Radio.Group id="balanceCoil" name ="balanceCoil" onChange={radioChange} value={balanceCoil}>
                                                <Radio value={'yesBalance'}>Yes</Radio>
                                                <Radio value={'noBalance'}>No</Radio>
                                            </Radio.Group>
                                            )}
                                        
                                        </Form.Item>
                                        {balanceCoil ==="yesBalance" &&<><Form.Item label="Additional Rate">
                                        {getFieldDecorator('balanceCoilRate', {
                                            rules: [{ required: true, message: 'Please input the Rate!' }],
                                        })(
                                            <Input id="balanceCoilRate" />
                                        )}
                                    </Form.Item></>}
                                    {/* Balanced coil fields - end */}
                                </Form>
                            </Col>
                        </Row>
                    </Card>
               </Modal>
    )
}
export default AdditionalRates