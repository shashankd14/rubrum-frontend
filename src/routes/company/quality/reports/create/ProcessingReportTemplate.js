import React, { useEffect, useState } from 'react'
import { Button, Col, Icon, Input, Radio, Row, Select, Modal } from 'antd'
import Dragger from 'antd/lib/upload/Dragger'
import { PROCESSES } from "../../../../../constants/quality/ComponentConstants";
import SlittingForm from '../create/process/SlittingForm';
import CuttingForm from '../create/process/CuttingForm';
import SlitAndCutForm from '../create/process/SlitAndCutForm';
import { connect, useDispatch } from 'react-redux';
import { 
  getQualityPacketDetails,
  fetchQualityReportList,
  fetchQualityReportStageList,
  getCoilPlanDetails
} from "../../../../../appRedux/actions"
import { withRouter } from "react-router-dom";

const ProcessingReportTemplate = (props) => {

  const Option = Select.Option;
  const [templateData, setTemplateData] = useState({
    1: {
      "id": 1,
      "type": "process",
      "value": "",
      "fileName": "",
      "fileList": []
    },
    2: {
      "id": 2,
      "type": "wastageWeight",
      "value": "",
      "fileName": "",
      "fileList": []
    },
    3: {
      "id": 3,
      "type": "processingReport3",
      "value": "Yes",
      "fileName": "",
      "fileList": []
    },
    4: {
      "id": 4,
      "type": "stickers",
      "value": "Yes",
      "fileName": "",
      "fileList": []
    },
    5: {
      "id": 5,
      "type": "customerApproval",
      "value": "",
      "fileName": "",
      "fileList": []
    },
    6: {
      "id": 6,
      "type": "processingReport1",
      "value": "",
      "fileName": "",
      "fileList": []
    },
    7: {
      "id": 7,
      "type": "processingReport2",
      "value": "",
      "fileName": "",
      "fileList": []
    },
    8: {
      "id": 8,
      "type": "processingReport4",
      "value": "",
      "fileName": "",
      "fileList": []
    },
    9: {
      "id": 9,
      "type": "packingRequirements",
      "value": "Yes",
      "fileName": "",
      "fileList": []
    },
    formData: {
      "id": "formData",
      "type": "customerApproval",
      "value": "",
      "fileName": "",
      "fileList": []
    },
    10: {
      "id": 10,
      "type": "qualityEngineer",
      "value": "",
      "fileName": "",
      "fileList": []
    },
    11: {
      "id": 11,
      "type": "qualityHead",
      "value": "",
      "fileName": "",
      "fileList": []
    },
    12: {
      "id": 12,
      "type": "finalJudgement",
      "value": "",
      "fileName": "",
      "fileList": []
    }
  });

  const [isDisabled, setIsDisabled] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const dispatch = useDispatch()

  useEffect(() => {
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
  const [comments, setComment] = useState('');
    const handleCommentChange = (e) => {
            setComment(e.target.value);
            props.onCommentChange(e.target.value);
    };
    useEffect(() => {
        setComment(props.templateDetails.comments)
      }, [props.templateDetails.comments]);

  const onOptionChange = (type, value) => {
    templateData[type].value = value.target ? value.target.value : value
    templateData[type].processId = getProcessId(value);
    setTemplateData({ ...templateData })
  }

  function getProcessId(value) {
    if (value === 'CUTTING') {
      return 1;
    } else if (value === 'SLITTING') {
      return 2;
    } else {
      return 3;
    }
  }
  const createTemplate = () => {
    props.handleCreate(templateData)
  }

  const updateFormData = (formData) => {
    // templateData['formData']['value'] = formData;
    // setShowCreateModal(false);
    if (!templateData['formData']) {
      templateData['formData'] = {};
    }
    templateData['formData']['value'] = formData;
    setShowCreateModal(false);
  }

  const handleCancel = () => {
    //history.goBack(); 
    props.history.push('/company/quality/reports')
  };

const handleClick = () => {
  setShowCreateModal(true);
  const payload = JSON.stringify({
          coilNo : props.location.state.selectedItemForQr.coilNo,
          partDetailsId : props.location.state.selectedItemForQr.planId
      });
      props.getCoilPlanDetails(props.location.state.selectedItemForQr.coilNo);
      dispatch(getQualityPacketDetails(payload));
}

  return (
    <div>
      <Col span={24} className="gx-pt-4">
        <Row>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 15 }}>
              <label>Select Process</label>
              <Select
                id="process"
                style={{ width: "100%" }}
                onChange={(e) => onOptionChange(1, e)}
                disabled={isDisabled}
                value={templateData[1].value}
              >
                {PROCESSES.map((stage) => (
                  <Option key={stage.value} value={stage.value}>
                    {stage.label}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 33 }}>
              {templateData[1].value && <Button
               onClick={handleClick}
              >
                {`Fill ${templateData[1].value.charAt(0).toUpperCase() + templateData[1].value.slice(1).toLowerCase()} Process form first`}
              </Button>}
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 15 }}>
              <label>Enter Wastage Weight</label>
              <Input
                id="wastageWeight"
                onChange={(e) => onOptionChange(2, e)}
                required
                disabled={isDisabled}
                value={templateData[2].value}
              />
            </div>
          </Col>
        </Row>
         <Row>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 45 }}>
              <label>Packing Done</label>
              <Radio.Group onChange={(e) => onOptionChange(9, e)} value={templateData[9].value} disabled={isDisabled}>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row> 

        <Row>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 45 }}>
              <label>Stickers</label>
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
              <label>Customer Approval</label>
              <Input
                id="customerApproval"
                onChange={(e) => onOptionChange(5, e)}
                required
                disabled={isDisabled}
                value={templateData[5].value}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 15 }}>
              {props.action === 'view' && props.templateDetails.processingReport1URL && <img src={props.templateDetails.processingReport1URL} alt="ProcessingReport" style={{ width: 50 }} />}
              {props.action === 'edit' && <> {props.templateDetails.processingReport1URL && <img src={props.templateDetails.processingReport1URL} alt="ProcessingReport" style={{ width: 50 }} />}
                <Dragger
                  name='processingReport1'
                  height={50}
                  beforeUpload={() => false}
                  action=''
                  onChange={(e) => onFilesChange(6, e)}
                // fileList={templateData[1].fileList}
                >
                  <p>
                    <Icon type="upload" />
                    &nbsp;Click or drag img
                  </p>
                </Dragger> </>}
              {props.action === 'create' && <Dragger
                name='processingReport1'
                height={50}
                beforeUpload={() => false}
                action=''
                onChange={(e) => onFilesChange(6, e)}
              // fileList={templateData[1].fileList}
              >
                <p>
                  <Icon type="upload" />
                  &nbsp;Click or drag img
                </p>
              </Dragger>}
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 15 }}>
              {props.action === 'view' && props.templateDetails.processingReport2URL && <img src={props.templateDetails.processingReport2URL} alt="ProcessingReport" style={{ width: 50 }} />}
              {props.action === 'edit' && <> {props.templateDetails.processingReport2URL && <img src={props.templateDetails.processingReport2URL} alt="ProcessingReport" style={{ width: 50 }} />}
                <Dragger
                  name='processingReport2'
                  height={50}
                  beforeUpload={() => false}
                  action=''
                  onChange={(e) => onFilesChange(7, e)}
                // fileList={templateData[1].fileList}
                >
                  <p>
                    <Icon type="upload" />
                    &nbsp;Click or drag img
                  </p>
                </Dragger> </>}
              {props.action === 'create' && <Dragger
                name='processingReport2'
                height={50}
                beforeUpload={() => false}
                action=''
                onChange={(e) => onFilesChange(7, e)}
              // fileList={templateData[1].fileList}
              >
                <p>
                  <Icon type="upload" />
                  &nbsp;Click or drag img
                </p>
              </Dragger>}
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 15 }}>
              {props.action === 'view' && props.templateDetails.processingReport3URL && <img src={props.templateDetails.processingReport3URL} alt="ProcessingReport" style={{ width: 50 }} />}
              {props.action === 'edit' && <> {props.templateDetails.processingReport3URL && <img src={props.templateDetails.processingReport31URL} alt="ProcessingReport" style={{ width: 50 }} />}
                <Dragger
                  name='processingReport3'
                  height={50}
                  beforeUpload={() => false}
                  action=''
                  onChange={(e) => onFilesChange(3, e)}
                // fileList={templateData[1].fileList}
                >
                  <p>
                    <Icon type="upload" />
                    &nbsp;Click or drag img
                  </p>
                </Dragger> </>}
              {props.action === 'create' && <Dragger
                name='processingReport3'
                height={50}
                beforeUpload={() => false}
                action=''
                onChange={(e) => onFilesChange(3, e)}
              // fileList={templateData[1].fileList}
              >
                <p>
                  <Icon type="upload" />
                  &nbsp;Click or drag img
                </p>
              </Dragger>}
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 15 }}>
              {props.action === 'view' && props.templateDetails.processingReport4URL && <img src={props.templateDetails.processingReport4URL} alt="ProcessingReport" style={{ width: 50 }} />}
              {props.action === 'edit' && <> {props.templateDetails.processingReport4URL && <img src={props.templateDetails.processingReport4URL} alt="ProcessingReport" style={{ width: 50 }} />}
                <Dragger
                  name='processingReport4'
                  height={50}
                  beforeUpload={() => false}
                  action=''
                  onChange={(e) => onFilesChange(8, e)}
                // fileList={templateData[1].fileList}
                >
                  <p>
                    <Icon type="upload" />
                    &nbsp;Click or drag img
                  </p>
                </Dragger> </>}
              {props.action === 'create' && <Dragger
                name='processingReport4'
                height={50}
                beforeUpload={() => false}
                action=''
                onChange={(e) => onFilesChange(8, e)}
              // fileList={templateData[1].fileList}
              >
                <p>
                  <Icon type="upload" />
                  &nbsp;Click or drag img
                </p>
              </Dragger>}
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
                <div style={{ display: 'grid', marginTop: 50 }}>
                    <label>Final Judgement:</label>
                </div>
              </Col>
              <Col span={16}>
                <div style={{ display: 'grid', marginTop: 45 }}>
                  <Input
                    id="finalJudgement"
                    onChange={(e) => onOptionChange(12, e)}
                    value={templateData[12].value}
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
                    onChange={(e) => onOptionChange(10, e)}
                    value={templateData[10].value}
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
                    onChange={(e) => onOptionChange(11, e)}
                    value={templateData[11].value}
                    required
                   disabled={isDisabled}
                  /> 
                </div>
            </Col>
        </Row>
        {/* {props.action !== 'view' && <Row >
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
        </Row>} */}
          <Row>
          <div style={{ marginTop: 45 }}>
            {props.action === 'view' ? (
             <Button type="primary" style={{ marginLeft: 8 }} onClick={handleCancel}>
                 Back
            </Button>
           ) : (
            <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
               Cancel
           </Button>
           )}
           {props.action !== 'view' && (
             <Button type="primary" htmlType="submit" onClick={createTemplate} disabled={isDisabled}>
          {props.action === 'create' ? 'Create Report' : 'Update Report'}
           </Button>
         )}
    </div>
  </Row>
      </Col>
      <Modal
        title={`${templateData[1].value.charAt(0).toUpperCase() + templateData[1].value.slice(1).toLowerCase()} Process`}
        style={{top: 20}}
        width={1180}
        visible={showCreateModal}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        onCancel={() => setShowCreateModal(false)}
        destroyOnClose={true}
      >
         {(templateData[1].value==='SLITTING') ? (<SlittingForm onSave={updateFormData}></SlittingForm>
        ) : (templateData[1].value==='CUTTING') ? (
        <CuttingForm onSave={updateFormData}></CuttingForm>
        ) : (
          <SlitAndCutForm onSave={updateFormData}></SlitAndCutForm>
         )}  
      </Modal>
    </div>
  )
}
const mapStateToProps = (state) => ({
    template: state.quality,
});

export default connect(mapStateToProps, {
  fetchQualityReportList,
  fetchQualityReportStageList,
  getCoilPlanDetails
})(withRouter(ProcessingReportTemplate));

//export default ProcessingReportTemplate