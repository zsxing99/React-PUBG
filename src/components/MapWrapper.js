import React from 'react';
import {Map} from "./Map";
import { Slider, Row, Col, Switch } from 'antd';

export class MapWrapper extends React.Component {
    state = {
        enable_killer: true,
        enable_victim: true,
        opacity: 0.2
    };

    constructor(props) {
        super(props);
    }

    opacity_tooltip = (value) => {
        return `${value}%`;
    };

    killer_onChange = (checked) => {
        this.setState({
            enable_killer: checked
        })
    };

    victim_onChange = (checked) => {
        this.setState({
            enable_victim: checked
        })
    };

    opacity_onChange = (value) => {
        this.setState({
            opacity: value / 100
        })
    };

    render() {

        return (
            <div>
                <div className="map-view">
                    <Map
                        data={this.props.kill}
                        options={{enable_killer: this.state.enable_killer, enable_victim: this.state.enable_victim,
                            opacity: this.state.opacity}}
                        interval={this.props.interval}
                    />
                </div>
            <div className="map-filter">
                <Row>
                    <Col span={5}>
                        Aggregate level: &nbsp;
                        <Slider
                            step={10}
                            defaultValue={20}
                            tipFormatter={this.opacity_tooltip}
                            onAfterChange={this.opacity_onChange}
                        />
                    </Col>
                    <Col span={8}>
                        Killer position: &nbsp;
                        <Switch defaultChecked checkedChildren="red" onChange={this.killer_onChange} />
                    </Col>
                    <Col>
                        Victim position: &nbsp;
                        <Switch defaultChecked checkedChildren="blue" onChange={this.victim_onChange} />
                    </Col>
                </Row>
            </div>
            </div>
        )
    }

}