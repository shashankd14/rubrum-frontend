import { Button, Card, Col, DatePicker, Input, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react'
import EditableTable from '../../../../../../util/EditableTable';
import { connect } from 'react-redux';
import moment from 'moment';
import {
    updateQRFormData,
    getQualityPacketDetails,
    fetchQualityReportList,
    fetchQualityReportStageList,
    getCoilPlanDetails,
  } from '../../../../../../appRedux/actions';

const CuttingForm = (props) => {
    var toleranceThickness = 0;
    var toleranceWidth = 0;
    var toleranceLength = 0;
    var toleranceBurrHeight = 0;
    var toleranceDiagonalDifference = 0;
    
    const templateData = JSON.parse(
      props?.templateDetails?.data?.templateDetails
    );
    const formDataObject = templateData.find((item) => item.id === 'formData');
    if (formDataObject) {
        debugger
      const formData = formDataObject.value;
      const toleranceInspectionData = formData.toleranceInspectionData;
      toleranceThickness = toleranceInspectionData[0].toleranceThickness;
      toleranceWidth = toleranceInspectionData[0].toleranceWidth;
      toleranceBurrHeight = toleranceInspectionData[0].toleranceBurrHeight;
      toleranceLength = toleranceInspectionData[0].toleranceLength;
      toleranceDiagonalDifference = toleranceInspectionData[0].toleranceDiagonalDifference;
    } 
    const [dataSource, setDataSource] = useState([]);
    const [toleranceDataSource, setToleranceDataSource] = useState([]);
    
    useEffect(() => {
        debugger;
        if (props.templateDetails.packetDetails) {
          const mappedData = props.templateDetails.packetDetails.map(item => ({
           // thickness: item.thickness,
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
    const emptyRecord = {
        key: 0,
       // slitNo: "",
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
        cutFormData[key] = changeEvent.target.value;
    }

    const saveForm = () => {
        cutFormData['cutInspectionData'] = cutInspectionData
        cutFormData['toleranceInspectionData'] = toleranceInspectionData
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
                            <Input disabled value={cutFormData.physicalAppearance} onChange={(e) => onOptionChange('physicalAppearance', e)}></Input>
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
                    <EditableTable columns={columns} emptyRecord={emptyRecord} dataSource={dataSource} handleChange={handleInspectionTableChange}/>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    <EditableTable columns={toleranceColumns} emptyRecord={toleranceEmptyRecord} dataSource={toleranceDataSource} handleChange={handleToleranceTableChange}/>
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
    inward: state.inward,
  });
  
  export default connect(mapStateToProps, {
    updateQRFormData,
    getQualityPacketDetails,
    fetchQualityReportList,
    fetchQualityReportStageList,
    getCoilPlanDetails,
  })(CuttingForm);
  