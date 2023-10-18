import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { Button, Card, Col,  Row, Select,  Tag } from 'antd'
import {
    fetchPartyList,
    fetchKqpList,
    saveKqpLink,
    getKqpLinkById,
    fetchEndUserTagsList,
    fetchMaterialList,
    getThicknessListQM,
    getWidthListQM,
    getLengthListQM,
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
    const [selectedMatGrade, setSelectedMatGrade] = useState ([]);
    const [thickness, setThicknessList] = useState([]);
    const [width, setWidthList] = useState([]);
    const [length, setLengthList] = useState([]);

    useEffect(() => { 
         if (props.match) {
            const urlPaths = props.match.url.split('/')
            console.log(urlPaths)
            setSelectedTemplateId(urlPaths[urlPaths.length - 1])
            if (urlPaths[urlPaths.length - 2] === 'view' || urlPaths[urlPaths.length - 2] === 'edit') {
                setAction(urlPaths[urlPaths.length - 2])
                props.getKqpLinkById(urlPaths[urlPaths.length - 1])
            }
            props.fetchKqpList();
            props.fetchPartyList();
            props.fetchEndUserTagsList();
            props.fetchMaterialList();
            props.getThicknessListQM();
            props.getWidthListQM();
            props.getLengthListQM();
        }
    }, [])

    useEffect(() => {
        if (!props.template.loading && !props.template.error && props.template.operation === 'kqpList') {
            console.log(props.template.data)
            setTemplateList([...props.template.data])
            setSelectedTemplateDetails(selectedTemplateId) 
        }
    }, [props.template.loading, props.template.error, props.template.operation]);

    useEffect(() => {
        if (!props.template.loading && !props.template.error && props.template.operation === 'kqpLinkById') { 
            const jsonData =  props.template.data;
            const groupedData = {};
            jsonData.forEach((item) => {
                const { kqpId, kqpName, partyId, endUserTagIdList, thicknessList, widthList, lengthList, matGradeIdList } = item;
              
                if (!groupedData[kqpId]) {
                  groupedData[kqpId] = {
                    kqpId,
                    kqpName,
                    partyIdList: [],
                    endUserTagIdList:JSON.parse(item.endUserTagIdList),
                    thicknessList:JSON.parse(item.thicknessList),
                    widthList:JSON.parse(item.widthList),
                    lengthList:JSON.parse(item.lengthList),
                    matGradeIdList:JSON.parse(item.matGradeIdList),
                  };
                }
              
                groupedData[kqpId].partyIdList.push(partyId);
              });
              
              const groupedArray = Object.values(groupedData);  
              setSelectedCustomers(groupedArray.map((item) => item.partyIdList).flat());
              setSelectedEndUserTags(groupedArray.map((item) => item.endUserTagIdList).flat());
              setSelectedMatGrade(groupedArray.map((item) => item.matGradeIdList).flat());
              setThicknessList(groupedArray.map((item) => item.thicknessList).flat());
              setWidthList(groupedArray.map((item) => item.widthList).flat())
              setLengthList(groupedArray.map((item) => item.lengthList).flat()) 
        }
    }, [props.template.loading, props.template.error, props.template.operation]); 

    useEffect(() => {
        if (!props.party.loading && !props.party.error) { 
            setPartyList(props.party.partyList)
        }
    }, [props.party.loading, props.party.error]);

    const setSelectedTemplateDetails = (templateId) => {
        const filteredTemplate = props.template.data.filter(t => t.kqpId == templateId)
        setSelectedTemplate(filteredTemplate?.length === 1 ? filteredTemplate[0] : undefined)
        setDefaultSelected(filteredTemplate?.length === 1 ? [filteredTemplate[0].kqpId] : [])
    }

    const handeTemplateChange = (e) => {  
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
        setThicknessList(e);
    }
    const onWidthSelection = (e) => {
        setWidthList(e);
    }
    const onLengthSelection = (e) => {
        setLengthList(e);
    }

    const onCustomerDeselection = (e) => {
          setSelectedCustomers(selectedCustomers.filter(c => c !== e))
    }
    const onMatGradeDeselection = (e) => {
            setSelectedMatGrade(selectedMatGrade.filter(c => c !== e))
    }

    useEffect(() => {
        console.log(partyList.filter((e) => selectedCustomers.includes(e.nPartyId)).map((party) => (
            party
        )))
    }, [selectedCustomers])

    useEffect(() => {
        if (!props.template.loading && !props.template.error && props.template.operation === 'kqpLinkSave') { 
           props.history.push('/company/quality/kqp')
        }
    }, [props.template.loading, props.template.error]);
 

    const createTemplateLink = () => {
        const payload = JSON.stringify({
            kqpId: selectedTemplateId,
            endUserTagIdList: selectedEndUserTags,
            matGradeIdList: selectedMatGrade,
            userId: localStorage.getItem("userId"),
            thicknessList: thickness,
            widthList: width,
            lengthList: length,
            partyIdList: selectedCustomers,
        }) 
        if (action === 'create')
            props.saveKqpLink(payload);
        else if (action === 'edit') { 
            props.saveKqpLink(payload);
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
                                    <label>Material Grade</label>&emsp;
                                 </div>
                                <div>
                                    <Select
                                        id="select"
                                        mode="multiple"
                                        showSearch
                                        style={{ width: '100%' }}
                                        placeholder="Select Material Grade"
                                        optionFilterProp="children" 
                                        maxTagCount={3} 
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
                                    <label>End User Tags</label>
                                </div>
                                <div> 
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
                                        value={thickness}
                                        onChange={onThicknessSelection} 
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
                        <Row>
                            <Col span={12}>
                                <div style={{ marginTop: 30, display: "flex" }}>
                                    <label>Width</label>
                                </div>
                                <div>
                                <Select
                                        id="select"
                                        mode="multiple"
                                        showSearch
                                        style={{ width: '100%' }}
                                        placeholder="Select Width"
                                        optionFilterProp="children"
                                        value={width}
                                        onChange={onWidthSelection} 
                                        maxTagCount={3}
                                        filterOption={(input, option) =>
                                            option.props.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                        allowClear
                                    >
                                        {props?.template?.widthList?.map(width => (
                                        <Select.Option key={width} value={width}>
                                            {width}
                                        </Select.Option>
                                        ))} 
                                    </Select> 
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <div style={{ marginTop: 30, display: "flex" }}>
                                    <label>Length</label>
                                </div>
                                <div>
                                <Select
                                        id="select"
                                        mode="multiple"
                                        showSearch
                                        style={{ width: '100%' }}
                                        placeholder="Select Length"
                                        optionFilterProp="children"
                                        value={length}
                                        onChange={onLengthSelection} 
                                        maxTagCount={3}
                                        filterOption={(input, option) =>
                                            option.props.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        } 
                                        allowClear
                                    >
                                         {props?.template?.lengthList?.map(length => (
                                        <Select.Option key={length} value={length}>
                                            {length}
                                        </Select.Option>
                                        ))} 
                                    </Select> 
                                </div>
                            </Col>
                        </Row>
                    </>
                {action !== 'view' && <Row >
                    <div style={{ marginTop: 45 }}>
                        <Button style={{ marginLeft: 8 }}  onClick={handleCancel}>
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
    material: state.material,
});

export default connect(mapStateToProps, {
    fetchPartyList,
    fetchKqpList,
    saveKqpLink,
    getKqpLinkById,
    fetchEndUserTagsList,
    fetchMaterialList,
    getThicknessListQM,
    getWidthListQM,
    getLengthListQM,
})(CreateLinkTemplate);