import { Button, Card, Col, DatePicker, Input, Popconfirm, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea';
import React, { useState } from 'react'
import { connect } from 'react-redux';
import EditableTable from '../../../../../../util/EditableTable';
import { 
    updateTemplateFormData, 
 } from "../../../../../../appRedux/actions"


const SlittingForm = (props) => {

    const [slitDataSource, setSlitDataSource] = useState([{
        slitNo: "",
        slitSize: "",
        allowableLowerWidth: "",
        allowableHigherWidth: "",
        actualWidth: "",
        burrHeight: "",
        remarks: "",
    }]);

    const [finalDataSource, setFinalDataSource] = useState([{
        slitNo: "",
        slitSize: "",
        allowableLowerWidth: "",
        allowableHigherWidth: "",
        actualWidth: "",
        burrHeight: "",
        remarks: "",
    }]);

    const [isDisabled, setIsDisabled] = useState(props.isDisabled)

    const [slitInspectionData, setSlitInspectionData] = useState([])
    const [finalInspectionData, setFinalInspectionData] = useState([])
    const [slitFormData, setSlitFormData] = useState({
        processType: "slitting",
        customerName: "",
        operation: "",
        processDate: "",
        batchNumber: "",
        motherCoilNumber: "",
        aspenCoilNumber: "",
        grade: "",
        thickness: "",
        width: "",
        weight: "",
        physicalAppearance: "",
        reportDate: "",
        finalJudgement: "",
        qualityEngineer: "",
        qualityHead: "",
    })

    const gridCardStyle = {
        width: '50%',
        height: 300,
        textAlign: 'left',
        display: "grid",
        paddingRight: 25
    };

    const gridStyle = {
        width: '100%',
        height: 350,
        textAlign: 'left',
    };

    const slitColumns = [
        {
            title: 'Slit No.',
            dataIndex: 'slitNo',
            editable: true,
        },
        {
            title: 'Slit Size',
            dataIndex: 'slitSize',
            editable: true
        },
        {
            title: 'Allowable Lower Width',
            dataIndex: 'allowableLowerWidth',
            editable: true
        },
        {
            title: 'Allowable Higher Width',
            dataIndex: 'allowableHigherWidth',
            editable: true
        },
        {
            title: 'Actual Width',
            dataIndex: 'actualWidth',
            editable: true
        },
        {
            title: 'Burr Height',
            dataIndex: 'burrHeight',
            editable: true
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            editable: true
        },
    ];

    const finalColumns = [
        {
            title: 'Slit No.',
            dataIndex: 'slitNo',
            editable: true,
        },
        {
            title: 'Slit Size',
            dataIndex: 'slitSize',
            editable: true
        },
        {
            title: 'Allowable Lower Width',
            dataIndex: 'allowableLowerWidth',
            editable: true
        },
        {
            title: 'Allowable Higher Width',
            dataIndex: 'allowableHigherWidth',
            editable: true
        },
        {
            title: 'Actual Width',
            dataIndex: 'actualWidth',
            editable: true
        },
        {
            title: 'Burr Height',
            dataIndex: 'burrHeight',
            editable: true
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            editable: true
        },
    ];

    const emptySlitRecord = {
        key: 0,
        slitNo: "",
        slitSize: "",
        allowableLowerWidth: "",
        allowableHigherWidth: "",
        actualWidth: "",
        burrHeight: "",
        remarks: "",
    }

    const emptyFinalRecord = {
        key: 0,
        slitNo: "",
        slitSize: "",
        allowableLowerWidth: "",
        allowableHigherWidth: "",
        actualWidth: "",
        burrHeight: "",
        remarks: "",
    }

    const onOptionChange = (key, changeEvent) => {
        slitFormData[key] = changeEvent.target.value;
    }

    const saveForm = () => {
        slitFormData['slitInspectionData'] = slitInspectionData
        slitFormData['finalInspectionData'] = finalInspectionData
        props.onSave(slitFormData)
        // props.updateTemplateFormData({action: 'slit', formData: slitFormData})
    }

    const handleInspectionTableChange = (tableData) => {
        console.log('handleInspectionTableChange', tableData)
        setSlitInspectionData(tableData)
    } 

    const handleFinalInspectionTableChange = (tableData) => {
        console.log('handleFinalInspectionTableChange', tableData)
        setFinalInspectionData(tableData)
    } 


    return (
        <div id="slittingform">
            <Card title="Slitting Process Form">
                <Card.Grid style={gridCardStyle}>
                    <Row>
                        <Col span={24}>
                            <label>Customer Name</label>
                            <Input placeholder='Enter customer name' disabled value={slitFormData.customerName} onChange={(e) => onOptionChange('customerName', e)}></Input>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Process Date</label>
                            <DatePicker disabled value={slitFormData.processDate} onChange={(e) => onOptionChange('processDate', e)}> </DatePicker>
                        </Col>
                        <Col span={12}>
                            <label>Batch Number</label>
                            <Input disabled value={slitFormData.batchNumber} onChange={(e) => onOptionChange('batchNumber', e)}></Input>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Grade</label>
                            <Input disabled value={slitFormData.grade} onChange={(e) => onOptionChange('grade', e)}></Input>
                        </Col>
                        <Col span={12}>
                            <label>Coil Thickness (IN MM)</label>
                            <Input disabled value={slitFormData.thickness} onChange={(e) => onOptionChange('thickness', e)}></Input>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={24}>
                            <label>Physical Appearance</label>
                            <Input disabled value={slitFormData.physicalAppearance} onChange={(e) => onOptionChange('physicalAppearance', e)}></Input>
                        </Col>
                    </Row>

                </Card.Grid>
                <Card.Grid style={gridCardStyle}>
                    <Row>
                        <Col span={24}>
                            <label>Operation</label>
                            <Input disabled value={slitFormData.operation} onChange={(e) => onOptionChange('operation', e)}></Input>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Mother Coil No.</label>
                            <Input disabled value={slitFormData.motherCoilNumber} onChange={(e) => onOptionChange('motherCoilNumber', e)}></Input>
                        </Col>
                        <Col span={12}>
                            <label>AspenCoil No.</label>
                            <Input disabled value={slitFormData.aspenCoilNumber} onChange={(e) => onOptionChange('aspenCoilNumber', e)}></Input>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Coil Width (IN MM)</label>
                            <Input disabled value={slitFormData.width} onChange={(e) => onOptionChange('width', e)}></Input>
                        </Col>
                        <Col span={12}>
                            <label>Coil Weight (IN KGs)</label>
                            <Input disabled value={slitFormData.weight} onChange={(e) => onOptionChange('weight', e)}></Input>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <label>Report Date</label>
                            <DatePicker style={{ width: "100%" }} disabled value={slitFormData.reportDate} onChange={(e) => onOptionChange('reportDate', e)}></DatePicker>
                        </Col>
                    </Row>

                </Card.Grid>
                <Card.Grid style={gridStyle} >
                    <EditableTable  columns={slitColumns} emptyRecord={emptySlitRecord} dataSource={slitDataSource} handleChange={handleInspectionTableChange}/>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    <Row>
                        <Col span={24}>
                            <label style={{fontSize: 20}}>Final Quality Inspection Report</label>
                        </Col>
                    </Row>
                    <EditableTable columns={finalColumns} emptyRecord={emptyFinalRecord} dataSource={finalDataSource} handleChange={handleFinalInspectionTableChange}/>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    <Row>
                        <Col span={24}>
                            <label>Final Judgement</label>
                            <TextArea value={slitFormData.finalJudgement} onChange={(e) => onOptionChange('finalJudgement', e)}></TextArea>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Quality Engineer</label>
                            <Input value={slitFormData.qualityEngineer} onChange={(e) => onOptionChange('qualityEngineer', e)}></Input>
                        </Col>
                        <Col span={12}>
                            <label>Quality Head</label>
                            <Input value={slitFormData.qualityHead} onChange={(e) => onOptionChange('qualityHead', e)}></Input>
                        </Col>
                    </Row>
                </Card.Grid>
                <div style={{ marginTop: 45 }}>
                    <Button style={{ marginLeft: 8 }}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" onClick={saveForm}>
                        Save
                    </Button>
                </div>
            </Card>
        </div>
    )
}

const mapStateToProps = state => ({
    templateDetails: state.quality,
});

export default connect(mapStateToProps, {
    updateTemplateFormData,
})(SlittingForm);
