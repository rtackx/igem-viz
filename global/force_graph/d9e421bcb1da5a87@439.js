// https://observablehq.com/@jrathin/force-directed-graph-with-zoom-and-stroke-scaling-svg-idlab@439
import define1 from "./e93997d5089d7165@2286.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["sample@1.json",new URL("./files/60993d89a2c04acd3a6548fe27f0a5041939593abea82a4fe84925fa2ad65bc4c792651d54477b5bb4158d5f14c483db47a225187cee5366cf65f4a1eb9daa12",import.meta.url)],["graph@8.json",new URL("./files/b2ccf2cec417887025162b830220c1ad7c7ab45f1cc98a09f74dbb5ebc1c4233b4e0605fc13554184931d5c34a3f31db8fb2a38fa88eff8bc4a94a97aba2fe24",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("title_fgraph")).define(["md"], function(md){return(
md`# Team collaboration networks`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Team collaboration networks (svg) - for iGEM CoSo

Features = Filter based on edge attributes, Node Attributes, Zooming`
)});
  main.variable(observer("viewof link_strength")).define("viewof link_strength", ["slider"], function(slider){return(
slider({
  title:  "Link Strength",
  min: 0,
  max: 20,
  step: 1,
  value: 1,
  format: ",",
  description:
    "Filter based on Frequency of Cumulative activity between Nodes"
})
)});
  main.variable(observer("link_strength")).define("link_strength", ["Generators", "viewof link_strength"], (G, _) => G.input(_));
  main.variable(observer("viewof task")).define("viewof task", ["select"], function(select){return(
select({
  title: "Tasks",
  description: "Select Specific task for Filtering Interactions",
  options: ["All", "Planning tasks","Reading papers or other material","Brainstorming","Writing / preparing presentations","Team meetings","Meetups","Project administration","Education / outreach event","Education event","No iGEM work","Developing protocols","Hardware development"],
  value: "All"
})
)});
  main.variable(observer("task")).define("task", ["Generators", "viewof task"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["data","link_strength","task","d3","width","height","radius","color","drag","invalidation"], function(data,link_strength,task,d3,width,height,radius,color,drag,invalidation)
{

  const l = data.links.map(d => Object.create(d));
  const nodes = data.nodes.map(d => Object.create(d));

  const ll = l.filter(d => d.count >= link_strength) //Filter based on Link Strength

  var links;

  //To Filter based on Tasks

  if (task == "All")
  {
    links = ll
  }

  else
  {
    links = ll.filter(d => d.task == task)
  }

  //******

  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  //*******

  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX())
      .force("y", d3.forceY());


  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

      // g.attr("transform", "translate(150,150)")
      // g.attr("scale", "0.4")

  const g = svg.append("g")

  const link = g.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 1)
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("stroke-width", d => d.value);

  const globalNode = g.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);

  const node = globalNode
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("r", radius)
      .attr("fill", color)
      .call(drag(simulation))
    	.on('mouseover.fade', fade(0.1))
  	.on('mouseout.fade', fade(1));



  let zoomLvl = 1;
  let lastK = 0;

  node.append("title")
      .text(d => d.id);


  simulation.on("tick", () => {


    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);


  });

  function fade(opacity) {
    return d => {
      node.style('opacity', function (o) { return isConnected(d, o) ? 1 : opacity });

      link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
      if(opacity === 1){
        node.style('opacity', 1)

        link.style('stroke-opacity', 1)
      }
    };
  }

  const linkedByIndex = {};
  links.forEach(d => {
    linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
  });

  function isConnected(a, b) {
    return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
  }

  invalidation.then(() => simulation.stop());

  svg.call(d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([1, 80])
      .on("zoom", zoomed));

  function zoomed() {
    let e = d3.event

    if(e.transform.k > 2 && lastK != e.transform.k){
      lastK = e.transform.k;
      console.log("zoomed");
      zoomLvl =Math.log2(e.transform.k);
      globalNode.attr("stroke-width", 1.5/zoomLvl );
      link.attr("stroke-width",  d => (d.count)/(zoomLvl));
    }

    g.attr("transform", e.transform);
  }



  return svg.node();
}
);
  main.variable(observer("data1")).define("data1", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("sample@1.json").json()
)});
  main.variable(observer("data")).define("data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("graph@8.json").json()
)});
  main.variable(observer("height")).define("height", function(){return(
700
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3)
{
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  return d => scale(d.team_name);
}
);
  main.variable(observer("radius")).define("radius", function(){return(
function radius(d) {
  return(2 + Math.sqrt(d.degree/2))
}
)});
  main.variable(observer("drag")).define("drag", ["d3"], function(d3){return(
simulation => {

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  const child1 = runtime.module(define1);
  main.import("checkbox", child1);
  main.import("select", child1);
  main.import("slider", child1);
  return main;
}
