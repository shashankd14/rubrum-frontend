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
    const { getFieldDecorator } = props.form;
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
       const getLengthCriteria=()=>{
        return (processId ===3 || processId ===1) && <><Form.Item label="Is length a criteria?"
        >
        {getFieldDecorator('radioLength', {
                rules: [{ required: true, message: 'Please select radio' }],
            })(
                <Radio.Group id="radioLength" name ="Length" onChange={radioChange} value={length}>
                <Radio value={'yesLength'}>Yes</Radio>
                <Radio value={'noLength'}>No</Radio>
            </Radio.Group>
            )}
        
        </Form.Item>
    {length ==="yesLength" &&<><Form.Item label="Minimum Length">
        {getFieldDecorator('lengthFrom', {
            rules: [{ required: true, message: 'Please input the GST Number!' }],
        })(
            <Input id="lengthFrom" />
        )}
    </Form.Item>
    <Form.Item label="Maximum Length">
        {getFieldDecorator('lengthTo', {
            rules: [{ required: true, message: 'Please input the GST Number!' }],
        })(
            <Input id="lengthTo" />
        )}
    </Form.Item>
    <Form.Item label="Additional Rate">
        {getFieldDecorator('lengthRate', {
            rules: [{ required: true, message: 'Please input the GST Number!' }],
        })(
            <Input id="lengthRate" />
        )}
    </Form.Item></>}</>
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
                                        <Form.Item label="No of parts"
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
                                         {parts==="yesparts" && <><Form.Item label="Minimum No Of Parts">
                                        {getFieldDecorator('noofPartsFrom', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="noofPartsFrom" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Maximum No Of Parts">
                                        {getFieldDecorator('noofPartsTo', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="noofPartsTo" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Additional Rate">
                                        {getFieldDecorator('rate', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="rate" />
                                        )}
                                    </Form.Item></>}
                                    <Form.Item label="No of Slits"
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
                                    {slits ==="yesslits" &&<><Form.Item label="Minimum No Of Slits">
                                        {getFieldDecorator('noofSlitsFrom', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="noofSlitsFrom" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Maximum No Of Slits">
                                        {getFieldDecorator('noofSlitsTo', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="noofSlitsTo" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Additional Rate">
                                        {getFieldDecorator('slitsrate', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="slitsrate" />
                                        )}
                                    </Form.Item></>}
                                    {/* Slit specific fields -end */}
                                  {getLengthCriteria()}
                                    </>:getLengthCriteria()}
                                    {/* Bundle weight field start */}
                                    <Form.Item label="Bundle Weight"
                                        >
                                        {getFieldDecorator('radioWeight', {
                                                rules: [{ required: true, message: 'Please select Parts' }],
                                            })(
                                                <Radio.Group id="radioWeight" name="bundleWeight" onChange={radioChange} value={parts}>
                                                <Radio value={'yes'}>Yes</Radio>
                                                <Radio value={'no'}>No</Radio>
                                            </Radio.Group>
                                            )}
                                        
                                        </Form.Item>
                                        {bundleWeight === "yes" &&<><Form.Item label="Minimum Bundle Weight">
                                        {getFieldDecorator('bundleWeightFrom', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="bundleWeightFrom" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Maximum Bundle Weight">
                                        {getFieldDecorator('bundleWeightTo', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="bundleWeightTo" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Additional Rate">
                                        {getFieldDecorator('weightRate', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="weightRate" />
                                        )}
                                    </Form.Item></>}
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