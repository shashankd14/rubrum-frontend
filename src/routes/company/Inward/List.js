import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { Button, Card, Divider, Table, message } from "antd";
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
import {sidebarMenuItems} from "../../../constants";
import useDebounce from "../../../components/useDebounce";

const inwardMenuConstants = {
  'view': "View",
  'addInward': 'Add Inward',
  'export': 'Export',
  'edit': 'Edit',
  'delete': 'Delete',
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
  const [pageSize, setPageSize] = useState(15);
  const [totalPageItems, setTotalItems] = React.useState(0);
  const [menuInwardLabelList, setMenuInwardLabelList] = useState([]);

  const { totalItems } = props.inward;
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const lastSearchRef = useRef("");
  
  const columns = [
    {
      title: "Coil Number",
      dataIndex: "coilNumber",
      key: "coilNumber",
      filters: [],
      sorter: true,
      sortOrder: sortedInfo.columnKey === "coilNumber" && sortedInfo.order,
    },
    {
      title: "Party Name",
      dataIndex: "party.partyName",
      key: "party.partyName",
      filteredValue: filteredInfo ? filteredInfo["party.partyName"] : null,
      onFilter: (value, record) => record.party.partyName == value,
      filters:
        props.inward.inwardList.length > 0
          ? [
              ...new Set(
                props.inward.inwardList.map((item) => item.party.partyName)
              ),
            ].map((partyName) => ({ text: partyName, value: partyName }))
          : [],
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
      sorter: true,
      sortOrder: sortedInfo.columnKey === "dReceivedDate" && sortedInfo.order,
    },
    {
      title: "Material",
      dataIndex: "material.description",
      key: "material.description",
      filteredValue: filteredInfo ? filteredInfo["material.description"] : null,
      onFilter: (value, record) => record.material.description == value,
      filters:
        props.inward.inwardList.length > 0
          ? [
              ...new Set(
                props.inward.inwardList.map((item) => item.material.description)
              ),
            ].map((material) => ({ text: material, value: material }))
          : [],
      sorter: (a, b) =>
        a.material.description.length - b.material.description.length,
      sortOrder:
        sortedInfo.columnKey === "material.description" && sortedInfo.order,
    },
    {
      title: "Status",
      dataIndex: "status.statusName",
      key: "status.statusName",
      filters: [],
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === "status.statusName" && sortedInfo.order,
    },
    {
      title: "Thickness",
      dataIndex: "fThickness",
      key: "fThickness",
      filters: [],
      sorter: true,
      sortOrder: sortedInfo.columnKey === "fThickness" && sortedInfo.order,
    },
    {
      title: "Weight",
      dataIndex: "fQuantity",
      key: "fQuantity",
      filters: [],
      sorter: true,
      sortOrder: sortedInfo.columnKey === "fQuantity" && sortedInfo.order,
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record, index) => (
        <span>
          {menuInwardLabelList.length > 0 && menuInwardLabelList.includes(inwardMenuConstants.view) && <><span
              className="gx-link"
              onClick={() => props.history.push(`${record.coilNumber}`)}
          >
            View
          </span>
            <Divider type="vertical" />
          </>}
          {menuInwardLabelList.length > 0 && menuInwardLabelList.includes(inwardMenuConstants.edit) && <><span className="gx-link" onClick={(e) => onEdit(record, index, e)}>
            Edit
          </span>
          <Divider type="vertical" /></>}
          {menuInwardLabelList.length > 0 && menuInwardLabelList.includes(inwardMenuConstants.delete) && <span className="gx-link" onClick={(e) => onDelete(record, index, e)}>
            Delete
          </span>
          }
        </span>
      ),
    },
  ];
  
  const onDelete = (record, key, e) => {
    let id = [];
    id.push(record.inwardEntryId);
    e.preventDefault();
    props.deleteInwardEntryById(id);
  };

  const onEdit = (record, key, e) => {
    props.resetInwardForm();
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
    if (debouncedSearchValue) {
      if (debouncedSearchValue.length >= 3) {
        setPageNo(1);
        props.fetchInwardListOldAPI(1, 15, debouncedSearchValue);
      }
    } else {
      setPageNo(1);
      props.fetchInwardListOldAPI(1, 15, debouncedSearchValue);
    }
  }, [debouncedSearchValue]);

  const handleChange = (pagination, filters, sorter) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize);
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
    props.fetchInwardListOldAPI(pageNo, 15, debouncedSearchValue)
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
                props.history.push("/company/inward/create");
              }}
            >
              Add Inward
            </Button>}
            <SearchBox
              styleName="gx-flex-1"
              placeholder="Search for coil number or party name..."
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
