import React, { useEffect } from "react";
import { fetchPurchaseInvoices } from "../../../appRedux/actions";
import IntlMessages from "../../../util/IntlMessages";
import { Table, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toPascalCase } from "util/Common";
import SyncToZohoModal from "../../company/Inward/SyncToZohoModal";

const List = (props) => {
  const dispatch = useDispatch();
  const purchaseInvoices = useSelector((state) => state.purchaseInvoices);
  const [purchaseInvoicesPageNo, setPurchaseInvoicesPageNo] = React.useState(1);
  const [purchaseInvoicesNo, setPurchaseInvoicesNo] = React.useState(""); 
  const [showSyncModal, setShowSyncModal] = React.useState(false); 
  
  const PurchaseInvoiceColumns = [
    {
      title: "PO Invoice Number",
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
      title: "Sync",
      dataIndex: "",
      key: "",
      render: (text, record, index) => (
        <span
          className="gx-link"
          onClick={() => {
            setPurchaseInvoicesNo(record.poInvoiceNo);
            setShowSyncModal(true);
          }}
        >
          Sync to Zoho
        </span>
      ),
    },
    // {
    //   title: "Process name",
    //   dataIndex: "soStatus",
    //   key: "soStatus",
    //   render: (text, record) => {
    //     return record.soStatus ? toPascalCase(record.soStatus) : "-";
    //   },
    // },
  ];

  useEffect(() => {
    dispatch(fetchPurchaseInvoices(1, 15, ""));
  }, []);

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
