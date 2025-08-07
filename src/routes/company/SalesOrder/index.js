import React, { useEffect, useState } from "react";
import IntlMessages from "../../../util/IntlMessages";
import {
  fetchPacketList,
  fetchSalesOrderList,
  saveSalesOrderForPacket,
  fetchPartyList,
} from "../../../appRedux/actions";
import { useDispatch, useSelector } from "react-redux";
import {
  Input,
  Table,
  Tabs,
  Icon,
  message,
  Button,
  Select,
  Card,
  AutoComplete,
} from "antd";
import SearchBox from "../../../components/SearchBox";
import moment from "moment";
import SoList from "./soList";

const { TabPane } = Tabs;
const { Option } = AutoComplete;

const SalesOrder = () => {
  const dispatch = useDispatch();
  const salesOrder = useSelector((state) => state.salesOrder);
  const partyList = useSelector((state) => state.party.partyList);
  const [packetsList, setPacketsList] = useState(salesOrder.packets);
  const [salesOrderList, setSalesOrderList] = useState(salesOrder.list);
  const [searchValue, setSearchValue] = useState("");

  const endUserTags = useSelector(
    (state) => state.packetClassification.endUserTags
  );

  const [pageNo, setPageNo] = React.useState(1);

  const onInputChange = (index) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = [...salesOrder.packets];
    newData[index].soNumber = e.target.value;
    setPacketsList(newData);
  };

  const onEndUserInputChange = (value, index) => {
    const newData = [...salesOrder.packets];
    newData[index].customerCodeId = value;
    setPacketsList(newData);
  };

  const columns = [
    {
      title: "Plan Id",
      dataIndex: "instructionId",
      key: "instructionId",
    },
    {
      title: "Plan date",
      dataIndex: "instructionDate",
      render(value) {
        return moment(value).format("Do MMM YYYY");
      },
    },
    {
      title: "Batch no",
      dataIndex: "coilNo",
      key: "coilNo",
    },
    {
      title: "SC inward id",
      dataIndex: "customerBatchNo",
      key: "customerBatchNo",
      render: (text, record, index) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {record.customerBatchNo === "undefined"
            ? "-"
            : record.customerBatchNo}
        </div>
      ),
    },
    // {
    //   title: "Party Name",
    //   dataIndex: "partyName",
    //   key: "partyName",
    // },
    {
      title: "Material",
      dataIndex: "materialDesc",
      key: "materialDesc",
    },
    {
      title: "Material grade",
      dataIndex: "materialGrade",
      key: "materialGrade",
      render: (text, record, index) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {record.materialGrade === "undefined" || record.materialGrade === null
            ? "-"
            : record.materialGrade}
        </div>
      ),
    },
    {
      title: "Material subgrade",
      dataIndex: "subGrade",
      key: "subGrade",
      render: (text, record, index) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {record.subGrade === "undefined" || record.subGrade === null
            ? "-"
            : record.subGrade}
        </div>
      ),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      render: (text, record, index) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {record.brand === "undefined" || record.brand === null
            ? "-"
            : record.brand}
        </div>
      ),
    },
    {
      title: "Thickness",
      dataIndex: "fthickness",
      key: "fthickness",
    },
    {
      title: "Width",
      dataIndex: "fwidth",
      key: "fwidth",
    },
    {
      title: "Length",
      dataIndex: "flenghth",
      key: "flenghth",
    },
    {
      title: "Sales Order Number",
      dataIndex: "deliveryDetails.customerInvoiceNo",
      render: (text, record, index) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Input value={record.soNumber} onChange={onInputChange(index)} />
          <Icon
            onClick={() => dispatch(saveSalesOrderForPacket(record))}
            style={{ marginLeft: "8px" }}
            type="check"
          />
        </div>
      ),
    },
  ];

  const handleChange = (pagination, filters, sorter) => {
    console.log("params", pagination, filters, sorter);
  };

  useEffect(() => {
    dispatch(fetchPartyList());
    dispatch(fetchPacketList(1, 15, "", ""));
    dispatch(fetchSalesOrderList());
    // dispatch(fetchEndUserTagsList());
  }, []);

  useEffect(() => {
    if (salesOrder.success) {
      message.success("Sales order saved successfully");
    }
  }, [salesOrder.success]);

  return (
    <div>
      <h1>
        <IntlMessages id="sidebar.company.salesOrder" />
      </h1>
      <Card>
        <Tabs
          defaultActiveKey="1"
          onChange={(key) => {
            if (key == 2) dispatch(fetchSalesOrderList());
          }}
        >
          <TabPane tab="Packets List" key="1">
            <Table
              className="gx-table-responsive"
              columns={columns}
              dataSource={salesOrder.packets}
              onChange={handleChange}
              pagination={{
                pageSize: 15,
                onChange: (page) => {
                  setPageNo(page);
                  dispatch(fetchPacketList(page, 15, ""));
                },
                current: pageNo,
                total: salesOrder.packets.totalItems,
              }}
            />
          </TabPane>
          <TabPane tab="Sales Orders" key="2">
            <SoList />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SalesOrder;
