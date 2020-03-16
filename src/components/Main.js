import React from 'react';
import * as d3 from 'd3';

import agg from '../assets/data/agg.csv'
import kill from '../assets/data/kill.csv'
import { MapWrapper } from "./MapWrapper";
import BubbleChart from "./BubbleChart";

export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.readData = this.readData.bind(this);
        this.setBubbleChartData = this.setBubbleChartData.bind(this);
    }

    state = {
        agg: undefined,
        kill: undefined,
        filtered_kill: undefined,
        bubbleChartData: undefined,
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
            this.setBubbleChartData(data, 'killed_by');
        });
    };

    setBubbleChartData(data, groupByKey) {
        var temp = [];
        var buffer = [];
        var result = [];
        data.forEach(element => {
            if (element.hasOwnProperty(groupByKey)) {
                temp.push(element[groupByKey]);
            }
        });
        temp.forEach(element => {
            if (buffer.includes(element)) {
                result.forEach(e => {
                    if (e.label == element) {
                        e.value += 1;
                    }
                })
            } else {
                var obj = {
                    label: element,
                    value: 1
                }
                result.push(obj);
                buffer.push(element);
            }
        });
        this.setState({
            bubbleChartData: result
        })
    };

    componentWillMount() {
        this.readData();
    }

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

    render() {
        return this.state.agg === undefined ? (
            <div>LOADING</div>
        ) : (
                <div className="main">
                    <div className="vis">
                        <div>
                            <MapWrapper kill={this.state.kill} interval={this.props.selectors.time_interval}
                                spatial_selection={this.props.selectors.spatial_selection}
                            />
                        </div>
                        <div>
                            <BubbleChart
                                graph={{
                                    zoom: 1,
                                    offsetX: 0,
                                    offsetY: 0,
                                }}
                                width={600}
                                height={700}
                                padding={5} // optional value, number that set the padding between bubbles
                                bubbleClickFunc={this.bubbleClick}
                                legendClickFun={this.legendClick}
                                data={this.state.bubbleChartData}
                            />
                        </div>
                    </div>
                </div>
            );
    }
}


