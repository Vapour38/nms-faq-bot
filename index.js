const token = process.env.BOT_TOKEN;
const prefix = process.env.BOT_PREFIX;
const Discord = require("discord.js");
const bot = new Discord.Client({ disableEveryone: true });
const ms = require("ms");
const fs = require("fs");

/* TODO: Separate the bot's replies into json files for easy editing
*  const botResponses = ('./botResponses.json') 
*  const faqTopics = ('./faqTopics.json')
*  ... and so on
*/

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online and protecting ${bot.guilds.size} servers!`);
  // Set bot's status as "Listening to ?help"
  bot.user.setPresence({  status: 'online'});
  bot.user.setActivity('?help', {type:'LISTENING'});
  });

  bot.on("message", async message => {
      if (message.author.bot) return;
      if (message.isMentioned(bot.user)) {
         message.reply("Hello! I am an FAQ Bot, type ?help for more info");
  }

  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  // When the bot is DMed, we need to forward queries with the "?modhelp" tag to a mod
  if (message.channel.type === "dm") {
    if ( cmd.toLowerCase() === `${prefix}modhelp` ) {
      
        // Step 1: Grab the user's message to be forwarded and garnish it with related info
        var userMessage = args.join(" ");
        let botMessageEmbed = new Discord.RichEmbed()
          .setColor('#0099ff')
          .setTitle('Mod Help Wanted!')
          .setDescription('I got a query for you guys to tackle!')
          .addField('Problem', userMessage)
          .addField('User in Distress', message.author.username)
          .setTimestamp()
          .setFooter('Message ID: '+message.id);
        // {
        //   color: 0x0099ff,
        //   title: 'Mod help requested!',
        //   author: {
        //     name: message.author.username,
        //     icon_url: message.author.displayAvatarURL(),
        //   },
        //   description: userMessage 
        // };
        var botMessage = "Heads up! @"
                          + message.author.username + message.author.discriminator
                          +" would like some help with this:\n"
                          +"> "+userMessage;
        console.log(botMessage);

        // Step 2: send it to the faq-bot-dms channel
        const bot_faq_channel = await bot.channels.get('686177386542137369');
        bot_faq_channel.send(botMessageEmbed);

        // Step 3: let the user know their query is received
        message.reply("I've forwarded your query to the mods! I'll send you an answer as soon as they reply to me :)");
          
      
    }   
    else
      message.reply("Hi there, would you like help from a human?" 
                    +" Send me your query with the prefix `"+prefix+"modhelp`,"
                    +" and I'll find a mod to help you out! v16");
  }

  // These are server-wide replies
  if (cmd === `${prefix}test`) {
    return message.channel.send("This is a test. I repeat, this is a test.");
  }

  if (cmd === `${prefix}links`) {
    let links = new Discord.RichEmbed()
      .setDescription("**Links**")
      .setColor("#148AFF")
      .addField("__**Applications**__", "Website: https://nmsassistant.com\nAndroid: https://play.google.com/store/apps/details?id=com.kurtlourens.no_mans_sky_recipes\niOS: https://apps.apple.com/us/app/id1480287625\nWebApp: https://app.nmsassistant.com\nDiscord Bot: Coming Soon")
      .addField("__**Social**__", "Reddit: https://www.reddit.com/r/AssistantforNMS\nTwitter: https://twitter.com/AssistantNMS\nInstagram: https://instagram.com/AssistantNMS\nFacebook: https://facebook.com/AssistantNMS\nSteam Community Page: https://steamcommunity.com/groups/AssistantNMS\nNoMansSky Social: https://nomanssky.social/AssistantNMS");

 return message.channel.send(links);
    }

  if (cmd === `${prefix}support`) {
    let support = new Discord.RichEmbed()
      .setDescription("**Assistant for NMS support links**")
      .setColor("#148AFF")
      .addField("__**Email**__", "You can email our support at support@nmsassistant.com, using the template found in ?supportticket")
      .addField("__**Website**__", "Our support website can be found at https://nmsassistant.freshdesk.com, or use the links in ?freshdesk and ?faq ");

    return message.channel.send(support)
        .then(msg => {
          message.channel.send("We hope to iron our all our major bugs ASAP. Let us know if you have any ideas, we’d love to hear from you!");
        });
  }

  if (cmd === `${prefix}faq`) {
    return message.channel.send("If you can’t find the answers you’re looking for here, try checking out our full FAQ on Freshdesk: https://nmsassistant.freshdesk.com/");
  }

  if (cmd === `${prefix}systemreqs`) {
    let systemreq = new Discord.RichEmbed()
      .setDescription("**System Requirements**")
      .setColor("#148AFF")
      .addField("__**OS REQUIREMENTS**__", "****")
      .addField("__**PHONE REQUIREMENTS**__", " ****")
      .addField("__**CONNECTIVITY**__", "**Working Internet Connection**");

    return message.channel.send(systemreq);
  }

  if (cmd === `${prefix}supportticket`) {
    let supportticket1 = ("To log your support issue and get our team working on it, please copy the format below, fill it in with your bug information, and send it to support@nmsassistant.com to generate a support ticket.");
    let supportticket2 = new Discord.RichEmbed()
      .setDescription("**Template for a Support Ticket**")
      .setColor("#148AFF")
      .addField("__**Description**__", "- OS\n- Phone\n- App Version")
      .addField("__**Actual Behavior**__", "*Example* \n There is a delay scrolling up the list than there is scrolling down")
      .addField("__**Expected Behavior (Optional)**__", "*Example*\nI should be able to scroll back up at the same rate and responsive that I scrolled down the list")
      .addField("__**Attachments**__", "*When applicable, attach the following:*\n- Logs\n- Video\n- Screenshots");

    return message.channel.send(supportticket1)
      .then(msg => {
        message.channel.send(supportticket2);
      });
  }

  if (cmd === `${prefix}help`) {
    let help = new Discord.RichEmbed()
      .setDescription("**List of Commands**")
      .setColor("#148AFF")
      .addField("__**?support**__", "View all of our support details, and the commands associated with them")
      .addField("__**?supportticket**__", "Find out the template to use when sending an email to our support")
      .addField("__**?systemreqs**__", "View what specs you need to use the iOS or Andriod app")
      .addField("__**?links**__", "View a list of all links related to the NMS Assistant")
      .addField("__**?translation**__", "Help with translating the app!")
      .addField("__**?faq**__", "Look for solutions to a problem you might have!")
      .addField("__**?guides**__", "Help create guides for the app!")
      .addField("__**?freshdesk**__", "Check out our support page!");

    return message.channel.send(help)
      .then(msg => {
        message.channel.send("Thank you for using Assistant for NMS!");
      })
  };

  if (cmd === `${prefix}translation`){
    message.channel.send("If you are fluent in a language that isn't already implimented into the app, go to https://nmsassistant.com/tools/translate, or talk to @KhaozTopsy#7865 directly");
  }

  if (cmd === `${prefix}guides`){
    message.channel.send("If you would like to contribute your knowledge of NMS towards the app, head to https://nmsassistant.com/tools/guide and create a guide for us! If approved, this will then be featured in the guides section of the app");
  }

  if (cmd === `${prefix}freshdesk`){
    let freshdeskEmbed = new Discord.RichEmbed()
    .setDescription("**Freshdesk Site**")
    .setColor("#148AFF")
    .addField("For help with bugs, please go to the Assistant for NMS site found here:", "**Click the new support ticket button, or read the knowledge base**\nhttps://nmsassistant.freshdesk.com")

    return message.channel.send(freshdeskEmbed);
      }
});

bot.login(token);
