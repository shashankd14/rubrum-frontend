import React, { useEffect } from "react";
import { AutoComplete, Button, Col, Form, Icon, Row, Input, Select } from "antd";
import { connect } from "react-redux";
import {
  getProductSubGrades,
  setInwardDetails,
  getProductGrades,
  getProductSurfaceList,
  getProductCoatingList,
  saveMaterialInfo,
  getRefinedProducts
} from "../../../../../appRedux/actions";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
const { TextArea } = Input;

const ProductInfoForm = (props) => {
    const { Option } = AutoComplete;
  const { getFieldDecorator } = props.form;
  
  const { categoryName, subCategoryName, leafCategoryName, brandName, productType, uom, form, grade, surfaceType, subGradeName, coatingType } = props.material.displayInfo;

  const handleSubmit = (e) => {
    e.preventDefault();
    props.updateStep(2);
    // props.form.validateFields((err, values) => {
    //     if (!err) {
    //
    //     }
    // });
  };

  useEffect(() => {
    props.getProductGrades(props.inward.productTypeId);
    props.getProductSurfaceList(props.inward.productTypeId);
    props.getProductCoatingList(props.inward.productTypeId);
    props.getRefinedProducts(props.inward);
  }, []);

  return (
    <>
      <Form
        {...formItemLayout}
        className="ant-material-category-form"
        onSubmit={handleSubmit}
      >
        <Row>
          <Col span={12}>
            <Form.Item label="Product Type">
              <Input id="productTypeId" disabled value={props.material.displayInfo.productType} />
            </Form.Item>
            <Form.Item label="Grade">
              {getFieldDecorator("gradeId", {
                rules: [{ required: false, message: "Select a product grade" }],
              })(
                <Select
                  showSearch
                  placeholder="Select a product grade"
                  optionFilterProp="children"
                  onChange={(gradeId, option) => {
                    props.getProductSubGrades(gradeId);
                    props.saveMaterialInfo('grade', option.props.children);
                    props.getRefinedProducts(props.inward);
                  }}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props.productInfo?.productGradesList?.map((grade) => (
                    <Option key={grade.gradeId} value={`${grade.gradeId}`}>
                      {grade.gradeName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Surface Type">
              {getFieldDecorator("surfaceType", {
                rules: [{ required: false, message: "Select Surface Type" }],
              })(
                <Select
                  showSearch
                  placeholder="Select a surface type"
                  optionFilterProp="children"
                  onChange={(gradeId, option) => {
                    // props.getProductSubGrades(gradeId);
                    props.saveMaterialInfo('surfaceType', option.props.children);
                    props.getRefinedProducts(props.inward);
                  }}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props.productInfo?.productSurfaceList?.map((grade) => (
                    <Option key={grade.gradeId} value={`${grade.gradeId}`}>
                      {grade.gradeName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Thickness (mm)">
              {getFieldDecorator("thickness", {
                rules: [{ required: false, message: "Enter Thickness" }],
              })(
                <Select
                  showSearch
                  placeholder="Select thickness"
                  optionFilterProp="children"
                  onChange={(gradeId, option) => {
                    props.saveMaterialInfo('thickness', option.props.children);
                    props.getRefinedProducts(props.inward);
                  }}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props?.productInfo?.refinedProducts?.map((refinedProduct) => (
                    refinedProduct.thickness >= 0 ? <Option key={refinedProduct.thickness} value={`${refinedProduct.thickness}`}>
                      {refinedProduct.thickness}
                    </Option> : <Option key='' value=''></Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Width (mm)">
              {getFieldDecorator("width", {
                rules: [{ required: false, message: "Enter Width" }],
              })(
                <Select
                  showSearch
                  placeholder="Select a width"
                  optionFilterProp="children"
                  onChange={(gradeId, option) => {
                    props.saveMaterialInfo('width', option.props.children);
                    props.getRefinedProducts(props.inward);
                  }}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props?.productInfo?.refinedProducts?.map((refinedProduct) => (
                    refinedProduct.width >= 0 ? <Option key={refinedProduct.width} value={`${refinedProduct.width}`}>
                      {refinedProduct.width}
                    </Option> : <Option key='' value=''></Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Length (mm)">
              {getFieldDecorator("length", {
                rules: [{ required: false, message: "Enter Length" }],
              })(
                <Select
                  showSearch
                  placeholder="Select a length"
                  optionFilterProp="children"
                  onChange={(gradeId, option) => {
                    props.saveMaterialInfo('length', option.props.children);
                    props.getRefinedProducts(props.inward);
                  }}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props?.productInfo?.refinedProducts?.map((refinedProduct) => (
                    refinedProduct.length >= 0 ? <Option key={refinedProduct.length} value={`${refinedProduct.length}`}>
                      {refinedProduct.length}
                    </Option> : <Option key='' value=''></Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Gross Weight">
              {getFieldDecorator("grossWeight", {
                rules: [{ required: false, message: "Enter Gross Weight" }],
              })(
                <AutoComplete
                  placeholder="enter gross weight"
                  dataSource={[]}
                  onChange={
                    props.params !== "" ? (e) => console.log("dfd") : ""
                  }
                  filterOption={(inputValue, option) =>
                    option.props.children
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                />
              )}
            </Form.Item>
            <Form.Item label="Material Desc">
              <TextArea rows={3} value={`${categoryName}-${subCategoryName}-${leafCategoryName}-${brandName}-${uom}-${form}-${grade}-${subGradeName}-${surfaceType}-${coatingType}-${props.inward.thickness}-${props.inward.od}-${props.inward.width}-${props.inward.id}-${props.inward.length}-${props.inward.nb}`} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <div className="ant-row ant-form-item" style={{height: '40px'}}></div>
            <Form.Item label="Sub Grade">
              {getFieldDecorator("subgradeId", {
                rules: [
                  {
                    required: false,
                    message: "Please select a product sub grade!", 
                  },
                ],
              })(
                <Select
                  showSearch
                  placeholder="Select a product sub grade"
                  optionFilterProp="children"
                  onChange={(gradeId, option) => {
                    props.saveMaterialInfo('subGradeName', option.props.children);
                    props.getRefinedProducts(props.inward);
                  }}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props?.productInfo?.productSubGradesList?.map((subGrade) => (
                    <Option key={subGrade.subgradeId} value={`${subGrade.subgradeId}`}>
                      {subGrade.subgradeName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Coating grade gsm">
              {getFieldDecorator("coatingTypeId", {
                rules: [
                  {
                    required: false,
                    message: "Please input the customer name!",
                  },
                ],
              })(
                <Select
                  showSearch
                  placeholder="Select a product coating"
                  optionFilterProp="children"
                  onChange={(gradeId, option) => {
                    props.saveMaterialInfo('coatingType', option.props.children);
                    props.getRefinedProducts(props.inward);
                  }}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props?.productInfo?.productCoatingList?.map((coating) => (
                    <Option key={coating.coatingtypeId} value={`${coating.coatingtypeId}`}>
                      {coating.coatingtype}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Diameter(OD)">
              {getFieldDecorator("od", {
                rules: [
                  {
                    required: false,
                    message: "Please input the customer name!",
                  },
                ],
              })(
                <Select
                  showSearch
                  placeholder="Select an OD"
                  optionFilterProp="children"
                  onChange={(gradeId, option) => {
                    props.saveMaterialInfo('diameter', option.props.children);
                    props.getRefinedProducts(props.inward);
                  }}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props?.productInfo?.refinedProducts?.map((refinedProduct) => (
                    refinedProduct.odiameter >= 0 ? <Option key={refinedProduct.odiameter} value={`${refinedProduct.odiameter}`}>
                      {refinedProduct.odiameter}
                    </Option> : <Option key='' value=''></Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="ID">
              {getFieldDecorator("id", {
                rules: [
                  {
                    required: false,
                    message: "Please input the customer name!",
                  },
                ],
              })(
                <Select
                  showSearch
                  placeholder="Select an ID"
                  optionFilterProp="children"
                  onChange={(gradeId, option) => {
                    props.saveMaterialInfo('materaiId', option.props.children);
                    props.getRefinedProducts(props.inward);
                  }}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props?.productInfo?.refinedProducts?.map((refinedProduct) => (
                    refinedProduct.idiameter >= 0 ? <Option key={refinedProduct.idiameter} value={`${refinedProduct.idiameter}`}>
                      {refinedProduct.idiameter}
                    </Option> : <Option key='' value=''></Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="NB">
              {getFieldDecorator("nb", {
                rules: [
                  {
                    required: false,
                    message: "Please input the customer name!",
                  },
                ],
              })(
                <Select
                  showSearch
                  placeholder="Select NB"
                  optionFilterProp="children"
                  onChange={(gradeId, option) => {
                    props.saveMaterialInfo('nb', option.props.children);
                    props.getRefinedProducts(props.inward);
                  }}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props?.productInfo?.refinedProducts?.map((refinedProduct) => (
                    refinedProduct.nb >= 0 ? <Option key={refinedProduct.nb} value={`${refinedProduct.nb}`}>
                      {refinedProduct.nb}
                    </Option> : <Option key='' value=''></Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Net Weight">
              {getFieldDecorator("netWeight", {
                rules: [
                  {
                    required: false,
                    message: "Please input the customer name!",
                  },
                ],
              })(
                <AutoComplete
                  placeholder="enter net weight"
                  dataSource={[]}
                  onChange={
                    props.params !== "" ? (e) => console.log("dfd") : ""
                  }
                  filterOption={(inputValue, option) =>
                    option.props.children
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row className="gx-mt-4">
          <Col span={24} offset={4} style={{ textAlign: "center" }}>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => props.updateStep(0)}
            >
              <Icon type="left" />
              Back
            </Button>
            <Button type="primary" htmlType="submit">
              Forward
              <Icon type="right" />
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

const mapStateToProps = (state) => ({
  inward: state.inward.inward,
  inwardStatus: state.inward,
  productInfo: state.productInfo,
    material: state.material,
});

const ProductInfo = Form.create({
  onFieldsChange(props, changedFields) {},
  mapPropsToFields(props) {
    return {
        gradeId: Form.createFormField({
            ...props.inward.gradeId,
            value: props.inward.gradeId,
        }),
        subgradeId: Form.createFormField({
            ...props.inward.subgradeId,
            value: props.inward.subgradeId,
        }),
        surfaceType: Form.createFormField({
            ...props.inward.surfaceType,
            value: props.inward.surfaceType,
        }),
        coatingTypeId: Form.createFormField({
            ...props.inward.coatingTypeId,
            value: props.inward.coatingTypeId,
        }),
        thickness: Form.createFormField({
            ...props.inward.thickness,
            value: props.inward.thickness,
        }),
        width: Form.createFormField({
            ...props.inward.width,
            value: props.inward.width,
        }),
        length: Form.createFormField({
            ...props.inward.length,
            value: props.inward.length,
        }),
        grossWeight: Form.createFormField({
            ...props.inward.grossWeight,
            value: props.inward.grossWeight,
        }),
        od: Form.createFormField({
            ...props.inward.od,
            value: props.inward.od,
        }),
        id: Form.createFormField({
            ...props.inward.id,
            value: props.inward.id,
        }),
        nb: Form.createFormField({
            ...props.inward.nb,
            value: props.inward.nb,
        }),
        netWeight: Form.createFormField({
            ...props.inward.netWeight,
            value: props.inward.netWeight,
        }),
    };
  },
  onValuesChange(props, values) {
    props.setInwardDetails({ ...props.inward, ...values });
  },
})(ProductInfoForm);

export default connect(mapStateToProps, {
  setInwardDetails,
  getProductGrades,
  getProductSubGrades,
  getProductSurfaceList,
  getProductCoatingList,
  saveMaterialInfo,
  getRefinedProducts
})(ProductInfo);
