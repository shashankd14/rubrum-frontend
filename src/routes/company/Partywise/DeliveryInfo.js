import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Card, Table } from "antd";
import { Popover } from "antd";
import { InfoCircleOutlined,CloseSquareTwoTone } from "@ant-design/icons";
import { postDeliveryConform } from "../../../appRedux/actions";
import { Input } from "antd";

const DeliveryInfo = (props) => {
  const [vehicleNo, setVehicleNo] = useState("");
  const [remarksList, setRemarksList] = useState([]);

  const handleRemark = (elem,id) => {
    let index = remarksList.findIndex(elem => elem.id === id)
    let newRemarksList = remarksList
    newRemarksList[index] = {instructionId:id,remark:elem.target.value}
    setRemarksList(newRemarksList)
  }

  const handleSubmit = () => {
    postDeliveryConform(vehicleNo);
  };

  return (
    <div>
      <h1>Delivery Information</h1>
      <Card>
        {props.inward.inwardList.length > 0 ? (
          props.inward.inwardListForDelivery.map((elem) => (
            <div
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
                  <p style={{ fontWeight: "bold" }}>Coil Number - 001</p>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div>
                    <p style={{ marginTop: "10px" }}>
                      Coil Width:{elem.fWidth}
                    </p>
                  </div>
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Coil Thickness:{elem.fThickness}
                    </p>
                  </div>
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Coil Weight:{elem.fQuantity}
                    </p>
                  </div>
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Sliting Date:
                    </p>
                  </div>
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Coil Length:
                    </p>
                  </div>
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Rate -{" "}
                    </p>
                  </div>
                  <div style={{ marginLeft: "3px",marginTop: "10px" }}>
                    <Popover
                      content={
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <p>a:</p>
                          <p>b:</p>
                          <p>c:</p>
                        </div>
                      }
                      title="Rate"
                    >
                      <InfoCircleOutlined />
                    </Popover>
                  </div>
                  <div style={{marginLeft:"20px"}}>
                    <Input
                      placeholder="Remarks"
                      type="text"
                    />
                  </div>
                  <div style={{marginLeft:"20px"}}>
                  <CloseSquareTwoTone style={{width:"20px"}} />
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
            <Input
              placeholder="Vehicle Number"
              type="text"
              onChange={(e) => setVehicleNo(e.target.value)}
            />
          </div>
          <div>
            <button
              type="primary"
              style={{
                marginBottom: "10px",
                padding: "6px 15px",
                marginRight: "20px",
                backgroundColor: "#26eb5d",
                color: "white",
                border: "none",
              }}
              onClick={handleSubmit}
            >
              Conform
            </button>
            <button
              style={{ marginBottom: "10px", padding: "6px 15px" }}
              onClick={() => {
                props.history.push("/company/partywise-register");
              }}
            >
              Go Back
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
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  inward: state.inward,
});

export default connect(mapStateToProps, { postDeliveryConform })(DeliveryInfo);
