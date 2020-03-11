import React from 'react';
import * as d3 from 'd3';
import agg from '../assets/data/agg.csv'
import kill from  '../assets/data/kill.csv'
import {MapWrapper} from "./MapWrapper";
import {Slider, Row, Col} from 'antd';

export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.readData = this.readData.bind(this);
    }

    state = {
        time_interval: [1, 40],
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
                                max={40}
                                min={1}
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}

