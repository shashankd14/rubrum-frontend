import React, {useEffect} from "react";
import {connect} from "react-redux";
import moment from "moment";

import {submitInwardEntry, resetInwardForm,updateInward} from "../../../../appRedux/actions";
import {Button, Card, Col, Icon, message, Row, Spin} from "antd";
import { withRouter } from 'react-router-dom';

import {APPLICATION_DATE_FORMAT} from '../../../../constants/index';

const InwardEntrySummary = (props) => {
    useEffect(() => {
        console.log(props.inward);
    }, [])

    React.useEffect(() => {
        if(props.inwardSubmitSuccess) {
            message.success('Inward entry has been saved successfully', 2);
            props.resetInwardForm();
            setTimeout(() => {
                props.history.push('list');
            }, 2000);
        }
    }, [props.inwardSubmitSuccess]);

    return (
        <>
            {props.inwardSubmitLoading ? <Spin className="gx-size-100 gx-flex-row gx-justify-content-center gx-align-items-center" size="large"/> :
            <>
                <Col span={24} className="gx-pt-4">
                    <Row>
                        <Col span={12}>
                            <Card title="Customer Details" style={{ width: 300 }}>
                                <p>Customer Name : {props.inward.party ? props.inward.party.nPartyName :props.inward.partyName}</p>
                                {props.inward.customerId && <p>Customer Id : {props.inward.customerId}</p>}
                                {props.inward.customerBatchNo && <p>Customer Batch No : {props.inward.customerBatchNo}</p>}
                                {props.inward.customerInvoiceNo && <p>Customer Invoice No : {props.inward.customerInvoiceNo}</p>}
                                {props.inward.purposeType && <p>Purpose Type : {props.inward.purposeType}</p>}
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Coil Details" style={{ width: 300 }}>
                                <p>Coil number : {props.inward.coilNumber}</p>
                                <p>Material Description : {props.params !== ""? props.inward.material.description : props.inward.description}</p>
                                <p>Dimensions : {props.inward.width} X {props.inward.thickness} X {props.inward.length}</p>
                                <p>Net Weight : {props.inward.netWeight}</p>
                                <p>Gross Weight : {props.inward.grossWeight}</p>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Card title="Invoice Details" style={{ width: 300 }}>
                                <p>Received Date : {moment(props.inward.receivedDate).format(APPLICATION_DATE_FORMAT)}</p>
                                {props.inward.batchNo && <p>Batch No : {props.inward.batchNo}</p>}
                                {props.inward.vehicleNumber && <p>Vehicle number : {props.inward.vehicleNumber}</p>}
                                {props.inward.invoiceNumber && <p>Invoice number : {props.inward.invoiceNumber}</p>}
                                {props.inward.invoiceDate && <p>Invoice date : {moment(props.inward.invoiceDate).format(APPLICATION_DATE_FORMAT)}</p>}
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Quality Details" style={{ width: 300 }}>
                                <p>Grade : {props.params !== ""? props.inward.materialGrade.gradeName:props.inward.grade}</p>
                                {props.inward.testCertificateNo && <p>Test Certificate No : {props.inward.testCertificateNo}</p>}
                                {props.inward.testFile && <p>Test File : {props.inward.testFile.fileList[0].name}</p>}
                                {props.inward.moreFiles && <p>More attachments :</p>}
                                <div>
                                {props.inward.moreFiles && props.inward.moreFiles.fileList.map((file) => <p>{file.name}</p>)}
                                </div>
                                {props.inward.remarks && <p>Remarks : {props.inward.remarks}</p>}
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col span={24} offset={4}  style={{ textAlign: "center"}}>
                    <Button style={{ marginLeft: 8 }} onClick={() => props.updateStep(3)}>
                        <Icon type="left"/>Back
                    </Button>
                    <Button type="primary" htmlType="submit" onClick={(e) => {
                        e.preventDefault();
                        props.params!== ""? props.updateInward(props.inward):props.submitInwardEntry(props.inward)
                    }}>
                        Submit<Icon type="right"/>
                    </Button>
                </Col>
            </>
            }
        </>
    )
}

const mapStateToProps = state => ({
    inward: state.inward.inward,
    inwardSubmitLoading: state.inward.inwardSubmitLoading,
    inwardSubmitSuccess: state.inward.inwardSubmitSuccess,
    inwardSubmitError: state.inward.inwardSubmitError,
});

export default withRouter(connect(mapStateToProps, {
    submitInwardEntry,
    resetInwardForm,
    updateInward
})(InwardEntrySummary));
