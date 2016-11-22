//{'date': 1479755143, 'rh': 90.8, 'location': 'Trossbotten', 'temp': 8.01}
// bs = require('binarysearch');

const MAX_RESULTS = 100;

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const YEAR = DAY * 365;
const AVERAGE_MONTH = YEAR / 12;

const INTERVALS = [MINUTE, HOUR, DAY, WEEK, AVERAGE_MONTH, YEAR];


Queries = function(db) {
    this.db = db;
};

Queries.prototype = {
    db: null,

    doQuery: function(from, to, location) {
        const intervalLength = this._getIntervalLength(from, to);
        const intervals = this._getIntervals(from, to, intervalLength);
        const scope = {
            intervals: intervals,
            intervalLength: intervalLength
        };
        var collection = this.db.collection('measurements');
        collection.mapReduce(
            this._map,
            this._reduce, {
                query: {
                    'date': {
                        $gte: from,
                        $lt: to
                    },
                    location: location
                },
                // sort: {'count': -1},
                // limit: 1000,
                verbose: true,
                out: {
                    inline: 1
                },
                scope: scope
            },
            function(err, results) {
                console.log("----------- 0")
                console.dir(err)
                console.dir(results)
                    // logger.log(results);
            }
        );
    },

    /*
        _test: function(from, to, location) {
            // queryHandler._test(1479758700,1479845100,'Kallare');
            var collection = this.db.collection('measurements');
            var options = {};
            collection.find({ 'date' : { $gte: from, $lt: to }, location: location }, options).toArray( function(err, docs) {
                console.log("Found the following records");
                console.log(docs)
            });
        },
    */
    _map: function() {
        // var partOfInterval = bs.closest(intervals,this.date);
        // FIXME: Should use binary search, cannot get lib to work
        for (var i = 0; i < intervals.length; i++) {
            if (Math.abs(this.date - intervals[i]) <= (intervalLength / 2)) {
                emit(intervals[i], {
                    temp: this.temp,
                    rh: this.rh
                });
                break;
            }
        }
    },

    _reduce: function(key, values) {
        var total = 0;
        var noOfValues = values.length;
        for (var i = 0; i < values.length; i++) {
            if( values[i].temp ) {
                total += values[i].rh;
            }
            else {
                noOfValues--;
            }
        }
        return total / noOfValues;
    },

    _getIntervals: function(start, end, interval) {
        var intervals = [];
        start += Math.floor(interval / 2);
        while (start <= end) {
            intervals.push(start);
            start += interval;
        }
        return intervals;
    },

    _getIntervalLength: function(start, end) {
        var maxIntervalLength = (end - start) / MAX_RESULTS;
        for (var i = 0; i < INTERVALS.length; i++) {
            if (INTERVALS[i] > maxIntervalLength) {
                return INTERVALS[i];
            }
        }
        return INTERVALS[INTERVALS.length - 1];
    }
}
module.exports = Queries;
