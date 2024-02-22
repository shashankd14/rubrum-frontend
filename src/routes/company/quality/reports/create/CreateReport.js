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
    fetchInwardList,
    fetchTemplatesLinkList
} from "../../../../../appRedux/actions"
import TextArea from "antd/lib/input/TextArea";
import InwardReportTemplate from "./InwardReportTemplate";
import PreProcessingReportTemplate from "./PreProcessingReportTemplate";
import ProcessingReportTemplate from "./ProcessingReportTemplate";
import PreDispatchReportTemplate from "./PreDispatchReportTemplate";
import PostDispatchReportTemplate from "./PostDispatchReportTemplate";

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
    const [inwardInfo, setInwardInfo] = useState();
    const [filteredInwardList, setFilteredInwardList] = useState([]);

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

    const [matchedTemplateName, setMatchedTemplateName] = useState('');
   
    useEffect(() => {
        console.log(props.location.state)
       // props.fetchInwardList();
       // if(props.location.state?.selectedItemForQr && props.inward?.inwardList){
        if(props.location.state?.selectedItemForQr)
       // const filteredData = props.inward.inwardList.filter(item => item.coilNumber === props.location.state.selectedItemForQr.coilNo); 
        // setFilteredInwardList(filteredData);
         setMaterialDetails([props.location.state.selectedItemForQr])
        if(props.location.state?.templateDetails){
            const linkListData = props.linkListData;
            const templateIdToMatch = props.location.state.templateDetails.templateId;
            const matchedTemplate = linkListData.find(template => template.templateId === templateIdToMatch);
            if (matchedTemplate) {
                setMatchedTemplateName(matchedTemplate.templateName);
                setTemplateName(matchedTemplate.templateName);
            }
           // setTemplateName(props.location.state.templateDetails.templateName);
            setStageName(props.location.state.templateDetails.stageName)
            setTemplateInfo(props.location.state.templateDetails)
        }
        if(props.location.state?.action)
            setAction(props.location.state.action)
            
    }, [props.location.state])

    const [comments, setComment] = useState('');

    const handleCommentChange = (comments) => {
        setComment(comments);
    };

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

    function getProcessId(value) {
        if (value === 'CUTTING') {
          return 1;
        } else if (value === 'SLITTING') {
          return 2;
        } else {
          return 3;
        }
      }
    
    const handleCreate = (data) => {
        // if (!templateName || templateName === "") {
        //     setTemplateNameErr(true);
        //     document.getElementById('templateName').focus();
        //     return;
        // }
        let request = new FormData();
        const templateDetails = []
        const planDetails = []
        Object.keys(data).forEach(key => {
            const dataDetail = data[key];
            if (dataDetail?.fileList?.length > 0 && dataDetail.fileList[0]) {
                request.append(dataDetail.type, dataDetail.fileList[0].originFileObj);
            }
            if (key !== 'formData'){
                templateDetails.push({
                    "id": key,
                    "type": dataDetail.type,
                    "value": dataDetail.value,
                    "fileName": dataDetail?.fileList?.length > 0 ? dataDetail.fileName : "",
                })
            }else{
                planDetails.push(dataDetail.value);
            }
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
        if (stageName === 'PROCESSING'){
            var processId = data[1].processId
            if(processId === undefined){
                request.append("processId", getProcessId(data[1].value))
            } else {
                request.append("processId", processId)}
        }
        //const coilNumber = stageName == 'INWARD' ? props.location.state.selectedItemForQr.coilNumber : props.location.state.selectedItemForQr.coilNo;
        const batchNumber = stageName == 'INWARD' ? props.location.state.selectedItemForQr.batchNumber : props.location.state.selectedItemForQr.customerBatchNo;
        request.append("stageName", stageName);
        request.append("userId", localStorage.getItem("userId").toString());
        request.append("templateDetails", JSON.stringify(templateDetails));
        request.append("planDetails", JSON.stringify(planDetails));
       // request.append("coilNo", coilNumber + '');
        request.append("coilNo", props.location.state.selectedItemForQr.coilNo);
        request.append("customerBatchNo", batchNumber);
        request.append("planId", props.location.state.selectedItemForQr.planId);
        request.append("deliveryChalanNo", props.location.state.selectedItemForQr.deliveryChalanNo);
        request.append("inwardId", props.location.state.selectedItemForQr.inwardEntryId);
        request.append("comments", comments);
        if (action == 'create'){
            props.saveQualityReport(request);
            props.history.push('/company/quality/reports');
        }
        else if (action == 'edit'){
            const qirIdToUpdate = props.templateDetails.data.qirId
            request.append("qirId", qirIdToUpdate);
            props.saveQualityReport(request);
            props.history.push('/company/quality/reports');
        }   
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
                //dataSource={filteredInwardList}
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
            {stageName === "INWARD" ? <InwardReportTemplate handleCreate={handleCreate} action={action} templateDetails={templateInfo} onCommentChange={handleCommentChange} from="qr"></InwardReportTemplate>
                : stageName === "PRE_PROCESSING" ? <PreProcessingReportTemplate handleCreate={handleCreate} action={action} templateDetails={templateInfo} onCommentChange={handleCommentChange} from="qr"></PreProcessingReportTemplate>
                    : stageName === "PROCESSING" ? <ProcessingReportTemplate handleCreate={handleCreate} action={action} templateDetails={templateInfo} onCommentChange={handleCommentChange} from="qr"></ProcessingReportTemplate>
                        : stageName === "PRE_DISPATCH" ? <PreDispatchReportTemplate handleCreate={handleCreate} action={action} templateDetails={templateInfo} onCommentChange={handleCommentChange} from="qr"></PreDispatchReportTemplate>
                            : stageName === "POST_DISPATCH" ? <PostDispatchReportTemplate handleCreate={handleCreate} action={action} templateDetails={templateInfo} onCommentChange={handleCommentChange} from="qr"></PostDispatchReportTemplate>
                                : <></>
            }
        </div>
    )
}

const mapStateToProps = state => ({
    templateDetails: state.quality,
    inward: state.inward,
    linkListData: state.quality.linkListData
});

export default connect(mapStateToProps, {
    saveQualityReport,
    getQualityReportById,
    updateQualityReport,
    deleteQualityReport,
    fetchInwardList,
    fetchTemplatesLinkList
})(CreateReport);