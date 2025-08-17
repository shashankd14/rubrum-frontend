import React, {useState, useEffect} from "react";
import IntlMessages from "../../../util/IntlMessages";
import {Button, Divider, Input, Table, Card, Modal, Form, Select, message} from "antd";
import axios from "axios";
import { getUserToken } from '../../../appRedux/sagas/common';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

const baseUrl = process.env.REACT_APP_BASE_URL;

const getHeaders = () => ({
    Authorization: getUserToken()
});
const UserAccess = (props) => {
    const [users, setUsers] = useState([]);
    const [companyData, setCompanyData] = useState([]);
    const [roleData, setRoleData] = useState([]);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [userEditValues, setUserEditValues] = useState({});
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteConfirmationLoading, setDeleteConfirmationLoading] =
        useState(false);

    const columns = [
        {
            title: "User ID",
            dataIndex: "userName",
            key: "name",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Name",
            key: "name",
            render: (_, record) => (
                <div>
                    {record.firstName} {record.lastName}
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "enabled",
            key: "enabled",
            render: (_, record) => (
                <div>
                    {record.enabled === 1 ? 'Active' : 'Disabled'}
                </div>
            ),
        },
        {
            title: "Contact / Email",
            key: "contact",
            render: (_, record) => (
                <div>
                    {record.mobileNo} {record.emailId}
                </div>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <>
                    {/*<a onClick={() => {*/}
                    {/*    props.form.resetFields();*/}
                    {/*    setUserEditValues(record);*/}
                    {/*    setShowAddUserModal(true);*/}
                    {/*}}>*/}
                    {/*    Edit*/}
                    {/*</a>*/}
                    {/*<Divider type="vertical" />*/}
                    <a onClick={() => {
                        confirm({
                            title: 'Are you sure delete this user?',
                            content: '',
                            okText: 'Delete',
                            okType: 'danger',
                            cancelText: 'Cancel',
                            onOk() {
                                onDeleteUser(record.userId);
                            },
                            onCancel() {
                                console.log('Cancel');
                            },
                        });
                    }}>Delete</a>
                    <Divider type="vertical" />
                    <a>Activate</a>
                </>
            ),
        },
    ];

    const getAllUsers = () => {
        axios.get(`${baseUrl}api/user/getAll`, { headers: getHeaders() }).then((response) => {
            setUsers(response.data);
        });
    };

    const fetchCompanyData = () => {
        axios.get(`${baseUrl}api/party/list`, { headers: getHeaders() }).then((response) => {
            let companyData = response.data.map((company) => ({
                label: company.partyName,
                value: company.nPartyId,
            }));
            setCompanyData(companyData);
        });
    };
    const fetchRoleDetails = () => {
        axios.get(`${baseUrl}api/role/getRoleDetails`, { headers: getHeaders() }).then((response) => {
            let roleData = response.data?.roleDetails?.map((role) => ({
                label: role.roleName,
                value: role.roleId,
            }));
            setRoleData(roleData);
        });
    };

    useEffect(() => {
        if (companyData.length === 0) {
            fetchCompanyData();
        }
        if (roleData.length === 0) {
            fetchRoleDetails();
        }
    }, []);

    useEffect(() => {
        if (users.length == 0) {
            getAllUsers();
        }
    }, []);

    const formItemLayout = {
        labelCol: {
            xs: {span: 8},
            sm: {span: 8},
        },
        wrapperCol: {
            xs: {span: 14},
            sm: {span: 14},
        },
    };
    const {getFieldDecorator} = props.form;

    const onAddUser = (values) => {
        axios
            .post(`${baseUrl}api/user/signup`, {
                userName: values.userId,
                password: values.password,
                firstName: values.fullName.split(" ")[0],
                lastName: values.fullName.split(" ")[1],
                mobileNo: values.mobile,
                enabled: "1",
                userDataVisible: "Y",
                emailId: values.email,
                partyList: values.companyName,
                roleList: values.role,
            }, { headers: getHeaders() })
            .then((response) => {
                getAllUsers();
                message.success('User Added successfully');
            });
    };
    const onEditUser = (values) => {
        axios
            .put(`${baseUrl}api/user/update`, {
                userId: values.id,
                userName: values.userId,
                password: values.password,
                firstName: values.fullName.split(" ")[0],
                lastName: values.fullName.split(" ")[1],
                mobileNo: values.mobile,
                enabled: "1",
                userDataVisible: "Y",
                emailId: values.email,
                partyList: values.companyName,
                roleList: values.role,
            }, { headers: getHeaders() })
            .then((response) => {
                message.success('User updated successfully');
                props.form.resetFields();
            });
    };

    const onDeleteUser = (userId) => {
        axios.delete(`${baseUrl}api/user/${userId}`, { headers: getHeaders() }).then((response) => {
            setDeleteConfirmationLoading(false);
            setIsDeleteOpen(false);
            getAllUsers();
            // messageApi.open({
            //     type: "success",
            //     content: "User deleted successfully",
            // });
        });
    };

   const handleSubmit = (e) => {
        // e.preventDefault();
        props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if(values.id) {
                    onEditUser(values);
                } else onAddUser(values);
                props.form.resetFields();
            }
        });
    }

    return (
        <div>
            <h1>
                <IntlMessages id="sidebar.company.userAccess" />
            </h1>
            <Card>
                <Button
                    type="primary"
                    icon={() => <i className="icon icon-add" />}
                    size="default"
                    onClick={() => {
                        props.form.resetFields();
                        setShowAddUserModal(true);
                    }}
                >
                    Add new user
                </Button>
                <Table
                    rowSelection={[]}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={users}
                    onChange={getAllUsers}
                />
            </Card>
            <Modal
                title="Add new user"
                visible={showAddUserModal}
                onOk={() => {
                    handleSubmit();
                    setShowAddUserModal(false);
                }}
                onCancel={() => {
                    props.form.resetFields();
                    setUserEditValues({})
                    setShowAddUserModal(false);
                }}
            >
                <Form layout="horizontal" onSubmit={handleSubmit} form={props.form}>
                    <FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('id', {
                            initialValue: userEditValues?.userId,
                        })(
                            <Input type="hidden"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Full Name"
                    >
                        {getFieldDecorator('fullName', {
                            initialValue: (userEditValues?.firstName || userEditValues?.lastName) ? `${userEditValues?.firstName} ${userEditValues?.lastName}` : '',
                            rules: [{ required: true, message: "Please input your Full Name" }]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}
                              label="Email Id">
                        {getFieldDecorator('email', {
                            initialValue: userEditValues?.emailId,
                            rules: [{ required: true, message: "Please input your Email Id" }, {
                                type: 'email', message: 'The input is not valid E-mail!',
                            }]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}
                              label="Mobile No.">
                        {getFieldDecorator('mobile', {
                            initialValue: userEditValues?.mobileNo,
                            rules: [{ required: true, message: "Please input your Mobile No." }]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}
                              label="User ID">
                        {getFieldDecorator('userId', {
                            initialValue: userEditValues?.userName,
                            rules: [{ required: true, message: "Please input your User ID" }]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}
                              label="Password">
                        {getFieldDecorator('password', {
                            initialValue: userEditValues?.rawPassword,
                            rules: [{ required: true, message: "Please input your Password" }]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}
                              label="Location Name">
                        {getFieldDecorator('companyName', {
                            initialValue: userEditValues?.userPartyMap?.length > 0 ? userEditValues?.userPartyMap[0].partyId : [],
                            rules: [{ required: true, message: "Please select location name" }]
                        })(
                            <Select
                                mode="multiple"
                                placeholder="Select a location">
                                {companyData.length > 0 && companyData.map(company => <Option selected={true} value={company.value}>{company.label}</Option>)}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}
                              label="Role">
                        {getFieldDecorator('role', {
                            initialValue: userEditValues?.userRoleMap?.length > 0 ? userEditValues?.userRoleMap[0].roleId : [],
                            rules: [{ required: true, message: "Please assign Role" }]
                        })(
                            <Select
                                mode="multiple"
                                placeholder="Select a role">
                                {roleData.length > 0 && roleData.map(role => <Option value={role.value}>{role.label}</Option>)}
                            </Select>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        </div>
    )
}

const UserAccessForm = Form.create()(UserAccess);
export default UserAccessForm;