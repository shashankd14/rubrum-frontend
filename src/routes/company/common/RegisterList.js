import React, { useEffect, useMemo, useRef, useState } from "react";
import { connect } from "react-redux";
import {
  Button,
  Card,
  Divider,
  Pagination,
  Select,
  Table,
  Modal,
  message,
  Input,
  Icon,
} from "antd";
import moment from "moment";

import IntlMessages from "../../../util/IntlMessages";
import {
  fetchInwardList,
  getCoilsByPartyId,
  getS3PDFUrl,
} from "../../../appRedux/actions/Inward";
import { setInwardSelectedForDelivery } from "../../../appRedux/actions";
import { sidebarMenuItems } from "../../../constants";
import { toPascalCase } from "util/Common";
import { debounce } from "lodash";

import "./RegisterList.css";

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
  coilage: "Age",
  fthickness: "Thickness",
  fwidth: "Width",
  fLength: "Length",
};

const defaultScreenConfig = {
  menuKey: sidebarMenuItems.partywiseRegister,
  deliveryPath: "/company/locationwise-register/delivery",
};

const safeNumber = (value) => {
  const parsedValue =
    typeof value === "number"
      ? value
      : parseFloat(String(value || "").replace(/,/g, ""));

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const formatWeight = (value, options = {}) => {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 3,
    suffix = " MT",
  } = options;
  const parsedValue =
    typeof value === "number"
      ? value
      : parseFloat(String(value || "").replace(/,/g, ""));

  if (!Number.isFinite(parsedValue)) return value || "-";

  return `${parsedValue.toLocaleString(undefined, {
    minimumFractionDigits,
    maximumFractionDigits,
  })}${suffix}`;
};

const normalizeStatus = (value) => String(value || "").trim().toUpperCase();

const getWeightFromRecord = (record) =>
  safeNumber(record.inStockWeight || record.actualWeight || record.plannedWeight);

const getAgeingValue = (record) => {
  if (record.instructionId) {
    return moment().diff(record.instructionDate, "days");
  }

  return record.ageing === "undefined" || record.ageing === "" || record.ageing == null
    ? "-"
    : record.ageing;
};

const getStatusTone = (value) => {
  const normalizedValue = normalizeStatus(value);

  if (normalizedValue.includes("READY")) return "ready";
  if (normalizedValue.includes("DISPATCH")) return "dispatch";
  if (normalizedValue.includes("WORK") || normalizedValue.includes("PROGRESS")) {
    return "progress";
  }
  if (normalizedValue.includes("RECEIVED")) return "received";
  return "neutral";
};

const getSummaryBucket = (value) => {
  const normalizedValue = normalizeStatus(value);

  if (normalizedValue.includes("READY")) return "ready";
  if (normalizedValue.includes("DISPATCH")) return "dispatch";
  if (normalizedValue.includes("WORK") || normalizedValue.includes("PROGRESS")) {
    return "wip";
  }
  if (normalizedValue.includes("RECEIVED") || normalizedValue.includes("IMPORT")) {
    return "received";
  }
  return "other";
};

const renderBadge = (label, tone) => {
  if (!label || label === "-") return "-";

  return (
    <span className={`wez-register__badge wez-register__badge--${tone}`}>
      {label}
    </span>
  );
};

const summaryTrendMap = {
  order: { value: "12%", direction: "up", tone: "positive" },
  received: { value: "4%", direction: "up", tone: "positive" },
  wip: { value: "2%", direction: "down", tone: "negative" },
  ready: { value: "1%", direction: "up", tone: "positive" },
  dispatch: { value: "1%", direction: "up", tone: "positive" },
};

const RegisterList = ({ screenConfig = {}, ...props }) => {
  const title =
    screenConfig.title || (
      <IntlMessages id="sidebar.company.partywiseRegister" />
    );
  const menuKey = screenConfig.menuKey || defaultScreenConfig.menuKey;
  const deliveryPath =
    screenConfig.deliveryPath || defaultScreenConfig.deliveryPath;
  const isAllocatedView = screenConfig.variant === "allocatedCoils";
  const weightUnit = isAllocatedView ? "KG" : "MT";

  const [sortedInfo, setSortedInfo] = useState({
    order: "ascend",
    columnKey: "fThickness",
  });
  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchValue, setSearchValue] = useState("");

  const [customerValue, setCustomerValue] = useState("");
  const { totalItems } = props.inward;

  let searchInput = useRef(true);

  const [menuPartyWiseLabelList, setMenuPartyWiseLabelList] = useState([]);
  const [partywisepermission, setPartywisePermission] = useState([]);

  const [selectedCBKeys, setSelectedCBKeys] = React.useState([]);
  const [selectedRowData, setSelectedRowData] = React.useState([]);

  const [pageNo, setPageNo] = React.useState(1);
  const [showRetrieve, setShowRetrieve] = React.useState(false);
  const [selectedCoil, setSelectedCoil] = React.useState([]);
  const defaultPageSize = isAllocatedView ? 10 : 15;
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortColumn, setSortColumn] = useState("inwardEntryId");
  const [sortOrder, setSortOrder] = useState("DESC");

  const topLevelRows = useMemo(
    () => (props.inward.inwardList || []).filter((row) => !row.instructionId),
    [props.inward.inwardList]
  );

  const totalVisibleWeight = useMemo(
    () => topLevelRows.reduce((sum, row) => sum + getWeightFromRecord(row), 0),
    [topLevelRows]
  );

  const summaryCards = useMemo(() => {
    const bucketTotals = topLevelRows.reduce(
      (accumulator, row) => {
        const bucket = getSummaryBucket(row?.status?.statusName);
        const rowWeight = getWeightFromRecord(row);
        accumulator[bucket].weight += rowWeight;
        accumulator[bucket].count += 1;
        return accumulator;
      },
      {
        received: { weight: 0, count: 0 },
        wip: { weight: 0, count: 0 },
        ready: { weight: 0, count: 0 },
        dispatch: { weight: 0, count: 0 },
        other: { weight: 0, count: 0 },
      }
    );

    const formatShare = (value) =>
      totalVisibleWeight > 0
        ? `${Math.round((value / totalVisibleWeight) * 100)}% share`
        : "0% share";

    return [
      {
        key: "order",
        label: "Order",
        icon: "profile",
        tone: "slate",
        value: totalVisibleWeight,
        helper: formatShare(totalVisibleWeight),
        trend: summaryTrendMap.order,
      },
      {
        key: "received",
        label: "Received",
        icon: "download",
        tone: "received",
        value: bucketTotals.received.weight,
        helper: formatShare(bucketTotals.received.weight),
        trend: summaryTrendMap.received,
      },
      {
        key: "wip",
        label: "Work-in-progress",
        icon: "clock-circle",
        tone: "progress",
        value: bucketTotals.wip.weight,
        helper: formatShare(bucketTotals.wip.weight),
        trend: summaryTrendMap.wip,
      },
      {
        key: "ready",
        label: "Ready-to-deliver",
        icon: "check-circle",
        tone: "ready",
        value: bucketTotals.ready.weight,
        helper: formatShare(bucketTotals.ready.weight),
        trend: summaryTrendMap.ready,
      },
      {
        key: "dispatch",
        label: "Despatch",
        icon: "export",
        tone: "dispatch",
        value: bucketTotals.dispatch.weight,
        helper: formatShare(bucketTotals.dispatch.weight),
        trend: summaryTrendMap.dispatch,
      },
    ];
  }, [topLevelRows, totalVisibleWeight]);

  const getColumnSearchProps = (dataIndex) => ({
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
              placeholder={`Search ${filterLabels[dataIndex]}`}
              value={selectedKeys ? selectedKeys[0] : ""}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
              }}
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
                setSelectedKeys([filteredInfo[dataIndex]]);
                confirm();
              }}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters()}
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
    onFilter: () => true,
  });

  const renderOrderCell = (record) => {
    const orderId =
      record.coilNumber === "undefined" ? "-" : record.coilNumber;
    const inwardId =
      record.customerBatchId === "undefined" ||
      record.batch === "undefined" ||
      (!record.customerBatchId && !record.batch)
        ? null
        : record.customerBatchId || record.batch;

    if (!isAllocatedView) return orderId;

    return (
      <div className="wez-register__order-cell">
        <span className="wez-register__order-title">{orderId}</span>
        <span className="wez-register__order-meta">{inwardId || "--"}</span>
      </div>
    );
  };

  const renderMaterialCell = (record) => {
    const materialName = record?.material?.mmDescConcatenated || "-";

    if (!isAllocatedView) return materialName;

    const dimensions = [
      record?.fThickness,
      record?.instructionId ? record?.plannedWidth : record?.fWidth,
      record?.fLength || record?.plannedLength,
    ]
      .filter((value) => value !== undefined && value !== null && value !== "")
      .join(" x ");

    return (
      <div className="wez-register__material-cell">
        <span className="wez-register__material-title">{materialName}</span>
        <span className="wez-register__material-meta">
          {dimensions || "Dimensions unavailable"}
        </span>
      </div>
    );
  };

  const renderQuantityCell = (record) => {
    const quantity =
      record.inStockWeight || record.actualWeight || record.plannedWeight;

    if (!isAllocatedView) return quantity;

    return formatWeight(quantity, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
      suffix: ` ${weightUnit}`,
    });
  };

  const renderAgeingCell = (record) => {
    const ageingValue = getAgeingValue(record);

    if (!isAllocatedView || ageingValue === "-") return ageingValue;

    return <span className="wez-register__muted-cell">{ageingValue} Days</span>;
  };

  const renderStatusCell = (record) => {
    const statusLabel = record.status ? toPascalCase(record.status.statusName) : "-";

    if (!isAllocatedView) return statusLabel;

    return renderBadge(statusLabel, getStatusTone(record?.status?.statusName));
  };

  const renderClassificationCell = (record) => {
    const classificationLabel = record.packetClassification
      ? record.packetClassification.classificationName === "FG"
        ? "Ready to deliver"
        : toPascalCase(record.packetClassification.classificationName)
      : "-";

    if (!isAllocatedView) return classificationLabel;
    if (classificationLabel === "-") return "-";

    return renderBadge(classificationLabel, getStatusTone(classificationLabel));
  };

  const renderActionCell = (record) => (
    <span>
      {record.instructionId ? (
        <span className="gx-link"></span>
      ) : (
        <div
          className="wez-register__action-inline"
        >
          {menuPartyWiseLabelList.length > 0 &&
            menuPartyWiseLabelList.includes(partyWiseMenuConstants.plan) && (
              <>
                <span
                  className={`gx-link ${
                    isAllocatedView ? "wez-register__action-link" : ""
                  }`}
                  onClick={() => props.history.push(`plan/${record.coilNumber}`)}
                >
                  Plan
                </span>
                <Divider type="vertical" />
              </>
            )}
          {menuPartyWiseLabelList.length > 0 &&
            menuPartyWiseLabelList.includes(partyWiseMenuConstants.retrieve) &&
            record.status.statusName !== "RECEIVED" && (
              <>
                <span
                  className={`gx-link ${
                    isAllocatedView ? "wez-register__action-link" : ""
                  }`}
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
                  className={`gx-link ${
                    isAllocatedView
                      ? "wez-register__action-link wez-register__action-link--danger"
                      : ""
                  }`}
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
                className={`gx-link ${
                  isAllocatedView ? "wez-register__action-link" : ""
                }`}
                onClick={() =>
                  props.history.push(`editFinish/${record.coilNumber}`)
                }
              >
                Edit finish
              </span>
            )}
        </div>
      )}
    </span>
  );

  const columns = [
    {
      title: isAllocatedView ? "Order ID" : "Batch no.",
      dataIndex: "coilNumber",
      key: "coilnumber",
      width: isAllocatedView ? 110 : undefined,
      filters: [],
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === "coilnumber" ? sortedInfo.order : null,
      filteredValue: filteredInfo ? filteredInfo["coilnumber"] : null,
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
                placeholder={`Search ${
                  isAllocatedView ? "Order ID" : "Batch no."
                }`}
                value={
                  filteredInfo["coilnumber"] ? filteredInfo["coilnumber"] : ""
                }
                onChange={(e) => {
                  setFilteredInfo({
                    ...filteredInfo,
                    coilnumber: e.target.value,
                  });
                }}
                onPressEnter={() => {
                  setSelectedKeys([filteredInfo["coilnumber"]]);
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
                  setSelectedKeys([filteredInfo["coilnumber"]]);
                  confirm();
                }}
                icon="search"
                size="small"
                style={{ width: 90, marginRight: 8 }}
              >
                Search
              </Button>
              <Button
                onClick={() => clearFilters()}
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
      render: (text, record) => renderOrderCell(record),
    },
    {
      title: isAllocatedView ? "SC inward ID" : "SC inward id",
      dataIndex: "customerBatchId",
      key: "customerBatchId",
      hidden: isAllocatedView,
      sorter: false,
      filteredValue: filteredInfo ? filteredInfo["customerBatchId"] : null,
      onFilter: (value, record) => record.customerBatchId === value,
      filters: [],
      render: (text, record) => {
        return record.customerBatchId === "undefined" ||
          record.batch === "undefined"
          ? "-"
          : record.customerBatchId || record.batch;
      },
    },
    {
      title: isAllocatedView ? "Material info" : "Material",
      dataIndex: "material.mmDescConcatenated",
      key: "material.mmDescConcatenated",
      width: isAllocatedView ? 260 : undefined,
      sorter: false,
      render: (text, record) => renderMaterialCell(record),
    },
    {
      title: isAllocatedView ? "Total Qty." : "Available Quantity",
      dataIndex: "inStockWeight",
      key: "inStockWeight",
      width: isAllocatedView ? 110 : undefined,
      filters: [],
      sorter: false,
      render: (text, record) => renderQuantityCell(record),
    },
    {
      title: isAllocatedView ? "Ageing" : "Ageing (Days)",
      dataIndex: "ageing",
      key: "coilage",
      width: isAllocatedView ? 90 : undefined,
      sorter: true,
      sortOrder: sortedInfo.columnKey === "coilage" ? sortedInfo.order : null,
      render: (text, record) => renderAgeingCell(record),
      filteredValue:
        filteredInfo && filteredInfo["coilage"]
          ? filteredInfo["coilage"]
          : null,
      ...getColumnSearchProps("coilage"),
    },
    {
      title: "Thickness (mm)",
      dataIndex: "fThickness",
      key: "fthickness",
      hidden: isAllocatedView,
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === "fthickness" ? sortedInfo.order : null,
      render: (text, record) => {
        return record.instructionId
          ? record.fThickness
          : record.fThickness === "undefined" || record.fThickness === ""
          ? "-"
          : record.fThickness;
      },
      filteredValue:
        filteredInfo && filteredInfo?.["fthickness"]
          ? filteredInfo["fthickness"]
          : null,
      ...getColumnSearchProps("fthickness"),
    },
    {
      title: "Width (mm)",
      dataIndex: "fWidth",
      key: "fwidth",
      hidden: isAllocatedView,
      sorter: true,
      sortOrder: sortedInfo.columnKey === "fwidth" ? sortedInfo.order : null,
      render: (text, record) => {
        return record.instructionId
          ? record?.plannedWidth
          : record.fWidth === "undefined" || record.fWidth === ""
          ? "-"
          : record.fWidth;
      },
      filteredValue:
        filteredInfo && filteredInfo?.["fwidth"]
          ? filteredInfo["fwidth"]
          : null,
      ...getColumnSearchProps("fwidth"),
    },
    {
      title: "Length (mm)",
      dataIndex: "fLength",
      key: "flength",
      hidden: isAllocatedView,
      sorter: true,
      sortOrder: sortedInfo.columnKey === "flength" ? sortedInfo.order : null,
      filteredValue:
        filteredInfo && filteredInfo?.["flength"]
          ? filteredInfo["flength"]
          : null,
      render: (text, record) => {
        return record.fLength || record.plannedLength;
      },
      ...getColumnSearchProps("flength"),
    },
    {
      title: "Status",
      dataIndex: "status.statusName",
      key: "status.statusName",
      width: isAllocatedView ? 110 : undefined,
      sorter: false,
      render: (text, record) => renderStatusCell(record),
    },
    {
      title: "Classification",
      dataIndex: "packetClassification.classificationName",
      key: "packetClassification.classificationName",
      width: isAllocatedView ? 110 : undefined,
      sorter: false,
      render: (text, record) => renderClassificationCell(record),
    },
    partywisepermission === "ENDUSER_TAG_WISE_PACKETS"
      ? {}
      : {
          title: isAllocatedView ? "Actions" : "Action",
          dataIndex: "",
          key: "x",
          width: isAllocatedView ? 190 : undefined,
          render: (text, record) => renderActionCell(record),
        },
  ];

  const visibleColumns = columns.filter((column) => !column.hidden);

  const fetchRegisterList = ({
    nextPage = pageNo,
    nextPageSize = pageSize,
    nextSearchValue = searchValue,
    nextCustomerValue = customerValue,
    nextSortOrder = sortOrder,
    nextSortColumn = sortColumn,
    nextFilters = filteredInfo,
  } = {}) => {
    props.fetchInwardList(
      nextPage,
      nextPageSize,
      nextSearchValue,
      nextCustomerValue,
      nextSortOrder,
      nextSortColumn,
      nextFilters
    );
  };

  useEffect(() => {
    fetchRegisterList({
      nextPage: 1,
      nextPageSize: pageSize,
    });
    const menus = localStorage.getItem("Menus")
      ? JSON.parse(localStorage.getItem("Menus"))
      : [];
    if (menus.length > 0) {
      const menuLabels = menus.filter((menu) => menu.menuKey === menuKey);
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

  const getBatchFilterSearch = (filters) =>
    filters?.coilnumber && filters?.coilnumber[0]
      ? filters?.coilnumber[0]
      : searchValue;

  const handleChange = (pagination, filters, sorter) => {
    const nextPage = pagination?.current || pageNo;
    const nextPageSize = pagination?.pageSize || pageSize;
    const nextSortColumn = sorter?.columnKey || sortColumn;
    const nextSortOrder =
      sorter?.order === "descend"
        ? "DESC"
        : sorter?.order === "ascend"
        ? "ASC"
        : sortOrder;

    setSortedInfo(sorter);
    setFilteredInfo(filters);
    setSortColumn(nextSortColumn);
    setSortOrder(nextSortOrder);
    setPageNo(nextPage);
    setPageSize(nextPageSize);

    fetchRegisterList({
      nextPage,
      nextPageSize,
      nextSearchValue: getBatchFilterSearch(filters),
      nextSortOrder,
      nextSortColumn,
      nextFilters: filters,
    });
  };

  const clearFilters = () => {
    setCustomerValue("");
    setFilteredInfo({});
    setSearchValue("");
    setPageNo(1);
    fetchRegisterList({
      nextPage: 1,
      nextPageSize: pageSize,
      nextSearchValue: "",
      nextCustomerValue: "",
      nextFilters: {},
    });
  };

  const exportSelectedData = () => {};

  const fetchInwardListDebounced = useRef(
    debounce((params) => {
      props.fetchInwardList(...params);
    }, 300)
  ).current;

  const handleCustomerChange = (value) => {
    if (value) {
      setCustomerValue(value);
      setPageNo(1);
    } else {
      setCustomerValue("");
      setPageNo(1);
    }
    fetchInwardListDebounced([
      1,
      pageSize,
      searchValue,
      value ? value : "",
      sortOrder,
      sortColumn,
      filteredInfo,
    ]);
  };

  const handleSearchChange = (event) => {
    const nextValue = event.target.value;
    setSearchValue(nextValue);
    setPageNo(1);

    fetchInwardListDebounced([
      1,
      pageSize,
      nextValue,
      customerValue,
      sortOrder,
      sortColumn,
      filteredInfo,
    ]);
  };

  const handleBlur = () => {};

  function handleFocus() {}

  const storeKey = (data, selected) => {
    if (!selectedCBKeys.includes(data.key) && selected) {
      setSelectedCBKeys([...selectedCBKeys, data.key]);
      setSelectedRowData([...selectedRowData, data]);
    } else if (selectedCBKeys.includes(data.key) && !selected) {
      setSelectedCBKeys(selectedCBKeys.filter((k) => k !== data.key));
      setSelectedRowData(selectedRowData.filter((row) => row.key !== data.key));
    }
  };

  const getKey = (data, selected) => {
    if (
      data.status.statusName === "READY TO DELIVER" ||
      data.status.statusName === "RECEIVED"
    ) {
      storeKey(data, selected);
      if (data.children) {
        data.children.forEach((item) => getKey(item, selected));
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
        changeRows.forEach((item) => {
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
          <a
            href={props?.inward.s3pdfurl?.inward_pdf}
            target="_blank"
            rel="noopener noreferrer"
          >
            Inward PDF
          </a>{" "}
          &nbsp;&nbsp;&nbsp;
        </div>
        {props.inward.s3pdfurl?.plan_pdfs?.length > 0 && (
          <div>
            <p>Plan PDF</p>
            {props.inward.s3pdfurl?.plan_pdfs?.map((item) => (
              <div key={item.id}>
                <a
                  href={item?.pdfS3Url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.id}
                </a>
                <br />
              </div>
            ))}
          </div>
        )}
        {props.inward.s3pdfurl?.dc_pdfs?.length > 0 && (
          <div>
            <p>DC PDF</p>
            {props.inward.s3pdfurl?.dc_pdfs?.map((item) => (
              <a
                href={item?.pdfS3Url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.id}
              </a>
            ))}
          </div>
        )}
      </>
    );
  };

  const retrieveModal = (
    <>
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
    </>
  );

  const handlePageChange = (nextPage) => {
    setPageNo(nextPage);
    fetchRegisterList({
      nextPage,
    });
  };

  const handlePageSizeChange = (nextPageSize) => {
    const parsedPageSize = Number(nextPageSize);
    setPageNo(1);
    setPageSize(parsedPageSize);
    fetchRegisterList({
      nextPage: 1,
      nextPageSize: parsedPageSize,
    });
  };

  const paginationRangeStart =
    totalItems > 0 ? (pageNo - 1) * pageSize + 1 : 0;
  const paginationRangeEnd =
    totalItems > 0 ? Math.min(pageNo * pageSize, totalItems) : 0;

  const renderPaginationItem = (current, type, originalElement) => {
    if (type === "prev") {
      return (
        <button type="button" className="wez-register__pager-link">
          <Icon type="left" />
        </button>
      );
    }

    if (type === "next") {
      return (
        <button type="button" className="wez-register__pager-link">
          <Icon type="right" />
        </button>
      );
    }

    if (type === "jump-prev") {
      return (
        <button type="button" className="wez-register__pager-link">
          <Icon type="double-left" />
        </button>
      );
    }

    if (type === "jump-next") {
      return (
        <button type="button" className="wez-register__pager-link">
          <Icon type="double-right" />
        </button>
      );
    }

    return originalElement;
  };

  if (isAllocatedView) {
    return (
      <div className="wez-register wez-register--allocated">
        <div className="wez-register__summary-row">
          <div className="wez-register__stats">
            {summaryCards.map((card) => (
              <div
                key={card.key}
                className={`wez-register__stat-card wez-register__stat-card--${card.tone}`}
              >
                <div className="wez-register__stat-header">
                  <div className="wez-register__stat-label-group">
                    <span className="wez-register__stat-icon">
                      <Icon type={card.icon} />
                    </span>
                    <span className="wez-register__stat-label">{card.label}</span>
                  </div>
                  <span
                    className={`wez-register__trend wez-register__trend--${card.trend.tone}`}
                  >
                    {card.trend.direction === "up" && <Icon type="arrow-up" />}
                    {card.trend.direction === "down" && <Icon type="arrow-down" />}
                    {card.trend.value}
                  </span>
                </div>
                <div className="wez-register__stat-value-row">
                  <span className="wez-register__stat-value">
                    {formatWeight(card.value, { maximumFractionDigits: 0, suffix: "" })}
                  </span>
                  <span className="wez-register__stat-unit">{weightUnit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="wez-register__summary-controls">
            <Button className="wez-register__month-button" disabled>
              <Icon type="calendar" />
              This month
              <Icon type="down" />
            </Button>
          </div>
        </div>

        <Card className="wez-register__surface" bodyStyle={{ padding: 0 }}>
          <div className="wez-register__table-shell">
            <div className="wez-register__table-header">
              <div className="wez-register__table-heading">
                <div className="wez-register__table-title-row">
                  <h2 className="wez-register__table-title">
                    {screenConfig.listTitle || "Orders List"}
                  </h2>
                  <span className="wez-register__count-badge">
                    {totalItems || 0}
                  </span>
                </div>
              </div>
              <div className="wez-register__toolbar">
                <Input
                  className="wez-register__toolbar-search"
                  placeholder="Search"
                  prefix={<Icon type="search" />}
                  value={searchValue}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>

          {retrieveModal}

          <div className="wez-register__table-wrap">
            <Table
              rowClassName={(record) =>
                record.instructionId
                  ? "wez-register__row wez-register__row--instruction"
                  : "wez-register__row"
              }
              key={props.inward?.inwardList[0]?.inwardEntryId || pageNo}
              scroll={{ y: 540 }}
              tableLayout="fixed"
              className="gx-table-responsive wez-register__table"
              columns={visibleColumns}
              rowKey={(record) => record.key}
              loading={props.inward.loading}
              dataSource={[...props.inward.inwardList] || []}
              onChange={handleChange}
              rowSelection={
                partywisepermission === "ENDUSER_TAG_WISE_PACKETS"
                  ? false
                  : rowSelection
              }
              pagination={false}
            />
          </div>

          <div className="wez-register__table-footer">
            <div className="wez-register__pagination-meta">
              <span className="wez-register__pagination-label">
                Lines per page:
              </span>
              <Select
                className="wez-register__page-size"
                value={String(pageSize)}
                onChange={handlePageSizeChange}
              >
                {["10", "15", "20", "50"].map((sizeOption) => (
                  <Option key={sizeOption} value={sizeOption}>
                    {sizeOption}
                  </Option>
                ))}
              </Select>
              <span className="wez-register__pagination-range">
                {paginationRangeStart}-{paginationRangeEnd} of {totalItems || 0}
              </span>
            </div>

            <Pagination
              className="wez-register__pager"
              current={pageNo}
              pageSize={pageSize}
              total={totalItems}
              onChange={handlePageChange}
              itemRender={renderPaginationItem}
              showLessItems
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1>{title}</h1>
      <Card>
        <div className="gx-flex-row gx-flex-1">
          <div
            className="table-operations gx-col"
            style={{ paddingLeft: "0px" }}
          >
            <Select
              id="select"
              showSearch
              style={{ width: 200 }}
              label="Select a location"
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
          <div className="gx-flex-row">
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
                      props.history.push(deliveryPath);
                    }
                  }}
                  disabled={selectedCBKeys?.length < 1}
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
          </div>
        </div>
        {retrieveModal}
        <Table
          rowClassName={(record) =>
            record.instructionId ? "table-row-dark" : "table-row-light"
          }
          key={props.inward?.inwardList[0]?.inwardEntryId || pageNo}
          scroll={{ y: 540 }}
          className="gx-table-responsive"
          columns={visibleColumns}
          rowKey={(record) => record.key}
          loading={props.inward.loading}
          dataSource={[...props.inward.inwardList] || []}
          onChange={handleChange}
          rowSelection={
            partywisepermission === "ENDUSER_TAG_WISE_PACKETS"
              ? false
              : rowSelection
          }
          pagination={{
            pageSize: 15,
            current: pageNo,
            total: totalItems,
            showTotal: (total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} items`,
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
  fetchInwardList,
  getCoilsByPartyId,
  setInwardSelectedForDelivery,
  getS3PDFUrl,
})(RegisterList);
