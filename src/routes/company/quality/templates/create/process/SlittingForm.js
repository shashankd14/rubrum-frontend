import { Card, Col, DatePicker, Input, Row } from 'antd'
import React from 'react'

const SlittingForm = (props) => {

    const gridCardStyle = {
        width: '50%',
        height: 300,
        textAlign: 'center',
        display: "grid",
        paddingRight: 25
    };

    const gridStyle = {
        width: '100%',
        height: 100,
        textAlign: 'center',
    };


    return (
        <div id="slittingform">
            <Card title="Slitting Process Form">
                <Card.Grid style={gridCardStyle}>
                    <Row>
                        <label>Customer Name</label>
                        <Input placeholder='Enter customer name'></Input>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Process Date</label>
                            <DatePicker></DatePicker>
                        </Col>
                        <Col span={12}>
                            <label>Batch Number</label>
                            <Input></Input>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Grade</label>
                            <Input></Input>
                        </Col>
                        <Col span={12}>
                            <label>Coil Thickness (IN MM)</label>
                            <Input></Input>
                        </Col>

                    </Row>
                    <Row>
                        <label>Physical Appearance</label>
                        <Input></Input>
                    </Row>

                </Card.Grid>
                <Card.Grid style={gridCardStyle}>
                    <Row>
                        <label>Operation</label>
                        <Input></Input>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Mother Coil No.</label>
                            <Input></Input>
                        </Col>
                        <Col span={12}>
                            <label>AspenCoil No.</label>
                            <Input></Input>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={12}>
                            <label>Coil Width (IN MM)</label>
                            <Input></Input>
                        </Col>
                        <Col span={12}>
                            <label>Coil Weight (IN KGs)</label>
                            <Input></Input>
                        </Col>
                    </Row>
                    <Row>
                        <label>Report Date</label>
                            <DatePicker style={{width: "100%"}}></DatePicker>
                    </Row>

                </Card.Grid>
                <Card.Grid style={gridStyle}>Content</Card.Grid>
                <Card.Grid style={gridStyle}>Content</Card.Grid>
                <Card.Grid style={gridStyle}>Content</Card.Grid>
            </Card>
        </div>
    )
}

export default SlittingForm