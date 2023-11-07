import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Icon, Input, Radio, Row, Select, Modal } from 'antd'
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
import { Link, useLocation, useHistory, withRouter } from "react-router-dom";

const ProcessingReportTemplate = (props) => {

  const Option = Select.Option;
  const history = useHistory();

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
      "type": "packingRequirements",
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
    formData: {
      "id": "formData",
      "type": "customerApproval",
      "value": "",
      "fileName": "",
      "fileList": []
    },
  });

  const [isDisabled, setIsDisabled] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const dispatch = useDispatch()

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
    templateData[type].value = value.target ? value.target.value : value
    console.log(templateData)
    setTemplateData({ ...templateData })
  }

  const createTemplate = () => {
    props.handleCreate(templateData)
  }

  const updateFormData = (formData) => {
    debugger;
    console.log(formData)
    templateData['formData']['value'] = formData;
  }

  const handleCancel = () => {
    debugger;
    //history.goBack(); 
    props.history.push('/company/quality/reports')
  };

const handleClick = () => {
  setShowCreateModal(true);
  console.log(props);
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
                  <Option value={stage.value}>
                    {stage.label}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ display: 'grid', marginTop: 33 }}>
              {/* {templateData[1].value && <Button
              onClick={() =>  history.push(`/company/quality/reports/create/process/${templateData[1].value.toLowerCase()}`)}
              >
                {`FillXXX ${templateData[1].value.charAt(0).toUpperCase() + templateData[1].value.slice(1).toLowerCase()} Process form first`}
              </Button>} */}
              {templateData[1].value && <Button
               // onClick={() => setShowCreateModal(true)}
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
              <label>Packing Requirements</label>
              <Radio.Group onChange={(e) => onOptionChange(3, e)} value={templateData[3].value} disabled={isDisabled}>
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
              {props.action === 'view' && props.templateDetails.packingIntactPreSingedURL && <img src={props.templateDetails.packingIntactPreSingedURL} style={{ width: 50 }} />}
              {props.action === 'edit' && <> {props.templateDetails.packingIntactPreSingedURL && <img src={props.templateDetails.packingIntactPreSingedURL} style={{ width: 50 }} />}
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
                    &nbsp;Click or drag img
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
                  &nbsp;Click or drag img
                </p>
              </Dragger>}
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
        width={1080}
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