import { Col, Modal, Form, DatePicker, Input, Row, Icon, Tabs, Button, Upload} from "antd";
import React, {useEffect, useState}from "react";
import moment from "moment";
import {APPLICATION_DATE_FORMAT} from '../../../constants';

export const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 8},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 14},
    },
};

const ReconcileModal=(props)=>{
    const TabPane = Tabs.TabPane;
    const { Dragger } = Upload;
    const {getFieldDecorator} = props.form;
    const [mode, setMode] = useState('top');
    return(
        <Modal
        visible={props.showModal}
        width={1020}>
            <Tabs
                defaultActiveKey="1"
                tabPosition={mode}
            >
            <TabPane tab="Weigh Bridge Outward Update" key="1">
                <Row>
                <Col lg={10} md={12} sm={24} xs={24} className="gx-align-self-center">
                    <Form {...formItemLayout}  className="login-form gx-pt-4">
                        <Form.Item label="Date" >
                           {getFieldDecorator('date',{
                                    initialValue: moment(new Date(props.deliveryRecord.deliveryDetails.updatedOn), APPLICATION_DATE_FORMAT),
                                    rules: [{ required: false, message: 'Please select a Process date' }],
                                    })(
                                        <>
                                        <DatePicker
                                        style={{width: 200}}
                                        defaultValue={moment(new Date(props.deliveryRecord.deliveryDetails.updatedOn), APPLICATION_DATE_FORMAT)}
                                        format={APPLICATION_DATE_FORMAT}
                                        disabled={true}/>
                                        </>
                               )}
                       </Form.Item>
                       <Form.Item label="Vehicle No">
                            {getFieldDecorator('vehicleNo', {
                                rules: [{ required: false}],
                            })(
                                <>
                                    <Input id="vehicleNo" disabled={true} value={props.deliveryRecord.deliveryDetails.vehicleNo} name="vehicleNo" />
                                </>
                            )}
                        </Form.Item>
                        <Form.Item label="Weigh Bridge Name">
                               {getFieldDecorator('bridgeName')(
                               <Input id="bridgeName" />
                                   )}
                       </Form.Item>
                       
                       <Form.Item label="Weighment Slip No">
                           {getFieldDecorator('weightSlipNo')(
                                   <Input id="weightSlipNo" />
                               )}
                {getFieldDecorator('files')(
                    <Dragger
                        name= 'files'
                        beforeUpload={() => false}
                        onChange = {(info) => console.log(info)}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    </Dragger>
                )}
                       </Form.Item>
                       <Form.Item label="Loaded Vehicle Weight">
                           {getFieldDecorator('loadedVehicleWeight')(
                                   <Input id="loadedVehicleWeight" />
                               )}
                       </Form.Item>
                       <Form.Item label="Empty Vehicle Weight">
                           {getFieldDecorator('emptyVehicleWeight')(
                                   <Input id="emptyVehicleWeight" />
                               )}
                       </Form.Item>
                       <Form.Item label="Net Weight(kg)">
                           {getFieldDecorator('netWeight')(
                                   <Input id="netWeight" />
                               )}
                       </Form.Item>
                       <Row className="gx-mt-4">
                           <Col span={24} style={{ textAlign: "center"}}>
                           <Button id="button" type="primary" htmlType="submit" value="text" >
                            {"Allocate Weight"}<Icon type="right"/>
                           </Button>
                           </Col>
                       </Row>
                   </Form>
               </Col>
             </Row>
            </TabPane>
           </Tabs>
        </Modal>
        
    )

    

}
const ReconcileModalForm = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            date: Form.createFormField({
                ...props,
                value: '',
            }),
            vehicleNo: Form.createFormField({
                ...props,
                value:  '',
            }),
            bridgeName: Form.createFormField({
                ...props,
                value:  '',
            }),
            weightSlipNo: Form.createFormField({
                ...props,
                value:  '',
            }),
            
        };
    },
    onValuesChange(props, values) {
        props.setProcessDetails({ ...props.delivery.process, ...values});
    },
})(ReconcileModal);
export default ReconcileModalForm