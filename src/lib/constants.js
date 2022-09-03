import creds from '../../config.json' assert { type: "json" }

export const BASE_URL = 'https://discord.com/api/v10';
export const GATEWAY_URL = `${BASE_URL}/gateway/bot`
export const MESSAGE_URL = `${BASE_URL}/channels/`
export const INTERACTION_URL = `${BASE_URL}/interactions/`
export const WEBHOOK_URL = `${BASE_URL}/webhooks/${creds.client_id}/`

export const ADD_BOT_URL = `${BASE_URL}/oauth2/authorize?client_id=${creds.client_id}&permissions=60480&scope=bot%20applications.commands`;
export const ADD_COMMAND_URL = `${BASE_URL}/applications/${creds.client_id}/commands`;

export const DATABASE_URL = './src/services/db/v-gashapon';

export const HOUR_IN_MS = 3600000;