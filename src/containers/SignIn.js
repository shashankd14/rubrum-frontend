import React, {useEffect} from "react";
import { Button, Form, Icon, Input, Alert } from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

import {
  hideMessage,
  showAuthLoader,
  userSignIn,
} from "appRedux/actions/Auth";

import IntlMessages from "util/IntlMessages";
import { useState } from "react";

const FormItem = Form.Item;

const SignIn =(props)=> {

  const dispatch = useDispatch();
  const {showMessage,authUser}= useSelector(({auth}) => auth);
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (authUser !== null) {
      history.push('/');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        dispatch(showAuthLoader());
        dispatch(userSignIn(values));
      }
    });
  };

    const {getFieldDecorator} = props.form;

    return (
      <div className="login-container">
        <div className="login-backdrop">
          <div className="logo-container">
            <img
              alt="logo"
              className="login-logo"
              src={require("assets/images/Logo.svg")}
            />
            <div className="content-container">
              <div className="slider-container">
                <h4 className="login-heading">
                  Order &#x2022; Consolidate &#x2022; Allocate &#x2022; Deliver
                </h4>
                <p className="description">
                  Create Sales Orders and Manage the Consolidated Plan to
                  Process Them
                </p>
              </div>
              <div style={{alignSelf: 'center'}}>
                <img
                  alt="login-widget"
                  className="login-widget1"
                  src={require("assets/images/Widget.svg")}
                />
              </div>
            </div>
          </div>
          <p className="copy-right">@Copyright, Workeazy Pvt. Ltd.</p>
        </div>
        <div className="login-form-container">
          <div className="login-box-container">
            <h3 className="login-title">Login</h3>
            {showMessage ? (
              <Alert
                message="Email ID and Password do not match!"
                type="error"
                showIcon
                closable
                afterClose={hideMessage}
              />
            ) : null}
            <Form
              onSubmit={handleSubmit}
              className="ant-form ant-form-vertical gx-signin-form gx-form-row0"
            >
              <FormItem label="Email Address">
                {getFieldDecorator("email", {
                  initialValue: "admin",
                })(
                  <Input placeholder="Username" prefix={<Icon type="mail" />} />
                )}
              </FormItem>
              <FormItem label="Password">
                {getFieldDecorator("password", {
                  initialValue: "admin@123",
                  rules: [
                    { required: true, message: "Please input your Password!" },
                  ],
                })(
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    prefix={<Icon type="lock" />}
                    suffix={<Icon type={showPassword ? "eye-invisible" : "eye"} onClick={() => setShowPassword(!showPassword)} />}
                  />
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" className="gx-mb-0 login-submit" htmlType="submit">
                  <IntlMessages id="app.userAuth.login" />
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    );
  };

const WrappedNormalLoginForm = Form.create()(SignIn);

export default WrappedNormalLoginForm;
