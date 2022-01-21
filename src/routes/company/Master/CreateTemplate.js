import React, {useEffect, useState} from "react";
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Icon, Tabs} from "antd";
import CreateForm from './CreateField';

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



const CreateTemplate = (props) => {

    const [formItemsObj, setFormItemsObj] = useState({});
    const [formObj, setFormObj] = useState(formItemsObj);
    const [showAddParameter, setshowAddParameter] = useState(false);

    useEffect(() => {
        setFormObj(prev => { 
            console.log('formItemsObj', formItemsObj);
            return {...prev, ...formItemsObj} 
        }); // updated
        setTimeout(() => console.log('formObj', formObj), 10000);
    }, [formItemsObj]);

    console.log('out', formItemsObj);

   return <Card className="gx-card">
   <Row>
       <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
           <Tabs defaultActiveKey="1">
               <TabPane tab="Inward" key="1">
                   <Button type="primary" icon={() => <i className="icon icon-add"/>} size="medium"
                           onClick={() => {
                               setshowAddParameter(true);
                           }}
                   >Create Form</Button>
                   <Form>
                       {formObj && formObj.keys && formObj.keys.map((value, index) => {
                           const field = formObj[value];
                           return (
                               <FormItem>
                                   <Input type={field.type} value={field.value} max={field.max} min={field.min} defaultValue={field.default}>
                                   </Input>
                               </FormItem>
                           )
                       })}
                   </Form>
               </TabPane>
               <TabPane tab="Pre" key="2">{
               
               }</TabPane>
           </Tabs>
       </Col>
   </Row>
   <CreateForm setshowAddParameter={setshowAddParameter} showAddParameter={showAddParameter} setFormItemsObj={setFormItemsObj} />

</Card>
};

export default CreateTemplate;