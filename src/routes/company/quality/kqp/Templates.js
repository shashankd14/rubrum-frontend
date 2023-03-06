import React, { useEffect, useState } from "react";
import { Card, Tabs } from 'antd'
import { useIntl } from "react-intl";
import IntlMessages from '../../../../util/IntlMessages'
import { QUALITY_REPORT_ACTIONS } from "../../../../constants/quality/ComponentConstants";

const Templates = () => {
  const [mode, setMode] = useState("top");
  const [tabKey, setTabKey] = useState("1");
  const intl = useIntl();
  const TabPane = Tabs.TabPane;

  const onTabChange = (key) => {
    setTabKey(key);
  };

  return (
    <div>
      <h1>
        <IntlMessages id="sidebar.quality.kqp" />
      </h1>
      <Card>
        <Tabs defaultActiveKey="1" tabPosition={mode} onChange={onTabChange} destroyInactiveTabPane={true} >
          <TabPane tab="Key Quality Parameter (KQP)" key="1">
            {/* <List actions={QUALITY_REPORT_ACTIONS} /> */}
          </TabPane>
          <TabPane tab="Linked Key Quality Parameter (KQP)" key="2" className="additionalTab">
            {/* <List actions={QUALITY_REPORT_ACTIONS} /> */}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )

}

export default Templates