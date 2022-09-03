import { get } from '../lib/fetch.js';
import { ADD_COMMAND_URL } from '../lib/constants.js';

export const showCommandView = async (route, res) => {
    const commands = await get(ADD_COMMAND_URL);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(commands, null, 4));
    res.end();
}