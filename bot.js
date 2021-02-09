const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});


client.on('message', async message => {
 
  let prefix = await db.fetch(`prefix_${message.guild.id}`) || ayarlar.prefix
 
  let kullanıcı = message.mentions.users.first() || message.author
  let afkdkullanıcı = await db.fetch(`afk_${message.author.id}`)
  let afkkullanıcı = await db.fetch(`afk_${kullanıcı.id}`)
  let sebep = afkkullanıcı
 
  if (message.author.bot) return;
  if (message.content.includes(`${prefix}afk`)) return;
 
  if (message.content.includes(`<@${kullanıcı.id}>`)) {
    if (afkdkullanıcı) {
      message.channel.send(`:x: **${message.author.tag}** adlı kullanıcı artık AFK degil...`)
      db.delete(`afk_${message.author.id}`)
    }
    if (afkkullanıcı) return message.channel.send(`:x: **${kullanıcı.tag}** şu anda AFK.\n Sebep : **${sebep}**`)
  }

  if (!message.content.includes(`<@${kullanıcı.id}>`)) {
    if (afkdkullanıcı) {
      message.channel.send(`:x: **${message.author.tag}** adlı kullanıcı artık AFK değil.`)
      db.delete(`afk_${message.author.id}`)
    }
  }
  }
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.on('guildBanAdd' , (guild, user) => {
  let aramızakatılanlar = guild.channels.find('name', 'aramıza-katılanlar');
  if (!aramızakatılanlar) return;
  aramızakatılanlar.send('https://media.giphy.com/media/8njotXALXXNrW/giphy.gif **Adalet dağıtma zamanı gelmiş!** '+ user.username +'**Bakıyorum da suç işlemiş,Yargı dağıtmaya devam** :fist: :writing_hand:  :spy:' );

});

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};


client.on('message', msg => {
  if (msg.content.toLowerCase() === 'sa') {
      msg.reply('AleykümSelam , Hoşgeldin!  Nasılsın ?  ');
  }
  if (msg.content.toLowerCase() === 'merhaba') {
    msg.reply('merhabaa :heart:');
  }
  if (msg.content.toLowerCase() === 'hey bot') {
    msg.reply('buyrun ;  İsteğinizi alayım');
  }
  if (msg.content.toLowerCase() === 'selam') {
    msg.reply('Aleykümselam, hoşgeldin nasılsın?');
  }
  if (msg.content.toLowerCase() === 'merhabalar') {
    msg.reply('Sanada Merrrrhabalar');
  }
  if (msg.content.toLowerCase() === 'mal') {
    msg.reply('Lütfen daha az argo kelime kullanalım.');
  }
  if (msg.content.toLowerCase() === 'gerizekalı') {
    msg.reply('Lütfen daha az argo kelime kullanalım.');
  }
  if (msg.content.toLowerCase() === 'aptal') {
    msg.reply('Lütfen daha az argo kelime kullanalım.');
  }
  if (msg.content.toLowerCase() === 'öküz') {
    msg.reply('Lütfen daha az argo kelime kullanalım.');
  }
  if (msg.content === 'ping') {
    msg.reply('Pong! ping ');
  }
  if (msg.content.toLowerCase() === prefix + 'youtube' ) {
    msg.reply('Bot yapımcısı youtube kanalı - HusooTV')
  }
  if (msg.content.toLowerCase() === prefix + 'bot davet' ) {
    msg.reply('https://discordapp.com/oauth2/authorize?client_id=606930624519077908&scope=bot&permissions=2087971903')
  }
  if (msg.content.toLowerCase() === prefix + 'iletişim' ) {
    msg.reply('Gmail - htanriverdi147@gmail.com')
  }

});



client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);



client.on("message", async msg => {
    if(msg.author.bot) return;
    if(msg.channel.type === "dm") return;
        
    let i = await db.fetch(`reklamFiltre_${msg.guild.id}`) 
          if (i == 'acik') {
              const ****** = ["discord.app", "discord.gg", "invite","discordapp","discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az",];
              if (******.some(word => msg.content.toLowerCase().includes(word))) {
                try {
                  if (!msg.member.hasPermission("MANAGE_GUILD")) {
                    msg.delete();                   
                    let embed = new Discord.RichEmbed()
                    .setColor(0xffa300)
                    .setFooter('$adis BOT  -|-  ****** engellendi.', client.user.avatarURL)
                    .setAuthor(msg.guild.owner.user.username, msg.guild.owner.user.avatarURL)
                    .setDescription("$adis BOT ****** sistemi, " + `***${msg.guild.name}***` + " adlı sunucunuzda ****** yakaladım.")
                    .addField('Reklamı yapan kişi', 'Kullanıcı: '+ msg.author.tag +'\nID: '+ msg.author.id, true)
                    .addField('Engellenen mesaj', msg.content, true)
                    .setTimestamp()                   
                    msg.guild.owner.user.send(embed)                       
                    return msg.channel.send(`${msg.author.tag}, ****** Yapmak Yasak Lanet Zenci!`).then(msg => msg.delete(25000));
                  }             
                } catch(err) {
                  console.log(err);
                }
              }
          }
          if (!i) return;
  });



client.on('roleDelete', async function(role) {
  const fetch = await role.guild.fetchAuditLogs({type: "ROLE_DELETE"}).then(log => log.entries.first())
  let yapan = fetch.executor;
  let rol = role.name;
  let renk = role.color;
  let ayrı = role.hoist;
  let sıra = role.position;
  let yetkiler = role.permissions;
  let etiketlenebilir = role.mentionable;
  role.guild.createRole({
    name:rol,
    color:renk,
    hoist:ayrı,
    position:sıra,
    permissions:yetkiler,
    mentionable:etiketlenebilir
  })
  let uyarı = new Discord.RichEmbed()
    .setTitle("Rol Silindi")
    .setColor("RANDOM")
    .setDescription(`\`${role.guild.name}\` adlı sunucunuzda ${rol} adına sahip rol, ${yapan} adlı kişi tarafından silindi. Ben rolü tekradan oluşturdum!`)
  role.guild.owner.send(uyarı)
});

client.on('channelDelete', (channel) => {
    if(db.has(`kanalk_${channel.guild.id}`) === false) return;
    let kategoriID = channel.parentID;
    channel.clone(channel.name).then(channels => {
    let ganal = channel.guild.channels.find("name", channel.name)
    channels.setParent(channel.guild.channels.find(channelss => channelss.id === kategoriID));
    channels.send(`Bu kanal silindi ve kanal koruma sistemi sayesinde başarıyla tekrardan açıldı!\nKanalın adı, kanalın konusu, kanalın kategorisi, kanalın izinleri başarıyla ayarlandı.`);                     
  });
});
//---Bu Kod botun ana dosyasına atılacaktır.
//###CodeMareFi tarafından hazırlanmıştır - - - Ekleyen //###Sadista

const yourID = "715593127691288676";  //Kendi İD'nizi Yazın
const setupCMD = "kayıtol" //İstediğiniz Komut Yapabilirsiniz örn : !kayıtol
let initialMessage = `deneme`; //Dilediğiniz Şeyi Yazabilirsiniz
const roles = ["@üye", ""]; //İstediğiniz Rolü Yazabilirsiniz
const reactions = [":mhmtonaylad:", ""]; //İstediğiniz Emojiyi Ekleyebilirsiniz
const botToken = "NzYyMzE5MjMwMjgzODA4Nzcw.X3nbGw.suXpWGSCm8v3S6geFBggCsXI7-s";  //Buraya botunuzun tokenini koyunuz
                     
//Load up the bot...
const discord = require('discord.js');
const bot = new Discord.Client();
//If there isn't a reaction for every role, scold the user!
if (roles.length !== reactions.length) throw "Roles list and reactions list are not the same length!";
//Function to generate the role messages, based on your settings
function generateMessages(){
    var messages = [];
    messages.push(initialMessage);
    for (let role of roles) messages.push(`Kayıt Olmak İçin **"${role}"** Emojisine Tıkla!`); //DONT CHANGE THIS
    return messages;
}
bot.on("message", message => {
    if (message.author.id == yourID && message.content.toLowerCase() == setupCMD){
        var toSend = generateMessages();
        for (let mapObj of mappedArray){
            message.channel.send(mapObj[0]).then( sent => {
                if (mapObj[1]){
                  sent.react(mapObj[1]);  
                } 
            });
        }
    }
})
bot.on('raw', event => {
    if (event.t === 'MESSAGE_REACTION_ADD' || event.t == "MESSAGE_REACTION_REMOVE"){
        
        let channel = bot.channels.get(event.d.channel_id);
        let message = channel.fetchMessage(event.d.message_id).then(msg=> {
        let user = msg.guild.members.get(event.d.user_id);
        
        if (msg.author.id == bot.user.id && msg.content != initialMessage){
       
            var re = `\\*\\*"(.+)?(?="\\*\\*)`;
            var role = msg.content.match(re)[1];
        
            if (user.id != bot.user.id){
                var roleObj = msg.guild.roles.find(r => r.name === role);
                var memberObj = msg.guild.members.get(user.id);
                
                if (event.t === "MESSAGE_REACTION_ADD"){
                    memberObj.addRole(roleObj)
                } else {
                    memberObj.removeRole(roleObj);
                }
            }
        }
        })
 
    }   
});

const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const moment = require("moment");
var Jimp = require("jimp");
const { Client, Util } = require("discord.js");
const weather = require("weather-js");
const fs = require("fs");
const db = require("quick.db");
const http = require("http");
const express = require("express");
require("./util/eventLoader")(client);
const path = require("path");
const request = require("request");
const snekfetch = require("snekfetch");
const queue = new Map();
const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");

const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping tamamdır.");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(ayarlar.token);
