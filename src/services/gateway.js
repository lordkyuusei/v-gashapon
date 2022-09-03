import WebSocket from 'ws';

import { get, post } from '../lib/fetch.js';
import { GATEWAY_URL } from '../lib/constants.js';
import creds from '../../config.json' assert { type: "json" }

import { handleEvent } from './gateway/handleEvent.js';
import { handleHello } from './gateway/handleHello.js';
import { handleReconnect } from './gateway/handleReconnect.js';
import { handleHeartbeat, handleHeartbeatRequest } from './gateway/handleHeartbeat.js';

const getGateway = async () => await get(GATEWAY_URL);

const handleMessage = (message, ws) => {
    const response = message.toString();
    const json = JSON.parse(response);
    const { op, t, d, s } = json;

    const mapOpToMethods = [
        { op: op === 0, method: async () => await handleEvent(ws, t, d) },
        { op: op === 1, method: () => handleHeartbeatRequest(ws, s) },
        { op: op === 7, method: () => handleReconnect(ws, creds.bot_token) },
        { op: op === 10, method: () => handleHello(ws, d, s, creds.bot_token) },
        { op: op === 11, method: () => handleHeartbeat() },
        { op: true, method: () => console.log('[unknown]', response) },
    ]

    const handle = mapOpToMethods.find(op => op.op === true).method;
    return handle();
}

const handleOpen = (url) => console.log('\x1b[31m%s\x1b[0m', `[open] connected to ${url}`);

const handleClose = (url, ws) => {
    console.log('\x1b[31m%s\x1b[0m', `[close] disconnected from ${url}`);
    ws.close();
}

const connectToGateway = async (url) => {
    const wsUrl = `${url}/?v=10&encoding=json`;
    const ws = new WebSocket(wsUrl);

    ws.on('open', () => handleOpen(wsUrl));
    ws.on('close', () => handleClose(wsUrl, ws));
    ws.on('message', (message) => handleMessage(message, ws));
}

export default {
    getGateway,
    connectToGateway,
}
