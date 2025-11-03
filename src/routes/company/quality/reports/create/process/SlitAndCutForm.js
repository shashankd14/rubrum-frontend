import { Button, Card, Col, DatePicker, Input, Row } from "antd";
import React, { useState, useEffect } from "react";
import EditableTableQR from "../../../../../../util/EditableTableQR";
import moment from "moment";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import {
  updateQRFormData,
  getQualityPacketDetails,
  fetchQualityReportList,
  fetchQualityReportStageList,
  getCoilPlanDetails,
  getQualityReportById,
} from "../../../../../../appRedux/actions";

const SlitAndCutForm = (props) => {
  //fetch slit data from QT

  const templateData = JSON.parse(
    props?.templateDetails?.data?.templateDetails
  );

  const formDataObject = templateData.find((item) => item.id === "formData");

  const [slitDataSource, setSlitDataSource] = useState([]);
  const [finalDataSource, setFinalDataSource] = useState([]);
  //  const [toleranceDataSource, setToleranceDataSource] = useState(formDataObject.value.toleranceInspectionData);
  const [toleranceDataSource, setToleranceDataSource] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [slitInspectionData, setSlitInspectionData] = useState([]);
  const [cutInspectionData, setCutInspectionData] = useState([]);
  const [finalInspectionData, setFinalInspectionData] = useState([]);
  const [toleranceInspectionData, setToleranceInspectionData] = useState([]);
  const [toleranceDataSourceSlit, setToleranceDataSourceSlit] = useState([]);
  const [toleranceInspectionDataSlit, setToleranceInspectionDataSlit] =
    useState([]);
  const [thicknessSlit, setThicknessSlit] = useState();
  //send thickness to EditableTableQR
  useEffect(() => {
    const thicknessSlitE = props.inward?.plan?.fThickness;
    setThicknessSlit(thicknessSlitE);
  }, [props.inward]);
  //fetch tolerance data from QT-cut
  var toleranceThicknessFromCut = 0;
  var toleranceThicknessToCut = 0;
  var toleranceWidthFromCut = 0;
  var toleranceWidthToCut = 0;
  var toleranceLengthFromCut = 0;
  var toleranceLengthToCut = 0;
  var toleranceBurrHeightFromCut = 0;
  var toleranceBurrHeightToCut = 0;
  var toleranceDiagonalDifferenceFromCut = 0;
  var toleranceDiagonalDifferenceToCut = 0;

  const templateDataCut = JSON.parse(
    props?.templateDetails?.data?.templateDetails
  );
  const formDataObjectCut = templateDataCut.find(
    (item) => item.id === "formData"
  );
  if (formDataObject) {
    const formData = formDataObjectCut.value;
    const toleranceInspectionData = formData.toleranceInspectionData;
    toleranceThicknessFromCut =
      toleranceInspectionData[0].toleranceThicknessFrom;
    toleranceThicknessToCut = toleranceInspectionData[0].toleranceThicknessTo;
    toleranceWidthFromCut = toleranceInspectionData[0].toleranceWidthFrom;
    toleranceWidthToCut = toleranceInspectionData[0].toleranceWidthTo;
    toleranceBurrHeightFromCut =
      toleranceInspectionData[0].toleranceBurrHeightFrom;
    toleranceBurrHeightToCut = toleranceInspectionData[0].toleranceBurrHeightTo;
    toleranceLengthFromCut = toleranceInspectionData[0].toleranceLengthFrom;
    toleranceLengthToCut = toleranceInspectionData[0].toleranceLengthTo;
    toleranceDiagonalDifferenceFromCut =
      toleranceInspectionData[0].toleranceDiagonalDifferenceFrom;
    toleranceDiagonalDifferenceToCut =
      toleranceInspectionData[0].toleranceDiagonalDifferenceTo;
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
  const formDataObjectTolerance = templateDataTolerance.find(
    (item) => item.id === "formData"
  );
  if (formDataObject) {
    const formData = formDataObjectTolerance.value;
    const toleranceInspectionData = formData.toleranceInspectionDataSlit;
    toleranceThicknessFromSlit =
      toleranceInspectionData[0].toleranceThicknessFrom;
    toleranceThicknessToSlit = toleranceInspectionData[0].toleranceThicknessTo;
    toleranceSlitSizeFromSlit =
      toleranceInspectionData[0].toleranceSlitSizeFrom;
    toleranceSlitSizeToSlit = toleranceInspectionData[0].toleranceSlitSizeTo;
    toleranceBurrHeightFromSlit =
      toleranceInspectionData[0].toleranceBurrHeightFrom;
    toleranceBurrHeightToSlit =
      toleranceInspectionData[0].toleranceBurrHeightTo;
  }
  // save Slit table
  const saveSlitData = () => {
    const packetDetails = props.templateDetails?.packetDetails;
    if (packetDetails) {
      const slittingProcess = packetDetails.filter(
        (process) => process.process.processName === "SLITTING"
      );
      if (slittingProcess.length > 0) {
        const mappedData = slittingProcess.map((item, i) => ({
          key: i,
          instructionId: item.instructionId,
          plannedWidth: item.plannedWidth,
          actualThickness: "",
          actualWidth: "",
          burrHeight: "",
          remarks: "",
        }));
        const toleranceData = [
          {
            toleranceThicknessFrom: toleranceThicknessFromSlit,
            toleranceThicknessTo: toleranceThicknessToSlit,
            toleranceSlitSizeFrom: toleranceSlitSizeFromSlit,
            toleranceSlitSizeTo: toleranceSlitSizeToSlit,
            toleranceBurrHeightFrom: toleranceBurrHeightFromSlit,
            toleranceBurrHeightTo: toleranceBurrHeightToSlit,
          },
        ];
        setFinalDataSource(mappedData);
        setSlitDataSource(mappedData);
        setToleranceDataSourceSlit(toleranceData);
        setToleranceInspectionDataSlit(toleranceData);
      }
    }
  };

  //display cut table first three column
  useEffect(() => {
    if (props.templateDetails.operation !== "qualityReportById") {
      const packetDetails = props.templateDetails?.packetDetails;

      if (packetDetails) {
        const slitAndCutProcess = packetDetails.filter(
          (process) => process.process.processName === "SLIT AND CUT"
        );

        if (slitAndCutProcess.length > 0) {
          const mappedData = slitAndCutProcess.map((item, i) => ({
            key: i,
            plannedLength: item.plannedLength,
            plannedWidth: item.plannedWidth,
            thickness: props.inward?.plan?.fThickness,
          }));

          setDataSource(mappedData);
        }
      }
    }
  }, [
    props.templateDetails?.packetDetails,
    props.inward?.plan?.fThickness,
    props.templateDetails.operation,
  ]);

  //save cut table
  const saveCutData = () => {
    const packetDetails = props.templateDetails?.packetDetails;
    if (packetDetails) {
      const slitAndCutProcess = packetDetails.filter(
        (process) => process.process.processName === "SLIT AND CUT"
      );
      if (slitAndCutProcess.length > 0) {
        const mappedData = slitAndCutProcess.map((item, i) => ({
          key: i,
          thickness: props.inward?.plan?.fThickness,
          plannedLength: item.plannedLength,
          plannedWidth: item.plannedWidth,
          actualThickness: "",
          actualWidth: "",
          actualLength: "",
          burrHeight: "",
          diagonalDifference: "",
          remarks: "",
        }));
        const toleranceData = [
          {
            toleranceThicknessFrom: toleranceThicknessFromCut,
            toleranceThicknessTo: toleranceThicknessToCut,
            toleranceWidthFrom: toleranceWidthFromCut,
            toleranceWidthTo: toleranceWidthToCut,
            toleranceLengthFrom: toleranceLengthFromCut,
            toleranceLengthTo: toleranceLengthToCut,
            toleranceBurrHeightFrom: toleranceBurrHeightFromCut,
            toleranceBurrHeightTo: toleranceBurrHeightToCut,
            toleranceDiagonalDifferenceFrom: toleranceDiagonalDifferenceFromCut,
            toleranceDiagonalDifferenceTo: toleranceDiagonalDifferenceToCut,
          },
        ];
        setDataSource(mappedData);
        setToleranceInspectionData(toleranceData);
        setToleranceDataSource(toleranceData);
      }
    }
  };
  useEffect(() => {
    if (
      props.templateDetails.packetDetails &&
      props.templateDetails.operation !== "qualityReportById"
    ) {
      saveSlitData();
      saveCutData();
    }
  }, [props.templateDetails.packetDetails, props.templateDetails.operation]);

  //View slitting table
  const viewSlitData = () => {
    if (props.templateDetails.operation == "qualityReportById") {
      var qirId = props.templateDetails.data.qirId;
      props.getQualityReportById(qirId);
      const planDetails = JSON.parse(props.templateDetails.data.planDetails);
      const slitData = planDetails[0]?.slitInspectionData;
      if (slitData) {
        const mappedData = slitData.map((item, i) => ({
          key: i,
          instructionId: item.instructionId,
          plannedWidth: item.plannedWidth,
          actualThickness: item.actualThickness,
          actualWidth: item.actualWidth,
          burrHeight: item.burrHeight,
          remarks: item.remarks,
        }));
        const toleranceDataTable = planDetails[0]?.toleranceInspectionDataSlit;
        const toleranceData = toleranceDataTable.map((item, i) => ({
          toleranceThicknessFrom: item.toleranceThicknessFrom,
          toleranceThicknessTo: item.toleranceThicknessTo,
          toleranceSlitSizeFrom: item.toleranceSlitSizeFrom,
          toleranceSlitSizeTo: item.toleranceSlitSizeTo,
          toleranceBurrHeightFrom: item.toleranceBurrHeightFrom,
          toleranceBurrHeightTo: item.toleranceBurrHeightTo,
        }));
        setFinalDataSource(mappedData);
        setSlitDataSource(mappedData);
        setToleranceDataSourceSlit(toleranceData);
        setToleranceInspectionDataSlit(toleranceData);
      }
    }
  };
  //view cut table
  const viewCutData = () => {
    if (props.templateDetails.operation == "qualityReportById") {
      var qirId = props.templateDetails.data.qirId;
      props.getQualityReportById(qirId);
      const planDetails = JSON.parse(props.templateDetails.data.planDetails);
      const cutData = planDetails[0]?.cutInspectionData;
      if (cutData) {
        const mappedDataCut = cutData.map((item, i) => ({
          key: i,
          thickness: item.thickness,
          plannedLength: item.plannedLength,
          plannedWidth: item.plannedWidth,
          actualThickness: item.actualThickness,
          actualWidth: item.actualWidth,
          actualLength: item.actualLength,
          burrHeight: item.burrHeight,
          diagonalDifference: item.diagonalDifference,
          remarks: item.remarks,
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
        setDataSource(mappedDataCut);
        setToleranceDataSource(toleranceData);
        setToleranceInspectionData(toleranceData);
      }
    }
  };
  useEffect(() => {
    if (props.templateDetails.operation === "qualityReportById") {
      viewSlitData();
      viewCutData();
    }
  }, [props.templateDetails.operation]);

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
  });
  useEffect(() => {
    setSlitFormData((prevFormData) => ({
      ...prevFormData,
      customerName: props.inward?.plan?.party?.partyName || "",
      processDate: props.inward?.plan?.instruction?.instructionDate || "",
      batchNumber: props.inward?.plan?.batchNumber || "",
      motherCoilNumber: props.inward?.plan?.customerCoilId || "",
      aspenCoilNumber: props.inward?.plan?.coilNumber || "",
      grade: props.inward?.plan?.materialGrade?.gradeName || "",
      thickness: props.inward?.plan?.fThickness || "",
      width: props.inward?.plan?.fWidth || "",
      weight: props.inward?.plan?.grossWeight || "",
    }));
  }, [props.inward?.plan?.party]);
  const instructionDate = props.templateDetails.packetDetails?.map(
    (item) => item.instructionDate
  );
  const gridCardStyle = {
    width: "50%",
    // height: 300,
    textAlign: "left",
    display: "grid",
    paddingRight: 25,
  };

  const gridStyle = {
    width: "100%",
    // height: 350,
    textAlign: "left",
  };

  const slitColumns = [
    {
      title: "Slit No.",
      dataIndex: "instructionId",
      editable: false,
    },
    {
      title: "Slit Size",
      dataIndex: "plannedWidth",
      editable: false,
    },
    {
      title: "Actual Slit Size",
      dataIndex: "actualWidth",
      editable: true,
    },
    {
      title: "Actual Thickness",
      dataIndex: "actualThickness",
      editable: true,
    },
    {
      title: "Burr Height",
      dataIndex: "burrHeight",
      editable: true,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      editable: true,
    },
  ];

  const finalColumns = [
    {
      title: "Slit No.",
      dataIndex: "instructionId",
      editable: false,
    },
    {
      title: "Slit Size",
      dataIndex: "plannedWidth",
      editable: false,
    },
    {
      title: "Actual Slit Size",
      dataIndex: "actualWidth",
      editable: true,
    },
    {
      title: "Actual Thickness",
      dataIndex: "actualThickness",
      editable: true,
    },
    {
      title: "Burr Height",
      dataIndex: "burrHeight",
      editable: true,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      editable: true,
    },
  ];

  const cutColumns = [
    {
      title: "Thickness",
      dataIndex: "thickness",
      editable: false,
    },
    {
      title: "Width",
      dataIndex: "plannedWidth",
      editable: false,
    },
    {
      title: "Length",
      dataIndex: "plannedLength",
      editable: false,
    },
    {
      title: "Actual Thickness",
      dataIndex: "actualThickness",
      editable: true,
    },
    {
      title: "Actual Width",
      dataIndex: "actualWidth",
      editable: true,
    },
    {
      title: "Actual Length",
      dataIndex: "actualLength",
      editable: true,
    },
    {
      title: "Burr Height",
      dataIndex: "burrHeight",
      editable: true,
    },
    {
      title: "Diagonal Difference",
      dataIndex: "diagonalDifference",
      editable: true,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      editable: true,
    },
  ];
  const toleranceColumns = [
    {
      title: "Thickness From",
      dataIndex: "toleranceThicknessFrom",
      editable: false,
    },
    {
      title: "Thickness To",
      dataIndex: "toleranceThicknessTo",
      editable: false,
    },
    {
      title: "Width From",
      dataIndex: "toleranceWidthFrom",
      editable: false,
    },
    {
      title: "Width To",
      dataIndex: "toleranceWidthTo",
      editable: false,
    },
    {
      title: "Length From",
      dataIndex: "toleranceLengthFrom",
      editable: false,
    },
    {
      title: "Length To",
      dataIndex: "toleranceLengthTo",
      editable: false,
    },
    {
      title: "Burr Height From",
      dataIndex: "toleranceBurrHeightFrom",
      editable: false,
    },
    {
      title: "Burr Height To",
      dataIndex: "toleranceBurrHeightTo",
      editable: false,
    },
    {
      title: "Diagonal Difference From",
      dataIndex: "toleranceDiagonalDifferenceFrom",
      editable: false,
    },
    {
      title: "Diagonal Difference To",
      dataIndex: "toleranceDiagonalDifferenceTo",
      editable: false,
    },
  ];
  const toleranceColumnsSlit = [
    {
      title: "Slit Size From",
      dataIndex: "toleranceSlitSizeFrom",
      editable: false,
    },
    {
      title: "Slit Size To",
      dataIndex: "toleranceSlitSizeTo",
      editable: false,
    },
    {
      title: "Thickness From",
      dataIndex: "toleranceThicknessFrom",
      editable: false,
    },
    {
      title: "Thickness To",
      dataIndex: "toleranceThicknessTo",
      editable: false,
    },
    {
      title: "Burr Height From",
      dataIndex: "toleranceBurrHeightFrom",
      editable: false,
    },
    {
      title: "Burr Height To",
      dataIndex: "toleranceBurrHeightTo",
      editable: false,
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
  };

  const emptyFinalRecord = {
    key: 0,
    slitNo: "",
    slitSize: "",
    allowableLowerWidth: "",
    allowableHigherWidth: "",
    actualWidth: "",
    burrHeight: "",
    remarks: "",
  };

  const emptyCutRecord = {
    key: 0,
    slitNo: "",
    slitSize: "",
    allowableLowerWidth: "",
    allowableHigherWidth: "",
    actualWidth: "",
    burrHeight: "",
    remarks: "",
  };
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
  };
  const toleranceEmptyRecordSlit = {
    key: 0,
    toleranceThicknessFrom: "",
    toleranceThicknessTo: "",
    toleranceSlitSizeFrom: "",
    toleranceSlitSizeTo: "",
    toleranceBurrHeightFrom: "",
    toleranceBurrHeightTo: "",
  };

  const onOptionChange = (key, changeEvent) => {
    const target = changeEvent.nativeEvent.target;
    if (changeEvent.target) {
      setSlitFormData((prevData) => ({
        ...prevData,
        [key]: target.value,
      }));
    }
  };
  const location = useLocation();
  const saveForm = (event) => {
    event.preventDefault();
    slitCutFormData["slitInspectionData"] = slitInspectionData;
    slitCutFormData["cutInspectionData"] = cutInspectionData;
    slitCutFormData["finalInspectionData"] = finalInspectionData;
    slitCutFormData["toleranceInspectionDataCut"] = toleranceInspectionData;
    slitCutFormData["toleranceInspectionDataSlit"] =
      toleranceInspectionDataSlit;
    props.onSave(slitCutFormData);
    props.updateQRFormData({ action: "slit_cut", formData: slitCutFormData });
  };

  const handleSlitInspectionTableChange = (tableData) => {
    setSlitInspectionData(tableData);
  };

  const handleCutInspectionTableChange = (tableData) => {
    setCutInspectionData(tableData);
  };

  const handleFinalInspectionTableChange = (tableData) => {
    setFinalInspectionData(tableData);
  };
  const handleToleranceTableChange = (tableData) => {
    setToleranceInspectionData(tableData);
  };
  const handleToleranceTableChangeSlit = (tableData) => {
    setToleranceInspectionDataSlit(tableData);
  };

  //move data from slit table to slit inspection table
  const handleTransferToFinalTable = () => {
    const mappedData = slitInspectionData.map((slitItem) => ({
      instructionId: slitItem.instructionId,
      plannedWidth: slitItem.plannedWidth,
      actualWidth: slitItem.actualWidth,
      actualThickness: slitItem.actualThickness,
      burrHeight: slitItem.burrHeight,
      remarks: slitItem.remarks,
      key: slitItem.key,
    }));
    setFinalDataSource(mappedData);
    handleFinalInspectionTableChange(mappedData);
  };

  return (
    <div id="slittingform">
      <Card title="Slit & Cut Process Form">
        <Card.Grid style={gridCardStyle}>
          <Row>
            <Col span={24}>
              <label>Customer Name</label>
              <Input
                disabled
                value={props.inward?.plan?.party?.partyName}
                onChange={(e) => onOptionChange("customerName", e)}
              ></Input>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <label>Process Date</label>
              <DatePicker
                disabled
                value={moment(instructionDate, "YYYY-MM-DD HH:mm:ss")}
                onChange={(e) => onOptionChange("processDate", e)}
              >
                {" "}
              </DatePicker>
            </Col>
            <Col span={12}>
              <label>Batch Number</label>
              <Input
                disabled
                value={props.inward?.plan?.batchNumber}
                onChange={(e) => onOptionChange("batchNumber", e)}
              ></Input>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <label>Grade</label>
              <Input
                disabled
                value={props.inward?.plan?.materialGrade?.gradeName}
                onChange={(e) => onOptionChange("grade", e)}
              ></Input>
            </Col>
            <Col span={12}>
              <label>Coil Thickness (IN MM)</label>
              <Input
                disabled
                value={props.inward?.plan?.fThickness}
                onChange={(e) => onOptionChange("thickness", e)}
              ></Input>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <label>Document ID</label>
              <Input
                value={location.state.selectedItemForQr.planId}
                onChange={(e) => onOptionChange("partDetailsId", e)}
              ></Input>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <label>Physical Appearance</label>
              <Input
                onChange={(e) => onOptionChange("physicalAppearance", e)}
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
                value="Slit & Cut"
                onChange={(e) => onOptionChange("operation", e)}
              ></Input>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <label>Mother Coil No.</label>
              <Input
                onChange={(e) => onOptionChange("motherCoilNumber", e)}
              ></Input>
            </Col>
            <Col span={12}>
              <label>Internal Coil No</label>
              <Input
                disabled
                value={props.inward?.plan?.coilNumber}
                onChange={(e) => onOptionChange("aspenCoilNumber", e)}
              ></Input>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <label>Coil Width (IN MM)</label>
              <Input
                disabled
                value={props.inward?.plan?.fWidth}
                onChange={(e) => onOptionChange("width", e)}
              ></Input>
            </Col>
            <Col span={12}>
              <label>Coil Weight (IN KGs)</label>
              <Input
                disabled
                value={props.inward?.plan?.grossWeight}
                onChange={(e) => onOptionChange("weight", e)}
              ></Input>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <label>Target Weight</label>
              <Input
                disabled
                value={location.state.selectedItemForQr.targetWeight}
                onChange={(e) => onOptionChange("plannedWeight", e)}
              ></Input>
            </Col>
            <Col span={12}>
              <label>Total Yield Loss (%)</label>
              <Input
                disabled
                value={location.state.selectedItemForQr.plannedYieldLossRatio}
                onChange={(e) => onOptionChange("plannedYieldLossRatio", e)}
              ></Input>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <label>Report Date</label>
              <DatePicker
                style={{ width: "100%" }}
                defaultValue={moment()}
                onChange={(e) => onOptionChange("reportDate", e)}
              ></DatePicker>
            </Col>
          </Row>
        </Card.Grid>
        <Card.Grid style={gridStyle}>
          <Row>
            <Col span={24} style={{ textAlign: "center" }}>
              <label style={{ fontSize: 20, textAlign: "center" }}>
                Template Name - {location.state.templateDetails.templateName}
              </label>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <label style={{ fontSize: 20 }}>Slitting Tolerance Data</label>
            </Col>
          </Row>
          <EditableTableQR
            columns={toleranceColumnsSlit}
            emptyRecord={toleranceEmptyRecordSlit}
            dataSource={toleranceDataSourceSlit}
            handleChange={handleToleranceTableChangeSlit}
          />
        </Card.Grid>
        <Card.Grid style={gridStyle}>
          <Row>
            <Col span={24}>
              <label style={{ fontSize: 20 }}>Cutting Tolerance Data</label>
            </Col>
          </Row>
          <EditableTableQR
            columns={toleranceColumns}
            emptyRecord={toleranceEmptyRecord}
            dataSource={toleranceDataSource}
            handleChange={handleToleranceTableChange}
          />
        </Card.Grid>
        <Card.Grid style={gridStyle}>
          <Row>
            <Col span={24}>
              <label style={{ fontSize: 20 }}>Slitting</label>
            </Col>
          </Row>
          <EditableTableQR
            columns={slitColumns}
            emptyRecord={emptySlitRecord}
            dataSource={slitDataSource}
            toleranceData={toleranceDataSourceSlit}
            handleChange={handleSlitInspectionTableChange}
            thicknessSlit={thicknessSlit}
          />
        </Card.Grid>
        <Card.Grid style={gridStyle}>
          <Row>
            <Col span={24}>
              <label style={{ fontSize: 20 }}>
                Final Quality Inspection Report &emsp;
              </label>
              <Button type="primary" onClick={handleTransferToFinalTable}>
                Transfer Data
              </Button>
            </Col>
          </Row>
          <EditableTableQR
            columns={finalColumns}
            emptyRecord={emptyFinalRecord}
            dataSource={finalDataSource}
            toleranceData={toleranceDataSourceSlit}
            handleChange={handleFinalInspectionTableChange}
            thicknessSlit={thicknessSlit}
          />
        </Card.Grid>
        <Card.Grid style={gridStyle}>
          <Row>
            <Col span={24}>
              <label style={{ fontSize: 20 }}>Cutting</label>
            </Col>
          </Row>
          <EditableTableQR
            columns={cutColumns}
            emptyRecord={emptyCutRecord}
            dataSource={dataSource}
            toleranceData={toleranceDataSource}
            handleChange={handleCutInspectionTableChange}
          />
        </Card.Grid>
        <div style={{ marginTop: 45 }}>
          <Button style={{ marginLeft: 8 }}>Cancel</Button>
          <Button type="primary" htmlType="submit" onClick={saveForm}>
            Save
          </Button>
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
  getQualityReportById,
})(SlitAndCutForm);
