import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {setInwardDVDetails, checkCustomerBatchNumber, generateConsignmentId, fetchLocationList, fetchVendorList, fetchWeighbridgeList} from "../../../../appRedux/actions";
import {Form, Spin, AutoComplete, Icon, Button, Col, Row, Input, Select, Card, DatePicker} from "antd";
import {formItemLayout} from '../Create';
import { APPLICATION_DATE_FORMAT } from '../../../../constants';
import moment from "moment";
import Dragger from 'antd/lib/upload/Dragger';
import { useLocation } from 'react-router-dom/cjs/react-router-dom';

const Option = Select.Option;
const widthStyle = {
    width: '50%',
  };

const CreateRecociliation = (props) => {
    const {getFieldDecorator} = props.form;
    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        if(props.params !=="") {
            const { Option } = AutoComplete;
            const options = props.party.partyList.filter(party => {
            if (party?.nPartyId===  props.inward.party?.nPartyId)
            return (<Option key={party.nPartyId} value={`${party.nPartyId}`}>
                    {party.partyName}
                </Option>)
            });
            setDataSource(options);
        }
    }, [props.party]);

    useEffect(() => {     
        props.generateConsignmentId({
            fieldName: "CONSIGNMENT",
            ipAddress: "1.1.1.1",
            requestId: "GENERATE_SEQ",
            userId: ""
        })
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
    }, []);

    useEffect(() => {
        if(props.party.partyList.length > 0) {

            const { Option } = AutoComplete;
            const options = props.party.partyList.map(party => (
                <Option key={party.nPartyId} value={`${party.nPartyId}`}>
                    {party.partyName}
                </Option>
            ));
            setDataSource(options);
        }
    }, [props.party]);

    useEffect(() => {
        if (props.params !== '') {
            props.inward.customerId = props.inward.party?.nPartyId || '';
            props.inward.customerBatchNo = props.inward.customerBatchId;
        }
    }, [props.params])
    const handleChange = e =>{
        props.inward.party.partyName = e;
    }
    const handleSubmit = e => {
        props.updateStep(6);
        // e.preventDefault();

        // props.form.validateFields((err, values) => {
        //     if (!err) {
        //         props.updateStep(4);
        //     }
        // });
    };
    const checkBatchNoExist = (rule, value, callback) => {
        if (!props.inwardStatus.loading && props.inwardStatus.success && !props.inwardStatus.duplicateBatchNo) {
            return callback();
        }
        callback('The coil number already exists');
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
        const vendorId = props.inwardDV.vendorName;
        let vendorName = '';
        const response = props.vendor.content
            const selectedVendorName = response.find(vendor => vendor.vendorId === vendorId);
            vendorName = selectedVendorName.vendorName;
        setVendorName(vendorName);
      },[props.inwardDV.vendorName])

      console.log("1111111111", props)
      console.log("vendorName", vendorName)
      const location = useLocation()
console.log("locationLLLLLLLLL", location.state);
      
    return (
        <>
        <Col span={24}>
            {props.party.loading && <Spin className="gx-size-100 gx-flex-row gx-justify-content-center gx-align-items-center" size="large"/>}
            {props.party.partyList.length > 0 &&
                // <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form gx-pt-4" style={{"width":"70%"}}>
                <Form {...formItemLayout} className="login-form gx-pt-4" >
                   <Row>
                        <Col span={12} >
                    <Form.Item label="Vendor Name">
                            {getFieldDecorator('vendorNameReco', {
                                initialValue: vendorName
                            })(
                                <Input id="vendorNameReco" disabled/>
                            )}
                    </Form.Item>
                    <Form.Item label="Consignment Id">
                            {getFieldDecorator('consignmentIdReco', {
                            initialValue: props.consignmentId?.seqNo
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
                    {/* <Row gutter={16}>
                        <Col span={8} ></Col>
                        <Col span={4} style={{textAlign: 'center'}}>Net Weight</Col>
                        <Col span={4} style={{textAlign: 'center'}}>Rate</Col>
                        <Col span={4} style={{textAlign: 'center'}}>Value</Col>
                    </Row> */}
                    <Row gutter={16}>
                    <Col span={8}>
                    <AutoComplete
                        // style={{width: 200}}
                        placeholder="Select item"
                        dataSource={dataSource}
                        onChange= {props.params!=="" ?(e) =>handleChange(e,'material.description'):""}
                        filterOption={(inputValue, option) => {
                            return option.props.children?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 || false
                        }
                        }
                    />
                    </Col>
                    <Col span={4}>
                    <Input></Input>
                    </Col>
                    <Col span={4}>
                    <Input></Input>
                    </Col>
                    <Col span={4}>
                    <Input></Input>
                    </Col>
                    </Row>
                    <div className="gx-mt-4" style={{ backgroundColor: 'rgba(135, 206, 235, 0.2)', padding: '5px' }} >
                    <Row gutter={10} >
                        <Col span={8} className="gx-mt-2" style={{textAlign: 'right'}}>
                        <h3>Total</h3> 
                        </Col>
                        <Col span={4}>
                        <Input style={{ backgroundColor: 'blue', color: 'white' }} />
                        </Col>
                        <Col span={4}></Col>
                        <Col span={4}>
                        <Input style={{ backgroundColor: 'blue', color: 'white' }} />
                        </Col>
                    </Row>
                    </div>
                </div>
                {/* <Col span={16} className="gx-mt-4" style={{ border: '1px solid #ccc', padding: '10px' }}> */}
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
                {getFieldDecorator('weighmentToalWeight', {
                   
                })(
                    <Input id="weighmentToalWeight" onChange= {props.params!=="" ?(e) =>handleChange(e,'frieghtCharges'):""}/>
                )}
            </Form.Item>
            <Form.Item label="Variance">
                {getFieldDecorator('variance', {
                   
                })(
                    <Input id="variance" onChange= {props.params!=="" ?(e) =>handleChange(e,'addInsurance'):""}/>
                )}
            </Form.Item>
                <Form.Item label="Loss or profit Amount">
                {getFieldDecorator('lossOrProfitAmount', {
                   
                })(
                    <Input id="lossOrProfitAmount" onChange= {props.params!=="" ?(e) =>handleChange(e,'frieghtCharges'):""}/>
                )}
            </Form.Item>
            <Form.Item label="Remarks">
                {getFieldDecorator('remarks', {
                   
                })(
                    <Input id="remarks" onChange= {props.params!=="" ?(e) =>handleChange(e,'addInsurance'):""}/>
                )}
            </Form.Item>
            <Form.Item label="Frieght deducted">
                {getFieldDecorator('deductedOption', {
                   
                })(
                    <Select placeholder="Select an option">
                                <Option value="YES">YES</Option>
                                <Option value="NO">NO</Option>
                            </Select>
                )}
            </Form.Item>
            
            <Form.Item label="Frieght deducted Amount">
                {getFieldDecorator('deductedAmount', {
                   
                })(
                    <Input id="deductedAmount" onChange= {props.params!=="" ?(e) =>handleChange(e,'addInsurance'):""}/>
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
                    <Input id="debitQTY" onChange= {props.params!=="" ?(e) =>handleChange(e,'addInsurance'):""}/>
                )}
            </Form.Item>
            <Form.Item label="Debit note rate">
                {getFieldDecorator('debitRate', {
                   
                })(
                    <Input id="debitRate" onChange= {props.params!=="" ?(e) =>handleChange(e,'addInsurance'):""}/>
                )}
            </Form.Item>
            <Form.Item label="Debit note value">
                {getFieldDecorator('debitValue', {
                   
                })(
                    <Input id="debitValue" onChange= {props.params!=="" ?(e) =>handleChange(e,'addInsurance'):""}/>
                )}
            </Form.Item>
            
            <Form.Item label="Final Loss or Profit">
                {getFieldDecorator('finalLossOrProfit', {
                   
                })(
                    <Input id="finalLossOrProfit" onChange= {props.params!=="" ?(e) =>handleChange(e,'addInsurance'):""}/>
                )}
            </Form.Item>
            </Col>       
            </Row>
                <Row className="gx-mt-4">
                    <Col span={20} offset={4} style={{ textAlign: "center"}}>
                        <Button style={{ marginLeft: 4 }} onClick={() => props.updateStep(3)}>
                            <Icon type="left"/>Back
                        </Button>
                        {/* <Button type="primary" htmlType="submit">
                            Forward<Icon type="right"/>
                        </Button> */}
                        <Button type="primary" onClick={handleSubmit}>
                            Forward
                        </Button>
                    </Col>
                </Row>
            </Form>
            }
            </Col>
            {/* <Col span={8} className="gx-pt-4">
                <Card title="Inward Details" style={{ width: 400 }}>
                    {props.inwardDV.purposeType && <p>Purpose Type : {props.inwardDV.purposeType}</p>}
                    {props.inwardDV.vendorName && <p>Vendor Name : { vendorName}</p>}
                    {props.inwardDV.vendorId && <p>Vendor ID : {props.inwardDV.vendorName}</p>}
                    {props.inwardDV.vendorBatchNo && <p>Vendor BatchNo : {vendorBatchNo}</p>}
                    {props.inwardDV.itemName && <p>Item Name : {props.inwardDV.itemName}</p>}
                    <p>Net Weight :   </p>
                    <p>Item Name :  </p>
                    <p>Net Weight :   </p>
                </Card>
            </Col> */}
        </>
    )
}

const mapStateToProps = state => ({
    party: state.party,
    inward: state.inward.inward,
    inwardStatus: state.inward,
    consignmentId: state.inwardDV.consignmentId,
    location: state.location,
    inwardDV: state.inwardDV.inward,
    vendor: state.vendor.vendorList,
    weighbridge: state.weighbridge
});

const Recociliation = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            vendorNameReco: Form.createFormField({
                ...props.inwardDV.vendorName,
                // value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
                value: (props.inwardDV.vendorName) ? props.inwardDV.vendorName : props.vendorName
            }),
            consignmentId: Form.createFormField({
                ...props.inwardDV.consignmentId,
                // value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
                value: (props.inwardDV.consignmentId) ? props.inwardDV.vendorBatchNo : props.consignmentId?.seqNo
            }),
            vehicleNoReco: Form.createFormField({
                ...props.inwardDV.vehicleNo,
                // value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
                value: (props.inwardDV.vehicleNo) ? props.inwardDV.vehicleNo : ''
            }),
            documentNo: Form.createFormField({
                ...props.inwardDV.documentNo,
                // value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
                value: (props.inwardDV.documentNo) ? props.inwardDV.documentNo : ''
            }),
            ewayBillNo: Form.createFormField({
                ...props.inwardDV.ewayBillNo,
                // value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
                value: (props.inwardDV.ewayBillNo) ? props.inwardDV.ewayBillNo : ''
            }),
            locationId: Form.createFormField({
                ...props.inwardDV.locationId,
                // value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
                value: (props.inwardDV.locationId) ? props.inwardDV.locationId : ''
            }),
            documentType: Form.createFormField({
                ...props.inwardDV.documentType,
                // value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
                value: (props.inwardDV.documentType) ? props.inwardDV.documentType : ''
            }),
            documentDate: Form.createFormField({
                ...props.inwardDV.documentDate,
                // value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
                value: (props.inwardDV.documentDate) ? props.inwardDV.documentDate : ''
            }),
            ewayBillDate: Form.createFormField({
                ...props.inwardDV.ewayBillDate,
                // value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
                value: (props.inwardDV.ewayBillDate) ? props.inwardDV.ewayBillDate : ''
            }),
            valueOfGoods: Form.createFormField({
                ...props.inwardDV.valueOfGoods,
                // value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
                value: (props.inwardDV.valueOfGoods) ? props.inwardDV.valueOfGoods : ''
            }),
            partyName: Form.createFormField({
                ...props.inward.partyName,
                value: ( props.params !== "" && props.inward.party) ?props.inward.party.partyName :(props.inward.partyName) ? props.inward.partyName: '',
            }),
            customerId: Form.createFormField({
                ...props.inward.customerId,
                value: props.params !== "" ? props.inward.party?.nPartyId:(props.inward.customerId) ? props.inward.customerId : props.inward.partyName,
            }),
            customerBatchNo: Form.createFormField({
                ...props.inward.customerBatchNo,
                value: props.params !== "" ? props.inward.customerBatchId:(props.inward.customerBatchNo) ? props.inward.customerBatchNo : '',
            }),
            customerInvoiceNo: Form.createFormField({
                ...props.inward.customerInvoiceNo,
                value: (props.inward.customerInvoiceNo) ? props.inward.customerInvoiceNo : '',
            }),
            purposeType: Form.createFormField({
                ...props.inward.purposeType,
                value: (props.inward.purposeType) ? props.inward.purposeType : '',
            }),
            locationId: Form.createFormField({
                ...props.inwardDV.locationId,
                value: (props.inwardDV.locationId) ? props.inwardDV.locationId : '',
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
    generateConsignmentId,
    fetchLocationList,
    fetchVendorList,
    fetchWeighbridgeList
})(Recociliation);
