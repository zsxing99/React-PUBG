import React from "react";
import { scaleLinear, max, axisLeft, axisBottom, select } from "d3";
import * as d3 from 'd3';
import '../styles/Matrix.css';

class ScatterPlot extends React.Component {
    constructor(props) {
        super(props)
    }
    state = {
        xMax: -1,
        yMax: -1,
        isMaxSet: false
    };

    findMinMax() {
        const margin = { top: 20, right: 15, bottom: 60, left: 60 }
        const width = 250 - margin.left - margin.right
        const height = 250 - margin.top - margin.bottom
        var data = this.props.data;
        var x = [], y = [];
        for (var i = 0; i < data.length; i++) {
            x.push((data[i][0]))
            y.push((data[i][1]))
        }
        var xMax = d3.max(x);
        var yMax = d3.max(y);

        // Rescale outliers
        if (xMax > 10000) {
            xMax = 10000;
        }
        if (yMax > 10000) {
            yMax = 10000;
        }

        const x_axis = scaleLinear()
            .domain([0, xMax])
            .range([0, width]);


        const y_axis = scaleLinear()
            .domain([0, yMax])
            .range([height, 0])

        this.setState({
            xMax: x_axis,
            yMax: y_axis,
            isMaxSet: true
        })
    }

    componentWillMount() {
        if (!this.state.isMaxSet) {
            this.findMinMax();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.data !== this.props.data) {
            this.findMinMax();
        }
    }

    render() {
        const margin = { top: 20, right: 15, bottom: 60, left: 60 }
        const width = 250 - margin.left - margin.right
        const height = 250 - margin.top - margin.bottom
        const data = this.props.data


        return (
            <div>
                <h6> {this.props.title}</h6>
                <svg
                    width={width + margin.right + margin.left}
                    height={height + margin.top + margin.bottom}
                    className="chart"
                >
                    <g
                        transform={"translate(" + margin.left + "," + margin.top + ")"}
                        width={width}
                        height={height}
                        className="main"
                    >
                        <RenderCircles data={data} scale={{ x :this.state.xMax, y: this.state.yMax }} />
                        <Axis
                            a="x"
                            transform={"translate(0," + height + ")"}
                            scale={axisBottom().scale(this.state.xMax).ticks(8)}
                        />
                        <Axis
                            a="y"
                            transform="translate(0,0)"
                            scale={axisLeft().scale(this.state.yMax).ticks(8)}
                        />
                    </g>
                </svg>
            </div>
        )
    }
}

class RenderCircles extends React.Component {
    render() {
        let renderCircles = this.props.data.map((coords, i) => (
            <circle
                cx={this.props.scale.x(coords[0])}
                cy={this.props.scale.y(coords[1])}
                r="2"
                style={{ fill: "rgba(25, 158, 199, .9)" }}
                key={i}
            />
        ))
        return <g>{renderCircles}</g>
    }
}

class Axis extends React.Component {
    componentDidMount() {
        const node = this.refs[this.props.a]
        select(node).call(this.props.scale)
    }

    render() {
        return (
            <g className={this.props.a === "x" ? "Axis-bottom" : "Axis"}
                transform={this.props.transform}
                ref={this.props.a}
            />
        )
    }
}


export default ScatterPlot;