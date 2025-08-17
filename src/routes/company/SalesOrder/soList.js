import React, { useEffect, useState } from "react";
import { Table, Button, Select, AutoComplete, Input, Icon } from "antd";
import SearchBox from "../../../components/SearchBox";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSalesOrderList,
  openSoPdf,
} from "../../../appRedux/actions";
import { toPascalCase } from "util/Common";

const { Option } = AutoComplete;

const SoList = (props) => {
  const dispatch = useDispatch();
  const salesOrder = useSelector((state) => state.salesOrder);
  const [salesOrderList, setSalesOrderList] = useState(salesOrder.list);
  const partyList = useSelector((state) => state.party.partyList);
  const [searchValue, setSearchValue] = useState("");

  const [customerValue, setCustomerValue] = useState("");
  const [salesPageNo, setSalesPageNo] = React.useState(1);

  const searchSalesOrderNumber = (selectedKeys, confirm) => {
    const filteredSo = salesOrder.list.filter((so) => {
      return so.soNumber.toLowerCase().includes(selectedKeys[0].toLowerCase());
    });
    setSalesOrderList(filteredSo);
  };

  const resetSalesOrderList = () => {
    setSalesOrderList(salesOrder.list);
  };

  useEffect(() => {
    resetSalesOrderList();
  }, [salesOrder.list]);

  const expandedRowRendered = (record) => {
    const columns = [
      {
        title: "Plan Id",
        dataIndex: "instructionId",
        key: "instructionId",
      },
      {
        title: "Location",
        dataIndex: "partyName",
        key: "partyName",
      },
      {
        title: "Material Desc",
        dataIndex: "materialDesc",
        key: "materialDesc",
      },
      {
        title: "Material Grade",
        dataIndex: "materialGrade",
        key: "materialGrade",
      },
      { title: "Length", dataIndex: "flenghth", key: "flenghth" },
      { title: "Width", dataIndex: "fwidth", key: "fwidth" },
      { title: "Thickness", dataIndex: "fthickness", key: "fthickness" },
      { title: "Weight", dataIndex: "fweight", key: "fweight" },
      {
        title: "No. of cuts",
        dataIndex: "plannedNoofPieces",
        key: "plannedNoofPieces",
      },
      { title: "Status", key: "packetStatus", dataIndex: "packetStatus" },
    ];

    return (
      <Table
        columns={columns}
        dataSource={record.childListResp}
        pagination={false}
      />
    );
  };

  const handleChange = (pagination, filters, sorter) => {
    // console.log("params", pagination, filters, sorter);
  };

  const SOColumns = [
    {
      title: "Id",
      dataIndex: "soId",
      key: "soId",
    },
    {
      title: "SO Number",
      dataIndex: "soNumber",
      key: "soNumber",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search Number`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => searchSalesOrderNumber(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => searchSalesOrderNumber(selectedKeys, confirm)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button
            onClick={() => resetSalesOrderList()}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <Icon
          type="search"
          style={{ color: filtered ? "#1890ff" : undefined }}
        />
      ),
      onFilter: (value, record) =>
        record["soNumber"]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },
    {
      title: "Process name",
      dataIndex: "soStatus",
      key: "soStatus",
      render: (text, record) => {
        return record.soStatus ? toPascalCase(record.soStatus) : "-";
      },
    },
    {
      title: "Pdf",
      dataIndex: "",
      key: "",
      render: (text, record, index) => (
        <Icon
          onClick={() => dispatch(openSoPdf(record["soId"]))}
          style={{ marginLeft: "8px" }}
          type="file-pdf"
        />
      ),
    },
  ];

  useEffect(() => {
    if (searchValue) {
      if (searchValue.length >= 3) {
        setSalesPageNo(1);
        dispatch(fetchSalesOrderList(1, 15, searchValue));
      }
    } else {
      setSalesPageNo(1);
      dispatch(fetchSalesOrderList(1, 15, searchValue));
    }
  }, [searchValue]);

  const handleCustomerChange = (value) => {
    if (value) {
      setCustomerValue(value);
      setSalesPageNo(1);
      dispatch(fetchSalesOrderList(1, 15, "", value));
    } else {
      setCustomerValue("");
      setSalesOrderList(salesOrderList);
    }
  };

  return (
    <>
      <div
        style={{ display: "flex" }}
        className="table-operations gx-justify-content-between"
      >
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
            onClick={() => {
              setSearchValue("");
              setCustomerValue("");
              dispatch(fetchSalesOrderList(1, 15, "", ""));
            }}
            style={{ marginBottom: "1px" }}
          >
            Clear All filters
          </Button>
        </div>
        <SearchBox
          styleName="gx-w-50 gx-justify-content-end"
          placeholder="Search for SO number..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <br></br>
      <Table
        className="gx-table-responsive"
        columns={SOColumns}
        dataSource={salesOrderList}
        expandedRowRender={(record) => expandedRowRendered(record)}
        onChange={handleChange}
        pagination={{
          pageSize: 15,
          showTotal: (total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total} items`,
          onChange: (page) => {
            setSalesPageNo(page);
            dispatch(fetchSalesOrderList(page, 15, ""));
          },
          current: salesPageNo,
          total: salesOrder.list.totalItems,
        }}
      />
    </>
  );
};

export default SoList;
