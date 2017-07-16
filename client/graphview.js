GraphView = function(elementId, location) {
    this.element = $('#' + elementId);
    this.location = location;
    this.init();
};

GraphView.prototype = {
    element: null,
    location: null,
    graph: null,
    range: null,
    width: 800,
    stats: null,

    init: function() {
        this.width = this.getWidth();
        this.element.html(this.html(this.location.name, this.element.attr('id'), this.width));
        this.graph = new TempRhGraph(this.element.selector + ' .graph');
        let latest = new Latest(this.element.attr('id') + ' .latestcontainer', this.location.id, socket);
        this.stats = new Stats(this.element.attr('id') + ' .statscontainer');
        this.addButton(WEEK, 'Week').trigger('click');
        this.addButton(AVERAGE_MONTH, 'Month');
        this.addButton(YEAR, 'Year');
        var that = this;
        socket.on('newData', function(newTimeStamp) {
            that.loadRange.call(that);
        });
        $(window).resize(function() {
            let w = that.getWidth();
            if (w !== that.width) {
                // FIXME: Doesn't work
                that.width = w;
                that.element.children('svg').width(w);
                that.graph.redraw();
            }
        })
    },

    addButton: function(range, name) {
        let elem = $('<span class="button">' + name + '</span>').appendTo('#rangeselect_' + this.element.attr('id'));
        var that = this;
        elem.on('click', function() {
            $(that.element.selector + ' .button').removeClass('selected');
            elem.addClass('selected');
            that.loadRange.call(that, range);
        });
        return elem;
    },

    loadRange: function(range) {
        var end = Math.ceil((new Date().getTime()) / 1000);
        if (!range) {
            range = this.range;
        }
        if (!range) {
            return;
        }
        this.range = range;
        this.loadData(end - range, end);
    },

    loadData: function(start, end) {
        this.graph.clear();
        this.stats.clear();
        var that = this;
        this.element.addClass('loading');
        socket.emit('getData', start, end, this.location.id, function(data) {
            that.graph.clear();
            that.setGraphData(data.data[0]);
            that.stats.setData(data);
            that.element.removeClass('loading');
        });
    },

    setGraphData: function(data) {
        this.graph.draw(data);
    },

    html: (name, id, width) => {
        return `<h2>${name}</h2>
                <div id="rangeselect_${id}" class="rangeselect"></div>
                <div class="infoboxes">
                <div class="latestcontainer"></div>
                <div class="statscontainer"></div>
                </div>
                <svg class="graph" width="${width}" height="500"></svg>`
    },

    getWidth: function() {
        var w = 0;
        if (self.innerWidth) {
            w = self.innerWidth;
        } else if (document.documentElement && document.documentElement.clientWidth) {
            w = document.documentElement.clientWidth;
        } else if (document.body) {
            w = document.body.clientWidth;
        }
        return Math.max(w - 50, 800);
    }
};
