import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Card, Col, Row, Select, Tag, Checkbox, Input } from 'antd';
import {
  fetchPartyList,
  fetchKqpList,
  saveKqpLink,
  getKqpLinkById,
  fetchEndUserTagsList,
  fetchMaterialList,
  // getThicknessListQM,
  // getWidthListQM,
  // getLengthListQM,
} from '../../../../../appRedux/actions';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const CreateLinkTemplate = props => {
  const Option = Select.Option;
  const [selectedTemplate, setSelectedTemplate] = useState();
  const [selectedTemplateId, setSelectedTemplateId] = useState();
  const [templateList, setTemplateList] = useState([]);
  const [defaultSelected, setDefaultSelected] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectedEndUserTags, setSelectedEndUserTags] = useState([]);
  const [action, setAction] = useState('create');
  const [partyList, setPartyList] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedMatGrade, setSelectedMatGrade] = useState([]);
  const [thickness, setThicknessList] = useState([]);
  const [width, setWidthList] = useState([]);
  const [length, setLengthList] = useState([]);
  const [anyThicknessFlag, setAnyThicknessFlag] = useState(
    props.template?.data?.anyThicknessFlag === 'N',
  );
  const [anyLengthFlag, setAnyLengthFlag] = useState(
    props.template.data?.anyLengthFlag === 'N',
  );
  const [anyWidthFlag, setAnyWidthFlag] = useState(
    props.template.data?.anyWidthFlag === 'N',
  );
  const [anyMatGradeFlag, setanyMatGradeFlag] = useState(
    props.template.data?.anyMatGradeFlag === 'N',
  );
  const [anyEndusertagFlag, setanyEndusertagFlag] = useState(
    props.template?.data?.anyEndusertagFlag === 'N',
  );
  const [anyPartyFlag, setanyPartyFlag] = useState(
    props.template?.data?.anyPartyFlag === 'N',
  );

  useEffect(() => {
    if (props.match) {
      const urlPaths = props.match.url.split('/');
      setSelectedTemplateId(urlPaths[urlPaths.length - 1]);
      if (
        urlPaths[urlPaths.length - 2] === 'view' ||
        urlPaths[urlPaths.length - 2] === 'edit'
      ) {
        setAction(urlPaths[urlPaths.length - 2]);
        props.getKqpLinkById(urlPaths[urlPaths.length - 1]);
      }
      props.fetchKqpList();
      props.fetchPartyList();
      props.fetchEndUserTagsList();
      props.fetchMaterialList();
      // props.getThicknessListQM();
      // props.getWidthListQM();
      // props.getLengthListQM();
    }
  }, []);

  useEffect(() => {
    if (
      !props.template.loading &&
      !props.template.error &&
      props.template.operation === 'kqpList'
    ) {
      setTemplateList([...props.template.data]);
      setSelectedTemplateDetails(selectedTemplateId);
    }
  }, [props.template.loading, props.template.error, props.template.operation]);

  useEffect(() => {
    if (
      !props.template.loading &&
      !props.template.error &&
      props.template.operation === 'kqpLinkById' &&
      props.party.partyList
    ) {
      const jsonData = props.template.data;
      const groupedData = {};
      jsonData.forEach(item => {
        const {
          kqpId,
          kqpName,
          partyId,
          partyIdList,
          anyThicknessFlag,
          anyLengthFlag,
          anyWidthFlag,
          anyPartyFlag,
          anyEndusertagFlag,
          anyMatGradeFlag,
        } = item;

        setAnyThicknessFlag(anyThicknessFlag === 'Y');
        setAnyLengthFlag(anyLengthFlag === 'Y');
        setAnyWidthFlag(anyWidthFlag === 'Y');
        setanyPartyFlag(anyPartyFlag === 'Y');
        setanyEndusertagFlag(anyEndusertagFlag === 'Y');
        setanyMatGradeFlag(anyMatGradeFlag === 'Y');

        if (!groupedData[kqpId]) {
          groupedData[kqpId] = {
            kqpId,
            kqpName,
            partyIdList: [],
            endUserTagIdList: JSON.parse(item.endUserTagIdList),
            thicknessList: JSON.parse(item.thicknessList),
            widthList: JSON.parse(item.widthList),
            lengthList: JSON.parse(item.lengthList),
            matGradeIdList: JSON.parse(item.matGradeIdList),
            anyThicknessFlag: anyThicknessFlag ? 'Y' : 'N',
            anyLengthFlag: anyLengthFlag ? 'Y' : 'N',
            anyWidthFlag: anyWidthFlag ? 'Y' : 'N',
            anyPartyFlag: anyPartyFlag ? 'Y' : 'N',
            anyEndusertagFlag: anyEndusertagFlag ? 'Y' : 'N',
            anyMatGradeFlag: anyMatGradeFlag ? 'Y' : 'N',
          };
        }

        // groupedData[kqpId].partyIdList.push(partyIdList);
        groupedData[kqpId].partyIdList.push(...JSON.parse(partyIdList));
      });

      const groupedArray = Object.values(groupedData);

      // Match nPartyId with partyIdList and display partyName
      const matchedParties = props.party.partyList
        ?.map(party => {
          const matchedParty = groupedArray.find(item =>
            item.partyIdList.includes(party.nPartyId),
          );
          if (matchedParty) {
            return {
              nPartyId: party.nPartyId,
              partyName: party.partyName || null,
            };
          }
          return null;
        })
        .filter(Boolean);
      setSelectedCustomers(matchedParties.map(party => party.nPartyId).flat());
      setSelectedEndUserTags(
        groupedArray.map(item => item.endUserTagIdList).flat(),
      );
      setSelectedMatGrade(groupedArray.map(item => item.matGradeIdList).flat());
      setThicknessList(groupedArray.map(item => item.thicknessList).flat());
      setWidthList(groupedArray.map(item => item.widthList).flat());
      setLengthList(groupedArray.map(item => item.lengthList).flat());
    }
  }, [
    props.template.loading,
    props.template.error,
    props.template.operation,
    props.party,
  ]);

  useEffect(() => {
    if (!props.party.loading && !props.party.error) {
      setPartyList(props.party.partyList);
    }
  }, [props.party.loading, props.party.error]);

  const setSelectedTemplateDetails = templateId => {
    const filteredTemplate = props.template.data.filter(
      t => t.kqpId == templateId,
    );
    setSelectedTemplate(
      filteredTemplate?.length === 1 ? filteredTemplate[0] : undefined,
    );
    setDefaultSelected(
      filteredTemplate?.length === 1 ? [filteredTemplate[0].kqpId] : [],
    );
  };

  const handeTemplateChange = e => {
    setSelectedTemplateId(e);
    setSelectedTemplateDetails(e);
  };

  const searchTemplate = e => {
    const data = [...props.template.data];
    if (e.length > 2) {
      setTemplateList(
        data.filter(
          t =>
            t.kqpId == e || t.kqpName.toLowerCase().includes(e.toLowerCase()),
        ),
      );
    } else {
      setTemplateList(data.filter(t => t.kqpId == e));
    }
  };

  const onCustomerSelection = e => {
    setSelectedCustomers(e);
  };

  const onEnduserTagSelection = e => {
    setSelectedEndUserTags(e);
  };

  const onMatGradeSelection = e => {
    setSelectedMatGrade(e);
  };

  const onThicknessSelection = e => {
    setThicknessList(e);
  };
  const handleThicknessChange = e => {
    setThicknessList(e.target.value);
  };
  const handleWidthChange = e => {
    setWidthList(e.target.value);
  };
  const handleLengthChange = e => {
    setLengthList(e.target.value);
  };
  const onWidthSelection = e => {
    setWidthList(e);
  };
  const onLengthSelection = e => {
    setLengthList(e);
  };

  const onCustomerDeselection = e => {
    setSelectedCustomers(selectedCustomers.filter(c => c !== e));
  };
  const onMatGradeDeselection = e => {
    setSelectedMatGrade(selectedMatGrade.filter(c => c !== e));
  };

  useEffect(() => {
    console.log(
      partyList
        .filter(e => selectedCustomers.includes(e.nPartyId))
        .map(party => party),
    );
  }, [selectedCustomers]);

  useEffect(() => {
    if (
      !props.template.loading &&
      !props.template.error &&
      props.template.operation === 'kqpLinkSave'
    ) {
      props.history.push('/company/quality/kqp');
    }
  }, [props.template.loading, props.template.error]);

  const createTemplateLink = () => {
    let thicknessValues = [];
    let widthValues = [];
    let lengthValues = [];
    if (typeof thickness === 'string') {
      thicknessValues = thickness
        .split(',')
        .map(value => parseFloat(value.trim()));
    } else {
      thicknessValues = [...thickness];
    }
    if (typeof width === 'string') {
      widthValues = width.split(',').map(value => parseFloat(value.trim()));
    } else {
      widthValues = [...width];
    }
    if (typeof length === 'string') {
      lengthValues = length.split(',').map(value => parseFloat(value.trim()));
    } else {
      lengthValues = [...length];
    }
    console.log('thickness before create', thicknessValues);
    let payload = JSON.stringify({
      kqpId: selectedTemplateId,
      endUserTagIdList: selectedEndUserTags,
      matGradeIdList: selectedMatGrade,
      userId: localStorage.getItem('userId'),
      thicknessList: thicknessValues,
      widthList: widthValues,
      lengthList: lengthValues,
      partyIdList: selectedCustomers,
      anyThicknessFlag: anyThicknessFlag ? 'Y' : 'N',
      anyLengthFlag: anyLengthFlag ? 'Y' : 'N',
      anyWidthFlag: anyWidthFlag ? 'Y' : 'N',
      anyPartyFlag: anyPartyFlag ? 'Y' : 'N',
      anyEndusertagFlag: anyEndusertagFlag ? 'Y' : 'N',
      anyMatGradeFlag: anyMatGradeFlag ? 'Y' : 'N',
    });
    if (action === 'create') props.saveKqpLink(payload);
    else if (action === 'edit') {
      props.saveKqpLink(payload);
    }
  };

  const [materialOptions, setMaterialOptions] = useState([]);
  useEffect(() => {
    const options = props.material.materialList.flatMap(item =>
      item.materialGrade.map(grade => (
        <Option key={grade.gradeId} value={grade.gradeId}>
          {grade.gradeName}
        </Option>
      )),
    );
    setMaterialOptions(options);
  }, [props.material.materialList]);

  const selectAllCustomers = () => {
    const allOptionValues = partyList.map(party => party.nPartyId);
    setSelectedCustomers(allOptionValues);
  };
  const selectAllEndUserTags = () => {
    const allOptionValues = props.packetClassification?.endUserTags.map(
      tag => tag.tagId,
    );
    setSelectedEndUserTags(allOptionValues);
  };
  const selectAllMaterialGrades = () => {
    const allOptionValues = props.material?.materialList.flatMap(item =>
      item.materialGrade.map(grade => grade.gradeId),
    );
    setSelectedMatGrade(allOptionValues);
  };
  const selectAllThickness = () => {
    const allOptionValues = props.template?.thicknessList;
    setThicknessList(allOptionValues);
  };
  const selectAllWidth = () => {
    const allOptionValues = props.template?.widthList;
    setWidthList(allOptionValues);
  };
  const selectAllLength = () => {
    const allOptionValues = props.template?.lengthList;
    setLengthList(allOptionValues);
  };
  const history = useHistory();
  const handleCancel = () => {
    history.goBack();
  };
  const allGradeList = props.material?.materialList.flatMap(item =>
    item.materialGrade.map(grade => grade.gradeId),
  );
  return (
    <div>
      <Card title="Link KQP">
        <Row>
          <Col span={12}>
            <label>Qty Template Id/Template Name</label>
            <Select
              showSearch
              id="stage"
              style={{ width: '100%' }}
              onChange={handeTemplateChange}
              value={defaultSelected}
              onSearch={searchTemplate}
              disabled={action === 'edit'}
            >
              {templateList.map(template => (
                <Option
                  key={`${template.kqpId}${template.kqpName}`}
                  value={template.kqpId}
                >
                  {template.kqpName}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <div style={{ marginTop: 30, display: 'flex' }}>
              <label>Assign Customer</label>
              {/* <button onClick={selectAllCustomers} style={{marginBottom:'5px'}}>Select All</button> */}
              &emsp;&emsp;&emsp; <label>Select All</label>&nbsp;
              <Checkbox
                id="allOptions"
                checked={selectedCustomers.length === partyList.length}
                onChange={selectAllCustomers}
                disabled={anyPartyFlag}
              />
              &emsp;&emsp;&emsp; <label>Any</label>&nbsp;
              <Checkbox
                id="anyPartyFlag"
                checked={anyPartyFlag}
                onChange={e => setanyPartyFlag(e.target.checked)}
              />
            </div>
            <div>
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
                  partyList.map(party => (
                    <Select.Option
                      value={party.nPartyId}
                      disabled={anyPartyFlag}
                    >
                      {party.partyName}
                    </Select.Option>
                  ))}
              </Select>
            </div>
          </Col>
          <Col span={12}>
            <div id="custTags" style={{ marginTop: 30, display: 'flex' }}>
              {partyList.length > 0 &&
                selectedCustomers.length > 0 &&
                partyList
                  .filter(e => selectedCustomers.includes(e.nPartyId))
                  .map(party => (
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
              <div style={{ marginTop: 30, display: 'flex' }}>
                <label>Material Grade</label>
                &emsp;&emsp;&emsp; <label>Select All</label>&nbsp;
                <Checkbox
                  id="allOptions"
                  checked={selectedMatGrade.length === allGradeList.length}
                  onChange={selectAllMaterialGrades}
                  disabled={anyMatGradeFlag}
                />
                &emsp;&emsp;&emsp; <label>Any</label>&nbsp;
                <Checkbox
                  id="anyMatGradeFlag"
                  checked={anyMatGradeFlag}
                  onChange={e => setanyMatGradeFlag(e.target.checked)}
                />
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
                    return option?.props?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                  filterSort={(optionA, optionB) =>
                    optionA?.props?.children
                      .toLowerCase()
                      .localeCompare(optionB?.props?.children.toLowerCase())
                  }
                  onChange={onMatGradeSelection}
                  value={selectedMatGrade}
                  disabled={anyMatGradeFlag}
                  allowClear
                >
                  {materialOptions}
                </Select>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <div style={{ marginTop: 30, display: 'flex' }}>
                <label>End User Tag</label>
                &emsp;&emsp;&emsp; <label>Select All</label>&nbsp;
                <Checkbox
                  id="allOptions"
                  checked={
                    selectedEndUserTags.length ===
                    props.packetClassification.endUserTags.length
                  }
                  onChange={selectAllEndUserTags}
                  disabled={anyEndusertagFlag}
                />
                &emsp;&emsp;&emsp; <label>Any</label>&nbsp;
                <Checkbox
                  id="anyEndusertagFlag"
                  checked={anyEndusertagFlag}
                  onChange={e => setanyEndusertagFlag(e.target.checked)}
                />
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
                    return option?.props?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                  filterSort={(optionA, optionB) =>
                    optionA?.props?.children
                      .toLowerCase()
                      .localeCompare(optionB?.props?.children.toLowerCase())
                  }
                  onChange={onEnduserTagSelection}
                  value={selectedEndUserTags}
                  allowClear
                >
                  {props?.packetClassification?.endUserTags?.map(item => {
                    return (
                      <Option
                        kay={item?.tagId}
                        value={item?.tagId}
                        disabled={anyEndusertagFlag}
                      >
                        {item.tagName}
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <div style={{ marginTop: 30, display: 'flex' }}>
                <label>Thickness</label>
                &emsp;&emsp;&emsp; <label>Any</label>&nbsp;
                <Checkbox
                  id="anyThicknessFlag"
                  checked={anyThicknessFlag}
                  onChange={e => setAnyThicknessFlag(e.target.checked)}
                />
              </div>
              <div>
                <Input
                  id="thickness"
                  placeholder="Enter thickness"
                  value={thickness}
                  onChange={handleThicknessChange}
                  disabled={anyThicknessFlag}
                />
              </div>

              {/* &emsp;&emsp;&emsp; <label>Select All</label>&nbsp; 
                                    <Checkbox
                                        id="allOptions"
                                        checked={thickness.length===props.template.thicknessList.length}
                                        onChange={selectAllThickness}
                                        disabled = {anyThicknessFlag}
                                    />
                                  &emsp;&emsp;&emsp; <label>Any</label>&nbsp; 
                                    <Checkbox
                                        id="anyThicknessFlag"
                                        checked={anyThicknessFlag}
                                        onChange={(e) => setAnyThicknessFlag(e.target.checked)}
                                    />
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
                                        <Select.Option key={thickness} value={thickness} disabled={anyThicknessFlag}>
                                            {thickness}
                                        </Select.Option>
                                        ))} 
                                    </Select>*/}
              {/* </div>    */}
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <div style={{ marginTop: 30, display: 'flex' }}>
                <label>Width</label>
                &emsp;&emsp;&emsp; <label>Any</label>&nbsp;
                <Checkbox
                  id="anyWidthFlag"
                  checked={anyWidthFlag}
                  onChange={e => setAnyWidthFlag(e.target.checked)}
                />
              </div>
              <div>
                <Input
                  id="width"
                  placeholder="Enter Width"
                  value={width}
                  onChange={handleWidthChange}
                  disabled={anyWidthFlag}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <div style={{ marginTop: 30, display: 'flex' }}>
                <label>Length</label>
                &emsp;&emsp;&emsp; <label>Any</label>&nbsp;
                <Checkbox
                  id="anyLengthFlag"
                  checked={anyLengthFlag}
                  onChange={e => setAnyLengthFlag(e.target.checked)}
                />
              </div>
              <div>
                <Input
                  id="length"
                  value={length}
                  placeholder="Enter Length"
                  onChange={handleLengthChange}
                  disabled={anyLengthFlag}
                />
              </div>
            </Col>
          </Row>
        </>
        {action !== 'view' && (
          <Row>
            <div style={{ marginTop: 45 }}>
              <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
                Cancel
              </Button>
              {action === 'create' ? (
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={createTemplateLink}
                  disabled={isDisabled}
                >
                  Link Template
                </Button>
              ) : (
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={createTemplateLink}
                  disabled={isDisabled}
                >
                  Update Link
                </Button>
              )}
            </div>
          </Row>
        )}
      </Card>
    </div>
  );
};
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
  // getThicknessListQM,
  // getWidthListQM,
  // getLengthListQM,
})(CreateLinkTemplate);
