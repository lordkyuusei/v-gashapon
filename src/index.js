import discord from './config/gateway.js';
import addCommand from './config/commands.js';

const { getGateway, connectToGateway } = discord;

const response = await getGateway();
connectToGateway(response.url);

addCommand('gasha', 1, 'gasha');