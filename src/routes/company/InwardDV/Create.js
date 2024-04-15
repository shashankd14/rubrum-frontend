import React, {useEffect, useState} from "react";
import { Card, Form, Steps, Row} from "antd";
import {connect} from "react-redux";
import {fetchPartyList, fetchMaterialList, setInwardDetails, submitInwardEntry} from "../../../appRedux/actions";

import InwardSummary from "./InwardSteps/InwardSummary";
import CreatePurposeTypeForm from './InwardSteps/ChoosePurpose';
import VendorDetails from './InwardSteps/VendorDetails';
import MaterialDetails from './InwardSteps/MaterialDetails';
import InwardPage1Form from './InwardSteps/InwardPage1';
import InwardPage2Form from './InwardSteps/InwardPage2';
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
    useEffect(() => {
        props.fetchMaterialList();
        props.fetchPartyList();
    }, []);
    
    useEffect(() => {
        debugger
        const steps = [
            {
                title: 'Choose Purpose',
                // content: <CreatePurposeTypeForm updateStep={(step) => setCurrentStep(step)} params={props.match.params && props.match.params.inwardEntryId ?props.match.params.inwardEntryId: ''}/>,
                content: <CreatePurposeTypeForm updateStep={(step) => setCurrentStep(step)} params={props.match.params} />,
            },
            {
                title: 'Vendor',
                // content: <VendorDetails updateStep={(step) => setCurrentStep(step)} params={props.match.params && props.match.params.inwardEntryId ?props.match.params.inwardEntryId: ''}/>,
                content: <VendorDetails updateStep={(step) => setCurrentStep(step)} params={props.match.params}/>,
            },
            {
                title: 'Material',
                // content: <MaterialDetails updateStep={(step) => setCurrentStep(step)} params={props.match.params && props.match.params.inwardEntryId ?props.match.params.inwardEntryId: ''}/>,
                content: <MaterialDetails updateStep={(step) => setCurrentStep(step)} params={props.match.params}/>,
            },
            {
                title: 'Inward Doc Page 1',
                // content: <InwardPage1Form updateStep={(step) => setCurrentStep(step)} params={props.match.params && props.match.params.inwardEntryId ?props.match.params.inwardEntryId: ''}/>,
                content: <InwardPage1Form updateStep={(step) => setCurrentStep(step)} />,
            },
            {
                title: 'Inward Doc Page 2',
                // content: <InwardPage2Form updateStep={(step) => setCurrentStep(step)} params={props.match.params && props.match.params.inwardEntryId ?props.match.params.inwardEntryId: ''}/>,
                content: <InwardPage2Form updateStep={(step) => setCurrentStep(step)} />,
            },
            {
                title: 'Reconciliation',
                // content: <ReconciliationForm updateStep={(step) => setCurrentStep(step)} params={props.match.params && props.match.params.inwardEntryId ?props.match.params.inwardEntryId: ''}/>,
                content: <ReconciliationForm updateStep={(step) => setCurrentStep(step)} />,
            },
            {
                title: 'Summary',
                // content: <InwardSummary updateStep={(step) => setCurrentStep(step)} params={props.match.params && props.match.params.inwardEntryId ?props.match.params.inwardEntryId: ''}/>,
                content: <InwardSummary updateStep={(step) => setCurrentStep(step)} />,
            },
        ];
        console.log("111", steps);
        setSteps(steps);
    }, []);
    console.log("current step out of hook", currentStep);
    useEffect(()=>{
        if(props.inward.inwardEntry && (props.match.params.inwardEntryId === "" || props.match.params.inwardEntryId === undefined)){
            let inwardValue = props.inward.inwardEntry;
            inwardValue.thickness = "";
            inwardValue.batchNo ="";
            inwardValue.coilNumber = "";
            inwardValue.grossWeight = "";
            inwardValue.netWeight = "";
            props.setInwardDetails({...props.inward.inward, ...inwardValue})
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
    party: state.party,
    material: state.material,
    inward: state.inward,
});

const Create = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            partyName: Form.createFormField({
                ...props.inward.inward.partyName,
                value: (props.match.params && props.match.params.inwardEntryId && props.inward.inward.party) ? props.inward.inward.party.partyName : (props.inward.inward.partyName) ? props.inward.inward.partyName : '',
            }),
            coilNumber: Form.createFormField({
                ...props.inward.inward.coilNumber,
                value: (props.inward.inward.coilNumber) ? props.inward.inward.coilNumber : '',
            }),
            inwardDate: Form.createFormField({
                ...props.inward.inward.inwardDate,
                value: (props.inward.inward.inwardDate) ? props.inward.inward.inwardDate : '',
            }),
            vehicleNumber: Form.createFormField({
                ...props.inward.inward.vehicleNumber,
                value: (props.inward.inward.vehicleNumber) ? props.inward.inward.vehicleNumber : '',
            }),
            invoiceNumber: Form.createFormField({
                ...props.inward.inward.invoiceNumber,
                value: (props.inward.inward.invoiceNumber) ? props.inward.inward.invoiceNumber : '',
            }),
            invoiceDate: Form.createFormField({
                ...props.inward.inward.invoiceDate,
                value: (props.inward.inward.invoiceDate) ? props.inward.inward.invoiceDate : '',
            }),
            description: Form.createFormField({
                ...props.inward.inward.description,
                value: (props.match.params && props.match.params.inwardEntryId && props.inward.inward.material)  ? props.inward.inward.material.description :(props.inward.inward.description) ? props.inward.inward.description : '',
            }),
            width: Form.createFormField({
                ...props.inward.inward.width,
                value:props.match.params ?props.inward.inward.fWidth: (props.inward.inward.width) ? props.inward.inward.width : '',
            }),
            thickness: Form.createFormField({
                ...props.inward.inward.thickness,
                value: props.match.params ?props.inward.inward.fThickness:(props.inward.inward.thickness) ? props.inward.inward.thickness : '',
            }),
            weight: Form.createFormField({
                ...props.inward.inward.weight,
                value: props.match.params ?props.inward.inward.fQuantity:(props.inward.inward.weight) ? props.inward.inward.weight : '',
            }),
            length: Form.createFormField({
                ...props.inward.inward.length,
                value: props.match.params ?props.inward.inward.fLength:(props.inward.inward.length) ? props.inward.inward.length : '',
            }),
        };
    },
    onValuesChange(props, values) {
        props.setInwardDetails({ ...props.inward.inward, ...values});
    },
})(CreateForm);

export default connect(mapStateToProps, {
    fetchPartyList,
    fetchMaterialList,
    setInwardDetails,
    submitInwardEntry
    
})(Create);
