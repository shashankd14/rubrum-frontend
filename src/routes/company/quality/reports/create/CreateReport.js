import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { Link, useHistory, useLocation } from "react-router-dom";
import { Button, Card, Form, Input, Row, Select, Table, Tabs } from 'antd'
import { useIntl } from "react-intl";
import IntlMessages from '../../../../../util/IntlMessages'
import { QUALITY_REPORT_CREATE_COLUMNS } from "../../../../../constants/quality/ComponentConstants";
import { Label } from "recharts";
import {
    saveQualityReport,
    getQualityReportById,
    updateQualityReport,
    deleteQualityReport,
    getCoilPlanDetails,
    
} from "../../../../../appRedux/actions"
import TextArea from "antd/lib/input/TextArea";
import InwardTemplate from "../../templates/create/InwardTemplate";
import PreProcessingTemplate from "../../templates/create/PreProcessingTemplate";
import ProcessingTemplate from "../../templates/create/ProcessingTemplate";
import PreDispatchTemplate from "../../templates/create/PreDispatchTemplate";
import PostDispatchTemplate from "../../templates/create/PostDispatchTemplate";


const CreateReport = (props) => {

    const intl = useIntl();
    const location = useLocation();

    const [templateName, setTemplateName] = useState("");
    const [templateNameErr, setTemplateNameErr] = useState(false);
    const [stageName, setStageName] = useState("");
    const [kqpDescription, setKqpDescription] = useState("");
    const [kqpSummary, setKqpSummary] = useState("");
    const [action, setAction] = useState("create");
    const [templateInfo, setTemplateInfo] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [materialDetails, setMaterialDetails] = useState();

    const Option = Select.Option;

    useEffect(() => {
        if (props.match) {
            console.log(props.match)
            const urlPaths = props.match.url.split('/')
            console.log(urlPaths)
            if (urlPaths[urlPaths.length - 2] == 'view' || urlPaths[urlPaths.length - 2] == 'edit') {
                setAction(urlPaths[urlPaths.length - 2])
                // props.getQualityTemplateById(urlPaths[urlPaths.length - 1])
                // get quality report by Id
            } else {
                setAction('create')
            }
        }
    }, [props.match])

    useEffect(() => {
        console.log(props.location.state)
        if(props.location.state?.selectedItemForQr)
            setMaterialDetails([props.location.state.selectedItemForQr])
        if(props.location.state?.templateDetails){
            setTemplateName(props.location.state.templateDetails.templateName);
            setStageName(props.location.state.templateDetails.stageName)
            setTemplateInfo(props.location.state.templateDetails)
        }
        if(props.location.state?.action)
            setAction(props.location.state.action)
            
    }, [props.location.state])

    useEffect(() => {
        if (!props.inward.loading && props.inward.planSuccess) {
            console.log(props.inward.plan)
            setMaterialDetails([props.inward.plan])
        }
    }, [props.inward.planLoading, props.inward.planSuccess]);

    const handeStageChange = (value) => {
        setStageName(value);
    }

    const handeTemplateNameChange = (e) => {
        setTemplateName(e.target.value);
        setTemplateNameErr(false)
    }

    const handeDescriptionChange = (e) => {
        setKqpDescription(e)
    }

    const handeSummaryChange = (e) => {
        setKqpSummary(e)
    }

    const handleCreate = (data) => {
        // if (!templateName || templateName === "") {
        //     setTemplateNameErr(true);
        //     document.getElementById('templateName').focus();
        //     return;
        // }
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
        if (templateInfo.templateId) {
            request.append("templateId", templateInfo.templateId);
        }
        if (templateInfo.inspectionId) {
            request.append("inspectionId", templateInfo.inspectionId);
        }
        if (templateName) {
            request.append("templateName", templateName);
        }
        
        request.append("stageName", stageName);
        request.append("userId", localStorage.getItem("userId").toString());
        request.append("templateDetails", JSON.stringify(templateDetails));
        request.append("coilNumber", materialDetails[0].coilNumber);
        request.append("inwardId", materialDetails[0].inwardEntryId);
        if (action == 'create')
            props.saveQualityReport(request);
        else if (action == 'edit')
            props.updateQualityReport(request);
        // props.history.push('/company/quality/reports')
    }

    return (
        <div>
            <h1>
                <IntlMessages id="quality.reports.create.new" />
            </h1>
            <Table
                className="gx-table-responsive"
                columns={QUALITY_REPORT_CREATE_COLUMNS}
                dataSource={materialDetails}
                pagination={false}
            />
            <div style={{marginTop: 10}}>
                <label>Template Name </label>
                <Input
                    id="templateName"
                    value={templateName}
                    disabled
                />
            </div>
            {stageName === "INWARD" ? <InwardTemplate handleCreate={handleCreate} action={action} templateDetails={templateInfo} from="qr"></InwardTemplate>
                : stageName === "PRE_PROCESSING" ? <PreProcessingTemplate handleCreate={handleCreate} action={action} templateDetails={templateInfo} from="qr"></PreProcessingTemplate>
                    : stageName === "PROCESSING" ? <ProcessingTemplate handleCreate={handleCreate} action={action} templateDetails={templateInfo} from="qr"></ProcessingTemplate>
                        : stageName === "PRE_DISPATCH" ? <PreDispatchTemplate handleCreate={handleCreate} action={action} templateDetails={templateInfo} from="qr"></PreDispatchTemplate>
                            : stageName === "POST_DISPATCH" ? <PostDispatchTemplate handleCreate={handleCreate} action={action} templateDetails={templateInfo} from="qr"></PostDispatchTemplate>
                                : <></>
            }
        </div>
    )
}

const mapStateToProps = state => ({
    templateDetails: state.quality,
    inward: state.inward,
});

export default connect(mapStateToProps, {
    saveQualityReport,
    getQualityReportById,
    updateQualityReport,
})(CreateReport);