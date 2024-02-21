import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Table, Input, Button, Form, Popconfirm, Divider } from 'antd';
import { useHistory, withRouter } from 'react-router-dom';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
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

  save = (e) => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = (form) => {
    this.form = form;
    const { children, dataIndex, record, title, toleranceData, thicknessSlit } = this.props;
    const { editing } = this.state;
    const rules = [
      // {
      //   required: true,
      //   message: `${title} is required.`,
      // },
      {
        validator: (_, value, callback) => {
          const toleranceItem = toleranceData.find(
            (item) => item.key === record.key
          );
          const widthCol = parseFloat(record.plannedWidth);
          const thicknessCol = parseFloat(record.thickness);
          const lengthCol = parseFloat(record.plannedLength);

          const lowerBound = ( widthCol - Math.abs(parseFloat(toleranceData?.[0]?.toleranceWidthFrom))); 
          const upperBound = ( widthCol + (parseFloat(toleranceData?.[0]?.toleranceWidthTo))); 
          //cut thickness validation
          const lowerBoundThickness = ( thicknessCol - Math.abs(parseFloat(toleranceData?.[0]?.toleranceThicknessFrom)));
          const upperBoundThickness = ( (thicknessCol) + (parseFloat(toleranceData?.[0]?.toleranceThicknessTo))); 
           //slit thickness validation
          
          const lowerBoundThicknessSlit = ( thicknessSlit - Math.abs(parseFloat(toleranceData?.[0]?.toleranceThicknessFrom)));
          const upperBoundThicknessSlit = ( (thicknessSlit) + (parseFloat(toleranceData?.[0]?.toleranceThicknessTo))); 
          const lowerBoundLength = ( lengthCol - Math.abs(parseFloat(toleranceData?.[0]?.toleranceLengthFrom))); 
          const upperBoundLength = ( lengthCol + (parseFloat(toleranceData?.[0]?.toleranceLengthTo))); 

          const actualburrHeight = parseFloat(value) || 0;
  
          const lowerBoundburrHeight = parseFloat(toleranceData?.[0]?.toleranceBurrHeightFrom) ?? 1;
          const upperBoundburrHeight = parseFloat(toleranceData?.[0]?.toleranceBurrHeightTo) ?? 1;
          //cut burrheight
          const lowerBurrHeightPercent = (thicknessCol * lowerBoundburrHeight) / 100;
          const upperBurrHeightPercent = (thicknessCol * upperBoundburrHeight) / 100;
          //slit burrheight
          const lowerBurrHeightPercentSlit = (thicknessSlit * lowerBoundburrHeight) / 100;
          const upperBurrHeightPercentSlit = (thicknessSlit * upperBoundburrHeight) / 100;

          const actualdiagonalDifference = parseFloat(value) || 0;
          const lowerBoundtoleranceDiagonalDifferenceFrom =
            toleranceData?.[0]?.toleranceDiagonalDifferenceFrom ?? 0;
          const uppertoleranceDiagonalDifferenceTo =
            toleranceData?.[0]?.toleranceDiagonalDifferenceTo ?? 0;

            //slit slitsize validation
            const slitSize = parseFloat(value) || 0;
            const lowerBoundtoleranceSlitSizeFrom =  (widthCol - Math.abs(parseFloat(toleranceData?.[0]?.toleranceSlitSizeFrom))) ?? 0;
            const upperBoundtoleranceSlitSizeTo =  (widthCol + Math.abs(parseFloat(toleranceData?.[0]?.toleranceSlitSizeTo))) ?? 0;

          if (
            dataIndex === 'actualWidth' && (value < lowerBound || value > upperBound)
          ) {
            callback(
              `You are out of range, range is (${upperBound} to ${lowerBound})`
            );
          } else if (
            dataIndex === 'actualThickness' && (value < lowerBoundThickness || value > upperBoundThickness)
          ) {
            callback(
              `You are out of range, range is (${lowerBoundThickness} to ${upperBoundThickness})`
            );
          } else if (
            dataIndex === 'actualLength' && (value < lowerBoundLength || value > upperBoundLength)
          ) {
            callback(
              `You are out of range, range is (${lowerBoundLength} to ${upperBoundLength})`
            );
          } else if (
            dataIndex === 'burrHeight' &&
            (value < lowerBurrHeightPercent ||
              value > upperBurrHeightPercent)
          ) {
            callback(
              `You are out of range, range is (${lowerBurrHeightPercent} to ${upperBurrHeightPercent})`
            );
          } else if (
            dataIndex === 'diagonalDifference' &&
            (actualdiagonalDifference <
              lowerBoundtoleranceDiagonalDifferenceFrom ||
              actualdiagonalDifference > uppertoleranceDiagonalDifferenceTo)
          ) {
            callback(
              `You are out of range, range is (${lowerBoundtoleranceDiagonalDifferenceFrom} to ${uppertoleranceDiagonalDifferenceTo})`
            ) 
         } else if (
            dataIndex === 'actualWidth' && (value < lowerBoundtoleranceSlitSizeFrom || value > upperBoundtoleranceSlitSizeTo)
          ) {
            callback(
              `You are out of range, range is ${lowerBoundtoleranceSlitSizeFrom} to ${upperBoundtoleranceSlitSizeTo}`
            ) 
          } else if ( dataIndex === 'burrHeight' &&
          (value < lowerBurrHeightPercentSlit ||
            value > upperBurrHeightPercentSlit)
        ) {
          callback(
            `You are out of range, range is (${lowerBurrHeightPercentSlit} to ${upperBurrHeightPercentSlit})`
          );
        } else if (
          dataIndex === 'actualThickness' && (value < lowerBoundThicknessSlit || value > upperBoundThicknessSlit)
        ) {
          callback(
            `You are out of range, range is (${lowerBoundThicknessSlit} to ${upperBoundThicknessSlit})`
          );
          } else {
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
            ref={(node) => (this.input = node)}
            onPressEnter={this.save}
            onBlur={this.save}
          />
        )}
      </Form.Item>
    ) : (
      <div
        className='editable-cell-value-wrap'
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
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
      toleranceData,
      thicknessSlit,
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
class EditableTableQR extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [...props.columns];
    this.state = {
      dataSource: this.props.dataSource,
      count: this.props.dataSource.length,
      toleranceData: this.props.toleranceData,
      thicknessSlit: this.props.thicknessSlit
    };
    console.log('properties :', this.props);
    this.columns.push({
      title: 'operation',
      dataIndex: 'operation',
      render: (text, record) =>
        this.state.dataSource.length >= 1 ? (
          <div>
            <a onClick={() => this.handleEdit(record.key)}>Edit</a>
          </div>
        ) : null,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.dataSource !== prevProps.dataSource) {
      this.setState({ dataSource: this.props.dataSource });
    }
  }

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter((item) => item.key !== key),
    });
  };

  handleEdit = (key) => {
    const { history } = this.props;
    history.push('/company/quality/templates');
    console.log(`Editing record with key: ${key}`);
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = { key: count, ...this.props.emptyRow };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
    this.props.handleChange(newData);
  };

  render() {
    const { dataSource, toleranceData, thicknessSlit } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          toleranceData: this.props.toleranceData,
          thicknessSlit: this.props.thicknessSlit,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div className='table-container'>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          toleranceData={toleranceData}
          thicknessSlit={thicknessSlit}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}

export default withRouter(EditableTableQR);
