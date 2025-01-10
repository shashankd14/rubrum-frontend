import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Descriptions, Input, Popover } from 'antd';
import { InfoCircleOutlined, CloseSquareTwoTone } from '@ant-design/icons';
import { fetchDeliveryListById } from '../../../appRedux/actions';
import moment from 'moment';

const BillingInfo = props => {
  useEffect(() => {
    props.fetchDeliveryListById(Number(props.match.params.deliveryId));
  }, []);
  return <div>Billing Info</div>;
};

const mapStateToProps = state => ({
  deliveryList: state.deliveries.deliveryList,
});

export default connect(mapStateToProps, {
  fetchDeliveryListById,
})(BillingInfo);
