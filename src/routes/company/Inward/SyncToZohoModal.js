import React, { useEffect } from "react";
import { Modal, Table, message, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { syncToZoho, getInwardsAgainstPo } from "../../../appRedux/actions";
const { Title, Text } = Typography;

const SyncToZohoModal = (props) => {
  const dispatch = useDispatch();
  const inwardState = useSelector((state) => state.inward);

  useEffect(() => {
    if (props.poInvoiceNumber && props.showSyncModal)
      dispatch(getInwardsAgainstPo(props.poInvoiceNumber));
  }, [props.poInvoiceNumber, props.showSyncModal]);

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
      title="Sync To Zoho - Inwards against Invoice"
      visible={props.showSyncModal}
      onOk={() => {
        dispatch(syncToZoho(props.poInvoiceNumber));
      }}
      width={800}
      onCancel={() => props.setShowSyncModal(false)}
    >
      <Title level={4}>
        Invoice value of goods{" "}
        <Text type="warning">
          {inwardState?.inwardsAgainstPoList?.content
            ? inwardState?.inwardsAgainstPoList?.content.totalValueOfGoods
            : 0}
        </Text>
      </Title>
      <Table
        dataSource={
          inwardState?.inwardsAgainstPoList?.content?.inwardList || []
        }
        columns={[
          {
            title: "Batch Number",
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
          {
            title: "Quantity",
            dataIndex: "qty",
            key: "qty",
          },
          {
            title: "Value of goods",
            dataIndex: "valueOfGoods",
            key: "valueOfGoods",
          },
        ]}
      />
    </Modal>
  );
};

export default SyncToZohoModal;
