import { post } from "../lib/fetch.js";
import { ADD_COMMAND_URL } from "../lib/constants.js";

export const addCommandView = (req, res) => {
    let body = {};

    req.on('data', data => {
        body = JSON.parse(data.toString());
    })

    req.on('end', async () => {
        const response = await post(ADD_COMMAND_URL, body);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(response, null, 4));
        res.end();
    })
}