//src-routes-company-quality-templates-LinkedTemplateList.js

import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { Button, Table } from 'antd';
import { useIntl } from "react-intl";
import SearchBox from '../../../../components/SearchBox';

import {
    fetchPartyList,
    fetchTemplatesLinkList,
    fetchTemplatesLinkListSuccess
} from "../../../../appRedux/actions";

const LinkedTemplateList = (props) => {

    const { actions } = props;
    const intl = useIntl();
    const [searchValue, setSearchValue] = useState("");
    const [pageNo, setPageNo] = useState(1);
    const [totalPageItems, setTotalItems] = useState(0);
    const [templateList, setTemplateList] = useState([]);

    useEffect(() => {
        setTemplateList([]);
        setSearchValue([]);
        setPageNo([]);
    }, []);

    useEffect(() => {
        props.fetchPartyList();
        props.fetchTemplatesLinkList();
    }, []);

    useEffect(() => {
        // if (!props.template.loading && !props.template.error) {
        if (!props.template.loading && !props.template.error && props.template.operation === 'templateLinkList') {

            const jsonData =props.template.data;
            const groupedData = {};
            jsonData.forEach((item) => {
                const { templateId, templateName, stageName, partyName } = item;
              
                const key = `${templateId}-${templateName}-${stageName}`;
              
                if (!groupedData[key]) {
                  // If the group doesn't exist yet, create it
                  groupedData[key] = {
                    templateId,
                    templateName,
                    stageName,
                    parties: [],
                  };
                }
              
                // Add the partyName to the parties array in the group
                groupedData[key].parties.push(partyName);
              });
              const groupedArray = Object.values(groupedData);
           // setTemplateList(props.template.data)
           setTemplateList(groupedArray)
        }
    }, [props.template.loading, props.template.error]);

    useEffect(() => {
        if (searchValue) {
            if (searchValue.length >= 3) {
                setPageNo(1);
                // props.fetchInwardList(1, 20, searchValue, customerValue);
            }
        } else {
            setPageNo(1);
            //   props.fetchInwardList(1, 20, searchValue, customerValue);
        }
    }, [searchValue]);

    const handleChange = () => {

    }

    const rowSelection = {}

    return (
        <>
            <div className="gx-flex-row gx-flex-1">
                <div className="table-operations gx-col">
                    {actions.search && <SearchBox
                        styleName="gx-flex-1"
                        placeholder={intl.formatMessage({ id: actions.search.placeholder })}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}>
                    </SearchBox>}

                </div>
                <div className="gx-w-50">
                    {actions.export && <Button
                        size="default"
                        className="gx-float-right"
                    >
                        {intl.formatMessage({ id: actions.export.label })}
                    </Button>}
                    {actions.print && <Button
                        size="default"
                        className="gx-float-right"
                    >
                        {intl.formatMessage({ id: actions.print.label })}
                    </Button>}
                </div>
            </div>
            <Table
                className="gx-table-responsive"
                columns={props.columns}
                dataSource={templateList}
                // dataSource={templateList.map((record) => ({
                //     ...record,
                //     key: record.Id, 
                //   }))}
                onChange={handleChange}
                rowSelection={rowSelection}
                pagination={{
                    pageSize: 15,
                    onChange: (page) => {
                        setPageNo(page);
                        props.fetchTemplatesLinkList(page, 15, searchValue);
                    },
                    current: pageNo,
                    total: totalPageItems,
                }}
            />
        </>
    )
}

const mapStateToProps = (state) => ({
    template: state.quality,
    party: state.party,
});

export default connect(mapStateToProps, {
    fetchPartyList,
    fetchTemplatesLinkList,
    fetchTemplatesLinkListSuccess
})(LinkedTemplateList);