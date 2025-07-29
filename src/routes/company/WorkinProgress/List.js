import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Card, Table} from "antd";
import moment from 'moment';
import SearchBox from "../../../components/SearchBox";
import IntlMessages from "../../../util/IntlMessages";
import {
    fetchWIPInwardList
} from "../../../appRedux/actions/Inward";
import {sidebarMenuItems} from "../../../constants";

const workInProgressMenuConstants = {
    'finish': "Finish",
}

function List(props) {

    const [sortedInfo, setSortedInfo] = useState({
        order: 'descend',
        columnKey: 'age',
    });
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [filteredInwardList, setFilteredInwardList] = useState(props.inward?.wipList);

    const [pageNo, setPageNo] = React.useState(1);
    const [totalPageItems, setTotalItems] = React.useState(0);

    const [menuWorkInProgressLabelList, setMenuWorkInProgressLabelList] = useState([]);

    const {totalItems} = props.inward;

    const getFilterData = (list) => {
        let filter = list.map(item => {
            if (item.instruction?.length > 0) {
                item.children = item.instruction.filter(filteredInfo => filteredInfo.status.statusName === 'IN PROGRESS');
            }
            return item
        })
        return filter;
    }
    const columns = [
      {
        title: "Batch no.",
        dataIndex: "coilNumber",
        key: "coilNumber",
        filters: [],
        sorter: (a, b) => a.coilNumber?.length - b.coilNumber?.length,
        sortOrder: sortedInfo.columnKey === "coilNumber" && sortedInfo.order,
      },
      {
        title: "Location",
        dataIndex: "party.partyName",
        key: "party.partyName",
        filteredValue: filteredInfo ? filteredInfo["party.partyName"] : null,
        onFilter: (value, record) => record.party.partyName == value,
        filters:
          props.inward?.wipList?.length > 0
            ? [
                ...new Set(
                  props.inward?.wipList?.map((item) => item.party.partyName)
                ),
              ].map((partyName) => ({
                text: partyName,
                value: partyName,
              }))
            : [],
        sorter: (a, b) => a.party.partyName?.length - b.party.partyName?.length,
        sortOrder:
          sortedInfo.columnKey === "party.partyName" && sortedInfo.order,
      },
      {
        title: "Material",
        dataIndex: "material.description",
        key: "material.description",
      },
      {
        title: "Status",
        dataIndex: "status.statusName",
        key: "status.statusName",
        filters: [],
        sorter: (a, b) =>
          a.status.statusName?.length - b.status.statusName?.length,
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
        title: "Classification",
        dataIndex: "packetClassification.classificationName",
        key: "packetClassification.classificationName",
      },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        render: (text, record) => (
          <span>
            {record.instructionId ? (
              <span className="gx-link"></span>
            ) : (
              menuWorkInProgressLabelList.length > 0 &&
              menuWorkInProgressLabelList.includes(
                workInProgressMenuConstants.finish
              ) && (
                <span
                  className="gx-link"
                  onClick={() =>
                    props.history.push(`plan/${record.coilNumber}`)
                  }
                >
                  Finish
                </span>
              )
            )}
          </span>
        ),
      },
    ];

    useEffect(() => {
        const menus = localStorage.getItem('Menus') ? JSON.parse(localStorage.getItem('Menus')) : [];
        if(menus.length > 0) {
            const menuLabels = menus.filter(menu => menu.menuKey === sidebarMenuItems.workInProgress);
            let menuWorkInProgressLabels = [];
            if(menuLabels.length > 0) {
                menuWorkInProgressLabels = menuLabels[0]?.permission ? menuLabels[0]?.permission?.split(',') : [];
            }
            setMenuWorkInProgressLabelList(menuWorkInProgressLabels);
        }
    }, [])

    useEffect(() => {
        props.fetchWIPInwardList();
    }, []);

    useEffect(() => {
        if (props.inward.wipSuccess) {
            setFilteredInwardList(props.inward?.wipList);
        }
    }, [props.inward.wipSuccess])

    useEffect(() => {
        if (totalItems) {
            setTotalItems(totalItems);
        }
    }, [totalItems]);

    useEffect(() => {
        if (searchValue) {
            if (searchValue?.length >= 3) {
                setPageNo(1);
                props.fetchWIPInwardList(1, 15, searchValue)
            }
        } else {
            setPageNo(1);
            props.fetchWIPInwardList(1, 15, searchValue)
        }
    }, [searchValue])

    const handleChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
        setFilteredInfo(filters)
    };
    const handleRow = (record) => {
        console.log(record);
    };

    return (
      <div>
        <h1>
          <IntlMessages id="sidebar.company.workinprogress" />
        </h1>
        <Card>
          <div
            style={{ width: "50%", "margin-bottom": "10px" }}
            className="gx-flex-row gx-flex-1 wip-search"
          >
            <SearchBox
              styleName="gx-flex-1"
              placeholder="Search for Batch no. or location..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <Table
            rowSelection={[]}
            className="gx-table-responsive"
            columns={columns}
            dataSource={filteredInwardList}
            onChange={handleChange}
            onRow={(record, index) => {
              return {
                onClick: (record) => {
                  handleRow(record);
                },
              };
            }}
            pagination={{
              pageSize: 15,
              onChange: (page) => {
                setPageNo(page);
                props.fetchWIPInwardList(page, 15, searchValue);
              },
              current: pageNo,
              total: totalPageItems,
            }}
          />
        </Card>
      </div>
    );
}

const mapStateToProps = state => ({
    inward: state.inward,
});


export default connect(mapStateToProps, {
    fetchWIPInwardList
})(List);