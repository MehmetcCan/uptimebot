const Discord = require('discord.js')
exports.run = async(client, message, args) => {
  
  
const emoji1 = message.client.emojis.get('<a:mhmtkrmzyldz:769144173743308802> ');
const emoji2 = message.client.emojis.get('<a:mhmtkrmzyldz:769144173743308802> ');
const emoji3 = message.client.emojis.get('<a:mhmtkrmzyldz:769144173743308802> ');
const emoji4 = message.client.emojis.get('<a:mhmtkrmzyldz:769144173743308802> ');
const emoji5 = message.client.emojis.get('<a:mhmtkrmzyldz:769144173743308802> ');
const emoji6 = message.client.emojis.get('<a:mhmtkrmzyldz:769144173743308802> ');
const emoji7 = message.client.emojis.get('<a:mhmtkrmzyldz:769144173743308802> ');
      let isEnabled;
      message.reply(" <a:mhmtnokta:757535303874510850> Canlı Destek Komutunu Kullandığınız İçin Teşekkürler. Birazdan Yetkili Ekibimiz sizinle ilgilenicektir. <a:mhmtnokta:757535303874510850>");
      let mesaj = args.slice(0).join(' ');
      let chan = message.channel;
      let destekKanal = "769635564868861983";
      const embed = new Discord.RichEmbed()
        .addField('Uyarı', `a:mhmtuyar:757535140866949120>   Canlı Destek Çağrısı`)
        .setAuthor(`${message.author.tag} (${message.author.id})`, `${message.author.avatarURL}`)
        .setColor("RANDOM")
        .addField(`Bilgiler`, `**Sunucu**: ${message.guild.name} (${message.guild.id}) \n**Kanal**: ${message.channel.name} (${message.channel.id}) \n**Destek İsteyen**: ${message.author.tag} (${message.author.id}) \n**Destek Mesajı**: ${mesaj}`)
        .setFooter("Canlı Destek")
        .setTimestamp()
      client.channels.get(destekKanal).send({
        embed: embed
      });
    const collector = client.channels.get(destekKanal).createCollector(message => message.content.startsWith(''), {
      time: 0
    })
    client.channels.get(destekKanal).send('<a:mhmtkrmzyldz:769144173743308802>  Destek çagrısı bağlanmak için `katıl` yazınız. İptal Etmek İçin `m!kapat` yazınız.')
    collector.on('message', (message) => {
      if (message.content === 'm!kapat') collector.stop('aborted')
      if (message.content === 'm!katıl') collector.stop('success')
    })
    collector.on('end', (collected, reason) => {
      if (reason === 'time') return message.reply(' Çagrı zaman aşımına uğradı.<a:mhmtolmaz:758594676759855124> ')
      if (reason === 'aborted') {
        message.reply('Çağrı reddedildi.<a:mhmtolmaz:758594676759855124> ')
        client.channels.get(destekKanal).send('<a:saaok:767016334830731314> Başarıyla çağrı reddedildi.')
      }
      if (reason === 'success') {
        client.channels.get(destekKanal).send('<a:saaok:767016334830731314> Destek çagrısı alındı!')
        client.channels.get(destekKanal).send('<a:saaok:767016334830731314> Destek çağrısını kapatmak için `m!kapat` yazınız.')
        chan.send(`${message.author}`)
        chan.send('<a:mhmtrenkiok:757535140867211334> Çağrınız bir destek yetkili tarafından alındı!<a:mhmtrenkliok2:757535169740668988> ')
        chan.send('<a:mhmtrenkiok:757535140867211334> En Yakın Zamanda Size Yardımcı Olacagız.<a:mhmtrenkliok2:757535169740668988> ')
        chan.send('<a:mhmtrenkiok:757535140867211334> Destek çagrısı kapatmak için `m!kapat` yazınız.<a:mhmtrenkliok2:757535169740668988> ')
        isEnabled = true
        client.on('message', message => {
          function contact() {
            if (isEnabled === false) return
            if (message.author.id === client.user.id) return
            if (message.content.startsWith('m!kapat')) {
              message.channel.send('<a:beyazyldz:757535246869725205>  Çağrı Kapatıldı.')
              if (message.channel.id === chan.id) client.channels.get(destekKanal).send('<a:mhmtolmaz:758594676759855124>  Çağrı karşı taraftan kapatıldı.')
              if (message.channel.id === destekKanal) chan.send('<a:mhmtolmaz:758594676759855124>  Çağrı karşı taraftan kapatıldı.')
              return isEnabled = false
            }
            if (message.channel.id === chan.id) client.channels.get(destekKanal).send(`:mhmtbaba:   **${message.author.tag}**: ${message.content}`)
            if (message.channel.id === destekKanal) chan.send(`:mhmtbaba:   **${message.author.tag}**: ${message.content}`)
          }
          contact(client)
        })
      }
    })
}
  exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};
exports.help = {
  name: 'canlıdestek',
  description: 'Canlı Destek Tablebi Oluşturur.',
  usage: 'canlıdestek'
};
