import React, {useEffect, useState} from "react";
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Icon, Tabs} from "antd";

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
        md: {span: 16},
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
  
    const [selectType, setSelectType] = useState({});
  
  
    const { getFieldDecorator, getFieldValue, getFieldProps } = props.form;
  
    const numberChange = (e, index) => {
        const { name, value } = e.target;
        setSelectType(prev => {
           return {...prev, [index]: { ...prev[index], [name]: value } }; 
        });
    }
    
  
    const getNumberFields = (index) => {
        return (
            <>
                <input name='min' placeholder='enter minimum value' value={selectType[index].min} onChange={(e) => numberChange(e, index)}></input>
                <input name='max' placeholder='enter maximum value' value={selectType[index].max} onChange={(e) => numberChange(e, index)}></input>
                <input name='default' placeholder='enter default value' value={selectType[index].default} onChange={(e) => numberChange(e, index)}></input>
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
                return () => {};
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
          <input type='text' placeholder="Paramter Name" value={selectType[k]?.value} onChange={(e) => {
              e.preventDefault();
              var val = e.target.value;
              console.log(val);
              setSelectType(prev => { 
                  return {...prev, [k]: { ...prev[k], value: val } }; });
          }} style={{width: '50%', marginRight: 8}}/>
          <select value={selectType[k]?.type} style={{width: '50%', marginRight: 8}} onChange={(e) => {
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
          </select>
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
                                props.setFormItemsObj(selectType); // calling
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