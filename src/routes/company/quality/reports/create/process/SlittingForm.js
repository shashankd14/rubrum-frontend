import { Button, Card, Col, DatePicker, Input, Popconfirm, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import EditableTable from '../../../../../../util/EditableTable';
import {
  updateQRFormData,
  getQualityPacketDetails,
  fetchQualityReportList,
  fetchQualityReportStageList,
  getCoilPlanDetails,
} from '../../../../../../appRedux/actions';

const SlittingForm = (props) => {
  var allowableLowerWidth = 0;
  var allowableHigherWidth = 0;
  var allowableLowerburrHeight = 0;
  var allowableHeigherburrHeight = 0;
  
  const templateData = JSON.parse(
    props?.templateDetails?.data?.templateDetails
  );
  
  // Access the 'formData' property
  const formDataObject = templateData.find((item) => item.id === 'formData');

  if (formDataObject) {
    // Access the "value" property which contains the "formData" object
    const formData = formDataObject.value;

    // Access the "slitInspectionData" array
    const slitInspectionData = formData.slitInspectionData;

    // Access the "allowableLowerWidth" of the first sub-row (element at index 0)
    allowableLowerWidth = slitInspectionData[0].allowableLowerWidth;
    allowableHigherWidth = slitInspectionData[0].allowableHigherWidth;
    allowableHeigherburrHeight = slitInspectionData[0].allowableHeigherburrHeight;
    allowableLowerburrHeight = slitInspectionData[0].allowableLowerburrHeight;
  } 

//   const [slitDataSource, setSlitDataSource] = useState([
//     {
//       slitNo: '',
//       slitSize: '',
//       allowableLowerWidth: allowableLowerWidth,
//       allowableHigherWidth: allowableHigherWidth,
//       allowableLowerburrHeight: allowableLowerburrHeight,
//       allowableHeigherburrHeight: allowableHeigherburrHeight,
//       actualWidth: '',
//       burrHeight: '',
//       remarks: '',
//     },
//   ]);
    const [slitDataSource, setSlitDataSource] = useState([]);

  const [finalDataSource, setFinalDataSource] = useState([]);
  
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

  const [isDisabled, setIsDisabled] = useState(props.isDisabled);

  const [slitInspectionData, setSlitInspectionData] = useState([]);
  const [finalInspectionData, setFinalInspectionData] = useState([]);

  useEffect(() => {
    // Update customerName in slitFormData when props change
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
  const [slitFormData, setSlitFormData] = useState({
    processType: 'slitting',
    customerName: '',
    operation: 'Slitting',
    processDate: '',
    batchNumber: '',
    motherCoilNumber: '',
    aspenCoilNumber: '',
    grade: '',
    thickness: '',
    width: '',
    weight: '',
    physicalAppearance: '',
    reportDate: '',
    finalJudgement: '',
    qualityEngineer: '',
    qualityHead: '',
  });

  const gridCardStyle = {
    width: '50%',
    height: 300,
    textAlign: 'left',
    display: 'grid',
    paddingRight: 25,
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
      editable: true,
    },
    {
      title: 'Slit Size',
      dataIndex: 'plannedNoOfPieces',
      editable: true,
    },
    {
      title: 'Allowable Lower Slit Size',
      dataIndex: 'allowableLowerWidth',
      editable: false,
    },
    {
      title: 'Allowable Higher Slit Size',
      dataIndex: 'allowableHigherWidth',
      editable: false,
    },
    {
      title: 'Actual Width',
      dataIndex: 'actualWidth',
      editable: true,
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
      editable: true,
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      editable: true,
    },
  ];

  const finalColumns = [
    {
      title: 'Slit No.',
      dataIndex: 'instructionId',
      editable: true,
    },
    {
      title: 'Slit Size',
      dataIndex: 'plannedNoOfPieces',
      editable: true,
    },
    {
      title: 'Allowable Lower Slit Size',
      dataIndex: 'allowableLowerWidth',
      editable: false,
    },
    {
      title: 'Allowable Higher Slit Size',
      dataIndex: 'allowableHigherWidth',
      editable: false,
    },
    {
      title: 'Actual Width',
      dataIndex: 'actualWidth',
      editable: true,
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
      editable: true,
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      editable: true,
    },
  ];

  const emptySlitRecord = {
    key: 0,
    slitNo: '',
    slitSize: '',
    allowableLowerWidth: '',
    allowableHigherWidth: '',
    actualWidth: '',
    burrHeight: '',
    remarks: '',
  };

  const emptyFinalRecord = {
    key: 0,
    slitNo: '',
    slitSize: '',
    allowableLowerWidth: '',
    allowableHigherWidth: '',
    actualWidth: '',
    burrHeight: '',
    remarks: '',
  };

  const onOptionChange = (key, changeEvent) => {
    slitFormData[key] = changeEvent.target.value;
  };

  const saveForm = () => {
    slitFormData['slitInspectionData'] = slitInspectionData;
    slitFormData['finalInspectionData'] = finalInspectionData;
    props.onSave(slitFormData);
    props.updateQRFormData({ action: 'slit', formData: slitFormData });
  };

  const handleInspectionTableChange = (tableData) => {
    console.log('handleInspectionTableChange', tableData);
    setSlitInspectionData(tableData);
  };

  const handleFinalInspectionTableChange = (tableData) => {
    console.log('handleFinalInspectionTableChange', tableData);
    setFinalInspectionData(tableData);
  };
  // const handlePrint = () => {
  //   window.print(); // Opens the print dialog
  // };
  function openPrintPreview() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print</title></head><body>');
    const printableContent = document.getElementById('printable-content'); // This is the ID of the content to print
    printWindow.document.write(printableContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  }
  //console.log("props.inward?.plan?.instruction?.instructionDate", props.inward?.plan);
  // const instructionDates = props.inward?.plan?.instruction.map(item => item.instructionDate);
   console.log("props.templateDetails.packetDetails?.instructionDate", props.templateDetails.packetDetails?.map(item=>item.instructionDate));
   const instructionDate = props.templateDetails.packetDetails?.map(item=>item.instructionDate)
   console.log(instructionDate)
  return (
    <div id='slittingform'>
      <Card title='Slitting Process Form'>
        <Card.Grid style={gridCardStyle}>
          <Row>
            <Col span={24}>
              <label>Customer Name</label>
              {/* <Input placeholder='Enter customer name' disabled value={slitFormData.customerName} onChange={(e) => onOptionChange('customerName', e)}></Input> */}
              <Input
                value={props.inward?.plan?.party?.partyName}
                onChange={(e) => onOptionChange('customerName', e)}
              ></Input>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <label>Process Date</label>
               <DatePicker
                //value={props.inward?.plan?.instruction?.instructionDate}
                value={moment(instructionDate, 'YYYY-MM-DD HH:mm:ss')}
                onChange={(e) => onOptionChange('processDate', e)}
              >
                {' '}
              </DatePicker> 
            </Col>
            <Col span={12}>
              <label>Batch Number</label>
              <Input
                value={props.inward?.plan?.batchNumber}
                onChange={(e) => onOptionChange('batchNumber', e)}
              ></Input>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <label>Grade</label>
              <Input
                value={props.inward?.plan?.materialGrade?.gradeName}
                onChange={(e) => onOptionChange('grade', e)}
              ></Input>
            </Col>
            <Col span={12}>
              <label>Coil Thickness (IN MM)</label>
              <Input
                value={props.inward?.plan?.fThickness}
                onChange={(e) => onOptionChange('thickness', e)}
              ></Input>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <label>Physical Appearance</label>
              <Input
                disabled
                value={slitFormData.physicalAppearance}
                onChange={(e) => onOptionChange('physicalAppearance', e)}
              ></Input>
            </Col>
          </Row>
        </Card.Grid>
        <Card.Grid style={gridCardStyle}>
          <Row>
            <Col span={24}>
              <label>Operation</label>
              <Input
                disabled
                value='Slitting'
                onChange={(e) => onOptionChange('operation', e)}
              ></Input>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <label>Mother Coil No.</label>
              <Input
                value={props.inward?.plan?.customerCoilId}
                onChange={(e) => onOptionChange('motherCoilNumber', e)}
              ></Input>
            </Col>
            <Col span={12}>
              <label>AspenCoil No.</label>
              <Input
                disabled
                value={props.inward?.plan?.coilNumber}
                onChange={(e) => onOptionChange('aspenCoilNumber', e)}
              ></Input>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <label>Coil Width (IN MM)</label>
              <Input
                disabled
                value={props.inward?.plan?.fWidth}
                onChange={(e) => onOptionChange('width', e)}
              ></Input>
            </Col>
            <Col span={12}>
              <label>Coil Weight (IN KGs)</label>
              <Input
                disabled
                value={props.inward?.plan?.grossWeight}
                onChange={(e) => onOptionChange('weight', e)}
              ></Input>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <label>Report Date</label>
              <DatePicker
                style={{ width: '100%' }}
                disabled
                value={slitFormData.reportDate}
                onChange={(e) => onOptionChange('reportDate', e)}
              ></DatePicker>
            </Col>
          </Row>
        </Card.Grid>
        <Card.Grid style={gridStyle}>
          <EditableTable
            columns={slitColumns}
            emptyRecord={emptySlitRecord}
            dataSource={slitDataSource}
            handleChange={handleInspectionTableChange}
          />
        </Card.Grid>
        <Card.Grid style={gridStyle}>
          <Row>
            <Col span={24}>
              <label style={{ fontSize: 20 }}>
                Final Quality Inspection Report
              </label>
            </Col>
          </Row>
          <EditableTable
            columns={finalColumns}
            emptyRecord={emptyFinalRecord}
            dataSource={finalDataSource}
            handleChange={handleFinalInspectionTableChange}
          />
        </Card.Grid>
        <Card.Grid style={gridStyle}>
          <Row>
            <Col span={24}>
              <label>Final Judgement</label>
              <TextArea
                value={slitFormData.finalJudgement}
                onChange={(e) => onOptionChange('finalJudgement', e)}
              ></TextArea>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <label>Quality Engineer</label>
              <Input
                value={slitFormData.qualityEngineer}
                onChange={(e) => onOptionChange('qualityEngineer', e)}
              ></Input>
            </Col>
            <Col span={12}>
              <label>Quality Head</label>
              <Input
                value={slitFormData.qualityHead}
                onChange={(e) => onOptionChange('qualityHead', e)}
              ></Input>
            </Col>
          </Row>
        </Card.Grid>
        <div style={{ marginTop: 45 }}>
          <Button style={{ marginLeft: 8 }}>Cancel</Button>
          <Button type='primary' htmlType='submit' onClick={saveForm}>
            Save
          </Button>
      {/* <Button type="primary" onClick={handlePrint}>Print</Button> */}
      <Button type="primary" onClick={openPrintPreview}>Print</Button>
        </div>
      </Card>
    </div>
  );
};

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
})(SlittingForm);
