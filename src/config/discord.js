import WebSocket from 'ws';
import credentials from '../../config.json' assert { type: "json" }

const endpoints = {
    'base': 'https://discord.com/api/v10',
};

const routes = {
    'gateway_bot': `${endpoints.base}/gateway/bot`,
    'bot_url': `${endpoints.base}/oauth2/authorize?client_id=${credentials.client_id}&permissions=60480&scope=bot%20applications.commands`,
}

const getGateway = async () => {
    const response = await fetch(routes.gateway_bot, {
        method: 'GET',
        headers: {
            'Authorization': `Bot ${credentials.bot_token}`,
        },
    });

    return await response.json();
}

const handleEvent = (ws, t, d) => {
    console.log('[event]', t);
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
            intents: 513
        }
    }

    ws.send(JSON.stringify(identifyBody));
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

    ws.on('message', (message) => {
        const response = message.toString();
        const json = JSON.parse(response);
        const { op, t, d, s } = json;

        console.log(op);
        const mapOpToMethods = [
            { op: op === 0, method: () => handleEvent(ws, t, d) },
            { op: op === 10, method: () => handleHello(ws, d, s) },
            { op: op === 11, method: () => handleHeartbeat(d) },
            { op: true, method: () => console.log('[unknown]', response) },
        ]

        const handle = mapOpToMethods.find(op => op.op === true).method;
        handle();
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
