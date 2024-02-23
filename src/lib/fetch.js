import creds from '../../config.json' assert { type: "json" }
import { log } from './log';

const _form = async (url, method, body = null) => {
    const options = {
        method,
        body,
        headers: {
            'Authorization': `Bot ${creds.bot_token}`,
        }
    };

    try {
        const response = await fetch(url, options);
        const json = await response.json();

        log("green", `➡️  ${method} - ${JSON.stringify(body)}`);
        log(response.ok ? "green" : "red", `⬅️  ${response.status} - ${JSON.stringify(json)}`);

        return json;
    } catch (err) {
        console.error(err);
        return null;
    }
}

const _fetch = async (url, method, body = null) => {
    const options = {
        method,
        headers: {
            'Authorization': `Bot ${creds.bot_token}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(url, body ? { ...options, body: JSON.stringify(body) } : options);
        const json = await response.json();

        log("green", `➡️  ${method} - ${JSON.stringify(body)}`);
        log(response.ok ? "green" : "red", `⬅️  ${response.status} - ${JSON.stringify(json)}`);

        return json;

    } catch (err) {
        console.error(err);
        return null;
    }
}

export const get = async (url) => await _fetch(url, 'GET');
export const post = async (url, body) => await _fetch(url, 'POST', body);
export const del = async (url) => await _fetch(url, 'DELETE');
export const patch = async (url, body) => await _fetch(url, 'PATCH', body);

export const postForm = async (url, body) => _form(url, 'POST', body);
export const patchForm = async (url, body) => _form(url, 'PATCH', body);
