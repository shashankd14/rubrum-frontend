import React, {useEffect, useState} from "react";
import {connect} from "react-redux";

import {addInwardDV, resetInwardForm,updateInwardDV, setInwardDVDetails, fetchDVMaterialList} from "../../../../appRedux/actions";
import {Button, Card, Col, Icon, message, Row, Spin, Collapse, Input} from "antd";
import { withRouter } from 'react-router-dom';

const { Panel } = Collapse;

const InwardSummary = (props) => {
    const [payload, setPayload]= useState({});

    useEffect(() => {
        props.fetchDVMaterialList({
            searchText:"",
            pageNo: "1",
            pageSize: "15",
            ipAddress: "1.1.1.1",
            requestId: "MATERIAL_LIST_GET",
            userId: ""
        });
        setPayload(props.inwardDV);
    }, []);

    const [vendorName, setVendorName] = useState();
      useEffect(() => {
        if (props.inwardDV.vendorId !== undefined){
        const vendorId = props.inwardDV.vendorId;
        let vendorName = '';
            const response = props.vendor.content
            const selectedVendorName = response.find(vendor => vendor.vendorId === vendorId);
            if (selectedVendorName !== undefined){
                vendorName = selectedVendorName.vendorName;
                   }
        setVendorName(vendorName);
        }
       
      },[props.vendor])

    useEffect(() => {
        if(props.inwardUpdateSuccessDV) {
            message.success('Inward entry has been updated successfully');
            setTimeout(() => {
                props.history.push('/company/inwardDV/list');
            }, 2000);
            props.resetInwardForm();
        }
    }, [props.inwardUpdateSuccessDV]);

    useEffect(() => {
        if(props.inwardSubmitSuccessDV) {
            message.success('Inward entry has been submitted successfully');
            setTimeout(() => {
                props.history.push('/company/inwardDV/list');
            }, 2000);
            props.resetInwardForm();
        }
    }, [props.inwardSubmitSuccessDV]);

    const getItemDetails = (itemId) => {
        return props.material?.DVMaterialList?.content?.find(materialItem => materialItem.itemId === itemId);
      };
    
    return (
        <>
            {props.inwardSubmitLoadingDV ? <Spin className="gx-size-100 gx-flex-row gx-justify-content-center gx-align-items-center" size="large"/> :
            <>
                <Col span={10} className="gx-pt-4">
                        <Col span={12}>
                            <Card title="Inward Details" style={{ width: 500 }}>
                                {props.inwardDV?.purposeType && <p>Purpose Type : {props.inwardDV?.purposeType}</p>}
                                {props.inwardDV?.vendorId && <p>Vendor Id : {props.inwardDV?.vendorId}</p>}
                                {props.inwardDV?.vendorId && <p>Vendor Name : {props.inwardDV?.vendorName ? props.inwardDV?.vendorName : vendorName}</p>}
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
                               <p>Add Frieght Charges : {props.inwardDV?.frieghtCharges || props.inwardDV.freightCharges}</p>
                                <p>Add Insurance : {props.inwardDV?.addInsurance || props.inwardDV.insuranceAmount}</p>
                                <p>Add Loading & Unloading Charges : {props.inwardDV?.loadingAndUnloading || props.inwardDV.loadingCharges}</p>
                                {props.inwardDV?.weightmenCharges && <p>Add weightment Charges : {props.inwardDV?.weightmenCharges}</p>}
                                 <p>Add SGST : {props.inwardDV?.addSGST || props.inwardDV.sgst}</p>
                                <p>Add CGST : {props.inwardDV?.addCGST || props.inwardDV.cgst}</p>
                                <p>Add IGST : {props.inwardDV?.addIGST || props.inwardDV.igst}</p>
                                <p>TotalInwardValue : {props.inwardDV?.totalInwardValue || props.inwardDV.totalInwardVolume}</p>
                            </Card>
                        </Col>
                        </Col>
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
                    <Button type="primary" htmlType="submit" disabled={props.inwardSubmitSuccessDV} onClick={(e) => {
                        e.preventDefault();
                        //  props.params!== ""? props.updateInwardDV(props.inwardId):props.addInwardDV(props.inwardDV)
                        props.params === ""? props.addInwardDV(props.inwardDV) : props.updateInwardDV({inwardDV:payload, inwardId:props.params})
                    }}>
                        Submit <Icon type="right"/>
                    </Button>
                </Col>
            </>
            }
        </>
    )
}

const mapStateToProps = state => ({
    inwardDV: state.inwardDV.inward,
    material: state.materialDV,
    inwardSubmitSuccessDV: state.inwardDV.inwardSubmitSuccess,
    inwardUpdateSuccessDV: state.inwardDV.inwardUpdateSuccess,
    inwardSubmitLoadingDV: state.inwardDV.inwardSubmitLoadingDV,
    vendor: state.vendor.vendorList,
});

export default withRouter(connect(mapStateToProps, {
    addInwardDV,
    resetInwardForm,
    updateInwardDV,
    setInwardDVDetails,
    fetchDVMaterialList
})(InwardSummary));
