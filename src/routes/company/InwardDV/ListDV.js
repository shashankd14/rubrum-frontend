import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Card, Divider, Icon, Table, message } from "antd";
import moment from "moment";
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import {
  fetchInwardListOldAPI,
  resetInwardForm,
  deleteInwardEntryById,
  resetDeleteInward,
  fetchPartyListById,
} from "../../../appRedux/actions/Inward";
import { deleteInwardDV, updateInwardDV, fetchInwardDVListId, fetchInwardDVList } from '../../../appRedux/actions';
import { onDeleteContact } from "../../../appRedux/actions";
import {sidebarMenuItems} from "../../../constants";


const List = (props) => {
  const [sortedInfo, setSortedInfo] = useState({
    order: "descend",
    columnKey: "age",
  });
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filteredInwardList, setFilteredInwardList] = useState(
    props.inwardDV.inwardDVList
  );

  const [pageNo, setPageNo] = React.useState(1);
  const [totalPageItems, setTotalPageItems] = React.useState(0);
  const [menuInwardLabelList, setMenuInwardLabelList] = useState([]);

  const { totalItems } = props.inwardDV.inwardDVList;

  const columns = [
    {
      title: "Vendor Batch No",
      dataIndex: "vendorBatchNo",
      key: "vendorBatchNo",
      filters: [],
      sorter: (a, b) => a.vendorBatchNo.length - b.vendorBatchNo.length,
      sortOrder: sortedInfo.columnKey === "vendorBatchNo" && sortedInfo.order,
    },
    {
      title: "Vendor Name",
      dataIndex: "vendorName",
      key: "vendorName",
      filters: [],
      sorter: (a, b) => a.vendorName.length - b.vendorName.length,
      sortOrder: sortedInfo.columnKey === "vendorName" && sortedInfo.order,
    },
    {
      title: "Material Name",
      dataIndex: "itemName",
      key: "itemName",
      render: (text, record) => (
        <span>
          {record.itemsList.map(item => (
            <div key={item.itemchildId}>{item.itemName}</div>
          ))}
        </span>
      ),     
    },
    {
      title: "Inward Date",
      dataIndex: "documentDate",
      render(value) {
        return moment(value).format("Do MMM YYYY");
      },
      key: "documentDate",
      filters: [],
      sorter: (a, b) => a.documentDate - b.documentDate,
      sortOrder: sortedInfo.columnKey === "documentDate" && sortedInfo.order,
    },
    {
      title: "ConsignmentId",
      dataIndex: "consignmentId",
      key: "consignmentId",
      filters: [],
      sorter: (a, b) => a.consignmentId - b.consignmentId,
      sortOrder: sortedInfo.columnKey === "consignmentId" && sortedInfo.order,
    },
    {
      title: "Weight",
      dataIndex: "totalWeight",
      key: "totalWeight",
      filters: [],
      sorter: (a, b) => a.totalWeight - b.totalWeight,
      sortOrder: sortedInfo.columnKey === "totalWeight" && sortedInfo.order,
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record, index) => (
        <span>
          <span
              className="gx-link"
              onClick={() => props.history.push(`${record.inwardId}`)}
          >
            View
          </span>
          <Divider type="vertical"/>
          <span className="gx-link" onClick={(e) => onEdit(record, e)}>Edit</span>
          <Divider type="vertical"/>
          <span className="gx-link" onClick={(e) => onDelete(record, e)}>Delete</span>
      </span>
      ),
    },
  ];

  const onDelete = (record,key, e) => {
    props.deleteInwardDV({
        ids: record.inwardId,
        ipAddress: "1.1.1.1",
        requestId: "INWARD_DELETE",
        userId: ""
    })
  }

  const onEdit = (record,e)=>{
    debugger
    e.preventDefault();
    props.fetchInwardDVListId({
        id: record.inwardId,
        pageNo: pageNo,
        pageSize: "15",
        ipAddress: '',
        requestId: '',
        userId: ''
    });
    setTimeout(() => {
      props.history.push(`create/${record.inwardId}`);
    }, 2000);
}
  // useEffect(() => {
  //   if (props.inward.deleteSuccess) {
  //     message.success("Successfully deleted the coil", 2).then(() => {
  //       props.resetDeleteInward();
  //     });
  //   }
  // }, [props.inward.deleteSuccess]);
  // useEffect(() => {
  //   if (props.inward.deleteFail) {
  //     message.success("Unable to delete the coil", 2).then(() => {
  //       props.resetDeleteInward();
  //     });
  //   }
  // }, [props.inward.deleteFail]);

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    setFilteredInfo(filters);
  };

  const clearFilters = () => {
    setFilteredInfo(null);
  };

  const clearAll = () => {
    setSortedInfo(null);
    setFilteredInfo(null);
  };

  const exportSelectedData = () => {};

  const deleteSelectedCoils = () => {
    console.log("dfd");
  };

  useEffect(() => {
    const { loading, error, inwardDVList } = props.inwardDV;
    if (!loading && !error) {
      setFilteredInwardList(inwardDVList)

    }
}, [props.inwardDV]);

useEffect(() => {
    setTimeout(() => {
        props.fetchInwardDVList({
            searchText:"",
            pageNo: pageNo,
            pageSize:"15",
            ipAddress: "1.1.1.1",
            requestId: "INWARD_LIST_GET",
            userId: ""
        });
    }, 1000);
}, []);

useEffect(() => {
    if (totalItems) {
      setTotalPageItems(totalItems);
    }
  }, [totalItems]);

  useEffect(() => {
    if (searchValue) {
      if (searchValue.length >= 3) {
        setPageNo(1);
        props.fetchInwardDVList({
            searchText:searchValue,
            pageNo: pageNo,
            pageSize:"15",
            ipAddress: "1.1.1.1",
            requestId: "INWARD_LIST_GET",
            userId: ""
        });
      }
    } else {
      setPageNo(1);
      props.fetchInwardDVList({
        searchText:searchValue,
        pageNo: pageNo,
        pageSize:"15",
        ipAddress: "1.1.1.1",
        requestId: "INWARD_LIST_GET",
        userId: ""
    });
    }
  }, [searchValue]);

  return (
    <div>
      <h1>
        <IntlMessages id="sidebar.company.inwardList" />
      </h1>
      <Card>
        <div className="gx-flex-row gx-flex-1">
          <div className="table-operations gx-col">
            <Button onClick={clearFilters}>Clear All filters</Button> 
          </div>
          <div className="gx-flex-row gx-w-50">
          <Button
              type="primary"
              icon={() => <i className="icon icon-add" />}
              size="default"
              onClick={() => {
                props.resetInwardForm();
                props.history.push("/company/inwardDV/create");
              }}
            >
              Add Inward
            </Button>
              <SearchBox
              styleName="gx-flex-1"
              placeholder="Search for vendor name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />  
          </div>
        </div>
        <Table
          rowSelection={[]}
          className="gx-table-responsive"
          columns={columns}
          dataSource={filteredInwardList.content}
          onChange={handleChange}
          pagination={{
            pageSize: 15,
            onChange: (page) => {
              setPageNo(page);
              props.fetchInwardDVList({
                searchText:searchValue,
                pageNo: page,
                pageSize:"15",
                ipAddress: "1.1.1.1",
                requestId: "INWARD_LIST_GET",
                userId: ""
            });
            },
            current: pageNo,
            total: totalPageItems,
          }}
        />
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => ({
  inwardDV: state.inwardDV,
});

export default connect(mapStateToProps, {
  fetchInwardListOldAPI,
  resetInwardForm,
  deleteInwardEntryById,
  fetchPartyListById,
  resetDeleteInward,
  deleteInwardDV,
  fetchInwardDVList,
  fetchInwardDVListId,
  updateInwardDV
})(List);
