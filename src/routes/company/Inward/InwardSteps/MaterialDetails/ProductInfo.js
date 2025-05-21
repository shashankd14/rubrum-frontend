import React, { useEffect } from "react";
import {
  AutoComplete,
  Button,
  Col,
  Form,
  Icon,
  Row,
  Input,
  Select,
} from "antd";
import { connect } from "react-redux";
import {
  getProductSubGrades,
  setInwardDetails,
  getProductGrades,
  getProductSurfaceList,
  getProductCoatingList,
  saveMaterialInfo,
  getRefinedProducts,
  getRefinedProductsFinal
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

  const handleSubmit = (e) => {
    if(!props.inward.disableSelection) 
      props.getRefinedProductsFinal({...props.inward, materialForm : props.material.displayInfo.form});

    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        props.updateStep(2);
      }
    });
  };

  useEffect(() => {
    if (!props.inward.disableSelection) {
      props.getRefinedProducts(props.inward, 'grade');
    }
  }, []);

  useEffect(() => {
    if(props.inward.width && props.inward.thickness && props.inward.netWeight && (props.inward.productForm === '22' || props.material.displayInfo.form === 'Coil' || props.inward.productForm === 'Coil')) {
      if (!props.inward.disableSelection) {
        props.getRefinedProductsFinal({...props.inward, materialForm : props.material.displayInfo.form});
      }
      props.setInwardDetails({...props.inward,'length':(parseFloat(parseFloat(props.inward.netWeight)/(parseFloat(props.inward.thickness)*7.85*(props.inward.width/1000))).toFixed(4))*1000});   
    }
  }, [props.inward.width, props.inward.thickness, props.inward.netWeight]);

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
              <Input
                id="productTypeId"
                disabled
                value={props.material.displayInfo.productType}
              />
            </Form.Item>
            <Form.Item label="Grade">
              {getFieldDecorator("gradeId", {
                rules: [{ required: false, message: "Select a product grade" }],
              })(
                <Select
                  disabled={props.inward.disableSelection}
                  showSearch
                  placeholder="Select a product grade"
                  optionFilterProp="children"
                  onChange={(gradeId, option) => {
                    props.saveMaterialInfo("grade", option.props.children);
                    props.setInwardDetails({
                      ...props.inward, gradeId: gradeId});
                    props.getRefinedProducts({...props.inward, gradeId: gradeId}, 'subgrade');
                  }}
                  filterOption={(input, option) =>
                    option.props.children.toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props.productInfo?.productGradesList?.map((grade) => (
                    <Option key={grade.gradeId} value={grade.gradeId}>
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
                  defaultActiveFirstOption={true}
                  disabled={props.inward.disableSelection}
                  showSearch
                  placeholder="Select a surface type"
                  optionFilterProp="children"
                  onChange={(gradeId, option) => {
                    // props.getProductSubGrades(gradeId);
                    props.saveMaterialInfo(
                      "surfaceType",
                      option.props.children
                    );
                    props.getRefinedProducts(props.inward, 'coating');
                  }}
                  filterOption={(input, option) =>
                    option.props.children.toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props.productInfo?.productSurfaceList?.map((surface) => (
                    <Option key={surface.surfacetypeId} value={`${surface.surfacetypeId}`}>
                      {surface.surfacetype}
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
                  defaultActiveFirstOption={true}
                  disabled={props.inward.disableSelection}
                  showSearch
                  placeholder="Select thickness"
                  optionFilterProp="children"
                  onChange={(gradeId, option) => {
                    props.saveMaterialInfo("thickness", option.props.children);
                    props.getRefinedProducts(props.inward, 'od');
                  }}
                  filterOption={(input, option) =>
                    option.props?.children?.toString()
                      ?.toLowerCase()
                      ?.indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props?.productInfo?.thickness?.map((thickness, index) =>
                    thickness >= 0 ? (
                      <Option
                      key={`${thickness}${index}`}
                        value={`${thickness}`}
                      >
                        {thickness}
                      </Option>
                    ) : (
                      <Option key="" value=""></Option>
                    )
                  )}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Width (mm)">
              {getFieldDecorator("width", {
                rules: [{ required: false, message: "Enter Width" }],
              })(
                <Select
                  defaultActiveFirstOption={true}
                  disabled={props.inward.disableSelection}
                  showSearch
                  placeholder="Select a width"
                  optionFilterProp="children"
                  onChange={(gradeId, option) => {
                    props.saveMaterialInfo("width", option.props.children);
                    props.getRefinedProducts(props.inward, 'id');
                  }}
                  filterOption={(input, option) =>
                    option.props.children.toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props?.productInfo?.widths?.map((width) =>
                    width >= 0 ? (
                      <Option
                      key={width}
                      value={width}
                      >
                        {width}
                      </Option>
                    ) : (
                      <Option key="" value=""></Option>
                    )
                  )}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Length (mm)">
              {getFieldDecorator("length", {
                rules: [{ required: false, message: "Enter Length" }],
              })(
                <Select
                  defaultActiveFirstOption={true}
                  disabled={props.inward.disableSelection}
                  showSearch
                  placeholder="Select a length"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props?.productInfo?.lengths?.map((length, index) =>
                    length >= 0 ? (
                      <Option
                        key={`${length}${index}`}
                        value={`${length}`}
                      >
                        {length}
                      </Option>
                    ) : (
                      <Option key="" value=""></Option>
                    )
                  )}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Gross Weight (in kgs)">
              {getFieldDecorator("grossWeight", {
                rules: [{ required: true, message: "Enter Gross Weight" }],
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
              <TextArea
                rows={3}
                value={props.material.displayInfo.mmDescription}
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <div
              className="ant-row ant-form-item"
              style={{ height: "40px" }}
            ></div>
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
                  defaultActiveFirstOption={true}
                  disabled={props.inward.disableSelection}
                  showSearch
                  placeholder="Select a product sub grade"
                  optionFilterProp="children"
                  onChange={(gradeId, option) => {
                    props.saveMaterialInfo(
                      "subGradeName",
                      option.props.children
                    );
                    props.getRefinedProducts(props.inward, 'surface');
                  }}
                  filterOption={(input, option) =>
                    option.props.children.toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props?.productInfo?.productSubGradesList?.map((subGrade) => (
                    <Option
                      key={subGrade.subgradeId}
                      value={subGrade.subgradeId}
                    >
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
                    message: "Please input the location name!",
                  },
                ],
              })(
                <Select
                  defaultActiveFirstOption={true}
                  disabled={props.inward.disableSelection}
                  showSearch
                  placeholder="Select a product coating"
                  optionFilterProp="children"
                  onChange={(gradeId, option) => {
                    props.saveMaterialInfo(
                      "coatingType",
                      option.props.children
                    );
                    props.getRefinedProducts(props.inward, 'thickness');
                  }}
                  filterOption={(input, option) =>
                    option.props.children.toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props?.productInfo?.productCoatingList?.map((coating) => (
                    <Option
                      key={coating.coatingtypeId}
                      value={`${coating.coatingtypeId}`}
                    >
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
                    message: "Please input the location name!",
                  },
                ],
              })(
                <Select
                  defaultActiveFirstOption={true}
                  disabled={props.inward.disableSelection}
                  showSearch
                  placeholder="Select an OD"
                  optionFilterProp="children"
                  onChange={(gradeId, option) => {
                    props.saveMaterialInfo("diameter", option.props.children);
                    props.getRefinedProducts(props.inward, 'id');
                  }}
                  filterOption={(input, option) =>
                    option.props.children.toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props?.productInfo?.od?.map((od, index) =>
                    od >= 0 ? (
                      <Option
                        key={`${od}${index}`}
                        value={od}
                      >
                        {od}
                      </Option>
                    ) : (
                      <Option key="" value=""></Option>
                    )
                  )}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="ID">
              {getFieldDecorator("id", {
                rules: [
                  {
                    required: false,
                    message: "Please input the location name!",
                  },
                ],
              })(
                <Select
                  defaultActiveFirstOption={true}
                  disabled={props.inward.disableSelection}
                  showSearch
                  placeholder="Select an ID"
                  optionFilterProp="children"
                  onChange={(gradeId, option) => {
                    props.saveMaterialInfo("idiameter", option.props.children);
                    props.getRefinedProducts(props.inward, 'length');
                  }}
                  filterOption={(input, option) =>
                    option.props.children.toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props?.productInfo?.id?.map((idiameter, index) =>
                    idiameter >= 0 ? (
                      <Option
                        key={`${idiameter}${index}`}
                        value={`${idiameter}`}
                      >
                        {idiameter}
                      </Option>
                    ) : (
                      <Option key="" value=""></Option>
                    )
                  )}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="NB">
              {getFieldDecorator("nb", {
                rules: [
                  {
                    required: false,
                    message: "Please input the location name!",
                  },
                ],
              })(
                <Select
                  defaultActiveFirstOption={true}
                  disabled={props.inward.disableSelection}
                  showSearch
                  placeholder="Select NB"
                  optionFilterProp="children"
                  onChange={(gradeId, option) => {
                    props.saveMaterialInfo("nb", option.props.children);
                    props.getRefinedProducts(props.inward);
                  }}
                  filterOption={(input, option) =>
                    option.props.children.toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props?.productInfo?.nb?.map((nb, index) =>
                    nb >= 0 ? (
                      <Option
                      key={`${nb}${index}`}
                      value={`${nb}`}
                      >
                        {nb}
                      </Option>
                    ) : (
                      <Option key="" value=""></Option>
                    )
                  )}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Net Weight (in kgs)">
              {getFieldDecorator("netWeight", {
                rules: [
                  {
                    required: true,
                    message: "Please enter net weight !",
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
  getRefinedProducts,
  getRefinedProductsFinal
})(ProductInfo);
