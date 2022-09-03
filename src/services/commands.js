import { ADD_COMMAND_URL } from '../lib/constants.js';
import { post } from '../lib/fetch.js';

export const addCommand = async (name, type, description) => {
    const response = await post(ADD_COMMAND_URL, JSON.stringify({
        name,
        type,
        description,
    }));

    return response;
}

export const getCommands = async () => {
    const response = await get(ADD_COMMAND_URL);

    return response;
}