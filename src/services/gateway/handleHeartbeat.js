export const handleHeartbeatRequest = (ws, s) => {
    console.log('\x1b[32m%s\x1b[0m', '[heartbeatRequest] successfully received from Gateway');

    const body = { op: 1, d: s };
    ws.send(JSON.stringify(body));
}

export const handleHeartbeat = () => {
    console.log('\x1b[32m%s\x1b[0m', '[heartbeat] successfully received from Gateway');
}