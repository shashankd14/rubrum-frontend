import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchMaterialList, addMaterial } from "../../../appRedux/actions";
import { onDeleteContact } from "../../../appRedux/actions";

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

const Material = (props) => {

    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    const { getFieldDecorator, getFieldValue, getFieldProps } = props.form;
    getFieldDecorator('keys', {initialValue: [{ gradeId: 0, gradeName: '' }]});
    const [showAddMaterial, setShowAddMaterial] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [filteredInwardList, setFilteredInwardList] = useState(props.material?.materialList || []);

    const keys = getFieldValue('keys');

    const columns = [{
        title: 'S No',
        dataIndex: 'matId',
        key: 'matId',
        filters: [],
        sorter: (a, b) => {
            return a.matId - b.matId
        },
        sortOrder: sortedInfo.columnKey === 'matId' && sortedInfo.order,
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
        onFilter: (value, record) => record.description == value,
        sorter: (a, b) => a.description.length - b.description.length,
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
        sorter: (a, b) => a.materialGrade.length - b.materialGrade.length,
        sortOrder: sortedInfo.columnKey === 'description' && sortedInfo.order,
    },
    {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (text, record, index) => (
            <span>
                <span className="gx-link" onClick={() => {}}>View</span>
                <Divider type="vertical"/>
                <span className="gx-link" onClick={() => {}}>Edit</span>
                <Divider type="vertical"/>
                <span className="gx-link"onClick={() => {}}>Delete</span>
            </span>
        ),
    },
    ];
    const onDelete = (record,key, e) => {
        let id = []
        id.push(record.inwardEntryId);
        e.preventDefault();
        props.deleteInwardEntryById(id)
        console.log(record,key)
      }
    const onEdit = (record,key,e)=>{
        props.fetchPartyListById(record.inwardEntryId);
        setTimeout(() => {
            props.history.push(`create/${record.inwardEntryId}`)
        }, 2000);
                
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
                    material.description.toLowerCase().includes(searchValue.toLowerCase()) ||
                    material.materialGrade.includes(searchValue)) {
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
        const nextKeys = keys.concat({ gradeId: idx+1, gradeName: '' });
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
                        <Button type="primary" icon={() => <i className="icon icon-add"/>} size="medium"
                                onClick={() => setShowAddMaterial(true)}
                        >Add Material</Button>
                        <SearchBox styleName="gx-flex-1" placeholder="Search for coil number or party name..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                    </div>
                </div>
                <Table rowSelection={[]}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={filteredInwardList}
                    onChange={handleChange}
                />

                <Modal
                    title='Add Material'
                    visible={showAddMaterial}
                    onOk={(e) => {
                        e.preventDefault();
                        props.form.validateFields((err, values) => {
                        if (!err) {
                            console.log('Received values of form: ', values);
                            props.addMaterial(values);
                            setShowAddMaterial(false);
                        }
                        });
                    }}
                    width={600}
                    onCancel={() => {
                        setShowAddMaterial(false)
                    }}
                >
                    <Card className="gx-card">
                        <Row>
                            <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                                <Form {...formItemLayout} className="gx-pt-4">
                                    
                                    <Form.Item label="Material Description" >
                                        {getFieldDecorator('description', {
                                            rules: [{ required: true, message: 'Please enter description' }],
                                            })(
                                            <Input id="description" {...getFieldProps}/>
                                        )}
                                    </Form.Item>
                                    
                                    
                                    {keys.map((k, index) => {
                                        return (
                                            <Form.Item label="Grade">
                                                {getFieldDecorator(`grade[${index}]`, {
                                                    rules: [{ required: true, message: 'Please enter grade details' }],
                                                    initialValues: [{ gradeId: 0, gradeName: '' }]
                                                    })(
                                                    <Input id="grade" />
                                                )}
                                                {keys.length-1 > 0 && <i className="icon icon-trash gx-margin" onClick={() => removeKey(index)}/> }
                                                {index == keys.length-1 && <i className="icon icon-add-circle" onClick={() => addNewKey(index)}/> }
                                            </Form.Item>
                                        )})}
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </Modal>
            </Card>
        </div>
    );
}

const mapStateToProps = state => ({
    material: state.material
});

const addMaterialForm = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            description: Form.createFormField({
                ...props.material.materialList.description,
                value: props.material?.materialList?.description || '',
            }),
            grade: Form.createFormField({
                ...props.material.materialList.materialGrade,
                value: props.material?.materialList?.materialGrade || [],
            }),
        };
    },
    // onValuesChange(props, values) {
    //     props.setProcessDetails({ ...props.material, ...values});
    // },
})(Material);

export default connect(mapStateToProps, {
    fetchMaterialList,
    addMaterial
})(addMaterialForm);