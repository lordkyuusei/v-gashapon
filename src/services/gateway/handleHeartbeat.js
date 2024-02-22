import { log } from '../../lib/log.js'

export const handleHeartbeatRequest = (ws, s) => {
    log('green', "[event] HEARTBEAT_REQUEST successfully received",);

    const body = { op: 1, d: s };
    ws.send(JSON.stringify(body));
}

export const handleHeartbeat = () => {
    log('green', "[event] HEARTBEAT successfully received",);
}