import React from "react";
import {connect} from 'react-redux';
import { camelCase } from 'lodash';
import moment from 'moment';
import {useDispatch} from "react-redux";
import {Button, Card, Row, Col, Form, Input, Icon, Radio, DatePicker} from "antd";
import CreateForm from './../CreateField';
import { createFormFields, saveTemplate } from '../../../../appRedux/actions';

const FormItem = Form.Item;
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

const PostDispatchStageForm = (props) => {

    const [fields, setFields] = React.useState(props.formFields || []);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (props.formFields.length > 0) {
            setFields(props.formFields)
        }
    }, [props.formFields])

   return (
    <>
        <Col span={18} className="login-form gx-pt-4">
        <CreateForm formFields={props.formFields} setFields={setFields} />
            <Card style={{ minHeight: "40vh" }} className="gx-card">
                <Row>
                    <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                        {!!fields?.length && <Form {...formItemLayout} style={{ height: "100%" }}>
                            { fields && fields?.map((field, index) => {
                                let inputEle = null;
                                if (field.type === 'calendar') {
                                        inputEle = (
                                            <DatePicker
                                                style={{width: 250}}
                                                className="gx-mb-3 gx-w-200"
                                                format='DD/MM/YYYY'
                                                defaultValue={moment(new Date(), 'DD/MM/YYYY')}
                                            />
                                        )
                                }
                                else if (field.type === 'radio') {
                                        const options = field.options.split(',') || [];
                                        inputEle = (
                                            <Radio.Group value={field.value}>
                                                {options.map((item, index) => (
                                                    <Radio value={camelCase(item)} key={index}>{item}</Radio>
                                                ))}
                                            </Radio.Group>
                                        );
                                } else if (field.type === 'textArea') {
                                        inputEle = (
                                            <Input.TextArea type={field.type} value={field.value}>
                                            </Input.TextArea>
                                        )
                                } else if (field.type === 'number') {
                                    inputEle = (
                                        <Input type={field.type} max={field.max} min={field.min} value={field.value}>
                                        </Input>
                                    );
                                } else {
                                    inputEle = (
                                        <Input type={field.type} value={field.value}>
                                        </Input>
                                    );
                                }
                                return (
                                    <FormItem style={{ width: "70%" }} key={index} label={field.label}>
                                        {inputEle && inputEle}
                                    </FormItem>
                                )
                            })}
                        </Form>}
                    </Col>
                </Row>
            </Card>
            <Button style={{ marginLeft: 8 }} onClick={() => props.updateStep(3)}>
                <Icon type="left"/>Back
            </Button>
            <Button type="primary" htmlType="submit" style={{ float: "right" }} onClick={() => {
                dispatch(createFormFields(fields, 'postDispatch'));
                const payload = {
                    templateId: props.templateId,
                    formFields: {
                        ...props.template,
                        postDispatch: fields
                    }
                }
                dispatch(saveTemplate(payload));
            }}>
                Save<Icon type="right"/>
            </Button>
        </Col>
    </>
   );
};

const mapStateToProps = state => ({
    templateId: state.quality.templateName,
    template: state.quality.formFields,
    formFields: state.quality.formFields?.postDispatch || []
});

export default connect(mapStateToProps)(PostDispatchStageForm);