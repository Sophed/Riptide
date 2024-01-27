const mineflayer = require('mineflayer');

function dropNext(bot) {
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
}

module.exports = { dropNext };