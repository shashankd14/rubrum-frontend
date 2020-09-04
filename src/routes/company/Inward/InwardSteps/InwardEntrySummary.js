import React from "react";
import {connect} from "react-redux";
import {submitInwardEntry} from "../../../../appRedux/actions";
import {Button, Card, Col, Icon, Row} from "antd";

const InwardEntrySummary = (props) => {
    return (
        <>
            <Col span={24} className="gx-pt-4">
                <Row>
                    <Col span={12}>
                        <Card title="Customer Details" style={{ width: 300 }}>
                            <p>Customer Name : {props.inward.partyName}</p>
                            {props.inward.customerId && <p>Customer Id : {props.inward.customerId}</p>}
                            {props.inward.customerBatchNo && <p>Customer Batch No : {props.inward.customerBatchNo}</p>}
                            {props.inward.customerInvoiceNo && <p>Customer Invoice No : {props.inward.customerInvoiceNo}</p>}
                            {props.inward.purposeType && <p>Purpose Type : {props.inward.purposeType}</p>}
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Coil Details" style={{ width: 300 }}>
                            <p>Coil number : {props.inward.coilNumber}</p>
                            <p>Material Description : {props.inward.material}</p>
                            <p>Dimensions : {props.inward.width} X {props.inward.thickness} X {props.inward.length}</p>
                            <p>Net Weight : {props.inward.netWeight}</p>
                            <p>Gross Weight : {props.inward.grossWeight}</p>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Card title="Invoice Details" style={{ width: 300 }}>
                            {/*<p>Received Date : {props.inward.receivedDate}</p>*/}
                            {props.inward.batchNo && <p>Batch No : {props.inward.batchNo}</p>}
                            {props.inward.vehicleNumber && <p>Vehicle number : {props.inward.vehicleNumber}</p>}
                            {props.inward.invoiceNumber && <p>Invoice number : {props.inward.invoiceNumber}</p>}
                            {/*{props.inward.invoiceDate && <p>Invoice date : {props.inward.invoiceDate}</p>}*/}
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Quality Details" style={{ width: 300 }}>
                            <p>Grade : {props.inward.partyName}</p>
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
                <Button type="primary" htmlType="submit" onClick={() => props.submitInwardEntry(props.inward)}>
                    Submit<Icon type="right"/>
                </Button>
            </Col>
        </>
    )
}

const mapStateToProps = state => ({
    inward: state.inward.inward,
});

export default connect(mapStateToProps, {
    submitInwardEntry
})(InwardEntrySummary);
