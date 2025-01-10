import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Card,
  Divider,
  Table,
  Modal,
  Row,
  Col,
  Form,
  Input,
} from 'antd';
import moment from 'moment';
import SearchBox from '../../../components/SearchBox';

import IntlMessages from '../../../util/IntlMessages';
import {
  fetchMaterialList,
  addMaterial,
  fetchMaterialListById,
  updateMaterial,
  resetMaterial,
} from '../../../appRedux/actions';

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 16 },
  },
};

const Material = props => {
  const [sortedInfo, setSortedInfo] = useState({
    order: 'descend',
    columnKey: 'age',
  });
  const { getFieldDecorator, getFieldValue, getFieldProps } = props.form;
  getFieldDecorator('keys', { initialValue: [0] });
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [viewMaterial, setViewMaterial] = useState(false);
  const [editMaterial, setEditMaterial] = useState(false);
  const [viewMaterialData, setViewMaterialData] = useState({});
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [filteredInwardList, setFilteredInwardList] = useState(
    props.material?.materialList || [],
  );

  const keys = getFieldValue('keys');

  const columns = [
    {
      title: 'S No',
      dataIndex: 'matId',
      key: 'matId',
      filters: [],
      sorter: (a, b) => {
        return a.matId - b.matId;
      },
      sortOrder: sortedInfo.columnKey === 'matId' && sortedInfo.order,
    },
    {
      title: 'Material Code',
      dataIndex: 'materialCode',
      key: 'materialCode',
      filters: [],
      sorter: (a, b) => {
        return a.materialCode - b.materialCode;
      },
      sortOrder: sortedInfo.columnKey === 'materialCode' && sortedInfo.order,
    },
    {
      title: 'HSN Code',
      dataIndex: 'hsnCode',
      key: 'hsnCode',
      filters: [],
      sorter: (a, b) => {
        return a.hsnCode - b.hsnCode;
      },
      sortOrder: sortedInfo.columnKey === 'hsnCode' && sortedInfo.order,
    },
    {
      title: 'Material Date',
      dataIndex: 'createdOn',
      render: value => {
        return moment(value).format('Do MMM YYYY');
      },
      key: 'createdOn',
      filters: [],
      sorter: (a, b) => a.createdOn.length - b.createdOn.length,
      sortOrder: sortedInfo.columnKey === 'createdOn' && sortedInfo.order,
    },
    {
      title: 'Material',
      dataIndex: 'description',
      key: 'description',
      filteredValue: filteredInfo ? filteredInfo['description'] : null,
      filters: [
        ...new Set(props.material.materialList.map(item => item.description)),
      ].map(material => {
        return { text: material || '', value: material || '' };
      }),
      onFilter: (value, record) => record.description === value,
      sorter: (a, b) => a.description?.length - b.description?.length,
      sortOrder: sortedInfo.columnKey === 'description' && sortedInfo.order,
    },
    {
      title: 'Material Grade',
      dataIndex: 'materialGrade',
      key: 'materialGrade',
      render: value => {
        const grade = value.map(grade => {
          return grade.gradeName;
        });
        return grade.toString();
      },
      sorter: (a, b) => a.materialGrade?.length - b.materialGrade?.length,
      sortOrder: sortedInfo.columnKey === 'materialGrade' && sortedInfo.order,
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text, record, index) => (
        <span>
          <span className="gx-link" onClick={e => onView(record, e)}>
            View
          </span>
          <Divider type="vertical" />
          <span className="gx-link" onClick={e => onEdit(record, e)}>
            Edit
          </span>
          <Divider type="vertical" />
          <span className="gx-link" onClick={() => {}}>
            Delete
          </span>
        </span>
      ),
    },
  ];

  const onView = (record, e) => {
    e.preventDefault();
    setViewMaterialData(record);
    setViewMaterial(true);
  };

  const onDelete = (record, key, e) => {
    let id = [];
    id.push(record.inwardEntryId);
    e.preventDefault();
    props.deleteInwardEntryById(id);
    console.log(record, key);
  };
  const onEdit = (record, e) => {
    e.preventDefault();
    props.fetchMaterialListById(record.matId);
    setEditMaterial(true);
    setTimeout(() => {
      setShowAddMaterial(true);
    }, 1000);
  };

  useEffect(() => {
    setTimeout(() => {
      props.fetchMaterialList();
    }, 1000);
  }, [showAddMaterial]);

  useEffect(() => {
    const { loading, error, materialList } = props.material;
    if (!loading && !error) {
      setFilteredInwardList(materialList);
    }
  }, [props.material]);

  useEffect(() => {
    const { material } = props;
    if (searchValue) {
      const filteredData = material?.materialList?.filter(material => {
        if (
          material.matId.toString() === searchValue ||
          material.description
            ?.toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          material.materialGrade?.includes(searchValue)
        ) {
          return material;
        }
      });
      setFilteredInwardList(filteredData);
    } else {
      setFilteredInwardList(material.materialList);
    }
  }, [searchValue]);

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    setFilteredInfo(filters);
  };

  const clearFilters = () => {
    setFilteredInfo(null);
  };

  const clearAll = () => {
    setSortedInfo(null);
    setFilteredInfo(null);
  };

  const exportSelectedData = () => {};

  const deleteSelectedCoils = () => {
    console.log('dfd');
  };

  const addNewKey = idx => {
    const { form } = props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(idx + 1);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  const removeKey = k => {
    const { form } = props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const grade = form.getFieldValue('grade');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter((key, idx) => idx !== k),
      grade: grade.filter((key, idx) => idx !== k),
    });
  };

  return (
    <div>
      <h1>
        <IntlMessages id="sidebar.company.materialList" />
      </h1>
      <Card>
        <div className="gx-flex-row gx-flex-1">
          <div className="table-operations gx-col">
            <Button onClick={deleteSelectedCoils}>Delete</Button>
            <Button onClick={exportSelectedData}>Export</Button>
            <Button onClick={clearFilters}>Clear All filters</Button>
          </div>
          <div className="gx-flex-row gx-w-50">
            <Button
              type="primary"
              icon={() => <i className="icon icon-add" />}
              size="default"
              onClick={() => {
                props.form.resetFields();
                props.resetMaterial();
                setShowAddMaterial(true);
              }}
            >
              Add Material
            </Button>
            <SearchBox
              styleName="gx-flex-1"
              placeholder="Search for material or material grade..."
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
            />
          </div>
        </div>
        <Table
          rowSelection={[]}
          className="gx-table-responsive"
          columns={columns}
          dataSource={filteredInwardList}
          onChange={handleChange}
        />

        <Modal
          title="Material Details"
          visible={viewMaterial}
          onCancel={() => setViewMaterial(false)}
          onOk={() => setViewMaterial(false)}
          width={600}
        >
          <Card>
            <Row>
              <Col span={24}>
                <Card>
                  {viewMaterialData?.description && (
                    <p>
                      <strong>Material Type :</strong>{' '}
                      {viewMaterialData.description}
                    </p>
                  )}
                  {viewMaterialData?.materialGrade && (
                    <p>
                      <strong>Material Grade :</strong>{' '}
                      {viewMaterialData?.materialGrade?.reduce(
                        (acc, grade, index, arr) =>
                          acc.concat(
                            `${grade.gradeName}${index === arr.length - 1 ? '' : ','} `,
                          ),
                        '',
                      )}
                    </p>
                  )}
                </Card>
              </Col>
            </Row>
          </Card>
        </Modal>

        <Modal
          title="Add Material"
          visible={showAddMaterial}
          onOk={e => {
            e.preventDefault();
            if (editMaterial) {
              props.form.validateFields((err, values) => {
                if (!err) {
                  console.log('Received values of form: ', values);
                  const data = { values, id: props.material?.material?.matId };
                  props.updateMaterial(data);
                  setEditMaterial(false);
                  setShowAddMaterial(false);
                }
              });
              props.form.resetFields();
            } else {
              props.form.validateFields((err, values) => {
                if (!err) {
                  console.log('Received values of form: ', values);
                  props.addMaterial(values);
                  setShowAddMaterial(false);
                }
              });
              props.form.resetFields();
            }
          }}
          width={600}
          onCancel={() => {
            props.resetMaterial();
            props.form.resetFields();
            setShowAddMaterial(false);
            setEditMaterial(false);
          }}
        >
          <Card className="gx-card">
            <Row>
              <Col
                lg={24}
                md={24}
                sm={24}
                xs={24}
                className="gx-align-self-center"
              >
                <Form {...formItemLayout} className="gx-pt-4">
                  <Form.Item label="Material Description">
                    {getFieldDecorator('description', {
                      rules: [
                        { required: true, message: 'Please enter description' },
                      ],
                    })(<Input id="description" {...getFieldProps} />)}
                  </Form.Item>

                  {keys.map((k, index) => {
                    return (
                      <Form.Item label="Grade">
                        {getFieldDecorator(`grade[${index}]`, {
                          initialValue:
                            props.material?.material?.materialGrade?.map(
                              material => material.gradeName,
                            )[index] || [],
                          rules: [
                            {
                              required: true,
                              message: 'Please enter grade details',
                            },
                          ],
                        })(<Input id="grade" {...getFieldProps} />)}
                        {keys.length - 1 > 0 && (
                          <i
                            className="icon icon-trash gx-margin"
                            onClick={() => removeKey(index)}
                          />
                        )}
                        {index == keys.length - 1 && (
                          <i
                            className="icon icon-add-circle"
                            onClick={() => addNewKey(index)}
                          />
                        )}
                      </Form.Item>
                    );
                  })}

                  <Form.Item label="Material Code">
                    {getFieldDecorator('materialCode', {
                      rules: [
                        {
                          required: false,
                          message: 'Please enter material code',
                        },
                      ],
                    })(<Input id="materialCode" {...getFieldProps} />)}
                  </Form.Item>
                  <Form.Item label="HSN Code">
                    {getFieldDecorator('hsnCode', {
                      rules: [
                        { required: true, message: 'Please enter HSN code' },
                      ],
                    })(<Input id="hsnCode" {...getFieldProps} />)}
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Card>
        </Modal>
      </Card>
    </div>
  );
};

const mapStateToProps = state => ({
  material: state.material,
});

const addMaterialForm = Form.create({
  mapPropsToFields(props) {
    const grade = props.material?.material?.materialGrade?.map(
      material => material.gradeName,
    );
    return {
      description: Form.createFormField({
        value: props.material?.material?.description || '',
      }),
      grade: Form.createFormField({
        value: grade || [],
      }),
      keys: Form.createFormField({
        value: grade || [0],
      }),
      materialCode: Form.createFormField({
        value: props.material?.material?.materialCode || '',
      }),
      hsnCode: Form.createFormField({
        value: props.material?.material?.hsnCode || '',
      }),
    };
  },
})(Material);

export default connect(mapStateToProps, {
  fetchMaterialList,
  addMaterial,
  fetchMaterialListById,
  updateMaterial,
  resetMaterial,
})(addMaterialForm);
