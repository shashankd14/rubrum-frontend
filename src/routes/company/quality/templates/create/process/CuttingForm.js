import { Button, Card, Col, DatePicker, Input, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react'
import EditableTable from '../../../../../../util/EditableTable';
import { connect } from 'react-redux';
import {getQualityTemplateById } from '../../../../../../appRedux/actions';

const CuttingForm = (props) => {

    const [dataSource, setDataSource] = useState([{
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
        toleranceThicknessFrom: "",
        toleranceThicknessTo: "",
        toleranceWidthFrom: "",
        toleranceWidthTo: "",
        toleranceLengthFrom: "",
        toleranceLengthTo: "",
        toleranceBurrHeightFrom: "",
        toleranceBurrHeightTo: "",
        toleranceDiagonalDifferenceFrom: "",
        toleranceDiagonalDifferenceTo: "",
    }]);
    const [cutInspectionData, setCutInspectionData] = useState([])
    const [toleranceInspectionData, setToleranceInspectionData] = useState([])

    //Code for view cut tolerance table
    const viewCutTolerance = () => {
        if(props.templateDetails.operation == "templateById"){
            debugger
        var templateId = props.templateDetails.data.templateId
        props.getQualityTemplateById(templateId)
             const cutDetails = JSON.parse(props.templateDetails.data.templateDetails);
          const toleranceDataTable = cutDetails[5]?.value.toleranceInspectionData;
          const toleranceData = toleranceDataTable.map((item, i) => ({
            toleranceThicknessFrom: item.toleranceThicknessFrom,
            toleranceThicknessTo: item.toleranceThicknessTo,
            toleranceWidthFrom: item.toleranceWidthFrom,
            toleranceWidthTo: item.toleranceWidthTo,
            toleranceLengthFrom: item.toleranceLengthFrom,
            toleranceLengthTo: item.toleranceLengthTo,
            toleranceBurrHeightFrom: item.toleranceBurrHeightFrom,
            toleranceBurrHeightTo: item.toleranceBurrHeightTo,
            toleranceDiagonalDifferenceFrom: item.toleranceDiagonalDifferenceFrom,
            toleranceDiagonalDifferenceTo: item.toleranceDiagonalDifferenceTo,
        }));
          setToleranceDataSource(toleranceData);
          setToleranceInspectionData(toleranceData);
        }
      }
      useEffect(() => {
        if(props.templateDetails.operation === "templateById"){
            viewCutTolerance()
        }
      }, [props.templateDetails.operation]);

    const [cutFormData, setCutFormData] = useState({
        processType: "cutting",
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

    const columns = [
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
            title: 'Thickness From',
            dataIndex: 'toleranceThicknessFrom',
            editable: true
        },
        {
            title: 'Thickness To',
            dataIndex: 'toleranceThicknessTo',
            editable: true
        },
        {
            title: 'Width From',
            dataIndex: 'toleranceWidthFrom',
            editable: true
        },
        {
            title: 'Width To',
            dataIndex: 'toleranceWidthTo',
            editable: true
        },
        {
            title: 'Length From',
            dataIndex: 'toleranceLengthFrom',
            editable: true
        },
        {
            title: 'Length To',
            dataIndex: 'toleranceLengthTo',
            editable: true
        },
        {
            title: 'Burr Height From',
            dataIndex: 'toleranceBurrHeightFrom',
            editable: true
        },
        {
            title: 'Burr Height To',
            dataIndex: 'toleranceBurrHeightTo',
            editable: true
        },
        {
            title: 'Diagonal Difference From',
            dataIndex: 'toleranceDiagonalDifferenceFrom',
            editable: true
        },
        {
            title: 'Diagonal Difference To',
            dataIndex: 'toleranceDiagonalDifferenceTo',
            editable: true
        }
    ];

    const emptyRecord = {
        key: 0,
        slitSize: "",
        allowableLowerWidth: "",
        allowableHigherWidth: "",
        actualWidth: "",
        burrHeight: "",
        remarks: "",
    }
    const toleranceEmptyRecord = {
        key: 0,
        toleranceThicknessFrom: "",
        toleranceThicknessTo: "",
        toleranceWidthFrom: "",
        toleranceWidthTo: "",
        toleranceLengthFrom: "",
        toleranceLengthTo: "",
        toleranceBurrHeightFrom: "",
        toleranceBurrHeightTo: "",
        toleranceDiagonalDifferenceFrom: "",
        toleranceDiagonalDifferenceTo: "",
    }

    const onOptionChange = (key, changeEvent) => {
        cutFormData[key] = changeEvent.target.value;
    }

    const saveForm = () => {
        cutFormData['cutInspectionData'] = cutInspectionData
        cutFormData['toleranceInspectionData'] = toleranceInspectionData
        props.onSave(cutFormData);
    }

    const handleInspectionTableChange = (tableData) => {
        console.log('handleInspectionTableChange', tableData)
        setCutInspectionData(tableData)
    } 
    const handleToleranceTableChange = (tableData) => {
        console.log('handleInspectionTableChange', tableData)
        setToleranceInspectionData(tableData)
    } 

    return (
        <div id="slittingform">
            <Card title="Cutting Process Form">
                <Card.Grid style={gridCardStyle}>
                    <Row>
                        <Col span={24}>
                            <label>Customer Name</label>
                            <Input placeholder='Enter customer name' disabled value={cutFormData.customerName} onChange={(e) => onOptionChange('customerName', e)}></Input>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Process Date</label>
                            <DatePicker disabled value={cutFormData.processDate} onChange={(e) => onOptionChange('processDate', e)}> </DatePicker>
                        </Col>
                        <Col span={12}>
                            <label>Batch Number</label>
                            <Input disabled value={cutFormData.batchNumber} onChange={(e) => onOptionChange('batchNumber', e)}></Input>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Grade</label>
                            <Input disabled value={cutFormData.grade} onChange={(e) => onOptionChange('grade', e)}></Input>
                        </Col>
                        <Col span={12}>
                            <label>Coil Thickness (IN MM)</label>
                            <Input disabled value={cutFormData.thickness} onChange={(e) => onOptionChange('thickness', e)}></Input>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={24}>
                            <label>Physical Appearance</label>
                            <Input disabled value={cutFormData.physicalAppearance} onChange={(e) => onOptionChange('physicalAppearance', e)}></Input>
                        </Col>
                    </Row>

                </Card.Grid>
                <Card.Grid style={gridCardStyle}>
                    <Row>
                        <Col span={24}>
                            <label>Operation</label>
                            <Input disabled value={cutFormData.operation} onChange={(e) => onOptionChange('operation', e)}></Input>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Mother Coil No.</label>
                            <Input disabled value={cutFormData.motherCoilNumber} onChange={(e) => onOptionChange('motherCoilNumber', e)}></Input>
                        </Col>
                        <Col span={12}>
                            <label>AspenCoil No.</label>
                            <Input disabled value={cutFormData.aspenCoilNumber} onChange={(e) => onOptionChange('aspenCoilNumber', e)}></Input>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Coil Width (IN MM)</label>
                            <Input disabled value={cutFormData.width} onChange={(e) => onOptionChange('width', e)}></Input>
                        </Col>
                        <Col span={12}>
                            <label>Coil Weight (IN KGs)</label>
                            <Input disabled value={cutFormData.weight} onChange={(e) => onOptionChange('weight', e)}></Input>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <label>Report Date</label>
                            <DatePicker style={{ width: "100%" }} disabled value={cutFormData.reportDate} onChange={(e) => onOptionChange('reportDate', e)}></DatePicker>
                        </Col>
                    </Row>

                </Card.Grid>
                <Card.Grid style={gridStyle}>
                     <Row>
                        <Col span={24}>
                            <label style={{fontSize: 20}}>Tolerance</label>
                        </Col>
                    </Row>
                    <EditableTable columns={toleranceColumns} emptyRecord={toleranceEmptyRecord} dataSource={toleranceDataSource} handleChange={handleToleranceTableChange}/>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    <EditableTable columns={columns} emptyRecord={emptyRecord} dataSource={dataSource} handleChange={handleInspectionTableChange}/>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    <Row>
                        <Col span={24}>
                            <label>Final Judgement</label>
                            <TextArea value={cutFormData.finalJudgement} onChange={(e) => onOptionChange('finalJudgement', e)}></TextArea>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Quality Engineer</label>
                            <Input value={cutFormData.qualityEngineer} onChange={(e) => onOptionChange('qualityEngineer', e)}></Input>
                        </Col>
                        <Col span={12}>
                            <label>Quality Head</label>
                            <Input value={cutFormData.qualityHead} onChange={(e) => onOptionChange('qualityHead', e)}></Input>
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
const mapStateToProps = (state) => ({
    templateDetails: state.quality,
  });
  
  export default connect(mapStateToProps, {
    getQualityTemplateById
  })(CuttingForm);
