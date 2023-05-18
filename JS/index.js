const Discord = require('discord.js');
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.DIRECT_MESSAGES
  ]
});
const config = require('./config.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const bannedWords = config.bannedWords;
  const messageContent = message.content.toLowerCase();
  if (bannedWords.some(word => messageContent.includes(word))) {
    await message.delete();
    await message.reply('Your message has been deleted due to inappropriate language.');
    return;
  }

  if (message.content.startsWith(config.prefix)) {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'kick') {
      if (!message.member.permissions.has('KICK_MEMBERS')) {
        await message.reply('You do not have permission to kick members.');
        return;
      }

      const user = message.mentions.users.first();
      if (!user) {
        await message.reply('You must mention a user to kick.');
        return;
      }

      const member = message.guild.members.cache.get(user.id);
      if (!member) {
        await message.reply('That user is not in this guild.');
        return;
      }

      try {
        await member.kick();
        await message.reply(`${user.tag} has been kicked from the server.`);
      } catch (err) {
        console.error(err);
        await message.reply('An error occurred while trying to kick the user.');
      }
    } else if (command === 'ban') {
      if (!message.member.permissions.has('BAN_MEMBERS')) {
        await message.reply('You do not have permission to ban members.');
        return;
      }

      const user = message.mentions.users.first();
      if (!user) {
        await message.reply('You must mention a user to ban.');
        return;
      }

      const member = message.guild.members.cache.get(user.id);
      if (!member) {
        await message.reply('That user is not in this guild.');
        return;
      }

      try {
        await member.ban();
        await message.reply(`${user.tag} has been banned from the server.`);
      } catch (err) {
        console.error(err);
        await message.reply('An error occurred while trying to ban the user.');
      }
    } else if (command === 'mute') {
      if (!message.member.permissions.has('MANAGE_ROLES')) {
        await message.reply('You do not have permission to mute members.');
        return;
      }

      const user = message.mentions.users.first();
      if (!user) {
        await message.reply('You must mention a user to mute.');
        return;
      }

      const member = message.guild.members.cache.get(user.id);
      if (!member) {
        await message.reply('That user is not in this guild.');
        return;
      }

      const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
      if (!muteRole) {
        await message.reply('The "Muted" role does not exist. Please create it before using the mute command.');
        return;
      }

      try {
        await member.roles.add(muteRole);
        await message.reply(`${user.tag} has been muted.`);
      } catch (err) {
        console.error(err);
        await message.reply('An error occurred while trying to mute the user.');
      }
    } else if (command === 'warn') {
      if (!message.member.permissions.has('KICK_MEMBERS')) {
        await message.reply('You do not have permission to warn members.');
        return;
      }

      const user = message.mentions.users.first();
      if (!user) {
        await message.reply('You must mention a user to warn.');
        return;
      }

      const member = message.guild.members.cache.get(user.id);
      if (!member) {
        await message.reply('That user is not in this guild.');
        return;
      }

      try {
        // Implement your warning logic here
        await message.reply(`${user.tag} has been warned.`);
      } catch (err) {
        console.error(err);
        await message.reply('An error occurred while trying to warn the user.');
      }
    } else if (command === 'purge') {
      if (!message.member.permissions.has('MANAGE_MESSAGES')) {
        await message.reply('You do not have permission to purge messages.');
        return;
      }

      const amount = parseInt(args[0]);
      if (isNaN(amount) || amount <= 0 || amount > 100) {
        await message.reply('Please provide a number between 1 and 100 for the amount of messages to purge.');
        return;
      }

      try {
        const messages = await message.channel.messages.fetch({ limit: amount + 1 });
        await message.channel.bulkDelete(messages);
        await message.reply(`Successfully purged ${amount} messages.`);
      } catch (err) {
        console.error(err);
        await message.reply('An error occurred while trying to purge messages.');
      }
    } else if (command === 'ping') {
      const msg = await message.channel.send('Pinging...');
      const ping = msg.createdTimestamp - message.createdTimestamp;
      await msg.edit(`Pong! Latency is ${ping}ms.`);
    }

    // add more commands here as needed
  }
});

client.login(config.token);
