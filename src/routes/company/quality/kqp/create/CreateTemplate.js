import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { Button, Card, Input, Row, Select } from 'antd'
import IntlMessages from '../../../../../util/IntlMessages'
import { STAGES } from "../../../../../constants/quality/ComponentConstants";
import {
    saveKqp,
    getKqpById,
    updateKqp,
    deleteKqp
} from "../../../../../appRedux/actions"
import TextArea from "antd/lib/input/TextArea";

const CreateTemplate = (props) => {

    const [kqpName, setKqpName] = useState("");
    const [kqpNameErr, setKqpNameErr] = useState(false);
    const [stageName, setStageName] = useState("");
    const [kqpDescription, setKqpDescription] = useState("");
    const [kqpSummary, setKqpSummary] = useState("");
    const [action, setAction] = useState("create");
    const [isDisabled, setIsDisabled] = useState(false);

    const Option = Select.Option;

    useEffect(() => {
        if (props.match) {
            const urlPaths = props.match.url.split('/')
            if (urlPaths[urlPaths.length - 2] == 'view' || urlPaths[urlPaths.length - 2] == 'edit') {
                setAction(urlPaths[urlPaths.length - 2])
                props.getKqpById(urlPaths[urlPaths.length - 1])
            } else {
                setAction('create')
            }
        }
    }, [props.match])

    useEffect(() => {
        if (!props.templateDetails.loading && !props.templateDetails.error && props.templateDetails.operation === 'kqpById') {
            setKqpName(props.templateDetails.data.kqpName);
            setStageName(props.templateDetails.data.stageName?.toUpperCase())
            setKqpDescription(props.templateDetails.data.kqpDesc)
            setKqpSummary(props.templateDetails.data.kqpSummary)
        }
    }, [props.templateDetails.loading, props.templateDetails.error]);

    const handeStageChange = (value) => {
        setStageName(value);
    }

    const handeTemplateNameChange = (e) => {
        setKqpName(e.target.value);
        setKqpNameErr(false)
    }

    const handeDescriptionChange = (e) => {
        setKqpDescription(e.target.value)
    }

    const handeSummaryChange = (e) => {
        setKqpSummary(e.target.value)
    }

    const handleCreate = (data) => {
        if (!kqpName || kqpName === "") {
            setKqpNameErr(true);
            document.getElementById('kqpName').focus();
            return;
        }
        let request = {
            "kqpName": kqpName,
            "kqpDesc": kqpDescription,
            "kqpSummary": kqpSummary,
            "stageName": stageName
        };
        if (action === 'create')
            props.saveKqp(JSON.stringify(request));
        else if (action === 'edit') {
            request["kqpId"] = props.templateDetails.data.kqpId;
            props.updateKqp(JSON.stringify(request));
        }
            
         props.history.push('/company/quality/kqp')
    }

    return (
        <div>
            <h1>
                <IntlMessages id="quality.kqp.create.new" />
            </h1>
            <Card>
            <div className="gx-flex-row gx-flex-1">
                    <div className="gx-w-50">
                {/* <div className="gx-flex-row gx-flex-1">*/}
                    <div className="table-operations gx-col"> 
                    <Row>
                       
                        <label>KQP Name </label>
                        <Input
                            id="kqpName"
                            onChange={handeTemplateNameChange}
                            required
                            value={kqpName}
                            disabled={action === "view"}
                        />
                        {kqpNameErr && <p style={{ color: "red" }}>Please enter KQP Name</p>}
                        </Row></div>
                    </div>
                    <div className="gx-w-50">
                    <div className="table-operations gx-col"> 
                        <label>Stage Name</label><br/>
                        <Select
                            id="stage"
                            style={{ width: "50%" }}
                            onChange={handeStageChange}
                            value={stageName}
                            disabled={action === "view"}
                        >
                            {STAGES.map((stage) => (
                                <Option value={stage.value}>
                                    {stage.label}
                                </Option>
                            ))}
                        </Select>
                        </div>
                    </div>

                </div>
                <div className="gx-flex-row gx-flex-1">
                    <div className="gx-w-50">
                    <div className="table-operations gx-col"> 
                        <Row>
                            <label>KQP Description</label>
                            <TextArea  value={kqpDescription} onChange={handeDescriptionChange} disabled={action === "view"}></TextArea>
                        </Row>
                        </div>
                    </div>
                </div>
                <div className="gx-flex-row gx-flex-1">
                    <div className="gx-w-50">
                    <div className="table-operations gx-col"> 
                        <Row>
                            <label>KQP Summary</label>
                            <TextArea value={kqpSummary} onChange={handeSummaryChange} disabled={action === "view"}></TextArea>
                        </Row>
                        </div>
                    </div>
                </div>
                { action != 'view' && <div className="gx-flex-row gx-flex-1">
                    <div className="gx-w-50">
                        <Row >
                            <div style={{ marginTop: 45 }}>
                                <Button style={{ marginLeft: 8 }} disabled={isDisabled} onClick={() => props.history.push('/company/quality/kqp')}>
                                    Cancel
                                </Button>
                                {action === 'create' ? <Button type="primary" htmlType="submit" onClick={handleCreate} disabled={isDisabled}>
                                    Create KQP
                                </Button> :
                                    <Button type="primary" htmlType="submit" onClick={handleCreate} disabled={isDisabled}>
                                        Update KQP
                                    </Button>
                                }
                            </div>
                        </Row>
                    </div>
                </div>}

            </Card>
        </div>
    )
}

const mapStateToProps = state => ({
    templateDetails: state.quality,
});

export default connect(mapStateToProps, {
    saveKqp,
    getKqpById,
    updateKqp,
    deleteKqp
})(CreateTemplate);