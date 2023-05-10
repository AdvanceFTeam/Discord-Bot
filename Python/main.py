import os
import discord
from dotenv import load_dotenv

load_dotenv() # load environment variables from .env file

intents = discord.Intents.default()
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

TOKEN = os.getenv('DISCORD_TOKEN') # get the bot token from environment variables

client.run(TOKEN) # start the bot with the token

