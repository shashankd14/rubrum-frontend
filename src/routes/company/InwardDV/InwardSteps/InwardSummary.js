import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import moment from "moment";

import {submitInwardEntry, resetInwardForm,updateInward, pdfGenerateInward, QrGenerateInward} from "../../../../appRedux/actions";
import {Button, Card, Col, Icon, message, Row, Spin, Modal} from "antd";
import { withRouter } from 'react-router-dom';

import {APPLICATION_DATE_FORMAT} from '../../../../constants/index';

const InwardSummary = (props) => {
    const [generate, setGenerate]= useState(true);
    const [payload, setPayload]= useState({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    useEffect(() => {
        if(props.inwardUpdateSuccess) {
            message.success('Inward entry has been updated successfully', 2);
            setTimeout(() => {
                props.history.push('/company/inward/list');
            }, 2000);
            props.resetInwardForm();
        }
    }, [props.inwardUpdateSuccess]);
    useEffect(() => {
        if(props.inwardSubmitSuccess) {
            setGenerate(false)
            setPayload({
                payloadObj:{
                    inwardId: props.inwardObject.submitInward
                },
                type:'inward'
            });
        }
    }, [props.inwardSubmitSuccess]);
    useEffect(() => {
        if(props.inwardObject.pdfSuccess) {
           
            message.success('Inward Saved & PDF generated successfully', 2);
            setTimeout(() => {
                props.history.push('list');
            }, 2000);
            props.resetInwardForm();
        }
    }, [props.inwardObject.pdfSuccess]);

    const partyName =(partyList) =>{
        
       partyList = partyList.find(item => item.nPartyId===Number(props.inward.partyName))
       return partyList.partyName
    
    }
    let dimensionEdit = `${props.inward.fWidth} X ${props.inward.fThickness} X ${props.inward.fLength}`;
    let dimension = `${props.inward.width} X ${props.inward.thickness} X ${props.inward.length}`

    return (
        <>
            {props.inwardSubmitLoading ? <Spin className="gx-size-100 gx-flex-row gx-justify-content-center gx-align-items-center" size="large"/> :
            <>
                <Col span={10} className="gx-pt-4">
                    {/* <Row> */}
                        <Col span={12}>
                            <Card title="Inward Details" style={{ width: 500 }}>
                                {props.inwardDV.purposeType && <p>Purpose Type : {props.inwardDV.purposeType}</p>}
                                {props.inwardDV.vendorId && <p>Vendor Id : {props.inwardDV.vendorId}</p>}
                                {props.inwardDV.vendorName && <p>Vendor Name : {props.inwardDV.vendorName}</p>}
                                {props.inwardDV.vendorBatchNo && <p>Vendor Batch No : {props.inwardDV.vendorBatchNo}</p>}
                                
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Inward Document Details" style={{ width: 500 }}>
                                <p>Coil number : {props.inward.coilNumber}</p>
                                {(props.inward.material || props.inward.description) && <p>Material Description : {props.params !== ""? props.inward.material.description : props.inward.description}</p>}
                                <p>Dimensions : {props.params !== ""?dimensionEdit: dimension}</p>
                                <p>Net Weight : {props.params !== "" ? props.inward.fpresent: props.inward.netWeight}</p>
                                <p>Gross Weight : {props.inward.grossWeight}</p>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Extra Charges" style={{ width: 500 }}>
                                <p>Coil number : {props.inward.coilNumber}</p>
                                {(props.inward.material || props.inward.description) && <p>Material Description : {props.params !== ""? props.inward.material.description : props.inward.description}</p>}
                                <p>Dimensions : {props.params !== ""?dimensionEdit: dimension}</p>
                                <p>Net Weight : {props.params !== "" ? props.inward.fpresent: props.inward.netWeight}</p>
                                <p>Gross Weight : {props.inward.grossWeight}</p>
                            </Card>
                        </Col>
                        </Col>
                    {/* </Row>
                    <Row> */}
                    <Col span={14} className="gx-pt-4">
                        <Col span={12}>
                            <Card title="Material Details" style={{ width: 700 }}>
                                <p>Received Date : {moment(props.inward.dReceivedDate).format(APPLICATION_DATE_FORMAT)}</p>
                                {props.inward.batchNo && <p>Batch No : {props.inward.batchNo}</p>}
                                {props.inward.vehicleNumber && <p>Vehicle number : {props.inward.vehicleNumber}</p>}
                                {props.inward.invoiceNumber && <p>Invoice number : {props.inward.invoiceNumber}</p>}
                                {props.inward.invoiceDate && <p>Invoice date : {moment(props.inward.invoiceDate).format(APPLICATION_DATE_FORMAT)}</p>}
                            </Card>
                        </Col>
                </Col>
                <Col span={24} offset={4}  style={{ textAlign: "center"}}>
                    <Button style={{ marginLeft: 8 }} onClick={() => props.updateStep(5)}>
                        <Icon type="left"/>Back
                    </Button>
                    <Button type="primary" htmlType="submit" disabled={props.inwardSubmitSuccess} onClick={(e) => {
                        e.preventDefault();
                        props.params!== ""? props.updateInward(props.inward):props.submitInwardEntry(props.inward)
                    }}>
                        Submit <Icon type="right"/>
                    </Button>
                    {/* <Button type="primary" disabled={generate} onClick={(e) => {
                        e.preventDefault();
                        props.pdfGenerateInward(payload)
                        props.QrGenerateInward(payload);
                    }}>Generate PDF & QR</Button> */}
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
    inwardUpdateLoading: state.inward.inwardUpdateLoading,
    inwardUpdateSuccess: state.inward.inwardUpdateSuccess,
    inwardUpdateError: state.inward.inwardUpdateError,
    inwardObject: state.inward,
    party: state.party,
    inwardDV: state.inwardDV.inward,
});

export default withRouter(connect(mapStateToProps, {
    submitInwardEntry,
    resetInwardForm,
    updateInward,
    pdfGenerateInward,
    QrGenerateInward
})(InwardSummary));
