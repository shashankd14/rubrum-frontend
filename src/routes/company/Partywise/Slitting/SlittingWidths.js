import React, { useEffect, useState } from 'react';
import moment from 'moment/moment';
import { Button, Col, DatePicker, Form, Icon, Input, message, Radio, Row } from 'antd';
import { APPLICATION_DATE_FORMAT } from '../../../../constants';
import SweetAlert from 'react-bootstrap-sweetalert';
import { formItemLayoutSlitting } from '../SlittingModal';
import IntlMessages from 'util/IntlMessages';

const SlittingWidths = (props) => {
  const { getFieldDecorator, getFieldValue, getFieldProps } = props.form;
  getFieldDecorator('keys', { initialValue: [{ width: 0, no: 0, weight: 0 }] });
  const [value, setValue] = useState(props.value);
  const [targetWeight, settargetWeight] = useState(0);
  const [availLength, setavailLength] = useState(0);

  const lengthValue1 =
    props.coilDetails.availableLength >= 0
      ? props.coilDetails.availableLength
      : props.plannedLength(props.coilDetails);
  const widthValue1 =
    props.coilDetails.instruction && props.coilDetails.instruction.length > 0
      ? props.plannedWidth(props.coilDetails)
      : props.coilDetails.fWidth
        ? props.coilDetails.fWidth
        : props.plannedWidth(props.coilDetails);
  const weightValue1 =
    props.coilDetails.fpresent >= 0
      ? props.coilDetails.fpresent
      : props.plannedWeight(props.coilDetails);
  const [len, setlen] = useState(lengthValue1);
  const [width, setwidth] = useState(widthValue1);
  const [weightValue, setWeightValue] = useState(weightValue1);
  const [twidth, settwidth] = useState(0);
  const [totalPacketsWidth, setTotalPacketsWidth] = useState(0);
  const [totalPacketsWeight, setTotalPacketsWeight] = useState(0);
  const [oldLength, setOldLength] = useState(0);
  const [equalParts, setEqualParts] = useState(0);
  const [equalPartsDisplay, setEqualPartsDisplay] = useState(0);
  const [unsavedDeleteId, setUnsavedDeleteId] = useState(0);
  const [tagsName, setTagsName] = useState('');
  const [lengthExceedConfirm, setLengthExceedConfirm] = useState(false);
  const keys = getFieldValue('keys');
  const callBackValue = (n) => {
    let cuts = 0;
    if (props.cuts && props.cuts.length) {
      if (n === 'length') {
        cuts = props.cuts.map((i) => Number(i.plannedLength));
        cuts = [...new Set(cuts)];
      } else {
        cuts = props.cuts.map((i) => i.plannedWidth);
      }
      cuts = cuts.filter((i) => i !== undefined);
      cuts =
        cuts.length > 0
          ? cuts.reduce((total, num) => Number(total) + Number(num))
          : 0;
    }
    return cuts;
  };
  let cutLength = callBackValue('length');
  let cutWidth = callBackValue('width');
  let noParts = 0;
  useEffect(() => {
    console.log(
      'slitInstruction set to slitInstructionList',
      props.slitInstruction
    );
    props.setSlitInstructionList(props.slitInstruction);
  }, [props.slitInstruction]);
  useEffect(() => {
    getEditValue();
  }, [props.length]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    // if (!props.wip) { props.setslitpayload(props.cuts); }
    let lengthValue1 = 0;
    let widthValue1 = 0;
    let weightValue = 0;
    if (props.coilDetails.fpresent >= 0) {
      lengthValue1 = props.coilDetails.availableLength
        ? props.coilDetails.availableLength
        : props.plannedLength(props.coilDetails);
      widthValue1 = props.coilDetails.fWidth
        ? props.coilDetails.fWidth
        : props.plannedWidth(props.coilDetails);
      weightValue = props.coilDetails.fpresent
        ? props.coilDetails.fpresent
        : props.plannedWeight(props.coilDetails);
    } else {
      widthValue1 = props.plannedWidth(props.coilDetails);
      weightValue = props.plannedWeight(props.coilDetails);
      lengthValue1 = props.plannedLength(props.coilDetails);
    }
    props.widthValue(width);
    // props.lengthValue(len);
    let cuts = props.cuts.map((i) => i.plannedWeight);
    cuts = cuts.filter((i) => i !== undefined);
    cuts =
      cuts.length > 0
        ? cuts.reduce((total, num) => Number(total) + Number(num))
        : 0;
    cuts = Number(cuts);
    cuts = Number(cuts).toFixed(0);
    props.setweight(cuts);
    if (props.setDeleted) {
      setWeightValue(weightValue - cuts);
    }
    if (len !== 0 && width === 0) {
      setwidth(widthValue1);
    }
    // if(weightValue !== 0 && width === 0){
    //     setwidth(widthValue1)
    // }
    if (props.cuts && props.cuts.length === 0) {
      setwidth(widthValue1);
      setlen(lengthValue1);
      setWeightValue(weightValue);
    }
  }, [props.coilDetails, props.cuts]);
  useEffect(() => {
    setWeightValue(props.coilDetails.fpresent);
  }, [props.coilDetails.fpresent]);

  useEffect(() => {
    if (props.unfinish) {
      let actualUpdate = props.cuts.map((item) => {
        item.actualLength = 0;
        item.actualWidth = 0;
        item.actualWeight = 0;
        if (item.packetClassification?.tagId)
          item.packetClassification = {
            tagId: 0,
          };
        return item;
      });
      props.setTableData(actualUpdate);
    } else if (props.editFinish) {
      props.setTableData(props.cuts);
    } else if (props.wip) {
      let actualUpdate = props.cuts.map((item) => {
        if (!item.actualLength && item.actualLength !== 0)
          item.actualLength = item.plannedLength;
        if (!item.actualWidth && item.actualWidth !== 0)
          item.actualWidth = item.plannedWidth;
        if (!item.actualWeight && item.actualWeight !== 0)
          item.actualWeight = item.plannedWeight;
        if (!item.packetClassification?.tagId)
          item.packetClassification = {
            tagId: item.plannedWidth < 20 ? 2 : 0,
          };
        return item;
      });
      props.setTableData(actualUpdate);

      let actualTotalWeight = props.cuts.map((i) => i.actualWeight);
      actualTotalWeight = actualTotalWeight.filter((i) => i !== undefined);
      actualTotalWeight =
        actualTotalWeight.length > 0
          ? actualTotalWeight.reduce(
            (total, num) => Number(total) + Number(num)
          )
          : 0;
      props.totalActualweight(actualTotalWeight);
    }
  }, [props.cuts]);

  useEffect(() => {
    if (props.reset) {
      settargetWeight(0);
      setavailLength(0);
      props.form.resetFields();
      settwidth(0);
    }
  }, [props.reset]);

  const getEditValue = () => {
    if (props.cuts.length > 0 && props.length !== undefined) {
      const index = 0;
      const obj = props.cuts[props.length];
      const arr = [obj.plannedWidth, obj.plannedNoOfPieces, obj.plannedWeight];
      const array = ['widths[0]', 'nos[0]', 'weights[0]'];
      for (let i = 0; i < array.length; i++) {
        props.form.setFieldsValue({
          [array[i]]: `${arr[i]}`,
        });
      }
      props.form.setFieldsValue({
        length: obj.length,
      });
      setTagsName(obj?.packetClassification?.tagId);
    }
  };
  // - function to apply same data for remaining equals parts
  const applyData = () => {
    const slits = [];
    let equalPanelList = [];
    let equalInstructions = [...props.slitEqualInstruction];
    let weight = props.cuts[0].plannedWeight;
    weight = Number(weight) * equalPartsDisplay;
    for (let i = 0; i < equalPartsDisplay; i++) {
      slits.push([...props.cuts]);
      equalInstructions.push(...props.slitEqualInstruction);
    }
    equalPanelList.push(...slits);

    if (weight > weightValue) {
      setWeightValue(0);
    } else {
      setWeightValue(weightValue - weight);
    }
    props.setSlits(slits);
    props.setSlitInstruction(equalInstructions); // Setting payload for equal parts
    props.setPanelList(equalPanelList);
    if (!props.wip) {
      props.setslitpayload(slits);
    }
    setEqualParts(0);
    setEqualPartsDisplay(0);
  };
  // - function to add the instruction
  const addNewSize = (e) => {
    let wValue;
    let slitInstructionPayload =
      props.slitInstructionList.length > 0
        ? [...props.slitInstructionList]
        : [];
    props.form.validateFields((err, values) => {
      if (!err) {
        props.validate(false);
        let totalWidth = 0;
        let totalWeight = props.slitInstructionList.length
          ? props.slitInstructionList.map((i) =>
            Number(i.partDetailsRequest.targetWeight)
          )
          : 0;
        totalWeight = totalWeight.length
          ? totalWeight.reduce((sum, total) => sum + total)
          : 0;
        const widthValue = props.coilDetails.fWidth
          ? props.coilDetails.fWidth
          : props.plannedWidth(props.coilDetails);
        const lengthValue = props.coilDetails.availableLength
          ? props.coilDetails.availableLength
          : props.plannedLength(props.coilDetails);
        const weightValue1 =
          props.coilDetails.fpresent >= 0
            ? props.coilDetails.fpresent
            : props.plannedWeight(props.coilDetails);
        const slits = [];
        let slitArray = [];
        let uniqId = '';
        // if(cutLength === 0){
        //     setOldLength(Number(availLength));
        // }
        let instructionPlanDto = {
          targetWeight: targetWeight,
          length: availLength,
          createdBy: '1',
          updatedBy: '1',
        };
        let index = 1;
        for (let i = 0; i < values.widths.length; i++) {
          for (let j = 0; j < values.nos[i]; j++) {
            let slitValue = {
              processId: 2,
              index: index++,
              instructionDate: moment().format('YYYY-MM-DD HH:mm:ss'),
              plannedLength: availLength,
              plannedWidth: values.widths[i],
              isSlitAndCut: props.slitCut ? true : false,
              plannedNoOfPieces: values.nos[i],
              status: 1,
              createdBy: '1',
              updatedBy: '1',
              groupId: null,
              plannedWeight: (values.weights[i] / values.nos[i]).toFixed(2),
              inwardId: props.coilDetails.inwardEntryId
                ? props.coilDetails.inwardEntryId
                : '',
              parentInstructionId: props.coilDetails.instructionId
                ? props.coilDetails.instructionId
                : '',
              isScrapWeightUsed: false,
              deleteUniqId: unsavedDeleteId,
              packetClassificationName: null,
              packetClassificationId: null,
              endUserTagId: null,
            };
            slits.push(slitValue);
          }

          wValue =
            targetWeight * ((values.widths[i] * values.nos[i]) / widthValue1);
          totalWidth += values.widths[i] * values.nos[i];
          totalWeight += Number(values.weights[i]);
          instructionPlanDto.deleteUniqId = unsavedDeleteId;
          totalWidth = Math.floor(totalWidth);
          settwidth(totalWidth);
        }
        let lengthList = slits.map((item) => Number(item.plannedLength));
        lengthList = [...new Set(lengthList)];
        let sumLength = lengthList.reduce((sum, total) => sum + total);
        slitArray.push(slits);
        let instructionPayload = {
          partDetailsRequest: instructionPlanDto,
          instructionRequestDTOs: slits,
        };
        slitInstructionPayload.push(instructionPayload);
        setUnsavedDeleteId((prev) => prev + 1);
        let remainWeight =
          props.coilDetails.fpresent || props.coilDetails.plannedWeight;
        const totalWeightRound = Number(totalWeight.toFixed(0));
        const remainWeightRound = Number(remainWeight.toFixed(0));
        if (Number(availLength) > lengthValue) {
          setLengthExceedConfirm(true);
          message.error('Length greater than available length', 2);
        } else if (totalWeightRound - remainWeightRound > remainWeightRound) {
          message.error('Weight greater than available weight', 2);
        } else if (totalPacketsWidth !== widthValue) {
          message.error('Sum of slits width is not same as width of coil.', 2);
        } else if (totalPacketsWidth > widthValue) {
          message.error('Sum of slits width is greater than width of coil.', 2);
          // } else if (totalWidth !== widthValue) {
          //   message.error("Sum of slits width is not same as width of coil.", 2);
          // } else if (totalWidth > widthValue) {
          //   message.error("Sum of slits width is greater than width of coil.", 2);
        } else {
          setWeightValue(remainWeightRound - totalWeightRound);
          setlen(lengthValue - sumLength);
          props.setPanelList(slitArray);
          props.setSlits(slits);
          props.setslitpayload(slits);
          props.setSlitInstruction(slitInstructionPayload);
          props.setSlitInstructionList(slitInstructionPayload);
          props.setSlitEqualInstruction(slitInstructionPayload);
          settargetWeight(value === 1 ? targetWeight : 0);
          setavailLength(value === 1 ? availLength : 0);
          setEqualPartsDisplay(
            value === 1
              ? equalParts > slitInstructionPayload.length
                ? equalParts - slitInstructionPayload.length
                : 0
              : 0
          );
          props.form.resetFields();
        }
      } else {
        props.validate(true);
      }
    });
  };

  const addNewKey = () => {
    const { form } = props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat({ width: 0, no: 0, weight: 0 });
    form.setFieldsValue({
      keys: nextKeys,
    });
  };
  const removeKey = (k) => {
    const { form } = props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter((key) => key !== k),
    });
  };

  const handleBlur = (e, i) => {
    props.form.validateFields((err, values) => {
      let widthEntry = 0;
      let array = [];
      let wValue;
      let weightEntry = 0;
      // let widthCheck = widthValue1 === 0 && width !== 0 ? width : widthValue1;
      let widthCheck = props.coilDetails.fWidth;
      if (!err) {
        for (let j = 0; j < values.widths.length; j++) {
          array.push(`weights[${j}]`);
          widthEntry += Number(values.widths[j]) * Number(values.nos[j]);
          weightEntry += Number(values.weights[j] || 0);
        }
        widthEntry = Math.floor(widthEntry);

        wValue =
          Number(targetWeight) *
          ((Number(values.widths[i]) * Number(values.nos[i])) / widthCheck);
        wValue = Math.floor(wValue);
        // if (widthEntry === props.coilDetails.fWidth) {
        //   wValue += targetWeight - (weightEntry + wValue);
        // }
        props.form.setFieldsValue({
          [array[i]]: wValue,
        });
        setTotalPacketsWidth(widthEntry);
        setTotalPacketsWeight(weightEntry + wValue);
        settwidth(widthEntry);
        if (lengthValue1 >= availLength + cutLength) {
          // setlen(lengthValue1-(availLength+cutLength))
          props.lengthValue(lengthValue1 - (availLength + cutLength));
          setwidth(width - widthEntry);
          props.widthValue(width - widthEntry);
        }
        if (width >= widthEntry + cutWidth) {
          setwidth(width - (widthEntry + cutWidth));
          props.widthValue(width - (widthEntry + cutWidth));
        }
      }
    });
  };

  const onChange = () => {
    props.form.setFieldsValue({
      length: len,
    });
  };
  const handleBlurEvent = (e) => {
    setEqualParts(Number(e.target.value));
    setEqualPartsDisplay(Number(e.target.value));
    props.setParts(Number(e.target.value));
    if (value === 2) {
      settargetWeight(0);
    } else {
      settargetWeight(weightValue / Number(e.target.value));
    }
  };
  const onTargetChange = (e) => {
    let weight = props.coilDetails?.fQuantity
      ? props.coilDetails.fQuantity
      : props.plannedWeight(props.coilDetails);
    let length = props.coilDetails?.fLength
      ? props.coilDetails.fLength
      : props.plannedLength(props.coilDetails);
    settargetWeight(e.target.value);
    setavailLength((length * (e.target.value / weight)).toFixed(0));
  };
  const radioChange = (e) => {
    let weight = props.coilDetails?.fQuantity
      ? props.coilDetails.fQuantity
      : props.plannedWeight(props.coilDetails);
    let length = props.coilDetails?.fLength
      ? props.coilDetails.fLength
      : props.plannedLength(props.coilDetails);

    settargetWeight(weightValue / equalParts);
    if (e.target.value === 1) {
      setavailLength((length * (weightValue / equalParts / weight)).toFixed(0));
    } else {
      setavailLength(0);
      settargetWeight(0);
    }
    setValue(e.target.value);
  };

  const onConfirm = (e) => {
    setavailLength(props.coilDetails?.availableLength);
    setLengthExceedConfirm(false);
  };

  const onCancel = (e) => {
    setLengthExceedConfirm(false);
  };

  return (
    <>
      <Form {...formItemLayoutSlitting}>
        {!props.wip && (
          <>
            <div style={{ marginLeft: 25 }}>
              <label>Current Available length : {len}mm</label>
              <div>
                <label>
                  Available Width :{' '}
                  {weightValue > 0
                    ? props.coilDetails.fWidth || props.coilDetails.plannedWidth
                    : 0}
                  mm
                </label>
              </div>
              <div>
                <label>
                  Current Available Weight : {weightValue?.toFixed(1)}kg
                </label>
              </div>
            </div>
          </>
        )}
        {!props.wip && (
          <>
            <Form.Item label='Process Date' className='gx-mt-4'>
              {getFieldDecorator('processDate', {
                initialValue: moment(new Date(), APPLICATION_DATE_FORMAT),
                rules: [
                  { required: true, message: 'Please select a Process date' },
                ],
              })(
                <DatePicker
                  placeholder='dd/mm/yy'
                  style={{ width: 200 }}
                  defaultValue={moment(new Date(), APPLICATION_DATE_FORMAT)}
                  format={APPLICATION_DATE_FORMAT}
                  disabled={!!props.wip}
                />
              )}
            </Form.Item>
            <Form.Item label='No Of Parts'>
              {getFieldDecorator('noParts', {
                rules: [
                  {
                    required:
                      (value === 2 || value === 1) && equalParts !== 0
                        ? false
                        : true,
                    message: 'Please enter no.of Parts',
                  },
                ],
              })(
                <Input
                  id='noParts'
                  onBlur={handleBlurEvent}
                  disabled={value == 0 || value == 4 ? false : true}
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('radioParts', {
                rules: [
                  {
                    required:
                      (value === 2 || value === 1) && equalParts !== 0
                        ? false
                        : true,
                    message: 'Please select Parts',
                  },
                ],
              })(
                <Radio.Group
                  id='radioParts'
                  onChange={radioChange}
                  disabled={
                    (value == 0 || value == 4) && weightValue !== 0
                      ? false
                      : true
                  }
                  value={value}
                >
                  <Radio value={1}>Equal</Radio>
                  <Radio value={2}>Unequal</Radio>
                </Radio.Group>
              )}
            </Form.Item>

            <Form.Item label='Target Weight(kg)'>
              {getFieldDecorator('targetWeight')(
                <>
                  <Input
                    width={50}
                    id='targetWeight'
                    disabled={value === 1 ? true : false}
                    value={targetWeight}
                    name='targetWeight'
                    onChange={onTargetChange}
                  />
                </>
              )}
            </Form.Item>
            <Form.Item label='Length(mm)'>
              {getFieldDecorator('length')(
                <>
                  <Input
                    id='length'
                    disabled={true}
                    value={availLength}
                    name='length'
                  />
                </>
              )}
            </Form.Item>
            <Row>
              <Col lg={7} md={8} sm={12} xs={24}>
                <label>Width</label>
              </Col>
              <Col lg={7} md={6} sm={12} xs={24}>
                <label>Nos</label>
              </Col>
              <Col lg={7} md={8} sm={12} xs={24}>
                <label>Weight</label>
              </Col>
              <Col lg={3} md={1} sm={12} xs={24}>
                {/* <label>Action</label> */}
              </Col>
            </Row>
            <Row className='ant-row' style={{ marginLeft: -16 }}>
              {keys.map((k, index) => {
                return (
                  <Row style={{ marginLeft: 0 }}>
                    <Col lg={7} md={8} sm={12} xs={24}>
                      <Form.Item name='widths'>
                        {getFieldDecorator(`widths[${index}]`, {
                          rules: [
                            { required: true, message: 'Please enter width' },
                            {
                              pattern: `^[+-]?[0-9]*\.[0-9]{0,2}$`,
                              message: 'Only 2 decimal values allowed',
                            },
                          ],
                        })(
                          <Input
                            id='widths'
                            disabled={props.wip ? true : false}
                            onBlur={(e) => handleBlur(e, index)}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={7} md={6} sm={12} xs={24}>
                      <Form.Item name='nos'>
                        {getFieldDecorator(`nos[${index}]`, {
                          rules: [
                            { required: true, message: 'Please enter nos' },
                            {
                              pattern: '^[0-9]*$',
                              message: 'Number of slits should be a number',
                            },
                          ],
                        })(
                          <Input
                            id='nos'
                            disabled={props.wip ? true : false}
                            onBlur={(e) => handleBlur(e, index)}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={7} md={8} sm={12} xs={24}>
                      <Form.Item name='weights'>
                        {getFieldDecorator(`weights[${index}]`)(
                          <Input id='weights' disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={1} md={1} sm={12} xs={24} style={{ display: 'flex', justifyContent: 'center', alignItems: 'anchor-center', marginBottom: '15px' }}>
                      {keys.length - 1 > 0 ? (
                        <i
                          style={{marginRight: '0px'}}
                          className='icon icon-trash gx-margin'
                          onClick={() => removeKey(k)}
                        />
                      ) : (
                        <></>
                      )}
                      {index === keys.length - 1 ? (
                        <i
                          className='icon icon-add-circle'
                          onClick={() => addNewKey()}
                        />
                      ) : (
                        <></>
                      )}
                    </Col>
                  </Row>
                );
              })}
            </Row>
            <Form.Item label='Total width(mm)'>
              {getFieldDecorator('twidth', {
                rules: [{ required: false }],
              })(
                <>
                  <Input
                    id='twidth'
                    disabled={true}
                    value={twidth}
                    name='twidth'
                  />
                </>
              )}
            </Form.Item>

            <Row className='gx-mt-4'>
              <Col span={16} style={{ textAlign: 'center' }}>
                <Button
                  type='primary'
                  htmlType='submit'
                  onClick={() => addNewSize()}
                  disabled={
                    props.wip
                      ? true
                      : props.slitInstructionList.length === equalParts
                        ? true
                        : false
                  }
                >
                  Add Size
                  <Icon type='right' />
                </Button>
              </Col>
            </Row>
            <Button
              type='primary'
              onClick={applyData}
              hidden={
                value === 1 &&
                equalParts > 1 &&
                props.slitInstructionList.length !== equalParts
                  ? false
                  : true
              }
              disabled={
                value === 1 && equalPartsDisplay !== 0
                  ? props.cuts.length === 0
                    ? true
                    : false
                  : true
              }
            >
              Apply to remaining {equalPartsDisplay} parts <Icon type='right' />
            </Button>
          </>
        )}
      </Form>
      <SweetAlert
        show={lengthExceedConfirm}
        custom
        showCancel
        title=''
        confirmBtnText={<IntlMessages id='button.yes' />}
        cancelBtnText={<IntlMessages id='button.no' />}
        confirmBtnBsStyle='primary'
        cancelBtnBsStyle='default'
        // title={<IntlMessages id="sweetAlerts.doYouLikeThumb"/>}
        onConfirm={onConfirm}
        onCancel={onCancel}
      >
        <div>{`Targeted length: ${availLength}`}</div>
        <div>{`Current Available length: ${props.coilDetails?.availableLength}`}</div>
        <div>{`Targeted length is greater than the available length`}</div>
        <div>Do you want to proceed with current available length?</div>
      </SweetAlert>
    </>
  );
};

export default SlittingWidths;