import React, { useState } from "react";
import { Form, Steps } from "antd";
import { connect } from "react-redux";
import {
  fetchMaterialList,
  fetchPartyList,
  setInwardDetails,
  submitInwardEntry,
} from "../../../../appRedux/actions";
import Category from "./MaterialDetails/Category";
import ProductInfo from "./MaterialDetails/ProductInfo";
import Summary from "./MaterialDetails/Summary";

const { Step } = Steps;
const MaterialDetails = (props) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isBack, setIsBack] = useState(false);

  const steps = [
    {
      title: "Select Category & basic details",
      content: (
        <Category
          onPrevStep={() => props.updateStep(0)}
          updateStep={(step) => setCurrentStep(step)}
          params={
            props?.match?.params && props?.match?.params?.inwardEntryId
              ? props.match.params.inwardEntryId
              : ""
          }
        />
      ),
    },
    {
      title: "Product Info",
      content: (
        <ProductInfo
          updateStep={(step) => setCurrentStep(step)}
          isBack={isBack}
          params={
            props?.match?.params && props?.match?.params?.inwardEntryId
              ? props.match.params.inwardEntryId
              : ""
          }
        />
      ),
    },
    {
      title: "Summary",
      content: (
        <Summary
          onNextStep={() => props.updateStep(2)}
          updateStep={(step) => {
            setIsBack(true);
            setCurrentStep(step);
          }}
          params={
            props?.match?.params && props?.match?.params?.inwardEntryId
              ? props.match.params.inwardEntryId
              : ""
          }
        />
      ),
    },
  ];

  return (
    <>
      <br />
      <br />
      <Steps progressDot current={currentStep}>
        <Step
          title="Select Category & basic details"
          onClick={() => setCurrentStep(0)}
        />
        <Step title="Product Info" onClick={() => setCurrentStep(1)} />
        <Step title="Summary" onClick={() => setCurrentStep(2)} />
      </Steps>
      <div style={{ width: "100%" }}>
        {steps.length > 0 && steps[currentStep].content}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  party: state.party,
  material: state.material,
  inward: state.inward,
});

const MaterialDetailsForm = Form.create({ name: "material_form" })(
  MaterialDetails
);
export default connect(mapStateToProps, {
  fetchPartyList,
  fetchMaterialList,
  setInwardDetails,
  submitInwardEntry,
})(MaterialDetailsForm);
