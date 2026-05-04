import React, { useEffect } from "react";
import {
  fetchPurchaseInvoices,
  requestDocSync,
} from "../../../appRedux/actions";
import IntlMessages from "../../../util/IntlMessages";
import {
  Table,
  Card,
  message,
  Spin,
  Icon,
  Button,
  DatePicker,
  Select,
  Tag,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { capitalizeFirstLetter } from "util/Common";
import SyncToZohoModal from "../../company/Inward/SyncToZohoModal";
import SearchBox from "../../../components/SearchBox";

const { Option } = Select;

const List = (props) => {
  const dispatch = useDispatch();
  const purchaseInvoices = useSelector((state) => state.purchaseInvoices);
  const [purchaseInvoicesList, setPurchaseInvoicesList] = React.useState(
    purchaseInvoices.list,
  );
  const [purchaseInvoicesPageNo, setPurchaseInvoicesPageNo] = React.useState(1);
  const [purchaseInvoicesNo, setPurchaseInvoicesNo] = React.useState("");
  const [showSyncModal, setShowSyncModal] = React.useState(false);
  const inwardState = useSelector((state) => state.inward);
  const partyList = useSelector((state) => state.party.partyList);
  const [syncloading, setSyncLoading] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [customerValue, setCustomerValue] = React.useState("");
  const [filteredInfo, setFilteredInfo] = React.useState({});

  const PurchaseInvoiceColumns = [
    {
      title: "Number",
      dataIndex: "poInvoiceNo",
      key: "poInvoiceNo",
    },
    {
      title: "Location",
      dataIndex: "locationName",
      key: "locationName",
    },
    {
      title: "Inward date",
      dataIndex: "inwardDate",
      key: "inwardDate",
      filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <DatePicker
            value={filteredInfo["inwardDate"] || null}
            onChange={(date) => {
              setFilteredInfo({ ...filteredInfo, inwardDate: date });
              setSelectedKeys(date ? [date] : []);
            }}
            style={{ marginBottom: 8, display: "block" }}
          />
          <div>
            <Button
              type="primary"
              onClick={() => {
                if (filteredInfo["inwardDate"]) {
                  setSelectedKeys([filteredInfo["inwardDate"]]);
                }
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
                setFilteredInfo({ ...filteredInfo, inwardDate: null });
                clearFilters();
              }}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: (filtered) => (
        <Icon
          type="calendar"
          style={{ color: filtered ? "#1890ff" : undefined }}
        />
      ),
      onFilter: (value, record) => {
        if (!value || !record.inwardDate) return true;
        const recordDate = new Date(record.inwardDate).toDateString();
        const filterDate = value.toDate().toDateString();
        return recordDate === filterDate;
      },
    },
    {
      title: "Sync Status",
      dataIndex: "poInvSyncStatus",
      key: "poInvSyncStatus",
      render: (text, record) => {
        if (record.poInvSyncStatus === "PENDING") {
          return (
            <Tag color="orange" style={{ color: "orange" }}>
              Pending
            </Tag>
          );
        } else if (record.poInvSyncStatus === "FAIL") {
          return (
            <Tag color="red" style={{ color: "red" }}>
              Fail
            </Tag>
          );
        } else if (record.poInvSyncStatus === "SUCCESS") {
          return (
            <Tag color="green" style={{ color: "green" }}>
              Success
            </Tag>
          );
        } else {
          return <span>-</span>;
        }
      },
    },
    {
      title: "Doc sync Status",
      dataIndex: "zohoDocumentUploadStts",
      key: "zohoDocumentUploadStts",
      render: (text, record) => {
        if (record.poInvSyncStatus === "PENDING") {
          return (
            <Tag color="orange" style={{ color: "orange" }}>
              Pending
            </Tag>
          );
        } else if (record.poInvSyncStatus === "FAIL") {
          return (
            <Tag color="red" style={{ color: "red" }}>
              Fail
            </Tag>
          );
        } else if (record.poInvSyncStatus === "SUCCESS") {
          return (
            <Tag color="green" style={{ color: "green" }}>
              Success
            </Tag>
          );
        } else {
          return <span>-</span>;
        }
      },
    },
    {
      title: "Sync Remarks",
      dataIndex: "poInvSyncRemarks",
      key: "poInvSyncRemarks",
      render: (text, record) => {
        if (!record.poInvSyncRemarks) return "-";
        let remarks = record.poInvSyncRemarks;
        try {
          const parsed = JSON.parse(remarks);
          remarks = parsed.message || null;
        } catch {
          remarks = remarks.message || remarks;
        }
        return remarks ? capitalizeFirstLetter(remarks) : "-";
      },
    },
    {
      title: "Action",
      dataIndex: "",
      key: "",
      width: "130px",
      render: (text, record, index) =>
        (record.poInvSyncStatus === "PENDING" ||
          record.zohoDocumentUploadStts === "PENDING") &&
        record.manualPoFlag === "N" ? (
          <span
            className="gx-link"
            onClick={() => {
              if (record.poInvSyncStatus === "PENDING") {
                setPurchaseInvoicesNo(record.poInvoiceNo);
                setShowSyncModal(true);
              } else if (record.zohoDocumentUploadStts === "PENDING") {
                setSyncLoading(record.billId);
                dispatch(requestDocSync(record.billId));
              }
            }}
          >
            {record.billId === syncloading && (
              <Spin
                indicator={
                  <Icon type="loading" style={{ fontSize: 20 }} spin />
                }
              />
            )}
            Try again
          </span>
        ) : (
          <></>
        ),
    },
  ];

  const resetPurchaseInvoicesList = () => {
    setPurchaseInvoicesList(purchaseInvoices.list);
  };

  useEffect(() => {
    resetPurchaseInvoicesList();
  }, [purchaseInvoices.list]);

  useEffect(() => {
    dispatch(fetchPurchaseInvoices(purchaseInvoicesPageNo, 15, ""));
  }, []);

  useEffect(() => {
    if (
      inwardState.invoiceDocSyncError &&
      inwardState.invoiceDocSyncErrorMessage
    ) {
      setSyncLoading(false);
      message.error(inwardState.invoiceDocSyncErrorMessage);
    }
  }, [inwardState.invoiceDocSyncError]);

  useEffect(() => {
    if (inwardState.invoiceDocSyncSuccess) {
      setSyncLoading(false);
      message.success("Invoice document synced successfully");
    }
  }, [inwardState.invoiceDocSyncSuccess]);

  const handleCustomerChange = (value) => {
    if (value) {
      setCustomerValue(value);
      setPurchaseInvoicesPageNo(1);
      dispatch(fetchPurchaseInvoices(1, 15, searchValue, value));
    } else {
      setCustomerValue("");
      setPurchaseInvoicesList(purchaseInvoices.list);
    }
  };

  const handleChange = (pagination, filters) => {
    const inwardDate = filters.inwardDate?.[0];
    const locationName = filters.locationName?.[0];
    setPurchaseInvoicesPageNo(pagination.current);
    dispatch(
      fetchPurchaseInvoices(
        pagination.current,
        15,
        searchValue,
        locationName || "",
        inwardDate ? inwardDate.format("YYYY-MM-DD") : "",
      ),
    );
  };

  const expandedRowRendered = (record) => {
    const columns = [
      {
        title: "Coil number",
        dataIndex: "coilNumber",
        key: "coilNumber",
      },
      {
        title: "Coil status",
        dataIndex: "coilStatus",
        key: "coilStatus",
      },
      {
        title: "SC Inward Id",
        dataIndex: "customerBatchId",
        key: "customerBatchId",
      },
      {
        title: "Invoice Date",
        dataIndex: "invoiceDate",
        key: "invoiceDate",
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={record.coilList}
        pagination={false}
      />
    );
  };

  useEffect(() => {
    if (searchValue) {
      if (searchValue.length >= 3) {
        setPurchaseInvoicesPageNo(1);
        dispatch(fetchPurchaseInvoices(1, 15, searchValue));
      }
    }
  }, [searchValue]);

  return (
    <div className="table-operations gx-justify-content-between">
      <h1>
        <IntlMessages id="sidebar.company.purchaseInvoices" />
      </h1>
      <br></br>
      <SyncToZohoModal
        showSyncModal={showSyncModal}
        setShowSyncModal={() => setShowSyncModal(!showSyncModal)}
        poInvoiceNumber={purchaseInvoicesNo}
        syncToZoho={props.syncToZoho}
      />
      <Card>
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
                setFilteredInfo({});
                setCustomerValue("");
                setPurchaseInvoicesPageNo(1);
                dispatch(fetchPurchaseInvoices(1, 15, "", ""));
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
        <br />
        <Table
          className="gx-table-responsive"
          key={
            props.inward?.inwardList[0]?.coilNumber || purchaseInvoicesPageNo
          }
          rowKey={(record) => record.key}
          loading={purchaseInvoices.loading}
          columns={PurchaseInvoiceColumns}
          dataSource={purchaseInvoicesList || []}
          onChange={handleChange}
          pagination={{
            pageSize: 15,
            showTotal: (total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} items`,
            current: purchaseInvoicesPageNo,
            total: purchaseInvoices.totalItems,
          }}
          expandedRowRender={(record) => expandedRowRendered(record)}
        />
      </Card>
    </div>
  );
};

export default List;
