import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {fetchInwardList, fetchPartyList, getCoilsByPartyId} from "../../../appRedux/actions";

const Plan = (props) => {
    return (
        <div>Plan Page</div>
    )
}


const mapStateToProps = state => ({
    inward: state.inward,
    party: state.party,
});

export default connect(mapStateToProps, {
    fetchPartyList,
    fetchInwardList,
    getCoilsByPartyId
})(Plan);
