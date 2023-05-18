import os
import discord
from dotenv import load_dotenv

load_dotenv() # load environment variables from .env file

intents = discord.Intents.default()
intents.message_content = True
intents.members = True

client = discord.Client(intents=intents) # create a new Discord client

@client.event
async def on_ready():
    print(f'{client.user.name} has connected to Discord!')

@client.event
async def on_message(message):
    if message.author == client.user: # ignore messages sent by the bot itself
        return

    if message.content.startswith('!kick'):
        if message.author.guild_permissions.kick_members: # check if the user has the "kick members" permission
            if len(message.mentions) > 0: # check if a user was mentioned in the message
                member = message.mentions[0] # get the first mentioned member
                await member.kick() # kick the member from the server
                await message.channel.send(f'{member.display_name} has been kicked from the server.')
            else:
                await message.channel.send('You must mention a user to kick.')
        else:
            await message.channel.send('You do not have permission to kick members.')

    elif message.content.startswith('!ban'):
        if message.author.guild_permissions.ban_members: # check if the user has the "ban members" permission
            if len(message.mentions) > 0: # check if a user was mentioned in the message
                member = message.mentions[0] # get the first mentioned member
                await member.ban() # ban the member from the server
                await message.channel.send(f'{member.display_name} has been banned from the server.')
            else:
                await message.channel.send('You must mention a user to ban.')
        else:
            await message.channel.send('You do not have permission to ban members.')

    elif message.content.startswith('!mute'):
        if message.author.guild_permissions.manage_roles:
            if len(message.mentions) > 0:
                member = message.mentions[0]
                mute_role = discord.utils.get(message.guild.roles, name='Muted')
                if mute_role is not None:
                    await member.add_roles(mute_role)
                    await message.channel.send(f'{member.display_name} has been muted.')
                else:
                    await message.channel.send('The "Muted" role does not exist. Please create it before using the mute command.')
            else:
                await message.channel.send('You must mention a user to mute.')
        else:
            await message.channel.send('You do not have permission to mute members.')

    elif message.content.startswith('!warn'):
        if message.author.guild_permissions.kick_members:
            if len(message.mentions) > 0:
                member = message.mentions[0]
                # Implement your warning logic here
                await message.channel.send(f'{member.display_name} has been warned.')
            else:
                await message.channel.send('You must mention a user to warn.')
        else:
            await message.channel.send('You do not have permission to warn members.')

    elif message.content.startswith('!purge'):
        if message.author.guild_permissions.manage_messages:
            amount = int(message.content.split()[1]) + 1
            if 0 < amount <= 100:
                deleted = await message.channel.purge(limit=amount)
                await message.channel.send(f'Successfully purged {len(deleted) - 1} messages.')
            else:
                await message.channel.send('Please provide a number between 1 and 100 for the amount of messages to purge.')
        else:
            await message.channel.send('You do not have permission to purge messages.')

    elif message.content.startswith('!ping'):
        await message.channel.send('Pong!')

TOKEN = os.getenv('TOKEN') # Put your token in the .env file so the bot can run better and not have error.

client.run(TOKEN) # start the bot with the token
