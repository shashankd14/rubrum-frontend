import React, { useEffect } from "react";
import { Modal, Table, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { syncToZoho, getInwardsAgainstPo } from "../../../appRedux/actions";

const SyncToZohoModal = (props) => {
  const dispatch = useDispatch();
  const inwardState = useSelector((state) => state.inward);

  useEffect(() => {
    if (props.poInvoiceNumber)
      dispatch(getInwardsAgainstPo(props.poInvoiceNumber));
  }, [props.poInvoiceNumber]);

  useEffect(() => {
    if (inwardState.syncToZohoError && inwardState.syncToZohoErrorMessage) {
      message.error(inwardState.syncToZohoErrorMessage);
    }
  }, [inwardState.syncToZohoError]);

  useEffect(() => {
    if (inwardState.syncToZohoSuccess) {
      message.success(
        "Purchase Invoice " +
          props.poInvoiceNumber +
          " synched to zoho successfully"
      );
      props.setShowSyncModal(false);
    }
  }, [inwardState.syncToZohoSuccess]);

  return (
    <Modal
      title="Sync To Zoho - Inwards Against PO"
      visible={props.showSyncModal}
      onOk={() => {
        dispatch(syncToZoho(props.poInvoiceNumber));
      }}
      onCancel={() => props.setShowSyncModal(false)}
    >
      <Table
        dataSource={inwardState?.inwardsAgainstPoList?.content || []}
        columns={[
          {
            title: "Coil Number",
            dataIndex: "coilNumber",
            key: "coilNumber",
          },
          {
            title: "PO Number",
            dataIndex: "poReference",
            key: "poReference",
          },
          {
            title: "Material ID",
            dataIndex: "mmId",
            key: "mmId",
          },
        ]}
      />
    </Modal>
  );
};

export default SyncToZohoModal;
