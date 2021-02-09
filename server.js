require("express")().listen(1343); 

const db = require("quick.db");
const discord = require("discord.js"); 
const client = new discord.Client({ disableEveryone: true }); 
client.login("NzYyOTE4MzUzMDc2NDg2MTQ0.X3wJFQ.EWH3WrLdwSceG1i3bqgbkFuoe1s");
const fetch = require("node-fetch");
const fs = require("fs"); 

setInterval(() => {
  var links = db.get("linkler"); 
  if (!links) return;
  var linkA = links.map(c => c.url); 
  linkA.forEach(link => {
    try {
      fetch(link);
    } catch (e) {
      console.log("" + e);
    }
  });
  console.log("Başarıyla Pinglendi."); 
}, 60000);

client.on("ready", () => {
  if (!Array.isArray(db.get("linkler"))) {
    
    db.set("linkler", []);
  } 
});

client.on("ready", () => {
  client.user.setActivity(`up!ekle | DM'den kullan!`); 
  console.log(`Logined`); 
});

client.on("message", message => {
  if (message.author.bot) return;
  var spl = message.content.split(" "); 
  if (spl[0] == "up!ekle") {
    var link = spl[1]; 
    fetch(link)
      .then(() => {
        
        if (
          db
            .get("linkler")
            .map(z => z.url)
            .includes(link)
        )
          return message.channel.send("**⛔ Bu bot zaten uptime ediliyor.**"); 

        let yardım = new Discord.RichEmbed() 
          .setAuthor(client.user.username)
          .setColor(0x6a3db8)
          .setDescription("**✅ Başarılı! Projeniz artık 7/24!**") 
          .setFooter(`© ${client.user.username}`)
          .setTimestamp();
        message.channel.send(yardım).then(msg => msg.delete(60000)); 
        db.push("linkler", { url: link, owner: message.author.id });
      })
      .catch(e => {
        let yardım = new Discord.RichEmbed() 
          .setAuthor(client.user.username)
          .setColor(0x6a3db8)
          .setDescription(
            "⛔ **Hata! Sadece düzgün url'ler ekleyebilirsiniz.**"
          ) 
          .setFooter(`© ${client.user.username}`)
          .setTimestamp();
        return message.channel.send(yardım).then(msg => msg.delete(60000)); 
      }); 
  }
});

client.on("message", message => {
  
  if (message.author.bot) return;
  var spl = message.content.split(" "); 
  if (spl[0] == "up!botsay") {
    
    var link = spl[1];
    message.channel.send(`**${db.get("linkler").length} / 1000**`); 
  }
});

const Discord = require("discord.js");

client.on("message", message => {
  if (message.author.bot) return;
  var spl = message.content.split(" "); 
  if (spl[0] == "up!yardım") {
    let embed = new Discord.RichEmbed() 
      .setColor("#070706")

      .setDescription(
        `**Uptime komudunu kullandıktan sonra sisteme eklenmesi için 3-5 dk bekleyin.**

 🌙 **up!yardım** : Botun yardım menüsünü açar.

 🔋 **up!ekle <link>** : Eklediğiniz proje linkini 7/24 açık yapar.

 ⚡ **up!botsay** : Bot'umuzla uptime olan proje sayısını gösterir.

 🔮 **up!botbilgi** : Bot'un istastistik verilerini gösterir.

`
      )
      .setAuthor(`MHMT Uptime| Yardım Menüsü`, client.user.avatarURL)
      .setFooter(`MHMT Uptime | Bot ismi UptimeBot`) 
      .setImage(
        `https://cdn.glitch.com/c1a5989a-cc29-4d83-a37f-7c6b7c81670a%2Fbcbbf5a7-df06-4089-a1dd-2788f65e8f19.image.png?v=1606824336638`
      );
    return message.channel.send(embed); 
  }
});
const log = message => {
  
  console.log(`${message}`);
};

client.on("message", message => {
  
  if (message.author.bot) return;
  var spl = message.content.split(" "); 
  if (spl[0] == "up!botbilgi") {
    var link = spl[1];
    message.channel.send(`***çok yakında eklenecek!***`); 
  }
});


