import creds from '../../config.json' assert { type: "json" }

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
        if (response.status === 204) return;
        return await response.json();
    } catch (err) {
        console.error(err);
        return null;
    }
}

export const get = async (url) => await _fetch(url, 'GET');
export const post = async (url, body) => await _fetch(url, 'POST', body);
export const del = async (url) => await _fetch(url, 'DELETE');
export const patch = async (url, body) => await _fetch(url, 'PATCH', body);