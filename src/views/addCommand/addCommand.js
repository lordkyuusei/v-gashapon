import { post } from "../../lib/fetch.js";
import { ADD_COMMAND_URL } from "../../lib/constants.js";

export const addCommandView = (req, res) => {
    let response = {};

    req.on('data', async data => {
        const body = JSON.parse(data.toString());
        response = await post(ADD_COMMAND_URL, body);
    })

    req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(response, null, 4));
        res.end();
    })
}