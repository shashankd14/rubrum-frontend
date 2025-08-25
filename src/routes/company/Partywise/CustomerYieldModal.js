import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchYLRList } from "../../../appRedux/actions";
import { Col, Row, Table } from "antd";

const CustomerYieldModal = (props) => {
  const [cuttingfilteredData, setCuttingFilteredData] = useState();
  const [page, setPage] = useState(1);

  //Yield loss ratio
  const columnYieldLoss = [
    {
      title: "Sr. No",
      key: "index",
      render: (text, record, index) => (page - 1) * 10 + index + 1,
    },
    {
      title: "Location Name",
      dataIndex: "partyName",
      key: "partyName",
    },
    {
      title: "Loss Ratio from",
      dataIndex: "lossRatioPercentageFrom",
      key: "lossRatioPercentageFrom",
    },
    {
      title: "Loss Ratio to",
      dataIndex: "lossRatioPercentageTo",
      key: "lossRatioPercentageTo",
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
    },
  ];

  useEffect(() => {
    if (props.yieldLossRatioParty === undefined) {
      props.fetchYLRList({
        pageNo: "1",
        pageSize: "500",
        partyId: props?.coil?.party?.nPartyId,
        ipAddress: "",
        requestId: "YLR_PLAN_GET",
        userId: "",
      });
    }
  }, []);

  useEffect(() => {
    if (props.yieldLossRatioParty !== undefined) {
      const filterContentByProcessName = (processName, content) => {
        return content.filter((item) => item.processName === processName);
      };

      const filteredDataSlitting = filterContentByProcessName(
        "CUTTING",
        props.yieldLossRatioParty
      );
      setCuttingFilteredData(filteredDataSlitting);
    }
  }, [props.yieldLossRatioParty]);

  return (
    <Row>
      <Col lg={20} md={20} sm={24} xs={24}>
        <Table
          className="gx-table-responsive"
          columns={columnYieldLoss}
          dataSource={cuttingfilteredData}
        />
      </Col>
    </Row>
  );
};

const mapStateToProps = (state) => ({
  yieldLossRatioParty: state.yieldLossRatio.YLRList.content,
});

export default connect(mapStateToProps, {
  fetchYLRList,
})(CustomerYieldModal);
