TempRhGraph = function(selector) {
    var that = this;
    this.svg = d3.select(selector),
        margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = +this.svg.attr("width") - margin.left - margin.right,
        height = +this.svg.attr("height") - margin.top - margin.bottom,
        that.g = this.svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
};

TempRhGraph.prototype = {
    localeData: {
        dateTime: "%A den %d %B %Y %X",
        date: "%Y-%m-%d",
        time: "%H:%M:%S",
        periods: ["fm", "em"],
        days: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"],
        shortDays: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"],
        months: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"],
        shortMonths: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]
    },

    draw: function(data) {
        d3.timeFormatDefaultLocale(this.localeData);
        var x = d3.scaleTime()
            .rangeRound([0, width]);

        var y1 = d3.scaleLinear()
            .rangeRound([height, 0]);
        var y2 = d3.scaleLinear()
            .rangeRound([height, 0]);

        var line1 = d3.line()
            .x(function(d) {
                return x(new Date(d._id * 1000));
            })
            .y(function(d) {
                return y1(d.value.temp);
            })
        var line2 = d3.line()
            .x(function(d) {
                return x(new Date(d._id * 1000));
            })
            .y(function(d) {
                return y2(d.value.rh);
            })

        x.domain(d3.extent(data, function(d) {
            return d._id * 1000;
        }));
        y1.domain(d3.extent(data, function(d) {
            return d.value.temp;
        }));
        y2.domain(d3.extent(data, function(d) {
            return d.value.rh;
        }));

        this.g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        this.g.append("g")
            .attr("class", "axis axis--y axis-temp")
            .call(d3.axisLeft(y1))
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .text("Temperature (C)");

        this.g.append("g")
            .attr("class", "axis axis--y axis-rh")
            .attr("transform", "translate(" + width + " ,0)")
            .call(d3.axisRight(y2))
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", -12)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .text("RH (%)");

        this.g.append("path")
            .datum(data)
            .attr("class", "line temp")
            .attr("d", line1);
        this.g.append("path")
            .datum(data)
            .attr("class", "line rh")
            .attr("d", line2);
    },

    clear: function() {
        this.g.selectAll("*").remove();
    }
}
