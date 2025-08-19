import React, {useEffect, useState}from "react";
import {connect} from "react-redux";
import { Table } from 'antd';
import {fetchDeliveryListById} from "../../../appRedux/actions";
import { toPascalCase } from "util/Common";

const DeliveryDetails = (props) => {
  const [deliveryById, setDeliveryById]=useState(props.delivery.deliveryById);
  const [coil, setCoil] = useState(props.delivery.deliveryList);
  const columns = [
    {
        title: 'Batch no.',
        dataIndex: 'coilNumber',
        key: 'x',       
    },
    {
        title: 'SC inward id',
        dataIndex: 'customerBatchId',
        key: 'customerBatchId'
    },
    {
        title: 'Quantity',
        dataIndex: 'actualWeight',
        key: 'actualWeight'
    },
    {
        title: 'Coil Width',
        dataIndex:'plannedWidth',
        
    },
    {
        title: 'Coil Thickness',
        dataIndex:'thickness',
        
    },
    {
        title: 'Coil length',
        dataIndex: 'actualLength',
        key: 'actualLength'
    },
    {
      title: 'No of Pieces',
      dataIndex: 'actualNoOfPieces',
      key: 'actualNoOfPieces'
  },
    {
        title: 'Material',
        dataIndex: 'material',
        key: 'material'
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: ''
    },
    {
      title: 'Packaging Classification',
      dataIndex: 'packetClassification.classificationName',
      key: 'packetClassification.classificationName',
      render: (text, record) => {
            return record.packetClassification
              ? record.packetClassification.classificationName  === 'FG' ? 'Ready to deliver' : toPascalCase(
                  record.packetClassification.classificationName
                )
              : "-";
      }
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks'
    },
    ]
  useEffect(() => {
    if(props.delivery.deliveryList.length>0){
      let coilList =coil.filter(element => element.deliveryDetails.deliveryId === Number(props.match.params.deliveryId));
      setCoil(coilList[0]);
    }
}, [])
useEffect(() => {
  if(!props.delivery.loading && props.delivery.success) {
    let tableData = [];
    tableData = props.delivery.deliveryById.map(element => {
      element.coilNumber = coil.coilNumber;
      element.customerBatchId = coil.customerBatchId;
      element.material = coil?.materialDto?.material
      element.thickness = coil?.fThickness;
      element.grade = coil?.materialDto?.materialGradeDto.gradeName;
      return element
    })
    setDeliveryById(tableData);
  }
}, [props.delivery.loading, props.delivery.success])
  return (
      <div>
        <div>
            <h3>Delivery Information</h3>
        </div>
       
        {deliveryById.length > 0 ? 
          <Table
          rowSelection={[]}
             className="gx-table-responsive"
             columns={columns}
             dataSource={deliveryById}
      />
            : <p> No Item to display for the selected delivery chalan Number</p>}
      </div>
    

  );
};

const mapStateToProps = state => ({
  delivery: state.deliveries,
});

export default connect(mapStateToProps, {
  fetchDeliveryListById,
})(DeliveryDetails);
