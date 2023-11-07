import { Button, Card, Col, DatePicker, Input, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea';
import React, { useState } from 'react'
import EditableTable from '../../../../../../util/EditableTable';


const SlitAndCutForm = (props) => {

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

    const [cutDataSource, setCutDataSource] = useState([{
        slitNo: "",
        thickness: "",
        width: "",
        length: "",
        actualThickness: "",
        actualWidth: "",
        actualLength: "",
        burrHeight: "",
        diagonalDifference: "",
        remarks: "",
    }]);
    const [toleranceDataSource, setToleranceDataSource] = useState([{
        toleranceThickness: "",
        toleranceWidth: "",
        toleranceLength: "",
        toleranceBurrHeight: "",
        toleranceDiagonalDifference: "",
    }]);

    const [slitInspectionData, setSlitInspectionData] = useState([])
    const [cutInspectionData, setCutInspectionData] = useState([])
    const [finalInspectionData, setFinalInspectionData] = useState([])
    const [toleranceInspectionData, setToleranceInspectionData] = useState([])
    const [slitCutFormData, setSlitFormData] = useState({
        processType: "slitcut",
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
            title: 'Allowable Lower Slit Size',
            dataIndex: 'allowableLowerWidth',
            editable: true
        },
        {
            title: 'Allowable Higher Slit Size',
            dataIndex: 'allowableHigherWidth',
            editable: true
        },
        {
            title: 'Actual Width',
            dataIndex: 'actualWidth',
            editable: true
        },
        {
            title: 'Allowable Lower Burr Height',
            dataIndex: 'allowableLowerburrHeight',
            editable: true,
          },
          {
            title: 'Allowable Higher Burr Height',
            dataIndex: 'allowableHeigherburrHeight',
            editable: true,
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
            title: 'Allowable Lower Slit Size',
            dataIndex: 'allowableLowerWidth',
            editable: true
        },
        {
            title: 'Allowable Higher Slit Size',
            dataIndex: 'allowableHigherWidth',
            editable: true
        },
        {
            title: 'Actual Width',
            dataIndex: 'actualWidth',
            editable: true
        },
        {
            title: 'Allowable Lower Burr Height',
            dataIndex: 'allowableLowerburrHeight',
            editable: true,
          },
          {
            title: 'Allowable Higher Burr Height',
            dataIndex: 'allowableHeigherburrHeight',
            editable: true,
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

    const cutColumns = [
        // {
        //     title: 'Slit No.',
        //     dataIndex: 'slitNo',
        //     editable: true,
        // },
        {
            title: 'Thickness',
            dataIndex: 'thickness',
            editable: true
        },
        {
            title: 'Width',
            dataIndex: 'width',
            editable: true
        },
        {
            title: 'Length',
            dataIndex: 'length',
            editable: true
        },
        {
            title: 'Actual Thickness',
            dataIndex: 'actualThickness',
            editable: true
        },
        {
            title: 'Actual Width',
            dataIndex: 'actualWidth',
            editable: true
        },
        {
            title: 'Actual Length',
            dataIndex: 'actualLength',
            editable: true
        },
        {
            title: 'Burr Height',
            dataIndex: 'burrHeight',
            editable: true
        },
        {
            title: 'Diagonal Difference',
            dataIndex: 'diagonalDifference',
            editable: true
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            editable: true
        },
    ];
    const toleranceColumns = [
        {
            title: 'Tolerance Thickness',
            dataIndex: 'toleranceThickness',
            editable: true
        },
        {
            title: 'Tolerance Width',
            dataIndex: 'toleranceWidth',
            editable: true
        },
        {
            title: 'Tolerance Length',
            dataIndex: 'toleranceLength',
            editable: true
        },
        {
            title: 'Tolerance Burr Height',
            dataIndex: 'toleranceBurrHeight',
            editable: true
        },
        {
            title: 'Tolerance Diagonal Difference',
            dataIndex: 'toleranceDiagonalDifference',
            editable: true
        }
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

    const emptyCutRecord = {
        key: 0,
        slitNo: "",
        slitSize: "",
        allowableLowerWidth: "",
        allowableHigherWidth: "",
        actualWidth: "",
        burrHeight: "",
        remarks: "",
    }
    const toleranceEmptyRecord = {
        key: 0,
        toleranceThickness: "",
        toleranceWidth: "",
        toleranceLength: "",
        toleranceBurrHeight: "",
        toleranceDiagonalDifference: "",
    }

    const onOptionChange = (key, changeEvent) => {
        slitCutFormData[key] = changeEvent.target.value;
    }

    const saveForm = () => {
        slitCutFormData['slitInspectionData'] = slitInspectionData
        slitCutFormData['cutInspectionData'] = cutInspectionData
        slitCutFormData['finalInspectionData'] = finalInspectionData
        slitCutFormData['toleranceInspectionData'] = toleranceInspectionData
        props.onSave(slitCutFormData);
    }

    const handleSlitInspectionTableChange = (tableData) => {
        console.log('handleSlitInspectionTableChange', tableData)
        setSlitInspectionData(tableData)
    } 

    const handleCutInspectionTableChange = (tableData) => {
        console.log('handleCutInspectionTableChange', tableData)
        setCutInspectionData(tableData)
    } 

    const handleFinalInspectionTableChange = (tableData) => {
        console.log('handleFinalInspectionTableChange', tableData)
        setFinalInspectionData(tableData)
    } 

    const handleToleranceTableChange = (tableData) => {
        console.log('handleInspectionTableChange', tableData)
        setToleranceInspectionData(tableData)
    } 

    return (
        <div id="slittingform">
            <Card title="Slit & Cut Process Form">
                <Card.Grid style={gridCardStyle}>
                    <Row>
                        <Col span={24}>
                            <label>Customer Name</label>
                            <Input placeholder='Enter customer name' disabled value={slitCutFormData.customerName} onChange={(e) => onOptionChange('customerName', e)}></Input>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Process Date</label>
                            <DatePicker disabled value={slitCutFormData.processDate} onChange={(e) => onOptionChange('processDate', e)}> </DatePicker>
                        </Col>
                        <Col span={12}>
                            <label>Batch Number</label>
                            <Input disabled value={slitCutFormData.batchNumber} onChange={(e) => onOptionChange('batchNumber', e)}></Input>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Grade</label>
                            <Input disabled value={slitCutFormData.grade} onChange={(e) => onOptionChange('grade', e)}></Input>
                        </Col>
                        <Col span={12}>
                            <label>Coil Thickness (IN MM)</label>
                            <Input disabled value={slitCutFormData.thickness} onChange={(e) => onOptionChange('thickness', e)}></Input>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={24}>
                            <label>Physical Appearance</label>
                            <Input disabled value={slitCutFormData.physicalAppearance} onChange={(e) => onOptionChange('physicalAppearance', e)}></Input>
                        </Col>
                    </Row>

                </Card.Grid>
                <Card.Grid style={gridCardStyle}>
                    <Row>
                        <Col span={24}>
                            <label>Operation</label>
                            <Input disabled value={slitCutFormData.operation} onChange={(e) => onOptionChange('operation', e)}></Input>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Mother Coil No.</label>
                            <Input disabled value={slitCutFormData.motherCoilNumber} onChange={(e) => onOptionChange('motherCoilNumber', e)}></Input>
                        </Col>
                        <Col span={12}>
                            <label>AspenCoil No.</label>
                            <Input disabled value={slitCutFormData.aspenCoilNumber} onChange={(e) => onOptionChange('aspenCoilNumber', e)}></Input>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Coil Width (IN MM)</label>
                            <Input disabled value={slitCutFormData.width} onChange={(e) => onOptionChange('width', e)}></Input>
                        </Col>
                        <Col span={12}>
                            <label>Coil Weight (IN KGs)</label>
                            <Input disabled value={slitCutFormData.weight} onChange={(e) => onOptionChange('weight', e)}></Input>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <label>Report Date</label>
                            <DatePicker style={{ width: "100%" }} disabled value={slitCutFormData.reportDate} onChange={(e) => onOptionChange('reportDate', e)}></DatePicker>
                        </Col>
                    </Row>

                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    <EditableTable columns={slitColumns} emptyRecord={emptySlitRecord} dataSource={slitDataSource} handleChange={handleSlitInspectionTableChange}/>
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
                    <EditableTable columns={cutColumns} emptyRecord={emptyCutRecord} dataSource={cutDataSource} handleChange={handleCutInspectionTableChange}/>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    <EditableTable columns={toleranceColumns} emptyRecord={toleranceEmptyRecord} dataSource={toleranceDataSource} handleChange={handleToleranceTableChange}/>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    <Row>
                        <Col span={24}>
                            <label>Final Judgement</label>
                            <TextArea value={slitCutFormData.finalJudgement} onChange={(e) => onOptionChange('finalJudgement', e)}></TextArea>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Quality Engineer</label>
                            <Input value={slitCutFormData.qualityEngineer} onChange={(e) => onOptionChange('qualityEngineer', e)}></Input>
                        </Col>
                        <Col span={12}>
                            <label>Quality Head</label>
                            <Input value={slitCutFormData.qualityHead} onChange={(e) => onOptionChange('qualityHead', e)}></Input>
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

export default SlitAndCutForm