import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {setInwardDetails} from "../../../../appRedux/actions";
import {Form, Spin, AutoComplete, Icon, Button} from "antd";
import {formItemLayout} from '../Create';

const CreatePartyDetailsForm = (props) => {
    const {getFieldDecorator} = props.form;
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        if(props.party.partyList.length > 0) {

            const { Option } = AutoComplete;
            const options = props.party.partyList.map(party => (
                <Option key={party.nPartyId} value={`${party.nPartyId}`}>
                    {party.nPartyName}
                </Option>
            ));
            setDataSource(options);
        }
    }, [props.party]);

    const handleSubmit = e => {
        e.preventDefault();

        props.form.validateFields((err, values) => {
            if (!err) {
                props.updateStep(1);
            }
        });
    };

    return (
        <>
            {props.party.loading && <Spin className="gx-flex-row gx-justify-content-center" size="large"/>}
            {props.party.partyList.length > 0 &&
                <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form ">
                    <Form.Item label="Party Name">
                        {getFieldDecorator('partyName', {
                            rules: [{ required: true, message: 'Please input the party name!' }],
                        })(
                            <AutoComplete
                                style={{width: 200}}
                                onSelect={(value, option) => {
                                   console.log(value);
                                }}
                                placeholder="enter partyname"
                                dataSource={dataSource}
                                filterOption
                            />
                        )}
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                        <Button type="primary" htmlType="submit">
                            Forward<Icon type="right"/>
                        </Button>
                    </Form.Item>
                </Form>
            }
        </>
    )
}

const mapStateToProps = state => ({
    party: state.party,
    inward: state.inward.inward,
});

const PartyDetailsForm = Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        return {
            partyName: Form.createFormField({
                ...props.inward.partyName,
                value: (props.inward.partyName) ? props.inward.partyName : '',
            }),
        };
    },
    onValuesChange(props, values) {
        props.setInwardDetails({ ...props.inward, ...values});
    },
})(CreatePartyDetailsForm);

export default connect(mapStateToProps, {
    setInwardDetails,
})(PartyDetailsForm);
