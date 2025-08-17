import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Button,
  Card,
  Divider,
  Table,
  Form,
} from "antd";
import SearchBox from "../../../components/SearchBox";

import IntlMessages from "../../../util/IntlMessages";
import { fetchTemplatesList } from "../../../appRedux/actions";

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

const Quality = (props) => {
  const [sortedInfo, setSortedInfo] = useState({
    order: "descend",
    columnKey: "age",
  });

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

  const onEdit = (record, e) => {};

  const handleChange = (pagination, filters, sorter) => {};

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
              styleName="gx-flex-1"
              placeholder="Search template"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button
              type="primary"
              icon={() => <i className="icon icon-add" />}
              size="default"
              onClick={() => {
                // setshowCreateTemplate(true);
                // history.push(`${pathname}/createTemplate`);
                props.history.push("/company/master/quality/createTemplate");
              }}
            >
              Create Template
            </Button>
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
