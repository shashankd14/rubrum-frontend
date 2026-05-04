import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Input, Card, message, Select, Col } from "antd";
import {
  fetchPackingListByParty,
  getPacketwisePriceDCFullHandling,
  getLaminationChargesByPartyId,
  getPacketwisePriceDC,
  postDeliveryConfirm,
  generateDCPdf,
  resetInstruction,
  saveUnprocessedDelivery,
  fetchMaterialsBySoID,
} from "../../../appRedux/actions";
import moment from "moment";
import { Button, Table, Modal } from "antd";

const DeliveryInfo = (props) => {
  const Option = Select.Option;
  const [vehicleNo, setVehicleNo] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [instructionList, setInstructionList] = useState([]);
  const [fullHandling, setFullHandling] = useState(false);
  const [thickness, setThickness] = useState();
  const [partyRate, setPartyRate] = useState(0);
  const [packingRateId, setPackingRateId] = useState("");
  const [laminationCharges, setLaminationCharges] = useState(0);
  const [laminationId, setLaminationId] = useState("");

  const [priceModal, setPriceModal] = useState(false);
  const [priceDetails, setPriceDetails] = useState(
    props.packetwisePriceDC?.priceDetailsList,
  );
  const deliveryColumns = [
    {
      title: "Plan Id",
      dataIndex: "instructionId",
      key: "instructionId",
    },
    {
      title: "Batch No.",
      dataIndex: "coilNo",
      key: "coilNo",
    },
    {
      title: "SC inward id",
      dataIndex: "customerBatchNo",
      key: "customerBatchNo",
      render: (text, record, index) => {
        return (
          <div>
            {record.customerBatchNo && record.customerBatchNo !== "undefined"
              ? record.customerBatchNo
              : "-"}
          </div>
        );
      },
    },
    {
      title: "Material Grade Name",
      dataIndex: "matGradeName",
      key: "matGradeName",
    },
    {
      title: "Material Subgrade Name",
      dataIndex: "subGradeName",
      key: "subGradeName",
    },
    {
      title: "Thickness",
      dataIndex: "thickness",
      key: "thickness",
    },
    {
      title: "Width",
      dataIndex: "width",
      key: "width",
    },
    {
      title: "Length",
      dataIndex: "length",
      key: "length",
    },
    {
      title: "Actual Weight\n(in KG)",
      dataIndex: "actualWeight",
      key: "actualWeight",
    },
    {
      title: "Additional Weight (PT)",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text, record) => {
        return record.additionalWeight;
      },
    },
    {
      title: "Total Weight\n(in KG)",
      dataIndex: "totalWeight",
      render: (text, record) => {
        const totalWeight = record.actualWeight + record.additionalWeight;
        return <div>{totalWeight}</div>;
      },
    },

    {
      title: "Total Rate\n(per ton)",
      dataIndex: "rate",
      key: "rate",
    },
    {
      title: "Amount",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
    {
      title: "Negative Weight",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text, record) => {
        return (
          <Button
            type="primary"
            onClick={() => {
              window.location.href =
                window.location.origin +
                "#/company/locationwise-register/editFinish/" +
                record.coilNo;
            }}
          >
            Edit finish
          </Button>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
  ];
  const [priceColumn, setPriceColumn] = useState(deliveryColumns);

  const [validationStatus, setValidationStatus] = useState(false);

  const onInputChange = (index, soID, field) => {
    setPriceDetails((prev) => {
      if (!Array.isArray(prev)) return prev;

      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: soID,
      };

      return updated;
    });
  };

  useEffect(() => {
    if (props.packetwisePriceDC?.priceDetailsList)
      setPriceDetails(props.packetwisePriceDC?.priceDetailsList);
  }, [props.packetwisePriceDC?.priceDetailsList]);

  useEffect(() => {
    if (props.salesOrder?.materials && priceDetails) {
      const updatedPriceDetails = priceDetails.map((priceDetail) => {
        if (!priceDetail.sono) return priceDetail;

        return {
          ...priceDetail,
          materialList: props.salesOrder.materials[priceDetail.sono] || [],
        };
      });

      setPriceDetails(updatedPriceDetails);
    }
  }, [props.salesOrder?.materials]);

  useEffect(() => {
    if (
      props.packetwisePriceDC &&
      typeof props.packetwisePriceDC.validationStatus === "boolean"
    ) {
      setValidationStatus(props.packetwisePriceDC.validationStatus);
    }
  }, [props.packetwisePriceDC.validationStatus]);

  const dispatch = useDispatch();

  const handlePacketPrice = (e) => {
    if (checkRemarksIncomplete()) {
      message.error(
        "Please fill all remarks for all the packets before proceeding",
        2,
      );
      return;
    }
    setPriceModal(true);
    const iList = props?.inward.inwardListForDelivery.filter(
      (item) =>
        (item?.inwardEntryId && item?.status?.statusName === "RECEIVED") ||
        (item?.instruction?.length &&
          !item.childInstructions &&
          !item.instructionId &&
          item?.status?.statusName === "READY TO DELIVER"),
    );

    if (iList?.length) {
      const payload = {
        inwardEntryId: iList.map((item) => ({
          inwardId: item.inwardEntryId,
        })),
        laminationId,
        vehicleNo,
        deliveryType,
        packingRateId,
        // motherCoilDispatch: true
      };
      setFullHandling(true);
      props.getPacketwisePriceDCFullHandling(payload);
      // props.saveUnprocessedDelivery(payload)
      const reqObj = {
        packingRateId,
        laminationId,
        vehicleNo,
        deliveryType,
        inwardListForDelivery: props.inward.inwardListForDelivery.map(
          (item) => ({
            instructionId: item.instructionId,
            remarks: item.remarks || null,
            actualWeight: item.plannedWeight || item.actualWeight,
          }),
        ),
      };
      dispatch(getPacketwisePriceDC(reqObj));
    } else {
      const reqObj = {
        packingRateId,
        vehicleNo,
        deliveryType,
        laminationId,
        inwardListForDelivery: props.inward.inwardListForDelivery.map(
          (item) => ({
            instructionId: item.instructionId,
            remarks: item.remarks || null,
            actualWeight: item.plannedWeight || item.actualWeight,
          }),
        ),
      };
      dispatch(getPacketwisePriceDC(reqObj));
    }
    setPriceModal(true);
    setPriceColumn([
      ...deliveryColumns,
      ...(deliveryType === "Sales Order"
        ? [
            {
              title: "Sales Order Number",
              dataIndex: "deliveryDetails.customerInvoiceNo",
              width: 300,
              key: "soNumber",
              render: (text, record, index) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Select
                    style={{ flex: 1, minWidth: 0 }}
                    labelInValue
                    mode="combobox"
                    optionLabelProp="label"
                    allowClear={true}
                    value={
                      record?.sono
                        ? { key: record.sono, label: record.sono }
                        : undefined
                    }
                    notFoundContent={null}
                    showSearch={true}
                    placeholder="Select a SO number"
                    optionFilterProp="children"
                    showArrow={true}
                    onSelect={(soId, option) => {
                      if (!soId) {
                        onInputChange(index, null, "sono");
                        onInputChange(index, null, "mmid");
                        onInputChange(index, null, "materialName");
                        return;
                      }
                      dispatch(fetchMaterialsBySoID(soId?.key));
                      onInputChange(index, soId?.key, "sono");
                    }}
                    onChange={(materialId, option) => {
                      if (!materialId) {
                        onInputChange(index, null, "sono");
                        onInputChange(index, null, "mmid");
                        onInputChange(index, null, "materialName");
                        return;
                      }
                      onInputChange(index, materialId?.key, "sono");
                    }}
                    filterOption={(input, option) => {
                      const name = String(
                        option?.props["data-name"] || "",
                      ).toLowerCase();
                      const code = String(
                        option?.props?.label || "",
                      ).toLowerCase();
                      const searchText = String(input || "").toLowerCase();

                      return (
                        name.includes(searchText) || code.includes(searchText)
                      );
                    }}
                  >
                    {(record?.mappedSOList || []).map((so) => (
                      <Option key={so} value={so} label={so} data-name={so}>
                        {so}
                      </Option>
                    ))}
                  </Select>
                </div>
              ),
            },
            {
              title: "Materials",
              dataIndex: "deliveryDetails.materialId",
              key: "materialId",
              width: 250,
              render: (text, record, index) => (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Select
                    style={{ flex: 1, minWidth: 0 }}
                    labelInValue
                    mode="combobox"
                    optionLabelProp="label"
                    // disabled={
                    //   props.inward.disableSelection || props.inwardStatus.saveTemporary
                    // }
                    dropdownMatchSelectWidth={false} // default is true, but make sure it isn't false
                    allowClear={true}
                    value={
                      record?.mmid
                        ? { key: record.mmid, label: record.mmid }
                        : undefined
                    }
                    notFoundContent={null}
                    showSearch={true}
                    placeholder="Select a material ID"
                    optionFilterProp="children"
                    showArrow={true}
                    onSelect={(materialId, option) => {
                      if (!materialId) {
                        onInputChange(index, null, "mmid");
                        onInputChange(index, null, "materialName");
                        return;
                      }
                      onInputChange(index, materialId?.key, "mmid");
                      onInputChange(
                        index,
                        option?.props["data-material-name"],
                        "materialName",
                      );
                    }}
                    onChange={(materialId, option) => {
                      if (!materialId) {
                        onInputChange(index, null, "mmid");
                        onInputChange(index, null, "materialName");
                        return;
                      }
                      onInputChange(index, materialId?.key, "mmid");
                      onInputChange(
                        index,
                        option?.props["data-material-name"],
                        "materialName",
                      );
                    }}
                    filterOption={(input, option) => {
                      const name = String(
                        option?.props["data-material-name"] || "",
                      ).toLowerCase();
                      const code = String(
                        option?.props?.label || "",
                      ).toLowerCase();
                      const searchText = String(input || "").toLowerCase();

                      return (
                        name.includes(searchText) || code.includes(searchText)
                      );
                    }}
                  >
                    {record?.sono && record?.materialList
                      ? (record?.materialList || []).map((material) => (
                          <Option
                            key={material.mmid}
                            value={material.mmid}
                            label={material.mmid}
                            data-material-name={material?.materialName}
                          >
                            <div>
                              <p>{material.mmid}</p>
                              <p>{material.materialName}</p>
                            </div>
                          </Option>
                        ))
                      : null}
                  </Select>
                  <p style={{ marginTop: "2px" }}>{record?.materialName}</p>
                </div>
              ),
            },
          ]
        : []),
    ]);
  };

  useEffect(() => {
    const partyId = props.inward.inwardListForDelivery?.map(
      (ele) => ele?.party?.nPartyId || "",
    );
    props.fetchPackingListByParty(partyId);
    props.getLaminationChargesByPartyId(partyId);
  }, []);

  useEffect(() => {
    let insList = props.inward.inwardListForDelivery?.map((i) => {
      const inwardList = props?.inward?.inwardList.filter(
        (item) => item.inwardEntryId === i.inwardEntryId,
      );
      inwardList.map((item) => setThickness(item?.fThickness));
      return i?.instruction?.length ? i?.instruction : i;
    });
    insList = insList?.flat();
    setInstructionList(insList?.map((item) => item.instructionId));
  }, []);

  useEffect(() => {
    if (props.inward.deliverySuccess) {
      let insList = props.inward?.unprocessedSuccess?.length
        ? props.inward?.unprocessedSuccess?.map((item) => item?.instructionId)
        : [];

      const pdfPayload = {
        instructionIds: fullHandling ? insList : instructionList,
      };
      setFullHandling(false);
      props.generateDCPdf(pdfPayload);
    }
  }, [props.inward.deliverySuccess]);

  useEffect(() => {
    if (props.inward.dcpdfSuccess) {
      message
        .success("Delivery Challan pdf generated successfully", 2)
        .then(() => {
          props.resetInstruction();
          props.history.push("/company/locationwise-register");
        });
    }
  }, [props.inward.dcpdfSuccess]);

  useEffect(() => {
    if (props.inward?.unprocessedSuccess?.length) {
      const fullHandlingList = props.inward?.unprocessedSuccess.map((item) => {
        if (item?.process?.processId === 8) {
          return item;
        }
      });
      const emptySo =
        deliveryType === "Sales Order" && checkSalesOrderMaterials();

      if (emptySo) {
        message.error("Please select Sales Order Number and Material ID");
        return;
      }
      const reqObj = {
        vehicleNo,
        taskType: "FULL_HANDLING",
        packingRateId,
        laminationId,
        inwardListForDelivery: fullHandlingList,
        priceDetails,
      };
      props.postDeliveryConfirm(reqObj);
      props.saveUnprocessedDelivery(reqObj);
      //  props.getPacketwisePriceDC(reqObj);
    }
  }, [props.inward.unprocessedSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const iList = props?.inward.inwardListForDelivery.filter(
      (item) =>
        (item?.inwardEntryId && item?.status?.statusName === "RECEIVED") ||
        (item?.instruction?.length &&
          !item.childInstructions &&
          !item.instructionId &&
          item?.status?.statusName === "READY TO DELIVER"),
    );

    const emptySo =
      deliveryType === "Sales Order" && checkSalesOrderMaterials();

    if (emptySo) {
      message.error("Please select Sales Order Number and Material ID");
      return;
    }

    if (iList?.length) {
      const payload = {
        inwardEntryId: iList.map((item) => item.inwardEntryId),
        laminationId,
        vehicleNo,
        packingRateId,
        deliveryType,
        motherCoilDispatch: true,
        priceDetails: priceDetails,
      };
      setFullHandling(true);
      props.saveUnprocessedDelivery(payload);
    } else {
      const reqObj = {
        packingRateId,
        vehicleNo,
        laminationId,
        inwardListForDelivery: props.inward.inwardListForDelivery,
        priceDetails: priceDetails,
        deliveryType,
      };
      props.postDeliveryConfirm(reqObj);
      if (props.inward?.unprocessedSuccess?.length) {
        const fullHandlingList = props.inward?.unprocessedSuccess.map(
          (item) => {
            if (item?.process?.processId === 8) {
              return item;
            }
          },
        );
        const reqObj = {
          vehicleNo,
          taskType: "FULL_HANDLING",
          packingRateId,
          laminationId,
          inwardListForDelivery: fullHandlingList,
          priceDetails,
        };
        props.postDeliveryConfirm(reqObj);
        props.saveUnprocessedDelivery(reqObj);
      }
    }
  };

  const checkRemarksIncomplete = () => {
    let incomplete = false;
    if (props.inward.inwardList.length > 0) {
      props.inward.inwardListForDelivery.forEach((item) => {
        if (
          (item?.instructionId ||
            item?.status?.statusName === "RECEIVED" ||
            item?.status?.statusName === "READY TO DELIVER") &&
          (!item.remarks || item.remarks.trim() === "")
        ) {
          incomplete = true;
        }
      });
    }
    return incomplete;
  };

  const checkSalesOrderMaterials = () => {
    let incomplete = false;
    if (priceDetails.length > 0) {
      priceDetails.forEach((item) => {
        if (
          item?.sono === null ||
          item?.sono === "" ||
          item?.mmid === null ||
          item?.mmid === ""
        ) {
          incomplete = true;
          return;
        }
      });
    }
    return incomplete;
  };

  return (
    <div>
      <h1>Delivery Information</h1>
      <Card>
        {props.inward.inwardList.length > 0 ? (
          props.inward.inwardListForDelivery.map(
            (elem) =>
              (elem?.instructionId ||
                elem?.status?.statusName === "RECEIVED" ||
                elem?.status?.statusName === "READY TO DELIVER") && (
                <div
                  key={elem?.instructionId || elem?.inwardEntryId}
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
                      <p style={{ fontWeight: "bold" }}>
                        Batch no. - {elem.instructionId || elem?.inwardEntryId}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <div>
                        <p style={{ marginTop: "10px" }}>
                          Coil Width:{elem?.plannedWidth || elem?.fWidth}
                        </p>
                      </div>
                      {thickness && (
                        <div>
                          <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                            Coil Thickness:{thickness}
                          </p>
                        </div>
                      )}
                      <div>
                        <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                          Coil Weight:
                          {elem?.plannedWeight ||
                            props?.inward?.inwardList?.fpresent}
                        </p>
                      </div>
                      {elem?.instructionDate && (
                        <div>
                          <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                            Sliting/Cutting Date:
                            {moment(elem.instructionDate).format("DD/MM/YYYY")}
                          </p>
                        </div>
                      )}
                      <div>
                        <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                          Coil Length:{elem?.plannedLength || elem?.fLength}
                        </p>
                      </div>
                      {elem?.rateId && (
                        <div>
                          <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                            Rate -{elem?.rateId}
                          </p>
                        </div>
                      )}
                      {elem?.packetClassification && (
                        <div>
                          <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                            Tags -
                            {elem?.packetClassification?.classificationName}
                          </p>
                        </div>
                      )}
                      {elem?.endUserTagsentity && (
                        <div>
                          <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                            End User Tags -{elem?.endUserTagsentity?.tagName}
                          </p>
                        </div>
                      )}
                      <div style={{ marginLeft: "20px" }}>
                        <Input
                          placeholder="Remarks"
                          type="text"
                          defaultValue={elem.remarks}
                          onChange={(event) => {
                            elem.remarks = event.target.value;
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ),
          )
        ) : (
          <div> Nothing selected for delivery</div>
        )}
      </Card>
      {props.inward.inwardList.length > 0 ? (
        <div>
          <div style={{ display: "flex" }}>
            <div style={{ marginBottom: "15px" }}>
              <Select
                showSearch
                style={{ width: "300px" }}
                className="Packing Rate"
                placeholder="Select Packing"
                name="partyName"
                onChange={(value) => {
                  const packingData =
                    props.packing?.packingDeliveryList?.filter((party) => {
                      return party.packingRateId === value;
                    })[0];
                  setPartyRate(packingData?.packingRate || 0);
                  setPackingRateId(value);
                }}
              >
                {props.packing?.packingDeliveryList?.map((party) => (
                  <Option value={party.packingRateId}>
                    {party.packingBucketName}
                  </Option>
                ))}
              </Select>
            </div>{" "}
            <div style={{ marginBottom: "15px", flex: 5 }}>
              <Select
                showSearch
                style={{ width: "300px", marginLeft: "20px" }}
                className="Packing Rate"
                placeholder="Select Lamination Charges"
                name="partyName"
                onChange={(value) => {
                  const charges = props.laminationCharges?.filter((party) => {
                    return party.laminationId === value;
                  })[0];
                  setLaminationCharges(charges?.charges || 0);
                  setLaminationId(value);
                }}
              >
                {props.laminationCharges?.map((party) => (
                  <Option value={party.laminationId}>
                    {party.laminationDetailsDesc}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <Col span={8}>
              {!!partyRate && (
                <div style={{ marginRight: "270px" }}>
                  <p>Location Rate: {partyRate}</p>
                </div>
              )}
            </Col>
            <Col>
              {!!laminationCharges && (
                <div>
                  <p>Lamination Charges: {laminationCharges}</p>
                </div>
              )}
            </Col>
          </div>
          <div style={{ display: "flex" }}>
            <div>
              <div style={{ marginBottom: "15px" }}>
                <Input
                  style={{ width: "300px" }}
                  placeholder="Vehicle Number"
                  type="text"
                  onChange={(e) => setVehicleNo(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div
                style={{
                  marginBottom: "15px",
                }}
              >
                <Select
                  placeholder="Delivery Type"
                  style={{ width: "300px", marginLeft: "20px" }}
                  onSelect={(value) => setDeliveryType(value)}
                >
                  <Option value="Sales Order">Sales Order</Option>
                  <Option value="Stock Transfer">⁠Stock Transfer</Option>
                  <Option value="Scrap">⁠Scrap</Option>
                  <Option value="Others">Others</Option>
                </Select>
              </div>
            </div>
          </div>
          <div>
            <Button
              type="primary"
              disabled={vehicleNo.length < 1 || !deliveryType}
              onClick={handlePacketPrice}
            >
              Confirm
            </Button>
            <Modal
              title="Packet wise Rate Details"
              visible={priceModal}
              width={2500}
              onCancel={() => {
                setPriceModal(false);
              }}
              footer={[
                <Button
                  key="cancel"
                  type="secondary"
                  onClick={() => setPriceModal()}
                >
                  Cancel
                </Button>,
                <Button
                  key="goToRate"
                  type="primary"
                  disabled={validationStatus}
                  onClick={() => props.history.push("/company/master/rates")}
                >
                  Go to Rate
                </Button>,
                <Button
                  key="ok"
                  type="primary"
                  onClick={handleSubmit}
                  // TODO: Fix with api response
                  // disabled={!validationStatus}
                  loading={props.inward.loading || props.inward.dcpdfLoading}
                >
                  Confirm & Generate
                </Button>,
              ]}
            >
              <Table
                rowKey={(record) => record.instructionId}
                columns={priceColumn}
                dataSource={priceDetails}
              />
            </Modal>
            <Button
              onClick={() => {
                props.history.push("/company/locationwise-register");
              }}
            >
              Go Back
            </Button>
          </div>
        </div>
      ) : (
        <button
          style={{ marginBottom: "10px", padding: "6px 15px" }}
          onClick={() => {
            props.history.push("/company/locationwise-register");
          }}
        >
          Go Back
        </button>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  const mappedProps = {
    inward: state.inward,
    packing: state.packing,
    packetwisePriceDC: state.inward?.packetwisePriceDC,
    laminationCharges: state.rates.laminationChargesParty,
    salesOrder: state.salesOrder,
  };
  return mappedProps;
};

export default connect(mapStateToProps, {
  fetchPackingListByParty,
  getPacketwisePriceDCFullHandling,
  getLaminationChargesByPartyId,
  saveUnprocessedDelivery,
  getPacketwisePriceDC,
  postDeliveryConfirm,
  generateDCPdf,
  resetInstruction,
})(DeliveryInfo);
