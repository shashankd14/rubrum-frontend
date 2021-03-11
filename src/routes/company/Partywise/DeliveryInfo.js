import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Card, Table } from "antd";
import { Popover } from "antd";
import { InfoCircleOutlined, CloseSquareTwoTone } from "@ant-design/icons";
import { postDeliveryConfirm } from "../../../appRedux/actions";
import { Input } from "antd";
import moment from "moment";

const DeliveryInfo = (props) => {
  const [vehicleNo, setVehicleNo] = useState("");
  const [remarksList, setRemarksList] = useState([]);

  const handleRemark = (elem, id) => {
    let index = remarksList.findIndex(elem => elem.id === id)
    let newRemarksList = remarksList
    newRemarksList[index] = { instructionId: id, remark: elem.target.value }
    setRemarksList(newRemarksList)
  }

  const handleSubmit = () => {
    const reqObj = {
      vehicleNo,
      inwardListForDelivery: props.inward.inwardListForDelivery
    }
    props.postDeliveryConfirm(reqObj);
  };

  return (
    <div>
      <h1>Delivery Information</h1>
      <Card>
        {props.inward.inwardList.length > 0 ? (
          props.inward.inwardListForDelivery.map((elem) => (
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
                      Sliting Date:{moment(elem.instructionDate).format('DD/MM/YYYY')}
                    </p>
                  </div>
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Coil Length:{elem.plannedLength}
                    </p>
                  </div>
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Rate -{elem?.rateId}
                    </p>
                  </div>
                  <div style={{ marginLeft: "3px", marginTop: "10px" }}>
                    <Popover
                      content={
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <p>Thickeness: {elem.actualWeight && elem.rates && elem.rates?.thicknessRate ?
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
                }} onClick={handleSubmit} >Confirm</button>
            }
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
});

export default connect(mapStateToProps, { postDeliveryConfirm })(DeliveryInfo);
