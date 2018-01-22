import * as d3 from "d3";

var rowLabel = ["FRA", "DEU", "ITA", "JPN", "GBR", "USA", "AUS", "CAN", "KOR",
    "IDN", "BRA", "MEX", "ARG", "TUR", "CHN", "ZAF", "IND", "RUS", "SAU"],
    colLabel = d3.range(1970, 2018),  // from year 1970 to 2017
    row_number = rowLabel.length,
    col_number = colLabel.length,
    hcrow = d3.range(1, row_number + 1),
    hccol = d3.range(1, col_number + 1);

var margin = { top: 60, right: 10, bottom: 50, left: 40 },
    colors = ["#67000d", "#a50f15", "#cb181d", "#ef3b2c", "#fb6a4a", "#fc9272", "#fcbba1", "#fee0d2", "#fff5f0", "#fff", "#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"];

var ccDic = {};  // country code dictionary

export function plot() {
    // var pageWidth = document.querySelector(".container").getBoundingClientRect().width,
    var pageWidth = 960,
        cellSize = pageWidth > 550 ? pageWidth / 55 : 10,
        width = cellSize * col_number, // - margin.left - margin.right,
        height = cellSize * row_number, // - margin.top - margin.bottom,
        legendElementWidth = cellSize * 2.5;

    // remove old svg first when window resizes for future plotting
    d3.selectAll("#heat-map svg").remove();

    loadCountryCode();  // load <contry code: country name> data

    // init tooltip div element
    d3.select("#heat-map")
        .append("div").attr("id", "heattip").attr("class", "hidden")
        .append("p")
        .append("span").attr("id", "value")

    // load data and plot heat map
    d3.csv("assets/MSCI_G20.csv", function (error, rows) {

        var data = [];
        rows.forEach(element => {
            for (var key in element)
                if (key != "year")
                    data.push({
                        row: key,
                        col: +element.year,
                        value: Math.log2(+element[key])
                    })
        });

        // data domain: [3.9379171498526677, 12.765339561582614]
        var colorScale = d3.scaleQuantile()
            .domain([4, 13])
            .range(colors);

        var svg = d3.select("#heat-map").append("svg")
            // .attr("width", width + margin.left + margin.right)
            // .attr("height", height + margin.top + margin.bottom)
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} 
                                  ${height + margin.top + margin.bottom}`)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var rowSortOrder = false;  // sort flag for row
        var colSortOrder = false;  // sort flag for column
        var rowLabels = svg.append("g")
            .selectAll(".rowLabelg")
            .data(rowLabel)
            .enter()
            .append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return hcrow.indexOf(i + 1) * cellSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + cellSize / 1.5 + ")")
            .attr("class", function (d, i) { return "rowLabel mono r" + i; })
            .on("mouseover", function (d) { d3.select(this).classed("text-hover", true); })
            .on("mouseout", function (d) { d3.select(this).classed("text-hover", false); })
            .on("click", function (d, i) {
                rowSortOrder = !rowSortOrder;
                sortbylabel("r", i, rowSortOrder);
            });

        var colLabels = svg.append("g")
            .selectAll(".colLabelg")
            .data(colLabel)
            .enter()
            .append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return hccol.indexOf(i + 1) * cellSize; })
            .style("text-anchor", "left")                  // 4 below is half font size
            .attr("transform", "translate(" + (cellSize / 2 + 4) + ",-6) rotate (-90)")
            .attr("class", function (d, i) { return "colLabel mono c" + i; })
            .on("mouseover", function (d) { d3.select(this).classed("text-hover", true); })
            .on("mouseout", function (d) { d3.select(this).classed("text-hover", false); })
            .on("click", function (d, i) {
                colSortOrder = !colSortOrder;
                sortbylabel("c", i, colSortOrder);
            });

        var heatMap = svg.append("g").attr("class", "g3")
            .selectAll(".cellg")
            .data(data, function (d) { return d.row + ":" + d.col; })
            .enter()
            .append("rect")
            .attr("x", function (d) { return colLabel.indexOf(d.col) * cellSize; })
            .attr("y", function (d) { return rowLabel.indexOf(d.row) * cellSize; })
            .attr("class", function (d) { return "cell cell-border cr" + (rowLabel.indexOf(d.row) - 1) + " cc" + (colLabel.indexOf(d.col) - 1); })
            .attr("width", cellSize)
            .attr("height", cellSize)
            .style("fill", function (d) { return d.value ? colorScale(d.value) : "#ccc"; })
            .on("mouseover", function (d) {
                // highlight row and column labels
                d3.selectAll(".rowLabel").classed("text-highlight", function (r, ri) { return r == d.row; });
                d3.selectAll(".colLabel").classed("text-highlight", function (c, ci) { return c == d.col; });
                if (d.value) {  // only show tip when data isn"t null
                    d3.select(this).classed("cell-hover", true);

                    // Update the tooltip position and value
                    var scrollTop = document.getElementById("portfolioModal5").scrollTop,
                        scrollLeft = document.getElementById("portfolioModal5").scrollLeft;
                    d3.select("#heattip")
                        .style("left", (d3.event.x + scrollLeft - 180) + "px")
                        .style("top", (d3.event.y + scrollTop - 80) + "px")
                        .select("#value")
                        .html("<strong>Country: </strong><span class='details'>" + ccDic[d.row]
                        + "<br></span>" + "<strong>MSCI: </strong><span class='details'>"
                        + d3.format(".2f")(d.value ? Math.pow(2, d.value) : 0) + "</span>");

                    // Show the tooltip
                    d3.select("#heattip").classed("hidden", false);
                }
            })
            .on("mouseout", function () {
                d3.select(this).classed("cell-hover", false);
                d3.selectAll(".rowLabel").classed("text-highlight", false);
                d3.selectAll(".colLabel").classed("text-highlight", false);
                d3.select("#heattip").classed("hidden", true);
            });

        var legend = svg.selectAll(".legend")
            .data(d3.range(4, 13.5, 0.5))
            .enter().append("g")
            .attr("class", "legend");

        legend.append("rect")
            .attr("x", function (d, i) { return legendElementWidth * i; })
            .attr("y", height + (cellSize * 2))
            .attr("width", legendElementWidth)
            .attr("height", cellSize)
            .style("fill", function (d, i) { return colors[i]; });

        legend.append("text")
            .attr("class", "mono")
            .text(function (d) { return d; })
            .attr("width", legendElementWidth)
            .attr("x", function (d, i) { return legendElementWidth * (i + 1); })
            .attr("y", height + (cellSize * 1.7));

        // Change ordering of cells

        function sortbylabel(rORc, i, sortOrder) {
            var t = svg.transition().duration(1000).ease(d3.easePoly);
            var temp = [], sortedRow = [], sortedCol = [];
            d3.selectAll(".c" + rORc + (i - 1))
                .filter(function (ce) { temp.push(ce); });

            temp.sort((a, b) => { return sortOrder ? b.value - a.value : a.value - b.value });
            temp.forEach(d => { sortedRow.push(d.row); sortedCol.push(d.col) });

            if (rORc == "r") { // sort by row attribute
                t.selectAll(".cell")
                    .attr("x", function (d) { return sortedCol.indexOf(d.col) * cellSize; })
                    ;
                t.selectAll(".colLabel")
                    .attr("y", function (d, i) { return sortedCol.indexOf(d) * cellSize; })
                    ;
            } else { // sort by column
                t.selectAll(".cell")
                    .attr("y", function (d) { return sortedRow.indexOf(d.row) * cellSize; })
                    ;
                t.selectAll(".rowLabel")
                    .attr("y", function (d, i) { return sortedRow.indexOf(d) * cellSize; })
                    ;
            }
        }

        // reset the heat map to orginal layout
        d3.select("#reset").on("click", function () {
            var t = svg.transition().duration(2000).ease(d3.easeElastic);
            t.selectAll(".cell")
                .attr("x", function (d) { return colLabel.indexOf(d.col) * cellSize; })
                .attr("y", function (d) { return rowLabel.indexOf(d.row) * cellSize; });

            t.selectAll(".rowLabel")
                .attr("y", function (d, i) { return hcrow.indexOf(i + 1) * cellSize; });

            t.selectAll(".colLabel")
                .attr("y", function (d, i) { return hccol.indexOf(i + 1) * cellSize; });

        });

    });
    createTable();
}

function loadCountryCode() {
    d3.csv("assets/countryCode.csv", function (error, data) {
        data.forEach(function (d) {
            ccDic[d.id] = d.name;
        })
    });
}

// create a table holding data
function createTable() {
    d3.csv("assets/MSCI_G20.csv", function (error, rows) {
        if (error) throw error;
        var data = [];
        // preprocess data to retain only data for 14 countries in 1990-2017
        rows.forEach(element => {
            if (+element.year > 2000) {
                var row = {};
                for (var key in element) {
                    if (['year', 'FRA', 'DEU', 'ITA', 'JPN', 'GBR', 'USA', 'AUS',
                        'CAN', 'KOR', 'IDN', 'BRA', 'MEX', 'ARG', 'TUR'].includes(key))
                        row[key] = element[key];
                }
                data.push(row);
            }
        });

        var sortAscending = false;
        var table = d3.select("#table").append("table");
        var titles = d3.keys(data[0]);
        var headers = table.append("thead").append("tr")
            .selectAll("th")
            .data(titles).enter()
            .append("th")
            .text(function (d) {
                return d.toUpperCase();
            })
            .on("click", function (d) {
                headers.attr("class", "header");

                if (sortAscending) {
                    rows.sort(function (a, b) { return +b[d] < +a[d]; });
                    sortAscending = false;
                    this.className = "aes";
                } else {
                    rows.sort(function (a, b) { return +b[d] > +a[d]; });
                    sortAscending = true;
                    this.className = "des";
                }

            });

        var rows = table.append("tbody").selectAll("tr")
            .data(data).enter()
            .append("tr");
        rows.selectAll("td")
            .data(function (d) {
                return titles.map(function (k) {
                    return { "value": d[k], "name": k };
                });
            }).enter()
            .append("td")
            .attr("data-th", function (d) {
                return d.name;
            })
            .html(function (d) {
                if (d.name == "year")
                    return `<b>${d.value}</b>`;
                return d3.format(".2f")(d.value);
            });
    });
}