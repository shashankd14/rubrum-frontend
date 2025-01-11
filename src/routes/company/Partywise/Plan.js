import { Button, Card, Col, Select, Modal, message } from "antd";
import moment from 'moment';
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getCoilPlanDetails, saveUnprocessedDelivery, fetchClassificationList,getReconcileReport } from "../../../appRedux/actions";
import IntlMessages from "../../../util/IntlMessages";
import CuttingModal from "../Partywise/CuttingModal";
import SlittingModal from "./SlittingModal";
import ReconcileTable from "./ReconcileTable";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";


const Plan = (props) => {
    
    const { instruction } = props.inward.plan;
    const [showCuttingModal, setShowCuttingModal] = useState(false);
    const [showSlittingModal, setShowSlittingModal] = useState(false);
    const [cuttingCoil, setCuttingCoil] = useState(false);
    const [slittingCoil, setSlittingCoil] = useState(false);
    const [childCoil, setChildCoil] = useState(false);
    const [slitCut, setSlitCut] = useState(false);
    const [defaultValue, setdefaultValue] = useState();
    const [showUnprocessedModal, setshowUnprocessedModal] = useState(false);
    const [unprocessedOkClick, setUnprocessedOkClick] = useState(false);
    const [reconcileModalShow, setReconcileModalShow] = useState([])
    const { Option } = Select;
    const { coilNumber } = useParams();
  const dispatch = useDispatch();
    const getPlannedLength = (ins) => {
        let length = 0;
        let actualLength = 0;
        let childLength = 0;
        actualLength = ins.fLength ? ins.fLength : ins.actualLength != null ? ins.actualLength : ins.plannedLength;
        if (ins.instruction && ins.instruction?.length> 0){
           let instruction = ins.instruction.flat();
           length = instruction.map(i => {
                return i.process.processId === 1 ?  i.plannedLength * i.plannedNoOfPieces :  i.plannedLength;
           });
           length = [...new Set(length)];
           childLength = instruction.map(i => {
               if (i.childInstructions && i.childInstructions?.length> 0){
                   return i.plannedLength;
               }})
            childLength = childLength.filter(i => i !== undefined)
            childLength = childLength?.length > 0? childLength.reduce((total, num) => total + num) : 0
           length = length?.length> 0 ?length.reduce((total, num) => total + num): 0
        } else {
        if (ins.childInstructions && ins.childInstructions?.length > 0) {
            length = ins.childInstructions.map(i => i.plannedLength);

            length = length.reduce((total, num) => total + num)
        }}
        if (actualLength > (childLength+length)){
            length = actualLength - (length + childLength);
        } else {
            length = 0
        };
        return length;
    }
    const getPlannedWidth = (ins) => {
        let width = 0;
        let actualWidth = 0;
        let childWidth = 0;
        actualWidth = ins.fWidth ? ins.fWidth : ins.actualWidth != null ? ins.actualWidth : ins.plannedWidth;
       
            if (ins.instruction && ins.instruction?.length> 0){
                let instruction = ins.instruction.flat();
                width = instruction.map(i => i.process.processId !== 1 ? i.plannedWidth : 0)
            childWidth = instruction.map(i => {
                    if (i.childInstructions && i.childInstructions?.length> 0){
                        return i.plannedWidth;
                    }})
                childWidth = childWidth.filter(i => i !== undefined)
                childWidth = childWidth?.length > 0?childWidth.reduce((total, num) => total + num): 0
                width = width.reduce((total, num) => total + num)
             } else {
             if (ins.childInstructions && ins.childInstructions?.length > 0) {
                 width = ins.childInstructions.map(i => i.plannedWidth);
                 width = width.reduce((total, num) => total + num)
             }
            }
        if (actualWidth >= (childWidth+width)){
            width = actualWidth - (width+childWidth);
        } else {
            width = 0
        }
        return width;
    }
    const getPlannedWeight = (ins) => {
        let weight = 0;
        let childWeight = 0;
        let actualWeight = 0;
        actualWeight = ins.fpresent ? ins.fpresent : ins.actualWeight != null ? ins.actualWeight : ins.plannedWeight;
        if (ins.instruction && ins.instruction?.length> 0){
            let instruction = ins.instruction.flat();
            weight = instruction.map(i => i.plannedWeight);
            childWeight = instruction.map(i => {
                if (i.childInstructions && i.childInstructions?.length> 0){
                    return i.plannedWeight;
                }})
            childWeight = childWeight.filter(i => i !== undefined)
            childWeight = childWeight?.length>0?childWeight.reduce((total, num) => total + num):0
            weight = weight?.length>0?weight.reduce((total, num) => total + num):0
         } else {
         if (ins.childInstructions && ins.childInstructions?.length > 0) {
             weight = ins.childInstructions.map(i => i.plannedWeight);
             weight = weight.reduce((total, num) => total + num)
         }
        }
        if (actualWeight > (childWeight+weight)){
            weight = actualWeight - (weight+childWeight);
        } else {
            weight = 0
        }
        
        return weight;
    }
    const getCoilData = () => {
        setTimeout(() => {
            props.getCoilPlanDetails(props.match.params.coilNumber);
        }, 1000)
    }

    useEffect(() => {
        getCoilData();
        if (props.wip || !props.wip) {
            props.fetchClassificationList();
        }
        
    }, [showSlittingModal,showCuttingModal])
    useEffect(() => {
        dispatch(getReconcileReport(coilNumber));
      }, []);
    useEffect(() => {
        if (unprocessedOkClick) {
            setUnprocessedOkClick(false);
            getCoilData();
        }
    }, [unprocessedOkClick])
    useEffect(()=>{
        if(props?.inward?.reconcileData?.length){
            setReconcileModalShow(props?.inward?.reconcileData)
        }
    },[props?.inward?.reconcileData])
    useEffect(() => {
        if (slittingCoil) {
            setSlittingCoil(slittingCoil);
            setShowSlittingModal(true);
        }
    }, [slittingCoil])

    useEffect(() => {
        if (cuttingCoil) {
            setCuttingCoil(cuttingCoil);
            setShowCuttingModal(true);
        }
    }, [cuttingCoil]);

    useEffect(() => {
        if (props.inward.plan?.instruction?.length !== slittingCoil?.instruction?.length && props.inward.isDeleted) {
            message.loading('Deleting part of slit instructions....', 1);
            setTimeout(() => {
                setSlittingCoil(props.inward.plan);
                message.success('Deleted successfully!!', 2);
            }, 1000);
        }
    }, [props.inward.plan])

    const getLength = (value, type) => {
        let tempDelValue = 0;
        let tempAvailValue = 0;
        value.map((item, index) => (
            (value.status && value.status.statusName && value.status.statusName === 'DELIVERED') ? tempDelValue += getPlannedLength(item) : tempAvailValue += getPlannedLength(item)
        ));
        if (type === 'Delivered') {
            return tempDelValue;
        } else {
            return tempAvailValue;
        }
    }

    const getWeight = (value, type) => {
        let tempDelValue = 0;
        let tempAvailValue = 0;
        value.map((item, index) => (
            (value.status && value.status.statusName && value.status.statusName) === 'DELIVERED' ? tempDelValue += getPlannedWeight(item) : tempAvailValue += getPlannedWeight(item)
        ));
        if (type === 'Delivered') {
            return tempDelValue;
        } else {
            return tempAvailValue;
        }

    }
    const handleSelectChange=(value, n, ins)=>{
        if(value === 'Slitting'){
            setSlitCut(false);
            setSlittingCoil(ins)
            setShowSlittingModal(true)
            
        }else if(value==='Cutting'){
            setSlitCut(false);
            setCuttingCoil(ins)
            setShowCuttingModal(true)
        }else if(value === 'Slit & Cut'){
            setSlitCut(true);
            setSlittingCoil(ins);
            setShowSlittingModal(true);
        }
    }
    const insList = ["Slitting","Cutting","Slit & Cut"];
    return (
        <div className="gx-full-height" style={{ overflowX: "auto", overflowy: "scroll" }}>
            {cuttingCoil && <CuttingModal showCuttingModal={showCuttingModal} setShowCuttingModal={setShowCuttingModal} coilDetails={cuttingCoil} wip={props.wip} childCoil={childCoil} plannedLength={getPlannedLength} plannedWidth ={getPlannedWidth} plannedWeight={getPlannedWeight} coil={props.inward.plan} slitCut={slitCut} />}
            {slittingCoil && <SlittingModal showSlittingModal={showSlittingModal} setShowSlittingModal={setShowSlittingModal} wip={props.wip} coilDetails={slittingCoil} childCoil={childCoil} plannedLength={getPlannedLength} plannedWidth ={getPlannedWidth} plannedWeight={getPlannedWeight} coil={props.inward.plan} slitCut={slitCut} setShowCuttingModal={setShowCuttingModal} setCutting={(cuts)=>setCuttingCoil(cuts)}/>}
            <Modal 
                title='Confirmation'
                visible={showUnprocessedModal}
                width={400}
                onOk={() => {
                    setTimeout(() => {
                        let payload={
                            inwardEntryId:props.inward.plan.inwardEntryId,
                            motherCoilDispatch:""
                        }
                        props.saveUnprocessedDelivery(payload);
                        setUnprocessedOkClick(true);
                        setshowUnprocessedModal(false);
                    }, 1000)
                }}
                onCancel={() => setshowUnprocessedModal(false)}
            >
                <p>Are you sure to proceed Unprocessed ? </p>
                <p>Please click OK to confirm</p>
            </Modal>
            <h1><IntlMessages id="partywise.plan.label" /></h1>
            {reconcileModalShow?.length>0 &&<><div>
                <ReconcileTable reconcileData={reconcileModalShow}/>
            </div></>}
            <div className="gx-full-height gx-flex-row">
                <Col lg={5} md={5} sm={24} xs={24} className="gx-align-self-center">
                    <Card className="gx-plan-main-coil" size="small">
                        <div className="gx-flex-row gx-justify-content-between">
                            <div className="gx-coil-image-bg gx-flex-row gx-align-items-center gx-justify-content-center"><img src={require("assets/images/inward/main_coil.svg")} alt="main coil image" title="main coil image" /></div>
                            <div>
                                <img src={require("assets/images/inward/info_icon.svg")} alt="main coil image" title="main coil image" />
                                <img src={require("assets/images/inward/burger_menu.svg")} alt="main coil image" title="main coil image" />
                            </div>
                        </div>
                        <h5 className="gx-coil-number">{props.inward.plan.coilNumber}</h5>
                        <div className="gx-flex-row">
                            <p className="gx-coil-details-label"><IntlMessages id="partywise.plan.availableLength" /> : </p>
                            <span className="gx-coil-details-label">{props.inward.plan.availableLength}</span>
                        </div>
                        <div className="gx-flex-row">
                            <p className="gx-coil-details-label"><IntlMessages id="partywise.plan.availableWeight" /> : </p>
                            <span className="gx-coil-details-label">{props.inward.plan.fpresent}</span>
                        </div>
                        {props.wip ?
                            <div>
                                {props.inward.plan.fpresent !== 0 ? <Button onClick={() => setshowUnprocessedModal(true)}>Unprocessed</Button> : <></>}
                                <Button onClick={() => {
                                    setSlittingCoil(props.inward.plan);
                                    setShowSlittingModal(true)
                                    setChildCoil(false)
                                }}>Finish Slitting</Button>
                                <Button onClick={() => {
                                    setCuttingCoil(props.inward.plan);
                                    setSlitCut(false);
                                    setShowCuttingModal(true);
                                    setChildCoil(false)
                                }}>Finish Cutting</Button>
                                <Button onClick={() => {
                                    setCuttingCoil(props.inward.plan);
                                    setSlitCut(true);
                                    setShowCuttingModal(true);
                                    setChildCoil(false)
                                }}>Finish Cut & Slit</Button>
                            </div> :
                            <div>
                                <Select
                                style={{ width: 100 }}
                                placeholder="Select Instruction"
                                optionFilterProp="children"
                                value= {defaultValue}
                                onChange={(value)=>handleSelectChange(value, setChildCoil(false), props.inward.plan)}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {insList?.length > 0 && insList.map((instruction) => (
                                <Option value={instruction}>{instruction}</Option>
                            ))}
                        </Select>
                    </div>}
                    </Card>
                </Col>
                <Col lg={18} md={18} sm={24} xs={24} offset={1} className="gx-align-self-center gx-branch lv1">
                    {instruction && instruction?.length > 0 && instruction.map((group) => (
                        <>
                            {group?.length > 0 && group.map((instruction)=> (instruction.groupId == null? <Card bordered={false} className={`gx-entry cardLevel2MainDiv`}>
                                {group.map((instruction) => (<>{instruction.groupId == null ?
                                    <div style={{ display: "flex" }}>
                                        <Col lg={10} md={10} sm={24} xs={24} offset={1} className={`gx-align-self-center cardLevel2Div ${instruction.parentGroupId == null ? group[0].process.processId === 1 ? 'gx-cutting-group' : (instruction.process.processId === 7 ? 'gx-unprocessed-group' : 'gx-slitting-group') : 'gx-slit-cut-group'}`}>
                                            <Card key={`${props.inward.plan.coilNumber}${instruction.instructionId}`} className={`cardLevel2InsideDiv ${instruction.parentGroupId == null ?instruction.process.processId === 1 ? 'gx-cutting-single' : (instruction.process.processId === 7 ? 'gx-unprocessed-single' : 'gx-slitting-single') : 'gx-slit-cut-single'}`} size="small">
                                                <img style={{ position: "absolute", right: "10.35px" }}  src={require("assets/images/inward/info_icon.svg")} alt="main coil image" title="main coil image" />
                                                <div className="gx-coil-image-bg gx-flex-row gx-align-items-center gx-justify-content-center">
                                                    {instruction.parentGroupId == null ? instruction.process.processId === 1 ?
                                                        <img src={require("assets/images/inward/cutting_icon.svg")} alt="main coil image" title="main coil image" /> :
                                                        <img src={require("assets/images/inward/slitting_icon.svg")} alt="main coil image" title="main coil image" />
                                                    :<img src={require("assets/images/inward/cutting_icon.svg")} alt="main coil image" title="main coil image" />}
                                                </div>
                                                <div style={{ marginLeft: "8px" }}>
                                                    {instruction.parentGroupId == null ? instruction.process.processId === 1 ? 'Cutting' : (instruction.process.processId === 7 ? 'Unprocessed' : 'Slitting') : 'Slit & Cut'}
                                                    <div className="gx-flex-row">
                                                        <p className="gx-coil-details-label">Available specs(TXWXL/W) :</p>
                                                        <span className="gx-coil-details-label">{props.inward.plan.fThickness}X{getPlannedWidth(instruction)}X{instruction?.deliveryDetails !== null &&instruction?.deliveryDetails?.deliveryId !==null? 0 :getPlannedLength(instruction)}/{instruction?.deliveryDetails !== null &&instruction?.deliveryDetails?.deliveryId !==null?0:getPlannedWeight(instruction)}</span>
                                                    </div>
                                                    {/* <div className="gx-flex-row">
                                                        <p className="gx-coil-details-label"><IntlMessages id="partywise.plan.availableWeight" /> : </p>
                                                        <span className="gx-coil-details-label">{instruction?.deliveryDetails !== null &&instruction?.deliveryDetails?.deliveryId !==null? 0:getPlannedWeight(instruction)}</span>
                                                    </div> */}
                                                    { props.wip ?
                                                         <div>
                                                             <Select
                                                                value= {defaultValue}
                                                                style={{ width: 100 }}
                                                                placeholder="Select Instruction"
                                                                optionFilterProp="children"
                                                                disabled={!(instruction && instruction.childInstructions && instruction?.childInstructions.length >= 1) }
                                                                onChange={(value)=>handleSelectChange(value, setChildCoil(true), instruction)}
                                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                             >
                                                                {insList?.length > 0 && insList.map((instruction) => (
                                                                    <Option value={instruction}>{instruction}</Option>
                                                                ))}
                                                             </Select>
                                                         </div> :
                                                            <div><Select
                                                            value= {defaultValue}
                                                            style={{ width: 100 }}
                                                            placeholder="Select Instruction"
                                                            optionFilterProp="children"
                                                            onChange={(value)=>handleSelectChange(value, setChildCoil(true), instruction)}
                                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    >
                                                        {insList?.length > 0 && insList.map((instruction) => (
                                                            <Option value={instruction}>{instruction}</Option>
                                                        ))}
                                                    </Select></div>}

                                                </div>
                                            </Card>
                                        </Col>
                                        {instruction.childInstructions?.length > 0 ?
                                            <Col lg={13} md={13} sm={24} xs={24} offset={1} className="gx-align-self-center gx-branch-lvl2">
                                                <>
                                                    <Col lg={24} md={24} sm={24} xs={24} offset={1} className={`gx-align-self-center cardLevel2Div ${instruction.childInstructions[0].process.processId === 1 ? 'gx-cutting-group' : (instruction.process.processId === 7 ? 'gx-unprocessed-group' : 'gx-slitting-group')}`}>
                                                        <Card key={`${props.inward.plan.coilNumber}${instruction.instructionId}`} className={`cardLevel2InsideDiv ${instruction.childInstructions[0].process.processId === 1 ? 'gx-cutting-single' : (instruction.process.processId === 7 ? 'gx-unprocessed-single' : 'gx-slitting-single')}`} size="small">
                                                            <img style={{ position: "absolute", right: "10.35px" }} src={require("assets/images/inward/info_icon.svg")} alt="main coil image" title="main coil image" />
                                                            <div className="gx-coil-image-bg gx-flex-row gx-align-items-center gx-justify-content-center">
                                                                {instruction.childInstructions[0].process.processId === 1 ?
                                                                    <img src={require("assets/images/inward/cutting_icon.svg")} alt="main coil image" title="main coil image" /> :
                                                                    <img src={require("assets/images/inward/slitting_icon.svg")} alt="main coil image" title="main coil image" />
                                                                }
                                                            </div>
                                                            <div style={{ marginLeft: "8px" }}>
                                                                {instruction.childInstructions[0].process.processId === 1 ? 'Cutting' : 'Slitting'}
                                                                <div className="gx-flex-row">
                                                                    <div className="gx-coil-details-label"><IntlMessages id="partywise.plan.availableLength" /> : </div>
                                                                    <span className="gx-coil-details-label">{instruction?.deliveryDetails !== null &&instruction?.deliveryDetails?.deliveryId !==null?0: getLength(instruction.childInstructions, 'Non-Delivered')}</span>
                                                                </div>
                                                                {/* <div className="gx-flex-row">
                                                                    <div className="gx-coil-details-label"><IntlMessages id="partywise.plan.deliveredLength" /> : </div>
                                                                    <span className="gx-coil-details-label">{getLength(instruction.childInstructions, 'Delivered')}</span>
                                                                </div> */}
                                                                <div className="gx-flex-row">
                                                                    <div className="gx-coil-details-label"><IntlMessages id="partywise.plan.availableWeight" /> : </div>
                                                                    <span className="gx-coil-details-label">{instruction?.deliveryDetails !== null &&instruction?.deliveryDetails?.deliveryId !==null? 0 :getWeight(instruction.childInstructions, 'Non-Delivered')}</span>
                                                                </div>
                                                                {/* <div className="gx-flex-row">
                                                                    <div className="gx-coil-details-label"><IntlMessages id="partywise.plan.deliveredWeight" /> : </div>
                                                                    <span className="gx-coil-details-label">{getWeight(instruction.childInstructions, 'Delivered')}</span>
                                                                </div> */}
                                                                {props.wip ?
                                                                     <></> :
                                                                        <div><Select
                                                                        value= {defaultValue}
                                                                        style={{ width: 100 }}
                                                                        placeholder="Select Instruction"
                                                                        optionFilterProp="children"
                                                                        onChange={(value)=>handleSelectChange(value, setChildCoil(true),instruction)}
                                                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                                >
                                                                    {insList?.length > 0 && insList.map((instruction) => (
                                                                        <Option value={instruction}>{instruction}</Option>
                                                                    ))}
                                                                </Select></div>}
                                                            </div>
                                                        </Card>
                                                    </Col>

                                                </>
                                            </Col> :
                                            instruction.deliveryDetails !== null && instruction.deliveryDetails.deliveryId !== null ?
                                                <Col lg={7} md={7} sm={24} xs={24} className="gx-align-self-center gx-branch-lvl2">
                                                    <>
                                                        <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center plan-dl-box">
                                                            <Card key={`${props.inward.plan.coilNumber}${instruction.instructionId}`} className="cardLevel2InsideDiv gx-delivery-single" size="small">
                                                                <img style={{ position: "absolute", right: "10.35px" }} src={require("assets/images/inward/info_icon.svg")} alt="Packaging" title="Packaging" />
                                                                <div style={{ marginLeft: "8px" }}> <span class="inline-packaging-lbl"><IntlMessages id="partywise.plan.packaging" /></span>
                                                                    <div>
                                                                        <p className="gx-coil-details-label"><IntlMessages id="partywise.plan.deliveryId" /> : <span className="gx-coil-details-label">{instruction.deliveryDetails?.deliveryId}</span></p>
                                                                        <p className="gx-coil-details-label"><IntlMessages id="partywise.plan.date" /> : <span className="gx-coil-details-label">{moment(instruction.updatedOn).format('DD/MM/YYYY')}</span></p>
                                                                        <p className="gx-coil-details-label"><IntlMessages id="partywise.plan.deliveredWeight" /> : <span className="gx-coil-details-label">{instruction?.actualWeight}</span></p>
                                                                        <p className="gx-coil-details-label"><IntlMessages id="partywise.plan.remarks" /> : <span className="gx-coil-details-label">{instruction.remarks}</span></p>
                                                                        <p className="gx-coil-details-label"><IntlMessages id="partywise.plan.wastage" /> : <span className="gx-coil-details-label">{instruction.wastage}</span></p>
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        </Col>

                                                    </>
                                                </Col> : null}
                                    </div>
                                :<></>}</>
                                ))}
                            </Card> : <></>))}
                        </>
                    ))}
                </Col>
            </div>
        </div>

    )
}


const mapStateToProps = state => ({
    inward: state.inward,
    party: state.party
});

export default connect(mapStateToProps, {
    getCoilPlanDetails,
    saveUnprocessedDelivery,
    fetchClassificationList
})(Plan);