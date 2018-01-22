import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as D3 from 'd3';
import {streamChart} from './pie-chart.js';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    streamChart();

/*
    let svg = D3.select('#bar-chart-svg'),

      margin = { top: 150, right: 150, bottom: 150, left: 150 },
      width = +svg.attr('width') - margin.left - margin.right,
      height = +svg.attr('height') - margin.top - margin.bottom;
    const parseDate = D3.timeParse('%Y');



    function responsivefy(svg) {
      // get container + svg aspect ratio
      let container = D3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;

      // add viewBox and preserveAspectRatio properties,
      // and call resize so that svg resizes on inital page load
      svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("perserveAspectRatio", "xMinYMid")
        .call(resize);

      // to register multiple listeners for same event type,
      // you need to add namespace, i.e., 'click.foo'
      // necessary if you call invoke this function for multiple svgs
      // api docs: https://github.com/mbostock/d3/wiki/Selections#on
      D3.select(window).on("resize." + container.attr("id"), resize);

      // get width of container and resize svg to fit it
      function resize() {
        var targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
      }
    }
    D3.csv('assets/industryData1.csv', function (d) {
      return {
        year: d.Year,
        Industry: d.Industry,
        TotalBusiness: +d.TotalBusiness
      };
    }, function (error, data) {
      if (error) {
        throw error;
      }


      const focus = svg.append('g')
        .attr('class', 'focus')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      const color = D3.scaleOrdinal(D3.schemeCategory20c)
        .domain(D3.range(17).map(String));

      let x = D3.scaleTime().range([0, height - 30]);
      x.domain(D3.extent(data, function (d) {
        return parseDate(d.year);
      }));

      const colorDomain = ['Agro_based','Mining','Utilities','Construction','Manufacturing','Trade','RetailTrade','TransportationStorage','Information','Financeinsurance','RealEstate','EducationalServices','Health','Government','Federal','Govt']

      svg.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(20,20)");

      let legend1 = focus.selectAll("g.legend")
        .data(colorDomain)
        .enter().append("g")
        .attr("class", "legend");

      let ls_w = 20, ls_h = 20;

      legend1.append("rect")
        .attr("x", width+20)
        .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function(d, i) { return color(d); })
        .style("opacity", 0.8);

      legend1.append("text")
        .attr("x", width+45)
        .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
        .text(function(d, i){ return colorDomain[i]; })
        .style("font-size","12px");




      const tooltip = D3.select('body')
        .append('div')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'visible')
        .style('color', 'white')
        .style('padding', '8px')
        .style('background-color', 'rgba(0, 0, 0, 0.75)')
        .style('border-radius', '6px')
        .style('font', '12px sans-serif')
        .text('tooltip');


      const dataScale = D3.scaleLinear().range([0, width * 0.09]);
        dataScale.domain(D3.extent(data, function (d){
          return d.TotalBusiness ;
        }));




      let yAxis = D3.axisLeft(x);







      const circles = focus.selectAll('.all')
        .data(data)
        .enter().append('circle')
        .attr('class', function(d) { return 'a' + d.year + ' TotalBusiness'; })
        .attr('r', function(d) { return dataScale(d.TotalBusiness) ; })
        // .attr('cx', function(d) { return 400; })
        // .attr('cy', function(d) { return x(d.x); })
        .style('fill', function(d) { return color(d.Industry); })
        .on('mouseover', function(d) {

          const alpha = d.year + ': ' + d.Industry + ': ' + d.TotalBusiness;

          alert(alpha);

          tooltip.text(alpha);
          tooltip.style('visibility', 'visible');
        })
        .on('mousemove', function() {
          return tooltip.style('top', (D3.event.pageY - 10) + 'px').style('left', (D3.event.pageX + 10) + 'px');
        })
        .on('mouseout', function(){return tooltip.style('visibility', 'hidden'); });


      let legend2 = focus.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width + 30 ) + "," + (height + 100 ) + ")")
        .selectAll("g")
        .data([800, 2000, 5000])
        .enter().append("g");

      legend2.append("circle")
        .attr("cy", function(d) { return -dataScale(d); })
        .attr("r", dataScale);

      legend2.append("text")
        .attr("y", function(d) { return -2 * dataScale(d); })
        .attr("dy", "1.3em")
        .text(D3.format(".1s"));

      const rectangle = focus.selectAll("g.tooltip")
        .enter().append("g")
        .attr("class", "tooltip");


      let simulation1 = D3.forceSimulation().nodes(data)
        .force('xForce', D3.forceX(function (d: any){
          return width * 1/2;
        }))
        .force('yForce', D3.forceY(function (d: any){
          return height * 1/2;
        }))
        .force('collide', D3.forceCollide(function (d: any){

          return dataScale(d.TotalBusiness);

        }))
        .on('tick', ticked1);

      function ticked1()  {

        circles.attr('cx', function (d: any){
          return d.x;
        })
          .attr('cy', function (d: any){
            return d.y;
          });
      }

      D3.select('#bar-button')
        .on('click',function(){

          svg.attr('height',4200)

          width = +svg.attr('width') - margin.left - margin.right,

            height = +svg.attr('height') - margin.top - margin.bottom;

          x = D3.scaleTime().range([0, height - 30]);
          x.domain(D3.extent(data, function (d) {
            return parseDate(d.year);
          }));

          yAxis = D3.axisLeft(x);

          focus.append('g')
            .attr('class', 'axis axis--y')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2 + '170px')
            .attr('y', 5)
            .attr('dy', '0.71em')
            .attr('text-anchor', 'end')
            .text('Year');

          simulation1 = D3.forceSimulation().nodes(data)
            .force('xForce', D3.forceX(function (d: any){
              return width * 1/2;
            }))
            .force('yForce', D3.forceY(function (d: any){
              return x(parseDate(d.year));
            }))
            .force('collide', D3.forceCollide(function (d: any){

              return dataScale(d.TotalBusiness);

            }))
            .on('tick', ticked1);
        });




    });

*/

  }
}
