import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { Card, Tabs } from 'antd'
import { useIntl } from "react-intl";
import { useLocation } from 'react-router-dom';
import IntlMessages from '../../../util/IntlMessages'
import { 
  deleteQualityTemplate
} from "../../../appRedux/actions"
import LabelPrintInward from './LabelPrintInward';
import LabelPrintWIP from './LabelPrintWIP';
import LabelPrintFG from './LabelPrintFG';

const LabelPrint = (props) => {
  const [mode, setMode] = useState("top");
  const [tabKey, setTabKey] = useState("1");
  const TabPane = Tabs.TabPane;
  const location = useLocation();

  useEffect(() => {
    console.log(props.history)
    if (props.match) {
        console.log(props.match)
        console.log(location)
        
        const params = new URLSearchParams(location.search);
        console.log(params.get('view'));
        if(params.get('view') === 'links') {
          setTabKey("2");
        } else {
          setTabKey("1");
        }
    }
}, [])

  const onTabChange = (key) => {
    setTabKey(key);
  };

  return (
    <div>
      <h1>
        <IntlMessages id="sidebar.company.labelPrint" />
      </h1>
      <Card>
        <Tabs defaultActiveKey="1" tabPosition={mode} onChange={onTabChange} destroyInactiveTabPane={true} >
          <TabPane tab="Inward" key="1">
            <LabelPrintInward/>
          </TabPane>
           <TabPane tab="WIP" key="2" className="additionalTab">
            <LabelPrintWIP/>
          </TabPane>
          <TabPane tab="FG" key="3" className="additionalTab">
            <LabelPrintFG/>
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
})(LabelPrint);
