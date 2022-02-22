import React, {useEffect, useState} from "react";
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Icon, Tabs} from "antd";
import { createFormFields } from '../../../appRedux/actions';
import {useDispatch, useSelector} from "react-redux";

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
let uuid = 0;
export const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 8},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 24},
    },
};

const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: {span: 24, offset: 0},
      sm: {span: 20, offset: 4},
    },
  };

const CreateField = (props) => {
    const { setshowAddParameter, showAddParameter } = props;
    const dispatch = useDispatch();
  
    const [selectType, setSelectType] = useState({});
  
  
    const { getFieldDecorator, getFieldValue, getFieldProps } = props.form;
  
    const numberChange = (e, index) => {
        const { name, value } = e.target;
        setSelectType(prev => {
           return {...prev, [index]: { ...prev[index], [name]: value } }; 
        });
    }
    
  
    const getNumberFields = index => {
        return (
            <div>
              <div style={{ display: "flex", marginBottom: 10 }}>
                <label style={{ width: '25%' }}> Minimum value :</label>
                <input style={{ width: '60%', marginLeft: '10px' }} className="ant-input" name='min' placeholder='enter minimum value' value={selectType[index].min} onChange={(e) => numberChange(e, index)}></input>
              </div>
              <div style={{ display: "flex", marginBottom: 10 }}>
                <label style={{ width: '25%' }}> Maximum value :</label>
                <input style={{ width: '60%', marginLeft: '10px' }} className="ant-input" name='max' placeholder='enter maximum value' value={selectType[index].max} onChange={(e) => numberChange(e, index)}></input>
              </div>
              <div style={{ display: "flex", marginBottom: 10 }}>
                <label style={{ width: '25%' }}> Default value :</label>
                <input style={{ width: '60%', marginLeft: '10px' }} className="ant-input" name='default' placeholder='enter default value' value={selectType[index].default} onChange={(e) => numberChange(e, index)}></input>
              </div>
            </div>
        )
    };

    const getTextFields = index => {
      return (
        <div style={{ display: "flex", marginBottom: 10 }}>
          <label style={{ width: '25%' }}> Default value :</label>
          <input style={{ width: '60%', marginLeft: '10px' }} className="ant-input" name='default' placeholder='enter default value' value={selectType[index].default} onChange={e => numberChange(e, index)} ></input>
        </div>
      )
    };

    const getRadioFields = index => {
      return (
        <div>
          <div style={{ display: "flex", marginBottom: 10 }}>
            <label style={{ width: '25%' }}> Enter options :</label>
            <input style={{ width: '60%', marginLeft: '10px' }} className="ant-input" name='options' placeholder='enter options comma seperated' value={selectType[index].options} onChange={e => numberChange(e, index)}></input>
          </div>
          <div style={{ display: "flex", marginBottom: 10 }}>
            <label style={{ width: '25%' }}> Default value :</label>
            <input style={{ width: '60%', marginLeft: '10px' }} className="ant-input" name='default' placeholder='enter default value' value={selectType[index].default} onChange={e => numberChange(e, index)}></input>
          </div>
        </div>
      );
    };

    const getTextAreaFields = index => {
      return (
        <>
          <input name='default' placeholder='enter default value' value={selectType[index].default} onChange={e => numberChange(e, index)}></input>
        </>
      )
    }
  
    const generateFieldsByType = (obj = {}, index) => {
        console.log('inside fun');
        const type = obj[index]?.type || '';
        switch (type) {
            case 'number':
                return getNumberFields(index);
            case 'radio':
                return getRadioFields(index);
            case 'text':
            case 'textArea':
                return getTextFields(index);
            default:
                break;
        }
    }
  
    getFieldDecorator('keys', {initialValue: []});
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...formItemLayout}
          required={false}
          key={k}
        >
          <div style={{ display: "flex", marginBottom: 10 }}>
          <label style={{ width: '25%' }}>Paramter Name :</label>
          <input type='text' placeholder="Paramter Name" value={selectType[k]?.value} onChange={(e) => {
              e.preventDefault();
              var val = e.target.value;
              console.log(val);
              setSelectType(prev => { 
                  return {...prev, [k]: { ...prev[k], value: val } }; });
          }} className="ant-input" style={{ width: '60%', marginLeft: '10px' }} />
          </div>
          <div style={{ display: "flex", marginBottom: 10 }}>
            <label style={{ width: '25%' }}>Paramter Type :</label>
            <select className="ant-input" value={selectType[k]?.type} style={{width: '60%', marginLeft: '10px' }} onChange={(e) => {
                var val = e.target.value;
                setSelectType(prev => { 
                  return {...prev, [k]: { ...prev[k], type: val } }; });
            }}>
                <option disabled selected>Select Paramter type</option>
                <option>text</option>
                <option>number</option>
                <option>textArea</option>
                <option>radio</option>
                <option>checkbox</option>
                <option>select</option>
                <option>calendar</option>
            </select>
          </div>
          {generateFieldsByType(selectType, k)}
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => remove(k)}
            />
          ) : null}
        </FormItem>
      );
    });
  
    const remove = (k) => {
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
        setSelectType(prev => {
          delete prev[k];
          return {
            ...prev
          }
        });
      };
  
    const add = () => {
        const {form} = props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        uuid++;
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
          keys: nextKeys,
        });
      };
  
    return (
        <Modal
            title='Create Form'
            visible={showAddParameter}
            onOk={e => {
                e.preventDefault();
                setshowAddParameter(false);
            }}
            width={600}
            onCancel={e => {
                e.preventDefault();
                setshowAddParameter(false);
            }}
        >
            <Card className="gx-card">
                <Row>
                    <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                    <Form>
                        {formItems}
                        <FormItem {...formItemLayoutWithOutLabel}>
                            <Button type="dashed" onClick={() => add()} style={{width: '60%'}}>
                            <Icon type="plus"/> Add field
                            </Button>
                        </FormItem>
                        <FormItem {...formItemLayoutWithOutLabel}>
                            <Button type="primary" onClick={() => {
                                console.log(selectType); //
                                // props.setFormItemsObj(selectType); // calling
                                dispatch(createFormFields(selectType));
                                setshowAddParameter(false)
                            }}>Submit</Button>
                        </FormItem>
                    </Form>
                    </Col>
                </Row>
            </Card>
        </Modal>
    )
  };
  
const CreateForm = Form.create()(CreateField);
export default CreateForm;