import React, {useEffect, useState}from "react";
import {connect} from "react-redux";
import { Descriptions, Input, Popover } from 'antd';
import { InfoCircleOutlined, CloseSquareTwoTone } from "@ant-design/icons";
import {fetchDeliveryListById} from "../../../appRedux/actions";
import moment from "moment";


const DeliveryDetails = (props) => {
  const [deliveryById, setDeliveryById]=useState(props.delivery.deliveryById);
  const [coil, setCoil] = useState(props.delivery.deliveryList);
  useEffect(() => {
    if(props.delivery.deliveryList.length>0){
      let coilList =coil.filter(element => element.deliveryDetails.deliveryId == props.match.params.deliveryId);
      setCoil(coilList[0]);
    }
}, [])
useEffect(() => {
  if(!props.delivery.loading && props.delivery.success) {
    setDeliveryById(props.delivery.deliveryById);
  }
}, [props.delivery.loading, props.delivery.success])
  return (
      <div>
        <div>
            <h3>Delivery Information</h3>
        </div>
       
        {deliveryById.length > 0 ? deliveryById.map((elem) => (
            <div key={elem.instructionId}
              style={{
                border: "1px solid black",
                display: "flex",
                padding: "5px 10px",
                margin: "10px 0px",
              }}

            >
              <div style={{ padding: "10px" }}>
                <img
                  src={require("assets/images/inward/cutting_icon.svg")}
                  alt="main coil image"
                  title="main coil image"
                  style={{ marginTop: "10px" }}
                />
              </div>
              <div className="flex flex-col">
                <div style={{ marginTop: "5px" }}>
                  <p style={{ fontWeight: "bold" }}><b>Coil Number -</b> {coil.coilNumber} </p>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div>
                    <p style={{ marginTop: "10px" }}>
                      <b>Batch No:</b>{coil.customerBatchId} |
                    </p>
                  </div>
                  <div>
                    <p style={{ marginTop: "10px" }}>
                      <b>Quantity:</b>{elem.actualWeight !==null? elem.actualWeight: elem.plannedWeight} |
                    </p>
                  </div>
                  <div>
                    <p style={{ marginTop: "10px" }}>
                      <b>Coil Width:</b>{elem.actualWidth !==null ? elem.actualWidth: elem.plannedWidth} |
                    </p>
                  </div>
                  
                  
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      <b>Coil Length:</b>{elem.actualLength !==null ? elem.actualLength: elem.plannedLength} |
                    </p>
                  </div>
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      <b>No Of Pieces:</b>{elem.actualNoOfPieces !==null ? elem.actualNoOfPieces: elem.plannedNoOfPieces} 
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )): <p> No Item to display for the selected delivery chalan Number</p>}
      </div>
    

  );
};

const mapStateToProps = state => ({
  delivery: state.deliveries,
});

export default connect(mapStateToProps, {
  fetchDeliveryListById,
})(DeliveryDetails);
