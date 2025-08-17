import React, { useEffect, useRef, useState } from 'react'
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Select, Table } from 'antd'
import {
    fetchPartyList,
    fetchInwardList,
    getQualityReportById,
    fetchQualityReportStageList,
    labelPrintInward
} from "../../../appRedux/actions";
import moment from "moment";
import { useIntl } from "react-intl";
import SearchBox from "../../../components/SearchBox";

const LabelPrintInward = (props) => {

    const [sortedInfo, setSortedInfo] = useState({
        order: "descend",
        columnKey: "age",
    });
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [customerValue, setCustomerValue] = useState("");
    const [filteredInwardList, setFilteredInwardList] = useState(props.template.data.content);
    const [qualityReportList, setQualityReportList] = useState([]);

    const [pageNo, setPageNo] = React.useState(1);
    const [totalPageItems, setTotalItems] = React.useState(0);
    const [partyList, setPartyList] = useState([]);
    const [templateId, setTemplateId] = useState();
    const { totalItems } = props.template;
   
    const columns = [
      {
        title: "Batch no.",
        dataIndex: "coilNo",
        key: "coilNo",
        filters: [],
        sorter: false,
      },
      {
        title: "SC inward id",
        dataIndex: "customerBatchNo",
        key: "customerBatchNo",
        sorter: false,
        render: (text, record) => {
          return record.customerBatchNo == "undefined" ||
            record.batch == "undefined"
            ? "-"
            : record.customerBatchId || record.batch;
        },
      },
      {
        title: "Inward Date",
        dataIndex: "planDate",
        render(value) {
          const formattedDate = moment(value, "DD/MM/YYYY").format(
            "Do MMM YYYY"
          );
          return <span>{formattedDate}</span>;
        },
        key: "planDate",
        filters: [],
        sorter: false,
      },
      {
        title: "Material",
        dataIndex: "materialDesc",
        key: "materialDesc",
        sorter: false,
      },
      {
        title: "Grade",
        dataIndex: "materialGrade",
        key: "materialGrade",
        sorter: false,
      },
      {
        title: "Thickness",
        dataIndex: "fthickness",
        key: "fthickness",
        sorter: false,
      },
      {
        title: "Width",
        dataIndex: "fwidth",
        key: "fwidth",
        sorter: false,
      },
      {
        title: "Weight",
        dataIndex: "targetWeight",
        key: "targetWeight",
        sorter: false,
      },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        render: (text, record, index) => (
          <span>
            <span
              className="gx-link"
              onClick={() => onPdf(record.inwardEntryId)}
            >
              Label Print
            </span>
          </span>
        ),
      },
    ];

    useEffect(() => {
        props.fetchQualityReportStageList({ stage: "inward", page: 1, pageSize: 15, searchValue:'', customerValue: '' });
        props.fetchPartyList();
    }, []);

    useEffect(() => {
        if (searchValue) {
          if (searchValue.length >= 3) {
            setPageNo(1);
            props.fetchQualityReportStageList({ stage: "inward", page: 1, pageSize: 15, searchValue, customerValue});
          }
        } else {
          setPageNo(1);
          props.fetchQualityReportStageList({ stage: "inward", page: 1, pageSize: 15, searchValue, customerValue});
        }
      }, [searchValue]);

    const isInitialMount = useRef(true);
    useEffect(() => {
        if (!isInitialMount.current){
        if (!props.template.loading && !props.template.error && props.template.operation == "fetchQualityReport") {
            setQualityReportList(props.template.data)
        } else if (!props.template.loading && !props.template.error && props.template.operation == "fetchQualityReportStage") {
            setFilteredInwardList(props.template.data)
        }}
        else {
            // This block will be executed only on the first render
            isInitialMount.current = false;
        }
    }, [props.template.loading, props.template.error, props.template.operation]);

    const handleChange = (e) => {
        setTemplateId(e)
    };

    const handleCustomerChange = (value) => {
        if (value) {
          setCustomerValue(value);
          setPageNo(1);
          props.fetchQualityReportStageList(1, 15, searchValue, value);
        } else {
          setCustomerValue("");
           setFilteredInwardList(props.template.data.content);
        }
      };

    useEffect(() => {
        if (totalItems) {
          setTotalItems(totalItems);
        }
      }, [totalItems]);

      const handleChangeTable = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
        setFilteredInfo(filters);
      };

    useEffect(() => {
        if (!props.party.loading && !props.party.error) {
            setPartyList(props.party.partyList)
        }
    }, [props.party.loading, props.party.error]);

      const onPdf = (inwardEntryId) => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString();
        setFilteredInwardList(prevList => {
            return prevList.map(item => {
                if (item.inwardEntryId === inwardEntryId) {
                    return { ...item, generatingDate: formattedDate };
                }
                return item;
            });
        });

        const payloadpdf = {inwardEntryId:inwardEntryId, process:"INWARD"}
         props.labelPrintInward(payloadpdf);
    }

    return (
        <>

            <div className="gx-flex-row gx-flex-1">
                <div className="table-operations gx-col">
                    <Select
                        id="select"
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select a Location"
                        optionFilterProp="children"
                        onChange={handleCustomerChange}
                        value={customerValue}
                        // onFocus={handleFocus}
                        // onBlur={handleBlur}
                        filterOption={(input, option) =>
                            option.props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                    >

                        {partyList.length > 0 &&
                            partyList.map((party) => (
                                <Select.Option key={party.nPartyId} value={party.nPartyId}>{party.partyName}</Select.Option>
                            ))}
                    </Select>
                </div>
                <div className="table-operations gx-col">
                    <SearchBox
                        styleName="gx-flex-1"
                        placeholder="Search by Coil no. or SC inward id"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}>
                    </SearchBox>

                </div>
            </div>
            <br></br>
            {/* <div className="gx-flex-row gx-flex-1"> */}
            <div>
                <Table
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={filteredInwardList}
                    onChange={handleChangeTable}
                    pagination={{
                        pageSize: 15,
                        onChange: (page, pageSize) => {
                            setPageNo(page);
                            props.fetchQualityReportStageList({stage: "inward", page, pageSize, searchValue, customerValue});
                        },
                        current: pageNo,
                        total: totalPageItems,
                    }}
                />
            </div>
        </>
    )
}

const mapStateToProps = (state) => ({
    template: state.quality,
    inward: state.inward,
    party: state.party,
});

export default connect(mapStateToProps, {
    fetchInwardList,
    fetchPartyList,
    getQualityReportById,
    fetchQualityReportStageList,
    labelPrintInward
})(withRouter(LabelPrintInward));