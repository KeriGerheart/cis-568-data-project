const csvPath = "data/energy.csv";

const energySources = ["Solar", "Wind", "Hydropower", "Oil", "Gas", "Coal"];

// color mapping
const color = d3
    .scaleOrdinal()
    .domain(energySources)
    .range(["#BB86FC", "#80B4FF", "#80CBC3", "#FFDF80", "#FFC775", "#EE77A2"]);
const svg = d3.select("#chart-1");

const margin = {
    top: 30,
    right: 40,
    bottom: 110,
    left: 80,
};

const width = 1000 - margin.left - margin.right;
const height = 560 - margin.top - margin.bottom;

// main line chart container
const chart = svg
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

const xAxisGroup = chart.append("g").attr("class", "axis").attr("transform", `translate(0,${height})`);

const yAxisGroup = chart.append("g").attr("class", "axis");

const lineGroup = chart.append("g");
const pointGroup = chart.append("g");

// vertical guide line that follows the hovered point
const crosshairGroup = chart.append("g").attr("class", "crosshair").style("display", "none");

crosshairGroup.append("line").attr("y1", 0).attr("y2", height);

const legendGroup = chart.append("g").attr("transform", `translate(0, ${height + 70})`);

chart
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 45)
    .attr("text-anchor", "middle")
    .attr("fill", "#ccc")
    .text("Year");

chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -55)
    .attr("text-anchor", "middle")
    .attr("fill", "#ccc")
    .text("Energy production (TWh)");

const comparisonSvg = d3.select("#chart-2");

const comparisonMargin = {
    top: 30,
    right: 40,
    bottom: 140,
    left: 80,
};

const comparisonBaseWidth = 700;
const comparisonBaseHeight = 500;

const comparisonWidth = comparisonBaseWidth - comparisonMargin.left - comparisonMargin.right;
const comparisonHeight = comparisonBaseHeight - comparisonMargin.top - comparisonMargin.bottom;

// chart 2 compares one selected source across countries
const comparisonChart = comparisonSvg
    .attr("viewBox", `0 0 ${comparisonBaseWidth} ${comparisonBaseHeight}`)
    .append("g")
    .attr("transform", `translate(${comparisonMargin.left},${comparisonMargin.top})`);

const comparisonX = d3.scaleLinear().range([0, comparisonWidth]);
const comparisonY = d3.scaleLinear().range([comparisonHeight, 0]);

const comparisonXAxisGroup = comparisonChart
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${comparisonHeight})`);

const comparisonYAxisGroup = comparisonChart.append("g").attr("class", "axis");

const comparisonLineGroup = comparisonChart.append("g");
const comparisonCrosshairGroup = comparisonChart.append("g").attr("class", "crosshair").style("display", "none");

comparisonCrosshairGroup.append("line").attr("y1", 0).attr("y2", comparisonHeight);
const comparisonLegendGroup = comparisonChart.append("g").attr("transform", `translate(0, ${comparisonHeight + 70})`);

comparisonChart
    .append("text")
    .attr("x", comparisonWidth / 2)
    .attr("y", comparisonHeight + 45)
    .attr("text-anchor", "middle")
    .attr("fill", "#ccc")
    .text("Year");

comparisonChart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -comparisonHeight / 2)
    .attr("y", -55)
    .attr("text-anchor", "middle")
    .attr("fill", "#ccc")
    .text("Energy production (TWh)");

const barSvg = d3.select("#chart-3");

const barMargin = {
    top: 30,
    right: 30,
    bottom: 70,
    left: 80,
};

const barBaseWidth = 700;
const barBaseHeight = 500;

const barWidth = barBaseWidth - barMargin.left - barMargin.right;
const barHeight = barBaseHeight - barMargin.top - barMargin.bottom;

// Chart 3 summarizes a country's average production per source for the selected year range
const barChart = barSvg
    .attr("viewBox", `0 0 ${barBaseWidth} ${barBaseHeight}`)
    .append("g")
    .attr("transform", `translate(${barMargin.left},${barMargin.top})`);

const barX = d3.scaleBand().range([0, barWidth]).padding(0.25);

const barY = d3.scaleLinear().range([barHeight, 0]);

const barXAxisGroup = barChart.append("g").attr("class", "axis").attr("transform", `translate(0,${barHeight})`);

const barYAxisGroup = barChart.append("g").attr("class", "axis");

barChart
    .append("text")
    .attr("x", barWidth / 2)
    .attr("y", barHeight + 55)
    .attr("text-anchor", "middle")
    .attr("fill", "#ccc")
    .text("Energy source");

barChart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -barHeight / 2)
    .attr("y", -55)
    .attr("text-anchor", "middle")
    .attr("fill", "#ccc")
    .text("Energy production (TWh)");

const tooltip = d3.select("#tooltip");

const countryPalette = [
    "#EB3693",
    "#9875FF",
    "#80B4FF",
    "#80CBC3",
    "#9AE4A7",
    "#FFDF80",
    "#FCBB86",
    "#F286FE",
    "#D5B8FF",
    "#DAE085",
];

function showTooltip(event, html) {
    tooltip
        .classed("is-visible", true)
        .html(html)
        .style("left", `${event.clientX + 12}px`)
        .style("top", `${event.clientY + 12}px`);
}

function hideTooltip() {
    tooltip.classed("is-visible", false);
}

// Draw lines with a short animation each time they are rendered or updated
function animateLineDraw(selection) {
    selection.each(function () {
        const path = d3.select(this);
        const length = this.getTotalLength();

        path.attr("stroke-dasharray", `${length} ${length}`)
            .attr("stroke-dashoffset", length)
            .transition()
            .duration(700)
            .ease(d3.easeCubicOut)
            .attr("stroke-dashoffset", 0);
    });
}

d3.csv(csvPath, d3.autoType).then((data) => {
    // Build selector options and slider bounds from the data
    const countries = Array.from(new Set(data.map((d) => d.Entity))).sort();
    const years = Array.from(new Set(data.map((d) => d.Year))).sort(d3.ascending);

    const countrySelect = d3.select("#country-select");
    const yearRangeLabel = d3.select("#year-range-label");

    countrySelect
        .selectAll("option")
        .data(countries)
        .join("option")
        .attr("value", (d) => d)
        .text((d) => d);

    const defaultCountry = countries.includes("United States") ? "United States" : countries[0];
    const minYear = d3.min(years);
    const maxYear = d3.max(years);

    countrySelect.property("value", defaultCountry);

    const sourceSelect = d3.select("#source-select");

    const slider = document.getElementById("year-slider");

    noUiSlider.create(slider, {
        start: [minYear, maxYear],
        connect: true,
        step: 1,
        range: {
            min: minYear,
            max: maxYear,
        },
    });

    sourceSelect
        .selectAll("option")
        .data(energySources)
        .join("option")
        .attr("value", (d) => d)
        .text((d) => d);

    sourceSelect.property("value", "Oil");

    function getSelectedYears() {
        const values = slider.noUiSlider.get();

        return {
            startYear: Math.round(+values[0]),
            endYear: Math.round(+values[1]),
        };
    }

    // all 3 charts render from the controls
    function update() {
        const selectedCountry = countrySelect.property("value");
        const selectedSource = sourceSelect.property("value");
        const { startYear, endYear } = getSelectedYears();

        yearRangeLabel.text(`${startYear} – ${endYear}`);

        drawChart(data, selectedCountry, startYear, endYear);
        drawComparisonChart(data, selectedSource, startYear, endYear);
        drawBarChart(data, selectedCountry, startYear, endYear);
    }
    sourceSelect.on("change", update);
    countrySelect.on("change", update);
    slider.noUiSlider.on("update", update);

    update();
});

function drawChart(data, selectedCountry, startYear, endYear) {
    // Filter for the selected country and year range
    const countryData = data
        .filter((d) => d.Entity === selectedCountry && d.Year >= startYear && d.Year <= endYear)
        .sort((a, b) => d3.ascending(a.Year, b.Year));

    const series = energySources.map((source) => ({
        source,
        values: countryData.map((d) => ({
            year: d.Year,
            value: d[source] ?? 0,
        })),
    }));

    const yearExtent = d3.extent(countryData, (d) => d.Year);

    // Expand area when a single year is selected
    x.domain(yearExtent[0] === yearExtent[1] ? [yearExtent[0] - 1, yearExtent[1] + 1] : yearExtent);

    y.domain([0, d3.max(series, (s) => d3.max(s.values, (d) => d.value))]).nice();

    xAxisGroup.call(d3.axisBottom(x).tickFormat(d3.format("d")));

    yAxisGroup.call(d3.axisLeft(y).tickSize(-width).tickFormat(d3.format("~s")));

    yAxisGroup.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.08)");

    const line = d3
        .line()
        .x((d) => x(d.year))
        .y((d) => y(d.value));

    lineGroup
        .selectAll(".line")
        .data(series, (d) => d.source)
        .join(
            (enter) =>
                enter
                    .append("path")
                    .attr("class", "line")
                    .attr("fill", "none")
                    .attr("stroke", (d) => color(d.source))
                    .attr("stroke-width", 2.5)
                    .attr("d", (d) => line(d.values))
                    .call(animateLineDraw),
            (update) =>
                update
                    .attr("fill", "none")
                    .attr("stroke", (d) => color(d.source))
                    .attr("stroke-width", 2.5)
                    .attr("d", (d) => line(d.values))
                    .call(animateLineDraw),
        );

    const points = series.flatMap((s) =>
        s.values.map((v) => ({
            source: s.source,
            year: v.year,
            value: v.value,
        })),
    );

    // Invisible circles to improve hover hit-area for tooltips/crosshairs
    pointGroup
        .selectAll(".point")
        .data(points, (d) => `${d.source}-${d.year}`)
        .join("circle")
        .attr("class", "point")
        .attr("cx", (d) => x(d.year))
        .attr("cy", (d) => y(d.value))
        .attr("r", 8)
        .attr("fill", (d) => color(d.source))
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("mousemove", function (event, d) {
            d3.select(this).attr("fill-opacity", 0.9).attr("stroke-opacity", 1);
            crosshairGroup.style("display", null).attr("transform", `translate(${x(d.year)},0)`);

            showTooltip(event, `<strong>${d.source}</strong><br>${d.year}<br>${d.value.toFixed(2)} TWh`);
        })
        .on("mouseleave", function () {
            d3.select(this).attr("fill-opacity", 0).attr("stroke-opacity", 0);
            crosshairGroup.style("display", "none");

            hideTooltip();
        });

    legendGroup
        .selectAll(".legend-item")
        .data(energySources)
        .join("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => {
            const spacing = width / energySources.length;
            return `translate(${i * spacing}, 0)`;
        })
        .each(function (source) {
            const item = d3.select(this);

            item.selectAll("path.legend-icon")
                .data([source])
                .join("path")
                .attr("class", "legend-icon")
                .attr("transform", "scale(0.45) translate(0, 2)")
                .attr("stroke-width", 4)
                .attr("fill", "none")
                .attr("stroke", color(source))
                .attr(
                    "d",
                    `M0,16h10.666666666666666
         A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,16
         H32M21.333333333333332,16
         A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,16`,
                );

            item.selectAll("text")
                .data([source])
                .join("text")
                .attr("x", 22)
                .attr("y", 10)
                .attr("fill", "#ddd")
                .attr("font-size", 13)
                .text(source);
        });
}
function drawComparisonChart(data, selectedSource, startYear, endYear) {
    // rebuild from the filters
    const filtered = data
        .filter((d) => d.Year >= startYear && d.Year <= endYear)
        .sort((a, b) => d3.ascending(a.Year, b.Year));

    const countries = Array.from(new Set(filtered.map((d) => d.Entity))).sort();

    const countryColor = d3.scaleOrdinal().domain(countries).range(countryPalette);

    const series = countries.map((country) => ({
        country,
        values: filtered
            .filter((d) => d.Entity === country)
            .map((d) => ({
                year: d.Year,
                value: d[selectedSource] ?? 0,
            }))
            .sort((a, b) => d3.ascending(a.year, b.year)),
    }));

    const allValues = series.flatMap((s) => s.values);

    // Expand area when a single year is selected
    comparisonX.domain(startYear === endYear ? [startYear - 1, endYear + 1] : [startYear, endYear]);

    comparisonY.domain([0, d3.max(allValues, (d) => d.value)]).nice();

    comparisonXAxisGroup.call(d3.axisBottom(comparisonX).tickFormat(d3.format("d")));

    comparisonYAxisGroup.call(d3.axisLeft(comparisonY).tickSize(-comparisonWidth).tickFormat(d3.format("~s")));

    comparisonYAxisGroup.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.08)");

    d3.select("#comparison-chart-subtitle").text(`${selectedSource} production by country (${startYear}–${endYear})`);

    const line = d3
        .line()
        .x((d) => comparisonX(d.year))
        .y((d) => comparisonY(d.value));

    comparisonLineGroup
        .selectAll(".comparison-line")
        .data(series, (d) => d.country)
        .join(
            (enter) =>
                enter
                    .append("path")
                    .attr("class", "comparison-line")
                    .attr("fill", "none")
                    .attr("stroke", (d) => countryColor(d.country))
                    .attr("stroke-width", 2)
                    .attr("stroke-opacity", 0.8)
                    .attr("d", (d) => line(d.values))
                    .call(animateLineDraw),
            (update) =>
                update
                    .attr("fill", "none")
                    .attr("stroke", (d) => countryColor(d.country))
                    .attr("stroke-width", 2)
                    .attr("stroke-opacity", 0.8)
                    .attr("d", (d) => line(d.values))
                    .call(animateLineDraw),
        );

    const points = series.flatMap((s) =>
        s.values.map((v) => ({
            country: s.country,
            year: v.year,
            value: v.value,
        })),
    );

    comparisonLineGroup
        .selectAll(".comparison-point")
        .data(points, (d) => `${d.country}-${d.year}`)
        .join("circle")
        .attr("class", "comparison-point")
        .attr("cx", (d) => comparisonX(d.year))
        .attr("cy", (d) => comparisonY(d.value))
        .attr("r", 8)
        .attr("fill", (d) => countryColor(d.country))
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("mousemove", function (event, d) {
            d3.select(this).attr("fill-opacity", 0.9).attr("stroke-opacity", 1);

            comparisonCrosshairGroup.style("display", null).attr("transform", `translate(${comparisonX(d.year)},0)`);

            showTooltip(event, `<strong>${d.country}</strong><br>${d.year}<br>${d.value.toFixed(2)} TWh`);
        })
        .on("mouseleave", function () {
            d3.select(this).attr("fill-opacity", 0).attr("stroke-opacity", 0);

            comparisonCrosshairGroup.style("display", "none");
            hideTooltip();
        });

    comparisonLegendGroup
        .selectAll(".comparison-legend-item")
        .data(countries)
        .join("g")
        .attr("class", "comparison-legend-item")
        .attr("transform", (d, i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            return `translate(${col * 135}, ${row * 24})`;
        })
        .each(function (country) {
            const item = d3.select(this);

            item.selectAll("path.legend-icon")
                .data([country])
                .join("path")
                .attr("class", "legend-icon")
                .attr("transform", "scale(0.45) translate(0, 2)")
                .attr("stroke-width", 4)
                .attr("fill", "none")
                .attr("stroke", countryColor(country))
                .attr(
                    "d",
                    `M0,16h10.666666666666666
         A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,16
         H32M21.333333333333332,16
         A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,16`,
                );

            item.selectAll("text")
                .data([country])
                .join("text")
                .attr("x", 24)
                .attr("y", 10)
                .attr("fill", "#ddd")
                .attr("font-size", 12)
                .text(country);
        });
}
function drawBarChart(data, selectedCountry, startYear, endYear) {
    // compute one value per source
    const rows = data.filter((d) => d.Entity === selectedCountry && d.Year >= startYear && d.Year <= endYear);

    if (!rows.length) {
        console.warn("No bar chart data found for", selectedCountry, startYear, endYear);
        return;
    }

    d3.select("#bar-chart-subtitle").text(`${selectedCountry}, average annual production for ${startYear}–${endYear}`);

    const barData = energySources.map((source) => ({
        source,
        value: d3.mean(rows, (d) => d[source] ?? 0),
    }));

    barX.domain(energySources);

    barY.domain([0, d3.max(barData, (d) => d.value)]).nice();

    barXAxisGroup.call(d3.axisBottom(barX));

    barXAxisGroup.selectAll("text").attr("text-anchor", "middle").attr("transform", "rotate(0)");

    barYAxisGroup.call(d3.axisLeft(barY));

    barChart
        .selectAll(".bar")
        .data(barData, (d) => d.source)
        .join(
            (enter) =>
                enter
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x", (d) => barX(d.source))
                    .attr("width", barX.bandwidth())
                    .attr("y", barHeight)
                    .attr("height", 0)
                    .attr("fill", (d) => color(d.source))
                    .call((enter) =>
                        enter
                            .transition()
                            .duration(500)
                            .attr("y", (d) => barY(d.value))
                            .attr("height", (d) => barHeight - barY(d.value)),
                    ),
            (update) =>
                update.call((update) =>
                    update
                        .transition()
                        .duration(500)
                        .attr("x", (d) => barX(d.source))
                        .attr("width", barX.bandwidth())
                        .attr("y", (d) => barY(d.value))
                        .attr("height", (d) => barHeight - barY(d.value))
                        .attr("fill", (d) => color(d.source)),
                ),
        )
        .on("mousemove", (event, d) => {
            showTooltip(event, `<strong>${d.source}</strong><br>${d.value.toFixed(2)} TWh avg.`);
        })
        .on("mouseleave", hideTooltip);
}
