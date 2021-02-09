const Discord = require('discord.js');


exports.run = async (client, message, params, args) => {

  const yardım = new Discord.RichEmbed()
  .setColor(0x36393E)

  .addField(`MHMT TAGI`,` ☆ \n `)
      
  return message.channel.sendEmbed(yardım);

};



exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['tag', 'ttag', 'tag', 'tagımız', 'mtag', 'tagg', 't', 't', 'tag'],
    permLevel: 0
  };

  exports.help = {
    name: 'tag',
    description: 'tag',
    usage: 'tag'
  };