//src-routes-company-Partywise-List.js
import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import {
  Button,
  Card,
  Divider,
  Select,
  Table,
  Modal,
  message,
  Input,
  Icon,
} from "antd";
import SearchBox from "../../../components/SearchBox";
import moment from "moment";

import IntlMessages from "../../../util/IntlMessages";
import {
  fetchInwardList,
  getCoilsByPartyId,
  getS3PDFUrl,
} from "../../../appRedux/actions/Inward";
import {
  fetchPartyList,
  setInwardSelectedForDelivery,
} from "../../../appRedux/actions";
import { sidebarMenuItems } from "../../../constants";
import { use } from "react";

const Option = Select.Option;

const partyWiseMenuConstants = {
  plan: "Plan",
  retrieve: "Retrieve",
  view: "View",
  export: "Export",
  cancelFinish: "Cancel Finish",
  editFinish: "Edit Finish",
  addInward: "Add Inward",
  deliver: "Deliver",
};

const filterLabels = {
  ageing: "Age",
  fThickness: "Thickness",
  fWidth: "Width",
  fLength: "Length",
};

const List = (props) => {
  const [sortedInfo, setSortedInfo] = useState({
    order: "ASC",
    columnKey: "fThickness",
  });
  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [searchValueChanged, setSearchValueChanged] = useState(false);

  const [customerValue, setCustomerValue] = useState("");
  const { inwardList, totalItems } = props.inward;

  let searchInput = useRef(true);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  // const [filteredInwardList, setFilteredInwardList] = useState(inwardList);
  const [expandedRow, setExpandedRecord] = useState([]);
  const [menuPartyWiseLabelList, setMenuPartyWiseLabelList] = useState([]);
  const [partywisepermission, setPartywisePermission] = useState([]);

  const [selectedCBKeys, setSelectedCBKeys] = React.useState([]);
  const [selectedRowData, setSelectedRowData] = React.useState([]);

  const [pageNo, setPageNo] = React.useState(1);
  const [totalPageItems, setTotalItems] = React.useState(0);
  const [showRetrieve, setShowRetrieve] = React.useState(false);
  const [selectedCoil, setSelectedCoil] = React.useState([]);
  const [pageSize, setPageSize] = useState(15);
  const [sortColumn, setSortColumn] = useState('coilnumber');
  const [sortOrder, setSortOrder] = useState('ASC');

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
                props.fetchInwardList(
                  1,
                  20,
                  searchValue,
                  customerValue,
                  sortOrder,
                  sortColumn,
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
      key: "coilnumber",
      filters: [],
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === "coilnumber" ? sortedInfo.order : null,
    },
    {
      title: "SC inward id",
      dataIndex: "customerBatchId",
      key: "customerBatchId",
      sorter: false,
      filteredValue: filteredInfo ? filteredInfo["customerBatchId"] : null,
      onFilter: (value, record) => record.customerBatchId == value,
      filters: [],
      // sorter: true,
      render: (text, record) => {
        return record.customerBatchId == "undefined" ||
          record.batch == "undefined"
          ? "-"
          : record.customerBatchId || record.batch;
      },
    },
    {
      title: "Material",
      dataIndex: "material.mmDescConcatenated",
      key: "material.mmDescConcatenated",
      sorter: false,
    },
    {
      title: "Available Quantity",
      dataIndex: "inStockWeight",
      key: "inStockWeight",
      filters: [],
      sorter: false,
      render: (text, record) => {
        return (
          record.inStockWeight || record.actualWeight || record.plannedWeight
        );
      },
    },
    {
      title: "Ageing (Days)",
      dataIndex: "ageing",
      key: "coilage",
      sorter: true,
      sortOrder: sortedInfo.columnKey === "coilage" ? sortedInfo.order : null,
      render: (text, record) => {
        return record.instructionId
          ? moment().diff(record.instructionDate, "days")
          : record.ageing == "undefined" || record.ageing == ""
          ? "-"
          : record.ageing;
      },
      filteredValue:
        filteredInfo && filteredInfo["ageing"] ? filteredInfo["ageing"] : null,
      // onFilter: (value, record) => record?.ageinging == value,
      ...getColumnSearchProps("ageing"),
    },
    {
      title: "Thickness (mm)",
      dataIndex: "fThickness",
      key: "fthickness",
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === "fthickness" ? sortedInfo.order : null,
      render: (text, record) => {
        return record.instructionId
          ? record.fThickness
          : record.fThickness == "undefined" || record.fThickness == ""
          ? "-"
          : record.fThickness;
      },
      filteredValue:
        filteredInfo && filteredInfo?.["fThickness"]
          ? filteredInfo["fThickness"]
          : null,
      // onFilter: (value, record) => record.fThickness == value,
      ...getColumnSearchProps("fThickness"),
    },
    {
      title: "Width (mm)",
      dataIndex: "fWidth",
      key: "fwidth",
      sorter: true,
      sortOrder: sortedInfo.columnKey === "fwidth" ? sortedInfo.order : null,
      render: (text, record) => {
        return record.instructionId
          ? record?.plannedWidth
          : record.fWidth == "undefined" || record.fWidth == ""
          ? "-"
          : record.fWidth;
      },
      filteredValue:
        filteredInfo && filteredInfo?.["fWidth"]
          ? filteredInfo["fWidth"]
          : null,
      ...getColumnSearchProps("fWidth"),
    },
    {
      title: "Length (mm)",
      dataIndex: "fLength",
      key: "flength",
      sorter: true,
      sortOrder: sortedInfo.columnKey === "flength" ? sortedInfo.order : null,
      filteredValue:
        filteredInfo && filteredInfo?.["fLength"]
          ? filteredInfo["fLength"]
          : null,
      render: (text, record) => {
        return record.fLength || record.plannedLength;
      },
      ...getColumnSearchProps("fLength"),
    },
    {
      title: "Status",
      dataIndex: "status.statusName",
      key: "status.statusName",
      sorter: false,
    },
    {
      title: "Classification",
      dataIndex: "packetClassification.classificationName",
      key: "packetClassification.classificationName",
      sorter: false,
    },
    partywisepermission === "ENDUSER_TAG_WISE_PACKETS"
      ? {}
      : {
          title: "Action",
          dataIndex: "",
          key: "x",
          render: (text, record) => (
            <span>
              {record.instructionId ? (
                <span className="gx-link"></span>
              ) : (
                <span>
                  {menuPartyWiseLabelList.length > 0 &&
                    menuPartyWiseLabelList.includes(
                      partyWiseMenuConstants.plan
                    ) && (
                      <>
                        <span
                          className="gx-link"
                          onClick={() =>
                            props.history.push(`plan/${record.coilNumber}`)
                          }
                        >
                          Plan
                        </span>
                        <Divider type="vertical" />
                      </>
                    )}
                  {menuPartyWiseLabelList.length > 0 &&
                    menuPartyWiseLabelList.includes(
                      partyWiseMenuConstants.retrieve
                    ) && (
                      <>
                        <span
                          className="gx-link"
                          onClick={() => {
                            props.getS3PDFUrl(record.inwardEntryId);
                            setShowRetrieve(true);
                          }}
                        >
                          Retrieve
                        </span>
                        <Divider type="vertical" />
                      </>
                    )}
                  {menuPartyWiseLabelList.length > 0 &&
                    menuPartyWiseLabelList.includes(
                      partyWiseMenuConstants.cancelFinish
                    ) && (
                      <>
                        <span
                          className="gx-link"
                          onClick={() =>
                            props.history.push(`unfinish/${record.coilNumber}`)
                          }
                        >
                          Cancel finish
                        </span>
                        <Divider type="vertical" />
                      </>
                    )}
                  {menuPartyWiseLabelList.length > 0 &&
                    menuPartyWiseLabelList.includes(
                      partyWiseMenuConstants.editFinish
                    ) && (
                      <span
                        className="gx-link"
                        onClick={() =>
                          props.history.push(`editFinish/${record.coilNumber}`)
                        }
                      >
                        Edit finish
                      </span>
                    )}
                </span>
              )}
            </span>
          ),
        },
  ];
  //filter data which is dispatched
  // const filteredInwardListWithoutDispatched = filteredInwardList.filter(item => !(item.status && item.status.statusId === 4 && item.status.statusName === "DISPATCHED"));

  useEffect(() => {
    props.fetchPartyList();
    props.fetchInwardList(
      1,
      20,
      searchValue,
      customerValue,
      sortOrder,
      sortColumn,
      filteredInfo
    );
    const menus = localStorage.getItem("Menus")
      ? JSON.parse(localStorage.getItem("Menus"))
      : [];
    if (menus.length > 0) {
      const menuLabels = menus.filter(
        (menu) => menu.menuKey === sidebarMenuItems.partywiseRegister
      );
      let menuPartyWiseLabels = [];
      if (menuLabels.length > 0) {
        menuPartyWiseLabels = menuLabels[0]?.permission
          ? menuLabels[0]?.permission?.split(",")
          : [];
        if (menuLabels.length === 1)
          setPartywisePermission(menuLabels[0].permission);
      }
      setMenuPartyWiseLabelList(menuPartyWiseLabels);
    }
  }, []);

  useEffect(() => {
    if (totalItems) {
      setTotalItems(totalItems);
    }
  }, [totalItems]);

  // useEffect(() => {
  //   console.log(inwardList);
  //   if (!props.inward.loading && props.inward.success) {
  //     // setFilteredInwardList(getFilterData(inwardList));
  //     // console.log(inwardList)
  //     if (inwardList.length !== 0) {
  //       inwardList[0].children = inwardList[0].instruction;
  //     }
  //     setFilteredInwardList(inwardList);
  //   }
  // }, [inwardList]);

  // useEffect(() => {
  //   if (searchValue && searchValueChanged) {
  //     if (searchValue.length >= 3) {
  //       setPageNo(1);
  //       props.fetchInwardList(
  //         1,
  //         20,
  //         searchValue,
  //         customerValue,
  //         sortOrder,
  //         sortColumn,
  //         filteredInfo
  //       );
  //     }
  //   } else {
  //     setPageNo(1);
  //     props.fetchInwardList(
  //       1,
  //       20,
  //       searchValue,
  //       customerValue,
  //       sortOrder,
  //       sortColumn,
  //       filteredInfo
  //     );
  //   }
  // }, [searchValue]);

  const handleChange = (pagination, filters, sorter, partyId) => {
    setSortedInfo(sorter);
    setFilteredInfo(filters);
    setSortColumn(sorter.columnKey);
    setSortOrder(sorter.order);
    setPageNo(pagination.current);

    props.fetchInwardList(
      pagination.current,
      pagination.pageSize,
      searchValue,
      customerValue,
      sorter.order === "descend" ? "DESC" : "ASC",
      sorter.columnKey,
      filters
    );
  };

  // useEffect(() => {
  //   if (sortColumn && sortOrder) {
  //       // setPageNo(1);
  //       props.fetchInwardList(pageNo, 20, searchValue, customerValue,  sortOrder, sortColumn, filteredInfo);
  //   }
  // }, [sortColumn, sortOrder]);

  const clearFilters = (value) => {
    setCustomerValue("");
    setFilteredInfo({});
    setSearchValue("");
    setPageNo(1);
    props.fetchInwardList(1, 15);
  };

  const exportSelectedData = () => {};

  const handleCustomerChange = (value) => {
    if (value) {
      setCustomerValue(value);
      setPageNo(1);
      props.fetchInwardList(
        1,
        pageSize,
        searchValue,
        value,
        sortOrder,
        sortColumn,
        filteredInfo
      );
    } else {
      setCustomerValue("");
      props.fetchInwardList(
        1,
        pageSize,
        searchValue,
        "",
        sortOrder,
        sortColumn,
        filteredInfo
      );
      // setFilteredInwardList(filteredInwardList);
    }
  };

  const handleBlur = () => {};

  function handleFocus() {}

  const storeKey = (data, selected) => {
    if (selectedCBKeys.includes(data.key) && !selected) {
      const newSet = selectedCBKeys;
      const index = selectedCBKeys.indexOf(data.key);
      newSet.splice(index, 1);
      setSelectedCBKeys(newSet);
      setSelectedRowData((oldData) =>
        oldData.filter((row) => row.key !== data.key)
      );
      return;
    } else if (selected && !selectedCBKeys.includes(data.key)) {
      setSelectedCBKeys((oldArr) => [...oldArr, data.key]);
      setSelectedRowData((oldData) => [...oldData, data]);
    }
  };

  const getKey = (data, selected) => {
    if (
      data.status.statusName === "READY TO DELIVER" ||
      data.status.statusName === "RECEIVED"
    ) {
      storeKey(data, selected);
      if (data.children) {
        data.children.map((item) => getKey(item, selected));
      }
    }
  };

  const rowSelection = {
    onSelect: (record, selected, selectedRows) => {
      if (
        record.status.statusName === "READY TO DELIVER" ||
        record.status.statusName === "RECEIVED"
      ) {
        if (record.key.includes("-") && !selected) {
          const eKeys = record.key.split("-");
          let removeKeys = [record.key];
          eKeys.forEach((key) => {
            selectedRows.forEach((row) => {
              if (`${row.coilNumber}` === key) {
                removeKeys.push(row.key);
              }
            });
          });
          removeKeys.forEach((key) => {
            storeKey({ key }, selected);
          });
        } else getKey(record, selected);
      }
      const selectedCoil =
        selectedRows.map((row) => row?.party?.nPartyId) || [];
      setSelectedCoil(Array.from(new Set(selectedCoil)));
    },
    getCheckboxProps: (record) => ({
      disabled:
        record.status.statusName !== "READY TO DELIVER" &&
        record.status.statusName !== "RECEIVED",
    }),
    onSelectAll: (selected, selectedRows, changeRows) => {
      if (changeRows.length === selectedCBKeys.length) {
        setSelectedCBKeys([]);
        setSelectedRowData([]);
      } else {
        changeRows.map((item) => {
          if (
            item.status.statusName === "READY TO DELIVER" ||
            item.status.statusName === "RECEIVED"
          ) {
            getKey(item);
          }
        });
      }
      const selectedCoil =
        selectedRows.map((row) => row?.party?.nPartyId) || [];
      setSelectedCoil(Array.from(new Set(selectedCoil)));
    },
    selectedRowKeys: selectedCBKeys,
  };

  const gets3PDFurl = () => {
    return (
      <>
        <div>
          <a href={props?.inward.s3pdfurl?.inward_pdf} target="_blank">
            Inward PDF
          </a>{" "}
          &nbsp;&nbsp;&nbsp;
          {/* <a href={props?.inward.s3pdfurl?.qrcode_inward_pdf} target="_blank">
            Inward QR Code
          </a> */}
        </div>
        {props.inward.s3pdfurl?.plan_pdfs?.length > 0 && (
          <div>
            <p>Plan PDF</p>
            {props.inward.s3pdfurl?.plan_pdfs?.map((item) => (
              <>
                <a href={item?.pdfS3Url} target="_blank">
                  {item.id}
                </a>
                <br />
              </>
            ))}
          </div>
        )}
        {props.inward.s3pdfurl?.dc_pdfs?.length > 0 && (
          <div>
            <p>DC PDF</p>
            {props.inward.s3pdfurl?.dc_pdfs?.map((item) => (
              <a href={item?.pdfS3Url} target="_blank">
                {item.id}
              </a>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div>
      <h1>
        <IntlMessages id="sidebar.company.partywiseRegister" />
      </h1>
      <Card>
        <div className="gx-flex-row gx-flex-1">
          <div className="table-operations gx-col">
            <Select
              id="select"
              showSearch
              style={{ width: 200 }}
              placeholder="Select a location"
              optionFilterProp="children"
              onChange={handleCustomerChange}
              value={customerValue}
              onFocus={handleFocus}
              onBlur={handleBlur}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {props.party.partyList.length > 0 &&
                props.party.partyList.map((party) => (
                  <Option key={party.nPartyId} value={party.nPartyId}>
                    {party.partyName}
                  </Option>
                ))}
            </Select>
            &emsp;
            {menuPartyWiseLabelList.length > 0 &&
              menuPartyWiseLabelList.includes(
                partyWiseMenuConstants.export
              ) && (
                <Button
                  onClick={exportSelectedData}
                  style={{ marginBottom: "1px" }}
                >
                  Export
                </Button>
              )}
            <Button onClick={clearFilters} style={{ marginBottom: "1px" }}>
              Clear All filters
            </Button>
          </div>
          <div className="gx-flex-row gx-w-50">
            {menuPartyWiseLabelList.length > 0 &&
              menuPartyWiseLabelList.includes(
                partyWiseMenuConstants.deliver
              ) && (
                <Button
                  type="primary"
                  icon={() => <i className="icon icon-add" />}
                  size="default"
                  onClick={() => {
                    if (selectedCoil?.length > 1) {
                      message.error("Please select inwards of same location");
                    } else {
                      const newList = selectedRowData.filter((item) => {
                        if (item?.instruction?.length) {
                          return (
                            !item.childInstructions &&
                            item.inwardEntryId &&
                            selectedRowData.length === 1
                          );
                        } else {
                          return true;
                        }
                      });
                      props.setInwardSelectedForDelivery(newList);
                      props.history.push(
                        "/company/locationwise-register/delivery"
                      );
                    }
                  }}
                  disabled={!!selectedCBKeys?.length < 1}
                >
                  Deliver
                </Button>
              )}
            {menuPartyWiseLabelList.length > 0 &&
              menuPartyWiseLabelList.includes(
                partyWiseMenuConstants.addInward
              ) && (
                <Button
                  type="primary"
                  icon={() => <i className="icon icon-add" />}
                  size="default"
                  onClick={() => {
                    props.history.push("/company/inward/create");
                  }}
                >
                  Add Inward
                </Button>
              )}
            <SearchBox
              styleName="gx-flex-1"
              placeholder="Search for inward id or location..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                if (e.target.value.length > 3) {
                  props.fetchInwardList(
                    1,
                    20,
                    e.target.value,
                    customerValue,
                    sortOrder,
                    sortColumn,
                    filteredInfo
                  );
                } else {
                  props.fetchInwardList(
                    1,
                    20,
                    e.target.value,
                    customerValue,
                    sortOrder,
                    sortColumn,
                    filteredInfo
                  );
                }
              }}
            />
          </div>
        </div>
        {showRetrieve && (
          <Modal
            title="Retrieve Plan PDF"
            visible={showRetrieve}
            width={600}
            onOk={() => setShowRetrieve(false)}
            onCancel={() => setShowRetrieve(false)}
          >
            <p>Please click on the Instructions to generate the PDF</p>
            {gets3PDFurl()}
          </Modal>
        )}
        <Table
          rowClassName={(record, index) =>
            record.instructionId ? "table-row-dark" : "table-row-light"
          }
          key={props.inward?.inwardList[0]?.inwardEntryId || pageNo}
          scroll={{ y: 540 }}
          className="gx-table-responsive"
          columns={columns}
          rowKey={(record) => record.inwardEntryId}
          loading={props.inward.loading}
          dataSource={[...props.inward.inwardList]}
          onChange={handleChange}
          rowSelection={
            partywisepermission === "ENDUSER_TAG_WISE_PACKETS"
              ? false
              : rowSelection
          }
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
  party: state.party,
});

export default connect(mapStateToProps, {
  fetchPartyList,
  fetchInwardList,
  getCoilsByPartyId,
  setInwardSelectedForDelivery,
  getS3PDFUrl,
})(List);
