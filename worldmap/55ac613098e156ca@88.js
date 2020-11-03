export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# World map example`
)});
  main.variable(observer("map")).define("map", ["worldMap"], function(worldMap)
{
  const container = document.createElement("div")
  container.setAttribute("id", "map-container")
  container.style.position = "relative"
  
  container.appendChild(worldMap.node())
    
  return container
}
);
  main.variable(observer("height")).define("height", function(){return(
520
)});
  main.variable(observer("worldMap")).define("worldMap", ["d3","DOM","width","height","topojson","world","path","labels"], function(d3,DOM,width,height,topojson,world,path,labels)
{
  const svg = d3.select(DOM.svg(width, height))
  
  // world map
  svg.append("g").selectAll("path")
    .data(topojson.feature(world, world.objects.countries).features)
    .enter()
    .append("path")
    .attr("d", path)
    .style('fill', d => {
    if (labels.includes(d.properties.name)) {
      return "#d11"
    } else {
      return "#ddd"
    }
  })
    .style('fill-opacity', 1)
    .style('stroke', '#fff')
    .style('stroke-width', '0.5px')
  
  return svg
}
);
  main.variable(observer("path")).define("path", ["d3","projection"], function(d3,projection){return(
d3.geoPath(projection)
)});
  main.variable(observer("projection")).define("projection", ["d3geo","width","height","countries"], function(d3geo,width,height,countries){return(
d3geo.geoEckert4()
  .fitSize([width, height], countries)
)});
  main.variable(observer("countries")).define("countries", ["topojson","world"], function(topojson,world){return(
topojson.feature(world, world.objects.countries)
)});
  main.variable(observer("world")).define("world", ["d3"], function(d3){return(
d3.json("https://unpkg.com/world-atlas@2/countries-50m.json")
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require ("topojson-client@3")
)});
  main.variable(observer("d3geo")).define("d3geo", ["require"], function(require){return(
require('d3-geo-projection')
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3')
)});
  main.variable(observer("labels")).define("labels", function(){return(
[
  "Mexico",
  "France",
  "Haiti",
  "Bolivia",
  "Palestine",
  "Syria",
  "Algeria",
  "Indonesia",
  "Ecuador"]
)});
  return main;
}
