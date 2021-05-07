import { Button, Card, Col } from "antd";
import moment from 'moment';
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getCoilPlanDetails, saveUnprocessedDelivery } from "../../../appRedux/actions";
import IntlMessages from "../../../util/IntlMessages";
import CuttingModal from "../Partywise/CuttingModal";
import SlittingModal from "./SlittingModal";


const Plan = (props) => {
    const { instruction } = props.inward.plan;
    const [showCuttingModal, setShowCuttingModal] = useState(false);
    const [showSlittingModal, setShowSlittingModal] = useState(false);
    const [cuttingCoil, setCuttingCoil] = useState(false);
    const [slittingCoil, setSlittingCoil] = useState(false);
    const [childCoil, setChildCoil] = useState(false);
    // function removeDuplicates(originalArray, prop) {
    //     var newArray = [];
    //     var lookupObject  = {};
   
    //     for(var i in originalArray) {
    //        lookupObject[originalArray[i][prop]] = originalArray[i];
    //     }
   
    //     for(i in lookupObject) {
    //         newArray.push(lookupObject[i]);
    //     }
    //      return newArray;
    // }
    const getPlannedLength = (ins) => {
        let length = 0;
        let actualLength = 0;
        let childLength = 0;
        actualLength = ins.fLength ? ins.fLength : ins.actualLength != null ? ins.actualLength : ins.plannedLength;
        
        if (ins.instruction && ins.instruction.length> 0){
           let instruction = ins.instruction.flat();
           length = instruction.filter(i => i.plannedLength);
           childLength = instruction.map(i => {
               if (i.childInstructions && i.childInstructions.length> 0){
                   return i.plannedLength;
               }})
            childLength = childLength.filter(i => i !== undefined)
            childLength = childLength.length > 0? childLength.reduce((total, num) => total + num) : 0
           length = length.length> 0 ?length.reduce((total, num) => total + num): 0
        } else {
        if (ins.childInstructions && ins.childInstructions.length > 0) {
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
        if (ins.instruction && ins.instruction.length> 0){
            let instruction = ins.instruction.flat();
            width = instruction.map(i => i.plannedWidth);
            childWidth = instruction.map(i => {
                if (i.childInstructions && i.childInstructions.length> 0){
                    return i.plannedWidth;
                }})
            childWidth = childWidth.filter(i => i !== undefined)
            childWidth = childWidth.length > 0?childWidth.reduce((total, num) => total + num): 0
            width = width.reduce((total, num) => total + num)
         } else {
         if (ins.childInstructions && ins.childInstructions.length > 0) {
             width = ins.childInstructions.map(i => i.plannedWidth);
             width = width.reduce((total, num) => total + num)
         }
        }
        if (actualWidth > (childWidth+width)){
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
        if (ins.instruction && ins.instruction.length> 0){
            let instruction = ins.instruction.flat();
            weight = instruction.map(i => i.plannedWeight);
            childWeight = instruction.map(i => {
                if (i.childInstructions && i.childInstructions.length> 0){
                    return i.plannedWeight;
                }})
            childWeight = childWeight.filter(i => i !== undefined)
            childWeight = childWeight.length>0?childWeight.reduce((total, num) => total + num):0
            weight = weight.length>0?weight.reduce((total, num) => total + num):0
         } else {
         if (ins.childInstructions && ins.childInstructions.length > 0) {
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
    useEffect(() => {
        props.getCoilPlanDetails(props.match.params.coilNumber);
    }, [showSlittingModal,showCuttingModal])

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

    return (
        <>
        {((!showCuttingModal) || (!showSlittingModal)) &&<div className="gx-full-height" style={{ overflowX: "auto", overflowy: "scroll" }}>
            {cuttingCoil && <CuttingModal showCuttingModal={showCuttingModal} setShowCuttingModal={setShowCuttingModal} coilDetails={cuttingCoil} wip={props.wip} childCoil={childCoil} plannedLength={getPlannedLength} plannedWidth ={getPlannedWidth} plannedWeight={getPlannedWeight} coil={props.inward.plan}/>}
            {slittingCoil && <SlittingModal showSlittingModal={showSlittingModal} setShowSlittingModal={setShowSlittingModal} wip={props.wip} coilDetails={slittingCoil} childCoil={childCoil} plannedLength={getPlannedLength} plannedWidth ={getPlannedWidth} plannedWeight={getPlannedWeight} coil={props.inward.plan}/>}
            <h1><IntlMessages id="partywise.plan.label" /></h1>
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
                            <span className="gx-coil-details-label">{props.inward.plan.fLength}</span>
                        </div>
                        <div className="gx-flex-row">
                            <p className="gx-coil-details-label"><IntlMessages id="partywise.plan.availableWeight" /> : </p>
                            <span className="gx-coil-details-label">{props.inward.plan.fpresent}</span>
                        </div>
                        {props.wip ?
                            <div>{props.inward.plan.fpresent !== 0 ? <Button onClick={() => {
                                props.saveUnprocessedDelivery(props.inward.plan.inwardEntryId)
                            }}>Unprocessed</Button> : <></>}</div> :
                            <div>
                                <Button onClick={() => {
                                    setCuttingCoil(props.inward.plan);
                                    setShowCuttingModal(true);
                                    setChildCoil(false)
                                }}>Cutting</Button>
                                <Button onClick={() => {
                                    setSlittingCoil(props.inward.plan);
                                    setShowSlittingModal(true)
                                    setChildCoil(false)
                                }}>Slitting</Button>
                            </div>}
                    </Card>
                </Col>
                <Col lg={18} md={18} sm={24} xs={24} offset={1} className="gx-align-self-center gx-branch lv1">
                    {instruction && instruction.length > 0 && instruction.map((group) => (
                        <>
                            {group.length > 0 ? <Card bordered={false} className={`gx-entry cardLevel2MainDiv`}>
                                {group.map((instruction) => (
                                    <div style={{ display: "flex" }}>
                                        <Col lg={10} md={10} sm={24} xs={24} offset={1} className={`gx-align-self-center cardLevel2Div ${group[0].process.processName == 'Cutting' ? 'gx-cutting-group' : 'gx-slitting-group'}`}>
                                            <Card key={`${props.inward.plan.coilNumber}${instruction.instructionId}`} className={`cardLevel2InsideDiv ${instruction.process.processName == 'Cutting' ? 'gx-cutting-single' : 'gx-slitting-single'}`} size="small">
                                                <img style={{ position: "absolute", right: "10.35px" }} src={require("assets/images/inward/info_icon.svg")} alt="main coil image" title="main coil image" />
                                                <div className="gx-coil-image-bg gx-flex-row gx-align-items-center gx-justify-content-center">
                                                    {instruction.process.processName == 'Cutting' ?
                                                        <img src={require("assets/images/inward/cutting_icon.svg")} alt="main coil image" title="main coil image" /> :
                                                        <img src={require("assets/images/inward/slitting_icon.svg")} alt="main coil image" title="main coil image" />
                                                    }
                                                </div>
                                                <div style={{ marginLeft: "8px" }}>
                                                    {instruction.process.processName == 'Cutting' ? 'Cutting' : 'Slitting'}
                                                    <div className="gx-flex-row">
                                                        <p className="gx-coil-details-label"><IntlMessages id="partywise.plan.availableLength" /> : </p>
                                                        <span className="gx-coil-details-label">{getPlannedLength(instruction)}</span>
                                                    </div>
                                                    <div className="gx-flex-row">
                                                        <p className="gx-coil-details-label"><IntlMessages id="partywise.plan.availableWeight" /> : </p>
                                                        <span className="gx-coil-details-label">{getPlannedWeight(instruction)}</span>
                                                    </div>
                                                    {instruction.process.processName == 'Cutting' && props.wip ?
                                                        <Button onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCuttingCoil(instruction);
                                                            setShowCuttingModal(true);
                                                            setChildCoil(true);
                                                        }}>Finish Cutting
                                                            </Button> : props.wip ? <Button onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSlittingCoil(instruction);
                                                            setShowSlittingModal(true);
                                                            setChildCoil(true);
                                                        }}>Finish Slitting
                                                        </Button> :
                                                            <div><Button onClick={(e) => {
                                                                e.stopPropagation();
                                                                setCuttingCoil(instruction);
                                                                setShowCuttingModal(true);
                                                                setChildCoil(true);
                                                            }}>Cutting
                                                        </Button>
                                                                <Button onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSlittingCoil(instruction);
                                                                    setShowSlittingModal(true);
                                                                    setChildCoil(true);
                                                                }}>Slitting
                                                        </Button></div>}

                                                </div>
                                            </Card>
                                        </Col>
                                        {instruction.childInstructions.length > 0 ?
                                            <Col lg={13} md={13} sm={24} xs={24} offset={1} className="gx-align-self-center gx-branch-lvl2">
                                                <>
                                                    <Col lg={24} md={24} sm={24} xs={24} offset={1} className={`gx-align-self-center cardLevel2Div ${group[0].process.processName == 'Cutting' ? 'gx-cutting-group' : 'gx-slitting-group'}`}>
                                                        <Card key={`${props.inward.plan.coilNumber}${instruction.instructionId}`} className={`cardLevel2InsideDiv ${instruction.process.processName == 'Cutting' ? 'gx-cutting-single' : 'gx-slitting-single'}`} size="small">
                                                            <img style={{ position: "absolute", right: "10.35px" }} src={require("assets/images/inward/info_icon.svg")} alt="main coil image" title="main coil image" />
                                                            <div className="gx-coil-image-bg gx-flex-row gx-align-items-center gx-justify-content-center">
                                                                {instruction.process.processName == 'Cutting' ?
                                                                    <img src={require("assets/images/inward/cutting_icon.svg")} alt="main coil image" title="main coil image" /> :
                                                                    <img src={require("assets/images/inward/slitting_icon.svg")} alt="main coil image" title="main coil image" />
                                                                }
                                                            </div>
                                                            <div style={{ marginLeft: "8px" }}>
                                                                {instruction.process.processName == 'Cutting' ? 'Cutting' : 'Slitting'}
                                                                <div className="gx-flex-row">
                                                                    <div className="gx-coil-details-label"><IntlMessages id="partywise.plan.availableLength" /> : </div>
                                                                    <span className="gx-coil-details-label">{getLength(instruction.childInstructions, 'Non-Delivered')}</span>
                                                                </div>
                                                                {/* <div className="gx-flex-row">
                                                                    <div className="gx-coil-details-label"><IntlMessages id="partywise.plan.deliveredLength" /> : </div>
                                                                    <span className="gx-coil-details-label">{getLength(instruction.childInstructions, 'Delivered')}</span>
                                                                </div> */}
                                                                <div className="gx-flex-row">
                                                                    <div className="gx-coil-details-label"><IntlMessages id="partywise.plan.availableWeight" /> : </div>
                                                                    <span className="gx-coil-details-label">{getWeight(instruction.childInstructions, 'Non-Delivered')}</span>
                                                                </div>
                                                                {/* <div className="gx-flex-row">
                                                                    <div className="gx-coil-details-label"><IntlMessages id="partywise.plan.deliveredWeight" /> : </div>
                                                                    <span className="gx-coil-details-label">{getWeight(instruction.childInstructions, 'Delivered')}</span>
                                                                </div> */}
                                                                {instruction.process.processName == 'Cutting' && props.wip ?
                                                                    <Button onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setCuttingCoil(instruction);
                                                                        setShowCuttingModal(true);
                                                                        setChildCoil(true);
                                                                    }}>Finish Cutting
                                                                    </Button> : props.wip ? <Button onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSlittingCoil(instruction);
                                                                        setShowSlittingModal(true);
                                                                        setChildCoil(true);
                                                                    }}>Finish Slitting
                                                                        </Button> :
                                                                        <div><Button onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setCuttingCoil(instruction);
                                                                            setShowCuttingModal(true);
                                                                            setChildCoil(true);
                                                                        }}>Cutting
                                                                        </Button>
                                                                            <Button onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setSlittingCoil(instruction);
                                                                                setShowSlittingModal(true);
                                                                                setChildCoil(true);
                                                                            }}>Slitting
                                                                    </Button></div>}
                                                            </div>
                                                        </Card>
                                                    </Col>

                                                </>
                                            </Col> :
                                            instruction.deliveryId !== null ?
                                                <Col lg={7} md={7} sm={24} xs={24} className="gx-align-self-center gx-branch-lvl2">
                                                    <>
                                                        <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center plan-dl-box">
                                                            <Card key={`${props.inward.plan.coilNumber}${instruction.instructionId}`} className="cardLevel2InsideDiv gx-delivery-single" size="small">
                                                                <img style={{ position: "absolute", right: "10.35px" }} src={require("assets/images/inward/info_icon.svg")} alt="Packaging" title="Packaging" />
                                                                <div style={{ marginLeft: "8px" }}> <span class="inline-packaging-lbl"><IntlMessages id="partywise.plan.packaging" /></span>
                                                                    <div>
                                                                        <p className="gx-coil-details-label"><IntlMessages id="partywise.plan.deliveryId" /> : <span className="gx-coil-details-label">{instruction.deliveryId}</span></p>
                                                                        <p className="gx-coil-details-label"><IntlMessages id="partywise.plan.date" /> : <span className="gx-coil-details-label">{moment(instruction.updatedOn).format('DD/MM/YYYY')}</span></p>
                                                                        <p className="gx-coil-details-label"><IntlMessages id="partywise.plan.remarks" /> : <span className="gx-coil-details-label">{instruction.remarks}</span></p>
                                                                        <p className="gx-coil-details-label"><IntlMessages id="partywise.plan.wastage" /> : <span className="gx-coil-details-label">{instruction.wastage}</span></p>
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        </Col>

                                                    </>
                                                </Col> : null}
                                    </div>

                                ))}
                            </Card> : <></>}
                        </>
                    ))}
                </Col>
            </div>
        </div>
}</>
    )
}


const mapStateToProps = state => ({
    inward: state.inward,
    party: state.party,
});

export default connect(mapStateToProps, {
    getCoilPlanDetails,
    saveUnprocessedDelivery
})(Plan);