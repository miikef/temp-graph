Latest = function(elementId, locationId, socket) {
    this.element = $('#' + elementId);
    this.locationId = locationId;
    this.socket = socket;
    this.init();
};

Latest.prototype = {
    element: null,
    location: null,
    socket: null,

    init: function() {
        this.element.html(this.html());
        this.loadData();
    },


    loadData: function() {
        var that = this;
        socket.emit('getLatest', this.locationId, function(data) {
            if (((new Date() - data.date * 1000) / 1000) > HOUR) {
                that.element.find('.datetime').addClass('olddata');
            }
            that.element.find('.datetime').html(that.timeSince(data.date * 1000) + ' ago');
            that.element.find('.rh').html(that.toDecimals(data.rh, 1) + '%');
            that.element.find('.temp').html(that.toDecimals(data.temp, 2) + '&deg;C');
        });
    },

    html: () => {
        return `<div class="latest">
                    <div class="datetime"></div>
                    <div class="rh"></div>
                    <div class="temp"></div>
                </div>`
    },

    toDecimals: function(num, decimals) {
        return parseFloat(Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals);
    },

    // Copied from https://stackoverflow.com/questions/3177836
    timeSince: function(date) {

        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + " years";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    }
};
