import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {setInwardDetails} from "../../../../appRedux/actions";
import {Form, Input, Upload, Icon, Row, Col, Button, Card, AutoComplete} from "antd";
import {formItemLayout} from "../Create";

const QualityDetailsForm = (props) => {
    const {getFieldDecorator} = props.form;
    const [dataSource, setDataSource] = useState([]);

    const { Dragger } = Upload;
    const { TextArea } = Input;

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                props.updateStep(4);
            }
        });
    };
    const handleChange = e =>{
        
        props.inward.materialGrade.gradeName = e;
        console.log(e);
    }

    useEffect(() => {
        if (props.params !== ""){
            const { Option } = AutoComplete;
            const options = props.inwardDetails.materialGrades.filter(material => {
            if (material.gradeId===  props.inward.materialGrade.gradeId)
                return (<Option key={material.gradeId} value={`${material.gradeId}`}>
                        {material.gradeName}
                    </Option>)
                });
                setDataSource(options);
        }   
    }, [props.inward.materialGrade]);
    useEffect(() => {
        if(props.inwardDetails.materialGrades.length > 0) {

            const { Option } = AutoComplete;
            const options = props.inwardDetails.materialGrades.map(material => (
                <Option key={material.gradeId} value={`${material.gradeId}`}>
                    {material.gradeName}
                </Option>
            ));
            setDataSource(options);
        }
    }, [props.inward.materialGrade]);
    const partyName =(partyList) =>{
        partyList = partyList.find(item => item.nPartyId===Number(props.inward?.partyName))
        return partyList.partyName
    }
    let dimensionEdit = `${props.inward.fWidth} X ${props.inward.fThickness} X ${props.inward.fLength}`;
    let dimension = `${props.inward.width} X ${props.inward.thickness} X ${props.inward.length}`
    return (
        <>
            <Col span={14}>
        <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4">
            <Form.Item label="Grade">
                {getFieldDecorator('grade', {
                    rules: [{ required: false, message: 'Please select grade' }],
                })(
                    <AutoComplete
                        style={{width: 200}}
                        placeholder="enter material"
                        dataSource={dataSource}
                        onChange= {props.params!==""?(e) =>handleChange(e):""}
                        filterOption={(inputValue, option) =>
                            option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                    />
                )}
            </Form.Item>
            <Form.Item label="Test Certificate No">
                {getFieldDecorator('testCertificateNo', {
                    rules: [{ required: false, message: 'Please select a received date' }],
                })(
                    <Input id="testCertificateNo" onChange={(e) => {
                        props.inward.testCertificateNo = e.target.value;
                    }} />
                )}
            </Form.Item>
            <Form.Item label="Test File">
                {getFieldDecorator('testFile', {
                    rules: [{ required: false, message: 'Please select a received date' }],
                })(
                    <Dragger
                        name= 'testFile'
                        defaultFileList={props.inward.testFile && props.inward.testFile.fileList}
                        multiple= {true}
                        beforeUpload={() => false}
                        action= ''
                            onChange = {
                                (info) => console.log(info)
                                }>
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    </Dragger>
                )}
            </Form.Item>
            <Form.Item label="More attachments">
                {getFieldDecorator('moreFiles', {
                    rules: [{ required: false, message: 'Please select a received date' }],
                })(
                    <Dragger
                        name= 'moreFiles'
                        defaultFileList={props.inward.moreFiles && props.inward.moreFiles.fileList}
                        multiple= {true}
                        beforeUpload={() => false}
                        onChange = {(info) => console.log(info)}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    </Dragger>
                )}
            </Form.Item>
            <Form.Item label="Remarks">
                {getFieldDecorator('remarks', {
                    rules: [{ required: false, message: 'Please select a received date' }],
                })(
                    <TextArea rows={4}/>
                )}
            </Form.Item>
            <Row className="gx-mt-4">
                <Col span={24} offset={4}  style={{ textAlign: "center"}}>
                    <Button style={{ marginLeft: 8 }} onClick={() => props.updateStep(2)}>
                        <Icon type="left"/>Back
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Forward<Icon type="right"/>
                    </Button>
                </Col>
            </Row>
        </Form>
            </Col>
            <Col span={10} className="gx-pt-4">
                <Card title="Coil Details" style={{ width: 300 }}>
                    <p>Customer Name : {props.params !== "" && props.inward.party ?props.inward.party?.partyName : partyName(props.party?.partyList)}</p>
                    {props.inward.customerId && <p>Customer Id : {props.inward.customerId}</p>}
                    {props.inward.customerBatchNo && <p>Customer Batch No : {props.inward.customerBatchNo}</p>}
                    {props.inward.customerInvoiceNo && <p>Customer Invoice No : {props.inward.customerInvoiceNo}</p>}
                    {props.inward.purposeType && <p>Purpose Type : {props.inward.purposeType}</p>}
                    <p>Coil number : {props.inward.coilNumber}</p>
                    <p>Material Description : {props.params !== ""? props.inward.material.description : props.inward.description}</p>
                    <p>Dimensions : {props.params !==""?dimensionEdit:dimension}</p>
                    <p>Net Weight : {props.params !== "" ? props.inward.fpresent:props.inward.netWeight}</p>
                    <p>Gross Weight : {props.inward.grossWeight}</p>
                    {props.inward.batchNo && <p>Batch No : {props.inward.batchNo}</p>}
                    {props.inward.vehicleNumber && <p>Vehicle number : {props.inward.vehicleNumber}</p>}
                    {props.inward.invoiceNumber && <p>Invoice number : {props.inward.invoiceNumber}</p>}
                </Card>
            </Col>
            </>
    )
}

const mapStateToProps = state => ({
    inward: state.inward.inward,
    inwardDetails: state.inward,
    party: state.party
});

const QualityDetails = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            grade: Form.createFormField({
                ...props.inward.grade,
                value: props.params !== "" ?props.inward.materialGrade.gradeName:(props.inward.grade) ? props.inward.grade : '',
            }),
            testCertificateNo: Form.createFormField({
                ...props.inward.testCertificateNo,
                value: (props.inward.testCertificateNo) ? props.inward.testCertificateNo : props.inward.testCertificateNumber || '',
            }),
            remarks: Form.createFormField({
                ...props.inward.remarks,
                value: (props.inward.remarks) ? props.inward.remarks : '',
            }),
            testFile: Form.createFormField({
                ...props.inward.testFile,
                value: (props.inward.testFile) ? props.inward.testFile : '',
            }),
            moreFiles: Form.createFormField({
                ...props.inward.moreFiles,
                value: (props.inward.moreFiles) ? props.inward.moreFiles : '',
            }),
        };
    },
    onValuesChange(props, values) {
        props.setInwardDetails({ ...props.inward, ...values});
    },
})(QualityDetailsForm);

export default connect(mapStateToProps, {
    setInwardDetails,
})(QualityDetails);
