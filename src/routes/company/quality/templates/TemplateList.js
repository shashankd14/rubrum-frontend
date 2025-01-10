//src-routes-company-quality-templates-TemplateList.js

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import { Button, Select, Table } from 'antd';
import { useIntl } from 'react-intl';
import SearchBox from '../../../../components/SearchBox';

import {
  fetchPartyList,
  fetchTemplatesList,
  fetchTemplatesListSuccess,
} from '../../../../appRedux/actions';

const TemplateList = props => {
  const { actions } = props;
  const intl = useIntl();
  const history = useHistory();
  const [searchValue, setSearchValue] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [totalPageItems, setTotalItems] = useState(0);
  // const [templateList, setTemplateList] = useState([]);
  const [templateList, setTemplateList] = useState([]);
  const [partyList, setPartyList] = useState(props.template?.data || []);
  const [customerValue, setCustomerValue] = useState('');

  useEffect(() => {
    props.fetchPartyList();
    props.fetchTemplatesList();
    // if(!props.columns.find(col => col.title === "Action"))
    //     props.columns.push(actionColumn)
  }, []);

  useEffect(() => {
    console.log('init');
    setTemplateList([]);
    // setSearchValue([]);
    // setPageNo([]);
  }, []);

  useEffect(() => {
    if (
      !props.template.loading &&
      !props.template.error &&
      props.template.operation === 'templateList'
    ) {
      console.log(props.template);
      setTemplateList(props.template.data);
    }
  }, [props.template.loading, props.template.error]);

  useEffect(() => {
    if (!props.party.loading && !props.party.error) {
      console.log(props.party);
      setPartyList(props.party.partyList);
    }
  }, [props.party.loading, props.party.error]);

  useEffect(() => {
    const { template } = props;
    if (searchValue) {
      console.log('searchValue', searchValue);
      const filteredData = template?.data?.filter(template => {
        if (
          template.templateId?.toString() === searchValue ||
          template.templateName
            ?.toLowerCase()
            .includes(searchValue.toLowerCase())
        ) {
          return template;
        }
      });
      setTemplateList(filteredData);
      console.log('filteredData', filteredData);
    } else {
      setTemplateList(template.data);
    }
  }, [searchValue]);

  const handleChange = () => {};

  const handleCreate = () => {
    history.push('/company/quality/templates/create');
  };

  const rowSelection = {};

  return (
    <>
      <div className="gx-flex-row gx-flex-1">
        <div className="table-operations gx-col">
          {actions.select && (
            <Select
              id="select"
              showSearch
              style={{ width: 200 }}
              placeholder="Select a customer"
              optionFilterProp="children"
              onChange={handleChange}
              value={customerValue}
              // onFocus={handleFocus}
              // onBlur={handleBlur}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {partyList.length > 0 &&
                partyList.map(party => (
                  <Select.Option value={party.nPartyId}>
                    {party.partyName}
                  </Select.Option>
                ))}
            </Select>
          )}
          {actions.search && (
            <SearchBox
              styleName="gx-flex-1"
              placeholder={intl.formatMessage({
                id: actions.search.placeholder,
              })}
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
            ></SearchBox>
          )}
        </div>
        <div className="gx-w-50">
          {actions.create && (
            <Button
              style={{ background: '#003366', color: '#FFFFFF' }}
              size="default"
              className="gx-float-right"
              onClick={handleCreate}
            >
              {intl.formatMessage({ id: actions.create.label })}
            </Button>
          )}
          {actions.export && (
            <Button size="default" className="gx-float-right">
              {intl.formatMessage({ id: actions.export.label })}
            </Button>
          )}
          {actions.print && (
            <Button size="default" className="gx-float-right">
              {intl.formatMessage({ id: actions.print.label })}
            </Button>
          )}
        </div>
      </div>
      <Table
        className="gx-table-responsive"
        columns={props.columns}
        dataSource={templateList.length > 0 ? templateList : []}
        // dataSource={templateList.map((record) => ({
        //     ...record,
        //     key: record.templateId,
        //   }))}
        rowSelection={rowSelection}
        pagination={{
          pageSize: 15,
          onChange: page => {
            setPageNo(page);
            props.fetchTemplatesList(page, 15, searchValue);
          },
          current: pageNo,
          total: totalPageItems,
        }}
      />
    </>
  );
};

const mapStateToProps = state => ({
  template: state.quality,
  party: state.party,
});

export default connect(mapStateToProps, {
  fetchPartyList,
  fetchTemplatesList,
  fetchTemplatesListSuccess,
})(TemplateList);
