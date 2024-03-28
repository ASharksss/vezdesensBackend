const nodemailer = require('nodemailer');
const axios = require('axios');
const sharp = require("sharp");

const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD

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
const HTML_REBASE_PASSWORD = (code, name) => `<!DOCTYPE html>
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
    <h1>Смена пароля!</h1>
</div>

<div class="container">
    <h2>Здравствуйте, ${name}</h2>
    <p>Используйте этот код для подтверждения своей личности:</p>
    <h1><code>${code}</code></h1>
    <span>Если не Вы запросили запрос на сброс пароля, проигнорируйте это письмо</span>
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

function groupByCharacteristic(data) {// группировка для фильтра
    const result = [];                // удаляет дубликаты и приводит в нормальный читаемый вид
    data.forEach((item, index) => {
        if (Math.floor(data.length / 2) < index + 1)
            return
        console.log(Math.floor(data.length / 2) <= (index + 1))
        const existItem = result.find(i => i.id === item['characteristic.id']);
        if (!existItem) {
            result.push({
                id: item['characteristic.id'],
                name: item['characteristic.name'],
                typeCharacteristic: item['characteristic.typeCharacteristic.name'],
                characteristicValues: [
                    item['characteristic.typeCharacteristic.name'] === 'enter' ? null : {
                        id: item['characteristic.characteristicValues.id'],
                        name: item['characteristic.characteristicValues.name']
                    }]
            });
        } else {
            existItem['characteristicValues'].push({
                id: item['characteristic.characteristicValues.id'],
                name: item['characteristic.characteristicValues.name']
            });
        }
    });
    return result;
}

const resizeImage = async (image, fileName, cardType = 'st') => {
    try {
        switch (cardType) {
            case "st":
                await sharp(image)
                    .resize({
                        width: 248,
                        height: 333,
                        fit: sharp.fit.cover
                    })
                    .toFile(`static/${fileName}`, (err, info) => {
                        if (err) console.log(err)
                    })
                await sharp(image)
                    .resize({
                        width: 156,
                        height: 210,
                        fit: sharp.fit.cover
                    })
                    .toFile(`static/mob/${fileName}`, (err, info) => {
                        if (err) console.log(err)
                    })
                break;
            case "stPl":
                await sharp(image)
                    .resize({
                        width: 315,
                        height: 417,
                        fit: sharp.fit.cover
                    })
                    .toFile(`static/${fileName}`, (err, info) => {
                        if (err) console.log(err)
                    })
                await sharp(image)
                    .resize({
                        width: 156,
                        height: 210,
                        fit: sharp.fit.cover
                    })
                    .toFile(`static/mob/${fileName}`, (err, info) => {
                        if (err) console.log(err)
                    })
                break;
            case "vp":
                await sharp(image)
                    .resize({
                        width: 690,
                        height: 417,
                        fit: sharp.fit.cover
                    })
                    .toFile(`static/${fileName}`, (err, info) => {
                        if (err) console.log(err)
                    })
                await sharp(image)
                    .resize({
                        width: 325,
                        height: 189,
                        fit: sharp.fit.cover
                    })
                    .toFile(`static/mob/${fileName}`, (err, info) => {
                        if (err) console.log(err)
                    })
                break;
            case "premium":
                await sharp(image)
                    .resize(1400, 417)
                    .toFile(`static/${fileName}`, (err, info) => {
                        if (err) console.log(err)
                    })
                await sharp(image)
                    .resize(325, 189)
                    .toFile(`static/mob/${fileName}`, (err, info) => {
                        if (err) console.log(err)
                    })
                break;
            case "card":
                await sharp(image)
                    .toFile(`static/${fileName}`, (err, info) => {
                        if (err) console.log(err)
                    })
                break;

            default:
                break;
        }
    } catch (e) {
        console.log(e)
    }
}

function generateRandomNumbers() {
    let numbers = [];
    for (let i = 0; i < 6; i++) {
        // Генерируем случайное число от 0 до 9 (включительно)
        let randomNumber = Math.floor(Math.random() * 10);
        numbers.push(randomNumber);
    }
    return numbers;
}

function trimEndings(str) {
    // Создаем регулярное выражение для поиска окончаний слов
    const regExpWord = /[а-яё]+(?=[^\s]*\s|$)/gi;

    // Находим все слова в строке и обрезаем их окончания
    const trimWords = str.match(regExpWord).map(item => {
        // Обрезаем окончание слова
        return item.replace(/(ость|ость|ия|ия|ие|ие|ий|ий|ый|ый|ая|ая|ое|ое|ые|ые|ые|ые|ого|ого|его|его|ому|ому|ему|ему|им|им|ым|ым|ом|ом|ем|ем|их|их|ых|ых|ую|ую|юю|юю|ая|ая|яя|яя|ею|ею|ию|ию)$/i, '');
    });

    return trimWords.join(' ');
}


const receipt = (name, sum) => ({
    "items": [{"name": `Услуга разового размещения, Объявление ${name}`, "quantity": 1, "sum": sum, "tax": "none"}]
})
const postData = async (login, sum, invId, receipt, signatureValue, email, test) => {
    const url = 'https://auth.robokassa.ru/Merchant/Indexjson.aspx?';
    const data = {
        MerchantLogin: login,
        OutSum: sum,
        EMail: email,
        invoiceID: invId,
        Receipt: receipt,
        SignatureValue: signatureValue,
        istest: parseInt(test)
    };
    try {
        const response = await axios.post(url, new URLSearchParams(data).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        if (!response.status === 200) {
            console.warn(response.data);
            throw new Error('Network response was not ok');
        }
        return response.data;
    } catch (error) {
        console.warn(error);
        throw error;
    }
}


module.exports = {
    decryptArrayWithKey,
    groupByCharacteristic,
    transporter, HTML_REGISTRATION,
    resizeImage, generateRandomNumbers,
    HTML_REBASE_PASSWORD, receipt, postData
}
