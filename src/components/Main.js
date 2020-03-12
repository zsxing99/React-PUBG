import React from 'react';
import * as d3 from 'd3';
import agg from '../assets/data/agg.csv'
import kill from  '../assets/data/kill.csv'
import {MapWrapper} from "./MapWrapper";

export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.readData = this.readData.bind(this);
    }

    state = {
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
                    <MapWrapper kill={this.state.kill} interval={this.props.selectors.time_interval}/>
                </div>
            </div>
        );
    }
}
