# 3cx-sms-notification
Отправка смс сообщения абонентам, которые звонили в компанию, и не дождались ответа. Отправка информации о номере звонившего в общий чат компании в telegram со статусом доставки. Для 3CX Phone System 16


Пример настройки 
```js script
module.exports = {
    cdrPath: `/var/lib/3cxpbx/Instance1/Data/Logs/CDRLogs/cdr.log`,//Путь по которому доступны cdr данные 3СХ
    //Пример для сервиса smsc
	smsc: {
		url: `https://smsc.ru/sys/send.php`,//URL сервиса для отправки смс сообщений
		login: `admin`,//Логин учетной записи из под которой можно отправлять смс
		password:  `P@ssw0rd`,//Пароль учетной записи из под которой можно отправлять смс
		message: `К сожалению, все менеджеры заняты, мы обязательно свяжемся с Вами в ближайшее время.`,//Сообщение которое будет отправляться клиент
	},
	telegram: {
		token: `HEJWQHEKJJKHWKLJWQ`,//Токен полученный у botfather Use this token to access the HTTP API
		chatId: `-8123712831`,//ID чата telegram куда будет отправлятся вся информация
	}
}
```