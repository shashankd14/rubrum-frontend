import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Popover,Input, Card, message, Select } from "antd";
import { InfoCircleOutlined, CloseSquareTwoTone } from "@ant-design/icons";
import { fetchPackingListByParty, fetchPackingBucketList, getPacketwisePriceDC, postDeliveryConfirm, generateDCPdf,resetInstruction,saveUnprocessedDelivery } from "../../../appRedux/actions";
import moment from "moment";
import { Button, Table, Modal } from "antd";

const DeliveryInfo = (props) => {
  const Option = Select.Option;
  const [vehicleNo, setVehicleNo] = useState("");
  const [remarksList, setRemarksList] = useState([]);
  const [instructionList, setInstructionList]= useState([]);
  const [fullHandling, setFullHandling] = useState(false);
  const [thickness, setThickness] = useState();
  const [partyRate, setPartyRate] = useState(0);
  const [packingRateId, setPackingRateId] = useState('');

  const [priceModal, setPriceModal] = useState(false);
  const [validationStatus, setValidationStatus] = useState(false);
  // useEffect(() => {
  //   if(props.packetwisePriceDC && typeof props.packetwisePriceDC.validationStatus === 'boolean'){
  //     setValidationStatus(props.packetwisePriceDC.validationStatus);
  //   }
  // },[props.packetwisePriceDC.validationStatus])

  console.log('props: ', props);
  const dispatch = useDispatch();
 // const data=useSelector(state=> state.packetwisePriceDC)
 // console.log("data", data);
  const handlePacketPrice = (e) =>{
    setPriceModal(true);
    debugger;
    const reqObj = {
      packingRateId,
      vehicleNo,
      // inwardListForDelivery:props.deliveryList.map((item)=> ({
        inwardListForDelivery:props.inward.inwardListForDelivery.map((item)=> ({
       instructionId: item.instructionId,
      remarks: item.remarks || null, 
      plannedWeight: item.plannedWeight
      }))
    }
    console.log('deliveryList ', props.deliveryList);
    dispatch(getPacketwisePriceDC(reqObj));
   //props.getPacketwisePriceDC(reqObj);
  }
  const priceColumn = [
    {
      title: "Insruction ID",
      dataIndex: "instructionId",
      key: "instructionId",
    },
    {
      title: "Coil No.",
      dataIndex: "coilNo",
      key: "coilNo",
    },
    {
      title: "Customer Batch No.",
      dataIndex: "customerBatchNo",
      key: "customerBatchNo",
    },
    {
      title: "Material Grade Name",
      dataIndex: "matGradeName",
      key: "matGradeName",
    },
    {
      title: "Thickness",
      dataIndex: "thickness",
      key: "thickness",
    },
    {
      title: "Actual Weight",
      dataIndex: "actualWeight",
      key: "actualWeight",
    },
    {
      title: "Base Rate",
      dataIndex: "basePrice",
      key: "basePrice",
    },
    {
      title: "Packing Rate",
      dataIndex: "packingPrice",
      key: "packingPrice",
    },
    {
      title: "Additional Rate",
      dataIndex: "additionalPrice",
      key: "additionalPrice",
    },
    {
      title: "Total Rate",
      dataIndex: "rate",
      key: "rate",
    },
    {
      title: "Amount",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
  ];

  useEffect(() => {
     if (priceModal) {
    // const reqObj = {
    //   packingRateId,
    //   vehicleNo,
    //   inwardListForDelivery: props.inward.inwardListForDelivery,
    // };
   // props.getPacketwisePriceDC(reqObj);
   handlePacketPrice();
  }
},[props.getPacketwisePriceDC, priceModal, packingRateId, vehicleNo, props.inward.inwardListForDelivery])

  useEffect(() => {
    const partyId = props.inward.inwardListForDelivery?.map(ele => ele?.party?.nPartyId || '');
    props.fetchPackingListByParty(partyId);
  }, [])
console.log("props.inward.inwardListForDelivery", props.inward.inwardListForDelivery);

  useEffect(()=>{
    let insList = props.inward.inwardListForDelivery?.map(i => {
      const inwardList = props?.inward?.inwardList.filter(item => item.inwardEntryId === i.inwardEntryId)
      inwardList.map(item=> setThickness(item?.fThickness))
      return i?.instruction?.length ?i?.instruction: i;
    });
    insList = insList?.flat();
    setInstructionList(insList?.map(item => item.instructionId));
  },[]);

  useEffect(()=>{
    if(props.inward.deliverySuccess){
      let insList = props.inward?.unprocessedSuccess?.length ?props.inward?.unprocessedSuccess?.map(item => item?.instructionId):[]
      
      const pdfPayload ={
        instructionIds: fullHandling ?insList :instructionList
      }
      setFullHandling(false)
      props.generateDCPdf(pdfPayload);
    }

  },[props.inward.deliverySuccess])
  useEffect(()=>{
    if(props.inward.dcpdfSuccess) {
        message.success('Delivery Challan pdf generated successfully', 2).then(() => { 
          
          props.resetInstruction();
          props.history.push('/company/partywise-register');
});
}
},[props.inward.dcpdfSuccess])
useEffect(()=>{
  if(props.inward?.unprocessedSuccess?.length){
    const fullHandlingList = props.inward?.unprocessedSuccess.map(item => {
      if(item?.process?.processId === 8){
        return item
      }
    }) 
    const reqObj = {
      vehicleNo,
      taskType:"FULL_HANDLING",
      packingRateId,
      inwardListForDelivery: fullHandlingList
    }
    props.postDeliveryConfirm(reqObj);
  }
},[props.inward.unprocessedSuccess])
  const handleRemark = (elem, id) => {
    let index = remarksList.findIndex(elem => elem.id === id)
    let newRemarksList = remarksList
    newRemarksList[index] = { instructionId: id, remark: elem.target.value }
    setRemarksList(newRemarksList)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const iList= props?.inward.inwardListForDelivery.filter(item =>  item?.inwardEntryId && item?.status?.statusName ==="RECEIVED")
   
    if(iList?.length){
      const payload={
        inwardEntryId: iList.map(item => item.inwardEntryId),
        motherCoilDispatch: true
      }
      setFullHandling(true)
      props.saveUnprocessedDelivery(payload)
    }else {
        const reqObj = {
          packingRateId,
          vehicleNo,
          inwardListForDelivery: props.inward.inwardListForDelivery
        }
        props.postDeliveryConfirm(reqObj);
      }
  };

 console.log("props.packing?.packingDeliveryList",props.packing?.packingDeliveryList);
  return (
    <div>
      <h1>Delivery Information</h1>
      <Card>
        {props.inward.inwardList.length > 0 ? (
          props.inward.inwardListForDelivery.map((elem) => (elem?.instructionId || elem?.status?.statusName ==="RECEIVED") && (
            <div key={elem?.instructionId || elem?.inwardEntryId}
              style={{
                border: "1px solid black",
                display: "flex",
                padding: "5px 10px",
                margin: "10px 0px",
              }}

            >
              <div style={{ padding: "10px" }}>
                <image
                  src={require("assets/images/inward/cutting_icon.svg")}
                  title="main coil image"
                  style={{ marginTop: "10px" }}
                />
              </div>
              <div className="flex flex-col">
                <div style={{ marginTop: "5px" }}>
                  <p style={{ fontWeight: "bold" }}>Coil Number - {elem.instructionId || elem?.inwardEntryId}</p>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div>
                    <p style={{ marginTop: "10px" }}>
                      Coil Width:{elem?.plannedWidth || elem?.fWidth}
                    </p>
                  </div>
                  {thickness &&<div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Coil Thickness:{thickness}
                    </p>
                  </div>}
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Coil Weight:{elem?.plannedWeight || props?.inward?.inwardList?.fpresent}
                    </p>
                  </div>
                 {elem?.instructionDate && <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Sliting/Cutting Date:{moment(elem.instructionDate).format('DD/MM/YYYY')}
                    </p>
                  </div>}
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Coil Length:{elem?.plannedLength || elem?.fLength}
                    </p>
                  </div>
                  {elem?.rateId &&<div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Rate -{elem?.rateId}
                    </p>
                  </div>}
                  {elem?.packetClassification && <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Tags -{elem?.packetClassification?.classificationName}
                    </p>
                  </div>}
                 { elem?.endUserTagsentity &&<div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      End User Tags -{elem?.endUserTagsentity?.tagName}
                    </p>
                  </div>}
                  <div style={{ marginLeft: "3px", marginTop: "10px" }}>
                    <Popover
                      content={
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <p>Thickness: {elem.actualWeight && elem.rates && elem.rates?.thicknessRate ?
                            elem.actualWeight * elem.rates?.thicknessRate : 0}</p>
                          <p>Process: {elem.process?.processName}</p>
                          <p>Material: {elem.rates?.materialType?.description}</p>
                        </div>
                      }
                      title="Rate"
                    >
                      <InfoCircleOutlined />
                    </Popover>
                  </div>
                  
                  <div style={{ marginLeft: "20px" }}>
                    <Input
                      placeholder="Remarks"
                      type="text"
                      defaultValue={elem.remarks}
                      onChange={(event) => { elem.remarks = event.target.value; }}
                    />
                  </div>
                  <div style={{ marginLeft: "20px" }}>
                    <CloseSquareTwoTone style={{ width: "20px" }} />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div> Nothing selected for delivery</div>
        )}
      </Card>
      {props.inward.inwardList.length > 0 ? (
        <div>
          <div style={{ width: "20%", marginBottom: "15px" }}>
            <Select
               showSearch
                style={{ width: 300 }}
                className="Packing Rate"
                placeholder="Select Packing"
                name="partyName"
                onChange={(value) => {
                  const packingData = props.packing?.packingDeliveryList?.filter((party) => {
                    return party.packingRateId === value
                  })[0]
                  setPartyRate(packingData?.packingRate || 0);
                  setPackingRateId(value);
                }}
              >
                {props.packing?.packingDeliveryList?.map((party) => (
                  <Option value={party.packingRateId}>{party.packingBucketName}</Option>
                ))}
            </Select>
          </div>
          {!!partyRate && <div>
            <p>Party Rate: {partyRate}</p>
          </div>}
          <div style={{ width: "20%", marginBottom: "15px" }}>
            <Input
              placeholder="Vehicle Number"
              type="text"
              onChange={(e) => setVehicleNo(e.target.value)}
            />
          </div>
          <div>
            {vehicleNo.length < 1 ?
              < button
                type="secondary"
                style={{
                  marginBottom: "10px",
                  padding: "6px 15px",
                  marginRight: "20px",
                  color: "white",
                  border: "none",
                  cursor: "pointer"
                }}>Confirm</button>
              : <button
                type="primary"
                style={{
                  marginBottom: "10px",
                  padding: "6px 15px",
                  marginRight: "20px",
                  backgroundColor: "#26eb5d",
                  color: "white",
                  border: "none",
                  cursor: "pointer"
                // }} onClick={handleSubmit} >Confirm & Generate</button>
              }} onClick={handlePacketPrice} >Confirm</button>
            }
            <Modal
              title='Packet wise Rate Details'
              visible={priceModal}
              width={1000}
              onCancel={()=> {
                setPriceModal(false)
               }}
               footer={[
                <Button key="cancel" 
                type='primary'
                onClick={() => setPriceModal(false)}>
                  Cancel
                </Button>,
                <Button key="goToRate" 
                type='primary'
                disabled={validationStatus}
                onClick={() => props.history.push("/company/master/rates")}>
                  Go to Rate
                </Button>,
                <Button key="ok" type="primary" onClick={handleSubmit} disabled={!validationStatus}
                      >
                  Confirm & Generate
                </Button>,
              ]}
            >
              <Table columns={priceColumn}  dataSource={props.packetwisePriceDC}/>
              </Modal> 
            <button
              style={{ marginBottom: "10px", padding: "6px 15px" }}
              onClick={() => {
                props.history.push("/company/partywise-register");
              }}
            >Go Back
            </button>
          </div>
        </div>
      ) : (
        <button
          style={{ marginBottom: "10px", padding: "6px 15px" }}
          onClick={() => {
            props.history.push("/company/partywise-register");
          }}
        >
          Go Back
        </button>
      )
      }
    </div >
  );
};

const mapStateToProps = (state) => ({
  inward: state.inward,
  packing: state.packing,
  packetwisePriceDC:state.packetwisePriceDC
});

export default connect(mapStateToProps, { fetchPackingListByParty, saveUnprocessedDelivery,getPacketwisePriceDC, postDeliveryConfirm, generateDCPdf,resetInstruction})(DeliveryInfo);
