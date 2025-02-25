import React, { useEffect, useState } from 'react';
import IntlMessages from "../../../util/IntlMessages";
import { fetchPacketList, fetchSalesOrderList, saveSalesOrderForPacket } from '../../../appRedux/actions';
import { useDispatch, useSelector } from "react-redux";
import {Input, Table, Tabs, Icon, message, Button} from 'antd';

const { TabPane } = Tabs;

const SalesOrder = () => {
  const dispatch = useDispatch();
  const salesOrder = useSelector((state) => state.salesOrder);
  const [packetsList, setPacketsList] = useState(salesOrder.packets);
  const [salesOrderList, setSalesOrderList] = useState(salesOrder.list);
  const [pageNo, setPageNo] = React.useState(1);
  const [salesPageNo, setSalesPageNo] = React.useState(1);
  const onInputChange =
    (index) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newData = [...salesOrder.packets];
      newData[index].soNumber = e.target.value;
      setPacketsList(newData);
    };

  const columns = [
    {
      title: "Inward Id",
      dataIndex: "inwardEntryId",
      key: "inwardEntryId",
    },
    {
      title: "Coil no",
      dataIndex: "coilNo",
      key: "coilNo",
    },
    {
      title: "Customer Batch No.",
      dataIndex: "customerBatchNo",
      key: "customerBatchNo",
    },
    // {
    //   title: "Party Name",
    //   dataIndex: "partyName",
    //   key: "partyName",
    // },
    {
      title: "Material",
      dataIndex: "materialDesc",
      key: "materialDesc",
    },
    {
      title: "Material grade",
      dataIndex: "materialGrade",
      key: "materialGrade",
    },
    {
      title: "Thickness",
      dataIndex: "fthickness",
      key: "fthickness",
    },
    {
      title: "Width",
      dataIndex: "fwidth",
      key: "fwidth",
    },
    {
      title: "Length",
      dataIndex: "flenghth",
      key: "flenghth",
    },
    {
      title: "Sales Order Number",
      dataIndex: "deliveryDetails.customerInvoiceNo",
      render: (text, record, index) => (
        <div style={{'display':'flex', alignItems: 'center'}}>
          <Input
            value={record.soNumber}
            onChange={onInputChange(index)}
          />
            <Icon onClick={() => dispatch(saveSalesOrderForPacket(record))} style={{marginLeft: '8px'}} type="check" />
        </div>
      ),
    },
  ];

  const searchSalesOrderNumber = (selectedKeys, confirm) => {
      const filteredSo = salesOrder.list.filter(so => {
          return so.soNumber.toLowerCase().includes(selectedKeys[0].toLowerCase());
      })
      setSalesOrderList(filteredSo);
  }

  const SOColumns =  [
    {
      title: "Id",
      dataIndex: "soId",
      key: "soId",
    },
    {
      title: "Number",
      dataIndex: "soNumber",
      key: "soNumber",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
                placeholder={`Search Number`}
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => searchSalesOrderNumber(selectedKeys, confirm)}
                style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
                type="primary"
                onClick={() => searchSalesOrderNumber(selectedKeys, confirm)}
                icon="search"
                size="small"
                style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button onClick={() => resetSalesOrderList()} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
      ),
      filterIcon: filtered => (
          <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
          record['soNumber']
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
    },
    {
      title: "Status",
      dataIndex: "soStatus",
      key: "soStatus",
    },
    {
      title: "Pdf",
      dataIndex: "",
      key: "",
        render: (text, record, index) => (
            <Icon onClick={() => console.log('sds')} style={{marginLeft: '8px'}} type="file-pdf" />
        ),
    },
  ];
  const handleChange = (pagination, filters, sorter) => {
    console.log("params", pagination, filters, sorter);
  };

  const resetSalesOrderList = () => {
    setSalesOrderList(salesOrder.list);
  }

  useEffect(() => {
    dispatch(fetchPacketList());
    dispatch(fetchSalesOrderList());
  }, []);

  useEffect(() => {
      resetSalesOrderList();
  }, [salesOrder.list])

    useEffect(() => {
        if (salesOrder.success) {
            message.success('Sales order saved successfully');
        }
    }, [salesOrder.success])

  const expandedRowRendered = (record) => {
    const columns = [
      { title: "Instruction Id", dataIndex: "instructionId", key: "instructionId" },
      { title: "Material Grade", dataIndex: "materialGrade", key: "materialGrade" },
      { title: "Material Desc", dataIndex: "materialDesc", key: "materialDesc" },
      { title: "Quantity", dataIndex: "fweight", key: "fweight" },
      { title: "Status", key: "packetStatus", dataIndex: "packetStatus" },
      { title: "Customer Batch No.", dataIndex: "customerBatchNo", key: "customerBatchNo" },
    ];

    return <Table columns={columns} dataSource={record.childListResp} pagination={false} />;
  };

  return (
    <div>
        <h1>
            <IntlMessages id="sidebar.company.salesOrder" />
        </h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Packets List" key="1">
          <Table
            className="gx-table-responsive"
            columns={columns}
            dataSource={salesOrder.packets}
            onChange={handleChange}
            pagination={{
              pageSize: 15,
              onChange: (page) => {
                setPageNo(page);
                dispatch(fetchPacketList(page, 15, ''));
              },
              current: pageNo,
              total: salesOrder.packets.totalItems,
            }}
          />
        </TabPane>
        <TabPane tab="Sales Orders" key="2">
          <Table
            className="gx-table-responsive"
            columns={SOColumns}
            dataSource={salesOrderList}
            expandedRowRender={record => expandedRowRendered(record)}
            onChange={handleChange}
            pagination={{
              pageSize: 15,
              onChange: (page) => {
                setSalesPageNo(page);
                dispatch(fetchSalesOrderList(page, 15, ''));
              },
              current: salesPageNo,
              total: salesOrder.list.totalItems,
            }}
          />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default SalesOrder;