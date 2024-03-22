import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Checkbox} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchMaterialList, addMaterial, fetchMaterialListById, updateMaterial, resetMaterial } from "../../../appRedux/actions";
import { onDeleteContact } from "../../../appRedux/actions";
import '../../../styles/components/Master/MaterialDV.css';

export const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 8},
        ml: {span: 8},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 16},
        lg: {span: 16},
    },
};

const MaterialDV = (props) => {

    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    const { getFieldDecorator, getFieldValue, getFieldProps } = props.form;
    getFieldDecorator('keys', {initialValue: [0]});
    const [showAddMaterial, setShowAddMaterial] = useState(false);
    const [viewMaterial, setViewMaterial] = useState(false);
    const [editMaterial, setEditMaterial] = useState(false);
    const [viewMaterialData, setViewMaterialData] = useState({});
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [filteredInwardList, setFilteredInwardList] = useState(props.material?.materialList || []);

    const keys = getFieldValue('keys');

    const columns = [{
        title: 'Sr. No',
        dataIndex: 'matId',
        key: 'matId',
        filters: [],
        sorter: (a, b) => {
            return a.matId - b.matId
        },
        sortOrder: sortedInfo.columnKey === 'matId' && sortedInfo.order,
    },
    {
        title: 'Material Code',
        dataIndex: 'materialCode',
        key: 'materialCode',
        filters: [],
        sorter: (a, b) => {
            return a.materialCode - b.materialCode
        },
        sortOrder: sortedInfo.columnKey === 'materialCode' && sortedInfo.order,
    },
    {
        title: 'HSN Code',
        dataIndex: 'hsnCode',
        key: 'hsnCode',
        filters: [],
        sorter: (a, b) => {
            return a.hsnCode - b.hsnCode
        },
        sortOrder: sortedInfo.columnKey === 'hsnCode' && sortedInfo.order,
    },
    {
        title: 'Material Date',
        dataIndex: 'createdOn',
        render: (value) => {
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
        filteredValue: filteredInfo ? filteredInfo["description"] : null,
        filters: [...new Set(props.material.materialList.map(item => item.description))].map(material => {
            return ({ text: material || '', value: material || '' })}),
        onFilter: (value, record) => record.description == value,
        sorter: (a, b) => a.description?.length - b.description?.length,
        sortOrder: sortedInfo.columnKey === 'description' && sortedInfo.order,
    },
    {
        title: 'Material Grade',
        dataIndex: 'materialGrade',
        key: 'materialGrade',
        render: (value) => {
            const grade = value.map((grade) => {
                return grade.gradeName
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
                <span className="gx-link" onClick={(e) => onView(record, e)}>View</span>
                <Divider type="vertical"/>
                <span className="gx-link" onClick={(e) => onEdit(record,e)}>Edit</span>
                <Divider type="vertical"/>
                <span className="gx-link"onClick={() => {}}>Delete</span>
            </span>
        ),
    },
    ];

    const onView = (record, e) => {
        e.preventDefault();
        setViewMaterialData(record);
        setViewMaterial(true);
    }

    const onDelete = (record,key, e) => {
        let id = []
        id.push(record.inwardEntryId);
        e.preventDefault();
        props.deleteInwardEntryById(id)
        console.log(record,key)
      }
    const onEdit = (record,e)=>{
        e.preventDefault();
        props.fetchMaterialListById(record.matId);
        setEditMaterial(true);
        setTimeout(() => {
            setShowAddMaterial(true);
        }, 1000);
                
    }

    useEffect(() => {
        setTimeout(() => {
            props.fetchMaterialList();
        }, 1000);
    }, [showAddMaterial]);

    useEffect(() => {
        const { loading, error, materialList } = props.material;
        if (!loading && !error) {
            setFilteredInwardList(materialList)
        }
    }, [props.material]);

    useEffect(() => {
        const { material } = props;
        if(searchValue) {
            const filteredData = material?.materialList?.filter((material) => {
                if(material.matId.toString() === searchValue ||
                    material.description?.toLowerCase().includes(searchValue.toLowerCase()) ||
                    material.materialGrade?.includes(searchValue)) {
                    return material;
                }
            });
            setFilteredInwardList(filteredData);
        } else {
            setFilteredInwardList(material.materialList);
        }
    }, [searchValue])

    const handleChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
        setFilteredInfo(filters)
    };

    const clearFilters = () => {
        setFilteredInfo(null);
    };

    const clearAll = () => {
        setSortedInfo(null);
        setFilteredInfo(null);
    };

    const exportSelectedData = () => {

    }

    const deleteSelectedCoils = () => {
        console.log('dfd');
    };

    const addNewKey = (idx) => {
        const {form} = props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(idx+1);
        form.setFieldsValue({
            keys: nextKeys
        });
    }

    const removeKey = (k) => {
        const {form} = props;
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
            grade: grade.filter((key, idx) => idx !== k)
        });
    }

    return (
        <div>
            <h1><IntlMessages id="sidebar.company.materialList"/></h1>
            <Card>
                <div className="gx-flex-row gx-flex-1">
                    <div className="table-operations gx-col">
                        <Button onClick={deleteSelectedCoils}>Delete</Button>
                        <Button onClick={exportSelectedData}>Export</Button>
                        <Button onClick={clearFilters}>Clear All filters</Button>
                    </div>
                    <div className="gx-flex-row gx-w-50">
                        <Button type="primary" icon={() => <i className="icon icon-add"/>} size="default"
                                onClick={() => {
                                    props.form.resetFields();
                                    props.resetMaterial();
                                    setShowAddMaterial(true);
                                }}
                        >Add Material</Button>
                        <SearchBox styleName="gx-flex-1" placeholder="Search for material or material grade..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                    </div>
                </div>
                <Table rowSelection={[]}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={filteredInwardList}
                    onChange={handleChange}
                />

                <Modal
                    title='Material Details'
                    visible={viewMaterial}
                    onCancel={() => setViewMaterial(false)}
                    onOk={() => setViewMaterial(false)}
                    width={600}
                >
                    <Card>
                        <Row>
                            <Col span={24}>
                                <Card>
                                    {viewMaterialData?.description && <p><strong>Material Type :</strong> {viewMaterialData.description}</p>}
                                    {viewMaterialData?.materialGrade && <p><strong>Material Grade :</strong> {viewMaterialData?.materialGrade?.reduce((acc, grade, index, arr) => acc.concat(`${grade.gradeName}${index === arr.length - 1 ? '' : ','} `), '')}</p>}
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Modal>

                <Modal
                    title='Add Material'
                    visible={showAddMaterial}
                    onOk={(e) => {
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
                    width={900}
                    onCancel={() => {
                        props.resetMaterial();
                        props.form.resetFields();
                        setShowAddMaterial(false);
                        setEditMaterial(false)

                    }}
                >
                    <Card className="gx-card">
                        <Form {...formItemLayout} className="gx-pt-4">
                        <Row>
                            <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                                    
                                    <Form.Item label="Item Name" >
                                        {getFieldDecorator('itemName', {
                                            rules: [{ required: true, message: 'Please enter Item Name' }],
                                            })(
                                            <Input id="itemName" {...getFieldProps}/>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Item Code" >
                                        {getFieldDecorator('itemCode', {
                                            rules: [{ required: true, message: 'Please enter item code' }],
                                            })(
                                            <Input id="itemCode" {...getFieldProps}/>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Item HSN Code" >
                                        {getFieldDecorator('hsnCode', {
                                            rules: [{ required: true, message: 'Please enter HSN code' }],
                                            })(
                                            <Input id="hsnCode" {...getFieldProps}/>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Item Grade" >
                                        {getFieldDecorator('itemGrade', {
                                            rules: [{ required: true, message: 'Please enter item grade' }],
                                            })(
                                            <Input id="itemGrade" {...getFieldProps}/>
                                        )}
                                    </Form.Item>
                                    
                                    {/*                                     
                                    {keys.map((k, index) => {
                                        return (
                                            <Form.Item label="Grade">
                                                {getFieldDecorator(`grade[${index}]`, {
                                                    initialValue: props.material?.material?.materialGrade?.map(material => material.gradeName)[index] || [],
                                                    rules: [{ required: true, message: 'Please enter grade details' }]
                                                    })(
                                                    <Input id="grade" {...getFieldProps}/>
                                                )}
                                                {keys.length-1 > 0 && <i className="icon icon-trash gx-margin" onClick={() => removeKey(index)}/> }
                                                {index == keys.length-1 && <i className="icon icon-add-circle" onClick={() => addNewKey(index)}/> }
                                            </Form.Item>
                                        )})} */}

                                    <Form.Item label="Item sub category" >
                                        <Col lg={12} md={12}>
                                        {getFieldDecorator('subCategory', {
                                            rules: [{ required: false, message: 'Please enter Item sub category' }],
                                            })(
                                            <Input id="subCategory" {...getFieldProps}/>
                                        )}
                                        </Col>
                                    </Form.Item>
                                    <Form.Item label="Item Main category" >
                                        {getFieldDecorator('mainCategory', {
                                            rules: [{ required: false, message: 'Please enter Item main category' }],
                                            })(
                                            <Input id="mainCategory" {...getFieldProps}/>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Display Name" >
                                        {getFieldDecorator('displayName', {
                                            rules: [{ required: false, message: 'Please enter display name' }],
                                            })(
                                            <Input id="displayName" {...getFieldProps}/>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Brand Name" >
                                        {getFieldDecorator('brandName', {
                                            // rules: [{ required: false, message: 'Please enter Item sub category' }],
                                            })(
                                            <Input id="brandName" {...getFieldProps}/>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Manufacturers Name" >
                                        {getFieldDecorator('manufacturersName', {
                                            // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                                            })(
                                            <Input id="manufacturersName" {...getFieldProps}/>
                                        )}
                                    </Form.Item>
                            </Col> 
                        </Row>
                        <Row>
                        <Col lg={6} md={6} sm={12} xs={12}  className="gx-align-self-center">
                            <Form.Item>
                            <Checkbox 
                                // onChange={checkboxChange}
                                >
                                Length
                            </Checkbox>
                            </Form.Item>
                         </Col>

                         <Form.Item >
                            <Col className='flex-row'>
                                {getFieldDecorator('meter', {
                                // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                                })(
                                <Input id="meter" {...getFieldProps} />
                                )}
                                <label className='left-side-label'>Meters</label>
                            </Col>
                            </Form.Item>
                        
                         <Form.Item>
                          <Col className='flex-row'>
                           {getFieldDecorator('feet', {
                                // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                              })(
                           <Input id="feet" {...getFieldProps} disabled/>
                           )}
                           <label className='left-side-label'>Feet</label>
                          </Col>
                          </Form.Item>
                        </Row>

                        <Row>
                            <Col lg={6} md={6} sm={12} xs={12} className="gx-align-self-center">
                            <Form.Item>
                            <Checkbox 
                                // onChange={checkboxChange}
                                >
                                Width
                            </Checkbox>
                            </Form.Item>
                         </Col>

                         <Form.Item>
                         <Col className='flex-row'>
                           {getFieldDecorator('widthMeter', {
                                // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                              })(
                           <Input id="widthMeter" {...getFieldProps}/>
                           )}
                           <label className='left-side-label'>Meters</label>
                          </Col>
                          </Form.Item>

                          <Form.Item>
                          <Col className='flex-row'>
                           {getFieldDecorator('widthFeet', {
                                // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                              })(
                           <Input id="widthFeet" {...getFieldProps} disabled/>
                           )}
                           <label className='left-side-label'>Feet</label>
                          </Col>
                          </Form.Item>
                        </Row>

                        <Row>
                            <Col lg={6} md={6} sm={12} xs={12} className="gx-align-self-center">
                            <Form.Item>
                            <Checkbox 
                                // onChange={checkboxChange}
                                >
                                Flange1
                            </Checkbox>
                            </Form.Item>
                         </Col>
                         
                         <Form.Item>
                         <Col className='flex-row'>
                           {getFieldDecorator('F1mm', {
                                // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                              })(
                           <Input id="F1mm" {...getFieldProps}/>
                           )}
                           <label className='left-side-label'>mm</label>
                           </Col>
                          </Form.Item>
                          
                          <Form.Item>
                          <Col className='flex-row'>
                           {getFieldDecorator('f1inches', {
                                // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                              })(
                           <Input id="f1inches" {...getFieldProps} disabled/>
                           )}
                           <label className='left-side-label'>Inches</label>
                          </Col>
                          </Form.Item>
                        </Row>

                        <Row>
                            <Col lg={6} md={6} sm={12} xs={12} className="gx-align-self-center">
                            <Form.Item>
                            <Checkbox 
                                // onChange={checkboxChange}
                                >
                                Flange2
                            </Checkbox>
                            </Form.Item>
                         </Col>
                        
                         <Form.Item>
                         <Col className='flex-row'>
                           {getFieldDecorator('F2mm', {
                                // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                              })(
                           <Input id="F2mm" {...getFieldProps}/>
                           )}
                           <label className='left-side-label'>mm</label>
                           </Col>
                          </Form.Item>
                          
                          <Form.Item>
                          <Col className='flex-row'>
                           {getFieldDecorator('f2inches', {
                                // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                              })(
                           <Input id="f2inches" {...getFieldProps} disabled/>
                           )}
                           <label className='left-side-label'>Inches</label>
                          </Col>
                          </Form.Item>
                        </Row>

                        <Row>
                            <Col lg={6} md={6} sm={12} xs={12} className="gx-align-self-center">
                            <Form.Item>
                            <Checkbox 
                                // onChange={checkboxChange}
                                >
                                Thickness
                            </Checkbox>
                            </Form.Item>
                         </Col>
                         
                         <Form.Item>
                         <Col className='flex-row'>
                           {getFieldDecorator('thicknessmm', {
                                // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                              })(
                           <Input id="thicknessmm" {...getFieldProps}/>
                           )}
                           <label className='left-side-label'>mm</label>
                           </Col>
                          </Form.Item>
                         
                          <Form.Item>
                          <Col className='flex-row'>
                           {getFieldDecorator('thicknessInches', {
                                // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                              })(
                           <Input id="thicknessInches" {...getFieldProps} disabled/>
                           )}
                           <label className='left-side-label'>Inches</label>
                           </Col>
                          </Form.Item>
                          
                          <Form.Item>
                          <Col className='flex-row'>
                           {getFieldDecorator('thicknessGuage', {
                                // rules: [{ required: false, message: 'Please enter manufacturers name' }],
                              })(
                           <Input id="thicknessGuage" {...getFieldProps} disabled/>
                           )}
                           <label className='left-side-label'>Guage</label>
                          </Col>
                          </Form.Item>
                        </Row>
                        </Form>
                    </Card>
                </Modal>
            </Card>
        </div>
    );
}

const mapStateToProps = state => ({
    material: state.material
});

const addMaterialDVForm = Form.create({
    mapPropsToFields(props) {
        const grade = props.material?.material?.materialGrade?.map(material => material.gradeName);
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
})(MaterialDV);

export default connect(mapStateToProps, {
    fetchMaterialList,
    addMaterial,
    fetchMaterialListById,
    updateMaterial,
    resetMaterial
})(addMaterialDVForm);