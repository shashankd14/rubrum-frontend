import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router";
import { connect } from "react-redux";
import { Button, Select, Table } from "antd";
import { useIntl } from "react-intl";
import SearchBox from '../../../../components/SearchBox';

import {
    fetchPartyList,
    fetchKqpList,
    fetchKqpListSuccess
} from "../../../../appRedux/actions";

const TemplateList = (props) => {

    const { actions } = props;
    const intl = useIntl();
    const history = useHistory();
    const [searchValue, setSearchValue] = useState("");
    const [pageNo, setPageNo] = useState(1);
    const [totalPageItems, setTotalItems] = useState(0);
    const [templateList, setTemplateList] = useState([]);
    const [partyList, setPartyList] = useState([]);
    const [customerValue, setCustomerValue] = useState("");

    useEffect(() => {
        props.fetchPartyList();
        props.fetchKqpList();
        // if(!props.columns.find(col => col.title === "Action"))
        //     props.columns.push(actionColumn)
    }, []);

    useEffect(() => {
        setTemplateList([]);
        //setSearchValue([]);
        //setPageNo([]);
    }, []);

    useEffect(() => {
        if (!props.template.loading && !props.template.error && props.template.operation === 'kqpList') {
            setTemplateList(props.template.data)
        }
    }, [props.template.loading, props.template.error]);

    useEffect(() => {
        if (!props.party.loading && !props.party.error) {
            setPartyList(props.party.partyList)
        }
    }, [props.party.loading, props.party.error]);

    // useEffect(() => {
    //     if (searchValue) {
    //         if (searchValue.length >= 3) {
    //             setPageNo(1);
    //             // props.fetchInwardList(1, 20, searchValue, customerValue);
    //         }
    //     } else {
    //         setPageNo(1);
    //         //   props.fetchInwardList(1, 20, searchValue, customerValue);
    //     }
    // }, [searchValue]);
    
    useEffect(() => {
        const { template } = props;
        if(searchValue) {
            const filteredData = template?.data?.filter(template => {
                if(template.kqpId?.toString() === searchValue ||
                template.kqpName?.toLowerCase().includes(searchValue.toLowerCase()) )  {
                    return template;
                }
            });
            setTemplateList(filteredData);
        } else {
            setTemplateList(template.data);
        }
           
    }, [searchValue]);

    const handleChange = () => {

    }

    const handleCreate = () => {
        history.push("/company/quality/kqp/create")
    }

    const rowSelection = {}

    return (
        <>
            <div className="gx-flex-row gx-flex-1">
                <div className="table-operations gx-col">
                    {actions.select && <Select
                        id="select"
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select a location"
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
                            partyList.map((party) => (
                                <Select.Option value={party.nPartyId}>{party.partyName}</Select.Option>
                            ))}
                    </Select>}
                    {actions.search && <SearchBox
                        styleName="gx-flex-1"
                        placeholder={intl.formatMessage({ id: actions.search.placeholder })}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}>
                    </SearchBox>}

                </div>
                <div className="gx-w-50">
                    {actions.create &&
                        <Button
                            style={{ background: "#003366", color: "#FFFFFF" }}
                            size="default"
                            className="gx-float-right"
                            onClick={handleCreate}
                        >
                            {intl.formatMessage({ id: actions.create.label })}
                        </Button>}
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
                //dataSource={templateList}
                dataSource={templateList.length > 0? templateList : []}
                rowSelection={rowSelection}
                pagination={{
                    pageSize: 15,
                    onChange: (page) => {
                        setPageNo(page);
                        props.fetchKqpList(page, 15, searchValue);
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
    fetchKqpList,
    fetchKqpListSuccess
})(TemplateList);