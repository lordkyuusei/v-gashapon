import url from 'url';

import { del } from '../../lib/fetch.js';
import { ADD_COMMAND_URL } from '../../lib/constants.js';

export const delCommandView = async (req, res) => {
    const query = url.parse(req.url, true).query;
    const { id } = query;

    if (!id) return;

    const output = await del(`${ADD_COMMAND_URL}/${id}`);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(output, null, 4));
    res.end();
}