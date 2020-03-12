import React from 'react';
import '../styles/App.css';
import {Main} from "./Main";
import logo from "../assets/images/pubg-logo.png";
import {Button, Col, Drawer, Form, InputNumber, Row, Slider} from "antd";
import { CaretRightOutlined } from '@ant-design/icons';

class App extends React.Component {
    state = {
        timer_current: 1,
        time_interval: [1, 40],
        inAnimation: false,
        visible_toolbox: false
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

    onClickGitHub = () => {
        window.open("https://github.com/zsxing99/React-PUBG")
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

    showDrawer_tb = () => {
        this.setState({
            visible_toolbox: true,
        });
    };

    onClose_tb = () => {
        this.setState({
            visible_toolbox: false,
        });
    };

    timeInterval_tooltip = (value) => {
        return `${value} min`;
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo"/>
                    <div className="App-menu">
                        <Button type="primary" style={{height: "55px", background: "black", borderColor: "grey"}}
                                onClick={this.onClickGitHub}
                        >
                            GitHub
                        </Button>
                        <Button type="primary" style={{height: "55px", background: "black", borderColor: "grey"}}>
                            Description
                        </Button>
                        <Button type="primary" style={{height: "55px", background: "black", borderColor: "grey"}}
                                onClick={this.showDrawer_tb}
                        >
                            {this.state.inAnimation ? "Animating " + this.state.timer_current + " min" : "ToolBox"}
                        </Button>
                        <Drawer
                            mask={false}
                            width={300}
                            placement="right"
                            closable={true}
                            onClose={this.onClose_tb}
                            visible={this.state.visible_toolbox}
                        >
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
                                </Row>
                                <Row span={8}>
                                    <Form layout="vertical">
                                        Area: &nbsp;
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
                                </Row>
                                <Row>
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
                        </Drawer>
                    </div>
                </header>
                <Main selectors={{time_interval: this.state.time_interval}}/>
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

export default App;
