import { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

import styles from "../styles/TweetChart.module.css";

function TweetChart({ data }) {
  const [chartData] = useState([data]);
  const svgRef = useRef();

  useEffect(() => {
    const w = "80vw";
    const h = "50vh";
    const svg = d3
      .select(svgRef.current)
      .attr("width", w)
      .attr("height", h)
      .style("background", "#F8C8DC")
      .style("overflow", "visible");

    const xScale = d3
      .scaleTime()
      .domain(
        d3.extent(chartData, function (d) {
          return d.time;
        })
      )
      .range([0, w]);

    const yScale = d3.scaleLinear().domain([0, h]).range([h, 0]);

    const generateScaledLine = d3
      .line()
      .x((d, i) => xScale(i))
      .y(yScale)
      .curve(d3.curveCardinal);

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(data.length)
      .tickFormat((i) => i + 1);
    const yAxis = d3.axisLeft(yScale).ticks(5);
    svg.append("g").call(xAxis).attr("transform", `translate(0, ${h})`);
    svg.append("g").call(yAxis);
    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("d", (d) => generateScaledLine(d))
      .attr("fill", "none")
      .attr("stroke", "black");
  });

  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  );
}

export default TweetChart;
