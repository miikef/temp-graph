var when = require('when');
var constants = require('./client/constants');

const MAX_RESULTS = 400;
const INTERVALS = [constants.MINUTE, constants.HOUR, constants.DAY, constants.WEEK, constants.AVERAGE_MONTH, constants.YEAR];


Queries = function(db) {
    this.db = db;
    this.collection = this.db.collection('measurements');
    var that = this;

    // Find the minimum date in the db to clamp queries to
    // Doesn't matter in practice if this is finished before other queries are run
    this.collection.find({
        query: {},
        sort: {
            'date': -1
        },
    }).limit(1).toArray(
        function(err, results) {
            if (err || !results.length) {
                console.log("Queries: Could not find minimum date");
            }
            that.minDate = results[0].date;
        });
};

Queries.prototype = {
    db: null,
    minDate: 0,
    collection: '',


    doQuery: function(from, to, location) {
        from = (from < this.minDate) ? this.minDate : from;
        //const intervalLength = this._getIntervalLength(from, to);
        const intervalLength = (to - from) / MAX_RESULTS

        const intervals = this._getIntervals(from, to, intervalLength);
        const scope = {
            intervals: intervals,
            intervalLength: intervalLength
        };
        var that = this;
        var promise = when.promise(
            function(resolve, reject, notify) {
                that.collection.mapReduce(
                    that._map,
                    that._reduce, {
                        query: {
                            'date': {
                                $gte: from,
                                $lt: to
                            },
                            location: location
                        },
                        //sort: {'date': -1},
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

    latest: function(location) {
        var that = this;
        var promise = when.promise(
            function(resolve, reject, notify) {
                var locationArg = {};
                if (location) {
                    locationArg = {
                        location: location
                    };
                }
                that.collection.find(locationArg).sort({
                    'date': -1
                }).limit(1).toArray(
                    function(err, results) {
                        if (err) {
                            reject(err);
                        }
                        resolve(results[0]);
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
        var min = intervals[0];
        var interval = Math.round((this.date - min) / intervalLength);
        // Map needs to return all the same values as reduce
        emit(intervals[interval], {
            temp: this.temp,
            rh: this.rh,
            maxRH: this.rh,
            maxTemp: this.temp,
            minRH: this.rh,
            maxTemp: this.temp
        });
    },

    _reduce: function(key, values) {
        var totalTemp = totalRH = 0;
        // Number.MAX_SAFE_INTEGER does not work in mongodb
        var maxRH = maxTemp = -10000;
        var minRH = minTemp = 10000;
        var noOfTempValues = noOfRHValues = values.length;
        for (var i = 0, len = values.length; i < len; i++) {
            var obj = values[i];
            if (obj.temp) {
                if (obj.temp > maxTemp) {
                    maxTemp = obj.temp;
                }
                if (obj.temp < minTemp) {
                    minTemp = obj.temp;
                }
                totalTemp += obj.temp;
            } else {
                noOfTempValues--;
            }
            if (obj.rh) {
                if (obj.rh > maxRH) {
                    maxRH = obj.rh;
                }
                if (obj.rh < minRH) {
                    minRH = obj.rh;
                }
                totalRH += obj.rh;
            } else {
                noOfRHValues--;
            }
        }
        return {
            temp: Math.round((10 * totalTemp) / noOfTempValues) / 10,
            rh: Math.round((10 * totalRH) / noOfRHValues) / 10,
            minRH: Math.round(minRH * 10) / 10,
            maxRH: Math.round(maxRH * 10) / 10,
            minTemp: Math.round(minTemp * 100) / 100,
            maxTemp: Math.round(maxTemp * 100) / 100
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

    //Not used
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
