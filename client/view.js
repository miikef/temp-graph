//D3.js example
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var parseTime = d3.timeParse("%d-%b-%y");
var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });
d3.tsv("data.tsv", function(d) {
  d.date = parseTime(d.date);
  d.close = +d.close;
  return d;
}, function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.close; }));

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .style("text-anchor", "end")
      .text("Price ($)");

  g.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
});


/*
// define dimensions of graph
var m = [80, 80, 80, 80]; // margins
var w = 900 - m[1] - m[3];	// width
var h = 400 - m[0] - m[2]; // height

// create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
var data1 = [3, 6, 2, 7, 5, 2, 0, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7];
var data2 = [543, 367, 215, 56, 65, 62, 87, 156, 287, 398, 523, 685, 652, 674, 639, 619, 589, 558, 605, 574, 564, 496, 525, 476, 432, 458, 421, 387, 375, 368];

// X scale will fit all values from data[] within pixels 0-w
var x = d3.scale.linear().domain([0, data1.length]).range([0, w]);
// Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
var y1 = d3.scale.linear().domain([0, 10]).range([h, 0]); // in real world the domain would be dynamically calculated from the data
var y2 = d3.scale.linear().domain([0, 700]).range([h, 0]);  // in real world the domain would be dynamically calculated from the data
    // automatically determining max range can work something like this
    // var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

// create a line function that can convert data[] into x and y points
var line1 = d3.svg.line()
    // assign the X function to plot our line as we wish
    .x(function(d,i) {
        // verbose logging to show what's actually being done
        console.log('Plotting X1 value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
        // return the X coordinate where we want to plot this datapoint
        return x(i);
    })
    .y(function(d) {
        // verbose logging to show what's actually being done
        console.log('Plotting Y1 value for data point: ' + d + ' to be at: ' + y1(d) + " using our y1Scale.");
        // return the Y coordinate where we want to plot this datapoint
        return y1(d);
    })

// create a line function that can convert data[] into x and y points
var line2 = d3.svg.line()
    // assign the X function to plot our line as we wish
    .x(function(d,i) {
        // verbose logging to show what's actually being done
        console.log('Plotting X2 value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
        // return the X coordinate where we want to plot this datapoint
        return x(i);
    })
    .y(function(d) {
        // verbose logging to show what's actually being done
        console.log('Plotting Y2 value for data point: ' + d + ' to be at: ' + y2(d) + " using our y2Scale.");
        // return the Y coordinate where we want to plot this datapoint
        return y2(d);
    })


    // Add an SVG element with the desired dimensions and margin.
    var graph = d3.select("#graph").append("svg:svg")
          .attr("width", w + m[1] + m[3])
          .attr("height", h + m[0] + m[2])
        .append("svg:g")
          .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

    // create yAxis
    var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
    // Add the x-axis.
    graph.append("svg:g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + h + ")")
          .call(xAxis);


    // create left yAxis
    var yAxisLeft = d3.svg.axis().scale(y1).ticks(4).orient("left");
    // Add the y-axis to the left
    graph.append("svg:g")
          .attr("class", "y axis axisLeft")
          .attr("transform", "translate(-15,0)")
          .call(yAxisLeft);

    // create right yAxis
    var yAxisRight = d3.svg.axis().scale(y2).ticks(6).orient("right");
    // Add the y-axis to the right
    graph.append("svg:g")
          .attr("class", "y axis axisRight")
          .attr("transform", "translate(" + (w+15) + ",0)")
          .call(yAxisRight);

    // add lines
    // do this AFTER the axes above so that the line is above the tick-lines
    graph.append("svg:path").attr("d", line1(data1)).attr("class", "data1");
    graph.append("svg:path").attr("d", line2(data2)).attr("class", "data2");

*/
