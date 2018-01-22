import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from "d3";


@Component({
  selector: 'app-donut-chart',
//  template: '<div class="donut{{eventcase}}"></div>', //D3 cannot get this <div>  
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent implements OnInit {
  @Input() eventcase: String;
  constructor() { }
  
  ngOnInit() {
// start

    // const color = d3.scaleOrdinal(d3.schemeCategory10);
    const imageURL = {
      "1": "assets/img/about/1.jpg",
      "2": "assets/img/about/2.jpg",
      "3": "assets/img/about/3.jpg",
      "4": "assets/img/about/4.jpg"         
    };
    const label = {
      "1":["Price Drops","Over a Year"], 
      "2":["DJIA Drops","Over 10 Months"],
      "3":["NASDAQ Drops","Over 2.4 Years"],
      "4":["DJIA Drops","Over 1.5 Years"]
    };
    const data = {
      "1": 96.5,
      "2": 89.2,
      "3": 78.4,
      "4": 52.9
    }
    let id = +this.eventcase;
    let percent = data[id];
    let thickness = 7;      
    let  duration = 2000,
      delay = 1000,
      transition = 200,
      ease = d3.easeLinear;
    
    let dataset = {
        lower: calcPercent(0),
        upper: calcPercent(percent)
      },
      pie = d3.pie().sort(null),
      format = d3.format(".1%");
      // define donut chart


    makeDonut(id, data, imageURL, false);

    function makeDonut(id, data, imageURL, resize) {
      let width = document.querySelector(".timeline-image").getBoundingClientRect().width;
      let height = document.querySelector(".timeline-image").getBoundingClientRect().height;
      let textsize = "",
          labeltextsize = "";
      if (width >100){
        textsize = "55px";
        labeltextsize = "15px";
      }
      else{
        textsize = "25px";
        labeltextsize = "7px";
      }      
      
      let radius = Math.min(width, height) / 2;  
      let arc = d3.arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius);

      // draw svg
      let svg = d3.select(".donutchart"+id)
        .append("svg")
        ;
      svg        
      .attr("id", "d"+id)
      .attr("class", "timeline-image")
      .attr("width", width) // control by css style
      .attr("height", height)
      .style("border", "none")
      .call(responsivefy)
      .append("clipPath")
        .attr("id", "circleView")
        .attr("transform", "translate(" + width/2 +  "," + height/2 + ")")
        .append("circle")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", width/2)
      ;

      // attach image
      let img = d3.select(".donutchart"+id+" svg")
        .append('image')
        .attr("class", "timeline-image")
        .attr("id", "donutchartimage"+id)
        .attr("width", width) //size adjusted to random placeholder image
        .attr("height", height) 
        .attr("clip-path","url(#circleView)")      
          //placeholder imageURL
        .attr('xlink:href', imageURL[id])
        ;     

      let g = svg.append("g")
        .attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");

        // if(resize) {
          
        //   alert(radius);
        //   remove_arc();
        //   redraw_arc();
        // }
      
      // draw donut chart
      let path = g.selectAll("path")
        .data(pie(dataset.lower))
        .enter().append("path")
        .attr("class", function(d, i) {
          return "g" + id + "-color" + i;
        })
        .style("fill","#f1f1f1")   // Initial color of the donut chart
        .attr("d", <any>arc)
        .each(<any>function(d) {
          this._current = d;
        })
        .on("mouseover", function(d) {
          d3.select("#donutchartimage"+id).attr("xlink:href", null); 
          remove_arc();
          redraw_arc();
          animate_arc();
        })
        ;

        // transitionColors(0);
        // function transitionColors(color) {
        //   let colorcode = "";
        //   if (color == 0){
        //     colorcode = "#9ff09f";
        //     color = 1;
        //   }
        //   else {
        //     colorcode = "#f1f1f1";
        //     color = 0;
        //   }
        //   d3.selectAll("path")
        //   .transition()
        //   .delay(delay)
        //   .duration(duration)
        //   .ease(ease)
        //   .style("fill", colorcode)     
        //   .on("end", <any>transitionColors(color))
        //   ;
        // }

      let text = g;

      function redraw_arc(){
        path = g.selectAll("path")
          .data(pie(dataset.lower))
          .enter().append("path")
          .attr("class", function(d, i) {
            return "g" + id + "-color" + i
          })        
          .attr("d", <any>function(){
            return d3.arc()
            .innerRadius(radius - thickness)
            .outerRadius(radius);
          })
          .each(<any>function(d) {
            this._current = d;
          })
          .style("fill", function(d, i){
            if (i == 0){
              return "#dd1c77";
            }
            else {
              return "#5ca747";
            }
          })        
          .on("mouseover", function(d) {
            d3.select("#donutchartimage"+id).attr("xlink:href", null);          
            remove_arc();
            redraw_arc();
            animate_arc();
          })
        ;
        text = g.append("text")
          .attr("class", "g" + id + "-text")
          .style("fill", "#dd1c77")
          // .style("font-size", "3.5vw")          
          .style("font-weight", "bold")
          .style("font-size", textsize)
          .attr("text-anchor", "middle")
          .attr("dy",height/500+0.1+"em");
      }
      
      function remove_arc(){
        // d3.selectAll(".timeline-image").selectAll("*").remove();
        g.select(".g" + id + "-color0").remove();
        g.select(".g" + id + "-color1").remove();
        g.select(".g" + id + "-text").remove();
        g.select(".g" + id + "-label").remove(); // label0
        g.select(".g" + id + "-label").remove(); // label1   
        // alert("removed");            
      }

      function animate_arc(){
        let progress = 0;
        let labeltext = g.append("text")
          .attr("class", "g" + id + "-label")
          // .style("font-size", "1vw")
          .style("font-size", labeltextsize)
          .attr("text-anchor", "middle")
          .attr("dy", -(height/80)-1+"em")
          .text(label[id][0])
          ;
        // text = text.attr("class", "g" + id + "-text");

        labeltext = g.append("text")
          .attr("class", "g" + id + "-label")
          // .style("font-size", "1vw")
          .style("font-size", labeltextsize)
          .attr("text-anchor", "middle")
          .attr("dy", height/65+1+"em")
          .text(label[id][1])
          ;          

        const timeout = setTimeout(function() {
          clearTimeout(timeout);
          path.data(pie(dataset.upper))
            .transition()
              .duration(duration)
              .attrTween("d", <any>function(a) {
                var i = d3.interpolate(this._current, a);
                var i2 = d3.interpolate(progress, percent)
                this._current = i(0);
                return function(t) {
                  text.text(format(i2(t) / 100));
                  return arc(i(t));
                };
              });
        }, 200);
      };

    }
    function calcPercent(percent) {
      return [percent, 100 - percent];
    };
    
    //////////////////////////
    function responsivefy(svg) {
      // get container + svg aspect ratio
      var container = d3.select(svg.node().parentNode),
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
      d3.select(window).on("resize." + container.attr("id"), resize);

      // get width of container and resize svg to fit it
      function resize() {
          var targetWidth = parseInt(container.style("width"));
          svg.attr("width", targetWidth);
          svg.attr("height", Math.round(targetWidth / aspect));
      }
    }
    //////////////////////////

    // Resize even and process
    // window.addEventListener("resize", doresize);    
    // function doresize() {
    //   makeDonut(this.eventcase, data, imageURL, true);
    // }
// end
  }

}
// 
// reference 
// https://bl.ocks.org/guilhermesimoes/49ba71346a956ed0a12e9bc515be5804
// https://codepen.io/zakariachowdhury/pen/EZeGJy
// https://jsfiddle.net/0byLcn6d/
// image https://codepen.io/smartyboots/pen/VpqaGR
// https://brendansudol.com/writing/responsive-d3
// Dow Jones - 1929 Crash and Bear Market http://www.macrotrends.net/2484/dow-jones-crash-1929-bear-market