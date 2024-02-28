import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Icon, Input, Radio, Row } from 'antd'
import Dragger from 'antd/lib/upload/Dragger'
import { useHistory } from 'react-router';

const PreDispatchReportTemplate = (props) => {
  const [templateData, setTemplateData] = useState({
    1: {
      "id": 1,
      "type": "packingCondition",
      "value": "No",
      "fileName": "",
      "fileList": []
    },
    2: {
      "id": 2,
      "type": "strapping",
      "value": "No",
      "fileName": "",
      "fileList": []
    },
    3: {
      "id": 3,
      "type": "weighmentSlip",
      "value": "No",
      "fileName": "",
      "fileList": []
    },
    4: {
      "id": 4,
      "type": "properLoading",
      "value": "No",
      "fileName": "",
      "fileList": []
    },
    5: {
      "id": 5,
      "type": "byndingTying",
      "value": "No",
      "fileName": "",
      "fileList": []
    },
    6: {
      "id": 6,
      "type": "weighmentQtyMatch",
      "value": "No",
      "fileName": "",
      "fileList": []
    },
    7: {
      "id": 7,
      "type": "ewayBillMatch",
      "value": "",
      "fileName": "",
      "fileList": []
    },
    8: {
      "id": 8,
      "type": "labelsMatch",
      "value": "",
      "fileName": "",
      "fileList": []
    },
    9: {
      "id": 9,
      "type": "qualityEngineer",
      "value": "",
      "fileName": "",
      "fileList": []
    },
    10: {
      "id": 10,
      "type": "qualityHead",
      "value": "",
      "fileName": "",
      "fileList": []
    }
  });

  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    // console.log(props)
    setIsDisabled(props.action === 'view')
    if (props.action !== 'create') {
      const templateDetailsData = JSON.parse(props.templateDetails.templateDetails)
      const val = {};
      templateDetailsData.forEach((td) => {
        val[td.id] = td;
      });
      console.log(val)
      setTemplateData(val)
    }
  }, [props.templateDetails]);

  const onFilesChange = (type, file) => {
    console.log(type, file)
    templateData[type].fileList = file.fileList.slice(-1)
    templateData[type].fileName = templateData[type].fileList[0].name;
    console.log(templateData)
    setTemplateData({ ...templateData })
  }

  const [comments, setComment] = useState('');
    const handleCommentChange = (e) => {
            setComment(e.target.value);
            props.onCommentChange(e.target.value);
    };
    useEffect(() => {
        setComment(props.templateDetails.comments)
      }, [props.templateDetails.comments]);

  const onOptionChange = (type, value) => {
    console.log(type, value)
    templateData[type].value = value.target.value
    console.log(templateData)
    setTemplateData({ ...templateData })
  }

  const createTemplate = () => {
    props.handleCreate(templateData)
  }
  const history = useHistory();
  const handleCancel = () => {
    history.goBack(); 
  };

  return (
    <div>
      <Col span={24} className="gx-pt-4">
        <Row>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 45 }}>
              <label>Packing Condition</label>
              <Radio.Group onChange={(e) => onOptionChange(1, e)} value={templateData[1].value} disabled={isDisabled}>
                <Radio value="ok">Ok</Radio>
                <Radio value="notokay">Not Ok</Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row>

        <Row>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 45 }}>
              <label>Strapping</label>
              <Radio.Group onChange={(e) => onOptionChange(2, e)} value={templateData[2].value} disabled={isDisabled}>
                <Radio value="ok">Ok</Radio>
                <Radio value="notokay">Not Ok</Radio>
              </Radio.Group>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 45 }}>
              {props.action === 'view' && props.templateDetails.strappingPreSingedURL && <img src={props.templateDetails.strappingPreSingedURL} alt='strapping' style={{ width: 50 }} />}
              {props.action === 'edit' && <> {props.templateDetails.strappingPreSingedURL && <img src={props.templateDetails.strappingPreSingedURL} alt='strapping' style={{ width: 50 }} />}
                <Dragger
                  name='packingIntact'
                  height={50}
                  beforeUpload={() => false}
                  action=''
                  onChange={(e) => onFilesChange(2, e)}
                // fileList={templateData[1].fileList}
                >
                  <p>
                    <Icon type="upload" />
                    &nbsp;Click or drag packing intact img
                  </p>
                </Dragger> </>}
              {props.action === 'create' && <Dragger
                name='packingIntact'
                height={50}
                beforeUpload={() => false}
                action=''
                onChange={(e) => onFilesChange(2, e)}
              // fileList={templateData[1].fileList}
              >
                <p>
                  <Icon type="upload" />
                  &nbsp;Click or drag strapping img
                </p>
              </Dragger>}
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 45 }}>
              <label>Weighment Slip</label>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 45 }}>
              {props.action === 'view' && props.templateDetails.weighmentSlipPreSingedURL && <img src={props.templateDetails.weighmentSlipPreSingedURL} alt='weighment' style={{ width: 50 }} />}
              {props.action === 'edit' && <> {props.templateDetails.weighmentSlipPreSingedURL && <img src={props.templateDetails.weighmentSlipPreSingedURL} alt='weighment' style={{ width: 50 }} />}
                <Dragger
                  name='packingIntact'
                  height={50}
                  beforeUpload={() => false}
                  action=''
                  onChange={(e) => onFilesChange(3, e)}
                // fileList={templateData[1].fileList}
                >
                  <p>
                    <Icon type="upload" />
                    &nbsp;Click or drag weighment slip img
                  </p>
                </Dragger> </>}
              {props.action === 'create' && <Dragger
                name='packingIntact'
                height={50}
                beforeUpload={() => false}
                action=''
                onChange={(e) => onFilesChange(3, e)}
              // fileList={templateData[1].fileList}
              >
                <p>
                  <Icon type="upload" />
                  &nbsp;Click or drag weighment slip img
                </p>
              </Dragger>}
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 45 }} >
              <label>Proper Loading</label>
              <Radio.Group onChange={(e) => onOptionChange(4, e)} value={templateData[4].value} disabled={isDisabled}>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 45 }}>
              <label>Binding & Tying in vehicle</label>
              <Radio.Group onChange={(e) => onOptionChange(5, e)} value={templateData[5].value} disabled={isDisabled}>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row>

        <Row>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 45 }}>
              <label>Weighment Qty Matches with Invoice</label>
              <Radio.Group onChange={(e) => onOptionChange(6, e)} value={templateData[6].value} disabled={isDisabled}>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 45 }}>
              <label>Eway Bill Matches with Invoice</label>
              <Radio.Group onChange={(e) => onOptionChange(7, e)} value={templateData[7].value} disabled={isDisabled}>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 45 }}>
              <label>Labels & Stickers Matche with Invoice</label>
              <Radio.Group onChange={(e) => onOptionChange(8, e)} value={templateData[8].value} disabled={isDisabled}>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row>
        <Row>
            <Col span={8}>
                <div style={{ display: 'grid', marginTop: 50 }}>
                    <label>Comment:</label>
                </div>
              </Col>
              <Col span={16}>
                <div style={{ display: 'grid', marginTop: 45 }}>
                  <Input
                    id="comments"
                    onChange={handleCommentChange}
                    value={comments}
                    required
                   disabled={isDisabled}
                  /> 
                </div>
            </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 45 }}>
              <label>Quality Engineer</label>
              <Input
                    id="qualityEngineer"
                    onChange={(e) => onOptionChange(9, e)}
                    value={templateData[9].value}
                    required
                   disabled={isDisabled}
                  /> 
            </div>
          </Col>
          <Col span={8}>
                <div style={{ display: 'grid', marginTop: 45 }}>
                <label>Quality Head</label>
                  <Input
                    id="qualityHead"
                    onChange={(e) => onOptionChange(10, e)}
                    value={templateData[10].value}
                    required
                   disabled={isDisabled}
                  /> 
                </div>
            </Col>
        </Row>
        {props.action !== 'view' && <Row >
          <div style={{ marginTop: 45 }}>
            <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
              Cancel
            </Button>
            {props.action === 'create' ? <Button type="primary" htmlType="submit" onClick={createTemplate} disabled={isDisabled}>
              Create Report
            </Button> :
              <Button type="primary" htmlType="submit" onClick={createTemplate} disabled={isDisabled}>
                Update Report
              </Button>
            }
          </div>
        </Row>}
      </Col>
    </div>
  )
}

export default PreDispatchReportTemplate