module.exports = {
	cdrPath: `/var/lib/3cxpbx/Instance1/Data/Logs/CDRLogs/cdr.log`,
	smsc: {
		url: `https://smsc.ru/sys/send.php`,
		login: `login`,
		password:  `password`,
		message: `К сожалению, все менеджеры заняты, мы обязательно свяжемся с Вами в ближайшее время.`,
	},
	telegram: {
		token: `telegramToken`,
		chatId: `telegramChatId`,
	}
}