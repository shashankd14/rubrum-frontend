import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Icon, Input, Radio, Row } from 'antd'
import Dragger from 'antd/lib/upload/Dragger'
import { useHistory } from 'react-router';

const InwardReportTemplate = (props) => {

    const [templateData, setTemplateData] = useState({
        1: {
            "id": 1,
            "type": "packingIntact",
            "value": "Yes",
            "fileName": "",
            "fileList": []
        },
        2: {
            "id": 2,
            "type": "coilBend",
            "value": "No",
            "fileName": "",
            "fileList": []
        },
        3: {
            "id": 3,
            "type": "rustObserved",
            "value": "No",
            "fileName": "",
            "fileList": []
        },
        4: {
            "id": 4,
            "type": "safetyIssues",
            "value": "No",
            "fileName": "",
            "fileList": []
        },
        5: {
            "id": 5,
            "type": "waterExposure",
            "value": "No",
            "fileName": "",
            "fileList": []
        },
        6: {
            "id": 6,
            "type": "wireRopeDamages",
            "value": "No",
            "fileName": "",
            "fileList": []
        }
    });
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        console.log(props)
        setIsDisabled(props.action === 'view')
        if (props.from === "qr") {
            initTemplateForm();
        } else if (props.action !== 'create') {
            initTemplateForm();
        }

    }, [props.templateDetails]);

    const initTemplateForm = () => {
        const templateDetailsData = JSON.parse(props.templateDetails.templateDetails)
        const val = {};
        templateDetailsData.forEach((td) => {
            val[td.id] = td;
        });
        console.log(val)
        setTemplateData(val)
    }

    const [comment, setComment] = useState('');
    const handleCommentChange = (e) => {
        setComment(e.target.value);
        props.onCommentChange(e.target.value);
    };
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
                            <label>Packing Intact</label>
                            <Radio.Group onChange={(e) => onOptionChange(1, e)} value={templateData[1].value} disabled={isDisabled}>
                                <Radio value="Yes">Yes</Radio>
                                <Radio value="No">No</Radio>
                            </Radio.Group>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ display: 'grid', marginTop: 45 }}>
                            {props.action === 'view' && props.templateDetails.packingIntactPreSingedURL && <img src={props.templateDetails.packingIntactPreSingedURL} alt="PackingIntact" style={{ width: 50 }} />}
                            {props.action === 'edit' && <> {props.templateDetails.packingIntactPreSingedURL && <img src={props.templateDetails.packingIntactPreSingedURL} alt="PackingIntact" style={{ width: 50 }} />}
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
                                    &nbsp;Click or drag packing intact img
                                </p>
                            </Dragger>}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <div style={{ display: 'grid', marginTop: 45 }}>
                            <label>Coil Bend</label>
                            <Radio.Group onChange={(e) => onOptionChange(2, e)} value={templateData[2].value} disabled={isDisabled}>
                                <Radio value="Yes">Yes</Radio>
                                <Radio value="No">No</Radio>
                            </Radio.Group>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ display: 'grid', marginTop: 45 }}>
                            {props.action === 'view' && props.templateDetails.coilBendPreSingedURL && <img src={props.templateDetails.coilBendPreSingedURL} alt="CoilBend" style={{ width: 50 }} />}
                            {props.action === 'edit' && <> {props.templateDetails.coilBendPreSingedURL && <img src={props.templateDetails.coilBendPreSingedURL} alt="CoilBend" style={{ width: 50 }} />}
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
                                    &nbsp;Click or drag coil bend img
                                </p>
                            </Dragger>}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <div style={{ display: 'grid', marginTop: 45 }}>
                            <label>Rust Observed</label>
                            <Radio.Group onChange={(e) => onOptionChange(3, e)} value={templateData[3].value} disabled={isDisabled}>
                                <Radio value="Yes">Yes</Radio>
                                <Radio value="No">No</Radio>
                            </Radio.Group>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ display: 'grid', marginTop: 45 }}>
                            {props.action === 'view' && props.templateDetails.rustObservedPreSingedURL && <img src={props.templateDetails.rustObservedPreSingedURL} alt="rustObserved" style={{ width: 50 }} />}
                            {props.action === 'edit' && <> {props.templateDetails.rustObservedPreSingedURL && <img src={props.templateDetails.rustObservedPreSingedURL} alt="rustObserved" style={{ width: 50 }} />}
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
                                    &nbsp;Click or drag rust Observed img
                                </p>
                            </Dragger>}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <div style={{ display: 'grid', marginTop: 45 }} >
                            <label>Saftey Issues</label>
                            <Radio.Group onChange={(e) => onOptionChange(4, e)} value={templateData[4].value} disabled={isDisabled}>
                                <Radio value="Yes">Yes</Radio>
                                <Radio value="No">No</Radio>
                            </Radio.Group>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ display: 'grid', marginTop: 45 }}>
                            {props.action === 'view' && props.templateDetails.safetyIssuesPreSingedURL && <img src={props.templateDetails.safetyIssuesPreSingedURL} alt="safetyIssue" style={{ width: 50 }} />}
                            {props.action === 'edit' && <> {props.templateDetails.safetyIssuesPreSingedURL && <img src={props.templateDetails.safetyIssuesPreSingedURL} alt="safetyIssue" style={{ width: 50 }} />}
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
                                    &nbsp;Click or drag safety issue img
                                </p>
                            </Dragger>}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <div style={{ display: 'grid', marginTop: 45 }}>
                            <label>Water Exposure</label>
                            <Radio.Group onChange={(e) => onOptionChange(5, e)} value={templateData[5].value} disabled={isDisabled}>
                                <Radio value="Yes">Yes</Radio>
                                <Radio value="No">No</Radio>
                            </Radio.Group>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ display: 'grid', marginTop: 45 }}>
                            {props.action === 'view' && props.templateDetails.waterExposurePreSingedURL && <img src={props.templateDetails.waterExposurePreSingedURL} alt="waterExposure" style={{ width: 50 }} />}
                            {props.action === 'edit' && <> {props.templateDetails.waterExposurePreSingedURL && <img src={props.templateDetails.waterExposurePreSingedURL} alt="waterExposure" style={{ width: 50 }} />}
                                <Dragger
                                    name='packingIntact'
                                    height={50}
                                    beforeUpload={() => false}
                                    action=''
                                    onChange={(e) => onFilesChange(5, e)}
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
                                onChange={(e) => onFilesChange(5, e)}
                            // fileList={templateData[1].fileList}
                            >
                                <p>
                                    <Icon type="upload" />
                                    &nbsp;Click or drag water exposure img
                                </p>
                            </Dragger>}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <div style={{ display: 'grid', marginTop: 45 }}>
                            <label>Wire Rope Damages</label>
                            <Radio.Group onChange={(e) => onOptionChange(6, e)} value={templateData[6].value} disabled={isDisabled}>
                                <Radio value="Yes">Yes</Radio>
                                <Radio value="No">No</Radio>
                            </Radio.Group>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ display: 'grid', marginTop: 45 }}>
                            {props.action === 'view' && props.templateDetails.wireRopeDamagesPreSingedURL && <img src={props.templateDetails.wireRopeDamagesPreSingedURL} alt="wirwRopeDamage" style={{ width: 50 }} />}
                            {props.action === 'edit' && <> {props.templateDetails.wireRopeDamagesPreSingedURL && <img src={props.templateDetails.wireRopeDamagesPreSingedURL} alt="wirwRopeDamage" style={{ width: 50 }} />}
                                <Dragger
                                    name='packingIntact'
                                    height={50}
                                    beforeUpload={() => false}
                                    action=''
                                    onChange={(e) => onFilesChange(6, e)}
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
                                onChange={(e) => onFilesChange(6, e)}
                            // fileList={templateData[1].fileList}
                            >
                                <p>
                                    <Icon type="upload" />
                                    &nbsp;Click or drag wire rope damage img
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
                                id="comment"
                                onChange={handleCommentChange}
                                value={comment}
                                required
                               // disabled={isDisabled}
                            /> 
                        </div>
                    </Col>
                </Row>

                {props.action !== 'view' && <Row >
                    <div style={{ marginTop: 45 }}>
                        <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
                            Cancel
                        </Button>
                        {props.from && props.from === "qr" ? props.action === 'create' ? <Button type="primary" htmlType="submit" onClick={createTemplate} disabled={isDisabled}>
                            Create Report
                        </Button> : <Button type="primary" htmlType="submit" onClick={createTemplate} disabled={isDisabled}>
                            Update Report
                        </Button>
                            : props.action === 'create' ? <Button type="primary" htmlType="submit" onClick={createTemplate} disabled={isDisabled}>
                                Create Template
                            </Button> : <Button type="primary" htmlType="submit" onClick={createTemplate} disabled={isDisabled}>
                                Update Template
                            </Button>
                        }
                    </div>
                </Row>}
            </Col>
        </div>
    )
}

export default InwardReportTemplate