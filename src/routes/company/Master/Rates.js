import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Select} from "antd";
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
    const [filteredInwardList, setFilteredInwardList] = useState(props.rates?.ratesList || []);

    const { getFieldDecorator } = props.form;

    const columns = [{
        title: 'Rate Id',
        dataIndex: 'rateId',
        key: 'rateId',
        filters: [],
        sorter: (a, b) => {
            return a.rateId - b.rateId
        },
        sortOrder: sortedInfo.columnKey === 'rateId' && sortedInfo.order,
    },
    {
        title: 'Party Name',
        dataIndex: 'partyRates.partyName',
        key: 'partyRates.partyName',
        filters: [],
        sorter: (a, b) => a.partyRates.partyName.length - b.partyRates.partyName.length,
        sortOrder: sortedInfo.columnKey === 'partyRates.partyName' && sortedInfo.order,
    },
    {
        title: 'Process Name',
        dataIndex: 'process.processName',
        key: 'process.processName',
        filters: [],
        sorter: (a, b) => a.process.processName.length - b.process.processName.length,
        sortOrder: sortedInfo.columnKey === 'process.processName' && sortedInfo.order,
    },
    {
        title: 'Material description',
        dataIndex: 'materialType.description',
        key: 'materialType.description',
        filters: [],
        sorter: (a, b) => a.materialType.description.length - b.materialType.description.length,
        sortOrder: sortedInfo.columnKey === 'materialType.description' && sortedInfo.order,
    },
    {
        title: 'Thickness rate',
        dataIndex: 'thicknessRate',
        key: 'thicknessRate',
        sorter: (a, b) => a.thicknessRate - b.thicknessRate,
        sortOrder: sortedInfo.columnKey === 'thicknessRate' && sortedInfo.order,
    },
    {
        title: 'Packaging charges',
        dataIndex: 'packagingCharges',
        key: 'packagingCharges',
        sorter: (a, b) => a.packagingCharges - b.packagingCharges,
        sortOrder: sortedInfo.columnKey === 'packagingCharges' && sortedInfo.order,
    },
    {
        title: 'Lamination charges',
        dataIndex: 'laminationCharges',
        key: 'laminationCharges',
        sorter: (a, b) => a.laminationCharges - b.laminationCharges,
        sortOrder: sortedInfo.columnKey === 'laminationCharges' && sortedInfo.order,
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
        props.fetchRatesListById(record.rateId);
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
                if(rate?.rateId?.toString() === searchValue ||
                    rate?.partyRates?.partyName?.toLowerCase().includes(searchValue.toLowerCase()) ||
                    rate?.materialType?.description.toLowerCase().includes(searchValue.toLowerCase()) ||
                    rate?.process?.processName.toLowerCase().includes(searchValue)) {
                    return rate;
                }
            });
            setFilteredInwardList(filteredData);
        } else {
            setFilteredInwardList(rates.ratesList);
        }
    }, [searchValue])

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

    const deleteSelectedCoils = () => {
        console.log('dfd');
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
                                    <p><strong>Psrty Name :</strong> {viewMaterialData?.partyRates?.partyName}</p>
                                    <p><strong>Material Type :</strong> {viewMaterialData?.materialType?.description}</p>
                                    <p><strong>Process Name :</strong> {viewMaterialData?.process?.processName}</p>
                                    <p><strong>Minimum Thickness :</strong> {viewMaterialData?.minThickness}</p>
                                    <p><strong>Maximum Thickness :</strong> {viewMaterialData?.maxThickness}</p>
                                    <p><strong>Thickness Rate :</strong> {viewMaterialData?.thicknessRate}</p>
                                    <p><strong>Packaging Charges :</strong> {viewMaterialData?.packagingCharges}</p>
                                    <p><strong>Lamination Charges :</strong> {viewMaterialData?.laminationCharges}</p>
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
                                    console.log('Received values of form: ', values);
                                    const data = { values, id: props.rates?.rates?.rateId };
                                    props.updateRates(data);
                                    props.form.resetFields();
                                    setEditRates(false);
                                    setShowAddRates(false);
                                }
                            });
                        } else {
                            props.form.validateFields((err, values) => {
                                if (!err) {
                                    console.log('Received values of form: ', values);
                                    props.addRates(values);
                                    props.form.resetFields();
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
                                    
                                    <Form.Item label="Party Name" >
                                        {getFieldDecorator('partyRates', {
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
                                    </Form.Item>
                                    <Form.Item label="Process Name" >
                                        {getFieldDecorator('process', {
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
                                    <Form.Item label="Material Grade" >
                                        {getFieldDecorator('materialType', {
                                            rules: [{ required: true, message: 'Please enter grade!' }],
                                            })(
                                                <Select
                                                showSearch
                                                style={{width: 300}}
                                                placeholder="Select a Material"
                                              >
                                                {props.material?.materialList?.map(material => <Option value={material.matId}>{material.description}</Option>)}
                                              </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Minimum Thickness">
                                        {getFieldDecorator('minThickness', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="minThickness" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Maximum Thickness">
                                        {getFieldDecorator('maxThickness', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="maxThickness" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Thickness Rate">
                                        {getFieldDecorator('thicknessRate', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="thicknessRate" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Packaging Charges">
                                        {getFieldDecorator('packagingCharges', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="packagingCharges" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Lamination Charges">
                                        {getFieldDecorator('laminationCharges', {
                                            rules: [{ required: true, message: 'Please input the GST Number!' }],
                                        })(
                                            <Input id="laminationCharges" />
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
            partyRates: Form.createFormField({
                ...props.rates?.rates?.partyRates?.nPartyId,
                value: props.rates?.rates?.partyRates?.nPartyId|| undefined,
            }),
            process: Form.createFormField({
                ...props.rates?.rates?.process?.processId,
                value: props.rates?.rates?.process?.processId || undefined,
            }),
            materialType: Form.createFormField({
                ...props.rates?.rates?.materialType?.matId,
                value: props.rates?.rates?.materialType?.matId || undefined,
            }),
            minThickness: Form.createFormField({
                ...props.rates?.rates?.minThickness,
                value: props.rates?.rates?.minThickness || '',
            }),
            maxThickness: Form.createFormField({
                ...props.rates?.rates?.maxThickness,
                value: props.rates?.rates?.maxThickness || '',
            }),
            thicknessRate: Form.createFormField({
                ...props.rates?.rates?.thicknessRate,
                value: props.rates?.rates?.thicknessRate || '',
            }),
            packagingCharges: Form.createFormField({
                ...props.rates?.rates?.packagingCharges,
                value: props.rates?.rates?.packagingCharges || '',
            }),
            laminationCharges: Form.createFormField({
                ...props.rates?.rates?.laminationCharges,
                value: props.rates?.rates?.laminationCharges || '',
            }),
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