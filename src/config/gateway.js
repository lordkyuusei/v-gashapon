import WebSocket from 'ws';

import { get, post } from '../lib/fetch.js';
import { INTERACTION_URL, GATEWAY_URL } from '../lib/constants.js';
import credentials from '../../config.json' assert { type: "json" }


const getGateway = async () => {
    const response = await get(GATEWAY_URL);
    console.log(response)
    return response;
}

const handleInteractionCreate = async (ws, data) => {
    const { type, token, id } = data;
    const url = `${INTERACTION_URL}/${id}/${token}/callback`;

    const response = await post(url, {
        "type": parseInt(type),
        "data": {
            "content": "ouais tkt j'arrive",
        }
    });

    return response;
}

const handleReady = (ws, data) => {
    const { session_id, resume_gateway_url } = data;
    console.log('[ready]', session_id, resume_gateway_url);
}

const handleMessageCreate = (ws, data) => {
    const { content, author } = data;
    console.log(content, author);
}

const handleEvent = async (ws, t, d) => {
    console.log('[event]', t);

    const mapEventToMethods = [
        { event: t === 'READY', method: () => handleReady(ws, d) },
        { event: t === 'MESSAGE_CREATE', method: () => handleMessageCreate(ws, d) },
        { event: t === 'INTERACTION_CREATE', method: async () => await handleInteractionCreate(ws, d) },
        { event: true, method: () => console.log('[unknown]', t) },
    ]

    const handle = mapEventToMethods.find(event => event.event === true).method;
    await handle();
}

const handleHello = (ws, data, s) => {
    const { heartbeat_interval } = data;
    const body = { op: 1, d: s };

    setInterval(() => ws.send(JSON.stringify(body)), heartbeat_interval);

    const identifyBody = {
        op: 2,
        d: {
            'token': credentials.bot_token,
            'properties': {
                'os': 'linux',
                'browser': 'v-gashapon-bot',
                'device': 'v-gashapon-bot',
            },
            'presence': {
                'status': 'online',
                'since': null,
                'afk': false,
                'activities': [{
                    'name': 'se faire coder par @Kyuu le S',
                    'type': '0',
                }]
            },
            intents: 513
        }
    }

    ws.send(JSON.stringify(identifyBody));
}

const handleHeartbeatRequest = (ws, d, s) => {
    const body = { op: 1, d: s };
    ws.send(JSON.stringify(body));
}

const handleHeartbeat = () => {
    console.log('[heartbeat] successfully received from Gateway');
}

const connectToGateway = async (url) => {
    const wsUrl = `${url}/?v=10&encoding=json`;
    console.log(wsUrl);

    const ws = new WebSocket(wsUrl);

    ws.on('open', (response) => {
        console.log(response);
    });

    ws.on('message', async (message) => {
        const response = message.toString();
        const json = JSON.parse(response);
        const { op, t, d, s } = json;

        console.log(op);
        const mapOpToMethods = [
            { op: op === 0, method: async () => await handleEvent(ws, t, d) },
            { op: op === 1, method: () => handleHeartbeatRequest(ws, d, s) },
            { op: op === 10, method: () => handleHello(ws, d, s) },
            { op: op === 11, method: () => handleHeartbeat(d) },
            { op: true, method: () => console.log('[unknown]', response) },
        ]

        const handle = mapOpToMethods.find(op => op.op === true).method;
        await handle();
    })

    ws.on('close', () => {
        console.log('closed');
        ws.close();
    })
}

export default {
    getGateway,
    connectToGateway,
}
