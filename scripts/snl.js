
var margin = {top: 20, right: 20, bottom: 50, left: 0},
    bar_width = 1060 - margin.left - margin.right,
    bar_height = 350 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, bar_width], 0.2);

var y = d3.scale.linear()
    .range([bar_height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var bar_svg = d3.select(".bar-chart").append("svg")
    .attr("width", bar_width + margin.left + margin.right)
    .attr("height", bar_height + margin.top + margin.bottom)
    .attr('class', 'bar-svg')
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var bar_tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) { return  "<span style='color:#e74e5a;'>" + d.rating + "</span>"; });

/* Invoke the tip in the context of the visualization */
bar_svg.call(bar_tip);

d3.csv("../snl_data/ratings.csv", type, function(error, data) {
  x.domain(data.map(function(d) { return d.year; }));
  y.domain([0, d3.max(data, function(d) { return d.rating; })]);

  bar_svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + bar_height + ")")
      .call(xAxis)
      .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", function(d) {
              return "rotate(-65)"
              });

  bar_svg.append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Ratings");

  bar_svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.year); })
        .attr("width", x.rangeBand())
        .attr("y", bar_height)
        .attr("height",0)
        .on('mouseover', bar_tip.show)
        .on('mouseout', bar_tip.hide);
;

  bar_svg.selectAll(".bar").transition().duration(1000)
      .attr("y", function(d) { return y(d.rating); })
      .attr("height", function(d) { return bar_height - y(d.rating); });
});

function type(d) {
  d.year = +d.year;
  return d;
}


var width = 300,
    height = 300,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#e74e5a", "#7e8aa2", "#29d9c2", "#82dcf6", "#6499a9"]);

var arc1 = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 50);

var arc2 = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 50);

var donuttip = d3.select("#donuttip");

var pie1 = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.percentage; });

var pie2 = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.number; });

var svg = d3.select(".nsa").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var svg2 = d3.select(".awards").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv("../snl_data/nsadata.csv", function(error, data) {

  data.forEach(function(d) {
    d.percentage = +d.percentage;
  });

  var donut1 = svg.selectAll(".arc1")
        .data(pie1(data))
        .enter().append("g");

  var tip1 = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) { return  "<strong>" + d.data.under_surveillance + ":</strong> <span style='color:#e74e5a;'>" + d.data.percentage + "%</span>"; });

  donut1.call(tip1);

  donut1.append("path")
      .attr("d", arc1)
      .style("fill", function(d) { return color(d.data.under_surveillance); })
      .on('mouseover', tip1.show)
      .on('mouseout', tip1.hide);
});

d3.csv("../snl_data/snl_awards.csv", function(error, data) {

  data.forEach(function(d) {
    d.number = +d.number;
  });

  var donut2 = svg2.selectAll(".arc2")
        .data(pie2(data))
        .enter().append("g");

  var tip2 = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(d) { return  "<strong>" + d.data.award + ":</strong> <span style='color:#e74e5a;'>" + d.data.number + "</span>"; });

  donut2.call(tip2);

  donut2.append("path")
      .attr("d", arc2)
      .style("fill", function(d) { return color(d.data.award); })
      .on('mouseover', tip2.show)
      .on('mouseout', tip2.hide);

});
