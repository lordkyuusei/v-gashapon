import url from 'url';
import http from 'http';

import { home } from '../routes/home.js';
import { addCommandView } from '../routes/add-command.js';
import { delCommandView } from '../routes/del-command.js';
import { showCommandView } from '../routes/show-command.js';
import { closeDatabase, openDatabase } from './db/database.js';

const server = http.createServer(async (req, res) => {
    const path = url.parse(req.url).pathname;

    const mapPathToMethods = [
        { path: path === '/add-command', method: addCommandView },
        { path: path === '/del-command', method: delCommandView },
        { path: path === '/show-command', method: showCommandView },
        { path: true, method: home },
    ];

    const handle = mapPathToMethods.find(path => path.path === true).method;
    return handle(req, res);
});

server.listen(3000, () => {
    openDatabase();
    console.log('\x1b[31m%s\x1b[0m', 'listening on http://localhost:3000')
});

server.on('close', () => {
    closeDatabase();
    console.log('\x1b[31m%s\x1b[0m', 'stopped listening from http://localhost:3000')
});

export default {
    server
}