import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { Card, Table, Input, Button, Icon } from "antd";
import moment from "moment";
import SearchBox from "../../../components/SearchBox";
import IntlMessages from "../../../util/IntlMessages";
import { fetchWIPInwardList } from "../../../appRedux/actions/Inward";
import { sidebarMenuItems } from "../../../constants";
import { render } from "less";

const workInProgressMenuConstants = {
  finish: "Finish",
};
const filterLabels = {
  materialDesc: "Material desc",
};

function List(props) {
  const [sortedInfo, setSortedInfo] = useState({
    order: "descend",
    columnKey: "coilnumber",
  });
  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchValue, setSearchValue] = useState("");
  // const [filteredInwardList, setFilteredInwardList] = useState(props.inward?.wipList);

  const [pageNo, setPageNo] = React.useState(1);
  const [totalPageItems, setTotalItems] = React.useState(0);

  const [menuWorkInProgressLabelList, setMenuWorkInProgressLabelList] =
    useState([]);
  let searchInput = useRef(true);

  const { totalItems } = props.inward;

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const getFilterData = (list) => {
    let filter = list.map((item) => {
      if (item.instruction?.length > 0) {
        item.children = item.instruction.filter(
          (filteredInfo) => filteredInfo.status.statusName === "IN PROGRESS"
        );
      }
      return item;
    });
    return filter;
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ confirm, clearFilters }) => {
      let filterVariable = "";
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
              placeholder={`Search ${filterLabels[dataIndex]}`}
              value={filteredInfo[dataIndex] ? filteredInfo[dataIndex][0] : ""}
              onChange={(e) => {
                const newArray = filteredInfo[dataIndex]
                  ? filteredInfo[dataIndex]
                  : [];
                newArray[0] = e.target.value ? e.target.value : "";
                setFilteredInfo({
                  ...filteredInfo,
                  [dataIndex]: [...newArray],
                });
              }}
              onPressEnter={() =>
                handleSearch(filteredInfo, confirm, dataIndex)
              }
              style={{ width: 80, marginBottom: 8, display: "flex", flex: 1 }}
            />
          </div>
          <div>
            <Button
              type="primary"
              onClick={() => {
                console.log(filteredInfo);
                props.fetchWIPInwardList(
                  1,
                  20,
                  searchValue,
                  "",
                  sortedInfo.order,
                  sortedInfo.columnKey,
                  filteredInfo
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
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select());
      }
    },
    // render: (text) => ("age" === dataIndex ? <></> : text),
  });

  const columns = [
    {
      title: "Batch no.",
      dataIndex: "coilNumber",
      key: "coilNumber",
      filters: [],
    },
    {
      title: "Location",
      dataIndex: "partyName",
      key: "partyName",
    },
    {
      title: "Material",
      dataIndex: "materialDesc",
      key: "materialDesc",
      render: (text, record) => {
        return record.materialDesc == "undefined" || record.materialDesc == null
          ? "-"
          : record.materialDesc;
      },
      filteredValue:
        filteredInfo && filteredInfo["materialDesc"]
          ? filteredInfo["materialDesc"]
          : null,
      ...getColumnSearchProps("materialDesc"),
    },
    {
      title: "Status",
      dataIndex: "inwardStatus",
      key: "inwardStatus",
      filters: [],
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

  // useEffect(() => {
  //     if (props.inward.wipSuccess) {
  //         setFilteredInwardList(props.inward?.wipList);
  //     }
  // }, [props.inward.wipSuccess])

  useEffect(() => {
    if (totalItems) {
      setTotalItems(totalItems);
    }
  }, [totalItems]);

  // useEffect(() => {
  //   if (searchValue) {
  //     if (searchValue?.length >= 3) {
  //       setPageNo(1);
  //       props.fetchWIPInwardList(1, 15, searchValue);
  //     }
  //   } else {
  //     setPageNo(1);
  //     props.fetchWIPInwardList(1, 15, searchValue);
  //   }
  // }, [searchValue]);

  const handleChange = (pagination, filters, sorter) => {
    console.log(filters);
    setSortedInfo(sorter);
    setFilteredInfo(filters);

    props.fetchWIPInwardList(
      pagination.current,
      pagination.pageSize,
      searchValue,
      "",
      sorter.order,
      sorter.columnKey,
      filters
    );
  };
  const handleRow = (record) => {
    console.log(record);
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
          return record.packetClassification === null ||
            record.packetClassification === undefined ||
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
            placeholder="Search for Batch no. or location..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              if (e.target.value.length > 3) {
                props.fetchWIPInwardList(
                  1,
                  20,
                  e.target.value,
                  '',
                  sortedInfo.order,
                  sortedInfo.columnKey,
                  filteredInfo
                );
              } else {
                props.fetchWIPInwardList(
                  1,
                  20,
                  e.target.value,
                  "",
                  sortedInfo.order,
                  sortedInfo.columnKey,
                  filteredInfo
                );
              }
            }}
          />
        </div>
        <Table
          key={props.inward?.wipList[0]?.inwardEntryId || pageNo}
          rowSelection={[]}
          className="gx-table-responsive"
          columns={columns}
          dataSource={[...props.inward?.wipList]}
          expandedRowRender={(record) => expandedRowRendered(record)}
          onChange={handleChange}
          // onRow={(record, index) => {
          //   return {
          //     onClick: (record) => {
          //       handleRow(record);
          //     },
          //   };
          // }}
          pagination={{
            pageSize: 15,
            current: pageNo,
            total: totalPageItems,
          }}
        />
      </Card>
    </div>
  );
}

const mapStateToProps = (state) => ({
  inward: state.inward,
});

export default connect(mapStateToProps, {
  fetchWIPInwardList,
})(List);
