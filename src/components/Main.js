import React from 'react';
import * as d3 from 'd3';
import agg from '../assets/data/agg.csv'
import kill from  '../assets/data/kill.csv'
import {MapWrapper} from "./MapWrapper";
import {Form, InputNumber, Button, Slider, Row, Col} from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';

export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.readData = this.readData.bind(this);
    }

    state = {
        timer_current: 1,
        time_interval: [1, 40],
        inAnimation: false,
        agg: undefined,
        kill: undefined,
        filtered_kill: undefined
    };

    readData() {
        d3.csv(agg).then((data) => {
            this.setState({
                agg: data
            })
        });
        d3.csv(kill).then((data) => {
            this.setState({
                filtered_kill: data,
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

    binarySearchFirst = (data, target) => {
        let l = 0, r = data.length;
        while (l < r - 1) {
            const mid = Math.floor((l + r) / 2);
            if ((data[mid]).time < target) {
                l = mid;
            } else {
                r = mid;
            }
        }
        return data[l] >= target ? l : r;
    };

    binarySearchLast = (data, target) => {
        let l = 0, r = data.length;
        while (l < r - 1) {
            const mid = Math.floor((l + r) / 2);
            if ((data[mid]).time < target) {
                l = mid;
            } else {
                r = mid;
            }
        }
        return data[r] <= target ? r : l;
    };

    find_interval = (data, value) => {
        return [this.binarySearchFirst(data, value[0]),
                this.binarySearchLast(data, value[1])]
    };

    onChangeTimeInterval = (value) => {
        this.setState({
            timer_current: value[0],
            time_interval: value
        });

        // const interval = this.find_interval(this.state.kill, [value[0] * 60, value[1] * 60]);
        // this.setState({
        //     filtered_kill: kill.slice(interval)
        // })
    };

    onClickAnimate = () => {
        this.setState({
            inAnimation: true
        });
        const second_per_min = 1000;
        let curr = this.state.time_interval[0];
        let start = curr;
        let end = this.state.time_interval[1];
        let timer = setInterval(() => {
            if (curr <= end) {
                this.setState({
                    timer_current: curr,
                    time_interval: [start, curr]
                });
                curr++;
            } else {
                clearInterval(timer);
                this.setState({
                    inAnimation: false
                })
            }
        }, second_per_min);
    };

    render() {
        return this.state.agg === undefined ? (
            <div>LOADING</div>
        ) : (
            <div className="main">
                <div className="vis">
                    <MapWrapper kill={this.state.kill} interval={this.state.time_interval}/>
                    <div className="toolbox">
                        <Row>
                            <Col span={20}>
                            Time Interval: &nbsp;
                            <Slider
                                range
                                defaultValue={this.state.time_interval}
                                onAfterChange={this.onChangeTimeInterval}
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
                            <Col span={12}>
                                <Form layout="vertical">
                                    <Form.Item label="1st Coordinate">
                                        <InputCoordinate/>
                                    </Form.Item>
                                    <Form.Item label="2nd Coordinate">
                                        <InputCoordinate/>
                                    </Form.Item>
                                    <Form.Item label="3rd Coordinate">
                                        <InputCoordinate/>
                                    </Form.Item>
                                    <Form.Item label="4th Coordinate">
                                        <InputCoordinate/>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary">
                                            Select Range
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                            <Col>
                                <Button
                                    type="primary"
                                    icon={<CaretRightOutlined />}
                                    loading={this.state.inAnimation}
                                    onClick ={this.onClickAnimate}
                                >
                                    {(!this.state.inAnimation) ? "Animate" : "Animating " + this.state.timer_current + " min"}
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}

class InputCoordinate extends React.Component {
    render() {
        return (
            <InputNumber
                style={{ width: '100%' }} min={0} max={800000.0} precision={1} placeholder={"0 - 800000.0"}
            />
        );
    }
}
