import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Select, Checkbox} from "antd";
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchRatesList, fetchPartyList, fetchMaterialList, fetchProcessList, addRates, fetchRatesListById, updateRates, resetRates} from "../../../appRedux/actions";
import { onDeleteContact } from "../../../appRedux/actions";

const Option = Select.Option;

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


const Rates = (props) => {

    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [showAddRates, setShowAddRates] = useState(false);
    const [viewMaterial, setViewMaterial] = useState(false);
    const [editRates, setEditRates] = useState(false);
    const [viewMaterialData, setViewMaterialData] = useState({});
    const [type, setType] = useState([])
    const [filteredInwardList, setFilteredInwardList] = useState(props.rates?.ratesList || []);
    const [gradeList, setGradeList] = useState([])
    const [checked, setChecked]=useState(false)
    const { getFieldDecorator } = props.form;

    const columns = [{
        title: 'Rate Id',
        dataIndex: 'id',
        key: 'id',
        filters: [],
        sorter: (a, b) => {
            return a.id - b.id
        },
        sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order,
    },
    {
        title: 'Party Name',
        dataIndex: 'partyName',
        key: 'partyName',
        filters: [],
        sorter: (a, b) => a.partyName - b.partyName,
        sortOrder: sortedInfo.columnKey === 'partyName' && sortedInfo.order,
    },
    {
        title: 'Process Name',
        dataIndex: 'processName',
        key: 'processName',
        filters: [],
        sorter: (a, b) => a.processName - b.processName,
        sortOrder: sortedInfo.columnKey === 'processName' && sortedInfo.order,
    },
    {
        title: 'Material description',
        dataIndex: 'matGradeName',
        key: 'matGradeName',
        filters: [],
        sorter: (a, b) => a.matGradeName - b.matGradeName,
        sortOrder: sortedInfo.columnKey === 'matGradeName' && sortedInfo.order,
    },
    {
        title: 'Thickness Range',
        dataIndex: 'thicknessFrom',
        render: (text, record, index) => (record.thicknessFrom+"-"+record.thicknessTo),
    },
    {
        title: 'Thickness rate',
        dataIndex: 'price',
        key: 'price',
        sorter: (a, b) => a.price - b.price,
        sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
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
        props.fetchRatesListById(record.id);
        setEditRates(true);
        setTimeout(() => {
            setShowAddRates(true);
        }, 1000);
                
    }

    useEffect(() => {
        props.fetchPartyList();
        props.fetchMaterialList();
        props.fetchProcessList();
    }, []);


    useEffect(() => {
        props.fetchRatesList();
    }, [showAddRates]);

    useEffect(() => {
        const { loading, error, ratesList } = props.rates;
        if (!loading && !error) {
            setFilteredInwardList(ratesList)
        }
    }, [props.rates]);

    useEffect(() => {

        const { rates } = props;
        if(searchValue) {
            const filteredData = rates?.ratesList?.filter((rate) => {
                if(rate?.id?.toString() === searchValue ||
                    rate?.partyId?.toString()===searchValue ||
                    rate?.matGradeId?.toString()===searchValue ||
                    rate?.processId?.toString()===searchValue ||rate?.price?.toString()===searchValue) {
                    return rate;
                }
            });
            setFilteredInwardList(filteredData);
        } else {
            setFilteredInwardList(rates.ratesList);
        }
    }, [searchValue])
    useEffect(()=>{
        if(checked){
            const list=props.material.materialList.filter(item => type?.includes(item.matId));
            setGradeList(list.map(item=>item.materialGrade)?.flat())
        }else{
            const list=props.material.materialList.filter(material => material.matId === type);
        setGradeList(list.map(item=>item.materialGrade)?.flat())
        }
        
    },[type, checked])
    
    const handleChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
        setFilteredInfo(filters)
    };

    const clearAll = () => {
        setSortedInfo(null);
        setFilteredInfo(null);
    };

    const exportSelectedData = () => {

    }
const handleMaterialTypeChange=(e)=>{
    console.log("material",e)
    setType(e)
}
    const deleteSelectedCoils = () => {
        console.log('dfd');
    };
    const checkboxChange = (e: CheckboxChangeEvent) => {
        setChecked(e.target.checked)
        console.log(`checked = ${e.target.checked}`);
      };

    return (
        <div>
            <h1><IntlMessages id="sidebar.company.ratesList"/></h1>
            <Card>
                <div className="gx-flex-row gx-flex-1">
                    <div className="table-operations gx-col">
                        <Button onClick={deleteSelectedCoils}>Delete</Button>
                        <Button onClick={exportSelectedData}>Export</Button>
                    </div>
                    <div className="gx-flex-row gx-w-50">
                        <Button type="primary" icon={() => <i className="icon icon-add"/>} size="medium"
                                onClick={() => {
                                    props.resetRates();
                                    props.form.resetFields();
                                    setShowAddRates(true)
                                }}
                        >Add Rates</Button>
                        <SearchBox styleName="gx-flex-1" placeholder="Search for process name or material or party name..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
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
                    onOk={() => setViewMaterial(false)}
                    onCancel={() => setViewMaterial(false)}
                >
                    <Card className="gx-card">
                        <Row>
                            <Col span={24}>
                                <Card>
                                    <p><strong>Psrty Name :</strong> {viewMaterialData?.partyId}</p>
                                    <p><strong>Material Type :</strong> {viewMaterialData?.matGradeId}</p>
                                    <p><strong>Process Name :</strong> {viewMaterialData?.processId}</p>
                                    <p><strong>Minimum Thickness :</strong> {viewMaterialData?.thicknessFrom}</p>
                                    <p><strong>Maximum Thickness :</strong> {viewMaterialData?.thicknessTo}</p>
                                    <p><strong>Thickness Rate :</strong> {viewMaterialData?.price}</p>
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Modal>

                <Modal
                    title='Add Rates'
                    visible={showAddRates}
                    onOk={(e) => {
                        e.preventDefault();
                        if (editRates) {
                            props.form.validateFields((err, values) => {
                                if (!err) {
                                    const data = { values, id: props.rates?.rates?.id };
                                    props.updateRates(data);
                                    props.form.resetFields();
                                    setEditRates(false);
                                    setShowAddRates(false);
                                }
                            });
                        } else {
                            props.form.validateFields((err, values) => {
                                if (!err) {
                                    if(checked){
                                        props.addRates(values);  
                                    }else{
                                        const payload={
                                          ...values,
                                         matGradeId:[values.matGradeId],
                                         partyId:[values.partyId]
                                        }
                                        props.addRates(payload);
                                    }
                                    
                                    props.form.resetFields();
                                    setChecked(false)
                                    setShowAddRates(false);
                                    
                                }
                            });
                        }
                        
                    }}
                    width={600}
                    onCancel={() => {
                        props.form.resetFields();
                        setShowAddRates(false);
                        setEditRates(false)
                    }}
                >
                    <Card className="gx-card">
                        <Row>
                            <Col lg={24} md={24} sm={24} xs={24} className="gx-align-self-center">
                                <Form {...formItemLayout} className="gx-pt-4">
                                <Form.Item >
                                    <Checkbox onChange={checkboxChange}>Apply to multiple fields</Checkbox>
                                    </Form.Item>
                                    {checked &&<><Form.Item label="Party Name">
                                        {getFieldDecorator('partyId', {
                                            rules: [{ required: true, message: 'Please select party name!' }],
                                        })(
                                            <Select
                                             id="partyId"
                                             mode="multiple"
                                             style={{ width: '100%' }}
                                            >                                                
                                            {props.party?.partyList?.map(party => <Option value={party.nPartyId}>{party.partyName}</Option>)}
                                            </Select>
                                        )}
                                        </Form.Item>
                                        <Form.Item label="Material Type">
                                        {getFieldDecorator('materialType', {
                                            rules: [{ required: true, message: 'Please select material type!' }],
                                        })(
                                            <Select
                                             id="materialType"
                                             mode="multiple"
                                             style={{ width: '100%' }}
                                             onChange={handleMaterialTypeChange}
                                             >{props.material?.materialList?.map(material => <Option value={material.matId}>{material.description}</Option>)}
                                             </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Material Grade">
                                        {getFieldDecorator('matGradeId', {
                                            rules: [{ required: true, message: 'Please select material grade!' }],
                                        })(
                                            <Select
                                             id="matGradeId"
                                             mode="multiple"
                                             style={{ width: '100%' }}
                                             >{gradeList?.map(material => <Option value={material.gradeId}>{material.gradeName}</Option>)}
                                             </Select>
                                        )}
                                    </Form.Item>
                                    </>
                                    }
                                    {!checked &&<Form.Item label="Party Name" >
                                        {getFieldDecorator('partyId', {
                                            rules: [{ required: true, message: 'Please enter Party name!' }],
                                            })(
                                                <Select
                                                showSearch
                                                style={{width: 300}}
                                                placeholder="Select a Party"
                                              >
                                                {props.party?.partyList?.map(party => <Option value={party.nPartyId}>{party.partyName}</Option>)}
                                              </Select>
                                        )}
                                    </Form.Item>}
                                    <Form.Item label="Process Name" >
                                        {getFieldDecorator('processId', {
                                            rules: [{ required: true, message: 'Please enter Process name!' }],
                                            })(
                                                <Select
                                                showSearch
                                                style={{width: 300}}
                                                placeholder="Select a Process"
                                              >
                                                {props.process?.processList?.map(process => <Option value={process.processId}>{process.processName}</Option>)}
                                              </Select>
                                        )}
                                    </Form.Item>
                                    {!checked &&<Form.Item label="Material Type" >
                                        {getFieldDecorator('materialType', {
                                            rules: [{ required: true, message: 'Please enter material Type!' }],
                                            })(
                                                <Select
                                                showSearch
                                                value={type}
                                                style={{width: 300}}
                                                placeholder="Select a Material"
                                                onChange={handleMaterialTypeChange}
                                              >
                                                {props.material?.materialList?.map(material => <Option value={material.matId}>{material.description}</Option>)}
                                              </Select>
                                        )}
                                    </Form.Item>}
                                    {!checked && <Form.Item label="Material Grade" >
                                        {getFieldDecorator('matGradeId', {
                                            rules: [{ required: true, message: 'Please enter grade!' }],
                                            })(
                                                <Select
                                                showSearch
                                                style={{width: 300}}
                                                placeholder="Select a Grade"
                                              >
                                                {gradeList?.map(material => <Option value={material.gradeId}>{material.gradeName}</Option>)}
                                              </Select>
                                        )}
                                    </Form.Item>}
                                    <Form.Item label="Minimum Thickness">
                                        {getFieldDecorator('thicknessFrom', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="thicknessFrom" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Maximum Thickness">
                                        {getFieldDecorator('thicknessTo', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="thicknessTo" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Thickness Rate">
                                        {getFieldDecorator('price', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="price" />
                                        )}
                                    </Form.Item>
                                    
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
    rates: state.rates,
    material: state.material,
    party: state.party,
    process: state.process
});

const addRatesForm = Form.create({
    mapPropsToFields(props) {
        return {
            partyId: Form.createFormField({
                ...props.rates?.rates?.partyId,
                value: props.rates?.rates?.partyId|| undefined,
            }),
            processId: Form.createFormField({
                ...props.rates?.rates?.processId,
                value: props.rates?.rates?.processId || undefined,
            }),
            materialType: Form.createFormField({
                ...props.rates?.rates?.matId,
                value: props.rates?.rates?.matId || undefined,
            }),
            matGradeId: Form.createFormField({
                ...props.rates?.rates?.matGradeName,
                value: props.rates?.rates?.matGradeName || undefined,
            }),
            thicknessFrom: Form.createFormField({
                ...props.rates?.rates?.thicknessFrom,
                value: props.rates?.rates?.thicknessFrom || '',
            }),
            thicknessTo: Form.createFormField({
                ...props.rates?.rates?.thicknessTo,
                value: props.rates?.rates?.thicknessTo || '',
            }),
            price: Form.createFormField({
                ...props.rates?.rates?.price,
                value: props.rates?.rates?.price || '',
            }),
            // packagingCharges: Form.createFormField({
            //     ...props.rates?.rates?.packagingCharges,
            //     value: props.rates?.rates?.packagingCharges || '',
            // }),
            // laminationCharges: Form.createFormField({
            //     ...props.rates?.rates?.laminationCharges,
            //     value: props.rates?.rates?.laminationCharges || '',
            // }),
        };
    }
})(Rates);

export default connect(mapStateToProps, {
    fetchRatesList,
    fetchPartyList,
    fetchMaterialList,
    fetchProcessList,
    addRates,
    fetchRatesListById,
    updateRates,
    resetRates
})(addRatesForm);