const mineflayer = require('mineflayer');
const cron = require('node-cron');
const { sendWebhook, sendRawWebhook } = require('./webhook');
const fs = require('fs');

// Constants
const args = process.argv.slice(2);

if (args.length != 3) {
    console.log("Usage: node index.js <username> <region> [chat_monitoring]");
    console.log("Example: node index.js YourAccount123 eu true");
    process.exit(1);
}

const username = args[0];
const region = args[1];
const server = region == "eu" ? "eu.stray.gg" : "stray.gg";
const server_port = 25565;
const chat_monitoring = args[2].toLowerCase() == "true" ? true : false;

var logged_in = false;
var mode = "afk";

// Config
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const plot = config.plot;
const wh_deposit = config.webhook_deposit;
const wh_chat = config.webhook_chat;
const wh_afk = config.webhook_afk;
const wh_daily = config.webhook_daily;
const wh_login = config.webhook_login;
const wh_alerts = config.webhook_alerts;

// Bot Config
const bots = [
    mineflayer.createBot({
        host: server,
        port: server_port,
        username: username,
        auth: 'microsoft'
    })
];

bots.forEach(bot => {

    bot.once('spawn', () => {
        console.log("Logged in as " + bot.username + "!")
    });

    bot.on('spawn', () => {

        if (logged_in) {
            sendWebhook(wh_login, bot.username + " joined TridentBox.");
        } else {
            logged_in = true;
            bot.chat("/server tridentbox");
            setTimeout(() => {
                if (mode != "deposit") bot.chat("/afk");
            }, 1000);
        }

    });

    bot.on('kicked', (reason) => {
        console.log(reason);
        process.exit(1);
    });

    bot.on('error', (err) => {
        console.log(err);
    });

    bot.on('messagestr', (message, messagePosition, jsonMsg, sender, verified) => {

        // Whole bunch of horrible message parsing - I'm sorry
        // This is meant to work once, I don't particularly care about long term compatibility

        if (message == "Claimed 1x AFK Key.") {
            sendWebhook(wh_afk, bot.username + " claimed an afk key.");

        } else if (chat_monitoring && ("" + message).includes("Your daily rewards have been sent to your claim!")){
            sendWebhook(wh_daily, bot.username + " claimed their daily rewards.");

        } else if (chat_monitoring && message == "[KOTH] KOTH will start in 5 minutes!") {
        	sendRawWebhook(wh_alerts, "@everyone KOTH IN 5 MINUTES");

        } else if (chat_monitoring && message == "The arena has reset!") {
            sendWebhook(wh_alerts, "The arena has reset.");

        } else if (message == "You have been teleported to AFK Lounge.") {
            mode = "afk";

        } else if (chat_monitoring) {
            sendWebhook(wh_chat, message);
        }

    });

});

function dropNext() {
    bots.forEach(bot => {
        var items = bot.inventory.items();
        for (let i = 0; i < bot.inventory.items().length; i++) {
            if (i < items.length) {
                var item = items[i];
                if (item && item.name != "air") {
                    setTimeout(() => {
                        bot.tossStack(item);
                        //console.log("Dropped " + item.name);
                        dropNext();
                    }, 100);
                } else {
                    i++;
                    setTimeout(dropNext, 200);
                }
            }
        }
    });
}

// Cron Config
cron.schedule('0 1 * * *', () => {
    bots.forEach(bot => {
        bot.chat("/daily");
    });
});
cron.schedule('*/30 * * * *', () => {
	bots.forEach(bot => {
		bot.chat("/claim");
	})
})
cron.schedule('15 6 * * *', () => {
    mode = "deposit";
    bots.forEach(bot => {
        setTimeout(() => {
            bot.chat("/p " + plot);
            setTimeout(() => {
                console.log(bot.inventory.items());
                dropNext();
                sendWebhook(wh_deposit, bot.username + " deposited their items.");
            }, 1000);
        }, 1000);
    });
});