const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
var prefix = ayarlar.prefix;
exports.run = (client, message, args) => {
  
    const juke = new Discord.RichEmbed()
    .setColor('GOLD')
    .setAuthor(`MHMT-BOT | Yetkili Komutları`, client.user.avatarURL) 
.setThumbnail(client.user.avatarURL)
      .addField('**Genel**', '`kick`, `oylama`, `reboot`, `ban`, `banlist`, `duyuru`, `çekiliş`, `fakemesaj`, `uyar`, `sabitle`, `partner`, `botkontrol`,`üyedurum`,`yazıkanalaç`,`tümbanlarıkaldır`,`sustur`,`seskanalaç`,`kanalsil`,`slowmode`')
      .addField('**Gerekli Komutlar**', '`otorol-sistemi`, `sayaç-sistemi`, `sunucu-sistemi`')
      .addField('**Diğer**', '`sunucu-kurulum`, `herkesten-rol-al`, `herkese-rol-ver`,`id`,`botkontrol`')
      .addField('**Sunucu Komutları**', '`ses-kanal-aç`, `roller`, `temizle`, `yaz`, `rol-koruma`, `reklam-engelleme`,`reklamtaraması`,`isimdeğiştir`')
    .setFooter(``, client.user.avatarURL)
    .setTimestamp()
    message.channel.send(juke).catch()

};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: 'yetkili',
      category: 'Yardım',
      description: 'Yardım kategorilerini gösteir.',
};