import url from 'url';
import http from 'http';

import { log } from '../lib/log.js'
import { home } from '../routes/home.js';
import { addCommandView } from '../routes/add-command.js';
import { delCommandView } from '../routes/del-command.js';
import { showCommandView } from '../routes/show-command.js';
import { generateImageView } from '../routes/generate-image.js';
import { showImageView } from '../routes/show-image.js';
import { showVtubers } from '../routes/vtubers.js';
import { closeDatabase, openDatabase } from './db/database.js';

const server = http.createServer(async (req, res) => {
    const path = url.parse(req.url).pathname;

    log('yellow', path)
    const mapPathToMethods = [
        { path: path === '/add-command', method: addCommandView },
        { path: path === '/del-command', method: delCommandView },
        { path: path === '/show-command', method: showCommandView },
        { path: path.startsWith('/generate'), method: generateImageView },
        { path: path === '/vtubers', method: showVtubers },
        { path: path.endsWith('.png'), method: showImageView },
        { path: true, method: home },
    ];

    const handle = mapPathToMethods.find(path => path.path === true).method;
    return await handle(req, res);
});

server.listen(3000, () => {
    openDatabase();
    log('green', 'Server is running on https://localhost:3000');
});

server.on('close', () => {
    closeDatabase();
    log('red', 'Server is no longer running on https://localhost:3000');
});

export default {
    server
}