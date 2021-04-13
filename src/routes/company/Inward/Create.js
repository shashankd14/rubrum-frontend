import React, {useEffect, useState} from "react";
import { Card, Form, Steps, Row} from "antd";
import {connect} from "react-redux";
import {fetchPartyList, fetchMaterialList, setInwardDetails, submitInwardEntry} from "../../../appRedux/actions";

import PartyDetailsForm from "./InwardSteps/PartyDetailsForm";
import CoilDetailsForm from "./InwardSteps/CoilDetailsForm";
import InvoiceDetailsForm from "./InwardSteps/InvoiceDetailsForm";
import QualityDetailsForm from "./InwardSteps/QualityDetailsForm";
import InwardEntrySummary from "./InwardSteps/InwardEntrySummary";

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
        const steps = [
            {
                title: 'Customer',
                content: <PartyDetailsForm updateStep={(step) => setCurrentStep(step)} />,
            },
            {
                title: 'Coil',
                content: <CoilDetailsForm updateStep={(step) => setCurrentStep(step)} />,
            },
            {
                title: 'Invoice',
                content: <InvoiceDetailsForm updateStep={(step) => setCurrentStep(step)}/>,
            },
            {
                title: 'Quality',
                content: <QualityDetailsForm updateStep={(step) => setCurrentStep(step)} />,
            },{
                title: 'Summary',
                content: <InwardEntrySummary updateStep={(step) => setCurrentStep(step)} />,
            },
        ];
        setSteps(steps);
    }, []);
    useEffect(()=>{
        if(props.inward.inwardEntry){
            let inwardValue = props.inward.inwardEntry;
            inwardValue.thickness = "";
            inwardValue.batchNo ="";
            inwardValue.coilNumber = "";
            inwardValue.grossWeight = "";
            inwardValue.netWeight = "";
            props.setInwardDetails({...props.inward.inward, ...inwardValue})
        }
    },[])
    useEffect(() => {
        props.fetchPartyList();
        props.fetchMaterialList();
    }, []);

    return (
        <Card className="gx-card" title="Inward Entry">
            <Steps current={currentStep}>
                <Step title="Customer" onClick={() => setCurrentStep(0)}/>
                <Step title="Coil" onClick={() => setCurrentStep(1)} />
                <Step title="Invoice" onClick={() => setCurrentStep(2)} />
                <Step title="Quality" onClick={() => setCurrentStep(3)} />
                <Step title="Summary" onClick={() => setCurrentStep(4)} />
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
                value: (props.inward.inward.partyName) ? props.inward.inward.partyName : '',
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
            materialDesc: Form.createFormField({
                ...props.inward.inward.materialDesc,
                value: (props.inward.inward.materialDesc) ? props.inward.inward.materialDesc : '',
            }),
            width: Form.createFormField({
                ...props.inward.inward.width,
                value: (props.inward.inward.width) ? props.inward.inward.width : '',
            }),
            thickness: Form.createFormField({
                ...props.inward.inward.thickness,
                value: (props.inward.inward.thickness) ? props.inward.inward.thickness : '',
            }),
            weight: Form.createFormField({
                ...props.inward.inward.weight,
                value: (props.inward.inward.weight) ? props.inward.inward.weight : '',
            }),
            length: Form.createFormField({
                ...props.inward.inward.length,
                value: (props.inward.inward.length) ? props.inward.inward.length : '',
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
    submitInwardEntry,
})(Create);
