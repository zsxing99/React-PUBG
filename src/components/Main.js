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

    render() {
        return this.state.agg === undefined ? (
            <div></div>
        ) : (
            <div className="main">
                <div className="vis">
                    <MapWrapper kill={this.state.kill}/>
                </div>
            </div>
        );
    }
}

