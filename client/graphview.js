GraphView = function(elementId, location, socket) {
    this.element = $('#' + elementId);
    this.location = location;
    this.socket = socket;
    this.init();
};

GraphView.prototype = {
    element: null,
    location: null,
    graph: null,
    socket: null,

    init: function() {
        this.element.html(this.html(this.location.name, this.element.attr('id'), this.getBrowserWidth() - 50));
        this.graph = new TempRhGraph(this.element.selector + ' .graph');
        let latest = new Latest(this.element.attr('id') + ' .latestcontainer', this.location.id, socket);
        this.addButton(WEEK, 'Week').trigger('click');
        this.addButton(AVERAGE_MONTH, 'Month');
        this.addButton(YEAR, 'Year');
    },

    addButton: function(range, name) {
        let elem = $('<span class="button">' + name + '</span>').appendTo('#rangeselect_' + this.element.attr('id'));
        var that = this;
        elem.on('click', function() {
            $(that.element.selector + ' .button').removeClass('selected');
            elem.addClass('selected');
            that.selectRange.call(that, range);
        });
        return elem;
    },

    selectRange: function(range) {
        var end = Math.ceil((new Date().getTime()) / 1000);
        this.loadData(end - range, end);
    },

    loadData: function(start, end) {
        this.graph.clear();
        var that = this;
        this.element.addClass('loading');
        socket.emit('getData', start, end, this.location.id, function(data) {
            that.graph.clear();
            that.setGraphData(data.data[0]);
            that.element.removeClass('loading');
        });
    },

    setGraphData: function(data) {
        this.graph.draw(data);
    },

    html: (name, id, width) => {
        return `<h2>${name}</h2>
                <div id="rangeselect_${id}" class="rangeselect"></div>
                <div class="latestcontainer"></div>
                <svg class="graph" width="${width}" height="500"></svg>`
    },

    getBrowserWidth: function() {
        if (self.innerWidth) {
            return self.innerWidth;
        }

        if (document.documentElement && document.documentElement.clientWidth) {
            return document.documentElement.clientWidth;
        }

        if (document.body) {
            return document.body.clientWidth;
        }
    }
};
