import React, {useEffect} from "react";
import {Button, Checkbox, Form, Icon, Input, message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {Link, useHistory} from "react-router-dom";

import {
  hideMessage,
  showAuthLoader,
  userFacebookSignIn,
  userGithubSignIn,
  userGoogleSignIn,
  userSignIn,
  userTwitterSignIn
} from "appRedux/actions/Auth";

import IntlMessages from "util/IntlMessages";
import CircularProgress from "components/CircularProgress/index";

const FormItem = Form.Item;

const SignIn =(props)=> {

  const dispatch = useDispatch();
  const {loader, alertMessage, showMessage,authUser}= useSelector(({auth}) => auth);
  const history = useHistory();

  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
       dispatch(hideMessage());
      }, 100);
    }
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
      <div className="gx-app-login-wrap">
        <div className="gx-app-login-container">
          <div className="gx-app-login-main-content">
            <div className="gx-app-logo-content">
              <div className="gx-app-logo-content-bg">
                <img src={"https://via.placeholder.com/272x395"} alt='Neature'/>
              </div>
              <div className="gx-app-logo-wid">
                <h1><IntlMessages id="app.userAuth.signIn"/></h1>
                <p><IntlMessages id="app.userAuth.bySigning"/></p>
                <p><IntlMessages id="app.userAuth.getAccount"/></p>
              </div>
              <div className="gx-app-logo">
                <img alt="example" src={require("assets/images/logo.png")}/>
              </div>
            </div>
            <div className="gx-app-login-content">
              <Form onSubmit={handleSubmit} className="gx-signin-form gx-form-row0">

                <FormItem>
                  {getFieldDecorator('email', {
                    initialValue: "admin",
                  })(
                    <Input placeholder="Username"/>
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    initialValue: "admin@123",
                    rules: [{required: true, message: 'Please input your Password!'}],
                  })(
                    <Input type="password" placeholder="Password"/>
                  )}
                </FormItem>
                <FormItem>
                  <Button type="primary" className="gx-mb-0" htmlType="submit">
                    <IntlMessages id="app.userAuth.signIn"/>
                  </Button>
                  <span><IntlMessages id="app.userAuth.or"/></span> <Link to="/signup"><IntlMessages
                  id="app.userAuth.signUp"/></Link>
                </FormItem>
                {/* Keeping the code for future use */}
                {/* <div className="gx-flex-row gx-justify-content-between">
                  <span>or connect with</span>
                  <ul className="gx-social-link">
                    <li>
                      <Icon type="google" onClick={() => {
                        dispatch(showAuthLoader());
                        dispatch(userGoogleSignIn());
                      }}/>
                    </li>
                    <li>
                      <Icon type="facebook" onClick={() => {
                        dispatch(showAuthLoader());
                        dispatch(userFacebookSignIn());
                      }}/>
                    </li>
                    <li>
                      <Icon type="github" onClick={() => {
                        dispatch(showAuthLoader());
                        dispatch(userGithubSignIn());
                      }}/>
                    </li>
                    <li>
                      <Icon type="twitter" onClick={() => {
                        dispatch(showAuthLoader());
                        dispatch(userTwitterSignIn());
                      }}/>
                    </li>
                  </ul>
                </div>
                <span
                  className="gx-text-light gx-fs-sm"> demo user email: 'demo@example.com' and password: 'demo#123'</span> */}
              </Form>
            </div>

            {loader ?
              <div className="gx-loader-view">
                <CircularProgress/>
              </div> : null}
            {showMessage ?
              message.error("Login Error") : null}
          </div>
        </div>
      </div>
    );
  };

const WrappedNormalLoginForm = Form.create()(SignIn);

export default WrappedNormalLoginForm;
