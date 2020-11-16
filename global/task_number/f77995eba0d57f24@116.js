// https://observablehq.com/@naila-elh/number-of-tasks@116
import define1 from "./a33468b95d0b15b0@698.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["data_week_sum.csv",new URL("./data_week_sum.csv",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Number of tasks`
)});
main.variable(observer("title_tasks")).define(["md"], function(md){return(
md`# Number of tasks`
)});
  main.variable(observer("chart")).define("chart", ["d3","width","height","data","area","xAxis","margin","yAxis","bisect","x","y","callout"], function(d3,width,height,data,area,xAxis,margin,yAxis,bisect,x,y,callout)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .style("overflow", "visible")

  const path = svg.append("path")
      .datum(data)
      .attr("fill", "#8242a8")
      .attr("d", area)
        .attr("opacity", .5)
      .attr("stroke", 'purple')
      .attr("stroke-width", 2);

  svg.append("g")
      .call(xAxis);

    // text label for the x axis
  svg.append("text")
      .attr("x", width/2)
      .attr("y", height - margin.top)
      .style("text-anchor", "middle")
      .text("Date");

  svg.append("g")
      .call(yAxis);

    // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", - margin.left - 100)
      .attr("y", margin.left - 40)
      .style("text-anchor", "end")
      .text("Number of tasks");

  // Title
  svg.append("text")
      .attr("transform", `translate(0, 0)`)
      .attr("dy", "1em")
      .attr("text-anchor", "start")
      .style("fill", "#202630")
      .style("font-size", 18)
      .style("font-weight", 700)

  // TOOLTIPS
  const tooltip = svg.append("g");
  svg.on("touchmove mousemove", function() {
    const nearestData = bisect(d3.mouse(this)[0]);
    const xVal = nearestData.date_task;
    const yVal = nearestData.n;
    if (yVal > 0) {
      tooltip
        .attr("transform", `translate(${x(xVal)},${y(yVal)})`)
        .call(callout, `${xVal.toLocaleString(undefined, {month: "short", day: "numeric", year: "numeric"})}
${yVal.toLocaleString(undefined, {style: "decimal"}) + " tasks"}`);
    }
  });

  svg.on("touchend mouseleave", () => tooltip.call(callout, null));

  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`# Data`
)});
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("data_week_sum.csv").text(), d3.autoType)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Graph parameters`
)});
  main.variable(observer("callout")).define("callout", function(){return(
(g, value) => {
  if (!value) return g.style("display", "none");

  g
    .style("display", null)
    .style("pointer-events", "none")
    .style("font", "10px sans-serif");

  const path = g.selectAll("path")
    .data([null])
    .join("path")
      .attr("fill", "white")
      .attr("stroke", "black");

  const text = g.selectAll("text")
    .data([null])
    .join("text")
    .call(text => text
      .selectAll("tspan")
      .data((value + "").split(/\n/))
      .join("tspan")
        .attr("x", 0)
        .attr("y", (d, i) => `${i * 1.1}em`)
        .attr("text-anchor", "middle")
        .style("font-weight", (_, i) => i ? null : "bold")
        .text(d => d));

  const {x, y, width: w, height: h} = text.node().getBBox();

  path.attr("d", `M0.734375,0H${w + 20}V${h + 20}H${w / 2 + 15}l-5,5l-5,-5H0.734375V0Z`)
    .attr("transform", `translate(${-w / 2 - 10},${-(h + 25)})`);

  text.attr("transform", `translate(${0},${y - 20})`);
}
)});
  main.variable(observer("bisect")).define("bisect", ["d3","x","data"], function(d3,x,data)
{
  const bisect = d3.bisector(d => d.date_task).left; // Assumes your data has an "x" field
  return mx => {
    const domainX = x.invert(mx); // Assumes you have an x scale function
    const index = bisect(data, domainX, 1);
    const a = data[index - 1];
    const b = data[index];
    if (!b) { return a; } // Prevents errors mousing over right edge of chart
    return domainX - a.date_task > b.date_task - domainX ? b : a; // Assumes your data has an "x" field
  };
}
);
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], function(d3,data,margin,width){return(
d3.scaleUtc()
  .domain(d3.extent(data, d => d.date_task))
  .range([margin.left, width - margin.right])
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","width"], function(height,margin,d3,x,width){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
)});
  main.variable(observer("y")).define("y", ["d3","data","height","margin"], function(d3,data,height,margin){return(
d3.scaleLinear()
  .domain([0, d3.max(data, d => d.n)]).nice()
  .range([height - margin.bottom, margin.top])
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y"], function(margin,d3,y){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
)});
  main.variable(observer("area")).define("area", ["d3","curve","x","y"], function(d3,curve,x,y){return(
d3.area()
    .curve(curve)
    .x(d => x(d.date_task))
    .y0(y(0))
    .y1(d => y(d.n))
)});
  main.variable(observer("curve")).define("curve", ["d3"], function(d3){return(
d3.curveLinear
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# General parameters`
)});
  main.variable(observer("height")).define("height", function(){return(
500
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 10, right: 20, bottom: 50, left: 60}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5", "d3-array@^2.4")
)});
  const child1 = runtime.module(define1);
  main.import("swatches", child1);
  return main;
}
