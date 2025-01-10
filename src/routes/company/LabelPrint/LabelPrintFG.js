import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Modal, Select, Table } from 'antd';
import {
  fetchPartyList,
  fetchInwardList,
  getQualityReportById,
  fetchQualityReportStageList,
  labelPrintFG,
} from '../../../appRedux/actions';
import moment from 'moment';
import { useIntl } from 'react-intl';
import SearchBox from '../../../components/SearchBox';

const LabelPrintFG = props => {
  const [sortedInfo, setSortedInfo] = useState({
    order: 'descend',
    columnKey: 'age',
  });
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [customerValue, setCustomerValue] = useState('');
  const [filteredInwardList, setFilteredInwardList] = useState(
    props.template.data.content,
  );
  const [qualityReportList, setQualityReportList] = useState([]);
  const { totalItems } = props.template;
  const [pageNo, setPageNo] = React.useState(1);
  const [totalPageItems, setTotalItems] = React.useState(0);
  const [partyList, setPartyList] = useState([]);
  const [templateId, setTemplateId] = useState();
  const [showPopup, setShowPopup] = React.useState(false);

  const columns = [
    {
      title: 'Coil Number',
      dataIndex: 'coilNo',
      key: 'coilNo',
      filters: [],
      sorter: (a, b) => a.coilNo.length - b.coilNo.length,
      sortOrder: sortedInfo.columnKey === 'coilNo' && sortedInfo.order,
    },
    {
      title: 'Batch Number',
      dataIndex: 'customerBatchNo',
      key: 'customerBatchNo',
      filteredValue: filteredInfo ? filteredInfo['customerBatchNo'] : null,
      onFilter: (value, record) => record.customerBatchNo == value,
      filters: [],
      sorter: (a, b) => a.customerBatchNo.length - b.customerBatchNo.length,
      sortOrder: sortedInfo.columnKey === 'customerBatchNo' && sortedInfo.order,
    },
    {
      title: 'Inward Date',
      dataIndex: 'planDate',
      render(value) {
        const formattedDate = moment(value, 'DD/MM/YYYY').format('Do MMM YYYY');
        return <span>{formattedDate}</span>;
      },
      key: 'planDate',
      filters: [],
      sorter: (a, b) =>
        moment(a.planDate, 'DD/MM/YYYY').valueOf() -
        moment(b.planDate, 'DD/MM/YYYY').valueOf(),
      sortOrder: sortedInfo.columnKey === 'planDate' && sortedInfo.order,
    },
    {
      title: 'Material',
      dataIndex: 'materialDesc',
      key: 'materialDesc',
      filteredValue: filteredInfo ? filteredInfo['materialDesc'] : null,
      onFilter: (value, record) => record.materialDesc == value,
      filters: [],
      sorter: (a, b) => a.materialDesc.length - b.materialDesc.length,
      sortOrder: sortedInfo.columnKey === 'materialDesc' && sortedInfo.order,
    },
    {
      title: 'Grade',
      dataIndex: 'materialGrade',
      key: 'materialGrade',
      filteredValue: filteredInfo ? filteredInfo['materialGrade'] : null,
      onFilter: (value, record) => record.materialGrade == value,
      filters: [],
      sorter: (a, b) => a.materialGrade.length - b.materialGrade.length,
      sortOrder: sortedInfo.columnKey === 'materialGrade' && sortedInfo.order,
    },
    {
      title: 'Thickness',
      dataIndex: 'fthickness',
      key: 'fthickness',
      filters: [],
      sorter: (a, b) => a.fthickness - b.fthickness,
      sortOrder: sortedInfo.columnKey === 'fthickness' && sortedInfo.order,
    },
    {
      title: 'Width',
      dataIndex: 'fwidth',
      key: 'fwidth',
      filters: [],
      sorter: (a, b) => a.fwidth - b.fwidth,
      sortOrder: sortedInfo.columnKey === 'fwidth' && sortedInfo.order,
    },
    {
      title: 'Weight',
      dataIndex: 'targetWeight',
      key: 'targetWeight',
      filters: [],
      sorter: (a, b) => a.targetWeight - b.targetWeight,
      sortOrder: sortedInfo.columnKey === 'targetWeight' && sortedInfo.order,
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text, record, index) => (
        <span>
          <span
            className="gx-link"
            onClick={() => {
              onPdf(record.inwardEntryId);
              setShowPopup(true);
            }}
          >
            Label Print
          </span>
        </span>
      ),
    },
  ];

  useEffect(() => {
    props.fetchQualityReportStageList({
      stage: 'inward',
      page: 1,
      pageSize: 15,
      searchValue: '',
      customerValue: '',
    });
    props.fetchPartyList();
  }, []);

  useEffect(() => {
    if (searchValue) {
      if (searchValue.length >= 3) {
        setPageNo(1);
        props.fetchQualityReportStageList({
          stage: 'inward',
          page: 1,
          pageSize: 15,
          searchValue,
          customerValue,
        });
      }
    } else {
      setPageNo(1);
      props.fetchQualityReportStageList({
        stage: 'inward',
        page: 1,
        pageSize: 15,
        searchValue,
        customerValue,
      });
    }
  }, [searchValue]);

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (!isInitialMount.current) {
      if (
        !props.template.loading &&
        !props.template.error &&
        props.template.operation == 'fetchQualityReport'
      ) {
        console.log(props.template);
        setQualityReportList(props.template.data);
      } else if (
        !props.template.loading &&
        !props.template.error &&
        props.template.operation == 'fetchQualityReportStage'
      ) {
        console.log(props.template);
        setFilteredInwardList(props.template.data);
        console.log(props.template.data);
      }
    } else {
      // This block will be executed only on the first render
      isInitialMount.current = false;
    }
  }, [props.template.loading, props.template.error, props.template.operation]);

  const handleChange = e => {
    console.log(e);
    setTemplateId(e);
  };

  const handleCustomerChange = value => {
    if (value) {
      setCustomerValue(value);
      setPageNo(1);
      props.fetchQualityReportStageList(1, 15, searchValue, value);
    } else {
      setCustomerValue('');
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
      console.log(props.party);
      setPartyList(props.party.partyList);
    }
  }, [props.party.loading, props.party.error]);

  const onPdf = inwardEntryId => {
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

    const payloadpdf = { inwardEntryId: inwardEntryId, process: 'FG' };
    props.labelPrintFG(payloadpdf);
  };

  const convertTimestampToDateTime = timestamp => {
    const dateObject = new Date(timestamp);
    return dateObject.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true, // 12-hour clock
    });
  };

  const getsPlanLabel = () => {
    return (
      <>
        {props.labelPrint?.fgLabelPdf?.fg_labels?.length > 0 && (
          <div>
            <p>
              FG Labels
              &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
              Modified Time
            </p>
            {props.labelPrint?.fgLabelPdf?.fg_labels?.map((item, index) => (
              <>
                <a href={item?.labelUrl} target="_blank">
                  {index + 1}. {item.id}
                </a>{' '}
                <span>{}</span>
                <span>{convertTimestampToDateTime(item.modifiedTime)}</span>
                <br />
              </>
            ))}
          </div>
        )}
      </>
    );
  };
  console.log('labelPrint props', props);
  return (
    <>
      <div className="gx-flex-row gx-flex-1">
        <div className="table-operations gx-col">
          <Select
            id="select"
            showSearch
            style={{ width: 200 }}
            placeholder="Select a customer"
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
              partyList.map(party => (
                <Select.Option key={party.nPartyId} value={party.nPartyId}>
                  {party.partyName}
                </Select.Option>
              ))}
          </Select>
        </div>
        <div className="table-operations gx-col">
          <SearchBox
            styleName="gx-flex-1"
            placeholder="Search by Coil no. or Customer batch no"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          ></SearchBox>
        </div>
      </div>
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
              props.fetchQualityReportStageList({
                stage: 'inward',
                page,
                pageSize,
                searchValue,
                customerValue,
              });
            },
            current: pageNo,
            total: totalPageItems,
          }}
        />
      </div>
      {showPopup && (
        <Modal
          title="Label Print"
          visible={showPopup}
          width={600}
          onOk={() => setShowPopup(false)}
          onCancel={() => setShowPopup(false)}
        >
          <p>Please click on the Instructions to generate the label print</p>
          {getsPlanLabel()}
        </Modal>
      )}
    </>
  );
};

const mapStateToProps = state => ({
  template: state.quality,
  inward: state.inward,
  party: state.party,
  labelPrint: state.labelPrint,
});

export default connect(mapStateToProps, {
  fetchInwardList,
  fetchPartyList,
  getQualityReportById,
  fetchQualityReportStageList,
  labelPrintFG,
})(withRouter(LabelPrintFG));
