const axios = require('axios');

function template(msg) {
    return {
        "content": null,
        "embeds": [
            {
                "title": "Alert",
                "description": msg,
                "color": 18431,
                "author": {
                    "name": "Riptide Alerts",
                    "icon_url": "https://minecraft.wiki/images/thumb/Trident_%28item%29.png/120px-Trident_%28item%29.png?1c475"
                }
            }
        ],
        "attachments": []
    }
}

function rawTemplate(msg) {
    return {
        "content": msg,
        "embeds": [],
        "attachments": []
    }
}

function sendWebhook(url, msg) {

    axios.post(url, template(msg))
        .then(function (response) {
            console.log(msg);
        })
        .catch(function (error) {
            console.log(error);
        });

}

function sendRawWebhook(url, msg) {

    axios.post(url, rawTemplate(msg))
        .then(function (response) {
            console.log(msg);
        })
        .catch(function (error) {
            console.log(error);
        });

}

module.exports = { sendWebhook, sendRawWebhook };