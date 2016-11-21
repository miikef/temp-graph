//{'date': 1479755143, 'rh': 90.8, 'location': 'Trossbotten', 'temp': 8.01}
        var MAX_RESULTS = 100;

        var MINUTE = 60;
        var HOUR = 60 * MINUTE;
        var DAY = 24 * HOUR;
        var WEEK = 7 * DAY;
        var YEAR = DAY * 365;
        var AVERAGE_MONTH = YEAR / 12;
        var YEAR = DAY * 365;

        var INTERVALS = [MINUTE, HOUR, DAY, WEEK, AVERAGE_MONTH, YEAR];


        Queries = function(db) {
            this.db = db;
        };

        Queries.prototype = {
            db: null,

            doQuery: function(from, to, location) {
                var interval = this._getIntervals(start, end);
                console.log( interval );

                /*
                collection.mapReduce(
                    _map,
                    reduce, {
                        query: {},
                        // sort: {'count': -1},
                        // limit: 10,
                        // jsMode: true,
                        // verbose: false,
                        out: {
                            inline: 1
                        },
                        scope: {

                        }
                    },
                    function(err, results) {
                        console.log("----------- 0")
                        console.dir(err)
                        console.dir(results)
                            // logger.log(results);
                    }
                );
                */
            },

            // String functions
            _map: function() {
                emit(this.temp, this.price);
            },

            _reduce: function(key, values) {
                return Array.sum(values);
            },

            _getIntervals: function(start, end) {
                var maxIntervalLength = (end - start / MAX_RESULTS);
                for (var i = 1; i < INTERVALS.length; i++) {
                    if (INTERVALS[i] > maxIntervalLength) {
                        return INTERVALS[i - 1];
                    }
                }
                return INTERVALS[INTERVALS.length-1];
            }
        }
module.exports = Queries;
