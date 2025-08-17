import React, { useEffect, useState } from 'react'
import { Button, Col, Icon, Radio, Row } from 'antd'
import Dragger from 'antd/lib/upload/Dragger'

const PreDispatchTemplate = (props) => {
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
      setTemplateData(val)
    }
  }, [props.templateDetails]);

  const onFilesChange = (type, file) => {
    templateData[type].fileList = file.fileList.slice(-1)
    templateData[type].fileName = templateData[type].fileList[0].name;
    setTemplateData({ ...templateData })
  }

  const onOptionChange = (type, value) => {
    templateData[type].value = value.target.value
    setTemplateData({ ...templateData })
  }

  const createTemplate = () => {
    props.handleCreate(templateData)
  }

  return (
    <div>
      <Col span={24} className="gx-pt-4">
        <Row>
          <Col span={8}>
            <div style={{ display: "grid", marginTop: 45 }}>
              <label>Packing Condition</label>
              <Radio.Group
                onChange={(e) => onOptionChange(1, e)}
                value={templateData[1].value}
                disabled={isDisabled}
              >
                <Radio value="ok">Ok</Radio>
                <Radio value="notokay">Not Ok</Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row>

        <Row>
          <Col span={8}>
            <div style={{ display: "grid", marginTop: 45 }}>
              <label>Strapping</label>
              <Radio.Group
                onChange={(e) => onOptionChange(2, e)}
                value={templateData[2].value}
                disabled={isDisabled}
              >
                <Radio value="ok">Ok</Radio>
                <Radio value="notokay">Not Ok</Radio>
              </Radio.Group>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ display: "grid", marginTop: 45 }}>
              {props.action === "view" &&
                props.templateDetails.strappingPreSingedURL && (
                  <img
                    alt=""
                    src={props.templateDetails.strappingPreSingedURL}
                    style={{ width: 50 }}
                  />
                )}
              {props.action === "edit" && (
                <>
                  {" "}
                  {props.templateDetails.strappingPreSingedURL && (
                    <img
                      alt=""
                       src={props.templateDetails.strappingPreSingedURL}
                      style={{ width: 50 }}
                    />
                  )}
                  <Dragger
                    name="packingIntact"
                    height={50}
                    beforeUpload={() => false}
                    action=""
                    onChange={(e) => onFilesChange(2, e)}
                    // fileList={templateData[1].fileList}
                  >
                    <p>
                      <Icon type="upload" />
                      &nbsp;Click or drag packing intact img
                    </p>
                  </Dragger>{" "}
                </>
              )}
              {props.action === "create" && (
                <Dragger
                  name="packingIntact"
                  height={50}
                  beforeUpload={() => false}
                  action=""
                  onChange={(e) => onFilesChange(2, e)}
                  // fileList={templateData[1].fileList}
                >
                  <p>
                    <Icon type="upload" />
                    &nbsp;Click or drag strapping img
                  </p>
                </Dragger>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div style={{ display: "grid", marginTop: 45 }}>
              <label>Weighment Slip</label>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ display: "grid", marginTop: 45 }}>
              {props.action === "view" &&
                props.templateDetails.weighmentSlipPreSingedURL && (
                  <img
                    alt=""
                    src={props.templateDetails.weighmentSlipPreSingedURL}
                    style={{ width: 50 }}
                  />
                )}
              {props.action === "edit" && (
                <>
                  {" "}
                  {props.templateDetails.weighmentSlipPreSingedURL && (
                    <img
                      alt=""
                      src={props.templateDetails.weighmentSlipPreSingedURL}
                      style={{ width: 50 }}
                    />
                  )}
                  <Dragger
                    name="packingIntact"
                    height={50}
                    beforeUpload={() => false}
                    action=""
                    onChange={(e) => onFilesChange(3, e)}
                    // fileList={templateData[1].fileList}
                  >
                    <p>
                      <Icon type="upload" />
                      &nbsp;Click or drag packing intact img
                    </p>
                  </Dragger>{" "}
                </>
              )}
              {props.action === "create" && (
                <Dragger
                  name="packingIntact"
                  height={50}
                  beforeUpload={() => false}
                  action=""
                  onChange={(e) => onFilesChange(3, e)}
                  // fileList={templateData[1].fileList}
                >
                  <p>
                    <Icon type="upload" />
                    &nbsp;Click or drag weighment slip img
                  </p>
                </Dragger>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div style={{ display: "grid", marginTop: 45 }}>
              <label>Proper Loading</label>
              <Radio.Group
                onChange={(e) => onOptionChange(4, e)}
                value={templateData[4].value}
                disabled={isDisabled}
              >
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div style={{ display: "grid", marginTop: 45 }}>
              <label>Binding & Tying in vehicle</label>
              <Radio.Group
                onChange={(e) => onOptionChange(5, e)}
                value={templateData[5].value}
                disabled={isDisabled}
              >
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row>

        <Row>
          <Col span={8}>
            <div style={{ display: "grid", marginTop: 45 }}>
              <label>Weighment Qty Matches with Invoice</label>
              <Radio.Group
                onChange={(e) => onOptionChange(6, e)}
                value={templateData[6].value}
                disabled={isDisabled}
              >
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div style={{ display: "grid", marginTop: 45 }}>
              <label>Eway Bill Matches with Invoice</label>
              <Radio.Group
                onChange={(e) => onOptionChange(7, e)}
                value={templateData[7].value}
                disabled={isDisabled}
              >
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div style={{ display: "grid", marginTop: 45 }}>
              <label>Labels & Stickers Matche with Invoice</label>
              <Radio.Group
                onChange={(e) => onOptionChange(8, e)}
                value={templateData[8].value}
                disabled={isDisabled}
              >
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row>
        {props.action !== "view" && (
          <Row>
            <div style={{ marginTop: 45 }}>
              <Button style={{ marginLeft: 8 }} disabled={isDisabled}>
                Cancel
              </Button>
              {props.action === "create" ? (
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={createTemplate}
                  disabled={isDisabled}
                >
                  Create Template
                </Button>
              ) : (
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={createTemplate}
                  disabled={isDisabled}
                >
                  Update Template
                </Button>
              )}
            </div>
          </Row>
        )}
      </Col>
    </div>
  );
}

export default PreDispatchTemplate