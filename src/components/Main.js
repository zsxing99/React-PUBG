import React from 'react';
import * as d3 from 'd3';
import agg from '../assets/data/agg.csv'
import kill from  '../assets/data/kill.csv'
import {MapWrapper} from "./MapWrapper";
import {Button, Slider, Row, Col} from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';

export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.readData = this.readData.bind(this);
    }

    state = {
        time_interval: [1, 40],
        inAnimation: false,
        agg: undefined,
        kill: undefined
    };

    readData() {
        d3.csv(agg).then((data) => {
            this.setState({
                agg: data
            })
        });
        d3.csv(kill).then((data) => {
            this.setState({
                kill: data
            })
        });
    }
    componentWillMount() {
        this.readData();
    }

    timeInterval_tooltip = (value) => {
        return `${value} min`;
    };

    onChangeTimeInterval = (value) => {
        this.setState({
            time_interval: value
        })

        // perform filtering
    };

    onClickAnimate = () => {
        this.setState({
            inAnimation: true
        });
        const second_per_min = 2000;
        const t = (this.state.time_interval[1] - this.state.time_interval[0]);
        setTimeout(this.animationTimer, t * second_per_min);
    };

    animationTimer = () => {
        this.setState({
            inAnimation: false
        });
    };

    render() {
        return this.state.agg === undefined ? (
            <div>LOADING</div>
        ) : (
            <div className="main">
                <div className="vis">
                    <MapWrapper kill={this.state.kill}/>
                    <div className="toolbox">
                        <Row>
                            <Col span={20}>
                            Time Interval: &nbsp;
                            <Slider
                                range
                                defaultValue={this.state.time_interval}
                                onChange={this.onChangeTimeInterval}
                                tipFormatter={this.timeInterval_tooltip}
                                disabled={this.state.inAnimation}
                                max={40}
                                min={1}
                                marks={{
                                    1: "Start",
                                    40: "End"
                                }}
                                />
                            </Col>
                            <Col>
                                <Button
                                    type="primary"
                                    icon={<CaretRightOutlined />}
                                    loading={this.state.inAnimation}
                                    onClick ={this.onClickAnimate}
                                >
                                    {(!this.state.inAnimation) ? "Animate" : "Animating"}
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}

