import { Button, Card, Col, DatePicker, Input, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea';
import React, { useState, useEffect } from 'react'
import EditableTable from '../../../../../../util/EditableTable';
import moment from 'moment';
import { connect } from 'react-redux';
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
    var toleranceThickness = 0;
    var toleranceWidth = 0;
    var toleranceLength = 0;
    var toleranceBurrHeight = 0;
    var toleranceDiagonalDifference = 0;
    
    const templateDataCut = JSON.parse(
      props?.templateDetails?.data?.templateDetails
    );
    const formDataObjectCut = templateDataCut.find((item) => item.id === 'formData');
    if (formDataObject) {
        debugger
      const formData = formDataObjectCut.value;
      const toleranceInspectionData = formData.toleranceInspectionData;
      toleranceThickness = toleranceInspectionData[0].toleranceThickness;
      toleranceWidth = toleranceInspectionData[0].toleranceWidth;
      toleranceBurrHeight = toleranceInspectionData[0].toleranceBurrHeight;
      toleranceLength = toleranceInspectionData[0].toleranceLength;
      toleranceDiagonalDifference = toleranceInspectionData[0].toleranceDiagonalDifference;
    } 
  
  useEffect(() => {
    if (props.templateDetails.packetDetails) {
      const mappedData = props.templateDetails.packetDetails.map(item => ({
        instructionId: item.instructionId,
        plannedNoOfPieces: item.plannedNoOfPieces,
        allowableLowerWidth: allowableLowerWidth,
        allowableHigherWidth: allowableHigherWidth,
        actualWidth: "",
        allowableLowerburrHeight: allowableLowerburrHeight,
        allowableHeigherburrHeight: allowableHeigherburrHeight,
        burrHeight: "",
        remarks: "",
      }));
      setFinalDataSource(mappedData);
      setSlitDataSource(mappedData);
    }
  }, [props.templateDetails.packetDetails]);

  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
      debugger;
      if (props.templateDetails.packetDetails) {
        const mappedData = props.templateDetails.packetDetails.map(item => ({
          //thickness: item.thickness,
          thickness:5,
          plannedLength: item.plannedLength,
          plannedWidth: item.plannedWidth,
          actualThickness: "",
          actualWidth: "",
          actualLength: "",
          burrHeight: "",
          diagonalDifference: "",
          remarks: "",
          toleranceThickness: toleranceThickness,
          toleranceWidth: toleranceWidth,
          toleranceLength: toleranceLength,
          toleranceBurrHeight: toleranceBurrHeight,
          toleranceDiagonalDifference: toleranceDiagonalDifference,
        }));
        setDataSource(mappedData);
        setToleranceDataSource(mappedData);
        console.log("mappedData", mappedData)
      }
    }, [props.templateDetails.packetDetails]);

    const [slitInspectionData, setSlitInspectionData] = useState([])
    const [cutInspectionData, setCutInspectionData] = useState([])
    const [finalInspectionData, setFinalInspectionData] = useState([])
    const [toleranceInspectionData, setToleranceInspectionData] = useState([])
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
            title: 'Allowable Lower Slit Size',
            dataIndex: 'allowableLowerWidth',
            editable: false
        },
        {
            title: 'Allowable Higher Slit Size',
            dataIndex: 'allowableHigherWidth',
            editable: false
        },
        {
            title: 'Actual Width',
            dataIndex: 'actualWidth',
            editable: true
        },
        {
            title: 'Allowable Lower Burr Height',
            dataIndex: 'allowableLowerburrHeight',
            editable: false,
          },
          {
            title: 'Allowable Higher Burr Height',
            dataIndex: 'allowableHeigherburrHeight',
            editable: false,
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
            title: 'Allowable Lower Slit Size',
            dataIndex: 'allowableLowerWidth',
            editable: false
        },
        {
            title: 'Allowable Higher Slit Size',
            dataIndex: 'allowableHigherWidth',
            editable: false
        },
        {
            title: 'Actual Width',
            dataIndex: 'actualWidth',
            editable: true
        },
        {
            title: 'Allowable Lower Burr Height',
            dataIndex: 'allowableLowerburrHeight',
            editable: false,
          },
          {
            title: 'Allowable Higher Burr Height',
            dataIndex: 'allowableHeigherburrHeight',
            editable: false,
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
            title: 'Tolerance Thickness',
            dataIndex: 'toleranceThickness',
            editable: false
        },
        {
            title: 'Tolerance Width',
            dataIndex: 'toleranceWidth',
            editable: false
        },
        {
            title: 'Tolerance Length',
            dataIndex: 'toleranceLength',
            editable: false
        },
        {
            title: 'Tolerance Burr Height',
            dataIndex: 'toleranceBurrHeight',
            editable: false
        },
        {
            title: 'Tolerance Diagonal Difference',
            dataIndex: 'toleranceDiagonalDifference',
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
        props.updateQRFormData({ action: 'slit_cut', formData: slitCutFormData });
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
                            <Input disabled value={slitCutFormData.physicalAppearance} onChange={(e) => onOptionChange('physicalAppearance', e)}></Input>
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
                            <Input disabled value={props.inward?.plan?.customerCoilId} onChange={(e) => onOptionChange('motherCoilNumber', e)}></Input>
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
                    <EditableTable columns={cutColumns} emptyRecord={emptyCutRecord} dataSource={dataSource} handleChange={handleCutInspectionTableChange}/>
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