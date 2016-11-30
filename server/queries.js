//{'date': 1479755143, 'rh': 90.8, 'location': 'Trossbotten', 'temp': 8.01}
// bs = require('binarysearch');
var when = require('when');

const MAX_RESULTS = 200;

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

    doQuery: function(from, to, location, callBack) {
        const intervalLength = this._getIntervalLength(from, to);
        const intervals = this._getIntervals(from, to, intervalLength);
        const scope = {
            intervals: intervals,
            intervalLength: intervalLength,
        };
        var collection = this.db.collection('measurements');
        var that = this;
        var promise = when.promise(
            function(resolve, reject, notify) {
                collection.mapReduce(
                    that._map,
                    that._reduce, {
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
                        if (err) {
                            reject(err);
                        }
                        resolve(results);
                    }
                );

            });
        return promise;
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
        var totalTemp = totalRH = 0;
        var noOfTempValues = noOfRHValues = values.length;
        for (var i = 0; i < values.length; i++) {
            if (values[i].temp) {
                totalTemp += values[i].temp;
            } else {
                noOfTempValues--;
            }
            if (values[i].rh) {
                totalRH += values[i].rh;
            } else {
                noOfRHValues--;
            }

        }
        return {
            temp: Math.round((10 * totalTemp) / noOfTempValues) / 10,
            rh: Math.round(totalRH / noOfRHValues)
        };
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
    },
}
module.exports = Queries;
