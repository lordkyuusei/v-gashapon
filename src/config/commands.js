import credentials from '../../config.json' assert { type: "json" }

const endpoints = {
    'base': 'https://discord.com/api/v10',
};

const routes = {
    'add_command': `${endpoints.base}/applications/${credentials.client_id}/commands`,
}

const addCommand = async (name, type, description) => {
    const response = await fetch(routes.add_command, {
        method: 'POST',
        headers: {
            'Authorization': `Bot ${credentials.bot_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            type,
            description,
        }),
    });

    return await response.json();
}

export default addCommand;