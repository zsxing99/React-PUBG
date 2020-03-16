import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

export default class BubbleChart extends Component {
    constructor(props) {
        super(props);
        this.drawChart = this.drawChart.bind(this);
        this.drawBubbles = this.drawBubbles.bind(this);
    }

    componentDidMount() {
        this.svg = ReactDOM.findDOMNode(this);
        this.drawChart();
    }

    componentDidUpdate() {
        const {
            width,
            height,
        } = this.props;
        if (width !== 0 && height !== 0) {
            this.drawChart();
        }
    }

    render() {
        const {
            width,
            height,
        } = this.props;
        return (
            <svg width={width} height={height} />
        )
    }

    drawChart() {
        const {
            graph,
            data,
            height,
            width,
            padding,
        } = this.props;
        // Reset the svg element to a empty state.
        this.svg.innerHTML = '';

        const bubblesWidth = width;
        const color = d3.scaleOrdinal(d3.schemeDark2);

        const pack = d3.pack()
            .size([bubblesWidth * graph.zoom, bubblesWidth * graph.zoom])
            .padding(padding);

        // Process the data to have a hierarchy structure;
        const root = d3.hierarchy({ children: data })
            .sum(function (d) { return d.value; })
            .sort(function (a, b) { return b.value - a.value; })
            .each((d) => {
                if (d.data.label) {
                    d.label = d.data.label;
                    d.id = d.data.label.toLowerCase().replace(/ |\//g, "-");
                }
            });

        // Pass the data to the pack layout to calculate the distribution.
        const nodes = pack(root).leaves();

        // Call to the function that draw the bubbles.
        this.drawBubbles(bubblesWidth, nodes, color);
    }

    drawBubbles(width, nodes, color) {
        const {
            graph,
            data,
            bubbleClickFun,
            valueFont,
            labelFont,
        } = this.props;

        const bubbleChart = d3.select(this.svg).append("g")
            .attr("class", "bubble-chart")
            .attr("transform", function (d) { return "translate(" + (width * graph.offsetX) + "," + (width * graph.offsetY) + ")"; });;

        const node = bubbleChart.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
            .on("click", function (d) {
                bubbleClickFun(d.label);
            });

        node.append("circle")
            .attr("id", function (d) { return d.id; })
            .attr("r", function (d) { return d.r - (d.r * .04); })
            .style("fill", function (d) { return d.data.color ? d.data.color : color(nodes.indexOf(d)); })
            .style("z-index", 1)
            .on('mouseover', function (d) {
                d3.select(this).attr("r", d.r * 1.04);
            })
            .on('mouseout', function (d) {
                const r = d.r - (d.r * 0.04);
                d3.select(this).attr("r", r);
            });

        node.append("clipPath")
            .attr("id", function (d) { return "clip-" + d.id; })
            .append("use")
            .attr("xlink:href", function (d) { return "#" + d.id; });

        node.append("text")
            .attr("class", "value-text")
            .style("font-size", `${valueFont.size}px`)
            .attr("clip-path", function (d) { return "url(#clip-" + d.id + ")"; })
            .style("font-weight", (d) => {
                return valueFont.weight ? valueFont.weight : 600;
            })
            .style("font-family", valueFont.family)
            .style("fill", () => {
                return valueFont.color ? valueFont.color : '#000';
            })
            .style("stroke", () => {
                return valueFont.lineColor ? valueFont.lineColor : '#000';
            })
            .style("stroke-width", () => {
                return valueFont.lineWeight ? valueFont.lineWeight : 0;
            })
            .text(function (d) { return d.value; });

        node.append("text")
            .attr("class", "label-text")
            .style("font-size", `${labelFont.size}px`)
            .attr("clip-path", function (d) { return "url(#clip-" + d.id + ")"; })
            .style("font-weight", (d) => {
                return labelFont.weight ? labelFont.weight : 600;
            })
            .style("font-family", labelFont.family)
            .style("fill", () => {
                return labelFont.color ? labelFont.color : '#000';
            })
            .style("stroke", () => {
                return labelFont.lineColor ? labelFont.lineColor : '#000';
            })
            .style("stroke-width", () => {
                return labelFont.lineWeight ? labelFont.lineWeight : 0;
            })
            .text(function (d) {
                return d.label;
            });


        // Center the texts inside the circles.
        d3.selectAll(".label-text").attr("x", function (d) {
            const self = d3.select(this);
            const width = self.node().getBBox().width;
            return -(width / 2);
        })
            .style("opacity", function (d) {
                const self = d3.select(this);
                const width = self.node().getBBox().width;
                d.hideLabel = width * 1.05 > (d.r * 2);
                return d.hideLabel ? 0 : 1;
            })
            .attr("y", function (d) {
                return labelFont.size / 2
            })

        // Center the texts inside the circles.
        d3.selectAll(".value-text").attr("x", function (d) {
            const self = d3.select(this);
            const width = self.node().getBBox().width;
            return -(width / 2);
        })
            .attr("y", function (d) {
                if (d.hideLabel) {
                    return valueFont.size / 3;
                } else {
                    return -valueFont.size * 0.5;
                }
            });

        node.append("title")
            .text(function (d) { return d.label; });
    }

}

BubbleChart.propTypes = {
    graph: PropTypes.shape({
        zoom: PropTypes.number,
        offsetX: PropTypes.number,
        offsetY: PropTypes.number,
    }),
    width: PropTypes.number,
    height: PropTypes.number,
    padding: PropTypes.number,
    valueFont: PropTypes.shape({
        family: PropTypes.string,
        size: PropTypes.number,
        color: PropTypes.string,
        weight: PropTypes.string,
    }),
    labelFont: PropTypes.shape({
        family: PropTypes.string,
        size: PropTypes.number,
        color: PropTypes.string,
        weight: PropTypes.string,
    }),
}
BubbleChart.defaultProps = {
    graph: {
        zoom: 1.1,
        offsetX: -0.05,
        offsetY: -0.01,
    },
    width: 1000,
    height: 800,
    padding: 0,
    valueFont: {
        family: 'Arial',
        size: 16,
        color: '#fff',
        weight: 'bold',
    },
    labelFont: {
        family: 'Arial',
        size: 11,
        color: '#fff',
        weight: 'normal',
    },
    bubbleClickFun: (label) => { console.log(`Bubble ${label} is clicked ...`) },
}