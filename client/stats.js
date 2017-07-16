Stats = function(elementId) {
    this.element = $('#' + elementId);
    this.init();
};

Stats.prototype = {
    element: null,

    init: function() {
        this.element.html(this.html());
    },



    setData: function(data) {
        this.element.find('.daterange').html('<th colspan=3>' + this.getDate(data.start) + ' - ' + this.getDate(data.end) + '</th>');
        this.element.find('.average').html('<td>Avg: </td><td>' + data.avgRH + '%</td><td>' + data.avgTemp + '&deg;C</td>');
        this.element.find('.max').html('<td>Max: </td>' + data.maxRH + '%</td><td>' + data.maxTemp + '&deg;C</td>');
        this.element.find('.min').html('<td>Min: </td>' + data.minRH + '%</td><td>' + data.minTemp + '&deg;C</td>');
    },

    clear: function() {
        this.element.find('.daterange').html('<th>&nbsp;</th>');
        this.element.find('.average').html('<td>&nbsp;</td>');
        this.element.find('.max').html('<td>&nbsp;</td>');
        this.element.find('.min').html('<td>&nbsp;</td>');
    },

    html: () => {
        return `<table class="infobox stats">
                    <tr class="daterange"></tr>
                    <tr class="average"></tr>
                    <tr class="max"></tr>
                    <tr class="min"></tr>
                </div>`
    },

    getDate: function(timestamp) {
        var date = new Date(timestamp * 1000);
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    }
};
