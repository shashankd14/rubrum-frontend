import React, { useEffect, useState, useCallback } from "react";
import { useIntl } from "react-intl";
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
  saveMaterialInfo,
  searchByMaterialId,
  enableMaterialSelection,
  getRefinedProducts,
} from "../../../../../appRedux/actions";
import { debounce } from "lodash";
import TextArea from "antd/lib/input/TextArea";

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

const { Option } = AutoComplete;
const { Text } = Typography;

const baseUrl = process.env.REACT_APP_BASE_URL;
export const getUserToken = () => {
  return `Bearer ${localStorage.getItem("userToken") || ""}`;
};
const getHeaders = () => ({
  Authorization: getUserToken(),
});

const checkIfCoilExistsApi = async (coilNumber) => {
  try {
    const res = await fetch(
      `${baseUrl}api/inwardEntry/isCoilPresent?coilNumber=${coilNumber}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );
    // Assume API returns { exists: true/false }
    return await res.json();
  } catch (err) {
    console.error("Error checking coil:", err);
    return false; // default to false if API fails
  }
};

const CategoryForm = (props) => {
  const { getFieldDecorator } = props.form;
  const [dataSource, setDataSource] = useState([]);
  const intl = useIntl();
  const didFetchCategories = React.useRef(false);

  useEffect(() => {
    if (didFetchCategories.current) return;
    props.getMaterialCategories();
    didFetchCategories.current = true;
  }, [props.getMaterialCategories]);

  useEffect(() => {
    const options = props.material.categoriesList.map((category) => {
      return (
        <Option key={category.categoryId} value={`${category.categoryId}`}>
          {category.categoryName}
        </Option>
      );
    });
    setDataSource(options);
  }, [props.material?.categoriesList]);

  useEffect(() => {
    if (!props.inward.materialId && props.inward.disableSelection) {
      props.form.resetFields();
      props.enableMaterialSelection();
    }
  }, [props.inward?.materialId, props.inward?.disableSelection]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          props.setInwardDetails({ ...props.inward, ...values });
          props.updateStep(1);
        }
      });
    },
    [props]
  );

  const onCategoryChange = useCallback(
    (categoryId, categoryName) => {
      props.form.setFieldsValue({
        subcategoryId: null,
        leafcategoryId: null,
      });

      props.getRefinedProducts({ categoryId: categoryId }, "subCategory", {
        ...props.inward,
        categoryId: categoryId,
        subcategoryId: null,
        leafcategoryId: null,
        brandId: null,
        productTypeId: null,
        productUom: null,
        productForm: null,
        hsn: "",
        materialId: "",
      });
    },
    [props.form, props.getRefinedProducts, props.inward]
  );

  const debouncedCheck = debounce(async (resolve, reject, value) => {
    try {
      const exists = await checkIfCoilExistsApi(value);
      if (exists)
        reject(
          intl.formatMessage({ id: "inward.create.label.inwardAlreadyExists" })
        );
      else resolve();
    } catch (err) {
      reject("Error checking coil");
    }
  }, 500);

  const checkIfCoilExists = (rule, value) => {
    return new Promise((resolve, reject) => {
      debouncedCheck(resolve, reject, value);
    });
  };

  return (
    <>
      <Form
        {...formItemLayout}
        className="ant-material-category-form"
        onSubmit={handleSubmit}
      >
        <Row>
          <Col span={12}>
            <Form.Item label="Material Id">
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "100%" }}>
                  {getFieldDecorator("materialId", {
                    rules: [
                      { required: false, message: "Please select material !" },
                    ],
                  })(
                    <Select
                      mode="combobox"
                      style={{ width: "100%" }}
                      optionLabelProp="label"
                      labelInValue={true}
                      notFoundContent={null}
                      showSearch={true}
                      showArrow={true}
                      allowClear={true}
                      placeholder="Select a material"
                      optionFilterProp="children"
                      onSelect={(materialId, option) => {
                        props.searchByMaterialId(materialId?.key);
                      }}
                      onSearch={(value) => {
                        if (value) props.searchByMaterialId(value);
                      }}
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {props.inwardStatus?.materialList?.length > 0 &&
                        props.inwardStatus?.materialList?.map((material) => (
                          <Option
                            key={material.sku}
                            value={material.sku}
                            label={material.sku}
                          >
                            {material.sku}
                          </Option>
                        ))}
                    </Select>
                  )}
                </div>
              </div>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Batch number">
              {getFieldDecorator("coilNumber", {
                rules: [
                  { required: true, message: "Please enter batch number !" },
                  { validator: checkIfCoilExists },
                ],
                validateTrigger: "onBlur",
              })(<Input placeholder="enter batch number" id="validating" />)}
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
            Category
          </Text>
        </h2>
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
                  disabled={props.inward.disableSelection}
                  showSearch
                  placeholder="Select a category"
                  optionFilterProp="children"
                  onSelect={(categoryId, option) => {
                    onCategoryChange(categoryId, option.props.children);
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
                  disabled={props.inward.disableSelection}
                  showSearch
                  placeholder="Select a sub category"
                  optionFilterProp="children"
                  onSelect={(subCategoryId, option) => {
                    props.saveMaterialInfo(
                      "subCategoryName",
                      option.props.children
                    );
                    props.getRefinedProducts(
                      { ...props.inward, subcategoryId: subCategoryId },
                      "leafCategory"
                    );
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
                      {subCategory.subcategoryIdName}
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
                    message: "Please select the leaf category!",
                  },
                ],
              })(
                <Select
                  disabled={props.inward.disableSelection}
                  showSearch
                  placeholder="Select a leaf category"
                  optionFilterProp="children"
                  onSelect={(leafCategoryId, option) => {
                    props.saveMaterialInfo(option.props.children);
                    props.getRefinedProducts(
                      { ...props.inward, leafcategoryId: leafCategoryId },
                      "brand"
                    );
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
                  disabled={props.inward.disableSelection}
                  showSearch
                  placeholder="Select a brand"
                  optionFilterProp="children"
                  onSelect={(brandId, option) => {
                    props.saveMaterialInfo("brandName", option.props.children);
                    props.getRefinedProducts(
                      { ...props.inward, brandId: brandId },
                      "productType"
                    );
                  }}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props.productInfo?.brandList?.map((brand) => (
                    <Option key={brand.brandId} value={brand.brandId}>
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
                    message: "Please select the product type!",
                  },
                ],
              })(
                <Select
                  disabled={props.inward.disableSelection}
                  showSearch
                  placeholder="Select a product type"
                  optionFilterProp="children"
                  onSelect={(productId, option) => {
                    props.saveMaterialInfo(
                      "productType",
                      option.props.children
                    );
                    props.getRefinedProducts(
                      { ...props.inward, productTypeId: productId },
                      "uom"
                    );
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
              <Input id="productTypeId" disabled value={props?.inward?.hsn} />
            </Form.Item>
          </Col>
          {props.inward.disableSelection ? (
            <Col span={12}>
              <Form.Item label="Material Description">
                <TextArea id="productTypeId" disabled value={props?.productInfo?.refinedProducts?.length &&
                  !props.material.displayInfo > 0
                    ? props?.productInfo?.refinedProducts[0]?.mmDescription
                    : props.material.displayInfo.mmDescription}>
                </TextArea>
              </Form.Item>
            </Col>
          ) : null}
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="Form">
              {getFieldDecorator("productForm", {
                rules: [
                  {
                    required: false,
                    message: "Please select a product form!",
                  },
                ],
              })(
                <Select
                  disabled={props.inward.disableSelection}
                  showSearch
                  placeholder="Select a product form"
                  optionFilterProp="children"
                  onSelect={(productId, option) => {
                    props.saveMaterialInfo("form", option.props.children);
                    props.getRefinedProducts({
                      ...props.inward,
                      productForm: productId,
                    });
                  }}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {[
                    { formId: "21", formName: "Sheet" },
                    { formId: "22", formName: "Coil" },
                  ].map((form) => (
                    <Option key={form.formId} value={form.formId}>
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
            <Button
              onClick={() => {
                props.setInwardDetails({
                  ...props.inward,
                  categoryId: "",
                  productTypeId: "",
                  productUom: "",
                  productForm: "",
                  hsn: "",
                  gradeId: "",
                  subgradeId: "",
                  surfaceType: "",
                  coatingTypeId: "",
                  thickness: "",
                  width: "",
                  length: "",
                  od: "",
                  id: "",
                  disableSelection: false,
                });
                props.getRefinedProducts(props.inward, "productType");
              }}
            >
              Clear form
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
  inwardStatus: state.inward,
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
      hsn: Form.createFormField({
        ...props.inward.hsn,
        value: props.inward.hsn,
      }),
      materialId: Form.createFormField({
        ...props.inward.materialId,
        value: props.inward.materialId,
      }),
      coilNumber: Form.createFormField({
        ...props.inward.coilNumber,
        value: props.inward.coilNumber,
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
  saveMaterialInfo,
  searchByMaterialId,
  enableMaterialSelection,
  getRefinedProducts,
})(Category);
