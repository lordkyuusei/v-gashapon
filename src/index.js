import discord from './config/discord.js';

const { getGateway, connectToGateway } = discord;

const response = await getGateway();
connectToGateway(response.url);