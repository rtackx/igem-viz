// https://observablehq.com/@naila-elh/normalized-stacked-streamchart@685
import define1 from "./a33468b95d0b15b0@698.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["data_week_percentage_pivot2.csv",new URL("./data_week_percentage_pivot2.csv",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("title_stream")).define(["md"], function(md){return(
md`# Temporal activity`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Temporal activity
`
)});
  main.variable(observer("key")).define("key", ["swatches","color","margin"], function(swatches,color,margin){return(
swatches({color, marginLeft: margin.left, columns: "180px"})
)});
  main.variable(observer("chart")).define("chart", ["d3","width","height","series","color","area","x","y","xAxis","margin","yAxis"], function(d3,width,height,series,color,area,x,y,xAxis,margin,yAxis)
{


  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .on("mouseover", reset);

  let currentTask = '';

  svg.append("g")
    .selectAll("path")
    .data(series)
    .join("path")
    .on("mouseover", over)
    .on("mouseout", out)
    .on("mousemove", move)
      .attr("fill", ({key}) => color(key))
      .attr("opacity", .9)
      .attr("stroke", 'white')
      .attr("stroke-width", .1)
      .attr("d", area)
    .append("title")
      .text(({key}) => key);



   const bigLine = svg
    .append("line")
    .attr("stroke", "black")
    .attr("opacity", .8)
    .attr("stroke-dasharray", 3, 4)
    .attr("pointer-events", "none");

   const line = svg
    .append("line")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("pointer-events", "none");

  const textArea = svg.append("g").attr("pointer-events", "none");
  const taskLabel = textArea
    .append("text")
    .attr("font-size", 16)
    .attr("text-anchor", "middle");
  const caseLabel = textArea
    .append("text")
    .attr("font-size", 16)
    .attr("text-anchor", "middle");

  function over(d) {
    d3.select(this).attr("opacity", 1);
    currentTask = d.key;
    d3.event.stopPropagation();
  }

  function out(d) {
    d3.select(this).attr("opacity", .7);
  }

  function move(d) {
    const dateStamp =
      x.invert(d3.event.offsetX).getTime() >
      x.invert(d3.event.offsetX).setHours(12, 0, 0, 0)
        ? x.invert(d3.event.offsetX).setHours(24, 0, 0, 0)
        : x.invert(d3.event.offsetX).setHours(0, 0, 0, 0);
    const index = d.findIndex(t => t.series.date_task.getTime() == dateStamp);

    const selectedData = d[index];
    const min = d3.min(series, d => d[index][0]);
    const max = d3.max(series, d => d[index][1]);
    line
      .attr("x1", x(dateStamp))
      .attr("x2", x(dateStamp))
      .attr("y1", y(selectedData[0]))
      .attr("y2", y(selectedData[1]));
    bigLine
      .attr("x1", x(dateStamp))
      .attr("x2", x(dateStamp))
      .attr("y1", y(min))
      .attr("y2", y(max));
    taskLabel
      .attr("x", d3.max([d3.min([x(dateStamp), width - 120]), 120]))
      .attr("y", d3.max([y(max) - 40, 20]))
      .text(currentTask + ' '  + new Date(dateStamp).toLocaleDateString());

    const taskMetric = selectedData.data[currentTask];
    caseLabel
      .attr("x", d3.max([d3.min([x(dateStamp), width - 120]), 120]))
      .attr("y", d3.max([y(max) - 20, 40]))
      .text(`${Math.round(
          taskMetric
        )}% of U.S.`
       );

    d3.event.stopPropagation();
  }

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
      .text("Repartition");

   function reset() {
    line
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0)
      .attr("y2", 0);
    bigLine
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0)
      .attr("y2", 0);
    taskLabel.text("");
    caseLabel.text("");
  }

  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`# Data`
)});
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("data_week_percentage_pivot2.csv").text(), d3.autoType)
)});
  main.variable(observer("series")).define("series", ["d3","data"], function(d3,data){return(
d3.stack()
    .keys(data.columns.slice(2))
    .offset(d3.stackOffsetExpand)
  (data)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Graph parameters`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Static parameters`
)});
  main.variable(observer("area")).define("area", ["d3","x","y"], function(d3,x,y){return(
d3.area()
    .x(d => x(d.data.date_task))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]))
)});
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], function(d3,data,margin,width){return(
d3.scaleTime()
    .domain(d3.extent(data, d => d.date_task))
    .range([margin.left, width - margin.right])
)});
  main.variable(observer("y")).define("y", ["d3","height","margin"], function(d3,height,margin){return(
d3.scaleLinear()
    .range([height - margin.bottom, margin.top])
)});
  main.variable(observer("color")).define("color", ["d3","data"], function(d3,data){return(
d3.scaleOrdinal()
    .domain(data.columns.slice(2))
    .range(d3.schemeCategory20c)
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","width"], function(height,margin,d3,x,width){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y"], function(margin,d3,y){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(10, "%"))
    .call(g => g.select(".domain").remove())
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## General parameters`
)});
  main.variable(observer("height")).define("height", function(){return(
500
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 10, right: 20, bottom: 50, left: 60}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6", "d3-scale@1", "d3@5")
)});
  const child1 = runtime.module(define1);
  main.import("swatches", child1);
  return main;
}
