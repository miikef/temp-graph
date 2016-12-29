const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const YEAR = DAY * 365;
const AVERAGE_MONTH = YEAR / 12;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MINUTE,
        HOUR,
        DAY,
        WEEK,
        YEAR,
        AVERAGE_MONTH
    };
}
