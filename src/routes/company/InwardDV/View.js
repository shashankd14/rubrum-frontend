import React, { useEffect, useState } from "react";
import {connect} from "react-redux";
import moment from "moment";
import {Button, Card, Col, Collapse, Icon, Input, message, Row, Spin} from "antd";
import { withRouter } from 'react-router-dom';
import {setInwardDVDetails, fetchInwardDVListId, fetchDVMaterialList} from "../../../appRedux/actions";
import {APPLICATION_DATE_FORMAT} from '../../../constants/index';
const { Panel } = Collapse;

const View = (props) => {
    const [filteredInwardList, setFilteredInwardList] = useState(props.inward.inwardList);
    useEffect(() => {
        setTimeout(() => {
            props.fetchInwardDVListId({
                searchText:"",
                pageNo: 1,
                pageSize:"15",
                ipAddress: "1.1.1.1",
                requestId: "INWARD_LIST_GET",
                userId: ""
            });
        }, 1000);
    }, []);
    useEffect(()=>{
        debugger
        // if(props.inwardDV?.content){
        //     let inwardEntry = props.inwardDV?.content?.filter(item => item.inwardId === props.match.params.inwardId )
        //     const inwardEntry1 = inwardEntry[0];
        //     props.setInwardDVDetails({...props.inwardDV,...inwardEntry1})
        //     setFilteredInwardList(inwardEntry)
        // }
        if (props.inwardDV?.content) {
            let inwardEntry = props.inwardDV.content.filter(item => {
                console.log("Item inwardId:", item.inwardId);
                console.log("props.match.params.inwardId:", props.match.params.inwardId);
                return String(item.inwardId) === String(props.match.params.inwardId);
            });
            const inwardEntry1 = inwardEntry[0];
                 props.setInwardDVDetails({...props.inwardDV,...inwardEntry1})
                setFilteredInwardList(inwardEntry)
        }
    },[])

    useEffect(() => {
        debugger
        props.fetchDVMaterialList({
            searchText:"",
            pageNo: "1",
            pageSize: "15",
            ipAddress: "1.1.1.1",
            requestId: "MATERIAL_LIST_GET",
            userId: ""
        });
    }, []);
console.log("1111111111", filteredInwardList)
console.log("filteredInwardList[0].totalWeight", filteredInwardList[0]?.totalWeight);
    const getItemDetails = (itemId) => {
        return props.material?.DVMaterialList?.content?.find(materialItem => materialItem.itemId === itemId);
      };

    return (
        
        <>
            {props.inwardSubmitLoading ? <Spin className="gx-size-100 gx-flex-row gx-justify-content-center gx-align-items-center" size="large"/> :
             <> 
            <h1>Inward Summary</h1>
                 {filteredInwardList ? <> 
                <Col span={4} style={{ textAlign: "center"}}>
                        <Button onClick={() => props.history.push('list')}>
                        <Icon type="left"/>Back
                    </Button>
                </Col>
             <Col span={10} className="gx-pt-4">
                        <Col span={12}>
                            <Card title="Inward Details" style={{ width: 500 }}>
                                {filteredInwardList[0]?.purposeType && <p>Purpose Type : {filteredInwardList[0]?.purposeType}</p>}
                                {filteredInwardList[0]?.vendorName && <p>Vendor Id : {filteredInwardList[0]?.vendorName}</p>}
                                {filteredInwardList[0]?.vendorId && <p>Vendor Name : {filteredInwardList[0]?.vendorId}</p>}
                                {filteredInwardList[0]?.vendorBatchNo && <p>Vendor Batch No : {filteredInwardList[0]?.vendorBatchNo}</p>}
                                
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Inward Document Details" style={{ width: 500 }}>
                                {filteredInwardList[0]?.consignmentId && <p>consignment Id : {filteredInwardList[0]?.consignmentId}</p>}
                                {filteredInwardList[0]?.vehicleNo && <p>Vehicle No : {filteredInwardList[0]?.vehicleNo}</p>}
                                {filteredInwardList[0]?.locationId && <p>Location Id : {filteredInwardList[0]?.locationId}</p>}
                                {filteredInwardList[0]?.documentNo && <p>Document No : {filteredInwardList[0]?.documentNo}</p>}
                                {filteredInwardList[0]?.documentType && <p>Document Type : {filteredInwardList[0]?.documentType}</p>}
                                {/* {filteredInwardList[0]?.documentDate && <p>Document Date : {filteredInwardList[0]?.documentDate}</p>} */}
                                {filteredInwardList[0]?.ewayBillNo && <p>Eway Bill No : {filteredInwardList[0]?.ewayBillNo}</p>}
                                {/* {filteredInwardList[0]?.ewayBillDate && <p>Eway Bill Date : {filteredInwardList[0]?.ewayBillDate}</p>} */}
                                {filteredInwardList[0]?.valueOfGoods && <p>Eway Bill value of goods : {filteredInwardList[0]?.valueOfGoods}</p>}
                                
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Extra Charges" style={{ width: 500 }}>
                                {filteredInwardList[0]?.frieghtCharges && <p>Add Frieght Charges : {filteredInwardList[0]?.frieghtCharges}</p>}
                                {filteredInwardList[0]?.addInsurance && <p>Add Insurance : {filteredInwardList[0]?.insuranceAmount}</p>}
                                {filteredInwardList[0]?.loadingAndUnloading && <p>Add Loading & Unloading Charges : {filteredInwardList[0]?.loadingCharges}</p>}
                                {filteredInwardList[0]?.weightmenCharges && <p>Add weightment Charges : {filteredInwardList[0]?.weightmenCharges}</p>}
                                {filteredInwardList[0]?.addSGST && <p>Add SGST : {filteredInwardList[0]?.sgst}</p>}
                                {filteredInwardList[0]?.addCGST && <p>Add CGST : {filteredInwardList[0]?.cgst}</p>}
                                {filteredInwardList[0]?.addIGST && <p>Add IGST : {filteredInwardList[0]?.igst}</p>}
                                {filteredInwardList[0]?.totalInwardValue && <p>TotalInwardValue : {filteredInwardList[0]?.totalInwardVolume}</p>}
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
                            {filteredInwardList[0]?.itemsList?.map((item, index) => {
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
                                <Input value={filteredInwardList[0]?.totalWeight} style={{ backgroundColor: 'blue', color: 'white' }} />
                                </Col>
                                <Col span={4}></Col>
                                <Col span={4}>
                                <Input value={filteredInwardList[0]?.totalVolume} style={{ backgroundColor: 'blue', color: 'white' }} />
                                </Col>
                            </Row>
                            </div>
                            </Card>
                        </Col>
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
    inwardSubmitLoading: state.inward.inwardSubmitLoading,
    inwardDV: state.inwardDV.inwardDVList,
    material: state.materialDV,
});
export default connect(mapStateToProps, {
    fetchInwardDVListId,
    setInwardDVDetails,
    fetchDVMaterialList
})(View);
