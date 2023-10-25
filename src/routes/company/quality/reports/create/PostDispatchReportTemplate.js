import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Icon, Input, Radio, Row } from 'antd'
import Dragger from 'antd/lib/upload/Dragger'
import { useHistory } from 'react-router';

const PostDispatchReportTemplate = (props) => {
  const [templateData, setTemplateData] = useState({
    1: {
      "id": 1,
      "type": "unloadingProper",
      "value": "No",
      "fileName": "",
      "fileList": []
    },
    2: {
      "id": 2,
      "type": "packingDamageTransit",
      "value": "No",
      "fileName": "",
      "fileList": []
    },
    3: {
      "id": 3,
      "type": "acknowledgementReceipt",
      "value": "No",
      "fileName": "",
      "fileList": []
    },
    4: {
      "id": 4,
      "type": "weighment",
      "value": "No",
      "fileName": "",
      "fileList": []
    },

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
              <label>Unloading Improper</label>
              <Radio.Group onChange={(e) => onOptionChange(1, e)} value={templateData[1].value} disabled={isDisabled}>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </div>
          </Col>
          <Col span={8}>
                        <div style={{ display: 'grid', marginTop: 45 }}>
                            {props.action === 'view' && props.templateDetails.unloadingImproperPreSingedURL && <img src={props.templateDetails.unloadingImproperPreSingedURL} alt='unloadingImproper' style={{ width: 50 }} />}
                            {props.action === 'edit' && <> {props.templateDetails.unloadingImproperPreSingedURL && <img src={props.templateDetails.unloadingImproperPreSingedURL} alt='unloadingImproper' style={{ width: 50 }} />}
                                <Dragger
                                    name='packingIntact'
                                    height={50}
                                    beforeUpload={() => false}
                                    action=''
                                    onChange={(e) => onFilesChange(1, e)}
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
                                onChange={(e) => onFilesChange(1, e)}
                            // fileList={templateData[1].fileList}
                            >
                                <p>
                                    <Icon type="upload" />
                                    &nbsp;Click or unloading improper img
                                </p>
                            </Dragger>}
                        </div>
                    </Col>
        </Row>

        <Row>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 45 }}>
              <label>Packing Damage in Transit</label>
              <Radio.Group onChange={(e) => onOptionChange(2, e)} value={templateData[2].value} disabled={isDisabled}>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 45 }}>
              {props.action === 'view' && props.templateDetails.packingIntactPreSingedURL && <img src={props.templateDetails.packingIntactPreSingedURL} alt='packingDamage' style={{ width: 50 }} />}
              {props.action === 'edit' && <> {props.templateDetails.packingIntactPreSingedURL && <img src={props.templateDetails.packingIntactPreSingedURL} alt='packingDamage' style={{ width: 50 }} />}
                <Dragger
                  name='packingIntact'
                  height={50}
                  beforeUpload={() => false}
                  action=''
                  onChange={(e) => onFilesChange(1, e)}
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
                onChange={(e) => onFilesChange(1, e)}
              // fileList={templateData[1].fileList}
              >
                <p>
                  <Icon type="upload" />
                  &nbsp;Click or drag packing damage in transit img 
                </p>
              </Dragger>}
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 45 }}>
              <label>Acknowledgement Receipt</label>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 45 }}>
              {props.action === 'view' && props.templateDetails.ackReceiptPreSingedURL && <img src={props.templateDetails.ackReceiptPreSingedURL} alt='receipt' style={{ width: 50 }} />}
              {props.action === 'edit' && <> {props.templateDetails.ackReceiptPreSingedURL && <img src={props.templateDetails.ackReceiptPreSingedURL} alt='receipt' style={{ width: 50 }} />}
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
                    &nbsp;Click or drag packing intact img
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
                  &nbsp;Click or drag acknowledgement receipt img
                </p>
              </Dragger>}
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 45 }} >
              <label>Weighment</label>
              <Radio.Group onChange={(e) => onOptionChange(4, e)} value={templateData[4].value} disabled={isDisabled}>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 45 }}>
              {props.action === 'view' && props.templateDetails.weighmentPreSingedURL && <img src={props.templateDetails.weighmentPreSingedURL} alt='weighment' style={{ width: 50 }} />}
              {props.action === 'edit' && <> {props.templateDetails.weighmentPreSingedURL && <img src={props.templateDetails.weighmentPreSingedURL} alt='weighment'style={{ width: 50 }} />}
                <Dragger
                  name='packingIntact'
                  height={50}
                  beforeUpload={() => false}
                  action=''
                  onChange={(e) => onFilesChange(4, e)}
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
                onChange={(e) => onFilesChange(4, e)}
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

export default PostDispatchReportTemplate