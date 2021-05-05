const axios = require(`axios`),
    appConfig = require(`./config`),
    logger = require(`./logger`),
    telegram = require(`telegram-bot-api`),
    Tail = require(`tail`).Tail;


const api = new telegram({
    token: appConfig.telegram.token,
    updates: {
        enabled: true,
        get_interval: 2000
    }
});

const options = {
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

const tail = new Tail(appConfig.cdrPath, {
    useWatchFile: true
});

//Подключаемся к файлу для получения информация по cdr в csv в realtime
tail.on(`line`, async(data) => {
    try {
        let line = data.split(`\n`); //Разбиваем по переносу строки
        for (let i = 0; i < line.length; i++) {
            let cdr = line[i].split(`,`); //Разбиваем по ,
            //В случае статуса Failed_Cancelled(вызов неотвечен по добавочному), отправляем смс клиенту на входящий номер
            if (cdr[6] === `Failed_Cancelled` && cdr[9] > 1999 && cdr[7].indexOf(`Ext.`) === -1) {
                options.params.phones = cdr[7];
                if (validateNumber(cdr[7])) {
                    const sendResult = await sendSms(cdr[7]);
                    notificationTelegram(cdr[7], sendResult); //Отправляем результат отправки СМС и номер звонящего
                }
                //В случае неответа по очереди, отправляем смс клиенту на входящий номер
            } else if (cdr[9] > 1999 && cdr[7].indexOf(`Ext.`) === -1 && cdr[21] === `` || cdr[21] === `Queue`) {
                options.params.phones = cdr[7];
                if (validateNumber(cdr[7])) {
                    const sendResult = await sendSms(cdr[7]);
                    notificationTelegram(cdr[7], sendResult); //Отправляем результат отправки СМС и номер звонящего
                }
            }
        }
    } catch (e) {
        logger.error(e);
    }
});

//Проверка номера на соответствию Российской нумерации
const validateNumber = (number) => {
    return /\+?[78]?9\d{9}/g.test(number);
}

//Отправка через смс сервис
const sendSms = async(number) => {
    try {
        logger.info(`Отправка смс на номер  ${number}`);
        const response = await axios(appConfig.smsc.url, options);
        logger.info(response);
        return response.data.replace(/(OK|ERROR).*/, `$1`);
    } catch (e) {
        logger.error(e);
    }
}

//Отправка уведомления в Telegram группу
const notificationTelegram = (number, sendResult) => {
    try {
        const resultTelegram = await api.sendMessage({
            chat_id: appConfig.telegram.chatId,
            text: `Пропущенный вызов с номера ${number}. Статус отправки ${sendResult}`
        })
        logger.info(resultTelegram);
    } catch (e) {
        logger.error(e);
    }
}

tail.on(`error`, (e) => {
    logger.error(e);
});