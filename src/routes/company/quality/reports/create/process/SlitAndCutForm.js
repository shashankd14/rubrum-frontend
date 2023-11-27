import { Button, Card, Col, DatePicker, Input, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea';
import React, { useState, useEffect } from 'react'
import EditableTable from '../../../../../../util/EditableTable';
import moment from 'moment';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import {
    updateQRFormData,
    getQualityPacketDetails,
    fetchQualityReportList,
    fetchQualityReportStageList,
    getCoilPlanDetails,
  } from '../../../../../../appRedux/actions';

const SlitAndCutForm = (props) => {
     //fetch slit data from QT
    var allowableLowerWidth = 0;
    var allowableHigherWidth = 0;
    var allowableLowerburrHeight = 0;
    var allowableHeigherburrHeight = 0;
    
    const templateData = JSON.parse(
        props?.templateDetails?.data?.templateDetails
    );
    
    const formDataObject = templateData.find((item) => item.id === 'formData');

    if (formDataObject) {
        const formData = formDataObject.value;
        const slitInspectionData = formData.slitInspectionData;
        allowableLowerWidth = slitInspectionData[0].allowableLowerWidth;
        allowableHigherWidth = slitInspectionData[0].allowableHigherWidth;
        allowableHeigherburrHeight = slitInspectionData[0].allowableHeigherburrHeight;
        allowableLowerburrHeight = slitInspectionData[0].allowableLowerburrHeight;
    } 
    const [slitDataSource, setSlitDataSource] = useState([]);
    const [finalDataSource, setFinalDataSource] = useState([]);
    const [toleranceDataSource, setToleranceDataSource] = useState([]);

    //fetch tolerance data from QT-cut
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
    
    const templateDataCut = JSON.parse(
      props?.templateDetails?.data?.templateDetails
    );
    const formDataObjectCut = templateDataCut.find((item) => item.id === 'formData');
    if (formDataObject) {
      const formData = formDataObjectCut.value;
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
  //fetch tolerance data from QT-Slit
  var toleranceThicknessFromSlit = 0;
  var toleranceThicknessToSlit = 0;
  var toleranceSlitSizeFromSlit = 0;
  var toleranceSlitSizeToSlit = 0;
  var toleranceBurrHeightFromSlit = 0;
  var toleranceBurrHeightToSlit = 0;
  const templateDataTolerance = JSON.parse(
    props?.templateDetails?.data?.templateDetails
  );
  const formDataObjectTolerance = templateDataTolerance.find((item) => item.id === 'formData');
  if (formDataObject) {
      debugger
    const formData = formDataObjectTolerance.value;
    const toleranceInspectionData = formData.toleranceInspectionDataSlit;
    toleranceThicknessFromSlit = toleranceInspectionData[0].toleranceThicknessFrom; 
    toleranceThicknessToSlit = toleranceInspectionData[0].toleranceThicknessTo;
    toleranceSlitSizeFromSlit = toleranceInspectionData[0].toleranceSlitSizeFrom;
    toleranceSlitSizeToSlit = toleranceInspectionData[0].toleranceSlitSizeTo;
    toleranceBurrHeightFromSlit = toleranceInspectionData[0].toleranceBurrHeightFrom; 
    toleranceBurrHeightToSlit = toleranceInspectionData[0].toleranceBurrHeightTo;
  } 

  useEffect(() => {
    if (props.templateDetails.packetDetails) {
      const mappedData = props.templateDetails.packetDetails.map((item, i) => ({
        key: i,
        instructionId: item.instructionId,
        plannedNoOfPieces: item.plannedNoOfPieces,
        // allowableLowerWidth: allowableLowerWidth,
        // allowableHigherWidth: allowableHigherWidth,
        actualThickness:"",
        actualWidth: "",
        // allowableLowerburrHeight: allowableLowerburrHeight,
        // allowableHeigherburrHeight: allowableHeigherburrHeight,
        burrHeight: "",
        remarks: ""
      }));
      const toleranceData = [{
        toleranceThicknessFrom: toleranceThicknessFromSlit,
        toleranceThicknessTo: toleranceThicknessToSlit,
        toleranceSlitSizeFrom: toleranceSlitSizeFromSlit,
        toleranceSlitSizeTo: toleranceSlitSizeToSlit,
        toleranceBurrHeightFrom: toleranceBurrHeightFromSlit,
        toleranceBurrHeightTo: toleranceBurrHeightToSlit
      }]
      setFinalDataSource(mappedData);
      setSlitDataSource(mappedData);
      setToleranceDataSourceSlit(toleranceData);
      setToleranceInspectionDataSlit(toleranceData);
    }
  }, [props.templateDetails.packetDetails]);

  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
      debugger;
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
        setToleranceInspectionData(toleranceData);
      }
    }, [props.templateDetails.packetDetails]);

    const [slitInspectionData, setSlitInspectionData] = useState([])
    const [cutInspectionData, setCutInspectionData] = useState([])
    const [finalInspectionData, setFinalInspectionData] = useState([])
    const [toleranceInspectionData, setToleranceInspectionData] = useState([])
    const [toleranceDataSourceSlit, setToleranceDataSourceSlit] = useState([]);
    const [toleranceInspectionDataSlit, setToleranceInspectionDataSlit] = useState([])
    const [slitCutFormData, setSlitFormData] = useState({
        processType: "SlitCut",
        customerName: "",
        operation: "SlitCut",
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
        setSlitFormData((prevFormData) => ({
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
    const instructionDate = props.templateDetails.packetDetails?.map(item=>item.instructionDate)
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
            dataIndex: 'instructionId',
            editable: false,
        },
        {
            title: 'Slit Size',
            dataIndex: 'plannedNoOfPieces',
            editable: false
        },
        {
            title: 'Actual Slit Size',
            dataIndex: 'actualWidth',
            editable: true
        },
        {
            title: 'Actual Thickness',
            dataIndex: 'actualThickness',
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
            dataIndex: 'instructionId',
            editable: false,
        },
        {
            title: 'Slit Size',
            dataIndex: 'plannedNoOfPieces',
            editable: false
        },
        {
            title: 'Actual Slit Size',
            dataIndex: 'actualWidth',
            editable: true
        },
        {
            title: 'Actual Thickness',
            dataIndex: 'actualThickness',
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
            editable: false
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
    const toleranceColumnsSlit = [
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
            title: 'Slit Size From',
            dataIndex: 'toleranceSlitSizeFrom',
            editable: false
        },
        {
            title: 'Slit Size To',
            dataIndex: 'toleranceSlitSizeTo',
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
    const toleranceEmptyRecordSlit = {
        key: 0,
        toleranceThicknessFrom: "",
        toleranceThicknessTo: "",
        toleranceSlitSizeFrom: "",
        toleranceSlitSizeTo: "",
        toleranceBurrHeightFrom: "",
        toleranceBurrHeightTo: "",
    }
    const onOptionChange = (key, changeEvent) => {
        slitCutFormData[key] = changeEvent.target.value;
    }
    const location = useLocation();
    const saveForm = () => {
        slitCutFormData['slitInspectionData'] = slitInspectionData
        slitCutFormData['cutInspectionData'] = cutInspectionData
        slitCutFormData['finalInspectionData'] = finalInspectionData
        slitCutFormData['toleranceInspectionData'] = toleranceInspectionData 
        slitCutFormData['toleranceInspectionDataSlit'] = toleranceInspectionDataSlit
        props.onSave(slitCutFormData);
        props.updateQRFormData({ action: 'slit_cut', formData: slitCutFormData });
    }

    const handleSlitInspectionTableChange = (tableData) => {
        console.log('handleSlitInspectionTableChange', tableData)
        setSlitInspectionData(tableData)
    } 

    const handleCutInspectionTableChange = (tableData) => {
        setCutInspectionData(tableData)
    } 

    const handleFinalInspectionTableChange = (tableData) => {
        setFinalInspectionData(tableData)
    } 
    const handleToleranceTableChange = (tableData) => {
        setToleranceInspectionData(tableData)
    } 
    const handleToleranceTableChangeSlit = (tableData) => {
       setToleranceInspectionDataSlit(tableData);
    }

    return (
        <div id="slittingform">
            <Card title="Slit & Cut Process Form">
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
                            <Input disabled value="Slit & Cut" onChange={(e) => onOptionChange('operation', e)}></Input>
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
                            <label style={{fontSize: 20}}>Slitting Tolerance Data</label>
                        </Col>
                    </Row>
                    <EditableTable columns={toleranceColumnsSlit} emptyRecord={toleranceEmptyRecordSlit} dataSource={toleranceDataSourceSlit} handleChange={handleToleranceTableChangeSlit}/>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    <Row>
                        <Col span={24}>
                            <label style={{fontSize: 20}}>Cutting Tolerance Data</label>
                        </Col>
                    </Row>
                    <EditableTable columns={toleranceColumns} emptyRecord={toleranceEmptyRecord} dataSource={toleranceDataSource} handleChange={handleToleranceTableChange}/>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    <Row>
                        <Col span={24}>
                            <label style={{fontSize: 20}}>Slitting</label>
                        </Col>
                    </Row>
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
                     <Row>
                        <Col span={24}>
                            <label style={{fontSize: 20}}>Cutting</label>
                        </Col>
                    </Row>
                    <EditableTable columns={cutColumns} emptyRecord={emptyCutRecord} dataSource={dataSource} handleChange={handleCutInspectionTableChange}/>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    <Row>
                        <Col span={24}>
                            <label>Final Judgement</label>
                            <TextArea  onChange={(e) => onOptionChange('finalJudgement', e)}></TextArea>
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
  })(SlitAndCutForm);