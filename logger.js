"use strict";
const log4js = require(`log4js`);

log4js.configure({
    appenders: {
        log3cx: {
            type: `file`,
            filename: `logs/debug.log`,
            maxLogSize: 10485760,
            backups: 3,
            compress: true
        }
    },
    categories: {
        default: {
            appenders: [`log3cx`],
            level: `debug`
        }
    }
});
const logger = log4js.getLogger(`voip`);
module.exports = logger;