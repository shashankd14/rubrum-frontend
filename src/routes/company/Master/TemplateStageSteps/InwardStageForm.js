import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { camelCase } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
  Button,
  Card,
  Divider,
  Table,
  Modal,
  Row,
  Col,
  Form,
  Input,
  Icon,
  Tabs,
  Radio,
  DatePicker,
} from 'antd';
import CreateForm from './../CreateField';
import {
  createFormFields,
  setTemplateName,
} from '../../../../appRedux/actions';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
let uuid = 0;
export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 16 },
  },
};

const InwardStageForm = props => {
  const [template, setTemplate] = React.useState('');
  const [fields, setFields] = React.useState(props.formFields || []);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (props.formFields.length > 0) {
      setFields(props.formFields);
    }
  }, [props.formFields]);

  const setFeildValue = (e, index) => {
    const { value } = e.target;
    setFields(prev => {
      const res = [...prev];
      res[index].value = value;
      return res;
    });
  };

  const setDateValue = (_date, dateString, index) => {
    setFields(prev => {
      const res = [...prev];
      res[index].value = dateString;
      return res;
    });
  };

  return (
    <>
      <Col span={18} className="login-form gx-pt-4">
        <div style={{ margin: '20px', textAlign: 'center' }}>
          <label>Template Name : </label>
          <input
            id="template"
            type="text"
            placeholder="Template Name"
            onChange={e => {
              e.preventDefault();
              setTemplate(e.target.value);
            }}
            className="ant-input"
            style={{ width: '35%', marginLeft: '10px', textAlign: 'center' }}
          />
        </div>
        <CreateForm formFields={props.formFields} setFields={setFields} />
        <Card style={{ minHeight: '40vh' }} className="gx-card">
          <Row>
            <Col
              lg={24}
              md={24}
              sm={24}
              xs={24}
              className="gx-align-self-center"
            >
              {!!fields?.length && (
                <Form {...formItemLayout} style={{ height: '100%' }}>
                  {fields &&
                    fields?.map((field, index) => {
                      let inputEle = null;
                      if (field.type === 'calendar') {
                        inputEle = (
                          <DatePicker
                            style={{ width: 250 }}
                            className="gx-mb-3 gx-w-200"
                            format="DD/MM/YYYY"
                            defaultValue={moment(new Date(), 'DD/MM/YYYY')}
                            onChange={(date, dateString) =>
                              setDateValue(date, dateString, index)
                            }
                          />
                        );
                      } else if (field.type === 'radio') {
                        const options = field.options.split(',') || [];
                        inputEle = (
                          <Radio.Group value={field.value}>
                            {options.map((item, index) => (
                              <Radio
                                value={camelCase(item)}
                                key={index}
                                onChange={e => setFeildValue(e, index)}
                              >
                                {item}
                              </Radio>
                            ))}
                          </Radio.Group>
                        );
                      } else if (field.type === 'textArea') {
                        inputEle = (
                          <Input.TextArea
                            type={field.type}
                            value={field.value}
                            onChange={e => setFeildValue(e, index)}
                          ></Input.TextArea>
                        );
                      } else if (field.type === 'number') {
                        inputEle = (
                          <Input
                            type={field.type}
                            max={field.max}
                            min={field.min}
                            value={field.value}
                            onChange={e => setFeildValue(e, index)}
                          ></Input>
                        );
                      } else {
                        inputEle = (
                          <Input
                            type={field.type}
                            value={field.value}
                            onChange={e => setFeildValue(e, index)}
                          ></Input>
                        );
                      }
                      return (
                        <FormItem
                          style={{ width: '70%' }}
                          key={index}
                          label={field.label}
                        >
                          {inputEle && inputEle}
                        </FormItem>
                      );
                    })}
                </Form>
              )}
            </Col>
          </Row>
        </Card>
        <Button
          type="primary"
          htmlType="submit"
          style={{ float: 'right' }}
          onClick={() => {
            dispatch(createFormFields(fields, 'inward'));
            dispatch(setTemplateName(template));
            props.updateStep(1);
          }}
        >
          Forward
          <Icon type="right" />
        </Button>
      </Col>
    </>
  );
};

const mapStateToProps = state => ({
  formFields: state.quality.formFields?.inward || [],
});

export default connect(mapStateToProps)(InwardStageForm);
