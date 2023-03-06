import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { Card, Divider, Tabs } from 'antd'
import IntlMessages from '../../../../util/IntlMessages'
import { QUALITY_TEMPLATE_ACTIONS, QUALITY_TEMPLATE_COLUMNS, QUALITY_LINKED_TEMPLATE_ACTIONS, QUALITY_LINKED_TEMPLATE_COLUMNS } from "../../../../constants/quality/ComponentConstants";
import TemplateList from "./TemplateList";
import LinkedTemplateList from "./LinkedTemplateList";

import { 
  deleteQualityTemplate
} from "../../../../appRedux/actions"

const Templates = (props) => {

  const [mode, setMode] = useState("top");
  const [tabKey, setTabKey] = useState("1");

  const TabPane = Tabs.TabPane;

  const templateListAactionColumn = {
    title: "Action",
    dataIndex: "",
    key: "x",
    render: (text, record) => (
        <span>
            <span
                className="gx-link"
                onClick={() => props.history.push(`/company/quality/templates/view/${record.templateId}`)}
            >
                View
            </span>
            <Divider type="vertical" />
            <span
                className="gx-link"
                onClick={() => props.history.push(`/company/quality/templates/edit/${record.templateId}`)}
            >
                Edit
            </span>
            <Divider type="vertical" />
            <span
                className="gx-link"
                onClick={() =>
                    // console.log("Delete", record)
                    props.deleteQualityTemplate(record.templateId)
                }
            >
                Delete
            </span>
            <Divider type="vertical" />
            <span
                className="gx-link"
                onClick={() =>
                    props.history.push(`/company/quality/templates/link/${record.templateId}`)
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
              onClick={() => props.history.push(`/company/quality/templates/link/edit/${record.id}`)}
          >
              Edit Link
          </span>
          <Divider type="vertical" />
          <span
              className="gx-link"
              onClick={() =>
                  // console.log("Delete", record)
                  props.deleteQualityTemplate(record.templateId)
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

  return (
    <div>
      <h1>
        <IntlMessages id="sidebar.quality.templates" />
      </h1>
      <Card>
        <Tabs defaultActiveKey="1" tabPosition={mode} onChange={onTabChange} destroyInactiveTabPane={true} >
          <TabPane tab="Quality Template List" key="1">
            <TemplateList actions={QUALITY_TEMPLATE_ACTIONS} columns={[...QUALITY_TEMPLATE_COLUMNS, templateListAactionColumn]} tab="qualityTemplate"/>
          </TabPane>
          <TabPane tab="Linked Template List" key="2" className="additionalTab">
            <LinkedTemplateList actions={QUALITY_LINKED_TEMPLATE_ACTIONS} columns={[...QUALITY_LINKED_TEMPLATE_COLUMNS, templateLinkListAactionColumn]} tab="qualityLinkedTemplate"/>
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
  deleteQualityTemplate
})(Templates);