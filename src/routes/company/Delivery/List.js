import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  fetchDeliveryList,
  fetchPartyList,
  fetchDeliveryListById,
  postDeliveryConfirm,
  deleteByDeliveryId,
  resetDeleteInward,
  requestInventoryAdjustment,
} from "../../../appRedux/actions";
import { Card, Table, Select, message, Modal, Spin, Icon, Tag } from "antd";
import SearchBox from "../../../components/SearchBox";
import ReconcileModal from "./ReconcileModal";
import moment from "moment";
import IntlMessages from "../../../util/IntlMessages";

const Option = Select.Option;

function List(props) {
  const { totalItems } = props.delivery;
  const [searchValue, setSearchValue] = useState("");
  const [deliveryList, setDeliveryList] = useState(props.delivery.deliveryList);
  const [reconcileModal, setreconcileModal] = useState(false);
  const [deliveryRecord, setDeliveryRecord] = useState();
  const [customerValue, setCustomerValue] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [syncloading, setSyncLoading] = React.useState(false);
  const dispatch = useDispatch();

  const [pageNo, setPageNo] = React.useState(1);
  const [totalPageItems, setTotalItems] = React.useState(0);

  const columns = [
    {
      title: "Delivery Chalan Number",
      dataIndex: "deliveryId",
      key: "x",
      render: (text, record) => (
        <span>
          <span
            className="gx-link"
            onClick={() => {
              props.fetchDeliveryListById(record.deliveryDetails.deliveryId);
              props.history.push(
                `delivery/${record.deliveryDetails.deliveryId}`,
              );
            }}
          >
            {record.deliveryDetails.deliveryId}
          </span>
        </span>
      ),
      sorter: (a, b) =>
        a.deliveryDetails.deliveryId - b.deliveryDetails.deliveryId,
    },
    {
      title: "Delivery Date",
      dataIndex: "deliveryDetails.updatedOn",
      render(value) {
        return moment(value).format("DD/MM/YYYY");
      },
      key: "updatedOn",
      filters: [],
      sorter: (a, b) =>
        a.deliveryDetails.updatedOn - b.deliveryDetails.updatedOn,
    },

    {
      title: "Location Name",
      dataIndex: "partyName",
      key: "partyName",
      sorter: (a, b) => a.partyName.length - b.partyName.length,
      filters: [],
    },

    {
      title: "Quantity Delivered",
      dataIndex: "deliveryDetails.totalWeight",
      key: "totalWeight",
      filters: [],
      sorter: (a, b) =>
        a.deliveryDetails?.totalWeight - b.deliveryDetails?.totalWeight,
    },
    {
      title: "Vehicle Number",
      dataIndex: "deliveryDetails.vehicleNo",
      key: "vehicleNo",
      filters: [],
      sorter: (a, b) =>
        a.deliveryDetails.vehicleNo.length - b.deliveryDetails.vehicleNo.length,
    },
    {
      title: "Inv Adj Remarks",
      dataIndex: "deliveryDetails.invAdjRemarks",
      key: "invAdjRemarks",
    },
    {
      title: "Zoho Sync Status",
      dataIndex: "deliveryDetails.zohoSyncStts",
      key: "zohoSyncStts",
      render: (text, record) => {
        if (record.deliveryDetails.zohoSyncStts === "PENDING") {
          return (
            <Tag color="orange" style={{ color: "orange" }}>
              Pending
            </Tag>
          );
        } else if (record.deliveryDetails.zohoSyncStts === "FAIL") {
          return (
            <Tag color="red" style={{ color: "red" }}>
              Fail
            </Tag>
          );
        } else if (record.deliveryDetails.zohoSyncStts === "SUCCESS") {
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
      title: "Sales invoice no",
      dataIndex: "deliveryDetails.salesInvoiceNo",
      key: "deliveryDetails.salesInvoiceNo",
    },
    {
      title: "Action",
      render: (text, record) =>
        record.deliveryDetails.zohoSyncStts === "PENDING" ||
        record.deliveryDetails.zohoSyncStts === "FAIL" ||
        record.deliveryDetails.zohoSyncStts === null ? (
          record.deliveryDetails.deliveryId === syncloading ? (
            <Spin
              indicator={<Icon type="loading" style={{ fontSize: 20 }} spin />}
            />
          ) : (
            <span
              className="gx-link"
              onClick={() => {
                setSyncLoading(record.deliveryDetails.deliveryId);
                dispatch(
                  requestInventoryAdjustment(record.deliveryDetails.deliveryId),
                );
              }}
            >
              Try again
            </span>
          )
        ) : (
          <></>
        ),
    },
  ];

  useEffect(() => {
    if (props.delivery.deleteSuccess) {
      message.success("Delivery deleted successfully", 2).then(() => {
        props.fetchDeliveryList(pageNo, 15);
        props.resetDeleteInward();
      });
    }
  }, [props.delivery.deleteSuccess]);

  useEffect(() => {
    if (props.delivery.deliverySyncSuccess) {
      setSyncLoading(false);
      message.success("Delivery synced successfully");
      props.fetchDeliveryList(pageNo, 15);
    }
  }, [props.delivery.deliverySyncSuccess]);

  useEffect(() => {
    if (totalItems) {
      setTotalItems(totalItems);
    }
  }, [totalItems]);

  useEffect(() => {
    if (searchValue) {
      if (searchValue.length >= 3) {
        setPageNo(1);
        props.fetchDeliveryList(1, 15, searchValue, customerValue);
      }
    } else {
      setPageNo(1);
      props.fetchDeliveryList(1, 15, searchValue, customerValue);
    }
  }, [searchValue]);

  const handleChange = (pagination, filters, sorter) => {};

  const handleCustomerChange = (value) => {
    if (value) {
      setCustomerValue(value);
      props.fetchDeliveryList(1, 15, searchValue, value);
    } else {
      setDeliveryList(props.delivery.deliveryList);
    }
  };
  useEffect(() => {
    if (!props.delivery.loading && props.delivery.success) {
      setDeliveryList(props.delivery.deliveryList);
    }
  }, [props.delivery.loading, props.delivery.success]);

  return (
    <div>
      <h1>
        <IntlMessages id="sidebar.company.deliveryItems" />
      </h1>
      <Card>
        <div className="gx-flex-row gx-flex-1">
          {reconcileModal ? (
            <ReconcileModal
              showModal={reconcileModal}
              deliveryRecord={deliveryRecord}
            />
          ) : null}
          <SearchBox
            styleName="gx-flex-1"
            placeholder="Search for batch no. or location or SC inward id..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div className="table-operations gx-col">
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a location"
              optionFilterProp="children"
              onChange={handleCustomerChange}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {props.party.partyList.length > 0 &&
                props.party.partyList.map((party) => (
                  <Option value={party.nPartyId}>{party.partyName}</Option>
                ))}
            </Select>
          </div>
        </div>
        <br />
        <Table
          rowSelection={[]}
          className="gx-table-responsive"
          columns={columns}
          dataSource={deliveryList}
          onChange={handleChange}
          loading={props.delivery.loading}
          pagination={{
            pageSize: 15,
            onChange: (page) => {
              setPageNo(page);
              props.fetchDeliveryList(page, 15, searchValue, customerValue);
            },
            current: pageNo,
            total: totalPageItems,
          }}
        />
      </Card>
      <Modal
        title="Delete confirmation"
        visible={showDeleteModal}
        onOk={() => {
          props.deleteByDeliveryId(
            Number(showDeleteModal?.deliveryDetails?.deliveryId),
          );
          setShowDeleteModal(false);
        }}
        onCancel={() => setShowDeleteModal(false)}
      >
        <p>Are you sure to proceed for delete delivery ? </p>
        <p>Please click OK to confirm</p>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => ({
  delivery: state.deliveries,
  party: state.party,
});

export default connect(mapStateToProps, {
  fetchDeliveryList,
  fetchPartyList,
  fetchDeliveryListById,
  postDeliveryConfirm,
  deleteByDeliveryId,
  resetDeleteInward,
})(List);
