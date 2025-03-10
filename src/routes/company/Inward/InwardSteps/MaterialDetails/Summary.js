import { Button, Col, Icon, Row, Descriptions, Card } from "antd";
import { connect } from "react-redux";
import React, { useEffect } from "react";
import ProductInfo from "./ProductInfo";
import {
  setInwardDetails,
  getRefinedProducts
} from "../../../../../appRedux/actions";

const Summary = (props) => {
  const { categoryName, subCategoryName, leafCategoryName, brandName, productType, uom, form, grade, surfaceType, subGradeName, coatingType, mmId } = props.material.displayInfo;

  useEffect(() => {
    props.getRefinedProducts(props.inward);
  }, []);

  return (
    <>
    <Card>
      <Descriptions title="Category" column={2}>
        <Descriptions.Item label="Material Category">{categoryName}</Descriptions.Item>
        <Descriptions.Item label="Sub Category">{subCategoryName}</Descriptions.Item>
        <Descriptions.Item label="Leaf Category">{leafCategoryName}</Descriptions.Item>
        <Descriptions.Item label="Material ID">{props?.productInfo?.refinedProducts[0]?.mmId ? props?.productInfo?.refinedProducts[0]?.mmId : mmId}</Descriptions.Item>
      </Descriptions>
      <Descriptions title="Product Info" column={2}>
        <Descriptions.Item label="Product Type">{productType}</Descriptions.Item>
        <Descriptions.Item label="HSN"></Descriptions.Item>
        <Descriptions.Item label="Brand">{brandName}</Descriptions.Item>
        <Descriptions.Item label="Unit of measure">{uom}</Descriptions.Item>
        <Descriptions.Item label="Form">{form}</Descriptions.Item>
        <Descriptions.Item label="Grade">{grade}</Descriptions.Item>
        <Descriptions.Item label="Sub grade">{subGradeName}</Descriptions.Item>
        <Descriptions.Item label="Surface Type">{surfaceType}</Descriptions.Item>
        <Descriptions.Item label="Coating gsm">{coatingType}</Descriptions.Item>
        <Descriptions.Item label="Thickness">{props.inward.thickness}</Descriptions.Item>
        <Descriptions.Item label="OD">{props.inward.od}</Descriptions.Item>
        <Descriptions.Item label="Width">{props.inward.width}</Descriptions.Item>
        <Descriptions.Item label="ID">{props.inward.id}</Descriptions.Item>
        <Descriptions.Item label="Length">{props.inward.length}</Descriptions.Item>
        <Descriptions.Item label="NB">{props.inward.nb}</Descriptions.Item>
        <Descriptions.Item label="Gross Weight">{props.inward.grossWeight}</Descriptions.Item>
        <Descriptions.Item label="Net Weight">{props.inward.netWeight}</Descriptions.Item>
        <Descriptions.Item label="Material Description">{`${categoryName}-${subCategoryName}-${leafCategoryName}-${brandName}-${uom}-${form}-${grade}-${subGradeName}-${surfaceType}-${coatingType}-${props.inward.thickness}-${props.inward.od}-${props.inward.width}-${props.inward.id}-${props.inward.length}-${props.inward.nb}`}</Descriptions.Item>
      </Descriptions>
      </Card>
      <Row className="gx-mt-4">
        <Col span={24} offset={4} style={{ textAlign: "center" }}>
          <Button style={{ marginLeft: 8 }} onClick={() => props.updateStep(1)}>
            <Icon type="left" />
            Back
          </Button>
          <Button type="primary" onClick={() => props.onNextStep()}>
            Forward
            <Icon type="right" />
          </Button>
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  inward: state.inward.inward,
  material: state.material,
  productInfo: state.productInfo
});

export default connect(mapStateToProps, {
  getRefinedProducts
})(Summary);
