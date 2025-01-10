import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Card, Form, Input, Select, Tabs } from 'antd';
import { useIntl } from 'react-intl';
import IntlMessages from '../../../../../../util/IntlMessages';
import SlittingForm from './SlittingForm';
import CuttingForm from './CuttingForm';
import SlitAndCutForm from './SlitAndCutForm';

const ProcessForm = props => {
  console.log(props.location.state);
  const [processName, setProcesName] = useState(undefined);

  useEffect(() => {
    if (props.match) {
      const urlPaths = props.match.url.split('/');
      console.log(urlPaths[urlPaths.length - 1]);
      setProcesName(urlPaths[urlPaths.length - 1]);
      console.log(processName);
    }
  }, [props.match]);

  const onSaveSlitForm = formData => {
    props.location.state.updateFormData(formData);
  };

  const onSaveCutForm = formData => {
    props.location.state.updateFormData(formData);
  };

  const onSaveSlitCutForm = formData => {
    props.location.state.updateFormData(formData);
  };

  return (
    <div>
      {processName === 'slitting' ? (
        <SlittingForm onSave={onSaveSlitForm}></SlittingForm>
      ) : processName === 'cutting' ? (
        <CuttingForm onSave={onSaveCutForm}></CuttingForm>
      ) : processName === 'slit_cut' ? (
        <SlitAndCutForm onSave={onSaveSlitCutForm}></SlitAndCutForm>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ProcessForm;
