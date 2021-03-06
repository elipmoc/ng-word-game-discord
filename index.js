require('dotenv').config();

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const MENTION_REPLY_MSG_LIST = process.env.MENTION_REPLY_MSG_LIST.split(',');

const Discord = require('discord.js');
const client = new Discord.Client();
let main_channel;
let ng_words = {};
let max_ng_word_num = 0;
let dm_channels = {};

const http = require('http');
http.createServer(function (_, response) {
    response.end('Discord bot is active now.');
}).listen(3000);

const shuffle = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const flatten = ([...array]) => {
    const buff = [];
    array.forEach(array2 => array2.forEach(x => buff.push(x)));
    return buff;
}

const getMentionReplyMsg = () => {
    const index = Math.floor(Math.random() * MENTION_REPLY_MSG_LIST.length)
    return MENTION_REPLY_MSG_LIST[index];
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
    const [command, ...args] = msg.content.split(' ');
    if (msg.mentions.users.some(user => user.id === client.user.id)) {
        msg.reply(getMentionReplyMsg());
        return;
    }

    switch (command) {
        case 'ng_end':
            const str2 = Object.entries(ng_words).reduce((acc, [username, words]) => acc += `${username}：${words.reduce((acc, word) => acc += '\n' + word, '')}\n\n`, '');
            main_channel.send("ゲーム終了！\n各プレイヤーが登録したNGワード：\n" + str2);
            ng_words = {};
            ng_words_result = {};
            break;

        case 'ng_send':
            if (ng_words[msg.author.username].length === max_ng_word_num) {
                msg.reply(`お前NGワード送りすぎ！！`);
                return;
            }

            dm_channels[msg.author.username] = msg.channel;
            ng_words[msg.author.username].push(args[0]);
            msg.reply(`${msg.author.username}さんのNGワード"${args[0]}"を保存しました`);
            if (Object.values(ng_words).every(words => words.length === max_ng_word_num)) {
                while (true) {
                    const shuffled_ng_words = shuffle(flatten(Object.values(ng_words)));
                    const isSame = Object.keys(ng_words).some((key, index) => ng_words[key].some(word => word === shuffled_ng_words[index]));
                    if (isSame === false) {
                        const ng_words_result = {};
                        Object.keys(ng_words).forEach((key, index) => ng_words_result[key] = shuffled_ng_words[index]);
                        Object.keys(ng_words_result).forEach(username => {
                            const str =
                                Object.entries(ng_words_result)
                                    .filter(([username2, _]) => username2 != username)
                                    .reduce((acc, [username2, word]) => acc += `${username2}：${word}\n`, '')
                            dm_channels[username].send("他の人のNGワードです：\n" + str);
                        });
                        break;
                    }
                }
                main_channel.send("ngワードゲームを開始します");
            }
            break;

        // デバッグ機能だよ
        // case 'ng_show':
        //     const str = Object.entries(ng_words).reduce((acc, [name, words]) => acc += name + '：' + words + '\n', '');
        //     msg.channel.send("ngワード一覧：\n" + str);
        //     break;

        case 'ng_start':
            main_channel = msg.channel;
            ng_words = {};
            max_ng_word_num = Number(args[0]);
            const str = msg.mentions.users.reduce((acc, x) => acc += x.username + '\n', '');
            msg.mentions.users.forEach(user => {
                ng_words[user.username] = [];
            });
            if (max_ng_word_num !== max_ng_word_num) {
                msg.channel.send('お前NaNやぞ！');
            } else {
                msg.channel.send(`設定NGワード数：${max_ng_word_num}\n参加者：\n` + str);
            }
            break;
    }
});

client.login(TOKEN);