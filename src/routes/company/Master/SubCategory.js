import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Checkbox} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchMaterialList, addMaterial, fetchMaterialListById, updateMaterial, resetMaterial } from "../../../appRedux/actions";
import { onDeleteContact } from "../../../appRedux/actions";
import '../../../styles/components/Master/MaterialDV.css';
import CustomPopup from '../../../util/CustomComponent/CustomePopup';

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

const SubCategory = (props) => {

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
    const [popupVisible, setPopupVisible] = useState(false);

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

  const openPopup = () => {
    setPopupVisible(true);
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
  };

    return (
        <div>
            <h1><IntlMessages id="sidebar.company.materialList"/></h1>
            <Card>
            <Modal
                                            title="Add sub Category"
                                            visible={popupVisible}
                                            onCancel={handlePopupClose}
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
                                    </Col>
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

const materialSubCategory = Form.create({
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
})(SubCategory);

export default connect(mapStateToProps, {
    fetchMaterialList,
    addMaterial,
    fetchMaterialListById,
    updateMaterial,
    resetMaterial
})(materialSubCategory);