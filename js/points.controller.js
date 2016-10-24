var width = 250,
    height = 200;

var points = d3.range(0, 6).map(function(i) {
  var random = Math.random() - 0.5; //random = [-0.5,0.5]
  return [width / 2 + random * width / 2 , height - i * height / 5];
});

var dragged = null,
    selected = points[0];

var line = d3.svg.line().interpolate("basis");

var svg = d3.select("form").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("tabindex", 1);

svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .on("mousedown", mousedown);

svg.append("path")
    .datum(points)
    .attr("class", "line")
    .call(redraw);

d3.select(window)
    .on("mousemove", mousemove)
    .on("mouseup", mouseup)
    .on("keydown", keydown);

svg.node().focus();

function redraw() {
  points.sort(function(a, b){return a[1]-b[1]});
  points[0][1] = 0;
  points[points.length-1][1] = height;
  svg.select("path").attr("d", line);

  var circle = svg.selectAll("circle")
      .data(points, function(d) { return d; });

  circle.enter().append("circle")
      .attr("r", 1e-6)
      .on("mousedown", function(d) { selected = dragged = d; redraw(); })
    .transition()
      .duration(750)
      .ease("elastic")
      .attr("r", 6.5);

  circle
      .classed("selected", function(d) { return d === selected; })
      .attr("cx", function(d) { return d[0]; })
      .attr("cy", function(d) { return d[1]; });

  circle.exit().remove();

  if (d3.event) {
    d3.event.preventDefault();
    d3.event.stopPropagation();
  }
}


function mousedown() {
  points.push(selected = dragged = d3.mouse(svg.node()));
  redraw();
}

function mousemove() {
  if (!dragged) return;
  var m = d3.mouse(svg.node());
  dragged[0] = Math.max(0, Math.min(width, m[0]));
  dragged[1] = Math.max(0, Math.min(height, m[1]));
  //console.log(dragged[0]+":"+dragged[1]);
  redraw();
}

function mouseup() {
  if (!dragged) return;
  mousemove();
  dragged = null;
}

function keydown() {
  if (!selected) return;
  switch (d3.event.keyCode) {
    case 8: // backspace
    case 46: { // delete
      var i = points.indexOf(selected);
      points.splice(i, 1);
      selected = points.length ? points[i > 0 ? i - 1 : 0] : null;
      redraw();
      break;
    }
  }
}

