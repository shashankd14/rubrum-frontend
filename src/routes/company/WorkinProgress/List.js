import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { Card, Table, Input, Button, Icon } from "antd";
import SearchBox from "../../../components/SearchBox";
import IntlMessages from "../../../util/IntlMessages";
import {
  fetchWIPInwardList,
  getProducts,
  fetchPartyList,
  getInwardMaterialDetails,
} from "../../../appRedux/actions";
import { sidebarMenuItems } from "../../../constants";
import {toPascalCase} from "util/Common";

const workInProgressMenuConstants = {
  finish: "Finish",
};

function List(props) {
  const [sortedInfo, setSortedInfo] = useState({
    order: "descend",
    columnKey: "coilNumber",
  });
  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchValue, setSearchValue] = useState("");

  const [pageNo, setPageNo] = React.useState(1);
  const [menuWorkInProgressLabelList, setMenuWorkInProgressLabelList] =
    useState([]);
  let searchInput = useRef(true);

  const { totalItems } = props.inward;

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const columns = [
    {
      title: "Batch no.",
      dataIndex: "coilNumber",
      key: "coilNumber",
      sorter: true,
      sortOrder: sortedInfo.columnKey === "coilNumber" && sortedInfo.order,
      filteredValue: filteredInfo ? filteredInfo["coilNumber"] : null,
      filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => {
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
                placeholder={`Search Batch no.`}
                value={
                  filteredInfo["coilNumber"] ? filteredInfo["coilNumber"] : ""
                }
                onChange={(e) => {
                  setFilteredInfo({
                    ...filteredInfo,
                    coilNumber: e.target.value,
                  });
                }}
                onPressEnter={() =>
                  handleSearch(filteredInfo, confirm, "coilNumber")
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
                  setSelectedKeys([filteredInfo["coilNumber"]]);
                  confirm();
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
      title: "Location",
      dataIndex: "partyName",
      key: "partyId",
      filteredValue: filteredInfo ? filteredInfo["partyId"] : null,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8, minWidth: 120 }}>
          {props.partyList.map((party) => (
            <div
              key={party.nPartyId}
              style={{
                padding: "6px 10px",
                cursor: "pointer",
                borderRadius: 4,
                background:
                  selectedKeys[0] === party.nPartyId
                    ? "rgba(24,144,255,0.1)"
                    : "transparent",
                marginBottom: 4,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  selectedKeys[0] === party.nPartyId
                    ? "rgba(24,144,255,0.15)"
                    : "rgba(0,0,0,0.04)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  selectedKeys[0] === party.nPartyId
                    ? "rgba(24,144,255,0.1)"
                    : "transparent")
              }
              onClick={() => {
                setSelectedKeys([party.nPartyId]);
                confirm();
              }}
            >
              {party.partyName}
            </div>
          ))}
          <div style={{ marginTop: 8, textAlign: "right" }}>
            <Button
              style={{ width: "100%" }}
              size="small"
              onClick={() => clearFilters(clearFilters)}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Material",
      dataIndex: "materialDesc",
      key: "materialDesc",
      // filters: [...],
      render: (text, record) => {
        return record.materialDesc == "undefined" || record.materialDesc == null
          ? "-"
          : record.materialDesc;
      },
      filteredValue: filteredInfo ? filteredInfo["materialDesc"] : null,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8, minWidth: 120 }}>
          {props?.inward?.inwardMaterialDetails?.productMap.map((product) => (
            <div
              key={product.productId}
              style={{
                padding: "6px 10px",
                cursor: "pointer",
                borderRadius: 4,
                background:
                  selectedKeys[0] === product.productId
                    ? "rgba(24,144,255,0.1)"
                    : "transparent",
                marginBottom: 4,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  selectedKeys[0] === product.productId
                    ? "rgba(24,144,255,0.15)"
                    : "rgba(0,0,0,0.04)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  selectedKeys[0] === product.productId
                    ? "rgba(24,144,255,0.1)"
                    : "transparent")
              }
              onClick={() => {
                setSelectedKeys([product.productId]);
                confirm();
              }}
            >
              {product.productName}
            </div>
          ))}
          <div style={{ marginTop: 8, textAlign: "right" }}>
            <Button
              style={{ width: "100%" }}
              size="small"
              onClick={() => {
                clearFilters();
                confirm();
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "inwardStatus",
      key: "inwardStatus",
      filters: [],
      render: (text, record) => {
        return record.inwardStatus ? toPascalCase(record.inwardStatus) : "-";
      },
    },
    {
      title: "Thickness",
      dataIndex: "fthickness",
      key: "fthickness",
      filters: [],
    },
    {
      title: "Weight",
      dataIndex: "grossWeight",
      key: "grossWeight",
      filters: [],
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record) => (
        <span>
          {record.instructionId ? (
            <span className="gx-link"></span>
          ) : (
            menuWorkInProgressLabelList.length > 0 &&
            menuWorkInProgressLabelList.includes(
              workInProgressMenuConstants.finish
            ) && (
              <span
                className="gx-link"
                onClick={() => props.history.push(`plan/${record.coilNumber}`)}
              >
                Finish
              </span>
            )
          )}
        </span>
      ),
    },
  ];

  useEffect(() => {
    props.getProducts();
    const menus = localStorage.getItem("Menus")
      ? JSON.parse(localStorage.getItem("Menus"))
      : [];
    if (menus.length > 0) {
      const menuLabels = menus.filter(
        (menu) => menu.menuKey === sidebarMenuItems.workInProgress
      );
      let menuWorkInProgressLabels = [];
      if (menuLabels.length > 0) {
        menuWorkInProgressLabels = menuLabels[0]?.permission
          ? menuLabels[0]?.permission?.split(",")
          : [];
      }
      setMenuWorkInProgressLabelList(menuWorkInProgressLabels);
    }
    props.getInwardMaterialDetails("WIP");
    if (props.partyList.length === 0) props.fetchPartyList();
  }, []);

  useEffect(() => {
    props.fetchWIPInwardList(
      1,
      15,
      searchValue,
      "",
      sortedInfo.order,
      sortedInfo.columnKey,
      filteredInfo
    );
  }, []);

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    setFilteredInfo(filters);

    props.fetchWIPInwardList(
      pagination.current,
      pagination.pageSize,
      searchValue,
      filters?.partyId ? filters?.partyId[0] : "",
      sorter.order,
      sorter.columnKey,
      filters
    );
  };

  const expandedRowRendered = (record) => {
    const columns = [
      {
        title: "Plan Id",
        dataIndex: "instructionId",
        key: "instructionId",
      },
      {
        title: "Count of sheets",
        dataIndex: "plannedNoOfPieces",
        key: "plannedNoOfPieces",
      },
      {
        title: "Classification",
        dataIndex: "packetClassification",
        key: "packetClassification",
        render: (text, record) => {
          return record.classificationName === null ||
            record.classificationName === undefined ||
            record?.classificationName === ""
            ? "-"
            : record.classificationName === "FG"
            ? "Ready to deliver"
            : record.classificationName;
        },
      },
      {
        title: "Length",
        dataIndex: "plannedLength",
        key: "plannedLength",
      },
      { title: "Width", dataIndex: "plannedWidth", key: "plannedWidth" },
      {
        title: "Plan Weight",
        dataIndex: "plannedWeight",
        key: "plannedWeight",
      },
      { title: "SO no", key: "soNo", dataIndex: "soNo" },
    ];

    return (
      <Table
        columns={columns}
        dataSource={record.instruction}
        pagination={false}
      />
    );
  };

  const clearFilters = () => {
    setFilteredInfo({});
    setSortedInfo({
      order: "descend",
      columnKey: "coilNumber",
    });
    setSearchValue("");
     props.fetchWIPInwardList(
       1,
       15,
       searchValue,
       "",
       sortedInfo.order,
       sortedInfo.columnKey,
       filteredInfo
     );
  }

  return (
    <div>
      <h1>
        <IntlMessages id="sidebar.company.workinprogress" />
      </h1>
      <Card>
        <div
          style={{ width: "50%", "margin-bottom": "10px" }}
          className="gx-flex-row gx-flex-1 wip-search"
        >
          <SearchBox
            styleName="gx-flex-1"
            placeholder="Search for plan id"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              if (e.target.value.length > 3) {
                props.fetchWIPInwardList(
                  1,
                  20,
                  e.target.value,
                  filteredInfo?.partyId ? filteredInfo?.partyId[0] : "",
                  sortedInfo.order,
                  sortedInfo.columnKey,
                  filteredInfo
                );
              } else {
                props.fetchWIPInwardList(
                  1,
                  20,
                  "",
                  filteredInfo?.partyId ? filteredInfo?.partyId[0] : "",
                  sortedInfo.order,
                  sortedInfo.columnKey,
                  filteredInfo
                );
              }
            }}
          />
          &nbsp; &nbsp;
          <Button onClick={clearFilters}>Clear All filters</Button>
        </div>
        <Table
          key={props.inward?.wipList[0]?.inwardEntryId || pageNo}
          className="gx-table-responsive"
          columns={columns}
          rowKey={(record) => record.inwardEntryId}
          dataSource={[...props.inward?.wipList]}
          expandedRowRender={(record) => expandedRowRendered(record)}
          onChange={handleChange}
          pagination={{
            showTotal: (total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} items`,
            pageSize: 15,
            current: pageNo,
            total: totalItems,
          }}
        />
      </Card>
    </div>
  );
}

const mapStateToProps = (state) => ({
  inward: state.inward,
  productInfo: state.productInfo,
  partyList: state.party.partyList,
});

export default connect(mapStateToProps, {
  fetchWIPInwardList,
  getProducts,
  fetchPartyList,
  getInwardMaterialDetails,
})(List);
