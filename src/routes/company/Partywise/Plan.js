import React, {useEffect} from "react";
import {connect} from "react-redux";
import {getCoilPlanDetails} from "../../../appRedux/actions";
import {Button, Card, Col, Row} from "antd";

import IntlMessages from "../../../util/IntlMessages";

const Plan = (props) => {
    const {instruction} = props.inward.plan;

    useEffect(() => {
        props.getCoilPlanDetails(props.match.params.coilNumber);
    }, [])

    return (
        <div className="gx-full-height">
            <h1><IntlMessages id="partywise.plan.label"/></h1>
            <div className="gx-full-height gx-flex-row">
                <Col lg={7} md={7} sm={24} xs={24} className="gx-align-self-center">
                    <Card className="gx-plan-main-coil" size="small">
                        <h5>{props.inward.plan.coilNumber}</h5>
                        <div className="gx-flex-row">
                            <p><IntlMessages id="partywise.plan.availableLength"/></p>
                            -
                            <span>{props.inward.plan.fLength}</span>
                        </div>
                        <div className="gx-flex-row">
                            <p><IntlMessages id="partywise.plan.availableWeight"/></p>-
                            <span>{props.inward.plan.fQuantity}</span>
                        </div>
                        <div>
                            <Button type="primary">Cutting</Button>
                            <Button type="primary">Slitting</Button>
                        </div>
                    </Card>
                </Col>
                <div className="gx-branch lv1">
                    {instruction && instruction.length > 0 && instruction.map((instruction) => (
                        <div className="gx-entry">
                            <Card className="gx-plan-main-coil" size="small">
                                <h5>{props.inward.plan.coilNumber}</h5>
                                <div className="gx-flex-row">
                                    <p><IntlMessages id="partywise.plan.availableLength"/></p>
                                    -
                                    <span>{props.inward.plan.fLength}</span>
                                </div>
                                <div className="gx-flex-row">
                                    <p><IntlMessages id="partywise.plan.availableWeight"/></p>-
                                    <span>{props.inward.plan.fQuantity}</span>
                                </div>
                                <div>
                                    <Button type="primary">Cutting</Button>
                                    <Button type="primary">Slitting</Button>
                                </div>
                            </Card>
                        </div>
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
