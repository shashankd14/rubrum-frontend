import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { Button, Card, Divider, Icon, Table, message, Input } from "antd";
import moment from "moment";
import SearchBox from "../../../components/SearchBox";
import { useHistory } from "react-router-dom";

import IntlMessages from "../../../util/IntlMessages";
import {
  fetchInwardListOldAPI,
  resetInwardForm,
  deleteInwardEntryById,
  resetDeleteInward,
  fetchPartyListById,

} from "../../../appRedux/actions/Inward";
import { getProductGradesList } from "../../../appRedux/actions";
import { sidebarMenuItems } from "../../../constants";

const inwardMenuConstants = {
  view: "View",
  addInward: "Add Inward",
  export: "Export",
};

const filterLabels = {
  ageing: "Age",
  fThickness: "Thickness",
  fWidth: "Width",
  fLength: "Length",
};

const List = (props) => {
  const [sortedInfo, setSortedInfo] = useState({
    order: "ascend",
    columnKey: "fwidth",
  });
  const history = useHistory();

  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [filteredInwardList, setFilteredInwardList] = useState(
    props.inward.inwardList
  );

  const [pageNo, setPageNo] = React.useState(1);
  const [totalPageItems, setTotalItems] = React.useState(0);
  const [menuInwardLabelList, setMenuInwardLabelList] = useState([]);

  const { totalItems } = props.inward;
  let searchInput = useRef(true);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
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
              placeholder={`Min ${filterLabels[dataIndex]}`}
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
            <Input
              ref={(node) => {
                searchInput = node;
              }}
              placeholder={`Max ${filterLabels[dataIndex]}`}
              value={filteredInfo[dataIndex] ? filteredInfo[dataIndex][1] : ""}
              onChange={(e) => {
                const newArray = filteredInfo[dataIndex]
                  ? filteredInfo[dataIndex]
                  : [];
                newArray[1] = e.target.value ? e.target.value : "";
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
                props.fetchInwardListOldAPI(
                  1,
                  20,
                  searchValue,
                  "",
                  sortedInfo.order === "descend" ? "DESC" : "ASC",
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
              onClick={() => {
                clearFilters(clearFilters);
                }}
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
      key: "coilnumber",
      filters: [],
      sorter: true,
      sortOrder: sortedInfo.columnKey === "coilnumber" && sortedInfo.order,
    },
    {
      title: "SC Inward id",
      dataIndex: "customerBatchId",
      key: "customerBatchId",
      filters: [],
      sorter: false,
      render: (text, record) => {
        return record.customerBatchId == "undefined" ||
          record.batch == "undefined"
          ? "-"
          : record.customerBatchId || record.batch;
      },
    },
    {
      title: "Location",
      dataIndex: "party.partyName",
      key: "party.partyName",
    },
    {
      title: "Inward Date",
      dataIndex: "dReceivedDate",
      render(value) {
        return moment(value).format("Do MMM YYYY");
      },
      key: "dReceivedDate",
      filters: [],
    },
    {
      title: "Material",
      dataIndex: "material.mmDescConcatenated",
      key: "material.mmDescConcatenated",
    },
    {
      title: "Material Grade",
      dataIndex: "materialGrade.gradeName",
      key: "gradename",
      sorter: true,
      sortOrder: sortedInfo.columnKey === "gradename" && sortedInfo.order,
    },
    {
      title: "Thickness",
      dataIndex: "fThickness",
      key: "fThickness",
      filters: [],
    },
    {
      title: "Width",
      dataIndex: "fWidth",
      key: "fwidth",
      filters: [],
      sorter: true,
      sortOrder: sortedInfo.columnKey === "fwidth" && sortedInfo.order,
      filteredValue:
        filteredInfo && filteredInfo["fWidth"] ? filteredInfo["fWidth"] : null,
      ...getColumnSearchProps("fWidth"),
    },
    {
      title: "Weight",
      dataIndex: "fQuantity",
      key: "fQuantity",
      filters: [],
    },
    {
      title: "Status",
      dataIndex: "status.statusName",
      key: "status.statusName",
      filters: [],
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record, index) => (
        <span>
          {menuInwardLabelList.length > 0 &&
            menuInwardLabelList.includes(inwardMenuConstants.view) && (
              <>
                <span
                  className="gx-link"
                  onClick={() => props.history.push(`${record.coilNumber}`)}
                >
                  View
                </span>
              </>
            )}
        </span>
      ),
    },
  ];

  const onDelete = (record, key, e) => {
    let id = [];
    id.push(record.inwardEntryId);
    e.preventDefault();
    props.deleteInwardEntryById(id);
  };

  const onEdit = (record, key, e) => {
    props.fetchPartyListById(record.inwardEntryId);
    setTimeout(() => {
      props.history.push(`create/${record.inwardEntryId}`);
    }, 2000);
  };

  useEffect(() => {
    props.fetchInwardListOldAPI(1, 15, "");
  }, []);

  useEffect(() => {
    if (props.inward.deleteSuccess) {
      message.success("Successfully deleted the coil", 2).then(() => {
        props.resetDeleteInward();
      });
    }
  }, [props.inward.deleteSuccess]);

  useEffect(() => {
    if (props.inward.deleteFail) {
      message.success("Unable to delete the coil", 2).then(() => {
        props.resetDeleteInward();
      });
    }
  }, [props.inward.deleteFail]);

  useEffect(() => {
    if (totalItems) {
      setTotalItems(totalItems);
    }
  }, [totalItems]);

  // useEffect(() => {
  //   if (searchValue) {
  //     if (searchValue.length >= 3) {
  //       setPageNo(1);
  //       props.fetchInwardListOldAPI(1, 15, searchValue);
  //     }
  //   } else {
  //     setPageNo(1);
  //     props.fetchInwardListOldAPI(1, 15, searchValue);
  //   }
  // }, [searchValue]);

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    setFilteredInfo(filters);
    setPageNo(pagination.current);

    props.fetchInwardListOldAPI(
      pagination.current,
      pagination.pageSize,
      searchValue,
      "",
      sorter.order === "descend" ? "DESC" : "ASC",
      sorter.columnKey,
      filters
    );
  };

  const clearFilters = (value) => {
    // setCustomerValue("");
    setFilteredInfo({});
    setSearchValue("");
    setPageNo(1);
    props.fetchInwardListOldAPI(1, 15);
  };

  const exportSelectedData = () => {};

  const deleteSelectedCoils = () => {
    console.log("dfd");
  };

  // useEffect(() => {
  //   if (!props.inward.loading && props.inward.success) {
  //     setFilteredInwardList(props.inward.inwardList);
  //   }
  // }, [props.inward.loading, props.inward.success]);

  useEffect(() => {
    const menus = localStorage.getItem("Menus")
      ? JSON.parse(localStorage.getItem("Menus"))
      : [];
    if (menus.length > 0) {
      const menuLabels = menus.filter(
        (menu) => menu.menuKey === sidebarMenuItems.inward
      );
      let menuInwardLabels = [];
      if (menuLabels.length > 0) {
        menuInwardLabels = menuLabels[0]?.permission
          ? menuLabels[0]?.permission?.split(",")
          : [];
      }
      setMenuInwardLabelList(menuInwardLabels);
    }
  }, []);

  return (
    <div>
      <h1>
        <IntlMessages id="sidebar.company.inwardList" />
      </h1>
      <Card>
        <div className="gx-flex-row gx-flex-1">
          <div className="table-operations gx-col">
            {menuInwardLabelList.length > 0 &&
              menuInwardLabelList.includes(inwardMenuConstants.delete) && (
                <Button onClick={deleteSelectedCoils}>Delete</Button>
              )}
            {menuInwardLabelList.length > 0 &&
              menuInwardLabelList.includes(inwardMenuConstants.export) && (
                <Button onClick={exportSelectedData}>Export</Button>
              )}
            <Button onClick={clearFilters}>Clear All filters</Button>
          </div>
          <div className="gx-flex-row gx-w-50">
            {menuInwardLabelList.length > 0 &&
              menuInwardLabelList.includes(inwardMenuConstants.addInward) && (
                <Button
                  type="primary"
                  icon={() => <i className="icon icon-add" />}
                  size="default"
                  onClick={() => {
                    history.push("/company/inward/create");
                    // window.location.reload("/company/inward/create");
                    // window.location.href = window.location.origin+'#/company/inward/create';
                  }}
                >
                  Add Inward
                </Button>
              )}
            <SearchBox
              styleName="gx-flex-1"
              placeholder="Search for batch no. or location..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                if (e.target.value.length > 3) {
                  props.fetchInwardListOldAPI(
                    1,
                    20,
                    e.target.value,
                    "",
                    sortedInfo.order === "descend" ? "DESC" : "ASC",
                    sortedInfo.columnKey,
                    filteredInfo
                  );
                } else {
                  props.fetchInwardList(
                    1,
                    20,
                    e.target.value,
                    "",
                    sortedInfo.order === "descend" ? "DESC" : "ASC",
                    sortedInfo.columnKey,
                    filteredInfo
                  );
                }
              }}
            />
          </div>
        </div>
        <Table
          key={props.inward?.inwardList[0]?.inwardEntryId || pageNo}
          rowSelection={[]}
          className="gx-table-responsive"
          columns={columns}
          rowKey={(record) => record.inwardEntryId}
          dataSource={[...props.inward.inwardList]}
          onChange={handleChange}
          pagination={{
            pageSize: 15,
            current: pageNo,
            total: totalPageItems,
          }}
        />
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => ({
  inward: state.inward,
});

export default connect(mapStateToProps, {
  fetchInwardListOldAPI,
  resetInwardForm,
  deleteInwardEntryById,
  fetchPartyListById,
  resetDeleteInward,
  getProductGradesList,
})(List);
