const axios = require(`axios`),
    appConfig = require(`./config`),
	logger = require(`./logger`),
	telegram = require(`telegram-bot-api`),
    Tail = require(`tail`).Tail;
	

let api = new telegram({
    token: appConfig.telegram.token,
    updates: {
        enabled: true,
		get_interval: 2000
    }
});	
	
let options = {
    path: `?`,
    method: `GET`,
    params: {
        login: appConfig.smsc.login,
        psw: appConfig.smsc.password,
		sender: `Icepartners`,
        phones: ``,
        mes: appConfig.smsc.message,
        charset: `utf-8`
    }
}

tail = new Tail(appConfig.cdrPath, {
    useWatchFile: true
});


tail.on(`line`, async (data) => {
    let line = data.split(`\n`);
    for (let i = 0; i < line.length; i++) {
        let cdr = line[i].split(`,`);
        if (cdr[6] === `Failed_Cancelled` && cdr[9] > 1999 && cdr[7].indexOf(`Ext.`) === -1) {
            options.params.phones = cdr[7];
            if (validateNumber(cdr[7])) {
                const sendResult = await sendSms(cdr[7]);
				notificationTelegram(cdr[7],sendResult);
            };
        } else if (cdr[9] > 1999 && cdr[7].indexOf(`Ext.`) === -1 && cdr[21] === `` || cdr[21] === `Queue`) {
            options.params.phones = cdr[7];
            if (validateNumber(cdr[7])) {
                const sendResult = await sendSms(cdr[7]);
				notificationTelegram(cdr[7],sendResult);
            };
        }
    }
});

const validateNumber = (number) => {
	return /\+?[78]?9\d{9}/g.test(number);
}

const sendSms = async (number) => {
    try {
        logger.access.info(`Отправка смс на номер  ${number}`);
        const response = await axios(appConfig.smsc.url, options);
		logger.access.error(response);
        return response.data.replace(/(OK|ERROR).*/, `$1`);
    } catch (error) {
        logger.error.error(error);
    }
}

const notificationTelegram = (number,sendResult) => {
    api.sendMessage({
            chat_id: appConfig.telegram.chatId,
            text: `Пропущенный вызов с номера ${number}. Статус отправки ${sendResult}`
        })
        .then((data) => {
			logger.access.info(data);
		})
        .catch((err) => {
			logger.error.error(error);
		});
}

tail.on(`error`, (error) => {
	logger.error.error(error);
});
