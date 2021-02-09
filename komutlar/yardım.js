const Discord = require('discord.js');


exports.run = async (client, message, params, args) => {

  const yardım = new Discord.RichEmbed()
  .setColor(0x36393E)
      .setAuthor(`☆ MĦMŢMÊĦMĔŢCÅÑ ☆`, client.user.avatarURL)
      .setDescription("[Botu sunucuya ekle](https://discord.com/oauth2/authorize?client_id=761320762966540288&scope=bot&permissions=805314622) | [Discord'uma Katılmayı Unutma](https://discord.io/MHMTAILESI/qr) | [Youtube](https://www.youtube.com/c/MHMTMehmetCan/featured?view_as=subscriber)")
      .setThumbnail(client.user.avatarURL)
      .addField(`☆ MĦMŢMÊĦMĔŢCÅÑ ☆ - Yardım`, `:white_small_square: | **m!eğlence**: Eğlenceli Komutlar Gösterir.!\n:white_small_square: | **m!bot**: Botun Coğu Komutlarını Gösterir\n:white_small_square: | **m!yetkili**: Yetkili Komutlarını Gösterir!\n:white_small_square: | **m!kullanıcı**: Kullanıcılar İle Alakalı Komutlar Gösterir\ `)
      .setFooter(`${message.author.username} tarafından istendi.`, message.author.avatarURL)
  return message.channel.sendEmbed(yardım);
    
};



exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['yardım', 'yyardım', 'yardım', 'help', 'myardım', 'help', 'y', 'h', 'yardım'],
    permLevel: 0
  };

  exports.help = {
    name: 'yardım',
    description: 'yardım',
    usage: 'yardım'
  };