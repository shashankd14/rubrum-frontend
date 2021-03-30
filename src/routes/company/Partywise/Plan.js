import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getCoilPlanDetails, saveUnprocessedDelivery } from "../../../appRedux/actions";
import { Button, Card, Col, Modal, Row } from "antd";

import { CUTTING_INSTRUCTION_PROCESS_ID, SLITTING_INSTRUCTION_PROCESS_ID } from "../../../constants";
import IntlMessages from "../../../util/IntlMessages";
import CuttingModal from "../Partywise/CuttingModal";
import SlittingModal from "./SlittingModal";
import { set } from "nprogress";

const Plan = (props) => {
    const { instruction } = props.inward.plan;
    const [showCuttingModal, setShowCuttingModal] = useState(false);
    const [showSlittingModal, setShowSlittingModal] = useState(false);
    const [cuttingCoil, setCuttingCoil] = useState(false);
    const [slittingCoil, setSlittingCoil] = useState(false);
    const [childCoil, setChildCoil] = useState(false);
    // console.log(instruction)
    const getPlannedLength = (ins) => {
        let length = 0;
        const actualLength = ins.actualLength != null ? ins.actualLength : ins.plannedLength;
        if (ins.childInstructions.length > 0) {
            length = ins.childInstructions.map(i => i.plannedLength);
            return length.reduce((total, num) => total + num)
        }
        length = actualLength - length;
        return length;
    }
    const getPlannedWeight = (ins) => {
        let weight = 0;
        const actualWeight = ins.actualWeight != null ? ins.actualWeight : ins.plannedWeight;
        if (ins.childInstructions.length > 0) {
            weight = ins.childInstructions.map(i => i.plannedWeight);
            return weight.reduce((total, num) => total + num)
        }
        weight = actualWeight - weight;
        return weight;
    }
    const handleClick = (item) => {
        if (item.process.processName == 'Cutting') {
            setCuttingCoil(item);
            setShowCuttingModal(true);
            setChildCoil(true);
        } else {
            setSlittingCoil(item);
            setShowSlittingModal(true);
            setChildCoil(true);
        }
    }
    useEffect(() => {
        props.getCoilPlanDetails(props.match.params.coilNumber);
    }, [])

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
        <div className="gx-full-height" style={{ overflowX: "auto", overflowy: "scroll" }}>
            {cuttingCoil && <CuttingModal showCuttingModal={showCuttingModal} setShowCuttingModal={() => setShowCuttingModal(false)} coilDetails={cuttingCoil} wip={props.wip} childCoil={childCoil} />}
            {slittingCoil && <SlittingModal showSlittingModal={showSlittingModal} setShowSlittingModal={() => setShowSlittingModal(false)} wip={props.wip} coilDetails={slittingCoil} childCoil={childCoil} />}
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
                            <span className="gx-coil-details-label">{props.inward.plan.fQuantity}</span>
                        </div>
                        {props.wip ?
                            <div>{props.inward.plan.fpresent !== 0 ? <Button onClick={() => {
                                props.saveUnprocessedDelivery(props.inward.plan.inwardEntryId)
                            }}>Unprocessed</Button> : <></>}</div> :
                            <div>
                                <Button onClick={() => {
                                    setCuttingCoil(props.inward.plan);
                                    setShowCuttingModal(true);
                                }}>Cutting</Button>
                                <Button onClick={() => {
                                    setSlittingCoil(props.inward.plan);
                                    setShowSlittingModal(true)
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
                                                            setCuttingCoil(instruction);
                                                            setShowCuttingModal(true);
                                                            setChildCoil(true);
                                                        }}>Finish Slitting
                                                        </Button> :
                                                            <div><Button onClick={(e) => {
                                                                e.stopPropagation();
                                                                setCuttingCoil(instruction);
                                                                setShowCuttingModal(true);
                                                            }}>Cutting
                                                        </Button>
                                                                <Button onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSlittingCoil(instruction);
                                                                    setShowCuttingModal(true);
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
                                                                <div className="gx-flex-row">
                                                                    <div className="gx-coil-details-label"><IntlMessages id="partywise.plan.deliveredLength" /> : </div>
                                                                    <span className="gx-coil-details-label">{getLength(instruction.childInstructions, 'Delivered')}</span>
                                                                </div>
                                                                <div className="gx-flex-row">
                                                                    <div className="gx-coil-details-label"><IntlMessages id="partywise.plan.availableWeight" /> : </div>
                                                                    <span className="gx-coil-details-label">{getWeight(instruction.childInstructions, 'Non-Delivered')}</span>
                                                                </div>
                                                                <div className="gx-flex-row">
                                                                    <div className="gx-coil-details-label"><IntlMessages id="partywise.plan.deliveredWeight" /> : </div>
                                                                    <span className="gx-coil-details-label">{getWeight(instruction.childInstructions, 'Delivered')}</span>
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
                                                                        setCuttingCoil(instruction);
                                                                        setShowCuttingModal(true);
                                                                        setChildCoil(true);
                                                                    }}>Finish Slitting
                                                                        </Button> :
                                                                        <div><Button onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setCuttingCoil(instruction);
                                                                            setShowCuttingModal(true);
                                                                        }}>Cutting
                                                                        </Button>
                                                                            <Button onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setSlittingCoil(instruction);
                                                                                setShowCuttingModal(true);
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