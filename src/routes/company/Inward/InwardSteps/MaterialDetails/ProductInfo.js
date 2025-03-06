import React from "react";
import {AutoComplete, Button, Col, Form, Icon, Row} from "antd";
import {connect} from "react-redux";
import {checkCustomerBatchNumber, setInwardDetails} from "../../../../../appRedux/actions";

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    },
};
const ProductInfoForm = (props) => {
    const {getFieldDecorator} = props.form;
    const handleSubmit = e => {
        e.preventDefault();
        props.updateStep(2);
        // props.form.validateFields((err, values) => {
        //     if (!err) {
        //
        //     }
        // });
    };

    return (
        <>
            <Form {...formItemLayout} className="ant-material-category-form" onSubmit={handleSubmit}>
                <Row>
                    <Col span={12}>
                        <Form.Item label="Product Type">
                            {getFieldDecorator('partyName', {
                                rules: [{ required: true, message: 'Please input the customer name!' }],
                            })(
                                <AutoComplete
                                    placeholder="Enter Product Type"
                                    dataSource={[]}
                                    onChange= {props.params !== "" ?(e) => console.log('dfd') : ""}
                                    filterOption={(inputValue, option) =>
                                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="Grade">
                            {getFieldDecorator('partyName', {
                                rules: [{ required: true, message: 'Enter grade' }],
                            })(
                                <AutoComplete
                                    placeholder="Enter Grade"
                                    dataSource={[]}
                                    onChange= {props.params !== "" ?(e) => console.log('dfd') : ""}
                                    filterOption={(inputValue, option) =>
                                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="Surface Type">
                            {getFieldDecorator('partyName', {
                                rules: [{ required: true, message: 'Select Surface Type' }],
                            })(
                                <AutoComplete
                                    placeholder="enter customer name"
                                    dataSource={[]}
                                    onChange= {props.params !== "" ?(e) => console.log('dfd') : ""}
                                    filterOption={(inputValue, option) =>
                                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="Thickness (mm)">
                            {getFieldDecorator('partyName', {
                                rules: [{ required: true, message: 'Enter Thickness' }],
                            })(
                                <AutoComplete
                                    placeholder="enter customer name"
                                    dataSource={[]}
                                    onChange= {props.params !== "" ?(e) => console.log('dfd') : ""}
                                    filterOption={(inputValue, option) =>
                                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="Width (mm)">
                            {getFieldDecorator('partyName', {
                                rules: [{ required: true, message: 'Enter Width' }],
                            })(
                                <AutoComplete
                                    placeholder="enter customer name"
                                    dataSource={[]}
                                    onChange= {props.params !== "" ?(e) => console.log('dfd') : ""}
                                    filterOption={(inputValue, option) =>
                                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="Length (mm)">
                            {getFieldDecorator('partyName', {
                                rules: [{ required: true, message: 'Enter Length' }],
                            })(
                                <AutoComplete
                                    placeholder="enter customer name"
                                    dataSource={[]}
                                    onChange= {props.params !== "" ?(e) => console.log('dfd') : ""}
                                    filterOption={(inputValue, option) =>
                                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="Gross Weight">
                            {getFieldDecorator('partyName', {
                                rules: [{ required: true, message: 'Enter Gross Weight' }],
                            })(
                                <AutoComplete
                                    placeholder="enter customer name"
                                    dataSource={[]}
                                    onChange= {props.params !== "" ?(e) => console.log('dfd') : ""}
                                    filterOption={(inputValue, option) =>
                                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="Material Desc">
                            {getFieldDecorator('partyName', {
                                rules: [{ required: true, message: 'Enter Material Description' }],
                            })(
                                <AutoComplete
                                    placeholder="enter customer name"
                                    dataSource={[]}
                                    onChange= {props.params !== "" ?(e) => console.log('dfd') : ""}
                                    filterOption={(inputValue, option) =>
                                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            )}
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item label="Sub Grade">
                            {getFieldDecorator('partyName', {
                                rules: [{ required: true, message: 'Please input the customer name!' }],
                            })(
                                <AutoComplete
                                    placeholder="enter customer name"
                                    dataSource={[]}
                                    onChange= {props.params !== "" ?(e) => console.log('dfd') : ""}
                                    filterOption={(inputValue, option) =>
                                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="Coating grade gsm">
                            {getFieldDecorator('partyName', {
                                rules: [{ required: true, message: 'Please input the customer name!' }],
                            })(
                                <AutoComplete
                                    placeholder="enter customer name"
                                    dataSource={[]}
                                    onChange= {props.params !== "" ?(e) => console.log('dfd') : ""}
                                    filterOption={(inputValue, option) =>
                                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="Diameter(OD)">
                            {getFieldDecorator('partyName', {
                                rules: [{ required: true, message: 'Please input the customer name!' }],
                            })(
                                <AutoComplete
                                    placeholder="enter customer name"
                                    dataSource={[]}
                                    onChange= {props.params !== "" ?(e) => console.log('dfd') : ""}
                                    filterOption={(inputValue, option) =>
                                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="ID">
                            {getFieldDecorator('partyName', {
                                rules: [{ required: true, message: 'Please input the customer name!' }],
                            })(
                                <AutoComplete
                                    placeholder="enter customer name"
                                    dataSource={[]}
                                    onChange= {props.params !== "" ?(e) => console.log('dfd') : ""}
                                    filterOption={(inputValue, option) =>
                                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="NB">
                            {getFieldDecorator('partyName', {
                                rules: [{ required: true, message: 'Please input the customer name!' }],
                            })(
                                <AutoComplete
                                    placeholder="enter customer name"
                                    dataSource={[]}
                                    onChange= {props.params !== "" ?(e) => console.log('dfd') : ""}
                                    filterOption={(inputValue, option) =>
                                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="Net Weight">
                            {getFieldDecorator('partyName', {
                                rules: [{ required: true, message: 'Please input the customer name!' }],
                            })(
                                <AutoComplete
                                    placeholder="enter customer name"
                                    dataSource={[]}
                                    onChange= {props.params !== "" ?(e) => console.log('dfd') : ""}
                                    filterOption={(inputValue, option) =>
                                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="gx-mt-4">
                    <Col span={24} offset={4} style={{ textAlign: "center"}}>
                        <Button style={{ marginLeft: 8 }} onClick={() => props.updateStep(0)}>
                            <Icon type="left"/>Back
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Forward<Icon type="right"/>
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

const mapStateToProps = state => ({
    party: state.party,
    inward: state.inward.inward,
    inwardStatus: state.inward,
});

const ProductInfo = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
        };
    },
    onValuesChange(props, values) {
        props.setInwardDetails({ ...props.inward, ...values});
    },
})(ProductInfoForm);

export default connect(mapStateToProps, {
    setInwardDetails,
    checkCustomerBatchNumber
})(ProductInfo);