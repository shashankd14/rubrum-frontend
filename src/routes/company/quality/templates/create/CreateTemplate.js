import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { Card, Input, Select } from 'antd'
import IntlMessages from '../../../../../util/IntlMessages'
import { STAGES } from "../../../../../constants/quality/ComponentConstants";
import InwardTemplate from "./InwardTemplate";
import PreProcessingTemplate from "./PreProcessingTemplate";
import ProcessingTemplate from "./ProcessingTemplate";
import PreDispatchTemplate from "./PreDispatchTemplate";
import PostDispatchTemplate from "./PostDispatchTemplate";
import { 
    saveQualityTemplate, 
    getQualityTemplateById,
    updateQualityTemplate,
 } from "../../../../../appRedux/actions"


const CreateTemplate = (props) => {

    const [templateName, setTemplateName] = useState("");
    const [templateNameErr, setTemplateNameErr] = useState(false);
    const [stageName, setStageName] = useState("");
    const [action, setAction] = useState("create");
    const [templateDetails, setTemplateDetails] = useState("");

    const Option = Select.Option;

    useEffect(() => {
        if (props.match) {
            const urlPaths = props.match.url.split('/')
            if (urlPaths[urlPaths.length - 2] === 'view' || urlPaths[urlPaths.length - 2] === 'edit') {
                setAction(urlPaths[urlPaths.length - 2])
                props.getQualityTemplateById(urlPaths[urlPaths.length - 1])
            }
        }
    }, [props.match])

    useEffect(() => {
        if (!props.templateDetails.loading && !props.templateDetails.error && props.templateDetails.operation === 'templateById') {
            setTemplateName(props.templateDetails.data.templateName);
            setStageName(props.templateDetails.data.stageName?.toUpperCase())
            setTemplateDetails(props.templateDetails.data)
        }
    }, [props.templateDetails.loading, props.templateDetails.error]);

    const handeStageChange = (value) => {
        setStageName(value);
    }

    const handeTemplateNameChange = (e) => {
        setTemplateName(e.target.value);
        setTemplateNameErr(false)
    }

    const handleCreate = (data) => {
        if (!templateName || templateName === "") {
            setTemplateNameErr(true);
            document.getElementById('templateName').focus();
            return;
        }
        let request = new FormData();
        const templateDetails = []
        Object.keys(data).forEach(key => {
            const dataDetail = data[key];
            if (dataDetail?.fileList?.length > 0 && dataDetail.fileList[0]) {
                request.append(dataDetail.type, dataDetail.fileList[0].originFileObj);
            }
            templateDetails.push({
                "id": key,
                "type": dataDetail.type,
                "value": dataDetail.value,
                "fileName": dataDetail?.fileList?.length > 0 ? dataDetail.fileName : "",
            })
        })
        if(props.templateDetails.data.templateId) {
            request.append("templateId", props.templateDetails.data.templateId);
        }
        request.append("templateName", templateName);
        request.append("stageName", stageName);
        request.append("userId", localStorage.getItem("userId").toString());
        request.append("templateDetails", JSON.stringify(templateDetails));
        if(action === 'create')
            props.saveQualityTemplate(request);
        else if(action === 'edit')
            props.updateQualityTemplate(request);
        props.history.push('/company/quality/templates')
    }

    return (
        <div>
            <h1>
                <IntlMessages id="quality.templates.create.new" />
            </h1>
            <Card>
                <div className="gx-flex-row gx-flex-1">
                    <div className="table-operations gx-col">
                        <label>Template Name </label>
                        <Input
                            id="templateName"
                            onChange={handeTemplateNameChange}
                            required
                            value={templateName}
                            disabled={action !== "create"}
                        />
                        {templateNameErr && <p style={{ color: "red" }}>Please enter Template Name</p>}
                    </div>
                    <div className="gx-w-50">
                        <label>Stage Name</label>
                        <Select
                            id="stage"
                            style={{ width: "100%" }}
                            onChange={handeStageChange}
                            value={stageName}
                            disabled={action !== "create"}
                        >
                            {STAGES.map((stage) => (
                                <Option value={stage.value} key={stage.value} >
                                    {stage.label}
                                </Option>
                            ))}
                        </Select>
                    </div>

                </div>
                {/* <div className="gx-flex-row gx-flex-1"> */}

                {stageName === "INWARD" ? <InwardTemplate handleCreate={handleCreate} action={action} templateDetails={templateDetails}></InwardTemplate>
                    : stageName === "PRE_PROCESSING" ? <PreProcessingTemplate handleCreate={handleCreate} action={action} templateDetails={templateDetails}></PreProcessingTemplate>
                        : stageName === "PROCESSING" ? <ProcessingTemplate handleCreate={handleCreate} action={action} templateDetails={templateDetails}></ProcessingTemplate>
                            : stageName === "PRE_DISPATCH" ? <PreDispatchTemplate handleCreate={handleCreate} action={action} templateDetails={templateDetails}></PreDispatchTemplate>
                                : stageName === "POST_DISPATCH" ? <PostDispatchTemplate handleCreate={handleCreate} action={action} templateDetails={templateDetails}></PostDispatchTemplate>
                                    : <></>
                }
                {/* {renderStageForm()} */}
                {/* </div> */}
            </Card>
        </div>
    )
}

const mapStateToProps = state => ({
    templateDetails: state.quality,
});

export default connect(mapStateToProps, {
    saveQualityTemplate,
    getQualityTemplateById,
    updateQualityTemplate,
})(CreateTemplate);