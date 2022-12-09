import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Button,
  Card,
  Divider,
  Table,
  Modal,
  Row,
  Col,
  Form,
  Input,
  Icon,
  Tabs,
  Dropdown,
    Menu
} from "antd";
import moment from "moment";
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchTemplatesList } from "../../../appRedux/actions";
import { onDeleteContact } from "../../../appRedux/actions";

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 16 },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const routeQualityTemplate = (processStep, history) => {
  history.push({
    pathname: '/company/master/quality/createTemplate',
    state: { stepId: processStep }
  });
}

const Quality = (props) => {
  const [sortedInfo, setSortedInfo] = useState({
    order: "descend",
    columnKey: "age",
  });

  const menu = (
      <Menu onClick={(e) => routeQualityTemplate(e.key, props.history)}>
        <Menu.Item key="1">Inward</Menu.Item>
        <Menu.Item key="2">Pre Processing</Menu.Item>
        <Menu.Item key="3">Processing</Menu.Item>
        <Menu.Item key="4">Pre Dispatch</Menu.Item>
        <Menu.Item key="5">Post Dispatch</Menu.Item>
      </Menu>
  );

  const [filteredTemplateList, setFilteredTemplateList] = useState(
    props.quality?.data || []
  );
  const [searchValue, setSearchValue] = useState("");

  const columns = [
    {
      title: "S No",
      dataIndex: "id",
      key: "id",
      filters: [],
      sorter: (a, b) => {
        return a.id - b.id;
      },
      sortOrder: sortedInfo.columnKey === "id" && sortedInfo.order,
    },
    {
      title: "Template Name",
      dataIndex: "templateName",
      key: "templateName",
      filters: [],
      sorter: (a, b) => {
        return a.templateName - b.templateName;
      },
      sortOrder: sortedInfo.columnKey === "templateName" && sortedInfo.order,
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record, index) => (
        <span>
          <span className="gx-link" onClick={(e) => onView(record, e)}>
            View
          </span>
          <Divider type="vertical" />
          <span className="gx-link" onClick={(e) => onEdit(record, e)}>
            Edit
          </span>
          <Divider type="vertical" />
          <span className="gx-link" onClick={() => {}}>
            Delete
          </span>
        </span>
      ),
    },
  ];

  const onView = (record, e) => {};

  const onDelete = (record, key, e) => {};
  const onEdit = (record, e) => {};

  const handleChange = (pagination, filters, sorter) => {};

  const clearFilters = () => {};

  const exportSelectedData = () => {};

  useEffect(() => {
    const { loading, error, data } = props.quality;
    if (!loading && !error) {
      setFilteredTemplateList(data);
    }
  }, [props.quality]);

  useEffect(() => {
    const { quality } = props;
    if (searchValue) {
      const filteredData = quality?.data?.filter((party) => {
        if (
          party.id?.toString() === searchValue ||
          party.templateName?.toLowerCase().includes(searchValue.toLowerCase())
        ) {
          return party;
        }
      });
      setFilteredTemplateList(filteredData);
    } else {
      setFilteredTemplateList(quality?.data);
    }
  }, [searchValue]);

  const getRadioFields = () => {
    console.log("dfd");
  };

  useEffect(() => {
    props.fetchTemplatesList();
  }, []);

  return (
    <div>
      <h1>
        <IntlMessages id="sidebar.company.qualityList" />
      </h1>
      <Card>
        <div className="gx-flex-row gx-flex-1">
          {/* <div className="table-operations gx-col">
                        <Button onClick={deleteSelectedCoils}>Create Template</Button>
                        <Button onClick={exportSelectedData}>Export</Button>
                    </div> */}
          <div className="gx-flex-row gx-w-50">
            <SearchBox
              styleName="gx-flex-1 gx-mr-3"
              placeholder="Search template"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Dropdown onClick={() => menu} overlay={menu}>
              <Button>
                Create Template <Icon type="down"/>
              </Button>
            </Dropdown>
          </div>
        </div>
        <Table
          rowSelection={[]}
          className="gx-table-responsive"
          columns={columns}
          dataSource={filteredTemplateList}
          onChange={handleChange}
        />
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => ({
  quality: state.quality,
});

const addMaterialForm = Form.create()(Quality);

export default connect(mapStateToProps, { fetchTemplatesList })(
  addMaterialForm
);
