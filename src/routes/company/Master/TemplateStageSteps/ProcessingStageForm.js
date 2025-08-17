import React from "react";
import {connect} from 'react-redux';
import { camelCase } from 'lodash';
import moment from 'moment';
import {useDispatch} from "react-redux";
import {Button, Card, Row, Col, Form, Input, Icon, Radio, DatePicker} from "antd";
import CreateForm from './../CreateField';
import { createFormFields } from '../../../../appRedux/actions';

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

const ProcessingStageForm = (props) => {

    const [slitFields, setSlitFields] = React.useState(props.slitFields || []);
    const [cutFields, setCutFields] = React.useState(props.cutFields || []);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (props.slitFields.length > 0) {
            setSlitFields(props.slitFields)
        }
    }, [props.slitFields])

    React.useEffect(() => {
        if (props.cutFields.length > 0) {
            setCutFields(props.cutFields)
        }
    }, [props.cutFields])


   return (
    <>
        <Col span={18} className="login-form gx-pt-4">
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div style={{ width: "50%" }}>
                 <CreateForm formFields={props.slitFields} setFields={setSlitFields} btnName="Slit Parameters" />
                </div>
                <div style={{ width: "50%" }}>
                 <CreateForm formFields={props.cutFields} setFields={setCutFields} btnName="Cut Parameters" />
                </div>
            </div>
            <div style={{ display:"flex", flexDirection: "row" }}>
            <Card style={{ display:"flex", minHeight: "40vh", width: "50%" }} className="gx-card">
                <Row>
                    <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                        {!!slitFields?.length && <Form {...formItemLayout} style={{ height: "100%" }}>
                            { slitFields && slitFields?.map((field, index) => {
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
                                    <FormItem key={index} label={field.label}>
                                        {inputEle && inputEle}
                                    </FormItem>
                                )
                            })}
                        </Form>}
                    </Col>
                </Row>
            </Card>
            <Card style={{ display:"flex", minHeight: "40vh", width: "50%", marginLeft: "10px" }} className="gx-card">
                <Row>
                    <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                        {!!cutFields?.length && <Form {...formItemLayout} style={{ height: "100%" }}>
                            { cutFields && cutFields?.map((field, index) => {
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
                                    <FormItem key={index} label={field.label}>
                                        {inputEle && inputEle}
                                    </FormItem>
                                )
                            })}
                        </Form>}
                    </Col>
                </Row>
            </Card>
            </div>
            <Button style={{ marginLeft: 8 }}>
                <Icon type="left"/>Back
            </Button>
            <Button type="primary" htmlType="submit" style={{ float: "right" }} onClick={() => {
                dispatch(createFormFields({
                    slitFields,
                    cutFields
                }, 'processing'));
                props.updateStep(3);
            }}>
                Forward<Icon type="right"/>
            </Button>
        </Col>
    </>
   );
};

const mapStateToProps = state => {
    const { processing = {} } = state.quality.formFields;
    return {
        slitFields: processing.slitFields,
        cutFields: processing.cutFields
    }
};

export default connect(mapStateToProps)(ProcessingStageForm);