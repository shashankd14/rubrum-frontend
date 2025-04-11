//src-routes-company-Partywise-List.js
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Card, Divider, Select, Table, Modal, message } from "antd";
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import {
  fetchInwardList,
  getCoilsByPartyId,
  getS3PDFUrl,
} from "../../../appRedux/actions/Inward";
import {
  fetchPartyList,
  setInwardSelectedForDelivery,
} from "../../../appRedux/actions";
import {sidebarMenuItems} from "../../../constants";

const Option = Select.Option;

const partyWiseMenuConstants = {
  'plan': "Plan",
  'retrieve': 'Retrieve',
  'view': 'View',
  'export': 'Export',
  'cancelFinish': 'Cancel Finish',
  'editFinish': 'Edit Finish',
  'addInward': 'Add Inward',
  'deliver': 'Deliver',
}
const List = (props) => {
  const [sortedInfo, setSortedInfo] = useState({
    // order: "descend",
    // columnKey: "age",
    order: "ASC",
    columnKey: "fThickness",
  });
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [customerValue, setCustomerValue] = useState("");
  const { inwardList, totalItems } = props.inward;
  let filter = inwardList.map((item) => {
    if (item.instruction.length > 0) {
      item.children = item.instruction.filter((ins) => ins.groupId === null);
    }
    return item;
  });
  const [filteredInwardList, setFilteredInwardList] = useState(filter);
  const [expandedRow, setExpandedRecord] = useState([]);
  const [menuPartyWiseLabelList, setMenuPartyWiseLabelList] = useState([]);
  const [partywisepermission, setPartywisePermission] = useState([]);

  const [selectedCBKeys, setSelectedCBKeys] = React.useState([]);
  const [selectedRowData, setSelectedRowData] = React.useState([]);

  const [pageNo, setPageNo] = React.useState(1);
  const [totalPageItems, setTotalItems] = React.useState(0);
  const [showRetrieve, setShowRetrieve] = React.useState(false);
  const [selectedCoil, setSelectedCoil] = React.useState([]);
  const [pageSize, setPageSize] = useState(15);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  
  const columns = [
    {
      title: "Inward Id",
      dataIndex: "coilNumber",
      key: "coilNumber",
      filters: [],
      sorter: (a, b) => a.coilNumber?.length - b.coilNumber?.length,
      sortOrder: sortedInfo.columnKey === "coilNumber" && sortedInfo.order,
    },
    {
      title: "SC inward id",
      dataIndex: "customerBatchId",
      key: "customerBatchId",
      filteredValue: filteredInfo ? filteredInfo["customerBatchId"] : null,
      onFilter: (value, record) => record.customerBatchId == value,
      filters: [],
      sorter: (a, b) => a.customerBatchId?.length - b.customerBatchId?.length,
      sortOrder: sortedInfo.columnKey === "customerBatchId" && sortedInfo.order,
      render: (text, record) => {
        return record.customerBatchId == 'undefined' || record.batch == 'undefined' ? "-" : record.customerBatchId || record.batch;
      }
      // render: (text, record) => {
      //   if (record.customerBatchId) return record.customerBatchId;
      //   else {
      //     let batchId = "";
      //     expandedRow.forEach((row) => {
      //       if (row.child.includes(record.instructionId)) {
      //         batchId = row.batch;
      //       }
      //     });
      //     return batchId;
      //   }
      // },
    },
    {
      title: "Material",
      dataIndex: "material.description",
      key: "material.description",
    },
    {
      title: "Thickness",
      dataIndex: "fThickness",
      key: "fThickness",
      filters: [],
      sorter: (a, b) => a.fThickness - b.fThickness,
      sortOrder: sortedInfo.columnKey === "fThickness" && sortedInfo.order,
      // render: (text, record) => {
      //   if (record.fThickness) return record.fThickness;
      //   else {
      //     let thickness = "";
      //     expandedRow.forEach((row) => {
      //       if (row.child.includes(record.instructionId)) {
      //         thickness = row.fThickness;
      //       }
      //     });
      //     return thickness;
      //   }
      // },
    },
    {
      title: "Width",
      dataIndex: "fWidth",
      key: "fWidth",
      filters: [],
      sorter: (a, b) => a.fWidth - b.fWidth,
      sortOrder: sortedInfo.columnKey === "fWidth" && sortedInfo.order,
      render: (text, record) => {
        return record.fWidth || record.actualWidth || record.plannedWidth;
      },
    },
    {
      title: "Length",
      dataIndex: "fLength",
      key: "fLength",
      filters: [],
      sorter: (a, b) => a.fLength - b.fLength,
      sortOrder: sortedInfo.columnKey === "fLength" && sortedInfo.order,
      render: (text, record) => {
        return record.fLength || record.actualLength || record.plannedLength;
      },
    },
    {
      title: "No.of Pcs",
      dataIndex: "actualNoOfPieces",
      key: "actualNoOfPieces",
      filters: [],
      sorter: (a, b) => a.actualNoOfPieces - b.actualNoOfPieces,
      sortOrder: sortedInfo.columnKey === "actualNoOfPieces" && sortedInfo.order,
      render: (text, record) => {
        if (record.status && record.status.statusName === "DISPATCHED") {
          return 0;
        }
        return text;
      },
    },
    {
      title: "Present Weight",
      dataIndex: "inStockWeight",
      key: "inStockWeight",
      filters: [],
      sorter: (a, b) => a.inStockWeight - b.inStockWeight,
      sortOrder: sortedInfo.columnKey === "inStockWeight" && sortedInfo.order,
      render: (text, record) => {
        return (
          record.inStockWeight || record.actualWeight || record.plannedWeight
        );
      },
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
      title: "Classification",
      dataIndex: "packetClassification.classificationName",
      key: "packetClassification.classificationName",
    },
    partywisepermission  === 'ENDUSER_TAG_WISE_PACKETS' ? {} : {
      title: "End User Tags",
      dataIndex: "endUserTagsentity.tagName",
      key: "endUserTagsentity.tagName",
    },
    partywisepermission  === 'ENDUSER_TAG_WISE_PACKETS' ? {} : {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record) => (
        <span>
          {record.instructionId ? (
            <span className="gx-link"></span>
          ) : (
            <span>
              {menuPartyWiseLabelList.length > 0 && menuPartyWiseLabelList.includes(partyWiseMenuConstants.plan) && <><span
                className="gx-link"
                onClick={() => props.history.push(`plan/${record.coilNumber}`)}
              >
                Plan
              </span>
              <Divider type="vertical" /></>}
              {menuPartyWiseLabelList.length > 0 && menuPartyWiseLabelList.includes(partyWiseMenuConstants.retrieve) && <><span
                className="gx-link"
                onClick={() => {
                  props.getS3PDFUrl(record.inwardEntryId);
                  setShowRetrieve(true);
                }}
              >
                Retrieve
              </span>
              <Divider type="vertical" /></>}
              {menuPartyWiseLabelList.length > 0 && menuPartyWiseLabelList.includes(partyWiseMenuConstants.cancelFinish) && <><span
                className="gx-link"
                onClick={() =>
                  props.history.push(`unfinish/${record.coilNumber}`)
                }
              >
                Cancel finish
              </span>
              <Divider type="vertical" /></>}
              {menuPartyWiseLabelList.length > 0 && menuPartyWiseLabelList.includes(partyWiseMenuConstants.editFinish) && <span
                className="gx-link"
                onClick={() =>
                  props.history.push(`editFinish/${record.coilNumber}`)
                }
              >
                Edit finish
              </span>}
            </span>
          )}
        </span>
      ),
    },
  ];
  //filter data which is dispatched
  // const filteredInwardListWithoutDispatched = filteredInwardList.filter(item => !(item.status && item.status.statusId === 4 && item.status.statusName === "DISPATCHED"));

  useEffect(() => {
    props.fetchPartyList();
  }, []);


  useEffect(() => {
    const menus = localStorage.getItem('Menus') ? JSON.parse(localStorage.getItem('Menus')) : [];
    if(menus.length > 0) {
      const menuLabels = menus.filter(menu => menu.menuKey === sidebarMenuItems.partywiseRegister);
      let menuPartyWiseLabels = [];
      if(menuLabels.length > 0) {
        menuPartyWiseLabels = menuLabels[0]?.permission ? menuLabels[0]?.permission?.split(',') : [];
        if(menuLabels.length === 1)
          setPartywisePermission(menuLabels[0].permission);
      }
      setMenuPartyWiseLabelList(menuPartyWiseLabels);
    }
  }, [])

  useEffect(() => {
    if (totalItems) {
      setTotalItems(totalItems);
    }
  }, [totalItems]);

  const getFilterData = (list) => {
    let filter = list.map((item) => {
      if (item.instruction.length > 0) {
        item.children = item.instruction.filter((ins) => ins.groupId === null);
      }
      return item;
    });
    return filter;
  };
  useEffect(() => {
    if (!props.inward.loading && props.inward.success) {
      // setFilteredInwardList(getFilterData(inwardList));
      // console.log(inwardList)
      if(inwardList.length !==0){
        inwardList[0].children = inwardList[0].instruction
      }
        setFilteredInwardList(inwardList);
    }
  }, [props.inward.loading, props.inward.success]);

  useEffect(() => {
    if (searchValue) {
      if (searchValue.length >= 3) {
        setPageNo(1);
        props.fetchInwardList(1, 20, searchValue, customerValue);
      }
    } else {
      setPageNo(1);
      props.fetchInwardList(1, 20, searchValue, customerValue);
    }
  }, [searchValue]);

  const handleChange = (pagination, filters, sorter, partyId) => {
    setSortedInfo(sorter);
    setFilteredInfo(filters);
    setSortColumn(sorter.columnKey);
    setSortOrder(sorter.order==='descend'?'DESC':'ASC');
  };
  useEffect(() => {
    if (sortColumn && sortOrder) {
        setPageNo(1);
        props.fetchInwardList(1, 20, searchValue, customerValue,  sortOrder, sortColumn);
    }
  }, [sortColumn, sortOrder]);


  const clearFilters = (value) => {
    setCustomerValue("");
    setFilteredInfo(null);
    setSearchValue("");
    setPageNo(1);
    props.fetchInwardList(1, 15);
  };

  const clearAll = () => {
    setSortedInfo(null);
    setFilteredInfo(null);
  };

  const exportSelectedData = () => {};

  const handleCustomerChange = (value) => {
    if (value) {
      setCustomerValue(value);
      setPageNo(1);
      props.fetchInwardList(1, pageSize, searchValue, value, '', '', partywisepermission  === 'ENDUSER_TAG_WISE_PACKETS' ? 'ENDUSER' : '');
    } else {
      setCustomerValue("");
      setFilteredInwardList(inwardList);
    }
  };

  const handleBlur = () => {};

  function handleFocus() {}

  const storeKey = (data, selected) => {
    if (selectedCBKeys.includes(data.key) && !selected) {
      const newSet = selectedCBKeys;
      const index = selectedCBKeys.indexOf(data.key);
      newSet.splice(index, 1);
      setSelectedCBKeys(newSet);
      setSelectedRowData((oldData) =>
        oldData.filter((row) => row.key !== data.key)
      );
      return;
    } else if (selected && !selectedCBKeys.includes(data.key)) {
      setSelectedCBKeys((oldArr) => [...oldArr, data.key]);
      setSelectedRowData((oldData) => [...oldData, data]);
    }
  };

  const getKey = (data, selected) => {
    if (
      data.status.statusName === "READY TO DELIVER" ||
      data.status.statusName === "RECEIVED"
    ) {
      storeKey(data, selected);
      if (data.children) {
        data.children.map((item) => getKey(item, selected));
      }
    }
  };

  const rowSelection = {
    onSelect: (record, selected, selectedRows) => {
      if (
        record.status.statusName === "READY TO DELIVER" ||
        record.status.statusName === "RECEIVED"
      ) {
        if (record.key.includes("-") && !selected) {
          const eKeys = record.key.split("-");
          let removeKeys = [record.key];
          eKeys.forEach((key) => {
            selectedRows.forEach((row) => {
              if (`${row.coilNumber}` === key) {
                removeKeys.push(row.key);
              }
            });
          });
          removeKeys.forEach((key) => {
            storeKey({ key }, selected);
          });
        } else getKey(record, selected);
      }
      const selectedCoil = selectedRows.map(row => row?.party?.nPartyId) || []
      setSelectedCoil(Array.from(new Set(selectedCoil)))
    },
    getCheckboxProps: (record) => ({
      disabled:
        record.status.statusName !== "READY TO DELIVER" &&
        record.status.statusName !== "RECEIVED",
    }),
    onSelectAll: (selected, selectedRows, changeRows) => {
      if (changeRows.length === selectedCBKeys.length) {
        setSelectedCBKeys([]);
        setSelectedRowData([]);
      } else {
        changeRows.map((item) => {
          if (
            item.status.statusName === "READY TO DELIVER" ||
            item.status.statusName === "RECEIVED"
          ) {
            getKey(item);
          }
        });
      }
      console.log(selectedRows);
      const selectedCoil = selectedRows.map(row => row?.party?.nPartyId) || []
      setSelectedCoil(Array.from(new Set(selectedCoil)))
    },
    selectedRowKeys: selectedCBKeys,
  };

  const gets3PDFurl = () => {
    return (
      <>
        <div>
          <a href={props?.inward.s3pdfurl?.inward_pdf} target="_blank">
            Inward PDF
          </a> &nbsp;&nbsp;&nbsp;
          {/* <a href={props?.inward.s3pdfurl?.qrcode_inward_pdf} target="_blank">
            Inward QR Code
          </a> */}
        </div>
        {props.inward.s3pdfurl?.plan_pdfs?.length > 0 && (
          <div>
            <p>Plan PDF</p>
            {props.inward.s3pdfurl?.plan_pdfs?.map((item) => (
              <>
                <a href={item?.pdfS3Url} target="_blank">
                  {item.id}
                </a>
                <br />
              </>
            ))}
          </div>
        )}
        {props.inward.s3pdfurl?.dc_pdfs?.length > 0 && (
          <div>
            <p>DC PDF</p>
            {props.inward.s3pdfurl?.dc_pdfs?.map((item) => (
              <a href={item?.pdfS3Url} target="_blank">
                {item.id}
              </a>
            ))}
          </div>
        )}
      </>
    );
  };
  return (
    <div>
      <h1>
        <IntlMessages id="sidebar.company.partywiseRegister" />
      </h1>
      <Card>
        <div className="gx-flex-row gx-flex-1">
          <div className="table-operations gx-col">
            <Select
              id="select"
              showSearch
              style={{ width: 200 }}
              placeholder="Select a location"
              optionFilterProp="children"
              onChange={handleCustomerChange}
              value={customerValue}
              onFocus={handleFocus}
              onBlur={handleBlur}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {props.party.partyList.length > 0 &&
                props.party.partyList.map((party) => (
                  <Option key={party.nPartyId} value={party.nPartyId}>{party.partyName}</Option>
                ))}
            </Select>&emsp;
            {menuPartyWiseLabelList.length > 0 && menuPartyWiseLabelList.includes(partyWiseMenuConstants.export) && <Button onClick={exportSelectedData} style={{marginBottom: "1px"}}>Export</Button>}
            <Button onClick={clearFilters} style={{marginBottom: "1px"}}>Clear All filters</Button>
          </div>
          <div className="gx-flex-row gx-w-50">
            {menuPartyWiseLabelList.length > 0 && menuPartyWiseLabelList.includes(partyWiseMenuConstants.deliver) && <Button
              type="primary"
              icon={() => <i className="icon icon-add" />}
              size="default"
              onClick={() => {
                console.log("selected rows", selectedRowData, selectedCBKeys, selectedCoil);
                if (selectedCoil?.length > 1) {
                  message.error('Please select inwards of same location');
                } else {
                  const newList = selectedRowData.filter((item) => {
                    if (item?.instruction?.length) {
                      return !item.childInstructions && item.inwardEntryId && selectedRowData.length === 1;
                    } else {
                      return true;
                    }
                  });
                  props.setInwardSelectedForDelivery(newList);
                  props.history.push("/company/locationwise-register/delivery");
                }
              }}
              disabled={!!selectedCBKeys?.length < 1}
            >
              Deliver
            </Button>}
            {menuPartyWiseLabelList.length > 0 && menuPartyWiseLabelList.includes(partyWiseMenuConstants.addInward) && <Button
              type="primary"
              icon={() => <i className="icon icon-add" />}
              size="default"
              onClick={() => {
                props.history.push("/company/inward/create");
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
        {showRetrieve && (
          <Modal
            title="Retrieve Plan PDF"
            visible={showRetrieve}
            width={600}
            onOk={() => setShowRetrieve(false)}
            onCancel={() => setShowRetrieve(false)}
          >
            <p>Please click on the Instructions to generate the PDF</p>
            {gets3PDFurl()}
          </Modal>
        )}
        <Table
          scroll={{ y: 540 }}
          className="gx-table-responsive"
          columns={columns}
          dataSource={filteredInwardList}
          // dataSource={filteredInwardListWithoutDispatched}
          onChange={handleChange}
          rowSelection={partywisepermission  === 'ENDUSER_TAG_WISE_PACKETS' ? false : rowSelection}
          // onExpand={(expanded, record, data) => {
          //   const motherRecord = {
          //     key: record.key,
          //     child: record.instruction
          //       ? record.instruction?.map((r) => r.instructionId)
          //       : record.childInstructions?.map((r) => r.instructionId),
          //     batch: record.customerBatchId,
          //     fThickness: record.fThickness,
          //   };
          //   const result = expanded
          //     ? expandedRow
          //     : expandedRow.filter((row) => row.key !== record.key);
          //   setExpandedRecord([...result, motherRecord]);
          // }}
          
          pagination={{
            pageSize: 15,
            onChange: (page) => {
              setPageNo(page);
              props.fetchInwardList(page, pageSize, searchValue, customerValue, sortOrder, sortColumn, partywisepermission  === 'ENDUSER_TAG_WISE_PACKETS' ? 'ENDUSER' : '');
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
  party: state.party,
});

export default connect(mapStateToProps, {
  fetchPartyList,
  fetchInwardList,
  getCoilsByPartyId,
  setInwardSelectedForDelivery,
  getS3PDFUrl,
})(List);
