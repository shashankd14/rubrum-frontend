import {Button, Card, Col, DatePicker, Divider, Form, Input, Modal, Row, Table, Icon} from "antd";
import React, {useEffect, useState, useRef, useContext} from "react";
import {connect} from "react-redux";
import moment from "moment";
import {setProcessDetails, saveCuttingInstruction, updateInstruction} from '../../../appRedux/actions/Inward';

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

const CreateCuttingDetailsForm = (props) => {
    const {getFieldDecorator} = props.form;
    const [cuts, setCuts] = useState([]);
    const dataSource= props.wip?((props.coilDetails && props.coilDetails.instruction)? props.coilDetails.instruction:props.coilDetails.childInstructions): cuts;
    const columns=[
        {
            title: 'Serial No',
            dataIndex:'instructionId',
            key: 'instructionId'
            
        },
        {
            title: 'Process Date',
            dataIndex:'instructionDate',
            render (value) {
                return moment(value).format('DD/MM/YYYY');
            },
            key: 'instructionDate',
        },
        {
            title: 'Length',
            dataIndex:'plannedLength',
            key: 'plannedLength',
        },
        {
            title: 'Actual Length',
            dataIndex:'actualLength',
            render: (text, record, index) => (
                <Input value={text}  onChange={onInputChange("actualLength", index)} />
              )
        },
        {
            title: 'No of Sheets',
            dataIndex:'plannedNoOfPieces',
            key: 'plannedNoOfPieces',
        },
        {
            title: 'Actual No of Sheets',
            dataIndex:'actualNoOfPieces',
            render: (text, record, index) => (
                <Input value={text} onChange={onInputChange("actualNoOfPieces", index)} />
              )
        },
        {
            title: 'Weight',
            dataIndex:'plannedWeight',
            key:'plannedWeight'
        },
        {
            title: 'Actual Weight',
            dataIndex:'actualWeight',
            render: (text, record, index) => (
                <Input value={text}  onChange={onInputChange("actualWeight", index)} />
              )
        }
    ];
    const columnsPlan=[
        {
            title: 'Serial No',
            dataIndex:'instructionId',
            key: 'instructionId'
            
        },
        {
            title: 'Process Date',
            dataIndex:'processDate',
            render (value) {
                return moment(value).format('DD/MM/YYYY');
            },
            key: 'instructionprocessDateDate',
        },
        {
            title: 'Length',
            dataIndex:'length',
            key: 'length',
        },
        {
            title: 'No of Sheets',
            dataIndex:'no',
            key: 'no',
        },
        {
            title: 'Weight',
            dataIndex:'weight',
            key:'weight'
        },
    ];
    const handleSubmit = e => {
        e.preventDefault();
        setCuts([...cuts, {...props.inward.process,
            inwardId: props.coilDetails.inwardEntryId ? props.coilDetails.inwardEntryId : "",
            instructionId: props.coilDetails.instructionId ? props.coilDetails.instructionId : ""
        }]);
    };

    useEffect(() => {
        if(props.inward.process.length && props.inward.process.no) {
            if(props.coilDetails.instructionId)
                props.setProcessDetails({...props.inward.process, weight: 0.00000000785*parseFloat(props.coilDetails.width)*parseFloat(props.inward.plan.fThickness)*parseFloat(props.inward.process.length)*parseFloat(props.inward.process.no)});
            else
                props.setProcessDetails({...props.inward.process, weight: 0.00000000785*parseFloat(props.inward.plan.fWidth)*parseFloat(props.inward.plan.fThickness)*parseFloat(props.inward.process.length)*parseFloat(props.inward.process.no)});
        }
    }, [props.inward.process.length, props.inward.process.no])
    const [tableData, setTableData] = useState(dataSource);
  useEffect(() => {
    const newData = [...tableData];
    
    setTableData(newData);
  }, []);
  

  const onInputChange = (key, index) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newData = [...tableData];
    newData[index][key] = Number(e.target.value);
    setTableData(newData);
  };

  
    return (
        
        <Modal
            title="Cutting Instruction"
            visible={props.showCuttingModal}
            onOk={() => {
                if(props.wip){
                    props.updateInstruction(tableData);
                    props.setShowCuttingModal();
                }
                else{
                    props.saveCuttingInstruction(cuts);
                    props.setShowCuttingModal()
                }
                
                
            }}
            width={1020}
            onCancel={() => props.setShowCuttingModal()}
        >
            <Row>
                <Col lg={12} md={12} sm={24} xs={24} className="gx-align-self-center">
                    <h3>Coil Details </h3>
                    <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4">
                    <Form.Item label="Received Date" >
                        {getFieldDecorator('processDate', {
                            rules: [{ required: true, message: 'Please select a received date' }],
                        })(
                            <DatePicker
                                placeholder="dd/mm/yy"
                                style={{width: 200}}
                                format="DD/MM/YYYY"
                                className="gx-mb-3 gx-w-100"
                                disabled={props.wip ? true : false}/>
                        )}
                    </Form.Item>
                    <Form.Item label="Length">
                        {getFieldDecorator('length', {
                            rules: [{ required: true, message: 'Please enter Length' },
                                {pattern: "^(([1-9]*)|(([1-9]*)\\.([0-9]*)))$", message: 'Length should be a number'},],
                        })(
                            <Input id="length" disabled={props.wip ? true : false}/>
                        )}
                    </Form.Item>
                    <Form.Item label="No of cuts">
                        {getFieldDecorator('no', {
                            rules: [{ required: true, message: 'Please enter number of cuts required' },
                                {pattern: "^(([1-9]*)|(([1-9]*)))$", message: 'Number of cuts should be a number'}],
                        })(
                            <Input id="noOfCuts" disabled={props.wip ? true : false}/>
                        )}
                    </Form.Item>
                    <Form.Item label="Weight">
                        {getFieldDecorator('weight', {
                            rules: [{ required: true, message: 'Please fill other details to calculate weight' },
                                {pattern: "^(([1-9]*)|(([1-9]*)))$", message: 'Number of cuts should be a number'}],
                        })(
                            <Input id="weight" disabled={true}  />
                        )}
                    </Form.Item>
                    <Row className="gx-mt-4">
                        <Col span={24} style={{ textAlign: "center"}}>
                            <Button type="primary" htmlType="submit" disabled={props.wip ? true : false}>
                                Add Size<Icon type="right"/>
                            </Button>
                        </Col>
                    </Row>
                </Form>
                </Col>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <Table  className="gx-table-responsive"  columns={props.wip? columns :columnsPlan} dataSource={props.wip?tableData:cuts}/>
                </Col>
            </Row>
        </Modal>
    )
}

const mapStateToProps = state => ({
    party: state.party,
    inward: state.inward,
});

const CuttingDetailsForm = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            processDate: Form.createFormField({
                ...props.inward.process.processDate,
                value: (props.inward.process.processDate) ? props.inward.process.processDate : '',
            }),
            length: Form.createFormField({
                ...props.inward.process.length,
                value: (props.inward.process.length) ? props.inward.process.length : '',
            }),
            no: Form.createFormField({
                ...props.inward.process.no,
                value: (props.inward.process.no) ? props.inward.process.no : '',
            }),
            weight: Form.createFormField({
                ...props.inward.process.weight,
                value: (props.inward.process.weight) ? props.inward.process.weight : '',
            }),
        };
    },
    onValuesChange(props, values) {
        props.setProcessDetails({ ...props.inward.process, ...values});
    },
})(CreateCuttingDetailsForm);

export default  connect(mapStateToProps, {setProcessDetails, saveCuttingInstruction, updateInstruction})(CuttingDetailsForm);