import React from 'react';
import 'antd/dist/antd.css';
import { Table, Input, Form } from 'antd';
import { withRouter } from 'react-router-dom';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  handleFocus = () => {
    if (!this.state.editing) {
      this.toggleEdit();
    }
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    //previous code before validation
  //   return editing ? (
  //     <Form.Item style={{ margin: 0 }}>
  //       {form.getFieldDecorator(dataIndex, {
  //         rules: [
  //           {
  //             required: true,
  //             message: `${title} is required.`,
  //           },
  //         ],
  //         initialValue: record[dataIndex],
  //       })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
  //     </Form.Item>
  //   ) : (
  //     <div
  //       className="editable-cell-value-wrap"
  //       style={{ paddingRight: 24 }}
  //       onClick={this.toggleEdit}
  //     >
  //       {children}
  //     </div>
  //   );
  // };
  const rules = [
    {
      required: true,
      message: `${title} is required.`,
    },
    {
      validator: (_, value, callback) => {
        const actualWidth = parseFloat(value) || 0;
        const lowerBound = parseFloat(record.plannedWidth) - 0.5;
        const upperBound = parseFloat(record.plannedWidth) + 0.5;
        const actualThickness = parseFloat(value) || 0;
        const lowerBoundThickness = parseFloat(record.thickness) - 0.5;
        const upperBoundThickness = parseFloat(record.thickness) + 0.5;
        const actualLength = parseFloat(value) || 0;
        const lowerBoundLength = parseFloat(record.plannedLength) - 0.5;
        const upperBoundLength = parseFloat(record.plannedLength) + 0.5;

        if (dataIndex === 'actualWidth' && (actualWidth < lowerBound || actualWidth > upperBound)) {
          callback(`Don't enter more than ${upperBound} & less than ${lowerBound}`);
        } else if (dataIndex === 'actualThickness' && (actualThickness < lowerBoundThickness || actualThickness > upperBoundThickness)) {
          callback(`Don't enter less than ${lowerBoundThickness} & more than ${upperBoundThickness}`);
        } else if (dataIndex === 'actualLength' && (actualLength < lowerBoundLength || actualLength > upperBoundLength)) {
          callback(`Don't enter less than ${lowerBoundLength} & more than ${upperBoundLength}`);
        } 
        else {
          callback();
        }
      },
    },
  ];

  return editing ? (
    <Form.Item style={{ margin: 0 }}>
      {form.getFieldDecorator(dataIndex, {
        rules,
        initialValue: record[dataIndex],
      })(
        <Input
          ref={node => (this.input = node)}
          onPressEnter={this.save}
          onBlur={this.save}
        />
      )}
    </Form.Item>
  ) : (
    <div
      className="editable-cell-value-wrap"
      style={{ paddingRight: 24 }}
      onClick={this.toggleEdit}
      onFocus={this.handleFocus}
      tabIndex={0}
    >
      {children}
    </div>
  );
};

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [...props.columns];
    this.state = {
      dataSource: this.props.dataSource,
      count: this.props.dataSource.length,
    };

    this.columns.push({
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) =>
            this.state.dataSource.length >= 1 ? (
              <div>
                <a onClick={() => this.handleEdit(record.key)}>Edit</a>
               {/* <Divider type="vertical" />
                 <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                    <a>Delete</a>
                </Popconfirm> */}
                </div>
            ) : null,
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.dataSource !== prevProps.dataSource) {
      this.setState({ dataSource: this.props.dataSource });
    }
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleEdit = (key) => {
    const { history } = this.props;
    //history.push(`/company/quality/templates/edit/${key}`);
    history.push("/company/quality/templates");
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {key: count, ...this.props.emptyRow};
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
    this.props.handleChange(newData);
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div className="table-container">
        {/* <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button> */}
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}

export default withRouter(EditableTable)