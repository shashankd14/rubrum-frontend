import React, { useEffect, useState, useRef } from "react";
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
  Card,
  AutoComplete,
  Select,
  Button,
} from "antd";
import moment from "moment";
import SoList from "./soList";

const { TabPane } = Tabs;
const { Option } = AutoComplete;

const SalesOrder = () => {
  const dispatch = useDispatch();
  const salesOrder = useSelector((state) => state.salesOrder);
  const partyList = useSelector((state) => state.party.partyList);
  const [packetsList, setPacketsList] = useState(salesOrder.packets.data);
  const [customerValue, setCustomerValue] = useState("");
  const [filteredInfo, setFilteredInfo] = useState({});

  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = React.useState(1);
  let searchInput = useRef(true);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const onInputChange = (index) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = [...packetsList];
    newData[index].soNumber = e.target.value;
    setPacketsList(newData);
  };

  const clearFilters = (value) => {
    setCustomerValue("");
    setFilteredInfo({});
    setPageNo(1);
    dispatch(fetchPacketList(1, 15, "", ""));
  };

  useEffect(() => {
    if (salesOrder.packets.data) {
      setPacketsList(salesOrder.packets.data);
    }
  }, [salesOrder.packets.data]);

  const columns = [
    {
      title: "Plan Id",
      dataIndex: "instructionId",
      key: "instructionId",
      filteredValue: filteredInfo ? filteredInfo["instructionId"] : null,
      filterDropdown: ({ confirm, clearFilters }) => {
        return (
          <div style={{ padding: 8 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "4px",
              }}
            >
              <Input
                ref={(node) => {
                  searchInput = node;
                }}
                placeholder={`Search Plan Id`}
                value={
                  filteredInfo["instructionId"]
                    ? filteredInfo["instructionId"][0]
                    : ""
                }
                onChange={(e) => {
                  const newArray = filteredInfo["instructionId"]
                    ? filteredInfo["instructionId"]
                    : [];
                  newArray[0] = e.target.value ? e.target.value : "";
                  setFilteredInfo({
                    ...filteredInfo,
                    ["instructionId"]: [...newArray],
                  });
                }}
                onPressEnter={() =>
                  handleSearch(filteredInfo, confirm, "instructionId")
                }
                style={{
                  width: 80,
                  marginBottom: 8,
                  display: "flex",
                  flex: 1,
                }}
              />
            </div>
            <div>
              <Button
                type="primary"
                onClick={() => {
                  dispatch(
                    fetchPacketList(
                      1,
                      15,
                      customerValue,
                      "",
                      filteredInfo["instructionId"][0]
                    )
                  );
                }}
                icon="search"
                size="small"
                style={{ width: 90, marginRight: 8 }}
              >
                Search
              </Button>
              <Button
                onClick={() => clearFilters(clearFilters)}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
            </div>
          </div>
        );
      },
      filterIcon: (filtered) => (
        <Icon
          type="search"
          style={{ color: filtered ? "#1890ff" : undefined }}
        />
      ),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.select());
        }
      },
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
    setPageNo(pagination.current);
    dispatch(fetchPacketList(pagination.current, pagination.pageSize, ""));
  };

  useEffect(() => {
    dispatch(fetchPartyList());
    dispatch(fetchPacketList(1, pageSize, "", ""));
    dispatch(fetchSalesOrderList());
    // dispatch(fetchEndUserTagsList());
  }, []);

  useEffect(() => {
    if (salesOrder.success) {
      message.success("Sales order saved successfully");
    }
  }, [salesOrder.success]);


  const handleCustomerChange = (value) => {
    if (value) {
      setCustomerValue(value);
      setPageNo(1);
      dispatch(fetchPacketList(1, 15, value, ""));
    } else {
      setCustomerValue("");
      // setSalesOrderList(salesOrderList);
    }
};


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
            <div>
              <Select
                id="select"
                showSearch
                style={{ width: 200 }}
                placeholder="Select a location"
                optionFilterProp="children"
                onChange={handleCustomerChange}
                value={customerValue}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {partyList.length > 0 &&
                  partyList.map((party) => (
                    <Option key={party.nPartyId} value={party.nPartyId}>
                      {party.partyName}
                    </Option>
                  ))}
              </Select>
              &emsp;
              <Button
                onClick={() => clearFilters()}
                style={{ marginBottom: "1px" }}
              >
                Clear All filters
              </Button>
            </div>
            <br />
            <Table
              className="gx-table-responsive"
              columns={columns}
              dataSource={packetsList}
              onChange={handleChange}
              pagination={{
                showTotal: (total, range) =>
                  `Showing ${range[0]}-${range[1]} of ${total} items`,
                pageSize: 15,
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
