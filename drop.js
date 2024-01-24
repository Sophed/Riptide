const mineflayer = require('mineflayer');

// Constants
const args = process.argv.slice(2);

if (args.length != 2) {
    console.log("Usage: node drop.js <username> <region>");
    console.log("Example: node drop.js YourAccount123 eu");
    process.exit(1);
}

const username = args[0];
const region = args[1];
const server = region == "eu" ? "eu.stray.gg" : "stray.gg";
const server_port = 25565;
const plot = "83";

// Bot Config
const bot = mineflayer.createBot({
    host: server,
    port: server_port,
    username: username,
    auth: 'microsoft'
});

bot.once('spawn', () => {
    console.log("Logged in as " + bot.username + "!")
    bot.chat("/server tridentbox");
    setTimeout(() => {
        bot.chat("/p " + plot);
        setTimeout(() => {
            console.log(bot.inventory.items());
            
            for (var i = 0; i < 60; i++) {
                var item = bot.inventory.items().find(item => item.slot == i);
                if (item == null) continue;
                if (item.name == "air") continue;
                bot.tossStack(item);
            }
            process.exit(0);

        }, 1000);
    }, 1000);
});

bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn));
bot.on('error', err => console.log(err));