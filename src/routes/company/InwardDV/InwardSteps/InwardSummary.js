import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import moment from "moment";

import {addInwardDV, resetInwardForm,updateInward, pdfGenerateInward, QrGenerateInward, setInwardDVDetails, fetchDVMaterialList} from "../../../../appRedux/actions";
import {Button, Card, Col, Icon, message, Row, Spin, Modal, Collapse, Input} from "antd";
import { withRouter } from 'react-router-dom';

import {APPLICATION_DATE_FORMAT} from '../../../../constants/index';

const { Panel } = Collapse;

const InwardSummary = (props) => {
    const [generate, setGenerate]= useState(true);
    const [payload, setPayload]= useState({});
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        props.fetchDVMaterialList({
            searchText:"",
            pageNo: "1",
            pageSize: "15",
            ipAddress: "1.1.1.1",
            requestId: "MATERIAL_LIST_GET",
            userId: ""
        });
    }, []);

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

    const getItemDetails = (itemId) => {
        return props.material?.DVMaterialList?.content?.find(materialItem => materialItem.itemId === itemId);
      };

    return (
        <>
            {props.inwardSubmitLoading ? <Spin className="gx-size-100 gx-flex-row gx-justify-content-center gx-align-items-center" size="large"/> :
            <>
                <Col span={10} className="gx-pt-4">
                    {/* <Row> */}
                        <Col span={12}>
                            <Card title="Inward Details" style={{ width: 500 }}>
                                {props.inwardDV?.purposeType && <p>Purpose Type : {props.inwardDV?.purposeType}</p>}
                                {props.inwardDV?.vendorName && <p>Vendor Id : {props.inwardDV?.vendorName}</p>}
                                {props.inwardDV?.vendorId && <p>Vendor Name : {props.inwardDV?.vendorId}</p>}
                                {props.inwardDV?.vendorBatchNo && <p>Vendor Batch No : {props.inwardDV?.vendorBatchNo}</p>}
                                
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Inward Document Details" style={{ width: 500 }}>
                                {props.inwardDV?.consignmentId && <p>consignment Id : {props.inwardDV?.consignmentId}</p>}
                                {props.inwardDV?.vehicleNo && <p>Vehicle No : {props.inwardDV?.vehicleNo}</p>}
                                {props.inwardDV?.locationId && <p>Location Id : {props.inwardDV?.locationId}</p>}
                                {props.inwardDV?.documentNo && <p>Document No : {props.inwardDV?.documentNo}</p>}
                                {props.inwardDV?.documentType && <p>Document Type : {props.inwardDV?.documentType}</p>}
                                {/* {props.inwardDV?.documentDate && <p>Document Date : {props.inwardDV?.documentDate}</p>} */}
                                {props.inwardDV?.ewayBillNo && <p>Eway Bill No : {props.inwardDV?.ewayBillNo}</p>}
                                {/* {props.inwardDV?.ewayBillDate && <p>Eway Bill Date : {props.inwardDV?.ewayBillDate}</p>} */}
                                {props.inwardDV?.valueOfGoods && <p>Eway Bill value of goods : {props.inwardDV?.valueOfGoods}</p>}
                                
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Extra Charges" style={{ width: 500 }}>
                                {props.inwardDV?.frieghtCharges && <p>Add Frieght Charges : {props.inwardDV?.frieghtCharges}</p>}
                                {props.inwardDV?.addInsurance && <p>Add Insurance : {props.inwardDV?.addInsurance}</p>}
                                {props.inwardDV?.loadingAndUnloading && <p>Add Loading & Unloading Charges : {props.inwardDV?.loadingAndUnloading}</p>}
                                {props.inwardDV?.weightmenCharges && <p>Add weightment Charges : {props.inwardDV?.weightmenCharges}</p>}
                                {props.inwardDV?.addSGST && <p>Add SGST : {props.inwardDV?.addSGST}</p>}
                                {props.inwardDV?.addCGST && <p>Add CGST : {props.inwardDV?.addCGST}</p>}
                                {props.inwardDV?.addIGST && <p>Add IGST : {props.inwardDV?.addIGST}</p>}
                                {props.inwardDV?.totalInwardValue && <p>TotalInwardValue : {props.inwardDV?.totalInwardValue}</p>}
                            </Card>
                        </Col>
                        </Col>
                    {/* </Row>
                    <Row> */}
                    <Col span={14} className="gx-pt-4">
                        <Col span={12}>
                            <Card title="Material Details" style={{ width: 700 }}>
                         <Row gutter={20}>
                            <Col span={12} ></Col>
                            <Col span={4} style={{textAlign: 'center'}}>Net Weight</Col>
                            <Col span={4} style={{textAlign: 'center'}}>Rate</Col>
                            <Col span={4} style={{textAlign: 'center'}}>Value</Col>
                        </Row>
                            {props.inwardDV?.itemsList?.map((item, index) => {
                        const itemDetails = getItemDetails(item.itemId);
                        return (
                        <Row gutter={20} key={index}>
                            <Col span={12}>
                            <Collapse>
                                {itemDetails && (
                                <Panel header={`${itemDetails.itemName}: ${itemDetails.categoryEntity?.categoryName || '-'} | ${itemDetails.subCategoryEntity?.subcategoryName || '-'}`} key={index}>
                                    <p>Item HSN code: {itemDetails.itemHsnCode}</p>
                                    <p>Item code: {itemDetails.itemCode}</p>
                                    <p>Item grade: {itemDetails.itemGrade}</p>
                                    <p>Item ID: {itemDetails.itemId}</p>
                                    <p>Main category: {itemDetails.categoryEntity?.categoryName || '-'}</p>
                                    <p>Sub category: {itemDetails.subCategoryEntity?.subcategoryName || '-'}</p>
                                    <p>Main category HSN code: {itemDetails.categoryEntity?.categoryHsnCode || '-'}</p>
                                    <p>Display name: {itemDetails.categoryEntity?.displayName || '-'}</p>
                                    <p>Brand name: {itemDetails.categoryEntity?.brandName || '-'}</p>
                                    <p>Manufacturers name: {itemDetails.categoryEntity?.manufacturerName || '-'}</p>
                                    <p>Per Meter: {itemDetails.perMeter}</p>
                                    <p>Per Feet: {itemDetails.perFeet}</p>
                                    <p>Per Pc: {itemDetails.perPC}</p>
                                    <p>Additional Parameters:</p>
                                    <ul>
                                    {itemDetails.additionalParams && JSON.parse(itemDetails.additionalParams).map((param, paramIndex) => (
                                        <li key={paramIndex}>
                                        {param.parameterName}: {param.units} {param.unitType}
                                        </li>
                                    ))}
                                    </ul>
                                    {itemDetails.itemImage && <img src={itemDetails.itemImage} alt="Item Image" />}
                                    {itemDetails.crossSectionalImage && <img src={itemDetails.crossSectionalImage} alt="Cross-sectional Image" />}
                                </Panel>
                                )}
                            </Collapse>
                               
                            </Col>
                            <Col span={4}>
                                <Input value={item.netWeight} readOnly />
                            </Col>
                            <Col span={4}>
                                <Input value={item.rate} readOnly />
                            </Col>
                            <Col span={4}>
                                <Input value={item.volume} disabled /> {/* Calculate value */}
                            </Col>
                            </Row>
                        );
                    })}
                    <div className="gx-mt-4" style={{ backgroundColor: 'rgba(135, 206, 235, 0.2)', padding: '5px' }} >
                            <Row gutter={14} >
                                <Col span={12} className="gx-mt-2" style={{textAlign: 'right'}}>
                                <h3>Total</h3> 
                                </Col>
                                <Col span={4}>
                                <Input value={props.inwardDV.totalWeight} style={{ backgroundColor: 'blue', color: 'white' }} />
                                </Col>
                                <Col span={4}></Col>
                                <Col span={4}>
                                <Input value={props.inwardDV.totalVolume} style={{ backgroundColor: 'blue', color: 'white' }} />
                                </Col>
                            </Row>
                            </div>
                            </Card>
                        </Col>
                </Col>
                <Col span={24} offset={4}  style={{ textAlign: "center"}}>
                    <Button style={{ marginLeft: 8 }} onClick={() => props.updateStep(5)}>
                        <Icon type="left"/>Back
                    </Button>
                    <Button type="primary" htmlType="submit" disabled={props.inwardSubmitSuccess} onClick={(e) => {
                        e.preventDefault();
                        // props.params!== ""? props.updateInward(props.inward):props.addInwardDV(props.inwardDV)
                        props.addInwardDV(props.inwardDV)
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
    material: state.materialDV,
});

export default withRouter(connect(mapStateToProps, {
    addInwardDV,
    resetInwardForm,
    updateInward,
    pdfGenerateInward,
    QrGenerateInward,
    setInwardDVDetails,
    fetchDVMaterialList
})(InwardSummary));
