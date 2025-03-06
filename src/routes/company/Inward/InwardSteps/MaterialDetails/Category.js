import React, { useEffect, useState } from "react";
import {
  AutoComplete,
  Form,
  Typography,
  Row,
  Col,
  Button,
  Icon,
  Input,
  Select,
} from "antd";
import { connect } from "react-redux";
import {
  getMaterialCategories,
  setInwardDetails,
  getMaterialSubCategories,
  getLeafCategory,
  getProductBrands,
  getProductsList,
  getProductUOM,
  getProductForm
} from "../../../../../appRedux/actions";

const { Text } = Typography;
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
const CategoryForm = (props) => {
  const { getFieldDecorator } = props.form;
  const [dataSource, setDataSource] = useState([]);
  const { Option } = AutoComplete;

  useEffect(() => {
    props.getMaterialCategories();
  }, []);

  useEffect(() => {
    const options = props.material.categoriesList.map((category) => {
      return (
        <Option key={category.categoryId} value={`${category.categoryId}`}>
          {category.categoryName}
        </Option>
      );
    });
    setDataSource(options);
  }, [props.material.categoriesList]);

  const handleSubmit = (e) => {
    e.preventDefault();
    props.updateStep(1);
    // props.form.validateFields((err, values) => {
    //     if (!err) {
    //
    //     }
    // });
  };

  useEffect(() => {
    console.log(props.material?.subCategoriesList);
  },[props.material])

  return (
    <>
      <h2
        style={{
          width: "100%",
          textAlign: "left",
          borderBottom: "1px solid #000",
          lineHeight: "0.1em",
          margin: "10px 0 20px",
        }}
      >
        <Text style={{ background: "white", padding: "0 10px", size: "20px" }}>
          Category
        </Text>
      </h2>
      <Form
        {...formItemLayout}
        className="ant-material-category-form"
        onSubmit={handleSubmit}
      >
        <Row>
          <Col span={12}>
            <Form.Item label="Material Category">
              {getFieldDecorator("categoryId", {
                rules: [
                  {
                    required: true,
                    message: "Please select a material category !",
                  },
                ],
              })(
                <Select
                  showSearch
                  placeholder="Select a category"
                  optionFilterProp="children"
                  onChange={(categoryId) => {
                    props.getMaterialSubCategories(categoryId);
                  }}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {dataSource}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Sub Category">
              {getFieldDecorator("subcategoryId", {
                rules: [
                  {
                    required: true,
                    message: "Please select SubCategory!",
                  },
                ],
              })(
                <Select
                  showSearch
                  placeholder="Select a sub category"
                  optionFilterProp="children"
                  onChange={(subCategoryId) => {
                    props.getLeafCategory(subCategoryId);
                  }}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props.material?.subCategoriesList?.map((subCategory) => (
                    <Option
                      key={subCategory.subcategoryId}
                      value={`${subCategory.subcategoryId}`}
                    >
                      {subCategory.subcategoryName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="Leaf Category">
              {getFieldDecorator("leafcategoryId", {
                rules: [
                  {
                    required: true,
                    message: "Please input the customer name!",
                  },
                ],
              })(
                <Select
                  showSearch
                  placeholder="Select a leaf category"
                  optionFilterProp="children"
                  onChange={(leafCategoryId) => {
                    props.getProductBrands(leafCategoryId);
                  }}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props.material?.leafCategoriesList?.map((leafCategory) => (
                    <Option
                      key={leafCategory.leafcategoryId}
                      value={`${leafCategory.leafcategoryId}`}
                    >
                      {leafCategory.leafcategoryName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Material Id">
              {getFieldDecorator("materialId", {
                rules: [
                  { required: false, message: "Please select material !" },
                ],
              })(<Input id="customerId" disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <h2
          style={{
            width: "100%",
            textAlign: "left",
            borderBottom: "1px solid #000",
            lineHeight: "0.1em",
            margin: "10px 0 20px",
          }}
        >
          <Text
            style={{ background: "white", padding: "0 10px", size: "20px" }}
          >
            Product Info
          </Text>
        </h2>
        <Row>
        <Col span={12}>
            <Form.Item label="Brand">
              {getFieldDecorator("brandId", {
                rules: [
                  {
                    required: true,
                    message: "Please select a brand!",
                  },
                ],
              })(
                <Select
                  showSearch
                  placeholder="Select a brand"
                  optionFilterProp="children"
                  onChange={(brandId) => {
                    props.getProductsList(brandId);
                  }}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props.productInfo?.brandList?.map((brand) => (
                    <Option
                      key={brand.brandId}
                      value={`${brand.brandId}`}
                    >
                      {brand.brandName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Product Type">
              {getFieldDecorator("productTypeId", {
                rules: [
                  {
                    required: true,
                    message: "Please input the customer name!",
                  },
                ],
              })(
                <Select
                  showSearch
                  placeholder="Select a product type"
                  optionFilterProp="children"
                  onChange={(productId) => {
                    props.getProductUOM(productId);
                    props.getProductForm(productId);
                  }} 
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props.productInfo?.productsList?.map((product) => (
                    <Option
                      key={product.productId}
                      value={`${product.productId}`}
                    >
                      {product.productName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="HSN">
              {getFieldDecorator("partyName", {
                rules: [
                  {
                    required: true,
                    message: "Please input the customer name!",
                  },
                ],
              })(
                <input />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Unit of measure">
              {getFieldDecorator("productUom", {
                rules: [
                  {
                    required: true,
                    message: "Please select a unit of measure!",
                  },
                ],
              })(
                <Select
                  showSearch
                  placeholder="Select a unit of measure"
                  optionFilterProp="children"
                  onChange={(productId) => {
                  }} 
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props.productInfo?.productUomList?.map((uom) => (
                    <Option
                      key={uom.uomId}
                      value={`${uom.uomId}`}
                    >
                      {uom.uomName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="Form">
              {getFieldDecorator("productForm", {
                rules: [
                  {
                    required: true,
                    message: "Please select a product form!",
                  },
                ],
              })(
                <Select
                  showSearch
                  placeholder="Select a product form"
                  optionFilterProp="children"
                  onChange={(productId) => {
                  }} 
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props.productInfo?.productsFormsList?.map((form) => (
                    <Option
                      key={form.formId}
                      value={`${form.formId}`}
                    >
                      {form.formName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row className="gx-mt-4">
          <Col span={24} offset={4} style={{ textAlign: "center" }}>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => props.onPrevStep()}
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
  productInfo: state.productInfo,
  material: state.material,
  inward: state.inward.inward,
});

const Category = Form.create({
  onFieldsChange(props, changedFields) {},
  mapPropsToFields(props) {
    return {
      categoryId: Form.createFormField({
        ...props.inward.categoryId,
        value: props.inward.categoryId,
      }),
      subcategoryId: Form.createFormField({
        ...props.inward.subcategoryId,
        value: props.inward.subcategoryId,
      }),
      leafcategoryId: Form.createFormField({
        ...props.inward.leafcategoryId,
        value: props.inward.leafcategoryId,
      }),
      brandId: Form.createFormField({
        ...props.inward.brandId,
        value: props.inward.brandId,
      }),
      productTypeId: Form.createFormField({
        ...props.inward.productTypeId,
        value: props.inward.productTypeId,
      }),
      productUom: Form.createFormField({
        ...props.inward.productUom,
        value: props.inward.productUom,
      }),
      productForm: Form.createFormField({
        ...props.inward.productForm,
        value: props.inward.productForm,
      }),
    };
  },
  onValuesChange(props, values) {
    props.setInwardDetails({ ...props.inward, ...values });
  },
})(CategoryForm);

export default connect(mapStateToProps, {
  getMaterialCategories,
  setInwardDetails,
  getMaterialSubCategories,
  getLeafCategory,
  getProductBrands,
  getProductsList,
  getProductUOM,
  getProductForm
})(Category);
