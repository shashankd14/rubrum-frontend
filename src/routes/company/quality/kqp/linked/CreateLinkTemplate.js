import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { Button, Card, Col, Form, Input, Row, Select, Tabs, Tag } from 'antd'
import {
    fetchPartyList,
    fetchKqpList,
    saveKqpLink,
    getKqpLinkById,
    fetchEndUserTagsList,
    fetchMaterialList
} from "../../../../../appRedux/actions"

const CreateLinkTemplate = (props) => {

    const Option = Select.Option;

    const [selectedTemplate, setSelectedTemplate] = useState();
    const [selectedTemplateId, setSelectedTemplateId] = useState();
    const [templateList, setTemplateList] = useState([]);
    const [defaultSelected, setDefaultSelected] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [selectedEndUserTags, setSelectedEndUserTags] = useState();
    const [action, setAction] = useState("create");
    const [partyList, setPartyList] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [selectedMatGrade, setSelectedMatGrade] = useState ();
    useEffect(() => {
        if (props.match) {
            const urlPaths = props.match.url.split('/')
            console.log(urlPaths)
            setSelectedTemplateId(urlPaths[urlPaths.length - 1])
            if (urlPaths[urlPaths.length - 2] == 'view' || urlPaths[urlPaths.length - 2] == 'edit') {
                setAction(urlPaths[urlPaths.length - 2])
                props.getKqpLinkById(urlPaths[urlPaths.length - 1])
            }
            props.fetchKqpList();
            props.fetchPartyList();
            props.fetchEndUserTagsList();
            props.fetchMaterialList();
        }
    }, [])

    useEffect(() => {
        if (!props.template.loading && !props.template.error && props.template.operation === 'kqpList') {
            console.log(props.template.data)
            setTemplateList([...props.template.data])
            setSelectedTemplateDetails(selectedTemplateId)
            // const filteredTemplate = props.template.data.filter(t => t.templateId == selectedTemplateId)
            // setSelectedTemplate(filteredTemplate?.length === 1 ? filteredTemplate[0] : undefined)
            // setDefaultSelected(filteredTemplate?.length === 1 ? [filteredTemplate[0].templateId] : [])
        }
    }, [props.template.loading, props.template.error, props.template.operation]);

    useEffect(() => {
        if (!props.party.loading && !props.party.error) {
            // console.log(props.party)
            setPartyList(props.party.partyList)
        }
    }, [props.party.loading, props.party.error]);

    const setSelectedTemplateDetails = (templateId) => {
        const filteredTemplate = props.template.data.filter(t => t.kqpId == templateId)
        setSelectedTemplate(filteredTemplate?.length === 1 ? filteredTemplate[0] : undefined)
        setDefaultSelected(filteredTemplate?.length === 1 ? [filteredTemplate[0].kqpId] : [])
    }

    const handeTemplateChange = (e) => {
        // setTemplateList([...props.template.data])
        console.log(e)
        setSelectedTemplateId(e)
        setSelectedTemplateDetails(e);
    }

    const searchTemplate = (e) => {
        const data = [...props.template.data]
        if (e.length > 2) {
            setTemplateList(data.filter(t => (t.kqpId == e || t.kqpName.toLowerCase().includes(e.toLowerCase()))))
        } else {
            setTemplateList(data.filter(t => t.kqpId == e))
        }

    }

    const onCustomerSelection = (e) => {
        setSelectedCustomers(e)
    }

    const onEnduserTagSelection = (e) => {
        setSelectedEndUserTags(e)
    }

    const onMatGradeSelection = (e) => {
        setSelectedMatGrade(e)
    }

    const onThicknessSelection = (e) => {
        setThickness(e);
    }

    const onCustomerDeselection = (e) => {
        console.log(e)
        console.log('selectedCustomers', selectedCustomers)
        console.log('filteredCustomers', selectedCustomers.filter(c => c !== e))
        console.log('partyList', partyList)
        setSelectedCustomers(selectedCustomers.filter(c => c !== e))
    }

    useEffect(() => {
        console.log(partyList.filter((e) => selectedCustomers.includes(e.nPartyId)).map((party) => (
            party
        )))
    }, [selectedCustomers])

    useEffect(() => {
        if (!props.template.loading && !props.template.error && props.template.operation === 'templateLinkSave') {
            console.log(props.template)
            props.history.push('/company/quality/templates?view=links')
        }
    }, [props.template.loading, props.template.error]);
 
const [thickness, setThickness] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");

    const createTemplateLink = () => {
        const payload = JSON.stringify({
            kqpId: selectedTemplateId,
            endUserTagId: selectedEndUserTags,
            matGradeId: selectedMatGrade,
            userId: localStorage.getItem("userId"),
            thickness: thickness,
            width: width,
            length: length,
            partyIdList: selectedCustomers,
        })
        props.saveKqpLink(payload)
    }

    const [materialOptions, setMaterialOptions] = useState([]);
    useEffect(() => {
        const options = props.material.materialList.flatMap(item =>
            item.materialGrade.map(grade => (
                <Option key={grade.gradeId} value={grade.gradeId}>
                    {grade.gradeName}
                </Option>
            ))
        );
        setMaterialOptions(options);
    }, [props.material.materialList]);

    return (
        <div>
            <Card title="Link Template">
                <Row>
                    <Col span={12}>
                        <label>Qty Template Id/Template Name</label>
                        <Select
                            showSearch
                            id="stage"
                            style={{ width: "100%" }}
                            onChange={handeTemplateChange}
                            value={defaultSelected}
                            onSearch={searchTemplate}
                        // onBlur={() => setTemplateList([...props.template.data])}
                        >
                            {templateList.map((template) => (
                                <Option key={`${template.kqpId}${template.kqpName}`} value={template.kqpId}>
                                    {template.kqpName}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                </Row>
                <Row>
                    <Col span={12}>
                        <div style={{ marginTop: 30, display: "flex" }}>
                            <label>Assign Customer</label>
                        </div>
                        <div >
                            <Select
                                id="select"
                                mode="multiple"
                                showSearch
                                style={{ width: '100%' }}
                                placeholder="Select a customer"
                                optionFilterProp="children"
                                onChange={onCustomerSelection}
                                // onFocus={handleFocus}
                                // onBlur={handleBlur}
                                maxTagCount={3}
                                filterOption={(input, option) =>
                                    option.props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                value={selectedCustomers}
                                allowClear
                            >

                                {partyList.length > 0 &&
                                    partyList.map((party) => (
                                        <Select.Option value={party.nPartyId}>{party.partyName}</Select.Option>
                                    ))}
                            </Select>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div id="custTags" style={{ marginTop: 30, display: "flex" }}>
                            {partyList.length > 0 && selectedCustomers.length > 0 &&

                                partyList.filter((e) => selectedCustomers.includes(e.nPartyId)).map((party) => (
                                    <Tag
                                        closable
                                        onClose={() => onCustomerDeselection(party.nPartyId)}
                                    >
                                        {party.partyName}
                                    </Tag>
                                ))}

                        </div>
                    </Col>
                </Row>
                
                    <>
                        <Row>
                            <Col span={12}>
                                <div style={{ marginTop: 30, display: "flex" }}>
                                    <label>End User Tags</label>
                                </div>
                                <div>
                                    {/* <Select
                                        id="select"
                                        mode="multiple"
                                        showSearch
                                        style={{ width: '100%' }}
                                        placeholder="Select End User Tags"
                                        optionFilterProp="children"
                                        onChange={onCustomerSelection}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        maxTagCount={3}
                                        filterOption={(input, option) =>
                                            option.props.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                        value={selectedCustomers}
                                        allowClear
                                    >

                                        {partyList.length > 0 &&
                                            partyList.map((party) => (
                                                <Select.Option value={party.nPartyId}>{party.partyName}</Select.Option>
                                            ))}
                                    </Select> */}
                                    <Select
                                        id="endUsertags"
                                        showSearch
                                        mode="multiple"
                                        placeholder="Select End User tag"
                                        style={{ width: '100%' }}
                                        maxTagCount={3}
                                        filterOption={(input, option) => {
                                            return option?.props?.children?.toLowerCase().includes(input.toLowerCase());
                                        }}
                                        filterSort={(optionA, optionB) =>
                                            optionA?.props?.children.toLowerCase().localeCompare(optionB?.props?.children.toLowerCase())
                                        }
                                        onChange={onEnduserTagSelection}
                                        value={selectedEndUserTags}
                                    >{props?.packetClassification?.endUserTags?.map(item => {
                                        return <Option value={item?.tagId}>{item.tagName}</Option>
                                    })}</Select>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <div style={{ marginTop: 30, display: "flex" }}>
                                    <label>Material Grade</label>
                                </div>
                                <div>
                                    <Select
                                        id="select"
                                        mode="multiple"
                                        showSearch
                                        style={{ width: '100%' }}
                                        placeholder="Select Material Grade"
                                        optionFilterProp="children"
                                     //   onChange={onMatGradeSelection}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        maxTagCount={3}
                                    //     filterOption={(input, option) =>
                                    //         option.props.children
                                    //             .toLowerCase()
                                    //             .indexOf(input.toLowerCase()) >= 0
                                    //     }
                                    //     //onChange={onMatGradeSelection}
                                    //     value={selectedMatGrade}
                                    //     // value={selectedCustomers}
                                    //     allowClear
                                    // >

                                    // </Select>
                                    filterOption={(input, option) => {
                                        return option?.props?.children?.toLowerCase().includes(input.toLowerCase());
                                    }}
                                    filterSort={(optionA, optionB) =>
                                        optionA?.props?.children.toLowerCase().localeCompare(optionB?.props?.children.toLowerCase())
                                    }
                                    onChange={onMatGradeSelection}
                                    value={selectedMatGrade}
                                >  
                                     {materialOptions}
                                </Select>

                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <div style={{ marginTop: 30, display: "flex" }}>
                                     <label>Thickness</label> 
                                </div>
                                 <div> 
                                <Input
                                id="thicknessInput"
                                style={{ width: '100%' }}
                                placeholder="Enter Thickness"
                                value={thickness}
                                onChange={(e) => setThickness(e.target.value)}
                            />
                               </div> 
                                 {/* <div>
                                    <Select
                                        id="select"
                                        mode="multiple"
                                        showSearch
                                        style={{ width: '100%' }}
                                        placeholder="Select Thickness"
                                        optionFilterProp="children"
                                        onChange={onCustomerSelection}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        maxTagCount={3}
                                        filterOption={(input, option) =>
                                            option.props.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                        // value={selectedCustomers}
                                        allowClear
                                    >

                                    </Select>
                                </div>  */}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <div style={{ marginTop: 30, display: "flex" }}>
                                    <label>Width</label>
                                </div>
                                <div>
                                <Input
                                    id="widthInput"
                                    style={{ width: '100%' }}
                                    placeholder="Enter Width"
                                    value={width}
                                    onChange={(e) => setWidth(e.target.value)}
                                />
                                {/* <Select
                                        id="select"
                                        mode="multiple"
                                        showSearch
                                        style={{ width: '100%' }}
                                        placeholder="Select Width"
                                        optionFilterProp="children"
                                        onChange={onCustomerSelection}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        maxTagCount={3}
                                        filterOption={(input, option) =>
                                            option.props.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                        // value={selectedCustomers}
                                        allowClear
                                    >

                                    </Select> */}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <div style={{ marginTop: 30, display: "flex" }}>
                                    <label>Length</label>
                                </div>
                                <div>
                                <Input
                                    id="lengthInput"
                                    style={{ width: '100%' }}
                                    placeholder="Enter Length"
                                    value={length}
                                    onChange={(e) => setLength(e.target.value)}
                                />
                                {/* <Select
                                        id="select"
                                        mode="multiple"
                                        showSearch
                                        style={{ width: '100%' }}
                                        placeholder="Select Length"
                                        optionFilterProp="children"
                                        onChange={onCustomerSelection}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        maxTagCount={3}
                                        filterOption={(input, option) =>
                                            option.props.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                        // value={selectedCustomers}
                                        allowClear
                                    >

                                    </Select> */}
                                </div>
                            </Col>
                        </Row>
                    </>
                {action !== 'view' && <Row >
                    <div style={{ marginTop: 45 }}>
                        <Button style={{ marginLeft: 8 }} disabled={isDisabled}>
                            Cancel
                        </Button>
                        {action === 'create' ? <Button type="primary" htmlType="submit" onClick={createTemplateLink} disabled={isDisabled}>
                            Link Template
                        </Button> :
                            <Button type="primary" htmlType="submit" onClick={createTemplateLink} disabled={isDisabled}>
                                Update Link
                            </Button>
                        }
                    </div>
                </Row>}
            </Card>
        </div>
    )
}
const mapStateToProps = state => ({
    template: state.quality,
    party: state.party,
    packetClassification: state.packetClassification,
    //material: state.materialList,
    material: state.material,
});

export default connect(mapStateToProps, {
    fetchPartyList,
    fetchKqpList,
    saveKqpLink,
    getKqpLinkById,
    fetchEndUserTagsList,
    fetchMaterialList
})(CreateLinkTemplate);