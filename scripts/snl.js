
d3.csv("../snl_data/ratings.csv", type, function(error, data) {


  var margin = {top: 20, right: 20, bottom: 50, left: 0},
      width = 1060 - margin.left - margin.right,
      height = 350 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], 0.2);

  var y = d3.scale.linear()

      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);


  var bar_svg = d3.select(".bar-chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr('class', 'bar-svg')
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar_tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(d) { return  "<span style='color:#e74e5a;'>" + d.rating + "</span>"; });


  /* Invoke the tip in the context of the visualization */
  bar_svg.call(bar_tip);

  x.domain(data.map(function(d) { return d.year; }));
  y.domain([0, d3.max(data, function(d) { return d.rating; })]);

  bar_svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
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
        .attr("y", height)
        .attr("height",0)
        .on('mouseover', bar_tip.show)
        .on('mouseout', bar_tip.hide);
;

  bar_svg.selectAll(".bar").transition().duration(1000)
      .attr("y", function(d) { return y(d.rating); })
      .attr("height", function(d) { return height - y(d.rating); });
});

function type(d) {
  d.year = +d.year;
  return d;
}


var pie_width = 300,
    pie_height = 300,
    radius = Math.min(pie_width, pie_height) / 2;

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

var donut_svg = d3.select(".nsa").append("svg")
    .attr("width", pie_width)
    .attr("height", pie_height)
    .append("g")
      .attr("transform", "translate(" + pie_width / 2 + "," + pie_height / 2 + ")");

var donut_svg2 = d3.select(".awards").append("svg")
    .attr("width", pie_width)
    .attr("height", pie_height)
    .append("g")
      .attr("transform", "translate(" + pie_width / 2 + "," + pie_height / 2 + ")");

d3.csv("../snl_data/nsadata.csv", function(error, data) {

  data.forEach(function(d) {
    d.percentage = +d.percentage;
  });

  var donut1 = donut_svg.selectAll(".arc1")
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

  var donut2 = donut_svg2.selectAll(".arc2")
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

// load data
d3.csv("./snl_data/fake_data.csv", function(error, data) {

  var format = d3.time.format("%m/%d/%y");

  var margin = {top: 20, right: 40, bottom: 30, left: 30};
  var width = 960- margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;

  var colorrange = [ "#82DCF6", "#68CBE0", "#4EBBCB", "#34AAB5", "#1A9AA0", "#00898A"];

  var x = d3.time.scale()
      .range([0, width -  margin.left ]);

  var y = d3.scale.linear()
      .range([height-10, 0]);

  var z = d3.scale.ordinal()
      .range(colorrange);

  var steamtip = d3.select(".steamgraph")
      .append("div")
      .attr("class", "steam-tip");

  var datearray = [];

  var strokecolor = colorrange[5];

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y);

  var yAxisr = d3.svg.axis()
      .scale(y);

  var stack = d3.layout.stack()
      .offset("silhouette")
      .values(function(d) { return d.values;})
      .x(function(d) { return d.date; })
      .y(function(d) { return d.value; });

  var nest = d3.nest()
      .key(function(d) { return d.key; });

  var area = d3.svg.area()
      .interpolate("cardinal")
      .x(function(d) { return x(d.date); })
      .y0(function(d) { return y(d.y0); })
      .y1(function(d) { return y(d.y0 + d.y); });

  var steam_svg = d3.select(".steamgraph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("class", "steamsvg")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  data.forEach(function(d) {
    d.date = format.parse(d.date);
    d.value = +d.value;
  });

  var layers = stack(nest.entries(data));

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

  steam_svg.selectAll(".layer")
      .data(layers)
      .enter().append("path")
        .attr("class", "layer")
        .attr("transform", "translate(" + margin.left +", 0)")
        .attr("d", function(d) { return area(d.values); })
        .style("fill", function(d, i) { return z(i); });


  steam_svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + margin.left +"," + height + ")")
      .call(xAxis);

  steam_svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + width + ", 0)")
      .call(yAxis.orient("right"));

  steam_svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin.left + ", 0)")
      .call(yAxis.orient("left"));

  steam_svg.selectAll(".layer")
    .attr("opacity", 1)
     .on("mouseover", function(d, i) {
      steam_svg.selectAll(".layer").transition()
      .duration(250)
      .attr("opacity", function(d, j) {
        return j != i ? 0.6 : 1;
    })})

  /*  .on("mousemove", function(d, i) {
      mousex = d3.mouse(this);
      mousex = mousex[0];
      var invertedx = x.invert(mousex);
      console.log(invertedx);
      //invertedx = invertedx.getMonth() + invertedx.getDate();
      invertedx = invertedx.getDate();
      var selected = (d.values);
      console.log(selected);=
      for (var k = 0; k < selected.length; k++) {
        datearray[k] = selected[k].date
        //datearray[k] = datearray[k].getMonth() + datearray[k].getDate();
        datearray[k] = datearray[k].getDate();
        console.log(datearray);
      }


      mousedate = datearray.indexOf(invertedx);
      pro = d.values[mousedate].value;
        d3.select(this)
      .classed("hover", true)
      .attr("stroke", strokecolor)
      .attr("stroke-width", "0.5px"),
      steamtip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "visible");

    })
    .on("mouseout", function(d, i) {
     steam_svg.selectAll(".layer")
      .transition()
      .duration(250)
      .attr("opacity", "1");
      d3.select(this)
      .classed("hover", false)
      .attr("stroke-width", "0px"), steamtip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "hidden");
  })
*/
});
