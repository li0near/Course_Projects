import * as d3 from "d3";
import { d3Tip } from "./d3-tip.js";
import * as topojson from 'topojson';
import * as d3geo from '../../../node_modules/d3-geo-projection/index.js';
import * as d3chr from '../../../node_modules/d3-scale-chromatic/index.js';
import { sliderHorizontal } from '../../../node_modules/d3-simple-slider/index.js';



var parseDate = d3.timeParse('%Y-%m-%d');

var svg=null,x=null,x2=null,y=null,y2=null,focus=null,context=null,zoom= null,brush = null,area = null,margin=null,margin2=null,width=null,height=null,height2=null,
  xAxis=null,xAxis2=null,yAxis=null,area2=null,line = null,line2 = null,widther = null;

export function plotLine(){



  svg = d3.select("svg#line-chart-svg"),
    margin = {top: 10, right: 20, bottom: 110, left: 40},
    margin2 = {top: 430, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    height2 = +svg.attr("height") - margin2.top - margin2.bottom;

  widther = window.outerWidth;


  x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

  xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);



  brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);

  zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);



  area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.Adjclose); });


  line = d3.line()
    .curve(d3.curveMonotoneX)
    .x(function (d) {
      return x(d.date);
    })
    .y(function (d) {
      return y(d.Adjclose);
    });

  line2 = d3.line()
    .curve(d3.curveMonotoneX)
    .x(function (d) {
      return x(d.date);
    })
    .y(function (d) {
      return y(d.Adjclose);
    });


  area2 = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x2(d.date); })
    .y0(height2)
    .y1(function(d) { return y2(d.Adjclose); });

  svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  d3.csv("assets/line-chart1.csv", type, function(error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.Adjclose; })]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    focus.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

    focus.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

    focus.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append('text')
      .attr('x', width - 50)
      .attr('y', -10)
      .attr('dx', '0.71em')
      .attr('text-anchor', 'end')
      .text('Year');

    focus.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2 + 170)
      .attr('y', 5)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('S & P Value');

    context.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area2);

    context.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

    context.append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, x.range());

    svg.append("rect")
      .attr("class", "zoom")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoom);




    //RESPONSIVENESS
    d3.select(window).on("resize", resized1);

    function resized1() {

      widther = window.outerWidth;
      if(widther < 1080){
        margin = {top: 10, right: 130, bottom: 110, left: 40},
          margin2 = {top: 430, right: 130, bottom: 30, left: 40};
        width = widther - margin.left - 2* margin.right;
        svg.attr("width",width+margin.left + margin.right);
      }
      else{
        margin = {top: 10, right: 20, bottom: 110, left: 40},
          margin2 = {top: 430, right: 20, bottom: 30, left: 40};
        svg.attr("width",960);
        width = +svg.attr("width") - margin.left - margin.right;
      }

      //Get the width of the window
      svg.selectAll("*").remove();

      x = d3.scaleTime().range([0, width]),
        x2 = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        y2 = d3.scaleLinear().range([height2, 0]);

      xAxis = d3.axisBottom(x),
        xAxis2 = d3.axisBottom(x2),
        yAxis = d3.axisLeft(y);

      brush = d3.brushX()
        .extent([[0, 0], [width, height2]])
        .on("brush end", brushed);

      zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed);



      area = d3.area()
        .curve(d3.curveMonotoneX)
        .x(function(d) { return x(d.date); })
        .y0(height)
        .y1(function(d) { return y(d.Adjclose); });


      line = d3.line()
        .curve(d3.curveMonotoneX)
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.Adjclose);
        });

      line2 = d3.line()
        .curve(d3.curveMonotoneX)
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.Adjclose);
        });


      area2 = d3.area()
        .curve(d3.curveMonotoneX)
        .x(function(d) { return x2(d.date); })
        .y0(height2)
        .y1(function(d) { return y2(d.Adjclose); });

      svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

      focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


      x.domain(d3.extent(data, function (d) {
          return d.date;
      }));
      y.domain([0, d3.max(data, function (d) {
          return d.Adjclose;
      })]);
      x2.domain(x.domain());
      y2.domain(y.domain());

      focus.append("path")
          .datum(data)
          .attr("class", "area")
          .attr("d", area);

      focus.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", line);

        focus.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append('text')
          .attr('x', width - 50)
          .attr('y', -10)
          .attr('dx', '0.71em')
          .attr('text-anchor', 'end')
          .text('Year');

        focus.append("g")
          .attr("class", "axis axis--y")
          .call(yAxis)
          .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('x', -height / 2 + 170)
          .attr('y', 5)
          .attr('dy', '0.71em')
          .attr('text-anchor', 'end')
          .text('S & P Value');

        context.append("path")
          .datum(data)
          .attr("class", "area")
          .attr("d", area2);

        context.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height2 + ")")
          .call(xAxis2);

        context.append("g")
          .attr("class", "brush")
          .call(brush)
          .call(brush.move, x.range());

        svg.append("rect")
          .attr("class", "zoom")
          .attr("width", width)
          .attr("height", height)
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .call(zoom);


      }
    if(widther < 1080){

      resized1();
    }

  });
}


function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus.select(".area").attr("d", area);
  focus.select('.line').attr('d', line);
  focus.select(".axis--x").call(xAxis);
  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
    .scale(width / (s[1] - s[0]))
    .translate(-s[0], 0));
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain());
  focus.select(".area").attr("d", area);
  focus.select('.line').attr('d', line);
  focus.select(".axis--x").call(xAxis);
  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}

function type(d) {
  d.date = parseDate(d.date);
  d.Adjclose = +d.Adjclose;
  return d;
}
