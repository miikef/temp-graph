Latest = function(elementId, locationId) {
    this.element = $('#' + elementId);
    this.locationId = locationId;
    this.socket = socket;
    this.init();
};

Latest.prototype = {
    element: null,
    location: null,
    dataTimer: undefined,
    timeTimer: undefined,

    init: function() {
        this.element.html(this.html());
        this.loadData();
        this.timeTimer = setInterval(this.setTime.bind(this), 1000);
    },


    loadData: function() {
        var that = this;
        this.dataTime = undefined;
        socket.emit('getLatest', this.locationId, function(data) {
            that.dataTime = data.date;
            that.setTime.call(that);
            if (data.rh) {
                that.element.find('.rh').html(that.toDecimals(data.rh, 1) + '%');
                that.element.find('.rh').css('color', that.getColor(data.rh));
            }
            if (data.temp) {
                that.element.find('.temp').html(that.toDecimals(data.temp, 2) + '&deg;C');
            }
            // TODO: Use signal instead to refresh?
            var now = new Date();
            var nextLoad = 10000 * MINUTE + 5000 - (now - (that.dataTime * 1000));
            if (nextLoad < 1000 * MINUTE) {
                nextLoad = 1000 * MINUTE
            }
            clearTimeout(that.dataTimer);
            that.dataTimer = setTimeout(that.loadData.bind(that), nextLoad);
        });
    },

    setTime: function() {
        if (!this.dataTime) {
            this.element.find('.datetime').hide();
            return;
        }
        this.element.find('.datetime').show();
        if (((new Date() - this.dataTime * 1000) / 1000) > HOUR) {
            this.element.find('.datetime').addClass('olddata');
        } else {
            this.element.find('.datetime').removeClass('olddata');
        }
        this.element.find('.datetime').html(this.timeSince(this.dataTime * 1000) + ' ago');
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
        interval = Math.floor(seconds / YEAR);
        if (interval > 1) {
            return interval + " months";
        }
        interval = Math.floor(seconds / DAY);
        if (interval > 1) {
            return interval + " days";
        }
        interval = Math.floor(seconds / HOUR);
        if (interval > 1) {
            return interval + " hours";
        }
        interval = Math.floor(seconds / MINUTE);
        if (interval > 1) {
            return interval + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    },

    getColor: function(percent) {
        percent = (percent / 100 - 0.5)
        if (percent < 0) {
            percent = 0;
        }
        percent = percent / 0.5
        var hue = ((1 - percent) * 120).toString(10);
        return ["hsl(", hue, ",100%,50%)"].join("");
    }
};
