import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getCoilPlanDetails } from "../../../appRedux/actions";
import { Button, Card, Col, Modal , Row} from "antd";

import { CUTTING_INSTRUCTION_PROCESS_ID, SLITTING_INSTRUCTION_PROCESS_ID } from "../../../constants";
import IntlMessages from "../../../util/IntlMessages";
import CuttingModal from "../Partywise/CuttingModal";
import SlittingModal from "./SlittingModal";

const Plan = (props) => {
    const { instruction } = props.inward.plan;
    const [showCuttingModal, setShowCuttingModal] = useState(false);
    const [showSlittingModal, setShowSlittingModal] = useState(false);
    const [cuttingCoil, setCuttingCoil] = useState(false);
    const [slittingCoil, setSlittingCoil] = useState(false);
    console.log(instruction)
    useEffect(() => {
        props.getCoilPlanDetails(props.match.params.coilNumber);
    }, [])

    useEffect(() => {
        console.log(slittingCoil);

        if (slittingCoil) {
            setSlittingCoil(slittingCoil);
            setShowSlittingModal(true);
        }
    }, [slittingCoil])

    useEffect(() => {
        console.log(cuttingCoil);
        if (cuttingCoil) {
            setCuttingCoil(cuttingCoil);
            setShowCuttingModal(true);
        }
    }, [cuttingCoil])

    return (
        <div className="gx-full-height" style={{overflowX:"auto",overflowy:"scroll"}}>
            {cuttingCoil && <CuttingModal showCuttingModal={showCuttingModal} setShowCuttingModal={() => setShowCuttingModal(false)} coilDetails={cuttingCoil} wip={props.wip} />}
            {slittingCoil && <SlittingModal showSlittingModal={showSlittingModal} setShowSlittingModal={() => setShowSlittingModal(false)} wip={props.wip} coilDetails={slittingCoil} />}
            <h1><IntlMessages id="partywise.plan.label" /></h1>
            <div className="gx-full-height gx-flex-row">
                <Col lg={7} md={7} sm={24} xs={24} className="gx-align-self-center">
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
                        <div>
                            <Button onClick={() => {
                                setCuttingCoil(props.inward.plan);
                                setShowCuttingModal(true);
                            }}>Cutting</Button>
                            <Button onClick={() => {
                                setSlittingCoil(props.inward.plan);
                                setShowSlittingModal(true)
                            }}>Slitting</Button>
                        </div>
                    </Card>
                </Col>
                <div className="gx-branch lv1">
                    {instruction && instruction.length > 0 && instruction.map((group) => (
                        <>
                            {group.length > 0 ? <Card style={{position:'relative'}} className={`gx-entry ${group[0].processdId == CUTTING_INSTRUCTION_PROCESS_ID ? 'gx-cutting-group' : 'gx-slitting-group'}`}>
                                {group.map((instruction) => (
                                   <div style={{display:"flex"}}>
                                       <div> 
                                            <Card key={`${props.inward.plan.coilNumber}${instruction.instructionId}`} className={`${instruction.processdId == CUTTING_INSTRUCTION_PROCESS_ID ? 'gx-cutting-single' : 'gx-slitting-single'}`} size="small">
                                                <img style={{ position: "absolute", right: "10.35px" }} src={require("assets/images/inward/info_icon.svg")} alt="main coil image" title="main coil image" />
                                                <div className="gx-coil-image-bg gx-flex-row gx-align-items-center gx-justify-content-center">
                                                    {instruction.processdId == CUTTING_INSTRUCTION_PROCESS_ID ?
                                                        <img src={require("assets/images/inward/cutting_icon.svg")} alt="main coil image" title="main coil image" /> :
                                                        <img src={require("assets/images/inward/slitting_icon.svg")} alt="main coil image" title="main coil image" />
                                                    }
                                                </div>
                                                <div style={{ marginLeft: "8px" }}>
                                                    {instruction.processdId == CUTTING_INSTRUCTION_PROCESS_ID ? 'Cutting' : 'Slitting'}
                                                    <div className="gx-flex-row">
                                                        <p className="gx-coil-details-label"><IntlMessages id="partywise.plan.availableLength" /> : </p>
                                                        <span className="gx-coil-details-label">{instruction.length}</span>
                                                    </div>
                                                    <div className="gx-flex-row">
                                                        <p className="gx-coil-details-label"><IntlMessages id="partywise.plan.availableWeight" /> : </p>
                                                        <span className="gx-coil-details-label">{instruction.weight}</span>
                                                    </div>
                                                    <div>
                                                        <Button onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCuttingCoil(instruction);}}>Cutting
                                                        </Button>
                                                        <Button onClick={(e) => {
                                                            e.stopPropagation();
                                                                setSlittingCoil(instruction);
                                                            }}>Slitting
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    
                                        <div style={{border:"2px solid black"}}>
                                                
                                            {instruction.childInstructions.map((item,index) => ( index < 3 ? 
                                                    <div className="gx-branch-lvl2" style={{width:"250px", height:"100px"}}>
                                                        <div key={`${props.inward.plan.coilNumber}${item.instructionId}`} className={`${item.processdId == CUTTING_INSTRUCTION_PROCESS_ID ? 'gx-cutting-single' : 'gx-slitting-single'}`} size="small">
                                                            <div style={{display:"flex", flexDirection:"column"}}>
                                                                <div>
                                                                    <div style={{borderBlockColor:"white",padding:"20px"}}>
                                                                        {item.processdId == CUTTING_INSTRUCTION_PROCESS_ID ?
                                                                        <img src={require("assets/images/inward/cutting_icon.svg")} alt="main coil image" title="main coil image" /> :
                                                                        <img src={require("assets/images/inward/slitting_icon.svg")} alt="main coil image" title="main coil image" />}
                                                                    </div>
                                                                    <p>{item.processdId == CUTTING_INSTRUCTION_PROCESS_ID ? 'Cutting' : 'Slitting'}</p>
                                                                </div>
                                                                    <div>
                                                                        <div style={{ marginLeft: "8px" }}>
                                                                            <div>
                                                                                <p><IntlMessages id="partywise.plan.availableLength" /> : </p>
                                                                                <span>{item.length}</span>
                                                                            </div>
                                                                            <div>
                                                                                <p><IntlMessages id="partywise.plan.availableWeight" /> : </p>
                                                                                <span>{item.weight}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                    <div style={{ marginLeft: "8px" }}>
                                                                            <div>
                                                                                <Button style={{padding:"2px"}} onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setCuttingCoil(item);
                                                                                }}>Cutting</Button>
                                                                                <Button onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setSlittingCoil(item);
                                                                                }}>Slitting</Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div> 
                                                        </div>
                                            : null ))}
                                        </div>
                                        
                                    </div>

                                ))}
                            </Card> : <></>}
                        </>
                    ))}
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = state => ({
    inward: state.inward,
    party: state.party,
});

export default connect(mapStateToProps, {
    getCoilPlanDetails
})(Plan);