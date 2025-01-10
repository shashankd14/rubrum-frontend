import React from 'react';
import IntlMessages from '../../../util/IntlMessages';
import { Tabs, Card } from 'antd';

const { TabPane } = Tabs;

const SalesOrder = () => {
  return (
    <div>
      <h1>
        <IntlMessages id="sidebar.company.salesOrder" />
      </h1>
      <Card>
        <Tabs defaultActiveKey="1" onChange={() => {}}>
          <TabPane tab="Packages" key="1">
            Package list
          </TabPane>
          <TabPane tab="Sales Orders" key="2">
            Sales order list
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SalesOrder;
