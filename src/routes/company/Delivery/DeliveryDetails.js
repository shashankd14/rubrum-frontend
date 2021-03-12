import React, {useEffect, useState}from "react";
import {connect} from "react-redux";
import { Descriptions, Input, Popover } from 'antd';
import { InfoCircleOutlined, CloseSquareTwoTone } from "@ant-design/icons";
import {fetchDeliveryListById} from "../../../appRedux/actions";
import moment from "moment";


const DeliveryDetails = (props) => {
  useEffect(() => {
    props.fetchDeliveryListById(Number(props.match.params.deliveryId));
}, [])
  return (
      <div>
        <div>
            <h3>Delivery Information</h3>
        </div>
       
        {props.deliveryList.map((elem) => (
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
                  <p style={{ fontWeight: "bold" }}>Coil Number - {elem.instructionId}</p>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div>
                    <p style={{ marginTop: "10px" }}>
                      Batch No:{elem.deliveryId}
                    </p>
                  </div>
                  <div>
                    <p style={{ marginTop: "10px" }}>
                      Type:{elem.type}
                    </p>
                  </div>
                  <div>
                    <p style={{ marginTop: "10px" }}>
                      Quantity:{elem.fQuantity}
                    </p>
                  </div>
                  <div>
                    <p style={{ marginTop: "10px" }}>
                      Grade:{elem.grade}
                    </p>
                  </div>
                  <div>
                    <p style={{ marginTop: "10px" }}>
                      Coil Width:{elem.plannedWidth}
                    </p>
                  </div>
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Coil Thickness:{elem.fThickness}
                    </p>
                  </div>
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Coil Weight:{elem.plannedWeight}
                    </p>
                  </div>
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Coil Length:{elem.plannedLength}
                    </p>
                  </div>
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      No Of Pieces:{elem.plannedNoOfPieces}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    

  );
};

const mapStateToProps = state => ({
  deliveryList: state.deliveries.deliveryList,
});

export default connect(mapStateToProps, {
  fetchDeliveryListById,
})(DeliveryDetails);
