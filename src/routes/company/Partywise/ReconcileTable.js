import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { useSelector } from 'react-redux';

const ReconcileTable = props => {
  const { reconcileData } = props;

  const columns = [
    {
      title: 'In-Weight',
      dataIndex: 'netweight',
      key: 'netweight',
    },
    {
      title: 'Out-Weight',
      dataIndex: 'dispatchedweight',
      key: 'dispatchedweight',
    },
    {
      title: 'InStock-Weight',
      dataIndex: 'instockweight',
      key: 'instockweight',
    },
    {
      title: 'FG',
      dataIndex: 'fgqty',
      key: 'fgqty',
    },
    {
      title: 'WIP',
      dataIndex: 'wipqty',
      key: 'wipqty',
    },
    {
      title: 'Total Processed Weight',
      render: (text, record, index) =>
        Number(record.fgqty) + Number(record.wipqty),
    },
    {
      title: 'Unprocessed',
      dataIndex: 'unprocessedweight',
      key: 'unprocessedweight',
    },
    {
      title: 'Balance',
      render: (text, record, index) =>
        Number(record?.instockweight) -
        (Number(record.fgqty) +
          Number(record.wipqty) +
          Number(record.unprocessedweight)),
    },
  ];
  return (
    <>
      {reconcileData?.length && (
        <Table
          columns={columns}
          className="gx-table-responsive"
          dataSource={reconcileData}
          pagination={false}
        />
      )}
    </>
  );
};

export default ReconcileTable;
