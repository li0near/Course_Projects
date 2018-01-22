import * as d3 from "d3";
import { d3Tip } from "./d3-tip.js";
import * as topojson from 'topojson';
import * as d3geo from '../../../node_modules/d3-geo-projection/index.js';
import * as d3chr from '../../../node_modules/d3-scale-chromatic/index.js';
import { sliderHorizontal } from '../../../node_modules/d3-simple-slider/index.js';

import { color } from "d3";
// require("./d3-tip.js");

var color_na = d3.rgb("#d4d4d4"),  // color for null data
    data_all = {},  // object holding all data
    quantiles = [0, 0.2, 0.4, 0.6, 0.8, 1],
    dataRange = [1990, 2016],
    ccDic = {},  // Country code dictionary
    gdpDic = {};

var margin = { top: 50, right: 10, bottom: 50, left: 40 };
var svgBarsWidth = 900 - margin.left - margin.right,
    svgBarsHeight = 300 - margin.top - margin.bottom;
var x = d3.scaleBand()
    .rangeRound([0, svgBarsWidth])
    .padding(.05);
var y = d3.scaleLinear().range([svgBarsHeight, 0]);

// tooltip for world map
var tip = d3Tip("world-map")
    .attr('class', 'd3-tip')
    .offset([0, 0])
    .html(function (d) {
        return "<strong>Country: </strong><span class='details'>" + ccDic[d.id]
            + "<br></span>" + "<strong>GDP Growth: </strong><span class='details'>"
            + (gdpDic[d.id] ? gdpDic[d.id] : 0) + "%</span>";
    })

export function plotMap() {
    // init map container, projection
    var width = 960, height = 425;
    var svg_map = d3.select("#world-map").insert("svg")
        .attr("id", "map")
        .attr("height", height)
        .attr("width", width);
    var path = d3.geoPath(d3geo.geoRobinson());

    svg_map.call(tip);

    // init legend container
    svg_map.append("g")
        .attr("class", "legend");
    svg_map.append("g")
        .attr("class", "legend_title")
        .append("text");

    // init bars container
    var svg_bars = d3.select("#map-barchart")
        .append("svg")
        .attr("width", svgBarsWidth + margin.left + margin.right)
        .attr("height", svgBarsHeight + margin.top + margin.bottom)
        .append("g")
        .attr("id", "bars")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // add x and y axes labels
    d3.select("#map-barchart svg").append("g").append("text")
        .attr("x", -(svgBarsHeight + margin.top + margin.bottom) / 2)
        .attr("y", margin.left / 2 - 5)
        .attr("transform", "rotate(-90)")
        .attr('class', 'axis-label')
        .text("GDP Growth (%)");

    d3.select("#map-barchart svg").append("g").append("text")
        .attr("x", (svgBarsWidth + margin.left + margin.right) / 2)
        .attr("y", svgBarsHeight + margin.top + margin.bottom / 2)
        .attr('class', 'axis-label')
        .text("Countries");

    // display box for more information when bars are hovered over
    svg_bars.append("g")
        .attr("class", "infowin")
        .attr("transform", "translate(40, -30)")
        .append("text")
        .attr("id", "yr")
        .text("Tip:");

    svg_bars.append("g")
        .attr("class", "infowin")
        .attr("transform", "translate(40, -15)")
        .append("text")
        .attr("id", "gdp")
        .text("Hover over bars to show details");

    // load data
    d3.json("assets/GDP_growth.json", function (error, d) {
        if (error) throw error;
        loadCountryCode();

        var data = d[dataRange[0]],
            color = calcColorScale(data);

        data_all = d;
        gdpDic = data;
        // load map data and render it
        d3.json("assets/world.json", function (error, worldmap) {
            if (error) throw error;

            // init map
            svg_map.append("g")
                .attr("class", "countries")
                .selectAll("path")
                .data(topojson.feature(worldmap, worldmap.objects.world).features)
                .enter().append("path")
                .attr("d", path)
                .attr("id", function (d) { return d.id; })
                // .call(fillMap, color, data)
                // .append("title")
                // .call(setPathTitle, data)
                .on('mouseover', function (d) {
                    tip.show(d);
                    d3.select(this)
                        .style("opacity", 1)
                        .style("stroke", "white")
                        .style("stroke-width", 3);
                })
                .on('mouseout', function (d) {
                    tip.hide(d);

                    d3.select(this)
                        .style("opacity", 0.8)
                        .style("stroke", "white")
                        .style("stroke-width", 0.3);
                });

            // init map
            updateMap(color, data);

            // init legend
            renderLegend(color, data);
            renderBars(color, data);
        }); // map data

        // adding slider for map and bars
        var slider = sliderHorizontal()
            .min(dataRange[0])
            .max(dataRange[1])
            .step(1)
            .ticks(dataRange[1] - dataRange[0] + 1)
            .width(750)
            .tickFormat(d3.format(".0f"))
            .default(1990)
            // .tickValues()
            .on('onchange', val => {
                d3.select("#yr").text("Tip:");
                d3.select("#gdp").text("Hover over bars to show details");
                let upd_color = calcColorScale(data_all[val]);
                gdpDic = data_all[val];
                updateMap(upd_color, data_all[val]);
                renderLegend(upd_color, data_all[val]);
                renderBars(upd_color, data_all[val]);
            });

        // slider svg
        d3.select("div#world-map").append("svg")
            .attr("width", 800)
            .attr("height", 100)
            .append("g")
            .attr("id", "slider")
            .attr("transform", "translate(30,30)")
            .call(slider);

        // d3.select("p#value3").text(d3.timeFormat('%Y')(slider.value()));

    });

}

function fillMap(selection, color, data) {

    selection.attr("fill", function (d) {
        return typeof data[d.id] === 'undefined' ? color_na :
            d3.rgb(color(data[d.id]));
    });
}

function setPathTitle(selection, data) {
    selection
        .text(function (d) {
            return "" + d.id + ", " +
                (typeof data[d.id] === 'undefined' ? 'N/A' : data[d.id]);
        });
}

function updateMap(color, data) {

    // fill paths
    d3.selectAll("svg#map path").transition()
        .duration(500)
        .call(fillMap, color, data);

    // update path titles
    d3.selectAll("svg#map path title")
        .call(setPathTitle, data);

    // update headline
    // d3.select("h2").text(headline + d3.select("#year").node().value);
}

function renderLegend(color, data) {

    let svg_height = +d3.select("svg#map").attr("height");
    let legend_items = pairQuantiles(color.domain());
    let legend = d3.select("svg#map g.legend").selectAll("rect")
        .data(color.range());

    legend.exit().remove();

    legend.enter()
        .append("rect")
        .merge(legend)
        .attr("width", "20")
        .attr("height", "20")
        .attr("y", function (d, i) { return (svg_height - 29) - 25 * i; })
        .attr("x", 30)
        .attr("fill", function (d, i) { return d3.rgb(d); })
        .on("mouseover", function (d) { legendMouseOver(d, color, data); })
        .on("mouseout", function () { legendMouseOut(color, data); });

    let text = d3.select("svg#map g.legend").selectAll("text");

    // legend text
    text.data(legend_items)
        .enter().append("text").merge(text)
        .attr("y", function (d, i) { return (svg_height - 14) - 25 * i; })
        .attr("x", 60)
        .style("text-anchor", "start")
        .text(function (d, i) {
            if (i == 0) return "< " + d.split(" - ")[1];
            if (i == legend_items.length - 1) return "> " + d.split(" - ")[0];
            return d;
        });

    d3.select("svg#map g.legend_title text")
        .text("GDP Growth(%)")
        .attr("x", 30)
        .attr("y", 235);
}

function renderBars(color, data) {

    // turn data into array of objects
    var array = [];
    for (let key of Object.keys(data)) {
        // if (["CHN", "USA"].find(function (e) { return e == key;})) {
        if (key in ccDic) array.push({ 'id': key, 'value': +data[key] });
        // }
    }

    // sort array by value 
    // array = sortArrObj(array, 'value');
    array.sort(function (a, b) { return a.value - b.value; });

    x.domain(array.map(function (d) { return d.id; }));
    // y.domain(d3.extent(array, function (d) { return d.value; }));
    y.domain([-20, 20])
    var yAxis = d3.axisLeft(y).ticks(5).tickSize(-svgBarsWidth);

    d3.selectAll("#bars g.axis").remove();
    d3.select("#bars")
        .append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // var xAxis = d3.select("#bars").append("g")
    //     .attr("class", "axis axis--x")
    //     .attr("transform", "translate(" + 0+ "," + svgBarsHeight + ")")
    //     .call(d3.axisBottom(x))
    //     .selectAll("text")
    //     .style("text-anchor", "end")
    //     .attr("dx", "-.8em")
    //     .attr("dy", ".15em")
    //     .attr("transform", "rotate(-65)");

    var bars = d3.select("#bars").selectAll("rect").data(array);
    bars.exit().remove();
    bars = bars.enter().append("rect").merge(bars);
    bars.attr("fill", function (d) { return color(d.value); })
        .attr("x", function (d) { return x(d.id); })
        .attr("width", x.bandwidth())
        // .attr("y", y(0))  // these two lines set the starting position of bars
        // .attr("height", 0)
        .transition()  // set transition effect
        .duration(500)
        .ease(d3.easeExp)
        .attr("y", function (d) { return y(Math.max(0, d.value)); })
        .attr("height", function (d) { return Math.abs(y(d.value) - y(0)); });

    bars.on("mouseover", function (d) {
        d3.select("#yr").text("Country: " + ccDic[d.id])
            .style("fill", _ => { return ['#fddbc7', '#f7f7f7', '#d1e5f0'].includes(color(d.value)) ? "grey" : color(d.value); });;

        d3.select("#gdp").text("GDP Growth: " + d.value + "%")
            .style("fill", _ => { return ['#fddbc7', '#f7f7f7', '#d1e5f0'].includes(color(d.value)) ? "grey" : color(d.value); });
    })

    // .on("mouseout", function (d) {
    //     d3.selectAll("g.infowin text").text("");
    //     // d3.select("#yr").text("Tip:");
    //     // d3.select("#gdp").text("Hover over bars to show details");
    // });

    // add a horizontal line as x axis
    // d3.select("#bars").append("g")
    //     .attr("class", "x axis")
    //     .insert("line")
    //     .attr("y1", y(0))
    //     .attr("y2", y(0))
    //     .attr("x2", svgBarsWidth)
    //     .attr("stroke", "black");

}

function calcColorScale(data) {
    // with few datapoints the resulting legend gets confusing

    // get values and sort
    let data_values = Object.values(data).sort(function (a, b) { return a - b; });
    var quantiles = [0, 0.2, 0.4, 0.6, 0.8, 1];
    var quantiles_calc = quantiles.map(function (elem) {
        return Math.ceil(d3.quantile(data_values, elem));
    });
    quantiles_calc = [-100, -9, -5, 0, 2, 5, 8, 100]
    var color_range = ['#b2182b', '#ef8a62', '#fddbc7', '#f7f7f7', '#d1e5f0', '#67a9cf', '#2166ac']
    let scale = d3.scaleQuantile()
        .domain(quantiles_calc)
        // .range(d3chr.schemeBlues[(quantiles_calc.length) - 1]);
        .range(color_range)
    return scale;
}

/// event handlers /////

function legendMouseOver(color_key, color, data) {

    // cancels ongoing transitions (e.g., for quick mouseovers)
    d3.selectAll("svg#map path").interrupt();

    // TODO: improve, only colored paths need to be filled

    // then we also need to refill the map
    d3.selectAll("svg#map path")
        .call(fillMap, color, data);

    // and fade all other regions
    d3.selectAll("svg#map path:not([fill = '" + d3.rgb(color_key) + "'])")
        .attr("fill", color_na);
}

function legendMouseOut(color, data) {

    // TODO: minor, only 'colored' paths need to be refilled
    // refill entire map
    d3.selectAll("svg#map path").transition()
        .delay(100).duration(500)
        .call(fillMap, color, data);
}

/// helper functions /////

// sorts an array of equally structured objects by a key
// only works if sortkey contains unique values
function sortArrObj(arr, sortkey) {

    var sorted_keys = arr.map(function (elem) { return elem[sortkey]; }).sort();

    var newarr = [];
    for (let key of sorted_keys) {
        for (var i in arr) {
            if (arr[i][sortkey] === key) {
                newarr.push(arr[i]);
                continue;
            }
        }
    }

    return newarr;
}

// pairs neighboring elements in array of quantile bins
function pairQuantiles(arr) {
    var new_arr = [];
    for (let i = 0; i < arr.length - 1; i++) {

        // allow for closed intervals (depends on d3.scaleQuantile)
        // assumes that neighboring elements are equal
        if (i == arr.length - 2) {
            new_arr.push([arr[i], arr[i + 1]]);
        }
        else {
            new_arr.push([arr[i], arr[i + 1]]);
        }
    }

    new_arr = new_arr.map(function (elem) {
        return elem[0] === elem[1] ?
            d3.format(",")(elem[0]) :
            d3.format(",")(elem[0]) + " - " + d3.format(",")(elem[1]);
    });

    return new_arr;
}

function loadCountryCode() {
    d3.csv("assets/countryCode.csv", function (error, data) {
        data.forEach(function (d) {
            ccDic[d.id] = d.name;
        })
    });
}