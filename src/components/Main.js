import React from 'react';
import * as d3 from 'd3';

import agg from '../assets/data/agg.csv'
import kill from '../assets/data/kill.csv'
import { MapWrapper } from "./MapWrapper";
import BubbleChart from "./BubbleChart";
import ScatterplotMatrix from "./ScatterplotMatrix";

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
        time_interval: undefined,
        bubbleChartData: undefined,
        shouldHighlightMap: false,
        weaponSelected: "NONE",
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
            });
            this.setBubbleChartData(data, 'killed_by', [0, 40],
                [[0, 0], [800000, 800000]]);
        });
    };

    // filter: weapons victims are killed by during the selected time interval and spatial range when he dies
    setBubbleChartData(data, groupByKey, time_interval, spatial_selection) {
        var temp = [];
        var buffer = [];
        var result = [];
        const interval = [time_interval[0] * 60, time_interval[1] * 60];
        console.log("Interval 0 is " + time_interval[0] * 60)
        console.log("Interval 1 is " + time_interval[1] * 60)
        console.log(data[0].time)
        data.forEach(element => {
            if (time_interval || spatial_selection) {
                if (element.hasOwnProperty(groupByKey)
                    && (element.time >= interval[0] && element.time <= interval[1]
                        //x0 y0, x1 y1 --> 50 100, 200 300
                        //victim_position_x,victim_position_y
                        && (element.victim_position_x >= spatial_selection[0][0] && element.victim_position_x <= spatial_selection[1][0]
                            && (element.victim_position_y >= spatial_selection[0][1] && element.victim_position_y <= spatial_selection[1][1])
                        )
                    )
                ) {

                    temp.push(element[groupByKey]);
                }

            }
        });

        temp.forEach(element => {
            if (buffer.includes(element)) {
                result.forEach(e => {
                    if (e.label === element) {
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

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.selectors.time_interval !== this.props.selectors.time_interval
            || prevProps.selectors.spatial_selection !== this.props.selectors.spatial_selection) {
            this.setBubbleChartData(this.state.kill, 'killed_by',
                this.props.selectors.time_interval, this.props.selectors.spatial_selection);
        }
    }

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

    onChangeTimeInterval = (value) => {
        this.setState({
            time_interval: value
        });

        // const interval = this.find_interval(this.state.kill, [value[0] * 60, value[1] * 60]);
        // this.setState({
        //     filtered_kill: kill.slice(interval)
        // })
    };

    bubbleClick = (label, shouldUpdateMap) => {
        if (!shouldUpdateMap) {
            this.setState({
                shouldHighlightMap: true,
                weaponSelected: label,
            })
        } else {
            this.setState({
                shouldHighlightMap: true,
                weaponSelected: "NONE",
            })
        }

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
                                shouldHighlight={this.state.shouldHighlightMap}
                                weapon={this.state.weaponSelected}
                            />
                        </div>
                        <div>
                            <BubbleChart
                                graph={{
                                    zoom: 1,
                                    offsetX: 0,
                                    offsetY: 0,
                                }}
                                width={700}
                                height={700}
                                padding={5} // padding between bubbles
                                bubbleClickFunc={this.bubbleClick}
                                data={this.state.bubbleChartData}
                                interval={this.props.selectors.time_interval}
                                space={this.props.selectors.spatial_selection}
                                select={this.state.weaponSelected}
                            />
                        </div>
                        <div>
                            <ScatterplotMatrix
                                data={this.state.agg}
                            />
                        </div>
                    </div>
                </div>
            );
    }
}


