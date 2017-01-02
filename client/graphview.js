GraphView = function(elementId, name) {
    this.element = document.getElementById(elementId);
    this.name = name;
    this.init();
};

GraphView.prototype = {
    element: null,
    name: null,
    graph: null,

    init: function() {
        if (!this.element) {
            console.log("GraphView: no element")
        }
        this.element.innerHTML = this.html(this.name, this.element.id);
        this.graph = new TempRhGraph('#' + this.element.id + ' .graph');
    },

    setGraphData(data) {
        this.graph.draw(data);
    },

    html: (name, id) => {
        return `<h2>${name}</h2>
                <div id="rangeselect_${id}" class="rangeselect">
                    <span id="week" class="button">Week</span>
                    <span id="month" class="button">Month</span>
                    <span id="year" class="button">Year</span>
                </div>
                <svg class="graph" width="960" height="500"></svg>`
    }
};
