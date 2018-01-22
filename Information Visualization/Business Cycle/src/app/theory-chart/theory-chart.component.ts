import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
// import * as D3 from "d3";
import * as d3 from "d3";
// import { d3Tip } from "../world-map/d3-tip.js";
// declare var D3:any;
// import 'd3';
// import * as d3tip from 'd3-tip';
// D3.tip = d3tip;

//import * as D3S from 'd3-scale-chromatic';
import { ERROR_DEBUG_CONTEXT } from '@angular/core/src/errors';
import { debugOutputAstAsTypeScript } from '@angular/compiler';

export type Dataset = {x:any, y: any, cycle:any, remark: any};

@Component({
  selector: 'app-theory-chart',
  templateUrl: './theory-chart.component.html',
  styleUrls: ['./theory-chart.component.css']
})

export class TheoryChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    d3.tsv('assets/theory-data.tsv', function (d) {
      return { 
        year: +d.year,
        cycle: +d.cycle,
        value: +d.value,
        remark: d.remark
      };
    }, function (error, data) {
      if (error) {
        throw error;
      }
      function doResize(){
      let 
        margin = { top: 20, right: 20, bottom: 40, left: 40 },
        // sWidth = document.querySelector(".container").getBoundingClientRect().width/1.15,
        sWidth = (window.outerWidth/1.5),
        sHeight = sWidth / 2,           

        width = sWidth - margin.left - margin.right,
        height = sHeight - margin.top - margin.bottom,      

        story = {
          0: ["Business Cycle: ", "Classification by periods: ","a. The Kitchin inventory cycle of 3 to 5 years (Pork cycle)", "b. The Juglar fixed-investment cycle of 7 to 11 years (business cycle)", "c. The Kuznets infrastructural investment cycle of 15 to 25 years (building cycle)", "d. The Kondratiev wave or long technological cycle of 45 to 60 years"], 
          1: ["Phases 1: Expansion", "a. Activity rebounds (GDP, employment, incomes)","b. Credit begins to grow", "c. Profits growth rapidly", "d. Policy still stimulative", "e. Inventorieslow; sales improve"], 
          2: ["Phases 2: Boom", "a. Growth peaking", "b. Credit growth strong", "c. Profit growth peaks", "d. Policy neutral", "e. Inventories, sales grow; equilibrium reached"],
          3: ["Phases 3: Depression", "a. Growth moderating", "b. Credit tightens", "c. Earning under pressure", "d. Policy contractionary", "e. Inventories grow; sales growth falls"],
          4: ["Phases 4: Recession", "a. Falling activity", "b. Credit dries up", "c. Profits decline", "d. Policy eases", "e. Inventories, sales fall"],
          5: ["Sometimes call Stage 1: a.k.a. Revival or Recovery", "Psychology of the Market Cycle:","1. Disbelief: This rally will fail like the others.", "2. Hope: A recovery is possible.", "3. Optimism: This really is real.", "4. Belief: Time to get fully invested."], 
          6: ["Stage 2: a.k.a. Prosperity or Peak", "Psychology of the Market Cycle:", "1. Thrill: I will buy more on maargin. Gotta tell everyone to buy!", "2. Euphoria: I am a genius! We're all going to be rich!", "3. Complacency: We just need to cool off for the next rally.", " "],
          7: ["Stage 3: a.k.a. Liquidation or Downturn", "Psychology of the Market Cycle:", "1. Anxiety: Why am I getting margin calls? This dip is taking longer than expected.", "2. Denial: My investments are with great companies. They will come back.", "3. Panic: Shit! Everyone is selling. I need to get out!", "4. Capitulation: I'm getting 100% out of th emarkets. I can't afford to lose more."],
          8: ["Stage 4: a.k.a Contraction or Trough", "Psychology of the Market Cycle:", "1. Anger: Who shorted the market?? Why did the government allow this to happen??", "2. Depression: My retirement money is lost. How can we pay for all this new stuff? I am an idiot.", "3. Disbelief: This is a sucker's rally."],
          9: ["Kondratiev wave E: Improvement", "a. Cons. Disc. gains benefit ","b. Real Estate, Industrials have better performance", "c. Materials, Info Tech. and Financials may benefit", "d. Telecome, Utilities, Energy will have negative impacted", "e. Health Care, Cons. Staples will have impacted"], 
          10: ["Kondratiev wave P: Prosperity", "a. Info Tech. gains benefit", "b. Energy and Telecome get positive impact", "c. Industrials, Health Care, and Financials may be benefited", "d. Utilities, Materials will be major industries of negtived impacted", "e. Cons. Staples, Cons. Disc., Real Estate will have negative impacted either."],
          11: ["Kondratiev wave R: Recession", "a. Energy, Health Care, and Materials have better performance", "b. Cons. Staples, Utilities, and Real Estate may have good performance.", "c. Cons. Disc. and Info Tech. get negative impacts", "d. Telecom may be negative impact either", "e. Financias, and Industries may less impacted"],
          12: ["Kondratiev wave D: Depression", "a. Cons. Stamples, Utilties, Telecom., and Health Care will get better performance.", "b. Real Estate, Info Tech., and Industrials get negative impacts.", "c. Financials, Materials, and Energy may get negative impacted", "d. Cons Disc may have minor impact", ""]
          
        },
        cycle_label = ["", "", "", ""],
        // cycle_label = ["Recession", "Expansion", "Boom", "Depression"],
        ease = d3.easeLinear,
        duration = 1000,
        delay = 6000,
        // normal trend data
        trend_data = [{x:1, y:1.5}, {x:46,y:9.5}];

      const dataset = data.map(function(d) { 
          return {'x': d.year, 'y': d.value, 'cycle':d.cycle, 'remark':d.remark}; 
      });
      // split data to different stages
      const  datasets = splitdata(dataset);
      
      let svg = d3.select('#theory-chart-svg')
        .attr("width", sWidth).attr("height", sHeight);
      // Remove old svg
      svg.selectAll("g").remove();
      // Re-draw svg
      const g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      const xScale = d3.scaleLinear() // for year
        .domain([0, d3.max(data, function (d) { return d.year+1; })]) // input        
      .range([0, width]); // output

      const yScale = d3.scaleLinear().rangeRound([height, 0])
        .domain([0, d3.max(data, function (d) { return d.value+1; })]);

      // Setup the tool tip.  Note that this is just one example, and that many styling options are available.
      // See original documentation for more details on styling: http://labratrevenge.com/d3-tip/
      // var tool_tip = D3.tip("theory-chart")
      //   .attr("class", "d3-tip")
      //   .offset([-8, 0])
      //   .html(function<Dataset>(d) { return "Description: " + d.remark; })   
      //   ;

      // g.call(tool_tip);

      // x axis for linear on year
      g.append('g')
        .attr('class', 'axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(xScale).ticks(10  , ''))
        .append('text')
        .attr('x', width-15)
        .attr('y', 26)
        .attr('dx', '1em')
        .attr('text-anchor', 'end')
        .text('Years');

      // y axis for linear on year  
      g.append('g')
        .attr('class', 'y axis axis--y')
        .call(d3.axisLeft(yScale).ticks(10, ''))
        .append('text')
        .attr('transform', 'rotate(-90)')  
        .attr('x', -5)              
        .attr('y', -30)
        .attr('text-anchor', 'end')
        .text('Level of Business Activity');

      // Legend
      g.append('g')       
        .attr('transform', 'translate(0,' + height + ')')                     
        .append('text')
        .attr('x', width/1.24)
        .attr('y', -height/1.01)
        .attr('text-anchor', 'begin')
        .text('Business Cycle');   
      g.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(0,' + height + ')')
        .append("rect")
        .attr("class", "area0")
        .attr("width", "10")
        .attr("height", "10")
        .attr("x", width/1.22)
        .attr("y", -height/1.05);
      g.append('g')       
        .attr('transform', 'translate(0,' + height + ')')                     
        .append('text')
        .attr('x', width/1.2)
        .attr('y', -height/1.075)
        .attr('text-anchor', 'begin')
        .text('Recession');          
      g.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(0,' + height + ')')        
        .append("rect")
        .attr("class", "area1")
        .attr("width", "10")
        .attr("height", "10")
        .attr("x", width/1.22)
        .attr("y", -height/1.1)
        g.append('g')       
        .attr('transform', 'translate(0,' + height + ')')                     
        .append('text')
        .attr('x', width/1.2)
        .attr('y', -height/1.13)
        .attr('text-anchor', 'begin')
        .text('Expansion');          
      g.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(0,' + height + ')')        
        .append("rect")
        .attr("class", "area2")
        .attr("width", "10")
        .attr("height", "10")
        .attr("x", width/1.22)
        .attr("y", -height/1.15)
      g.append('g')       
        .attr('transform', 'translate(0,' + height + ')')                     
        .append('text')
        .attr('x', width/1.2)
        .attr('y', -height/1.18)
        .attr('text-anchor', 'begin')
        .text('Boom');        
      g.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(0,' + height + ')')        
        .append("rect")
        .attr("class", "area3")
        .attr("width", "10")
        .attr("height", "10")
        .attr("x", width/1.22)
        .attr("y", -height/1.20)    
      g.append('g')       
        .attr('transform', 'translate(0,' + height + ')')                     
        .append('text')
        .attr('x', width/1.2)
        .attr('y', -height/1.23)
        .attr('text-anchor', 'begin')
        .text('Depression');

      // define the area generator
      const area = d3.area<Dataset>()
        .x(function(d) { return xScale(d.x); })
        .y0(height)
        .y1(function(d) { return yScale(d.y); })
        .curve(d3.curveMonotoneX); // apply smoothing to the line

      // define line generator
      const line = d3.line<Dataset>()
        .x(function(d, i){
          return xScale(d.x);
        }) // set the x values for the line generator
        .y(function(d){
          return yScale(d.y);
        }) // set the y values for the line generator
        .curve(d3.curveMonotoneX); // apply smoothing to the line
        
      multiple_clipPathes(g, datasets);
      drawAreas (datasets);
      drawLines (datasets);
      drawCircles(datasets);         

      // capture the action of click button
      d3.select("#theory-button").on("click", function(){
        let i = 0;
        clean_screen(datasets);
        for (let dataset of datasets) {
          let w = xScale(dataset[dataset.length-1].x)
          move_clip_rect(w, dataset);     
          i++;
        }
      });


      function clean_screen(datasets){
        hide_story();
        let i = 0;
        for (let dataset of datasets) {
          d3.select("#rectClip"+i+" rect")
            .transition()
            .duration(0).attr("width", 0);
          i++;
        }
      }
      
      function show_story(cycle, transit){
        hide_story();
        const total_stories = Object.keys(story).length;
        let _story = story[cycle%total_stories];
        for (let j = 0; j < _story.length; j++){
          if (transit == true){
            g.append("text")
              .transition()
              .duration(duration)
              .ease(ease)          
              .attr("class", "story"+j)
              .attr("dx", 8)
              .attr("dy", height/20+height/20*j)
              .text(story[cycle%total_stories][j]);
          }
          else {
            g.append("text")
              .attr("class", "story"+j)
              .attr("dx", 8)
              .attr("dy", height/20+height/20*j)
              .text(story[cycle%total_stories][j]);
          }
        }
      }
      function hide_story(){
        let story_lines = 0;
        for (let key in story) {
          if (story_lines < story[key].length) {
            story_lines = story[key].length
          }
        }
        for (let j = 0; j < story_lines; j++){
          g.select(".story"+j).remove();
        }
        g.select(".story"+ story_lines).remove();
      }
      // split data by each cycle
      function splitdata(data) { 
        let inner = [];
        let ds = [];
        let i = 0
        for (let element of data) {
          if (element.cycle == i) {
            inner.push({'x': element.x, 'y': element.y, 'cycle': element.cycle, 'remark':element.remark });
          }
          else {
            ds.push(inner);
            i++;
            inner = [];
            inner.push({'x': element.x, 'y': element.y, 'cycle': element.cycle, 'remark':element.remark });
          }
        }
        ds.push(inner);
        return ds
      };

      // add clip pathes
      function multiple_clipPathes(g, datasets){
        let i = 0;
        for (let dataset of datasets) {
          g.append("clipPath")
            .attr("id", "rectClip"+i)
            .append("rect")
            .attr("width", xScale(dataset[dataset.length-1].x)+10) 
            .attr("height", height);
          i++;
        }
      }
    
      // add the areas and x-axis label
      function drawAreas(datasets){
        let i = 0;
        for (let dataset of datasets) {
          g.append("path")
            .data([dataset])
            .attr("class", "area"+(i)%4)
            .attr("d", area)
            .attr("clip-path", "url(#rectClip"+i+")");
          if (i!=0 && i%4!=2) {
            g.append("text")
              .transition()
              .duration(duration)
              .delay(delay)
              .ease(ease)
              .attr("class", "label")
              .attr("dx", xScale(dataset[0].x)+(xScale(dataset[dataset.length-1].x) - xScale(dataset[0].x)-width/16)/2)
              .attr("dy", height-10)
              .text(cycle_label[i%4])
            ;
          }
          // adjust position for label "Boom"
          else if (i%4 == 2){
            g.append("text")
              .transition()
              .duration(duration)
              .delay(delay)
              .ease(ease)
              .attr("class", "label")
              .attr("dx", xScale(dataset[0].x)+(xScale(dataset[dataset.length-1].x) - xScale(dataset[0].x)-width/25)/2)
              .attr("dy", height-10)
              .text(cycle_label[i%4])
            ;         
          }
          i++;
        }
      }
      // add the lines
      function drawLines(datasets){
        let i = 0;
        for (let dataset of datasets) {
          g.append("path")
            .data([dataset])
            .attr("class", "line")
            .attr("d", line)
            .attr("clip-path", "url(#rectClip"+i+")");
          i++;
        }
        // add trend line
        g.append("path")
          .data([trend_data])
          .attr("class", "line")
          .attr("d", line);
        // add trend label
        g.append("text")
          .attr("class", "label")
          .attr("dx", width/2.3)
          .attr("dy", height/1.2)         
          .text("Normal Trend")
          .attr('transform', 'rotate(-17)') 
          ;
      }      
      // add the circles
      function drawCircles(datasets){
        let i = 0;
        let _g = g.selectAll(".dot");
      // Appends a circle for each datapoint
        for (let dataset of datasets) {
          _g.data(dataset)
            .enter().append("circle") // Uses the enter().append() method
            .attr("class", "dot") // Assign a class for styling
            .attr("cx", function<Dataset>(d) { return xScale(d.x) })
            .attr("cy", function<Dataset>(d) { return yScale(d.y) })
            .attr("r", 7)
            .attr("clip-path", "url(#rectClip"+i+")")
            .on('mouseover', function<Dataset>(d){show_story(d.cycle, false)})
            .on('mouseout', hide_story)    
            // .on('mouseover', tool_tip.show)
            // .on('mouseout', tool_tip.hide)                
            .append("title")
            .text(function<Dataset>(d) {
                return d.remark; 
              })           
            ;
          i++;
        }
      } 


      function move_clip_rect(width, data) {
        let i = data[0].cycle;
        d3.select("#rectClip"+i+" rect")
          .transition()
            .delay(delay*i)
            .duration(duration*i)          
            .ease(ease)
            .attr("width", width+10)
            .on("end", render_text)
            ; 
        // render description during animation period
        function render_text(){
          show_story(i, true);                        
        }
      }
    }
    // Resize even and process
    d3.select(window).on('resize', doResize);
    doResize();

    });
  }
}
// https://codepen.io/sonofjack/pen/BQGpLV
// https://bocoup.com/blog/improving-d3-path-animation
// https://bl.ocks.org/mbostock/3883195
// https://bl.ocks.org/d3noob/119a138ef9bd1d8f0a8d57ea72355252
// http://duspviz.mit.edu/d3-workshop/transitions-animation/
// resize http://www.dongcoder.com/detail-643450.html
// text animation https://bl.ocks.org/TommyCoin80/525ae682300d91ef6db42a693f86fac7
// simple fill area line chart https://bl.ocks.org/Cthulahoop/21ecf1bf5d2568b854934a74050b31e6
// https://bl.ocks.org/mbostock/1256572
// business cycle fidelity https://eresearch.fidelity.com/eresearch/markets_sectors/sectors/si_business_cycle.jhtml?tab=sibusiness
// tip http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
// ARC http://bl.ocks.org/mbostock/5100636
//
// reference: https://www.fidelity.com/viewpoints/market-and-economic-insights/business-cycle-update-august-2017
// reference: https://www.fidelity.com/viewpoints/investing-ideas/sector-investing-business-cycle