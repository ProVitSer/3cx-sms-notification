let log4js = require(`log4js`);

log4js.configure(
  {
    appenders: {
      smsLogs: {
        type: `file`,
        filename: `./logs/sms.log`,
        maxLogSize: 10 * 1024 * 1024, 
        backups: 3
      },
	 error: {
        type: `file`,
        filename: `./logs/error.log`,
        maxLogSize: 10 * 1024 * 1024, 
        backups: 3
      } 
    },
    categories: {
      default : { appenders: [`smsLogs`], level: `info` },
	  error : { appenders: [`error`], level: `error` }
    }
  }
);


module.exports = { 
	access: log4js.getLogger(`default`),
	error: log4js.getLogger(`error`)
};
