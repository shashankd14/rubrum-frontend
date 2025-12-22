import React, { useEffect } from "react";
import {
  fetchPurchaseInvoices,
  requestDocSync,
} from "../../../appRedux/actions";
import IntlMessages from "../../../util/IntlMessages";
import { Table, Card, message, Spin, Icon } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toPascalCase, capitalizeFirstLetter } from "util/Common";
import SyncToZohoModal from "../../company/Inward/SyncToZohoModal";

const List = (props) => {
  const dispatch = useDispatch();
  const purchaseInvoices = useSelector((state) => state.purchaseInvoices);
  const [purchaseInvoicesPageNo, setPurchaseInvoicesPageNo] = React.useState(1);
  const [purchaseInvoicesNo, setPurchaseInvoicesNo] = React.useState("");
  const [showSyncModal, setShowSyncModal] = React.useState(false);
  const inwardState = useSelector((state) => state.inward);
  const [syncloading, setSyncLoading] = React.useState(false);

  const PurchaseInvoiceColumns = [
    {
      title: "Number",
      dataIndex: "poInvoiceNo",
      key: "poInvoiceNo",
    },
    {
      title: "Sync Status",
      dataIndex: "poInvSyncStatus",
      key: "poInvSyncStatus",
      render: (text, record) => {
        return record.poInvSyncStatus
          ? toPascalCase(record.poInvSyncStatus)
          : "-";
      },
    },
    {
      title: "Doc sync Status",
      dataIndex: "zohoDocumentUploadStts",
      key: "zohoDocumentUploadStts",
      render: (text, record) => {
        return record.zohoDocumentUploadStts
          ? toPascalCase(record.zohoDocumentUploadStts)
          : "-";
      },
    },
    {
      title: "Sync Remarks",
      dataIndex: "poInvSyncRemarks",
      key: "poInvSyncRemarks",
      render: (text, record) => {
        return record.poInvSyncRemarks
          ? capitalizeFirstLetter(JSON.parse(record.poInvSyncRemarks).message)
          : "-";
      },
    },
    {
      title: "Action",
      dataIndex: "",
      key: "",
      width: "130px",
      render: (text, record, index) =>
        record.poInvSyncStatus === "PENDING" || record.manualPoFlag === "N" ? (
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

  useEffect(() => {
    dispatch(fetchPurchaseInvoices(1, 15, ""));
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
        <Table
          className="gx-table-responsive"
          columns={PurchaseInvoiceColumns}
          dataSource={purchaseInvoices.list || []}
          // expandedRowRender={(record) => expandedRowRendered(record)}
          // onChange={handleChange}
          pagination={{
            pageSize: 15,
            showTotal: (total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} items`,
            onChange: (page) => {
              setPurchaseInvoicesPageNo(page);
              dispatch(fetchPurchaseInvoices(page, 15, ""));
            },
            current: purchaseInvoicesPageNo,
            total: purchaseInvoices.totalItems,
          }}
        />
      </Card>
    </div>
  );
};

export default List;
