import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {setInwardDVDetails, fetchDVMaterialList, checkCustomerBatchNumber, fetchLocationList, fetchVendorList, fetchWeighbridgeList} from "../../../../appRedux/actions";
import {Form, Spin, AutoComplete, Icon, Button, Col, Row, Input, Select, Card, DatePicker, Table} from "antd";
import {formItemLayout} from '../Create';
import { APPLICATION_DATE_FORMAT } from '../../../../constants';
import moment from "moment";
import Dragger from 'antd/lib/upload/Dragger';
import { useLocation } from 'react-router-dom/cjs/react-router-dom';

const Option = Select.Option;

const CreateRecociliation = (props) => {
    const {getFieldDecorator} = props.form;
    const [dataSource, setDataSource] = useState([]);
    const [itemDetails, setItemDetails] = useState([]); 
    const [totalTheoreticalWeight, setTotalTheoreticalWeight] = useState(0);

    useEffect(() => {
        const totalWeight = props.inwardDV?.itemsList?.reduce((sum, item) => {
            const weight = parseFloat(item.theoreticalWeight) || 0;
            return sum + weight;
        }, 0);
        
        setTotalTheoreticalWeight(totalWeight);
    }, [props.itemDetails]);

    useEffect(() => {
        debugger
        const { inwardDV, materialDV } = props;
        if (inwardDV && materialDV && materialDV.DVMaterialList) {
            const materialContent = materialDV.DVMaterialList?.content;

            // Map the itemDetails with the item names
            const updatedItemDetails = inwardDV?.itemsList?.map(item => {
                const matchedMaterial = materialContent?.find(material => material.itemId === item.itemId);
                return {
                    ...item,
                    itemName: matchedMaterial ? matchedMaterial.itemName : 'Unknown'
                };
            });

            setItemDetails(updatedItemDetails);
        }
    }, [props.inwardDV, props.materialDV]);
    
    const columns = [
        {
            title: 'Item Name',
            dataIndex: 'itemName',
            key: 'itemName',
        },
        {
            title: 'No. of Pcs',
            dataIndex: 'actualNoofPieces',
            key: 'actualNoofPieces',
        },
        {
            title: 'Net Weight',
            dataIndex: 'netWeight',
            key: 'netWeight',
        },
        {
            title: 'Theoretical No.of Pcs',
            dataIndex: 'theoreticalNoofPieces',
            key: 'theoreticalNoofPieces',
        },
        {
            title: 'Theoretical Weight',
            dataIndex: 'theoreticalWeight',
            key: 'theoreticalWeight',
        },
        {
            title: 'Average Weight (netWeight / actualNoofPieces)',
            key: 'averageWeight',
            render: (text, record) => {
                debugger
                const { netWeight, actualNoofPieces } = record;
                const averageWeight = actualNoofPieces ? (netWeight / actualNoofPieces).toFixed(2) : 'N/A';
                return averageWeight;
            }
        },
        {
            title: 'Weight Variance',
            dataIndex: 'weightVariance',
            key: 'weightVariance',
        },
    ]

    // const handleTableChange = (pagination, filters, sorter) => {
    //     setSortedInfo(sorter);
    //     setFilteredInfo(filters)
    // };

    useEffect(() => {  
        props.fetchLocationList({
            searchText:'',
            pageNo:"1",
            pageSize:"15",
            ipAddress: "1.1.1.1",
            requestId: "LOCATION_LIST_GET",
            userId: ""
        });
        props.fetchVendorList({
            searchText:"",
            pageNo: "1",
            pageSize: "15",
            ipAddress: "1.1.1.1",
            requestId: "VENDOR_LIST_GET",
            userId: ""
        });
        props.fetchWeighbridgeList({
            searchText:'',
            pageNo:"1",
            pageSize:"15",
            ipAddress: "1.1.1.1",
            requestId: "WEIGHBRIDGE_LIST_GET",
            userId: ""
        });
        props.fetchDVMaterialList({
            searchText:"",
            pageNo: "1",
            pageSize: "15",
            ipAddress: "1.1.1.1",
            requestId: "MATERIAL_LIST_GET",
            userId: ""
        });
    }, []);

    useEffect (() => {
        debugger
        setItemDetails(props.inwardDV?.itemsList);
    }, [props.inwardDV]);

    const handleSubmit = e => {
        props.updateStep(6);
        e.preventDefault();

        props.form.validateFields((err, values) => {
            if (!err) {
                props.updateStep(6);
            }
        });
    };
   
    const [weighbridgeImage, setWeighbridgeImage] = useState()
    const onImageFileChange = (info) => {
        if (info.file.status === 'uploading') {
            setWeighbridgeImage(info.file.name);
        } else if (info.file.status === 'error') {
          console.error('Error uploading file:', info.file.error);
        }
      };
      
      const [vendorName, setVendorName] = useState();
      useEffect(() => {
        const vendorId = props.inwardDV.vendorId;
        let vendorName = '';
        const response = props.vendor.content
            const selectedVendorName = response.find(vendor => vendor.vendorId === vendorId);
            if (selectedVendorName !== undefined){
                vendorName = selectedVendorName.vendorName;
                   }
        setVendorName(vendorName);
      },[props.inwardDV.vendorName])
      
    return (
        <>
         <Col span={24}>
                 <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4">
                   <Row>
                        <Col span={12} >
                    <Form.Item label="Vendor Name">
                            {getFieldDecorator('vendorNameReco', {
                                initialValue: vendorName? vendorName : props.inwardDV?.vendorName
                            })(
                                <Input id="vendorNameReco" disabled/>
                            )}
                    </Form.Item>
                    <Form.Item label="Consignment Id">
                            {getFieldDecorator('consignmentIdReco', {
                            initialValue: props.inwardDV.consignmentId
                            })(
                                <Input id="consignmentIdReco" disabled/>
                            )}
                    </Form.Item>
                    </Col>
                    <Col span={10}>
                    <Form.Item label="Vehicle No">
                            {getFieldDecorator('vehicleNoReco', {
                            initialValue: props.inwardDV.vehicleNo
                            })(
                                <Input id="vehicleNoReco" disabled/>
                            )}
                    </Form.Item>
                      </Col>
                    </Row>
                <div>
                    <Row gutter={16}>
                    <Table rowSelection={[]}
                    className="gx-table-responsive"
                    columns={columns}
                   dataSource={itemDetails}
                   pagination={{ pageSize: 2 }}
                />
                   </Row>
                    <div className="gx-mt-4" style={{ backgroundColor: 'rgba(135, 206, 235, 0.2)', padding: '5px' }} >
                    <Row gutter={10} >
                        <Col span={4} className="gx-mt-2" style={{textAlign: 'right'}}>
                        <h3>Total</h3> 
                        </Col>
                        <Col span={3}>
                        <Input value={props.inwardDV.totalWeight} style={{ backgroundColor: 'blue', color: 'white' }} />
                        </Col>
                        <Col span={3}></Col>
                        <Col span={3}>
                        <Input value={totalTheoreticalWeight} style={{ backgroundColor: 'blue', color: 'white' }} />
                        </Col>
                    </Row>
                    </div>
                </div>
                <hr className="gx-mt-4"/>
                <Row>
                <Col span={10} className="gx-mt-1">
                <Form.Item label="Weighbridge Name">
                        {getFieldDecorator("weighbridgeName", {
                        //   rules: [
                        //     {
                        //       required: true,
                        //       message: "Please select location Id!",
                        //     },
                        //   ],
                        })(
                          <Select
                            id="weighbridgeName"
                            showSearch
                            style={{ width: "100%" }}
                          >
                            {props.weighbridge?.weighbridgeList?.content?.map((weighbridge) => (
                              <Option key={weighbridge.weighbridgeId} value={weighbridge.weighbridgeId}>
                                {weighbridge.weighbridgeName}
                              </Option>
                            ))}
                          </Select>
                        )}
                 </Form.Item>
                 <Row gutter={24}>
                    <Col span={10} style={{marginLeft: '20'}} className="gx-mt-2">
                        Weighment Slip:
                    </Col>
                    <Col span={12} style={{marginLeft: '-20'}} >
                 <Dragger
                    name='itemImage'
                    height={50}
                    // width= {100}
                    onChange={(e) => onImageFileChange(e)}
                  >
                    <p>
                      <Icon type='upload' />
                      &nbsp; Upload  Weighment Slip here
                    </p>
                  </Dragger>
                    </Col>
                 </Row>
            </Col>
            <Col span={14} className="gx-mt-1">
                <Form.Item label="As per weighment total weight">
                {getFieldDecorator('weighmentTotalWeight', {
                   
                })(
                    // <Input id="weighmentTotalWeight" onChange= {props.params!=="" ?(e) =>handleChange(e,'frieghtCharges'):""}/>
                    <Input id="weighmentTotalWeight"/>
                )}
            </Form.Item>
            <Form.Item label="Variance">
                {getFieldDecorator('variance', {
                   
                })(
                    <Input id="variance"/>
                )}
            </Form.Item>
                <Form.Item label="Loss or profit Amount">
                {getFieldDecorator('lossOrProfitAmount', {
                   
                })(
                    <Input id="lossOrProfitAmount" />
                )}
            </Form.Item>
            <Form.Item label="Remarks">
                {getFieldDecorator('remarks', {
                   
                })(
                    <Input id="remarks" />
                )}
            </Form.Item>
            <Form.Item label="Frieght deducted">
                {getFieldDecorator('frieghtDeductedOption', {
                   
                })(
                    <Select placeholder="Select an option">
                                <Option value="YES">YES</Option>
                                <Option value="NO">NO</Option>
                            </Select>
                )}
            </Form.Item>
            
            <Form.Item label="Frieght deducted Amount">
                {getFieldDecorator('frieghtDeductedAmount', {
                   
                })(
                    <Input id="frieghtDeductedAmount"/>
                )}
            </Form.Item>
            <Form.Item label="Debit note raised">
                {getFieldDecorator('debitNoteOption', {
                   
                })(
                    <Select placeholder="Select an option">
                                <Option value="YES">YES</Option>
                                <Option value="NO">NO</Option>
                            </Select>
                )}
            </Form.Item>
            <Form.Item label="Debit note QTY">
                {getFieldDecorator('debitQTY', {
                   
                })(
                    <Input id="debitQTY" />
                )}
            </Form.Item>
            <Form.Item label="Debit note rate">
                {getFieldDecorator('debitRate', {
                   
                })(
                    <Input id="debitRate" />
                )}
            </Form.Item>
            <Form.Item label="Debit note value">
                {getFieldDecorator('debitValue', {
                   
                })(
                    <Input id="debitValue" />
                )}
            </Form.Item>
            
            <Form.Item label="Final Loss or Profit">
                {getFieldDecorator('finalLossOrProfit', {
                   
                })(
                    <Input id="finalLossOrProfit" />
                )}
            </Form.Item>
            </Col>       
            </Row>
                <Row className="gx-mt-4">
                    <Col span={20} offset={4} style={{ textAlign: "center"}}>
                        <Button style={{ marginLeft: 4 }} onClick={() => props.updateStep(4)}>
                            <Icon type="left"/>Back
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Forward<Icon type="right"/>
                        </Button>
                    </Col>
                </Row>
            </Form>
            </Col>
        </>
    )
}

const mapStateToProps = state => ({
    party: state.party,
    inward: state.inward.inward,
    location: state.location,
    inwardDV: state.inwardDV.inward,
    vendor: state.vendor.vendorList,
    weighbridge: state.weighbridge,
    materialDV: state.materialDV,
});

const Recociliation = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            weighbridgeName: Form.createFormField({
                ...props.inwardDV.weighbridgeName,
                value: (props.inwardDV.weighbridgeName) ? props.inwardDV.weighbridgeName : ''
            }),
            weighmentTotalWeight: Form.createFormField({
                ...props.inwardDV.weighmentTotalWeight,
                value: (props.inwardDV.weighmentTotalWeight) ? props.inwardDV.weighmentTotalWeight : ''
            }),
            variance: Form.createFormField({
                ...props.inwardDV.variance,
                value: (props.inwardDV.variance) ? props.inwardDV.variance : ''
            }),
            lossOrProfitAmount: Form.createFormField({
                ...props.inwardDV.lossOrProfitAmount,
                value: (props.inwardDV.lossOrProfitAmount) ? props.inwardDV.lossOrProfitAmount : ''
            }),
            remarks: Form.createFormField({
                ...props.inwardDV.remarks,
                value: (props.inwardDV.remarks) ? props.inwardDV.remarks : ''
            }),
            frieghtDeductedOption: Form.createFormField({
                ...props.inwardDV.frieghtDeductedOption,
                value: (props.inwardDV.frieghtDeductedOption) ? props.inwardDV.frieghtDeductedOption : ''
            }),
            frieghtDeductedAmount: Form.createFormField({
                ...props.inwardDV.frieghtDeductedAmount,
                value: (props.inwardDV.frieghtDeductedAmount) ? props.inwardDV.frieghtDeductedAmount : ''
            }),
            debitQTY: Form.createFormField({
                ...props.inwardDV.debitQTY,
                value: (props.inwardDV.debitQTY) ? props.inwardDV.debitQTY : ''
            }),
            debitRate: Form.createFormField({
                ...props.inwardDV.debitRate,
                value: (props.inwardDV.debitRate) ? props.inwardDV.debitRate : ''
            }),
            debitValue: Form.createFormField({
                ...props.inwardDV.debitValue,
                value: (props.inwardDV.debitValue) ? props.inwardDV.debitValue : ''
            }),
            debitNoteOption: Form.createFormField({
                ...props.inwardDV.debitNoteOption,
                value: (props.inwardDV.debitNoteOption) ? props.inwardDV.debitNoteOption : ''
            }),
            finalLossOrProfit: Form.createFormField({
                ...props.inwardDV.finalLossOrProfit,
                // value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
                value: (props.inwardDV.finalLossOrProfit) ? props.inwardDV.finalLossOrProfit : ''
            }),
        };
    },
    onValuesChange(props, values) {
        props.setInwardDVDetails({ ...props.inwardDV, ...values});
    },
})(CreateRecociliation);

export default connect(mapStateToProps, {
    setInwardDVDetails,
    checkCustomerBatchNumber,
    fetchLocationList,
    fetchVendorList,
    fetchWeighbridgeList,
    fetchDVMaterialList
})(Recociliation);
