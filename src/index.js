import discord from './config/gateway.js';
import { addCommand, getCommands } from './config/commands.js';

const { getGateway, connectToGateway } = discord;

const response = await getGateway();
connectToGateway(response.url);

const commands = await getCommands();
console.log(commands);