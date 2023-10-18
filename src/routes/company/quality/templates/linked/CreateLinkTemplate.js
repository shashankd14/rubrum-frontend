import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { Button, Card, Col, Form, Input, Row, Select, Tabs, Tag } from 'antd'
import {
    fetchPartyList,
    fetchTemplatesList,
    saveQualityTemplateLink,
    getQualityTemplateLinkById,
    updateQualityTemplateLink,
    fetchEndUserTagsList,
    fetchMaterialGrades,
    getThicknessListQM
} from "../../../../../appRedux/actions"
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const CreateLinkTemplate = (props) => {

    const Option = Select.Option;

    const [selectedTemplate, setSelectedTemplate] = useState();
    const [selectedTemplateId, setSelectedTemplateId] = useState();
    const [templateList, setTemplateList] = useState([]);
    const [defaultSelected, setDefaultSelected] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [selectedEndUserTags, setSelectedEndUserTags] = useState([]);
    const [action, setAction] = useState("create");
    const [partyList, setPartyList] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [materialGrades, setMaterialGrades] = useState([]);
    const [thicknessList, setThicknessList] = useState([]);

    useEffect(() => {
        if (props.match) {
            const urlPaths = props.match.url.split('/')
            console.log(urlPaths)
            setSelectedTemplateId(urlPaths[urlPaths.length - 1])
            if (urlPaths[urlPaths.length - 2] === 'view' || urlPaths[urlPaths.length - 2] === 'edit') {
                setAction(urlPaths[urlPaths.length - 2])
                props.getQualityTemplateLinkById(urlPaths[urlPaths.length - 1]);
                
            } else {
                setAction('create');
            }
           
            props.fetchTemplatesList();
            props.fetchPartyList();
            props.fetchEndUserTagsList();
            props.fetchMaterialGrades();
            props.getThicknessListQM();
        }
    }, [])

    useEffect(() => {
        if (!props.template.loading && !props.template.error && props.template.operation === 'templateList') { 
            setTemplateList([...props.template.data])
            setSelectedTemplateDetails(selectedTemplateId)
        }
    }, [props.template.loading, props.template.error, props.template.operation]);

    useEffect(() => {
        if (!props.template.loading && !props.template.error && props.template.operation === 'templateLinkById') {
            const urlPaths = props.match.url.split('/')
                 setSelectedTemplateId(urlPaths[urlPaths.length - 1])
            
            const jsonData =  props.template.data;
            const groupedData = {};
            jsonData.forEach((item) => {
                const { templateId, templateName, partyId, endUserTagIdList, thicknessList,   matGradeIdList } = item;
              
                if (!groupedData[templateId]) {
                  groupedData[templateId] = {
                    templateId,
                    templateName,
                    partyIdList: [],
                    endUserTagIdList:JSON.parse(item.endUserTagIdList),
                    thicknessList:JSON.parse(item.thicknessList), 
                    matGradeIdList:JSON.parse(item.matGradeIdList),
                  };
                } 
                groupedData[templateId].partyIdList.push(partyId);
              });
              
              const groupedArray = Object.values(groupedData);  
              setSelectedCustomers(groupedArray.map((item) => item.partyIdList).flat());
              setSelectedEndUserTags(groupedArray.map((item) => item.endUserTagIdList).flat());
              setThicknessList(groupedArray.map((item) => item.thicknessList).flat());
            setSelectedTemplateDetails(selectedTemplateId)
        }
    }, [props.template.loading, props.template.error, props.template.operation]);

    useEffect(() => {
        if (!props.party.loading && !props.party.error) {
            setPartyList(props.party.partyList)
        }
    }, [props.party.loading, props.party.error]);

    const setSelectedTemplateDetails = (templateId) => {
        const filteredTemplate = props.template.data.filter(t => t.templateId == templateId)
        setSelectedTemplate(filteredTemplate?.length >= 1 ? filteredTemplate[0] : undefined)
        setDefaultSelected(filteredTemplate?.length >=1 ? [filteredTemplate[0].templateId] : [])
    }

    const handeTemplateChange = (e) => {
        console.log(e)
        setSelectedTemplateId(e)
        setSelectedTemplateDetails(e);
    }

    const searchTemplate = (e) => {
        const data = [...props.template.data]
        if (e.length > 2) {
            setTemplateList(data.filter(t => (t.templateId == e || t.templateName.toLowerCase().includes(e.toLowerCase()))))
        } else {
            setTemplateList(data.filter(t => t.templateId == e))
        }

    }

    const onCustomerSelection = (e) => {
        setSelectedCustomers(e)
    }

    const onEnduserTagSelection = (e) => {
        setSelectedEndUserTags(e)
    }
    const onMaterialGradeSelection = (e) => {
        setMaterialGrades(e)
    }
    const onThicknessSelection = (e) => {
        setThicknessList(e)
    }

    const onCustomerDeselection = (e) => {
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
            props.history.push('/company/quality/templates')
        }
    }, [props.template.loading, props.template.error]);

    const createTemplateLink = () => {
        const payload = JSON.stringify({
            templateId: selectedTemplateId,
            endUserTagIdList: selectedEndUserTags,
            matGradeIdList: materialGrades,
            userId: localStorage.getItem("userId"),
            thicknessList: thicknessList,
            partyIdList: selectedCustomers,
        })
        if (action == 'create')
            props.saveQualityTemplateLink(payload);
        else if (action == 'edit') {
            props.saveQualityTemplateLink(payload);
        }
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

    const selectAllOptions = () => {
        const allOptionValues = partyList.map((party) => party.nPartyId);
        setSelectedCustomers(allOptionValues);
      };
   const history = useHistory();
   const handleCancel = () =>{
    history.goBack();
  }
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
                            disabled={(action==="edit")} 
                        >
                            {templateList.map((template) => (
                                <Option key={`${template.templateId}${template.templateName}`} value={template.templateId}>
                                    {template.templateName}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                </Row>
                <Row>
                    <Col span={12}>
                        <label style={{ marginTop: 5, display: "flex" }}>Stage: {selectedTemplate?.stageName}</label>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <div style={{ marginTop: 30, display: "flex" }}>
                            <label>Assign Customer</label>&emsp;
                            <button onClick={selectAllOptions} style={{marginBottom:'5px'}}>Select All</button>
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
                                value={selectedCustomers}
                                // onFocus={handleFocus}
                                // onBlur={handleBlur}
                                maxTagCount={3}
                                filterOption={(input, option) =>
                                    option.props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                allowClear
                            >
                                {partyList.length > 0 &&
                                    partyList.map((party) => (
                                        <Select.Option key={party.nPartyId} value={party.nPartyId}>{party.partyName}</Select.Option>
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
                {selectedTemplate?.stageName === 'PROCESSING' &&
                    <>
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
                                        onChange={onMaterialGradeSelection}
                                        value={materialGrades}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        maxTagCount={3}
                                        filterOption={(input, option) =>
                                            option.props.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                        allowClear
                                    >
                                        {materialOptions}
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <div style={{ marginTop: 30, display: "flex" }}>
                                    <label>End User Tags</label>
                                </div>
                                <div>
                                    <Select
                                        id="endUsertags"
                                        placeholder="Select End User Tag"
                                        showSearch
                                        mode="multiple"
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
                                    <label>Thickness</label>
                                </div>
                                <div>
                                    <Select
                                        id="select"
                                        mode="multiple"
                                        showSearch
                                        style={{ width: '100%' }}
                                        placeholder="Select Thickness"
                                        optionFilterProp="children"
                                        value={thicknessList}
                                        onChange={onThicknessSelection}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        maxTagCount={3}
                                        filterOption={(input, option) =>
                                            option.props.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                        allowClear
                                    >
                                      {props?.template?.thicknessList?.map(thickness => (
                                        <Select.Option key={thickness} value={thickness}>
                                            {thickness}
                                        </Select.Option>
                                        ))}
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                    </>
                }
                {action !== 'view' && <Row >
                    <div style={{ marginTop: 45 }}>
                        {/* <Button style={{ marginLeft: 8 }} disabled={isDisabled}> */}
                        <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
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
    material:state.material
});

export default connect(mapStateToProps, {
    fetchPartyList,
    fetchTemplatesList,
    saveQualityTemplateLink,
    getQualityTemplateLinkById,
    updateQualityTemplateLink,
    fetchEndUserTagsList,
    fetchMaterialGrades,
    getThicknessListQM
})(CreateLinkTemplate);