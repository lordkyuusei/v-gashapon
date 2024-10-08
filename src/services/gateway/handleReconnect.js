import { log } from '../../lib/log.js'

export const handleReconnect = (ws, token, { session_id, resume_gateway_url, seq }) => {
    log('yellow', "[event] RECONNECT", resume_gateway_url);
    const body = {
        op: 6,
        d: {
            session_id,
            token,
            seq,
        }
    };

    ws.close();
    ws.connect(`${resume_gateway_url}/?v=10&encoding=json`);
    ws.send(JSON.stringify(body));
}