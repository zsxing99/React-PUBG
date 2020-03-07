import React from 'react';
import * as d3 from 'd3';
import agg from '../assets/data/agg.csv'
import kill from  '../assets/data/kill.csv'

export class Main extends React.Component{
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
        console.log(this.state.agg);
        return (
            <div>
                <p>{this.state.agg !== undefined ? this.state.agg[0].date : "TODO"}</p>
            </div>
        );
    }
}

