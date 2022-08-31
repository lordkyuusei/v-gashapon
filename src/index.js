import http from 'http';
import url from 'url';

import discord from './config/gateway.js';
import { addCommandView } from './views/addCommand/addCommand.js';
import { delCommandView } from './views/delCommand/delCommand.js';
import { showCommandView } from './views/showCommand/showCommand.js';
import { home } from './views/home/home.js';

const { getGateway, connectToGateway } = discord;

const response = await getGateway();
connectToGateway(response.url);

const server = http.createServer(async (req, res) => {
    const path = url.parse(req.url).pathname;

    const mapPathToMethods = [
        { path: path === '/add-command', method: addCommandView },
        { path: path === '/del-command', method: delCommandView },
        { path: path === '/show-command', method: showCommandView },
        { path: true, method: home },
    ];

    const handle = mapPathToMethods.find(path => path.path === true).method;
    await handle(req, res);
});

server.listen(3000, () => {
    console.log('listening on http://localhost:3000')
});