import React, { useEffect, useState } from "react";
import SlittingForm from "./SlittingForm";
import CuttingForm from "./CuttingForm";
import SlitAndCutForm from "./SlitAndCutForm";

const ProcessForm = (props) => {
    const [processName, setProcesName] = useState(undefined);

    useEffect(() => {
        if (props.match) {
            const urlPaths = props.match.url.split('/')
            setProcesName(urlPaths[urlPaths.length - 1])
        }
    }, [props.match])

    const onSaveSlitForm = (formData) => {
        props.location.state.updateFormData(formData)
    }

    const onSaveCutForm = (formData) => {
        props.location.state.updateFormData(formData)
    }

    const onSaveSlitCutForm = (formData) => {
        props.location.state.updateFormData(formData)
    }

    return (
        <div>
            {processName === 'slitting' ? <SlittingForm onSave={onSaveSlitForm}></SlittingForm> 
            : processName === 'cutting' ? <CuttingForm onSave={onSaveCutForm}></CuttingForm> 
            : processName === 'slit_cut' ? <SlitAndCutForm onSave={onSaveSlitCutForm}></SlitAndCutForm> : <></>}
        </div>
    )
}

export default ProcessForm