import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import { Card, Row, Steps } from "antd";
import InwardStageForm from './TemplateStageSteps/InwardStageForm';
import PreProcessingStageForm from './TemplateStageSteps/PreProcessingStageForm';
import ProcessingStageForm from './TemplateStageSteps/ProcessingStageForm';
import PreDispatchStageForm from './TemplateStageSteps/PreDispatchStageForm';
import PostDispatchStageForm from './TemplateStageSteps/PostDispatchStageForm';

const { Step } = Steps;
let uuid = 0;
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

const CreateTemplate = (props) => {

    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState([]);

    useEffect(() => {
        const steps = [
            {
                title: 'Inward',
                content: <InwardStageForm updateStep={(step) => setCurrentStep(step)} params={props.match.params}/>,
            },
            {
                title: 'Pre Processing',
                content: <PreProcessingStageForm updateStep={(step) => setCurrentStep(step)} params={props.match.params}/>,
            },
            {
                title: 'Processing',
                content: <ProcessingStageForm updateStep={(step) => setCurrentStep(step)} params={props.match.params}/>,
            },
            {
                title: 'Pre Dispatch',
                content: <PreDispatchStageForm updateStep={(step) => setCurrentStep(step)} params={props.match.params}/>,
            },{
                title: 'Post Dispatch',
                content: <PostDispatchStageForm updateStep={(step) => setCurrentStep(step)} params={props.match.params}/>,
            },
        ];
        setSteps(steps);
    }, []);

   return (
        <Card className="gx-card" bodyStyle={{ minHeight: "75vh" }} title="Create Template">
            <Steps current={currentStep}>
                <Step title="Inward" onClick={() => setCurrentStep(0)}/>
                <Step title="Pre Processing" onClick={() => setCurrentStep(1)} />
                <Step title="Processing" onClick={() => setCurrentStep(2)} />
                <Step title="Pre Dispatch" onClick={() => setCurrentStep(3)} />
                <Step title="Post Dispatch" onClick={() => setCurrentStep(4)} />
            </Steps>
            <Row className="gx-justify-content-center" style={{ minHeight: "70vh" }}>
                {steps.length > 0 && steps[currentStep].content}
            </Row>
        </Card>
   );
};

const mapStateToProps = state => ({
    formFields: state.quality.formFields
});

export default connect(mapStateToProps)(CreateTemplate);