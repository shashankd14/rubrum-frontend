import { Button, Card, Col, DatePicker, Input, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react'
import EditableTable from '../../../../../../util/EditableTable';
import { connect } from 'react-redux';
import moment from 'moment';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import {
    updateQRFormData,
    getQualityPacketDetails,
    fetchQualityReportList,
    fetchQualityReportStageList,
    getCoilPlanDetails,
  } from '../../../../../../appRedux/actions';

const CuttingForm = (props) => {
    var toleranceThicknessFrom = 0;
    var toleranceThicknessTo = 0;
    var toleranceWidthFrom = 0;
    var toleranceWidthTo = 0;
    var toleranceLengthFrom = 0;
    var toleranceLengthTo = 0;
    var toleranceBurrHeightFrom = 0;
    var toleranceBurrHeightTo = 0;
    var toleranceDiagonalDifferenceFrom = 0;
    var toleranceDiagonalDifferenceTo = 0;
    
    const templateData = JSON.parse(
      props?.templateDetails?.data?.templateDetails
    );
    const formDataObject = templateData.find((item) => item.id === 'formData');
    if (formDataObject) {
      const formData = formDataObject.value;
      const toleranceInspectionData = formData.toleranceInspectionData;
      toleranceThicknessFrom = toleranceInspectionData[0].toleranceThicknessFrom; 
      toleranceThicknessTo = toleranceInspectionData[0].toleranceThicknessTo;
      toleranceWidthFrom = toleranceInspectionData[0].toleranceWidthFrom;
      toleranceWidthTo = toleranceInspectionData[0].toleranceWidthTo;
      toleranceBurrHeightFrom = toleranceInspectionData[0].toleranceBurrHeightFrom; 
      toleranceBurrHeightTo = toleranceInspectionData[0].toleranceBurrHeightTo;
      toleranceLengthFrom = toleranceInspectionData[0].toleranceLengthFrom;
      toleranceLengthTo = toleranceInspectionData[0].toleranceLengthTo;
      toleranceDiagonalDifferenceFrom = toleranceInspectionData[0].toleranceDiagonalDifferenceFrom; 
      toleranceDiagonalDifferenceTo = toleranceInspectionData[0].toleranceDiagonalDifferenceTo;
    } 
    const [dataSource, setDataSource] = useState([]);
    const [toleranceDataSource, setToleranceDataSource] = useState([]);
    
    useEffect(() => {
        if (props.templateDetails.packetDetails) {
          const mappedData = props.templateDetails.packetDetails.map((item, i) => ({
            key: i,
            thickness:props.inward?.plan?.fThickness,
            plannedLength: item.plannedLength,
            plannedWidth: item.plannedWidth,
            actualThickness: "",
            actualWidth: "",
            actualLength: "",
            burrHeight: "",
            diagonalDifference: "",
            remarks: ""
          }));
          const toleranceData = [{
            toleranceThicknessFrom: toleranceThicknessFrom,
            toleranceThicknessTo: toleranceThicknessTo,
            toleranceWidthFrom: toleranceWidthFrom,
            toleranceWidthTo: toleranceWidthTo,
            toleranceLengthFrom: toleranceLengthFrom,
            toleranceLengthTo: toleranceLengthTo,
            toleranceBurrHeightFrom: toleranceBurrHeightFrom,
            toleranceBurrHeightTo: toleranceBurrHeightTo,
            toleranceDiagonalDifferenceFrom: toleranceDiagonalDifferenceFrom,
            toleranceDiagonalDifferenceTo: toleranceDiagonalDifferenceTo,
          }]
          setDataSource(mappedData);
          setToleranceDataSource(toleranceData);
          //
          setToleranceInspectionData(toleranceData);
          console.log("mappedData", mappedData)
        }
      }, [props.templateDetails.packetDetails]);

    const instructionDate = props.templateDetails.packetDetails?.map(item=>item.instructionDate)

    const [cutInspectionData, setCutInspectionData] = useState([])

    const [toleranceInspectionData, setToleranceInspectionData] = useState([])
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
    useEffect(() => {
        setCutFormData((prevFormData) => ({
          ...prevFormData,
          customerName: props.inward?.plan?.party?.partyName || '', 
          processDate: props.inward?.plan?.instruction?.instructionDate || '',
          batchNumber: props.inward?.plan?.batchNumber || '',
          motherCoilNumber: props.inward?.plan?.customerCoilId || '',
          aspenCoilNumber: props.inward?.plan?.coilNumber || '',
          grade: props.inward?.plan?.materialGrade?.gradeName || '',
          thickness: props.inward?.plan?.fThickness || '',
          width: props.inward?.plan?.fWidth || '',
          weight: props.inward?.plan?.grossWeight || '',
        }));
      }, [props.inward?.plan?.party]);

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
            dataIndex: 'plannedWidth',
            editable: false
        },
        {
            title: 'Length',
            dataIndex: 'plannedLength',
            editable: false
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
            editable: false
        },
        {
            title: 'Thickness To',
            dataIndex: 'toleranceThicknessTo',
            editable: false
        },
        {
            title: 'Width From',
            dataIndex: 'toleranceWidthFrom',
            editable: false
        },
        {
            title: 'Width To',
            dataIndex: 'toleranceWidthTo',
            editable: false
        },
        {
            title: 'Length From',
            dataIndex: 'toleranceLengthFrom',
            editable: false
        },
        {
            title: 'Length To',
            dataIndex: 'toleranceLengthTo',
            editable: false
        },
        {
            title: 'Burr Height From',
            dataIndex: 'toleranceBurrHeightFrom',
            editable: false
        },
        {
            title: 'Burr Height To',
            dataIndex: 'toleranceBurrHeightTo',
            editable: false
        },
        {
            title: 'Diagonal Difference From',
            dataIndex: 'toleranceDiagonalDifferenceFrom',
            editable: false
        },
        {
            title: 'Diagonal Difference To',
            dataIndex: 'toleranceDiagonalDifferenceTo',
            editable: false
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
        //cutFormData['toleranceDataSource'] = toleranceDataSource
        props.onSave(cutFormData);
        props.updateQRFormData({ action: 'cut', formData: cutFormData });
    }

    const handleInspectionTableChange = (tableData) => {
        console.log('handleInspectionTableChange', tableData)
        setCutInspectionData(tableData)
    } 
    const handleToleranceTableChange = (tableData) => {
        console.log('handleInspectionTableChange', tableData)
        setToleranceInspectionData(tableData)
    } 

    const location = useLocation();
    return (
        <div id="slittingform">
            <Card title="Cutting Process Form">
                <Card.Grid style={gridCardStyle}>
                    <Row>
                        <Col span={24}>
                            <label>Customer Name</label>
                            <Input disabled value={props.inward?.plan?.party?.partyName} onChange={(e) => onOptionChange('customerName', e)}></Input>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Process Date</label>
                            <DatePicker disabled value={moment(instructionDate, 'YYYY-MM-DD HH:mm:ss')} onChange={(e) => onOptionChange('processDate', e)}> </DatePicker>
                        </Col>
                        <Col span={12}>
                            <label>Batch Number</label>
                            <Input disabled value={props.inward?.plan?.batchNumber} onChange={(e) => onOptionChange('batchNumber', e)}></Input>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Grade</label>
                            <Input disabled value={props.inward?.plan?.materialGrade?.gradeName} onChange={(e) => onOptionChange('grade', e)}></Input>
                        </Col>
                        <Col span={12}>
                            <label>Coil Thickness (IN MM)</label>
                            <Input disabled value={props.inward?.plan?.fThickness} onChange={(e) => onOptionChange('thickness', e)}></Input>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={24}>
                            <label>Physical Appearance</label>
                            <Input onChange={(e) => onOptionChange('physicalAppearance', e)}></Input>
                        </Col>
                    </Row>

                </Card.Grid>
                <Card.Grid style={gridCardStyle}>
                    <Row>
                        <Col span={24}>
                            <label>Operation</label>
                            <Input disabled value= "Cutting" onChange={(e) => onOptionChange('operation', e)}></Input>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Mother Coil No.</label>
                            <Input onChange={(e) => onOptionChange('motherCoilNumber', e)}></Input>
                        </Col>
                        <Col span={12}>
                            <label>AspenCoil No.</label>
                            <Input disabled value={props.inward?.plan?.coilNumber} onChange={(e) => onOptionChange('aspenCoilNumber', e)}></Input>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Coil Width (IN MM)</label>
                            <Input disabled value={props.inward?.plan?.fWidth} onChange={(e) => onOptionChange('width', e)}></Input>
                        </Col>
                        <Col span={12}>
                            <label>Coil Weight (IN KGs)</label>
                            <Input disabled value={props.inward?.plan?.grossWeight} onChange={(e) => onOptionChange('weight', e)}></Input>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <label>Report Date</label>
                            <DatePicker style={{ width: "100%" }} defaultValue={moment()} onChange={(e) => onOptionChange('reportDate', e)}></DatePicker>
                        </Col>
                    </Row>

                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    <Row>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <label style={{ fontSize: 20, textAlign: 'center' }}>Template Name - {location.state.templateDetails.templateName}</label>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <label style={{fontSize: 20}}>Cutting Tolerance Data</label>
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
                            <TextArea onChange={(e) => onOptionChange('finalJudgement', e)}></TextArea>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Quality Engineer</label>
                            <Input onChange={(e) => onOptionChange('qualityEngineer', e)}></Input>
                        </Col>
                        <Col span={12}>
                            <label>Quality Head</label>
                            <Input onChange={(e) => onOptionChange('qualityHead', e)}></Input>
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
    inward: state.inward,
  });
  
  export default connect(mapStateToProps, {
    updateQRFormData,
    getQualityPacketDetails,
    fetchQualityReportList,
    fetchQualityReportStageList,
    getCoilPlanDetails,
  })(CuttingForm);
  