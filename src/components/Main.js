import React from 'react';
import * as d3 from 'd3';

import agg from '../assets/data/agg.csv'
import kill from '../assets/data/kill.csv'
import Map from '../components/Map';
import BubbleChart from '../components/BubbleChart';
import Scatterplot from '../components/Scatterplot';

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.readData = this.readData.bind(this);
        this.setBubbleChartData = this.setBubbleChartData.bind(this);
    }

    state = {
        agg: undefined,
        kill: undefined,
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

    render() {

        return (
            <div>
                <div>
                    <p>{this.state.agg !== undefined ? this.state.agg[0].date : "TODO"}</p>
                </div>
                <div style={styles.mainVisContainer}>
                    <div style={styles.leftVisContainer}>
                        <Map />
                    </div>
                    <div style={styles.rightVisContainer}>
                        <div style={styles.bubbleContainer}>
                            <BubbleChart
                                graph={{
                                    zoom: 0.8,
                                    offsetX: 0,
                                    offsetY: 0,
                                }}
                                width={0.5 * windowWidth}
                                height={600}
                                padding={5}
                                valueFont={{
                                    family: 'Arial',
                                    size: 12,
                                    color: '#fff',
                                    weight: 'bold',
                                }}
                                labelFont={{
                                    family: 'Arial',
                                    size: 16,
                                    color: '#fff',
                                    weight: 'bold',
                                }}
                                bubbleClickFunc={this.bubbleClick}
                                data={this.state.bubbleChartData}
                            />
                        </div>
                        <div style={styles.scatterContainer}>
                            <Scatterplot />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const styles = {
    mainVisContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    leftVisContainer: {
        backgroundColor: 'pink',
        width: 0.5 * windowWidth,
    },
    rightVisContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: 0.5 * windowWidth,
    },
    bubbleContainer: {
        backgroundColor: 'lightgreen',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    scatterContainer: {
        backgroundColor: 'orange',
        width: '100%',
        height: 0.5 * windowHeight,
    },
}

