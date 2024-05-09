import { Button, Card, Col, DatePicker, Input, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import moment from 'moment';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import {
    updateQRFormData,
    getQualityPacketDetails,
    fetchQualityReportList,
    fetchQualityReportStageList,
    getCoilPlanDetails,
    getQualityReportById
  } from '../../../../../../appRedux/actions';
import EditableTableQR from '../../../../../../util/EditableTableQR';

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
      const toleranceInspectionDataCut = formData.toleranceInspectionData;
      toleranceThicknessFrom = toleranceInspectionDataCut[0].toleranceThicknessFrom; 
      toleranceThicknessTo = toleranceInspectionDataCut[0].toleranceThicknessTo;
      toleranceWidthFrom = toleranceInspectionDataCut[0].toleranceWidthFrom;
      toleranceWidthTo = toleranceInspectionDataCut[0].toleranceWidthTo;
      toleranceBurrHeightFrom = toleranceInspectionDataCut[0].toleranceBurrHeightFrom; 
      toleranceBurrHeightTo = toleranceInspectionDataCut[0].toleranceBurrHeightTo;
      toleranceLengthFrom = toleranceInspectionDataCut[0].toleranceLengthFrom;
      toleranceLengthTo = toleranceInspectionDataCut[0].toleranceLengthTo;
      toleranceDiagonalDifferenceFrom = toleranceInspectionDataCut[0].toleranceDiagonalDifferenceFrom; 
      toleranceDiagonalDifferenceTo = toleranceInspectionDataCut[0].toleranceDiagonalDifferenceTo;
    } 
    const [dataSource, setDataSource] = useState([]);
    const [toleranceDataSource, setToleranceDataSource] = useState([]);
    //display cut table first three column
  useEffect(() => {
    if (props.templateDetails.packetDetails && props.templateDetails.operation !== "qualityReportById") {
        const mappedData = props.templateDetails.packetDetails.map((item, i) => ({
          key: i,
          thickness:props.inward?.plan?.fThickness,
          plannedLength: item.plannedLength,
          plannedWidth: item.plannedWidth
        }));
        
        setDataSource(mappedData);
      }
  }, [props.templateDetails?.packetDetails, props.inward?.plan?.fThickness, props.templateDetails.operation]);
    const saveCutData = () => {
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
            settoleranceInspectionDataCut(toleranceData);
          }
    }
   
      useEffect(()=>{
        if (props.templateDetails.packetDetails && props.templateDetails.operation !== "qualityReportById") {
            saveCutData()
        }
      },[props.templateDetails.packetDetails, props.templateDetails.operation])

      //Code for view plan details
      const viewCutData = () => {
        if(props.templateDetails.operation == "qualityReportById"){
        var qirId = props.templateDetails.data.qirId
        props.getQualityReportById(qirId)
             const planDetails = JSON.parse(props.templateDetails.data.planDetails);
            const cutInspectionData = planDetails[0]?.cutInspectionData;
            if (cutInspectionData) {
          const mappedData = cutInspectionData.map((item, i) => ({
            key: i,
             thickness: item.thickness,
             plannedLength: item.plannedLength,
             plannedWidth: item.plannedWidth,
            actualThickness: item.actualThickness,
            actualWidth: item.actualWidth,
            actualLength: item.actualLength,
            burrHeight: item.burrHeight,
            diagonalDifference: item.diagonalDifference,
            remarks: item.remarks
          }));
          const toleranceDataTable = planDetails[0]?.toleranceInspectionDataCut;

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
          setDataSource(mappedData);
          setToleranceDataSource(toleranceData);
          settoleranceInspectionDataCut(toleranceData);
        }}
      }
      useEffect(() => {
        if(props.templateDetails.operation === "qualityReportById"){
            viewCutData()
        }
      }, [props.templateDetails.operation]);

    const instructionDate = props.templateDetails.packetDetails?.map(item=>item.instructionDate)

    const [cutInspectionData, setCutInspectionData] = useState([])

    const [toleranceInspectionDataCut, settoleranceInspectionDataCut] = useState([])
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
        console.log("changeEvent", changeEvent)
        console.log("key", key)
        cutFormData[key] = changeEvent.target.value;
        console.log("changeEvent.target.value", changeEvent.target.value)
    }

    useEffect(() => {
        setCutFormData((prevFormData) => ({
          ...prevFormData,
          cutInspectionData: cutInspectionData,
          toleranceInspectionDataCut: toleranceInspectionDataCut,
        }));
      }, [cutInspectionData, toleranceInspectionDataCut]);
    const saveForm = () => {
        cutFormData['cutInspectionData'] = cutInspectionData
        cutFormData['toleranceInspectionDataCut'] = toleranceInspectionDataCut
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
        settoleranceInspectionDataCut(tableData)
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
                            <label>Document ID</label>
                            <Input value={location.state.selectedItemForQr.planId} onChange={(e) => onOptionChange('partDetailsId', e)}></Input>
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
                            <label>Internal Coil No</label>
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
                            <label>Target Weight</label>
                            <Input disabled value={location.state.selectedItemForQr.targetWeight} onChange={(e) => onOptionChange('plannedWeight', e)}></Input>
                        </Col>
                        <Col span={12}>
                            <label>Planned Yield Loss (%)</label>
                            <Input disabled value={location.state.selectedItemForQr.plannedYieldLossRatio} onChange={(e) => onOptionChange('plannedYieldLossRatio', e)}></Input>
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
                    <EditableTableQR columns={toleranceColumns} emptyRecord={toleranceEmptyRecord} dataSource={toleranceDataSource} handleChange={handleToleranceTableChange}/>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    <EditableTableQR columns={columns} emptyRecord={emptyRecord} dataSource={dataSource} toleranceData={toleranceDataSource} handleChange={handleInspectionTableChange}/> 
                </Card.Grid>
                <div style={{ marginTop: 50 }}>
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
    getQualityReportById
  })(CuttingForm);
  