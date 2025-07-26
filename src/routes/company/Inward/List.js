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
import { onDeleteContact } from "../../../appRedux/actions";
import {sidebarMenuItems} from "../../../constants";

const inwardMenuConstants = {
  'view': "View",
  'addInward': 'Add Inward',
  'export': 'Export',
}

const List = (props) => {
  const [sortedInfo, setSortedInfo] = useState({
    order: "descend",
    columnKey: "age",
  });
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filteredInwardList, setFilteredInwardList] = useState(
    props.inward.inwardList
  );

  const [pageNo, setPageNo] = React.useState(1);
  const [totalPageItems, setTotalItems] = React.useState(0);
  const [menuInwardLabelList, setMenuInwardLabelList] = useState([]);

  const { totalItems } = props.inward;

  const columns = [
    {
      title: "Inward id",
      dataIndex: "coilNumber",
      key: "coilNumber",
      filters: [],
      sorter: (a, b) => a.coilNumber.length - b.coilNumber.length,
      sortOrder: sortedInfo.columnKey === "coilNumber" && sortedInfo.order,
    },
    {
      title: "SC Inward id",
      dataIndex: "customerBatchId",
      key: "customerBatchId",
      filters: [],
      sorter: (a, b) => a.customerBatchId.length - b.customerBatchId.length,
      sortOrder: sortedInfo.columnKey === "customerBatchId" && sortedInfo.order,
      render: (text, record) => {
        return record.customerBatchId == "undefined" ||
          record.batch == "undefined"
          ? "-"
          : record.customerBatchId || record.batch;
      },
    },
    {
      title: "Location",
      dataIndex: "party.partyName",
      key: "party.partyName",
      sorter: (a, b) => a.party.partyName.length - b.party.partyName.length,
      sortOrder: sortedInfo.columnKey === "party.partyName" && sortedInfo.order,
    },
    {
      title: "Inward Date",
      dataIndex: "dReceivedDate",
      render(value) {
        return moment(value).format("Do MMM YYYY");
      },
      key: "dReceivedDate",
      filters: [],
      sorter: (a, b) => a.dReceivedDate - b.dReceivedDate,
      sortOrder: sortedInfo.columnKey === "dReceivedDate" && sortedInfo.order,
    },
    {
      title: "Material",
      dataIndex: "material.mmDescConcatenated",
      key: "material.mmDescConcatenated",
    },
    {
      title: "Status",
      dataIndex: "status.statusName",
      key: "status.statusName",
      filters: [],
      sorter: (a, b) => a.status.statusName.length - b.status.statusName.length,
      sortOrder:
        sortedInfo.columnKey === "status.statusName" && sortedInfo.order,
    },
    {
      title: "Thickness",
      dataIndex: "fThickness",
      key: "fThickness",
      filters: [],
      sorter: (a, b) => a.fThickness - b.fThickness,
      sortOrder: sortedInfo.columnKey === "fThickness" && sortedInfo.order,
    },
    {
      title: "Weight",
      dataIndex: "fQuantity",
      key: "fQuantity",
      filters: [],
      sorter: (a, b) => a.fQuantity - b.fQuantity,
      sortOrder: sortedInfo.columnKey === "fQuantity" && sortedInfo.order,
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record, index) => (
        <span>
          {menuInwardLabelList.length > 0 &&
            menuInwardLabelList.includes(inwardMenuConstants.view) && (
              <>
                <span
                  className="gx-link"
                  onClick={() => props.history.push(`${record.coilNumber}`)}
                >
                  View
                </span>
              </>
            )}
        </span>
      ),
    },
  ];

  const onDelete = (record, key, e) => {
    let id = [];
    id.push(record.inwardEntryId);
    e.preventDefault();
    props.deleteInwardEntryById(id);
    console.log(record, key);
  };

  const onEdit = (record, key, e) => {
    props.fetchPartyListById(record.inwardEntryId);
    setTimeout(() => {
      props.history.push(`create/${record.inwardEntryId}`);
    }, 2000);
  };
  
  useEffect(() => {
    if (props.inward.deleteSuccess) {
      message.success("Successfully deleted the coil", 2).then(() => {
        props.resetDeleteInward();
      });
    }
  }, [props.inward.deleteSuccess]);
  
  useEffect(() => {
    if (props.inward.deleteFail) {
      message.success("Unable to delete the coil", 2).then(() => {
        props.resetDeleteInward();
      });
    }
  }, [props.inward.deleteFail]);

  useEffect(() => {
    if (totalItems) {
      setTotalItems(totalItems);
    }
  }, [totalItems]);

  useEffect(() => {
    if (searchValue) {
      if (searchValue.length >= 3) {
        setPageNo(1);
        props.fetchInwardListOldAPI(1, 15, searchValue);
      }
    } else {
      setPageNo(1);
      props.fetchInwardListOldAPI(1, 15, searchValue);
    }
  }, [searchValue]);

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    setFilteredInfo(filters);
  };

  const clearFilters = () => {
    setFilteredInfo(null);
  };
  
  const exportSelectedData = () => {};

  const deleteSelectedCoils = () => {
    console.log("dfd");
  };

  useEffect(() => {
    if (!props.inward.loading && props.inward.success) {
      setFilteredInwardList(props.inward.inwardList);
    }
  }, [props.inward.loading, props.inward.success]);

  useEffect(() => {
    const menus = localStorage.getItem('Menus') ? JSON.parse(localStorage.getItem('Menus')) : [];
    if(menus.length > 0) {
      const menuLabels = menus.filter(menu => menu.menuKey === sidebarMenuItems.inward);
      let menuInwardLabels = [];
      if(menuLabels.length > 0) {
        menuInwardLabels = menuLabels[0]?.permission ? menuLabels[0]?.permission?.split(',') : [];
      }
      setMenuInwardLabelList(menuInwardLabels);
    }
  }, [])

  return (
    <div>
      <h1>
        <IntlMessages id="sidebar.company.inwardList" />
      </h1>
      <Card>
        <div className="gx-flex-row gx-flex-1">
          <div className="table-operations gx-col">
            {menuInwardLabelList.length > 0 && menuInwardLabelList.includes(inwardMenuConstants.delete) &&
                <Button onClick={deleteSelectedCoils}>Delete</Button>}
            {menuInwardLabelList.length > 0 && menuInwardLabelList.includes(inwardMenuConstants.export) && <Button onClick={exportSelectedData}>Export</Button>}
            <Button onClick={clearFilters}>Clear All filters</Button>
          </div>
          <div className="gx-flex-row gx-w-50">
            {menuInwardLabelList.length > 0 && menuInwardLabelList.includes(inwardMenuConstants.addInward) && <Button
              type="primary"
              icon={() => <i className="icon icon-add" />}
              size="default"
              onClick={() => {
                props.resetInwardForm();
                window.location.href = window.location.origin+'#/company/inward/create';
              }}
            >
              Add Inward
            </Button>}
            <SearchBox
              styleName="gx-flex-1"
              placeholder="Search for inward id or location..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
        <Table
          rowSelection={[]}
          className="gx-table-responsive"
          columns={columns}
          dataSource={filteredInwardList}
          onChange={handleChange}
          pagination={{
            pageSize: 15,
            onChange: (page) => {
              setPageNo(page);
              props.fetchInwardListOldAPI(page, 15, searchValue);
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
  inward: state.inward,
});

export default connect(mapStateToProps, {
  fetchInwardListOldAPI,
  resetInwardForm,
  deleteInwardEntryById,
  fetchPartyListById,
  resetDeleteInward,
})(List);
