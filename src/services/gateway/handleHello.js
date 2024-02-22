import { log } from '../../lib/log.js'

export const handleHello = (ws, data, s, token) => {
    const { heartbeat_interval } = data;
    const body = { op: 1, d: s };

    log('yellow', "[event] HELLO successfully received");
    setInterval(() => ws.send(JSON.stringify(body)), heartbeat_interval);

    const identifyBody = {
        op: 2,
        d: {
            'token': token,
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