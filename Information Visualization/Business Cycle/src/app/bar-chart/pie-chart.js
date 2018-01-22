import * as d3 from "d3";
import * as topojson from 'topojson';
import * as d3geo from '../../../node_modules/d3-geo-projection/index.js';
import * as d3chr from '../../../node_modules/d3-scale-chromatic/index.js';
import { sliderHorizontal } from '../../../node_modules/d3-simple-slider/index.js';




var data = [


  {
    "year": new Date(1998, 1, 1),
    "Agriculture": -5.1,
    "Mining": -13.5,
    "Utilities": -2.7,
    "Construction": 3.3,
    "Manufacturing": -2.9,
    "FinanceInsurance": -0.3,
    "HealthCare": 2.7,
    "RealEstate": 2.2
  },
  {
    "year": new Date(1999, 1, 1),
    "Agriculture": -5.2,
    "Mining": 7.4,
    "Utilities": -1.5,
    "Construction": 3.9,
    "Manufacturing": -0.6,
    "FinanceInsurance": -1.7,
    "HealthCare": 2.5,
    "RealEstate": 2.7
  },
  {
    "year": new Date(2000, 1, 1),
    "Agriculture": 0.7,
    "Mining": 33.3,
    "Utilities": 7.7,
    "Construction": 4.2,
    "Manufacturing": 2.2,
    "FinanceInsurance": 0.5,
    "HealthCare": 3.1,
    "RealEstate": 3.3
  },
  {
    "year": new Date(2001, 1, 1),
    "Agriculture": 3.8,
    "Mining": -1.5,
    "Utilities": 9.8,
    "Construction": 3.9,
    "Manufacturing": -1.2,
    "FinanceInsurance": -0.8,
    "HealthCare": 3.8,
    "RealEstate": 3
  },
  {
    "year": new Date(2002, 1, 1),
    "Agriculture": -4.1,
    "Mining": -5.9,
    "Utilities": -5.2,
    "Construction": 2.7,
    "Manufacturing": -1,
    "FinanceInsurance": 1.6,
    "HealthCare": 2.5,
    "RealEstate": 3.1
  },
  {
    "year": new Date(2003, 1, 1),
    "Agriculture": 8,
    "Mining": 27.6,
    "Utilities": 11.5,
    "Construction": 3.6,
    "Manufacturing": 2.2,
    "FinanceInsurance": 2.6,
    "HealthCare": 2.8,
    "RealEstate": 2.3
  },
  {
    "year": new Date(2004, 1, 1),
    "Agriculture": 10.7,
    "Mining": 16.9,
    "Utilities": 5.5,
    "Construction": 7,
    "Manufacturing": 4.7,
    "FinanceInsurance": 2.9,
    "HealthCare": 3,
    "RealEstate": 2.5
  },
  {
    "year": new Date(2005, 1, 1),
    "Agriculture": -3.4,
    "Mining": 27.7,
    "Utilities": 11.5,
    "Construction": 8.3,
    "Manufacturing": 5.9,
    "FinanceInsurance": 2.2,
    "HealthCare": 3.1,
    "RealEstate": 2.7
  },
  {
    "year": new Date(2006, 1, 1),
    "Agriculture": 0.7,
    "Mining": 7.5,
    "Utilities": 5.3,
    "Construction": 7.6,
    "Manufacturing": 4.4,
    "FinanceInsurance": 2,
    "HealthCare": 2.7,
    "RealEstate": 3.1
  },
  {
    "year": new Date(2007, 1, 1),
    "Agriculture": 16.4,
    "Mining": 6.5,
    "Utilities": 2,
    "Construction": 4.6,
    "Manufacturing": 3.3,
    "FinanceInsurance": 2.4,
    "HealthCare": 3.4,
    "RealEstate": 2
  },
  {
    "year": new Date(2008, 1, 1),
    "Agriculture": 11.2,
    "Mining": 22.6,
    "Utilities": 7.9,
    "Construction": 3,
    "Manufacturing": 7.8,
    "FinanceInsurance": 1.3,
    "HealthCare": 2.6,
    "RealEstate": 1.9
  },
  {
    "year": new Date(2009, 1, 1),
    "Agriculture": -12.7,
    "Mining": -32,
    "Utilities": -6.5,
    "Construction": -0.7,
    "Manufacturing": -6.5,
    "FinanceInsurance": -4.8,
    "HealthCare": 2.2,
    "RealEstate": 0.6
  },
  {
    "year": new Date(2010, 1, 1),
    "Agriculture": 7.7,
    "Mining": 18.4,
    "Utilities": 2.3,
    "Construction": 0,
    "Manufacturing": 5.8,
    "FinanceInsurance": 3,
    "HealthCare": 2,
    "RealEstate": 0
  },
  {
    "year": new Date(2011, 1, 1),
    "Agriculture": 20.6,
    "Mining": 11.4,
    "Utilities": 1.6,
    "Construction": 3.1,
    "Manufacturing": 8.3,
    "FinanceInsurance": 1.8,
    "HealthCare": 1.8,
    "RealEstate": 1.1
  },
  {
    "year": new Date(2012, 1, 1),
    "Agriculture": 4.3,
    "Mining": -5.4,
    "Utilities": -4.2,
    "Construction": 2.5,
    "Manufacturing": 1.2,
    "FinanceInsurance": 3.4,
    "HealthCare": 1.5,
    "RealEstate": 1.8
  },
  {
    "year": new Date(2013, 1, 1),
    "Agriculture": 1.7,
    "Mining": 2.7,
    "Utilities": 4.1,
    "Construction": 2.8,
    "Manufacturing": 0.1,
    "FinanceInsurance": 3.7,
    "HealthCare": 1.4,
    "RealEstate": 1.9
  },
  {
    "year": new Date(2014, 1, 1),
    "Agriculture": -0.6,
    "Mining": -1.1,
    "Utilities": 6.5,
    "Construction": 3.8,
    "Manufacturing": 0.8,
    "FinanceInsurance": 4.4,
    "HealthCare": 1.4,
    "RealEstate": 2.1
  },
  {
    "year": new Date(2015, 1, 1),
    "Agriculture": -10,
    "Mining": -29.4,
    "Utilities": -5.6,
    "Construction": 1.8,
    "Manufacturing": -5.7,
    "FinanceInsurance": 2.7,
    "HealthCare": 1.1,
    "RealEstate": 2.1
  },
  {
    "year": new Date(2016, 1, 1),
    "Agriculture": -10.2,
    "Mining": -6.8,
    "Utilities": -3.2,
    "Construction": 2,
    "Manufacturing": -2.6,
    "FinanceInsurance": 4,
    "HealthCare": 1.6,
    "RealEstate": 2.3
  }
  /*
{year: new Date(2006, 1, 1), Agro_based: 342.7, RealEstate: 2720.1, cherries: 960, dates: 400},
{year: new Date(2007, 1, 1), Agro_based: 336.6, RealEstate: 2709.4, cherries: 960, dates: 400},
{year: new Date(2008, 1, 1), Agro_based: 332.0, RealEstate: 2651.3, cherries: 640, dates: 400},
{year: new Date(2009, 1, 1), Agro_based: 341.9, RealEstate: 2566.4, cherries: 640, dates: 400},
{year: new Date(2010, 1, 1), Agro_based: 346.2, RealEstate: 2634.5, cherries: 100, dates: 50},
{year: new Date(2011, 1, 1), Agro_based: 334.7, RealEstate: 2681.7, cherries: 960, dates: 400},
{year: new Date(2012, 1, 1), Agro_based: 330.2, RealEstate: 2754.1, cherries: 800, dates: 700},
{year: new Date(2013, 1, 1), Agro_based: 349.1, RealEstate: 2828.6, cherries: 640, dates: 700},
{year: new Date(2014, 1, 1), Agro_based: 360.5, RealEstate: 2962.6, cherries: 800, dates: 400},
{year: new Date(2015, 1, 1), Agro_based: 363.3, RealEstate: 3012.1, cherries: 640, dates: 1000},
{year: new Date(2016, 1, 1), Agro_based: 386.4, RealEstate: 3088.2, cherries: 800, dates: 700},


]*/
];

var stack = d3.stack()
  .keys(["Agriculture", "Mining", "Utilities", "Construction", "Manufacturing", "FinanceInsurance", "HealthCare", "RealEstate"])
  .order(d3.stackOrderNone)
  .offset(d3.stackOffsetWiggle);

var xAxis1 = null;

var series = stack(data);

var margin = { top: 20, right: 40, bottom: 40, left: 40 };

var width = null, height = null;

export function streamChart() {

  var svg = d3.select("svg#bar-chart-svg");

  width = +svg.attr('width') - margin.left - margin.right;
  height = +svg.attr('height') - margin.top - margin.bottom;

  focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleTime()
    .domain(d3.extent(data, function (d) { return d.year; }))
    .range([0, width]);

  // setup axis
  var xAxis = d3.axisBottom(x);

  var y = d3.scaleLinear()
    .domain([-80,80])
    .range([height,0]);

  var yAxis = d3.axisLeft(y)

  var color = d3.scaleOrdinal()
    .range(d3.schemeCategory20);

  color.domain(["Agriculture", "Mining", "Utilities", "Construction", "Manufacturing", "FinanceInsurance", "HealthCare", "RealEstate"])

  var area = d3.area()
    .x(function (d) { console.info('in area function', d); return x(d.data.year); })
    .y0(function (d) { return y(d[0] + 30); })
    .y1(function (d) { return y(d[1] + 30); })
    .curve(d3.curveBasis);



  focus.selectAll("path")
    .data(series)
    .enter().append("path")
    .attr("d", area)
    .attr('class', function (d) { return d.key; })
    .style("fill", function (d) { return color(d.key); });


  focus.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + (height) + ")")
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
    .text('The rate of change of GDP in percentage.');


  focus.append("text")
    .attr("x", 30)
    .attr("y", 10)
    .attr("dy", ".35em")
    .text("The rate of change of contribution of multiple Industries to US economy in percentage.");


  focus.append("g")
    .attr("class", "legendLinear")
    .attr("transform", "translate(20,20)");

  var legend1 = focus.selectAll("g.legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend");

  var ls_w = 20, ls_h = 20;

  legend1.append("rect")
    .attr("x", width - 90)
    .attr("y", function (d, i) { return (i * ls_h) + 30 - 2 * ls_h; })
    .attr("width", ls_w)
    .attr("height", ls_h)
    .style("fill", function (d, i) { return color(d); })
    .style("opacity", 0.8);

  legend1.append("text")
    .attr("x", width - 90 + 25)
    .attr("y", function (d, i) { return (i * ls_h) + 30 - ls_h - 4; })
    .text(function (d, i) { return d; })
    .style("font-size", "12px");


}




// define the area


// get the data

