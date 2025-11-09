import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import moment from "moment";

import {
  submitInwardEntry,
  resetInwardForm,
  updateInward,
  pdfGenerateInward,
  QrGenerateInward,
  syncToZoho,
  getInwardsAgainstPo,
} from "../../../../appRedux/actions";
import {
  Button,
  Card,
  Col,
  Icon,
  message,
  Row,
  Spin,
  
} from "antd";
import { withRouter } from 'react-router-dom';

import {APPLICATION_DATE_FORMAT} from '../../../../constants/index';

const InwardEntrySummary = (props) => {
    
    useEffect(() => {
        if(props.inwardSubmitSuccess) {
            // setPayload({
            //     payloadObj:{
            //         inwardId: props.inwardObject.submitInward
            //     },
            //     type:'inward'
            // });
            message.success('Inward entry has been submitted successfully', 2);
            // props.saveTemporary();
            // props.resetInwardForm();
            // props.updateStep(0);
            // props.setShowSyncToZoho(true);
        }
    }, [props.inwardSubmitSuccess]);
    
    const partyName =(partyList) => {
        
       partyList = partyList.find(item => item.nPartyId===Number(props.inward.partyName))
       return partyList.partyName
    
    }
    let dimensionEdit = `${props.inward.fThickness} X ${props.inward.fWidth} X ${props.inward.fLength}`;
    let dimension = `${props.inward.thickness} X ${props.inward.width} X ${props.inward.length}`;

    return (
      <>
        {props.inwardSubmitLoading ? (
          <Spin
            className="gx-size-100 gx-flex-row gx-justify-content-center gx-align-items-center"
            size="large"
          />
        ) : (
          <>
            <Col span={24} className="gx-pt-4">
              <Row>
                <Col span={12}>
                  <Card title="Location Details" style={{ width: 300 }}>
                    <p>
                      Location Name :{" "}
                      {props.inward.party
                        ? props.inward.party.partyName
                        : props.inward && props.inward.partyName !== undefined
                        ? partyName(props.party.partyList)
                        : ""}
                    </p>
                    {props.inward.customerId && (
                      <p>Location Id : {props.inward.customerId}</p>
                    )}
                    {props.inward.invoiceNumber && (
                      <p>
                        PO number :{" "}
                        {props.inward.invoiceNumber?.label}
                      </p>
                    )}
                    {props.inward.customerBatchNo && (
                      <p>SC inward id : {props.inward.customerBatchNo}</p>
                    )}
                    {props.inward.customerInvoiceNo && (
                      <p>
                        Purchase Invoice No : {props.inward.customerInvoiceNo}
                      </p>
                    )}
                    {props.inward.purposeType && (
                      <p>Purpose Type : {props.inward.purposeType}</p>
                    )}
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Inward Details" style={{ width: 300 }}>
                    <p>Batch no. : {props.inward.coilNumber}</p>
                    {(props.inward.material || props.inward.description) && (
                      <p>
                        Material Description :{" "}
                        {props.params !== ""
                          ? props.inward?.material?.description
                          : props.inward.description}
                      </p>
                    )}
                    <p>
                      Dimensions :{" "}
                      {props.params !== "" ? dimensionEdit : dimension}
                    </p>
                    <p>
                      Net Weight :{" "}
                      {props.params !== ""
                        ? props.inward.fpresent
                        : props.inward.netWeight}
                    </p>
                    <p>Gross Weight : {props.inward.grossWeight}</p>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Card title="Invoice Details" style={{ width: 300 }}>
                    <p>
                      Received Date :{" "}
                      {moment(props.inward.dReceivedDate).format(
                        APPLICATION_DATE_FORMAT
                      )}
                    </p>
                    {props.inward.vehicleNumber && (
                      <p>Vehicle number : {props.inward.vehicleNumber}</p>
                    )}
                    {props.inward.valueOfGoods && (
                      <p>Value of goods : {props.inward.valueOfGoods}</p>
                    )}

                    {props.inward.invoiceDate && (
                      <p>
                        Invoice date :{" "}
                        {moment(props.inward.invoiceDate).format(
                          APPLICATION_DATE_FORMAT
                        )}
                      </p>
                    )}
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Quality Details" style={{ width: 300 }}>
                    {(props.inward.materialGrade || props.inward.grade) && (
                      <p>
                        Grade :{" "}
                        {props.params !== ""
                          ? props.inward.materialGrade.gradeName
                          : props.inward.grade}
                      </p>
                    )}
                    {props.inward.testCertificateNo && (
                      <p>
                        Test Certificate No : {props.inward.testCertificateNo}
                      </p>
                    )}
                    {props.inward.testFile && (
                      <p>
                        Test File : {props.inward.testFile.fileList[0].name}
                      </p>
                    )}
                    {props.inward.invoiceCopy && (
                      <p>
                        Invoice copy :{" "}
                        {props.inward.invoiceCopy.fileList[0].name}
                      </p>
                    )}
                    {props.inward.moreFiles && <p>More attachments :</p>}
                    <div>
                      {props.inward.moreFiles &&
                        props.inward.moreFiles.fileList.map((file) => (
                          <p>{file.name}</p>
                        ))}
                    </div>
                    {props.inward.ys && <p>YS (MPA) : {props.inward.ys}</p>}
                    {props.inward.ta && <p>TA (MPA) : {props.inward.ta}</p>}
                    {props.inward.el && <p>EL (%) : {props.inward.el}</p>}
                    {props.inward.remarks && (
                      <p>Remarks : {props.inward.remarks}</p>
                    )}
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col span={24} offset={4} style={{ textAlign: "center" }}>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => props.updateStep(3)}
              >
                <Icon type="left" />
                Back
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                disabled={props.inwardSubmitSuccess}
                onClick={(e) => {
                  e.preventDefault();
                  props.submitInwardEntry(props.inward);
                }}
              >
                Save <Icon type="right" />
              </Button>
              {/* <Button
                type="primary"
                onClick={(e) => {
                  e.preventDefault();
                  props.pdfGenerateInward(payload);
                  props.QrGenerateInward(payload);
                }}
              >
                Generate PDF & QR
              </Button> */}
            </Col>
          </>
        )}
      </>
    );
}

const mapStateToProps = state => ({
    inward: state.inward.inward,
    inwardSubmitLoading: state.inward.inwardSubmitLoading,
    inwardSubmitSuccess: state.inward.inwardSubmitSuccess,
    inwardSubmitError: state.inward.inwardSubmitError,
    inwardUpdateLoading: state.inward.inwardUpdateLoading,
    inwardUpdateSuccess: state.inward.inwardUpdateSuccess,
    inwardUpdateError: state.inward.inwardUpdateError,
    inwardObject: state.inward,
    party: state.party,
});

export default withRouter(
  connect(mapStateToProps, {
    submitInwardEntry,
    resetInwardForm,
    updateInward,
    pdfGenerateInward,
    QrGenerateInward,
    syncToZoho,
    getInwardsAgainstPo,
  })(InwardEntrySummary)
);
