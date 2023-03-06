import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { Card, Form, Input, Select, Tabs } from 'antd'
import { useIntl } from "react-intl";
import IntlMessages from '../../../../../../util/IntlMessages'
import SlittingForm from "./SlittingForm";

const ProcessForm = (props) => {

    const [processName, setProcesName] = useState(undefined);

    useEffect(() => {
        if (props.match) {
            const urlPaths = props.match.url.split('/')
            console.log(urlPaths[urlPaths.length - 1])
            setProcesName(urlPaths[urlPaths.length - 1])
            console.log(processName)
        }
    }, [props.match])

    return (
        <div>
            {processName === 'slitting' ? <SlittingForm></SlittingForm> : <></>}
        </div>
    )
}

export default ProcessForm