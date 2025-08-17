import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { Button, Card, Icon, Table, message, Input } from "antd";
import moment from "moment";
import { useHistory } from "react-router-dom";

import IntlMessages from "../../../util/IntlMessages";
import {
  fetchInwardListOldAPI,
  resetInwardForm,
  deleteInwardEntryById,
  resetDeleteInward,
  fetchPartyList,
  getProductGradesList,
  getInwardMaterialDetails,
} from "../../../appRedux/actions";
import { sidebarMenuItems } from "../../../constants";
import { toPascalCase } from "util/Common";

const inwardMenuConstants = {
  view: "View",
  addInward: "Add Inward",
  export: "Export",
};

const filterLabels = {
  fwidth: "Width",
};

const List = (props) => {
  const [sortedInfo, setSortedInfo] = useState({
    order: "ascend",
    columnKey: "fwidth",
  });
  const history = useHistory();

  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchValue, setSearchValue] = useState("");

  const [pageNo, setPageNo] = React.useState(1);
  const [menuInwardLabelList, setMenuInwardLabelList] = useState([]);

  const { totalItems } = props.inward;
  let searchInput = useRef(true);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys,selectedKeys, confirm, clearFilters }) => {
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
              placeholder={`Enter ${filterLabels[dataIndex]}`}
              value={selectedKeys ? selectedKeys[0] : ""}
              onChange={(e) => 
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => {
                confirm();
              }}
              style={{ width: 80, marginBottom: 8, display: "flex", flex: 1 }}
            />
          </div>
          <div>
            <Button
              type="primary"
              onClick={() => {
                confirm();
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
    onFilter: (value, record) => true,
    // render: (text) => ("age" === dataIndex ? <></> : text),
  });

  const columns = [
    {
      title: "Batch no.",
      dataIndex: "coilNumber",
      key: "coilnumber",
      sorter: true,
      sortOrder: sortedInfo.columnKey === "coilnumber" && sortedInfo.order,
      filteredValue:
        filteredInfo && filteredInfo["coilnumber"]
          ? filteredInfo["coilnumber"]
          : null,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
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
                value={selectedKeys ? selectedKeys[0] : ""}
                onChange={(e) =>
                  setSelectedKeys(e.target.value ? [e.target.value] : [])
                }
                onPressEnter={() => {
                  confirm();
                }}
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
                  confirm();
                }}
                icon="search"
                size="small"
                style={{ width: 90, marginRight: 8 }}
              >
                Search
              </Button>
              <Button
                onClick={() => {
                  clearFilters({ closeDropdown: true });
                  confirm();
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
      render: (text, record) => {
        return record.coilNumber == "undefined" ? "-" : record.coilNumber;
      },
      onFilter: (value, record) => true,
    },
    {
      title: "SC Inward id",
      dataIndex: "customerBatchId",
      key: "customerBatchId",
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
      title: "Inward Date",
      dataIndex: "dReceivedDate",
      render(value) {
        return moment(value).format("Do MMM YYYY");
      },
      key: "dReceivedDate",
    },
    {
      title: "Material",
      dataIndex: "material.mmDescConcatenated",
      key: "material.mmDescConcatenated",
    },
    {
      title: "Material Grade",
      dataIndex: "materialGrade.gradeName",
      key: "gradeId",
      sorter: true,
      sortOrder: sortedInfo.columnKey === "gradeId" && sortedInfo.order,
      filteredValue: filteredInfo ? filteredInfo["gradeId"] : null,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8, minWidth: 120 }}>
          {props?.inward?.inwardMaterialDetails?.gradeMap.map((grade) => (
            <div
              key={grade.gradeId}
              style={{
                padding: "6px 10px",
                cursor: "pointer",
                borderRadius: 4,
                background:
                  selectedKeys[0] === grade.gradeId
                    ? "rgba(24,144,255,0.1)"
                    : "transparent",
                marginBottom: 4,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  selectedKeys[0] === grade.gradeId
                    ? "rgba(24,144,255,0.15)"
                    : "rgba(0,0,0,0.04)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  selectedKeys[0] === grade.gradeId
                    ? "rgba(24,144,255,0.1)"
                    : "transparent")
              }
              onClick={() => {
                setSelectedKeys([grade.gradeId]);
                confirm();
              }}
            >
              {grade.gradeName}
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
      title: "Thickness",
      dataIndex: "fThickness",
      key: "fThickness",
    },
    {
      title: "Width",
      dataIndex: "fWidth",
      key: "fwidth",
      sorter: true,
      sortOrder: sortedInfo.columnKey === "fwidth" && sortedInfo.order,
      filteredValue:
        filteredInfo && filteredInfo["fwidth"] ? filteredInfo["fwidth"] : null,
      ...getColumnSearchProps("fwidth"),
    },
    {
      title: "Weight",
      dataIndex: "fQuantity",
      key: "fQuantity",
    },
    {
      title: "Status",
      dataIndex: "status.statusName",
      key: "status.statusName",
      render: (text, record) => {
        return record.status ? toPascalCase(record.status.statusName) : "-";
      },
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    props.fetchInwardListOldAPI(
      1,
      15,
      "",
      "",
      sortedInfo.columnKey,
      sortedInfo.order === "descend" ? "DESC" : "ASC"
    );
    props.getInwardMaterialDetails("");
    if (props.partyList.length === 0) props.fetchPartyList();
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

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    setFilteredInfo(filters);
    setPageNo(pagination.current);

    props.fetchInwardListOldAPI(
      pagination.current,
      pagination.pageSize,
      filters?.coilnumber && filters?.coilnumber[0]
        ? filters?.coilnumber[0]
        : "",
      filters?.partyId ? filters?.partyId[0] : "",
      sorter.order === "descend" ? "DESC" : "ASC",
      sorter.columnKey,
      filters
    );
  };

  const clearFilters = (value) => {
    setFilteredInfo({});
    setSearchValue("");
    setPageNo(1);
    props.fetchInwardListOldAPI(
      1,
      15,
      "",
      "",
      sortedInfo.order === "descend" ? "DESC" : "ASC",
      sortedInfo.columnKey,
      value || {}
    );
  };

  const exportSelectedData = () => {};

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

  const expandedRowRendered = (record) => {
    const columns = [
      {
        title: "Plan Id",
        dataIndex: "instructionId",
        key: "instructionId",
      },
      { title: "Length", dataIndex: "plannedLength", key: "plannedLength" },
      { title: "Width", dataIndex: "plannedWidth", key: "plannedWidth" },
      { title: "Weight", dataIndex: "plannedWeight", key: "plannedWeight" },
      {
        title: "No. of cuts",
        dataIndex: "plannedNoOfPieces",
        key: "plannedNoOfPieces",
      },
    ];
    return <Table columns={columns} dataSource={record} pagination={false} />;
  };

  return (
    <div>
      <h1>
        <IntlMessages id="sidebar.company.inwardList" />
      </h1>
      <Card>
        <div className="gx-flex-row gx-flex-1">
          <div
            className="table-operations gx-col"
            style={{ paddingLeft: "0px" }}
          >
            {menuInwardLabelList.length > 0 &&
              menuInwardLabelList.includes(inwardMenuConstants.export) && (
                <Button onClick={exportSelectedData}>Export</Button>
              )}
            <Button onClick={clearFilters}>Clear All filters</Button>
          </div>
          <div className="gx-flex-row">
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
          </div>
        </div>
        <Table
          key={props.inward?.inwardList[0]?.inwardEntryId || pageNo}
          className="gx-table-responsive"
          columns={columns}
          expandedRowRender={(record) =>
            expandedRowRendered(record.instruction)
          }
          expandIcon={({ expanded, onExpand, record }) =>
            record.instruction.length > 0 ? (
              <div
                className={
                  !expanded
                    ? "ant-table-row-expand-icon ant-table-row-collapsed"
                    : "ant-table-row-expand-icon ant-table-row-expanded"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand(record, e);
                }}
              />
            ) : null
          }
          rowKey={(record) => record.inwardEntryId}
          dataSource={[...props.inward.inwardList]}
          onChange={handleChange}
          pagination={{
            pageSize: 15,
            showTotal: (total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} items`,
            current: pageNo,
            total: totalItems,
          }}
        />
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => ({
  inward: state.inward,
  partyList: state.party.partyList,
});

export default connect(mapStateToProps, {
  fetchInwardListOldAPI,
  resetInwardForm,
  deleteInwardEntryById,
  resetDeleteInward,
  getProductGradesList,
  fetchPartyList,
  getInwardMaterialDetails,
})(List);
