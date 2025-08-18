//src-routes-company-kqp-Template.js

import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import URLSearchParams from 'url-search-params'
import { Card, Divider, Tabs } from 'antd'
import IntlMessages from '../../../../util/IntlMessages'
import { KQP_COLUMNS, KQP_LINK_COLUMNS, QUALITY_TEMPLATE_ACTIONS } from "../../../../constants/quality/ComponentConstants";
import TemplateList from "./TemplateList";
import LinkedTemplateList from "./LinkedTemplateList";

import { 
  deleteQualityTemplate,
  deleteKqp,
  deleteKqpLink
} from "../../../../appRedux/actions"

const Templates = (props) => {

  const [mode, setMode] = useState("top");
  const [tabKey, setTabKey] = useState("1");
  const location = useLocation();
  

  const TabPane = Tabs.TabPane;

  const templateListAactionColumn = {
    title: "Action",
    dataIndex: "",
    key: "x",
    render: (text, record) => (
        <span>
            <span
                className="gx-link"
                onClick={() => props.history.push(`/company/quality/kqp/view/${record.kqpId}`)}
            >
                View
            </span>
            <Divider type="vertical" />
            <span
                className="gx-link"
                onClick={() => props.history.push(`/company/quality/kqp/edit/${record.kqpId}`)}
            >
                Edit
            </span>
            <Divider type="vertical" />
            <span
                className="gx-link"
                onClick={() =>
                    props.deleteKqp(record.kqpId)
                }
            >
                Delete
            </span>
            <Divider type="vertical" />
            <span
                className="gx-link"
                onClick={() =>
                    props.history.push(`/company/quality/kqp/link/${record.kqpId}`)
                }
            >
                Link
            </span>
        </span>
    )
}

const templateLinkListAactionColumn = {
  title: "Action",
  dataIndex: "",
  key: "x",
  render: (text, record) => (
      <span>
          <span
              className="gx-link"
              onClick={() => props.history.push(`/company/quality/kqp/link/edit/${record.kqpId}`)}
          >
              Edit Link
          </span>
          <Divider type="vertical" />
          <span
              className="gx-link"
              onClick={() =>
                  props.deleteKqpLink(record.kqpId)
              }
          >
              Delete
          </span>
      </span>
  )
}

  const onTabChange = (key) => {
    setTabKey(key);
  };

  useEffect(() => {
    if (props.match) {        
      const params = new URLSearchParams(location.search);
      if(params.get('view') === 'links') {
        setTabKey("2");
      } else {
        setTabKey("1");
      }
    }
}, [])

  return (
    <div>
      <h1>
        <IntlMessages id="heading.kqp" />
      </h1>
      <Card>
        <Tabs defaultActiveKey="1" tabPosition={mode} onChange={onTabChange} destroyInactiveTabPane={true} activeKey={tabKey}>
          <TabPane tab="Key Quality Parameter (KQP)" key="1">
            <TemplateList actions={QUALITY_TEMPLATE_ACTIONS} columns={[...KQP_COLUMNS, templateListAactionColumn]} tab="qualityTemplate"/>
          </TabPane>
          <TabPane tab="Linked Key Quality Parameter (KQP)" key="2" className="additionalTab">
            <LinkedTemplateList actions={QUALITY_TEMPLATE_ACTIONS} columns={[...KQP_LINK_COLUMNS, templateLinkListAactionColumn]} tab="qualityLinkedTemplate"/>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

const mapStateToProps = state => ({
  templateDetails: state.quality,
});

export default connect(mapStateToProps, {
  deleteQualityTemplate,
  deleteKqp,
  deleteKqpLink
})(Templates);