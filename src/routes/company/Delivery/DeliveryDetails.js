import React from "react";
import { Descriptions, Input, Popover } from 'antd';
import { InfoCircleOutlined, CloseSquareTwoTone } from "@ant-design/icons";
import moment from "moment";


const DeliveryDetails = () => {
  return (
      <div>
        <div>
            <h3>Delivery Information</h3>
        </div>
        <div>
        <Descriptions title="Buyer Details">
           <Descriptions.Item>
                Client Name: MongoDB
                <br />
                City: 3.4
                <br />
                Email: dds.mongo.mid
                <br />
                Phone: 10 GB
                <br />
           </Descriptions.Item>
        </Descriptions>
        <Descriptions title="Tax Information">
           <Descriptions.Item>
                Details ADD: MongoDB
                <br />
           </Descriptions.Item>
        </Descriptions>
        <Descriptions title="Total">
           <Descriptions.Item>
                Details ADD: 
                <br />
           </Descriptions.Item>
        </Descriptions>
        </div>
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
                  <p style={{ fontWeight: "bold" }}>Coil Number - {}</p>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div>
                    <p style={{ marginTop: "10px" }}>
                      Coil Width:{}
                    </p>
                  </div>
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Coil Thickness:{}
                    </p>
                  </div>
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Coil Weight:{}
                    </p>
                  </div>
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Sliting Date:{moment().format('DD/MM/YYYY')}
                    </p>
                  </div>
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Coil Length:{}
                    </p>
                  </div>
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Rate -{}
                    </p>
                  </div>
                  <div style={{ marginLeft: "3px", marginTop: "10px" }}>
                    <Popover
                      content={
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <p>Thickeness: {}</p>
                          <p>Process: {}</p>
                          <p>Material: {}</p>
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
                    />
                  </div>
                  <div style={{ marginLeft: "20px" }}>
                    <CloseSquareTwoTone style={{ width: "20px" }} />
                  </div>
                </div>
              </div>
            </div>
      </div>
    

  );
};

export default DeliveryDetails;
