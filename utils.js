const nodemailer = require('nodemailer');

const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASSWORD=process.env.EMAIL_PASSWORD

const HTML_REGISTRATION = (login, phone) => `<!DOCTYPE html>
<html>
<head>
<style>
    body {
        font-family: Arial, sans-serif;
    }
    .header {
        background-color: #f1f1f1;
        padding: 20px;
        text-align: center;
    }
    .container {
        background-color: #ffffff;
        padding: 20px;
        border: 1px solid #ddd;
        margin-top: 20px;
    }
    .button {
        background-color: #4CAF50;
        border: none;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
    }
</style>
</head>
<body>

<div class="header">
    <h1>Добро пожаловать!</h1>
</div>

<div class="container">
    <h2>Добро пожаловать в нашу систему</h2>
    <p>Спасибо что выбрали нашу доску объявлений <a href="https://vezdesens.ru/">vezdesens.ru</a></p>
    <p>Ваш логин авторизации: ${login}</p>
    <p>Ваш номер телефона для связи: ${phone}</p>
</div>

</body>
</html>`

const transporter = nodemailer.createTransport({
	host: 'smtp.beget.com',
	port: 465,
	secure: true,
	auth: {
		user: EMAIL_USER,
		pass: EMAIL_PASSWORD
	}
});

const key = process.env.FRONT_KEY
function decryptStringWithKey(encryptedString, key) {
	let decryptedString = "";
	for (let i = 0; i < encryptedString.length; i++) {
		const charCode = encryptedString.charCodeAt(i);
		const keyChar = key.charCodeAt(i % key.length);
		const decryptedCharCode = charCode - keyChar;
		decryptedString += String.fromCharCode(decryptedCharCode);
	}
	return decryptedString;
}

function decryptArrayWithKey(encryptedString) {
	const decryptedString = decryptStringWithKey(encryptedString, key);
	const decryptedArray = JSON.parse(decryptedString);
	return decryptedArray;
}

module.exports = {
	decryptArrayWithKey,
	transporter, HTML_REGISTRATION
}
