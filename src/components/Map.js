import React from 'react';
import * as d3 from 'd3';
import map1 from '../assets/images/erangel.jpg'

export class Map extends React.Component {
    state = {
        x : d3.scaleLinear()
            .range([0, 600])
            .domain([0, 800000]),
        y : d3.scaleLinear()
            .range([600, 0])
            .domain([800000, 0]),
        init: true
    };

    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.init) {
            const map = d3.select("#map-vis")
                .append("svg")
                .attr('width', 600)
                .attr('height', 600)
                .call(d3.zoom().scaleExtent([1, 8]).on("zoom", function () {
                    map.attr("transform", d3.event.transform)
                }));

            map.append("image")
                .attr("xlink:href", map1)
                .attr('width', 600)
                .attr('height', 600);

            const pairs = map
                .append("g")
                .selectAll("dot")
                .data(this.props.data)
                .enter();

            pairs
                .append("circle")
                .attr("class", "ERANGEL-killers")
                .attr("cx", (d) => (this.state.x(d["killer_position_x"]) * 800 / 812.45))
                .attr("cy", (d) => (this.state.y(d["killer_position_y"]) * 800 / 812))
                .attr("fill", "#ff0000")
                .attr("opacity", "0.2")
                .attr('r', 1);

            pairs
                .append("circle")
                .attr("class", "ERANGEL-victims")
                .attr("cx", (d) => (this.state.x(d["victim_position_x"]) * 800 / 812.45))
                .attr("cy", (d) => (this.state.y(d["victim_position_y"]) * 800 / 812))
                .attr("fill", "#008bff")
                .attr("opacity", "0.2")
                .attr('r', 1);

            this.setState({
                init: false
            })
        } else {
            if (prevProps.options.enable_killer !== this.props.options.enable_killer ||
                prevProps.options.opacity !== this.props.options.opacity) {
                const killers = d3.selectAll(".ERANGEL-killers");
                if (this.props.options.enable_killer) {
                    killers.attr("opacity", this.props.options.opacity);
                } else {
                    killers.attr("opacity", "0");
                }
            }

            if (prevProps.options.enable_victim !== this.props.options.enable_victim ||
                prevProps.options.opacity !== this.props.options.opacity) {
                const victims = d3.selectAll(".ERANGEL-victims");
                if (this.props.options.enable_victim) {
                    victims.attr("opacity", this.props.options.opacity);
                } else {
                    victims.attr("opacity", "0");
                }
            }

            if (prevProps.interval !== this.props.interval) {
                const interval = [this.props.interval[0] * 60, this.props.interval[1] * 60];

                if (this.props.options.enable_victim) {
                    d3.selectAll(".ERANGEL-victims")
                        .filter(function (d) {
                            return d.time <= interval[1] && d.time > interval[0];
                        })
                        .attr("opacity", this.props.options.opacity);

                    d3.selectAll(".ERANGEL-victims")
                        .filter(function (d) {
                            return d.time > interval[1] || d.time <= interval[0];
                        })
                        .attr("opacity", 0);
                }

                if (this.props.options.enable_killer) {
                    d3.selectAll(".ERANGEL-killers")
                        .filter(function (d) {
                            return d.time <= interval[1] && d.time > interval[0];
                        })
                        .attr("opacity", this.props.options.opacity);

                    d3.selectAll(".ERANGEL-killers")
                        .filter(function (d) {
                            return d.time > interval[1] || d.time <= interval[0];
                        })
                        .attr("opacity", 0);
                }
            }
        }
    }

    render() {
        if (this.props.data === undefined) {
            return (
                <p>LOADING MAP</p>
            );
        }

        return (
            <div id="map-vis"></div>
        );
    }
}
