import React, { useEffect, useState } from "react";
import {connect} from "react-redux";
import moment from "moment";
import {Button, Card, Col, Icon, message, Row, Spin} from "antd";
import { withRouter } from 'react-router-dom';
import {setInwardDetails, fetchInwardList} from "../../../appRedux/actions";
import {APPLICATION_DATE_FORMAT} from '../../../constants/index';

const View = (props) => {
    const [filteredInwardList, setFilteredInwardList] = useState(props.inward.inwardList);
    useEffect(() => {
        props.fetchInwardList();
    }, []);
    useEffect(()=>{
        if(props.inward.inwardList){
            let inwardEntry = props.inward.inwardList.filter(item => item.coilNumber === props.match.params.coilNumber )
            const inwardEntry1 = inwardEntry[0];
            props.setInwardDetails({...props.inward.inward,...inwardEntry1})
            setFilteredInwardList(inwardEntry)
        }
    },[])
    return (
        
        <>
            {props.inwardSubmitLoading ? <Spin className="gx-size-100 gx-flex-row gx-justify-content-center gx-align-items-center" size="large"/> :
            <>
            <h1>Inward Summary for {props.match.params.coilNumber? props.match.params.coilNumber:''}</h1>
                {filteredInwardList ? <>
                <Col span={4} style={{ textAlign: "center"}}>
                        <Button onClick={() => props.history.push('list')}>
                        <Icon type="left"/>Back
                    </Button>
                </Col>
                
                <Col span={24} className="gx-pt-4">
                    <Row>
                        <Col span={12}>
                            <Card title="Customer Details" style={{ width: 300 }}>
                                {props.inward.inward.party && <p>Customer Name : {props.inward.inward.party.partyName}</p>}
                                {props.inward.inward.customerId && <p>Customer Id : {props.inward.inward.customerId}</p>}
                                {props.inward.inward.customerBatchNo && <p>Customer Batch No : {props.inward.inward.customerBatchNo}</p>}
                                {props.inward.inward.customerInvoiceNo && <p>Customer Invoice No : {props.inward.inward.customerInvoiceNo}</p>}
                                {props.inward.inward.purposeType && <p>Purpose Type : {props.inward.inward.purposeType}</p>}
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Coil Details" style={{ width: 300 }}>
                                {props.inward.inward.coilNumber && <p>Coil number : {props.inward.inward.coilNumber}</p>}
                                {props.inward.inward.material && <p>Material Description : {props.inward.inward.material.description}</p>}
                                {props.inward.inward && <p>Dimensions : {props.inward.inward.fWidth}X{props.inward.inward.fThickness}X{props.inward.inward.fLength}mm</p>}
                                {props.inward.inward.netWeight && <p>Net Weight : {props.inward.inward.netWeight}kg </p>}
                                {props.inward.inward.grossWeight && <p>Gross Weight : {props.inward.inward.grossWeight}kg</p>}
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Card title="Invoice Details" style={{ width: 300 }}>
                                <p>Received Date : {moment(props.inward.inward.dReceivedDate).format(APPLICATION_DATE_FORMAT)}</p>
                                {props.inward.inward.batchNo && <p>Batch No : {props.inward.inward.batchNo}</p>}
                                {props.inward.inward.vehicleNumber && <p>Vehicle number : {props.inward.inward.vehicleNumber}</p>}
                                {props.inward.inward.invoiceNumber && <p>Invoice number : {props.inward.inward.invoiceNumber}</p>}
                                {props.inward.inward.invoiceDate && <p>Invoice date : {moment(props.inward.inward.dInvoiceDate).format(APPLICATION_DATE_FORMAT)}</p>}
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Quality Details" style={{ width: 300 }}>
                                {props.inward.inward.materialGrade && <p>Grade : {props.inward.inward.materialGrade.gradeName}</p>}
                                {props.inward.inward.testCertificateNo && <p>Test Certificate No : {props.inward.inward.testCertificateNo}</p>}
                                {props.inward.inward.testFile && <p>Test File : {props.inward.inward.testFile.fileList[0].name}</p>}
                                {props.inward.inward.moreFiles && <p>More attachments :</p>}
                                <div>
                                {props.inward.inward.moreFiles && props.inward.inward.moreFiles.fileList.map((file) => <p>{file.name}</p>)}
                                </div>
                                {props.inward.inward.remarks !== 'undefined' && <p>Remarks : {props.inward.inward.remarks}</p>}
                            </Card>
                        </Col>
                    </Row>
                </Col>
               </>
                :<></>}
            </>
            }
        </>
    
    )
}
const mapStateToProps = state => ({
    inward: state.inward,
    inwardSubmitLoading: state.inward.inwardSubmitLoading
});
export default connect(mapStateToProps, {
    fetchInwardList,
    setInwardDetails
})(View);



