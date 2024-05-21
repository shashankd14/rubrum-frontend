import React, {useEffect, useState} from "react";
import { Card, Form, Steps, Row} from "antd";
import {connect} from "react-redux";
import {fetchPartyList, fetchMaterialList, setInwardDVDetails, submitInwardEntry} from "../../../appRedux/actions";

import InwardSummary from "./InwardSteps/InwardSummary";
import CreatePurposeTypeForm from './InwardSteps/ChoosePurpose';
import VendorDetails from './InwardSteps/VendorDetails';
import MaterialDetails from './InwardSteps/MaterialDetails';
import InwardDocPage1 from './InwardSteps/InwardDocPage1';
import InwardDocPage2 from './InwardSteps/InwardDocPage2';
import ReconciliationForm from './InwardSteps/Reconciliation';
export const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 8},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 16},
    },
};

const { Step } = Steps;

const CreateForm = (props) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState([]);
    
    console.log("props1111", props.params)
    useEffect(() => {
        debugger
        const steps = [
            {
                title: 'Choose Purpose',
                content: <CreatePurposeTypeForm updateStep={(step) => setCurrentStep(step)} params={props.match.params && props.match.params.inwardEntryId ?props.match.params.inwardEntryId: ''} />,
            },
            {
                title: 'Vendor',
                content: <VendorDetails updateStep={(step) => setCurrentStep(step)} params={props.match.params && props.match.params.inwardEntryId ?props.match.params.inwardEntryId: ''}/>,
            },
            {
                title: 'Material',
                content: <MaterialDetails updateStep={(step) => setCurrentStep(step)} params={props.match.params && props.match.params.inwardEntryId ?props.match.params.inwardEntryId: ''}/>,
            },
            {
                title: 'Inward Doc Page 1',
                content: <InwardDocPage1 updateStep={(step) => setCurrentStep(step)} params={props.match.params && props.match.params.inwardEntryId ?props.match.params.inwardEntryId: ''} />,
            },
            {
                title: 'Inward Doc Page 2',
                content: <InwardDocPage2 updateStep={(step) => setCurrentStep(step)} params={props.match.params && props.match.params.inwardEntryId ?props.match.params.inwardEntryId: ''} />,
            },
            {
                title: 'Reconciliation',
                content: <ReconciliationForm updateStep={(step) => setCurrentStep(step)} params={props.match.params && props.match.params.inwardEntryId ?props.match.params.inwardEntryId: ''}/>,
            },
            {
                title: 'Summary',
                content: <InwardSummary updateStep={(step) => setCurrentStep(step)} params={props.match.params && props.match.params.inwardEntryId ?props.match.params.inwardEntryId: ''}/>,
            },
        ];
        setSteps(steps);
    }, []);
    console.log("current step out of hook", currentStep);
    useEffect(()=>{
        debugger
        if (props.inwardDV?.inwardDVId?.content?.length > 0) {
        let firstItem = props.inwardDV?.inwardDVId?.content[0];
        
            props.setInwardDVDetails({...props.inwardDV.inward, ...firstItem})
        
    }
    },[])
    
    
    return (
        <Card className="gx-card" title="Inward Entry">
            <Steps current={currentStep}>
                <Step title="Choose Purpose" onClick={() => setCurrentStep(0)}/>
                <Step title="Vendor" onClick={() => setCurrentStep(1)} />
                <Step title="Material" onClick={() => setCurrentStep(2)} />
                <Step title="Inward Doc Page 1" onClick={() => setCurrentStep(3)} />
                <Step title="Inward Doc Page 2" onClick={() => setCurrentStep(4)} />
                <Step title="Reconciliation" onClick={() => setCurrentStep(5)} />
                <Step title="Summary" onClick={() => setCurrentStep(6)} />
            </Steps>
            <Row className="gx-justify-content-center">
                {steps.length > 0 && steps[currentStep].content}
            </Row>
        </Card>
    )
}

const mapStateToProps = state => ({
    inward: state.inward,
    inwardDV: state.inwardDV
});

const Create = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
        };
    },
    onValuesChange(props, values) {
        props.setInwardDVDetails({ ...props.inward.inward, ...values});
    },
})(CreateForm);

export default connect(mapStateToProps, {
    fetchPartyList,
    fetchMaterialList,
    setInwardDVDetails,
    submitInwardEntry
    
})(Create);
