import React from "react";
import {connect} from "react-redux";
import {setInwardDetails} from "../../../../appRedux/actions";

const InwardEntrySummary = (props) => {
    return (
        <>
            <div>test</div>
        </>
    )
}

const mapStateToProps = state => ({
    inward: state.inward.inward,
});

export default connect(mapStateToProps, {})(InwardEntrySummary);
