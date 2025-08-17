import React, {useEffect, useState} from "react";
import {Button, Form,  Icon} from "antd";

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

const CreateField = (props) => {
    const { setFields, btnName } = props;
    const [selectType, setSelectType] = useState({});
    const [showParameters, setShowParamters] = useState(false);  
    const { getFieldDecorator, getFieldValue } = props.form;

    useEffect(() => {
      setSelectType(selectType);
    }, [selectType])
  
    const numberChange = (e) => {
        const { name, value } = e.target;
        setSelectType(prev => {
           return {...prev, [name]: value }; 
        });
    }
    
    const getNumberFields = () => {
        return (
            <div style={{ width: "100%", textAlign: "center", padding: "15px", marginBottom: 10 }}>
                <input style={{ width: '30%', marginLeft: '10px' }} className="ant-input" name='min' placeholder='enter minimum value' value={selectType.min} onChange={(e) => numberChange(e)}></input>
                <input style={{ width: '30%', marginLeft: '10px' }} className="ant-input" name='max' placeholder='enter maximum value' value={selectType.max} onChange={(e) => numberChange(e)}></input>
                <input style={{ width: '30%', marginLeft: '10px' }} className="ant-input" name='value' placeholder='enter default value' value={selectType.value} onChange={(e) => numberChange(e)}></input>
            </div>
        )
    };

    const getTextFields = () => {
      return (
        <div style={{ width: "100%", textAlign: "center", padding: "15px", marginBottom: 10 }}>
          <input style={{ width: '30%', marginLeft: '10px' }} className="ant-input" name='value' placeholder='enter default value' value={selectType.value} onChange={e => numberChange(e)} ></input>
        </div>
      )
    };

    const getRadioFields = () => {
      return (
        <div style={{ width: "100%", textAlign: "center", padding: "15px", marginBottom: 10 }}>
            <input style={{ width: '30%', marginLeft: '10px' }} className="ant-input" name='options' placeholder='enter options comma seperated' value={selectType.options} onChange={e => numberChange(e)}></input>
            <input style={{ width: '30%', marginLeft: '10px' }} className="ant-input" name='value' placeholder='enter default value' value={selectType.value} onChange={e => numberChange(e)}></input>
        </div>
      );
    };

    const generateFieldsByType = (obj = {}) => {
        const type = obj.type || '';
        switch (type) {
            case 'number':
                return getNumberFields();
            case 'radio':
                return getRadioFields();
            case 'text':
            case 'textArea':
                return getTextFields();
            default:
                break;
        }
    }
  
    getFieldDecorator('keys', {initialValue: []});
    
    const clearParameterForm = () => {
      document.getElementById('name').value = '';
      document.getElementById('type').selectedIndex = 0;
    }
  
    return (
      <Form style={{ minHeight: "20%", textAlign: "center" }}>
                  {/* {formItems} */}
          <Button type="dashed" onClick={() => setShowParamters(true)} style={{width: '50%'}}>
            <Icon type="plus"/> { btnName ? btnName : 'Add Parameters' }
          </Button>
          {showParameters && <div style={{ display: "flex", flexFlow: "row wrap", alignContent: "space-between", justifyContent: "center", marginBottom: 10 }}>
            <input id="name" type='text' placeholder="Paramter Name" value={selectType.label} onChange={(e) => {
                e.preventDefault();
                var val = e.target.value;
                setSelectType(prev => { 
                    return { ...prev, label: val } });
            }} className="ant-input" style={{ width: '35%', marginLeft: '10px' }} />
            <select id="type" className="ant-input" value={selectType.type} style={{width: '35%', marginLeft: '10px' }} onChange={(e) => {
                  var val = e.target.value;
                  setSelectType(prev => { 
                    return { ...prev, type: val } });
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
              {generateFieldsByType(selectType)}
              <Button style={{ marginLeft: '10px' }}  type="primary" onClick={() => {
                  // props.setFormItemsObj(selectType); // calling
                  // dispatch(createFormFields(selectType, props.name));
                  setFields(prev => [...prev, selectType]);
                  setSelectType({});
                  clearParameterForm();
              }}>Add</Button>
          </div>}
      </Form>
    )
  };
  
const CreateForm = Form.create()(CreateField);
export default CreateForm;