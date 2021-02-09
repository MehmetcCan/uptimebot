const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const fs = require("fs");
const moment = require("moment");
require("./util/eventLoader")(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

client.on("message", msg => {
  const kzgn = client.emojis.get("512302904141545509");
  const embedlul = new Discord.RichEmbed()
    .setColor(0x00ae86)
    .setDescription(msg.author + " Reklam Yasak Bunu Bilmiyormusun!");

  const embedlulz = new Discord.RichEmbed()
    .setTitle("Sunucunda " + msg.author.tag + " reklam yapıyor!")
    .setColor(0x00ae86)
    .setDescription(
      "m!uyar <kişi> komutu ile onu uyarabilir ya da m!kick <kişi> veya m!ban <kişi> komutlarını kullanarak onu sunucudan uzaklaştırabilirsin!"
    )
    .addField("Kullanıcının mesajı:", "**" + msg.content + "**");

  if (
    msg.content
      .toLowerCase()
      .match(/(discord\.gg\/)|(discordapp\.com\/invite\/) (htpp)/g) &&
    msg.channel.type === "text" &&
    msg.channel
      .permissionsFor(msg.guild.member(client.user))
      .has("MANAGE_MESSAGES")
  ) {
    if (msg.member.hasPermission("BAN_MEMBERS")) {
      return;
    } else {
      msg
        .delete(30)
        .then(deletedMsg => {
          deletedMsg.channel.send(embedlul);
          msg.guild.owner.send(embedlulz).catch(e => {
            console.error(e);
          });
        })
        .catch(e => {
          console.error(e);
        });
    }
  }
});

const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const youtube = new YouTube("AIzaSyCkT_L10rO_NixDHNjoAixUu45TVt0ES-s");
const queue = new Map();

client.on("message", async msg => {
  if (msg.author.bot) return undefined;

  const args = msg.content.split(" ");
  const searchString = args.slice(1).join(" ");
  const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
  const serverQueue = queue.get(msg.guild.id);
  let command = msg.content.toLowerCase().split(" ")[0];

  if (command === "çal") {
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel)
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setColor("RANDOM")
          .setDescription("❎ | Lütfen Seli Bir Kanala Giriş Yapınız!")
      );
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has("CONNECT")) {
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle("❎ | Lütfen Sesli Bir Kanala Giriş Yapınız!")
      );
    }
    if (!permissions.has("SPEAK")) {
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle("❎ | Şarkıyı Çalamıyorum Bu Kanalda Konuşma Yetkim Yok!")
      );
    }

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlaylist(url);
      const videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
        await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
      }
      return msg.channel
        .sendEmbed(new Discord.RichEmbed())
        .setTitle(`✅** | **${playlist.title}** Adlı Şarkı Kuyruğa Eklendi!**`);
    } else {
      try {
        var video = await youtube.getVideo(url);
      } catch (error) {
        try {
          var videos = await youtube.searchVideos(searchString, 10);
          let index = 0;

          msg.channel.sendEmbed(
            new Discord.RichEmbed()
              .setTitle("Şarkı Seçimi")
              .setDescription(
                `${videos
                  .map(video2 => `**${++index} -** ${video2.title}`)
                  .join("\n")}`
              )
              .setFooter(
                "Lütfen 1-10 Arasında Bir Rakam Seçiniz 10 Saniye İçinde Liste İptal Edilecektir!"
              )
              .setFooter("Örnek Kullanım 1")
              .setColor("0x36393E")
          );
          msg.delete(5000);
          try {
            var response = await msg.channel.awaitMessages(
              msg2 => msg2.content > 0 && msg2.content < 11,
              {
                maxMatches: 1,
                time: 10000,
                errors: ["time"]
              }
            );
          } catch (err) {
            console.error(err);
            return msg.channel.sendEmbed(
              new Discord.RichEmbed()
                .setColor("0x36393E")
                .setDescription(
                  "❎ | **10 Saniye İçinde Şarkı Seçmediğiniz İçin seçim İptal Edilmiştir!**."
                )
            );
          }
          const videoIndex = parseInt(response.first().content);
          var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
        } catch (err) {
          console.error(err);
          return msg.channel.sendEmbed(
            new Discord.RichEmbed()
              .setColor("0x36393E")
              .setDescription("❎ | YouTubede Böyle Bir Şarkı Yok !**")
          );
        }
      }
      return handleVideo(video, msg, voiceChannel);
    }
  } else if (command === "gir") {
    return new Promise((resolve, reject) => {
      const voiceChannel = msg.member.voiceChannel;
      if (!voiceChannel || voiceChannel.type !== "voice")
        return msg.reply("Kanalda Kimse Olmadığından Çıkıyorum!");
      voiceChannel
        .join()
        .then(connection => resolve(connection))
        .catch(err => reject(err));
    });
  } else if (command === "geç") {
    if (!msg.member.voiceChannel)
      if (!msg.member.voiceChannel)
        return msg.channel.sendEmbed(
          new Discord.RichEmbed()
            .setColor("RANDOM")
            .setDescription("❎ | Lütfen Seli Bir Kanala Giriş Yapınız!")
        );
    if (!serverQueue)
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle("❎ **Şu An Zaten Şarkı Çalmıyorum!")
      );
    serverQueue.connection.dispatcher.end("**Sıradaki Şarkıya Geçildi!**");
    return undefined;
  } else if (command === "durdur") {
    if (!msg.member.voiceChannel)
      if (!msg.member.voiceChannel)
        return msg.channel.sendEmbed(
          new Discord.RichEmbed()
            .setColor("RANDOM")
            .setDescription("❎ | Lütfen Seli Bir Kanala Giriş Yapınız!")
        );
    if (!serverQueue)
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle("❎ | Şu An Zaten Şarkı Çalmıyorum!")
      );
    msg.channel.send(
      `:stop_button: **${serverQueue.songs[0].title}** Adlı Şarkı Durduruldu`
    );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end("**Şarkı Bitti**");
    return undefined;
  } else if (command === "ses") {
    if (!msg.member.voiceChannel)
      if (!msg.member.voiceChannel)
        return msg.channel.sendEmbed(
          new Discord.RichEmbed()
            .setColor("RANDOM")
            .setDescription("❎ | Lütfen Seli Bir Kanala Giriş Yapınız!")
        );
    if (!serverQueue)
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle("❎ | Çalmayan Müziğin Sesine Bakamam")
      );
    if (!args[1])
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setTitle(
            `:loud_sound: Şuanki Ses Seviyesi: **${serverQueue.volume}**`
          )
          .setColor("RANDOM")
      );
    serverQueue.volume = args[1];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
    return msg.channel.sendEmbed(
      new Discord.RichEmbed()
        .setTitle(`:loud_sound: Ses Seviyesi Ayarlanıyor: **${args[1]}**`)
        .setColor("RANDOM")
    );
  } else if (command === "çalan") {
    if (!serverQueue)
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setTitle("❎ | Şu An Şarkı Çalınmıyor!")
          .setColor("RANDOM")
      );
    return msg.channel.sendEmbed(
      new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle("Çalan")
        .addField(
          "Başlık",
          `[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`,
          true
        )
        .addField(
          "Süre",
          `${serverQueue.songs[0].durationm}:${serverQueue.songs[0].durations}`,
          true
        )
    );
  } else if (command === "sıra") {
    let index = 0;
    if (!serverQueue)
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setTitle("❎ | **Şarkı Kuyruğunda Şarkı Bulunmamakta**")
          .setColor("RANDOM")
      );
    return msg.channel
      .sendEmbed(
        new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle("Şarkı Kuyruğu")
          .setDescription(
            `${serverQueue.songs
              .map(song => `**${++index} -** ${song.title}`)
              .join("\n")}`
          )
      )
      .addField("Şu Anda Çalınan: " + `${serverQueue.songs[0].title}`);
  } else if (command === "?duraklat") {
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause();
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setTitle("**:pause_button: Şarkı Durduruldu!**")
          .setColor("RANDOM")
      );
    }
    return msg.channel.send("❎ | **Şarkı Çalmıyor Şu An**");
  } else if (command === "devam") {
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setTitle("**:arrow_forward: Şarkı Devam Ediyor!**")
          .setColor("RANDOM")
      );
    }
    return msg.channel.sendEmbed(
      new Discord.RichEmbed()
        .setTitle("**❎ | Şu An Şarkı Çalınmıyor!**")
        .setColor("RANDOM")
    );
  }

  return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
  const serverQueue = queue.get(msg.guild.id);
  console.log(video);
  const song = {
    id: video.id,
    title: video.title,
    url: `https://www.youtube.com/watch?v=${video.id}`,
    durationh: video.duration.hours,
    durationm: video.duration.minutes,
    durations: video.duration.seconds,
    views: video.views
  };
  if (!serverQueue) {
    const queueConstruct = {
      textChannel: msg.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };
    queue.set(msg.guild.id, queueConstruct);

    queueConstruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      play(msg.guild, queueConstruct.songs[0]);
    } catch (error) {
      console.error(
        `❎ | **Şarkı Sisteminde Problem Var Hata Nedeni: ${error}**`
      );
      queue.delete(msg.guild.id);
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setTitle(
            `❎ | **Şarkı Sisteminde Problem Var Hata Nedeni: ${error}**`
          )
          .setColor("RANDOM")
      );
    }
  } else {
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    if (playlist) return undefined;
    return msg.channel.sendEmbed(
      new Discord.RichEmbed()
        .setTitle(`✅ | **${song.title}** Adlı Şarkı Kuyruğa Eklendi!`)
        .setColor("RANDOM")
    );
  }
  return undefined;
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  console.log(serverQueue.songs);

  const dispatcher = serverQueue.connection
    .playStream(ytdl(song.url))
    .on("end", reason => {
      if (reason === "❎ | **Yayın Akış Hızı Yeterli Değil.**")
        console.log("Şarkı Bitti.");
      else console.log(reason);
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

  serverQueue.textChannel.sendEmbed(
    new Discord.RichEmbed()
      .setTitle("**🎙 Şarkı Başladı**", `https://i.hizliresim.com/RDm4EZ.png`)
      .setThumbnail(
        `https://i.ytimg.com/vi/${song.id}/default.jpg?width=80&height=60`
      )
      .addField("\nBaşlık", `[${song.title}](${song.url})`, true)
      .addField("\nSes Seviyesi", `${serverQueue.volume}%`, true)
      .addField("Süre", `${song.durationm}:${song.durations}`, true)
      .setColor("RANDOM")
  );
}
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

client.on("message", msg => {
  if (msg.content.toLowerCase() === "sa") {
    if (!msg.guild.member(msg.author).hasPermission("BAN_MEMBERS")) {
      msg.author.sendMessage("**Aleyküm Selam,  Hoş Geldin!**");
    } else {
      msg.reply("**Aleyküm selam, hoş geldin**");
    }
  }
});

client.on("message", msg => {
  if (msg.content.toLowerCase() === "selam") {
    if (!msg.guild.member(msg.author).hasPermission("BAN_MEMBERS")) {
      msg.author.sendMessage("**Aleyküm Selam,  Hoş Geldin!**");
    } else {
      msg.reply("**Aleyküm selam, hoş geldin**");
    }
  }
});

client.on("message", msg => {
  if (msg.content.toLowerCase() === "sea") {
    if (!msg.guild.member(msg.author).hasPermission("BAN_MEMBERS")) {
      msg.author.sendMessage("**Aleyküm Selam,  Hoş Geldin!**");
    } else {
      msg.reply("**Aleyküm selam, hoş geldin**");
    }
  }
});

client.on("message", msg => {
  if (msg.content.toLowerCase() === "selamun aleyküm") {
    if (!msg.guild.member(msg.author).hasPermission("BAN_MEMBERS")) {
      msg.author.sendMessage("**Aleyküm Selam,  Hoş Geldin!**");
    } else {
      msg.reply("**Aleyküm selam, hoş geldin**");
    }
  }
});

////////////////////////

client.on("guildMemberAdd", member => {
  let guild = member.guild;

  const channel = member.guild.channels.find("name", "giriş-çıkış");
  if (!channel) return;
  const embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(member.user.username, member.user.avatarURL)
    .setThumbnail(member.user.avatarURL)
    .setTitle(":inbox_tray: | Sunucuya katıldı!")
    .setTimestamp();
  channel.sendEmbed(embed);
});

client.on("guildMemberRemove", member => {
  const channel = member.guild.channels.find("name", "giriş-çıkış");
  if (!channel) return;
  const embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(member.user.username, member.user.avatarURL)
    .setThumbnail(member.user.avatarURL)
    .setTitle(":outbox_tray: | Sunucudan ayrıldı")
    .setTimestamp();
  channel.sendEmbed(embed);
});

////////////////////////

client.on("message", msg => {
  const uyarıembed = new Discord.RichEmbed()
    .setColor(0x00ae86)
    .setDescription(
      ":crown: " +
        msg.author +
        "Reklam Yapmayı Kes Seni Yetkililere Söyledim :angry: :rage: "
    );

  const dmembed = new Discord.RichEmbed()
    .setTitle("Sunucunda " + msg.author.tag + " reklam yapıyor!")
    .setColor(0x00ae86)
    .setDescription(
      " " +
        msg.author.tag +
        " Sunucunda Reklam Yapıyor m!uyar komutu ile kişiyi uyara bilir m!ban Komutu İle Kişiyi Banlayabilirsin "
    )
    .addField("Kullanıcının mesajı:", "**" + msg.content + "**");

  if (
    msg.content
      .toLowerCase()
      .match(/(discord\.gg\/)|(discordapp\.com\/invite\/)/g) &&
    msg.channel.type === "text" &&
    msg.channel
      .permissionsFor(msg.guild.member(client.user))
      .has("MANAGE_MESSAGES")
  ) {
    if (msg.member.hasPermission("BAN_MEMBERS")) {
      return;
    } else {
      msg
        .delete(30)
        .then(deletedMsg => {
          deletedMsg.channel.send(uyarıembed);
          msg.guild.owner.send(dmembed).catch(e => {
            console.error(e);
          });
        })
        .catch(e => {
          console.error(e);
        });
    }
  }
});

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

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(ayarlar.token);

client.on("message", async message => {
  const ms = require("ms");
  const args = message.content
    .slice(ayarlar.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  let u = message.mentions.users.first() || message.author;
  if (command === "sunucukur-normal") {
    if (
      message.guild.channels.find(channel => channel.name === "Bot Kullanımı")
    )
      return message.channel.send(" Bot Paneli Zaten Ayarlanmış.");
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send(
        " Bu Kodu `Yönetici` Yetkisi Olan Kişi Kullanabilir."
      );
    message.channel.send(
      `Bot Bilgi Kanallarının kurulumu başlatılsın mı? başlatılacak ise **evet** yazınız.`
    );
    message.channel
      .awaitMessages(response => response.content === "evet", {
        max: 1,
        time: 10000,
        errors: ["time"]
      })
      .then(collected => {
        message.guild.createChannel("|▬▬|BİLGİLENDİRME|▬▬|", "category", [
          {
            id: message.guild.id,
            deny: ["SEND_MESSAGES"]
          }
        ]);

        message.guild
          .createChannel("「📃」kurallar", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|BİLGİLENDİRME|▬▬|"
              )
            )
          );
        message.guild
          .createChannel("「📢」duyuru-odası", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|BİLGİLENDİRME|▬▬|"
              )
            )
          );
        message.guild
          .createChannel("「🎥」vi̇deo-duyuru", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|BİLGİLENDİRME|▬▬|"
              )
            )
          );
        message.guild
          .createChannel("「🔗」sınırsız-davet", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|BİLGİLENDİRME|▬▬|"
              )
            )
          );
        message.guild
          .createChannel("「📊」anketler", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|BİLGİLENDİRME|▬▬|"
              )
            )
          );
        message.guild
          .createChannel("「📌」rol-bilgi", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])

          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|BİLGİLENDİRME|▬▬|"
              )
            )
          );
      })
      .then(collected => {
        message.guild.createChannel("|▬▬|GENEL KANALLAR|▬▬|", "category", [
          {
            id: message.guild.id
          }
        ]);

        message.guild
          .createChannel(`「💬」sohbet`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
              )
            )
          );

        message.guild
          .createChannel(`「🤖」bot-komutları`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
              )
            )
          );

        message.guild
          .createChannel(`「📷」görsel-içerik`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
              )
            )
          );

        message.guild
          .createChannel(`「💡」şikayet-ve-öneri`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`「👥」pre-arama-odası`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
              )
            )
          );

        message.guild.createChannel("|▬▬|SES KANALLARI|▬▬|", "category", [
          {
            id: message.guild.id
          }
        ]);

        message.guild
          .createChannel(`「👑」Yönetici`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|SES KANALLARI|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            let role2 = message.guild.roles.find("name", "Yönetici");
            let role3 = message.guild.roles.find("name", "Yönetici");
            c.overwritePermissions(role, {
              CONNECT: false
            });
            c.overwritePermissions(role2, {
              CONNECT: true
            });
            c.overwritePermissions(role3, {
              CONNECT: true
            });
          });
        message.guild
          .createChannel(`「🏆」Kurucu`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|SES KANALLARI|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            let role2 = message.guild.roles.find("name", "Kurucu");

            c.overwritePermissions(role, {
              CONNECT: false
            });
            c.overwritePermissions(role2, {
              CONNECT: true
            });
          });

        message.guild
          .createChannel(`「🌠」Moderatör`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|SES KANALLARI|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            let role2 = message.guild.roles.find("name", "Moderatör");

            c.overwritePermissions(role, {
              CONNECT: false
            });
            c.overwritePermissions(role2, {
              CONNECT: true
            });
          });

        message.guild.createChannel("|▬▬|SOHBET ODALARI|▬▬|", "category", [
          {
            id: message.guild.id
          }
        ]);

        message.guild
          .createChannel(`「💬」Sesli Sohbet 1`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|SOHBET ODALARI|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });
        message.guild
          .createChannel(`「💬」Sesli Sohbet 2`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|SOHBET ODALARI|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });
        message.guild
          .createChannel(`「💬」Sesli Sohbet 3`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|SOHBET ODALARI|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });

        message.guild.createChannel("|▬▬|🎵MÜZİK ODALARI|▬▬|", "category", [
          {
            id: message.guild.id
          }
        ]);

        message.guild
          .createChannel(`「🎶」Müzik Odası 1`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|🎵MÜZİK ODALARI|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });
        message.guild
          .createChannel(`「🎶」Müzik Odası 2`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|🎵MÜZİK ODALARI|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });
        message.guild
          .createChannel(`「🎶」Müzik Odası 3`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|🎵MÜZİK ODALARI|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });

        message.guild.createChannel("|▬▬|🎮OYUN ODALARI|▬▬|", "category", [
          {
            id: message.guild.id
          }
        ]);

        message.guild
          .createChannel(`「🎮」Oyun Sohbet 1`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|🎮OYUN ODALARI|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });
        message.guild
          .createChannel(`「「🎮」Oyun Sohbet 2`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|🎮OYUN ODALARI|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });
        message.guild
          .createChannel(`「🎮」Oyun Sohbet 3`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|🎮OYUN ODALARI|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });
        message.guild.createChannel("|▬▬|💤AFK|▬▬|", "category", [
          {
            id: message.guild.id
          }
        ]);

        message.guild
          .createChannel(`「💤」(A)klım (F)ikrim (K)ızda`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|💤AFK|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });

        message.guild.createRole({
          name: "Kurucu",
          color: "RED",
          permissions: ["ADMINISTRATOR"]
        });

        message.guild.createRole({
          name: "Yönetici",
          color: "BLUE",
          permissions: [
            "MANAGE_GUILD",
            "MANAGE_ROLES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES",
            "KICK_MEMBERS"
          ]
        });

        message.guild.createRole({
          name: "Moderatör",
          color: "GREEN",
          permissions: [
            "MANAGE_GUILD",
            "MANAGE_ROLES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES"
          ]
        });

        message.guild.createRole({
          name: "V.I.P",
          color: "00ffff"
        });

        message.guild.createRole({
          name: "Üye",
          color: "WHITE"
        });

        message.guild.createRole({
          name: "Bot",
          color: "ORANGE"
        });

        message.channel.send("Gerekli Odalar Kuruldu!");
      });
  }
});

client.on("message", async message => {
  const ms = require("ms");
  const args = message.content
    .slice(ayarlar.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  let u = message.mentions.users.first() || message.author;
  if (command === "sunucukur-oyun") {
    if (
      message.guild.channels.find(channel => channel.name === "Bot Kullanımı")
    )
      return message.channel.send(" Bot Paneli Zaten Ayarlanmış.");
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send(
        " Bu Kodu `Yönetici` Yetkisi Olan Kişi Kullanabilir."
      );
    message.channel.send(
      `Bot Bilgi Kanallarının kurulumu başlatılsın mı? başlatılacak ise **evet** yazınız.`
    );
    message.channel
      .awaitMessages(response => response.content === "evet", {
        max: 1,
        time: 10000,
        errors: ["time"]
      })
      .then(collected => {
        message.guild.createChannel("|▬▬|ÖNEMLİ KANALLAR|▬▬|", "category", [
          {
            id: message.guild.id,
            deny: ["SEND_MESSAGES"]
          }
        ]);

        message.guild
          .createChannel("「📃」kurallar", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel("「🚪」gelen-giden", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel("「✅」sayaç", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel("「💾」log-kanalı", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel("「📢」duyuru-odası", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|"
              )
            )
          );
      })
      .then(collected => {
        message.guild.createChannel("|▬▬|GENEL KANALLAR|▬▬|", "category", [
          {
            id: message.guild.id
          }
        ]);

        message.guild
          .createChannel(`「💡」şikayet-ve-öneri`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`「👥」pre-arama-odası`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`「📷」görsel-içerik`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`「🤖」bot-komutları`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`「💬」sohbet`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
              )
            )
          );

        message.guild
          .createChannel(`🏆》Kurucu Odası`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|SES KANALLARI|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            let role2 = message.guild.roles.find("name", "Kurucu");

            c.overwritePermissions(role, {
              CONNECT: false
            });
            c.overwritePermissions(role2, {
              CONNECT: true
            });
          });

        message.guild.createChannel("|▬▬|SES KANALLARI|▬▬|", "category", [
          {
            id: message.guild.id
          }
        ]);

        message.guild
          .createChannel(`🏆》Yönetici Odası`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|SES KANALLARI|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            let role2 = message.guild.roles.find("name", "Kurucu");
            let role3 = message.guild.roles.find("name", "Yönetici");
            c.overwritePermissions(role, {
              CONNECT: false
            });
            c.overwritePermissions(role2, {
              CONNECT: true
            });
            c.overwritePermissions(role3, {
              CONNECT: true
            });
          });

        message.guild
          .createChannel(`💬》Sohbet Odası`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|SES KANALLARI|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });

        message.guild.createChannel("|▬▬|OYUN ODALARI|▬▬|", "category", [
          {
            id: message.guild.id
          }
        ]);

        message.guild
          .createChannel(`🎮》LOL`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》ZULA`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》COUNTER STRİKE`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》PUBG`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》FORTNİTE`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》MİNECRAFT`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》ROBLOX`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》WOLFTEAM`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );

        message.guild.createRole({
          name: "Kurucu",
          color: "RED",
          permissions: ["ADMINISTRATOR"]
        });

        message.guild.createRole({
          name: "Yönetici",
          color: "BLUE",
          permissions: [
            "MANAGE_GUILD",
            "MANAGE_ROLES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES",
            "KICK_MEMBERS"
          ]
        });

        message.guild.createRole({
          name: "Moderatör",
          color: "GREEN",
          permissions: [
            "MANAGE_GUILD",
            "MANAGE_ROLES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES"
          ]
        });

        message.guild.createRole({
          name: "V.I.P",
          color: "00ffff"
        });

        message.guild.createRole({
          name: "Üye",
          color: "WHITE"
        });

        message.guild.createRole({
          name: "Bot",
          color: "ORANGE"
        });

        message.channel.send("Gerekli Odalar Kuruldu!");
      });
  }
});
